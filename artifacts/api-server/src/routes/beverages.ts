import { Router } from "express";
import { and, eq, desc } from "drizzle-orm";
import {
  db,
  beverageProductsTable,
  eventBeverageBundlesTable,
  beverageVouchersTable,
  voucherRedemptionLogsTable,
  eventsTable,
  usersTable,
} from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { redeemBeverageVoucher } from "../lib/issue-voucher.js";
import { validateUuidParam } from "../middleware/validateUuidParam.js";
import type { Request, Response } from "express";

const router = Router();
router.param("eventId", validateUuidParam);
router.param("id", validateUuidParam);

/**
 * GET /api/beverages
 * List all active Kultr Canned Drink products in the catalog.
 */
router.get("/", async (_req: Request, res: Response) => {
  const products = await db
    .select()
    .from(beverageProductsTable)
    .where(eq(beverageProductsTable.isActive, true))
    .orderBy(beverageProductsTable.name);

  res.json({ products, total: products.length });
});

/**
 * GET /api/beverages/events/:eventId/bundles
 * List available drink bundles for a specific event.
 */
router.get("/events/:eventId/bundles", async (req: Request, res: Response) => {
  const eventId = String(req.params.eventId);

  const bundles = await db
    .select({
      id: eventBeverageBundlesTable.id,
      eventId: eventBeverageBundlesTable.eventId,
      title: eventBeverageBundlesTable.title,
      quantityUnits: eventBeverageBundlesTable.quantityUnits,
      bundlePrice: eventBeverageBundlesTable.bundlePrice,
      currency: eventBeverageBundlesTable.currency,
      allocatedInventory: eventBeverageBundlesTable.allocatedInventory,
      claimedInventory: eventBeverageBundlesTable.claimedInventory,
      product: {
        id: beverageProductsTable.id,
        name: beverageProductsTable.name,
        flavor: beverageProductsTable.flavor,
        sku: beverageProductsTable.sku,
        volumeMl: beverageProductsTable.volumeMl,
        description: beverageProductsTable.description,
        imageUrl: beverageProductsTable.imageUrl,
      },
    })
    .from(eventBeverageBundlesTable)
    .innerJoin(
      beverageProductsTable,
      eq(eventBeverageBundlesTable.beverageProductId, beverageProductsTable.id),
    )
    .where(
      and(
        eq(eventBeverageBundlesTable.eventId, eventId),
        eq(eventBeverageBundlesTable.isActive, true),
      ),
    );

  res.json({ bundles, total: bundles.length });
});

/**
 * POST /api/beverages/events/:eventId/bundles
 * Creator/Organizer adds a drink bundle allocation to their event.
 */
router.post("/events/:eventId/bundles", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const eventId = String(req.params.eventId);
  const { beverageProductId, title, quantityUnits = 4, bundlePrice, allocatedInventory } = req.body;

  // Verify creator ownership or admin
  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, eventId))
    .limit(1);

  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, authed.userId))
    .limit(1);

  if (event.creatorId !== authed.userId && !user?.isAdmin) {
    res.status(403).json({ message: "Forbidden: You are not the creator of this event" });
    return;
  }

  let resolvedProductId = beverageProductId;
  if (!resolvedProductId) {
    const [defaultProd] = await db
      .select()
      .from(beverageProductsTable)
      .where(eq(beverageProductsTable.isActive, true))
      .limit(1);
    resolvedProductId = defaultProd?.id;
  }

  if (!resolvedProductId || !title || !bundlePrice || !allocatedInventory) {
    res.status(400).json({ message: "Missing required bundle parameters" });
    return;
  }

  const [bundle] = await db
    .insert(eventBeverageBundlesTable)
    .values({
      eventId,
      beverageProductId: resolvedProductId,
      title,
      quantityUnits: Number(quantityUnits),
      bundlePrice: String(bundlePrice),
      currency: event.countryCode === "KE" ? "KES" : "USD",
      allocatedInventory: Number(allocatedInventory),
    })
    .returning();

  res.status(201).json(bundle);
});

/**
 * GET /api/beverages/my-vouchers
 * List beverage vouchers owned by the authenticated attendee.
 */
router.get("/my-vouchers", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;

  const vouchers = await db
    .select({
      id: beverageVouchersTable.id,
      voucherCode: beverageVouchersTable.voucherCode,
      eventId: beverageVouchersTable.eventId,
      totalUnits: beverageVouchersTable.totalUnits,
      redeemedUnits: beverageVouchersTable.redeemedUnits,
      status: beverageVouchersTable.status,
      signatureHash: beverageVouchersTable.signatureHash,
      createdAt: beverageVouchersTable.createdAt,
      expiresAt: beverageVouchersTable.expiresAt,
      eventTitle: eventsTable.title,
      eventDate: eventsTable.eventDate,
      venue: eventsTable.venue,
    })
    .from(beverageVouchersTable)
    .innerJoin(eventsTable, eq(beverageVouchersTable.eventId, eventsTable.id))
    .where(eq(beverageVouchersTable.userId, authed.userId))
    .orderBy(desc(beverageVouchersTable.createdAt));

  res.json({ vouchers, total: vouchers.length });
});

/**
 * POST /api/beverages/redeem
 * Bartender / Bar Station scans a customer's Drink Pass QR code to redeem units.
 */
router.post("/redeem", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const { voucherCode, stationIdentifier = "MAIN_BAR", units = 1, idempotencyKey } = req.body;

  if (!voucherCode) {
    res.status(400).json({ message: "voucherCode is required" });
    return;
  }

  const resolvedIdempotencyKey =
    idempotencyKey ?? `${voucherCode}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const result = await redeemBeverageVoucher({
      voucherCode,
      scannedByUserId: authed.userId,
      stationIdentifier,
      unitsToRedeem: Number(units),
      idempotencyKey: resolvedIdempotencyKey,
    });

    res.json({
      success: true,
      voucherCode: result.voucher.voucherCode,
      remainingUnits: result.voucher.totalUnits - result.voucher.redeemedUnits,
      totalUnits: result.voucher.totalUnits,
      redeemedUnits: result.voucher.redeemedUnits,
      status: result.voucher.status,
      alreadyRedeemed: result.alreadyRedeemed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Redemption failed";
    res.status(400).json({ message });
  }
});

export default router;
