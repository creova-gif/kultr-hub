import { db, notificationsTable } from "@workspace/db";

/**
 * Small, additive helper for creating a real notification row. Kept
 * deliberately dependency-free (plain db.insert, no transaction requirement)
 * so it can be called from any code path — ticket issuance, event status
 * changes, payout resolution — without coupling those flows to this table's
 * shape. A failure here should never take down the caller's primary
 * operation, so callers that run outside a transaction should treat this as
 * best-effort (see issue.ts / events.ts / payouts.ts call sites).
 */
export type NotificationType =
  | "ticket_confirmed"
  | "event_approved"
  | "event_rejected"
  | "event_cancelled"
  | "payout_resolved"
  | "kultroin_earned";

export interface NotifyParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function notify(params: NotifyParams): Promise<void> {
  await db.insert(notificationsTable).values({
    userId: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    data: params.data ?? null,
  });
}
