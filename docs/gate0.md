# Gate 0 evidence (PRD §16)

Raw results only. PASS/FAIL is recorded when a step has actually been run. Pending steps say who must run them.

| Step | What | Status | Where it runs |
|---|---|---|---|
| 0 | Nano downloaded and answers text | PASS (2026-11-14) | Adesope's laptop |
| 1 | Image → JSON on 3 real photos + 2 generated labels, with timings | PENDING | Adesope's laptop, `/gate0.html` button 1 |
| 2 | Framing Coach hint on `broncholyte-front.jpg` (cut off on the right) | PENDING | Adesope's laptop, `/gate0.html` button 1 |
| 3 | `/api/source` fetches official pages for all 6 countries | PASS from dev container (2026-11-15); Vercel run PENDING | Container done; Vercel needs the deploy |
| 4 | Verdict + quote + `verifyQuote` for 3 seed checks | PENDING (needs Phase 2 code + Firebase config) | Browser |
| 5 | Free-tier cloud model JSON under App Check (debug token) | PENDING (needs Firebase web config + debug token) | Browser, `/gate0.html` button 3 |
| 6 | `speechSynthesis` ja-JP voice + `SpeechRecognition` in Chrome | PENDING | Adesope's laptop, `/gate0.html` button 4 |

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
