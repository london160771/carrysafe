# Phase 1 report: Private scan + request guard (PRD §27)

**Date:** 2026-11-15 · **Verify:** see PROJECT_STATE §3 for the latest run

## Built (PRD §10 / §11)
- `src/privacy/buildCloudRequest.js` (FR-PRIV-001, INV-1, INV-2): only the 3 allow-listed shapes; unknown task, extra, missing or wrong-type fields → `field_not_allowed`; image data anywhere (data URL, raw JPEG/PNG base64, inlineData, Blob, ArrayBuffer, typed array) → `image_not_allowed`. Output is a frozen copy tagged in a WeakSet.
- `src/ai/cloud.js`: the only cloud sender; refuses untagged requests; logs every send/block to `outgoingLog` (for the Phase 3 panel).
- `src/ai/onDevice.js` (FR-SCAN-001/002): Framing Coach + label extraction with `ONLY_ON_DEVICE`; output limited to brand/ingredients/strength/quantity; `nano_unavailable` / `label_unreadable`.
- `src/ai/brandSuggest.js` (FR-SCAN-005): cloud suggestion labelled "Suggestion: check your box".
- `src/meds/medicine.js` (FR-SCAN-003, INV-6): drafts start unconfirmed; `ingredientsForCloud` throws until the user confirms.
- `src/store/*`: medicines + traveller name in IndexedDB only.
- Add-medicine screen: Scan (photo or labelled sample photo, Framing Coach spoken hint, read label) and Type (ingredient or brand suggestion), confirm step, list with delete. Scan disabled with a reason when the on-device model is missing (FR-SCAN-004).
- "Ran on" badge from `response.inferenceSource` only.

## Tests
- Property test: 500 random extra fields all rejected. Forbidden keys (name, condition, doctor, photo, uid…) rejected for every task.
- On-device mode, field filtering, error mapping; cloud sender refuses lookalike objects.

## Manual checks (headless Chromium 153, no Firebase config)
- Type → confirm → saved → survives reload; no outbound requests.
- Brand suggestion without config shows `config_missing` (no silent fallback).
- Scan with a sample photo without config shows `config_missing`.
- 390px: no horizontal scroll.

## Checkpoint A (self-review against INV-1/2/6/7)
- Fixed: `/api/source` followed redirects without checking the final origin. Now an off-origin redirect → `source_not_allowed` (test added).
- Fixed: SDK config errors were hidden behind `cloud_unavailable`; structured errors now pass through.
- Checked: device-extracted drafts drop the raw model text and never store the photo.

## Not verified yet (needs Adesope's laptop)
- Real Nano output on the 5 samples, spoken hint, timings (Gate 0 steps 1–2). Act 2 recording.

## Parked
- Nothing new.
