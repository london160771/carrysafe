# PROJECT_STATE: Carry Safe

> Where the project actually stands. A progress log, not requirements (those live in `PRD.md`).
> Update at the end of every phase. Only write what was verified. If this file and the repo disagree, the repo wins.

**Last updated:** 2026-11-15 15:00 WAT · **By:** Claude (chat) · **Commit:** none yet

---

## 1. Right now

- **Active phase:** Phase 0: Foundation + Gate 0 (PRD §27), not started
- **Status:** Docs updated to v1.1 (no-billing plan); no code yet
- **Next step:** Scaffold the repo; research `sources.json` for JP, AE, SG, GR, GB, US; run Gate 0
- **Blocked by:** nothing for scaffolding. Later: App Check key or debug token (PRD §33 #2); medicine box photos on hold (PRD §33 #3)

## 2. Phase tracker

| Phase (PRD §27) | Status | Verified on | Commit | Review checkpoint |
|---|---|---|---|---|
| 0: Foundation + Gate 0 | Not started (Gate 0 step 0 passed) | 2026-11-14 | — | — |
| 1: Private scan + request guard | Not started | | | A |
| 2: Official-source route check | Not started | | | B |
| 3: Proof + group | Not started | | | — |
| 4: Border Card + accessibility | Not started | | | — |
| 5: P1 extras | Not started | | | — |
| 6: Judge Mode, README, video, submit | Not started | | | C |

## 3. Last verification

| Check | Command | Result | Date |
|---|---|---|---|
| Full gate | `npm run verify` | not run (no code) | — |
| Rules tests | `npm run test:rules` | — | — |
| UI at 390px | screenshot | — | — |
| Seed "Amaka-Tokyo" | manual | — | — |

## 4. What works (verified)

- Gemini Nano is downloaded on the demo laptop (HP EliteBook x360 1030 G2; performance class "Low"; GPU path) and replied to a text prompt. Verified 2026-11-14.
- Firebase project `carry-safe-30940` created; web app "Carry Safe" registered; AI Logic set up with the Gemini Developer API. Verified 2026-11-15 by console screenshot.

## 5. Real vs mocked right now

Nothing built. See `REAL_VS_MOCKED.md`.

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

## 9. Handoff notes

- **Read first:** `CLAUDE.md` (esp. §10 continuous mode), PRD §16 + §27 Phase 0, then this file.
- **Env vars needed (names only):** `VITE_FIREBASE_*` web config; `VITE_APPCHECK_SITE_KEY` (if the reCAPTCHA key is created); App Check debug token set in the browser console only, never committed.
- **Watch out for:** App Check enforcement on AI Logic; device-model init needs a user gesture; no billing.

## 10. Build log

- **2026-11-15** — Repo created; docs pushed; commit+push per passing phase approved; photos on hold.
- **2026-11-15** — PRD v1.1: no-billing plan (official-page fetch + quote verification + saved table), Vercel hosting, 6 countries, continuous phase mode; all docs updated.
- **2026-11-15** — Firebase project `carry-safe-30940` + web app + AI Logic set up by Adesope.
- **2026-11-14** — Idea locked (Carry Safe); docs v1.0 created.
