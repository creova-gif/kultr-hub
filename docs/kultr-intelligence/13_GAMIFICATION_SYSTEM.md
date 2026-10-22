# 13 — Gamification, Quests & KULTROIN Ledger

> **Volume 13 — Loyalty Mechanics, Quest Engines & Append-Only Points Ledgers**  
> **Prepared by:** Lead Gamification Designer & Senior Backend Engineer  
> **Evidence Status:** `VERIFIED` across `schema/gamification.ts`, `lib/gamification.ts`, and `routes/gamification.ts`

---

## 1. Gamification Architecture & Value Flywheel

Unlike traditional ticketing apps that suffer from high user churn between event purchases, Kultr embeds a continuous engagement flywheel:

```
                              THE KULTR LOYALTY FLYWHEEL
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
         CULTURAL QUESTS                                   KULTROIN LEDGER
       • Attend Afrobeats / Soca gigs                    • Append-only tamper-evident wallet
       • Check-in via verified ticket                    • Idempotent transaction keys
       • 2x Multiplier with KULTR PASS                   • Zero double-awarding
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          ▼
                               EXCLUSIVE REDEMPTIONS
                             • Backstage digital content
                             • Festival VIP lounge passes
                             • Limited merch drops & badges
```

---

## 2. Cultural Quest Catalog & Verification Engine

Active quests are seeded via `lib/db/src/seed-gamification.ts` and managed in `questsTable`.

### 2.1 The Quest Catalog (`VERIFIED`)
1. **Afrobeats & Amapiano Pilgrim (Legendary):** Attend 2 Afrobeats or Amapiano concerts across the global diaspora. Reward: **250 KULTROINS** + Legendary Badge.
2. **Carnival Connoisseur (Epic):** Experience Caribbean carnival and soca celebrations (Notting Hill, Toronto, Kingston). Reward: **200 KULTROINS** + Epic Badge.
3. **Music Maestro (Epic):** Attend 3 live music concerts. Reward: **200 KULTROINS** + Epic Badge.
4. **Culture Explorer (Epic):** Attend 5 events of any category across the platform. Reward: **250 KULTROINS** + Epic Badge.
5. **Festival Fanatic (Rare):** Attend a major cultural festival. Reward: **175 KULTROINS** + Rare Badge.
6. **Diaspora Palate (Rare):** Taste authentic culinary heritage at 2 Pan-African or Caribbean food festivals. Reward: **175 KULTROINS** + Rare Badge.
7. **Art Appreciator (Rare):** Explore 3 art exhibitions and galleries. Reward: **150 KULTROINS** + Rare Badge.
8. **Story Seeker (Rare):** Visit 2 heritage experiences and museums. Reward: **125 KULTROINS** + Rare Badge.
9. **Early Bird (Common):** Book a ticket at least 7 days before an event. Reward: **100 KULTROINS** + Common Badge.

### 2.2 Anti-Cheat Verified Check-In Engine (`lib/gamification.ts`)
To prevent users from spoofing attendance to farm points, check-in verification enforces **four strict conditions**:

```typescript
// Verified from artifacts/api-server/src/lib/gamification.ts:172-187
function questMatchesEvent(quest: Quest, event: CheckinEvent, ticket: CheckinTicket | null): boolean {
  switch (quest.matchRule) {
    case "category":
      return quest.requiredCategory === event.category;
    case "tag":
      return !!quest.requiredTag && (event.tags ?? []).includes(quest.requiredTag);
    case "early_bird":
      if (!ticket) return false;
      const cutoff = event.eventDate.getTime() - quest.earlyBirdDays * 86_400_000;
      return ticket.purchasedAt.getTime() <= cutoff;
    case "any":
      return true;
  }
}
```

1. **Ticket Possession:** The user must hold a confirmed ticket for the event (`ticketsTable.status === 'confirmed'`).
2. **Idempotent Check-in:** A unique database constraint on `event_checkins(user_id, event_id)` guarantees attendance can only be credited once per event.
3. **Rule Matching:** Points only advance if the event's category, tags, or early-bird purchase timestamp strictly match the quest criteria.
4. **Completion Milestone:** When all active quests are complete, the user is awarded the prestigious "Kultr Legend" milestone.

---

## 3. Tamper-Evident KULTROIN Ledger (`kultroin_ledger`)

KULTROINS represent the platform's internal loyalty currency. To ensure financial auditability and prevent reward duplication exploits, points are never stored as an arbitrary mutable counter alone.

Every point movement requires a double-entry transaction in `kultroin_ledger`:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `amount` (INTEGER, Not Null)
- `direction` (VARCHAR — `'credit'` or `'debit'`)
- `reason` (VARCHAR — `quest_completion`, `pass_purchase`, `streak_bonus`, `perk_redemption`)
- `idempotency_key` (VARCHAR, Unique — e.g. `quest:user_123:quest_456`)
- `reference_type` / `reference_id` (Binds transaction to a specific quest or ticket)

If a network retry dispatches the same check-in payload twice, the unique constraint on `idempotency_key` rejects the second attempt without error or point duplication.

---

## 4. KULTR PASS & Multiplier Subsystem

- **Tier:** `kultr_pass`
- **Cost:** One-time annual payment ($19.99 / KSh 2,500 / ₦25,000) processed via Paystack or M-Pesa.
- **Multiplier Value:** **2.0x (Double Points)** on all quest completions and streak awards.
- **Verification (`lib/gamification.ts:getMultiplier`):** Evaluates `kultr_pass_subscriptions` inside the database transaction; if active and unexpired, all earned quest points are doubled prior to ledger insertion.

---

## 5. Backstage Perks Store (`schema/perks.ts`)

Users redeem their accumulated KULTROINS for real-world and digital benefits:
- **Backstage Digital Content (150 Points):** Unlocks exclusive behind-the-scenes artist photos, live sets, and festival recordings.
- **VIP Lounge Access Pass (300 Points):** Upgrades standard festival admission to the Kultr VIP lounge.
- **Exclusive Merch Drops (500 Points):** Limited-edition Kultr diaspora apparel and festival accessories.
- **Atomic Debit:** Redemptions execute within a transaction verifying that `kultroin_wallets.balance >= cost`, debiting the wallet and logging an unlock record in `user_perk_unlocks`.
