# Phase 2 report: Official-source route check (PRD §27)

**Date:** 2026-11-15 · **Verify:** PASS (lint 0 warnings, 23 files / 120 tests, build OK)

## Built
- `src/core/verifyQuote.js` + `normaliseText.js` (FR-CHECK-002, INV-3): NFKC, case, whitespace, curly quotes/dashes; quotes under 20 chars rejected.
- `src/core/paragraphPicker.js` (FR-SRC-003): ingredient names first, then class terms ("controlled medication", "Stimulants' Raw Materials"…), 2 lines before / 1 after, ≤ 12 paragraphs × 2000 chars.
- `src/data/synonyms.json` + `src/core/synonyms.js`: salts, US names, Japanese names.
- `src/core/verdictState.js`: state machine; illegal transitions throw; allowed / needs_documents / prohibited need a verified quote.
- `src/core/route.js` (FR-ROUTE-001): layovers + destination checked, home skipped, deduped.
- `src/ai/verdict.js` (FR-CHECK-001): `ONLY_IN_CLOUD`, JSON schema, through `buildCloudRequest`.
- `src/check/checkStop.js`: not covered → official advice link; fetch → cache (hash match, quote re-verified) → paragraphs → cloud → verify → cache write (verified only). Cloud down → cached verdict if its quote still verifies.
- `src/firebase/ruleCache.js` + `firestore.rules` (FR-CHECK-003, INV-4): `rules/{ingredient_country}` with only allow-listed fields.
- `src/check/fallbackVerdicts.js` (FR-CHECK-004): loader + validator (quote must be in a saved page excerpt). Table is empty until the Japan decision and Gate 0 step 4.
- Route builder (Trip screen), Results screen with icon + word, quote, "Quote found on official page ✓", authority link, date, Ran-on badge, saved/cache labels.
- Local `/api/source` in `vite dev` and `vite preview` (no Vercel CLI needed).

## Manual checks (headless Chromium, no Firebase config)
- NG → AE → JP with pseudoephedrine + paracetamol: 4 results, all ⚠ with honest reasons ("cloud check is not set up", "page does not mention this ingredient"). Outbound: only `/api/source?country=AE` and `?country=JP`.
- 390px: no horizontal scroll.

## Real pages vs the PRD seed (see `docs/gate0.md`)
- paracetamol is not named on any JP page → JP paracetamol will be ⚠ "not mentioned", not ✅.
- pseudoephedrine is not named on AE pages → ⚠ "not mentioned".
- methylphenidate × AE: only class text ("controlled medication") is sent.

## Checkpoint B (self-review)
- OK: every cloud call goes through `buildCloudRequest`; paragraphs capped to the guard's limits; cache stores no user field and rules enforce the key list.
- Gap: PDF parsing for `/api/source` (FR-SRC-002) not built. No listed source is a PDF today. Add a pinned parser when a PDF source is added.
- Gap: seed verdicts 3/3 with verified quotes (Gate 0 step 4) not run. Needs the Firebase web config + App Check debug token.

## Parked
- Nothing new.
