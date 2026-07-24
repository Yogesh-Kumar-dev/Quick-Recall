import type { QuizQuestion } from '@/types/content';

// ─── Testing quiz — multiple choice (fundamentals + Vitest/RTL/Playwright/tools) ──

export const testingQuiz: QuizQuestion[] = [
  {
    id: 'testing-q-unit-integration-e2e',
    question: 'What is the difference between unit, integration, and E2E tests?',
    options: [
      'They are all the same thing with different names',
      'Unit tests one module in isolation (fast); integration tests several units together; E2E tests the whole app like a real user (slow, brittle)',
      'E2E tests are always faster than unit tests',
      'Integration tests never touch a real database'
    ],
    correctIndex: 1,
    explanation: 'The testing pyramid recommends many unit tests, fewer integration tests, and a handful of E2E tests.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-tdd-cycle',
    question: 'What is the TDD (Test-Driven Development) cycle?',
    options: ['Design → Build → Ship', 'Red → Green → Refactor', 'Plan → Code → Test', 'Write → Run → Delete'],
    correctIndex: 1,
    explanation: 'Write a failing test (red), make it pass with the simplest code (green), then clean up (refactor).',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-tdd-vs-bdd',
    question: 'How does BDD (Behavior-Driven Development) differ from TDD?',
    options: [
      'BDD focuses on describing behavior in business/plain language (e.g. Given/When/Then), aimed at shared understanding with non-engineers; TDD is more implementation-focused',
      'BDD does not use automated tests at all',
      'TDD requires a QA team; BDD does not',
      'They are unrelated to each other'
    ],
    correctIndex: 0,
    explanation: 'BDD tools like Cucumber express scenarios in a structured natural-language format that stakeholders can read.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-mock-stub-spy',
    question: 'What is the difference between a stub, a mock, and a spy?',
    options: [
      'They are interchangeable',
      'A stub returns canned values; a mock is a stub with expectations on how it\'s called; a spy records calls to a real (or fake) function',
      'A spy can only wrap async functions',
      'A mock always replaces the entire module'
    ],
    correctIndex: 1,
    explanation: 'All three replace or observe real dependencies, with different levels of behavior verification.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-flaky-tests',
    question: 'Why is a flaky test (passes/fails without any code change) especially harmful?',
    options: [
      'It always means the feature is broken',
      'People start ignoring red builds, which can hide a real failure — it should be fixed or quarantined immediately',
      'It automatically fails the whole CI pipeline permanently',
      'It cannot be detected by any tooling'
    ],
    correctIndex: 1,
    explanation: 'Flaky tests are usually caused by timing issues or shared state between tests.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-regression-vs-smoke',
    question: 'What is the difference between regression testing and smoke testing?',
    options: [
      'They are the same thing',
      'Regression re-runs existing tests to confirm a change didn\'t break working features; smoke testing is a quick "is it alive?" sanity pass',
      'Smoke testing only applies to mobile apps',
      'Regression testing is always manual, never automated'
    ],
    correctIndex: 1,
    explanation: 'Smoke tests usually run first, before investing time in a deeper regression pass.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-code-vitest-fn',
    question: 'What does `vi.fn()` create in Vitest?',
    code: `const onSave = vi.fn();
component.save();
expect(onSave).toHaveBeenCalledWith({ title: 'Draft' });`,
    options: [
      'A real implementation of a function that must be manually written',
      'A mock function that tracks how it was called, so you can assert on call arguments/count',
      'A snapshot of the current DOM',
      'A fake timer'
    ],
    correctIndex: 1,
    explanation: 'Mock functions are central to testing whether callbacks/handlers were invoked correctly, without needing the real implementation.',
    category: 'Vitest'
  },
  {
    id: 'testing-q-vitest-vs-jest',
    question: 'What is a commonly cited advantage of Vitest over Jest for modern (especially Vite-based) projects?',
    options: [
      'Vitest cannot run in watch mode',
      'Vitest shares config/transform pipeline with Vite, giving faster startup and native ESM/TS support with less configuration',
      'Vitest has no mocking capabilities at all',
      'Jest is no longer maintained'
    ],
    correctIndex: 1,
    explanation: 'Because Vitest reuses Vite\'s existing transform pipeline, there\'s often no separate Babel/ts-jest config needed.',
    category: 'Vitest'
  },
  {
    id: 'testing-q-getby-vs-querryby-vs-findby',
    question: 'In React Testing Library, what is the difference between `getBy`, `queryBy`, and `findBy`?',
    options: [
      'They are aliases for the same query',
      'getBy throws if not found (sync); queryBy returns null if not found (sync); findBy is async and waits for the element to appear',
      'queryBy is async; findBy is sync',
      'getBy can only be used for text content'
    ],
    correctIndex: 1,
    explanation: 'queryBy is the right choice for asserting something is NOT present, since getBy would throw instead.',
    category: 'RTL'
  },
  {
    id: 'testing-q-rtl-query-priority',
    question: 'React Testing Library recommends preferring which query type first, when possible?',
    options: ['getByTestId', 'getByRole', 'getByClassName', 'querySelector via container'],
    correctIndex: 1,
    explanation: 'getByRole most closely reflects how assistive technology and real users perceive the page, encouraging accessible markup.',
    category: 'RTL'
  },
  {
    id: 'testing-q-userevent-vs-fireevent',
    question: 'Why does RTL documentation recommend `userEvent` over `fireEvent` for simulating interactions?',
    options: [
      'fireEvent is deprecated and no longer works',
      'userEvent simulates the full sequence of real browser events (e.g. focus, keydown, keyup) that a single fireEvent call skips',
      'userEvent is synchronous while fireEvent is not',
      'They produce identical behavior; it\'s purely a style preference'
    ],
    correctIndex: 1,
    explanation: 'A real click involves more than one DOM event — userEvent gets much closer to actual user behavior than a raw fireEvent.click().',
    category: 'RTL'
  },
  {
    id: 'testing-q-waitfor',
    question: 'When would you reach for `waitFor()` in a React Testing Library test?',
    options: [
      'To pause the test for a fixed number of milliseconds',
      'To retry an assertion until it passes or times out — for waiting on async UI updates',
      'To mock the fetch API',
      'To render a component'
    ],
    correctIndex: 1,
    explanation: 'waitFor polls the provided callback, which is why it works well for things like "wait until this error message appears."',
    category: 'RTL'
  },
  {
    id: 'testing-q-playwright-locators',
    question: 'What is a key advantage of Playwright locators over storing a raw element handle up front?',
    options: [
      'Locators can only match by CSS class',
      'Locators are lazy and auto-retrying — they re-query the DOM at action time, avoiding stale-element errors',
      'Locators are slower but more accurate',
      'Locators only work in headless mode'
    ],
    correctIndex: 1,
    explanation: 'This auto-waiting behavior is a big part of why Playwright tests are less flaky than tools relying on manual waits.',
    category: 'Playwright'
  },
  {
    id: 'testing-q-page-object-model',
    question: 'What is the Page Object Model (POM) pattern in test automation?',
    options: [
      'A way to serialize page data to JSON',
      'Encapsulating a page\'s locators and interactions behind a class/object, so tests read at a higher level and don\'t repeat selectors',
      'A built-in Playwright API for taking screenshots',
      'A database schema for storing test results'
    ],
    correctIndex: 1,
    explanation: 'When a selector changes, you update it in one place (the page object) instead of every test that uses it.',
    category: 'Playwright'
  },
  {
    id: 'testing-q-playwright-storagestate',
    question: 'What problem does Playwright\'s `storageState` solve?',
    options: [
      'It speeds up screenshot comparisons',
      'It lets you reuse an already-authenticated session (cookies/localStorage) across tests, avoiding a real login flow every time',
      'It stores test results in a database',
      'It is used to configure test retries'
    ],
    correctIndex: 1,
    explanation: 'You log in once, save the storage state to a file, then have subsequent test runs start already authenticated.',
    category: 'Playwright'
  },
  {
    id: 'testing-q-playwright-trace-viewer',
    question: 'What is the Playwright Trace Viewer used for?',
    options: [
      'Writing new test scripts automatically',
      'Post-mortem debugging of a failed test run — timeline, DOM snapshots, network, and console logs at each step',
      'Generating code coverage reports',
      'Load testing an API'
    ],
    correctIndex: 1,
    explanation: 'It\'s especially useful for diagnosing flaky failures that only happen in CI, not locally.',
    category: 'Playwright'
  },
  {
    id: 'testing-q-verification-vs-validation',
    question: 'What is the difference between verification and validation in QA?',
    options: [
      'They are the same activity',
      'Verification asks "are we building the product right?" (meets spec); validation asks "are we building the right product?" (meets user need)',
      'Validation only happens after release',
      'Verification is always manual; validation is always automated'
    ],
    correctIndex: 1,
    explanation: 'A feature can pass verification (matches the spec exactly) while still failing validation (the spec itself was wrong).',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-black-white-box',
    question: 'What is the difference between black-box and white-box testing?',
    options: [
      'Black-box tests behavior against the spec without seeing the code; white-box tests internal paths/branches with knowledge of the implementation',
      'White-box testing is only done by developers, never QA',
      'Black-box testing cannot be automated',
      'They refer to UI color themes being tested'
    ],
    correctIndex: 0,
    explanation: 'Most exploratory/manual QA work is black-box; unit tests written by the developer are typically white-box.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-risk-based-testing',
    question: 'What does "risk-based testing" prioritize?',
    options: [
      'Testing every feature with exactly equal depth',
      'Focusing testing effort on the areas most likely to fail and most costly if they do',
      'Testing only what the CEO requests',
      'Skipping automated tests entirely in favor of manual review'
    ],
    correctIndex: 1,
    explanation: 'This is a pragmatic response to limited time — not all code paths carry equal risk of breaking or equal cost if broken.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-code-coverage',
    question: 'What does "100% code coverage" actually guarantee?',
    options: [
      'The code has zero bugs',
      'Every line/branch ran at least once during tests — it does NOT guarantee correctness of the assertions made',
      'The application is fully accessible',
      'All edge cases have been considered'
    ],
    correctIndex: 1,
    explanation: 'Coverage is a guide to what code paths are exercised, not proof the tests actually assert meaningful things about them.',
    category: 'Fundamentals'
  },
  {
    id: 'testing-q-msw',
    question: 'What is MSW (Mock Service Worker) primarily used for?',
    options: [
      'Compiling TypeScript faster',
      'Intercepting network requests at the network level to return mock responses, without changing application code',
      'Running end-to-end browser tests',
      'Bundling JavaScript for production'
    ],
    correctIndex: 1,
    explanation: 'Because it intercepts at the network layer, the same request/mock-handler code can be reused in both tests and local development.',
    category: 'Tools'
  },
  {
    id: 'testing-q-cross-browser-testing',
    question: 'Why is cross-browser testing still necessary despite modern web standards?',
    options: [
      'All browsers render identically today, so it is unnecessary',
      'Browsers can still differ in CSS support, JS engine behavior, and rendering edge cases, especially for newer features',
      'It is only relevant for testing print stylesheets',
      'It replaces the need for any other kind of testing'
    ],
    correctIndex: 1,
    explanation: 'Feature support and rendering nuances still vary enough that critical flows are worth checking across major browsers.',
    category: 'Fundamentals'
  }
];
