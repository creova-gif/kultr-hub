ALTER TABLE "users" ADD COLUMN "tracking_consent" boolean;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tracking_consent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "marketing_sms_consent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "marketing_sms_consent_at" timestamp with time zone;