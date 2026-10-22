# 18 — AI Capabilities & Data Intelligence Strategy

> **Volume 18 — Intelligent Systems, Recommendation Engines & Data Architecture**  
> **Prepared by:** Chief AI Officer & Lead Data Scientist  
> **Evidence Status:** `VERIFIED` (Current State Analysis) & `PROPOSED` (AI Roadmap)

---

## 1. Reality Check: Current Implementation State

Many early-stage product pitches claim extensive "AI-driven" features that, upon code inspection, are simply static filters or basic heuristics.

**The Verified Codebase Truth (`VERIFIED`):**
- Kultr currently contains **zero production machine learning models** or proprietary neural networks.
- Event discovery on the home feed (`app/(tabs)/index.tsx`) uses deterministic category filtering and date sorting.
- The "Culture Compass" pin layout (`app/culture-compass.tsx`) uses a stable mathematical hash (`hashId(e.id)`) rather than an ML-driven spatial projection.
- **Verdict:** This is the *correct* engineering decision for an MVP. Implementing complex deep-learning recommendation systems prior to having millions of user interaction events is wasteful and counterproductive.

---

## 2. High-Impact, Pragmatic AI Opportunities

As user volume scales, Kultr can introduce targeted, high-ROI AI capabilities using standard pre-trained foundation models and proven recommendation algorithms:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KULTR AI STRATEGY ROADMAP                       │
├─────────────────────┬─────────────────────┬────────────────────────────┤
│ 1. SEMANTIC SEARCH  │ 2. RECOMMENDATIONS  │ 3. CREATOR COPILOT         │
├─────────────────────┼─────────────────────┼────────────────────────────┤
│ • Natural Language  │ • Hybrid Content /  │ • Automated Copywriting    │
│   Intent Matching   │   Collaborative     │ • Optimal Tier Pricing     │
│ • "Vibe" Queries    │ • pgvector in PG16  │ • Anomaly Fraud Detection  │
└─────────────────────┴─────────────────────┴────────────────────────────┘
```

### 2.1 Semantic & Natural Language Event Search (Phase 2)
- **Problem:** Users often search for feelings or vibes rather than exact artist names (e.g., *"rooftop day party with soulful Amapiano and good food in Nairobi this Sunday"*). Current SQL `ilike` pattern matching returns zero results for conceptual queries.
- **Proposed Approach:** 
  - Generate text embeddings of event descriptions, categories, and tags using lightweight embeddings (`text-embedding-3-small` or open-source `bge-small-en-v1.5`).
  - Store 384/1536-dimensional vectors directly in PostgreSQL using the `pgvector` extension.
  - Query using cosine similarity (`<=>`), returning semantically relevant events even with zero keyword overlap.
- **Complexity:** Low; requires no proprietary model training.

### 2.2 Personalized Discovery & Recommendation Engine (Phase 3)
- **Problem:** As thousands of events populate the feed across 10 hubs, users experience decision fatigue.
- **Proposed Approach:**
  - **Cold Start:** Rule-based scoping based on the user's selected Hub, Vibe Tribe memberships, and onboarding preferences.
  - **Warm State:** Implicit interaction matrix (events viewed, favorited, tickets purchased, and quests completed). Apply matrix factorization (Implicit ALS) or simple item-to-item collaborative filtering.
- **Evaluation Metric:** Click-through rate (CTR) on the "For You" carousel; ticket conversion lift.

### 2.3 Creator Studio Marketing Assistant (Phase 3)
- **Problem:** Independent promoters often struggle with writing compelling marketing copy, email announcements, and Instagram captions.
- **Proposed Approach:** Embed a lightweight LLM prompt template in `app/create-event.tsx`. When a creator inputs the event title, artist lineup, and genre, the copilot generates 3 polished promotional descriptions, suggested ticket tiers, and Instagram caption hooks.
- **Complexity:** Minimal; standard API call to an LLM provider (Gemini 1.5 Flash / Claude 3.5 Haiku) with sub-second latency.

### 2.4 Fraud Anomaly Detection (Phase 4)
- **Problem:** Fraudsters testing stolen credit cards or automated bots scalping VIP tickets during high-demand festival releases.
- **Proposed Approach:** Isolation Forest or rule-based velocity scoring monitoring transaction rate per IP, geographic card mismatch, and abnormal checkout intervals (<2 seconds between page load and payment).
