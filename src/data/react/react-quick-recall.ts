import type { QuickRecallSection } from 'types/content';

export const reactQuickRecall: QuickRecallSection[] = [
  {
    title: '🪝 Hooks Cheatsheet',
    items: [
      {
        concept: 'useState',
        bullets: [
          'const [state, setState] = useState(initialValue)',
          'setState(newVal) or setState(prev => newVal) — functional update for derived state',
          'Lazy initializer: useState(() => expensiveCalc()) — runs only once',
          'State updates are batched (React 18 batches everything, including setTimeout)',
          'Updating an object: always spread → setState(prev => ({ ...prev, key: val }))'
        ],
        warning: 'Calling setState with the SAME reference (object/array) does NOT trigger re-render — React bails out.'
      },
      {
        concept: 'useEffect',
        bullets: [
          'No deps array — runs after every render',
          'Empty [] — runs once after mount',
          '[dep1, dep2] — runs when any dep changes',
          'Return cleanup fn — runs before next effect AND on unmount',
          'Do NOT put async directly — wrap in inner async fn'
        ],
        codeSnippet: `useEffect(() => {
  const id = subscribe(userId);
  return () => unsubscribe(id); // cleanup
}, [userId]);`,
        warning: 'Missing dependencies cause stale closures. Use eslint-plugin-react-hooks/exhaustive-deps.'
      },
      {
        concept: 'useCallback & useMemo',
        bullets: [
          'useCallback(fn, [deps]) — memoises function REFERENCE',
          'useMemo(() => compute, [deps]) — memoises computed VALUE',
          'Only effective when result goes to React.memo child or another hook dep',
          'Rule: profile first — premature memoisation adds overhead'
        ],
        warning: 'useCallback alone does nothing without React.memo on the receiving child.'
      },
      {
        concept: 'useRef',
        bullets: [
          'Mutable .current value — persists across renders without causing re-render',
          'DOM access: <div ref={ref} /> → ref.current is the DOM node',
          'Timers, previous values, abort controllers — stored without triggering renders',
          'forwardRef wraps a component so parent can attach a ref to a child DOM element'
        ]
      },
      {
        concept: 'useContext',
        bullets: [
          'const val = useContext(MyCtx) — re-renders on ANY context value change',
          'Split contexts for unrelated state to avoid unnecessary re-renders',
          'Combine with useReducer for scalable app state',
          'Default value is used only when component is rendered outside a Provider'
        ]
      },
      {
        concept: 'useReducer',
        bullets: [
          'const [state, dispatch] = useReducer(reducer, initialState)',
          'reducer(state, action) → newState — must be pure, no mutations',
          'Prefer over useState for complex state transitions or when next state depends on previous',
          'dispatch({ type: "ACTION", payload: data })'
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
          'React keeps a vDOM (JS object tree) — on state change, diffs new vs old vDOM',
          'Only changed real DOM nodes are updated (efficient batched updates)',
          'React Fiber (v16+): work split into units, enabling interruption and prioritisation'
        ]
      },
      {
        concept: 'key prop',
        bullets: [
          'Helps React identify which list items changed / moved / were added / removed',
          'Without key: React uses position — wrong items get updated on reorder',
          'Stable unique ID from data is the correct key',
          'Using index as key causes bugs when items are reordered, filtered, or deleted'
        ],
        warning: 'Never use array index as key when list items can reorder or be inserted/deleted.'
      },
      {
        concept: 'When does a component re-render?',
        bullets: [
          '1. Its own state changes (setState)',
          '2. Its parent re-renders (even if props are the same — unless React.memo)',
          '3. A context it consumes changes',
          '4. Its own forceUpdate is called (class components)'
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
          'HOC that skips re-render if props are shallowly equal',
          'React.memo(Comp, customCompare?) — custom comparator for deep/specific comparison',
          'Does NOT prevent re-render on context change or internal state change'
        ]
      },
      {
        concept: 'Lazy + Suspense',
        bullets: [
          'const Comp = React.lazy(() => import("./Heavy")) — code-split at component level',
          '<Suspense fallback={<Spinner />}> wraps lazy component',
          'Next.js: dynamic(() => import("./Heavy"), { ssr: false })',
          'Route-level splitting has the highest impact'
        ],
        codeSnippet: `const Chart = React.lazy(() => import('./Chart'));
<Suspense fallback={<Spinner />}><Chart /></Suspense>`
      },
      {
        concept: 'React 18 Transitions',
        bullets: [
          'startTransition(fn) — marks updates as non-urgent; UI stays responsive',
          'useTransition() → [isPending, startTransition]',
          'useDeferredValue(val) — defers expensive derived renders',
          'Use for heavy list filtering, search results, tab switches'
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
          'Controlled: value + onChange — React owns the state (single source of truth)',
          'Uncontrolled: ref.current.value — DOM owns the state (read on demand)',
          'Prefer controlled for validation, conditional logic, dependent fields',
          'File inputs MUST be uncontrolled (value is read-only)'
        ]
      },
      {
        concept: 'Compound Components',
        bullets: [
          'Parent owns state in Context; named sub-components consume it',
          'Clean composable API: <Tabs><Tabs.List /><Tabs.Panel /></Tabs>',
          'No prop drilling — implicit state sharing via Context',
          'Used in: Radix UI, Headless UI, Reach UI'
        ]
      },
      {
        concept: 'forwardRef & useImperativeHandle',
        bullets: [
          'forwardRef((props, ref) => ...) — forward a ref from parent to child DOM node',
          'useImperativeHandle(ref, () => ({ focus, reset })) — expose custom API via ref',
          'Use sparingly — prefer declarative state management over imperative refs'
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
          'Effect captures the value of state/props at the time it was created',
          'If deps are missing, the effect uses stale values',
          'Fix: add all referenced values to the dependency array',
          'Alternative: use a ref to store a mutable value without re-running the effect'
        ],
        warning: 'The linter rule exhaustive-deps catches 99% of stale closure bugs. Do not disable it.'
      },
      {
        concept: 'Object/array in deps causes infinite loop',
        bullets: [
          '{ a: 1 } !== { a: 1 } — different reference every render',
          'Putting an inline object or array in deps triggers the effect every render',
          'Fix: useMemo or move the object outside the component if it does not change'
        ],
        codeSnippet: `// ❌ infinite loop — new object every render
useEffect(() => { ... }, [{ id }]);

// ✅ stable dep
useEffect(() => { ... }, [id]);`
      },
      {
        concept: 'React 18 automatic batching',
        bullets: [
          'React 18 batches ALL state updates — inside event handlers, setTimeout, promises, native events',
          'Before React 18: only batched inside React event handlers',
          'To opt out: flushSync(() => setState(val)) — synchronously flush updates',
          'Rarely need to opt out — batching is almost always the right behaviour'
        ]
      }
    ]
  }
];
