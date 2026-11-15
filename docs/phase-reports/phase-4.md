# Phase 4 report: Border Card + accessibility (PRD §27)

**Date:** 2026-11-15 · **Verify:** PASS (lint 0 warnings, 30 files / 133 tests, build OK)

## Built
- `src/ai/translateCard.js` (FR-CARD-001): `PREFER_IN_CLOUD`, through `buildCloudRequest` (`genericNames`, `quantities`, `language: "ja"` only). The traveller's name is added on the device.
- Border Card screen: English card built by code, Japanese card from the model (labelled "Machine translation" + Ran-on badge), saved locally.
- Show the Officer (FR-CARD-002): full-screen, black/white/yellow, big type, Japanese first with English under each line, "Read aloud in Japanese" (ja-JP voice, adjustable speed), Esc/Close, focus moves to Close. Warns when no Japanese voice is installed.
- Voice add (FR-VOICE-001): Speak tab using `SpeechRecognition`, labelled "may send the audio to Google’s speech service"; result goes through the confirm step.
- Persistent settings bar: big text, high contrast, read-aloud speed (per-viewer, localStorage with try/catch).

## Manual checks (headless Chromium, 390px)
- Card translation without Firebase config shows `config_missing`.
- Officer mode opened from an injected card (test fixture text, not committed); Close focused; Esc closes.
- Big text + high contrast: no horizontal scroll.
- Keyboard: settings → nav → route → group controls reachable by Tab; skip link present.

## Not verified (needs Adesope's laptop / config)
- Real Japanese translation, ja-JP voice, speech recognition in desktop Chrome, screen reader pass (NVDA/ChromeVox), Act 5 recording.

## Parked
- Nothing new.
