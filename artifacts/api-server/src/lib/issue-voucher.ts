import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import crypto from "crypto";
import {
  db,
  beverageVouchersTable,
  eventBeverageBundlesTable,
  voucherRedemptionLogsTable,
} from "@workspace/db";
import { notify } from "./notify.js";

export class VoucherIssueError extends Error {
  constructor(
    public readonly code: "sold_out" | "invalid_quantity" | "bundle_inactive",
    message: string,
  ) {
    super(message);
    this.name = "VoucherIssueError";
  }
}

function generateVoucherCode(): string {
  return `KTR-BAR-${nanoid(8).toUpperCase()}`;
}

function generateSignatureHash(voucherCode: string, userId: string, totalUnits: number): string {
  const secret = process.env.JWT_SECRET ?? "kultr-dev-secret-key-change-in-prod";
  return crypto
    .createHmac("sha256", secret)
    .update(`${voucherCode}:${userId}:${totalUnits}`)
    .digest("hex");
}

export interface IssueVoucherParams {
  userId: string;
  eventId: string;
  bundleId: string;
  paymentReference: string;
}

export interface IssueVoucherResult {
  voucher: typeof beverageVouchersTable.$inferSelect;
  deduped: boolean;
}

/**
 * Atomically issue a beverage voucher for a verified payment reference.
 * Guaranteed idempotent via UNIQUE(payment_reference) on beverage_vouchers.
 */
export async function issueBeverageVoucher(
  params: IssueVoucherParams,
): Promise<IssueVoucherResult> {
  const result = await db.transaction(async (tx) => {
    // 1. Fetch bundle and check inventory
    const [bundle] = await tx
      .select()
      .from(eventBeverageBundlesTable)
      .where(
        and(
          eq(eventBeverageBundlesTable.id, params.bundleId),
          eq(eventBeverageBundlesTable.eventId, params.eventId),
        ),
      )
      .limit(1);

    if (!bundle || !bundle.isActive) {
      throw new VoucherIssueError("bundle_inactive", "Beverage bundle is not available");
    }

    const available = bundle.allocatedInventory - bundle.claimedInventory;
    if (available < 1) {
      throw new VoucherIssueError("sold_out", "Beverage bundle is sold out");
    }

    const voucherCode = generateVoucherCode();
    const signatureHash = generateSignatureHash(
      voucherCode,
      params.userId,
      bundle.quantityUnits,
    );

    // Set expiration 48 hours after event date (or 3 days from now)
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const [inserted] = await tx
      .insert(beverageVouchersTable)
      .values({
        voucherCode,
        userId: params.userId,
        eventId: params.eventId,
        bundleId: params.bundleId,
        totalUnits: bundle.quantityUnits,
        redeemedUnits: 0,
        status: "active",
        signatureHash,
        paymentReference: params.paymentReference,
        expiresAt,
      })
      .onConflictDoNothing({ target: beverageVouchersTable.paymentReference })
      .returning();

    // Idempotency: reference already consumed
    if (!inserted) {
      const [existing] = await tx
        .select()
        .from(beverageVouchersTable)
        .where(eq(beverageVouchersTable.paymentReference, params.paymentReference))
        .limit(1);
      return { voucher: existing, deduped: true };
    }

    // Atomic inventory claim
    const updated = await tx
      .update(eventBeverageBundlesTable)
      .set({
        claimedInventory: sql`${eventBeverageBundlesTable.claimedInventory} + 1`,
      })
      .where(
        and(
          eq(eventBeverageBundlesTable.id, params.bundleId),
          sql`${eventBeverageBundlesTable.claimedInventory} + 1 <= ${eventBeverageBundlesTable.allocatedInventory}`,
        ),
      )
      .returning();

    if (!updated.length) {
      throw new VoucherIssueError("sold_out", "Beverage bundle sold out during checkout");
    }

    return { voucher: inserted, deduped: false };
  });

  if (!result.deduped) {
    notify({
      userId: params.userId,
      type: "ticket_confirmed",
      title: "🍹 Your Kultr Drink Pass is Ready!",
      body: `You received ${result.voucher.totalUnits} drinks for your event. Head to My Bar Pass to redeem at the bar.`,
      data: { voucherId: result.voucher.id, voucherCode: result.voucher.voucherCode },
    }).catch((err) => console.error("Failed to deliver beverage voucher notification:", err));
  }

  return result;
}

export interface RedeemVoucherParams {
  voucherCode: string;
  scannedByUserId: string;
  stationIdentifier: string;
  unitsToRedeem?: number;
  idempotencyKey: string;
}

/**
 * Atomically redeem units from a beverage voucher with row-level locking.
 */
export async function redeemBeverageVoucher(params: RedeemVoucherParams) {
  const units = params.unitsToRedeem ?? 1;

  return await db.transaction(async (tx) => {
    // Check idempotency first
    const [existingLog] = await tx
      .select()
      .from(voucherRedemptionLogsTable)
      .where(eq(voucherRedemptionLogsTable.idempotencyKey, params.idempotencyKey))
      .limit(1);

    if (existingLog) {
      const [voucher] = await tx
        .select()
        .from(beverageVouchersTable)
        .where(eq(beverageVouchersTable.id, existingLog.voucherId))
        .limit(1);
      return { voucher, log: existingLog, alreadyRedeemed: true };
    }

    // Lock the voucher row with FOR UPDATE
    const [voucher] = await tx
      .select()
      .from(beverageVouchersTable)
      .where(eq(beverageVouchersTable.voucherCode, params.voucherCode))
      .for("update")
      .limit(1);

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    if (voucher.status !== "active") {
      throw new Error(`Voucher is ${voucher.status}`);
    }

    if (new Date() > new Date(voucher.expiresAt)) {
      throw new Error("Voucher has expired");
    }

    const remainingUnits = voucher.totalUnits - voucher.redeemedUnits;
    if (remainingUnits < units) {
      throw new Error(
        `Insufficient units remaining on voucher. Requested: ${units}, Available: ${remainingUnits}`,
      );
    }

    const nextRedeemed = voucher.redeemedUnits + units;
    const nextStatus = nextRedeemed >= voucher.totalUnits ? "exhausted" : "active";

    // Update voucher
    const [updatedVoucher] = await tx
      .update(beverageVouchersTable)
      .set({
        redeemedUnits: nextRedeemed,
        status: nextStatus,
      })
      .where(eq(beverageVouchersTable.id, voucher.id))
      .returning();

    // Log the redemption
    const [log] = await tx
      .insert(voucherRedemptionLogsTable)
      .values({
        voucherId: voucher.id,
        redeemedUnits: units,
        scannedByUserId: params.scannedByUserId,
        stationIdentifier: params.stationIdentifier,
        idempotencyKey: params.idempotencyKey,
        deviceTimestamp: new Date(),
      })
      .returning();

    return { voucher: updatedVoucher, log, alreadyRedeemed: false };
  });
}
