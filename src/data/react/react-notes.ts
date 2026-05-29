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
    gotcha: '"use client" creates a boundary — everything below in the tree is a client component. Server components can still be passed as children.',
    codeSnippet: `// app/page.tsx — Server Component (default in Next.js App Router)
async function Page() {
  const data = await db.query('SELECT * FROM posts'); // server-only
  return <PostList posts={data} />;
}

// components/Counter.tsx
'use client'; // marks this as a client component
import { useState } from 'react';
export function Counter() { ... }`
  }
];
