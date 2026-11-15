# CLAUDE.md: Carry Safe

> Single rules file for every agent. Claude Code reads it automatically. Codex reads AGENTS.md by default, so start Codex prompts with "Read CLAUDE.md and PRD.md first."
> Point to PRD sections; never copy requirements here.

## 1. What this is

**Carry Safe** is a web app that checks whether a traveller's medicine is legal at every stop on their trip, including layovers. The laptop reads the label privately, and only the ingredient name goes out to be checked against official government pages, with the exact quote verified.
Tagline: Your medicine. Your secret. Your trip, safe.
Hackathon: #BuildHybridAI 2026 (Google Firebase), Best Web/Chrome App. Official deadline: Mon Nov 30, 2026, 11:00 PM WAT. **Internal cutoff: Mon Nov 30, 12:00 PM WAT.**
Firebase project: `carry-safe-30940` (Spark, no billing). Hosting: Vercel Hobby. Repo: github.com/london160771/carrysafe.

Memorable flow: `SCAN → HIDE → CHECK EVERY STOP → SHARE STATUS → SHOW THE OFFICER`

Core guarantees:
- **Only allow-listed fields leave the device.**
- **No ✅/⛔ without a quote verified word-for-word on the official page.**

## 2. Source of truth

**`PRD.md` is the only source of truth.** `docs/CONCEPT-BRIEF.md` is history; where it says "Search grounding" or "Firebase Hosting", the PRD wins.

Read in this order: `PRD.md` (the section you're building) → `PROJECT_STATE.md` → the code. The repo is the final truth for what exists.
- Cite the PRD section you're building against (e.g. "PRD §14").
- The PRD is corrected by evidence. If the SDK, Chrome, Firebase, Vercel or an official page behaves differently, fix the PRD and record raw evidence in `docs/gate0.md` or PRD §16.
- Never silently change scope. If a request conflicts with the PRD, update the PRD first.

## 3. Resolved decisions

PRD §16. Settled. Reopen only with new evidence. **No billing, ever, unless Adesope says so.**

## 4. Commands

Planned; confirm against `package.json` after Phase 0.

```bash
npm install                 # install
npm run dev                 # Vite dev server (app only)
vercel dev                  # app + /api functions locally
npm test                    # unit tests (Vitest)
npm run test:rules          # Firestore rules tests (emulator)
npm run lint                # ESLint, zero warnings
npm run build               # production build
npm run verify              # lint + test + build (the gate)
vercel --prod               # deploy
firebase deploy --only firestore:rules
```

## 5. Scope

P0 / P1 / Never: PRD §26. Screens: PRD §21 (6, no more). Outbound calls: PRD §14 (no others). Countries: JP, AE, SG, GR, GB, US only.
- If a feature doesn't support the core flow, don't build it. New ideas → `ROADMAP.md`.
- P1 extras start only after P0 is deployed and recorded.

## 6. Invariants

PRD §11 (INV-1..INV-7, verdict states, error codes). Always:
- Every cloud AI request goes through `buildCloudRequest()`. No direct cloud calls elsewhere.
- Images only go to `ONLY_ON_DEVICE` calls.
- ✅/⛔ only after `verifyQuote()` passes; otherwise ⚠.
- `/api/source` takes a country code only and fetches only `sources.json` URLs.
- Firestore stores status and the shared rule cache only. No medicine tied to a person.
- Code does the maths. Fail closed. Structured errors (`code`, `retryable`, `nextAction`). No silent fallbacks; saved verdicts are always labelled with their date.

## 7. Honesty rules (these ARE the product)

- Never fabricate verdicts, quotes, URLs, test counts, timings or screenshots.
- `sources.json` and `fallback-verdicts.json` contain only real official URLs and real quotes, checked by opening the page. Record the date.
- "Ran on" badges come from the SDK's real inference source.
- Seeded trip and sample photos are always labelled. Keep `REAL_VS_MOCKED.md` in sync.
- Report test counts only after they pass. Performance numbers are targets until measured.
- Every verdict screen says: "Information, not legal or medical advice. Confirm with the embassy." Never claim "safe".

## 8. Framework gotchas

Check installed versions first.
- **Firebase AI Logic hybrid (web):**
  - On-device needs desktop Chrome 139+ with the Prompt API.
  - On-device input is text + JPEG/PNG (inline) only, single-turn, no tools, ~9216 tokens max.
  - Initialise the device model after a user gesture.
  - Check the docs for the inference-source property name.
- **Free tier only:**
  - Gemini Developer API on Spark. Google Search grounding is NOT available, so don't use it.
  - Free-tier requests may be used to improve Google products, so never send personal data.
  - Respect rate limits; use the Firestore cache.
- **App Check:**
  - Enforcement is required for AI Logic.
  - Use a debug token locally and for judges if a reCAPTCHA Enterprise key can't be created without billing.
  - Never commit a debug token.
- **Vercel functions:**
  - Node runtime. Set a timeout and a response-size cap.
  - Strip HTML to text; parse PDFs with a pinned library.
  - Same origin as the app, so no CORS needed.
- **Vite:** `VITE_` env vars ship to the browser. Only Firebase web config goes there.
- **React 19:** no `Date.now()`/`Math.random()` in render; no synchronous setState in an effect body.
- **Web Speech:**
  - `SpeechRecognition` may send audio to Google, so label it.
  - `speechSynthesis` voices load async (`voiceschanged`); check for `ja-JP`.
- **Demo laptop Nano:** performance class "Low". Show progress; never block the UI.
- [Add breaking changes here as you find them.]

## 9. Code quality

- No comments. Names and structure explain the code.
- Small, single-purpose units; split files past ~200 lines.
- Pure core: `buildCloudRequest`, `verifyQuote`, `paragraphPicker`, `verdict`, `quantity`, route expansion.
- No dead code, TODOs or magic numbers.
- Bootstrap for UI (no Tailwind). Pin versions; few dependencies. Zero lint warnings.
- Accessible by default: semantic HTML, labels, focus states, `aria-live`, icon + word.
- Tests for every invariant, the lab and the maths.

## 10. Continuous phase mode (Adesope's rule)

**Work through the phases in PRD §27 back to back, Phase 0 → Phase 6, without waiting for approval between phases, as long as the work matches the docs.**

For each phase:
1. Name the phase and its acceptance criteria (PRD §27); inspect the code; find the smallest change.
2. Build only that phase.
3. Verify:
   - Run `npm run verify` and read the real output (beware `| tail` hiding exit codes).
   - Screenshot the UI, including at 390px.
   - Show failure states.
4. Update `PROJECT_STATE.md` and write a short phase report: files changed, real test results, manual checks, limits, items parked in ROADMAP.
5. Run the review checkpoint if the phase has one (§12). Fix issues, then **continue to the next phase automatically.**

**STOP and wait for Adesope only when:**
- You need something only he can do: an account login, a console setting, a key or token, Vercel access, running on-device tests on his laptop, recording video, the Devpost submission.
- **Medicine photos:** 3 real photos are in `samples/real/` (see `samples/README.md` for ground truth). For pseudoephedrine and methylphenidate, generate plain sample labels in `samples/generated/` (generic names, "SAMPLE LABEL" text, no brands). Don't stop for more photos.
- Reality contradicts the PRD and a decision is needed (the fix isn't obvious, or it changes scope, cost, privacy or the demo story).
- Something would cost money, delete data, or can't be undone.
- A test or gate keeps failing after a reasonable fix attempt.
- The internal cutoff is near and something P0 is at risk.

**Every stop must include a simple guide for Adesope:**
- One line: what you need and why.
- Numbered steps, in simple words, one action per step.
- Exact links, buttons and menu names. Commands in a code block he can copy.
- What to send back (e.g. "send me the key ID" or "send a screenshot").
- Never ask him to paste secrets into chat. Tell him where to put them instead (e.g. `.env.local`, Vercel env settings).

After he replies, resume where you stopped.

## 11. Demo and recording

Demo acts: PRD §22 (≤ 3:00). Record each act the moment it works. On-device acts must be recorded on Adesope's laptop, so stop and give him a recording guide.
Keep the lab (PRD §18), Judge Mode (PRD §23) and seed "Amaka-Tokyo" (PRD §19) working at all times.
README needs: the 60-second judge path, the sponsor-to-file table, a REAL_VS_MOCKED link, a test badge, the video link, known limits and the App Check/debug-token setup.

## 12. Review checkpoints

- Default implementation model: [Sonnet 5.5 High].
- A stronger model (Opus 5.5) reviews:
  - **Checkpoint A:** after Phase 1.
  - **Checkpoint B:** after Phase 2.
  - **Checkpoint C:** before submission.
- Checkpoints don't stop the run unless they find a problem that needs Adesope (§10).

## 13. Git

- Conventional messages (`feat:`, `fix:`, `docs:`). Never commit secrets, `.env*` or App Check debug tokens.
- **Commit/push rule (Adesope, Nov 15):** at the end of every phase that passes `npm run verify`, commit and push to `origin` (github.com/london160771/carrysafe). Never push failing code. Never force-push.
- Repo must be public with Apache-2.0 visible in About before submission.

## 14. Deadline discipline

- After **12:00 PM WAT Nov 30**: no new features; only links, video access, README errors, secrets, final checks.
- After **11:00 PM WAT Nov 30**: demo stays live; no feature commits.

## 15. Definition of done

PRD §30. A phase is done when its PRD §27 acceptance criteria pass, `npm run verify` passes, the phase report is written and `PROJECT_STATE.md` is updated.
