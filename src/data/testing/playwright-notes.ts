import type { Note } from '@/types/content';

// ─── Playwright — the default E2E framework for new React/Next.js projects in
// 2026: cross-browser, auto-waiting, and Vercel/Next.js's own documented pick. ──

export const playwrightNotes: Note[] = [
  {
    id: 'pw-why-playwright',
    title: 'Why Playwright Is Winning New Projects',
    summary:
      "True cross-browser support (including WebKit/Safari), auto-waiting that eliminates most flakiness, multi-tab/multi-origin support Cypress lacks, and it's Vercel's own documented E2E recommendation for Next.js.",
    difficulty: 'basic',
    category: 'Playwright',
    prerequisites: ['test-fund-choosing-a-stack'],
    keyPoints: [
      "Built by Microsoft, ships drivers for Chromium, Firefox, AND WebKit (Safari's engine) from one API — Cypress historically ran in Chromium-family browsers only, with Firefox/WebKit support added later and less complete.",
      'Auto-waiting: every action (`click`, `fill`, ...) automatically waits for the element to be visible, stable, and actionable before acting — this eliminates the majority of the manual `sleep`/arbitrary-wait flakiness that plagued older tools like Selenium.',
      "True multi-tab and multi-origin support: a test can open a new tab, switch between them, and interact with a page on a completely different origin (e.g. an OAuth consent screen on a different domain) — Cypress's architecture (running tests inside the browser itself) makes this hard.",
      'Parallelism is a first-class feature (built-in worker-based parallel execution across files) rather than something bolted on or requiring a paid cloud service — a real cost/speed factor at scale.',
      "Next.js's own documentation recommends Playwright for E2E testing — for a Next.js-heavy job market, that endorsement alone drives significant adoption."
    ]
  },
  {
    id: 'pw-vs-cypress-vs-selenium',
    title: 'Playwright vs Cypress vs Selenium',
    summary:
      'Selenium is the aging, still-widely-deployed original; Cypress was the DX-focused upgrade that dominated the 2018-2022 era; Playwright is the current default for new projects, but Cypress remains common in codebases that adopted it before Playwright matured.',
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-why-playwright'],
    keyPoints: [
      'Selenium: the original, protocol-based (WebDriver) cross-browser tool — genuinely cross-browser and cross-language, but verbose, historically flaky without careful explicit waits, and slower than the newer tools. Still common in older enterprise QA suites.',
      'Cypress: introduced a much better developer experience (real-time reloading, time-travel debugging, automatic retries on assertions) and became the standard for React apps roughly 2018-2022 — runs INSIDE the browser alongside your app, which is both its strength (deep DOM access) and its limitation (no true multi-tab, historically single-origin per test).',
      "Playwright: takes Cypress's DX improvements (auto-waiting, great debugging tools) and adds what Cypress structurally can't easily offer — real multi-browser coverage, multi-tab/multi-origin, and a browser-automation architecture (driving the browser externally via CDP/WebDriver-BiDi) rather than running inside it.",
      '"Knowing Cypress is still useful" — many companies with existing Cypress suites haven\'t migrated and won\'t for a while (rewriting a large E2E suite is a real cost); expect Cypress questions in interviews at those companies even as Playwright wins new adoption.',
      'A fair interview answer: "Playwright is my default for new work because of true cross-browser support and better parallelism; Cypress still has a great DX and huge install base, so I\'d work with it comfortably on an existing suite."'
    ]
  },
  {
    id: 'pw-locators',
    title: 'Locators',
    summary:
      "A `Locator` describes HOW to find an element, lazily — it doesn't query the DOM until an action or assertion actually runs, which is what makes auto-waiting and auto-retrying possible.",
    difficulty: 'basic',
    category: 'Playwright',
    prerequisites: ['pw-why-playwright'],
    keyPoints: [
      "Preferred locators mirror RTL's query philosophy: `page.getByRole('button', { name: 'Submit' })`, `getByLabel`, `getByPlaceholder`, `getByText` — resilient to markup changes since they target how a user perceives the page.",
      "`page.locator('.css-selector')` and `page.locator('xpath=...')` exist as an escape hatch but are the LAST choice — they break on styling/structure changes that have nothing to do with actual behavior.",
      'Locators are lazy and re-queried on every action — this is fundamentally different from grabbing a DOM element reference once (as older tools did), and is why a Playwright locator naturally "waits" for an element that appears after some async work, without extra code.',
      "Chaining and filtering: `page.getByRole('listitem').filter({ hasText: 'Milk' }).getByRole('button', { name: 'Remove' })` narrows down to a specific item in a list before acting on a button within it — essential for lists of similar rows.",
      '`.first()`, `.last()`, `.nth(n)` disambiguate when a locator legitimately matches multiple elements and you want a specific one, though `getByRole` with a precise `name` usually avoids needing this.'
    ],
    codeSnippet: `await page.getByLabel('Email').fill('ada@example.com');
await page.getByRole('button', { name: 'Log in' }).click();

// Scoped to one row in a list
const row = page.getByRole('row', { name: /Widget/ });
await row.getByRole('button', { name: 'Delete' }).click();`
  },
  {
    id: 'pw-assertions',
    title: 'Web-First Assertions',
    summary:
      "`expect(locator).toBeVisible()` — Playwright's assertions are built to auto-retry against a locator until the condition is true or a timeout is reached, not a single synchronous check.",
    difficulty: 'basic',
    category: 'Playwright',
    prerequisites: ['pw-locators'],
    keyPoints: [
      "`await expect(page.getByText('Saved')).toBeVisible()` retries for up to the configured timeout (default 5s) — no manual `waitFor` needed, unlike a plain `if (element) {...}` check that would run exactly once.",
      "Common assertions: `toBeVisible`, `toBeEnabled`/`toBeDisabled`, `toHaveText`, `toHaveValue`, `toHaveCount` (for a list's length), `toHaveURL`, `toHaveTitle`.",
      "Negated assertions retry too: `await expect(locator).not.toBeVisible()` correctly waits for an element to DISAPPEAR rather than failing immediately if it's still visible at the instant the check runs.",
      'Non-retrying assertions exist for values already resolved by an earlier `await` (e.g. `expect(await locator.textContent()).toBe(...)`) — but the retrying `expect(locator).toHaveText(...)` form is almost always preferable since it tolerates timing.'
    ],
    codeSnippet: `await expect(page).toHaveURL('/dashboard');
await expect(page.getByRole('alert')).toHaveText('Profile updated');
await expect(page.getByRole('listitem')).toHaveCount(3);`
  },
  {
    id: 'pw-fixtures',
    title: 'Fixtures',
    summary:
      'A fixture provides setup/teardown for a test — `page`, `context`, and `browser` are built-in fixtures, and custom fixtures compose reusable test dependencies (like a logged-in page, or a seeded API client).',
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-assertions'],
    keyPoints: [
      'Every test automatically receives a fresh `page` fixture (and the `context`/`browser` it lives in) — Playwright creates and tears these down per test, so tests are isolated by default without manual setup.',
      '`test.extend({ ... })` defines a custom fixture — e.g. an `authenticatedPage` fixture that logs in once and yields an already-authenticated `page`, so every test using it skips repeating that setup.',
      'Fixtures can depend on other fixtures and are lazily instantiated — only created if a test actually uses them, keeping unrelated tests fast.',
      "This is Playwright's answer to shared setup/teardown boilerplate — cleaner than repeating a `beforeEach` login flow in every test file, and composable across a whole test suite."
    ],
    codeSnippet: `// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await use(page);
  }
});

// some.spec.ts
test('shows the dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.getByRole('heading')).toHaveText('Dashboard');
});`
  },
  {
    id: 'pw-page-object-model',
    title: 'The Page Object Model',
    summary:
      "A class that wraps a page's locators and actions behind readable methods (`loginPage.login(email, pw)`) — keeps tests readable and centralizes selector maintenance to one place.",
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-fixtures'],
    keyPoints: [
      'A `LoginPage` class exposes locators as properties and interactions as methods (`async login(email, password) { ... }`) — the test itself reads like a script of user actions, not a list of raw selectors.',
      "When a selector needs to change (a `data-testid` renamed, a role changed), there's exactly one place to fix it — every test using that Page Object automatically picks up the fix.",
      'Page Objects compose naturally with custom fixtures: a fixture can construct and yield a Page Object instance instead of a raw `page`, giving every test typed, readable access to page-specific actions.',
      'Not mandatory for small suites — for a handful of simple tests, inlined locators are often clearer; POM earns its complexity once several tests repeat the same multi-step interactions against the same page.'
    ],
    codeSnippet: `class LoginPage {
  constructor(private page: Page) {}
  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }
}

test('logs in successfully', async ({ page }) => {
  await page.goto('/login');
  await new LoginPage(page).login('ada@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});`
  },
  {
    id: 'pw-auth-reuse',
    title: 'Authentication Reuse with storageState',
    summary:
      'Log in ONCE in a setup project, save the resulting cookies/localStorage to a file, and every other test loads that saved state instead of re-running the login flow — dramatically faster suites.',
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-fixtures'],
    keyPoints: [
      "`context.storageState({ path: 'auth.json' })` after a successful login dumps cookies and localStorage to a file; `test.use({ storageState: 'auth.json' })` loads it for a whole test file (or project) — no per-test login needed.",
      'The standard pattern: a dedicated `setup` project (configured in `playwright.config.ts`) runs once, performs the login, and saves state; all other projects declare a dependency on `setup` and reuse its output.',
      'Massive time savings at scale — logging in through the UI for every single test (dozens or hundreds of times) is one of the biggest sources of slow E2E suites; doing it once amortizes that cost.',
      'Different roles (admin vs regular user) get separate saved states — multiple setup projects, or multiple storageState files, one per role that needs distinct auth.',
      'Token expiry matters: a saved storageState with a short-lived session can go stale mid-suite — either use long-lived test credentials/tokens, or refresh the saved state periodically in CI.'
    ]
  },
  {
    id: 'pw-parallel-execution',
    title: 'Parallel Execution & Workers',
    summary:
      "Playwright runs test FILES in parallel across multiple worker processes by default — each worker gets its own isolated browser context, so tests don't interfere with each other.",
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-fixtures'],
    keyPoints: [
      '`workers: N` in config (or `--workers=N` on the CLI) controls how many test files run concurrently — defaults to a number based on available CPU cores.',
      "Tests WITHIN a single file run sequentially by default; `test.describe.parallel(...)` opts a group of tests within a file into running concurrently too, when they're truly independent of each other.",
      "Sharding (`--shard=1/4`) splits the ENTIRE suite across multiple separate CI machines/jobs — different from workers (parallelism within one machine) and the standard way to keep a large E2E suite's CI runtime flat as it grows.",
      'Test isolation matters more under parallelism: shared state (the same test user, the same database row) across parallel tests causes intermittent, hard-to-reproduce failures — each test/worker should use independent data where possible.'
    ]
  },
  {
    id: 'pw-trace-viewer',
    title: 'Trace Viewer',
    summary:
      "A recorded, scrubbable timeline of an entire test run — DOM snapshots, network requests, console logs, and screenshots at every step — the single best tool for debugging a CI failure you can't reproduce locally.",
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-why-playwright'],
    keyPoints: [
      "`trace: 'on-first-retry'` (a common config choice) records a trace only when a test fails and gets retried — avoids the overhead of tracing every passing test while still capturing failures.",
      'Opening a trace (`npx playwright show-trace trace.zip`) gives a scrubbable, DevTools-like timeline: every action, the DOM state before/after it, network requests, console output, and source code — often enough to diagnose a CI-only failure without ever reproducing it locally.',
      "This is frequently cited as Playwright's single biggest DX advantage over Cypress and especially Selenium — CI-only flakiness (the hardest kind to debug) becomes tractable because you can see EXACTLY what the browser saw at the moment of failure.",
      "Traces are typically uploaded as a CI artifact on failure so they're downloadable from the CI run itself, not just available if you happen to run locally."
    ]
  },
  {
    id: 'pw-screenshots-and-visual-testing',
    title: 'Screenshots, Videos & Visual Regression Testing',
    summary:
      '`toHaveScreenshot()` compares a rendered page/element against a saved baseline image pixel-by-pixel — catching visual bugs that functional assertions (text, roles, URLs) would never notice.',
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-assertions'],
    keyPoints: [
      "`await expect(page).toHaveScreenshot()` saves a baseline image on first run, then fails future runs if the rendered output differs beyond a configurable pixel/threshold tolerance — Playwright's built-in visual regression tool.",
      'Cross-platform/cross-browser screenshot rendering can differ subtly (font rendering, anti-aliasing) — baselines are typically generated and compared within the SAME environment (often via Docker) used in CI to avoid false failures from local-vs-CI rendering differences.',
      'Third-party visual-testing services (Percy, Chromatic) add cross-browser/cross-viewport cloud rendering, smarter diffing (ignoring known-dynamic regions), and a review UI for approving intentional changes — worth mentioning as the "when you outgrow toHaveScreenshot" answer.',
      "`video: 'retain-on-failure'` records a full video of a failing test — useful alongside (not instead of) the Trace Viewer, especially for sharing a quick repro with a non-technical teammate.",
      'Element-level screenshots (`locator.screenshot()`) are often more stable than whole-page ones — less surface area to produce unrelated diffs from something like a slightly shifted unrelated component.'
    ]
  },
  {
    id: 'pw-api-testing',
    title: 'API Testing with Playwright',
    summary:
      'Playwright ships its own HTTP client (`request` context) for pure API testing — no browser needed at all — and can mix API calls with browser actions in the same test (e.g. seed data via API, then verify it in the UI).',
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-assertions'],
    keyPoints: [
      "`request.post('/api/users', { data: {...} })` fires a real HTTP request without launching a browser at all — useful for pure backend API test suites, or as fast setup/teardown steps within a browser-based E2E test.",
      'A common hybrid pattern: use the `request` fixture to seed test data (create a user, create an order) via direct API calls — much faster than clicking through UI forms — then switch to `page` to verify the UI reflects that data correctly.',
      "Playwright can also intercept and mock network requests DURING a browser test (`page.route(...)`) — similar in spirit to MSW, but scoped to Playwright's own browser context rather than a general-purpose Node/browser interception library.",
      'This blurs the line with Supertest for pure backend testing — the deciding factor is usually "already using Playwright for E2E" (reuse the same tool/config) vs "backend-only project" (Supertest\'s tighter Express integration wins).'
    ]
  },
  {
    id: 'pw-mobile-emulation',
    title: 'Mobile & Device Emulation',
    summary:
      "Playwright ships device descriptors (`devices['iPhone 14']`) that configure viewport, user agent, touch support, and device scale factor in one line — real mobile-web testing without a physical device or emulator.",
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-locators'],
    keyPoints: [
      "`test.use({ ...devices['iPhone 14'] })` (or configured per-project in `playwright.config.ts`) applies a realistic viewport size, user-agent string, and `hasTouch: true` — the standard way to test responsive/mobile layouts.",
      "This tests MOBILE WEB (a real browser rendering your responsive site at mobile dimensions), not native iOS/Android apps — a distinction worth stating explicitly, since it's a common point of confusion.",
      'Multiple device projects can run the same test suite against several viewports (desktop Chrome, iPhone, Android tablet) in the SAME CI run — configured as separate `projects` entries in `playwright.config.ts`, each with different `use` settings.',
      'Touch-specific interactions (`locator.tap()`) and touch-only UI (elements that only appear/behave differently on touch devices) can be tested explicitly once `hasTouch` is enabled.'
    ]
  },
  {
    id: 'pw-retries-flakiness',
    title: 'Retries & Handling Flaky Tests',
    summary:
      '`retries: 2` in config re-runs a FAILED test up to N more times before marking it truly failed — a pragmatic safety net, not a substitute for fixing genuinely flaky tests.',
    difficulty: 'intermediate',
    category: 'Playwright',
    prerequisites: ['pw-trace-viewer'],
    keyPoints: [
      '`retries` is typically set to `0` locally (a failure should mean something when developing) and `2` (or similar) in CI, where transient environment issues (a slow CI runner, a brief network hiccup) are more common than in local dev.',
      "Auto-waiting locators and web-first assertions already eliminate most of the classic causes of flakiness (racing against an element that hasn't rendered yet) — retries are a safety net for genuinely environmental flakiness, not a way to paper over a real timing bug in the test.",
      'A test that only passes on retry consistently is a signal worth investigating, not ignoring — Playwright\'s HTML reporter flags "flaky" (failed then passed on retry) tests distinctly from tests that failed outright, specifically to surface this.',
      "Combine with `trace: 'on-first-retry'` — the retry that reveals a genuine flake is exactly the run you want a full trace of, so the flakiness can actually be diagnosed instead of just masked."
    ],
    gotcha:
      'Cranking `retries` up to "make CI green" without ever looking at WHY tests are flaky is exactly the failure mode the test-automation note warns about — a suite people stop trusting.'
  },
  {
    id: 'pw-headless-vs-headed',
    title: 'Headless vs Headed Mode',
    summary:
      'Headless (no visible browser window) is the CI default for speed; headed mode (a real visible browser) plus `--debug`/`--ui` is how you actually watch and debug a test while writing it.',
    difficulty: 'basic',
    category: 'Playwright',
    prerequisites: ['pw-why-playwright'],
    keyPoints: [
      'Headless is faster and uses fewer resources — the default for CI, where nobody is watching the screen and speed/resource usage matters most.',
      "`headless: false` (or `--headed` on the CLI) opens a real, visible browser window — useful while writing or debugging a test locally, to actually watch what's happening.",
      "Playwright's UI mode (`playwright test --ui`) is the more commonly recommended local-debugging workflow now — a dedicated app showing the test list, a live browser preview, and time-travel through each step, richer than just watching a headed browser run.",
      '`page.pause()` inside a test (only meaningful when NOT headless, or combined with `--debug`) drops into the Playwright Inspector at that exact point, letting you step through the rest of the test manually.'
    ]
  }
];
