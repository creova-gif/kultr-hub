ALTER TABLE "events" ADD CONSTRAINT "events_capacity_non_negative" CHECK ("events"."capacity" is null or "events"."capacity" >= 0);--> statement-breakpoint
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_price_non_negative" CHECK ("ticket_types"."price" >= 0);--> statement-breakpoint
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_total_quantity_non_negative" CHECK ("ticket_types"."total_quantity" >= 0);--> statement-breakpoint
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_sold_quantity_bounds" CHECK ("ticket_types"."sold_quantity" >= 0 and "ticket_types"."sold_quantity" <= "ticket_types"."total_quantity");--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_quantity_positive" CHECK ("tickets"."quantity" > 0);--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_unit_price_non_negative" CHECK ("tickets"."unit_price" >= 0);--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_total_amount_non_negative" CHECK ("tickets"."total_amount" >= 0);--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_amount_positive" CHECK ("payouts"."amount" > 0);