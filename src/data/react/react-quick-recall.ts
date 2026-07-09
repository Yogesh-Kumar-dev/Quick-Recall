import type { QuickRecallSection } from '@/types/content';

export const reactQuickRecall: QuickRecallSection[] = [
  {
    title: '🪝 Hooks Cheatsheet',
    items: [
      {
        concept: 'useState',
        bullets: [
          'const [state, setState] = useState(initialValue) — the value plus its setter.',
          'setState(newVal), or setState(prev => newVal) when the new value depends on the old — the function form always sees the latest state.',
          'Expensive initial value? useState(() => expensiveCalc()) runs the function only on the first render.',
          'Multiple setState calls are batched into one re-render (React 18 batches everywhere, even setTimeout).',
          'Updating an object: always copy, never mutate — setState(prev => ({ ...prev, key: val })).'
        ],
        warning:
          'Passing the SAME object/array reference to setState does nothing — React sees "no change" and skips the re-render. Create a new object.'
      },
      {
        concept: 'useEffect',
        bullets: [
          'No deps array → runs after every render.',
          'Empty [] → runs once, after the first render (mount).',
          '[dep1, dep2] → re-runs whenever any listed value changes.',
          'Return a function to clean up — React calls it before the next run and on unmount (unsubscribe, clear timers).',
          "The effect itself can't be async — declare an async function inside it and call it."
        ],
        codeSnippet: `useEffect(() => {
  const id = subscribe(userId);
  return () => unsubscribe(id); // cleanup
}, [userId]);`,
        warning:
          'A value used inside but missing from the deps array goes stale — the effect keeps the old value it captured. The exhaustive-deps lint rule catches this.'
      },
      {
        concept: 'useCallback & useMemo',
        bullets: [
          'useCallback(fn, [deps]) — keeps the same function REFERENCE between renders.',
          'useMemo(() => compute, [deps]) — caches a computed VALUE between renders.',
          "They only pay off when the result feeds a React.memo child or another hook's deps — those compare by reference.",
          'Rule of thumb: profile first. Memoising everything adds overhead without measurable benefit.'
        ],
        warning: "useCallback alone changes nothing — if the child isn't wrapped in React.memo, it re-renders anyway."
      },
      {
        concept: 'useRef',
        bullets: [
          'A mutable box: ref.current survives re-renders, and writing to it never causes one.',
          'DOM access: <div ref={ref} /> puts the actual DOM node in ref.current.',
          'Great for values you need but never display: timer IDs, previous values, AbortControllers.',
          'forwardRef lets a parent attach a ref to a DOM node inside a child component.'
        ]
      },
      {
        concept: 'useContext',
        bullets: [
          "const val = useContext(MyCtx) — reads the nearest Provider's value, re-rendering on ANY change to it.",
          'Keep unrelated data in separate contexts — one shared context means everyone re-renders for everything.',
          'Context + useReducer = shared, updatable state for a subtree without a state library.',
          'The default value (from createContext) only applies when no Provider is above the component.'
        ]
      },
      {
        concept: 'useReducer',
        bullets: [
          'const [state, dispatch] = useReducer(reducer, initialState).',
          'reducer(state, action) → newState — a pure function: no mutation, no side effects.',
          'Components describe what happened — dispatch({ type: "ACTION", payload: data }) — the reducer decides how state changes.',
          'Prefer it over useState when several values change together or transitions are non-trivial.'
        ]
      }
    ]
  },
  {
    title: '🔁 Rendering & Virtual DOM',
    items: [
      {
        concept: 'Virtual DOM & Reconciliation',
        bullets: [
          'The virtual DOM is an in-memory tree of plain JS objects describing the UI. On state change, React builds a new one and compares it with the old (that comparison = reconciliation).',
          'Only the real DOM nodes that actually differ get updated — DOM writes are the expensive part, so React minimises them.',
          'React Fiber (v16+) splits the diffing into small, pausable units of work, so urgent updates (typing) can interrupt slow renders.'
        ]
      },
      {
        concept: 'key prop',
        bullets: [
          "Keys tell React which list item is which across renders — so it knows what moved, what's new, and what's gone.",
          'Without keys, React matches items by position — after a reorder, the wrong items get updated.',
          'The right key is a stable, unique ID that comes from your data.',
          'Index-as-key breaks the moment items reorder, get filtered, or get deleted — state sticks to the wrong rows.'
        ],
        warning: 'Never use the array index as key when items can reorder, be inserted, or be deleted.'
      },
      {
        concept: 'When does a component re-render?',
        bullets: [
          '1. Its own state changes (a setState call).',
          '2. Its parent re-renders — children re-render along with the parent, even with identical props, unless wrapped in React.memo.',
          '3. A context it consumes changes value.',
          '4. forceUpdate is called (class components only).'
        ]
      }
    ]
  },
  {
    title: '⚡ Performance Optimisation',
    items: [
      {
        concept: 'React.memo',
        bullets: [
          'Wraps a component so it skips re-rendering when its props are unchanged (shallow comparison).',
          'React.memo(Comp, customCompare?) — pass your own comparison function for specific/deep checks.',
          "It only guards props — context changes and the component's own state still re-render it."
        ]
      },
      {
        concept: 'Lazy + Suspense',
        bullets: [
          'const Comp = React.lazy(() => import("./Heavy")) — the component becomes its own chunk, downloaded on first render.',
          'Wrap it in <Suspense fallback={<Spinner />}> — the fallback shows while the chunk loads.',
          'In Next.js use dynamic(() => import("./Heavy"), { ssr: false }) — same idea, SSR-aware.',
          "Split by route first — users only download the page they're on. Biggest win for least effort."
        ],
        codeSnippet: `const Chart = React.lazy(() => import('./Chart'));
<Suspense fallback={<Spinner />}><Chart /></Suspense>`
      },
      {
        concept: 'React 18 Transitions',
        bullets: [
          'startTransition(fn) — marks the updates inside as "not urgent", so React can keep the UI responsive and render them in the background.',
          'useTransition() → [isPending, startTransition] — same, plus a flag to show a subtle loading state.',
          'useDeferredValue(val) — hands you a version of the value that lags behind during heavy renders, keeping cheap UI (the input) snappy.',
          'Use for: filtering big lists while typing, search results, tab switches.'
        ]
      }
    ]
  },
  {
    title: '🧩 Component Patterns',
    items: [
      {
        concept: 'Controlled vs Uncontrolled',
        bullets: [
          'Controlled: value + onChange — React state drives the input; the state is the single source of truth.',
          'Uncontrolled: the DOM keeps the value; read it on demand with ref.current.value.',
          'Go controlled when you need live validation, conditional enabling, or fields that depend on each other.',
          'File inputs MUST be uncontrolled — the browser owns file selection (the value is read-only).'
        ]
      },
      {
        concept: 'Compound Components',
        bullets: [
          'The parent owns state and shares it via Context; named sub-components read it silently.',
          'Users get a clean, composable API: <Tabs><Tabs.List /><Tabs.Panel /></Tabs>.',
          'No prop wiring between the pieces — they coordinate through Context behind the scenes.',
          'This is how Radix UI, Headless UI, and Reach UI are built.'
        ]
      },
      {
        concept: 'forwardRef & useImperativeHandle',
        bullets: [
          "forwardRef((props, ref) => ...) — lets a parent's ref reach a DOM node inside the child.",
          'useImperativeHandle(ref, () => ({ focus, reset })) — expose a hand-picked API through the ref instead of the raw DOM node.',
          'Use sparingly — reaching into a child imperatively is the exception; declarative props/state is the rule.'
        ]
      }
    ]
  },
  {
    title: '⚠️ Common Gotchas',
    items: [
      {
        concept: 'Stale closures in useEffect',
        bullets: [
          'An effect "remembers" (closes over) the state and props from the render it was created in.',
          'If a value is used inside but missing from the deps array, the effect keeps using that old snapshot.',
          'Fix: list every value the effect reads in the dependency array.',
          "Alternative when you don't want re-runs: keep the changing value in a ref and read ref.current inside the effect."
        ],
        warning: "The exhaustive-deps lint rule catches 99% of stale-closure bugs. Don't disable it — fix the dependency."
      },
      {
        concept: 'Object/array in deps causes infinite loop',
        bullets: [
          '{ a: 1 } !== { a: 1 } — two literals are different objects, so the reference changes every render.',
          'An inline object or array in the deps array therefore looks "changed" every render — the effect re-fires forever.',
          'Fix: depend on the primitive inside it ([id], not [{ id }]), useMemo the object, or move it outside the component.'
        ],
        codeSnippet: `// ❌ infinite loop — new object every render
useEffect(() => { ... }, [{ id }]);

// ✅ stable dep
useEffect(() => { ... }, [id]);`
      },
      {
        concept: 'React 18 automatic batching',
        bullets: [
          'React 18 groups ALL state updates into one re-render — in event handlers, setTimeout, promises, native events alike.',
          'Before 18, only updates inside React event handlers were batched — a setState in a promise re-rendered immediately.',
          'Need the DOM updated right now (e.g. to measure it)? flushSync(() => setState(val)) forces a synchronous flush.',
          "You'll rarely need to opt out — batching is almost always what you want."
        ]
      },
      {
        concept: 'Conditional rendering patterns',
        bullets: [
          '{condition && <X />} — render X or nothing.',
          '{condition ? <A /> : <B />} — render one or the other.',
          'Early return before the main JSX — swap out the entire component output (loading screens, guards).',
          'Write {list.length > 0 && <List />}, not {list.length && <List />} — booleans/null render nothing, but the number 0 renders as a literal "0" on screen.'
        ],
        codeSnippet: `// ❌ renders a stray "0" when count is 0
{count && <Badge count={count} />}

// ✅ coerce to boolean
{count > 0 && <Badge count={count} />}`,
        warning:
          'count && <X /> prints a literal 0 on screen when count is 0 — false, null, and undefined render nothing, but 0 and NaN render as text.'
      }
    ]
  },
  {
    title: '🗃️ Redux vs Context',
    items: [
      {
        concept: 'When to reach for each',
        bullets: [
          'Context: built in, perfect for values that rarely change (theme, logged-in user, locale) — but it has no middleware, devtools, or selectors.',
          'Redux (Toolkit): adds middleware for async flows (thunks/sagas), time-travel devtools, and memoized selectors (reselect) — worth it for large or frequently-updating state.',
          'React-Redux happens to use Context internally to deliver the store, but Redux is not "just Context" — that\'s a classic trap question.',
          'The performance difference: any Context change re-renders every consumer; Redux with selectors re-renders only the components reading the slice that changed.'
        ]
      }
    ]
  }
];
