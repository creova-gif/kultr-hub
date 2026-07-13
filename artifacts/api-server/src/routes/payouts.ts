import { Router } from "express";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { db, eventsTable, ticketsTable, payoutsTable } from "@workspace/db";
import { requireAuth, requireAdmin, type AuthedRequest } from "../middleware/auth.js";
import { notify } from "../lib/notify.js";
import { validateUuidParam } from "../middleware/validateUuidParam.js";
import type { Request, Response } from "express";

/**
 * Creator payout REQUESTS — not a payment rail. See lib/db/src/schema/payouts.ts
 * for why: there is no real money-movement integration yet. What's real is the
 * balance calculation (actual confirmed ticket revenue minus what's already been
 * requested), computed fresh from the tickets table on every call, never trusted
 * from the client.
 */

const router = Router();
router.param("id", validateUuidParam);

class InsufficientBalanceError extends Error {}

// `db` and a transaction's `tx` aren't nominally assignable to each other
// (each has methods the other lacks), but both support the plain
// select/insert/update builder methods computeBalances actually calls —
// a union covers both call sites without depending on either side's extras.
type DbOrTx = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

async function computeBalances(creatorId: string, dbOrTx: DbOrTx = db) {
  const revenueByCurrency = await dbOrTx
    .select({
      currency: ticketsTable.currency,
      revenue: sql<number>`coalesce(sum(${ticketsTable.totalAmount}), 0)`,
    })
    .from(ticketsTable)
    .innerJoin(eventsTable, eq(ticketsTable.eventId, eventsTable.id))
    .where(and(eq(eventsTable.creatorId, creatorId), eq(ticketsTable.status, "confirmed")))
    .groupBy(ticketsTable.currency);

  // "pending" and "paid" are both already spoken for — pending so it can't be
  // double-requested while awaiting manual execution, paid because it's gone.
  const requestedByCurrency = await dbOrTx
    .select({
      currency: payoutsTable.currency,
      requested: sql<number>`coalesce(sum(${payoutsTable.amount}), 0)`,
    })
    .from(payoutsTable)
    .where(and(eq(payoutsTable.creatorId, creatorId), inArray(payoutsTable.status, ["pending", "paid"])))
    .groupBy(payoutsTable.currency);

  const requestedMap = new Map(requestedByCurrency.map((r) => [r.currency, Number(r.requested)]));

  return revenueByCurrency.map((r) => {
    const revenue = Number(r.revenue);
    const requested = requestedMap.get(r.currency) ?? 0;
    return { currency: r.currency, revenue, requested, available: revenue - requested };
  });
}

router.get("/balance", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const balances = await computeBalances(authed.userId);
  res.json({ balances });
});

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const payouts = await db
    .select()
    .from(payoutsTable)
    .where(eq(payoutsTable.creatorId, authed.userId))
    .orderBy(desc(payoutsTable.requestedAt));

  res.json({
    payouts: payouts.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      destination: p.destination,
      requestedAt: p.requestedAt.toISOString(),
      resolvedAt: p.resolvedAt?.toISOString() ?? null,
    })),
  });
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const { amount, currency, destination } = req.body as {
    amount?: number;
    currency?: string;
    destination?: string;
  };

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({ message: "amount must be a positive number" });
    return;
  }
  if (!currency || typeof currency !== "string") {
    res.status(400).json({ message: "currency is required" });
    return;
  }
  if (!destination || typeof destination !== "string" || !destination.trim()) {
    res.status(400).json({ message: "destination is required" });
    return;
  }

  // Balance isn't a running counter column — it's an aggregate recomputed
  // from confirmed tickets and existing requests every time (never trusted
  // from the client). Two concurrent requests could otherwise both read the
  // same "available" balance before either insert commits and both pass the
  // check, together exceeding it. An advisory lock keyed on the creator
  // serializes their own concurrent requests without taking a table-wide
  // lock or requiring a schema change to a real balance column.
  let payout: typeof payoutsTable.$inferSelect;
  try {
    payout = await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${authed.userId}))`);

      const balances = await computeBalances(authed.userId, tx);
      const balance = balances.find((b) => b.currency === currency);
      const available = balance?.available ?? 0;

      if (amount > available) {
        throw new InsufficientBalanceError(
          `Requested amount exceeds available balance of ${available} ${currency}.`,
        );
      }

      const [inserted] = await tx
        .insert(payoutsTable)
        .values({
          creatorId: authed.userId,
          amount: String(amount),
          currency,
          destination: destination.trim(),
          status: "pending",
        })
        .returning();

      return inserted;
    });
  } catch (err) {
    if (err instanceof InsufficientBalanceError) {
      res.status(400).json({ message: err.message });
      return;
    }
    throw err;
  }

  res.status(201).json({
    id: payout.id,
    amount: Number(payout.amount),
    currency: payout.currency,
    status: payout.status,
    destination: payout.destination,
    requestedAt: payout.requestedAt.toISOString(),
    resolvedAt: null,
  });
});

/** Admin-only: every pending payout request, oldest first — a manual work queue. */
router.get("/admin/pending", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const payouts = await db
    .select()
    .from(payoutsTable)
    .where(eq(payoutsTable.status, "pending"))
    .orderBy(payoutsTable.requestedAt);

  res.json({
    payouts: payouts.map((p) => ({
      id: p.id,
      creatorId: p.creatorId,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      destination: p.destination,
      requestedAt: p.requestedAt.toISOString(),
    })),
  });
});

const RESOLUTION_STATUSES = ["paid", "failed", "cancelled"] as const;

/**
 * Admin-only: record that a payout was executed (or couldn't be) through
 * whatever manual channel was actually used. This does not move money —
 * it records that money was already moved elsewhere.
 */
router.patch("/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { status, resolutionNote } = req.body as { status?: string; resolutionNote?: string };

  if (!status || !RESOLUTION_STATUSES.includes(status as (typeof RESOLUTION_STATUSES)[number])) {
    res.status(400).json({ message: `status must be one of: ${RESOLUTION_STATUSES.join(", ")}` });
    return;
  }

  // Atomic compare-and-swap: the WHERE clause itself encodes "still pending,"
  // so two concurrent resolutions (two admins, or a double-click) can't both
  // succeed — only the first UPDATE actually matches a row. This replaces a
  // separate read-then-write that had a real gap between the status check
  // and the write, exactly the shape of race already fixed in lib/issue.ts.
  const [updated] = await db
    .update(payoutsTable)
    .set({ status: status as (typeof RESOLUTION_STATUSES)[number], resolutionNote, resolvedAt: new Date() })
    .where(and(eq(payoutsTable.id, id), eq(payoutsTable.status, "pending")))
    .returning();

  if (!updated) {
    const [existing] = await db.select().from(payoutsTable).where(eq(payoutsTable.id, id)).limit(1);
    if (!existing) { res.status(404).json({ message: "Payout not found" }); return; }
    res.status(409).json({ message: "This payout has already been resolved." });
    return;
  }

  // Additive-only, best-effort: let the creator know their payout moved.
  // Never allowed to fail the resolution itself.
  try {
    const body =
      updated.status === "paid"
        ? `Your payout of ${updated.currency} ${Number(updated.amount).toLocaleString()} has been sent.`
        : updated.status === "failed"
          ? `Your payout of ${updated.currency} ${Number(updated.amount).toLocaleString()} could not be completed. Please check your destination details and request again.`
          : `Your payout request of ${updated.currency} ${Number(updated.amount).toLocaleString()} was cancelled.`;
    await notify({
      userId: updated.creatorId,
      type: "payout_resolved",
      title: updated.status === "paid" ? "Payout sent" : updated.status === "failed" ? "Payout failed" : "Payout cancelled",
      body,
      data: { payoutId: updated.id, status: updated.status },
    });
  } catch (err) {
    console.error("Failed to write payout resolution notification", err);
  }

  res.json({ id: updated.id, status: updated.status, resolutionNote: updated.resolutionNote });
});

export default router;
