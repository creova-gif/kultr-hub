CREATE TYPE "public"."event_category" AS ENUM('Music', 'Art', 'Food', 'Heritage', 'Comedy', 'Sports', 'Nightlife');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'live', 'ended', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('pending', 'confirmed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."collectible_rarity" AS ENUM('common', 'rare', 'epic', 'legendary');--> statement-breakpoint
CREATE TYPE "public"."kultroin_reason" AS ENUM('quest_completion', 'milestone_bonus', 'perk_redemption', 'manual_adjust', 'signup_bonus');--> statement-breakpoint
CREATE TYPE "public"."quest_match_rule" AS ENUM('category', 'tag', 'early_bird', 'any');--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"code_hash" text NOT NULL,
	"purpose" text DEFAULT 'login' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"consumed_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"password_hash" text,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"country_code" text DEFAULT 'KE' NOT NULL,
	"is_creator" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text NOT NULL,
	"category" "event_category" NOT NULL,
	"venue" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"image_url" text,
	"image_key" text,
	"capacity" integer,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"tags" text[],
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"total_quantity" integer NOT NULL,
	"sold_quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" text NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"ticket_type_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" "ticket_status" DEFAULT 'confirmed' NOT NULL,
	"payment_reference" text,
	"payment_provider" text,
	"purchased_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number"),
	CONSTRAINT "tickets_payment_reference_unique" UNIQUE("payment_reference")
);
--> statement-breakpoint
CREATE TABLE "collectible_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"rarity" "collectible_rarity" DEFAULT 'common' NOT NULL,
	"image_key" text,
	"quest_id" uuid,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collectible_unique" UNIQUE("user_id","slug")
);
--> statement-breakpoint
CREATE TABLE "event_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"ticket_id" uuid,
	"source" text DEFAULT 'qr' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_checkin_unique" UNIQUE("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "kultr_pass_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tier" text DEFAULT 'standard' NOT NULL,
	"multiplier" numeric(3, 2) DEFAULT '1.50' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "kultr_pass_subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "kultroin_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seq" bigserial NOT NULL,
	"user_id" uuid NOT NULL,
	"delta" integer NOT NULL,
	"reason" "kultroin_reason" NOT NULL,
	"balance_after" integer NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"idempotency_key" text NOT NULL,
	"prev_hash" text,
	"tx_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "kultroin_ledger_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "kultroin_wallets" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"lifetime_earned" integer DEFAULT 0 NOT NULL,
	"lifetime_spent" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"cost" integer NOT NULL,
	"repeatable" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "perks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"match_rule" "quest_match_rule" DEFAULT 'category' NOT NULL,
	"required_category" "event_category",
	"required_tag" text,
	"early_bird_days" integer DEFAULT 7 NOT NULL,
	"target_count" integer DEFAULT 1 NOT NULL,
	"points_reward" integer DEFAULT 100 NOT NULL,
	"collectible_slug" text NOT NULL,
	"collectible_name" text NOT NULL,
	"collectible_rarity" "collectible_rarity" DEFAULT 'common' NOT NULL,
	"badge_image_key" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_perk_unlocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"perk_id" uuid NOT NULL,
	"cost" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_quest_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"quest_id" uuid NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_quest_unique" UNIQUE("user_id","quest_id")
);
--> statement-breakpoint
CREATE TABLE "pending_payments" (
	"reference" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"ticket_type_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"currency" text NOT NULL,
	"provider" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_type_id_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collectible_inventory" ADD CONSTRAINT "collectible_inventory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collectible_inventory" ADD CONSTRAINT "collectible_inventory_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_checkins" ADD CONSTRAINT "event_checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_checkins" ADD CONSTRAINT "event_checkins_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_checkins" ADD CONSTRAINT "event_checkins_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kultr_pass_subscriptions" ADD CONSTRAINT "kultr_pass_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kultroin_ledger" ADD CONSTRAINT "kultroin_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kultroin_wallets" ADD CONSTRAINT "kultroin_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_perk_unlocks" ADD CONSTRAINT "user_perk_unlocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_perk_unlocks" ADD CONSTRAINT "user_perk_unlocks_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_progress" ADD CONSTRAINT "user_quest_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_progress" ADD CONSTRAINT "user_quest_progress_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_payments" ADD CONSTRAINT "pending_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_payments" ADD CONSTRAINT "pending_payments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_payments" ADD CONSTRAINT "pending_payments_ticket_type_id_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_status_event_date_idx" ON "events" USING btree ("status","event_date");--> statement-breakpoint
CREATE INDEX "events_category_idx" ON "events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "events_city_idx" ON "events" USING btree ("city");--> statement-breakpoint
CREATE INDEX "events_country_code_idx" ON "events" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "events_creator_id_idx" ON "events" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "ticket_types_event_id_idx" ON "ticket_types" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "tickets_user_id_purchased_at_idx" ON "tickets" USING btree ("user_id","purchased_at");--> statement-breakpoint
CREATE INDEX "tickets_event_id_idx" ON "tickets" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "tickets_ticket_type_id_idx" ON "tickets" USING btree ("ticket_type_id");--> statement-breakpoint
CREATE INDEX "kultroin_ledger_user_idx" ON "kultroin_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_perk_unlocks_user_idx" ON "user_perk_unlocks" USING btree ("user_id");