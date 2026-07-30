import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, ticketsTable, ticketTypesTable, eventsTable } from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { issueTicket, validateQuantity, TicketIssueError } from "../lib/issue.js";
import { validateUuidParam } from "../middleware/validateUuidParam.js";
import {
  encryptSpecialCategoryData,
  decryptSpecialCategoryData,
  isSpecialCategoryEncryptionConfigured,
} from "../lib/specialCategoryEncryption.js";
import type { Request, Response } from "express";

const router = Router();
router.param("id", validateUuidParam);

const MAX_ACCESSIBILITY_INFO_LENGTH = 500;

/** Decrypts, or returns null on failure (e.g. an encryption key rotation
 *  made an older value undecryptable) rather than crashing the whole
 *  response the value is embedded in. */
function tryDecryptAccessibilityInfo(ciphertext: string | null): string | null {
  if (!ciphertext) return null;
  try {
    return decryptSpecialCategoryData(ciphertext);
  } catch {
    return null;
  }
}

async function buildTicketDetail(ticket: typeof ticketsTable.$inferSelect) {
  const [ticketType] = await db.select().from(ticketTypesTable).where(eq(ticketTypesTable.id, ticket.ticketTypeId)).limit(1);
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, ticket.eventId)).limit(1);
  const eventTicketTypes = await db.select().from(ticketTypesTable).where(eq(ticketTypesTable.eventId, ticket.eventId));

  const prices = eventTicketTypes.map((t) => Number(t.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    eventId: ticket.eventId,
    ticketTypeId: ticket.ticketTypeId,
    ticketTypeName: ticketType?.name ?? "",
    quantity: ticket.quantity,
    unitPrice: Number(ticket.unitPrice),
    totalAmount: Number(ticket.totalAmount),
    currency: ticket.currency,
    status: ticket.status,
    purchasedAt: ticket.purchasedAt,
    // Decrypted here because this is always the ticket owner viewing their
    // own submission (GET /tickets, GET /tickets/:id are both scoped to
    // authed.userId) — never exposed to anyone else this way.
    accessibilityInfo: tryDecryptAccessibilityInfo(ticket.accessibilityInfo),
    accessibilityConsentAt: ticket.accessibilityConsentAt,
    event: {
      id: event.id,
      title: event.title,
      subtitle: event.subtitle,
      category: event.category,
      venue: event.venue,
      city: event.city,
      country: event.country,
      countryCode: event.countryCode,
      eventDate: event.eventDate,
      imageUrl: event.imageUrl,
      imageKey: event.imageKey,
      featured: event.featured,
      tags: event.tags,
      minPrice,
      currency: eventTicketTypes[0]?.currency ?? ticket.currency,
      status: event.status,
    },
  };
}

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const tickets = await db.select().from(ticketsTable)
    .where(eq(ticketsTable.userId, authed.userId))
    .orderBy(desc(ticketsTable.purchasedAt));

  const details = await Promise.all(tickets.map(buildTicketDetail));
  res.json({ tickets: details, total: details.length });
});

/**
 * POST /api/tickets — reserve a FREE ticket (RSVP).
 *
 * This endpoint issues confirmed tickets with no payment step, so it is strictly
 * limited to genuinely free (price 0) ticket types. Any paid tier MUST go through
 * the payments flow (/api/payments/*), which only issues after a verified charge.
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const { eventId, ticketTypeId } = req.body as {
    eventId: string;
    ticketTypeId: string;
  };

  if (!eventId || !ticketTypeId) {
    res.status(400).json({ message: "eventId and ticketTypeId are required" });
    return;
  }

  let quantity: number;
  try {
    quantity = validateQuantity((req.body as { quantity?: unknown }).quantity ?? 1);
  } catch (err) {
    res.status(400).json({ message: err instanceof TicketIssueError ? err.message : "Invalid quantity" });
    return;
  }

  const [ticketType] = await db.select().from(ticketTypesTable)
    .where(eq(ticketTypesTable.id, ticketTypeId)).limit(1);

  if (!ticketType) {
    res.status(404).json({ message: "Ticket type not found" });
    return;
  }

  const unitPrice = Number(ticketType.price);
  if (unitPrice > 0) {
    res.status(402).json({
      message: "This ticket type requires payment. Use the checkout flow to purchase.",
    });
    return;
  }

  try {
    const { ticket } = await issueTicket({
      userId: authed.userId,
      eventId,
      ticketTypeId,
      quantity,
      unitPrice,
      currency: ticketType.currency,
      paymentReference: `free_${nanoid(16)}`,
      paymentProvider: "free",
    });
    const detail = await buildTicketDetail(ticket);
    res.status(201).json(detail);
  } catch (err) {
    if (err instanceof TicketIssueError) {
      res.status(400).json({ message: err.message });
      return;
    }
    throw err;
  }
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const id = String(req.params.id);

  const [ticket] = await db.select().from(ticketsTable)
    .where(eq(ticketsTable.id, id)).limit(1);

  if (!ticket || ticket.userId !== authed.userId) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }

  const detail = await buildTicketDetail(ticket);
  res.json(detail);
});

/**
 * PATCH /api/tickets/:id/accessibility-info
 * Explicit, standalone opt-in for dietary/accessibility needs — POPIA §26
 * special-category data. Deliberately never bundled into ticket purchase:
 * the buyer submits, edits, or withdraws (info: null) this at any time,
 * independent of payment, and it's encrypted before it ever touches the
 * database (see lib/specialCategoryEncryption.ts).
 */
router.patch("/:id/accessibility-info", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const id = String(req.params.id);
  const { info } = req.body as { info?: string | null };

  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id)).limit(1);
  if (!ticket || ticket.userId !== authed.userId) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }

  if (info === undefined) {
    res.status(400).json({ message: "info is required — a string, or null to withdraw a previous submission" });
    return;
  }

  // Withdrawing: null or an emptied-out field both clear the stored value entirely.
  if (info === null || info === "") {
    await db.update(ticketsTable)
      .set({ accessibilityInfo: null, accessibilityConsentAt: null })
      .where(eq(ticketsTable.id, id));
    res.json({ accessibilityInfo: null, accessibilityConsentAt: null });
    return;
  }

  if (typeof info !== "string" || info.length > MAX_ACCESSIBILITY_INFO_LENGTH) {
    res.status(400).json({ message: `info must be a string of at most ${MAX_ACCESSIBILITY_INFO_LENGTH} characters` });
    return;
  }

  if (!isSpecialCategoryEncryptionConfigured()) {
    res.status(503).json({ message: "Accessibility/dietary info submission isn't available right now. Please try again later." });
    return;
  }

  const now = new Date();
  await db.update(ticketsTable)
    .set({ accessibilityInfo: encryptSpecialCategoryData(info), accessibilityConsentAt: now })
    .where(eq(ticketsTable.id, id));

  res.json({ accessibilityInfo: info, accessibilityConsentAt: now });
});

export default router;
