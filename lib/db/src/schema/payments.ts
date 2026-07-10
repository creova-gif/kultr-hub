import { pgTable, text, timestamp, uuid, integer, numeric } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { eventsTable, ticketTypesTable } from "./events";

/**
 * Server-authoritative record of what a payment reference was actually
 * initiated for, written at STK-push / Request-to-Pay time (before the
 * provider is contacted) and read back at verify time.
 *
 * M-Pesa and MTN MoMo confirm only success/failure for a reference — unlike
 * Paystack, they don't hand back an authenticated amount/metadata we can bind
 * the issued ticket to. Without this table, a client could pay for one ticket
 * then call /verify a second time with a larger `quantity` and receive tickets
 * it never paid for. Verify routes must read quantity/unitPrice/currency from
 * here, never from the client-supplied request body.
 */
export const pendingPaymentsTable = pgTable("pending_payments", {
  reference: text("reference").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
    .notNull()
    .references(() => eventsTable.id, { onDelete: "cascade" }),
  ticketTypeId: uuid("ticket_type_id")
    .notNull()
    .references(() => ticketTypesTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  provider: text("provider").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PendingPayment = typeof pendingPaymentsTable.$inferSelect;
