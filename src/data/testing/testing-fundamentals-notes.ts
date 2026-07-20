import type { Note } from '@/types/content';

// ─── Testing Fundamentals — orienting concepts for the React/Node.js/Next.js testing
// stack covered by the rest of this section. Deeper theory (pyramid shape, TDD cycle,
// STLC, coverage metrics) already lives in Engineering Essentials — linked via
// prerequisites rather than repeated here. ─────────────────────────────────────

export const testingFundamentalsNotes: Note[] = [
  {
    id: 'test-fund-choosing-a-stack',
    title: 'Choosing a Testing Stack for React, Node.js & Next.js',
    summary:
      'The stack most teams converge on in 2026: Vitest (or Jest) + React Testing Library + MSW for unit/integration, Supertest for Node APIs, Playwright for E2E.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Unit/component: Vitest or Jest as the runner, React Testing Library (RTL) on top for anything that renders a component.',
      'Network mocking: MSW (Mock Service Worker) has become the default over ad-hoc fetch/jest.mock stubs — it intercepts real requests instead of replacing your code.',
      'Node/API layer: the same runner (Vitest or Jest) plus Supertest to drive an Express/Nest/Fastify app in-process over HTTP.',
      'End-to-end: Playwright is now the default pick for new projects — Cypress remains common in codebases that adopted it before Playwright matured.',
      'A typical 2026 React + Next.js job posting reads: Vitest, React Testing Library, MSW, Playwright — that combination alone covers most frontend and full-stack interview questions on testing.'
    ],
    gotcha:
      'There is no single "correct" stack — what matters in an interview is explaining WHY a tool fits a layer (RTL tests behavior not implementation, MSW mocks at the network boundary, Playwright drives a real browser), not just naming it.'
  },
  {
    id: 'test-fund-unit-integration-e2e',
    title: 'Unit vs Integration vs E2E, in this ecosystem',
    summary:
      'The same pyramid, mapped to concrete tools: a pure function test (Vitest), a component test (RTL + MSW), an API test (Supertest), and a full user flow (Playwright).',
    difficulty: 'basic',
    category: 'fundamentals',
    prerequisites: ['test-pyramid'],
    keyPoints: [
      'Unit: one function or one component in isolation — a `formatCurrency()` test, or an RTL test that renders `<Button>` alone with mocked props.',
      'Integration: several pieces wired together — an RTL test that renders a form talking to a mocked API via MSW, or a Supertest call that exercises route → controller → service (with a real or in-memory database).',
      'End-to-end: the whole stack, driven through a real browser against a running app — a Playwright script that logs in, adds an item to a cart, and checks out.',
      'The same feature usually gets tested at multiple levels: a checkout button click is a unit test (renders correctly), an integration test (calls the right API), and one E2E test (the whole flow works) — not three copies of the same assertion.',
      'Most of the suite should sit at the unit/integration level; E2E tests are valuable but slow and comparatively expensive to maintain, so they cover the critical paths, not every case.'
    ]
  },
  {
    id: 'test-fund-tdd-vs-bdd',
    title: 'TDD vs BDD',
    summary:
      'TDD drives design through failing tests written by developers; BDD drives requirements through human-readable scenarios shared with non-engineers.',
    difficulty: 'intermediate',
    category: 'fundamentals',
    prerequisites: ['test-tdd'],
    keyPoints: [
      'TDD (Test-Driven Development): Red → Green → Refactor, written in code, by and for developers, focused on correctness of implementation.',
      'BDD (Behavior-Driven Development): scenarios written in a structured natural-language style (Given/When/Then), meant to be readable — and sometimes written — by product/QA as well as engineers.',
      "Tools like Cucumber or Playwright's own step-style helpers let a Given/When/Then scenario map directly onto executable test code.",
      'In practice: `test()`/`it()` blocks in Vitest/Jest/Playwright with descriptive names ("logs the user in with valid credentials") capture most of BDD\'s readability benefit without adopting a separate Gherkin syntax — many teams get BDD-style clarity without full BDD tooling.',
      'They are not mutually exclusive — a team can write tests test-first (TDD workflow) while phrasing them in Given/When/Then style (BDD readability).'
    ],
    codeSnippet: `// BDD-flavored test names, plain Vitest/Playwright underneath
describe('checkout', () => {
  it('given an empty cart, when the user visits checkout, then it redirects to /cart', () => {
    // ...
  });
});`
  },
  {
    id: 'test-fund-mocking-strategies',
    title: 'Mocking Strategies: Where to Draw the Line',
    summary:
      "Mock at the boundary of what you don't control — the network, the clock, a third-party SDK — and let your own code run for real wherever possible.",
    difficulty: 'intermediate',
    category: 'fundamentals',
    prerequisites: ['test-tdd'],
    keyPoints: [
      'Function-level mocking (`vi.fn()`/`jest.fn()`, `vi.spyOn`/`jest.spyOn`): replace or observe a single function — fine for isolating a unit from a specific dependency.',
      'Network-level mocking (MSW): intercept the actual HTTP/GraphQL request instead of replacing the code that makes it — the component or module under test runs completely unmodified, so the test exercises real fetch/axios/whatever code paths.',
      "Module mocking (`vi.mock('./api')`/`jest.mock('./api')`): swap an entire module for a fake — powerful but couples the test to the module's internal shape, so it breaks on refactors even when behavior is unchanged.",
      'The rule of thumb repeated across this whole section: mock external boundaries (network, database, time, third-party SDKs), not the logic you are actually trying to verify — over-mocking your own code can leave a test green while the real integration is broken.',
      'Prefer network-level mocking (MSW) over module mocking for anything that talks to an API — it survives refactors (switching from fetch to axios, changing an internal helper) as long as the actual HTTP contract stays the same.'
    ],
    gotcha:
      "A test suite that mocks `jest.mock('./userService')` in every test can pass 100% while the real `userService` is completely broken — none of those tests ever exercise the real code. This is exactly why integration and E2E layers exist above the unit layer."
  },
  {
    id: 'test-fund-ci-integration',
    title: 'Running This Stack in CI',
    summary:
      "Unit/integration tests run on every push in seconds; E2E suites run less often (or sharded/parallelized) since they're slower and need a running app.",
    difficulty: 'intermediate',
    category: 'fundamentals',
    prerequisites: ['eng-cicd'],
    keyPoints: [
      'Vitest/Jest + RTL + Supertest tests need no browser and no running server for the frontend pieces — they run fast in any CI runner on every commit.',
      'Playwright needs either a real running instance of the app (`npm run build && npm run start` in a CI step) or a preview deployment URL to point at — set this up once as a CI job dependency.',
      'Playwright ships its own GitHub Actions setup (`playwright install --with-deps` + a documented workflow) and can shard tests across multiple CI machines to keep E2E runtime reasonable as the suite grows.',
      "A common CI shape: unit/integration tests block every PR (fast, cheap); the full E2E suite runs on merge to main or on a schedule (slower, catches what unit tests can't).",
      'Test reports (JUnit XML, HTML reports from Playwright/Vitest) feed back into the CI UI so a failure is diagnosable without re-running locally.'
    ]
  },

  // ─── MANUAL TESTING & QA PROCESS — sourced from the Adaface Test Engineer interview
  // question bank; consolidated by theme rather than one note per question. ───────
  {
    id: 'test-fund-mt-verification-vs-validation',
    title: 'Verification vs Validation',
    summary:
      'Verification asks "are we building the product right?" (does it meet the spec); validation asks "are we building the right product?" (does it meet the actual user need).',
    difficulty: 'basic',
    category: 'manual testing & qa process',
    keyPoints: [
      'Verification: static, spec-driven checks — code reviews, design reviews, walkthroughs, checking that requirements were implemented as written.',
      'Validation: dynamic, user-driven checks — actually running the software (or a prototype) to confirm it solves the real problem, often via user acceptance testing.',
      'A feature can pass verification (built exactly to spec) and still fail validation (the spec itself was wrong) — this gap is exactly why UAT and stakeholder demos exist alongside functional test suites.',
      'One-line answer interviewers listen for: "verification is about the process, validation is about the product."'
    ]
  },
  {
    id: 'test-fund-mt-bug-reports',
    title: 'Writing Effective Bug Reports',
    summary:
      'A good bug report lets a developer reproduce and fix the issue without ever asking you a follow-up question — clear steps, expected vs actual result, and supporting evidence.',
    difficulty: 'basic',
    category: 'manual testing & qa process',
    keyPoints: [
      'Minimum shape: a descriptive title, exact steps to reproduce, expected result, actual result, environment (browser/OS/build version), and severity/priority.',
      'Supporting evidence — a screenshot, screen recording, console log, or network trace — turns "it doesn\'t work" into something a developer can act on immediately.',
      'One bug per report: bundling multiple issues into one ticket makes triage, assignment, and closing individually impossible.',
      'Severity (how bad is the impact) and priority (how soon it needs fixing) are distinct axes — a cosmetic typo on the homepage can be high-visibility/low-severity, while a rare data-corruption bug can be low-visibility/high-severity.',
      'State the impact in business/user terms, not just technical terms — "users cannot complete checkout" lands with stakeholders faster than a stack trace alone.'
    ]
  },
  {
    id: 'test-fund-mt-sdlc-role',
    title: 'The SDLC and Where Testing Fits',
    summary:
      "Testing isn't a phase that happens after development — in a modern SDLC it runs continuously, from requirements review through to production monitoring.",
    difficulty: 'basic',
    category: 'manual testing & qa process',
    prerequisites: ['test-stlc'],
    keyPoints: [
      'Classic waterfall framing (requirements → design → build → test → deploy) puts testing as one late phase — this is the model interviewers expect you to push back on.',
      'In Agile/DevOps, testing is continuous: requirements review catches ambiguity early, tests are written alongside (or before) code, CI runs them on every commit, and monitoring/observability catches what testing missed in production.',
      '"Shift-left" testing means moving quality activities earlier — static analysis, code review, and unit tests at commit time, rather than waiting for a dedicated QA phase at the end.',
      "The STLC (Software Testing Life Cycle — requirement analysis through closure) describes testing's own internal phases; it runs IN PARALLEL with the broader SDLC, not strictly after it."
    ]
  },
  {
    id: 'test-fund-mt-test-planning',
    title: 'Test Planning & Adapting Strategy',
    summary:
      'A test plan defines scope, approach, resources, and schedule before testing starts — and a good tester revises it visibly when requirements or risk change mid-project.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-sdlc-role'],
    keyPoints: [
      "A test plan typically covers: scope (what's in/out), approach (manual vs automated mix, test levels), entry/exit criteria, environments and data needed, risks, and a rough schedule.",
      '"How do you ensure you\'ve thoroughly tested something?" has no single technical answer — the expected structure is: requirements-based test case design, risk-based prioritization (test the highest-impact areas hardest), coverage tracking against requirements, and exploratory testing to catch what the written cases miss.',
      'Adapting a plan mid-project (a new requirement lands, a risk is discovered, a deadline moves) is normal, not a failure of planning — the interview signal is HOW you re-prioritize (risk and impact first) and how you communicate the change to stakeholders, not that the original plan was never touched.',
      'Frequently-changing requirements (common in Agile) push toward lighter-weight, living test plans and closer, ongoing communication with product/stakeholders rather than one large upfront document that goes stale.'
    ]
  },
  {
    id: 'test-fund-mt-manual-vs-automated',
    title: 'Manual vs Automated Testing: What to Automate',
    summary:
      'Automate what is repetitive, stable, and high-value to re-run; keep exploratory, usability, and rarely-run checks manual — automating everything is as wrong as automating nothing.',
    difficulty: 'basic',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-choosing-a-stack'],
    keyPoints: [
      'Good automation candidates: regression suites run on every build, stable UI flows (login, checkout), data-heavy validation, anything run dozens of times across many builds — the ROI comes from REPETITION.',
      'Poor automation candidates: a feature still under active UI churn (the test would need constant rewriting), a one-off exploratory investigation, or anything genuinely evaluating subjective usability/look-and-feel.',
      'The decision framework interviewers want to hear: frequency of execution, stability of the feature, and cost of automation vs cost of repeated manual execution — not "automate everything" or "I only do manual."',
      'Manual testing still wins for exploratory testing, usability judgment, and ad-hoc investigation of a newly reported bug — automation checks what you already know to check; a human finds what nobody thought to check.'
    ]
  },
  {
    id: 'test-fund-mt-test-case-design',
    title: 'Test Case Design & Reusability',
    summary:
      'A well-written test case is precondition, steps, and expected result — written so someone else (or a future automation script) can execute it without needing you to explain it.',
    difficulty: 'basic',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-test-planning'],
    keyPoints: [
      'Structure: title, preconditions, numbered steps, expected result per step (or at the end), and priority — vague steps ("test the login") are not reusable by anyone but the author.',
      'Design techniques worth naming: equivalence partitioning (test one representative value per class of input instead of every value), boundary value analysis (test at and just past the edges — 0, max, max+1), and decision tables for combinations of conditions.',
      "Reusability comes from independence (a case shouldn't assume a specific prior case ran first), parameterization (the same steps, different data), and organizing cases by feature/requirement so they can be picked up for regression later.",
      'A test case traceable back to a specific requirement (see the traceability note) doubles as living documentation of what the requirement actually means in practice.'
    ]
  },
  {
    id: 'test-fund-mt-regression-testing',
    title: 'Regression Testing',
    summary:
      'Re-running existing tests after a change to confirm nothing that used to work got broken — the primary reason a growing test suite pays for itself over time.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-test-case-design'],
    keyPoints: [
      'Full regression (re-run everything) is thorough but slow; a common practical process is a risk-based SUBSET — re-run tests covering the changed area plus its known dependencies, and run the full suite less frequently (nightly, pre-release).',
      'Regression suites are the highest-value automation target precisely because they run over and over, unchanged, across many builds — manual regression at scale is where teams burn the most repetitive hours.',
      "A regression test suite needs active maintenance: tests for removed features must be retired, and flaky tests need fixing quickly, or the suite's signal erodes and people start ignoring failures.",
      'Impact analysis (tracing which features/tests a code change could plausibly affect, often via the traceability matrix or code coverage data) is what makes a "subset" regression run trustworthy instead of a guess.'
    ]
  },
  {
    id: 'test-fund-mt-risk-based-testing',
    title: 'Risk-Based Testing',
    summary:
      'Prioritize testing effort by (likelihood of failure) × (impact of failure) — spend the most time on the areas that are both likely to break AND expensive if they do.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-test-planning'],
    keyPoints: [
      'A risk matrix plots likelihood against impact/severity — the top-right cell (high likelihood, high impact) gets the deepest test coverage and earliest attention; low/low risks may get light or no dedicated testing.',
      'Likelihood factors: code complexity, how recently/heavily an area changed, how many past defects it has had, and how many dependencies touch it.',
      'Impact factors: how many users are affected, revenue/legal/safety consequences, and how visible a failure would be (a broken checkout vs a broken rarely-used admin report).',
      'This is the honest, defensible answer to "you can\'t test everything with a tight deadline, what do you cut?" — cut low-likelihood/low-impact areas first, and say so explicitly rather than just testing everything shallowly.'
    ]
  },
  {
    id: 'test-fund-mt-exploratory-testing',
    title: 'Exploratory Testing',
    summary:
      "Simultaneously learning, designing, and executing tests — no pre-written script, just a tester's judgment probing the application in real time, documenting findings as they go.",
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-risk-based-testing'],
    keyPoints: [
      "Distinct from scripted testing: there is no predetermined step list — the tester's next action is informed by what the LAST action revealed, following hunches and unusual behavior.",
      'Session-based test management (SBTM) structures exploratory testing without fully scripting it: a time-boxed session with a stated charter/goal (e.g. "explore checkout with invalid payment data for 45 minutes"), with findings logged afterward.',
      'It excels at finding the bugs scripted test cases never anticipated — edge cases, unusual sequences of actions, and genuinely surprising interactions between features.',
      "Complements automation rather than competing with it: automation efficiently re-checks what's already known; exploratory testing is how NEW risks and unknown-unknowns get discovered in the first place.",
      'Good exploratory testers document as they go (screen recordings, notes, a bug log) so a promising finding can be turned into a repeatable, formal test case afterward.'
    ]
  },
  {
    id: 'test-fund-mt-e2e-qa-perspective',
    title: 'End-to-End Testing, from a QA Perspective',
    summary:
      'Beyond the tooling (Playwright/Cypress), the QA framing of E2E testing is about coverage: does the full user journey work across every dependency it touches, not just the happy path.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-unit-integration-e2e'],
    keyPoints: [
      'A strong E2E answer names concrete USE CASES and DEPENDENCIES covered (payment gateway, email service, third-party auth) rather than just "we use Playwright" — tooling is a detail, coverage reasoning is the substance.',
      'E2E test selection should mirror risk-based testing: cover the critical, high-traffic user journeys (signup, checkout, core workflow) exhaustively; leave rare edge-case paths to lighter coverage or exploratory testing.',
      'A common gap: E2E suites that only test the happy path — a thorough answer explicitly mentions negative paths too (payment declined, session expired mid-flow, network failure during submission).',
      'See the Playwright pages in this section for the concrete tooling (locators, fixtures, trace viewer) that implements this coverage in practice.'
    ]
  },
  {
    id: 'test-fund-mt-traceability-tools',
    title: 'Traceability & Test Management Tools',
    summary:
      'A traceability matrix maps every requirement to the test case(s) that verify it (and every defect back to the requirement/test that caught it) — the tool that proves "we tested everything we were supposed to."',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-test-case-design'],
    keyPoints: [
      'Requirements Traceability Matrix (RTM): one row per requirement, columns linking to the test case(s) covering it and any defects found — instantly shows coverage gaps (a requirement with no linked test case) and impact (which requirements a given defect threatens).',
      'Common tools: JIRA (with Xray/Zephyr plugins) or TestRail for test case management and traceability; JIRA alone for defect tracking; these integrate so a failed test auto-links to a bug ticket, which links back to the original requirement.',
      'Traceability matters most under audit/compliance pressure (regulated industries) and at release-readiness time — "are we ready to ship?" is really "is every requirement traced to a passing test?"',
      "Naming a specific tool you've used (and WHY you liked it — e.g. TestRail's reporting, JIRA's ecosystem integration) reads stronger in an interview than a generic \"I use test management tools.\""
    ]
  },
  {
    id: 'test-fund-mt-metrics',
    title: 'Testing Metrics That Matter',
    summary:
      'Test execution rate, defect density, defect removal efficiency, and coverage give a quantitative read on testing effectiveness — none of them alone tells the whole story.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-stlc'],
    keyPoints: [
      'Test execution metrics: planned vs executed vs passed/failed test cases — tracks progress against the plan during a test cycle.',
      'Defect density (bugs per KLOC or per feature/module) highlights which areas are the buggiest, guiding where to focus review and testing effort.',
      'Defect removal efficiency (DRE): defects found before release vs total defects found (including ones users report after release) — a strong signal for how effective the whole quality process is, not just testing.',
      'Coverage (requirement coverage, or code coverage — see the STLC/coverage-metrics note) shows how much was exercised, but never how well it was verified — pairing metrics with a manual sanity read is expected, not optional.',
      'Mean time to detect and mean time to resolve a defect are increasingly tracked in mature teams — they measure the whole feedback loop, not just testing in isolation.'
    ]
  },
  {
    id: 'test-fund-mt-agile-cicd-testing',
    title: 'Testing in Agile & Continuous Delivery',
    summary:
      'Short sprints and frequent deploys mean testing has to be fast, automated where possible, and continuously adapting to a moving target — the discipline shifts from "test the release" to "test every change."',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['eng-cicd', 'test-fund-mt-sdlc-role'],
    keyPoints: [
      'Agile challenges: requirements evolve sprint to sprint, testing windows shrink, and the tester is often testing a feature that itself is still being refined — close, continuous communication with the team is the mitigation, not a static plan.',
      'Continuous delivery adds its own challenges on top: test stability under frequent deploys (flaky tests get punished fast), managing test data that stays valid across rapidly changing schemas, and keeping the automated suite fast enough to not block releases.',
      "A tester's role expands in Agile/CD: writing acceptance criteria WITH the team upfront (not testing against criteria handed down after the fact), pairing with developers, and owning quality as a whole-team responsibility rather than a separate gate.",
      'The practical answer to "how do you keep up": tight automated regression coverage on the critical paths, risk-based manual testing for what changed most, and fast feedback loops (CI running on every PR, not just nightly).'
    ]
  },
  {
    id: 'test-fund-mt-performance-load-testing',
    title: 'Performance & Load Testing',
    summary:
      'Load testing checks the system under expected traffic; stress testing pushes past that to find the actual breaking point — both measure response time, throughput, and error rate under pressure.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-cross-browser-perf'],
    keyPoints: [
      'Common tools: k6 and JMeter for scripted load generation, Lighthouse for single-page frontend performance audits, and cloud load-testing services for very large simulated traffic.',
      'Key metrics to report: response time percentiles (p50/p95/p99 — tail latency matters more than the average), throughput (requests/sec sustained), and error rate as load increases.',
      'Test types worth naming distinctly: load (expected traffic), stress (past expected, to find the breaking point), spike (a sudden burst), and soak (sustained load over hours, to catch memory leaks or slow degradation).',
      'Results need a baseline to be meaningful — "200ms average" means nothing without knowing what "normal" looked like before the change being tested.'
    ]
  },
  {
    id: 'test-fund-mt-cross-browser-platform',
    title: 'Cross-Browser & Cross-Platform Testing',
    summary:
      'Verifying the app works consistently across browsers, devices, and screen sizes — combining automated coverage (Playwright/BrowserStack) with manual spot-checks on real devices for the highest-traffic combinations.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-cross-browser-perf'],
    keyPoints: [
      'Tools: Playwright and Selenium run the same automated suite across Chromium/Firefox/WebKit; BrowserStack/Sauce Labs add real-device cloud coverage for mobile browsers and older OS/browser combinations that are hard to run locally.',
      'Full manual coverage of every browser/device/OS combination is infeasible — prioritize by actual analytics data (which browsers/devices your real users use) rather than testing everything equally.',
      'Cross-platform coverage for native or hybrid apps adds device-specific concerns beyond the browser: screen size/density, OS version fragmentation (especially Android), and platform-specific gestures.',
      'A strong answer names the prioritization logic (traffic data + risk) alongside the tool names — listing tools alone without a selection strategy is the weak version of this answer.'
    ]
  },
  {
    id: 'test-fund-mt-mobile-vs-web',
    title: 'Mobile App Testing vs Web Testing',
    summary:
      'Mobile testing adds device fragmentation, OS-level permissions, network variability (3G/offline), and app-store review constraints on top of everything web testing already covers.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-cross-browser-platform'],
    keyPoints: [
      'Device/OS fragmentation is far worse than browser fragmentation — many screen sizes, OS versions, and manufacturer customizations (especially Android) to reasonably cover.',
      'Mobile-specific concerns with no web equivalent: OS permission prompts (camera, location, notifications), interruptions (a phone call arriving mid-flow), background/foreground app state transitions, and battery/network-constrained conditions.',
      'Network variability testing (throttled 3G, intermittent connectivity, airplane mode) matters far more for mobile — a web app on a laptop rarely faces the same conditions a mobile user does on the go.',
      "Native/hybrid apps also have release-process constraints web doesn't: app store review time and staged rollouts mean a critical bug fix can't ship instantly the way a web deploy can — this changes release-testing risk tolerance."
    ]
  },
  {
    id: 'test-fund-mt-api-testing-strategy',
    title: 'API Testing Strategy',
    summary:
      "Test each endpoint's contract directly — status codes, response shape, error handling, and auth — independent of whatever UI eventually consumes it, catching backend bugs faster and more precisely than going through the UI.",
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['supertest-what-and-why'],
    keyPoints: [
      'API tests run faster and are more precise than UI tests for backend logic — no browser, no rendering, and a failure points directly at the endpoint/status code involved instead of "something on this page is wrong."',
      'Manual/exploratory API testing tools: Postman/Insomnia for building and running requests by hand, useful for initial exploration and documenting expected behavior before automating it.',
      "Automated API testing (this section's Supertest and Playwright API-testing notes cover the concrete tooling) turns that manual exploration into a regression-proof suite.",
      'A thorough API test strategy covers happy path, validation errors (missing/malformed fields), auth failures (401/403), not-found cases (404), and rate limiting (429) — not just "does the happy path return 200."'
    ]
  },
  {
    id: 'test-fund-mt-test-data-management',
    title: 'Test Data Management',
    summary:
      'Realistic, isolated, and resettable test data is what keeps a large test suite trustworthy — shared, mutable test data across tests is one of the most common sources of flaky, order-dependent failures.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-test-case-design'],
    keyPoints: [
      'Strategies: dedicated test fixtures/factories that generate fresh data per test, database seeding scripts for a known starting state, and synthetic/anonymized data (never real production PII) for realistic volume testing.',
      'Isolation matters as much as realism: two tests (or two parallel workers) touching the same shared row/user causes intermittent, hard-to-reproduce failures — see the Playwright parallel-execution note for the same problem at the automation layer.',
      'Resetting state between test RUNS (not just between individual tests) — via database transactions rolled back, a fresh container per run, or a cleanup script — keeps a suite reliable over time instead of accumulating cruft.',
      'At scale, test data management becomes its own discipline: masking/anonymizing a production data subset for realistic load testing while staying compliant with privacy requirements (GDPR and similar).'
    ]
  },
  {
    id: 'test-fund-mt-flaky-tests-qa',
    title: 'Handling Flaky Tests',
    summary:
      "A flaky test passes and fails without any code change — the single fastest way to destroy a team's trust in its test suite, and worth treating as a priority bug, not background noise.",
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['pw-retries-flakiness'],
    keyPoints: [
      'Common causes: timing/race conditions (asserting before an async action finished), shared/mutable test data, test-order dependence, and environmental instability (a flaky CI runner or network).',
      "Quarantine, don't ignore: a known-flaky test should be tagged and excluded from the blocking suite immediately (so it doesn't hide OTHER real failures) while it gets fixed — leaving it in the normal run just trains the team to re-run-until-green.",
      'Retries (see the Playwright retries note) are a pragmatic safety net for genuine environmental flakiness, not a fix for a real timing bug in the test itself — the two should be diagnosed differently.',
      'Track flaky-test rate as its own metric — a rising trend is an early warning that test isolation or timing handling is degrading across the suite, not just an annoyance in one file.'
    ]
  },
  {
    id: 'test-fund-mt-security-testing-qa',
    title: 'Security Testing in the QA Workflow',
    summary:
      "QA doesn't replace a dedicated security review, but weaving basic security checks (auth boundaries, input validation, common OWASP categories) into the regular test cycle catches a large share of issues before they ever reach a pen test.",
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['websec-xss'],
    keyPoints: [
      "Practical QA-level security checks: verifying auth/authorization boundaries (can user A see user B's data?), basic injection/XSS probes on input fields, checking sensitive data isn't exposed in responses or logs, and confirming HTTPS/security headers are present.",
      "This is complementary to, not a replacement for, specialized security testing (penetration testing, dedicated security audits, automated SAST/DAST scanning) — QA's job is catching the obvious issues early and cheaply.",
      'Security testing is a good example of "shift-left": the OWASP Top 10 categories (see the Web Security notes in this app) are worth knowing by name even for a QA-focused role, since interviewers use them as a checklist for how security-aware a candidate is.',
      'Automated security scanning tools (dependency vulnerability scanners, basic DAST tools run in CI) extend this coverage on every build without needing a human to manually re-check known categories each time.'
    ]
  },
  {
    id: 'test-fund-mt-accessibility-testing-qa',
    title: 'Accessibility Testing, from a QA Perspective',
    summary:
      'Automated tools (axe, Lighthouse) catch roughly a third to half of accessibility issues — the rest genuinely needs manual keyboard-only navigation and screen-reader testing.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['a11y-wcag-pour'],
    keyPoints: [
      'Automated checks catch objectively verifiable issues: missing alt text, insufficient color contrast, missing form labels, invalid ARIA usage — fast, but structurally limited to what a tool can measure.',
      'Manual checks catch what automation cannot judge: is the tab order logical, does the screen reader announce content in a sensible way, is focus properly managed when a modal opens/closes, does an error message actually make sense read aloud.',
      'A practical QA accessibility pass: run an automated scanner (axe/Lighthouse) first to catch the cheap wins, then manually tab through the whole flow with the mouse disconnected, then spot-check with a real screen reader (VoiceOver/NVDA) on the highest-traffic pages.',
      'WCAG conformance levels (A, AA, AAA) give a concrete target to test against — most organizations aim for AA; naming the specific level you test to is a stronger answer than "I test for accessibility."'
    ]
  },
  {
    id: 'test-fund-mt-microservices-containers-cloud',
    title: 'Testing Microservices, Containers & Cloud-Native Apps',
    summary:
      'A microservices test environment needs every dependent service (or a mock of it) running together — Docker Compose or a local Kubernetes cluster is how most teams reproduce that locally and in CI.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-agile-cicd-testing'],
    keyPoints: [
      'Setting up a microservices test environment: Docker Compose spins up the service under test plus its real dependencies (database, cache, message queue) with one command — the standard way to get a realistic environment without deploying to shared infrastructure.',
      'Contract testing (see the API-design content in Engineering Essentials) becomes essential once services are independently deployed — it verifies two services still agree on their API without needing a full integration environment running for every test.',
      'Testing cloud-native apps adds its own layer: verifying behavior under auto-scaling, testing resilience to a dependency being temporarily unavailable (chaos-engineering-style fault injection), and confirming configuration (env vars, secrets) is correctly wired per environment.',
      'Ephemeral, on-demand test environments (spun up per PR, torn down after) are increasingly the norm in cloud-native teams — avoids the classic "shared staging environment is broken because someone else\'s change is half-deployed" problem.'
    ]
  },
  {
    id: 'test-fund-mt-database-migration-testing',
    title: 'Database Integrity & Migration Testing',
    summary:
      'Migrations are one-way doors in production — testing them means verifying the schema change, the data transformation, AND that a rollback actually works, before they ever run against real data.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-test-data-management'],
    keyPoints: [
      "Test a migration against a realistic COPY of production-shaped data (volume and edge cases included), not just a small dev dataset — many migration bugs only surface at real scale (a transform that's fine for 100 rows can time out or corrupt data at 10 million).",
      'Verify referential integrity and constraints hold after the migration — foreign keys, uniqueness, not-null constraints — a migration that "succeeds" but leaves orphaned or duplicate rows is a silent failure.',
      "Always test the ROLLBACK path, not just the forward migration — a migration with no tested rollback is a one-way door in production, and that's precisely when teams get caught out.",
      'For data integrity beyond migrations: periodic checks for orphaned records, duplicate data that should be unique, and consistency between denormalized copies of the same fact are the ongoing (not just migration-time) version of this concern.'
    ]
  },
  {
    id: 'test-fund-mt-third-party-integration',
    title: 'Testing Third-Party Integrations',
    summary:
      "You don't control a third-party API's behavior, uptime, or rate limits — testing an integration means testing YOUR handling of it, especially the failure cases, not just the happy path against their sandbox.",
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['msw-why-msw'],
    keyPoints: [
      "Use the third party's official sandbox/test environment when available (most payment providers, for example, offer one) to verify the real integration contract without touching production.",
      "Mock the third party (see the MSW notes in this section) for fast, reliable, offline test runs — the sandbox test proves the contract works; the mock-based tests protect against regressions on every subsequent build without depending on an external service's uptime.",
      'The highest-value tests here are the FAILURE cases: what happens when the third party times out, returns a 500, returns malformed data, or rate-limits you — these are exactly the scenarios real production incidents come from, and they are hard to trigger against a real sandbox on demand.',
      'Contract/version drift is a real risk: a third party can change their API without much warning — monitoring/alerting on integration health in production is the necessary complement to pre-release testing.'
    ]
  },
  {
    id: 'test-fund-mt-bdd-qa-perspective',
    title: 'BDD, from a QA Perspective',
    summary:
      "BDD's real value for a QA role is a shared language with product/business stakeholders — Given/When/Then scenarios double as both the acceptance criteria and the test.",
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-tdd-vs-bdd'],
    keyPoints: [
      'In a BDD workflow, QA is often the one WRITING or facilitating the Given/When/Then scenarios collaboratively with product and developers (the "three amigos" practice) — before any code is written, not after.',
      'Because the scenario is both the specification and the (via Cucumber or similar) executable test, BDD reduces the gap between "what the business asked for" and "what got tested" that a separately-maintained test-case document can drift from.',
      "The honest trade-off to mention: Gherkin/Cucumber tooling adds real overhead (a translation layer between plain-language steps and code) — many teams get most of BDD's clarity benefit from just writing descriptively-named test blocks (see this section's TDD vs BDD note) without adopting the full tooling.",
      'BDD scenarios are a natural source for both manual test cases (for exploratory/UAT sign-off) and automated E2E tests — one artifact, two uses.'
    ]
  },
  {
    id: 'test-fund-mt-mocking-qa-perspective',
    title: 'Mocking & Stubbing, from a QA Perspective',
    summary:
      'Even in a manual-testing-heavy role, understanding WHY and WHERE a dev mocks a dependency helps a tester judge whether a "passing" automated test actually proves anything about the real integration.',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mocking-strategies'],
    keyPoints: [
      "A tester reviewing an automated suite should ask what's mocked at each level — heavily-mocked unit tests prove the LOGIC is correct but say nothing about whether the real integration (real database, real third-party API) actually works.",
      'This is exactly why a QA strategy layers coverage: unit tests with mocks for fast logic verification, plus a smaller set of integration/E2E tests against real (or realistic sandbox) dependencies to catch what mocking hides.',
      "See this section's dedicated notes on `vi.fn()`/`jest.fn()`, MSW, and Supertest's repository-layer mocking for the concrete mechanics — the QA-interview framing is knowing WHEN each is appropriate, not just that they exist.",
      'A useful interview answer distinguishes stubs (canned responses, no behavior verification) from mocks (also assert HOW they were called) from fakes (a lightweight working implementation, like an in-memory database) — precision here signals real hands-on experience.'
    ]
  },
  {
    id: 'test-fund-mt-improving-process',
    title: 'Improving a Testing Process',
    summary:
      'The strongest answers to "how have you improved testing" name a specific, measurable before/after (cut regression time from X to Y, cut escaped-defect rate by Z%) rather than a vague "I introduced automation."',
    difficulty: 'intermediate',
    category: 'manual testing & qa process',
    prerequisites: ['test-fund-mt-metrics'],
    keyPoints: [
      'Common concrete improvement levers: automating a previously-manual regression suite, introducing risk-based prioritization to focus limited time, fixing a chronically flaky suite that people had started ignoring, or adding a missing test layer (e.g. no integration tests existed, only unit and E2E).',
      'Efficiency improvements without losing coverage: parallelizing a slow suite (see the Playwright parallel-execution note), consolidating duplicate/redundant test cases, and moving checks to the earliest layer that can catch them (shift-left) instead of relying on slow E2E for everything.',
      'Process changes matter as much as technical ones: introducing a bug-triage cadence, adding a Definition of Done that includes testing, or getting testers involved during requirements/design instead of after the build is done.',
      'Tie the improvement back to a metric from the metrics note (defect density, defect removal efficiency, regression cycle time) — a story with a number is memorably stronger than a story without one.'
    ]
  },

  // ─── BEHAVIORAL & SITUATIONAL — the open-ended, no-single-answer half of the same
  // Adaface question bank. Consolidated by theme; use the STAR method to structure
  // your own real answer to each prompt rather than treating these as flashcards
  // with a fixed "correct" response. ──────────────────────────────────────────────
  {
    id: 'test-fund-beh-star-method',
    title: 'Answering Behavioral QA Questions (STAR Method)',
    summary:
      "Structure every 'tell me about a time...' answer as Situation, Task, Action, Result — a specific real story beats a general philosophy every time.",
    difficulty: 'basic',
    category: 'behavioral & situational',
    keyPoints: [
      'Situation: one or two sentences of context — what project, what was going on. Keep it brief; interviewers want the story, not the preamble.',
      "Task: what was YOUR specific responsibility or goal in that situation — not the team's goal in general.",
      'Action: what YOU actually did, step by step — this is the longest part of the answer and the part interviewers are really listening for.',
      "Result: what happened — ideally something measurable (time saved, bugs caught, a process that stuck) — and, if relevant, what you'd do differently now.",
      'Prepare 4-6 real stories from your own experience in advance, each flexible enough to answer several of the prompts below — trying to improvise a detailed STAR answer live, for the first time, is what makes these questions feel hard.'
    ],
    gotcha:
      'Answering in generalities ("I always make sure to communicate well with the team") instead of one specific, concrete incident is the single most common way candidates fail these questions even when they have the real experience to draw on.'
  },
  {
    id: 'test-fund-beh-technical-judgment',
    title: 'Behavioral: Bugs & Technical Judgment',
    summary:
      'Prompts about a tricky bug you found, a disagreement with a developer about whether something is really a bug, or convincing stakeholders to prioritize a fix — all probing the same thing: your technical judgment under disagreement.',
    difficulty: 'intermediate',
    category: 'behavioral & situational',
    prerequisites: ['test-fund-beh-star-method'],
    keyPoints: [
      '"Describe a time you found a difficult bug and how you approached solving it" — a strong answer shows a systematic narrowing-down process (reproduce reliably → isolate variables → form a hypothesis → verify), not just "I found it eventually."',
      '"How do you handle disagreements with developers about whether a bug is valid?" — the expected framing is evidence over opinion: reproduce it reliably, tie it back to the requirement/spec or user impact, and escalate to a product owner as a neutral tie-breaker if the disagreement is genuinely about severity/priority rather than facts.',
      '"Can you describe a time when a test you performed led to significant changes in the project?" — pick a story where your finding changed a real decision (a launch delayed, a design reconsidered), and be specific about the impact, not just that a bug was fixed.',
      '"How would you convince stakeholders to prioritize a specific testing requirement?" — data and risk framing wins here: quantify the impact/likelihood (see the risk-based testing note) rather than asserting "it\'s important" — stakeholders prioritize what they can see the cost/risk of skipping.'
    ]
  },
  {
    id: 'test-fund-beh-time-management',
    title: 'Behavioral: Prioritization & Time Management',
    summary:
      "Prompts about tight deadlines, juggling multiple testing tasks, and your tool preferences — all really asking how you make trade-offs when you can't do everything.",
    difficulty: 'intermediate',
    category: 'behavioral & situational',
    prerequisites: ['test-fund-beh-star-method'],
    keyPoints: [
      '"How do you prioritize testing tasks in a tight deadline scenario?" — the strongest answers explicitly reference risk-based prioritization (test the highest-risk, highest-impact areas first) rather than "I work faster" or "I stay late."',
      '"Describe a situation where you had to balance multiple testing tasks. How did you manage your time?" — name a concrete method (a task board, explicit priority ranking, time-boxing) and a specific instance, not a general philosophy.',
      '"What testing tools do you prefer and why?" — this is really a proxy for hands-on depth: naming tools you\'ve genuinely used, with a specific reason tied to a real project (not just a list of trendy names), reads far stronger than reciting a tool list.',
      'A pattern across all three: interviewers are listening for a DECISION-MAKING FRAMEWORK you can repeat under pressure, not just a story that happened to work out once.'
    ]
  },
  {
    id: 'test-fund-beh-team-growth',
    title: 'Behavioral: Team, Communication & Growth',
    summary:
      'Prompts about remote communication, unfamiliar domains, mentoring, feedback, cross-functional collaboration, and staying current — all testing collaboration and growth mindset rather than pure technical skill.',
    difficulty: 'intermediate',
    category: 'behavioral & situational',
    prerequisites: ['test-fund-beh-star-method'],
    keyPoints: [
      '"How do you ensure effective communication with remote team members?" — name specific practices (async written updates, clear written bug reports that don\'t need a follow-up call, deliberate over-communication of blockers) over a vague "I communicate well."',
      '"What would you do if assigned testing tasks for an unfamiliar domain?" — the expected shape: read existing docs/tickets first, look at how similar existing features were tested, ask targeted questions rather than open-ended ones, and lean on transferable testing principles (risk analysis, exploratory testing) that apply regardless of domain.',
      '"How do you handle feedback or criticism of your testing work?" and "Can you describe a time you\'ve trained or mentored junior testers?" — both are looking for a growth mindset and evidence you invest in the team, not just yourself; a specific mentoring story (what you taught, what changed for that person) is stronger than "I\'m always happy to help."',
      '"Describe an instance where you had to collaborate with a cross-functional team to resolve a testing issue" and "How do you stay updated with testing trends?" — pick concrete examples (a specific cross-team incident; specific resources you actually read/follow) over generic claims.'
    ]
  },
  {
    id: 'test-fund-beh-uncertainty-change',
    title: 'Situational: Handling Uncertainty & Change',
    summary:
      'Prompts about incomplete requirements, limited information, unstable environments, unavailable tools, and tests broken by unrelated code changes — all testing how you keep moving productively without full information.',
    difficulty: 'intermediate',
    category: 'behavioral & situational',
    prerequisites: ['test-fund-beh-star-method'],
    keyPoints: [
      '"How would you test a feature with incomplete requirements?" — the expected approach: document your assumptions explicitly, confirm them with product/stakeholders before investing heavily, and test against the most reasonable interpretation while flagging the ambiguity rather than silently guessing.',
      '"Have you had to make a testing decision with limited information?" — walk through the actual reasoning you used to decide (risk tolerance, past experience with similar features, a quick spike to gather more info) rather than just stating the outcome.',
      '"How would you proceed if a newly deployed environment is unstable?" — a strong answer separates environment problems from application problems first (is this a real bug or infrastructure flakiness?), escalates the instability itself as a blocker, and adjusts the test plan rather than testing blindly against a broken environment.',
      '"How do you handle a scenario where a test case fails due to unforeseen code changes?" — investigate whether the failure reflects a genuine regression or an intentional behavior change the test simply needs updating for, and update the test\'s expectations only in the latter case.',
      '"How would you handle a situation where your testing tool is suddenly unavailable?" — name a fallback (manual testing of the critical paths, an alternative tool, working from cached results) and how you\'d communicate the reduced coverage/confidence in the meantime.'
    ]
  },
  {
    id: 'test-fund-beh-late-cycle-production',
    title: 'Situational: Late-Cycle Bugs & Production Issues',
    summary:
      'Prompts about a critical bug found right before release and a bug reported after release — both testing composure and process under the highest-pressure timing a tester faces.',
    difficulty: 'intermediate',
    category: 'behavioral & situational',
    prerequisites: ['test-fund-beh-star-method'],
    keyPoints: [
      '"What steps do you take when you discover a critical issue that may delay the release?" and "How would you handle a scenario where a bug is discovered late in the development cycle?" — the expected shape: assess actual severity/impact first (not every late bug should delay a release), communicate it immediately and clearly to stakeholders with the impact framed in business terms, and present options (fix and delay, ship with a known issue and a fast-follow, feature-flag it off) rather than just raising an alarm.',
      '"How would you approach a situation where a production issue is reported after the software release?" — triage severity and user impact first, reproduce it (ideally against the production environment/data shape, not just locally), and only then move to root-cause and fix — a calm, structured response under pressure is the actual signal being tested.',
      "A recurring thread in both: escalation and clear communication ARE the deliverable in these scenarios just as much as the technical fix — interviewers are probing whether you'll surface bad news early and clearly, not whether you personally can fix everything solo.",
      'If you have a real example, name the actual decision made (delayed the release / shipped with a documented known issue / hotfixed same-day) and why — a concrete outcome is far more convincing than "we handled it as a team."'
    ]
  },

  // ─── LEGACY & FRAMEWORK CONCEPTS — automation-testing vocabulary that predates
  // this section's Vitest/RTL/Playwright stack and still shows up in interviews,
  // especially at companies with an existing Selenium-based suite. ────────────────
  {
    id: 'test-fund-leg-selenium-fundamentals',
    title: 'Selenium Fundamentals: WebDriver, Locators & Grid',
    summary:
      'Selenium WebDriver drives a real browser via the W3C WebDriver protocol; Selenium IDE is a record-and-playback tool; Selenium Grid runs the same tests across many browsers/machines in parallel.',
    difficulty: 'basic',
    category: 'legacy & framework concepts',
    prerequisites: ['pw-vs-cypress-vs-selenium'],
    keyPoints: [
      'WebDriver is the actual automation engine — code-driven, language-bound (Java/Python/C#/JS bindings all exist), and the piece people mean when they just say "Selenium" in an interview.',
      'Locators identify elements the same way Playwright/RTL queries do, just with an older API: ID, Name, ClassName, TagName, LinkText, CSS selectors, and XPath — `driver.findElement(By.id("submit"))`.',
      '`findElement` returns the first match or throws `NoSuchElementException` immediately; `findElements` returns a (possibly empty) list and never throws — the same "throws vs returns empty/null" split RTL\'s `getBy` vs `queryBy` encodes, just under different names.',
      "Selenium Grid distributes test execution across multiple browsers/machines in parallel — conceptually the same problem Playwright's built-in workers and sharding solve natively, but requiring separate infrastructure to set up.",
      "Selenium predates auto-waiting entirely — historically flaky without carefully hand-written explicit waits (`WebDriverWait`), which is precisely the pain point Playwright's and Cypress's built-in auto-waiting was designed to eliminate."
    ]
  },
  {
    id: 'test-fund-leg-assert-vs-verify',
    title: '"Assert" vs "Verify" Commands',
    summary:
      'A distinction from the Selenium/QTP automation era: assert HALTS the test immediately on failure; verify LOGS the failure but lets the rest of the test keep running.',
    difficulty: 'basic',
    category: 'legacy & framework concepts',
    prerequisites: ['test-fund-leg-selenium-fundamentals'],
    keyPoints: [
      'Assert: fails fast — the moment the check fails, the test stops, which is appropriate when a later step depends entirely on this one being true (e.g. asserting a page loaded before trying to interact with elements on it).',
      'Verify (or a "soft assertion" in modern frameworks): failure is recorded, but execution continues, letting a single test run collect MULTIPLE independent failures in one pass instead of stopping at the first.',
      'Modern frameworks reframe this as "hard" vs "soft" assertions (e.g. `expect.soft()` in Playwright) rather than separate `assert`/`verify` APIs — same underlying concept, updated naming.',
      'The practical trade-off: soft/verify-style checks give more complete failure information per run (useful for a big form with many independent fields), but can let a test continue in a nonsensical state if an early failure should have invalidated everything after it — use hard asserts for anything a later step genuinely depends on.'
    ]
  },
  {
    id: 'test-fund-leg-automation-framework-types',
    title: 'Automation Framework Types: Data-Driven, Keyword-Driven & Hybrid',
    summary:
      'Data-driven separates test LOGIC from test DATA (same steps, many datasets); keyword-driven separates test logic from test STEPS (reusable named actions, readable by non-programmers); hybrid combines both.',
    difficulty: 'intermediate',
    category: 'legacy & framework concepts',
    prerequisites: ['test-fund-leg-selenium-fundamentals', 'pw-page-object-model'],
    keyPoints: [
      'Data-driven testing: the same test script runs once per row of an external dataset (a CSV, a spreadsheet, a JSON array) — a login test parameterized over twenty username/password pairs is data-driven, whether written in a legacy framework or a modern `test.each()`/parameterized test in Vitest/Playwright.',
      'Keyword-driven testing: test cases are expressed as a sequence of predefined keywords/actions ("OpenBrowser", "EnterText", "ClickButton") mapped to underlying code — historically aimed at letting non-programmer testers author test cases in something resembling plain English or a spreadsheet.',
      'Hybrid frameworks combine both: keyword-driven readability on top of data-driven parameterization, often layered with a Page Object Model for the underlying element interactions — most real enterprise Selenium frameworks converge on some hybrid shape rather than a pure form of either.',
      "This vocabulary is largely a Selenium-era framing — modern tools achieve the same GOALS more simply: Playwright/Vitest's built-in parameterized tests give data-driven behavior natively, and descriptive `test()` names plus POM give most of keyword-driven's readability without a separate keyword-mapping layer to maintain."
    ]
  }
];
