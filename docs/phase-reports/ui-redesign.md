# UI redesign (2026-11-16)

Asked by Adesope: unslop the design, premium but light (no dark UI), real photos, simple wording, real routes instead of `/#/`.

## Direction

- **Product:** tells a traveller if each medicine is allowed at every stop, using the government's own words, without sharing the medicine.
- **Character:** calm, exact, warm.
- **World:** travel papers and airport window light.
- **Moments:** the hero photo with a "Your trip" pass showing the route and each stop's status; the verified quote set like a stamped excerpt.
- **Signature:** the dotted route line with stop dots (hero pass, Results, Demo, logo mark).

## What changed

- Theme: warm neutral ramp, one passport-green accent, verdict colours only for meaning. Instrument Sans for the interface, Instrument Serif for page titles and quotes. lucide icons replace emoji in the interface.
- Layout: sticky header with a menu button on small screens, full-bleed hero on Trip, page headers with photos, two-column panels on desktop that stack on mobile.
- Copy: shorter, plain sentences on every page. Test-bound strings kept ("Quote found on official page ✓", "AI quote not found on the official page", "Ran on: cloud").
- Routes: `/`, `/add`, `/results`, `/privacy`, `/card`, `/judge`, `/join/:id`. Old `/#/...` links redirect. Group invites now use `/join/:id`.
- Photos: 4 Pexels photos, labelled as illustrations (footer, `public/photos/CREDITS.md`, `REAL_VS_MOCKED.md`). Unsplash, StockSnap and Pixabay were blocked from the build machine; Pexels downloads worked.

## Checks

- `npm run verify`: lint 0 warnings, 33 files / 142 tests, build OK.
- Playwright at 1440 and 390 on all pages: no horizontal scroll; high-contrast mode renders; demo trip ran live and Results showed verified quotes.

## Limits

- Hero photo is a stock photo, not Amaka; the Demo page uses a mother-and-daughter photo that fits the story.
- Bundle is 608 kB (the chunk-size warning was there before).
