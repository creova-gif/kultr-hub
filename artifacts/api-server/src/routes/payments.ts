import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, ticketsTable, ticketTypesTable, eventsTable, usersTable } from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { initializePayment, verifyPayment } from "../lib/paystack.js";
import type { Request, Response } from "express";

const router = Router();

function toCurrencyKobo(amount: number, currency: string): number {
  // Paystack accepts amounts in the smallest currency unit
  // NGN, GHS, KES, ZAR, USD are all 100 subunits
  return Math.round(amount * 100);
}

function generateTicketNumber(): string {
  return `KTR-${nanoid(8).toUpperCase()}`;
}

function generatePaymentRef(): string {
  return `kultr_${nanoid(16)}`;
}

/**
 * POST /api/payments/init
 * Initialize a Paystack transaction. Returns an authorization URL to redirect
 * the user to, plus a reference to track the payment.
 */
router.post("/init", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const { eventId, ticketTypeId, quantity = 1 } = req.body as {
    eventId: string;
    ticketTypeId: string;
    quantity?: number;
  };

  if (!eventId || !ticketTypeId) {
    res.status(400).json({ message: "eventId and ticketTypeId are required" });
    return;
  }

  const [[user], [event], [ticketType]] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, authed.userId)).limit(1),
    db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1),
    db.select().from(ticketTypesTable).where(eq(ticketTypesTable.id, ticketTypeId)).limit(1),
  ]);

  if (!event) { res.status(404).json({ message: "Event not found" }); return; }
  if (!ticketType) { res.status(404).json({ message: "Ticket type not found" }); return; }

  const available = ticketType.totalQuantity - ticketType.soldQuantity;
  if (available < quantity) {
    res.status(400).json({ message: `Only ${available} ticket(s) remaining` });
    return;
  }

  const unitPrice = Number(ticketType.price);
  const totalAmount = unitPrice * quantity;
  const reference = generatePaymentRef();

  const callbackUrl =
    process.env.PAYSTACK_CALLBACK_URL ??
    `${process.env.API_BASE_URL ?? "http://localhost:3001"}/api/payments/callback?ref=${reference}`;

  const paystack = await initializePayment({
    email: user.email,
    amountKobo: toCurrencyKobo(totalAmount, ticketType.currency),
    currency: ticketType.currency,
    reference,
    callbackUrl,
    metadata: {
      userId: authed.userId,
      eventId,
      ticketTypeId,
      quantity,
      eventTitle: event.title,
      ticketTypeName: ticketType.name,
    },
  });

  if (!paystack) {
    // Paystack key not configured — simulate payment for dev/demo
    res.json({
      reference,
      authorizationUrl: null,
      simulated: true,
      totalAmount,
      currency: ticketType.currency,
    });
    return;
  }

  res.json({
    reference: paystack.reference,
    authorizationUrl: paystack.authorizationUrl,
    simulated: false,
    totalAmount,
    currency: ticketType.currency,
  });
});

/**
 * POST /api/payments/verify
 * Called after payment. Verifies with Paystack, then creates the ticket.
 */
router.post("/verify", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const { reference, simulated, eventId, ticketTypeId, quantity = 1 } = req.body as {
    reference: string;
    simulated?: boolean;
    eventId: string;
    ticketTypeId: string;
    quantity?: number;
  };

  if (!reference || !eventId || !ticketTypeId) {
    res.status(400).json({ message: "reference, eventId and ticketTypeId are required" });
    return;
  }

  const [ticketType] = await db.select().from(ticketTypesTable)
    .where(eq(ticketTypesTable.id, ticketTypeId)).limit(1);

  if (!ticketType) { res.status(404).json({ message: "Ticket type not found" }); return; }

  // For dev/demo: skip Paystack verification when simulated
  let verified = simulated === true;
  if (!verified) {
    const result = await verifyPayment(reference);
    verified = result?.success === true;
  }

  if (!verified) {
    res.status(402).json({ message: "Payment could not be verified" });
    return;
  }

  const available = ticketType.totalQuantity - ticketType.soldQuantity;
  if (available < quantity) {
    res.status(400).json({ message: `Only ${available} ticket(s) remaining` });
    return;
  }

  const unitPrice = Number(ticketType.price);
  const totalAmount = unitPrice * quantity;

  const [ticket] = await db.transaction(async (tx) => {
    await tx.update(ticketTypesTable)
      .set({ soldQuantity: sql`${ticketTypesTable.soldQuantity} + ${quantity}` })
      .where(eq(ticketTypesTable.id, ticketTypeId));

    return tx.insert(ticketsTable).values({
      ticketNumber: generateTicketNumber(),
      userId: authed.userId,
      eventId,
      ticketTypeId,
      quantity,
      unitPrice: String(unitPrice),
      totalAmount: String(totalAmount),
      currency: ticketType.currency,
      status: "confirmed",
      paymentReference: reference,
      paymentProvider: simulated ? "simulated" : "paystack",
    }).returning();
  });

  res.status(201).json({
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    status: ticket.status,
    totalAmount,
    currency: ticketType.currency,
  });
});

/**
 * GET /api/payments/callback
 * Paystack redirects here after payment. Verifies and issues ticket, then
 * redirects the user to the deep link / app callback URL.
 */
router.get("/callback", async (req: Request, res: Response) => {
  const ref = String(req.query.reference ?? req.query.ref ?? "");
  if (!ref) { res.status(400).send("Missing reference"); return; }

  const result = await verifyPayment(ref);
  const appCallback = process.env.APP_CALLBACK_URL ?? "kultr://payment";

  if (!result?.success) {
    res.redirect(`${appCallback}?status=failed&ref=${ref}`);
    return;
  }

  const { metadata } = result;
  const { userId, eventId, ticketTypeId, quantity } = metadata as {
    userId: string;
    eventId: string;
    ticketTypeId: string;
    quantity: number;
  };

  const [ticketType] = await db.select().from(ticketTypesTable)
    .where(eq(ticketTypesTable.id, ticketTypeId)).limit(1);

  if (!ticketType) { res.redirect(`${appCallback}?status=failed&ref=${ref}`); return; }

  const available = ticketType.totalQuantity - ticketType.soldQuantity;
  if (available < quantity) {
    res.redirect(`${appCallback}?status=sold_out&ref=${ref}`);
    return;
  }

  const unitPrice = Number(ticketType.price);
  const totalAmount = unitPrice * quantity;

  const [ticket] = await db.transaction(async (tx) => {
    await tx.update(ticketTypesTable)
      .set({ soldQuantity: sql`${ticketTypesTable.soldQuantity} + ${quantity}` })
      .where(eq(ticketTypesTable.id, ticketTypeId));

    return tx.insert(ticketsTable).values({
      ticketNumber: generateTicketNumber(),
      userId,
      eventId,
      ticketTypeId,
      quantity,
      unitPrice: String(unitPrice),
      totalAmount: String(totalAmount),
      currency: ticketType.currency,
      status: "confirmed",
      paymentReference: ref,
      paymentProvider: "paystack",
    }).returning();
  });

  res.redirect(`${appCallback}?status=success&ticketId=${ticket.id}&ref=${ref}`);
});

export default router;
