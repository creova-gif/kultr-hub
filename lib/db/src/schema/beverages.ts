import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  numeric,
  boolean,
  pgEnum,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { eventsTable } from "./events";
import { pendingPaymentsTable } from "./payments";

export const voucherStatusEnum = pgEnum("voucher_status", [
  "active",
  "exhausted",
  "cancelled",
  "refunded",
]);

/**
 * Master catalog of Kultr Canned Drink SKUs and flavors.
 */
export const beverageProductsTable = pgTable(
  "beverage_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    flavor: text("flavor").notNull(),
    sku: text("sku").notNull().unique(),
    volumeMl: integer("volume_ml").notNull().default(330),
    description: text("description").notNull(),
    imageUrl: text("image_url"),
    basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("KES"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("beverage_products_is_active_idx").on(table.isActive),
    check("beverage_base_price_non_negative", sql`${table.basePrice} >= 0`),
    check("beverage_volume_positive", sql`${table.volumeMl} > 0`),
  ],
);

/**
 * Event-specific beverage bundle allocations and pricing.
 * Allows organizers to offer discounted multi-packs (e.g. 4-pack express bundle).
 */
export const eventBeverageBundlesTable = pgTable(
  "event_beverage_bundles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    beverageProductId: uuid("beverage_product_id")
      .notNull()
      .references(() => beverageProductsTable.id),
    title: text("title").notNull(),
    quantityUnits: integer("quantity_units").notNull().default(4),
    bundlePrice: numeric("bundle_price", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("KES"),
    allocatedInventory: integer("allocated_inventory").notNull(),
    claimedInventory: integer("claimed_inventory").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("event_beverage_bundles_event_id_idx").on(table.eventId),
    check("bundle_quantity_positive", sql`${table.quantityUnits} > 0`),
    check("bundle_price_non_negative", sql`${table.bundlePrice} >= 0`),
    check(
      "bundle_inventory_valid",
      sql`${table.allocatedInventory} >= ${table.claimedInventory} and ${table.claimedInventory} >= 0`,
    ),
  ],
);

/**
 * Itemized breakdown for pending multi-item checkouts (Tickets + Drink Bundles).
 * Resolves the 1:1 limitation in pending_payments.
 */
export const pendingPaymentItemsTable = pgTable(
  "pending_payment_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paymentReference: text("payment_reference")
      .notNull()
      .references(() => pendingPaymentsTable.reference, { onDelete: "cascade" }),
    itemType: text("item_type").notNull(), // 'TICKET' | 'BEVERAGE_BUNDLE'
    itemReferenceId: uuid("item_reference_id").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("pending_payment_items_reference_idx").on(table.paymentReference),
    check("pending_item_quantity_positive", sql`${table.quantity} > 0`),
    check("pending_item_unit_price_non_negative", sql`${table.unitPrice} >= 0`),
    check("pending_item_subtotal_non_negative", sql`${table.subtotal} >= 0`),
  ],
);

/**
 * Digital beverage vouchers issued upon confirmed payment.
 * Represents redeemable drink units at event bars.
 */
export const beverageVouchersTable = pgTable(
  "beverage_vouchers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    voucherCode: text("voucher_code").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    bundleId: uuid("bundle_id").references(() => eventBeverageBundlesTable.id),
    totalUnits: integer("total_units").notNull(),
    redeemedUnits: integer("redeemed_units").notNull().default(0),
    status: voucherStatusEnum("status").notNull().default("active"),
    signatureHash: text("signature_hash").notNull(),
    paymentReference: text("payment_reference").unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("beverage_vouchers_user_id_idx").on(table.userId),
    index("beverage_vouchers_event_id_idx").on(table.eventId),
    index("beverage_vouchers_status_idx").on(table.status),
    check(
      "voucher_units_valid",
      sql`${table.totalUnits} >= ${table.redeemedUnits} and ${table.redeemedUnits} >= 0`,
    ),
  ],
);

/**
 * Immutable audit log of individual drink redemptions at venue bar stations.
 * Records bartender ID, station identifier, and timestamp for tamper-evidence.
 */
export const voucherRedemptionLogsTable = pgTable(
  "voucher_redemption_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    voucherId: uuid("voucher_id")
      .notNull()
      .references(() => beverageVouchersTable.id, { onDelete: "cascade" }),
    redeemedUnits: integer("redeemed_units").notNull().default(1),
    scannedByUserId: uuid("scanned_by_user_id")
      .notNull()
      .references(() => usersTable.id),
    stationIdentifier: text("station_identifier").notNull(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    deviceTimestamp: timestamp("device_timestamp", { withTimezone: true }).notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("redemption_logs_voucher_id_idx").on(table.voucherId),
    index("redemption_logs_scanned_by_idx").on(table.scannedByUserId),
    check("redemption_units_positive", sql`${table.redeemedUnits} > 0`),
  ],
);

// Drizzle-Zod Schemas
export const insertBeverageProductSchema = createInsertSchema(beverageProductsTable).omit({
  id: true,
  createdAt: true,
});
export const selectBeverageProductSchema = createSelectSchema(beverageProductsTable);
export type BeverageProduct = typeof beverageProductsTable.$inferSelect;
export type InsertBeverageProduct = z.infer<typeof insertBeverageProductSchema>;

export const insertEventBeverageBundleSchema = createInsertSchema(eventBeverageBundlesTable).omit({
  id: true,
  claimedInventory: true,
  createdAt: true,
});
export const selectEventBeverageBundleSchema = createSelectSchema(eventBeverageBundlesTable);
export type EventBeverageBundle = typeof eventBeverageBundlesTable.$inferSelect;
export type InsertEventBeverageBundle = z.infer<typeof insertEventBeverageBundleSchema>;

export const selectBeverageVoucherSchema = createSelectSchema(beverageVouchersTable);
export type BeverageVoucher = typeof beverageVouchersTable.$inferSelect;

export const selectVoucherRedemptionLogSchema = createSelectSchema(voucherRedemptionLogsTable);
export type VoucherRedemptionLog = typeof voucherRedemptionLogsTable.$inferSelect;
