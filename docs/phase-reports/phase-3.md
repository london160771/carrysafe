# Phase 3 report: Proof + group (PRD §27)

**Date:** 2026-11-15 · **Verify:** PASS (lint 0 warnings, 27 files / 129 tests, build OK) · **Rules:** `npm run test:rules` PASS (7 tests, Firestore emulator)

## Built
- "What left your laptop" screen (FR-PRIV-002): live log of every cloud AI request, official-page fetch, Firestore write and lab attempt with its exact payload (very long strings are shortened on screen, with the hidden length shown).
- Privacy and truth lab (PRD §18): the 5 attempts run through the real guard, real `/api/source`, real `verifyQuote` against the fetched Japan page, and a real Firestore read.
- Group trip (FR-GRP-001): create, invite link `#/join/<tripId>`, join with a label, status grid, share status (worst verdict per country, no medicine names), leave.
- `firestore.rules`: members-only reads; self-only member/status writes; status keys limited to country codes and values limited to verdict words; trip writes by the creator only; rule cache has no user field.
- Emulator mode (`npm run dev:emulators`, `.env.emulators` with demo values only).

## Manual checks (headless Chromium + Auth/Firestore emulators, 390px)
- Two browser contexts: Amaka creates the trip, Mum joins by link and shares status, and Amaka sees "Mum ⛔ Prohibited" for Japan. Mum's status came from injected local results because the live cloud verdict needs the Firebase config.
- Lab: **5/5 blocked** (`field_not_allowed`, `image_not_allowed`, `quote_not_found`, `source_not_allowed`, `not_trip_member`).
- No horizontal scroll at 390px.

## Limits
- Against the real project, `firestore.rules` has not been deployed yet. Adesope needs to run `firebase deploy --only firestore:rules`.
- Act 4 + group recordings are pending.

## Parked
- Nothing new.
