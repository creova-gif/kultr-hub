# Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ EVENTS : creates
    USERS ||--o{ TICKETS : owns
    USERS ||--o{ PAYOUTS : requests
    USERS ||--o{ EVENT_REPORTS : files
    USERS ||--o{ EVENT_CHECKINS : performs
    USERS ||--o{ USER_QUEST_PROGRESS : tracks
    USERS ||--o{ KULTROIN_WALLETS : owns
    USERS ||--o{ KULTROIN_LEDGER : audits
    USERS ||--o{ COLLECTIBLE_INVENTORY : collects
    USERS ||--o{ KULTR_PASS_SUBSCRIPTIONS : subscribes
    USERS ||--o{ USER_PERK_UNLOCKS : redeems
    USERS ||--o{ BEVERAGE_VOUCHERS : holds
    USERS ||--o{ NOTIFICATIONS : receives

    EVENTS ||--|{ TICKET_TYPES : contains
    EVENTS ||--o{ TICKETS : issues
    EVENTS ||--o{ EVENT_REPORTS : receives
    EVENTS ||--o{ EVENT_CHECKINS : hosts
    EVENTS ||--o{ EVENT_BEVERAGE_BUNDLES : provisions

    TICKET_TYPES ||--o{ TICKETS : defines
    TICKET_TYPES ||--o{ PENDING_PAYMENTS : reserves

    BEVERAGE_PRODUCTS ||--o{ EVENT_BEVERAGE_BUNDLES : configures
    EVENT_BEVERAGE_BUNDLES ||--o{ PENDING_PAYMENT_ITEMS : specifies
    EVENT_BEVERAGE_BUNDLES ||--o{ BEVERAGE_VOUCHERS : sources

    PENDING_PAYMENTS ||--o{ PENDING_PAYMENT_ITEMS : groups
    BEVERAGE_VOUCHERS ||--o{ VOUCHER_REDEMPTION_LOGS : records

    QUESTS ||--o{ USER_QUEST_PROGRESS : measures
    PERKS ||--o{ USER_PERK_UNLOCKS : unlocks

    USERS {
        uuid id PK
        varchar email UK
        varchar phone
        varchar password_hash
        varchar display_name
        boolean is_admin
        boolean is_verified_organizer
        integer token_version
        timestamp created_at
        timestamp updated_at
    }

    OTP_CODES {
        uuid id PK
        varchar phone
        varchar code_hash
        integer attempts
        timestamp expires_at
        timestamp created_at
    }

    EVENTS {
        uuid id PK
        uuid creator_id FK
        varchar title
        varchar subtitle
        varchar category
        varchar venue
        varchar city
        varchar country
        varchar country_code
        timestamp event_date
        varchar image_url
        varchar image_key
        boolean featured
        text_array tags
        varchar status "draft | review | live | rejected | ended"
        timestamp created_at
        timestamp updated_at
    }

    TICKET_TYPES {
        uuid id PK
        uuid event_id FK
        varchar name
        decimal price
        varchar currency
        integer total_quantity
        integer sold_quantity
        timestamp created_at
    }

    TICKETS {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        uuid ticket_type_id FK
        varchar qr_code_hash
        integer quantity
        decimal total_amount
        varchar currency
        varchar status "pending | confirmed | used | cancelled"
        timestamp purchased_at
        timestamp used_at
    }

    PENDING_PAYMENTS {
        uuid id PK
        varchar reference UK
        varchar provider "paystack | mpesa | momo"
        uuid user_id FK
        uuid event_id FK
        uuid ticket_type_id FK
        integer quantity
        decimal amount
        varchar currency
        varchar status "pending | success | failed"
        varchar provider_reference
        timestamp created_at
        timestamp updated_at
    }

    PAYOUTS {
        uuid id PK
        uuid creator_id FK
        decimal amount
        varchar currency
        varchar status "pending | paid | rejected"
        jsonb destination
        timestamp requested_at
        timestamp resolved_at
    }

    EVENT_REPORTS {
        uuid id PK
        uuid event_id FK
        uuid reporter_id FK
        varchar reason
        text details
        varchar status "pending | reviewed | dismissed"
        timestamp created_at
        timestamp resolved_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        varchar type
        varchar title
        text message
        jsonb data
        boolean is_read
        timestamp created_at
    }

    QUESTS {
        uuid id PK
        varchar slug UK
        varchar name
        text description
        varchar match_rule "category | tag | early_bird | any"
        varchar required_category
        varchar required_tag
        integer early_bird_days
        integer target_count
        integer points_reward
        varchar collectible_slug
        varchar collectible_name
        varchar collectible_rarity "common | rare | epic | legendary"
        varchar badge_image_key
        integer sort_order
        boolean active
    }

    KULTROIN_WALLETS {
        uuid id PK
        uuid user_id FK,UK
        integer balance
        integer lifetime_earned
        timestamp updated_at
    }

    KULTROIN_LEDGER {
        uuid id PK
        uuid user_id FK
        integer amount
        varchar direction "credit | debit"
        varchar reason "quest_completion | pass_purchase | streak_bonus | perk_redemption"
        varchar idempotency_key UK
        varchar reference_type
        uuid reference_id
        timestamp created_at
    }

    USER_QUEST_PROGRESS {
        uuid id PK
        uuid user_id FK
        uuid quest_id FK
        integer progress
        boolean completed
        timestamp completed_at
    }

    EVENT_CHECKINS {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        uuid ticket_id FK
        timestamp checked_in_at
    }

    COLLECTIBLE_INVENTORY {
        uuid id PK
        uuid user_id FK
        varchar slug
        varchar name
        varchar rarity "common | rare | epic | legendary"
        varchar image_key
        timestamp earned_at
    }

    KULTR_PASS_SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK,UK
        varchar tier "kultr_pass"
        integer multiplier "2"
        timestamp activated_at
        timestamp expires_at
    }

    KULTR_PASS_PAYMENTS {
        uuid id PK
        varchar reference UK
        varchar provider "paystack | mpesa | momo"
        uuid user_id FK
        decimal amount
        varchar currency
        varchar status "pending | success | failed"
        varchar provider_reference
        timestamp created_at
    }

    PERKS {
        uuid id PK
        varchar slug UK
        varchar name
        text description
        integer cost
        boolean repeatable
        boolean active
    }

    USER_PERK_UNLOCKS {
        uuid id PK
        uuid user_id FK
        uuid perk_id FK
        integer cost_paid
        timestamp unlocked_at
    }

    BEVERAGE_PRODUCTS {
        uuid id PK
        varchar sku UK
        varchar name
        varchar flavor
        text description
        integer pack_size
        varchar image_url
        boolean is_active
        timestamp created_at
    }

    EVENT_BEVERAGE_BUNDLES {
        uuid id PK
        uuid event_id FK
        uuid product_id FK
        varchar name
        text description
        decimal price
        varchar currency
        integer total_quantity
        integer sold_quantity
        boolean is_active
        timestamp created_at
    }

    PENDING_PAYMENT_ITEMS {
        uuid id PK
        uuid pending_payment_id FK
        varchar item_type "beverage_bundle"
        uuid item_id FK
        integer quantity
        decimal unit_price
        decimal total_price
    }

    BEVERAGE_VOUCHERS {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        uuid bundle_id FK
        varchar voucher_code UK
        varchar qr_signature
        integer total_units
        integer redeemed_units
        varchar status "active | redeemed | cancelled"
        timestamp created_at
        timestamp redeemed_at
    }

    VOUCHER_REDEMPTION_LOGS {
        uuid id PK
        uuid voucher_id FK
        uuid redeemed_by_user_id FK
        integer units_redeemed
        varchar device_id
        timestamp redeemed_at
    }
```
