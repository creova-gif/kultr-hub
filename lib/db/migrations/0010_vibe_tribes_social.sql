CREATE TABLE "tribes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"emoji" text NOT NULL,
	"tagline" text NOT NULL,
	"color" text NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"is_official" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tribes_member_count_non_negative" CHECK ("tribes"."member_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "tribe_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tribe_id" text NOT NULL REFERENCES "tribes"("id") ON DELETE cascade,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tribe_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tribe_id" text NOT NULL REFERENCES "tribes"("id") ON DELETE cascade,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"content" text NOT NULL,
	"event_id" uuid REFERENCES "events"("id") ON DELETE set null,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tribe_posts_likes_non_negative" CHECK ("tribe_posts"."likes_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "tribe_post_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL REFERENCES "tribe_posts"("id") ON DELETE cascade,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "tribes_category_idx" ON "tribes" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "tribe_members_tribe_user_uidx" ON "tribe_members" USING btree ("tribe_id", "user_id");--> statement-breakpoint
CREATE INDEX "tribe_members_user_id_idx" ON "tribe_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tribe_members_tribe_id_idx" ON "tribe_members" USING btree ("tribe_id");--> statement-breakpoint
CREATE INDEX "tribe_posts_tribe_id_created_at_idx" ON "tribe_posts" USING btree ("tribe_id", "created_at");--> statement-breakpoint
CREATE INDEX "tribe_posts_user_id_idx" ON "tribe_posts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tribe_post_likes_post_user_uidx" ON "tribe_post_likes" USING btree ("post_id", "user_id");--> statement-breakpoint
CREATE INDEX "tribe_post_likes_post_id_idx" ON "tribe_post_likes" USING btree ("post_id");--> statement-breakpoint

-- Seed initial official Diaspora Culture Tribes
INSERT INTO "tribes" ("id", "name", "category", "emoji", "tagline", "color", "member_count", "is_official")
VALUES
  ('afrobeats', 'Afrobeats Nation', 'Music', '🎶', 'Where the rhythm never stops.', '#FF6B00', 12480, true),
  ('amapiano', 'Amapiano Movement', 'Music', '🎹', 'Log drums & late nights.', '#7B61FF', 8932, true),
  ('foodies', 'Nyama & Spice', 'Food', '🍖', 'Chasing flavour across the continent.', '#00C853', 6201, true),
  ('art', 'Canvas Collective', 'Art', '🎨', 'Galleries, graffiti & everything between.', '#E1306C', 4517, true),
  ('fashion', 'Threads of Africa', 'Fashion', '👗', 'Heritage meets the runway.', '#4F9DFF', 5874, true),
  ('film', 'Screen Culture', 'Film', '🎬', 'Nollywood to the new wave.', '#FFB400', 3340, true),
  ('tech', 'Silicon Savannah', 'Tech', '💡', 'Builders shaping the future.', '#00BFA5', 7129, true),
  ('dance', 'Step & Sway', 'Dance', '💃', 'If it moves you, it is home.', '#FF4081', 4988, true)
ON CONFLICT ("id") DO NOTHING;
