import type { Note } from 'types/content';

export const reactNotes: Note[] = [
  // ─── CORE ───────────────────────────────────────────────────────────────────
  {
    id: 'virtual-dom',
    title: 'Virtual DOM & Reconciliation',
    summary: 'React keeps a lightweight in-memory copy of the DOM and diffs it to minimise real DOM updates.',
    difficulty: 'intermediate',
    category: 'core',
    keyPoints: [
      'Virtual DOM is a plain JS object tree that mirrors the real DOM structure.',
      'On state change, React renders a NEW vDOM tree and diffs it against the previous one (reconciliation).',
      'Only the changed nodes are updated in the real DOM — expensive DOM ops are minimised.',
      'React Fiber (React 16+) replaced the stack reconciler: work is split into units of work, enabling interruption.',
      'key prop tells React which list items are identical across renders — prevents unnecessary remounting.'
    ],
    gotcha: 'Using array index as key causes wrong reconciliation when items reorder/add/remove — use stable unique IDs.',
    codeSnippet: `// Wrong: index key causes remount on reorder
items.map((item, i) => <Item key={i} data={item} />)

// Correct: stable ID
items.map(item => <Item key={item.id} data={item} />)`
  },
  {
    id: 'component-lifecycle',
    title: 'Component Lifecycle (class vs hooks)',
    summary: 'Class lifecycle methods mapped to their useEffect hook equivalents.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'componentDidMount → useEffect(() => { ... }, []) — empty deps, runs once after mount.',
      'componentDidUpdate → useEffect(() => { ... }, [dep]) — runs when dep changes.',
      'componentWillUnmount → return () => { ... } from useEffect — cleanup function.',
      'getDerivedStateFromProps → compute state from props inline during render (no effect needed).',
      'shouldComponentUpdate → React.memo + useMemo / useCallback for optimization.'
    ],
    codeSnippet: `useEffect(() => {
  const sub = subscribe(id);        // mount / dep-change
  return () => sub.unsubscribe();   // cleanup (unmount / before next run)
}, [id]);`
  },
  {
    id: 'controlled-uncontrolled',
    title: 'Controlled vs Uncontrolled Components',
    summary: 'Controlled: form state lives in React state. Uncontrolled: form state lives in the DOM via refs.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Controlled: value + onChange props — React is the single source of truth.',
      'Uncontrolled: use ref.current.value to read value on demand — no re-renders on keystroke.',
      'Prefer controlled for validation, conditional enabling, or dependent fields.',
      'Prefer uncontrolled for large forms with no real-time validation (file inputs must be uncontrolled).'
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
    summary: 'Adds local state to a function component.',
    difficulty: 'basic',
    category: 'hooks',
    keyPoints: [
      'Returns [state, setState] tuple.',
      'State update is asynchronous — do not read state immediately after setState.',
      'Functional update: setState(prev => prev + 1) — use when new state depends on previous.',
      'Lazy initialiser: useState(() => expensiveCalc()) — function runs only on first render.',
      'React batches multiple setState calls inside event handlers (React 18 batches everything).',
      'State updates trigger a re-render; unchanged object/array references do NOT re-render (shallow compare).'
    ],
    gotcha: 'setState with the same reference does NOT trigger a re-render: setState(obj) where obj is the same reference is bailed out.',
    codeSnippet: `const [count, setCount] = useState(0);

// Functional update (safe for closures)
setCount(prev => prev + 1);

// Object state — always spread
setUser(prev => ({ ...prev, name: 'Alice' }));`
  },
  {
    id: 'use-effect',
    title: 'useEffect',
    summary: 'Synchronises a component with an external system; runs after render.',
    difficulty: 'intermediate',
    category: 'hooks',
    keyPoints: [
      'Runs after every render by default.',
      'Dependency array controls when it re-runs: [] = once, [dep] = when dep changes.',
      'Return a cleanup function to run on unmount and before the next effect.',
      'React 18 strict mode: effects run twice in dev to catch missing cleanups.',
      'Do NOT use for derived state — compute it inline during render.',
      'Avoid async directly in useEffect — create an inner async fn or use a library like SWR.'
    ],
    gotcha: 'Missing dependency in the array causes stale closures. Use eslint-plugin-react-hooks to enforce exhaustive-deps.',
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
    summary: 'Memoize expensive values (useMemo) or stable function references (useCallback) to avoid unnecessary re-renders.',
    difficulty: 'intermediate',
    category: 'hooks',
    keyPoints: [
      'useMemo(() => compute(dep), [dep]) — memoises a computed value, recomputes only when dep changes.',
      'useCallback(fn, [dep]) — returns a stable function reference, same as useMemo(() => fn, [dep]).',
      'Only useful when the result is passed to a memoised child (React.memo) or as a useEffect dependency.',
      'Premature memoisation adds overhead — profile first.',
      'useMemo does NOT guarantee the cache is kept forever (React may discard it).'
    ],
    gotcha: 'useCallback is useless without React.memo on the child receiving it. Without memo, the child re-renders regardless.',
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
    summary: 'Returns a mutable ref object that persists across renders without causing re-renders.',
    difficulty: 'basic',
    category: 'hooks',
    keyPoints: [
      'ref.current holds the value — mutating it does NOT trigger a re-render.',
      'Most common use: DOM refs (<div ref={ref} />).',
      'Also used to store mutable values that survive re-renders (timers, previous values, flags).',
      'Pass refs to child components via forwardRef.',
      'useImperativeHandle customises what is exposed when a parent uses ref on a child.'
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
    summary: 'Consume a React context value without prop drilling.',
    difficulty: 'basic',
    category: 'hooks',
    keyPoints: [
      'Create: const Ctx = createContext(defaultValue).',
      'Provide: <Ctx.Provider value={val}> wraps the subtree.',
      'Consume: const val = useContext(Ctx) — triggers re-render when context value changes.',
      'Context causes ALL consumers to re-render on any change — split contexts for unrelated data.',
      'Combine with useReducer for scalable state management without Redux.'
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
    summary: 'Alternative to useState for complex state logic; mirrors Redux pattern.',
    difficulty: 'intermediate',
    category: 'hooks',
    keyPoints: [
      'useReducer(reducer, initialState) returns [state, dispatch].',
      'reducer(state, action) => newState — pure function, no mutations.',
      'dispatch({ type: "INCREMENT", payload: 1 }) triggers reducer.',
      'Prefer over useState when next state depends on multiple previous state values or complex transitions.',
      'Combine with useContext to build a "mini Redux" without external libs.'
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
    summary: 'Functions prefixed with "use" that encapsulate and reuse stateful logic across components.',
    difficulty: 'intermediate',
    category: 'hooks',
    keyPoints: [
      'Must start with "use" — enables React to enforce rules of hooks.',
      'Can call other hooks inside.',
      'Encapsulate: data fetching, subscriptions, form state, local storage, media queries.',
      'Each component call gets its own isolated state — not shared.',
      'Extract when the same logic is used in 2+ components or it clutters the component.'
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
    summary: 'HOC that memoises a component and skips re-rendering if props are shallowly equal.',
    difficulty: 'intermediate',
    category: 'performance',
    keyPoints: [
      'React.memo(Component) wraps the component — shallow-compares props on each parent render.',
      'If props are equal, React reuses the last render result.',
      'Custom comparison: React.memo(Comp, (prev, next) => prev.id === next.id).',
      'Only helps when parent re-renders frequently and this component is expensive.',
      'Combine with useCallback to stabilise function props (otherwise memo is bypassed).'
    ],
    gotcha: 'React.memo does NOT prevent re-render on context changes or internal state changes.',
    codeSnippet: `const ExpensiveList = React.memo(({ items }: { items: Item[] }) => (
  <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
));`
  },
  {
    id: 'code-splitting',
    title: 'Code Splitting & Lazy Loading',
    summary: 'Split JS bundles by route/component and load them on demand to reduce initial load time.',
    difficulty: 'intermediate',
    category: 'performance',
    keyPoints: [
      'React.lazy(() => import("./Heavy")) — dynamically imports a component.',
      'Wrap with <Suspense fallback={<Spinner />}> to show fallback while loading.',
      'Next.js: dynamic(() => import("./Heavy")) — SSR-aware lazy loading.',
      'Route-based splitting is the highest-impact optimisation.',
      'Intersection Observer can trigger lazy loading when a component enters the viewport.'
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
    summary: 'Multiple components share implicit state through context — the parent owns state, children consume it.',
    difficulty: 'advanced',
    category: 'patterns',
    keyPoints: [
      'Parent holds state in context.',
      'Child components (e.g., Tabs.Panel, Tabs.List) read state via useContext.',
      'Consumer gets a clean, composable API: <Tabs><Tabs.List/><Tabs.Panel/></Tabs>.',
      'No prop drilling — state flows through context.',
      'Used in design systems (Radix, Headless UI, Reach UI).'
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
    summary: 'Class components that catch JS errors in their subtree and render a fallback UI.',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'Implemented with componentDidCatch and getDerivedStateFromError.',
      'Catches rendering errors in child components — NOT async errors or event handlers.',
      'Must be a class component (no hook equivalent in stable React).',
      'react-error-boundary library provides a functional wrapper.',
      'Place boundaries at the route level to prevent full-app crashes.'
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
    summary: 'React 18 introduced concurrent rendering, automatic batching, and Transitions.',
    difficulty: 'advanced',
    category: 'react-18',
    keyPoints: [
      'createRoot() enables concurrent mode — replaces ReactDOM.render().',
      'Automatic batching: all state updates (including in setTimeout, promises) are batched.',
      'startTransition(fn) marks updates as non-urgent — UI stays responsive during heavy re-renders.',
      'useTransition() — returns [isPending, startTransition] for inline transition state.',
      'useDeferredValue(val) — defers an expensive derived value.',
      'Suspense for data fetching (via frameworks like Next.js, Relay, SWR v2).'
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
    summary: 'Components that run only on the server — zero client JS, direct DB/FS access, no hooks.',
    difficulty: 'advanced',
    category: 'react-18',
    keyPoints: [
      'Run on the server — no useState, useEffect, browser APIs.',
      'Zero bundle size impact — their JS is never sent to the client.',
      'Can directly access databases, file system, environment variables.',
      'Client components: add "use client" directive — run in browser (or SSR + hydrate).',
      'Next.js App Router: all components are Server Components by default.',
      'Cannot pass non-serialisable props (functions, classes) from server to client.'
    ],
    gotcha:
      '"use client" creates a boundary — everything below in the tree is a client component. Server components can still be passed as children.',
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
    summary: 'A component-based JS library for building UIs declaratively, with a virtual DOM and one-way data flow.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Declarative: describe the UI for a given state; React updates the DOM efficiently.',
      'Component-based: build modular, reusable pieces that own their state and logic.',
      'Virtual DOM: a lightweight in-memory tree enables selective, efficient updates.',
      'JSX: optional HTML-like syntax that compiles to React.createElement calls.',
      'One-way data flow + a large ecosystem make data predictable and tooling rich.'
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
    summary: 'Three terms that are easy to confuse: what React renders, what JSX produces, and what produces it.',
    difficulty: 'intermediate',
    category: 'core',
    keyPoints: [
      'React Node: anything renderable — an element, string, number, array, fragment, portal, null/undefined/boolean.',
      'React Element: the immutable plain object JSX / React.createElement produces, describing what to render.',
      'React Component: a function (or legacy class) that takes props and returns React Nodes.',
      'Elements DESCRIBE the UI; components are the FACTORIES that produce them.'
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
    summary: 'A syntax extension that lets you write HTML-like markup in JS; it compiles to function calls.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'JSX = JavaScript XML — HTML-like syntax inside JavaScript.',
      'Compiled by Babel/SWC into React.createElement (or the jsx runtime).',
      '<div>Hi</div> → React.createElement("div", null, "Hi").',
      'Expressions go in braces: {value}; attributes use camelCase (className, onClick).',
      'Not required, but it makes UI code far more readable.'
    ],
    codeSnippet: `const name = 'Ada';
const jsx = <h1 className="title">Hello, {name}</h1>;
// compiles to:
// React.createElement('h1', { className: 'title' }, 'Hello, ', name)`
  },
  {
    id: 'state-vs-props',
    title: 'State vs Props',
    summary: 'Props are read-only inputs from a parent; state is data a component owns and updates.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Props: passed in by the parent, read-only, cannot be mutated by the child.',
      'State: owned by the component; updating it (via the setter) triggers a re-render.',
      'State lives at the lowest common ancestor that needs it and flows DOWN as props.',
      'Changes flow UP via callbacks passed down as props — React’s one-way data flow.'
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
    summary: 'Gives list items a stable identity across renders — and is the idiomatic way to reset state.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Lets React match each child to the right instance, preserve state, and reorder correctly.',
      'Only needs to be unique among siblings, not globally.',
      'Use a stable id from the data — not the array index for dynamic lists.',
      'Changing a component’s key unmounts the old instance and mounts a fresh one (state reset).'
    ],
    gotcha: 'Array-index keys break reconciliation on reorder/insert/remove — stale state, focus, and DOM attach to the wrong rows.',
    codeSnippet: `items.map((item) => <ListItem key={item.id} value={item.value} />);

// Reset a form by changing its key
<Form key={formId} />;`
  },

  // ─── HOOKS (from GreatFrontEnd) ──────────────────────────────────────────────
  {
    id: 'hooks-benefits-rules',
    title: 'Hooks: Benefits & Rules',
    summary: 'Why hooks exist and the two rules that keep them working correctly.',
    difficulty: 'basic',
    category: 'hooks',
    keyPoints: [
      'Let function components use state and lifecycle without classes.',
      'Solve class-era pain: wrapper hell (HOCs/render props), this-binding, hard logic reuse.',
      'Custom hooks make stateful logic reusable through composition.',
      'Rule 1: only call hooks at the TOP LEVEL — never in loops, conditions, or after an early return.',
      'Rule 2: only call hooks from React functions or other custom hooks (name starts with "use").',
      'Enforce with eslint-plugin-react-hooks; the React Compiler relaxes manual memoization, not these rules.'
    ],
    gotcha: 'Calling a hook conditionally changes the hook call order between renders and corrupts React’s internal state.',
    codeSnippet: `// ❌ conditional hook
if (show) { const [x] = useState(0); }

// ✅ top-level, then branch
const [x, setX] = useState(0);
if (show) { /* use x */ }`
  },
  {
    id: 'useeffect-vs-uselayouteffect',
    title: 'useEffect vs useLayoutEffect',
    summary: 'Both run side effects after render — the difference is timing relative to browser paint.',
    difficulty: 'intermediate',
    category: 'hooks',
    keyPoints: [
      'useEffect runs ASYNCHRONOUSLY after the browser paints — does not block the frame.',
      'Use useEffect for data fetching, subscriptions, logging — most side effects.',
      'useLayoutEffect runs SYNCHRONOUSLY after DOM mutations but BEFORE paint.',
      'Use useLayoutEffect only to measure the DOM and write back in the same frame (avoid flicker).',
      'Both share dependency-array semantics and both double-invoke in Strict Mode (dev).',
      'useLayoutEffect has no effect during SSR (React warns).'
    ],
    gotcha: 'Reaching for useLayoutEffect by default hurts performance — it blocks paint. Default to useEffect.',
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
    summary: 'setX(prev => …) computes from the latest queued state, not a stale closure value.',
    difficulty: 'intermediate',
    category: 'hooks',
    keyPoints: [
      'Guarantees each update uses the latest state, not the value captured in the closure.',
      'Essential when the next state depends on the previous state.',
      'Required when calling the setter more than once in the same handler.',
      'Also needed when the update runs after an await, timeout, or promise.'
    ],
    gotcha: 'setCount(count + 1) called twice in one handler increments only once — use setCount(c => c + 1).',
    codeSnippet: `const [count, setCount] = useState(0);
const onClick = () => {
  setCount((c) => c + 1);
  setCount((c) => c + 1); // final: +2
};`
  },
  {
    id: 'use-id',
    title: 'useId',
    summary: 'Generates a stable, unique ID that matches between server render and client hydration.',
    difficulty: 'intermediate',
    category: 'hooks',
    keyPoints: [
      'Produces a unique string per component instance, per React root.',
      'Exists to avoid SSR/hydration ID mismatches that a plain counter would cause.',
      'Use to link <label htmlFor> with <input id>, not as a list key.',
      'Set identifierPrefix on createRoot/hydrateRoot to avoid collisions across multiple roots.'
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
    summary: 'Reads a resource — a promise or context — during render and suspends until it resolves.',
    difficulty: 'advanced',
    category: 'hooks',
    keyPoints: [
      'use(promise) reads a promise and suspends the component until it settles.',
      'use(context) reads context — and unlike useContext, may be called conditionally.',
      'Pairs with <Suspense> for loading states and error boundaries for failures.',
      'Central to React 19’s data-reading and form story (with useActionState, useOptimistic).'
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
    summary: 'React re-runs a component on state/prop change to produce a new tree, then diffs it.',
    difficulty: 'basic',
    category: 'rendering',
    keyPoints: [
      'A re-render = React calling the component function again.',
      'Triggered by a state change, a new prop, or a parent re-render.',
      'Produces a new virtual tree that React diffs against the previous one.',
      'Only the minimal set of real-DOM changes is applied (reconciliation).',
      'Re-rendering is NOT the same as updating the DOM — most re-renders touch little/no DOM.'
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
    summary: 'Fiber is the interruptible reconciler (React 16+) that diffs trees in resumable units of work.',
    difficulty: 'advanced',
    category: 'rendering',
    keyPoints: [
      'Reconciliation: diffing the new element tree against the previous one to find changes.',
      'Fiber rewrote the old synchronous stack reconciler into interruptible units of work.',
      'React can pause, resume, and prioritize rendering work — keeping the UI responsive.',
      'Enables time slicing, concurrent rendering, and Suspense.',
      'The team now prefers the terms "React elements" and "Fiber tree" over "virtual DOM".'
    ],
    codeSnippet: `// Conceptual: Fiber splits work so a long render can yield
// to higher-priority updates (e.g. user input) and resume later.`
  },
  {
    id: 'rendering-ssr',
    title: 'Server-Side Rendering (SSR)',
    summary: 'Render components to HTML on the server for a fast first paint, then hydrate on the client.',
    difficulty: 'advanced',
    category: 'rendering',
    keyPoints: [
      'The server renders components to HTML and sends it; the browser paints immediately.',
      'hydrateRoot then attaches event handlers to make the markup interactive.',
      'Streaming SSR: renderToPipeableStream (Node) / renderToReadableStream (Web).',
      'Server Components let parts of the tree render only on the server.',
      'Benefits: faster perceived load, better SEO. Costs: slower TTFB, hydration, mismatch risk.'
    ],
    gotcha:
      'Hydration mismatches (server HTML ≠ client render) cause warnings and can break interactivity — keep render output deterministic.',
    codeSnippet: `// Client entry
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);`
  },
  {
    id: 'rendering-ssg',
    title: 'Static Generation (SSG) & ISR',
    summary: 'Pre-render pages to HTML at build time, served from a CDN — with optional incremental rebuilds.',
    difficulty: 'intermediate',
    category: 'rendering',
    keyPoints: [
      'SSG renders pages to plain HTML files at BUILD time, not per request.',
      'CDN-served output makes loads fast and SEO straightforward.',
      'Next.js App Router statically generates fetches by default; generateStaticParams enumerates dynamic routes.',
      'ISR (Incremental Static Regeneration) rebuilds individual pages after a TTL — static needn’t be stale.',
      'Best for content that does not vary per user and tolerates slight staleness.'
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
    summary: 'Attaching event listeners and state to server-rendered HTML so it becomes interactive.',
    difficulty: 'intermediate',
    category: 'rendering',
    keyPoints: [
      'SSR sends static HTML; hydration "wakes it up" on the client.',
      'React reuses the existing DOM and attaches handlers instead of re-creating nodes.',
      'The client render must match the server HTML — mismatches warn and can break.',
      'hydrateRoot replaces the old ReactDOM.hydrate in React 18+.'
    ],
    gotcha: 'Rendering values that differ between server and client (Date.now(), window checks, random) causes hydration mismatches.',
    codeSnippet: `// Avoid: produces different output on server vs client
// <span>{Date.now()}</span>

// Prefer: compute time-dependent values in useEffect (client-only)`
  },
  {
    id: 'rendering-portals',
    title: 'React Portals',
    summary: 'Render children into a DOM node outside the parent hierarchy while staying in the React tree.',
    difficulty: 'intermediate',
    category: 'rendering',
    keyPoints: [
      'createPortal(child, container) renders into a DOM node elsewhere in the document.',
      'Ideal for modals, tooltips, and dropdowns that must escape overflow/z-index constraints.',
      'The portal stays in the React tree — events still bubble to the React parent.',
      'Context continues to flow through normally.'
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
    summary: 'Prefer dedicated libraries, Server Components, or use() over hand-rolled useEffect + fetch.',
    difficulty: 'intermediate',
    category: 'data-fetching',
    keyPoints: [
      'The React docs explicitly recommend against ad-hoc useEffect + fetch for data.',
      'Client fetching: TanStack Query, SWR, or RTK Query — caching, dedup, refetch, invalidation.',
      'Framework-controlled: Server Components and route loaders (Next.js App Router, Remix).',
      'React 19: the use() hook reads a promise and suspends, pairing with <Suspense>.',
      'A manual useEffect+fetch needs AbortController, a res.ok check, and race-condition handling.'
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
    summary: 'The classic mistakes when fetching data in components, and how to avoid them.',
    difficulty: 'intermediate',
    category: 'data-fetching',
    keyPoints: [
      'Not handling loading and error states.',
      'Leaking requests — not aborting in-flight fetches on unmount (use AbortController).',
      'Race conditions when props/query params change mid-flight.',
      'Fetching during render → infinite loops. Fetch in effects or a data layer.',
      'Request waterfalls — sequential dependent fetches that should be parallel.',
      'StrictMode double-invokes effects in dev — write idempotent/cleanup-safe effects.'
    ],
    gotcha: 'A param change can let an older, slower request resolve AFTER a newer one — guard with an "active"/AbortController flag.',
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
    summary: 'Stop unnecessary consumer re-renders by splitting, memoizing, and selecting.',
    difficulty: 'advanced',
    category: 'performance',
    keyPoints: [
      'Any context value change re-renders ALL consumers — and React.memo does NOT stop it.',
      'Split one context into separate state and dispatch contexts; dispatch is stable.',
      'Memoize the value object passed to the Provider (useMemo).',
      'Wrap consumer components in React.memo to skip unrelated prop changes.',
      'Use selector libraries (use-context-selector) to subscribe to a slice of a large value.',
      'The React Compiler auto-memoizes much of this — adopt it before manual tricks.'
    ],
    gotcha: 'Passing value={{ ...obj }} inline creates a new object every render, forcing every consumer to re-render.',
    codeSnippet: `const value = useMemo(() => ({ state }), [state]); // dispatch already stable
return <Ctx.Provider value={value}>{children}</Ctx.Provider>;`
  },
  {
    id: 'perf-react-compiler',
    title: 'The React Compiler',
    summary: 'A build-time compiler (React 19) that auto-memoizes, removing most manual memo work.',
    difficulty: 'advanced',
    category: 'performance',
    keyPoints: [
      'Automatically memoizes components and computed values at build time.',
      'Removes the need for most manual useMemo / useCallback / React.memo.',
      'New code in a compiler-enabled project generally should not reach for useCallback.',
      'The Rules of Hooks still apply — the compiler relies on them.',
      'Profile before hand-memoizing; let the compiler handle the common cases.'
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
    summary: 'A function that takes a component and returns an enhanced one — now largely legacy.',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'withX(Component) returns a new component with extra props or behavior.',
      'Historically used to share logic (e.g. connect from React Redux).',
      'React 19 docs discourage HOCs in favor of custom hooks for logic reuse.',
      'Still seen in older code and libraries — prefer hooks for new code.',
      'Downsides: wrapper hell, prop collisions, and obscured component trees.'
    ],
    codeSnippet: `const withExtraProps = (Wrapped) => (props) =>
  <Wrapped {...props} extraProp="value" />;

const Enhanced = withExtraProps(MyComponent);`
  },
  {
    id: 'patterns-render-props',
    title: 'Render Props',
    summary: 'Share logic via a prop whose value is a function the component calls with its state.',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'A prop (often children) is a function that returns the element to render.',
      'The component invokes it with internal state/data.',
      'Largely replaced by custom hooks for sharing stateful logic.',
      'Still useful for components that own UI structure (virtualized lists, headless libs).'
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
    summary: 'Build UIs by combining components — children, slots, specialization, compound components.',
    difficulty: 'intermediate',
    category: 'patterns',
    keyPoints: [
      'React favors composition over inheritance for reuse.',
      'Children: <Card>{content}</Card> via props.children.',
      'Slots: pass components as named props.',
      'Specialization: a specific component wraps a generic one and fixes some props.',
      'Compound components: a parent exposing related sub-components (<Tabs.List/>).',
      'Custom hooks complement composition for sharing behavior.'
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
    summary: 'Data moves parent → child via props; children change parent state through callbacks.',
    difficulty: 'basic',
    category: 'architecture',
    keyPoints: [
      'Props flow downward; children cannot mutate the props they receive.',
      'To change parent state, a child calls a callback the parent passed down.',
      'Contrasts with two-way binding (Angular, Vue v-model).',
      'Benefits: predictable state changes, easier debugging, time-travel debugging.',
      'Controlled components and immutable updates fall out of this constraint.'
    ],
    codeSnippet: `function Parent() {
  const [text, setText] = useState('');
  return <Input value={text} onChange={setText} />; // data down, events up
}`
  },
  {
    id: 'arch-flux',
    title: 'The Flux Pattern',
    summary: 'Facebook’s unidirectional architecture: Action → Dispatcher → Store → View.',
    difficulty: 'intermediate',
    category: 'architecture',
    keyPoints: [
      'Dispatcher: a single hub that routes actions to all stores.',
      'Stores: hold state + logic and emit change events to subscribed views.',
      'Actions: plain payloads describing what happened.',
      'View: components that subscribe to stores and re-render on changes.',
      'Largely historical — superseded by Redux, Zustand, and useReducer + Context.',
      'Its single-source-of-truth and unidirectional-flow ideas live on in those tools.'
    ],
    codeSnippet: `// Conceptual flow
// View → dispatch(action) → Dispatcher → Store updates → View re-renders`
  },
  {
    id: 'arch-state-decision',
    title: 'State vs Context vs External Store',
    summary: 'Match the tool to the kind of state — and treat server state separately.',
    difficulty: 'intermediate',
    category: 'architecture',
    keyPoints: [
      'Local UI state: useState / useReducer; lift state up before reaching for more.',
      'Rarely-changing shared values (theme, locale, user): Context — it is NOT a state manager.',
      'Frequently-changing shared state across many components: Zustand, Jotai, or Redux Toolkit.',
      'Server state (caching, refetch, invalidation): TanStack Query, SWR, or RTK Query.',
      'Context re-renders all consumers on every change — don’t use it for hot state.'
    ],
    codeSnippet: `// Server state belongs in a query cache, not a global store:
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });`
  },
  {
    id: 'arch-anti-patterns',
    title: 'React Anti-Patterns',
    summary: 'Common hooks-era mistakes that lead to buggy, slow, or unmaintainable components.',
    difficulty: 'intermediate',
    category: 'architecture',
    keyPoints: [
      'Mutating state instead of producing a new value.',
      'Mirroring props (or other state) into useState instead of computing during render.',
      'Using useEffect to derive data that could just be computed inline.',
      'Array index as key for dynamic lists; or no keys at all.',
      'Stale closures in effects from missing/wrong dependencies.',
      'Forgetting effect cleanup (subscriptions, timers, listeners); mutating refs during render.',
      'Sprinkling useMemo/useCallback everywhere instead of where they help.'
    ],
    gotcha: 'Deriving state in useEffect causes an extra render and can desync — compute it during render instead.',
    codeSnippet: `// ❌ derived state via effect
useEffect(() => setFullName(first + ' ' + last), [first, last]);

// ✅ compute during render
const fullName = first + ' ' + last;`
  }
];
