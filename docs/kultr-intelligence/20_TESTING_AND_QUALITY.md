# 20 — Testing Strategy & Quality Assurance

> **Volume 20 — Test Suites, Concurrency Verification & Quality Gates**  
> **Prepared by:** Lead QA Engineer & Backend Testing Architect  
> **Evidence Status:** `VERIFIED` across test files in `artifacts/api-server/src/**/__tests__/`

---

## 1. Testing Philosophy & Test Pyramid

Kultr adheres to a testing philosophy centered on **business invariants and transaction safety**. While UI snapshots change frequently, payment state machines, inventory locks, and auth revocation must *never* regress.

```
                  THE KULTR TESTING PYRAMID
                             /\
                            /  \  E2E User Flows (Manual / Detox)
                           /----\
                          /      \  Integration Tests (Supertest + DB)
                         /--------\
                        /          \  Unit Tests (JWT, Simulation, Validation)
                       /------------\
```

---

## 2. Verified Test Suite Catalog

The API server contains **9 specialized automated test suites**:

| Test Suite File | Layer | What It Verifies | Status |
|:---|:---:|:---|:---:|
| `artifacts/api-server/src/lib/__tests__/simulation.test.ts` | Unit | Strictly asserts that `simulationAllowed()` returns `false` whenever `NODE_ENV === "production"`. | **`VERIFIED`** |
| `artifacts/api-server/src/lib/__tests__/jwt.test.ts` | Unit | Tests token signing, HS256 algorithm enforcement, expiry parsing, and secret resolution. | **`VERIFIED`** |
| `artifacts/api-server/src/lib/__tests__/issue-validate-quantity.test.ts` | Unit | Asserts bounds checking on ticket purchases ($1 \le q \le 10$), rejecting zero, negative, or excessive counts. | **`VERIFIED`** |
| `artifacts/api-server/src/middleware/__tests__/auth.integration.test.ts` | Integration | Validates `tokenVersion` DB check, rejecting revoked tokens immediately after user logout. | **`VERIFIED`** |
| `artifacts/api-server/src/lib/__tests__/issue.integration.test.ts` | Integration | Tests database transaction rollback and `409 Conflict ("sold_out")` under capacity exhaustion. | **`VERIFIED`** |
| `artifacts/api-server/src/routes/__tests__/events-status.integration.test.ts` | Integration | Tests creator event drafting (`'review'`) and admin status moderation transitions (`'live'`, `'rejected'`). | **`VERIFIED`** |
| `artifacts/api-server/src/routes/__tests__/payments.integration.test.ts` | Integration | Tests end-to-end checkout flow for Paystack card, M-Pesa STK, and MoMo request. | **`VERIFIED`** |
| `artifacts/api-server/src/routes/__tests__/payouts.integration.test.ts` | Integration | Tests balance computation, preventing creators from requesting more than earned net revenue. | **`VERIFIED`** |
| `artifacts/api-server/src/routes/__tests__/beverages.integration.test.ts` | Integration | Tests beverage bundle checkout, HMAC voucher issuance, and bartender multi-can decrement. | **`VERIFIED`** |

---

## 3. High-Risk Concurrency & Load Testing

A critical test scenario verified in `issue.integration.test.ts`:
- **The Test Case:** An event ticket tier has exactly 1 remaining ticket. Two simulated concurrent buyer requests hit the checkout endpoint simultaneously.
- **The Execution:** Both requests initiate a transaction. One request acquires the row lock (`SELECT FOR UPDATE`), increments `soldQuantity` to 1, and succeeds. The second request waits, evaluates the updated row, recognizes `available === 0`, rolls back cleanly, and receives an HTTP 409 error.
- **Result:** Exactly 1 ticket is minted; zero overselling occurs.

---

## 4. Testing Gaps & Recommended QA Enhancements

1. **Native Mobile E2E Testing (`PROPOSED`):** Implement Maestro or Detox automated tests on iOS/Android emulators to validate camera barcode scanning and offline wallet rendering.
2. **Payment Gateway Sandbox Mock Server (`PROPOSED`):** Implement MSW (Mock Service Worker) to mock Safaricom Daraja STK timeout callbacks and network dropped connections.
