# Kultr Hub

**An events and ticketing platform for East African markets — discover events, buy tickets with mobile money, and manage events as a creator.**

[![Status](https://img.shields.io/badge/status-active_development-yellow)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

## Overview

A consumer-facing events and ticketing app for Kenya, Uganda, Tanzania, and Rwanda.

## Problem

East African event-goers and creators lack a unified platform for discovering events and paying for tickets via the mobile-money rails they actually use (M-Pesa, MTN Mobile Money), and independent creators lack straightforward payout tooling for their earnings.

## Solution

A React Native/Expo app for discovery and ticket purchase via mobile money or card, paired with creator-facing event management, sales tracking, and a real payout/disbursement system.

## Key Capabilities

- Event discovery and ticket purchase (M-Pesa, MTN Mobile Money, card)
- Creator tools: event listing, sales tracking, payout requests by currency balance
- Gamification layer (quests, KULTROINS, KULTR PASS)
- Admin moderation for event review and fraud reports
- Automated payment/ticket reconciliation

## Architecture

React Native/Expo (iOS, Android, web) backed by an Express API server and Postgres. A production cron job runs every 15 minutes reconciling payments that succeeded at the provider but never resulted in a ticket being issued — a real edge case (the app closing between payment approval and the client's verification poll completing). This is one of three connected products in the East Africa Fintech Thesis — see Documentation below.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React Native / Expo |
| Backend | Express |
| Database | Postgres |
| Deployment | Replit, synced from `main` |

## Repository Structure

`artifacts/api-server/` — the real backend, including `routes/payouts.ts` (the creator payout system) and the reconciliation logic.

## Getting Started

See `package.json` scripts for local dev setup (Expo-based — requires the Expo CLI).

## CI/CD

This repo has its own `ci.yml` plus a dedicated `reconcile-payments.yml` workflow for the payment reconciliation job — do not duplicate either.

## Security

A shared-secret check was recently added to the M-Pesa webhook, with test coverage targeted specifically at that route.

## Project Status

Actively developed and operationally mature — real production infrastructure (the reconciliation cron) is live right now, not just built. This is one of the more mature products in the portfolio despite being smaller in scope than the fintech-focused products.

## Roadmap

- [ ] Full security audit (not yet performed as part of the broader portfolio review)
- [ ] Scope the proposed Sauti-Os → Kultr-Hub artist payout integration if pursued

## Contributing

Private, proprietary CREOVA product.

## License

Proprietary — All Rights Reserved.

## Author / Organization

Built by [Justin Mafie](https://github.com/creova-gif) under CREOVA.

## Documentation

One of three connected products in the [East Africa Fintech Thesis](https://github.com/creova-gif/creova/blob/main/EAST-AFRICA-FINTECH-THESIS.md), alongside [Gopay](https://github.com/creova-gif/gopay) and [Sauti-Os](https://github.com/creova-gif/sauti-os) — this is the payment-rail and creator-payout layer. See `CLAUDE.md` for AI-agent-specific notes.
