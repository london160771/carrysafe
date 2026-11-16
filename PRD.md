# PRD: Carry Safe

**Your medicine. Your secret. Your trip, safe.**

| | |
|---|---|
| **Status** | Final: build against this |
| **Version** | 1.1 (no-billing plan: official-page checks replace Search grounding) |
| **Date** | 2026-11-15 |
| **Owner** | Adesope (Ayyoweb3) |
| **Hackathon / track** (H) | #BuildHybridAI 2026 (Google Firebase, Devpost): Best Web/Chrome App |
| **Official deadline** (H) | Mon Nov 30, 2026, 2:00 PM PT = **11:00 PM WAT** |
| **Internal cutoff** (H) | **Mon Nov 30, 2026, 12:00 PM WAT** |
| **Firebase project** | `carry-safe-30940` (Spark, no-cost plan) |
| **Links** | Repo: https://github.com/london160771/carrysafe · Live (Vercel): [ ] · Video: [ ] · Judge Mode: [ ]/judge |

> **This file is the only source of truth for requirements.** Agents read the relevant section before building and cite it (e.g. "PRD §11"). When reality disagrees, fix this file and log it in §16.
> `docs/CONCEPT-BRIEF.md` is history. Where it mentions Google Search grounding or Firebase Hosting, this PRD wins.

---

## 1. One-line definition

Carry Safe is a web app that lets travellers check whether their medicine is legal **at every stop on their trip, including layovers**. The laptop reads the label privately, and only the ingredient name goes out to be checked against **official government pages, with the exact quote shown**. Today people do this by reading embassy pages in other languages, or by pasting their medical details into websites they don't trust.

**Memorable flow (use it everywhere: code, UI, README, video):**

```
SCAN → HIDE → CHECK EVERY STOP → SHARE STATUS → SHOW THE OFFICER
```

---

## 2. The story (the video's spine)

The character is illustrative; the rules are real and must be confirmed against the official pages at Gate 0 (§16).

- **Act 1: How it's done today.** Amaka flies Lagos → Dubai → Tokyo with her mum, who has poor eyesight. Amaka carries prescribed ADHD tablets (methylphenidate). Mum carries a cold medicine with pseudoephedrine. The UAE wants documents for ADHD medicine. Japan prohibits pseudoephedrine. Nobody told them.
- **Act 2: The new way.** Mum scans her box. The Framing Coach speaks: "Move left, the label is cut off." The badge shows **Read on this device · free · private**.
- **Act 3: The real check.** Every stop is checked, including Dubai. The badge shows **Checked in cloud**. The result is Japan ⛔ with **"Quote found on official page ✓"** and the government link.
- **Act 4: The proof.** The "What left your laptop" panel shows `pseudoephedrine · Japan`: no name, no photo. A privacy-lab attempt to send mum's name is blocked live (§18).
- **Act 5: Control stays with the traveller.** The group sees "Mum ⛔ Japan", not mum's medicine. At the border, mum shows a Japanese Border Card that reads itself aloud.
- **Close.** "Travellers already have rule databases and embassy pages. What they lacked was a private way to check their own medicine against every stop, and to prove it at the border. Carry Safe is that."

---

## 3. Problem

**Small scenario:** two travellers, three medicines and three countries make 9 ingredient × country checks. Most people only check the destination, not the layover, and only for one medicine.

**Why it happens:**
- Medicine rules are national, change over time, and are written in local languages.
- Normal medicine can be controlled elsewhere. Pseudoephedrine is prohibited in Japan. Codeine needs a Narcotic Certificate in Japan and a prescription in Greece. ADHD medicines need documents in the UAE.
- Checking safely means sharing health details with unknown sites.

**Who feels it and how often:** travellers on regular medicine (ADHD, pain, sleep, anxiety, allergy/cold, HIV and others) before every international trip. Families travelling together. Older travellers and people with poor vision, who also struggle with small labels.

---

## 4. Insight and core guarantee

**Insight:** You can't make every country's rules the same. But you can check them all, privately, before you pack.

**Core guarantee:** **A cloud request can only contain allow-listed fields. No name, condition, doctor, photo or trip owner ever leaves the device.**

**Truth guarantee:** **A ✅ or ⛔ is only shown when the model's quote is found word-for-word in the fetched official page. Otherwise it's ⚠ "not confirmed".**

---

## 5. The gap

**Ecosystem today:**
- Rule databases (e.g. Goods Across Borders) let you search an ingredient country by country.
- Paid reports (e.g. Global Rescue) cover destinations for members.
- Government and embassy pages are the official truth.
- Medication reminder apps handle doses.

**What's missing:** a private way to check *your own* medicine against *every stop on your route*, for a whole group, with an official quote and a card for the border.

| Existing project / tool | What it owns | How we differ / compose with it |
|---|---|---|
| Goods Across Borders | Structured rule database | You search it manually. We read your box, cover the whole route, handle a group, and quote the official page |
| Global Rescue destination reports | Paid destination guidance | We're free, route-based, with an official quote per verdict |
| Embassy / government pages | Official truth | We fetch and quote them; we never replace them |
| Medication reminder apps | Dose timing | Out of scope |

**We must not be:** a health chatbot, a medication reminder, a pill identifier, a legal adviser, or another AI scanner.

---

## 6. Users and jobs to be done

| User | Needs | Success looks like |
|---|---|---|
| Traveller on regular medicine | Know if each medicine is OK at each stop, privately | Clear ✅/⚠/⛔ per stop, with a quote and a link, in under 2 minutes |
| Trip organiser (family/group) | Know who is at risk without seeing anyone's medicine | One status grid for the group |
| Older traveller / poor vision | Scan small labels, understand results, cope at the border | Spoken guidance, big text, a card that speaks Japanese |
| **Judge** (H) | No signup, seeded trip, short steps, stable deploy, honest limits, visible sponsor use | Reaches the Japan ⛔ verdict with its official quote in ≤ 60 s |

**Primary user story:** As a traveller on regular medicine, I want to know whether each of my medicines is allowed at every stop on my route, without sharing my medical details, so I can pack safely and carry the right papers.

---

## 7. Goals and non-goals

**Goals**
- **G1 (Real):** On-device label reading, the official-page fetch and the cloud model check all run for real.
- **G2 (Private):** The allow-list guard (§11 INV-1) is enforced by code and tests, and is visible in the UI.
- **G3 (True):** Every ✅/⛔ carries a quote verified word-for-word against the official page (INV-3).
- **G4 (Whole route):** Destination **and layovers** are checked across the 6 covered countries.
- **G5 (Accessible):** Framing Coach, Show the Officer, voice input and the basics (§12).
- **G6 (Group):** Private group trips with shared status only.
- **G7 (No cost):** Runs entirely on Firebase Spark + Vercel free plan. No billing.

**Non-goals (this build will not):**
- Give legal or medical advice, or say "safe".
- Cover countries outside the 6 on the list (they show ⚠ "not covered yet").
- Identify pills from photos or remind people about doses.
- Check rules for bringing medicine back home.
- Use Google Search grounding, Gemini TTS, or native apps (all roadmap).

---

## 8. Product principles

1. **Fail closed.** Unknown, unquoted or unfetched means ⚠ "not confirmed", never ✅.
2. **Real over mocked.** Anything mocked or saved is labelled (§17).
3. **Quote or it didn't happen.** Every verdict shows the exact official sentence and its link.
4. **Privacy you can see.** The "What left your laptop" panel shows every outgoing request.
5. **AI reads; code decides.** Quote checks, quantity maths, status grids and the allow-list are plain code.
6. **Accessible by default.** Icon + word, keyboard, screen reader, read-aloud.

---

## 9. Core flow and user journeys

**End-to-end flow:**
1. Create a trip: route (home → layovers → destination) and dates.
2. Add medicine: scan a box (Framing Coach → on-device read), or type it, or say it.
3. Confirm the ingredient(s).
4. Check every stop. For each ingredient × covered country:
   - the Vercel function fetches the listed official page(s);
   - code picks the paragraphs that mention the ingredient or its synonyms;
   - the free cloud model returns a verdict plus a quote;
   - code verifies the quote is on the page.
5. See verdicts per stop with quote + link + "checked on" date; see the "What left your laptop" panel.
6. Invite others (group mode); everyone sees only the status grid.
7. Open the Border Card → Show the Officer → read aloud in Japanese.

**Journey A (happy path):**
1. Mum taps **Scan**.
2. The Framing Coach says "Move left" and then "Readable".
3. The device extracts `pseudoephedrine 60 mg × 24`. Mum confirms.
4. The route check runs for UAE + Japan: Japan ⛔ "Quote found on official page ✓" plus the link.
5. The panel shows exactly what was sent.
6. She opens the Border Card in Japanese and taps **Read aloud**.

**Journey B (failure / privacy path):**
- **Nano unavailable:** scanning is disabled with a reason; typing and voice still work; the photo is never sent.
- **Official page can't be fetched:** show the saved verdict with its date and a "saved copy" label, or ⚠ if there's none.
- **Model quote not on the page:** ⚠ `quote_not_found`.
- **Country not on the list:** ⚠ "not covered yet", with an embassy link.
- **A code path tries to send a name:** blocked with `field_not_allowed`.

**Journey C (recovery):**
- Delete a medicine; status is recomputed.
- Before departure, the rule re-check (P1) re-fetches pages, compares content hashes and alerts on change.
- Leave the group; status is removed.

---

## 10. Functional requirements

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| FR-SCAN-001 | P0 | Framing Coach: on-device readability check with spoken guidance | A cut-off label gives a spoken hint naming the side; a full label gives "readable" |
| FR-SCAN-002 | P0 | On-device extraction: image → `{brand, ingredients[], strength, quantity}` | `ONLY_ON_DEVICE`; no personal fields in the output |
| FR-SCAN-003 | P0 | User confirms or edits ingredients before any cloud call | No cloud call before confirmation |
| FR-SCAN-004 | P0 | Fallback when Nano is unavailable | Scan disabled with a reason; typing and voice work; no image leaves the device |
| FR-SCAN-005 | P0 | Typed/voice brand → suggested ingredient | Free cloud model suggests; shown as "suggestion: check your box"; the user must confirm |
| FR-ROUTE-001 | P0 | Route with home, 0..n layovers, destination | Layovers are included in checks |
| FR-SRC-001 | P0 | Official source registry `sources.json` for JP, AE, SG, GR, GB, US | Each entry: country, authority name, URL(s), language, `lastVerified` date |
| FR-SRC-002 | P0 | Vercel function `GET /api/source?country=XX` | Fetches only registry URLs; returns plain text + content hash; HTML and PDF supported |
| FR-SRC-003 | P0 | Paragraph picker (code) | Sends only paragraphs that mention the ingredient or its synonyms, capped in size |
| FR-CHECK-001 | P0 | Cloud verdict: `{verdict, quote, conditions}` from free cloud Gemini | Runs through Firebase AI Logic `ONLY_IN_CLOUD` |
| FR-CHECK-002 | P0 | Quote verification (code) | ✅/⛔ only if the normalised quote is a substring of the normalised page text; else ⚠ `quote_not_found` |
| FR-CHECK-003 | P0 | Verdict cache in Firestore keyed `ingredient_country` | Stores verdict, quote, URL, `fetchedAt`, hash; shows "checked on [date]" |
| FR-CHECK-004 | P0 | Saved backup table `fallback-verdicts.json` | Used only when the fetch fails; labelled "saved copy from [date]" |
| FR-CHECK-005 | P0 | Uncovered country | ⚠ "not covered yet" + embassy link |
| FR-PRIV-001 | P0 | Request guard `buildCloudRequest()` | Rejects non-allow-listed fields (`field_not_allowed`) and images (`image_not_allowed`) |
| FR-PRIV-002 | P0 | "What left your laptop" panel | Shows the exact payload of every outgoing request (AI + fetch) this session |
| FR-PRIV-003 | P0 | "Ran on" badges from the SDK's real inference source | Never hard-coded |
| FR-GRP-001 | P0 | Group trip: invite link, members, status grid | Members see status only; med lists stay on each device |
| FR-CARD-001 | P0 | Border Card: generic names + quantities, English + Japanese | Translation request holds no name; the name is added on the device |
| FR-CARD-002 | P0 | Show the Officer mode | Full-screen high contrast; "Read aloud in Japanese" uses a ja-JP voice |
| FR-VOICE-001 | P0 | Add meds by voice | Speech becomes a medicine entry; the UI says speech may use Google servers |
| FR-A11Y-001 | P0 | Accessibility basics (§12) | Keyboard-only and screen-reader checks pass; status uses icon + word |
| FR-QTY-001 | P1 | Quantity check vs a quoted limit | Code computes the supply; shows the limit's quote |
| FR-RECHK-001 | P1 | Rule-change re-check before departure | Re-fetches; hash changed → re-check → alert members whose verdict changed |
| FR-OFF-001 | P1 | Offline Border Card | Opens with no network after the first load |
| FR-JDG-001 (H) | P0 | Judge Mode, no signup | `/judge` opens the seeded "Amaka-Tokyo" trip in one click |

---

## 11. Domain rules and invariants

- **INV-1 (allow-list):** Every cloud AI request is built only by `buildCloudRequest()` and has one of these shapes:
  - `{task:"verdict", ingredient, country, paragraphs[]}`
  - `{task:"brand", brand}`
  - `{task:"translate", genericNames[], quantities[], language}`

  Anything else throws.
- **INV-2 (no images out):** Image data only goes to `ONLY_ON_DEVICE` calls. Image data in a cloud request throws `image_not_allowed`.
- **INV-3 (verified quotes):** ✅/⛔ (and "needs documents") require a quote of at least 20 characters found in the fetched page text after normalisation (whitespace, case, Unicode NFKC, curly quotes and dashes folded to ASCII). Otherwise ⚠ `quote_not_found`. Cached verdicts are re-verified against the current page before they are shown.
- **INV-4 (status only):** Firestore never stores medicine names tied to a person, photos or conditions. The rule cache has no user field.
- **INV-5 (code does maths):** Quantities and day counts are computed in code.
- **INV-6 (confirm first):** No cloud call on device-extracted ingredients until the user confirms.
- **INV-7 (fetch allow-list):** `/api/source` only fetches URLs listed in `sources.json`. Any other URL returns `source_not_allowed`. It only takes a country code; it never takes a URL from the client.

**Verdict states:** `unchecked → fetching → checking → {allowed | needs_documents | prohibited | not_confirmed | not_covered}`. `allowed`/`prohibited` need a verified quote (INV-3). Illegal transitions throw. Transitions are shown in the panel.

**Error codes** (each with `retryable` and `nextAction`):

| Code | When | Retryable | Next action |
|---|---|---|---|
| `field_not_allowed` | A cloud request has a non-allow-listed field | no | Fix the caller; nothing was sent |
| `image_not_allowed` | Image data headed to the cloud | no | Use on-device extraction or type the name |
| `nano_unavailable` | On-device model missing or unsupported | no | Type or speak the medicine |
| `label_unreadable` | Framing Coach can't read the label | yes | Follow the hint and rescan |
| `source_not_allowed` | Fetch for an unlisted URL/country | no | Country shows "not covered yet" |
| `source_unavailable` | Official page fetch failed | yes | Saved copy shown with its date, or ⚠ |
| `quote_not_found` | Model quote not on the page | yes | Shown as ⚠ with the official link |
| `country_not_covered` | Country not in the registry | no | Embassy link |
| `cloud_unavailable` | AI Logic / network / App Check / free-tier limit | yes | Retry; cached verdict shown if present |
| `not_trip_member` | Reading a trip you're not in | no | Ask for an invite |

---

## 12. Non-functional requirements

- **Privacy:** INV-1, INV-2, INV-4, INV-7. Firebase web config is public by design; no other secrets in the client.
- **Security:**
  - App Check is required by AI Logic: reCAPTCHA Enterprise (Fraud Defense) if a key can be created without billing; otherwise a debug token, which the hackathon accepts.
  - Firestore rules: members-only reads; members write only their own status.
  - `/api/source` is fetch-only, uses the allow-list, has a timeout and a size cap, and needs no secrets.
- **Cost:** Firebase Spark + Gemini Developer API free tier + Vercel Hobby. No billing.
- **Free-tier note:** Google may use free-tier requests to improve its products. Only ingredient, country, public page paragraphs, brand names and generic names are ever sent.
- **Reliability:** Verdict cache and saved backup table; clear unavailable states; no silent fallbacks.
- **Performance (targets until measured):** Framing Coach ≤ 5 s; extraction ≤ 20 s on the demo laptop (performance class "Low"); route check ≤ 15 s for 3 meds × 2 countries with a warm cache.
- **Accessibility:**
  - Semantic HTML, focus order and visible focus.
  - `aria-live` on results.
  - Big-text and high-contrast toggles.
  - Adjustable read-aloud speed.
  - Icon + word for status.
  - Full keyboard use.
  - Works at 390px.
- **Browser:** On-device features need desktop Chrome 139+ with the Prompt API. Everything else works on modern browsers.
- **Setup:** clean clone to running in ≤ 5 minutes (excluding the Nano download).

---

## 13. Architecture

```
Vercel (Hobby)
 ├─ React (Vite) static app
 │   ├─ On-device brain: Firebase AI Logic hybrid SDK (ONLY_ON_DEVICE) → Gemini Nano in Chrome
 │   │    • framingCoach(image) • extractLabel(image)
 │   ├─ Request guard: buildCloudRequest()  (INV-1/2)
 │   ├─ Cloud brain: Firebase AI Logic (ONLY_IN_CLOUD / PREFER_IN_CLOUD) → free-tier Gemini Flash
 │   │    • verdict(ingredient,country,paragraphs) • brandSuggest(brand) • translateCard(names,qty,"ja")
 │   ├─ Truth layer (code): paragraphPicker, verifyQuote  (INV-3)
 │   ├─ Local store: IndexedDB (photos, med list, traveller name)
 │   └─ Firebase Auth (anonymous + Google) · Firestore · App Check
 └─ Serverless function /api/source?country=XX  → fetch allow-listed official pages (sources.json) → text + hash
Browser speech: speechSynthesis (read aloud, ja-JP) · SpeechRecognition (voice add)
```

- **Stack:** React (Vite) + Bootstrap + Firebase (AI Logic, Auth, Firestore, App Check) + Vercel (hosting + one serverless function). No other backend.
- **Trust boundaries:**
  - Personal data lives only in IndexedDB.
  - The only exits are `buildCloudRequest()` (to AI Logic), `/api/source?country=XX` (country code only) and status writes (to Firestore).
- **Pure core (unit-tested):** `buildCloudRequest`, `paragraphPicker`, `verifyQuote`, `verdict` state machine, `quantity`, route expansion, `sources.json` schema.

---

## 14. Data model and API contract

**Firestore**

| Collection | Key fields | Rules |
|---|---|---|
| `trips/{tripId}` | `route: [{country, role}]`, `startDate`, `endDate`, `createdAt` | Members read; creator writes |
| `trips/{tripId}/members/{uid}` | `displayLabel` (e.g. "Mum"), `joinedAt` | Members read; self writes |
| `trips/{tripId}/status/{uid}` | `perCountry: {JP: "prohibited", AE: "needs_documents"}`, `updatedAt` | Members read; self writes; **no medicine fields** |
| `rules/{ingredient_country}` | `ingredient`, `country`, `verdict`, `quote`, `sourceUrl`, `authority`, `fetchedAt`, `contentHash` | Signed-in users read/write; no user field |

**Repo data files**
- `src/data/sources.json`: `[{country, name, language, lastVerified, urls: [{authority, url}]}]` for JP, AE, SG, GR, GB, US. Each URL carries its own authority because some countries need two official pages (see §16, 2026-11-15).
- `src/data/synonyms.json`: ingredient → synonyms (salts, common names, Japanese names where needed).
- `src/data/fallback-verdicts.json`: saved verdicts with quote, URL and `savedOn`, checked by hand against the official page.

**Local (IndexedDB):** `meds[]` (brand, ingredients, strength, quantity, optional photo blob), `travellerName`.

**Serverless endpoint (Vercel)**

| Method | Path | Input | Output | Errors |
|---|---|---|---|---|
| GET | `/api/source` | `country` (2-letter code) | `{country, authority, url, text, contentHash, fetchedAt}` per listed URL | `source_not_allowed`, `source_unavailable` |

**AI calls (all through Firebase AI Logic)**

| Function | Mode | Input (allow-list) | Output | Errors |
|---|---|---|---|---|
| `framingCoach(image)` | ONLY_ON_DEVICE | image | `{readable, hint}` | `nano_unavailable`, `label_unreadable` |
| `extractLabel(image)` | ONLY_ON_DEVICE | image | `{brand, ingredients[], strength, quantity}` | `nano_unavailable`, `label_unreadable` |
| `verdict` | ONLY_IN_CLOUD | `{ingredient, country, paragraphs[]}` | `{verdict, quote, conditions}` (JSON schema) | `cloud_unavailable` |
| `brandSuggest` | ONLY_IN_CLOUD | `{brand}` | `{ingredients[]}` (labelled suggestion) | `cloud_unavailable` |
| `translateCard` | PREFER_IN_CLOUD | `{genericNames[], quantities[], language:"ja"}` | `{text}` | `cloud_unavailable` |

No other outbound calls.

---

## 15. Sponsor integration and necessity (H)

**Why this sponsor:** Firebase AI Logic gives both brains behind one SDK.
- On-device Gemini Nano reads private labels for free and offline, and the photo never leaves the laptop.
- Cloud Gemini reads long, often foreign-language official pages and pulls out the exact rule, which is too big for the on-device model's ~9k token window.

Remove the device brain and labels must be uploaded. Remove the cloud brain and official pages can't be read reliably.

| Sponsor tool | Job it does in the core path | File(s) |
|---|---|---|
| AI Logic `ONLY_ON_DEVICE` (image → JSON) | Framing Coach + label extraction | `src/ai/onDevice.js` |
| AI Logic `ONLY_IN_CLOUD` (free-tier Gemini Flash, JSON schema) | Verdict + quote from official paragraphs; brand suggestion | `src/ai/verdict.js`, `src/ai/brandSuggest.js` |
| AI Logic `PREFER_IN_CLOUD` | Border Card translation | `src/ai/translateCard.js` |
| Firebase Auth | Anonymous judge mode + Google sign-in | `src/firebase/auth.js` |
| Firestore | Trips, members, status, rule cache | `src/firebase/db.js`, `firestore.rules` |
| App Check | Required by AI Logic | `src/firebase/appCheck.js` |

- **Evaluated and rejected:**
  - **Google Search grounding:** needs a paid tier (Blaze). Google's fraud check repeatedly blocked billing sign-up on Nov 15, 2026. Replaced by official-page fetch + quote verification. → roadmap.
  - **Firebase Hosting:** not required by the hackathon. Cloud Functions need Blaze, so the app and its function live on Vercel.
  - **Gemini TTS:** needs quota. → roadmap.
- **Upstream contribution:** none planned. File a quality bug report if we hit an SDK bug.

---

## 16. Decisions log and Gate 0

**Gate 0: riskiest premises**
- Nano reads real medicine labels on Adesope's laptop.
- The free cloud model returns quotes that really appear on the official pages for the seed checks.
- The official pages can be fetched from Vercel.

**Option A:** everything passes. Build as planned.

**Option B:** fall back where a part fails.
- Nano weak on labels → stronger confirm step.
- A page can't be fetched → use its saved verdict with a date, or swap to another official URL for that country.

**Acceptance requirements:**
1. Image → JSON on the 3 real photos in `samples/real/` + the generated sample labels; outputs + timings recorded against `samples/README.md` ground truth.
2. `samples/real/broncholyte-front.jpg` (cut off on the right) gets the right hint from the Framing Coach.
3. `/api/source` fetches the official page(s) for JP and AE (plus SG, GR, GB, US); text length + hash recorded.
4. For pseudoephedrine × JP, methylphenidate × AE and paracetamol × JP, the model returns a verdict + a quote, and `verifyQuote` passes.
5. AI Logic free-tier model with JSON output works under App Check (debug token).
6. `speechSynthesis` has a ja-JP voice, and `SpeechRecognition` works in Chrome.

**Result:**
- Step 0 PASSED (2026-11-14): Gemini Nano downloaded on the HP EliteBook x360 1030 G2 (performance class "Low", GPU path) and replied to a text prompt.
- Step 3 PASSED from the dev container (2026-11-15): all 8 listed pages fetched (Vercel run pending).
- Steps 4 + 5 PASSED (2026-11-16): live verdicts with verified quotes for methylphenidate × AE, paracetamol × AE, pseudoephedrine × JP.
- Steps 1, 2, 6: pending (demo laptop) → `docs/gate0.md`.

**Resolved decisions (do not re-litigate):**

| Date | Decision | Reason / evidence |
|---|---|---|
| 2026-11-14 | Idea = Carry Safe | Ideation 1/2/3 runs; others crowded or not global |
| 2026-11-14 | Track = Web/Chrome | Fits the stack; on-device runs in desktop Chrome |
| 2026-11-14 | Border Card language = Japanese (+ English) | Matches the story |
| 2026-11-14 | Accessibility headliners = Framing Coach, Show the Officer, voice add, basics | Adesope's choice |
| 2026-11-15 | Firebase project = `carry-safe-30940`; web app "Carry Safe" registered; AI Logic set up (Gemini Developer API) | Console screenshots |
| 2026-11-15 | **No billing.** Search grounding dropped → official-page fetch + quote verification + saved backup table | Grounding is paid-only; billing sign-up blocked by Google |
| 2026-11-15 | Countries covered = JP, AE, SG, GR, GB, US | Adesope's choice |
| 2026-11-15 | Hosting = **Vercel Hobby** (app + `/api/source`); Firebase Hosting not used | Not required by the hackathon; Functions need Blaze |
| 2026-11-15 | App Check: try reCAPTCHA Enterprise; if blocked, use a debug token | Required by AI Logic; debug tokens accepted by the hackathon |
| 2026-11-15 | Cloud model = newest free-tier Gemini Flash; Flash-Lite as backup (final pick at Gate 0) | Free tier |
| 2026-11-15 | Hackathon quota request: skipped | Not needed without grounding |
| 2026-11-15 | Local name finder → roadmap | Needs open web search |
| 2026-11-15 | Agents run phases continuously; they stop only when Adesope is needed, with a simple guide (CLAUDE.md §10) | Adesope's instruction |
| 2026-11-15 | Repo = github.com/london160771/carrysafe. Agents commit AND push to GitHub at the end of every phase that passes verify | Adesope's instruction |
| 2026-11-15 | Medicine photos: 3 real photos in `samples/real/` (bromhexine syrup EN + FR side, orphenadrine + paracetamol blister). Seed ingredients without photos get code-generated sample labels (no brands, marked SAMPLE) | Adesope's photos; web product photos avoided (copyright) |
| 2026-11-15 | Official sources: JP = MHLW Narcotics Control Dept + UK FCDO Japan; AE = UAE Embassy (Washington) + UK FCDO UAE; SG = HSA; GR = UK FCDO Greece (no fetchable Greek government page with traveller rules); GB = GOV.UK; US = FDA (CBP blocks automated fetches, 403). `sources.json` URLs now carry their own authority | Fetch results in `docs/gate0.md` |
| 2026-11-15 | INV-3 hardened: quotes ≥ 20 chars; curly quotes/dashes folded (models often straighten them); "needs documents" also needs a verified quote; cached verdicts re-verified | Phase 2 build; FCDO pages use curly apostrophes |
| 2026-11-15 | Japan + pseudoephedrine: let the verified quote decide; keep both official pages (MHLW NCD + UK FCDO). The demo may show ⚠ needs documents instead of ⛔ | Adesope's choice on the decision card |
| 2026-11-16 | Cloud model = `gemini-3.5-flash-lite` | `gemini-2.5-flash` returns 404 for new projects; `gemini-3.8-flash` gave no response in 170 s; flash-lite answered in 1.3 s (`docs/gate0.md`) |

---

## 17. Real vs mocked

| Part | Real or mocked | How the UI shows it |
|---|---|---|
| On-device label reading + Framing Coach | Real | "Ran on: this device" badge (from the SDK) |
| Official page fetch | Real | Authority name + link + "fetched [date]" |
| Cloud verdict + quote verification | Real | "Ran on: cloud" badge + "Quote found on official page ✓" |
| Saved backup verdicts | Real data, saved earlier | "Saved copy from [date]" label |
| Seeded "Amaka-Tokyo" trip | Sample data, real checks | `DEMO TRIP` label |
| Sample medicine photos in Judge Mode | Sample images | "Sample photo" caption |

No silent fallbacks. `REAL_VS_MOCKED.md` copies this table.

---

## 18. Privacy and truth lab ("Try to break it") (H)

Real requests through the real code, each blocked live:

| # | Attempt | Expected response |
|---|---|---|
| 1 | Send `{ingredient, country, travellerName}` | `field_not_allowed`; panel: "blocked, nothing sent" |
| 2 | Send the label photo to the cloud | `image_not_allowed` |
| 3 | Model "quote" that isn't on the official page | ⚠ `quote_not_found` (no ✅/⛔) |
| 4 | Ask `/api/source` for an unlisted URL or country | `source_not_allowed` |
| 5 | Read another trip's status as a non-member | Firestore denies → `not_trip_member` |

---

## 19. Seeded scenario and success measures

**Seed "Amaka-Tokyo":**
- Route: Lagos (NG, home) → Dubai (AE, layover) → Tokyo (JP, destination).
- Travellers: "Amaka" and "Mum".
- Medicines: methylphenidate (Amaka); pseudoephedrine cold tablets and paracetamol (Mum).
- Expected (updated 2026-11-15 with page evidence, `docs/gate0.md`): JP pseudoephedrine ⛔ or ⚠ needs documents, whichever official quote the model returns (MHLW: permission needed; UK FCDO: illegal to carry), both pages kept; AE methylphenidate ⚠ (documents, via the "controlled medication" rule); paracetamol ⚠ "not mentioned" in JP (no JP page names it), AE depends on the model reading the over-the-counter rule. **[Confirm with live runs at Gate 0 step 4.]**

| Measure | Target |
|---|---|
| Judge reaches JP ⛔ with a verified quote from `/judge` | ≤ 60 s |
| Seed verdicts with a verified quote | 3/3 |
| Fields leaving the device outside the allow-list | 0 (test-enforced) |
| Lab attempts blocked | 5/5 |
| Countries with a working official source | 6/6 (or listed as saved-copy only) |
| Fresh-clone setup | ≤ 5 min (excl. Nano download) |

---

## 20. Test plan

- **Unit:**
  - `buildCloudRequest` allow-list (incl. a property test with random extra fields).
  - `verifyQuote` (exact, whitespace, case, NFKC, a near-miss rejected).
  - `paragraphPicker` (synonyms, size cap).
  - Verdict state machine.
  - Route expansion; quantity maths; `sources.json` schema.
- **Function:** `/api/source` rejects unlisted countries; handles timeout, oversized pages and PDF.
- **Firestore rules (emulator):** non-member read denied; can't write another member's status; no medicine fields accepted in `status`.
- **Manual:** seed trip end to end; keyboard-only; screen reader (NVDA or ChromeVox); 390px; Japanese read-aloud.
- Test counts are reported only after they pass, and must match README, badge and submission.

---

## 21. Product surfaces (6 screens, no sprawl)

1. **Trip:** route builder + status grid.
2. **Add medicine:** Scan (Framing Coach), Type, Speak; confirm ingredients.
3. **Results:** per medicine × stop: ✅/⚠/⛔ + conditions + official quote + link + "Ran on" badge + date.
4. **What left your laptop:** the outgoing payload log + the lab buttons.
5. **Border Card / Show the Officer:** English + Japanese; full-screen; read aloud.
6. **Judge Mode `/judge`** (H): seeded trip, "Run the demo trip", "Try to break it", the 60-second path.

Persistent bar: big text, high contrast, read-aloud speed.

---

## 22. Demo script (H): 2:50 (limit 3:00)

| Time | Act | On screen | Line |
|---|---|---|---|
| 0:00–0:30 | The trip | Route Lagos → Dubai → Tokyo; two bags of medicine | "Normal medicine. Bought legally at home. Nobody told them." |
| 0:30–1:05 | Scan | Framing Coach speaks; "Ran on: this device" | "Her laptop reads the label, privately." |
| 1:05–1:40 | Check every stop | JP ⛔ + "Quote found on official page ✓"; AE ⚠ | "Every stop, even the layover, checked against the government's own words." |
| 1:40–2:05 | Proof | Panel: `pseudoephedrine · Japan`; leak attempt blocked | "Only the ingredient left the laptop." |
| 2:05–2:30 | Group | "Mum ⛔ Japan" grid | "Amaka sees the risk, not mum's medicine." |
| 2:30–2:50 | Officer | Japanese card read aloud | "Your medicine. Your secret. Your trip, safe." |

Record each act the moment it works. The real check is shown uncut.

---

## 23. Judge experience (H)

- **First 10 s:** problem + solution line, the seeded trip, JP ⛔ with its official quote, both "Ran on" badges.
- **First 60 s:** run the demo trip; see the device badge, the cloud badge, the verified quote and the panel payload.
- **First 5 min:** video, rubric, lab, `src/ai/*`, tests, `REAL_VS_MOCKED.md`, limits.

**60-second judge path (README):**
1. Open `/judge` → **Run the demo trip**.
2. **Results** → Japan ⛔ with "Quote found on official page ✓".
3. **What left your laptop** → **Try to break it**.
4. **Border Card** → **Show the Officer** → **Read aloud in Japanese**.

---

## 24. Rubric → evidence (H; 4 criteria, no weights published)

| Criterion | Evidence |
|---|---|
| Technological implementation (incl. hybrid use) | On-device image → JSON; cloud reading of long official pages; request guard + quote verification + tests; real badges |
| Design (complete product) | 6 screens; full flow; accessibility headliners; judge mode |
| Potential impact | A global traveller problem; route-wide; families; older travellers |
| Quality of the idea | Layover-aware + private group status + verified official quotes + a Border Card that speaks; hybrid split by real limits (privacy on device, long pages in cloud) |
| Multi-platform (Grand Prize note) | Not planned. Web only. Roadmap |

---

## 25. Positioning and judge Q&A (H)

**Positioning statement (use word for word):**
> Travellers already have rule databases and embassy pages. Carry Safe is the missing private layer: your laptop reads your medicine, only the ingredient goes out, and every stop on your route, including layovers, is checked against the government's own words, for your whole group.

**Prepared answers:**
- *How is this different from Goods Across Borders?* They're a lookup you search by hand. We read your box privately, check your whole route, handle a group, quote the official page and give you a card for the officer.
- *Why not Google Search grounding?* It needs a paid plan. We read the official government pages directly and verify the quote word-for-word, which is arguably stricter than web search.
- *Why hybrid?* Labels are private and frequent → on-device. Official pages are long and foreign-language → cloud.
- *What leaves the device?* Only ingredient + country + public page paragraphs. The panel shows it; tests enforce it.
- *What if the AI is wrong?* No ✅/⛔ without a verified quote; unclear = ⚠; "confirm with the embassy" everywhere.
- *Why only 6 countries?* Each source is a checked official page. More countries are a list update.

**Innovation note:** we combine on-device extraction, an allow-list request guard, source fetching and quote verification. We didn't invent these. The originality is the private route-wide check loop with verified official quotes and a status-only group view.

---

## 26. Scope control

**P0 (must ship):**
- FR-SCAN-001..005, FR-ROUTE-001, FR-SRC-001..003
- FR-CHECK-001..005, FR-PRIV-001..003, FR-GRP-001
- FR-CARD-001..002, FR-VOICE-001, FR-A11Y-001, FR-JDG-001

**P1 (only after P0 is deployed AND recorded):** FR-QTY-001 → FR-RECHK-001 → FR-OFF-001.

**Never in this build (→ ROADMAP.md):**
- Google Search grounding
- Local name finder
- Return-home rules
- Gemini TTS
- Plain-words mode
- More card languages or countries
- Android/iOS
- Pill identification
- Dose reminders

---

## 27. Build order and phases

Phases run back-to-back (CLAUDE.md §10). Each phase ends with verification and a phase report. The agent stops only when Adesope is needed.

### Phase 0: Foundation + Gate 0 (Nov 15–16)
- **Goal:** prove the risky premises; set up the repo, Firebase and Vercel.
- **Scope:**
  - Vite + React + Bootstrap scaffold; Vitest; ESLint.
  - Firebase init (Auth anonymous, Firestore, App Check debug, AI Logic).
  - Vercel project + `/api/source` stub.
  - `sources.json` researched for 6 countries.
  - `docs/gate0.md` with raw outputs for §16 steps 1–6.
- **Acceptance:** all Gate 0 steps recorded PASS/FAIL; app runs locally and on Vercel; `npm run verify` passes.
- **Needs Adesope:**
  - reCAPTCHA key attempt, or the debug token added in the console.
  - GitHub repo + Vercel login.
  - 5 medicine box photos.
  - Running the in-browser Nano tests on his laptop.

### Phase 1: Private scan + request guard (Nov 17–18)
- **Goal:** the core privacy invariant.
- **Scope:** `onDevice.js`, `buildCloudRequest.js`, local store, Add-medicine screen (scan/type), confirm step, `brandSuggest`.
- **Acceptance:** FR-SCAN-001..005, FR-PRIV-001; INV-1, INV-2 and INV-6 tested.
- **Record:** Act 2.
- **Review:** Checkpoint A.

### Phase 2: Official-source route check (Nov 19–20)
- **Goal:** real verdicts with verified quotes.
- **Scope:** `/api/source` (real fetch, HTML/PDF, allow-list), `paragraphPicker`, `verdict.js`, `verifyQuote`, verdict state machine, rule cache, fallback table, route builder, Results screen, badges.
- **Acceptance:** FR-ROUTE-001, FR-SRC-001..003, FR-CHECK-001..005, FR-PRIV-003; seed verdicts 3/3 with verified quotes.
- **Record:** Act 3.
- **Review:** Checkpoint B.

### Phase 3: Proof + group (Nov 21)
- **Goal:** visible privacy and multi-user.
- **Scope:** "What left your laptop" panel, lab (§18), group trip, Firestore rules + emulator tests.
- **Acceptance:** FR-PRIV-002, FR-GRP-001; lab 5/5.
- **Record:** Acts 4 + group.

### Phase 4: Border Card + accessibility (Nov 22–23)
- **Goal:** the accessibility headliners.
- **Scope:** `translateCard.js`, Border Card, Show the Officer (ja-JP), voice add, the basics (§12).
- **Acceptance:** FR-CARD-001..002, FR-VOICE-001, FR-A11Y-001; manual checks logged.
- **Record:** Act 5 + a full P0 run.
- **Needs Adesope:** record the demo acts on his laptop (on-device parts only run there).

### Phase 5: P1 extras (Nov 24–26)
- **Goal:** quantity check → re-check → offline card, in order. Each ships or is cut cleanly to ROADMAP.
- **Record:** each as it works.

### Phase 6: Judge Mode, README, video, submit (Nov 27–30)
- **Goal:** submission quality.
- **Scope:** `/judge`, README, REAL_VS_MOCKED, final Vercel deploy, public repo + Apache-2.0 license, video ≤ 3:00, Devpost text.
- **Acceptance:** §30 all ticked; submitted before **Nov 30, 12:00 PM WAT**.
- **Review:** Checkpoint C.
- **Needs Adesope:** final video recording/voice-over, the Devpost submit click.

A lower phase never blocks a finished recording of a higher one.

---

## 28. Deadline plan (H)

| Days | Work | End-of-day gate |
|---|---|---|
| Nov 15–16 | Phase 0 | Gate 0 evidence recorded |
| Nov 17–18 | Phase 1 | Label read on device; guard tests pass |
| Nov 19–20 | Phase 2 | One medicine checked on a full route with a verified quote |
| Nov 21 | Phase 3 | Two travellers, private status; lab 5/5 |
| Nov 22–23 | Phase 4 | **All P0 acts recorded** |
| Nov 24–26 | Phase 5 | Each extra recorded or cut |
| Nov 27–28 | Phase 6 (build) | Clean clone passes; deployed |
| Nov 29–30 | Phase 6 (submit) | Submitted by 12:00 PM WAT |

After the internal cutoff: fixes only. After the deadline: demo stays live, no feature commits.

---

## 29. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Nano reads small labels poorly ("Low" class) | Wrong ingredient | Framing Coach; confirm step; Option B |
| Official page blocks fetching or is a hard PDF | No live verdict | Alternate official URL; saved verdict with a date; Gate 0 tests all 6 |
| Official page only in Japanese/Arabic/Greek | Missed matches | `synonyms.json` with local names; cloud model reads the language; quote verified on the original text |
| Free-tier rate limits during judging | Errors | Firestore verdict cache; saved table; seeded trip pre-checked |
| App Check without billing | AI calls rejected | Debug token (accepted by the hackathon); document setup in README |
| A wrong ✅ has legal stakes | User harm | INV-3; disclaimer; "confirm with embassy" everywhere |
| Scope | P0 unfinished | Strict order; extras never block a recording |
| No ja-JP voice on the demo machine | Weaker officer act | Install the Windows Japanese speech pack; text always shown |

---

## 30. Definition of finished

- [ ] A stranger opens `/judge` and reaches JP ⛔ with a verified official quote in ≤ 60 s.
- [ ] On-device scan, official fetch and cloud verdict all work for real, with SDK badges.
- [ ] Lab 5/5 blocked live.
- [ ] Every invariant in §11 has a passing test.
- [ ] Keyboard-only, screen-reader and 390px checks pass.
- [ ] Clean clone → install → verify passes; quickstart works.
- [ ] Video ≤ 3:00 shows every act; the real check is uncut.
- [ ] §17, REAL_VS_MOCKED.md, UI labels, README and submission agree; every number matches.
- [ ] Repo public with Apache-2.0 shown in About; AI Logic imported and called at runtime.
- [ ] PROJECT_STATE.md is current.

---

## 31. Submission fields and deliverables (H)

| Field | Answer / source |
|---|---|
| Overview | §1 |
| Problem | §3 |
| How Firebase AI Logic is used | §13, §14, §15 |
| What's real | §17 |
| Current functionality | only what passed §30 |
| Future | ROADMAP.md + §32 |
| Repo / Live / Video | [links] |
| Screenshots | JP ⛔ with verified quote; "What left your laptop"; group grid; Japanese Border Card |
| Platform | Web (Chrome) |

---

## 32. Future story

- **Roadmap:**
  - Google Search grounding for all countries once billing works.
  - More countries and card languages + natural voices.
  - Android (Gemini Nano) and iOS (Foundation Models) apps.
- **Why others will need this:** travel agencies, airlines, patient groups and clinics could offer a private pre-trip medicine check without ever holding health data.

---

## 33. Open questions

| # | Question | Owner | Decide by |
|---|---|---|---|
| 2 | Can a reCAPTCHA Enterprise key be created without billing? If not → debug token | Adesope | Phase 0 |

When answered, move the answer to §16.
