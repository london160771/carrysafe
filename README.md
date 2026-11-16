# Carry Safe

**Your medicine. Your secret. Your trip, safe.**

Carry Safe checks whether your medicine is legal at every stop on your trip, including layovers. Your laptop reads the label privately, and only the ingredient name goes out to be checked against official government pages, with the exact quote verified.

[Live demo](#) · [Judge Mode](#) · [Demo video](#) · Tests: [after they pass]

> Built for #BuildHybridAI 2026 (Google Firebase) with Firebase AI Logic hybrid inference. 🚧 In progress: P0 code complete; live cloud runs pending setup.

## The problem
Normal medicine can be controlled abroad: pseudoephedrine is prohibited in Japan, and ADHD medicine needs documents in the UAE. Rules change at every stop, even at a layover. Checking means reading embassy pages in other languages, or sharing your medical details with sites you don't trust.

## What it does
`SCAN → HIDE → CHECK EVERY STOP → SHARE STATUS → SHOW THE OFFICER`
- **Private scan:** on-device Gemini Nano reads the label; a Framing Coach tells you out loud how to hold the box.
- **Every stop:** each ingredient is checked for your destination and layovers against official government pages (Japan, UAE, Singapore, Greece, UK, USA).
- **Quote or it didn't happen:** the app only says ✅ or ⛔ when the rule's exact sentence is found on the official page.
- **Proof of privacy:** a "What left your laptop" panel shows exactly what was sent.
- **Group trips:** everyone sees who's at risk, never anyone's medicine.
- **Show the Officer:** a Japanese Border Card that reads itself aloud.

## Judge path, 60 seconds
1. Open `/judge` → **Run the demo trip**.
2. **Results** → Japan ⛔ with "Quote found on official page ✓".
3. **What left your laptop** → **Try to break it**.
4. **Border Card** → **Show the Officer** → **Read aloud in Japanese**.

## What's real
See [REAL_VS_MOCKED.md](REAL_VS_MOCKED.md).

## How it uses Firebase
| Firebase tool | What it does | File |
|---|---|---|
| AI Logic `ONLY_ON_DEVICE` | Framing Coach + label extraction | `src/ai/onDevice.js` |
| AI Logic `ONLY_IN_CLOUD` | Verdict + quote from official page paragraphs; brand suggestions | `src/ai/verdict.js`, `src/ai/brandSuggest.js` |
| AI Logic `PREFER_IN_CLOUD` | Border Card translation | `src/ai/translateCard.js` |
| Auth · Firestore · App Check | Accounts, group status, rule cache, protection | `src/firebase/*` |

Hosting: Vercel (app + `/api/source`, which fetches only listed official pages).

## Architecture
See PRD §13.

## Tested, not claimed
As of 2026-11-15, `npm run verify` passes with 32 test files and 137 unit tests, and `npm run test:rules` passes 7 Firestore rules tests in the emulator. Each invariant in PRD §11 has its own tests, for example `src/privacy/buildCloudRequest.test.js` (INV-1/2), `src/core/verifyQuote.test.js` (INV-3), `tests/rules/` (INV-4), `src/meds/medicine.test.js` (INV-6) and `api/source.test.js` (INV-7).

Not yet verified live: on-device Nano reading, cloud verdicts and translation. These need the Firebase web config, an App Check debug token and desktop Chrome. See `docs/gate0.md`.

## Run it locally
```bash
npm install
cp .env.example .env.local   # fill in the Firebase web config (public by design)
npm run dev                  # app + /api/source on http://localhost:5173
npm run verify               # lint + unit tests + build
npm run test:rules           # Firestore rules in the emulator (needs Java)
npm run dev:emulators        # app against local Auth + Firestore emulators
```
On-device features need desktop Chrome 139+ with the Gemini Nano Prompt API. `/gate0.html` runs the Gate 0 checks.

### App Check (debug token)
1. Run `npm run dev` and open the app in Chrome.
2. Open DevTools → Console and copy the line `App Check debug token: …`.
3. In the Firebase console, open App Check → Apps → ⋮ → Manage debug tokens, then add the token.
4. Never commit the token. To reuse a token in a browser, run `localStorage.setItem('carrysafe.appCheckDebugToken', '<token>')`.

## Known limits
- Information, not legal or medical advice. Always confirm with the embassy.
- Covers 6 countries; others show "not covered yet".
- On-device scanning needs desktop Chrome; phones use typing or voice instead.
- Border Card language: Japanese (more are planned).
- Greece uses the UK FCDO Greece page (no fetchable Greek government page found). The US uses the FDA page (CBP blocks automated fetches).
- Japan's pages name pseudoephedrine but not paracetamol, so paracetamol in Japan shows ⚠ "not mentioned".
- `/api/source` reads HTML only. PDF sources aren't supported yet.

## Roadmap
More countries · Search grounding · more card languages + natural voices · Android/iOS apps. See [ROADMAP.md](ROADMAP.md).

## License
Apache-2.0
