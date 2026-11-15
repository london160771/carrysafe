# Real vs. mocked: Carry Safe

Every AI result shows where it ran: **"Ran on: this device"** or **"Ran on: cloud"**. These badges come from the SDK, not hard-coded labels. Every verdict shows the official quote, its link and its date.

> Status (2026-11-15): Phase 0 built. `/api/source` real fetch works for all 8 listed pages from the dev container (`docs/gate0.md`). Other rows are planned. Update this file as each phase ships.

| Part | Real or mocked | Proof |
|---|---|---|
| On-device label reading + Framing Coach (Gemini Nano) | Real | [badge screenshot / video timestamp] |
| Official page fetch (`/api/source`, 6 countries) | Real | `api/source.test.js`; fetch log in `docs/gate0.md` |
| Cloud verdict + word-for-word quote check | Real | [test names + "Quote found on official page ✓"] |
| Request guard + lab | Real | [test names + lab run] |
| Group trip status (Firestore) | Real | [rules tests] |
| Saved backup verdicts | Real quotes saved earlier, used only if a fetch fails | "Saved copy from [date]" label |
| Seeded "Amaka-Tokyo" trip | Sample data, real checks | `DEMO TRIP` label |
| Sample medicine photos in Judge Mode | Sample images | "Sample photo" caption |

**Not used:** Google Search grounding (paid-only; billing unavailable). See ROADMAP.

**Fallbacks:** never silent. If a page can't be fetched, the saved verdict is shown with its date, or ⚠.

This file, the UI labels, PRD §17 and the code agree.
