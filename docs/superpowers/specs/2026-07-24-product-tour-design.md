# Product Tour — Design

## Context

QuickRecall has grown a lot of features (Notes, Flashcards, Quiz, Bookmarks, Review, Job Tracker, Speak Up, Mock Interview) with no guided introduction — a new visitor has to discover the sidebar on their own. This adds a short, spotlighted walkthrough of the app's core features, built on MongoDB's LeafyGreen design system (already the app's UI library for MongoDB-styled components), rather than reaching for a third-party tour library.

## Dependency

Add `@leafygreen-ui/guide-cue` — LeafyGreen's purpose-built multi-step spotlight/tooltip component (anchors to a `refEl`, supports step numbering, Next/Done buttons, dismiss). `LeafyGreenProvider` already wraps the whole app (`src/app/providers.tsx`), so no new provider wiring is needed.

## Scope decisions (confirmed)

- **Trigger**: both — auto-starts on first visit, and stays available afterward via a persistent replay entry point.
- **Where steps point**: the tour stays on the Dashboard page and spotlights sidebar nav items (not a multi-page walkthrough). Simpler: one mount point, no cross-route state.
- **Steps covered**: a curated set of 8 actual features, not every sidebar link (the topic-content groups — JS, React, Redux, Databases, etc. — are just content, not something needing a guided explanation):
  1. Dashboard
  2. Flashcards
  3. Quiz
  4. Saved (Bookmarks)
  5. Review
  6. Job Tracker
  7. Speak Up
  8. Mock Interview
- **Replay entry point**: a small icon button in the global `AppHeader`, visible from every page.

## Architecture

A single new client component, `ProductTour`, mounted once in the app shell (alongside `AppSidebar`/`AppHeader` in the `(app)` layout). It owns all tour state and renders `<GuideCue>` in multi-step mode. It does **not** get threaded into `AppSidebar`'s internals via props/refs — it locates its target DOM nodes by a `data-tour="<key>"` attribute added to `NavItem`'s `SidebarMenuButton` in `src/components/layout/app-sidebar.tsx` (one extra prop on that shared component, inert for the ~8 non-tour nav items).

### Data

New file `src/data/product-tour.ts` — single source of truth for step content:

```ts
export interface TourStep {
  key: string; // matches the NavItem's data-tour attribute
  title: string;
  description: string;
}

export const TOUR_STEPS: TourStep[] = [
  { key: 'dashboard', title: 'Dashboard', description: '…' },
  { key: 'flashcards', title: 'Flashcards', description: '…' },
  { key: 'quiz', title: 'Quiz', description: '…' },
  { key: 'saved', title: 'Saved', description: '…' },
  { key: 'review', title: 'Review', description: '…' },
  { key: 'job-tracker', title: 'Job Tracker', description: '…' },
  { key: 'speak-up', title: 'Speak Up', description: '…' },
  { key: 'mock-interview', title: 'Mock Interview', description: '…' }
];
```

(Real copy written during implementation.)

### Trigger flow

- **Auto**: on mount, if `useLocalStorage('quickrecall-tour-seen', false)` (existing `src/hooks/useLocalStorage.ts`) is `false` and the current route is `/dashboard`, auto-start after a short delay (let the dashboard finish rendering first).
- **Manual replay**: a button in `AppHeader` (`src/components/layout/app-header.tsx`) always does `router.push('/dashboard?tour=1')`. `ProductTour` reads that param via `nuqs` (matching the app's existing URL-state convention, e.g. notes/flashcard `?open=`), force-starts regardless of the "seen" flag, then clears the param.
- Both paths converge on one `start()` function inside `ProductTour` — not two separate code paths.

### Sidebar interaction

The tour needs the sidebar expanded to find its targets. On `start()`, `ProductTour` reads `useSidebar()` (`src/components/ui/sidebar.tsx`) for the current `open`/`openMobile` state, forces it open (`setOpen(true)` desktop, `setOpenMobile(true)` mobile), and restores whatever it was on tour end/dismiss.

### Step mechanics

`ProductTour` holds `currentStepIndex` state. A single ref object is repointed via `document.querySelector('[data-tour="..."]')` in a `useEffect` keyed on the index, then passed to `<GuideCue refEl={...} numberOfSteps={8} currentStep={currentStepIndex + 1} .../>`. Reaching the end or dismissing (X button) sets `quickrecall-tour-seen = true` and restores the prior sidebar open state.

## Edge cases

- If a target node isn't found for a step (shouldn't happen — the sidebar is always mounted on every non-`/` route), skip that step defensively rather than rendering a broken spotlight.
- The tour never auto-starts on `/` (the marketing/landing page) since `AppSidebar`/`AppHeader` already return `null` there.
- Manual replay from a non-dashboard page navigates first, then starts — no tour rendering happens off the Dashboard route.

## Out of scope (this pass)

- No multi-page tour (all steps stay on Dashboard, spotlighting the sidebar).
- No per-feature in-page tours (e.g. a dedicated Quiz walkthrough) — just the one app-level tour.
- No tour analytics/tracking of completion.

## Verification

Manual, since there's no existing UI-component test convention to extend (the repo's Vitest tests cover pure logic in `src/lib/*.test.ts`, not components):
1. Clear `localStorage`, visit `/dashboard` → tour auto-starts.
2. Click through all 8 steps, confirm each spotlights the right nav item and the sidebar stays open.
3. Reload → tour does not restart.
4. From a different page, click the header replay button → navigates to `/dashboard` and restarts, regardless of the "seen" flag.
5. `pnpm typecheck`, `pnpm lint`, `pnpm build` all pass.
