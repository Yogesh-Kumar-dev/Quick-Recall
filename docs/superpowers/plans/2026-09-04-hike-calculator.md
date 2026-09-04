# Hike Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a stateless salary hike calculator tool at `/tools/hike-calculator`, reachable from a new "Tools" sidebar group that also absorbs the existing Job Tracker, Speak Up, Mock Interview, and Planner nav items.

**Architecture:** A pure calculation module (`src/lib/hike-calculator.ts`, unit-tested with vitest) backs a single client component (`src/components/hike-calculator/hike-calculator.tsx`) rendered by a thin server page. Nav changes are a data-only edit to `src/config/nav.ts` — `AppSidebar` already renders `navSections` generically, so no sidebar component changes are needed.

**Tech Stack:** Next.js 16 App Router, React 19, shadcn/ui (`Tabs`, `Input`/`InputGroup`, `Card`, `Label`), Tailwind v4, vitest.

## Global Constraints

- No new npm dependency, no Cloudscape, no charting library — plain `<table>` with Tailwind for scenario/projection tables (spec's "Charts" and "UI" sections).
- No persistence: no Dexie table, no localStorage — plain `useState`, resets on reload (spec's "Persistence" decision).
- ₹ fixed prefix on CTC fields, no currency selector (spec's "Currency" decision).
- Scenario table: exactly effective% − 10, effective%, effective% + 10 — not configurable.
- Projection table: exactly Year 0 through Year 3, compounding the same effective % each year — not configurable.
- Formulas (confirmed against razorpay.com/x/salary-hike-calculator):
  - `New CTC = Current CTC × (1 + Hike% / 100)`
  - `Hike % = (New CTC − Current CTC) / Current CTC × 100`
- Biome: single quotes in JS/TS, double quotes in JSX, 140 line width, 2-space indent, no trailing commas, semicolons, `arrowParentheses: always`. Run `pnpm check` before committing.
- `src/lib/hike-calculator.ts` must stay framework-free (no React/Dexie import), matching `src/lib/review-scheduler.ts`'s convention.

---

### Task 1: Pure calculation module

**Files:**
- Create: `src/lib/hike-calculator.ts`
- Test: `src/lib/hike-calculator.test.ts`

**Interfaces:**
- Consumes: nothing (pure, no imports beyond TS itself).
- Produces (consumed by Task 3):
  ```ts
  export function newCtcFromHike(currentCtc: number, hikePercent: number): number;
  export function hikePercentFromNewCtc(currentCtc: number, newCtc: number): number;
  export interface ScenarioRow {
    percent: number;
    newCtc: number;
  }
  export function scenarioRows(currentCtc: number, effectivePercent: number): ScenarioRow[]; // [effective-10, effective, effective+10]
  export interface ProjectionRow {
    year: number;
    ctc: number;
  }
  export function projectionRows(currentCtc: number, effectivePercent: number): ProjectionRow[]; // Year 0..3
  ```

- [ ] **Step 1: Write the failing tests**

Create `src/lib/hike-calculator.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { hikePercentFromNewCtc, newCtcFromHike, projectionRows, scenarioRows } from './hike-calculator';

describe('newCtcFromHike', () => {
  it('applies a percentage hike to the current CTC', () => {
    expect(newCtcFromHike(1000000, 7)).toBeCloseTo(1070000, 5);
  });

  it('returns the current CTC unchanged for a 0% hike', () => {
    expect(newCtcFromHike(500000, 0)).toBe(500000);
  });
});

describe('hikePercentFromNewCtc', () => {
  it('derives the hike percentage from current and new CTC', () => {
    expect(hikePercentFromNewCtc(600000, 720000)).toBeCloseTo(20, 5);
  });

  it('returns 0 when new CTC equals current CTC', () => {
    expect(hikePercentFromNewCtc(500000, 500000)).toBe(0);
  });
});

describe('scenarioRows', () => {
  it('returns effective-10, effective, effective+10 with their resulting new CTC', () => {
    const rows = scenarioRows(1000000, 30);
    expect(rows).toEqual([
      { percent: 20, newCtc: 1200000 },
      { percent: 30, newCtc: 1300000 },
      { percent: 40, newCtc: 1400000 }
    ]);
  });
});

describe('projectionRows', () => {
  it('compounds the same percentage across 4 rows (Year 0..3)', () => {
    const rows = projectionRows(1000000, 10);
    expect(rows).toEqual([
      { year: 0, ctc: 1000000 },
      { year: 1, ctc: 1100000 },
      { year: 2, ctc: 1210000 },
      { year: 3, ctc: 1331000 }
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- hike-calculator`
Expected: FAIL — `hike-calculator.ts` does not exist / exports not found.

- [ ] **Step 3: Write the implementation**

Create `src/lib/hike-calculator.ts`:

```ts
// ==============================|| HIKE CALCULATOR (pure) ||============================== //

// Formulas confirmed against https://razorpay.com/x/salary-hike-calculator/:
//   New CTC = Current CTC × (1 + Hike% / 100)
//   Hike % = (New CTC − Current CTC) / Current CTC × 100

const SCENARIO_STEP = 10;
const PROJECTION_YEARS = 3;

export function newCtcFromHike(currentCtc: number, hikePercent: number): number {
  return currentCtc * (1 + hikePercent / 100);
}

export function hikePercentFromNewCtc(currentCtc: number, newCtc: number): number {
  return ((newCtc - currentCtc) / currentCtc) * 100;
}

export interface ScenarioRow {
  percent: number;
  newCtc: number;
}

export function scenarioRows(currentCtc: number, effectivePercent: number): ScenarioRow[] {
  return [effectivePercent - SCENARIO_STEP, effectivePercent, effectivePercent + SCENARIO_STEP].map((percent) => ({
    percent,
    newCtc: newCtcFromHike(currentCtc, percent)
  }));
}

export interface ProjectionRow {
  year: number;
  ctc: number;
}

export function projectionRows(currentCtc: number, effectivePercent: number): ProjectionRow[] {
  const rows: ProjectionRow[] = [{ year: 0, ctc: currentCtc }];
  for (let year = 1; year <= PROJECTION_YEARS; year++) {
    rows.push({ year, ctc: newCtcFromHike(rows[year - 1].ctc, effectivePercent) });
  }
  return rows;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- hike-calculator`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/hike-calculator.ts src/lib/hike-calculator.test.ts
git commit -m "$(cat <<'EOF'
feat: add pure hike calculator formulas

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XLwsc7eUXQ7SZBmK23KTxK
EOF
)"
```

---

### Task 2: Nav — new "Tools" group

**Files:**
- Modify: `src/config/nav.ts`

**Interfaces:**
- Consumes: nothing new — `AppSidebar` (`src/components/layout/app-sidebar.tsx`) already iterates `navSections` generically via `SidebarGroupLabel`/`section.items.map`; no changes needed there.
- Produces: the route `/tools/hike-calculator` referenced by Task 3's page, and this nav entry is what makes it reachable.

- [ ] **Step 1: Add the `IconCalculator` import**

In `src/config/nav.ts`, add `IconCalculator` to the existing `@tabler/icons-react` import block (alphabetical, between `IconBug` and `IconCalendar`):

```ts
import {
  IconAccessible,
  IconArticle,
  IconBolt,
  IconBookmark,
  IconBookmarks,
  IconBrain,
  IconBrandAws,
  IconBrandChrome,
  IconBrandCss3,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandMongodb,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandRedux,
  IconBrandTypescript,
  IconBriefcase,
  IconBug,
  IconCalculator,
  IconCalendar,
  IconCards,
  IconChecklist,
  IconCode,
  IconCpu,
  IconDatabase,
  IconGauge,
  IconInfoCircle,
  IconKey,
  IconMessageQuestion,
  IconMicrophone,
  IconNotes,
  IconRobot,
  IconServer,
  IconSettings,
  IconShieldLock,
  IconTestPipe,
  IconWorld
} from '@tabler/icons-react';
```

- [ ] **Step 2: Remove the four moved items from `primaryNav`**

Replace the `primaryNav` array so it only keeps Dashboard, About, Articles, Settings:

```ts
export const primaryNav: NavLink[] = [
  { title: 'Dashboard', url: '/dashboard', icon: IconBrandChrome, tourKey: 'dashboard' },
  { title: 'About', url: '/about', icon: IconInfoCircle },
  { title: 'Articles', url: '/articles', icon: IconArticle, tourKey: 'articles' },
  { title: 'Settings', url: '/settings', icon: IconSettings }
];
```

- [ ] **Step 3: Add the "Tools" section as the first entry in `navSections`**

Insert this object as the *first* element of the `navSections` array (before the existing `study` section), keeping each moved item's original `icon`/`tourKey`:

```ts
export const navSections: NavSection[] = [
  {
    id: 'tools',
    title: 'Tools',
    icon: IconCalculator,
    items: [
      { title: 'Job Tracker', url: '/job-tracker', icon: IconBriefcase, tourKey: 'job-tracker' },
      { title: 'Planner', url: '/planner', icon: IconCalendar, tourKey: 'planner' },
      { title: 'Speak Up', url: '/speak-up', icon: IconMicrophone, tourKey: 'speak-up' },
      { title: 'Mock Interview', url: '/mock-interview', icon: IconMessageQuestion, tourKey: 'mock-interview' },
      { title: 'Hike Calculator', url: '/tools/hike-calculator', icon: IconCalculator }
    ]
  },
  {
    id: 'study',
    title: 'Study & Review',
    icon: IconBookmarks,
    items: [
      { title: 'Flashcards', url: '/flashcards', icon: IconCards, tourKey: 'flashcards' },
      { title: 'Quiz', url: '/quiz', icon: IconChecklist, tourKey: 'quiz' },
      { title: 'Saved', url: '/bookmarks', icon: IconBookmark, tourKey: 'saved' },
      { title: 'Review', url: '/review', icon: IconBrain, tourKey: 'review' }
    ]
  },
  // ...rest of navSections unchanged (html-css, javascript, react, redux, nextjs, nodejs, databases, aws, testing, web, engineering)
```

(Leave every section from `html-css` onward exactly as-is — only the new `tools` object is inserted before `study`.)

- [ ] **Step 4: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 5: Verify the existing nav test still passes**

Run: `pnpm test -- topic-access`
Expected: PASS — `topic-access.test.ts` iterates `navSections` items with a `topic` field only; none of the five moved/added Tools items set `topic`, so this test is unaffected.

- [ ] **Step 6: Commit**

```bash
git add src/config/nav.ts
git commit -m "$(cat <<'EOF'
feat: group Job Tracker, Speak Up, Mock Interview, Planner into a Tools nav section

Adds the Hike Calculator entry to the same group ahead of its page landing in the next commit.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XLwsc7eUXQ7SZBmK23KTxK
EOF
)"
```

---

### Task 3: Hike calculator UI

**Files:**
- Create: `src/app/(app)/tools/hike-calculator/page.tsx`
- Create: `src/components/hike-calculator/hike-calculator.tsx`

**Interfaces:**
- Consumes from Task 1: `newCtcFromHike(currentCtc: number, hikePercent: number): number`, `hikePercentFromNewCtc(currentCtc: number, newCtc: number): number`, `scenarioRows(currentCtc: number, effectivePercent: number): ScenarioRow[]`, `projectionRows(currentCtc: number, effectivePercent: number): ProjectionRow[]` — all from `@/lib/hike-calculator`.
- Consumes existing UI primitives: `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` from `@/components/ui/tabs`, `Input` from `@/components/ui/input`, `Label` from `@/components/ui/label`, `InputGroup`/`InputGroupAddon`/`InputGroupInput`/`InputGroupText` from `@/components/ui/input-group`, `Card`/`CardHeader`/`CardTitle`/`CardContent` from `@/components/ui/card`.
- Produces: the `/tools/hike-calculator` route that Task 2's nav entry links to.

- [ ] **Step 1: Create the page**

Create `src/app/(app)/tools/hike-calculator/page.tsx`:

```tsx
import HikeCalculator from '@/components/hike-calculator/hike-calculator';

export const metadata = { title: 'Hike Calculator | QuickRecall' };

export default function Page() {
  return <HikeCalculator />;
}
```

- [ ] **Step 2: Create the client component**

Create `src/components/hike-calculator/hike-calculator.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hikePercentFromNewCtc, newCtcFromHike, projectionRows, scenarioRows } from '@/lib/hike-calculator';

// ─── Formatting ─────────────────────────────────────────────────────────────

function formatCtc(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function parseNumberInput(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

// ─── Results block (shared by both tabs) ───────────────────────────────────

function ResultsBlock({ currentCtc, newCtc, effectivePercent }: { currentCtc: number; newCtc: number; effectivePercent: number }) {
  const increase = newCtc - currentCtc;
  const scenarios = scenarioRows(currentCtc, effectivePercent);
  const projections = projectionRows(currentCtc, effectivePercent);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current CTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCtc(currentCtc)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">New CTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatCtc(newCtc)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              +{formatCtc(increase)} ({formatPercent(effectivePercent)})
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Nearby scenarios</h3>
        <table className="w-full border-collapse overflow-hidden rounded-lg border text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="px-3 py-2 font-medium">Hike %</th>
              <th className="px-3 py-2 font-medium">New CTC</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((row) => (
              <tr key={row.percent} className={row.percent === effectivePercent ? 'bg-primary/5 font-medium' : 'border-t'}>
                <td className="px-3 py-2">{formatPercent(row.percent)}</td>
                <td className="px-3 py-2">{formatCtc(row.newCtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">3-year projection</h3>
        <table className="w-full border-collapse overflow-hidden rounded-lg border text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="px-3 py-2 font-medium">Year</th>
              <th className="px-3 py-2 font-medium">CTC</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((row) => (
              <tr key={row.year} className={row.year === 0 ? '' : 'border-t'}>
                <td className="px-3 py-2">{row.year === 0 ? 'Now' : `Year ${row.year}`}</td>
                <td className="px-3 py-2">{formatCtc(row.ctc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 1: Find New CTC ────────────────────────────────────────────────────

function FindNewCtcTab() {
  const [currentCtcRaw, setCurrentCtcRaw] = useState('');
  const [hikePercentRaw, setHikePercentRaw] = useState('');

  const currentCtc = parseNumberInput(currentCtcRaw);
  const hikePercent = parseNumberInput(hikePercentRaw);
  const canCompute = currentCtc !== null && currentCtc > 0 && hikePercent !== null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="current-ctc-1">Current CTC</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>₹</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="current-ctc-1" type="number" min={0} value={currentCtcRaw} onChange={(e) => setCurrentCtcRaw(e.target.value)} />
          </InputGroup>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hike-percent">Hike %</Label>
          <Input id="hike-percent" type="number" value={hikePercentRaw} onChange={(e) => setHikePercentRaw(e.target.value)} />
        </div>
      </div>

      {canCompute && (
        <ResultsBlock currentCtc={currentCtc} newCtc={newCtcFromHike(currentCtc, hikePercent)} effectivePercent={hikePercent} />
      )}
    </div>
  );
}

// ─── Tab 2: Find Hike % ─────────────────────────────────────────────────────

function FindHikePercentTab() {
  const [currentCtcRaw, setCurrentCtcRaw] = useState('');
  const [newCtcRaw, setNewCtcRaw] = useState('');

  const currentCtc = parseNumberInput(currentCtcRaw);
  const newCtc = parseNumberInput(newCtcRaw);
  const canCompute = currentCtc !== null && currentCtc > 0 && newCtc !== null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="current-ctc-2">Current CTC</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>₹</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="current-ctc-2" type="number" min={0} value={currentCtcRaw} onChange={(e) => setCurrentCtcRaw(e.target.value)} />
          </InputGroup>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-ctc">New CTC</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>₹</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="new-ctc" type="number" min={0} value={newCtcRaw} onChange={(e) => setNewCtcRaw(e.target.value)} />
          </InputGroup>
        </div>
      </div>

      {canCompute && (
        <ResultsBlock currentCtc={currentCtc} newCtc={newCtc} effectivePercent={hikePercentFromNewCtc(currentCtc, newCtc)} />
      )}
    </div>
  );
}

// ==============================|| HIKE CALCULATOR ||============================== //

export default function HikeCalculator() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Hike Calculator</h1>
        <p className="mt-1 text-muted-foreground">Work out your new CTC from a hike percentage, or the hike percentage behind an offer.</p>
      </div>

      <Tabs defaultValue="new-ctc">
        <TabsList>
          <TabsTrigger value="new-ctc">Find New CTC</TabsTrigger>
          <TabsTrigger value="hike-percent">Find Hike %</TabsTrigger>
        </TabsList>
        <TabsContent value="new-ctc">
          <FindNewCtcTab />
        </TabsContent>
        <TabsContent value="hike-percent">
          <FindHikePercentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors. Fix any Biome formatting complaints with `pnpm format` if needed.

- [ ] **Step 4: Manual verification in the dev server**

Run: `pnpm dev`

Then navigate to `/tools/hike-calculator` and verify:
- Sidebar shows a "Tools" group containing Job Tracker, Planner, Speak Up, Mock Interview, Hike Calculator.
- **Find New CTC** tab: entering Current CTC `1000000` and Hike % `30` shows New CTC `₹13,00,000`, increase `+₹3,00,000 (30.0%)`, scenario rows `20.0% → ₹12,00,000`, `30.0% → ₹13,00,000` (highlighted), `40.0% → ₹14,00,000`, and projection `Now ₹10,00,000 / Year 1 ₹13,00,000 / Year 2 ₹16,90,000 / Year 3 ₹21,97,000`.
- **Find Hike %** tab: entering Current CTC `600000` and New CTC `720000` shows Hike % `20.0%` and the same result blocks.
- Leaving either input blank hides the results block instead of throwing/showing `NaN`.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(app\)/tools/hike-calculator/page.tsx src/components/hike-calculator/hike-calculator.tsx
git commit -m "$(cat <<'EOF'
feat: add hike calculator UI

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XLwsc7eUXQ7SZBmK23KTxK
EOF
)"
```

---

## Post-plan check

- [ ] Run the full suite once more: `pnpm typecheck && pnpm lint && pnpm test`
- [ ] Confirm `pnpm build` succeeds (new route must not break the production build).
