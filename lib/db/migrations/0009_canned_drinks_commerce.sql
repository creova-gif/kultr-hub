CREATE TYPE "public"."voucher_status" AS ENUM('active', 'exhausted', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TABLE "beverage_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"flavor" text NOT NULL,
	"sku" text NOT NULL,
	"volume_ml" integer DEFAULT 330 NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"base_price" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "beverage_products_sku_unique" UNIQUE("sku"),
	CONSTRAINT "beverage_base_price_non_negative" CHECK ("beverage_products"."base_price" >= 0),
	CONSTRAINT "beverage_volume_positive" CHECK ("beverage_products"."volume_ml" > 0)
);
--> statement-breakpoint
CREATE TABLE "event_beverage_bundles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"beverage_product_id" uuid NOT NULL,
	"title" text NOT NULL,
	"quantity_units" integer DEFAULT 4 NOT NULL,
	"bundle_price" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"allocated_inventory" integer NOT NULL,
	"claimed_inventory" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bundle_quantity_positive" CHECK ("event_beverage_bundles"."quantity_units" > 0),
	CONSTRAINT "bundle_price_non_negative" CHECK ("event_beverage_bundles"."bundle_price" >= 0),
	CONSTRAINT "bundle_inventory_valid" CHECK ("event_beverage_bundles"."allocated_inventory" >= "event_beverage_bundles"."claimed_inventory" and "event_beverage_bundles"."claimed_inventory" >= 0)
);
--> statement-breakpoint
CREATE TABLE "pending_payment_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_reference" text NOT NULL,
	"item_type" text NOT NULL,
	"item_reference_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pending_item_quantity_positive" CHECK ("pending_payment_items"."quantity" > 0),
	CONSTRAINT "pending_item_unit_price_non_negative" CHECK ("pending_payment_items"."unit_price" >= 0),
	CONSTRAINT "pending_item_subtotal_non_negative" CHECK ("pending_payment_items"."subtotal" >= 0)
);
--> statement-breakpoint
CREATE TABLE "beverage_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"voucher_code" text NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"bundle_id" uuid,
	"total_units" integer NOT NULL,
	"redeemed_units" integer DEFAULT 0 NOT NULL,
	"status" "voucher_status" DEFAULT 'active' NOT NULL,
	"signature_hash" text NOT NULL,
	"payment_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "beverage_vouchers_voucher_code_unique" UNIQUE("voucher_code"),
	CONSTRAINT "beverage_vouchers_payment_reference_unique" UNIQUE("payment_reference"),
	CONSTRAINT "voucher_units_valid" CHECK ("beverage_vouchers"."total_units" >= "beverage_vouchers"."redeemed_units" and "beverage_vouchers"."redeemed_units" >= 0)
);
--> statement-breakpoint
CREATE TABLE "voucher_redemption_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"voucher_id" uuid NOT NULL,
	"redeemed_units" integer DEFAULT 1 NOT NULL,
	"scanned_by_user_id" uuid NOT NULL,
	"station_identifier" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"device_timestamp" timestamp with time zone NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "voucher_redemption_logs_idempotency_key_unique" UNIQUE("idempotency_key"),
	CONSTRAINT "redemption_units_positive" CHECK ("voucher_redemption_logs"."redeemed_units" > 0)
);
--> statement-breakpoint
ALTER TABLE "event_beverage_bundles" ADD CONSTRAINT "event_beverage_bundles_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_beverage_bundles" ADD CONSTRAINT "event_beverage_bundles_beverage_product_id_beverage_products_id_fk" FOREIGN KEY ("beverage_product_id") REFERENCES "public"."beverage_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_payment_items" ADD CONSTRAINT "pending_payment_items_payment_reference_pending_payments_reference_fk" FOREIGN KEY ("payment_reference") REFERENCES "public"."pending_payments"("reference") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beverage_vouchers" ADD CONSTRAINT "beverage_vouchers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beverage_vouchers" ADD CONSTRAINT "beverage_vouchers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beverage_vouchers" ADD CONSTRAINT "beverage_vouchers_bundle_id_event_beverage_bundles_id_fk" FOREIGN KEY ("bundle_id") REFERENCES "public"."event_beverage_bundles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_redemption_logs" ADD CONSTRAINT "voucher_redemption_logs_voucher_id_beverage_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."beverage_vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_redemption_logs" ADD CONSTRAINT "voucher_redemption_logs_scanned_by_user_id_users_id_fk" FOREIGN KEY ("scanned_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "beverage_products_is_active_idx" ON "beverage_products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "event_beverage_bundles_event_id_idx" ON "event_beverage_bundles" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "pending_payment_items_reference_idx" ON "pending_payment_items" USING btree ("payment_reference");--> statement-breakpoint
CREATE INDEX "beverage_vouchers_user_id_idx" ON "beverage_vouchers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "beverage_vouchers_event_id_idx" ON "beverage_vouchers" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "beverage_vouchers_status_idx" ON "beverage_vouchers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "redemption_logs_voucher_id_idx" ON "voucher_redemption_logs" USING btree ("voucher_id");--> statement-breakpoint
CREATE INDEX "redemption_logs_scanned_by_idx" ON "voucher_redemption_logs" USING btree ("scanned_by_user_id");
