# 04 — Product Requirements Document (PRD)

> **Volume 04 — Authoritative System Specifications, Invariants & Standards**  
> **Prepared by:** Chief Product Officer & Lead System Architect  
> **Evidence Status:** `VERIFIED` (Implemented Specification) compared against `DOCUMENTED` (Original PRD)

---

## 1. System Vision & Functional Scope

The Kultr platform delivers an integrated digital ecosystem spanning consumer discovery, mobile checkout, creator management, on-site operations, and community loyalty across global African and Caribbean cultural capitals.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      FUNCTIONAL REQUIREMENT DOMAINS                     │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. CONSUMER EXP    │ 2. CHECKOUT & TIX  │ 3. CREATOR & ADMIN           │
│ • Hub Discovery    │ • Pessimistic Lock │ • Event Lifecycle Engine     │
│ • Culture Compass  │ • M-Pesa / MoMo    │ • Real-time Studio Analytics │
│ • Vibe Tribes      │ • Paystack Cards   │ • Payout Balance Calculator  │
│ • Quests & Rewards │ • Crypto QR Ticket │ • Moderation & Fraud Queue   │
│ • Bar Pass Wallet  │ • Express Bar Pass │ • Door & Bar Scanner Apps    │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 2. Detailed Functional Requirements

### FR-01: Authentication & Identity Management
- **FR-01.1 Email/Password Auth:** Users can register and authenticate using email and password (`POST /api/auth/signup`, `POST /api/auth/login`). Passwords must be hashed using bcrypt (salt rounds >= 10).
- **FR-01.2 SMS One-Time Passcode (OTP):** Users can authenticate via phone number. The system generates a cryptographically secure 6-digit OTP stored as a bcrypt hash with a 10-minute TTL and 5-attempt brute-force threshold (`POST /api/auth/otp/request`, `POST /api/auth/otp/verify`).
- **FR-01.3 Revocable Session Tokens:** JWTs (HS256) must embed a `tokenVersion` counter. A database round-trip checks `tokenVersion` on every authenticated request. Calling `POST /api/auth/logout` increments `tokenVersion`, instantly revoking all active sessions across devices.
- **FR-01.4 Data Privacy & Compliance:** The system must provide a machine-readable JSON data export (`GET /api/users/me/export`) and execute safe account erasure (`DELETE /api/users/me`), blocking deletion if the user is an organizer with active attendee tickets.

### FR-02: Cultural Event Discovery & Navigation
- **FR-02.1 Cultural Capital Hubs:** The app home feed must feature an interactive hub switcher (`🌍 Global Diaspora`, `🇬🇧 London`, `🇺🇸 New York`, `🇨🇦 Toronto`, `🇫🇷 Paris`, `🇳🇬 Lagos`, `🇬🇭 Accra`, `🇯🇲 Kingston`, `🇵🇹 Portugal`, `🇰🇪 Nairobi`) allowing instant scoping of events.
- **FR-02.2 Spatial Radar (Culture Compass):** The app must render an SVG radar map displaying stable algorithmic pins derived from real event IDs (`app/culture-compass.tsx`), dynamically reflecting category, hub, and price filters.
- **FR-02.3 Search & Multi-Param Filtering:** Full-text search across title, venue, city, country, and category (`GET /api/events/search`), coupled with server-side date-range and price-range subqueries.
- **FR-02.4 Multi-Currency Normalization:** The client engine (`constants/currencies.ts`) must support 10 diaspora currencies (KES, UGX, TZS, RWF, GHS, NGN, ZAR, USD, GBP, EUR, CAD, JMD, TTD, BBD) with dynamic conversion and display.

### FR-03: Concurrency-Guarded Ticketing & Checkout
- **FR-03.1 Anti-Overselling Concurrency Lock:** Ticket issuance must execute within an isolated database transaction acquiring a pessimistic row lock (`SELECT ... FOR UPDATE`) on the target `ticket_types` row (`artifacts/api-server/src/lib/issue.ts`). If `soldQuantity + quantity > totalQuantity`, the purchase must be rejected with `TicketIssueError("sold_out")`.
- **FR-03.2 Omnichannel Mobile Payments:**
  - **M-Pesa:** Server-side Daraja STK Push initiation sending a SIM toolkit prompt to the buyer's handset (`POST /api/payments/mpesa/stk-push`).
  - **MTN MoMo:** Request-to-Pay API generating an on-handset USSD approval prompt (`POST /api/payments/momo/request`).
  - **Paystack:** Hosted checkout URL for Visa/Mastercard/Amex/Apple Pay (`POST /api/payments/init`).
- **FR-03.3 Strict Simulation Gating:** Simulated payment execution is strictly prohibited when `NODE_ENV === "production"`, regardless of client request headers.
- **FR-03.4 Cryptographic Ticket Matrix:** Purchased tickets must generate a tamper-proof QR matrix (`components/QRDisplay.tsx`) rendering an algorithmic SHA-256 hash verifiable offline.

### FR-04: Festival Beverage Commerce Loop (Kultr Canned Drinks)
- **FR-04.1 Express Bar Pass Add-on:** Ticket checkout must allow adding pre-configured 4-pack beverage bundles (Cold Brew, Hibiscus, Ginger Punch) at a pre-sale discount (`app/checkout/[eventId].tsx`).
- **FR-04.2 Bar Pass Issuance:** Successful bundle purchase issues a `beverage_vouchers` record with a unique voucher code and HMAC-SHA256 signature (`artifacts/api-server/src/lib/issue-voucher.ts`).
- **FR-04.3 Bartender Scanner Tool:** Dedicated staff scanner (`app/bartender-scanner.tsx`) capable of scanning bar passes, validating cryptographic signatures, displaying remaining units, decrementing counters, and logging redemptions.

### FR-05: Creator Studio & Operations Suite
- **FR-05.1 Event Creation & Review Gate:** Creators draft events with multiple ticket tiers and optional drink allocations. Newly created events enter `status: 'review'` and cannot appear publicly until approved by an administrator (`app/create-event.tsx`).
- **FR-05.2 Real-time Sales Analytics:** Creator Studio displays live gross revenue, tickets sold, remaining capacity, and sales trends (`app/creator-studio.tsx`).
- **FR-05.3 Verified Payout Calculation:** Available payout balance must be calculated dynamically via SQL (`SUM(confirmed tickets) - SUM(pending/paid payouts)`), preventing client-side falsification or double withdrawals (`GET /api/payouts/balance`).

### FR-06: Administration, Trust & Fraud Prevention
- **FR-06.1 Admin Event Moderation:** Administrative queue (`app/admin.tsx`) allowing review, publication (`status: 'live'`), rejection (`status: 'rejected'`), or termination (`status: 'ended'`) of events.
- **FR-06.2 Fraud & Abuse Reporting:** Attendees can report events for misleading listings, suspected scams, or duplicate content (`POST /api/events/:id/report`). Reports are queued for administrative review.
- **FR-06.3 Organizer Trust Verification:** Admins can grant or revoke the "Verified Organizer" badge (`PATCH /api/users/:id/verify`), surfacing a verified shield icon on event listings.

### FR-07: Gamification, Loyalty & Rewards
- **FR-07.1 Verified Check-In Verification:** Attendees can check in to an event only if they hold a confirmed ticket. The check-in advances active cultural quests matching event categories/tags (`POST /api/check-in/verify`).
- **FR-07.2 Tamper-Evident KULTROIN Ledger:** Reward points are recorded in an append-only transaction ledger (`kultroin_ledger`) with unique idempotency keys preventing double-reward exploits.
- **FR-07.3 KULTR PASS Multiplier:** Active KULTR PASS subscribers receive a 2x points multiplier on all quest completions.
- **FR-07.4 Backstage Perks & Collectibles:** Users can spend KULTROINS to unlock digital perks (backstage access, exclusive drops) and earn collectible rarity badges (Common, Rare, Epic, Legendary).

---

## 3. Non-Functional Requirements (NFRs)

```
┌────────────────────────────────────────────────────────────────────────┐
│                       NON-FUNCTIONAL INVARIANTS                        │
├─────────────────────┬──────────────────────────────────────────────────┤
│ REQUIREMENT         │ SPECIFICATION & METRIC                           │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Mobile Performance  │ Initial feed render < 1.8s on 3G/4G connections; │
│                     │ 60 fps scroll performance (FlashList / FlatList).│
├─────────────────────┼──────────────────────────────────────────────────┤
│ Concurrency & ACID  │ Zero overselling; serialized row locks on ticket │
│                     │ inventories under 500 concurrent checkout req/s. │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Availability        │ 99.9% uptime target; Redis-backed rate limiting  │
│                     │ with automatic in-memory fallback.               │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Accessibility (a11y)│ WCAG 2.1 AA compliant; contrast ratio >= 4.5:1;  │
│                     │ full screen reader labels on tabs, chips & cards.│
├─────────────────────┼──────────────────────────────────────────────────┤
│ Offline Resilience  │ Tickets and Bar Passes viewable offline in local │
│                     │ SQLite / AsyncStorage cache; offline door scans. │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Security & Privacy  │ Passwords bcrypt-hashed; JWTs revocable;         │
│                     │ DPA/GDPR export & deletion endpoints implemented.│
└─────────────────────┴──────────────────────────────────────────────────┘
```

---

## 4. Key Performance Indicators (KPIs)

1. **Checkout Conversion Rate:** Target >= 65% on mobile money checkout initiation.
2. **Door & Bar Scan Latency:** Mean ticket and drink pass verification latency < 800ms.
3. **Double-Spend & Oversell Rate:** Exactly **0.00%** (mathematically enforced via DB row locks).
4. **Creator Retention:** Target >= 75% of creators publishing 2+ events within 90 days.
5. **Gamification Engagement:** Target >= 35% of ticket holders engaging with Cultural Quests or Vibe Tribes.
