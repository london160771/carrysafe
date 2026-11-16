# PROJECT_STATE: Carry Safe

> Where the project actually stands. A progress log, not requirements (those live in `PRD.md`).
> Update at the end of every phase. Only write what was verified. If this file and the repo disagree, the repo wins.

**Last updated:** 2026-11-15 16:35 WAT · **By:** Claude Code · **Commit:** see git log (`feat: phase 0 foundation`)

---

## 1. Right now

- **Active phase:** Phase 4 code done. P0 code is complete; Phase 5 (P1) waits until P0 is deployed and recorded (PRD §26). Real cloud runs wait on the Firebase web config + App Check debug token.
- **Status:** Scaffold, Firebase init, `/api/source` (real HTML fetch, allow-list, timeout, size cap), `sources.json` (6 countries, 8 pages), Gate 0 harness (`/gate0.html`), generated sample labels. `npm run verify` passes.
- **Next step:** Adesope: Firebase web config in `.env.local` + Vercel, App Check debug token, Vercel team access, run `/gate0.html` on the demo laptop. Decision on Japan pseudoephedrine category (see `docs/gate0.md`).
- **Blocked by:** Firebase web config + debug token (Gate 0 step 5); Vercel access (deploy); demo laptop (steps 1, 2, 6).

## 2. Phase tracker

| Phase (PRD §27) | Status | Verified on | Commit | Review checkpoint |
|---|---|---|---|---|
| 0: Foundation + Gate 0 | Code done; Gate 0 steps 0 + 3 PASS, 1/2/4/5/6 pending | 2026-11-15 | `feat: phase 0 foundation` | — |
| 1: Private scan + request guard | Code done; on-device run pending on demo laptop | 2026-11-15 | `feat: phase 1 private scan + request guard` | A: done (2 fixes) |
| 2: Official-source route check | Code done; live verdicts pending Firebase config | 2026-11-15 | `feat: phase 2 official-source route check` | B: done (2 gaps logged) |
| 3: Proof + group | Done (emulator); rules deploy pending | 2026-11-15 | `feat: phase 3 proof panel, lab, group trip` | — |
| 4: Border Card + accessibility | Code done; real translation/voice/screen reader pending | 2026-11-15 | `feat: phase 4 border card, officer mode, voice, a11y` | — |
| 5: P1 extras | Held: P0 must be deployed + recorded first (PRD §26) | | | — |
| 6: Judge Mode, README, video, submit | `/judge` + README + LICENSE done; deploy/video/submit pending | 2026-11-15 | `feat: judge mode, README, license` | C: pending |

## 3. Last verification

| Check | Command | Result | Date |
|---|---|---|---|
| Full gate | `npm run verify` | PASS: lint 0 warnings, 31 files / 135 tests, build OK | 2026-11-15 |
| Rules tests | `npm run test:rules` | PASS: 7 tests (Firestore emulator) | 2026-11-15 |
| UI at 390px | Playwright screenshot of `/` and `/gate0.html` | no horizontal scroll (scrollWidth 390) | 2026-11-15 |
| Seed "Amaka-Tokyo" | manual | — | — |

## 4. What works (verified)

- Gemini Nano is downloaded on the demo laptop (HP EliteBook x360 1030 G2; performance class "Low"; GPU path) and replied to a text prompt. Verified 2026-11-14.
- Firebase project `carry-safe-30940` created; web app "Carry Safe" registered; AI Logic set up with the Gemini Developer API. Verified 2026-11-15 by console screenshot.

## 5. Real vs mocked right now

- `/api/source`: real fetch of the 8 listed official pages (verified from the dev container, not yet from Vercel).
- Generated sample labels in `samples/generated/` (marked SAMPLE LABEL). See `REAL_VS_MOCKED.md`.

## 6. Live proof

| Item | Value |
|---|---|
| Live URL (Vercel) | [ ] |
| Judge Mode | [ ] |
| Firebase project | `carry-safe-30940` (Spark) |
| Repo | https://github.com/london160771/carrysafe |
| App Check | Unregistered (reCAPTCHA Enterprise key attempt pending; fallback: debug token) |

## 7. Demo recordings (PRD §22)

| Act | Recorded? | File / link | Date |
|---|---|---|---|
| 1: The trip | no | | |
| 2: Scan | no | | |
| 3: Check every stop | no | | |
| 4: Proof | no | | |
| 5: Group + Officer | no | | |

## 8. Known issues and limitations

- Billing sign-up blocked by Google's fraud check (Nov 15) → no Search grounding; official-page fetch instead (PRD §16).
- Demo laptop is performance class "Low"; on-device responses may be slow.
- Japan pseudoephedrine: MHLW lists it as a "Stimulants' Raw Material" (permission in advance); UK FCDO says carrying it is illegal. PRD story assumes ⛔. Decision pending.
- Greece has no fetchable Greek government page with traveller rules; UK FCDO Greece is used.
- Paracetamol is not named on the JP pages, so a JP ✅ can't be quote-verified yet (INV-3 → ⚠).
- Cloud model is `gemini-3.5-flash-lite` (Gate 0 step 5 passed 2026-11-16).
- Firestore rules not deployed yet, so rule-cache and group writes fail on the real project.

## 9. Handoff notes

- **Read first:** `CLAUDE.md` (esp. §10 continuous mode), PRD §16 + §27 Phase 0, then this file.
- **Env vars needed (names only):** `VITE_FIREBASE_*` web config; `VITE_APPCHECK_SITE_KEY` (if the reCAPTCHA key is created); App Check debug token set in the browser console only, never committed.
- **Watch out for:** App Check enforcement on AI Logic; device-model init needs a user gesture; no billing.

## 10. Build log

- **2026-11-16** — Firebase config added locally; Anonymous Auth, Firestore DB and App Check debug token set up by Adesope. Live seed run: 3 verified verdicts (AE methylphenidate needs documents, AE paracetamol allowed, JP pseudoephedrine needs documents); saved to fallback table. Model switched to gemini-3.5-flash-lite. Unverified conditions now hidden on the card.

- **2026-11-15** — Phase 6 (partial): /judge seeded demo, README setup + limits, LICENSE. Report: `docs/phase-reports/phase-6-partial.md`.

- **2026-11-15** — Phase 4: translateCard, Border Card, Show the Officer, voice add, settings bar. Report: `docs/phase-reports/phase-4.md`.

- **2026-11-15** — Phase 3: outgoing log panel, privacy lab (5/5 blocked in emulator run), group trip + status grid, Firestore rules + 7 emulator tests, emulator dev mode. Report: `docs/phase-reports/phase-3.md`.

- **2026-11-15** — Phase 2 code: verifyQuote, paragraphPicker, synonyms, verdict state machine, route expansion, cloud verdict, rule cache + rules, fallback loader, route builder, Results screen, local /api in Vite. Report: `docs/phase-reports/phase-2.md`.

- **2026-11-15** — Phase 1 code: request guard, cloud sender + outgoing log, on-device Framing Coach + extraction, brand suggestion, confirm step, IndexedDB store, Add-medicine screen. Report: `docs/phase-reports/phase-1.md`.

- **2026-11-15** — Phase 0 code: Vite 8 + React 19 + Bootstrap 5.3 scaffold, Vitest, ESLint; Firebase init (Auth anon, Firestore, App Check debug/reCAPTCHA Enterprise, AI Logic); `/api/source`; `sources.json`; Gate 0 harness; sample labels. Verify passes (29 tests).

- **2026-11-15** — Repo created; docs pushed; commit+push per passing phase approved; photos on hold.
- **2026-11-15** — PRD v1.1: no-billing plan (official-page fetch + quote verification + saved table), Vercel hosting, 6 countries, continuous phase mode; all docs updated.
- **2026-11-15** — Firebase project `carry-safe-30940` + web app + AI Logic set up by Adesope.
- **2026-11-14** — Idea locked (Carry Safe); docs v1.0 created.
