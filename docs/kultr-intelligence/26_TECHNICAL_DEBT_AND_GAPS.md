# 26 — Technical Debt, Gaps & Remediation Plan

> **Volume 26 — Critical Technical Due-Diligence, Defect Inventory & Engineering Backlog**  
> **Prepared by:** Principal Systems Architect & Lead Security Engineer  
> **Evidence Status:** `VERIFIED` Audit against Live Repository Implementation

---

## 1. Technical Debt & Architectural Gaps Inventory

Every software platform possesses technical debt. In accordance with rigorous due-diligence standards, we identify six verified technical and operational gaps in the current implementation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TECHNICAL DEBT INVENTORY                        │
├──────┬──────────────────────────────────────────┬──────────────────────┤
│ ID   │ GAP DESCRIPTION                          │ SEVERITY & IMPACT    │
├──────┼──────────────────────────────────────────┼──────────────────────┤
│ G-01 │ Automated B2C Payout Rail Missing        │ HIGH (Operational)   │
│ G-02 │ APNs / FCM Native Push Notifications Open│ MEDIUM (Retention)   │
│ G-03 │ Static Cryptographic QR Matrix on Door Tix│ MEDIUM (Anti-Fraud) │
│ G-04 │ HTTP Polling on Gate / Scanner Counters  │ LOW (Scalability)    │
│ G-05 │ Test Suites Lack Native Mobile Driver    │ MEDIUM (QA Coverage) │
│ G-06 │ Redis Sentinel / Cluster Configuration   │ LOW (Reliability)    │
└──────┴──────────────────────────────────────────┴──────────────────────┘
```

---

## 2. Granular Gap Diagnostics & Remediation Plan

### Gap 1: Automated B2C Payout Money-Movement Rail
- **Current State (`VERIFIED`):** In `artifacts/api-server/src/routes/payouts.ts`, the system computes available balances with mathematical precision from confirmed ticket rows and manages withdrawal requests. However, when an administrator approves a payout (`PATCH /api/payouts/:id -> status: 'paid'`), it merely updates the database row. No automated API call initiates an M-Pesa B2C transfer or Paystack Transfer.
- **Risk:** High operational overhead requiring finance staff to execute batch bank transfers manually.
- **Remediation Plan:** Integrate Safaricom Daraja B2C API (`/mpesa/b2c/v1/paymentrequest`) and Paystack Transfer API within `payouts.ts`. When an admin approves a payout, the server dispatches the transfer automatically, holding the row in `'processing'` until gateway callback confirms settlement.
- **Estimated Effort:** 3 engineering days (P0 priority).

### Gap 2: Native APNs & FCM Push Notification Delivery
- **Current State (`VERIFIED`):** When tickets are purchased or events approved, `notify()` writes structured records into `notificationsTable`. The mobile client polls `GET /api/notifications` to render the in-app notification center (`app/notifications.tsx`).
- **Risk:** Users do not receive lock-screen push notifications when the app is closed.
- **Remediation Plan:** Integrate `expo-notifications` with Expo Application Services (EAS) credentials. When `notify()` executes, dispatch an HTTP push payload to the Expo Push Service targeting registered device push tokens.
- **Estimated Effort:** 2 engineering days (P1 priority).

### Gap 3: Time-Rolling Dynamic QR Matrix for Door Tickets
- **Current State (`VERIFIED`):** `tickets.qr_code_hash` is an algorithmic SHA-256 hash generated at purchase. While the database prevents reuse by marking `status = 'used'`, an attendee could send a screenshot to a friend seconds before entering, creating gate confusion if both attempt entry simultaneously.
- **Remediation Plan:** Upgrade door tickets to time-rolling TOTP codes (similar to Google Authenticator or Ticketmaster SafeTix), re-signing the QR matrix on the mobile device every 30 seconds.
- **Estimated Effort:** 4 engineering days (P2 priority).

### Gap 4: Real-Time WebSockets / SSE for Scanner Updates
- **Current State (`VERIFIED`):** Mobile client updates rely on React Query polling intervals and pull-to-refresh gestures.
- **Remediation Plan:** Implement Server-Sent Events (SSE) or a lightweight WebSocket gateway on `/events/:id/live-stats` so door staff and bartenders receive zero-latency push updates as tickets are scanned.
- **Estimated Effort:** 3 engineering days (P2 priority).
