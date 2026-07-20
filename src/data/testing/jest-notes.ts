import type { Note } from '@/types/content';

// ─── Jest — still the incumbent: the documented default for Next.js's own testing
// docs, Create React App, and most existing enterprise codebases. Notes here focus
// on what's actually Jest-specific rather than repeating Vitest's near-identical API. ─

export const jestNotes: Note[] = [
  {
    id: 'jest-why-still-used',
    title: 'Why Jest Is Still Around',
    summary:
      "Jest predates Vitest by years, has the largest ecosystem of any JS test runner, and remains the officially documented default for Next.js's `next/jest` integration.",
    difficulty: 'basic',
    category: 'Jest',
    prerequisites: ['test-fund-choosing-a-stack', 'vitest-why-vitest'],
    keyPoints: [
      'Massive install base: Create React App projects, most pre-2023 Next.js apps, and a large share of enterprise codebases were built on Jest before Vitest existed as an option.',
      '`next/jest` is a zero-config Jest transform Next.js ships itself — official documentation still leads with Jest, even as Vitest support has been added alongside it.',
      "Ecosystem maturity: more Stack Overflow answers, more battle-tested plugins, more engineers who already know its quirks — real factors in an enterprise team's tooling choice, not just inertia.",
      'The realistic 2026 framing for an interview: "Jest is not dead, it\'s the safe incumbent choice for teams already invested in it or using tools that assume it; Vitest is the default recommendation for anything greenfield on Vite."'
    ]
  },
  {
    id: 'jest-vs-vitest-differences',
    title: "What's Actually Different from Vitest",
    summary:
      'The test-writing API is nearly identical — the real differences are in transform pipeline, config complexity, and startup/watch performance.',
    difficulty: 'intermediate',
    category: 'Jest',
    prerequisites: ['jest-why-still-used'],
    keyPoints: [
      "Transform pipeline: Jest needs `babel-jest` or `ts-jest` to handle TypeScript/JSX — an extra moving part (and common source of config bugs) that Vitest avoids by reusing esbuild/Vite's existing transform.",
      "Startup and watch-mode speed: Vitest is consistently faster in benchmarks, mainly because of that lighter transform pipeline and Vite's dependency pre-bundling — Jest's gap grows with project size.",
      "ESM support: Jest's ESM support has historically required extra flags/config (`--experimental-vm-modules`) and still trips people up; Vitest is ESM-native from the start.",
      'API surface: `jest.fn()`/`vi.fn()`, `jest.mock()`/`vi.mock()`, `jest.spyOn()`/`vi.spyOn()` — nearly 1:1 naming, which is exactly why migrating an existing Jest suite to Vitest is usually a mostly-mechanical find-and-replace.',
      "A globally-available `jest` object (vs Vitest requiring `import { vi } from 'vitest'` unless `globals: true` is set) is one of the few day-to-day ergonomic differences developers actually notice."
    ]
  },
  {
    id: 'jest-mocking',
    title: 'jest.fn(), jest.mock(), jest.spyOn()',
    summary:
      'Same three-tool mocking toolkit as Vitest, under different names — a standalone mock function, whole-module mocking, and wrapping an existing method.',
    difficulty: 'intermediate',
    category: 'Jest',
    prerequisites: ['jest-vs-vitest-differences', 'test-fund-mocking-strategies'],
    keyPoints: [
      '`jest.fn()` creates a mock function — `jest.fn(() => 42)` gives it a default implementation.',
      "`jest.mock('./api')` auto-mocks an entire module (every export becomes a `jest.fn()`); `jest.mock('./api', () => ({ getUser: jest.fn() }))` supplies a specific implementation.",
      "`jest.spyOn(object, 'method')` wraps one method on a real object; call `.mockRestore()` afterward (or configure `restoreMocks: true` globally in Jest config) to avoid leaking the mock into other tests.",
      "Module mocks are HOISTED to the top of the file automatically by Jest's babel transform — this is why `jest.mock()` calls work even when written after imports, a frequent source of confusion for newcomers.",
      'Same guidance as everywhere else in this section: mock at the boundary (network, DB, time), not the logic under test itself.'
    ],
    codeSnippet: `jest.mock('./api');
import { getUser } from './api';

test('shows the user name', async () => {
  (getUser as jest.Mock).mockResolvedValue({ name: 'Ada' });
  render(<Profile userId={1} />);
  expect(await screen.findByText('Ada')).toBeInTheDocument();
});`
  },
  {
    id: 'jest-snapshot-testing',
    title: 'Snapshot Testing',
    summary:
      "Jest renders a component (or serializes any value) to a text file on first run, then fails future runs if the output changes unexpectedly — Jest's signature feature.",
    difficulty: 'intermediate',
    category: 'Jest',
    prerequisites: ['jest-mocking'],
    keyPoints: [
      '`expect(tree).toMatchSnapshot()` writes a `.snap` file the first time it runs; subsequent runs diff against that saved snapshot and fail on any difference.',
      "Genuinely useful for catching UNINTENTIONAL changes to a component's output — but a failing snapshot doesn't tell you whether the change is a bug or an intentional update, only that something changed.",
      '`jest --ci` fails on any snapshot that would be newly WRITTEN rather than compared — prevents a CI run from silently accepting a first-time snapshot that should have been reviewed locally.',
      '`toMatchInlineSnapshot()` writes the snapshot directly into the test file instead of a separate `.snap` file — easier to review in a PR diff since the expected value sits right next to the assertion.',
      'Large, whole-component snapshots are the most-criticized form — they tend to churn on unrelated changes and get rubber-stamped with `--updateSnapshot` without real review. Smaller, targeted snapshots (a specific computed value, not an entire render tree) age much better.'
    ],
    gotcha:
      'A team that runs `jest -u` on every failing snapshot without reading the diff has turned snapshot testing into a no-op — the test technically exists but no longer catches anything, since every change just gets auto-accepted.',
    codeSnippet: `test('renders correctly', () => {
  const { container } = render(<Badge status="active" />);
  expect(container).toMatchSnapshot();
});
// First run writes __snapshots__/Badge.test.tsx.snap
// Later runs fail if the rendered output changes`
  },
  {
    id: 'jest-fake-timers',
    title: 'Fake Timers in Jest',
    summary:
      "`jest.useFakeTimers()` and `jest.advanceTimersByTime()` — same concept and largely the same API shape as Vitest's fake timers.",
    difficulty: 'intermediate',
    category: 'Jest',
    prerequisites: ['jest-mocking'],
    keyPoints: [
      '`jest.useFakeTimers()` swaps out real timers; `jest.advanceTimersByTime(ms)` fast-forwards them synchronously without actually waiting.',
      'Modern Jest defaults to the "modern" fake timer implementation (based on `@sinonjs/fake-timers`), which also fakes `Date`, `performance.now()`, and `requestAnimationFrame` — the legacy implementation only faked `setTimeout`/`setInterval`.',
      '`jest.runAllTimers()` runs every pending timer to completion instantly — useful for "flush everything" scenarios, but dangerous with a `setInterval` that would otherwise never stop (it can hang the test).',
      "Always pair `useFakeTimers()` with `jest.useRealTimers()` in an `afterEach` — the same leakage risk as Vitest's equivalent."
    ]
  },
  {
    id: 'jest-coverage-config',
    title: 'Coverage & Config Complexity',
    summary:
      "Jest's coverage is Istanbul-based and configured via `collectCoverageFrom`/`coverageThreshold` in `jest.config.js` — more moving parts than Vitest's V8-native coverage, and a common source of setup friction.",
    difficulty: 'intermediate',
    category: 'Jest',
    prerequisites: ['jest-vs-vitest-differences', 'test-stlc'],
    keyPoints: [
      "`collectCoverageFrom: ['src/**/*.{ts,tsx}']` defines what counts toward coverage (including untested files, which is easy to forget and skews numbers optimistically if omitted).",
      '`coverageThreshold: { global: { lines: 80, branches: 75 } }` fails the run below the bar — the same CI-gate pattern used with Vitest.',
      "The transform config (`transform`, `moduleNameMapper` for path aliases and CSS/asset imports, `testEnvironment`) is where most real-world Jest setup pain lives — this is the concrete config surface Vitest collapses by reusing Vite's own resolution and transform pipeline.",
      '`next/jest` exists specifically to paper over this complexity for Next.js projects — it auto-configures the SWC transform, CSS/image mocking, and env var loading that would otherwise be hand-rolled.'
    ],
    codeSnippet: `// next/jest — zero-config Jest setup for Next.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEach: ['<rootDir>/jest.setup.ts']
});`
  }
];
