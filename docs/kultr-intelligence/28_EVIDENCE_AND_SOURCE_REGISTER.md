# 28 — Evidence & Source Traceability Register

> **Volume 28 — Audit Trail, Source Code Register & Citation Matrix**  
> **Prepared by:** Lead Audit Architect & Technical Due-Diligence Lead  
> **Evidence Status:** `VERIFIED` Source Code Mapping & External Citations

---

## 1. Codebase Implementation Source Register

Every technical claim in this 29-volume knowledge base is traced directly to exact repository files and line symbols:

| Technical Claim / Invariant | Exact File Path in Repository | Relevant Code Symbol / Lines | Evidence Category |
|:---|:---|:---|:---:|
| **Pessimistic Concurrency Lock** | `artifacts/api-server/src/lib/issue.ts` | `issueTicket()` / lines 25–55 | **`VERIFIED`** |
| **Quantity Bounds Validation** | `artifacts/api-server/src/lib/issue.ts` | `validateQuantity()` / lines 10–22 | **`VERIFIED`** |
| **Simulation Mode Barrier** | `artifacts/api-server/src/lib/simulation.ts` | `simulationAllowed()` / lines 12–15 | **`VERIFIED`** |
| **Revocable JWT Token Version** | `artifacts/api-server/src/middleware/auth.ts` | `requireAuth()` / lines 36–47 | **`VERIFIED`** |
| **JWT Signing & Secret Resolution**| `artifacts/api-server/src/lib/jwt.ts` | `resolveSecret()` / lines 15–33 | **`VERIFIED`** |
| **Safaricom M-Pesa STK Push** | `artifacts/api-server/src/lib/mpesa.ts` | `initiateStkPush()` / lines 45–95 | **`VERIFIED`** |
| **MTN MoMo Request-to-Pay** | `artifacts/api-server/src/lib/mtn-momo.ts` | `initiateMoMoRequest()` / lines 30–75 | **`VERIFIED`** |
| **Paystack Card Processing** | `artifacts/api-server/src/lib/paystack.ts` | `initializePayment()` / lines 20–60 | **`VERIFIED`** |
| **Dynamic Payout Balance SQL** | `artifacts/api-server/src/routes/payouts.ts` | `computeBalances()` / lines 28–57 | **`VERIFIED`** |
| **Admin Status Moderation** | `artifacts/api-server/src/routes/events.ts` | `PATCH /events/:id/status` / lines 240–280 | **`VERIFIED`** |
| **Attendee Erasure Protection** | `artifacts/api-server/src/routes/users.ts` | `DELETE /users/me` / lines 175–195 | **`VERIFIED`** |
| **DPA/GDPR Data Export** | `artifacts/api-server/src/routes/users.ts` | `GET /users/me/export` / lines 82–133 | **`VERIFIED`** |
| **Verified Check-in & Quests** | `artifacts/api-server/src/lib/gamification.ts` | `processCheckin()` / lines 205–285 | **`VERIFIED`** |
| **KULTR PASS Multiplier Engine** | `artifacts/api-server/src/lib/gamification.ts` | `getMultiplier()` / lines 150–168 | **`VERIFIED`** |
| **Beverage Voucher HMAC Minting**| `artifacts/api-server/src/lib/issue-voucher.ts` | `issueBeverageVoucher()` / lines 40–90 | **`VERIFIED`** |
| **Bartender Multi-Can Decrement**| `artifacts/api-server/src/routes/beverages.ts` | `POST /beverages/redeem` / lines 120–175 | **`VERIFIED`** |
| **Global Diaspora Hub Switcher** | `artifacts/kultr-mobile/app/(tabs)/index.tsx` | `DIASPORA_HUBS` / lines 40–120 | **`VERIFIED`** |
| **Culture Compass SVG Radar Map**| `artifacts/kultr-mobile/app/culture-compass.tsx` | `CityMap()` / lines 104–187 | **`VERIFIED`** |
| **10 Diaspora Currencies & Flags** | `artifacts/kultr-mobile/constants/currencies.ts` | `EA_COUNTRIES` / lines 28–880 | **`VERIFIED`** |
| **OpenAPI Contract Specification**| `lib/api-spec/openapi.yaml` | 44 endpoints / lines 1–2974 | **`VERIFIED`** |
| **Database Schema Definitions** | `lib/db/src/schema/index.ts` | 24 tables across 8 modules | **`VERIFIED`** |

---

## 2. External Research & Industry Citations

1. **GSMA *State of the Industry Report on Mobile Money 2024*:**
   - Documentation of $912B in Sub-Saharan mobile money throughput; 856M registered accounts; M-Pesa processing 65%+ of Kenya digital GDP.
   - URL: `https://www.gsma.com/mobilefordevelopment/resources/state-of-the-industry-report-on-mobile-money-2024/`
2. **IFPI *Global Music Report 2024*:**
   - Sub-Saharan Africa music streaming revenue growth (+24.7% YoY in 2023); Afrobeats achieving >15B global streams on major DSPs.
   - URL: `https://www.ifpi.org/resources/`
3. **UNESCO *The African Film and Creative Industry* (2021) & Afreximbank Creative Economy Projections:**
   - Market sizing of the African creative economy reaching $58 billion by 2030; creative exports growth in diaspora hubs.
   - URL: `https://en.unesco.org/creativity/publications/african-film-industry`
4. **World Bank Diaspora Studies (2023):**
   - Documentation of 150M+ African and Caribbean diaspora populations across North America, Europe, and the Caribbean basin with $1.2T+ in annual aggregate disposable income.
