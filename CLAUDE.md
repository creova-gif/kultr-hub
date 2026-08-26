# CLAUDE.md — kultr-hub

Instructions for AI coding agents working in this repository.

## Project Overview

An events and ticketing platform for Kenya, Uganda, Tanzania, and Rwanda — React Native/Expo (iOS, Android, web), Express API server, Postgres. Users buy tickets via M-Pesa, MTN Mobile Money, or card; creators list events and request payouts. This is real, operationally mature infrastructure — a production cron job runs every 15 minutes reconciling payments that succeeded at the provider but never got a ticket issued (the app closing mid-flow between payment approval and the client's verification poll completing).

## Do Not Misclassify This Repo

This is not a low-engagement or experimental product. It has a real payout/disbursement system (`artifacts/api-server/src/routes/payouts.ts`, `createPayoutRequest`, `payoutBalanceResponse` by currency) and recent commits show real security discipline (shared-secret verification added to the M-Pesa webhook, targeted test coverage on the route file that matters). It's also one of three products referenced in `EAST-AFRICA-FINTECH-THESIS.md` (see root of the `creova` repo) alongside gopay and sauti-os — the thesis's proposed Sauti-Os → Kultr-Hub artist-payout architecture is technically supported by this repo's real payout system, not just a naming coincidence.

## Repository Structure

- `artifacts/api-server/` — the real Express backend, Postgres-backed.
- Payment collection (ticket purchases) and payout (creator disbursement) are two distinct capabilities — don't conflate them when extending either.

## Technology Stack

React Native/Expo, Express, Postgres. Has its own CI (`ci.yml`) plus a dedicated `reconcile-payments.yml` workflow — do not replace or duplicate either.

## AI Agent Rules

- Before touching the reconciliation cron logic, understand it handles a real payment/ticket state-consistency edge case — test any change against the "payment succeeded, ticket never issued" scenario specifically.
- If extending payouts toward other CREOVA products (per the fintech thesis), verify the actual API contract in `payouts.ts` rather than assuming a generic interface.

## Definition of Done

Changes to payment or payout logic include a test for the retry/reconciliation path, not just the happy path.
