import { pgTable, text, timestamp, uuid, numeric, pgEnum, index, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./users";

/**
 * Creator payout requests.
 *
 * This is a REQUEST QUEUE, not a payment rail — no real money movement
 * happens here. There is no automated integration with Paystack Transfers,
 * M-Pesa B2C, or MTN MoMo Disbursements yet (all three require a verified
 * business account and real provider credentials this codebase does not
 * have). Until that integration exists, an admin marks a payout "paid"
 * manually after sending the money through an out-of-band channel (bank
 * transfer, mobile money sent directly) — see PATCH /payouts/:id in
 * routes/payouts.ts. What IS real here: the requested amount is checked
 * against the creator's actual available balance (confirmed ticket revenue
 * minus already-requested payouts), computed from the real tickets table.
 */
export const payoutStatusEnum = pgEnum("payout_status", ["pending", "paid", "failed", "cancelled"]);

export const payoutsTable = pgTable(
  "payouts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull(),
    status: payoutStatusEnum("status").notNull().default("pending"),
    // Free-text destination the creator supplied (phone number, bank
    // account reference) — sent to whoever executes the manual transfer.
    // Not validated or stored as structured payment credentials.
    destination: text("destination").notNull(),
    // Set by an admin when marking paid/failed; an external reference (bank
    // transaction id, M-Pesa confirmation code) for the audit trail.
    resolutionNote: text("resolution_note"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("payouts_creator_id_idx").on(table.creatorId),
    check("payouts_amount_positive", sql`${table.amount} > 0`),
  ],
);

export type Payout = typeof payoutsTable.$inferSelect;
