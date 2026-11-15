# Phase 6 report (partial): Judge Mode + README (PRD §27)

**Date:** 2026-11-15 · **Verify:** PASS (lint 0 warnings, 31 files / 135 tests, build OK)

## Built
- `/judge` (FR-JDG-001): the seeded "Amaka-Tokyo" trip (NG → AE → JP; methylphenidate, pseudoephedrine, paracetamol), labelled DEMO TRIP, with the 60-second path. The Vercel rewrite `/judge` → `index.html` is added.
- README: test counts, local setup, App Check debug-token steps, known limits. The Apache-2.0 `LICENSE` file is added.

## Manual checks
- `/judge` → **Run the demo trip** → 6 results in 1.8 s (headless, no Firebase config). All 6 are ⚠ with honest reasons, and the screen shows no horizontal scroll at 390px.

## Not done (needs Adesope)
- Live deploy, real verdicts, video, Devpost, making the repo public, and Checkpoint C (before submission).
- Phase 5 (P1) is held until P0 is deployed and recorded (PRD §26).
