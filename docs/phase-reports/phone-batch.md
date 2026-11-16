# Phone batch report (2026-11-16)

Built against PRD FR-CARD-003, FR-CARD-004, FR-PWA-001 and FR-OFF-001 (now P0), §21, §22 and §23.

## What changed

- **Card to phone by QR.** `src/card/cardTransfer.js` compresses the card (deflate-raw, base64url) into `/card#c=…`. The fragment never reaches a server. The phone checks the shape, saves the card on the device (`borderCard.received`), and removes the fragment from the address bar. A bad link gives `card_link_invalid`.
- **Print or save as PDF.** `window.print()` with `src/app/print.css`, which hides the site chrome.
- **Install + offline.** `public/manifest.webmanifest`, icons, and a service worker built by `src/pwa/serviceWorkerPlugin.js`. Pages load network-first and fall back to the cached app; assets are cache-first. `/api/` and other origins are never cached. There is an Install button where the browser offers one.
- **Wording.** "What left your laptop" became "What left this device". Medicine entry defaults to typing when the on-device model is missing (phones).
- **Docs.** PRD, README, REAL_VS_MOCKED, CLAUDE.md §8, PROJECT_STATE.

## Verification

- `npm run verify`: lint 0 warnings, 35 files / 150 tests passing, build OK.
- Playwright, against `npm run build && npx vite preview`:
  - The laptop ran the demo trip and made the Japanese card (live cloud translation, `in_cloud`).
  - The QR on the page was decoded with jsQR back to the card link (about 730 characters).
  - A Pixel 7 emulation opened the link, showed the card, and the address became `/card`.
  - Then the preview server was stopped. `/card` (the saved card), `/` and `/privacy` still opened.

## Bug found and fixed

The first offline run failed: the app shell loaded, but the JS and CSS did not. The preview server sends `Vary: Origin` on assets, and module scripts are requested with an `Origin` header. The service worker now matches the cache with `ignoreVary: true`.

## Limits

- Tested on an emulated phone, not a real one. Install and QR scan still need a check on Adesope's phone.
- iPhone Safari installs through Share → Add to Home Screen; there is no install button there.
- The QR contains the traveller's name. The page says to show it only to your own phone.
- Label scanning on the phone is not possible (no on-device model); typing or voice is used instead.
