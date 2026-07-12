CREATE TYPE "public"."kultr_pass_payment_status" AS ENUM('pending', 'verified', 'consumed');--> statement-breakpoint
CREATE TABLE "kultr_pass_payments" (
	"reference" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" "kultr_pass_payment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "kultr_pass_payments" ADD CONSTRAINT "kultr_pass_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;