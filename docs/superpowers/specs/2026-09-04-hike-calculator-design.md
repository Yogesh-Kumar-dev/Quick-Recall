# Hike Calculator — Design

## Context

QuickRecall already has a handful of job-hunting utilities living as flat top-level nav items — Job Tracker, Speak Up, Mock Interview, Planner — separate from the topic-content sidebar groups (JS, React, Databases, etc.) and from Dashboard's content-stats overview. This adds a salary hike calculator: a small, stateless tool for working out a new CTC from a hike percentage, or a hike percentage from a new CTC, plus a before/after comparison, a nearby-scenario table, and a 3-year compounding projection.

It doesn't fit Dashboard (which is purely aggregate content/practice stats) or any single existing feature page. It's the same shape as Job Tracker/Speak Up/Mock Interview/Planner: a job-hunting utility, not prep content.

## Calculation logic

Confirmed against https://razorpay.com/x/salary-hike-calculator/ — same two formulas already planned:

- **New CTC** = Current CTC × (1 + Hike% / 100)
- **Hike %** = (New CTC − Current CTC) / Current CTC × 100

## Scope decisions (confirmed)

- **Placement**: new standalone route, `/tools/hike-calculator`.
- **Nav**: new "Tools" sidebar group. Moves **Job Tracker, Speak Up, Mock Interview, Planner** out of the flat `primaryNav` list into this group, alongside the new Hike Calculator entry. `primaryNav` keeps Dashboard, About, Articles, Settings.
- **Modes**: two tabs, not a single auto-solving form.
  1. **Find New CTC** — inputs: Current CTC, Hike % → output: New CTC.
  2. **Find Hike %** — inputs: Current CTC, New CTC → output: Hike %.
- **Persistence**: none. Stateless client component (`useState`), no Dexie table, no localStorage. Fields reset on reload — matches a calculator, not a tracked feature.
- **Currency**: fixed ₹ prefix on CTC fields (the "CTC" terminology is India-centric). No currency selector.
- **Extras beyond the two core formulas** (all derived from whichever tab's inputs are complete, using the "effective %" — the entered % in tab 1, or the computed % in tab 2):
  - **Before/after comparison**: Current CTC vs New CTC side by side, plus the absolute increase (₹) and the %.
  - **Scenario table**: effective% − 10, effective%, effective% + 10 (fixed ±10 percentage points, not configurable), each row showing the resulting New CTC.
  - **3-year projection table**: Year 0 (current) through Year 3, each year compounding the same effective % onto the previous year's CTC. Fixed at 3 years, not configurable.
- **Charts**: explicitly **not** using Cloudscape charts. Cloudscape (`@cloudscape-design/components`) is deliberately scoped to the AWS section only — `CloudscapeProvider` (`src/components/providers/cloudscape-provider.tsx`) applies AWS-console-specific dark-mode/context classes so that surface looks like the real Console, not a QuickRecall re-skin. Dragging it into a non-AWS tool would either clash visually (wrapped) or silently mis-theme (unwrapped, per that file's own comment about tokens with no plain `.awsui-dark-mode` fallback). The scenario and projection tables are small (3 rows each) and read fine as plain data, no chart needed.
- **Not doing**: currency selector, configurable scenario step or projection year count, calculation history/log, monthly in-hand estimate. Can be added later if actually needed.

## Architecture

One route, one client component — no new Dexie table, no new dependency.

- `src/app/(app)/tools/hike-calculator/page.tsx` — thin server page (metadata + render), matching the existing `dashboard/page.tsx` pattern.
- `src/components/hike-calculator/hike-calculator.tsx` — the client component. Owns all state:
  - Active tab (`'new-ctc' | 'hike-percent'`, shadcn `Tabs`).
  - Tab 1 inputs: `currentCtc`, `hikePercent`.
  - Tab 2 inputs: `currentCtc`, `newCtc`.
  - Derives `effectivePercent` and `resultCtc`/`resultPercent` per active tab; renders the before/after block, scenario table, and projection table only once both of the active tab's inputs are non-empty and current CTC > 0.
- `src/lib/hike-calculator.ts` — pure functions, no React/Dexie, mirroring the `review-scheduler.ts` convention of framework-free calculation logic:
  ```ts
  export function newCtcFromHike(currentCtc: number, hikePercent: number): number;
  export function hikePercentFromNewCtc(currentCtc: number, newCtc: number): number;
  export function scenarioRows(currentCtc: number, effectivePercent: number): { percent: number; newCtc: number }[]; // effective-10, effective, effective+10
  export function projectionRows(currentCtc: number, effectivePercent: number): { year: number; ctc: number }[]; // Year 0..3, compounding
  ```
  Kept pure and separately testable, same reasoning as the review scheduler: the caller owns all inputs, the function just does the math.

## UI

- shadcn `Tabs` for the two modes (`src/components/ui/tabs.tsx`, already installed).
- shadcn `Input`/`Label` for Current CTC / Hike % / New CTC fields, ₹ prefix via `input-group.tsx` (already installed, used elsewhere for prefixed inputs).
- Before/after block: two shadcn `Card`s side by side (Current vs New), plus a line for the absolute increase — same visual language as `TopicStatCard`'s stat blocks on Dashboard.
- Scenario table and projection table: plain `<table>` with Tailwind classes (no shadcn `table.tsx` exists in this project yet — not adding one for two 3-row tables; a couple of styled `<table>`/`<tr>`/`<td>` elements is simpler and matches the ladder's "native platform feature" step).
- No charting library, per the Cloudscape decision above.

## Testing

No test suite exists in this project yet (`pnpm test` is a no-op placeholder) — matches existing convention, no new test infra added for this feature.
