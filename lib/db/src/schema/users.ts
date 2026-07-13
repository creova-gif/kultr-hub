import { pgTable, text, timestamp, uuid, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(),
  passwordHash: text("password_hash"),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  countryCode: text("country_code").notNull().default("KE"),
  isCreator: boolean("is_creator").notNull().default(false),
  // Admin-granted only (see PATCH /users/:id/verify) — shown to buyers as a
  // "Verified Organizer" badge on that creator's events. Not a KYC pipeline;
  // a manual trust signal an admin can grant after reviewing an organizer.
  isVerifiedOrganizer: boolean("is_verified_organizer").notNull().default(false),
  // No self-serve path to grant this — set directly in the database.
  // Gates the moderation kill-switch (force any event to cancelled/ended)
  // until a real admin console exists.
  isAdmin: boolean("is_admin").notNull().default(false),
  // Embedded in every JWT at sign time and checked at auth time — bumping
  // this invalidates every outstanding token for the user in one write,
  // without needing a denylist table. See routes/auth.ts POST /logout.
  tokenVersion: integer("token_version").notNull().default(0),
  // ── Consent (GDPR / Quebec Law 25 bar — see global-expansion roadmap §5/§6 Phase 2) ──
  // Opt-in, not opt-out: null means "never asked" (no tracking happens,
  // same as false) rather than defaulting to granted. There is no analytics/
  // tracking SDK wired up yet — this is the consent record built ahead of
  // that feature, not behind it, so nothing ships un-gated later.
  trackingConsent: boolean("tracking_consent"),
  trackingConsentAt: timestamp("tracking_consent_at", { withTimezone: true }),
  // Deliberately separate from OTP — OTP login codes are a transactional
  // message the user directly requested, never marketing. This flag exists
  // so a future marketing-SMS feature has an explicit, distinctly-recorded
  // consent to check instead of assuming OTP usage implies it (TCPA).
  marketingSmsConsent: boolean("marketing_sms_consent").notNull().default(false),
  marketingSmsConsentAt: timestamp("marketing_sms_consent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * One-time passcodes for phone-based authentication.
 * A row is created per OTP request; the code is stored hashed (bcrypt).
 */
export const otpCodesTable = pgTable("otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").notNull(),
  codeHash: text("code_hash").notNull(),
  purpose: text("purpose").notNull().default("login"),
  attempts: integer("attempts").notNull().default(0),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(usersTable);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
export type OtpCode = typeof otpCodesTable.$inferSelect;
