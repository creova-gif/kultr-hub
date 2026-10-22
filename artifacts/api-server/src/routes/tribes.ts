import { Router } from "express";
import { and, eq, desc, sql, inArray } from "drizzle-orm";
import {
  db,
  tribesTable,
  tribeMembersTable,
  tribePostsTable,
  tribePostLikesTable,
  usersTable,
  eventsTable,
  ticketsTable,
} from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import type { Request, Response } from "express";

const router = Router();

/**
 * GET /api/tribes
 * List all culture tribes with live member counts and user joined state.
 */
router.get("/", async (req: Request, res: Response) => {
  const authed = req as Partial<AuthedRequest>;
  const userId = authed.userId;

  const tribes = await db
    .select()
    .from(tribesTable)
    .orderBy(desc(tribesTable.memberCount));

  let joinedTribeIds = new Set<string>();
  if (userId) {
    const memberships = await db
      .select({ tribeId: tribeMembersTable.tribeId })
      .from(tribeMembersTable)
      .where(eq(tribeMembersTable.userId, userId));
    joinedTribeIds = new Set(memberships.map((m) => m.tribeId));
  }

  const results = tribes.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    emoji: t.emoji,
    tagline: t.tagline,
    color: t.color,
    members: t.memberCount,
    isOfficial: t.isOfficial,
    hasJoined: joinedTribeIds.has(t.id),
  }));

  res.json({ tribes: results, total: results.length });
});

/**
 * GET /api/tribes/:id
 * Get single tribe details with member stats.
 */
router.get("/:id", async (req: Request, res: Response) => {
  const tribeId = String(req.params.id).toLowerCase();
  const authed = req as Partial<AuthedRequest>;
  const userId = authed.userId;

  const [tribe] = await db
    .select()
    .from(tribesTable)
    .where(eq(tribesTable.id, tribeId))
    .limit(1);

  if (!tribe) {
    res.status(404).json({ message: "Tribe not found" });
    return;
  }

  let hasJoined = false;
  if (userId) {
    const [membership] = await db
      .select()
      .from(tribeMembersTable)
      .where(and(eq(tribeMembersTable.tribeId, tribeId), eq(tribeMembersTable.userId, userId)))
      .limit(1);
    hasJoined = !!membership;
  }

  res.json({
    id: tribe.id,
    name: tribe.name,
    category: tribe.category,
    emoji: tribe.emoji,
    tagline: tribe.tagline,
    color: tribe.color,
    members: tribe.memberCount,
    isOfficial: tribe.isOfficial,
    hasJoined,
  });
});

/**
 * POST /api/tribes/:id/join
 * Join a vibe tribe. Atomically updates member_count.
 */
router.post("/:id/join", requireAuth, async (req: Request, res: Response) => {
  const tribeId = String(req.params.id).toLowerCase();
  const authed = req as AuthedRequest;
  const userId = authed.userId;

  const [tribe] = await db
    .select()
    .from(tribesTable)
    .where(eq(tribesTable.id, tribeId))
    .limit(1);

  if (!tribe) {
    res.status(404).json({ message: "Tribe not found" });
    return;
  }

  // Check if already joined
  const [existing] = await db
    .select()
    .from(tribeMembersTable)
    .where(and(eq(tribeMembersTable.tribeId, tribeId), eq(tribeMembersTable.userId, userId)))
    .limit(1);

  if (!existing) {
    await db.insert(tribeMembersTable).values({
      tribeId,
      userId,
      role: "member",
    });

    await db
      .update(tribesTable)
      .set({ memberCount: sql`${tribesTable.memberCount} + 1` })
      .where(eq(tribesTable.id, tribeId));
  }

  const [updatedTribe] = await db
    .select({ count: tribesTable.memberCount })
    .from(tribesTable)
    .where(eq(tribesTable.id, tribeId))
    .limit(1);

  res.json({
    success: true,
    hasJoined: true,
    memberCount: updatedTribe?.count ?? tribe.memberCount + 1,
  });
});

/**
 * POST /api/tribes/:id/leave
 * Leave a vibe tribe. Atomically decrements member_count.
 */
router.post("/:id/leave", requireAuth, async (req: Request, res: Response) => {
  const tribeId = String(req.params.id).toLowerCase();
  const authed = req as AuthedRequest;
  const userId = authed.userId;

  const deleted = await db
    .delete(tribeMembersTable)
    .where(and(eq(tribeMembersTable.tribeId, tribeId), eq(tribeMembersTable.userId, userId)))
    .returning({ id: tribeMembersTable.id });

  if (deleted.length > 0) {
    await db
      .update(tribesTable)
      .set({ memberCount: sql`GREATEST(0, ${tribesTable.memberCount} - 1)` })
      .where(eq(tribesTable.id, tribeId));
  }

  const [updatedTribe] = await db
    .select({ count: tribesTable.memberCount })
    .from(tribesTable)
    .where(eq(tribesTable.id, tribeId))
    .limit(1);

  res.json({
    success: true,
    hasJoined: false,
    memberCount: updatedTribe?.count ?? 0,
  });
});

/**
 * GET /api/tribes/:id/posts
 * Fetch community feed posts for a tribe.
 */
router.get("/:id/posts", async (req: Request, res: Response) => {
  const tribeId = String(req.params.id).toLowerCase();
  const authed = req as Partial<AuthedRequest>;
  const userId = authed.userId;

  const posts = await db
    .select({
      id: tribePostsTable.id,
      tribeId: tribePostsTable.tribeId,
      userId: tribePostsTable.userId,
      content: tribePostsTable.content,
      eventId: tribePostsTable.eventId,
      likesCount: tribePostsTable.likesCount,
      createdAt: tribePostsTable.createdAt,
      authorName: usersTable.displayName,
      authorAvatar: usersTable.avatarUrl,
      eventTitle: eventsTable.title,
      eventDate: eventsTable.eventDate,
      eventCity: eventsTable.city,
    })
    .from(tribePostsTable)
    .innerJoin(usersTable, eq(tribePostsTable.userId, usersTable.id))
    .leftJoin(eventsTable, eq(tribePostsTable.eventId, eventsTable.id))
    .where(eq(tribePostsTable.tribeId, tribeId))
    .orderBy(desc(tribePostsTable.createdAt))
    .limit(50);

  let userLikes = new Set<string>();
  if (userId && posts.length > 0) {
    const postIds = posts.map((p) => p.id);
    const likes = await db
      .select({ postId: tribePostLikesTable.postId })
      .from(tribePostLikesTable)
      .where(
        and(
          eq(tribePostLikesTable.userId, userId),
          inArray(tribePostLikesTable.postId, postIds)
        )
      );
    userLikes = new Set(likes.map((l) => l.postId));
  }

  const formatted = posts.map((p) => ({
    id: p.id,
    tribeId: p.tribeId,
    content: p.content,
    createdAt: p.createdAt,
    likesCount: p.likesCount,
    hasLiked: userLikes.has(p.id),
    author: {
      id: p.userId,
      displayName: p.authorName,
      avatarUrl: p.authorAvatar,
    },
    attachedEvent: p.eventId
      ? {
          id: p.eventId,
          title: p.eventTitle,
          date: p.eventDate,
          city: p.eventCity,
        }
      : null,
  }));

  res.json({ posts: formatted, total: formatted.length });
});

/**
 * POST /api/tribes/:id/posts
 * Publish a post to a tribe discussion feed.
 */
router.post("/:id/posts", requireAuth, async (req: Request, res: Response) => {
  const tribeId = String(req.params.id).toLowerCase();
  const authed = req as AuthedRequest;
  const userId = authed.userId;
  const { content, eventId } = req.body as { content?: string; eventId?: string };

  if (!content || !content.trim()) {
    res.status(400).json({ message: "Post content cannot be empty" });
    return;
  }

  const [newPost] = await db
    .insert(tribePostsTable)
    .values({
      tribeId,
      userId,
      content: content.trim(),
      eventId: eventId || null,
    })
    .returning();

  const [author] = await db
    .select({ displayName: usersTable.displayName, avatarUrl: usersTable.avatarUrl })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  res.status(201).json({
    ...newPost,
    author: {
      id: userId,
      displayName: author?.displayName ?? "Member",
      avatarUrl: author?.avatarUrl,
    },
    hasLiked: false,
  });
});

/**
 * GET /api/tribes/social/activity
 * Live platform activity stream across all diaspora events and tribes.
 */
router.get("/social/activity", async (_req: Request, res: Response) => {
  const recentTickets = await db
    .select({
      id: ticketsTable.id,
      purchasedAt: ticketsTable.purchasedAt,
      eventTitle: eventsTable.title,
      eventCity: eventsTable.city,
      buyerName: usersTable.displayName,
    })
    .from(ticketsTable)
    .innerJoin(eventsTable, eq(ticketsTable.eventId, eventsTable.id))
    .innerJoin(usersTable, eq(ticketsTable.userId, usersTable.id))
    .orderBy(desc(ticketsTable.purchasedAt))
    .limit(10);

  const activities = recentTickets.map((t, idx) => ({
    id: `act-${t.id}`,
    user: t.buyerName,
    action: "just got tickets to",
    event: `${t.eventTitle} (${t.eventCity})`,
    time: idx === 0 ? "Just now" : `${(idx + 1) * 3}m ago`,
  }));

  res.json({ activities, total: activities.length });
});

export default router;
