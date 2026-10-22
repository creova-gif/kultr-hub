# 05 — Complete Feature Inventory & Traceability Matrix

> **Volume 05 — Granular Feature Catalog, State Invariants, Code Traceability & Visual Screen Mapping**  
> **Prepared by:** Chief Technology Officer & Lead QA Architect  
> **Evidence Status:** `VERIFIED` across codebase implementations and Figma visual designs

---

## 1. Domain Feature Catalog

### Domain A: Consumer Experience & Identity
1. **Email/Password Authentication:** Registration, hashed storage, JWT token issuance.
   - *Status:* `VERIFIED` (`POST /api/auth/signup`, `POST /api/auth/login`).
   - *Files:* `artifacts/api-server/src/routes/auth.ts`, `artifacts/kultr-mobile/app/login.tsx`.
   - *Figma UI Screen:* `assets/kultr-login.png` & `assets/kultr-signup-r.png`.
2. **Phone SMS OTP Authentication:** SMS OTP generation, bcrypt hash storage, attempt limiting.
   - *Status:* `VERIFIED` (`POST /api/auth/otp/request`, `POST /api/auth/otp/verify`).
   - *Files:* `artifacts/api-server/src/routes/auth.ts`, `artifacts/api-server/src/lib/sms.ts`.
   - *Figma UI Screen:* `assets/kultr-otp-r.png`.
3. **Revocable JWT Token Management:** Immediate multi-device invalidation via `tokenVersion`.
   - *Status:* `VERIFIED` (`POST /api/auth/logout`, `artifacts/api-server/src/lib/jwt.ts`).
   - *Figma UI Screen:* `assets/kultr-profile.png`.
4. **Data Subject Export (DPA/GDPR):** Full profile, tickets, ledger, and quest export in JSON.
   - *Status:* `VERIFIED` (`GET /api/users/me/export`, `artifacts/kultr-mobile/app/privacy-data.tsx`).
   - *Figma UI Screen:* `assets/kultr-privacy-data-r.png`.
5. **Right to Erasure (Account Deletion):** Cascade delete guarded against active attendee tickets.
   - *Status:* `VERIFIED` (`DELETE /api/users/me`, `artifacts/api-server/src/routes/users.ts`).
   - *Figma UI Screen:* `assets/kultr-delete-account-r.png`.
6. **Language & Locale Switcher:** In-app selection of English / Swahili / French.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/context/AppContext.tsx`).
   - *Figma UI Screen:* `assets/kultr-settings.png`.

### Domain B: Event Discovery & Navigation
1. **Global Diaspora Hub Switcher:** Instant filtering across 10 cultural capital hubs.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/app/(tabs)/index.tsx`).
   - *Figma UI Screen:* `assets/kultr-home.png` & `assets/kultr-city-selection-r.png`.
2. **Culture Compass Spatial Radar:** Algorithmic SVG radar map derived from real event IDs.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/app/culture-compass.tsx`).
   - *Figma UI Screen:* `assets/kultr-culture-compass.png`.
3. **Full-Text Multi-Param Search:** Search across title, city, venue, and country.
   - *Status:* `VERIFIED` (`GET /api/events/search`, `artifacts/kultr-mobile/app/(tabs)/discover.tsx`).
   - *Figma UI Screen:* `assets/kultr-search.png`.
4. **Server-Side Date & Price Filters:** Subquery price-range matching on `ticket_types`.
   - *Status:* `VERIFIED` (`artifacts/api-server/src/routes/events.ts:applyDateAndPriceFilters`).
   - *Figma UI Screen:* `assets/kultr-filter-sheet-r.png`.
5. **Vibe Tribes Community Carousels:** Community hubs for Afrobeats, Amapiano, Soca, Food, Fashion.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/app/vibe-tribes.tsx`).
   - *Figma UI Screen:* `assets/kultr-vibe-tribes.png`.
6. **Curated Event Categorization:** Music, Art, Food, Heritage, Nightlife, Sports, Comedy.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/constants/data.ts`).
   - *Figma UI Screen:* `assets/kultr-category-browse-r.png`.

### Domain C: Tickets & Checkout Engine
1. **Pessimistic Concurrency Lock:** Row-locked inventory reservation preventing overselling.
   - *Status:* `VERIFIED` (`artifacts/api-server/src/lib/issue.ts:issueTicket`).
   - *Figma UI Screen:* `assets/kultr-checkout-review-r.png`.
2. **Multi-Tier Ticket Selection:** Early Bird, Regular, VIP, VVIP with distinct pricing.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/app/event/[id].tsx`).
   - *Figma UI Screen:* `assets/kultr-event-detail.png`.
3. **Algorithmic QR Ticket Rendering:** Offline-resilient QR matrix generation.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/components/QRDisplay.tsx`).
   - *Figma UI Screen:* `assets/kultr-digital-ticket.png`.
4. **Ticket Retrieval & Wallet:** Upcoming and past ticket management with real-time status.
   - *Status:* `VERIFIED` (`GET /api/tickets`, `artifacts/kultr-mobile/app/(tabs)/tickets.tsx`).
   - *Figma UI Screen:* `assets/kultr-ticket-history-r.png`.
5. **Door Gate Ticket Validation:** Single-use status transition to `'used'`.
   - *Status:* `VERIFIED` (`PATCH /api/tickets/:id`).
   - *Figma UI Screen:* `assets/kultr-event-checkin-r.png`.

### Domain D: Payments & Settlements
1. **Safaricom M-Pesa Daraja STK Push:** Direct SIM toolkit prompt on buyer handset.
   - *Status:* `VERIFIED` (`POST /api/payments/mpesa/stk-push`, `lib/mpesa.ts`).
   - *Figma UI Screen:* `assets/kultr-payment-processing-r.png`.
2. **MTN Mobile Money Request-to-Pay:** USSD debit request API integration.
   - *Status:* `VERIFIED` (`POST /api/payments/momo/request`, `lib/mtn-momo.ts`).
   - *Figma UI Screen:* `assets/kultr-payment-method-r.png`.
3. **Paystack Card Gateway:** 3DS credit/debit card processing and Apple Pay.
   - *Status:* `VERIFIED` (`POST /api/payments/init`, `lib/paystack.ts`).
   - *Figma UI Screen:* `assets/kultr-payment-method-r.png`.
4. **Simulation Mode Hardening:** Server-enforced barrier blocking test mode in production.
   - *Status:* `VERIFIED` (`artifacts/api-server/src/lib/simulation.ts`).
   - *Figma UI Screen:* `assets/kultr-payment-failed-r.png`.
5. **Creator Payout Balance Engine:** SQL aggregation of confirmed sales minus payouts.
   - *Status:* `VERIFIED` (`GET /api/payouts/balance`, `artifacts/api-server/src/routes/payouts.ts`).
   - *Figma UI Screen:* `assets/kultr-payouts-r.png`.
6. **Multi-Currency Engine:** 10 diaspora currencies with real-time display conversion.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/constants/currencies.ts`).
   - *Figma UI Screen:* `assets/kultr-currency-settings-r.png`.

### Domain E: Creator Studio Suite
1. **Multi-Step Event Creator Form:** Event drafting with media, location, tiers, and drink bundles.
   - *Status:* `VERIFIED` (`POST /api/events`, `artifacts/kultr-mobile/app/create-event.tsx`).
   - *Figma UI Screen:* `assets/kultr-create-event.png`.
2. **Admin Review Publication Gate:** New events isolated in `status: 'review'` until verified.
   - *Status:* `VERIFIED` (`artifacts/api-server/src/routes/events.ts`).
   - *Figma UI Screen:* `assets/kultr-event-status-review-r.png`.
3. **Real-time Creator Analytics:** Dynamic tracking of gross GMV, tickets sold, and velocity.
   - *Status:* `VERIFIED` (`GET /api/events/creator/analytics`, `app/creator-studio.tsx`).
   - *Figma UI Screen:* `assets/kultr-creator-dashboard.png` & `assets/kultr-analytics-detail-r.png`.
4. **Self-Serve Payout Requests:** Submission of bank / mobile money payout requests.
   - *Status:* `VERIFIED` (`POST /api/payouts`, `artifacts/kultr-mobile/app/payouts.tsx`).
   - *Figma UI Screen:* `assets/kultr-payouts-r.png`.
5. **Staff Scanner Launcher:** Direct launcher for Door Scanner and Bartender Scanner.
   - *Status:* `VERIFIED` (`artifacts/kultr-mobile/app/creator-studio.tsx`).
   - *Figma UI Screen:* `assets/kultr-qr-scanner-r.png`.

### Domain F: Administration & Trust Operations
1. **Admin Event Review Queue:** Approval (`'live'`), rejection (`'rejected'`), termination.
   - *Status:* `VERIFIED` (`PATCH /api/events/:id/status`, `app/admin.tsx`).
   - *Figma UI Screen:* `assets/kultr-admin-review-r.png`.
2. **Fraud & Abuse Report Triage:** Attendee complaint queue with dismissal/action tools.
   - *Status:* `VERIFIED` (`GET /api/events/admin/reports`, `PATCH /api/events/admin/reports/:id`).
   - *Figma UI Screen:* `assets/kultr-report-event-r.png`.
3. **Organizer Verification Badging:** Grant/revoke "Verified Organizer" shield badge.
   - *Status:* `VERIFIED` (`PATCH /api/users/:id/verify`).
   - *Figma UI Screen:* `assets/kultr-creator-dashboard.png`.
4. **Admin Payout Resolution Queue:** Review and approve pending creator payout disbursements.
   - *Status:* `VERIFIED` (`GET /api/payouts/admin/pending`, `PATCH /api/payouts/:id`).
   - *Figma UI Screen:* `assets/kultr-admin-review-r.png`.

### Domain G: Gamification, Loyalty & Quests
1. **Verified Event Check-In:** Ticket-verified check-in advancing matching quests.
   - *Status:* `VERIFIED` (`POST /api/check-in/verify`, `lib/gamification.ts`).
   - *Figma UI Screen:* `assets/kultr-social-checkin.png`.
2. **Tamper-Evident KULTROIN Ledger:** Append-only points ledger with unique idempotency keys.
   - *Status:* `VERIFIED` (`artifacts/api-server/src/routes/gamification.ts`).
   - *Figma UI Screen:* `assets/kultr-kultroin-wallet-r.png`.
3. **KULTR PASS Multiplier:** 2x point bonus on quest rewards for paid pass holders.
   - *Status:* `VERIFIED` (`artifacts/api-server/src/lib/gamification.ts:getMultiplier`).
   - *Figma UI Screen:* `assets/kultr-pass-subscribe.png`.
4. **Collectibles & Rarity Badges:** Automated minting of Common, Rare, Epic, Legendary badges.
   - *Status:* `VERIFIED` (`collectible_inventory`, `app/quests.tsx`).
   - *Figma UI Screen:* `assets/kultr-collectibles-gallery-r.png` & `assets/kultr-streaks-badges.png`.
5. **Backstage Perks Store:** Point-redemption store for VIP lounge and exclusive content.
   - *Status:* `VERIFIED` (`GET /api/perks`, `POST /api/perks/unlock`).
   - *Figma UI Screen:* `assets/kultr-perks-catalog-r.png` & `assets/kultr-perk-unlock-success-r.png`.

### Domain H: Notifications System
1. **Transactional Notification Minting:** Automated alerts for tickets, payouts, and quests.
   - *Status:* `VERIFIED` (`artifacts/api-server/src/lib/notify.ts`).
   - *Figma UI Screen:* `assets/kultr-notifications.png`.
2. **In-App Notification Feed:** Notification center with read status tracking.
   - *Status:* `VERIFIED` (`GET /api/notifications`, `artifacts/kultr-mobile/app/notifications.tsx`).
   - *Figma UI Screen:* `assets/kultr-notifications.png`.
3. **Bulk Mark as Read:** Single-tap read state update.
   - *Status:* `VERIFIED` (`POST /api/notifications/read-all`).
   - *Figma UI Screen:* `assets/kultr-notifications.png`.

### Domain I: Beverage Commerce Loop (Kultr Canned Drinks)
1. **Beverage Catalog & SKU Setup:** Admin/system management of drink SKUs and 4-packs.
   - *Status:* `VERIFIED` (`beverage_products`, `GET /api/beverages`).
   - *Figma UI Screen:* `assets/kultr-checkout-review-r.png`.
2. **Event Bundle Allocation:** Creator provisioning of pre-sold bundles at event creation.
   - *Status:* `VERIFIED` (`POST /api/beverages/events/:eventId/bundles`).
   - *Figma UI Screen:* `assets/kultr-create-event.png`.
3. **Checkout Drink Pass Add-on:** Ticket checkout add-on with pre-sale discount.
   - *Status:* `VERIFIED` (`pending_payment_items`, `app/checkout/[eventId].tsx`).
   - *Figma UI Screen:* `assets/kultr-checkout-review-r.png`.
4. **Cryptographic Bar Pass Issuance:** HMAC-signed digital pass with unit counters.
   - *Status:* `VERIFIED` (`beverage_vouchers`, `app/bar-pass/[id].tsx`).
   - *Figma UI Screen:* `assets/kultr-digital-ticket.png`.
5. **Bartender Camera Scanner:** On-device camera scanner with multi-can decrement.
   - *Status:* `VERIFIED` (`app/bartender-scanner.tsx`, `POST /api/beverages/redeem`).
   - *Figma UI Screen:* `assets/kultr-qr-scanner-r.png`.

---

## 2. Feature Traceability Matrix

| Feature | Frontend Screen | Figma Screen Asset | Backend API Route | Primary DB Table | Test Suite File | Status |
|:---|:---|:---|:---|:---|:---|:---:|
| **User Registration** | `app/login.tsx` | `assets/kultr-signup-r.png` | `POST /api/auth/signup` | `users` | `middleware/__tests__/auth.integration.test.ts` | **`VERIFIED`** |
| **Phone SMS OTP** | `app/login.tsx` | `assets/kultr-otp-r.png` | `POST /api/auth/otp/verify` | `otp_codes` | `routes/__tests__/events-status.integration.test.ts` | **`VERIFIED`** |
| **Session Invalidation** | `app/(tabs)/profile.tsx` | `assets/kultr-profile.png` | `POST /api/auth/logout` | `users.token_version` | `lib/__tests__/jwt.test.ts` | **`VERIFIED`** |
| **Data Export (DPA)** | `app/privacy-data.tsx` | `assets/kultr-privacy-data-r.png` | `GET /api/users/me/export` | `users`, `tickets` | Manual Execution Verified | **`VERIFIED`** |
| **Account Erasure** | `app/privacy-data.tsx` | `assets/kultr-delete-account-r.png`| `DELETE /api/users/me` | `users` | Manual Execution Verified | **`VERIFIED`** |
| **Hub Switcher** | `app/(tabs)/index.tsx` | `assets/kultr-home.png` | `GET /api/events` | `events` | `routes/__tests__/events-status.integration.test.ts` | **`VERIFIED`** |
| **Culture Compass** | `app/culture-compass.tsx`| `assets/kultr-culture-compass.png`| `GET /api/events` | `events` | Manual Execution Verified | **`VERIFIED`** |
| **Event Search** | `app/(tabs)/discover.tsx`| `assets/kultr-search.png` | `GET /api/events/search` | `events`, `ticket_types` | Manual Execution Verified | **`VERIFIED`** |
| **Ticket Issuance Lock**| `app/checkout/[eventId].tsx`| `assets/kultr-checkout-review-r.png`| `POST /api/payments/verify` | `ticket_types`, `tickets` | `lib/__tests__/issue.integration.test.ts` | **`VERIFIED`** |
| **Quantity Validation** | `app/checkout/[eventId].tsx`| `assets/kultr-event-detail.png` | `POST /api/payments/init` | `ticket_types` | `lib/__tests__/issue-validate-quantity.test.ts` | **`VERIFIED`** |
| **M-Pesa STK Push** | `app/checkout/[eventId].tsx`| `assets/kultr-payment-processing-r.png`| `POST /api/payments/mpesa/stk-push`| `pending_payments` | `routes/__tests__/payments.integration.test.ts` | **`VERIFIED`** |
| **Simulation Guard** | Server-wide | `assets/kultr-payment-failed-r.png`| All payment endpoints | N/A | `lib/__tests__/simulation.test.ts` | **`VERIFIED`** |
| **Event Creation** | `app/create-event.tsx` | `assets/kultr-create-event.png` | `POST /api/events` | `events`, `ticket_types` | `routes/__tests__/events-status.integration.test.ts` | **`VERIFIED`** |
| **Admin Event Gate** | `app/admin.tsx` | `assets/kultr-admin-review-r.png` | `PATCH /api/events/:id/status` | `events.status` | `routes/__tests__/events-status.integration.test.ts` | **`VERIFIED`** |
| **Creator Analytics** | `app/creator-studio.tsx` | `assets/kultr-creator-dashboard.png`| `GET /api/events/creator/analytics`| `events`, `tickets` | Manual Execution Verified | **`VERIFIED`** |
| **Payout Calculation** | `app/payouts.tsx` | `assets/kultr-payouts-r.png` | `GET /api/payouts/balance` | `tickets`, `payouts` | `routes/__tests__/payouts.integration.test.ts` | **`VERIFIED`** |
| **Fraud Reporting** | `app/event/[id].tsx` | `assets/kultr-report-event-r.png` | `POST /api/events/:id/report` | `event_reports` | Manual Execution Verified | **`VERIFIED`** |
| **Organizer Badging** | `app/admin.tsx` | `assets/kultr-creator-dashboard.png`| `PATCH /api/users/:id/verify` | `users.is_verified_organizer` | Manual Execution Verified | **`VERIFIED`** |
| **Verified Check-In** | `app/quests.tsx` | `assets/kultr-social-checkin.png` | `POST /api/check-in/verify` | `event_checkins`, `quests`| Manual Execution Verified | **`VERIFIED`** |
| **Tamper-Evident Ledger**| `app/rewards.tsx` | `assets/kultr-kultroin-wallet-r.png`| `GET /api/wallet/ledger` | `kultroin_ledger` | Manual Execution Verified | **`VERIFIED`** |
| **KULTR PASS Multiplier**| `app/gamification.tsx` | `assets/kultr-pass-subscribe.png`| `POST /api/pass/activate` | `kultr_pass_subscriptions` | Manual Execution Verified | **`VERIFIED`** |
| **Drink Pass Add-on** | `app/checkout/[eventId].tsx`| `assets/kultr-checkout-review-r.png`| `POST /api/payments/init` | `pending_payment_items` | `routes/__tests__/beverages.integration.test.ts` | **`VERIFIED`** |
| **Bar Pass Voucher** | `app/bar-pass/[id].tsx` | `assets/kultr-digital-ticket.png` | `GET /api/beverages/my-vouchers` | `beverage_vouchers` | `routes/__tests__/beverages.integration.test.ts` | **`VERIFIED`** |
| **Bartender Scanner** | `app/bartender-scanner.tsx`| `assets/kultr-qr-scanner-r.png` | `POST /api/beverages/redeem` | `voucher_redemption_logs` | `routes/__tests__/beverages.integration.test.ts` | **`VERIFIED`** |
