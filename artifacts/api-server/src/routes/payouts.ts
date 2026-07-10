import { Router } from "express";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { db, eventsTable, ticketsTable, payoutsTable } from "@workspace/db";
import { requireAuth, requireAdmin, type AuthedRequest } from "../middleware/auth.js";
import type { Request, Response } from "express";

/**
 * Creator payout REQUESTS — not a payment rail. See lib/db/src/schema/payouts.ts
 * for why: there is no real money-movement integration yet. What's real is the
 * balance calculation (actual confirmed ticket revenue minus what's already been
 * requested), computed fresh from the tickets table on every call, never trusted
 * from the client.
 */

const router = Router();

async function computeBalances(creatorId: string) {
  const revenueByCurrency = await db
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
  const requestedByCurrency = await db
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

  // Never trust a client-supplied balance — recompute it here, same as every
  // other money check in this codebase.
  const balances = await computeBalances(authed.userId);
  const balance = balances.find((b) => b.currency === currency);
  const available = balance?.available ?? 0;

  if (amount > available) {
    res.status(400).json({ message: `Requested amount exceeds available balance of ${available} ${currency}.` });
    return;
  }

  const [payout] = await db
    .insert(payoutsTable)
    .values({
      creatorId: authed.userId,
      amount: String(amount),
      currency,
      destination: destination.trim(),
      status: "pending",
    })
    .returning();

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

  const [payout] = await db.select().from(payoutsTable).where(eq(payoutsTable.id, id)).limit(1);
  if (!payout) { res.status(404).json({ message: "Payout not found" }); return; }
  if (payout.status !== "pending") {
    res.status(409).json({ message: "This payout has already been resolved." });
    return;
  }

  const [updated] = await db
    .update(payoutsTable)
    .set({ status: status as (typeof RESOLUTION_STATUSES)[number], resolutionNote, resolvedAt: new Date() })
    .where(eq(payoutsTable.id, id))
    .returning();

  res.json({ id: updated.id, status: updated.status, resolutionNote: updated.resolutionNote });
});

export default router;
