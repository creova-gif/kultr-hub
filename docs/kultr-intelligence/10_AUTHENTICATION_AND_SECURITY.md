# 10 — Authentication, Cryptography & Security Architecture

> **Volume 10 — Threat Modeling, Cryptographic Access Controls & Data Privacy**  
> **Prepared by:** Security & Compliance Lead & Principal Security Engineer  
> **Evidence Status:** `VERIFIED` across auth middleware, JWT engines, cryptographic routines, and compliance routes

---

## 1. Threat Model & Security Posture

Kultr operates in a high-risk consumer fintech and ticketing environment characterized by payment fraud, ticket counterfeiting, unauthorized bot scalping, and organizer disputes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KULTR DEFENSE IN DEPTH                          │
├─────────────────────┬─────────────────────┬────────────────────────────┤
│ LAYER 1: NETWORK    │ LAYER 2: IDENTITY   │ LAYER 3: APPLICATION & DB  │
├─────────────────────┼─────────────────────┼────────────────────────────┤
│ • Edge TLS 1.3      │ • bcrypt Passwords  │ • Drizzle SQL Parameterize │
│ • Redis Rate Limits │ • SMS OTP Hash & TTL│ • Pessimistic Concurrency  │
│ • CORS Whitelist    │ • Revocable JWTs    │ • Cryptographic QR Signing │
│ • IP Flood Shields  │ • Role Gates (RBAC) │ • DPA / GDPR Erasure Guard │
└─────────────────────┴─────────────────────┴────────────────────────────┘
```

---

## 2. Authentication Subsystem & Token Revocation

### 2.1 Password Security
- Passwords are encrypted using **bcrypt** with a minimum salt rounds of 10 (`artifacts/api-server/src/routes/auth.ts:57`). Raw passwords are never logged, transmitted in responses, or stored in plaintext.

### 2.2 SMS One-Time Passcode (OTP) Engine
- Phone OTPs are 6-digit cryptographically random strings (`nanoid` / `crypto`).
- To prevent database breach exploitation, the OTP code is **hashed with bcrypt** before insertion into `otp_codes` (`artifacts/api-server/src/routes/auth.ts:153`).
- **TTL & Brute-Force Threshold:** OTPs carry an immutable 10-minute expiration (`expires_at = now() + 10 min`). If more than 5 incorrect attempts are made, the code is immediately invalidated with `429 Too Many Attempts` (`artifacts/api-server/src/routes/auth.ts:212`).

### 2.3 Revocable JWT Architecture (`tokenVersion`)
Standard stateless JWT architectures suffer from a critical flaw: a stolen token remains valid until natural expiration (often days or weeks), rendering user logout or account deletion unenforceable server-side.

Kultr resolves this by pairing signed JWTs with a database-backed `tokenVersion` check:

```typescript
// Verified from artifacts/api-server/src/middleware/auth.ts:36-47
const [user] = await db
  .select({ tokenVersion: usersTable.tokenVersion, isAdmin: usersTable.isAdmin })
  .from(usersTable)
  .where(eq(usersTable.id, payload.userId))
  .limit(1);

// Immediate multi-device session invalidation
if (!user || user.tokenVersion !== payload.tokenVersion) {
  res.status(401).json({ message: "Invalid or expired token" });
  return;
}
```

- When a user logs out (`POST /api/auth/logout`) or deletes their account (`DELETE /api/users/me`), `token_version` is incremented. All previously minted tokens for that user are instantly invalidated across all devices.

---

## 3. Cryptographic Access Control & Anti-Counterfeiting

### 3.1 Algorithmic QR Ticket Matrix
Ticket entry codes are not static database IDs. They are cryptographically hashed tokens generated via:
$$\text{TicketHash} = \text{SHA-256}(\text{userId} \parallel \text{eventId} \parallel \text{ticketTypeId} \parallel \text{nonce} \parallel \text{secret})$$
- Stored uniquely in `tickets.qr_code_hash`.
- Rendered on the mobile client using a deterministic SVG matrix generator (`components/QRDisplay.tsx`).
- At the door, staff scan the QR code. The server marks `status = 'used'` inside a transaction. Any subsequent presentation of the same QR code immediately triggers a fraud alert.

### 3.2 HMAC-SHA256 Digital Bar Passes
Festival Bar Passes (`app/bar-pass/[id].tsx`) use a keyed-hash message authentication code (HMAC):
$$\text{Signature} = \text{HMAC-SHA256}(\text{voucherCode} \parallel \text{eventId} \parallel \text{totalUnits}, \text{BAR\_PASS\_KEY})$$
- When the bartender's camera scans the pass, the app checks the HMAC signature locally before dispatching to `/api/beverages/redeem`.
- This prevents counterfeit passes even if an attacker generates a fake barcode mimicking the visual structure.

---

## 4. Input Sanitization & SQL Injection Defense

- **Drizzle ORM Query Parameterization:** All SQL queries are compiled into parameterized prepared statements (`$1, $2, ...`), completely eliminating SQL injection vectors.
- **UUID Validation Middleware:** Path parameters are strictly validated using `validateUuidParam.ts` before reaching route controllers, preventing directory traversal or parameter tampering.
- **Zod Runtime Schema Validation:** Request bodies are parsed through strict Zod schemas, stripping unvalidated properties and rejecting malformed types.

---

## 5. Data Privacy & Regulatory Compliance (Kenya DPA, NDPR, POPIA, GDPR)

Kultr implements native compliance with Sub-Saharan data protection regulations:
- **Kenya Data Protection Act 2019 (DPA):** Sections 26 & 40 (Right of Access and Right to Erasure).
- **Nigeria Data Protection Regulation 2023 (NDPR):** Article 3 (Data Subject Rights).
- **South Africa Protection of Personal Information Act (POPIA):** Chapter 3 (Access and Deletion).

### 5.1 Machine-Readable Data Portability (`GET /api/users/me/export`)
Returns a downloadable JSON archive (`kultr-hub-my-data.json`) containing the user's complete profile, purchased tickets, created events, KULTROIN wallet balance, reward ledger entries, and completed quests. Critical server secrets (password hashes) are programmatically redacted.

### 5.2 Protected Right to Erasure (`DELETE /api/users/me`)
Implements true cascade deletion across user data, protected by an essential **attendee preservation guard**:

```typescript
// Verified from artifacts/api-server/src/routes/users.ts:175-185
// Guard: refuse deletion if creator has live events with tickets bought by other attendees
const [{ attendeeTicketCount }] = await tx
  .select({ attendeeTicketCount: sql<number>`count(*)` })
  .from(ticketsTable)
  .innerJoin(eventsTable, eq(ticketsTable.eventId, eventsTable.id))
  .where(and(eq(eventsTable.creatorId, userId), ne(ticketsTable.userId, userId)));

if (Number(attendeeTicketCount) > 0) {
  throw new AttendeesExistError(
    "Cannot delete account while you have active events with confirmed tickets purchased by attendees."
  );
}
```
This guarantees that an unethical promoter cannot delete their account to wipe attendee tickets and evade event obligations.
