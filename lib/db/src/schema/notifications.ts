import { pgTable, text, timestamp, uuid, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

/**
 * Real, server-persisted notifications. Replaces the mobile app's previous
 * hardcoded array — every user was shown the identical fake feed regardless
 * of their actual activity. Rows are inserted by the server whenever
 * something notification-worthy happens to a user (ticket confirmed, event
 * approved/rejected, payout resolved). No push delivery yet (see
 * notifications route docs) — this is the in-app feed and its read state.
 */
export const notificationTypeEnum = pgEnum("notification_type", [
  "ticket_confirmed",
  "event_approved",
  "event_rejected",
  "event_cancelled",
  "payout_resolved",
  "kultroin_earned",
]);

export const notificationsTable = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    // Arbitrary structured payload (eventId, ticketId, amount, etc.) so the
    // client can deep-link without a second round trip.
    data: jsonb("data"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_id_created_at_idx").on(table.userId, table.createdAt),
  ],
);

export type Notification = typeof notificationsTable.$inferSelect;
