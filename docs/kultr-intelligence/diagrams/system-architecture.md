# System Architecture Diagram

```mermaid
graph TD
    subgraph Clients["Client Layer (Mobile & Web)"]
        Mobile["Kultr Mobile App (iOS / Android / Web)<br/>• React Native / Expo Router (v54)<br/>• TanStack React Query v5<br/>• Generated OpenAPI Client Hooks<br/>• Offline SQLite / Storage Engine"]
    end

    subgraph Gateway["API & Edge Gateway"]
        ReverseProxy["Edge Reverse Proxy / CDN<br/>• Replit Ingress / Caddy / Cloudflare<br/>• SSL Termination<br/>• Static Asset CDN"]
        RateLimiter["Rate Limiting Middleware<br/>• Redis-backed (ioredis)<br/>• In-memory Fallback<br/>• IP & User-based Quotas"]
    end

    subgraph AppServer["Backend Application Server (Express 5 / Node.js 24)"]
        AuthMw["Authentication & Authorization Middleware<br/>• JWT Verification (HS256)<br/>• tokenVersion Invalidation Gate<br/>• Role Verification (isAdmin, isVerifiedOrganizer)"]
        
        subgraph SubRoutes["API Route Controllers (/api)"]
            AuthRoute["/auth (Signup, Login, SMS OTP)"]
            EventsRoute["/events (Discovery, Status, Reports, Moderation)"]
            TicketsRoute["/tickets (Retrieval, Details, QR Verification)"]
            PaymentsRoute["/payments (Paystack Card, M-Pesa STK, MTN MoMo)"]
            GamifyRoute["/quests, /wallet, /check-in, /pass, /perks"]
            PayoutsRoute["/payouts (Balance Calculation, Requests, Admin Approvals)"]
            UsersRoute["/users (Export DPA, Delete Erasure, Public Profile)"]
            BeveragesRoute["/beverages (Catalog, Bundles, Vouchers, Bar Scanning)"]
        end

        subgraph CoreEngines["Core Domain Engines & Services"]
            IssueEngine["Ticket Issuance Engine<br/>• Serialized DB Locks (SELECT FOR UPDATE)<br/>• Capacity Invariant Enforcement<br/>• Cryptographic QR Matrix Minting"]
            LedgerEngine["KULTROIN Ledger Engine<br/>• Append-only Idempotent Transactions<br/>• KULTR PASS Multiplier Engine (2x)<br/>• Rarity Milestone Evaluator"]
            PaymentOrch["Payment Orchestrator<br/>• Strict Simulation Gating (NODE_ENV !== 'production')<br/>• Webhook Verification & Polling Reconciler"]
            VoucherEngine["Beverage & Bar Voucher Engine<br/>• HMAC-SHA256 Token Signature<br/>• Counter Decrement (Multi-can)<br/>• Offline Bartender Replay Protection"]
        end
    end

    subgraph DataTier["Data & Cache Layer"]
        Postgres[(PostgreSQL 16 Engine)<br/>• Drizzle ORM (Schema & Migrations)<br/>• 24 Relational Tables<br/>• Row-level Locks & ACID Transactions]
        Redis[(Redis Cache & Session Store)<br/>• Token Revocation Blocklist<br/>• Sliding-window Rate Limits<br/>• Idempotency Cache Keys]
    end

    subgraph ExternalProviders["External Gateways & Providers"]
        MpesaGW["Safaricom Daraja API<br/>(M-Pesa STK Push / B2C)"]
        MoMoGW["MTN MoMo Access Point<br/>(Request-to-Pay / Sandbox)"]
        PaystackGW["Paystack API Gateway<br/>(Card Processing / Hosted Checkout)"]
        SmsGW["Africa's Talking SMS API<br/>(Transactional OTP Codes)"]
        SentryMonitoring["Sentry Telemetry<br/>(Crash Reporting & Tracing)"]
    end

    %% Connections
    Mobile --> ReverseProxy
    ReverseProxy --> RateLimiter
    RateLimiter --> AuthMw
    AuthMw --> SubRoutes

    SubRoutes --> CoreEngines
    CoreEngines --> Postgres
    CoreEngines --> Redis

    PaymentsRoute --> PaymentOrch
    PaymentOrch --> MpesaGW
    PaymentOrch --> MoMoGW
    PaymentOrch --> PaystackGW
    AuthRoute --> SmsGW
    AppServer --> SentryMonitoring
    Mobile --> SentryMonitoring
```
