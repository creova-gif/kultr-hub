# 09 — API Specification & Endpoint Catalog

> **Volume 09 — Complete REST API Catalog, Contracts & Runtime Signatures**  
> **Prepared by:** Backend Lead & API Contract Engineer  
> **Evidence Status:** `VERIFIED` across `lib/api-spec/openapi.yaml` and `artifacts/api-server/src/routes/`

---

## 1. API Architecture & Standards

- **Base URL:** `/api`
- **Protocol:** HTTP/1.1 and HTTP/2 over TLS 1.3
- **Data Exchange Format:** `application/json; charset=utf-8`
- **Authentication Scheme:** `Authorization: Bearer <JWT>`
- **Error Format:** Standardized `{ message: string, code?: string, errors?: Record<string, string[]> }`
- **Rate Limits:** Global: 120 req/min; Auth: 10 req/min; OTP: 3 req/min.

---

## 2. Complete Endpoint Reference

### 2.1 System & Health (`health.ts`)
| Method & Path | Auth / Role | Description | Response Codes |
|:---|:---|:---|:---|
| `GET /api/healthz` | Public | Returns system health, database connectivity, and uptime. | `200` |

---

### 2.2 Authentication & User Identity (`auth.ts`)
| Method & Path | Auth / Role | Description | Request Body | Response Codes |
|:---|:---|:---|:---|:---|
| `POST /api/auth/signup` | Public | Register account with email and password. | `{ email, password, displayName, phone? }` | `201`, `400`, `409` |
| `POST /api/auth/login` | Public | Authenticate via email & password. | `{ email, password }` | `200`, `401` |
| `POST /api/auth/otp/request` | Public | Request SMS verification code. | `{ phone }` | `200`, `400`, `429` |
| `POST /api/auth/otp/verify` | Public | Verify SMS OTP and mint JWT. | `{ phone, code }` | `200`, `401`, `429` |
| `POST /api/auth/logout` | User | Invalidate session by bumping `tokenVersion`. | None | `200`, `401` |
| `GET /api/auth/me` | User | Retrieve current user profile. | None | `200`, `401` |

---

### 2.3 User Account & Privacy Rights (`users.ts`)
| Method & Path | Auth / Role | Description | Request / Query | Response Codes |
|:---|:---|:---|:---|:---|
| `GET /api/users/:id/public` | Public | Fetch public organizer trust metadata. | None | `200`, `404` |
| `PATCH /api/users/:id/verify`| Admin | Grant or revoke "Verified Organizer" badge. | `{ isVerifiedOrganizer: boolean }` | `200`, `400`, `403` |
| `GET /api/users/me/export` | User | DPA/GDPR data export in machine-readable JSON.| None | `200`, `401` |
| `DELETE /api/users/me` | User | Right to erasure; delete account and data. | None | `200`, `401`, `409` (if active tickets exist) |

---

### 2.4 Events & Discovery (`events.ts`)
| Method & Path | Auth / Role | Description | Parameters & Body | Response Codes |
|:---|:---|:---|:---|:---|
| `GET /api/events` | Public | List live events with category/date/price filters.| `?category,dateFrom,dateTo,priceMin,priceMax,limit` | `200` |
| `GET /api/events/search` | Public | Full-text search across titles, venues, and cities.| `?q=afrobeats&limit=20` | `200` |
| `GET /api/events/:id` | Public | Detailed event view with ticket tiers. | None | `200`, `404` |
| `POST /api/events` | User | Create a new event (enters `'review'` status). | `{ title, category, venue, city, country, eventDate, tiers }` | `201`, `400`, `401` |
| `GET /api/events/creator/me` | User | List all events created by signed-in user. | None | `200`, `401` |
| `GET /api/events/creator/analytics`| User | Aggregate creator sales GMV and ticket metrics. | None | `200`, `401` |
| `PATCH /api/events/:id/status`| Admin | Moderate event (`'live'`, `'rejected'`, `'ended'`).| `{ status: "live" \| "rejected" \| "ended" }` | `200`, `400`, `403` |
| `POST /api/events/:id/report` | User | Report an event for fraud or policy violations. | `{ reason, details }` | `201`, `400`, `401` |
| `GET /api/events/admin/reports`| Admin | List all pending buyer reports. | None | `200`, `403` |
| `PATCH /api/events/admin/reports/:id`| Admin | Mark report reviewed or dismissed. | `{ status: "reviewed" \| "dismissed" }` | `200`, `403` |

---

### 2.5 Tickets & Verification (`tickets.ts`)
| Method & Path | Auth / Role | Description | Parameters & Body | Response Codes |
|:---|:---|:---|:---|:---|
| `GET /api/tickets` | User | List all tickets owned by the signed-in user. | None | `200`, `401` |
| `GET /api/tickets/:id` | User | Detailed ticket view with scannable QR hash. | None | `200`, `401`, `404` |
| `PATCH /api/tickets/:id` | Staff/Admin | Mark ticket used at door gate. | `{ status: "used" }` | `200`, `400`, `403` |

---

### 2.6 Payments & Gateways (`payments.ts`)
| Method & Path | Auth / Role | Description | Request Body | Response Codes |
|:---|:---|:---|:---|:---|
| `POST /api/payments/init` | User | Initialize Paystack card payment transaction. | `{ eventId, ticketTypeId, quantity, beverageBundleId? }` | `200`, `400`, `409` |
| `POST /api/payments/verify` | User | Verify Paystack card transaction and issue tickets.| `{ reference }` | `200`, `400`, `404` |
| `POST /api/payments/mpesa/stk-push`| User | Initiate Safaricom M-Pesa STK Push. | `{ eventId, ticketTypeId, quantity, phone }` | `200`, `400`, `409` |
| `POST /api/payments/mpesa/verify` | User | Verify M-Pesa STK push and issue tickets. | `{ reference }` | `200`, `400` |
| `POST /api/payments/momo/request` | User | Initiate MTN Mobile Money Request-to-Pay. | `{ eventId, ticketTypeId, quantity, phone }` | `200`, `400`, `409` |
| `POST /api/payments/momo/verify` | User | Verify MTN MoMo transaction and issue tickets. | `{ reference }` | `200`, `400` |
| `POST /api/payments/pass/init` | User | Initiate KULTR PASS subscription payment. | `{ provider, phone? }` | `200`, `400` |
| `POST /api/payments/pass/verify` | User | Verify KULTR PASS payment and activate 2x multiplier.| `{ reference }` | `200`, `400` |

---

### 2.7 Creator Payouts & Settlement (`payouts.ts`)
| Method & Path | Auth / Role | Description | Request Body | Response Codes |
|:---|:---|:---|:---|:---|
| `GET /api/payouts/balance` | User | Compute available payout balance via real-time SQL.| None | `200`, `401` |
| `GET /api/payouts` | User | List all payout requests submitted by creator. | None | `200`, `401` |
| `POST /api/payouts` | User | Request payout withdrawal to bank or mobile money. | `{ amount, currency, destination }` | `201`, `400`, `409` |
| `GET /api/payouts/admin/pending`| Admin | Queue of pending payouts awaiting disbursement. | None | `200`, `403` |
| `PATCH /api/payouts/:id` | Admin | Resolve payout request (`'paid'` or `'rejected'`). | `{ status: "paid" \| "rejected" }` | `200`, `400`, `403` |

---

### 2.8 Gamification, Quests & Perks (`gamification.ts`)
| Method & Path | Auth / Role | Description | Request Body | Response Codes |
|:---|:---|:---|:---|:---|
| `GET /api/quests/progress` | User | Fetch wallet balance, multiplier, quests & badges. | None | `200`, `401` |
| `POST /api/check-in/verify` | User | Authenticate attendance and advance cultural quests.| `{ eventId, ticketId? }` | `200`, `400`, `401` |
| `GET /api/wallet/ledger` | User | Fetch tamper-evident KULTROIN transaction ledger. | None | `200`, `401` |
| `GET /api/perks` | User | List all redeemable backstage perks. | None | `200`, `401` |
| `POST /api/perks/unlock` | User | Spend KULTROINS to unlock a backstage perk. | `{ perkId }` | `200`, `400`, `409` |
| `POST /api/pass/activate` | User | Activate KULTR PASS subscription directly. | None | `200`, `401` |

---

### 2.9 Notifications (`notifications.ts`)
| Method & Path | Auth / Role | Description | Response Codes |
|:---|:---|:---|:---|
| `GET /api/notifications` | User | List all user notifications with unread counts. | `200`, `401` |
| `PATCH /api/notifications/:id/read`| User | Mark a specific notification as read. | `200`, `401` |
| `POST /api/notifications/read-all`| User | Mark all notifications read. | `200`, `401` |

---

### 2.10 Beverage Commerce Loop (`beverages.ts`)
| Method & Path | Auth / Role | Description | Request Body | Response Codes |
|:---|:---|:---|:---|:---|
| `GET /api/beverages` | Public | List all active Kultr Canned Drink SKUs. | None | `200` |
| `POST /api/beverages/events/:eventId/bundles`| User/Creator | Allocate beverage bundle to an event. | `{ productId, price, currency, totalQuantity }`| `201`, `400`, `401` |
| `GET /api/beverages/events/:eventId/bundles` | Public | List pre-sale beverage bundles for an event. | None | `200` |
| `GET /api/beverages/my-vouchers` | User | List purchased Bar Passes with QR signatures. | None | `200`, `401` |
| `POST /api/beverages/redeem` | Staff/User | Bartender scanner endpoint to redeem/decrement cans.| `{ voucherCode, unitsToRedeem, signature, deviceId? }` | `200`, `400`, `409` |
| `GET /api/beverages/vouchers/:code`| Staff/User | Inspect bar pass validity and remaining cans. | None | `200`, `404` |
