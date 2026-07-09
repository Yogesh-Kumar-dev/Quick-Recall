import type { Flashcard } from '@/types/content';

// ─── React flashcards — keyword/abbreviation defs + small Q&A ─────────────────

export const reactFlashcards: Flashcard[] = [
  {
    id: 'react-jsx',
    front: 'JSX',
    back: 'The HTML-looking syntax you write inside JavaScript. It is not HTML , a build tool compiles it into React.createElement (or jsx) function calls.',
    category: 'Keyword'
  },
  {
    id: 'react-vdom',
    front: 'Virtual DOM',
    back: 'A lightweight in-memory copy of the UI, made of plain JS objects. React compares the new copy against the old one (reconciliation) and only updates the real DOM where something changed.',
    category: 'Keyword'
  },
  {
    id: 'react-reconciliation',
    front: 'Reconciliation',
    back: 'React\'s "spot the difference" step: it compares the previous and next element trees to figure out the smallest set of real-DOM updates needed.',
    category: 'Keyword'
  },
  {
    id: 'react-key',
    front: 'Why do lists need a `key`?',
    back: 'A key tells React "this item is the same one as last render, just maybe moved" , so it keeps each item\'s DOM and state where they belong. Avoid the array index when the list can reorder.',
    category: 'Q&A'
  },
  {
    id: 'react-state-vs-props',
    front: 'state vs props',
    back: "Props come from the parent and are read-only , the child can't change them. State belongs to the component itself, and updating it (via setState/useState) triggers a re-render.",
    category: 'Q&A'
  },
  {
    id: 'react-useeffect-deps',
    front: 'What does the useEffect dependency array control?',
    back: 'How often the effect re-runs. [] means once after mount; [a, b] means whenever a or b changes; leaving it off means after every single render.',
    category: 'Q&A'
  },
  {
    id: 'react-usememo',
    front: 'useMemo',
    back: 'Remembers (caches) the result of an expensive calculation between renders, and only recomputes it when one of its dependencies changes.',
    category: 'Keyword'
  },
  {
    id: 'react-usecallback',
    front: 'useCallback',
    back: 'Keeps returning the same function object between renders instead of a new one each time , so memoized children and effect dependency arrays see a stable reference.',
    category: 'Keyword'
  },
  {
    id: 'react-memo',
    front: 'React.memo',
    back: "A wrapper that lets a component skip re-rendering when its parent re-renders but its props haven't changed (checked with a shallow comparison).",
    category: 'Keyword'
  },
  {
    id: 'react-controlled',
    front: 'Controlled vs uncontrolled component',
    back: "Controlled: React state drives the input's value on every keystroke. Uncontrolled: the browser keeps the value, and you read it when needed through a ref.",
    category: 'Q&A'
  },
  {
    id: 'react-lifting-state',
    front: 'Lifting state up',
    back: 'When two components need the same data, move the state up to their closest shared parent , it then flows down to both as props, with callbacks to change it.',
    category: 'Keyword'
  },
  {
    id: 'react-context',
    front: 'When should you use Context?',
    back: 'For values that many components at different depths need , theme, logged-in user, locale , so you don\'t pass props through every level ("prop drilling"). It\'s a delivery mechanism, not a full state manager.',
    category: 'Q&A'
  },
  {
    id: 'react-useref',
    front: 'useRef',
    back: "A box (ref.current) that keeps a value , or a DOM node , alive across renders. Changing what's in the box never causes a re-render.",
    category: 'Keyword'
  },
  {
    id: 'react-keys-rules',
    front: 'Rules of Hooks',
    back: 'Call hooks only at the top level (never inside ifs or loops) and only from React components or custom hooks. React tracks hooks by call order, so the order must be identical every render.',
    category: 'Q&A'
  },
  {
    id: 'react-fragment',
    front: 'Fragment (<>…</>)',
    back: 'Lets a component return several sibling elements without wrapping them in an extra <div> , the fragment itself adds nothing to the DOM.',
    category: 'Keyword'
  },
  {
    id: 'react-strict-mode',
    front: 'StrictMode',
    back: 'A development-only wrapper that deliberately runs certain functions and effects twice, to expose side effects missing cleanup. In production it does nothing at all.',
    category: 'Keyword'
  },

  // ─── From GreatFrontEnd React interview question bank ───────────────────────
  {
    id: 'react-what-is',
    front: 'What is React?',
    back: 'A JavaScript library for building UIs out of reusable components. Its key traits: declarative (describe the UI, React updates the DOM), component-based, virtual DOM, JSX, and one-way data flow.',
    category: 'Q&A'
  },
  {
    id: 'react-node-element-component',
    front: 'React Node vs Element vs Component',
    back: 'Component: the function (the recipe). Element: the frozen object JSX produces describing one piece of UI (one order from the recipe). Node: anything renderable at all , elements, strings, numbers, null…',
    category: 'Q&A'
  },
  {
    id: 'react-jsx-compiles',
    front: 'What does JSX compile to?',
    back: 'Plain function calls. <div>Hi</div> becomes React.createElement("div", null, "Hi") , the transform is done at build time by Babel or SWC.',
    category: 'Q&A'
  },
  {
    id: 'react-index-key-consequence',
    front: 'Consequence of using array index as key?',
    back: 'When items reorder, insert, or delete, the indexes shift , so React matches old items to the wrong new ones. Input text, checkboxes, and focus visibly stick to the wrong rows. Only safe for lists that never change order.',
    category: 'Q&A'
  },
  {
    id: 'react-key-reset-state',
    front: 'How does changing a `key` reset state?',
    back: 'A new key tells React "this is a different component now" , it unmounts the old instance and mounts a fresh one with clean state. It\'s the official way to fully reset a component (e.g. <Form key={userId} />).',
    category: 'Q&A'
  },
  {
    id: 'react-useeffect-vs-uselayouteffect',
    front: 'useEffect vs useLayoutEffect',
    back: 'useEffect runs after the browser paints , non-blocking, right for almost everything. useLayoutEffect runs before paint, blocking it , use it only to measure the DOM and adjust it so the user never sees a flicker.',
    category: 'Q&A'
  },
  {
    id: 'react-functional-setstate',
    front: 'When use the updater form setState(prev => …)?',
    back: 'Whenever the next state depends on the previous one , especially with multiple updates in one handler, or updates after an await/timeout. The function always receives the latest value; the plain form may read a stale one captured by the closure.',
    category: 'Q&A'
  },
  {
    id: 'react-usereducer',
    front: 'useReducer , when?',
    back: 'When state has several related pieces or non-trivial transitions. All update logic lives in one pure function , reducer(state, action) returns the new state , and components just dispatch actions describing what happened.',
    category: 'Keyword'
  },
  {
    id: 'react-useid',
    front: 'useId',
    back: 'Generates a unique ID that comes out identical on the server and the client, so hydration never mismatches. Meant for wiring <label htmlFor> to <input id> , never for list keys.',
    category: 'Keyword'
  },
  {
    id: 'react-re-rendering',
    front: 'What does re-rendering mean?',
    back: 'React calls your component function again (because state or props changed) to get a fresh description of the UI, compares it with the old one, and applies only the actual differences to the DOM.',
    category: 'Q&A'
  },
  {
    id: 'react-forwardref',
    front: 'forwardRef , still needed?',
    back: 'Not in React 19 , function components now accept `ref` like any other prop. Before that, forwardRef was the required wrapper for letting a parent attach a ref to something inside a child.',
    category: 'Q&A'
  },
  {
    id: 'react-no-mutate-state',
    front: 'Why not mutate state directly?',
    back: 'React detects changes by comparing references (Object.is). Mutating in place keeps the same reference, so React thinks nothing changed , re-renders get skipped, memo and effect deps break. Always create a new object or array.',
    category: 'Q&A'
  },
  {
    id: 'react-error-boundary',
    front: 'Error boundary',
    back: 'A class component (getDerivedStateFromError + componentDidCatch) that catches render-time crashes in its subtree and shows a fallback instead of a white screen. It does NOT catch errors from event handlers or async code.',
    category: 'Keyword'
  },
  {
    id: 'react-hydration',
    front: 'Hydration',
    back: 'The step where React takes over server-rendered HTML in the browser , attaching event listeners and state so the static markup becomes an interactive app (via hydrateRoot).',
    category: 'Keyword'
  },
  {
    id: 'react-portal',
    front: 'React Portal',
    back: "Renders a component's output into a different DOM location (like document.body) , handy for modals and tooltips escaping overflow/z-index traps. It stays a normal child in the React tree: events bubble, context flows.",
    category: 'Keyword'
  },
  {
    id: 'react-code-splitting',
    front: 'Code splitting',
    back: 'Breaking the app bundle into chunks that download only when needed, via React.lazy(() => import(…)) plus Suspense. Splitting by route gives the biggest win , users only load the page they visit.',
    category: 'Keyword'
  },
  {
    id: 'react-hoc',
    front: 'Higher-Order Component (HOC)',
    back: 'A function that takes a component and returns an enhanced version with extra props or behaviour. It was the class-era way to share logic , new code uses custom hooks instead.',
    category: 'Keyword'
  },
  {
    id: 'react-flux',
    front: 'Flux pattern',
    back: "Facebook's original one-directional state architecture: Action → Dispatcher → Store → View, always in that direction. Redux, Zustand, and useReducer+Context replaced it, but kept its core ideas.",
    category: 'Keyword'
  },
  {
    id: 'react-one-way-flow',
    front: 'One-way data flow',
    back: 'Data goes down (parent to child via props); requests to change it go up (child calls a callback). Unlike two-way binding, every value has one owner and one path of change , which is what makes React apps predictable.',
    category: 'Q&A'
  },
  {
    id: 'react-render-props',
    front: 'Render props',
    back: 'A component shares its internal state by calling a function you pass in (often as children): "here\'s my data, you render what you want with it". Custom hooks have mostly replaced it for pure logic sharing.',
    category: 'Keyword'
  },
  {
    id: 'react-composition',
    front: 'Composition pattern',
    back: "Building complex UIs by plugging simple components together , children, slots (components as props), specialisation, compound components , instead of class inheritance. It's React's main reuse mechanism.",
    category: 'Keyword'
  },
  {
    id: 'react-compound-components',
    front: 'Compound components',
    back: 'A family of components designed to work together , <Tabs><Tabs.List/><Tabs.Panel/></Tabs> , where the parent holds the state and the children read it through context. Clean API, no prop wiring.',
    category: 'Keyword'
  },
  {
    id: 'react-presentational-container',
    front: 'Presentational vs container components',
    back: '"Dumb" presentational components decide how things look (props in, JSX out); "smart" containers handle data and state. Dan Abramov, who named the pattern, now says: just use custom hooks instead.',
    category: 'Q&A'
  },
  {
    id: 'react-fiber',
    front: 'React Fiber',
    back: "React's rendering engine since v16. It broke rendering into small, pausable units of work , so React can interrupt a slow render for something urgent. This is what makes time slicing, concurrent rendering, and Suspense possible.",
    category: 'Keyword'
  },
  {
    id: 'react-suspense',
    front: 'Suspense',
    back: 'A wrapper that shows fallback UI while something inside it is still loading , a lazy-loaded chunk, or a promise read with use(). The component just suspends; Suspense handles the waiting state.',
    category: 'Keyword'
  },
  {
    id: 'react-ssr',
    front: 'Server-Side Rendering (SSR)',
    back: 'The server runs your components and sends finished HTML, so users see content immediately; the client then hydrates it to make it interactive. Wins: fast first paint, reliable SEO. Costs: server work and the hydration step.',
    category: 'Keyword'
  },
  {
    id: 'react-ssg',
    front: 'Static Generation (SSG)',
    back: "Render pages to plain HTML once, at build time, and serve them from a CDN , as fast as the web gets. ISR (Incremental Static Regeneration) rebuilds individual pages after a time limit so they don't go stale.",
    category: 'Keyword'
  },
  {
    id: 'react-data-fetching',
    front: 'How should you load async data in modern React?',
    back: "Use a data library (TanStack Query, SWR, RTK Query), Server Components, or route loaders , they handle caching, races, and retries for you. Hand-rolled useEffect+fetch is the last resort. React 19's use() reads a promise and suspends.",
    category: 'Q&A'
  },
  {
    id: 'react-fetch-pitfalls',
    front: 'Common data-fetching pitfalls',
    back: 'Missing loading/error states; requests that outlive the component (no abort on unmount); race conditions where an old, slow response overwrites a newer one; fetching during render (infinite loop); and sequential "waterfall" fetches that should run in parallel.',
    category: 'Q&A'
  },
  {
    id: 'react-state-context-store',
    front: 'state vs context vs external store , how to choose?',
    back: 'Match the tool to the kind of state: useState/useReducer for local UI state; Context for slow-changing shared values (theme, auth); Zustand/Redux for frequently-changing shared state; TanStack Query/SWR for anything fetched from a server.',
    category: 'Q&A'
  },
  {
    id: 'react-context-perf',
    front: 'How to reduce context re-renders?',
    back: 'Split state and dispatch into separate contexts; memoize the value passed to the Provider (an inline object is "new" every render); wrap consumers in React.memo; or use use-context-selector to subscribe to a slice. The React Compiler automates much of this.',
    category: 'Q&A'
  },
  {
    id: 'react-anti-patterns',
    front: 'Common React anti-patterns',
    back: 'Mutating state in place; copying props into state; using useEffect to compute derived data (just compute it in render); index keys on dynamic lists; stale-closure effects from missing deps; forgetting cleanup; and blanket useMemo/useCallback without profiling.',
    category: 'Q&A'
  },
  {
    id: 'react-testing',
    front: 'How do you test React apps?',
    back: 'Jest or Vitest as the runner, React Testing Library to test what the user sees (not implementation details), user-event for realistic interactions, MSW to mock the network, and Playwright/Cypress for full end-to-end flows.',
    category: 'Q&A'
  },
  {
    id: 'react-compiler',
    front: 'React Compiler',
    back: 'A build-time tool (React 19 era) that reads your components and inserts memoisation automatically , retiring most hand-written useMemo/useCallback/React.memo. Your code still has to follow the Rules of Hooks for it to work.',
    category: 'Keyword'
  },
  {
    id: 'react-server-components',
    front: 'React Server Components (RSC)',
    back: 'Components that run only on the server: they can query the database directly and ship zero JavaScript to the browser , but no state, effects, or event handlers. Interactive parts opt out with "use client".',
    category: 'Keyword'
  },
  {
    id: 'react-use-hook',
    front: 'The use() hook (React 19)',
    back: "Reads a promise or a context during render. If the promise isn't ready, the component suspends , Suspense shows the fallback, an error boundary catches failures , and your code just uses the resolved value.",
    category: 'Keyword'
  },
  {
    id: 'react-tree-shaking',
    front: 'Tree shaking',
    back: 'The bundler drops any export that nothing imports, shrinking the bundle. It only works with ES modules (import/export, analysable at build time) , not CommonJS require. Import the one helper (`lodash/debounce`) so the rest can be dropped.',
    category: 'Keyword'
  },
  {
    id: 'react-module-bundler',
    front: 'What does a bundler (Webpack/Vite) do?',
    back: 'Follows your import graph from the entry file and packages all modules into optimised files the browser can load , compiling JSX/TS along the way, plus code splitting, tree shaking, minification, and cache-busting file names.',
    category: 'Q&A'
  },
  {
    id: 'react-create-react-app',
    front: 'create-react-app , still recommended?',
    back: 'No. CRA was the classic zero-config starter but is deprecated and unmaintained. Start SPAs with Vite, or use a framework like Next.js for production apps.',
    category: 'Q&A'
  },
  {
    id: 'react-a11y-essentials',
    front: 'a11y essentials in React',
    back: 'Use semantic HTML (<button>, <label>) , it gives keyboard support for free. Connect every label to its input, manage focus when modals open or routes change, and lint with eslint-plugin-jsx-a11y. In JSX: htmlFor/className, but aria-* and role written as-is.',
    category: 'Q&A'
  },
  {
    id: 'react-cicd',
    front: 'CI/CD for a React app , typical pipeline?',
    back: 'On every push, CI (continuous integration) runs lint, type-check, tests, and a build; on merge, CD (continuous deployment) ships the built bundle to a host or CDN , Vercel, Netlify, S3+CloudFront. Common tools: GitHub Actions, GitLab CI.',
    category: 'Q&A'
  },

  // ─── ADDED: gaps surfaced from the "React interview questions" PDF sweep ────
  {
    id: 'react-proptypes',
    front: 'PropTypes',
    back: 'The prop-types package checks prop shapes at runtime in plain-JS codebases, logging a dev-only console warning on mismatch. Unlike TypeScript, it only catches problems on code paths that actually run , and never in production.',
    category: 'Q&A'
  },
  {
    id: 'react-shadow-vs-virtual-dom',
    front: 'Shadow DOM vs Virtual DOM',
    back: "Completely unrelated despite the names. Shadow DOM is a browser feature that isolates a Web Component's DOM and CSS from the page (encapsulation). Virtual DOM is React's in-memory diffing technique for efficient updates.",
    category: 'Q&A'
  },
  {
    id: 'react-vs-reactdom',
    front: 'react vs react-dom packages',
    back: 'react is the platform-agnostic core (createElement, hooks, Component) , the same core React Native uses. react-dom is the web renderer (createRoot); react-dom/server adds renderToString for SSR. The split lets one React target many platforms.',
    category: 'Q&A'
  },
  {
    id: 'react-key-source',
    front: 'Where should a key value come from?',
    back: "From the data itself: a database row's id is ideal. For items created on the client (new todo rows), generate an id once at creation , a counter or crypto.randomUUID() , and keep it with the item. Never re-derive keys from the array index each render.",
    category: 'Q&A'
  },
  {
    id: 'react-lifting-state-up',
    front: 'Lifting State Up',
    back: "When sibling components need the same changing data, don't give each its own copy , move the state into their closest common ancestor and pass it down as props, with callbacks for updates.",
    category: 'Keyword'
  },
  {
    id: 'react-force-update',
    front: 'forceUpdate()',
    back: "A class-component escape hatch that forces a re-render without any state change, skipping shouldComponentUpdate. There's deliberately no hook equivalent , needing it is a sign the state isn't modelled right.",
    category: 'Q&A'
  },
  {
    id: 'react-synthetic-events',
    front: 'SyntheticEvent',
    back: "React's wrapper around native browser events that smooths out cross-browser differences , every handler gets the same consistent event object. Since React 17 events are no longer pooled, so e.persist() is obsolete.",
    category: 'Keyword'
  },
  {
    id: 'react-prop-drilling',
    front: 'Prop Drilling',
    back: "Passing data down through components that don't use it themselves, just to reach a deeply nested child. Fixes: Context, a state library, or composition , pass the finished component down as children instead of the raw data.",
    category: 'Q&A'
  },
  {
    id: 'react-dangerously-set-innerhtml',
    front: 'dangerouslySetInnerHTML',
    back: "The escape hatch for injecting a raw HTML string ({ __html: string }), skipping React's automatic escaping. The name is a warning: unsanitized content here is a direct XSS (script-injection) hole , run it through DOMPurify first.",
    category: 'Q&A'
  },
  {
    id: 'react-purecomponent',
    front: 'PureComponent',
    back: "A class-component base class that skips re-rendering when a shallow comparison says props and state haven't changed , the class-era equivalent of wrapping a function component in React.memo.",
    category: 'Keyword'
  },
  {
    id: 'react-devtools-profiler',
    front: 'React DevTools Profiler',
    back: 'The Profiler tab in React DevTools records which components rendered, why, and how long each took , flame graphs per commit. It\'s the practical answer to "how do you find unnecessary or slow re-renders?"',
    category: 'Q&A'
  },
  {
    id: 'react-vs-react-native',
    front: 'React vs React Native',
    back: 'Same component-and-hooks model, different output. React renders HTML into the browser DOM; React Native uses a different renderer that produces real native mobile UI elements , not HTML, and not a WebView.',
    category: 'Q&A'
  },
  {
    id: 'react-effect-deps-objectis',
    front: 'How does useEffect compare dependencies?',
    back: 'Each dependency is compared with Object.is (like === but handles NaN correctly). Objects, arrays, and functions compare by reference , so an inline literal in the deps array counts as "changed" on every render and re-fires the effect.',
    category: 'Q&A'
  },
  {
    id: 'react-render-vs-commit-phase',
    front: 'Render phase vs Commit phase',
    back: 'Trigger → Render → Commit. Render: React calls your components and computes the diff , this work can be paused or thrown away. Commit: React applies the changes to the real DOM and runs layout effects , then the browser paints.',
    category: 'Q&A'
  }
];
