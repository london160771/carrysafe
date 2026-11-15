# Phase 0 report: Foundation + Gate 0 (PRD §27)

**Date:** 2026-11-15 · **Verify:** `npm run verify` PASS (lint 0 warnings, 8 files / 29 tests, build OK)

## Built
- Vite 8 + React 19 + Bootstrap 5.3 scaffold; Vitest 5; ESLint 10 flat config; `npm run verify`.
- Firebase init: config from `VITE_FIREBASE_*` (fails closed with `config_missing`), App Check (reCAPTCHA Enterprise if `VITE_APPCHECK_SITE_KEY`, else debug token), anonymous Auth, Firestore, AI Logic model factories.
- `/api/source?country=XX`: registry-only fetch, 8 s timeout, 3 MB cap, HTML → text, sha256.
- `src/data/sources.json`: 6 countries, 8 official pages, schema test.
- Gate 0 harness `/gate0.html` (steps 1, 2, 3, 5, 6).
- Generated SAMPLE labels for pseudoephedrine and methylphenidate.

## Manual checks
- All 8 official pages fetched from the dev container (`docs/gate0.md`).
- 390px screenshots of `/` and `/gate0.html`: no horizontal scroll.

## Limits / waiting on Adesope
- Gate 0 steps 1, 2, 5, 6 need the demo laptop, the Firebase web config and an App Check debug token.
- Vercel deploy needs team access.
- Japan pseudoephedrine category conflict (MHLW vs UK FCDO), decision asked.

## Parked
- Nothing new.
