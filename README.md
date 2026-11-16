# Carry Safe

**Your medicine. Your secret. Your trip, safe.**

Carry Safe checks whether your medicine is legal at every stop on your trip, including layovers. Your laptop reads the label privately, and only the ingredient name goes out to be checked against official government pages, with the exact quote verified.

[Live demo](https://carrysafe-rho.vercel.app) · [Judge Mode](https://carrysafe-rho.vercel.app/judge) · [Demo video](#) · Tests: 153 unit + 7 rules passing (2026-11-16)

> Built for #BuildHybridAI 2026 (Google Firebase) with Firebase AI Logic hybrid inference.

## The problem
Normal medicine can be controlled abroad: pseudoephedrine is prohibited in Japan, and ADHD medicine needs documents in the UAE. Rules change at every stop, even at a layover. Checking means reading embassy pages in other languages, or sharing your medical details with sites you don't trust.

## What it does
`SCAN → HIDE → CHECK EVERY STOP → SHARE STATUS → SHOW THE OFFICER`
- **Private scan:** on-device Gemini Nano reads the label; a Framing Coach tells you out loud how to hold the box.
- **Every stop:** each ingredient is checked for your destination and layovers against official government pages (Japan, UAE, Singapore, Greece, UK, USA).
- **Quote or it didn't happen:** the app only says ✅ or ⛔ when the rule's exact sentence is found on the official page.
- **Proof of privacy:** a "What left this device" panel shows exactly what was sent.
- **Group trips:** everyone sees who's at risk, never anyone's medicine.
- **Show the Officer:** a Japanese Border Card that reads itself aloud. Scan the QR code to carry it on your phone (the card travels inside the link, nothing is uploaded), or print it.
- **Installable:** add it to your phone's home screen; the saved card opens with no signal.

## Judge path, 60 seconds
1. Open `/judge` → **Run the demo trip**.
2. **Results** → Japan ⛔ with "Quote found on official page ✓".
3. **What left this device** → **Try to break it**.
4. **Border Card** → **Show the Officer** → **Read aloud in Japanese**. Or scan the QR code with a phone.

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
As of 2026-11-16, `npm run verify` passes with 36 test files and 153 unit tests, and `npm run test:rules` passes 7 Firestore rules tests in the emulator (last run 2026-11-15; rules unchanged since). Each invariant in PRD §11 has its own tests, for example `src/privacy/buildCloudRequest.test.js` (INV-1/2), `src/core/verifyQuote.test.js` (INV-3), `tests/rules/` (INV-4), `src/meds/medicine.test.js` (INV-6) and `api/source.test.js` (INV-7).

Verified live (2026-11-16): cloud verdicts with verified quotes, the shared rule cache, group trips, the lab, the QR card on a real phone with no signal, and on-device Nano label reading plus the Japanese voice on the demo laptop. See `docs/gate0.md`.

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

### App Check
The live site uses Fraud Defense (reCAPTCHA Enterprise) when `VITE_APPCHECK_SITE_KEY` is set; it was registered on the Spark plan with no billing (2026-11-16). Firebase no longer accepts new classic reCAPTCHA v3 keys. Without it, each browser needs a registered debug token, or cloud checks fail with `cloud_not_allowed`.

**Debug token (local):**
1. Run `npm run dev` and open the app in Chrome.
2. Open DevTools → Console and copy the line `App Check debug token: …`.
3. In the Firebase console, open App Check → Apps → ⋮ → Manage debug tokens, then add the token.
4. Never commit the token. To reuse a token in a browser, run `localStorage.setItem('carrysafe.appCheckDebugToken', '<token>')`.

## Known limits
- Information, not legal or medical advice. Always confirm with the embassy.
- Covers 6 countries; others show "not covered yet".
- On the demo laptop (Chrome performance class "Low") Nano reads clean labels exactly but busy real packs poorly, and one read took 15 to 80 s. The Framing Coach often says "Readable" when the label is cut off. The confirm step is the safeguard: nothing is checked until you save.
- On-device scanning needs desktop Chrome; phones use typing or voice instead. Everything else works in phone Chrome.
- Install: Chrome shows "Install app" in the top bar. On iPhone, use Share → Add to Home Screen.
- The QR code carries your name with the card. Only scan it with your own phone.
- Border Card language: Japanese (more are planned).
- Greece uses the UK FCDO Greece page (no fetchable Greek government page found). The US uses the FDA page (CBP blocks automated fetches).
- Japan's pages name pseudoephedrine but not paracetamol, so paracetamol in Japan shows ⚠ "not mentioned".
- `/api/source` reads HTML only. PDF sources aren't supported yet.

## Roadmap
More countries · Search grounding · more card languages + natural voices · Android/iOS apps. See [ROADMAP.md](ROADMAP.md).

## License
Apache-2.0
