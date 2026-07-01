import type { Flashcard } from '@/types/content';

// ─── React flashcards — keyword/abbreviation defs + small Q&A ─────────────────

export const reactFlashcards: Flashcard[] = [
  {
    id: 'react-jsx',
    front: 'JSX',
    back: 'A syntax extension that lets you write HTML-like markup in JS; it compiles to React.createElement (or jsx) calls.',
    category: 'Keyword'
  },
  {
    id: 'react-vdom',
    front: 'Virtual DOM',
    back: 'An in-memory tree of React elements. React diffs the new tree against the old (reconciliation) and applies the minimal real-DOM updates.',
    category: 'Keyword'
  },
  {
    id: 'react-reconciliation',
    front: 'Reconciliation',
    back: 'The diffing process React uses to compare the previous and next element trees and decide what to update in the real DOM.',
    category: 'Keyword'
  },
  {
    id: 'react-key',
    front: 'Why do lists need a `key`?',
    back: 'Keys give elements a stable identity across renders so React can match items and avoid re-creating/reordering DOM incorrectly. Avoid using the index when the list reorders.',
    category: 'Q&A'
  },
  {
    id: 'react-state-vs-props',
    front: 'state vs props',
    back: 'Props are read-only inputs passed from a parent; state is data owned and mutated by the component itself (via setState/useState).',
    category: 'Q&A'
  },
  {
    id: 'react-useeffect-deps',
    front: 'What does the useEffect dependency array control?',
    back: 'When the effect re-runs. [] runs once on mount; [a, b] re-runs when a or b changes; omitting it runs after every render.',
    category: 'Q&A'
  },
  {
    id: 'react-usememo',
    front: 'useMemo',
    back: 'Caches the result of an expensive calculation between renders, recomputing only when its dependencies change.',
    category: 'Keyword'
  },
  {
    id: 'react-usecallback',
    front: 'useCallback',
    back: 'Returns a memoized function identity between renders so stable references can be passed to memoized children or effect deps.',
    category: 'Keyword'
  },
  {
    id: 'react-memo',
    front: 'React.memo',
    back: 'A HOC that skips re-rendering a component when its props are shallowly equal to the previous render.',
    category: 'Keyword'
  },
  {
    id: 'react-controlled',
    front: 'Controlled vs uncontrolled component',
    back: 'A controlled input has its value driven by React state; an uncontrolled input keeps its own DOM state, read via a ref.',
    category: 'Q&A'
  },
  {
    id: 'react-lifting-state',
    front: 'Lifting state up',
    back: 'Moving shared state to the closest common ancestor so multiple children can read and update it via props/callbacks.',
    category: 'Keyword'
  },
  {
    id: 'react-context',
    front: 'When should you use Context?',
    back: 'For data that many components at different depths need (theme, auth, locale), to avoid prop-drilling. Not a replacement for all state management.',
    category: 'Q&A'
  },
  {
    id: 'react-useref',
    front: 'useRef',
    back: 'Holds a mutable value (or DOM node) that persists across renders without causing a re-render when it changes.',
    category: 'Keyword'
  },
  {
    id: 'react-keys-rules',
    front: 'Rules of Hooks',
    back: 'Only call hooks at the top level (not in loops/conditions) and only from React functions, so call order stays stable between renders.',
    category: 'Q&A'
  },
  {
    id: 'react-fragment',
    front: 'Fragment (<>…</>)',
    back: 'Groups children without adding an extra DOM node — useful when a component must return multiple siblings.',
    category: 'Keyword'
  },
  {
    id: 'react-strict-mode',
    front: 'StrictMode',
    back: 'A dev-only wrapper that double-invokes certain functions/effects to surface side-effect bugs; it renders nothing in production.',
    category: 'Keyword'
  },

  // ─── From GreatFrontEnd React interview question bank ───────────────────────
  {
    id: 'react-what-is',
    front: 'What is React?',
    back: 'A JavaScript library for building UIs from reusable components. Key traits: declarative, component-based, virtual DOM, JSX, one-way data flow.',
    category: 'Q&A'
  },
  {
    id: 'react-node-element-component',
    front: 'React Node vs Element vs Component',
    back: 'Node: anything renderable (element, string, number, null…). Element: the immutable object JSX produces describing what to render. Component: a function that takes props and returns nodes.',
    category: 'Q&A'
  },
  {
    id: 'react-jsx-compiles',
    front: 'What does JSX compile to?',
    back: 'React.createElement (or the jsx runtime) calls. <div>Hi</div> → React.createElement("div", null, "Hi"). Babel/SWC does the transform.',
    category: 'Q&A'
  },
  {
    id: 'react-index-key-consequence',
    front: 'Consequence of using array index as key?',
    back: 'On reorder/insert/remove React reuses the wrong instances — stale state, focus, and DOM attach to the wrong rows. Only safe for static lists.',
    category: 'Q&A'
  },
  {
    id: 'react-key-reset-state',
    front: 'How does changing a `key` reset state?',
    back: 'A new key makes React unmount the old instance and mount a fresh one — the idiomatic way to fully reset a component’s state.',
    category: 'Q&A'
  },
  {
    id: 'react-useeffect-vs-uselayouteffect',
    front: 'useEffect vs useLayoutEffect',
    back: 'useEffect runs asynchronously AFTER paint (most side effects). useLayoutEffect runs synchronously BEFORE paint — use only to measure/mutate the DOM and avoid flicker.',
    category: 'Q&A'
  },
  {
    id: 'react-functional-setstate',
    front: 'When use the updater form setState(prev => …)?',
    back: 'When the next state depends on the previous — especially with multiple updates in one handler or updates after await/timeout. It reads the latest queued state, not a stale closure.',
    category: 'Q&A'
  },
  {
    id: 'react-usereducer',
    front: 'useReducer — when?',
    back: 'For complex state with multiple sub-values or transitions where the next state depends on the previous. Returns [state, dispatch]; reducer(state, action) must be pure.',
    category: 'Keyword'
  },
  {
    id: 'react-useid',
    front: 'useId',
    back: 'Generates a stable unique ID per component instance that matches between SSR and hydration. Use for label/input pairing — never as a list key.',
    category: 'Keyword'
  },
  {
    id: 'react-re-rendering',
    front: 'What does re-rendering mean?',
    back: 'React calls the component again on state/prop change to build a new element tree, diffs it against the old, and applies the minimal real-DOM changes.',
    category: 'Q&A'
  },
  {
    id: 'react-forwardref',
    front: 'forwardRef — still needed?',
    back: 'Deprecated in React 19 — function components now accept `ref` as a regular prop. Historically it let a parent forward a ref to a child DOM node before React 19.',
    category: 'Q&A'
  },
  {
    id: 'react-no-mutate-state',
    front: 'Why not mutate state directly?',
    back: 'React relies on reference inequality (Object.is) to detect changes. Mutating in place keeps the same reference, breaking bailouts, memo, and effect deps — always create a new object/array.',
    category: 'Q&A'
  },
  {
    id: 'react-error-boundary',
    front: 'Error boundary',
    back: 'A class component (getDerivedStateFromError + componentDidCatch) that catches render-phase errors in its subtree and shows a fallback. Does NOT catch event-handler or async errors.',
    category: 'Keyword'
  },
  {
    id: 'react-hydration',
    front: 'Hydration',
    back: 'The client process of attaching event listeners and state to server-rendered HTML so the static markup becomes interactive (hydrateRoot).',
    category: 'Keyword'
  },
  {
    id: 'react-portal',
    front: 'React Portal',
    back: 'Renders children into a DOM node outside the parent hierarchy (modals, tooltips) while staying in the React tree — events still bubble and context still flows.',
    category: 'Keyword'
  },
  {
    id: 'react-code-splitting',
    front: 'Code splitting',
    back: 'Breaking the bundle into chunks loaded on demand via React.lazy(() => import(…)) + Suspense, reducing initial load. Route-based splitting has the biggest impact.',
    category: 'Keyword'
  },
  {
    id: 'react-hoc',
    front: 'Higher-Order Component (HOC)',
    back: 'A function that takes a component and returns an enhanced one with extra props/behavior. Largely legacy — custom hooks are now preferred for sharing logic.',
    category: 'Keyword'
  },
  {
    id: 'react-flux',
    front: 'Flux pattern',
    back: 'Facebook’s unidirectional-data-flow architecture: Action → Dispatcher → Store → View. Superseded by Redux/Zustand/useReducer+Context, but its ideas live on.',
    category: 'Keyword'
  },
  {
    id: 'react-one-way-flow',
    front: 'One-way data flow',
    back: 'Data flows parent → child via props; children change parent state by invoking callbacks passed down. Contrast with two-way binding. Enables predictable, debuggable state.',
    category: 'Q&A'
  },
  {
    id: 'react-render-props',
    front: 'Render props',
    back: 'Sharing logic via a prop whose value is a function the component calls with its internal state — often passed as children. Largely replaced by custom hooks.',
    category: 'Keyword'
  },
  {
    id: 'react-composition',
    front: 'Composition pattern',
    back: 'Building UIs by combining components (children, slots, specialization, render props, compound components) rather than inheritance. React’s main reuse mechanism.',
    category: 'Keyword'
  },
  {
    id: 'react-compound-components',
    front: 'Compound components',
    back: 'A parent exposing related sub-components that share implicit state via context — e.g. <Tabs><Tabs.List/><Tabs.Panel/></Tabs>. Clean, composable API, no prop drilling.',
    category: 'Keyword'
  },
  {
    id: 'react-presentational-container',
    front: 'Presentational vs container components',
    back: '“Dumb” components decide how things look (props only); “smart” containers decide how things work (data, state). Dan Abramov now recommends custom hooks instead of splitting this way.',
    category: 'Q&A'
  },
  {
    id: 'react-fiber',
    front: 'React Fiber',
    back: 'The React 16 rewrite of reconciliation that splits rendering into interruptible units of work — enabling pausing/resuming, time slicing, and Suspense.',
    category: 'Keyword'
  },
  {
    id: 'react-suspense',
    front: 'Suspense',
    back: 'Lets a component show fallback UI while waiting for something to load (lazy code, or a promise read via use()). Pairs with React.lazy and data libraries.',
    category: 'Keyword'
  },
  {
    id: 'react-ssr',
    front: 'Server-Side Rendering (SSR)',
    back: 'Render components to HTML on the server, send it for an immediate first paint, then hydrate on the client. Better SEO and perceived load; costs TTFB and hydration.',
    category: 'Keyword'
  },
  {
    id: 'react-ssg',
    front: 'Static Generation (SSG)',
    back: 'Pre-render pages to HTML at build time, served from a CDN — fast and SEO-friendly. ISR rebuilds individual pages after a TTL so static needn’t be stale.',
    category: 'Keyword'
  },
  {
    id: 'react-data-fetching',
    front: 'How should you load async data in modern React?',
    back: 'Prefer TanStack Query / SWR / RTK Query, Server Components, or route loaders over hand-rolled useEffect+fetch. React 19’s use() hook reads a promise and suspends.',
    category: 'Q&A'
  },
  {
    id: 'react-fetch-pitfalls',
    front: 'Common data-fetching pitfalls',
    back: 'No loading/error states, leaking requests (no abort on unmount), race conditions on param change, fetching during render (loops), and request waterfalls.',
    category: 'Q&A'
  },
  {
    id: 'react-state-context-store',
    front: 'state vs context vs external store — how to choose?',
    back: 'useState/useReducer for local state; Context for rarely-changing shared values (theme, auth); Zustand/Redux for frequently-changing shared state; TanStack Query/SWR for server state.',
    category: 'Q&A'
  },
  {
    id: 'react-context-perf',
    front: 'How to reduce context re-renders?',
    back: 'Split state and dispatch into separate contexts, memoize the provider value, wrap consumers in React.memo, or use use-context-selector. The React Compiler auto-memoizes much of this.',
    category: 'Q&A'
  },
  {
    id: 'react-anti-patterns',
    front: 'Common React anti-patterns',
    back: 'Mutating state, mirroring props in useState, deriving data in useEffect, index keys on dynamic lists, stale-closure effects, missing cleanup, and over-using useMemo/useCallback.',
    category: 'Q&A'
  },
  {
    id: 'react-testing',
    front: 'How do you test React apps?',
    back: 'Jest/Vitest + React Testing Library (test like a user), @testing-library/user-event, MSW for network mocking, and Playwright/Cypress for end-to-end tests.',
    category: 'Q&A'
  },
  {
    id: 'react-compiler',
    front: 'React Compiler',
    back: 'A build-time compiler (React 19) that auto-memoizes components and values, removing most manual useMemo/useCallback/React.memo. Rules of Hooks still apply.',
    category: 'Keyword'
  },
  {
    id: 'react-server-components',
    front: 'React Server Components (RSC)',
    back: 'Components that run only on the server: zero client JS, direct DB/FS access, no hooks/state. Client components opt in with "use client".',
    category: 'Keyword'
  },
  {
    id: 'react-use-hook',
    front: 'The use() hook (React 19)',
    back: 'Reads a resource (a promise or context) during render and suspends until it resolves — pairs with Suspense for loading and error boundaries for failures.',
    category: 'Keyword'
  },
  {
    id: 'react-tree-shaking',
    front: 'Tree shaking',
    back: 'The bundler drops exports that nothing imports, shrinking the bundle. Needs ES module import/export (not require). Import the one helper, e.g. `lodash/debounce`, so the rest is removed.',
    category: 'Keyword'
  },
  {
    id: 'react-module-bundler',
    front: 'What does a bundler (Webpack/Vite) do?',
    back: 'Walks your import graph and packages modules into optimised files for the browser — handling JSX/TS transforms, code splitting, tree shaking, minification, and asset hashing.',
    category: 'Q&A'
  },
  {
    id: 'react-create-react-app',
    front: 'create-react-app — still recommended?',
    back: 'No. CRA was the classic zero-config starter but is now deprecated/unmaintained. Use Vite for SPAs or a framework like Next.js for production apps.',
    category: 'Q&A'
  },
  {
    id: 'react-a11y-essentials',
    front: 'a11y essentials in React',
    back: 'Use semantic HTML (<button>, <label>), connect labels to inputs, manage focus for modals/route changes, and lint with eslint-plugin-jsx-a11y. Write htmlFor/className but aria-*/role as-is.',
    category: 'Q&A'
  },
  {
    id: 'react-cicd',
    front: 'CI/CD for a React app — typical pipeline?',
    back: 'On push, CI runs lint + type-check + tests + build; on merge, CD deploys the built bundle to a host/CDN (Vercel, Netlify, S3+CloudFront). Tools: GitHub Actions, GitLab CI.',
    category: 'Q&A'
  }
];
