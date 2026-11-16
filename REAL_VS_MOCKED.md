# Real vs. mocked: Carry Safe

Every AI result shows where it ran: **"Ran on: this device"** or **"Ran on: cloud"**. These badges come from the SDK, not hard-coded labels. Every verdict shows the official quote, its link and its date.

> Status (2026-11-16): P0 live at https://carrysafe-rho.vercel.app. Every row below has been run for real.

| Part | Real or mocked | Proof |
|---|---|---|
| On-device label reading + Framing Coach (Gemini Nano) | Real; run on the demo laptop 2026-11-16 (sample labels read exactly; real packs weaker; coach often says "Readable" wrongly) | `docs/gate0.md` steps 1–2; demo video 0:38–0:51 (the wait is sped up and labelled) |
| Official page fetch (`/api/source`, 6 countries) | Real | `api/source.test.js`; fetch log in `docs/gate0.md` |
| Cloud verdict + word-for-word quote check | Real; live seed run 2026-11-16 (`docs/gate0.md`) | `src/core/verifyQuote.test.js`, `src/check/checkStop.test.js` |
| Request guard + lab | Real | `src/privacy/buildCloudRequest.test.js`, `src/lab/attempts.test.js`; lab 5/5 in the emulator run |
| Group trip status (Firestore) | Real | `tests/rules/firestore.rules.test.js` (emulator) |
| Saved backup verdicts | Real quotes saved earlier, used only if a fetch fails | "Saved copy from [date]" label |
| Seeded "Amaka-Tokyo" trip | Sample data, real checks | `DEMO TRIP` label |
| Sample medicine photos in Judge Mode | Sample images | "Sample photo" caption |
| Border card to phone (QR) | Real: the card is compressed into the link fragment, never uploaded | `src/card/cardTransfer.test.js` |
| Install + offline card (PWA) | Real service worker; offline open checked in an emulated phone (Playwright) and on Adesope's real phone (install, QR scan, airplane mode) 2026-11-16 | `src/pwa/precache.test.js`; `docs/phase-reports/phone-batch.md` |
| Travel and family photos on the pages | Stock photos from Pexels (free licence), illustrations only, not real users | Footer: "Photos from Pexels, used as illustrations"; list in `public/photos/CREDITS.md` |

**Not used:** Google Search grounding (paid-only; billing unavailable). See ROADMAP.

**Fallbacks:** never silent. If a page can't be fetched, the saved verdict is shown with its date, or ⚠.

This file, the UI labels, PRD §17 and the code agree.
