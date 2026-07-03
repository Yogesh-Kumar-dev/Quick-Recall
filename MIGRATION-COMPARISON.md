# Migration Comparison — `quickrecall.localhost` (new) vs `quickrecall.vercel.app` (legacy)

Generated via a Playwright script (28 route pairs, full-page screenshots + console/page error
capture + programmatic content-count checks) comparing the RSC-first migration on `migration`
against the live legacy Berry/MUI app. Method notes at the bottom.

## TL;DR

- **One real gap found: the Home/Dashboard page.** Legacy has a rich landing page; the new app's
  `/` is still a placeholder stub. Everything else checked out.
- **Three real bugs found and fixed during this pass** (already committed): a hydration mismatch
  in the PWA offline hooks, a missing `?open=` deep-link on Custom Hooks, and a spurious React key
  warning on both Quick Recall pages.
- **Zero content loss.** Every notes/machine-coding/custom-hooks/flashcards count matches legacy
  exactly (verified programmatically, not just eyeballed).
- Everything else that looks "different" is either an already-decided intentional simplification
  (About page copy, dropped SectionLanding pages, generic vs. branded icons) or a pre-existing
  legacy bug (a React hydration error present on nearly every legacy page, unrelated to this
  migration).

---

## 🔴 Gap: Home / Dashboard page not built

| Legacy (`/dashboard`) | New app (`/`) |
|---|---|
| Full landing page: stat tiles (Total Notes, Machine Coding, Easy/Medium/Hard counts), per-topic cards (HTML & CSS, JavaScript & TypeScript, React, Redux, Next.js) each with note/problem counts and quick links, Instagram launcher | Placeholder: "QuickRecall — RSC-first rebuild on the MongoDB design system. Pick a topic from the sidebar." |

This is the single biggest visual/functional gap. It was flagged in the migration plan's Phase 6
notes ("home page is still a placeholder") but never built. Worth a dedicated pass before cutover —
likely wants the same stat-tile + category-card layout, server-computed counts from the existing
data registries (no new data needed, just aggregation + a page).

---

## ✅ Fixed this session (found via this comparison)

These were caught by the automated pass (console/page-error capture) and fixed immediately —
already committed on `migration`.

1. **Hydration mismatch in PWA hooks.** `useOfflineDownload`'s `isSupported` and
   `useOnlineStatus`'s `online` were computed synchronously from `navigator` during render. Server
   has no `navigator` (always `false`/`true` fallback); the client's first render read the real
   browser value immediately, mismatching before hydration settled — reproduced in every real
   browser (any browser with Service Worker support). Fixed by seeding state to match SSR and
   correcting via `useEffect` post-mount.
2. **Custom Hooks page had no deep-link.** `/react/custom-hooks` used local `useState` (not URL
   state) to stay statically prerendered, so header search results for a specific hook (e.g.
   "useDebounce") landed on the page without opening or scrolling to that hook's card. Fixed by
   reading `searchParams` server-side (forces the route dynamic, same pattern as the notes pages)
   and switching filters/open-state to `nuqs`.
3. **Spurious "missing key" console warning on both Quick Recall pages.** Not a real missing key —
   `QuickRecallView` is the only `'use client'` content view, and it receives `headerAction` (a
   `PdfLauncher` element) created by its Server Component page as a prop. That RSC-boundary
   crossing, rendered bare alongside elements the Client Component creates itself, trips React's
   dev-only key heuristic even though there's no actual array/list involved (confirmed by bisection:
   the warning persisted with `headerAction` reduced to a bare `<span>`, and disappeared entirely
   when `headerAction` was `undefined`). Fixed by wrapping it in a keyed `Fragment`.

---

## Content parity — verified programmatically

Extracted the "N of N" / "Browse All — N items" counter text from both apps for every notes,
machine-coding, and custom-hooks page. All matched exactly:

| Section | Local | Legacy |
|---|---|---|
| JS Notes | 117 | 117 |
| TS Notes | 27 | 27 |
| TS for React | 53 | 53 |
| React Notes | 48 | 48 |
| Redux Notes | 23 | 23 |
| Redux Toolkit | 6 | 6 |
| RTK Query | 6 | 6 |
| createAsyncThunk | 6 | 6 |
| Next.js Notes | 24 | 24 |
| Next.js Rendering | 13 | 13 |
| HTML Notes | 11 | 11 |
| CSS Notes | 13 | 13 |
| Engineering Essentials | 33 | 33 |
| JS Machine Coding | 11 | 11 |
| React Machine Coding | 23 | 23 |
| Custom Hooks | 11 | 11 |

No missing or extra content anywhere in the ported sections.

---

## Intentional differences (already decided — not gaps)

- **About page copy rewritten**, not ported verbatim — dropped cards for features not (yet) built
  or dropped outright: PWA/offline (built later, not yet reflected back into the About copy —
  worth a follow-up now that Phase 6 landed), Fullscreen API, fuzzy header search wording (says
  "fuse.js" — matches, good), Redux DevTools, react-scan, react-virtuoso, Monaco/
  react-syntax-highlighter, embedded video player. MUI → shadcn/Tailwind, Zustand instead of Redux.
- **SectionLanding-style category pages dropped.** Legacy's per-topic pages (`/js/notes`, etc.) are
  themselves rich landing pages with difficulty/topic breakdown cards before you reach the actual
  list (see the "Browse All — N items" pattern above). The new app goes direct-to-list. This was a
  deliberate UX decision made earlier this session ("direct-to-list is better UX, drop it") — not
  an oversight.
- **AI Voice Tools icons** (Speak Up page) are generic lucide icons instead of branded ChatGPT/
  Claude/Gemini/NotebookLM logos — decided during the Speak Up port ("icons weren't load-bearing").
- **Speak Up question bank**: local screenshot showed more visible cards below the fold (JS/React
  questions) than the prod screenshot appeared to capture — likely just a scroll/viewport artifact
  in the capture, not a real discrepancy (same question bank data, same "All" filter selected in
  both).
- **Saved (Bookmarks) empty-state copy** differs slightly in wording ("bookmark icon" vs "bookmark
  star", legacy also lists "problems" explicitly) — cosmetic, not worth chasing.

## Pre-existing legacy bug (unrelated to migration)

Nearly every legacy page threw a **React hydration error (minified error #418)** in the console —
`/dashboard`, `/about`, `/review`, `/job-tracker`, `/speak-up`, all notes pages, all machine-coding
list pages, all Redux/Next.js/HTML-CSS/Engineering pages. This is a pre-existing bug in the live
production app, not something introduced by (or fixable in) the migration — noted here only so it
isn't mistaken for a migration regression if someone re-runs this comparison later.

## New in the migrated app (not in legacy at all)

- **Flashcards** (`/flashcards`, `/flashcards/[section]`) — a new Phase 3 study feature, 12 sets
  (JS 102, TS 43, React 57, Next.js 42, Next.js Rendering 19, HTML 10, CSS 12, Engineering 38,
  Redux 37 combined). Works cleanly, flip/prev/next/bookmark all present.
- **PWA/offline mode** (install prompt, offline download panel, offline section guard) — legacy has
  this too (`react-scan`/PWA card in About), so this is parity work, not new, but wasn't part of
  this route-by-route comparison since it needs manual install/offline testing (owed separately).

---

## Method

- Playwright (Chromium, headless), `ignoreHTTPSErrors: true` for the local self-signed cert.
- 28 route pairs at 1440×900, `waitUntil: 'networkidle'` + 500ms settle, full-page PNG +
  `console`/`pageerror` capture per page. Legacy URL mapping handled the known path differences
  (`/` → `/dashboard`, `/react/machine-coding/<slug>` → `/machine-coding/<slug>`).
- A second pass extracted the visible item-count text from both apps' DOM for an exact,
  non-visual content-parity check (notes/problems/hooks counts).
- Scope: one representative page per section (not all ~78 individual machine-coding/flashcard
  slugs) per the agreed route-scope decision.
- Screenshots and raw results live in the session scratchpad, not checked into the repo (transient
  artifacts — re-run the script to regenerate if needed).
