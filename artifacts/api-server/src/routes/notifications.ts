import { Router } from "express";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import type { Request, Response } from "express";

/**
 * Real, server-persisted in-app notification feed. Replaces the mobile
 * app's previous hardcoded array — see lib/db/src/schema/notifications.ts.
 * Rows are inserted elsewhere (ticket issuance, event moderation, payout
 * resolution) via lib/notify.ts; this router only reads/updates read state
 * for the signed-in user. No push delivery yet — in-app feed only.
 */
const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest;
  const { limit = "50" } = req.query as Record<string, string>;

  const notifications = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, userId))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(Math.min(parseInt(limit) || 50, 100));

  const [{ unread }] = await db
    .select({ unread: sql<number>`count(*)::int` })
    .from(notificationsTable)
    .where(and(eq(notificationsTable.userId, userId), isNull(notificationsTable.readAt)));

  res.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      data: n.data,
      read: n.readAt !== null,
      createdAt: n.createdAt.toISOString(),
    })),
    unreadCount: unread,
  });
});

router.patch("/:id/read", requireAuth, async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest;
  const id = String(req.params.id);

  const [updated] = await db
    .update(notificationsTable)
    .set({ readAt: new Date() })
    .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, userId), isNull(notificationsTable.readAt)))
    .returning({ id: notificationsTable.id });

  if (!updated) {
    // Either it doesn't exist, isn't this user's, or was already read —
    // all three should look the same to the caller and are all fine to
    // treat as a no-op success (marking read is idempotent).
    res.status(200).json({ id, read: true });
    return;
  }

  res.json({ id: updated.id, read: true });
});

router.post("/read-all", requireAuth, async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest;

  await db
    .update(notificationsTable)
    .set({ readAt: new Date() })
    .where(and(eq(notificationsTable.userId, userId), isNull(notificationsTable.readAt)));

  res.status(204).send();
});

export default router;
