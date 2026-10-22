# 08 — Database Architecture & Schema Reference

> **Volume 08 — Relational Schema Reference, Data Invariants & Migration History**  
> **Prepared by:** Lead Database Administrator & Backend Architect  
> **Evidence Status:** `VERIFIED` across `lib/db/src/schema/` and migrations in `lib/db/migrations/`

---

## 1. Schema Overview & Domain Grouping

The Kultr relational schema is implemented in PostgreSQL 16 using **Drizzle ORM** with versioned migrations. The database comprises **24 tables** organized into 7 functional domains:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KULTR DATABASE DOMAINS                          │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ DOMAIN            │ PRIMARY TABLES    │ PURPOSE                        │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ Identity & Auth   │ users, otp_codes  │ Accounts, credentials, sessions│
│ Events & Tiers    │ events,           │ Event catalog, pricing tiers,  │
│                   │ ticket_types,     │ moderation status & reports    │
│                   │ event_reports     │                                │
│ Tickets & Orders  │ tickets           │ Confirmed attendance, QR hashes│
│ Payments & Money  │ pending_payments, │ Transaction tracking, gateway  │
│                   │ payouts           │ reconciliation, creator payout │
│ Gamification      │ quests, wallets,  │ Quests, ledger transactions,   │
│                   │ ledger, pass,     │ multiplier subscriptions,      │
│                   │ inventory, perks  │ collectibles & perks           │
│ Notifications     │ notifications     │ System & transactional alerts  │
│ Beverage Commerce │ beverage_products,│ Drink catalog, bundle packs,   │
│                   │ event_bundles,    │ bar vouchers & redemption logs │
│                   │ vouchers, logs    │                                │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 2. Table-by-Table Schema Specifications

### 2.1 Identity & Authentication (`schema/users.ts`)

#### `users`
Represents customer and organizer accounts.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `email` (VARCHAR(255), Not Null, Unique)
- `phone` (VARCHAR(32), Nullable)
- `password_hash` (VARCHAR(255), Nullable — null for phone OTP accounts)
- `display_name` (VARCHAR(128), Not Null)
- `is_admin` (BOOLEAN, Not Null, Default: `false`)
- `is_verified_organizer` (BOOLEAN, Not Null, Default: `false`)
- `token_version` (INTEGER, Not Null, Default: `1` — incremented to revoke sessions)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)
- `updated_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)

#### `otp_codes`
Transient phone verification codes.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `phone` (VARCHAR(32), Not Null)
- `code_hash` (VARCHAR(255), Not Null — bcrypt-hashed OTP)
- `attempts` (INTEGER, Not Null, Default: `0` — max 5 attempts)
- `expires_at` (TIMESTAMP WITH TIME ZONE, Not Null — 10 minute TTL)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)

---

### 2.2 Events, Tiers & Moderation (`schema/events.ts`)

#### `events`
Core event listings.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `creator_id` (UUID, Not Null, Foreign Key → `users.id` ON DELETE CASCADE)
- `title` (VARCHAR(255), Not Null)
- `subtitle` (VARCHAR(255), Nullable)
- `category` (VARCHAR(64), Not Null — Music, Art, Food, Heritage, Nightlife, Sports, Comedy)
- `venue` (VARCHAR(255), Not Null)
- `city` (VARCHAR(128), Not Null)
- `country` (VARCHAR(128), Not Null)
- `country_code` (VARCHAR(8), Not Null, Default: `'KE'`)
- `event_date` (TIMESTAMP WITH TIME ZONE, Not Null)
- `image_url` (VARCHAR(512), Nullable)
- `image_key` (VARCHAR(64), Nullable)
- `featured` (BOOLEAN, Not Null, Default: `false`)
- `tags` (TEXT ARRAY, Nullable)
- `status` (VARCHAR(32), Not Null, Default: `'review'` — `'draft'`, `'review'`, `'live'`, `'rejected'`, `'ended'`)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)
- `updated_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)

#### `ticket_types`
Pricing tiers per event.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `event_id` (UUID, Not Null, Foreign Key → `events.id` ON DELETE CASCADE)
- `name` (VARCHAR(128), Not Null — Early Bird, Regular, VIP, etc.)
- `price` (DECIMAL(12, 2), Not Null)
- `currency` (VARCHAR(8), Not Null, Default: `'KES'`)
- `total_quantity` (INTEGER, Not Null)
- `sold_quantity` (INTEGER, Not Null, Default: `0`)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)
- *Invariant:* `sold_quantity <= total_quantity` strictly enforced during issuance transactions.

#### `event_reports`
Buyer-filed trust and abuse reports.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `event_id` (UUID, Not Null, Foreign Key → `events.id` ON DELETE CASCADE)
- `reporter_id` (UUID, Not Null, Foreign Key → `users.id` ON DELETE CASCADE)
- `reason` (VARCHAR(64), Not Null — misleading_listing, suspected_scam, inappropriate_content, duplicate_event, other)
- `details` (TEXT, Nullable)
- `status` (VARCHAR(32), Not Null, Default: `'pending'` — pending, reviewed, dismissed)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)
- `resolved_at` (TIMESTAMP WITH TIME ZONE, Nullable)

---

### 2.3 Tickets & Orders (`schema/tickets.ts`)

#### `tickets`
Confirmed attendee tickets.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `user_id` (UUID, Not Null, Foreign Key → `users.id` ON DELETE CASCADE)
- `event_id` (UUID, Not Null, Foreign Key → `events.id` ON DELETE CASCADE)
- `ticket_type_id` (UUID, Not Null, Foreign Key → `ticket_types.id` ON DELETE RESTRICT)
- `qr_code_hash` (VARCHAR(255), Not Null, Unique)
- `quantity` (INTEGER, Not Null, Default: `1`)
- `total_amount` (DECIMAL(12, 2), Not Null)
- `currency` (VARCHAR(8), Not Null)
- `status` (VARCHAR(32), Not Null, Default: `'confirmed'` — confirmed, used, cancelled)
- `purchased_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)
- `used_at` (TIMESTAMP WITH TIME ZONE, Nullable)

---

### 2.4 Payments & Payouts (`schema/payments.ts` & `schema/payouts.ts`)

#### `pending_payments`
Tracks in-flight gateway transactions.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `reference` (VARCHAR(64), Not Null, Unique — `kultr_<nanoid>`)
- `provider` (VARCHAR(32), Not Null — `paystack`, `mpesa`, `momo`)
- `user_id` (UUID, Not Null, Foreign Key → `users.id`)
- `event_id` (UUID, Not Null, Foreign Key → `events.id`)
- `ticket_type_id` (UUID, Not Null, Foreign Key → `ticket_types.id`)
- `quantity` (INTEGER, Not Null)
- `amount` (DECIMAL(12, 2), Not Null)
- `currency` (VARCHAR(8), Not Null)
- `status` (VARCHAR(32), Not Null, Default: `'pending'` — pending, success, failed)
- `provider_reference` (VARCHAR(128), Nullable — STK CheckoutRequestID / MoMo X-Reference-Id)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)
- `updated_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)

#### `payouts`
Creator balance withdrawal requests.
- `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
- `creator_id` (UUID, Not Null, Foreign Key → `users.id`)
- `amount` (DECIMAL(12, 2), Not Null)
- `currency` (VARCHAR(8), Not Null)
- `status` (VARCHAR(32), Not Null, Default: `'pending'` — pending, paid, rejected)
- `destination` (JSONB, Not Null — `{ type: "mpesa"|"bank", phone?, bankName?, accountNumber? }`)
- `requested_at` (TIMESTAMP WITH TIME ZONE, Default: `now()`)
- `resolved_at` (TIMESTAMP WITH TIME ZONE, Nullable)

---

### 2.5 Gamification & Loyalty Engine (`schema/gamification.ts`)

- `quests`: Catalog of active cultural quests (`slug`, `match_rule`, `target_count`, `points_reward`, `badge_image_key`).
- `kultroin_wallets`: User balance accounts (`balance`, `lifetime_earned`, `user_id` UNIQUE).
- `kultroin_ledger`: Append-only audit ledger (`amount`, `direction`, `reason`, `idempotency_key` UNIQUE).
- `user_quest_progress`: Tracks quest progress per user (`(user_id, quest_id)` UNIQUE, `progress`, `completed`).
- `event_checkins`: Authenticated event attendance records (`(user_id, event_id)` UNIQUE).
- `collectible_inventory`: Rarity badges awarded to users (`slug`, `rarity`, `image_key`).
- `kultr_pass_subscriptions`: Paid VIP pass conferring 2x reward multipliers (`user_id` UNIQUE, `multiplier`).
- `kultr_pass_payments`: Gateway transaction records for KULTR PASS activations.
- `perks`: Catalog of redeemable backstage benefits (`cost`, `repeatable`).
- `user_perk_unlocks`: Redemption records for spent KULTROINS.

---

### 2.6 Beverage Commerce Loop (`schema/beverages.ts`)

- `beverage_products`: Catalog of Kultr Canned Drinks (`sku` UNIQUE, `name`, `flavor`, `pack_size`).
- `event_beverage_bundles`: Event-specific drink bundle allocations (`event_id`, `product_id`, `price`, `sold_quantity`).
- `pending_payment_items`: Multi-item checkout links binding drink bundles to `pending_payments`.
- `beverage_vouchers`: Digital Bar Passes (`voucher_code` UNIQUE, `qr_signature`, `total_units`, `redeemed_units`, `status`).
- `voucher_redemption_logs`: Bartender audit log recording can decrements and scanner device IDs.

---

## 3. Migration History & Journal

The database migration journal (`lib/db/migrations/meta/_journal.json`) records 10 sequential, version-controlled migrations:

| Migration File | Version Tag | Core Tables Introduced | Status |
|:---|:---:|:---|:---:|
| `0000_fluffy_iron_man.sql` | `0000` | `users`, `events`, `ticket_types`, `tickets` | **`APPLIED`** |
| `0001_rapid_silver_surfer.sql` | `0001` | `pending_payments`, `payouts` | **`APPLIED`** |
| `0002_quiet_valkyrie.sql` | `0002` | `otp_codes`, `users.token_version` | **`APPLIED`** |
| `0003_dazzling_shadowcat.sql` | `0003` | `event_reports`, `notifications` | **`APPLIED`** |
| `0004_sturdy_wolverine.sql` | `0004` | `quests`, `kultroin_wallets`, `kultroin_ledger` | **`APPLIED`** |
| `0005_bouncy_nightcrawler.sql`| `0005` | `user_quest_progress`, `event_checkins` | **`APPLIED`** |
| `0006_classy_stature.sql` | `0006` | `collectible_inventory`, `kultr_pass_subscriptions`| **`APPLIED`** |
| `0007_modern_daredevil.sql` | `0007` | `perks`, `user_perk_unlocks` | **`APPLIED`** |
| `0008_diaspora_hubs_and_fx.sql`| `0008` | `events.country_code`, currency enum expansion | **`APPLIED`** |
| `0009_canned_drinks_commerce.sql`| `0009` | `beverage_products`, `event_beverage_bundles`, `beverage_vouchers`, `voucher_redemption_logs` | **`APPLIED`** |
