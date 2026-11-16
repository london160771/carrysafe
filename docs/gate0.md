# Gate 0 evidence (PRD §16)

Raw results only. PASS/FAIL is recorded when a step has actually been run. Pending steps say who must run them.

| Step | What | Status | Where it runs |
|---|---|---|---|
| 0 | Nano downloaded and answers text | PASS (2026-11-14) | Adesope's laptop |
| 1 | Image → JSON on 3 real photos + 2 generated labels, with timings | PASS on device, 16–24 s each; 3 of 5 fully right (2026-11-16, see below) | Adesope's laptop, `/gate0.html` button 1 |
| 2 | Framing Coach hint on `broncholyte-front.jpg` (cut off on the right) | FAIL: ran on device (44.8 s) but said "Readable" (2026-11-16) | Adesope's laptop, `/gate0.html` button 1 |
| 3 | `/api/source` fetches official pages for all 6 countries | PASS from dev container (2026-11-15); Vercel run PENDING | Container done; Vercel needs the deploy |
| 4 | Verdict + quote + `verifyQuote` for 3 seed checks | PASS for the checks the pages support (2026-11-16, see below) | Headless Chromium, dev container |
| 5 | Free-tier cloud model JSON under App Check (debug token) | PASS with `gemini-3.5-flash-lite` (2026-11-16) | Headless Chromium, dev container |
| 6 | `speechSynthesis` ja-JP voice + `SpeechRecognition` in Chrome | PASS (2026-11-16): 22 voices incl. "Google 日本語 (ja-JP)"; SpeechRecognition present | Adesope's laptop, `/gate0.html` button 4 |

## Steps 1 and 2: on-device label reading (2026-11-16, Adesope's laptop, Chrome 157, Windows)

Every call reported `inferenceSource: "on_device"`. Availability: `available`.

| Sample | Truth (`samples/README.md`) | Nano read | ms | Result |
|---|---|---|---|---|
| broncholyte-front | Broncholyte · bromhexine hydrochloride · 4 mg/5 ml · cut off on the right | brand broncholyte; ingredients bromhexine hydrochloride, **mucolytic**; 4mg/5ml | 23731 | Ingredient right; added a drug class as an ingredient |
| broncholyte-back-fr | Chlorhydrate de Bromhexine 4 mg / 5 ml (French) | ingredients **chlorhydrate de bromhexane**; 4mg; 5ml | 16434 | Misspelt and not translated to English |
| orphesic-blister | orphenadrine citrate 35 mg + paracetamol 450 mg | brand orphasic; ingredients paracetamol only; 0.5g; 30 tablets | 17862 | **Missed orphenadrine**; strength wrong |
| pseudoephedrine-sample | pseudoephedrine hydrochloride 60 mg · 24 tablets | exact | 21571 | Right |
| methylphenidate-sample | methylphenidate hydrochloride 10 mg · 30 tablets | exact | 18384 | Right |

Framing Coach on broncholyte-front: `{"readable": true, "hint": "Readable"}` in 44764 ms. Wrong: the label is cut off on the right.

What this means: the confirm step (the user checks and edits the ingredients before anything is sent) is required, not optional. Extraction prompt tightened after this run (list every active ingredient, no drug classes, English names).

**Re-run with the tightened prompt (2026-11-16 16:36 UTC, same laptop, all `on_device`):**

| Sample | Nano read | ms | Change |
|---|---|---|---|
| broncholyte-front | bromhexine hydrochloride; 4mg; "each 1 teaspoon" | 23179 | Drug class gone; strength lost "/5 ml" |
| broncholyte-back-fr | chlorohydrate de bromhexine, **paracetamol**; quantity "4mg" | 15409 | Still French; **invented paracetamol** (the prompt's example word) |
| orphesic-blister | paracetamol only; no strength | 16583 | Still missed orphenadrine |
| pseudoephedrine-sample | exact | 14625 | Same |
| methylphenidate-sample | exact | 14530 | Same |

Framing Coach: "Readable" again (49081 ms). The example ingredient names were removed from the prompt because Nano copied one. Conclusion: on this "Low" class laptop, Nano reads clean labels well and busy real packs poorly; the confirm step stays the safeguard. No more prompt tuning planned.

## Step 3: official page fetch (2026-11-15, dev container, Node 22, real network)

Fetched by `api/_lib/sourceFetcher.js` with the CarrySafe user agent, HTML stripped to text.

| Country | URL | Result | Text chars | sha256 (first 16) |
|---|---|---|---|---|
| JP | https://www.ncd.mhlw.go.jp/en/application2.html | 200 | 12298 | 2455661cc3ed595e |
| JP | https://www.gov.uk/foreign-travel-advice/japan/health | 200 | 5323 | b332c3284fc53ac5 |
| AE | https://www.uae-embassy.org/permitted-prescriptionsdrugs-while-entering-uae | 200 | 6132 | 65416db0ecf3fca6 |
| AE | https://www.gov.uk/foreign-travel-advice/united-arab-emirates/health | 200 | 5431 | 3c1d7b992c8cd05b |
| SG | https://www.hsa.gov.sg/travelling-with-medication-and-medical-devices/personal-medications/ | 200 | 9812 | 5419d326976296d1 |
| GR | https://www.gov.uk/foreign-travel-advice/greece/health | 200 | 7259 | e43400c08f253b10 |
| GB | https://www.gov.uk/travelling-controlled-drugs | 200 | 5525 | 34644ff2cd75d704 |
| US | https://www.fda.gov/industry/import-basics/personal-importation | 200 | 9268 | 2831126b4f429aa2 |

### URLs tried and rejected (2026-11-15)

| URL | Result | Reason |
|---|---|---|
| https://www.mhlw.go.jp/english/policy/health-medical/pharmaceuticals/01.html | 404 | Page moved |
| https://www.hsa.gov.sg/personal-medication | 404 | Page moved; replaced by the URL above |
| https://u.ae/en/information-and-services/health-and-fitness/drugs-and-controlled-medicines/ | 404 | Not fetchable from the container |
| https://mohap.gov.ae/... | connection reset | Blocks automated fetches |
| https://www.cbp.gov/travel/international-visitors/kbyg/medication | 403 | Blocks automated fetches; FDA page used |
| https://www.miami.us.emb-japan.go.jp/itpr_en/medication.html | 403 | Blocks automated fetches |
| https://www.eof.gr/ | 200, no medicine rules on the page | No Greek government page with traveller rules found; UK FCDO Greece page used |

## Findings that touch the PRD (decision needed before Phase 2 records Act 3)

Exact lines from the fetched text (2026-11-15):

**Japan, pseudoephedrine.** The two official pages disagree on the category:
- MHLW Narcotics Control Department: "If your medicine is in “Narcotics” and/or “Stimulants' Raw Materials”, you need to get a permission before you enter/leave Japan." and "・Srimulants Raw Materisls:Lisdexamfetamine(Vyvanse, Elvanse...), Pseudoephedrine..." (typos are on the official page). That reads as **needs_documents** (permission in advance).
- UK FCDO Japan: "It is illegal to carry some common prescription and over-the-counter medicines under Japan’s strictly enforced law on anti-stimulant drugs. This includes:" … "cold and flu medication containing pseudoephedrine". That reads as **prohibited**.
- PRD §2/§19 assumed **prohibited**. **Decision (Adesope, 2026-11-15): let the verified quote decide; keep both pages.** Third-party sources mention a 10% pseudoephedrine threshold for OTC products; not found on a fetchable official page yet.

**Japan, methylphenidate.** MHLW NCD lists it under "Psycotropics (no permission required)". Not in the seed for JP, noted for completeness.

**UAE, methylphenidate.** The UAE Embassy page says "All Travelers carrying controlled medication into the UAE must apply for approval through the Ministry of Health (MoH) website." It does not name methylphenidate; the named list is a separate MOHAP document. A verdict will need the model to judge that methylphenidate is controlled, while the quote verifies the rule sentence only.

**Paracetamol.** Not named on the JP or AE pages. The AE embassy page says "All other medication (prescription for uncontrolled medication and over-the-counter medication) does not need prior approval from MoH." A ✅ for paracetamol in JP has no sentence to quote yet, so INV-3 will show ⚠ unless another official JP page is added.

**Paragraph picker note.** The FCDO pages put the rule sentence and the list items on separate lines ("This includes:" then "cold and flu medication containing pseudoephedrine"). `paragraphPicker` must send neighbouring lines as context.

## Firebase AI Logic SDK facts (firebase 13.3.0, checked in `node_modules/@firebase/ai/dist/ai-public.d.ts`)

- Modes: `InferenceMode.ONLY_ON_DEVICE | PREFER_ON_DEVICE | ONLY_IN_CLOUD | PREFER_IN_CLOUD`.
- Inference source: `result.response.inferenceSource` with values `"on_device"` / `"in_cloud"`.
- On-device image input needs `onDeviceParams.createOptions.expectedInputs: [{type: 'image'}]`.
- Cloud model name in `src/ai/models.js` is `gemini-2.5-flash` until step 5 confirms the newest free-tier Flash model.

## Step 5: cloud model under App Check (2026-11-16, headless Chromium 153, debug token registered by Adesope)

| Model | Result |
|---|---|
| `gemini-2.5-flash` | 404: "This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use models/gemini-3.8-flash" |
| `gemini-3.8-flash` | Request sent, no response within 170 s (twice) |
| `gemini-3.5-flash-lite` | 200 in 1322 ms, JSON `{"ok": true, "model": "gemini"}`, `inferenceSource: "in_cloud"` |

Before the token was registered: 401 "Firebase App Check token is invalid" (enforcement is on).

## Step 4: seed trip "Amaka-Tokyo" live (2026-11-16, `/judge`, 6 checks in 13.9 s, warm Vercel-less local `/api/source`)

| Check | Shown | Quote verified | Quote (as returned by the model) |
|---|---|---|---|
| methylphenidate × AE | ⚠ Needs documents | yes | "All Travelers carrying controlled medication into the UAE must apply for approval through the Ministry of Health (MoH) website." |
| pseudoephedrine × AE | ⚠ Not confirmed (page doesn't mention it; no cloud call) | — | — |
| paracetamol × AE | ✅ Allowed | yes | "All other medication (prescription for uncontrolled medication and over-the-counter medication) does not need prior approval from MoH." |
| methylphenidate × JP | ⚠ Not confirmed (`quote_not_found`) | no | Model wrote "psychotropicsequal" where the page text has a break; fail-closed as designed |
| pseudoephedrine × JP | ⚠ Needs documents | yes | "If your medicine is in “Narcotics” and/or “Stimulants' Raw Materials”, you need to get a permission before you enter/leave Japan." |
| paracetamol × JP | ⚠ Not confirmed (page doesn't mention it; no cloud call) | — | — |

The 3 verified quotes are saved in `src/data/fallback-verdicts.json` (savedOn 2026-11-16) with the page line they came from.
The paracetamol × AE ✅ rests on the model treating paracetamol as over-the-counter; the quote itself does not name paracetamol.
Rule cache writes failed: Firestore rules not deployed yet (default production rules deny).

## Live Firestore (2026-11-16, after Adesope published `firestore.rules`)

- Rule cache: the demo trip ran in 10.3 s the first time and 4.1 s the second time. On the second run, the 3 verified verdicts came from `rules/{ingredient_country}` labelled "Shared rule cache", with each quote re-verified against the freshly fetched page.
- The model varies between runs: on the second run, methylphenidate × JP came back as ⚠ Needs documents with a verified quote, where the first run gave `quote_not_found`. Both results are fail-closed.
- Group trip, using two separate browser contexts on the real project: Amaka created the trip, and Mum ran the demo trip, joined by link and shared her status. Amaka saw "Mum ⚠ Needs documents" for both the UAE and Japan, and no medicine names. Both members then left the group.
- Lab against the real project: **5/5 blocked**. Attempt 5 got a real `permission-denied` from Firestore, which maps to `not_trip_member`.
