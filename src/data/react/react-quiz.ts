import type { QuizQuestion } from '@/types/content';

// ─── React quiz — multiple choice ──────────────────────────────────────────

export const reactQuiz: QuizQuestion[] = [
  {
    id: 'react-q-keys',
    question: 'Why does React ask for a stable `key` prop on list items?',
    options: [
      "It's only used for logging warnings",
      'To identify which items changed/added/removed across re-renders',
      'To set the DOM element id',
      "It's required for CSS styling of lists"
    ],
    correctIndex: 1,
    explanation: 'Keys let React match list items between renders, avoiding unnecessary unmount/remount and state loss.',
    category: 'Rendering'
  },
  {
    id: 'react-q-index-key',
    question: 'Using the array index as a `key` is problematic mainly when:',
    options: [
      'The list never changes order or length',
      'The list can be reordered, filtered, or items inserted/removed',
      'The list has fewer than 10 items',
      'It is never actually problematic'
    ],
    correctIndex: 1,
    explanation: 'Index keys shift when the list changes shape, causing React to misattribute state/DOM nodes to the wrong items.',
    category: 'Rendering'
  },
  {
    id: 'react-q-useeffect-deps',
    question: 'What happens if you omit the dependency array entirely from `useEffect`?',
    options: ['The effect runs only once, on mount', 'The effect runs after every render', 'The effect never runs', "It's a compile error"],
    correctIndex: 1,
    explanation: 'No dependency array means React re-runs the effect after every render — `[]` is what limits it to mount-only.',
    category: 'Hooks'
  },
  {
    id: 'react-q-usestate-batch',
    question: 'Calling `setState` does what to the current render?',
    options: [
      'Immediately mutates the variable in place',
      'Schedules a re-render with the new value; the current closure still sees the old value',
      'Throws if called more than once per render',
      'Synchronously blocks until the DOM updates'
    ],
    correctIndex: 1,
    explanation: 'State updates are asynchronous/batched — reading the state variable right after calling its setter still returns the old value.',
    category: 'Hooks'
  },
  {
    id: 'react-q-usememo',
    question: '`useMemo` is primarily used to:',
    options: [
      'Persist state across unmounts',
      'Memoize an expensive computed value between renders',
      'Force a component to always re-render',
      'Replace `useEffect` for side effects'
    ],
    correctIndex: 1,
    explanation: 'It caches a computed value and only recomputes when one of its dependencies changes.',
    category: 'Hooks'
  },
  {
    id: 'react-q-controlled-input',
    question: 'A "controlled" form input is one whose value is:',
    options: [
      'Read directly from the DOM via a ref only',
      'Driven by React state and updated via onChange',
      'Set once on mount and never updated again',
      'Managed entirely by the browser with no React involvement'
    ],
    correctIndex: 1,
    explanation: "The input's `value` comes from state, and `onChange` updates that state — React is the single source of truth.",
    category: 'Forms'
  },
  {
    id: 'react-q-context-rerender',
    question: 'When a Context value changes, which components re-render?',
    options: [
      'Only the Provider itself',
      'Every component in the tree',
      'Every component that consumes that Context via useContext/Context.Consumer',
      'No components — Context updates are passive'
    ],
    correctIndex: 2,
    explanation: 'All consumers of that specific Context re-render on a value change, regardless of where they sit in the tree.',
    category: 'State management'
  },
  {
    id: 'react-q-strict-mode-double-render',
    question: 'Why do components sometimes render twice in development under `<StrictMode>`?',
    options: [
      "It's a bug in React",
      'To help surface side effects that aren\'t pure (impure render logic)',
      'Because two browser tabs are open',
      'It only happens in production builds'
    ],
    correctIndex: 1,
    explanation: 'StrictMode intentionally double-invokes render (and some effects) in dev to help catch impure/unsafe code.',
    category: 'Rendering'
  },
  {
    id: 'react-q-usecallback',
    question: '`useCallback(fn, deps)` returns:',
    options: [
      'A memoized version of the function that only changes identity when deps change',
      'The return value of calling `fn` immediately',
      'A debounced version of `fn`',
      'A new function on every render, same as writing `fn` inline'
    ],
    correctIndex: 0,
    explanation: 'It preserves the same function reference across renders unless a dependency changes — useful to avoid breaking memoized children.',
    category: 'Hooks'
  },
  {
    id: 'react-q-lift-state',
    question: '"Lifting state up" means:',
    options: [
      'Moving shared state to the closest common ancestor of the components that need it',
      'Using Redux instead of useState',
      'Moving state into a ref',
      'Converting state into props permanently'
    ],
    correctIndex: 0,
    explanation: 'When two sibling components need the same state, it moves up to their nearest common parent and flows down as props.',
    category: 'State management'
  },
  {
    id: 'react-q-reconciliation',
    question: 'React decides whether to reuse or replace a DOM element between renders primarily based on:',
    options: ['CSS class names', "The element's type and key", 'The order it was declared in the source file', 'Component file name'],
    correctIndex: 1,
    explanation: "Reconciliation compares element type + key; a type change (e.g. div → span) unmounts and remounts, regardless of props.",
    category: 'Rendering'
  },
  {
    id: 'react-q-useref-rerender',
    question: 'Updating a `useRef` value (`ref.current = x`) does what to the component?',
    options: [
      'Triggers a re-render, like setState',
      'Does not trigger a re-render — it just mutates a persisted value',
      'Throws an error outside of effects',
      'Only works inside useEffect'
    ],
    correctIndex: 1,
    explanation: 'Refs are for values you want to persist across renders without causing a re-render when they change.',
    category: 'Hooks'
  },
  {
    id: 'react-q-props-drilling',
    question: '"Prop drilling" refers to:',
    options: [
      'Validating prop types at build time',
      'Passing data through many intermediate components that don\'t need it, just to reach a deeply nested child',
      'A performance optimization technique',
      'Using default prop values'
    ],
    correctIndex: 1,
    explanation: 'Context, composition, or state management libraries are common ways to avoid threading props through layers that only pass them along.',
    category: 'State management'
  },
  {
    id: 'react-q-memo-purpose',
    question: '`React.memo(Component)` skips a re-render of that component when:',
    options: [
      'Its parent re-renders but its props are shallow-equal to the previous render',
      'Its internal state changes',
      'It uses hooks',
      'Never — memo only affects mounting'
    ],
    correctIndex: 0,
    explanation: 'memo does a shallow prop comparison and bails out of re-rendering if nothing relevant changed — it does not stop the component\'s own state updates from re-rendering it.',
    category: 'Performance'
  },
  {
    id: 'react-q-effect-cleanup',
    question: 'The function returned from inside `useEffect` runs:',
    options: [
      'Never, unless an error is thrown',
      'Before the effect re-runs and when the component unmounts',
      'Only on unmount',
      'Immediately after the effect body, synchronously'
    ],
    correctIndex: 1,
    explanation: "It's the cleanup function — React runs it before re-applying the effect (dependency change) and on unmount.",
    category: 'Hooks'
  },
  {
    id: 'react-q-derived-state',
    question: 'If a value can be computed directly from existing props/state during render, the recommended approach is usually to:',
    options: [
      'Store it in its own useState and sync it with useEffect',
      'Compute it inline during render (optionally with useMemo)',
      'Store it in a ref',
      'Always lift it to a global store'
    ],
    correctIndex: 1,
    explanation: 'Syncing derived values into their own state via effects is a common anti-pattern — computing it during render keeps a single source of truth.',
    category: 'Patterns'
  },
  {
    id: 'react-q-fragment',
    question: 'Why would you use `<>...</>` (a Fragment) instead of wrapping children in a `<div>`?',
    options: [
      'Fragments render faster in every case',
      'To group children without adding an extra node to the DOM',
      'Fragments are required for lists',
      "There's no functional difference, it's just shorter syntax"
    ],
    correctIndex: 1,
    explanation: "Fragments let a component return multiple elements without an unnecessary wrapper element polluting the DOM/layout.",
    category: 'Rendering'
  },
  {
    id: 'react-q-error-boundary',
    question: 'An Error Boundary in React catches errors thrown:',
    options: [
      'Anywhere in the app, including event handlers',
      'During rendering, in lifecycle methods, and in constructors of the tree below it',
      'Only inside async functions',
      'Only in class components, never affecting function components below it'
    ],
    correctIndex: 1,
    explanation: 'Error boundaries catch render/lifecycle errors in their subtree — they do not catch errors in event handlers or async code (use try/catch there).',
    category: 'Error handling'
  },
  {
    id: 'react-q-custom-hook',
    question: 'A "custom hook" is best described as:',
    options: [
      'Any function that starts with the word "use"',
      'A JavaScript function that calls other hooks to share stateful logic between components',
      'A class that extends React.Component',
      'A special React component with no JSX'
    ],
    correctIndex: 1,
    explanation: 'The naming convention matters for the linter, but what makes it a hook is that it composes other hooks to reuse stateful behavior.',
    category: 'Hooks'
  },
  {
    id: 'react-q-key-prop-warning',
    question: 'What does React do if you render a list without unique `key` props and no error boundary catches it?',
    options: [
      'Throws and crashes the app',
      'Logs a console warning but still renders, using less reliable diffing',
      'Silently skips rendering the list',
      'Automatically assigns indexes as keys with no warning'
    ],
    correctIndex: 1,
    explanation: "It's a dev warning, not a hard error — but reconciliation quality (and correctness of state per item) suffers without keys.",
    category: 'Rendering'
  },
  {
    id: 'react-q-code-stale-closure',
    question: 'Clicking the button once, what does the alert show after 3 seconds?',
    code: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      alert(count);
    }, 3000);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>Click</button>;
}`,
    options: ['1', '0', 'undefined', 'It throws an error'],
    correctIndex: 1,
    explanation: 'The `setTimeout` closure captured `count` from the render when it was scheduled — that value stays `0` for that closure regardless of the later state update.',
    category: 'Hooks'
  },
  {
    id: 'react-q-code-usestate-functional',
    question: 'After clicking the button once, what is the count?',
    code: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    options: ['3', '1', '0', '2'],
    correctIndex: 1,
    explanation: 'All three calls read the same `count` from this render\'s closure (still 0), so each schedules "set to 1" — they don\'t compound. Using `setCount(c => c + 1)` three times would give 3.',
    category: 'Hooks'
  },
  {
    id: 'react-q-code-useeffect-mount',
    question: 'How many times does "effect ran" log when this component first mounts, in React 18 development with StrictMode?',
    code: `function Widget() {
  useEffect(() => {
    console.log('effect ran');
  }, []);
  return <div>Widget</div>;
}`,
    options: ['1', '2', '0', '3'],
    correctIndex: 1,
    explanation: 'In dev + StrictMode, React intentionally mounts, unmounts, and remounts once to surface effects that aren\'t cleanup-safe — so a `[]`-dependency effect logs twice.',
    category: 'Hooks'
  },
  {
    id: 'react-q-code-object-prop-memo',
    question: 'Does `React.memo` prevent `Child` from re-rendering when `Parent` re-renders here?',
    code: `const Child = React.memo(function Child({ config }) {
  return <div>{config.label}</div>;
});

function Parent() {
  const [tick, setTick] = useState(0);
  return <Child config={{ label: 'hi' }} />;
}`,
    options: [
      'Yes, memo always blocks re-renders from a parent',
      'No — a new `config` object is created on every Parent render, so the shallow prop comparison always fails',
      'Yes, because the label string never changes',
      'It depends on the value of `tick`'
    ],
    correctIndex: 1,
    explanation: 'Object/array/function literals created inline are new references every render, so memo\'s shallow comparison sees a "changed" prop even though its contents are identical.',
    category: 'Performance'
  },
  {
    id: 'react-q-code-key-list-bug',
    question: 'What bug does this list rendering have?',
    code: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  );
}`,
    options: [
      'No bug — index is always a safe key',
      'If todos can be reordered/inserted/removed, items can be matched to the wrong DOM node and lose local state',
      'It will throw a runtime error',
      'React requires string keys, so this is a TypeError'
    ],
    correctIndex: 1,
    explanation: 'Index keys are only safe for static, never-reordered lists — using `todo.id` avoids state/DOM getting attributed to the wrong item after a reorder or deletion.',
    category: 'Rendering'
  },
  {
    id: 'react-q-code-conditional-hook',
    question: 'What is wrong with this component?',
    code: `function Profile({ userId }) {
  if (!userId) {
    return <p>No user</p>;
  }
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  return <p>{user?.name}</p>;
}`,
    options: [
      'Nothing — this is valid React code',
      'Hooks are called conditionally — the early return skips useState/useEffect on some renders, violating the Rules of Hooks',
      'useEffect needs a cleanup function or it will throw',
      'fetchUser must be awaited, not chained with .then'
    ],
    correctIndex: 1,
    explanation: 'Hooks must run in the same order on every render. Returning before `useState`/`useEffect` means they get skipped whenever `userId` is falsy, breaking React\'s internal hook bookkeeping.',
    category: 'Hooks'
  },
  {
    id: 'react-q-code-usememo-deps',
    question: 'How often is `expensiveCalc` actually re-run here?',
    code: `function Report({ items, theme }) {
  const total = useMemo(() => expensiveCalc(items), [items]);
  return <div className={theme}>{total}</div>;
}`,
    options: [
      'Every render, regardless of theme or items',
      'Only when `items` changes — a `theme`-only re-render reuses the memoized value',
      'Only on mount, never again',
      'Only when `theme` changes'
    ],
    correctIndex: 1,
    explanation: '`useMemo`\'s dependency array is `[items]`, so `theme` changing alone triggers a re-render but does not invalidate the memoized `total`.',
    category: 'Performance'
  },
  {
    id: 'react-q-code-portal',
    question: 'What is the primary reason to use `createPortal` for a modal component?',
    code: `createPortal(<Modal />, document.getElementById('modal-root'))`,
    options: [
      'It renders the component into a different part of the DOM tree while keeping it in the same React component tree (context, event bubbling still work)',
      'It makes the component render server-side only',
      'It skips the virtual DOM diffing for that subtree',
      'It automatically adds a backdrop and close button'
    ],
    correctIndex: 0,
    explanation: 'Portals decouple DOM placement from the React tree — useful for modals/tooltips escaping `overflow:hidden` ancestors — while events still bubble through the React tree, not the DOM tree.',
    category: 'Patterns'
  },
  {
    id: 'react-q-suspense',
    question: '`<Suspense fallback={<Spinner />}>` is used to:',
    options: [
      'Catch and display runtime JavaScript errors',
      'Show a fallback UI while a wrapped component is "suspended" (e.g. lazy-loaded code or data still loading)',
      'Delay rendering until the user scrolls into view',
      'Replace useEffect for data fetching entirely on its own'
    ],
    correctIndex: 1,
    explanation: 'Suspense shows its fallback while descendants below it signal they\'re not ready yet — most commonly `React.lazy()` components, or data sources built to integrate with Suspense.',
    category: 'Patterns'
  },
  {
    id: 'react-q-code-usereducer',
    question: 'What does `state.count` become after dispatching `{ type: "increment" }` twice?',
    code: `function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0 });`,
    options: ['0', '1', '2', 'undefined'],
    correctIndex: 2,
    explanation: 'Each dispatch runs the reducer against the latest state and replaces it — two increments take `count` from 0 → 1 → 2.',
    category: 'Hooks'
  },
  {
    id: 'react-q-server-vs-client-component',
    question: 'In React Server Components (e.g. Next.js App Router), which of these can a Server Component NOT do directly?',
    options: [
      'Read a file or query a database at render time',
      'Use `useState` or `useEffect`',
      'Render another Server Component as a child',
      'Await an async data-fetching call in the component body'
    ],
    correctIndex: 1,
    explanation: 'Server Components render on the server with no client-side interactivity or lifecycle — stateful hooks require a `"use client"` boundary.',
    category: 'Rendering'
  },
  {
    id: 'react-q-code-ref-callback',
    question: 'What is this pattern (a function passed to the `ref` prop) primarily used for?',
    code: `<div ref={(node) => {
  if (node) console.log('mounted', node.offsetHeight);
}} />`,
    options: [
      'It is invalid — ref must be a useRef object',
      'Running logic exactly when the DOM node is attached (or detached, when called with null)',
      'It replaces useEffect entirely',
      'It only works on class components'
    ],
    correctIndex: 1,
    explanation: 'A callback ref fires with the node on mount and with `null` on unmount, letting you measure or wire up the DOM node precisely when it exists.',
    category: 'Patterns'
  }
];
