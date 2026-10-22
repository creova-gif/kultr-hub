import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { eventsTable } from "./events";

export const tribesTable = pgTable(
  "tribes",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    emoji: text("emoji").notNull(),
    tagline: text("tagline").notNull(),
    color: text("color").notNull(),
    memberCount: integer("member_count").notNull().default(0),
    isOfficial: boolean("is_official").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("tribes_category_idx").on(table.category),
    check("tribes_member_count_non_negative", sql`${table.memberCount} >= 0`),
  ]
);

export const tribeMembersTable = pgTable(
  "tribe_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tribeId: text("tribe_id")
      .notNull()
      .references(() => tribesTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("tribe_members_tribe_user_uidx").on(table.tribeId, table.userId),
    index("tribe_members_user_id_idx").on(table.userId),
    index("tribe_members_tribe_id_idx").on(table.tribeId),
  ]
);

export const tribePostsTable = pgTable(
  "tribe_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tribeId: text("tribe_id")
      .notNull()
      .references(() => tribesTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    eventId: uuid("event_id").references(() => eventsTable.id, { onDelete: "set null" }),
    likesCount: integer("likes_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("tribe_posts_tribe_id_created_at_idx").on(table.tribeId, table.createdAt),
    index("tribe_posts_user_id_idx").on(table.userId),
    check("tribe_posts_likes_non_negative", sql`${table.likesCount} >= 0`),
  ]
);

export const tribePostLikesTable = pgTable(
  "tribe_post_likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => tribePostsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("tribe_post_likes_post_user_uidx").on(table.postId, table.userId),
    index("tribe_post_likes_post_id_idx").on(table.postId),
  ]
);

export const insertTribeSchema = createInsertSchema(tribesTable).omit({
  createdAt: true,
});
export const selectTribeSchema = createSelectSchema(tribesTable);
export type Tribe = typeof tribesTable.$inferSelect;
export type InsertTribe = z.infer<typeof insertTribeSchema>;

export const insertTribeMemberSchema = createInsertSchema(tribeMembersTable).omit({
  id: true,
  joinedAt: true,
});
export const selectTribeMemberSchema = createSelectSchema(tribeMembersTable);
export type TribeMember = typeof tribeMembersTable.$inferSelect;

export const insertTribePostSchema = createInsertSchema(tribePostsTable).omit({
  id: true,
  likesCount: true,
  createdAt: true,
});
export const selectTribePostSchema = createSelectSchema(tribePostsTable);
export type TribePost = typeof tribePostsTable.$inferSelect;
