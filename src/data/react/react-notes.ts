import type { Note } from '@/types/content';

export const reactNotes: Note[] = [
  // ─── CORE ───────────────────────────────────────────────────────────────────
  {
    id: 'virtual-dom',
    title: 'Virtual DOM & Reconciliation',
    summary:
      'React keeps a lightweight in-memory copy of the UI, compares old vs new after every change, and only touches the real DOM where something actually changed.',
    difficulty: 'intermediate',
    category: 'core',
    keyPoints: [
      'The virtual DOM is just a tree of plain JavaScript objects that describes what the UI should look like — a cheap blueprint of the real DOM.',
      'When state changes, React builds a fresh virtual tree and compares it with the previous one to work out what changed. This comparison step is called "reconciliation".',
      'Only the parts that actually changed get written to the real DOM. This matters because real DOM operations are slow, while comparing JavaScript objects is fast.',
      'Since React 16, this work is done by "Fiber" — a rewritten engine that breaks rendering into small chunks, so React can pause mid-render to handle something more urgent (like your typing).',
      'The `key` prop is how you tell React "this list item is the same one as last time, just moved" — without it, React may tear items down and rebuild them unnecessarily.'
    ],
    gotcha:
      'Using the array index as a key breaks when items are reordered, added, or removed — React matches items by key, so item state (input text, focus) sticks to the wrong rows. Use a stable, unique ID from your data.',
    codeSnippet: `// Wrong: index key causes remount on reorder
items.map((item, i) => <Item key={i} data={item} />)

// Correct: stable ID
items.map(item => <Item key={item.id} data={item} />)`
  },
  {
    id: 'component-lifecycle',
    title: 'Component Lifecycle (class vs hooks)',
    summary: 'The old class lifecycle methods (mount, update, unmount) and which useEffect pattern replaces each one.',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['use-effect'],
    keyPoints: [
      'componentDidMount ("run once, after the component first appears") → useEffect(() => { ... }, []) — the empty array means "no dependencies, never re-run".',
      'componentDidUpdate ("run when something changes") → useEffect(() => { ... }, [dep]) — re-runs whenever `dep` changes.',
      'componentWillUnmount ("clean up before the component disappears") → return a function from useEffect; React calls it on unmount.',
      'getDerivedStateFromProps ("compute state from props") → usually not needed at all: just calculate the value during render, no hook required.',
      'shouldComponentUpdate ("skip pointless re-renders") → wrap the component in React.memo, and stabilise props with useMemo / useCallback.'
    ],
    codeSnippet: `useEffect(() => {
  const sub = subscribe(id);        // mount / dep-change
  return () => sub.unsubscribe();   // cleanup (unmount / before next run)
}, [id]);`
  },
  {
    id: 'controlled-uncontrolled',
    title: 'Controlled vs Uncontrolled Components',
    summary:
      'Two ways to handle form inputs: React owns the value (controlled), or the browser owns it and you read it when needed (uncontrolled).',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['use-state', 'use-ref'],
    keyPoints: [
      'Controlled: you pass `value` and `onChange`, so the input always shows exactly what is in React state. React is the single source of truth.',
      'Uncontrolled: the browser keeps the value internally; you grab it on demand with `ref.current.value`. No re-render happens on each keystroke.',
      'Go controlled when you need to react to input as it happens — live validation, enabling/disabling a button, or one field depending on another.',
      'Go uncontrolled for big, simple forms where you only care about values on submit. File inputs (`<input type="file">`) can only be uncontrolled — the browser owns file selection for security.'
    ],
    codeSnippet: `// Controlled
const [val, setVal] = useState('');
<input value={val} onChange={e => setVal(e.target.value)} />

// Uncontrolled
const ref = useRef(null);
<input ref={ref} defaultValue="initial" />`
  },

  // ─── HOOKS ──────────────────────────────────────────────────────────────────
  {
    id: 'use-state',
    title: 'useState',
    summary:
      'The hook that gives a function component its own piece of memory — a value that survives re-renders and triggers one when updated.',
    difficulty: 'basic',
    category: 'hooks',
    keyPoints: [
      'Returns a pair: the current value and a function to update it — `const [state, setState] = useState(initial)`.',
      'Calling the setter does not change the value immediately — React schedules a re-render, and the new value appears on the next run of the component. Reading state right after setting it gives you the old value.',
      'When the new value depends on the old one, pass a function: `setState(prev => prev + 1)`. This always receives the latest value, even if several updates are queued.',
      'If the initial value is expensive to compute, pass a function — `useState(() => expensiveCalc())` — and it only runs on the very first render instead of every render.',
      'React batches several setter calls into one re-render inside event handlers (and since React 18, everywhere — timeouts, promises, etc.).',
      'Updating with a value that is the same reference as the current one (`===`) makes React skip the re-render entirely.'
    ],
    gotcha:
      'Mutating an object or array and setting it back does nothing — it is still the same reference, so React bails out of the re-render. Always create a new object/array (spread, map, filter) when updating.',
    codeSnippet: `const [count, setCount] = useState(0);

// Functional update (safe for closures)
setCount(prev => prev + 1);

// Object state — always spread
setUser(prev => ({ ...prev, name: 'Alice' }));`
  },
  {
    id: 'use-effect',
    title: 'useEffect',
    summary: 'The hook for talking to the outside world (APIs, subscriptions, timers) — its code runs after React has updated the screen.',
    difficulty: 'intermediate',
    category: 'hooks',
    prerequisites: ['use-state', 'core-closures'],
    keyPoints: [
      'With no second argument, the effect runs after every single render — usually more often than you want.',
      'The dependency array controls re-runs: `[]` means "only once, after the first render"; `[dep]` means "re-run whenever dep changes".',
      'Return a function from the effect and React runs it as cleanup — before the effect runs again, and when the component unmounts. Use it to unsubscribe, clear timers, or cancel requests.',
      "In development, React 18's Strict Mode deliberately runs every effect twice (mount, cleanup, mount again) to expose effects with missing cleanup — it is a check, not a bug.",
      'Do not use an effect to compute a value from existing state or props ("derived state") — just calculate it during render; an effect would add an extra render for nothing.',
      'The effect function itself cannot be `async` (it must return the cleanup function, not a promise) — declare an async function inside it and call it, or use a data library like SWR.'
    ],
    gotcha:
      'Leaving a value out of the dependency array means the effect keeps using the old value it "captured" when it was created — a stale closure. The eslint-plugin-react-hooks exhaustive-deps rule catches this for you.',
    codeSnippet: `useEffect(() => {
  let active = true;
  fetchData(id).then(data => {
    if (active) setData(data);
  });
  return () => { active = false; }; // cleanup — prevent stale setState
}, [id]);`
  },
  {
    id: 'use-memo-callback',
    title: 'useMemo & useCallback',
    summary:
      'Two hooks that remember (memoise) things between renders — useMemo caches a computed value, useCallback caches a function — so children that depend on them can skip re-rendering.',
    difficulty: 'intermediate',
    category: 'hooks',
    prerequisites: ['rendering-rerender', 'react-memo'],
    keyPoints: [
      '`useMemo(() => compute(dep), [dep])` runs the calculation once, hands back the cached result on later renders, and only recomputes when `dep` changes.',
      '`useCallback(fn, [dep])` keeps returning the same function object between renders. It is literally shorthand for `useMemo(() => fn, [dep])`.',
      'Why that matters: every render normally creates brand-new functions and objects. A memoised child (React.memo) compares props by reference — a new function every render defeats the comparison.',
      'They only pay off when the result feeds something that checks references: a React.memo child, or a dependency array of another hook. Sprinkling them everywhere just adds overhead — profile first.',
      'The cache is not guaranteed forever — React reserves the right to throw it away and recompute, so treat it as a performance hint, not a place to store data.'
    ],
    gotcha:
      'useCallback on its own does nothing — if the child receiving the function is not wrapped in React.memo, it re-renders anyway, and you have paid the memoisation cost for zero benefit.',
    codeSnippet: `const sorted = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);`
  },
  {
    id: 'use-ref',
    title: 'useRef',
    summary: 'A box that holds a value across renders — changing what is in the box never causes a re-render.',
    difficulty: 'basic',
    category: 'hooks',
    keyPoints: [
      'The value lives at `ref.current`. You can read and write it freely — React does not watch it, so nothing re-renders when it changes.',
      'Most common job: getting your hands on a real DOM element — `<div ref={ref} />` puts that element into `ref.current`.',
      'Also perfect for values you need to remember but never display: timer IDs, the previous value of a prop, "is this the first render?" flags.',
      'To let a parent attach a ref to something inside your component, wrap the component in `forwardRef`.',
      'With `useImperativeHandle` you can decide exactly what the parent sees through the ref (e.g. expose only a `focus()` method instead of the whole DOM node).'
    ],
    codeSnippet: `const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// Store previous value
const prevCount = useRef(count);
useEffect(() => { prevCount.current = count; }, [count]);`
  },
  {
    id: 'use-context',
    title: 'useContext',
    summary:
      'Read a value that a component higher up made available to its whole subtree — no need to pass it down through every level as props ("prop drilling").',
    difficulty: 'basic',
    category: 'hooks',
    prerequisites: ['state-vs-props'],
    keyPoints: [
      'Create the channel once: `const Ctx = createContext(defaultValue)`.',
      'Broadcast a value: wrap a subtree in `<Ctx.Provider value={val}>` — everything inside can now read it.',
      'Read it anywhere below: `const val = useContext(Ctx)`. The component re-renders whenever the provided value changes.',
      'The catch: when the value changes, every consumer re-renders — even ones that only care about an unrelated part of it. Keep unrelated data in separate contexts.',
      'Context + useReducer together give you shared, updatable state across a subtree — a lightweight alternative to Redux for smaller apps.'
    ],
    codeSnippet: `const ThemeCtx = createContext<'light' | 'dark'>('light');

function App() {
  return <ThemeCtx.Provider value="dark"><Page /></ThemeCtx.Provider>;
}
function Page() {
  const theme = useContext(ThemeCtx); // 'dark'
}`
  },
  {
    id: 'use-reducer',
    title: 'useReducer',
    summary:
      'An alternative to useState for state with many moving parts: all update logic lives in one pure function, and components just describe what happened.',
    difficulty: 'intermediate',
    category: 'hooks',
    prerequisites: ['use-state'],
    keyPoints: [
      '`useReducer(reducer, initialState)` returns the current state plus a `dispatch` function.',
      'The reducer is a pure function: `(state, action) => newState`. Given the same inputs it always returns the same output, and it never mutates the existing state — it returns a new one.',
      'Components call `dispatch({ type: "INCREMENT", payload: 1 })` — they describe *what happened*, and the reducer decides *how state changes*. This keeps update logic in one testable place.',
      'Reach for it over useState when one action needs to update several values together, or when the next state depends on the previous in non-trivial ways.',
      'Pair it with useContext to share both the state and dispatch across a subtree — a "mini Redux" with no extra library.'
    ],
    codeSnippet: `type Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' };
function reducer(state: number, action: Action) {
  switch (action.type) {
    case 'inc': return state + 1;
    case 'dec': return state - 1;
    case 'reset': return 0;
    default: return state;
  }
}
const [count, dispatch] = useReducer(reducer, 0);`
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    summary:
      'Your own functions starting with "use" that bundle up stateful logic (fetching, subscriptions, form handling) so any component can reuse it with one line.',
    difficulty: 'intermediate',
    category: 'hooks',
    prerequisites: ['hooks-benefits-rules'],
    keyPoints: [
      'The "use" prefix is not just style — it is how React (and its lint rules) know the function follows the Rules of Hooks.',
      'A custom hook is just a function that calls other hooks (useState, useEffect, other custom hooks) and returns whatever the component needs.',
      'Classic candidates: data fetching, event subscriptions, form state, localStorage syncing, media queries, debouncing.',
      'Important: two components using the same hook do NOT share state. Each call gets its own independent copy — hooks share *logic*, not *data*.',
      'Extract a hook when the same stateful logic shows up in two or more components, or when a component has grown hard to read.'
    ],
    codeSnippet: `function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key)!) ?? initial; }
    catch { return initial; }
  });
  const persist = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, persist] as const;
}`
  },

  // ─── PERFORMANCE ────────────────────────────────────────────────────────────
  {
    id: 'react-memo',
    title: 'React.memo',
    summary: 'A wrapper that lets a component skip re-rendering when its props have not actually changed.',
    difficulty: 'intermediate',
    category: 'performance',
    prerequisites: ['rendering-rerender'],
    keyPoints: [
      'Normally, when a parent re-renders, all its children re-render too — even if their props are identical. `React.memo(Component)` breaks that chain.',
      'On each parent render it does a shallow comparison of the new props against the old ones — if every prop is `===` equal, React reuses the previous output and skips the render.',
      '"Shallow" is the catch: objects and functions created fresh each render are never `===` equal, so pair memo with useMemo/useCallback in the parent to keep those references stable.',
      'You can supply your own comparison: `React.memo(Comp, (prev, next) => prev.id === next.id)` — return true to skip the render.',
      'Worth it only when the parent re-renders often and this component is expensive to render. Memoising cheap components costs more than it saves.'
    ],
    gotcha:
      'React.memo only guards against *prop* changes. If the component reads context that changed, or updates its own state, it re-renders regardless of memo.',
    codeSnippet: `const ExpensiveList = React.memo(({ items }: { items: Item[] }) => (
  <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
));`
  },
  {
    id: 'code-splitting',
    title: 'Code Splitting & Lazy Loading',
    summary:
      'Instead of shipping your whole app as one big JavaScript file, split it into chunks and download each one only when the user actually needs it.',
    difficulty: 'intermediate',
    category: 'performance',
    prerequisites: ['es11-dynamic-import'],
    keyPoints: [
      '`React.lazy(() => import("./Heavy"))` turns a component into its own chunk — the browser fetches its code the first time it renders, not on initial page load.',
      'A lazy component must sit inside `<Suspense fallback={<Spinner />}>` — the fallback shows while the chunk downloads.',
      'In Next.js, use `dynamic(() => import("./Heavy"))` instead — it does the same thing but knows about server-side rendering.',
      'The biggest win is splitting by route: users only download the code for the page they are on. Do this before micro-optimising individual components.',
      'You can go further and load a component only when it scrolls into view, using an Intersection Observer to trigger the lazy import.'
    ],
    codeSnippet: `const Chart = React.lazy(() => import('./Chart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart />
    </Suspense>
  );
}`
  },

  // ─── PATTERNS ───────────────────────────────────────────────────────────────
  {
    id: 'compound-components',
    title: 'Compound Components Pattern',
    summary:
      'A family of components designed to be used together (like <Tabs> with <Tabs.List> and <Tabs.Panel>) — the parent holds the state, the children read it silently through context.',
    difficulty: 'advanced',
    category: 'patterns',
    prerequisites: ['use-context'],
    keyPoints: [
      'The parent component owns the shared state (e.g. which tab is active) and puts it in a context.',
      'Each child (Tabs.List, Tabs.Panel) reads that context with useContext — no props need to be wired between them.',
      'The person using your component gets a clean, flexible API: `<Tabs><Tabs.List/><Tabs.Panel/></Tabs>` — they arrange the pieces, the pieces coordinate themselves.',
      'Think of it like `<select>` and `<option>` in HTML: two tags that only make sense together and communicate behind the scenes.',
      'This is how the big headless UI libraries are built — Radix, Headless UI, Reach UI.'
    ],
    codeSnippet: `const TabsCtx = createContext(null);
function Tabs({ children }) {
  const [active, setActive] = useState(0);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
Tabs.List = function List({ labels }) {
  const { active, setActive } = useContext(TabsCtx);
  return labels.map((l, i) => <button onClick={() => setActive(i)} key={i}>{l}</button>);
};`
  },
  {
    id: 'error-boundary',
    title: 'Error Boundaries',
    summary: 'A component that catches crashes in the components below it and shows a fallback UI instead of taking down the whole app.',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'Built with two class lifecycle methods: `getDerivedStateFromError` (switch to the fallback UI) and `componentDidCatch` (log the error).',
      'It only catches errors thrown *during rendering* of its children. Errors in event handlers, setTimeout callbacks, or rejected promises are NOT caught — handle those with try/catch yourself.',
      'This is one of the few things that still requires a class component — stable React has no hook equivalent.',
      'In practice most teams use the `react-error-boundary` library, which wraps the class in a friendly function-component API.',
      'Place one around each route (or each major widget) so a crash in one area shows a local error message instead of a white screen for the entire app.'
    ],
    codeSnippet: `class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { logError(err, info); }
  render() {
    return this.state.hasError
      ? <h2>Something went wrong.</h2>
      : this.props.children;
  }
}`
  },

  // ─── REACT 18/19 ────────────────────────────────────────────────────────────
  {
    id: 'react18-concurrent',
    title: 'React 18 Concurrent Features',
    summary:
      'React 18 lets React work on updates in the background and interrupt them for urgent ones — so heavy re-renders stop making the UI feel frozen.',
    difficulty: 'advanced',
    category: 'react-18',
    prerequisites: ['rendering-fiber'],
    keyPoints: [
      'You opt in by creating the app with `createRoot()` instead of the old `ReactDOM.render()` — that single change enables concurrent rendering.',
      'Automatic batching: multiple state updates are grouped into one re-render everywhere now — including inside setTimeout, promises, and event listeners, not just React event handlers.',
      '`startTransition(fn)` marks the updates inside it as "not urgent". React keeps the current UI interactive and renders the new one in the background — perfect for filtering a big list while the user types.',
      '`useTransition()` gives you the same thing plus an `isPending` flag, so you can show a subtle loading state while the background render happens.',
      '`useDeferredValue(val)` is the read-side version: it hands you a value that lags behind during heavy updates, letting cheap UI (the input) stay snappy while expensive UI (the results) catches up.',
      'Suspense grew beyond lazy loading into data fetching — frameworks like Next.js, Relay, and SWR v2 use it to declare "show this fallback while data loads".'
    ],
    codeSnippet: `import { startTransition, useTransition } from 'react';

const [isPending, startTransition] = useTransition();
startTransition(() => {
  setQuery(inputValue); // non-urgent — can be interrupted
});`
  },
  {
    id: 'server-components',
    title: 'React Server Components (RSC)',
    summary:
      'Components that run only on the server: they can query the database directly and send zero JavaScript to the browser — but they cannot use state or effects.',
    difficulty: 'advanced',
    category: 'react-18',
    prerequisites: ['rendering-ssr'],
    keyPoints: [
      'They execute on the server, so browser-only things are off the table: no useState, no useEffect, no window or event handlers.',
      'Their code never ships to the browser — a huge dependency (a markdown parser, a syntax highlighter) used in a Server Component adds nothing to the client bundle.',
      'Because they run server-side, they can talk to the database, read files, and use secret environment variables directly — no API route needed in between.',
      'Anything interactive needs a Client Component: put `"use client"` at the top of the file, and that component (plus everything it imports) runs in the browser as usual.',
      'In the Next.js App Router this is the default world: every component is a Server Component until you say `"use client"`.',
      'Props passed from server to client must survive being serialised (turned into JSON-like data to cross the network) — so no functions or class instances.'
    ],
    gotcha:
      '"use client" marks a boundary, not just one file — every component imported below it becomes client code too. Server Components can still appear inside a client component, but only when passed in as children/props from the server side.',
    codeSnippet: `// app/page.tsx — Server Component (default in Next.js App Router)
async function Page() {
  const data = await db.query('SELECT * FROM posts'); // server-only
  return <PostList posts={data} />;
}

// components/Counter.tsx
'use client'; // marks this as a client component
import { useState } from 'react';
export function Counter() { ... }`
  },

  // ─── CORE (from GreatFrontEnd) ───────────────────────────────────────────────
  {
    id: 'what-is-react',
    title: 'What is React?',
    summary:
      'A JavaScript library for building user interfaces out of reusable components — you describe what the UI should look like, and React keeps the page in sync.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Declarative: you write "here is what the screen should show for this data", not step-by-step DOM instructions — React figures out the minimal changes needed.',
      'Component-based: the UI is assembled from small, self-contained pieces (a button, a card, a page), each owning its own logic and state.',
      'Under the hood it uses a virtual DOM — an in-memory sketch of the UI — to work out efficiently which parts of the real page need updating.',
      'JSX is the HTML-looking syntax you write components in; it is optional sugar that compiles down to plain function calls.',
      'Data flows one way (parent to child), which keeps apps predictable — plus React has one of the largest ecosystems of tools and libraries around.'
    ],
    codeSnippet: `function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
// Declarative usage
<Welcome name="Ada" />`
  },
  {
    id: 'node-element-component',
    title: 'React Node vs Element vs Component',
    summary:
      'Three easily-confused terms: a component is the recipe, an element is one written-out order from that recipe, and a node is anything React can put on screen.',
    difficulty: 'intermediate',
    category: 'core',
    prerequisites: ['jsx-explained'],
    keyPoints: [
      'React Node — the broadest term: anything renderable. An element, a string, a number, an array of these, a fragment, a portal, or even null/undefined/boolean (which render nothing).',
      'React Element — the small, frozen JavaScript object that JSX (or React.createElement) produces. It *describes* a piece of UI: "a Badge with text=New". It is data, not the UI itself.',
      'React Component — the function (or legacy class) that takes props and returns nodes. Calling it (by rendering it) is what produces elements.',
      'One-line version for interviews: components are the factories, elements are what they produce, nodes are everything React can display.'
    ],
    codeSnippet: `// Component — a factory
function Badge({ text }) { return <span>{text}</span>; }

// Element — what JSX produces (immutable object)
const el = <Badge text="New" />;

// Node — anything renderable, including primitives
const node = 'just a string';`
  },
  {
    id: 'jsx-explained',
    title: 'What is JSX?',
    summary:
      'The HTML-looking syntax you write inside JavaScript — it is not HTML, just a nicer way to write function calls that create React elements.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'JSX stands for JavaScript XML — markup embedded directly in your JavaScript code.',
      'Browsers cannot run JSX. A build tool (Babel or SWC) compiles it into ordinary function calls before it ever reaches the browser.',
      '`<div>Hi</div>` becomes `React.createElement("div", null, "Hi")` — every tag is really just a function call producing an object.',
      'Put any JavaScript expression inside curly braces: `{value}`. Attributes use camelCase and JavaScript names: `className` instead of class, `onClick` instead of onclick.',
      'You could write React entirely without JSX — nobody does, because JSX makes the component tree readable at a glance.'
    ],
    codeSnippet: `const name = 'Ada';
const jsx = <h1 className="title">Hello, {name}</h1>;
// compiles to:
// React.createElement('h1', { className: 'title' }, 'Hello, ', name)`
  },
  {
    id: 'state-vs-props',
    title: 'State vs Props',
    summary:
      'Props are the inputs a component receives from its parent and cannot change; state is the data a component owns and updates itself.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Props come from outside: the parent passes them in, and the child treats them as read-only — a child never modifies its own props.',
      'State lives inside: the component creates it (useState) and updates it through the setter, which tells React to re-render with the new value.',
      'Where should state live? At the lowest component that all interested components share (their "lowest common ancestor") — from there it flows *down* to children as props.',
      "Data flows down, events flow up: a child asks for a change by calling a callback function the parent handed it as a prop. This is React's one-way data flow."
    ],
    codeSnippet: `function Parent() {
  const [count, setCount] = useState(0);        // state
  return <Child value={count} onInc={() => setCount(c => c + 1)} />;
}
function Child({ value, onInc }) {               // props (read-only)
  return <button onClick={onInc}>{value}</button>;
}`
  },
  {
    id: 'key-prop',
    title: 'The `key` Prop',
    summary:
      'A label that tells React "this list item is the same one as last render" — it keeps state attached to the right item, and changing it is the official way to reset a component.',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['virtual-dom'],
    keyPoints: [
      'When a list re-renders, React uses keys to match each new item to its previous version — so it can keep DOM and state where they belong instead of rebuilding everything.',
      'Keys only need to be unique among siblings in the same list, not across your whole app.',
      'Use a stable identifier from your data (a database id, a slug). The array index is only safe for lists that never reorder, grow, or shrink.',
      'Bonus trick: give a component a `key` and change it to force a full reset — React unmounts the old instance and mounts a brand-new one with fresh state (e.g. `<Form key={userId} />` to clear the form when switching users).'
    ],
    gotcha:
      'With index-as-key, deleting the first item shifts every index — React thinks item 2 is now item 1, so input text, checkbox state, and focus visibly attach to the wrong rows.',
    codeSnippet: `items.map((item) => <ListItem key={item.id} value={item.value} />);

// Reset a form by changing its key
<Form key={formId} />;`
  },

  // ─── HOOKS (from GreatFrontEnd) ──────────────────────────────────────────────
  {
    id: 'hooks-benefits-rules',
    title: 'Hooks: Benefits & Rules',
    summary: 'Why hooks replaced classes, and the two rules you must follow for React to keep track of them correctly.',
    difficulty: 'basic',
    category: 'hooks',
    keyPoints: [
      'Hooks let plain function components have state and lifecycle behaviour — no classes, no `this`, no binding methods in constructors.',
      'They fixed the class-era pain of sharing logic: instead of wrapping components in layers of HOCs and render props ("wrapper hell"), you extract a custom hook and call it.',
      'Rule 1: only call hooks at the top level of the component — never inside an if, a loop, or after an early return.',
      'Why: React identifies each hook purely by the *order* it is called in. A conditional hook shuffles that order between renders, and React starts handing the wrong state to the wrong hook.',
      'Rule 2: only call hooks from React function components or from other custom hooks (functions named use...) — not from regular JavaScript functions.',
      'Let tooling enforce this: eslint-plugin-react-hooks flags violations. The React Compiler removes the need for manual memoisation, but these two rules still apply.'
    ],
    gotcha:
      "A hook inside a condition works fine until the condition flips — then the call order changes mid-flight and React's internal bookkeeping is corrupted. The bug appears far from its cause.",
    codeSnippet: `// ❌ conditional hook
if (show) { const [x] = useState(0); }

// ✅ top-level, then branch
const [x, setX] = useState(0);
if (show) { /* use x */ }`
  },
  {
    id: 'useeffect-vs-uselayouteffect',
    title: 'useEffect vs useLayoutEffect',
    summary:
      'Both run code after React updates the DOM — the difference is whether they run before or after the browser paints the frame to the screen.',
    difficulty: 'intermediate',
    category: 'hooks',
    prerequisites: ['use-effect'],
    keyPoints: [
      'useEffect runs *after* the browser has painted — asynchronously, without holding up the frame. The user sees the update immediately, then your effect runs.',
      'That makes useEffect right for almost everything: data fetching, subscriptions, logging, syncing with external systems.',
      'useLayoutEffect runs *synchronously* after React changes the DOM but *before* the browser paints — the screen waits for it to finish.',
      'Its one legitimate job: measure the DOM and immediately adjust it (position a tooltip, size a panel) so the user never sees the un-adjusted version flash.',
      'Both use the same dependency-array rules, and both run twice in development under Strict Mode.',
      'On the server there is no layout to measure, so useLayoutEffect does nothing during server-side rendering and React logs a warning.'
    ],
    gotcha:
      'Defaulting to useLayoutEffect "to be safe" actively hurts performance — it blocks painting on every run. Start with useEffect; switch only if you see a visible flicker.',
    codeSnippet: `useEffect(() => {
  console.log('after paint'); // async, non-blocking
}, []);

useLayoutEffect(() => {
  const w = ref.current.offsetWidth; // measure before paint
}, []);`
  },
  {
    id: 'functional-setstate',
    title: 'Updater Function form of setState',
    summary:
      'Passing a function to the state setter — setX(prev => …) — guarantees you compute from the freshest value, not a stale one your closure captured.',
    difficulty: 'intermediate',
    category: 'hooks',
    prerequisites: ['use-state', 'core-closures'],
    keyPoints: [
      'The problem: a handler "remembers" (closes over) the state value from the render it was created in. By the time it runs, that value may be out of date.',
      'The fix: `setX(prev => prev + 1)`. React calls your function with the latest state — including any updates already queued ahead of it.',
      'Always use it when the next state is derived from the previous state.',
      'It is essential when calling the setter multiple times in one handler — each call builds on the previous one instead of all reading the same snapshot.',
      'Same story when updating after an await, a setTimeout, or a promise callback: the surrounding values are old, the updater function is not.'
    ],
    gotcha:
      'Calling setCount(count + 1) twice in one handler increments by one, not two — both calls read the same captured `count`. setCount(c => c + 1) twice gives you +2.',
    codeSnippet: `const [count, setCount] = useState(0);
const onClick = () => {
  setCount((c) => c + 1);
  setCount((c) => c + 1); // final: +2
};`
  },
  {
    id: 'use-id',
    title: 'useId',
    summary:
      'Generates a unique ID that comes out identical on the server and in the browser — so server-rendered HTML and the client render never disagree.',
    difficulty: 'intermediate',
    category: 'hooks',
    prerequisites: ['rendering-hydration'],
    keyPoints: [
      'Every component instance that calls useId gets its own stable, unique string.',
      "The reason it exists: a naive counter (id-1, id-2, ...) can produce different numbers on the server than on the client, and that mismatch breaks hydration. useId derives the ID from the component's position in the tree, which is the same in both places.",
      'Its intended use is accessibility wiring: connect a `<label htmlFor={id}>` to its `<input id={id}>`, or link aria-describedby to a hint element.',
      'It is NOT for list keys — keys must come from your data, not from a render-time generator.',
      'Running multiple React apps on one page? Give each root an `identifierPrefix` in createRoot/hydrateRoot so their IDs cannot collide.'
    ],
    codeSnippet: `function NameField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Name:</label>
      <input id={id} type="text" />
    </>
  );
}`
  },
  {
    id: 'use-hook-react19',
    title: 'The use() Hook (React 19)',
    summary:
      'Read a promise or a context directly during render — if the promise is still loading, React pauses (suspends) the component and shows the nearest Suspense fallback.',
    difficulty: 'advanced',
    category: 'hooks',
    prerequisites: ['es6-promises', 'use-context'],
    keyPoints: [
      '`use(promise)` unwraps a promise in the middle of render. Not resolved yet? The component suspends — React shows the surrounding `<Suspense>` fallback and retries when the data arrives.',
      '`use(context)` reads a context like useContext does — with one superpower: unlike every other hook, `use` is allowed inside conditions and loops.',
      'Loading states come from `<Suspense>`, error states from error boundaries — your component body just uses the resolved value as if it were always there.',
      "It is a pillar of React 19's data and form story, alongside useActionState and useOptimistic."
    ],
    codeSnippet: `import { use, Suspense } from 'react';

function Profile({ userPromise }) {
  const user = use(userPromise); // suspends until resolved
  return <h1>{user.name}</h1>;
}
// <Suspense fallback={<Spinner/>}><Profile userPromise={p}/></Suspense>`
  },

  // ─── RENDERING ───────────────────────────────────────────────────────────────
  {
    id: 'rendering-rerender',
    title: 'What Re-rendering Means',
    summary:
      'A re-render is React calling your component function again to ask "what should the UI look like now?" — it does not automatically mean the page changes.',
    difficulty: 'basic',
    category: 'rendering',
    prerequisites: ['virtual-dom'],
    keyPoints: [
      'A re-render is literally a function call: React runs your component again from top to bottom.',
      "Three things trigger it: the component's own state changed, it received new props, or its parent re-rendered (children re-render with the parent by default).",
      'The output is a fresh description of the UI (a new virtual tree), which React compares against the previous one — that comparison is reconciliation.',
      'Only the actual differences are applied to the real DOM. Most re-renders end up changing little or nothing on the page.',
      'So "component re-rendered" ≠ "DOM updated" — re-renders are cheap function calls; it is unnecessary DOM work that React is designed to avoid.'
    ],
    codeSnippet: `function Counter() {
  const [n, setN] = useState(0);
  // each setN call re-runs Counter and diffs the output
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`
  },
  {
    id: 'rendering-fiber',
    title: 'React Fiber & Reconciliation',
    summary:
      "Fiber is React's rendering engine (since React 16): it breaks the work of diffing the UI into small, pausable units so urgent updates can jump the queue.",
    difficulty: 'advanced',
    category: 'rendering',
    prerequisites: ['virtual-dom'],
    keyPoints: [
      'Reconciliation is the diffing step: compare the newly rendered element tree with the previous one and work out the minimal set of changes.',
      'Before Fiber, that diff ran in one uninterruptible go ("stack reconciler") — a big tree could freeze the page until it finished.',
      'Fiber restructured rendering into small units of work that React can pause, resume, throw away, or reprioritise.',
      'That is the foundation everything modern stands on: time slicing, concurrent rendering, startTransition, and Suspense all rely on being able to interrupt a render.',
      'Terminology note: the React team now talks about "React elements" and the "Fiber tree" rather than "virtual DOM" — same idea, more precise names.'
    ],
    codeSnippet: `// Conceptual: Fiber splits work so a long render can yield
// to higher-priority updates (e.g. user input) and resume later.`
  },
  {
    id: 'rendering-ssr',
    title: 'Server-Side Rendering (SSR)',
    summary:
      'The server runs your components and sends ready-made HTML, so the user sees content immediately — then the browser "hydrates" it to make it interactive.',
    difficulty: 'advanced',
    category: 'rendering',
    keyPoints: [
      'On each request, the server renders the component tree to an HTML string and sends it — the browser can paint content before downloading any JavaScript.',
      'That HTML is static at first: `hydrateRoot` then runs on the client, attaching event handlers to the existing markup to bring it to life.',
      'Streaming SSR sends the HTML in chunks as it renders (renderToPipeableStream in Node, renderToReadableStream on the Web platform) — slow parts of the page do not block fast parts.',
      'Server Components take it further: parts of the tree render *only* on the server and ship no JavaScript at all.',
      'The trade: faster first paint and reliable SEO, in exchange for server cost, a hydration step, and a new failure mode — server/client mismatch.'
    ],
    gotcha:
      'A hydration mismatch — the client render producing different HTML than the server sent — triggers warnings and can break interactivity. Keep render output deterministic: no Date.now(), no random values, no window checks during render.',
    codeSnippet: `// Client entry
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);`
  },
  {
    id: 'rendering-ssg',
    title: 'Static Generation (SSG) & ISR',
    summary:
      'Render pages to plain HTML once, at build time, and serve those files from a CDN — with ISR letting individual pages rebuild themselves later without a full redeploy.',
    difficulty: 'intermediate',
    category: 'rendering',
    prerequisites: ['rendering-ssr'],
    keyPoints: [
      'SSG (Static Site Generation) does the rendering when you *build* the app, not when a user requests a page — every visitor gets the same pre-made HTML file.',
      'Static files on a CDN are about as fast as the web gets, and search engines index them without any trouble.',
      'In the Next.js App Router, pages are statically generated by default when their data allows it; `generateStaticParams` tells Next which dynamic routes (like /posts/[slug]) to pre-build.',
      'ISR (Incremental Static Regeneration) fixes staleness: after a time limit you set, the next request triggers a background rebuild of just that page — static speed, reasonably fresh content.',
      'Best fit: content that is the same for every user and can tolerate being slightly out of date — blogs, docs, marketing, product listings.'
    ],
    codeSnippet: `// Next.js App Router — build-time params for a dynamic route
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}`
  },
  {
    id: 'rendering-hydration',
    title: 'Hydration',
    summary:
      'The step where React takes over server-rendered HTML in the browser — attaching event listeners and state so the static page becomes a live app.',
    difficulty: 'intermediate',
    category: 'rendering',
    prerequisites: ['rendering-ssr'],
    keyPoints: [
      'Server-side rendering gives the browser finished HTML, but it is inert — buttons render, yet nothing happens on click until hydration runs.',
      'During hydration React renders the app in the browser, but instead of creating DOM nodes it *adopts* the existing ones and wires event handlers onto them.',
      'The contract: the client render must produce the same output as the server did. If they disagree, React warns about a hydration mismatch and interactivity can glitch.',
      'The API is `hydrateRoot(container, <App />)` — the React 18 replacement for the old ReactDOM.hydrate.'
    ],
    gotcha:
      'Anything that differs between server and client breaks the contract: Date.now(), Math.random(), locale formatting, or `typeof window` branches in render. Move such values into useEffect so they only apply after hydration.',
    codeSnippet: `// Avoid: produces different output on server vs client
// <span>{Date.now()}</span>

// Prefer: compute time-dependent values in useEffect (client-only)`
  },
  {
    id: 'rendering-portals',
    title: 'React Portals',
    summary:
      "Render a component's output into a different place in the page's DOM (like document.body) while it still behaves as a normal child in the React tree.",
    difficulty: 'intermediate',
    category: 'rendering',
    keyPoints: [
      '`createPortal(child, container)` renders `child` into any DOM node you choose, anywhere in the document.',
      "The classic reason: modals, tooltips, and dropdowns get clipped by a parent's `overflow: hidden` or stuck under its z-index — a portal escapes that box by rendering at the document root.",
      'Crucially, the component does NOT leave the React tree: context still reaches it, and events still bubble up to its React parent — even though its DOM lives elsewhere.',
      'So it looks like a child to React, but like a top-level element to CSS. Best of both.'
    ],
    codeSnippet: `import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}`
  },

  // ─── DATA FETCHING ─────────────────────────────────────────────────────────
  {
    id: 'data-fetching-modern',
    title: 'Async Data Loading (Modern React)',
    summary:
      'Hand-writing useEffect + fetch is the last resort — data libraries, Server Components, and the use() hook handle the hard parts (caching, races, retries) for you.',
    difficulty: 'intermediate',
    category: 'data-fetching',
    prerequisites: ['use-effect', 'es6-promises'],
    keyPoints: [
      'The React docs themselves steer you away from ad-hoc useEffect + fetch — it is easy to write and very easy to get subtly wrong.',
      'For client-side fetching, use a data library — TanStack Query, SWR, or RTK Query. They give you caching, request deduplication, background refetching, and cache invalidation out of the box.',
      'In a framework, let the framework fetch: Server Components (Next.js App Router) and route loaders (Remix) load data before the UI renders — often no client fetch at all.',
      'React 19 adds `use(promise)`: read a promise during render, suspend until it resolves, and let `<Suspense>` handle the loading UI.',
      'If you truly must hand-roll it, the checklist is long: abort the request on unmount (AbortController), check `res.ok` (fetch does not reject on HTTP errors), and guard against out-of-order responses.'
    ],
    codeSnippet: `// TanStack Query — handles loading/error/caching for you
const { data, isLoading, error } = useQuery({
  queryKey: ['user', id],
  queryFn: () => fetch(\`/api/users/\${id}\`).then((r) => r.json())
});`
  },
  {
    id: 'data-fetching-pitfalls',
    title: 'Data-Fetching Pitfalls',
    summary:
      'The classic ways hand-rolled fetching goes wrong — missing states, leaked requests, and responses arriving in the wrong order.',
    difficulty: 'intermediate',
    category: 'data-fetching',
    prerequisites: ['use-effect', 'async-race-conditions'],
    keyPoints: [
      'Forgetting the loading and error states — users stare at a blank screen, or a failure passes silently.',
      "Leaking requests: if the component unmounts while a fetch is in flight, the response tries to update state that no longer exists. Cancel with an AbortController in the effect's cleanup.",
      'Race conditions: when the user changes a filter quickly, an *older, slower* request can resolve after a newer one and overwrite fresh data with stale data. Guard with an "is this still the latest request?" flag or AbortController.',
      'Fetching during render (not in an effect) re-triggers a render, which fetches again — an infinite loop.',
      'Request waterfalls: fetch A finishes, then fetch B starts, when they could have run in parallel — each sequential hop adds a full round-trip of waiting.',
      'Strict Mode runs effects twice in development, so effects must be safe to run-cleanup-run — which is exactly the discipline that prevents the bugs above.'
    ],
    gotcha:
      'The race condition is the sneaky one: type "ab" quickly and the results for "a" can arrive last, replacing the correct results for "ab". Always invalidate or abort the previous request when dependencies change.',
    codeSnippet: `useEffect(() => {
  const ac = new AbortController();
  fetch(url, { signal: ac.signal })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(setData)
    .catch((e) => { if (e.name !== 'AbortError') setError(e); });
  return () => ac.abort(); // cancel on unmount / url change
}, [url]);`
  },

  // ─── PERFORMANCE (from GreatFrontEnd) ────────────────────────────────────────
  {
    id: 'perf-context-rerenders',
    title: 'Optimizing Context Re-renders',
    summary: 'Every consumer re-renders whenever a context value changes — these techniques limit the blast radius.',
    difficulty: 'advanced',
    category: 'performance',
    prerequisites: ['use-context', 'react-memo'],
    keyPoints: [
      'The baseline problem: one change to a context value re-renders *every* component that consumes it — and React.memo cannot block it, because context bypasses props.',
      'Split contexts by how often they change: put the state in one context and the dispatch/setter functions in another — dispatch never changes, so components that only *write* stop re-rendering on every *read* update.',
      'Memoise the value you pass to the Provider with useMemo — otherwise a fresh `{...}` object every render means "the value changed" every render.',
      'Wrap consumers in React.memo anyway, so they at least skip re-renders caused by unrelated *prop* changes.',
      'For a large context where components need different slices, a selector library (use-context-selector) lets each component subscribe to just its slice.',
      'The React Compiler automates much of this memoisation — reach for it before hand-tuning.'
    ],
    gotcha:
      'The most common self-inflicted wound: `<Ctx.Provider value={{ user, theme }}>` written inline. That object is recreated on every parent render, so every consumer re-renders every time — even when user and theme are unchanged.',
    codeSnippet: `const value = useMemo(() => ({ state }), [state]); // dispatch already stable
return <Ctx.Provider value={value}>{children}</Ctx.Provider>;`
  },
  {
    id: 'perf-react-compiler',
    title: 'The React Compiler',
    summary:
      'A build-time tool (from React 19) that reads your components and inserts memoisation automatically — retiring most hand-written useMemo, useCallback, and React.memo.',
    difficulty: 'advanced',
    category: 'performance',
    prerequisites: ['use-memo-callback'],
    keyPoints: [
      'It analyses your components at build time and memoises components and computed values on its own — no code changes needed.',
      'The manual tools (useMemo, useCallback, React.memo) mostly become unnecessary — the compiler figures out what is stable and what depends on what.',
      'In a compiler-enabled codebase, new code should generally NOT reach for useCallback — write the plain version and let the compiler optimise it.',
      'It is not magic: it relies on your code following the Rules of Hooks and rendering purely. Break the rules and the compiler must skip that component.',
      'The old advice still holds, just with a new twist: profile before optimising by hand — the compiler already covers the common cases.'
    ],
    codeSnippet: `// With the React Compiler, this plain component is auto-memoized —
// no React.memo / useCallback needed for referential stability.
function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
}`
  },

  // ─── PATTERNS (from GreatFrontEnd) ───────────────────────────────────────────
  {
    id: 'patterns-hoc',
    title: 'Higher-Order Components (HOCs)',
    summary:
      'A function that takes a component and returns a beefed-up version of it — the class-era way to share logic, now mostly replaced by hooks.',
    difficulty: 'intermediate',
    category: 'patterns',
    prerequisites: ['fn-higher-order'],
    keyPoints: [
      'The shape: `withX(Component)` returns a new component that renders the original with extra props or behaviour mixed in.',
      'It is the component version of a higher-order function — a function that operates on functions.',
      'This was how the ecosystem shared logic before hooks — `connect()` from React Redux is the most famous example.',
      'The React docs now steer new code toward custom hooks instead — the same reuse without wrapping.',
      'Why they fell out of favour: stacking several HOCs buries your component in wrappers ("wrapper hell"), injected props can silently collide, and the component tree in DevTools becomes hard to read.'
    ],
    codeSnippet: `const withExtraProps = (Wrapped) => (props) =>
  <Wrapped {...props} extraProp="value" />;

const Enhanced = withExtraProps(MyComponent);`
  },
  {
    id: 'patterns-render-props',
    title: 'Render Props',
    summary:
      'A component shares its internal state by calling a function you pass in — "here is my data, you decide what to render with it".',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'You pass a function as a prop (very often as `children`), and the component calls it with its internal state, rendering whatever it returns.',
      'The component owns the *logic* (fetching, tracking, measuring); you own the *markup* — a clean division of labour.',
      'For pure logic-sharing, custom hooks have taken over — no extra component layer, no nested functions in JSX.',
      'Still genuinely useful when the component controls the *rendering structure* itself: virtualised lists ("I decide which rows exist, you say what a row looks like") and headless UI libraries.'
    ],
    codeSnippet: `function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(url).then(r => r.json()).then(setData); }, [url]);
  return children(data);
}

<DataFetcher url="/api/data">
  {(data) => <div>{data ? data.name : 'Loading…'}</div>}
</DataFetcher>;`
  },
  {
    id: 'patterns-composition',
    title: 'Composition Pattern',
    summary: "Build complex UIs by plugging simple components into each other — React's answer to inheritance.",
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      "React's design philosophy: combine (compose) small components rather than extending base classes. There is no component inheritance hierarchy in idiomatic React.",
      'Children: the simplest form — `<Card>{anything}</Card>` receives its content via props.children.',
      'Slots: when one hole is not enough, pass components as named props — `<Layout header={<Nav/>} sidebar={<Menu/>}>`.',
      'Specialisation: a specific component wraps a generic one and pins down some props — `WarningDialog` renders `Dialog` with the icon and colour pre-set.',
      'Compound components: a parent exposes coordinated sub-components (`<Tabs.List/>`, `<Tabs.Panel/>`) that share its state.',
      'Custom hooks are the composition story for *behaviour*, complementing these patterns for *structure*.'
    ],
    codeSnippet: `// Children + slots
function Page({ header, children }) {
  return <div><header>{header}</header><main>{children}</main></div>;
}
<Page header={<Nav />}><Content /></Page>;`
  },

  // ─── ARCHITECTURE ────────────────────────────────────────────────────────────
  {
    id: 'arch-one-way-flow',
    title: 'One-Way Data Flow',
    summary:
      'Data travels strictly downward (parent to child via props); the only way back up is a callback — which is exactly what makes React apps predictable.',
    difficulty: 'basic',
    category: 'architecture',
    prerequisites: ['state-vs-props'],
    keyPoints: [
      "Props flow down the tree, and children treat them as read-only — a child can never reach up and change its parent's data directly.",
      'When a child needs a change, it calls a callback the parent passed down — "data down, events up".',
      "This contrasts with two-way binding (Angular's ngModel, Vue's v-model), where a form field and its data update each other automatically.",
      'The payoff: any piece of state has exactly one owner and one path of change, so you can trace where a value came from — debugging is following a single road, and tools like time-travel debugging become possible.',
      'Patterns you already use fall out of this rule: controlled inputs and immutable state updates are one-way flow applied consistently.'
    ],
    codeSnippet: `function Parent() {
  const [text, setText] = useState('');
  return <Input value={text} onChange={setText} />; // data down, events up
}`
  },
  {
    id: 'arch-flux',
    title: 'The Flux Pattern',
    summary:
      "Facebook's original one-directional state architecture — Action → Dispatcher → Store → View — the design that Redux later simplified and popularised.",
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['arch-one-way-flow'],
    keyPoints: [
      'Actions: plain objects describing something that happened ("user clicked buy").',
      'Dispatcher: the single central hub — every action passes through it on its way to the stores.',
      'Stores: hold the application state and its update logic; when they change, they emit an event.',
      'Views: React components that subscribe to stores and re-render when those events fire.',
      'The whole loop only turns one way: a view never writes to a store directly, it can only dispatch an action.',
      'Flux itself is history — Redux, Zustand, and useReducer + Context replaced it — but its two big ideas (single source of truth, unidirectional flow) are the foundation of all of them.'
    ],
    codeSnippet: `// Conceptual flow
// View → dispatch(action) → Dispatcher → Store updates → View re-renders`
  },
  {
    id: 'arch-state-decision',
    title: 'State vs Context vs External Store',
    summary:
      'A decision guide: local state for one component, context for slow-changing shared values, a store for hot shared state — and a query cache for anything from the server.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['use-state', 'use-context'],
    keyPoints: [
      'Start local: useState / useReducer in the component that needs it. If a sibling needs it too, lift it to the shared parent before reaching for anything heavier.',
      'Context is a *transport*, not a state manager — perfect for values many components read but that rarely change: theme, locale, the logged-in user.',
      'Why not context for everything? Every change re-renders every consumer. State that updates frequently ("hot" state) belongs in a dedicated store — Zustand, Jotai, or Redux Toolkit — which lets components subscribe to just the slice they use.',
      'Server data is its own category: it needs caching, refetching, and invalidation, which is exactly what TanStack Query, SWR, and RTK Query do. Do not mirror API responses into a global store by hand.',
      'Interview framing: the question is not "which is best" but "which kind of state is this?" — local UI state, shared app state, or server cache.'
    ],
    codeSnippet: `// Server state belongs in a query cache, not a global store:
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });`
  },
  {
    id: 'arch-anti-patterns',
    title: 'React Anti-Patterns',
    summary: 'The most common hooks-era mistakes — each one works at first, then produces bugs or slowness that are hard to trace back.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['use-effect', 'key-prop'],
    keyPoints: [
      'Mutating state in place (`state.items.push(x)`) — React compares references, sees the same object, and skips the re-render. Always produce a new value.',
      'Copying props into state (`useState(props.value)`) — the copy goes stale when the prop changes. If it can be computed from props, compute it during render.',
      'Using useEffect to derive data from existing state — an effect means an extra render and a window where the values disagree. Derived data is just a variable in render.',
      'Index-as-key on lists that reorder, or no keys at all — state and DOM attach to the wrong items.',
      'Stale closures: an effect or handler using old values because the dependency array is missing entries.',
      'Forgetting cleanup: subscriptions, timers, and listeners that outlive their component. Also: never mutate a ref during render — refs are for outside the render flow.',
      'Blanket useMemo/useCallback "for performance" — unmeasured memoisation adds cost and noise. Optimise where profiling shows a problem.'
    ],
    gotcha:
      "The derived-state-in-effect pattern is the most common in the wild: setFullName inside useEffect renders twice per change and can briefly show mismatched values. `const fullName = first + ' ' + last` in render does it in one pass, always consistent.",
    codeSnippet: `// ❌ derived state via effect
useEffect(() => setFullName(first + ' ' + last), [first, last]);

// ✅ compute during render
const fullName = first + ' ' + last;`
  },

  // ─── ADDED: topics from the "108 React interview questions" set ──────────────
  {
    id: 'react-accessibility',
    title: 'Accessibility (a11y) in React',
    summary: 'Make your UI usable with a keyboard and a screen reader — semantic HTML first, ARIA only to fill the gaps.',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'Reach for semantic elements first: <button>, <nav>, <label>, <main>. They give you focus and keyboard behaviour for free.',
      'JSX uses htmlFor (not "for") and className; aria-* and role attributes are written as-is.',
      'Every input needs a connected <label htmlFor> — or an aria-label when no visible text exists.',
      'Manage focus on route changes and when opening modals; trap focus inside a dialog and restore it on close.',
      'Tools: eslint-plugin-jsx-a11y catches issues at lint time; axe DevTools / Lighthouse audit at runtime.'
    ],
    gotcha:
      'Putting onClick on a <div> looks fine with a mouse but is invisible to keyboard and screen-reader users — use a real <button> (or add role="button", tabIndex={0}, and key handlers).',
    textbookDef:
      'Web accessibility (a11y) is the practice of building interfaces that people with disabilities can perceive, operate, and understand, typically guided by the WCAG standard and the WAI-ARIA specification.',
    eli5: 'Think of a11y as building ramps next to your stairs. A mouse user takes the stairs; a keyboard or screen-reader user needs the ramp. Semantic HTML is a building that comes with ramps already — plain <div>s are stairs only.',
    codeSnippet: `// ❌ keyboard/screen-reader users can't use this
<div onClick={save}>Save</div>

// ✅ real button: focusable, Enter/Space work, announced as a button
<button onClick={save}>Save</button>

// input must be labelled
<label htmlFor="email">Email</label>
<input id="email" type="email" />`
  },
  {
    id: 'react-typescript',
    title: 'TypeScript with React',
    summary: 'Static types on props, state, and events catch a whole class of bugs before the app ever runs.',
    difficulty: 'intermediate',
    category: 'core',
    keyPoints: [
      'Type a component’s props with an interface/type; the compiler then flags missing or wrong props at the call site.',
      'useState infers the type from its initial value; pass a generic when it can be null/empty: useState<User | null>(null).',
      'Event handlers get precise types: React.ChangeEvent<HTMLInputElement>, React.MouseEvent, etc.',
      'Refs are typed via the element: useRef<HTMLInputElement>(null).',
      'Editor autocomplete, safe refactors, and self-documenting component APIs are the day-to-day payoff.'
    ],
    gotcha:
      'React.FC was the old default but it implicitly adds a children prop and complicates generics — most teams now type props directly as a function parameter instead.',
    eli5: 'TypeScript is a label maker for your data. Once every box is labelled "string" or "User", you can’t accidentally pour a number into the string box — the editor stops you before you ship it.',
    codeSnippet: `interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean; // optional
}

function Button({ label, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

const [user, setUser] = useState<User | null>(null);`
  },
  {
    id: 'react-bundle-size',
    title: 'Bundle Size: Tree Shaking & Dynamic Imports',
    summary: 'Ship less JavaScript by dropping unused code (tree shaking) and loading the rest on demand (code splitting).',
    difficulty: 'advanced',
    category: 'performance',
    prerequisites: ['modules-esm-vs-cjs', 'code-splitting'],
    keyPoints: [
      'Tree shaking: the bundler statically analyses ES module imports and drops exports nothing references — only works with import/export, not CommonJS require.',
      'Import only what you use: import debounce from "lodash/debounce" (not the whole lodash) so the rest can be shaken out.',
      'Dynamic import() + React.lazy/Suspense split a chunk that downloads only when needed (route, modal, heavy chart).',
      'Audit with a bundle analyzer to find the heaviest dependencies before optimising.',
      'Side-effectful modules can block shaking — "sideEffects": false in package.json tells the bundler it’s safe.'
    ],
    gotcha:
      'Default-importing a whole library for one helper (import _ from "lodash") pulls the entire package into your bundle — tree shaking can’t help once it’s a single default import.',
    textbookDef:
      'Tree shaking is dead-code elimination for ES modules: the bundler builds a dependency graph from static import/export statements and excludes any binding that is never imported anywhere.',
    eli5: 'Imagine packing for a trip. Tree shaking is leaving behind clothes you’ll never wear. Code splitting is mailing your winter coat ahead so it only shows up when you actually reach the cold city.',
    codeSnippet: `// Route-level code splitting
const Settings = React.lazy(() => import('./Settings'));

<Suspense fallback={<Spinner />}>
  <Settings />
</Suspense>

// Import the one function so the rest is tree-shaken
import debounce from 'lodash/debounce';`
  },
  {
    id: 'react-animation',
    title: 'Animation in React',
    summary: 'Animate by driving state/props over time — reach for a library so React’s re-renders don’t fight your transitions.',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'Simple cases: toggle a CSS class and let CSS transitions/keyframes do the work — cheapest and GPU-friendly.',
      'Mount/unmount animations need a library, because React removes the DOM node before CSS can animate it out.',
      'Framer Motion: declarative <motion.div animate={…} />, plus AnimatePresence for exit animations.',
      'React Transition Group: low-level enter/exit lifecycle classes; React Spring: physics-based spring values.',
      'Prefer animating transform and opacity (compositor-only) over width/top/left (trigger layout/paint).'
    ],
    gotcha:
      'Animating layout properties (width, height, top) on every frame forces reflow and stutters — animate transform: translate/scale and opacity instead.',
    eli5: 'React is a flip-book artist: it redraws the page when state changes. For smooth motion you hand the in-between frames to an animation library (like Framer Motion) so the flips look like gliding, not jumping.',
    codeSnippet: `import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
    >
      Panel
    </motion.div>
  )}
</AnimatePresence>`
  },
  {
    id: 'react-env-config',
    title: 'Environment Config & Variables',
    summary: 'Keep per-environment settings (API URLs, keys) out of code and inject them at build time per env.',
    difficulty: 'intermediate',
    category: 'architecture',
    keyPoints: [
      'Store config in .env files (.env.development, .env.production) and read it via the bundler — never hardcode URLs.',
      'Client-exposed vars need a prefix so the bundler inlines them: NEXT_PUBLIC_ (Next.js), VITE_ (Vite), REACT_APP_ (CRA).',
      'Anything sent to the browser is public — never put real secrets in a client-exposed variable.',
      'True secrets (DB passwords, private API keys) belong only in server-side env vars, used in route handlers / server components.',
      'Commit a .env.example documenting required keys; keep real .env files out of git.'
    ],
    gotcha:
      'A "secret" in a NEXT_PUBLIC_/VITE_/REACT_APP_ variable is baked into the JS bundle and visible to anyone — those prefixes mean "safe to expose", not "hidden".',
    eli5: 'Env variables are like a settings dial on the back of an appliance. The same React app plugs into "development" or "production" and behaves differently — without you rewiring the appliance itself.',
    codeSnippet: `// .env.production
NEXT_PUBLIC_API_URL=https://api.myapp.com

// usage (inlined at build time)
const base = process.env.NEXT_PUBLIC_API_URL;
fetch(\`\${base}/users\`);

// server-only secret — NOT exposed to the browser
const key = process.env.STRIPE_SECRET_KEY;`
  },

  // ─── ADDED: gaps surfaced from the "React interview questions" PDF sweep ─────
  {
    id: 'redux-fundamentals',
    title: 'Redux Fundamentals (Store, Actions, Reducers)',
    summary:
      'One external container for app state: a single Store holds everything, Actions describe what happened, and pure Reducers compute the next state.',
    difficulty: 'intermediate',
    category: 'state-management',
    prerequisites: ['use-reducer'],
    keyPoints: [
      'Three principles. One: single source of truth — the entire app state lives in one Store, so there is never a question of "which copy is right". Two: state is read-only — the only way to change it is to dispatch an Action. Three: changes are made by pure functions — Reducers take (state, action) and return a brand-new state, never modifying the old one.',
      'An Action is just a plain object with a `type` field saying what happened ("todos/added") and usually a payload carrying the details. `dispatch(action)` is the single doorway for every state change.',
      'A Reducer is a pure function: no API calls, no randomness, no mutation — the same state and action always produce the same result. That predictability is what makes Redux debuggable.',
      'In practice you write Redux with Redux Toolkit: createSlice generates the action types and creators for you, and its Immer integration means code that *looks* like mutation (`state.value += 1`) safely produces a new state under the hood.',
      'Container vs presentational split: "container" components talk to the store (select state, dispatch actions) while "presentational" components just render the props they are given. It predates hooks but still comes up in interviews.'
    ],
    gotcha:
      'React-Redux uses Context internally to pass the store down, but doesn\'t expose it publicly — "is Redux built on Context?" is a common trap question. The real comparison: Context has no built-in devtools/middleware/selectors and re-renders every consumer on change; Redux adds middleware (thunks/sagas), time-travel debugging, and memoized selectors (reselect) for large or frequently-updating state.',
    codeSnippet: `// Redux Toolkit — the modern way
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented(state) { state.value += 1; },        // Immer makes this safe
  },
});

const store = configureStore({ reducer: { counter: counterSlice.reducer } });
store.dispatch(counterSlice.actions.incremented());   // dispatch an Action`
  },
  {
    id: 'react-router',
    title: 'React Router — Client-Side Routing',
    summary: 'react-router-dom decides which components render for which URL, and swaps them on navigation without reloading the page.',
    difficulty: 'intermediate',
    category: 'routing',
    keyPoints: [
      "Two router flavours. <BrowserRouter> gives clean URLs (/users/42) using the browser's History API — but the server must be configured to serve index.html for *every* path, or direct visits to deep links 404. <HashRouter> tucks the route after a # (/#/users/42) — ugly, but works on any static host with zero config, because servers ignore the fragment.",
      '<Routes> with <Route path="..." element={...} /> declares the URL-to-component mapping; nest <Route>s and render an <Outlet /> in the parent to build shared layouts (persistent navbar, changing content).',
      '<Link> and <NavLink> render a real <a> tag but intercept the click and navigate client-side — no page reload. NavLink additionally knows when its route is active, for styling the current nav item.',
      'The v6+ hooks: useNavigate() to redirect from code (after a form submit), useParams() to read dynamic URL segments like /users/:id, useLocation() for the current path, query string, and navigation state.',
      'If you see withRouter or a `history` prop in code, that is the pre-v6, class-component era — modern React Router replaced all of it with hooks.'
    ],
    gotcha:
      'BrowserRouter looks identical to HashRouter in local dev (both just work), but deploying BrowserRouter to a static host without a rewrite rule (serve index.html for all paths) breaks every deep link and page refresh with a 404.',
    codeSnippet: `import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Link to="/users/42">Profile</Link>
      <Routes>
        <Route path="/users/:id" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserPage() {
  const { id } = useParams();          // dynamic segment
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Back (user {id})</button>;
}`
  }
];
