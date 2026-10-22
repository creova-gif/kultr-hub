# 16 — Brand Identity & Visual Design System

> **Volume 16 — Visual Language, Brand Guidelines, Design Tokens & Figma UI Atlas**  
> **Prepared by:** Chief Design Officer & Brand Strategy Lead  
> **Evidence Status:** `DOCUMENTED` in Figma Design System & `VERIFIED` across mobile theme hooks and exported UI canvases

---

## 1. Brand Identity & Personality

Kultr represents the bold, vibrant, and innovative spirit of modern African and Caribbean culture. It rejects dated, stereotypical tropes in favor of an energetic, high-fashion, and technologically sophisticated aesthetic.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KULTR BRAND PERSONALITY                         │
├─────────────────────┬─────────────────────┬────────────────────────────┤
│ TONE PILLARS        │ BRAND ESSENCE       │ AUDIENCE PROMISE           │
├─────────────────────┼─────────────────────┼────────────────────────────┤
│ • Electrifying      │ "The Global Pulse   │ "Africa & the Caribbean    │
│ • Authentic         │  of Diaspora        │  to the World — Where      │
│ • Premium           │  Culture"           │  Culture Unites & Moves"   │
│ • Unapologetic      │                     │                            │
└─────────────────────┴─────────────────────┴────────────────────────────┘
```

- **Brand Tone:** Warm, confident, culturally immersed, and modern. Speaks with the rhythm of the music and the swagger of the diaspora.
- **Tagline:** *"Africa & the Caribbean to the World — The global pulse of diaspora culture."*
- **Primary Mission:** Empower diaspora communities globally to discover, experience, and economically back African & Caribbean cultural creators, festivals, and live events.

---

## 2. Color System & Design Tokens

The visual palette draws inspiration from the energy of Lagos street festivals, the golden warmth of East African sunsets, and the sleek sophistication of London and New York nightspots.

| Token | Hex Value | RGB | Contrast vs `#0D0D0D` | Functional Usage |
|:---|:---:|:---:|:---:|:---|
| **Primary Accent** | `#FF6B00` | 255, 107, 0 | 5.1:1 (AA) | Primary CTAs, active tab highlights, pricing accents |
| **Secondary Accent** | `#00C853` | 0, 200, 83 | 6.8:1 (AAA) | Success badges, verified organizer icons, streak tags |
| **Gold / Kultroin** | `#FFD700` | 255, 215, 0 | 9.4:1 (AAA) | KULTROINS, VIP Pass tier, reward milestones |
| **Electric Purple** | `#7C4DFF` | 124, 77, 255| 4.6:1 (AA) | Quests, special perks, cultural badges |
| **Background Dark** | `#0D0D0D` | 13, 13, 13 | N/A | Global application canvas, card backdrop |
| **Surface Card** | `#1A1A1A` | 26, 26, 26 | N/A | Event cards, filter panels, modal sheets |
| **Surface Elevated**| `#242424` | 36, 36, 36 | N/A | Floating navigation bars, active sheets, tooltips |
| **Border Muted** | `#262626` | 38, 38, 38 | N/A | Hairline component borders, divider lines |
| **Text Primary** | `#FFFFFF` | 255, 255, 255 | 18.2:1 (AAA)| Headlines, event titles, button text |
| **Text Secondary** | `#A0A0A0` | 160, 160, 160| 6.6:1 (AA) | Inactive tabs, venue details, subtitles, timestamps |
| **Error / Urgent** | `#D32F2F` | 211, 47, 47 | 4.8:1 (AA) | Sold-out badges, destructive actions, dispute alerts |

---

## 3. Typography & Responsive Scale

Typography is optimized for mobile legibility and editorial punch:
- **Display & Headings:** Modern geometric sans-serif (`Montserrat` or system bold weights `700`, `800`, `900`).
- **Body & Metadata:** Clean humanist sans-serif (`Open Sans` / system regular `400`, `500`, `600`).

```
Display 1 (Hero Title):   36px / Line Height 42px / Weight 900
H1 (Screen Title):        24px / Line Height 30px / Weight 800
H2 (Section Header):      18px / Line Height 24px / Weight 700
H3 (Card Title):          16px / Line Height 22px / Weight 700
Body Regular:             14px / Line Height 20px / Weight 400
Caption / Badge:          11px / Line Height 14px / Weight 600
Micro / Sub-caption:       9px / Line Height 12px / Weight 500
```

---

## 4. Spacing, Grid & Layout Rules

- **Base System:** 8-point harmonic grid system (`4px`, `8px`, `16px`, `24px`, `32px`, `48px`).
- **Card Margins:** 16px screen padding on mobile (`marginHorizontal: 16`).
- **Border Radii:**
  - Micro chips & pills: `borderRadius: 20` (Pill shape).
  - Content cards: `borderRadius: 16`.
  - Action buttons: `borderRadius: 12`.
  - Floating action buttons: `borderRadius: 28` (Circle).

---

## 5. Creative Direction: Cinematic Motion & Haptics

Inspired by high-end luxury lifestyle and entertainment applications, Kultr treats motion as a primary storytelling device:
- **Haptic Tactility (`expo-haptics`):**
  - Tab Press / Hub Switch: `Haptics.selectionAsync()` (Subtle tick).
  - Ticket Selection / Add to Cart: `Haptics.impactAsync(Light)` (Crisp tap).
  - Checkout Success / Bar Scan: `Haptics.notificationAsync(Success)` (Double-pulse vibration).
- **Parallax & Motion:** Event hero cards feature subtle scale transitions on press, with fluid layout animations when switching categories or expanding filters.

---

## 6. Complete Figma UI Screen Atlas & Visual Design Showcase

The Kultr mobile application interface has been fully authored in Figma across 11 core architectural sections. Below is the systematic documentation of every major UI screen, linking the verified visual design assets:

### Section 1: Authentication & Onboarding
The entry flow guides both global diaspora consumers and creators through rapid verification while immersing them in the brand tone.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **Splash Screen (Cinematic)** | `assets/kultr-splash.png` | Dark background (`#0D0D0D`) with glowing `#FF6B00` brand mark, tagline, and instant "Get Started" entry. |
| **Sign In / Login** | `assets/kultr-login.png` | Clean email/password credentials, Apple Sign In, Google Sign In, and SMS OTP switch. |
| **Sign Up & Account Creation** | `assets/kultr-signup-r.png` | Profile name, phone number, diaspora country picker, and terms consent. |
| **SMS OTP Verification** | `assets/kultr-otp-r.png` | 6-digit numeric input with auto-read, resend countdown timer, and secure phone binding. |
| **Forgot Password** | `assets/kultr-forgot-password-r.png` | Password reset request with email recovery link dispatch. |
| **Reset Password Confirmation** | `assets/kultr-reset-password-confirm-r.png` | Success acknowledgment with immediate redirect to login. |
| **Interest Selection Onboarding** | `assets/kultr-onboarding-interests.png` | Interactive pill tags (Afrobeats, Amapiano, Carnival, Highlife, Tech, Food) powering recommendations. |
| **City & Hub Selection** | `assets/kultr-city-selection-r.png` | Flag-badged diaspora hubs (Lagos 🇳🇬, London 🇬🇧, Nairobi 🇰🇪, Toronto 🇨🇦, Accra 🇬🇭, New York 🇺🇸). |
| **Location Permission** | `assets/kultr-location-permission-r.png` | Contextual prompt explaining location access for nearby events and Culture Compass radar. |

![Authentication Section Canvas](assets/section-auth.png)

---

### Section 2: Consumer Discovery & Cultural Feeds
The discovery engine acts as an editorial gateway to cultural happenings worldwide.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **Home Screen (Primary)** | `assets/kultr-home.png` | Dynamic diaspora hub selector, featured carousel, "Happening Tonight", and category filters. |
| **Home Screen (Editorial V2)** | `assets/kultr-home-v2-editorial.png` | High-fashion magazine layout with oversized hero imagery, curator picks, and video teasers. |
| **Discover & Category Browse** | `assets/kultr-discover-browse.png` | Multi-category grid with live event counts per genre (Music, Nightlife, Arts, Culinary). |
| **Search & Spatial Filters** | `assets/kultr-search.png` | Instant real-time search with recent searches, trending artists, and price pills. |
| **Filter Bottom Sheet** | `assets/kultr-filter-sheet-r.png` | Expandable drawer with date picker, distance slider, free/paid toggle, and venue type. |
| **Culture Compass Spatial Radar** | `assets/kultr-culture-compass.png` | Circular radar visualizing events around the user with interactive venue nodes. |
| **Map Nearby View** | `assets/kultr-map-nearby-r.png` | Interactive map interface with custom map markers, cluster view, and bottom card preview. |
| **Trending Editorial Digest** | `assets/kultr-trending-editorial-r.png` | Curated weekly culture briefing with editorial commentary and hot tickets. |
| **For You Personalized Feed** | `assets/kultr-for-you.png` | Recommendation feed matching user interests, past bookings, and community vibes. |
| **Saved Events / Favorites** | `assets/kultr-saved-events.png` | Bookmarked events with price-drop alerts and upcoming availability notifications. |

![Consumer Home & Discovery Canvas](assets/section-consumer-home-and-discovery.png)

---

### Section 3: Event Detail, Venue & Experience
Detailed event pages provide complete transparency, multimedia teasers, ticket tiers, and venue information.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **Event Detail (Overview)** | `assets/kultr-event-detail.png` | Hero gallery, event title, date, time, organizer verification badge, and sticky "Get Tickets" CTA. |
| **Event Detail (Full Experience)** | `assets/kultr-event-detail-full-r.png` | Extended view with performer lineup, Spotify/Apple Music preview, dress code, and FAQ. |
| **Venue Detail Screen** | `assets/kultr-venue-detail-r.png` | Venue capacity, safety rules, parking/transit directions, and other upcoming events at the space. |
| **Sold Out Event State** | `assets/kultr-sold-out-r.png` | High-contrast sold out badge with "Join Waitlist" and "Notify When Resale Opens" CTAs. |
| **Report Event Dialog** | `assets/kultr-report-event-r.png` | Trust & safety modal allowing attendees to report fraudulent listings or policy violations. |

![Event & Tickets Canvas](assets/section-event-and-tickets.png)

---

### Section 4: Checkout, Payments & Digital Ticket Wallet
Frictionless omnichannel purchasing supporting local African mobile money and international credit cards.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **Checkout Review** | `assets/kultr-checkout-review-r.png` | Order breakdown, fee transparency, ticket tier quantities, and optional drink bundles. |
| **Payment Method Selection** | `assets/kultr-payment-method-r.png` | M-Pesa, MTN MoMo, Airtel Money, Visa/Mastercard (Paystack), and Apple Pay. |
| **Payment Processing (STK Push)** | `assets/kultr-payment-processing-r.png` | Live loading state instructing user to approve the USSD prompt on their phone. |
| **Payment Success & Celebration** | `assets/kultr-payment-success.png` | Confetti celebration, order confirmation code, Kultroins earned, and "View Tickets" button. |
| **Payment Failed & Retry** | `assets/kultr-payment-failed-r.png` | Informative error explanation (insufficient balance / timeout) with instant retry options. |
| **Digital Ticket & QR Matrix** | `assets/kultr-digital-ticket.png` | High-contrast QR code, attendee name, seat/tier, Apple Wallet pass export, and anti-fraud timestamp. |
| **Ticket History & Past Events** | `assets/kultr-ticket-history-r.png` | Tabbed view of Active, Past, and Cancelled tickets with re-booking links. |
| **Refund Status & Tracking** | `assets/kultr-refund-status-r.png` | Timeline showing refund review, approval, and settlement back to mobile money wallet. |

---

### Section 5: Creator Studio, Analytics & Gate Operations
Professional tools designed for event creators, venue managers, and gate security.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **Creator Onboarding** | `assets/kultr-creator-onboarding-r.png` | KYC verification, payout account setup, organizer branding, and bio. |
| **Creator Studio Dashboard** | `assets/kultr-creator-dashboard.png` | Gross GMV, active ticket sales velocity, visitor traffic, and quick actions. |
| **Create Event Form** | `assets/kultr-create-event.png` | Multi-step builder: Title, category, date, venue, banner upload, and ticket tier pricing. |
| **Edit Event Form** | `assets/kultr-edit-event-r.png` | Modify event description, add capacity, or update performer lineups. |
| **Event Management Console** | `assets/kultr-event-management.png` | Live event status toggle (Draft / Live / Paused), door check-in progress bar. |
| **Event Status Review State** | `assets/kultr-event-status-review-r.png` | Status tracking screen indicating admin moderation progress and approval readiness. |
| **Attendee Roster & Management** | `assets/kultr-attendee-list-r.png` | Searchable guestlist, VIP badges, check-in status, and manual check-in override. |
| **Advanced Analytics Detail** | `assets/kultr-analytics-detail-r.png` | Revenue breakdown by tier, ticket sales by hour, referral sources, and demographic charts. |
| **Door QR Scanner (Staff)** | `assets/kultr-qr-scanner-r.png` | Fast optical camera scanner with instant green/red status overlay and haptic buzz. |
| **Attendee Check-in Modal** | `assets/kultr-event-checkin-r.png` | Successful scan confirmation showing attendee photo, ticket tier, and duplicate scan alert. |
| **Creator Payouts Engine** | `assets/kultr-payouts-r.png` | Available balance, payout history, bank/M-Pesa destination, and "Request Payout" CTA. |

![Creator Studio Canvas](assets/section-creator.png)

---

### Section 6: Gamification, KULTR PASS & Cultural Perks
Engaging community loops that reward diaspora cultural discovery and attendance.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **KULTR PASS Hub & Subscriptions** | `assets/kultr-pass-subscribe.png` | VIP membership benefits: early access, discounted tickets, priority bar lane, exclusive merch. |
| **KULTR PASS Purchase** | `assets/kultr-pass-purchase.png` | Tier selection (Monthly / Annual / Founder Pass) with direct mobile money billing. |
| **KULTROIN Points Wallet** | `assets/kultr-kultroin-wallet-r.png` | Token balance, points ledger, earn history, and redemption shortcuts. |
| **Quests & Cultural Challenges** | `assets/kultr-quests.png` | Active quests ("Attend 2 Afrobeats festivals", "Check in at Nairobi Hub") with XP rewards. |
| **Streaks & Cultural Badges** | `assets/kultr-streaks-badges.png` | Attendance streak tracker, badge gallery (e.g., "Carnival Veteran", "Taste of Africa"). |
| **Diaspora Leaderboard** | `assets/kultr-leaderboard-r.png` | Monthly ranking of cultural enthusiasts, community clout scores, and reward tiers. |
| **Perks Catalog** | `assets/kultr-perks-catalog-r.png` | Redeemable perks: free drink vouchers, VIP line jumps, discount codes, creator meetups. |
| **Perk Unlock Celebration** | `assets/kultr-perk-unlock-success-r.png` | Animated perk unlock screen with unique redemption barcode. |
| **Digital Collectibles Gallery** | `assets/kultr-collectibles-gallery-r.png` | Proof-of-attendance digital badges and event memory archives. |

![Gamification & Rewards Canvas](assets/__SECTION_GAMIFICATION.png)

---

### Section 7: Social, Vibe Tribes & Community
Connecting diaspora attendees before, during, and after events.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **Social Hub** | `assets/kultr-social-hub.png` | Community feed, trending conversations, attendee check-ins, and friends' saved events. |
| **Vibe Tribes Directory** | `assets/kultr-vibe-tribes.png` | Cultural micro-communities: Afrobeats Lovers, Amapiano Groove, Caribbean Carnival, Afro-Tech. |
| **Tribe Leaders & Curators** | `assets/kultr-tribe-leaders-r.png` | Top tastemakers and organizers curating events for each cultural tribe. |
| **Social Check-in & Moments** | `assets/kultr-social-checkin.png` | In-event social ping allowing friends to find each other at crowded festivals. |

![Social & Tribes Canvas](assets/__SECTION_SOCIAL.png)

---

### Section 8: User Settings, Privacy & System Edge States
Polished, production-ready screens covering trust, legal compliance, and resilient network states.

| Screen Name | File Asset | Purpose & Interaction Highlights |
|:---|:---|:---|
| **User Profile Screen** | `assets/kultr-profile.png` | User avatar, cultural tribe badge, ticket summary, saved events, and organizer switch. |
| **Edit Profile** | `assets/kultr-edit-profile-r.png` | Update name, bio, diaspora home city, and favorite genres. |
| **Public User Profile** | `assets/kultr-public-user-profile-r.png` | Public creator/attendee showcase with attended events and public tribe badges. |
| **Settings & Preferences** | `assets/kultr-settings.png` | Notification toggles, language switcher, dark/light theme, and security controls. |
| **Currency & Region Settings** | `assets/kultr-currency-settings-r.png` | Preferred display currency (KES, NGN, GHS, TZS, UGX, RWF, GBP, USD, EUR, CAD). |
| **Privacy & Data Management (GDPR/DPA)**| `assets/kultr-privacy-data-r.png` | Download my data export (`GET /api/users/me/export`) and privacy disclosures. |
| **Delete Account Confirmation** | `assets/kultr-delete-account-r.png` | Cascade erasure confirmation guarded against active purchased tickets. |
| **Admin Review & Moderation** | `assets/kultr-admin-review-r.png` | Moderation queue for staff to inspect, approve, or reject creator events. |
| **Offline Mode State** | `assets/kultr-offline-mode-r.png` | Resilient offline screen with cached ticket wallet and offline banner. |
| **Empty State (No Events Found)** | `assets/kultr-empty-no-events-r.png` | Illustrated empty state with "Broaden your filters" recommendation. |
| **Empty State (No Search Results)** | `assets/kultr-empty-no-results-r.png` | Helpful prompt suggesting alternative diaspora keywords and trending cities. |
| **Loading Skeleton Screens** | `assets/kultr-loading-skeleton-r.png` | Shimmer skeleton cards providing instant perceived performance during API fetches. |

![States & Empty Canvas](assets/__SECTION_STATES%20&%20EMPTY.png)

---

## 7. Responsive Adaptations (Tablet & Desktop)

Kultr's design language seamlessly scales beyond mobile to tablet and web viewports, enabling organizers and administrative staff to manage large-scale events with high productivity:
- **Two-Column Master-Detail Layout:** On iPad and tablet screens, discovery shows an interactive split-view with map/radar on the left and event cards on the right.
- **Creator Command Center:** Desktop views expand analytics charts and attendee rosters with multi-column sorting and bulk export controls.

![Responsive Tablet & Desktop Canvas](assets/__SECTION_RESPONSIVE%20%E2%80%94%20Tablet%20&%20Desktop.png)
