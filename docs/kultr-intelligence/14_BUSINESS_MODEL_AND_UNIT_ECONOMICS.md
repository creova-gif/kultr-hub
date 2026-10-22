# 14 — Business Model & Unit Economics

> **Volume 14 — Commercial Monetization, Transaction Economics & Unit Margins**  
> **Prepared by:** Chief Financial Officer & Startup Financial Analyst  
> **Evidence Status:** Mix of `VERIFIED` (Implemented Fee Logic & Cart Totals), `DOCUMENTED` (PRD Revenue Models), and `PROPOSED` (Financial Modeling)

---

## 1. Multi-Stream Monetization Model

Kultr generates revenue across four complementary software and commerce streams:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KULTR REVENUE STREAMS                           │
├─────────────────────┬─────────────────────┬────────────────────────────┤
│ 1. TICKETING FEES   │ 2. BEVERAGE MARGINS │ 3. PREMIUM SERVICES        │
├─────────────────────┼─────────────────────┼────────────────────────────┤
│ • 3.5% – 5.0% Take  │ • Kultr Canned      │ • KULTR PASS ($19.99/yr)   │
│   Rate on GMV       │   Drinks 4-packs    │ • Featured Placements      │
│ • Fixed flat fee    │ • Express Bar Lane  │ • Brand Sponsorships       │
│   ($0.50 / KSh 50)  │   margins (55–65%)  │ • Organizer Studio Pro     │
└─────────────────────┴─────────────────────┴────────────────────────────┘
```

---

## 2. Unit Economics Waterfall

To evaluate commercial sustainability, we model a standard **$30.00 (KES 3,900 / ₦45,000 / £24.00)** ticket purchase with an optional **$12.00** Kultr Canned Drinks 4-pack add-on:

### Scenario A: Standalone Ticket Purchase ($30.00 Gross Ticket Value)

| Line Item | Percentage / Basis | Dollar Value | Cumulative / Margin |
|:---|:---|:---:|:---:|
| **Gross Ticket Value (GTV)** | 100.0% | **$30.00** | $30.00 |
| **Kultr Platform Fee** (Charged to Buyer or Split) | 5.0% + $0.50 | **+$2.00** | $32.00 Total Charged |
| **Payment Gateway Processing** (M-Pesa / Paystack) | ~2.0% average | **-$0.64** | $31.36 |
| **Net Organizer Proceed** | Disbursed to Creator | **-$30.00** | $1.36 Gross Margin |
| **SMS OTP & Infrastructure Allocation** | Per-ticket AWS/DB/SMS cost | **-$0.12** | $1.24 Contribution Margin |
| **Kultr Net Contribution Margin** | **62.0% of Platform Fee** | **+$1.24** | **4.1% Net Take on GTV** |

### Scenario B: Ticket Bundled with Kultr Canned Drinks 4-Pack ($42.00 Total Cart)

| Line Item | Unit Economics | Dollar Value | Impact |
|:---|:---|:---:|:---:|
| **Gross Cart Value** | Ticket ($30) + Drink Pass ($12) | **$42.00** | Top-line GMV expansion (+40%) |
| **Ticket Fee Revenue** | 5.0% + $0.50 | **+$2.00** | Core software fee |
| **Drink 4-Pack Retail Price** | Pre-sale discounted festival bundle | **+$12.00** | Commerce revenue |
| **Cost of Goods Sold (COGS)** | Contract canning, hibiscus/coffee, freight | **-$4.20** | ~65% Gross Beverage Margin |
| **Organizer Beverage Split** | Promoter incentive / venue commission | **-$3.00** | Promotes organizer alignment |
| **Payment Gateway Processing** | 2.0% on $44 total | **-$0.88** | Gateway cost |
| **Total Kultr Net Profit on Order** | Software ($1.24) + Beverage ($3.92) | **+$5.16** | **316% Higher Profit per Attendee** |

> **Key Financial Finding:** Integrating festival beverage add-ons dramatically shifts unit economics: profit per attendee increases from **$1.24 to $5.16 (+316%)** while solving a painful festival bottleneck for organizers and consumers alike.

---

## 3. Financial Scale Modeling (Low, Medium, High Scenarios)

The following models project annual performance based on varying levels of event adoption across 3 primary launch hubs (Nairobi, Lagos, London).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANNUAL FINANCIAL PROJECTIONS                    │
├──────────────────────────┬──────────────┬──────────────┬───────────────┤
│ METRIC                   │ LOW (Year 1) │ MED (Year 2) │ HIGH (Year 3) │
├──────────────────────────┼──────────────┼──────────────┼───────────────┤
│ Active Events Hosted     │ 250          │ 1,200        │ 5,000         │
│ Total Tickets Sold       │ 75,000       │ 450,000      │ 2,500,000     │
│ Average Ticket Price     │ $22.00       │ $25.00       │ $28.00        │
│ Gross Ticketing GMV      │ $1,650,000   │ $11,250,000  │ $70,000,000   │
│ Average Take Rate        │ 4.5%         │ 4.8%         │ 5.0%          │
│ Ticketing Fee Revenue    │ $74,250      │ $540,000     │ $3,500,000    │
│ Drink Bundles Sold (25%) │ 18,750       │ 112,500      │ 625,000       │
│ Beverage Net Margin      │ $73,125      │ $438,750     │ $2,437,500    │
│ KULTR PASS Subscriptions │ 1,200 ($24k) │ 7,500 ($150k)│ 45,000 ($900k)│
│ TOTAL NET REVENUE        │ **$171,375** │ **$1,128,750**│ **$6,837,500**│
│ Operating Expenses       │ -$145,000    │ -$620,000    │ -$2,400,000   │
│ EBITDA MARGIN            │ **+$26,375** │ **+$508,750**│ **+$4,437,500**│
│ EBITDA %                 │ **15.4%**    │ **45.1%**    │ **64.9%**     │
└──────────────────────────┴──────────────┴──────────────┴───────────────┘
```

---

## 4. Working Capital Float & Risk Management

In live event ticketing, customer cash is collected at checkout days, weeks, or months before the event occurs.
- **Float Economics:** At medium scale ($11.25M GMV), Kultr will hold an average working capital float of **$1.2M to $2.5M** in merchant settlement accounts.
- **Chargeback & Cancellation Reserves:** To mitigate the risk of promoter cancellations, artist no-shows, or weather emergencies, Kultr enforces an automated **15% payout holdback** until 48 hours post-event.
- **Anti-Fraud Guard:** Events submitted by unverified organizers require manual admin approval before tickets can be published, ensuring zero fraudulent listings capture funds.
