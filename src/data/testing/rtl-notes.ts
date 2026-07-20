import type { Note } from '@/types/content';

// ─── React Testing Library — the standard for component testing: query by what the
// user sees, not implementation details. Pairs with Vitest or Jest as the runner. ──

export const rtlNotes: Note[] = [
  {
    id: 'rtl-why-rtl',
    title: 'Why React Testing Library over Enzyme?',
    summary:
      'RTL tests components the way a user experiences them (visible text, roles, labels) instead of internal state/props — Enzyme tested the latter and is now largely unmaintained.',
    difficulty: 'basic',
    category: 'RTL',
    prerequisites: ['test-fund-choosing-a-stack'],
    keyPoints: [
      "Enzyme let you inspect a component's internal state, props, and shallow-rendered tree directly (`wrapper.state()`, `wrapper.find(MyComponent)`) — powerful, but tests broke on harmless refactors that changed internals without changing behavior.",
      'RTL\'s guiding principle: "the more your tests resemble the way your software is used, the more confidence they can give you" — query the rendered DOM the way a user or screen reader would, not the component tree.',
      "Enzyme never got first-class support for React 18/19's newer APIs and concurrent features — it's effectively unmaintained, which is the practical reason it's fallen out of use, on top of the philosophical one.",
      'RTL has no concept of "shallow rendering" — it always renders real DOM output (via jsdom/happy-dom), which is deliberate: shallow rendering hides bugs that only appear when children actually render.',
      'This is consistently one of the most common React testing interview questions — the expected answer is the user-centric-vs-implementation-detail framing, not just "Enzyme is old."'
    ]
  },
  {
    id: 'rtl-render-and-screen',
    title: 'render() and screen',
    summary:
      '`render()` mounts a component into a virtual DOM; `screen` is the global object you query against — the two building blocks of every RTL test.',
    difficulty: 'basic',
    category: 'RTL',
    prerequisites: ['rtl-why-rtl'],
    keyPoints: [
      '`render(<Component />)` mounts the component into a container attached to `document.body` (via jsdom/happy-dom) and returns utilities, though `screen` is preferred over destructuring those.',
      "`screen` is a singleton bound to `document.body` — using it instead of `render()`'s return value means every query call looks the same regardless of which component rendered what, and autocomplete/IDE support works better.",
      "`screen.debug()` prints the current DOM to the console — the single most useful debugging tool when a query isn't finding what you expect.",
      "RTL auto-cleans up the DOM after each test (via its own `afterEach` registered globally) so components from one test don't leak into the next — this ships automatically when using the testing-library setup."
    ],
    codeSnippet: `import { render, screen } from '@testing-library/react';

test('renders a welcome message', () => {
  render(<Welcome name="Ada" />);
  expect(screen.getByText('Welcome, Ada')).toBeInTheDocument();
});`
  },
  {
    id: 'rtl-queries-getby-queryby-findby',
    title: 'getBy vs queryBy vs findBy',
    summary:
      '`getBy` throws immediately if nothing matches; `queryBy` returns `null` instead of throwing; `findBy` is async and waits for the element to appear.',
    difficulty: 'basic',
    category: 'RTL',
    prerequisites: ['rtl-render-and-screen'],
    keyPoints: [
      '`getByRole(...)` / `getByText(...)`: throws a descriptive error immediately if zero (or more than one) match is found — use for elements that should already be present.',
      "`queryByRole(...)` / `queryByText(...)`: returns `null` instead of throwing — the ONLY correct choice for asserting something is absent (`expect(screen.queryByText('Error')).not.toBeInTheDocument()`), since `getBy` would crash the test before the assertion even runs.",
      '`findByRole(...)` / `findByText(...)`: returns a Promise, retrying the query until it resolves or times out (default 1000ms) — the right tool for anything that appears after an async action (a fetch completing, a state update after a click).',
      'Each has an "All" plural variant (`getAllByRole`, `queryAllByText`, `findAllByRole`) that returns an array instead of throwing on multiple matches.',
      'This exact distinction — especially "why can\'t you use getBy to check something is absent" — is one of the single most common RTL interview questions.'
    ],
    gotcha:
      'Using `getByText` to assert something is NOT rendered throws before your assertion runs, giving a confusing "unable to find element" failure instead of a clean pass/fail on absence — always reach for `queryBy` when checking for absence.',
    codeSnippet: `// present now
screen.getByRole('heading', { name: /dashboard/i });

// absent — must use queryBy, getBy would throw
expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

// appears after an async action
await screen.findByText('Saved successfully');`
  },
  {
    id: 'rtl-query-priority',
    title: 'Query Priority: Prefer getByRole',
    summary:
      "RTL's own docs rank queries by how closely they match how a real user (including assistive tech) finds things — `getByRole` sits at the top, `getByTestId` at the bottom.",
    difficulty: 'intermediate',
    category: 'RTL',
    prerequisites: ['rtl-queries-getby-queryby-findby'],
    keyPoints: [
      'Priority order (most to least recommended): `getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByText` → `getByDisplayValue` → `getByAltText` / `getByTitle` → `getByTestId`.',
      '`getByRole` matches how screen readers and keyboard users navigate a page (buttons, links, headings, form fields all have implicit ARIA roles) — testing this way doubles as a lightweight accessibility check.',
      "`getByTestId` (matching a `data-testid` attribute) is the escape hatch, not the default — it doesn't verify anything about how a real user would find or understand the element, only that a specific attribute exists.",
      "The `{ name: /text/i }` option on `getByRole` matches the element's accessible name (visible text, `aria-label`, or associated `<label>`) — `getByRole('button', { name: /submit/i })` is far more precise than `getByRole('button')` alone on a page with multiple buttons."
    ],
    codeSnippet: `// Preferred — resembles how a real user finds it
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email address');

// Last resort — only when no accessible query fits
screen.getByTestId('cart-item-42');`
  },
  {
    id: 'rtl-user-event-vs-fireevent',
    title: 'userEvent vs fireEvent',
    summary:
      '`fireEvent` dispatches one raw DOM event; `userEvent` simulates the full sequence of events a real browser fires for that interaction — always prefer `userEvent`.',
    difficulty: 'intermediate',
    category: 'RTL',
    prerequisites: ['rtl-render-and-screen'],
    keyPoints: [
      '`fireEvent.click(button)` fires exactly one `click` event — it skips the `pointerdown`/`mousedown`/`focus`/`pointerup`/`mouseup` sequence a real click actually produces.',
      "`userEvent.click(button)` fires that entire realistic sequence, which matters for components that rely on `onMouseDown`, `onFocus`, or hover states — `fireEvent` alone can pass a test against code that's actually broken for real users.",
      "`userEvent.type(input, 'hello')` types character by character, triggering `keydown`/`keypress`/`input`/`keyup` for each one — this catches controlled-input bugs (e.g. a broken `onChange`) that `fireEvent.change` (which sets the value in one shot) would miss.",
      'Every `userEvent` method returns a Promise and needs `await` — `await userEvent.click(button)`, not `userEvent.click(button)` — a very common mistake that causes flaky, order-dependent test failures.',
      'Set up a user instance once per test with `userEvent.setup()` rather than calling the static `userEvent.click(...)` API directly — the modern recommended pattern, since `setup()` also configures a shared clipboard/pointer state.'
    ],
    gotcha:
      'Reaching for `fireEvent.change` on a text input instead of `userEvent.type` is the most common RTL anti-pattern — it can make a genuinely broken controlled input LOOK like it works, since it bypasses the key-by-key event sequence.',
    codeSnippet: `import userEvent from '@testing-library/user-event';

test('submits the form', async () => {
  const user = userEvent.setup();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.click(screen.getByRole('button', { name: /log in/i }));

  expect(onSubmit).toHaveBeenCalledWith({ email: 'ada@example.com' });
});`
  },
  {
    id: 'rtl-waitfor-and-act',
    title: 'waitFor() and act()',
    summary:
      "`waitFor` retries a callback until it stops throwing (or times out) — for async assertions `findBy` doesn't directly cover; `act()` ensures React has flushed all updates before you assert.",
    difficulty: 'intermediate',
    category: 'RTL',
    prerequisites: ['rtl-queries-getby-queryby-findby'],
    keyPoints: [
      "`findBy*` queries are actually `waitFor` + `getBy*` combined — reach for `waitFor` directly when the assertion isn't a simple element query (e.g. waiting for a mock to have been called, or for an element to be REMOVED).",
      '`await waitFor(() => expect(mockFn).toHaveBeenCalledTimes(1))` is the standard pattern for "eventually this side effect happened."',
      "RTL's `render`, `fireEvent`, and `userEvent` already wrap themselves in `act()` internally — you rarely need to call `act()` by hand; needing it manually is usually a sign of an update happening outside RTL's control (a raw `setTimeout` triggering a state update, for instance).",
      'The "not wrapped in act(...)" console warning means a state update happened after the test already moved on — usually fixed by properly awaiting the async operation that triggers it (`findBy`/`waitFor`), not by silencing the warning.'
    ],
    gotcha:
      'Wrapping everything in `act()` "just to make the warning go away" hides a real bug — the update genuinely happened at an unexpected time; find and `await` the actual async operation instead.'
  },
  {
    id: 'rtl-testing-hooks',
    title: 'Testing Custom Hooks',
    summary:
      "A hook can't be called outside a component — `renderHook` from `@testing-library/react` mounts a tiny throwaway component around it so you can call and assert on the hook directly.",
    difficulty: 'intermediate',
    category: 'RTL',
    prerequisites: ['rtl-waitfor-and-act'],
    keyPoints: [
      "`renderHook(() => useCounter())` returns a `result` ref whose `.current` holds the hook's latest return value.",
      "State updates triggered from the test (calling a function the hook returned) must go through `act()` — `renderHook`'s helpers handle this for you when you call the returned function inside `act(() => { ... })`.",
      'For a hook that depends on context (a custom `useAuth()` reading a Context Provider), pass a `wrapper` option to `renderHook` that renders the necessary providers around it.',
      'Prefer testing a hook indirectly through a component that USES it when practical — `renderHook` is best reserved for genuinely reusable, standalone hooks where testing through a throwaway consumer component would be awkward.'
    ],
    codeSnippet: `import { renderHook, act } from '@testing-library/react';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});`
  },
  {
    id: 'rtl-testing-client-components',
    title: 'Testing Next.js Client Components',
    summary:
      "A `'use client'` component renders and tests exactly like any other React component with RTL — the App Router boundary is a build-time concern, not a testing one.",
    difficulty: 'intermediate',
    category: 'RTL',
    prerequisites: ['rtl-user-event-vs-fireevent'],
    keyPoints: [
      "RTL renders the component in isolation — it doesn't know or care whether the file has a `'use client'` directive, since that directive only affects how Next.js bundles/hydrates it in the real app.",
      "Server Components (`async function Page()` with no `'use client'`) generally can't be unit-tested with `render()` the same way, since they're not meant to run on the client at all — test the data-fetching logic they call directly as a plain async function, and cover the rendered output via Playwright E2E instead.",
      'Components that call `next/navigation` hooks (`useRouter`, `usePathname`, `useSearchParams`) need those mocked — see the dedicated note on mocking `next/navigation`.',
      'Server Actions passed as `action` props or called from client components should be mocked the same way as any other async function dependency (`vi.fn().mockResolvedValue(...)`).'
    ]
  },
  {
    id: 'rtl-mocking-next-navigation',
    title: 'Mocking next/navigation',
    summary:
      "`useRouter`, `usePathname`, and `useSearchParams` all need mocking in tests — Next.js's App Router navigation hooks have no real router to talk to inside RTL's jsdom environment.",
    difficulty: 'intermediate',
    category: 'RTL',
    prerequisites: ['rtl-testing-client-components'],
    keyPoints: [
      "`vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }), usePathname: () => '/dashboard', useSearchParams: () => new URLSearchParams() }))` at the top of the test file is the standard pattern.",
      "Assert navigation happened by checking the mocked `push`/`replace` function was called with the expected path — `expect(mockPush).toHaveBeenCalledWith('/login')`.",
      "This mirrors testing `react-router`'s `useNavigate` — mock the navigation hook, assert on the mock, rather than trying to render a real router.",
      'Reusable test helpers (a shared mock router factory) pay off quickly once several component tests need the same navigation mocking boilerplate.'
    ],
    codeSnippet: `vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() })
}));

test('redirects to /login on logout', async () => {
  render(<LogoutButton />);
  await userEvent.click(screen.getByRole('button', { name: /log out/i }));
  expect(mockPush).toHaveBeenCalledWith('/login');
});`
  }
];
