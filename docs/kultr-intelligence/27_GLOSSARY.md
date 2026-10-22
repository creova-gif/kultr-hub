# 27 — Comprehensive Domain Glossary

> **Volume 27 — Authoritative Dictionary of Technical, Cultural & Financial Terminology**  
> **Prepared by:** Founding Team Editorial Board  
> **Evidence Status:** `VERIFIED` across codebase implementations & industry definitions

---

## 1. Technical & Engineering Terms

- **Drizzle ORM:** A lightweight, TypeScript-first Object-Relational Mapper that enforces type-safe SQL queries, schema definitions, and versioned database migrations.
- **Pessimistic Row Lock (`SELECT ... FOR UPDATE`):** A database-level concurrency control mechanism that locks target rows during an active transaction, ensuring concurrent transactions wait in sequence and preventing overselling or race conditions.
- **tokenVersion:** A server-managed integer column in the `users` table incremented upon logout or password reset, immediately invalidating all outstanding JWT sessions across all devices.
- **Safaricom Daraja STK Push:** A payment protocol developed by Safaricom in Kenya where a server pushes an instant SIM Toolkit PIN prompt directly to an attendee's mobile handset for M-Pesa authorization.
- **MTN MoMo Request-to-Pay:** An asynchronous mobile payment API deployed by MTN across Ghana, Uganda, Rwanda, and West Africa, prompting users via USSD to debit their mobile wallet.
- **HMAC-SHA256:** A keyed-hash message authentication code pairing a cryptographic secret with a payload to guarantee data authenticity and integrity on digital Bar Passes.
- **OpenAPI 3.1 Contract:** A formal, machine-readable specification of all HTTP endpoints, schemas, parameters, and responses used to auto-generate client hooks and runtime Zod validators.
- **TanStack React Query v5:** An asynchronous state management library for React and React Native handling caching, background synchronization, and optimistic UI updates.

---

## 2. Cultural & Platform Terms

- **Cultural Capital Hubs:** Major global metropolitan centers celebrating African and Caribbean diaspora culture, including London, New York, Toronto, Paris, Portimão, Kingston, Port of Spain, Lagos, Accra, Nairobi, and Johannesburg.
- **Culture Compass:** An interactive SVG radar map interface on the mobile client displaying stable algorithmic pins representing live events within a selected hub.
- **Vibe Tribes:** Persistent in-app cultural community spaces organized around musical genres and creative movements (e.g., Afrobeats Nation, Amapiano Movement, Soca & Carnival, Jollof & Nyama).
- **Cultural Quests:** Gamified exploration challenges rewarding attendees with KULTROINS, collectibles, and VIP perks for verified event attendance.
- **KULTROIN:** The platform's closed-loop loyalty reward currency recorded in an append-only, tamper-evident transaction ledger (`kultroin_ledger`).
- **KULTR PASS:** A paid annual membership conferring a 2x points multiplier on all quest rewards, streak bonuses, and exclusive backstage access.
- **Kultr Canned Drinks & Express Bar Pass:** An integrated festival commerce sub-brand allowing attendees to pre-order canned beverage 4-packs (Cold Brew, Hibiscus, Ginger Punch) at checkout and skip festival bar queues via dedicated express lanes.
- **Detty December:** A widespread annual cultural phenomenon where hundreds of thousands of African diaspora travelers return to Lagos, Accra, and West Africa for a month of concerts, beach parties, and festivals.

---

## 3. Financial & Operational Terms

- **Gross Ticket Value (GTV) / GMV:** The total monetary volume of all ticket and beverage pass transactions processed on the platform before fee deductions.
- **Take Rate:** The percentage of Gross Ticket Value captured by Kultr as platform revenue (standard: 3.5% – 5.0%).
- **Average Order Value (AOV):** The mean dollar value spent by a consumer during a single checkout session.
- **Escrow Holdback:** An operational risk control holding a percentage (e.g. 15%) of creator revenues until 48 hours post-event to protect against cancellations or disputes.
- **B2C Disbursement:** Business-to-Consumer financial transfer rail (e.g. M-Pesa B2C) utilized to pay organizer revenue balances directly to mobile wallets or bank accounts.
