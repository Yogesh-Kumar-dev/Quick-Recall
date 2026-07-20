import type { Note } from '@/types/content';

// ─── Vitest — the Vite-native test runner that's become the default for new React
// and Next.js projects, with a Jest-compatible API. ─────────────────────────────

export const vitestNotes: Note[] = [
  {
    id: 'vitest-why-vitest',
    title: 'Why Vitest? (and why it beat Jest for new projects)',
    summary:
      "Vitest reuses your existing Vite config, starts near-instantly, and speaks Jest's API almost 1:1 — the main reasons it became the default for new Vite/React projects.",
    difficulty: 'basic',
    category: 'Vitest',
    prerequisites: ['test-fund-choosing-a-stack'],
    keyPoints: [
      "Shares your app's Vite config (aliases, plugins, TypeScript/JSX transforms) instead of needing a separate Babel/ts-jest pipeline — one less config to keep in sync.",
      "Uses esbuild for transforms, so cold starts and watch-mode re-runs are dramatically faster than Jest's Babel-based pipeline, especially as a suite grows.",
      'API-compatible with Jest by design: `describe`, `it`/`test`, `expect`, and most matchers work unchanged — most Jest test files run under Vitest with only import changes.',
      'Native ESM and TypeScript support out of the box — no `ts-jest` or `babel-jest` transform configuration needed.',
      'Ships its own assertion library extensions (`expect.extend`), snapshot testing, and a built-in UI (`vitest --ui`) for browsing test results.'
    ],
    gotcha:
      'Vitest isn\'t strictly "faster Jest" for every project — a codebase not already using Vite (e.g. an older Next.js app on webpack, or a plain Node service) gets less of the shared-config benefit, which is part of why Jest remains the documented default in some of those setups.'
  },
  {
    id: 'vitest-setup',
    title: 'Setting Up Vitest',
    summary:
      'A `vitest.config.ts` (or a `test` block in `vite.config.ts`) plus a setup file for global matchers/mocks is the whole configuration surface for most projects.',
    difficulty: 'basic',
    category: 'Vitest',
    prerequisites: ['vitest-why-vitest'],
    keyPoints: [
      "`environment: 'jsdom'` (or `happy-dom`) is required for anything that renders components — Vitest's default Node environment has no DOM.",
      'A `setupFiles` entry runs before every test file — the standard place to import `@testing-library/jest-dom` matchers and register global mocks/cleanup.',
      '`globals: true` makes `describe`/`it`/`expect` available without importing them in every file (optional — some teams prefer explicit imports for clarity).',
      'For a project already using Vite, Vitest config can live inside `vite.config.ts` itself under a `test` key, sharing every existing alias and plugin automatically.'
    ],
    codeSnippet: `// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
});

// src/test/setup.ts
import '@testing-library/jest-dom/vitest';`
  },
  {
    id: 'vitest-matchers',
    title: 'Matchers & Assertions',
    summary:
      '`expect(value).matcher()` — the same Jest-flavored assertion style, extended with DOM-specific matchers from `@testing-library/jest-dom`.',
    difficulty: 'basic',
    category: 'Vitest',
    prerequisites: ['vitest-setup'],
    keyPoints: [
      'Core matchers: `toBe` (===), `toEqual` (deep equality), `toContain`, `toThrow`, `toHaveLength`.',
      'DOM matchers from `@testing-library/jest-dom` (registered in setup): `toBeInTheDocument`, `toBeVisible`, `toHaveTextContent`, `toBeDisabled`, `toHaveClass` — these make component assertions read naturally instead of poking at raw DOM properties.',
      "`expect.extend({...})` adds custom matchers project-wide when the built-ins don't fit a domain-specific assertion.",
      'Async assertions: `await expect(promise).rejects.toThrow()` for rejected promises, paired with `async`/`await` test functions.'
    ],
    codeSnippet: `expect(sum(2, 3)).toBe(5);
expect(user).toEqual({ id: 1, name: 'Ada' });
expect(screen.getByRole('button')).toBeDisabled();
await expect(fetchUser(-1)).rejects.toThrow('Invalid id');`
  },
  {
    id: 'vitest-mock-functions',
    title: 'Mock Functions: vi.fn() and vi.spyOn()',
    summary:
      '`vi.fn()` creates a brand-new mock function; `vi.spyOn()` wraps an EXISTING method so you can observe or override it while (optionally) still calling through.',
    difficulty: 'intermediate',
    category: 'Vitest',
    prerequisites: ['vitest-matchers', 'test-fund-mocking-strategies'],
    keyPoints: [
      '`vi.fn()` — a standalone mock, useful as a callback prop (`onSave={vi.fn()}`) to assert it was called correctly.',
      "`vi.spyOn(object, 'method')` — replaces one method on a real object while keeping the rest of the object real; `.mockRestore()` puts the original back after the test.",
      'Assertions: `toHaveBeenCalled()`, `toHaveBeenCalledWith(...)`, `toHaveBeenCalledTimes(n)`, `toHaveBeenLastCalledWith(...)`.',
      "Return-value control: `mockReturnValue(x)` (sync), `mockResolvedValue(x)` / `mockRejectedValue(err)` (async) — the standard way to fake an API call's outcome without touching the network.",
      "`vi.mock('./module')` hoists a mock for an entire module — powerful, but couples the test to the module's shape (see the mocking-strategies note on when to prefer network-level mocking instead)."
    ],
    gotcha:
      'Forgetting `mockRestore()` (or a global `afterEach(() => vi.restoreAllMocks())`) after `vi.spyOn` leaks the mock into the next test — a classic source of tests that only fail when run in a certain order.',
    codeSnippet: `const onSave = vi.fn();
render(<Form onSave={onSave} />);
await userEvent.click(screen.getByRole('button', { name: /save/i }));
expect(onSave).toHaveBeenCalledWith({ title: 'Draft' });

const spy = vi.spyOn(api, 'getUser').mockResolvedValue({ id: 1 });
// ...
spy.mockRestore();`
  },
  {
    id: 'vitest-fake-timers',
    title: 'Fake Timers',
    summary:
      '`vi.useFakeTimers()` freezes real time so `setTimeout`/`setInterval`/`Date` can be advanced instantly and deterministically inside a test.',
    difficulty: 'intermediate',
    category: 'Vitest',
    prerequisites: ['vitest-mock-functions'],
    keyPoints: [
      '`vi.useFakeTimers()` replaces the global timer functions; `vi.advanceTimersByTime(ms)` fast-forwards them without actually waiting.',
      'Essential for testing debounce/throttle logic, polling, or a "session expires after 15 minutes" flow — without fake timers, the test would need to actually wait that long.',
      "`vi.useRealTimers()` restores normal behavior — always pair it with `useFakeTimers()` (typically in `afterEach`) so fake time doesn't leak into unrelated tests.",
      '`vi.setSystemTime(date)` pins `Date.now()`/`new Date()` to a fixed point — useful for testing anything that branches on "today\'s date".'
    ],
    codeSnippet: `beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('debounces the search input', () => {
  const onSearch = vi.fn();
  render(<SearchBox onSearch={onSearch} delayMs={300} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });
  expect(onSearch).not.toHaveBeenCalled();
  vi.advanceTimersByTime(300);
  expect(onSearch).toHaveBeenCalledWith('a');
});`
  },
  {
    id: 'vitest-mocking-fetch',
    title: 'Mocking fetch (and why MSW is usually better)',
    summary:
      "`vi.stubGlobal('fetch', vi.fn())` works for a quick one-off, but MSW is the standard choice once more than one or two tests need network mocking.",
    difficulty: 'intermediate',
    category: 'Vitest',
    prerequisites: ['vitest-mock-functions'],
    keyPoints: [
      "`vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => data }))` fakes a single fetch call directly — fine for a quick, isolated test.",
      'This approach breaks down fast: every test needs its own careful mock of the exact shape `fetch` returns, and it stops working if the code switches to `axios` or another HTTP client.',
      'MSW instead intercepts at the network layer, so ANY HTTP client works unchanged, and the same mock handlers are reusable across many test files (see the MSW section).',
      "Rule of thumb: `vi.fn()`-based fetch mocking for a single quick test; MSW once you're mocking the same endpoint in more than one place."
    ],
    codeSnippet: `// Quick one-off (fine for a single test)
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ id: 1, name: 'Ada' })
}));`
  },
  {
    id: 'vitest-coverage',
    title: 'Code Coverage in Vitest',
    summary:
      "Vitest uses V8's native coverage engine (`@vitest/coverage-v8`) by default — fast, no instrumentation step, run via `vitest run --coverage`.",
    difficulty: 'basic',
    category: 'Vitest',
    prerequisites: ['vitest-setup', 'test-stlc'],
    keyPoints: [
      'V8 coverage reads coverage data directly from the V8 engine itself — no separate instrumented build step, unlike Istanbul-based coverage in classic Jest setups.',
      "`coverage: { provider: 'v8', thresholds: { lines: 80, branches: 75 } }` in config fails the run if coverage drops below a bar — often wired into CI as a merge gate.",
      "Coverage reports (line/branch/function/statement %) show WHAT ran, not whether the assertions were meaningful — see the STLC/coverage-metrics note for why 100% coverage isn't the goal by itself.",
      '`/* v8 ignore next */` (or the Istanbul-style equivalent) excludes specific lines (like an unreachable error branch) from skewing the coverage percentage.'
    ]
  },
  {
    id: 'vitest-testing-route-handlers',
    title: 'Unit Testing Next.js Route Handlers',
    summary:
      'A Route Handler is just an exported async function — import it directly and call it with a `Request`, no server needed, no HTTP round trip.',
    difficulty: 'intermediate',
    category: 'Vitest',
    prerequisites: ['vitest-mocking-fetch'],
    keyPoints: [
      'Next.js Route Handlers (`app/api/users/route.ts`) export plain functions (`GET`, `POST`, ...) — Vitest can import and call them directly like any other function.',
      "Construct a `Request` object (or use `next/server`'s `NextRequest`) as the argument, then assert on the returned `Response`'s status and JSON body.",
      "This is a unit test of the handler's logic — it does NOT start a real server or exercise Next.js routing itself; that's what Playwright's E2E tests are for.",
      'Any database/service calls inside the handler still need mocking (via `vi.mock` on the module, or MSW if the handler itself calls out to another HTTP API).'
    ],
    codeSnippet: `import { GET } from '@/app/api/users/[id]/route';
import { NextRequest } from 'next/server';

test('returns 404 for a missing user', async () => {
  const req = new NextRequest('http://localhost/api/users/999');
  const res = await GET(req, { params: { id: '999' } });
  expect(res.status).toBe(404);
});`
  }
];
