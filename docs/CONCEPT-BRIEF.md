# Concept Brief: Carry Safe  🔒 LOCKED

> **Superseded (2026-11-15):** this brief is history. Google Search grounding and Firebase Hosting were replaced by official-page checks and Vercel. PRD.md v1.1 is the source of truth.

> Status: **LOCKED by Adesope, Sat Nov 14, 2026.** FlyerVoice and Veil are dropped.
> Next: PRD.md, CLAUDE.md, PROJECT_STATE.md, ROADMAP.md, REAL_VS_MOCKED.md.
> Hackathon: #BuildHybridAI 2026 (Google Firebase, Devpost). Track: Best Web/Chrome App.
> Deadline: Mon Nov 30, 2026, 2:00 PM PT (11:00 PM Lagos). **Internal cutoff: Mon Nov 30, 12:00 PM Lagos.**

## One-liner
Carry Safe checks whether your medicine is legal **at every stop on your trip**. Your laptop reads the label privately, and only the ingredient name goes online to check official rules.

## Tagline
**Your medicine. Your secret. Your trip, safe.**

## Problem (real rules; the scenario is illustrative)
Amaka flies Lagos → Dubai → Tokyo with her mum, who has poor eyesight.
- Amaka carries prescribed ADHD tablets (methylphenidate). The UAE treats ADHD medicines as controlled and wants documentation.
- Mum carries an everyday cold medicine with pseudoephedrine. Japan prohibits it.
- Codeine needs a Narcotic Certificate in Japan and a prescription in Greece.
- The rules differ at every stop, including layovers. Checking means reading embassy pages in other languages, or pasting your medical details into websites you don't trust.
- Getting it wrong can mean confiscation, a fine or detention.

## Insight
**You can't make every country's rules the same. But you can check them all, privately, before you pack.**

## Solution: one memorable flow
**SCAN → HIDE → CHECK EVERY STOP → SHARE STATUS → SHOW THE OFFICER**

1. **Scan.** Photograph a medicine box. The **Framing Coach** says out loud how to hold it until the label is readable.
2. **Hide.** On-device Gemini Nano reads the label and keeps only: brand, active ingredients, strength, quantity. Your name, doctor, pharmacy and condition are dropped on the device.
3. **Check every stop.** For each **ingredient × country on the route (including layovers)**, cloud Gemini with **Google Search grounding** returns ✅ allowed / ⚠ needs permit or documents / ⛔ prohibited, with official source links.
4. **Share status.** In a trip group, each traveller's meds stay on their own device. The group only sees "Ada ✅ · Mum ⛔ Japan · Tunde ⚠ UAE".
5. **Show the Officer.** A full-screen, high-contrast **Border Card** in English plus the local language, which can read itself aloud in that language.

## Core guarantee
**Your medicine list and your identity never leave your device together.** The only thing sent for checking is an ingredient name plus a country, with no name, no doctor, no condition and no trip owner. Every verdict shows its source, and anything that can't be confirmed says "not confirmed: check with the embassy", never "allowed".

## Features (locked scope)

### P0: core (must ship and be recorded first)
1. **Private scan:** on-device label reading into structured fields; personal details dropped.
2. **Every-stop check:** destination **and layovers**.
3. **Verdicts with official sources:** ✅ / ⚠ / ⛔, plus links.
4. **Group trip mode:** private meds, shared status only.
5. **Border Card:** generic names and quantities, English plus the local language. The traveller's name is filled in **on the device** after the card is generated, so it is never sent.
6. **Accessibility basics done properly:** screen-reader friendly (semantic HTML, focus order, ARIA live regions for results), big text, high contrast, adjustable read-aloud speed, status shown with **icons + words** (never colour alone), full keyboard use.
7. **"What left your laptop" panel:** shows the exact data sent for each check.

### P0 accessibility headliners
- **🎯 Framing Coach:** on-device image check ("Is the ingredient list fully readable? What is cut off?") → spoken guidance. Fast, free, private, works offline.
- **🪪 Show the Officer mode:** full-screen high-contrast Border Card + "Read aloud in Japanese" (browser speech, using the Japanese voice). More languages are roadmap.
- **🎙️ Add meds by voice:** "I take Sudafed and Ritalin" → added to the list. *Honest label: Chrome speech-to-text may use Google's servers; the UI says so.*

### P1: extras (start only after P0 is deployed AND recorded)
- **Quantity check:** "120 tablets for a 10-day trip": limits come from the grounded rule, and **code** does the maths.
- **Rule-change re-check:** opening a trip before departure re-runs the checks and alerts the group if a verdict changed.
- **Local name finder:** "Sudafed = pseudoephedrine, ⛔ in Japan. Allowed alternatives there: …" (grounded, with a source).
- **Offline Border Card:** saved for use with no data at the airport (PWA cache).

### Roadmap (not building now)
- Rules for bringing medicine **back home** (e.g. UAE personal import permit)
- Gemini TTS natural voices (needs quota)
- Plain-words mode
- Android/iOS apps (multi-platform)

## Hybrid split: which brain does what
| Job | Where | Mode | Why there |
|---|---|---|---|
| Framing Coach (is the label readable?) | **On-device** Gemini Nano (image → JSON) | `ONLY_ON_DEVICE` | Instant, free, works offline, photo stays private |
| Read label → brand, ingredients, strength, qty; drop personal details | **On-device** (image → JSON schema) | `ONLY_ON_DEVICE` | This is the private step. If Nano isn't available, the user types or speaks the medicine name; the photo is **never** sent to the cloud |
| Brand → active ingredient (typed/voice entries) | Cloud + Search grounding | `ONLY_IN_CLOUD` | Brand names aren't personal; needs fresh product data |
| Ingredient × country rule verdict + sources | **Cloud + Google Search grounding** | `ONLY_IN_CLOUD` | Grounding only runs in the cloud; rules change |
| Border Card translation (generic names + qty only) | Cloud | `PREFER_IN_CLOUD` | Many languages; no personal data in the request |
| Quantity limit maths | **Plain code** | n/a | AI never does the maths |

**The rule we enforce:** a request to the cloud can only contain `{ingredient, country, purpose}` or `{brand}` or `{genericNames+qty, language}`. Requests are built by one function, `buildCloudRequest()`, which is tested so that no name, condition or photo can get through.

## Data and privacy design
- **On the device (IndexedDB):** medicine photos (optional, never uploaded), the extracted med list, the traveller's name for the Border Card.
- **Firestore:** trips, members, route (countries + layovers), **per-member status only** (country → ✅/⚠/⛔), and cached rule verdicts keyed by `ingredient+country` (with sources and a timestamp). These are shared and non-personal, so they also make repeat checks faster and cheaper.
- **Firestore rules:** only trip members can read a trip; members can only write their own status.
- **Honest limits:** requests go through Firebase AI Logic with App Check, so Google processes the ingredient + country query. We never attach who is asking. Chrome voice input may use Google servers.

## Key differentiators
1. **Checks the whole route, including layovers**, not just the destination.
2. **Proof of privacy:** a "What left your laptop" panel, not just a promise.
3. **Answers with official sources**, never a bare AI opinion.
4. **A group trip where nobody sees anyone else's medicine.**
5. **Built for people who can't see well or can't speak the language:** Framing Coach, a Border Card that speaks for you, voice input.

## Target users
- **Travellers on regular medicine:** ADHD, pain, sleep, anxiety, allergy/cold, HIV and others. Anywhere in the world.
- **Families and groups travelling together:** the trip organiser needs to know who's at risk without seeing anyone's medical details.
- **Older travellers and people with poor vision:** small labels, foreign languages, stressful borders.
- **The judge:** no signup (anonymous auth), a seeded demo trip, one-click "Run the demo trip", visible "Ran on device / Checked in cloud" badges, honest limits.

**Primary user story:** *As a traveller on regular medicine, I want to know whether each of my medicines is allowed at every stop on my route, without sharing my medical details, so I can pack safely and carry the right papers.*

## Why this sponsor
Firebase AI Logic gives both brains behind one SDK:
- **On-device Gemini Nano** reads private labels for free, works offline and keeps the photo on the laptop.
- **Cloud Gemini + Google Search grounding** finds current official rules, which can't be done on the device.

Remove either brain and Carry Safe breaks: without the device brain, private labels must be uploaded; without grounding, the rules are stale guesses with no sources.

Firebase in the core path: **AI Logic, Auth (anonymous + Google), Firestore, App Check, Hosting**.

| Sponsor tool | Exact job | Planned file |
|---|---|---|
| AI Logic `ONLY_ON_DEVICE` (image → JSON) | Framing Coach + label extraction | `src/ai/onDevice.js` |
| AI Logic `ONLY_IN_CLOUD` + Search grounding | Rule verdicts + brand lookup + sources | `src/ai/ruleCheck.js` |
| AI Logic `PREFER_IN_CLOUD` | Border Card translation | `src/ai/translateCard.js` |
| Request guard | Only allowed fields leave the device | `src/ai/buildCloudRequest.js` (+ tests) |
| Firebase Auth | Anonymous judge mode + Google sign-in | `src/firebase/auth.js` |
| Firestore | Trips, members, statuses, cached verdicts | `src/firebase/db.js`, `firestore.rules` |
| App Check | Required by AI Logic (debug token for judges) | `src/firebase/appCheck.js` |
| Hosting | Live judge URL | `firebase.json` |

## Stack
React (Vite) + Bootstrap + Firebase (AI Logic, Auth, Firestore, App Check, Hosting). Browser Web Speech API for read-aloud and voice input. IndexedDB for private local data. No custom backend.

## Territory map and what we must not be
- **Goods Across Borders** owns a structured rules database (e.g. 166 country rules for codeine). It's a lookup site: you search manually, and it doesn't read your meds, check your route or handle a group.
- **Global Rescue** owns paid destination reports for members.
- **Government/CDC/embassy pages** own the official truth. We **link to** them; we don't replace them.
- **Medication reminder apps** own dose schedules and time-zone reminders.
- **Scam checkers and allergy scanners** are crowded spaces; we stay out.

**We must not be:** a general health chatbot, a medication reminder, a pill identifier, a legal adviser, or "another AI scanner".

**Missing layer:** *"Travellers have rule databases and embassy pages. What they lack is a private way to check their own medicine against every stop on their route, and to prove it at the border."*

## Demo story (target 2:50, under the 3:00 limit)
1. **0:00–0:30 · The trip.** Amaka + mum, Lagos → Dubai → Tokyo. Normal medicine in the bags. "Nobody told them."
2. **0:30–1:05 · Scan.** Mum scans her box. The **Framing Coach speaks**: "Move left, the label is cut off." Badge: **Read on this device · free · private**.
3. **1:05–1:40 · Check every stop.** Badge: **Checked in cloud · Google Search**. Japan ⛔ pseudoephedrine (with official source link), UAE ⚠ methylphenidate needs documents, paracetamol ✅.
4. **1:40–2:05 · The proof.** "What left your laptop": `pseudoephedrine · Japan`. No name, no photo.
5. **2:05–2:30 · The group.** Amaka sees "Mum ⛔ Japan", not mum's medicine. Mum doesn't see Amaka's.
6. **2:30–2:50 · Show the Officer.** A full-screen card in Japanese reads itself aloud. Close: **"Your medicine. Your secret. Your trip, safe. Carry Safe."**

*Recording rule: record each act the moment it works.*

## Proof plan
- **REAL vs DEMO banner** + `REAL_VS_MOCKED.md`. On-device reading and grounding are always real. The seeded trip is labelled as a sample.
- **Seed scenario "Amaka-Tokyo":** route Lagos → Dubai → Tokyo; 2 travellers; 3 medicines (pseudoephedrine cold tablets, methylphenidate, paracetamol). Expected verdicts: Japan ⛔ pseudoephedrine, UAE ⚠ methylphenidate, paracetamol ✅. **Verify each against official sources at Gate 0 before recording.**
- **Tests:**
  - `buildCloudRequest()` rejects any field other than the allow-list (name, condition, doctor and image are all blocked).
  - Quantity maths.
  - Firestore rules: members can't read others' med data; only status is shared.
  - A "not confirmed" verdict is never shown as ✅.
- **"Ran on" badges** use the SDK's real inference-source info, not hard-coded labels.
- **Disclaimer shown in the app:** "Information, not legal or medical advice. Always confirm with the embassy." Every verdict has a source link.

## Judge mode plan (`/judge`)
- **First 10 seconds:** one-line problem + solution, the seeded trip already loaded, a ⛔ Japan verdict with its source visible.
- **First 60 seconds:** "Run the demo trip" → scan (sample photo) → device badge → cloud check → "What left your laptop" → Border Card.
- **First 5 minutes:** video, repo (`src/ai/*` shows AI Logic imported and called), tests, `REAL_VS_MOCKED.md`, limits.
- No signup (anonymous auth). App Check debug token supported.

## Rubric → evidence map (4 equal criteria)
| Criterion | Evidence |
|---|---|
| Technological implementation (incl. hybrid) | On-device image → JSON (Framing Coach + extraction); cloud-only Search grounding; request guard + tests; real inference-source badges |
| Design (complete product) | Full flow scan → check → group → Border Card; accessibility headliners; judge mode; P1 extras if done |
| Potential impact | A global traveller problem with documented detentions/bans; works for any route; families and older travellers |
| Quality of the idea | Layover-aware checks + private group status + a border card that speaks; hybrid split forced by real limits (privacy on device, grounding in cloud) |
| Multi-platform (Grand Prize bonus) | Not planned. Web only. Roadmap. |

## Success criteria
| Target | Measure |
|---|---|
| Framing Coach response on the demo laptop | ≤ 5 s (measure at Gate 0) |
| Label → fields on device | ≤ 20 s; correct ingredient on all 3 seed boxes |
| Seed verdicts | 3/3 match official sources, each with ≥ 1 link |
| Fields leaving the device outside the allow-list | 0 (test-enforced) |
| Judge reaches the ⛔ Japan verdict from `/judge` | ≤ 60 s |

## Gate 0: feasibility (Day 1–2, before building screens)
**Riskiest premise:** Nano on Adesope's laptop reads real medicine labels well, and grounding returns official sources for ingredient × country questions.

1. **Nano:** finish the model download; test image → JSON on 5 real medicine boxes (photos). Record outputs + timings.
2. **Framing Coach:** a cut-off label photo → Nano correctly says what's missing.
3. **Grounding:** 3 calls (pseudoephedrine × Japan, methylphenidate × UAE, paracetamol × Japan) through the Firebase AI Logic web SDK. Confirm citations come back and point to official/government pages.
4. **Grounding + structure:** check whether grounding can be combined with JSON output. If not, use fixed-format text and parse it.
5. **Speech:** check that `speechSynthesis` has a Japanese voice on the demo machine, and that `SpeechRecognition` works in Chrome.

- **Option A:** everything above works. Build as planned.
- **Option B:** Nano too slow or weak on labels → keep the Framing Coach on device, add a manual "confirm ingredient" step, and keep cloud checks unchanged.

Record raw evidence (versions, outputs) in `docs/gate0.md`.

## Day plan (to the internal cutoff)
| Days | Goal | End-of-day gate |
|---|---|---|
| Nov 15–16 | Gate 0 + repo + docs + Firebase setup (Auth, Firestore, App Check) | Nano + grounding proven with raw evidence |
| Nov 17–19 | Scan (Framing Coach + extraction) → route check → verdict UI | One medicine checked on a full route, end to end |
| Nov 20–21 | "What left your laptop" panel, request guard + tests, group trip mode | Two travellers, private status, tests pass |
| Nov 22–23 | Border Card + Show the Officer + voice input + accessibility basics | **Record P0 acts 1–6** |
| Nov 24–26 | P1: quantity check → rule re-check → local name finder → offline card | Record each extra as it works |
| Nov 27–28 | Judge mode, README, REAL_VS_MOCKED, polish, deploy | Clean-clone test passes |
| Nov 29–30 | Final video (≤ 3:00), Devpost text, submit by 12:00 Lagos | Submitted |

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Nano reads small labels poorly on a low-performance laptop | Wrong ingredient | Framing Coach first; user confirms the ingredient before checking; Option B |
| Grounding gives unofficial or conflicting sources | Wrong verdict | Prompt for official/government sources; show sources; ⚠ "not confirmed" when unclear |
| Legal stakes of a wrong ✅ | User harm | Never ✅ without a source; disclaimer; "confirm with embassy" on every card |
| Scope (P0 + 4 extras + 3 accessibility features) | P0 not finished | Strict order: P0 → record → P1. Extras never block a recording |
| Speech voices missing for some languages | Weaker officer mode | Show text always; voice is a bonus; pick a demo language with a known voice |
| 1,749+ entrants | Hard to stand out | Strong story + live layover catch + speaking Border Card |

## Prepared judge Q&A
- **Why not just a database like Goods Across Borders?** Databases need you to know the ingredient and search country by country. Carry Safe reads *your* box privately, covers your whole route including layovers, handles a group, and gives you a card for the officer.
- **Why hybrid?** Reading your medicine box is private and happens often, so it runs on the device for free and offline. Current rules need Search grounding, which only runs in the cloud. Each brain does the job only it can do.
- **What exactly leaves the device?** Only `ingredient + country` (or a brand name, or generic names for translation). The "What left your laptop" panel shows it, and `buildCloudRequest()` tests enforce it.
- **What if the AI is wrong?** Every verdict links its official source, unclear answers are ⚠ "not confirmed", and the app tells you to confirm with the embassy.
- **What didn't you finish?** Listed openly in README limits and ROADMAP.md.

## Decisions (resolved Nov 14)
1. ✅ Gemini Nano downloaded on Adesope's laptop (HP EliteBook x360 1030 G2, performance class "Low", GPU path) and replied to a test prompt. Gate 0 step 1 passed. Image → JSON on real labels is still to test.
2. ✅ Hosting: **Firebase Hosting**.
3. ✅ Border Card demo language: **Japanese** (+ English). Other languages are roadmap.
