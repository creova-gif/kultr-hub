# 03 — Customers, Personas & Jobs-To-Be-Done

> **Volume 03 — Customer Profiling, Persona Archetypes & Value Drivers**  
> **Prepared by:** Chief Design Officer & Startup Research Analyst  
> **Evidence Status:** Mix of `VERIFIED` (Implemented UX Profiles & Permissions) and `DOCUMENTED` (User Stories & PRD)

---

## 1. Primary Customer Personas

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KULTR USER ARCHETYPES                           │
├─────────────────────┬─────────────────────┬────────────────────────────┤
│ CONSUMER SEGMENTS   │ CREATOR SEGMENTS    │ OPERATIONAL ROLES          │
├─────────────────────┼─────────────────────┼────────────────────────────┤
│ • Experience Seeker │ • Indie Promoter    │ • Door Bouncer / Staff     │
│ • Diaspora Pilgrim  │ • Festival Director │ • Festival Bartender       │
│ • Community Tribe   │ • Venue / Club Mgr  │ • Platform Trust Admin     │
└─────────────────────┴─────────────────────┴────────────────────────────┘
```

---

### Persona 1: The Experience Seeker (Domestic Urban African)
- **Name:** Brian Mwangi (Age 24, Nairobi, Kenya)
- **Occupation:** Associate Product Designer at a Nairobi fintech.
- **Lifestyle:** Attends 2–3 live events a month (Amapiano Sunday roasts, art showcases, live band gigs at Alchemist or Muze).
- **Tech Stack:** iPhone 13, Safaricom M-Pesa daily user, Instagram & TikTok heavy user.
- **Jobs to be Done (JTBD):**
  > *"When my friends and I are deciding what to do this weekend, I want to quickly discover authentic cultural events that match our music vibe, and buy our tickets in two taps using M-Pesa without entering a credit card or dealing with slow mobile web pages, so that we don't miss out and get stuck paying inflated prices at the door."*
- **Primary Frustrations:**
  - Finding out an event happened *after* seeing videos on Instagram Stories.
  - Ticketing pages requiring Visa/Mastercard when his cash is in M-Pesa.
  - Waiting 45 minutes in line at the bar just to get a drink.
  - Buying a ticket from an acquaintance on WhatsApp only to discover the QR code was already used.
- **Purchasing Power:** $10–$35 per ticket; $15–$40 on on-site food and drinks.
- **Expected Value from Kultr:** Instant M-Pesa STK Push payment, offline-accessible ticket in app, pre-paid drink pass for fast-track lanes, and KULTROIN streak points.

---

### Persona 2: The Diaspora Cultural Pilgrim (Global Traveler)
- **Name:** Nia Adebayo (Age 28, London, UK)
- **Occupation:** Digital Marketing Strategist in Shoreditch.
- **Lifestyle:** First-generation British-Nigerian. Travels to Lagos for "Detty December", Afro Nation in Portugal, and Notting Hill Carnival annually. Regularly attends Afrobeats and Soca club nights in South London.
- **Tech Stack:** iPhone 15 Pro, Apple Pay, Monzo, Revolut.
- **Jobs to be Done (JTBD):**
  > *"When I travel to Lagos, Accra, or attend international diaspora festivals like Afro Nation, I want a single trusted app that shows me the verified headliners, lets me pay in GBP or EUR without currency rejection, and provides a guaranteed entry pass, so that I have a safe, world-class experience without getting scammed."*
- **Primary Frustrations:**
  - International cards getting flagged for fraud when buying on African ticketing sites.
  - Zero centralized calendar for diaspora cultural hubs.
  - Massive ticket scalping at major festivals.
- **Purchasing Power:** £40–£200 ($50–$250) per ticket; £50–£100 on festival merchandise and drinks.
- **Expected Value from Kultr:** Global Diaspora Hub switcher (`app/(tabs)/index.tsx`), Apple Pay / Card checkout via Paystack with dynamic currency conversion (`constants/currencies.ts`), verified organizer badge (`components/VerifiedBadge`).

---

### Persona 3: The Culture Creator (Independent Promoter)
- **Name:** DJ K-Vibe / Kevin Omondi (Age 31, Nairobi & London)
- **Occupation:** DJ, event promoter, and founder of a bi-monthly Amapiano & Afro-house warehouse series (800–1,500 attendees).
- **Jobs to be Done (JTBD):**
  > *"When I launch my next event, I want to create ticket tiers in under 3 minutes, publish to a community that already loves my sound, track real-time ticket sales on my phone, and access my revenue quickly so I can pay sound engineers, security, and venue deposits without taking out expensive short-term loans."*
- **Primary Frustrations:**
  - Ticketing platforms holding funds until 7 days after the event.
  - Paying 7%–10% in platform fees while receiving zero promotional support.
  - Ticket gate staff letting friends in for free without scanning.
  - Running out of drinks or having long bar lines stall beverage revenues.
- **Business Needs:** Real-time mobile analytics (`app/creator-studio.tsx`), transparent payout calculations (`artifacts/api-server/src/routes/payouts.ts`), door-scanning permissions, and optional canned beverage bundle provisioning (`app/create-event.tsx`).

---

### Persona 4: The Event Operator & Bartender (On-Site Staff)
- **Name:** Samuel Kiprono (Age 22, Nairobi)
- **Role:** Festival Bartender / Express Lane Attendant.
- **Jobs to be Done (JTBD):**
  > *"When the festival crowd rushes the bar between main artist sets, I want to scan attendee passes on my phone in 2 seconds, verify how many cans they are entitled to, decrement their balance, and hand them cold drinks without handling cash or POS cards, so that the line keeps moving and nobody complains."*
- **Primary Frustrations:**
  - Flaky mobile network connections making cloud-dependent POS systems crash.
  - Customers showing counterfeit or screenshot drink vouchers.
  - Discrepancies between physical can counts and register receipts.
- **Expected Value from Kultr:** Dedicated Bartender Scanner (`app/bartender-scanner.tsx`) featuring instant HMAC cryptographic verification, multi-can decrement counters, and offline sync queueing.

---

### Persona 5: The Platform Trust & Safety Administrator
- **Name:** Operations & Trust Lead (CREOVA Internal Team)
- **Role:** Admin Moderator.
- **Jobs to be Done (JTBD):**
  > *"When new events are submitted or buyers flag suspicious listings, I want an intuitive moderation console to review listings, verify promoter identities, audit dispute details, and manage payout disbursements, so that the platform maintains uncompromised integrity."*
- **Features Used (`VERIFIED`):** Admin Console (`app/admin.tsx`), event status moderation (`PATCH /api/events/:id/status`), fraud report triage (`/api/events/admin/reports`), and creator verification (`PATCH /api/users/:id/verify`).

---

## 2. Jobs-To-Be-Done (JTBD) Matrix

| User Role | Trigger / Situation | Desired Progress | Functional Outcome | Emotional Outcome |
|:---|:---|:---|:---|:---|
| **Consumer** | Friday evening, looking for plans with friends. | Find trusted events in the city without endless WhatsApp scrolling. | Taps "Culture Compass" map, finds live event within 5km, buys ticket via M-Pesa. | Confident, excited, culturally plugged-in. |
| **Consumer** | Arriving at high-traffic festival bar. | Get drinks without waiting 45 minutes in line. | Shows Kultr Bar Pass QR at Express Lane; receives 4-pack in 30 seconds. | Relieved, elite, energized. |
| **Promoter** | Announced lineup, needs to start presales immediately. | Create multi-tier tickets and start selling before paying venue balance. | Submits event form with Early Bird, Regular, VIP tiers and drink bundle options. | In control, professional, focused on curation. |
| **Promoter** | Event concluded at 2:00 AM. | Verify exact attendance, gross receipts, and initiate payout. | Opens Creator Studio; sees exact tickets sold, drinks redeemed, and requests payout. | Empowered, financially clear, ready for next gig. |
| **Door Staff** | 500 attendees queueing at gate at 10:00 PM. | Rapidly scan tickets with zero false admissions or delays. | Uses Kultr Scanner; instant haptic buzz for verified ticket, red alert for duplicate. | Fast, accountable, calm. |

---

## 3. Adoption Barriers & Strategic Mitigations

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ADOPTION BARRIERS & KULTR SOLUTIONS                  │
├─────────────────────┬──────────────────────────────────────────────────┤
│ BARRIER             │ KULTR MITIGATION                                 │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Fear of Fake Events │ Admin Review Gate before events go live          │
│ & Scams             │ "Verified Organizer" trust badge on listings     │
│                     │ Buyer-submitted Fraud Reporting queue            │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Mobile Connectivity │ Offline-cached tickets with algorithmic QR matrix│
│ Dropouts at Venues  │ Offline cryptographic HMAC validation on scanner │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Reluctance to Enter │ One-touch M-Pesa STK Push (SIM Toolkit prompt)   │
│ Credit Card Details │ MTN MoMo Request-to-Pay                          │
│                     │ Apple Pay / Google Pay support                   │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Promoter Inertia &  │ 3.5%–5% take rate (vs 7%–10% competitors)        │
│ Established Habits  │ Transparent, automated payout calculation        │
│                     │ Free organizer scanning tools included           │
└─────────────────────┴──────────────────────────────────────────────────┘
```
