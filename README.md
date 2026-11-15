# Carry Safe

**Your medicine. Your secret. Your trip, safe.**

Carry Safe checks whether your medicine is legal at every stop on your trip, including layovers. Your laptop reads the label privately, and only the ingredient name goes out to be checked against official government pages, with the exact quote verified.

[Live demo](#) · [Judge Mode](#) · [Demo video](#) · Tests: [after they pass]

> Built for #BuildHybridAI 2026 (Google Firebase) with Firebase AI Logic hybrid inference. 🚧 In progress.

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
[Filled in after tests pass.]

## Run it locally
```bash
npm install
vercel dev
```
On-device features need desktop Chrome 139+ with the Gemini Nano Prompt API enabled. App Check: [setup steps added in Phase 0].

## Known limits
- Information, not legal or medical advice. Always confirm with the embassy.
- Covers 6 countries; others show "not covered yet".
- On-device scanning needs desktop Chrome; phones use typing or voice instead.
- Border Card language: Japanese (more are planned).

## Roadmap
More countries · Search grounding · more card languages + natural voices · Android/iOS apps. See [ROADMAP.md](ROADMAP.md).

## License
Apache-2.0
