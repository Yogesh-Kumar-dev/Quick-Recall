import type { Article } from '@/types/content';

export const vitestGettingStartedArticle: Article = {
  id: 'vitest-getting-started',
  slug: 'vitest-getting-started',
  title: 'Getting Started with Vitest',
  summary:
    'A from-scratch, beginner-first guide to automated testing with Vitest: why tests matter at all, unit vs integration testing, the full describe/it/expect API, mocking, async tests, snapshots, coverage, testing React components, and the pitfalls that trip people up.',
  topics: ['Testing', 'Vitest', 'React'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: 'If you have only ever checked whether your code works by running the app and clicking around, this article starts from there and builds up to real automated testing. We will cover what a test runner even is and why it matters, then go deep into Vitest specifically: configuration, the describe/it/expect API, mocking, async code, snapshots, coverage, and testing React components with Testing Library. By the end you should be able to write, run, and reason about a real test suite, not just copy a snippet.'
    },
    { type: 'heading', id: 'why-testing-matters', level: 2, text: 'Why bother writing automated tests at all?' },
    {
      type: 'paragraph',
      text: 'Every time you change code, you implicitly make a bet that you have not broken anything else. Early in a small project, you can verify that bet by hand: run the app, click the button, check the number goes up. But as an app grows, so does the number of things a single change could silently break, and manually re-checking all of them after every edit becomes slow, tedious, and easy to skip under deadline pressure. Automated tests are simply code that checks other code, and unlike a human, they run in seconds, never get bored, and never forget to check the edge case you fixed three weeks ago.'
    },
    {
      type: 'paragraph',
      text: 'A "test runner" is the tool that discovers your test files, executes them, and reports which ones passed or failed. Vitest is one such test runner. Without a test runner, you would have to write your own script that imports your code, calls it with sample inputs, and manually compares the output, which is exactly what tools like Vitest automate and standardize.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: "The real payoff isn't catching bugs today, it's catching them tomorrow",
      text: 'The biggest value of a test suite shows up months later, when you (or a teammate) change some shared function and have no idea it is used in five other places. Without tests, that breakage surfaces as a bug report from a user. With tests, it surfaces as a red test result on your own machine, before the code ever ships. Tests are less about proving code is right today and more about getting fast, honest feedback the moment it stops being right.'
    },
    { type: 'heading', id: 'unit-vs-integration', level: 2, text: 'Unit testing vs integration testing' },
    {
      type: 'paragraph',
      text: 'Not all tests check the same scope of code, and the vocabulary for that scope matters because it shapes how you write the test. A unit test checks one small, isolated piece of logic, typically a single function, in complete isolation from everything around it: given this input, is the output exactly what I expect? A pure function like add(2, 3) returning 5 is the textbook unit test target, because it has no dependencies on anything else (no network, no database, no other modules) to fake or work around.'
    },
    {
      type: 'paragraph',
      text: 'An integration test checks that several pieces work correctly together: a React component that renders data, reacts to a click, and updates its own internal state is technically several units (the component function, its event handler, its state) being exercised as one connected whole. Testing Library, covered later in this article, is built specifically for this style: rendering a real component and interacting with it the way a user would, rather than reaching into its internals.'
    },
    {
      type: 'table',
      columns: ['Unit test', 'Integration test'],
      rows: [
        ['Tests one function/module in isolation', 'Tests multiple pieces working together'],
        ['Dependencies are usually mocked/stubbed', 'Real collaborators are used where practical'],
        ['Fast, pinpoints the exact broken piece', 'Slower, closer to how a user actually experiences it'],
        ['Example: add(2, 3) === 5', 'Example: clicking "Add to cart" updates the visible cart count']
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Neither one is "the right one"',
      text: 'Real projects need both. Pure logic (a formatter, a validator, a reducer) is cheapest and most precise to test as a unit test. User-facing behavior (does this form actually submit, does this list actually filter) is better proven with an integration-style test that renders the real component, because a passing unit test on an isolated helper tells you nothing about whether the pieces actually fit together correctly.'
    },
    { type: 'heading', id: 'what-is-vitest', level: 2, text: 'What is Vitest, specifically?' },
    {
      type: 'paragraph',
      text: "Vitest is a test runner built directly on top of Vite, the build tool many modern frontend projects (including this one) already use in development. Because it reuses Vite's exact module resolution, TypeScript/JSX transforms, and plugin pipeline, a Vitest test sees your code exactly the way your dev server does: the same path aliases, the same environment variables, the same everything. There is no separate transform configuration to keep in sync with your real build."
    },
    {
      type: 'paragraph',
      text: "The API surface is intentionally near-identical to Jest, the long-standing incumbent test runner in the JavaScript ecosystem: describe, it, expect, and mocking all feel the same, with vi replacing jest as the mocking namespace's name. That means most of what you already know (or will learn) about Jest-style testing transfers directly, and most existing Jest test files port over with only small find-and-replace changes."
    },
    { type: 'heading', id: 'vitest-vs-jest', level: 2, text: 'Vitest vs Jest, at a glance' },
    {
      type: 'table',
      columns: ['', 'Vitest', 'Jest'],
      rows: [
        ['Config source', 'Reuses vite.config.ts (or a dedicated vitest.config.ts)', 'Separate jest.config.js, its own transform pipeline'],
        ['ESM & TypeScript', 'Native, no extra transform step needed', 'Needs babel-jest or ts-jest configured'],
        ['Watch mode', "Uses Vite's on-demand module graph, very fast reruns", 'Slower, less tightly coupled to a dev bundler'],
        ['Mocking API', 'vi.fn(), vi.mock(), vi.spyOn()', 'jest.fn(), jest.mock(), jest.spyOn()'],
        ['Ecosystem maturity', 'Newer, growing fast, some niche plugins still missing', 'Extremely mature, huge plugin ecosystem'],
        ['Best fit', 'Vite-based projects (Vite, many Vue/React setups)', 'Non-Vite projects, or teams with existing Jest investment']
      ]
    },
    { type: 'heading', id: 'setup', level: 2, text: 'Minimal setup' },
    {
      type: 'paragraph',
      text: 'Install vitest as a dev dependency, then point it at a test environment. The "environment" setting matters more than it looks: node is a plain JavaScript runtime with no browser APIs (window, document) available, which is fine for testing pure logic, but a React component that touches the DOM needs a simulated browser, which is what jsdom provides.'
    },
    {
      type: 'code',
      code: `// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // simulates a browser DOM; use 'node' for non-DOM logic
    globals: true         // lets you skip importing describe/it/expect in every file
  }
});`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'globals: true is a convenience, not a requirement',
      text: "With globals: true, describe/it/expect/vi are available in every test file without an import, similar to how Jest behaves by default. Without it, you explicitly import them from 'vitest' at the top of each file. Explicit imports are slightly more verbose but give your editor better autocomplete and make dependencies obvious; either style is correct, pick one and stay consistent across the codebase."
    },
    { type: 'heading', id: 'core-api', level: 2, text: 'The core API: describe, it, and expect' },
    {
      type: 'paragraph',
      text: 'describe groups related tests together purely for organization and readable output; it (or its alias, test) declares one individual test case, with a description string and a function containing the actual check; expect wraps a value and gives you "matcher" methods (.toBe, .toEqual, .toHaveBeenCalledWith, and many more) to assert what that value should be.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { describe, it, expect, vi } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('calls a callback with the result', () => {
    const onResult = vi.fn();
    add(2, 3, onResult);
    expect(onResult).toHaveBeenCalledWith(5);
  });
});`
    },
    {
      type: 'paragraph',
      text: 'A test "passes" when every expect() call inside it succeeds, and "fails" the moment any single one throws (which is what a failed matcher does internally). One failing expect() is enough to fail the whole it() block; Vitest does not keep evaluating further assertions in that same test after the first failure.'
    },
    { type: 'heading', id: 'matchers', level: 3, text: 'Common matchers you will reach for constantly' },
    {
      type: 'list',
      style: 'unordered',
      items: [
        '.toBe(value): strict equality (===), correct for primitives (numbers, strings, booleans).',
        '.toEqual(value): deep equality, correct for objects and arrays, where two different object instances can still be "equal" if their contents match.',
        '.toBeTruthy() / .toBeFalsy(): checks a value in a boolean context, without caring about its exact type.',
        '.toContain(item): checks an array or string contains a given item/substring.',
        '.toThrow(): checks a function throws an error when called.',
        '.toHaveBeenCalled() / .toHaveBeenCalledWith(...args): checks a mock function (vi.fn()) was invoked, optionally with specific arguments.',
        '.not: prefix any matcher with .not to invert it, e.g. expect(value).not.toBe(null).'
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'toBe vs toEqual is a very common beginner mistake',
      text: 'expect({ id: 1 }).toBe({ id: 1 }) will fail, even though the two objects look identical, because toBe checks that they are the exact same object reference in memory, and these are two separate objects that merely happen to have the same contents. Use toEqual for objects and arrays, and reserve toBe for primitives (or for genuinely checking two variables point at the identical object).'
    },
    { type: 'heading', id: 'mocking', level: 2, text: 'Mocking: vi.fn, vi.mock, and vi.spyOn' },
    {
      type: 'paragraph',
      text: 'A "mock" is a fake stand-in for something real, used in a test so you can observe how it was used (was it called, with what arguments, how many times) without actually running the real thing. Mocking matters most when the real thing is slow (a network request), unpredictable (the current date, a random number), or has side effects you do not want during a test run (sending a real email, writing to a real database).'
    },
    { type: 'heading', id: 'vi-fn', level: 3, text: 'vi.fn(): a fake function you can inspect' },
    {
      type: 'paragraph',
      text: 'vi.fn() creates a brand new function that records every call made to it (its arguments, its return value, how many times it ran) without you having to write any of that bookkeeping yourself. It is most often passed in as a callback prop or argument, exactly like onResult in the earlier example, so a test can later assert the callback was invoked correctly.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const handleClick = vi.fn();
handleClick('hello');

expect(handleClick).toHaveBeenCalled();
expect(handleClick).toHaveBeenCalledTimes(1);
expect(handleClick).toHaveBeenCalledWith('hello');`
    },
    { type: 'heading', id: 'vi-spyOn', level: 3, text: 'vi.spyOn(): watching (or replacing) an existing method' },
    {
      type: 'paragraph',
      text: 'vi.spyOn(object, "methodName") wraps an already-existing method on a real object so you can observe calls to it, while (by default) still letting the real implementation run. You can also chain .mockImplementation() or .mockReturnValue() onto the spy to replace what it actually does, which is useful for controlling something like Math.random() or Date.now() during a test so the result is deterministic.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { vi, expect, it } from 'vitest';

it('logs a warning exactly once', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  doSomethingThatWarns();

  expect(warnSpy).toHaveBeenCalledTimes(1);
  warnSpy.mockRestore(); // put the real console.warn back afterward
});`
    },
    { type: 'heading', id: 'vi-mock', level: 3, text: 'vi.mock(): replacing an entire module' },
    {
      type: 'paragraph',
      text: 'vi.mock() goes a level higher than vi.fn() or vi.spyOn(): instead of faking one function, it replaces an entire imported module with a fake version, for every import of that module path within the test file. This is the tool you reach for when a function under test imports something external, like an API client, and you do not want the real network call to happen during the test.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { vi, describe, it, expect } from 'vitest';
import { fetchUser } from './api';
import { getUserName } from './user-service';

vi.mock('./api', () => ({
  fetchUser: vi.fn()
}));

describe('getUserName', () => {
  it('returns the fetched user\\'s name', async () => {
    vi.mocked(fetchUser).mockResolvedValue({ id: 1, name: 'Ada' });

    const name = await getUserName(1);

    expect(name).toBe('Ada');
    expect(fetchUser).toHaveBeenCalledWith(1);
  });
});`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'vi is the whole mocking namespace, just renamed from jest',
      text: 'vi.fn() for spies/stubs, vi.mock() for module mocks, vi.spyOn() for watching existing methods, vi.useFakeTimers() for controlling time. Same shape as the jest.* API most tutorials assume, just renamed to vi, so any Jest mocking knowledge transfers almost directly.'
    },
    { type: 'heading', id: 'async-testing', level: 2, text: 'Testing async code' },
    {
      type: 'paragraph',
      text: 'A lot of real code is asynchronous: fetching data, waiting on a timer, awaiting a promise. If a test function returns a promise (which an async test function automatically does) and Vitest is not told to wait for it, the test can finish and report "passed" before the actual assertions inside it have even run, silently hiding real failures. The fix is simple but essential: mark the test function async and await anything asynchronous inside it before asserting.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { it, expect } from 'vitest';
import { fetchUser } from './api';

it('resolves with user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Ada');
});

it('rejects for an invalid id', async () => {
  await expect(fetchUser(-1)).rejects.toThrow('Invalid id');
});`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'A forgotten await is a silently useless test',
      text: 'it("works", () => { expect(fetchUser(1)).resolves.toBe(...) }) without the async/await looks reasonable but is broken: the test function returns immediately, before the promise settles, so Vitest marks it as passed regardless of what actually happens inside fetchUser. Always pair an async test body with await on every promise-returning call inside it, including expect(...).resolves/.rejects itself.'
    },
    { type: 'heading', id: 'fake-timers', level: 3, text: 'Fake timers, for testing setTimeout/setInterval without waiting' },
    {
      type: 'paragraph',
      text: 'Code that uses setTimeout or setInterval (a debounce function, a polling loop) is awkward to test with real timers, since your test would have to actually wait out the delay, making the suite slow. vi.useFakeTimers() replaces the real timer functions with fake, instantly-controllable ones: time only "passes" when you explicitly tell it to, with vi.advanceTimersByTime(ms).'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('only calls the function once after the delay', () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 300);

  debounced();
  debounced();
  debounced();

  vi.advanceTimersByTime(300);

  expect(fn).toHaveBeenCalledTimes(1);
});`
    },
    { type: 'heading', id: 'snapshot-testing', level: 2, text: 'Snapshot testing' },
    {
      type: 'paragraph',
      text: 'A snapshot test takes a value (often rendered component output, or a complex object) and saves it to a file the first time the test runs. On every subsequent run, Vitest compares the current value against that saved snapshot. If they match, the test passes. If they differ, the test fails and shows you exactly what changed, so you can decide whether the change was intentional (in which case you update the snapshot) or an accidental regression (in which case you just found a bug).'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { it, expect } from 'vitest';
import { formatUserSummary } from './format';

it('formats a user summary consistently', () => {
  const summary = formatUserSummary({ name: 'Ada', role: 'admin' });
  expect(summary).toMatchSnapshot();
});`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Run vitest -u to update snapshots after an intentional change',
      text: 'When a snapshot test fails because you deliberately changed the output format, do not just delete the failing assertion. Re-run with the -u (update) flag, review the diff Vitest shows you carefully to confirm the new output is actually correct, then commit the updated snapshot file alongside your code change so the two stay in sync.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Snapshots are easy to rubber-stamp without reading',
      text: 'The biggest risk with snapshot testing is treating a failing snapshot as an annoyance to clear rather than a signal to inspect. Blindly running vitest -u every time a snapshot fails, without reading the diff, turns the test into a no-op that can never catch a real regression. Snapshots work best for output that is large, stable, and tedious to assert field-by-field, not as a substitute for actually thinking about what should change.'
    },
    { type: 'heading', id: 'coverage', level: 2, text: 'Coverage: knowing what your tests actually check' },
    {
      type: 'paragraph',
      text: 'Code coverage measures which lines, branches, and functions in your source code were actually executed while the test suite ran. It does not measure whether your tests are good, only whether they touched a given line at all; a test can execute a line without meaningfully asserting anything about it. Still, coverage is a useful signal for finding code with zero tests at all, which is a much easier problem to spot than "which of my existing tests are weak."'
    },
    {
      type: 'code',
      code: `# package.json
"scripts": {
  "test:coverage": "vitest run --coverage"
}`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Coverage percentage is a floor, not a goal',
      text: 'Chasing 100% coverage as a target often produces tests that exist purely to execute a line, with no meaningful assertion, adding maintenance cost without adding confidence. Treat coverage as a tool for finding untested code you forgot about, not as a scoreboard to maximize for its own sake.'
    },
    { type: 'heading', id: 'testing-react-components', level: 2, text: 'Testing React components with @testing-library/react' },
    {
      type: 'paragraph',
      text: "Testing Library is built around a specific philosophy: test your components the way a real user would interact with them (find things by visible text or accessible role, click buttons, type into inputs, then check what appears on screen) rather than reaching into a component's internal state or implementation details. The reasoning is that a test tied to implementation breaks every time you refactor internals, even when user-facing behavior has not changed at all, while a test tied to visible behavior only breaks when behavior actually changes."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('starts at zero and increments on click', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});`
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'render(<Component />): mounts the component into a simulated DOM (jsdom) for the test.',
        'screen: the object you query the rendered output through, e.g. screen.getByRole, screen.getByText, screen.queryByText.',
        'getBy... throws immediately if nothing matches, useful for asserting something must be present.',
        'queryBy... returns null instead of throwing, useful for asserting something is absent.',
        'findBy... returns a promise and waits for the element to appear, useful for content that shows up after an async update.',
        'userEvent: simulates real user interactions (click, type, tab) more faithfully than firing raw DOM events directly.'
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Prefer getByRole with an accessible name over getByTestId',
      text: 'Querying by role and accessible name (screen.getByRole("button", { name: /submit/i })) verifies your markup is actually accessible (a screen reader would find the same element the same way) while also being resilient to unrelated markup changes. Reaching for data-testid attributes everywhere works, but it tests nothing about accessibility and tends to accumulate as clutter; save it for the rare case where no accessible query reasonably applies.'
    },
    { type: 'heading', id: 'common-pitfalls', level: 2, text: 'Common pitfalls' },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Forgetting environment: "jsdom": tests that render components fail with cryptic "document is not defined" errors when the environment is left at the default node.',
        "Testing implementation details instead of behavior: asserting a component's internal state variable directly, rather than what it renders, makes tests brittle and breaks them on harmless refactors.",
        'Not awaiting async assertions: as covered above, a missing await can make a test report "passed" while never actually checking anything.',
        'Over-mocking: replacing so much of the real system with mocks that the test only proves your mocks behave the way you told them to, not that the real code works.',
        "Shared mutable state between tests: forgetting to reset a mock (vi.clearAllMocks() in beforeEach/afterEach) or module-level variable can make one test's leftover state silently affect the next test's result.",
        'Blindly updating snapshots: running vitest -u on every failure without reading the diff turns snapshot tests into a rubber stamp that can no longer catch regressions.'
      ]
    },
    { type: 'heading', id: 'watch-mode', level: 2, text: 'Watch mode vs a single CI run' },
    {
      type: 'paragraph',
      text: "Running vitest with no arguments starts watch mode by default: it stays running, watches your files, and re-runs only the tests whose dependency graph actually changed, mirroring Vite's dev-server hot-reload granularity. This is the mode you want while actively writing code, since feedback comes back almost instantly after every save."
    },
    {
      type: 'paragraph',
      text: 'vitest run performs a single pass over the whole suite and exits with a pass/fail status code, which is what a CI pipeline (or a package.json "test" script meant to be run once) should use instead, since watch mode never exits on its own and would hang a CI job indefinitely.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Two separate npm scripts is the common convention',
      text: 'Most projects define both: "test": "vitest" for local development (watch mode) and "test:ci" or a --run flag variant for continuous integration, so contributors get fast local feedback while CI still gets a clean, deterministic single pass.'
    }
  ]
};
