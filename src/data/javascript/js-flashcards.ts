import type { Flashcard } from '@/types/content';

// ─── JavaScript flashcards — keyword/abbreviation defs + small Q&A ────────────

export const jsFlashcards: Flashcard[] = [
  {
    id: 'js-const-init',
    front: "What is the requirement for initializing a 'const' variable?",
    back: 'It must be declared and assigned a value at the same time.',
    category: 'Q&A'
  },
  {
    id: 'js-tdz',
    front: 'TDZ',
    back: 'Temporal Dead Zone — the span from entering a scope until a let/const declaration is reached, where accessing the variable throws a ReferenceError.',
    category: 'Keyword'
  },
  {
    id: 'js-hoisting',
    front: 'Hoisting',
    back: 'Declarations are moved to the top of their scope at compile time. var and function declarations are initialized; let/const are hoisted but stay in the TDZ.',
    category: 'Keyword'
  },
  {
    id: 'js-closure',
    front: 'Closure',
    back: 'A function bundled with references to its surrounding lexical scope, letting it access outer variables even after the outer function has returned.',
    category: 'Keyword'
  },
  {
    id: 'js-event-loop',
    front: 'Event Loop',
    back: 'The mechanism that runs the call stack, then drains the microtask queue, then takes one macrotask — repeating to allow non-blocking async behavior.',
    category: 'Keyword'
  },
  {
    id: 'js-microtask',
    front: 'What runs first: a Promise callback or a setTimeout callback?',
    back: 'The Promise callback. Microtasks (Promises) drain completely before the next macrotask (setTimeout) runs.',
    category: 'Q&A'
  },
  {
    id: 'js-let-vs-var',
    front: 'let vs var',
    back: 'let is block-scoped and not initialized until its declaration (TDZ); var is function-scoped and hoisted as undefined.',
    category: 'Q&A'
  },
  {
    id: 'js-eq-vs-eqeq',
    front: '== vs ===',
    back: '== compares after type coercion; === compares value and type with no coercion. Prefer === to avoid surprises.',
    category: 'Q&A'
  },
  {
    id: 'js-iife',
    front: 'IIFE',
    back: 'Immediately Invoked Function Expression — a function defined and called at once, e.g. (function(){ … })(), used to create a private scope.',
    category: 'Keyword'
  },
  {
    id: 'js-this',
    front: "What determines the value of 'this' in a regular function?",
    back: 'How the function is called (the call-site). Arrow functions ignore this rule and inherit this from the enclosing lexical scope.',
    category: 'Q&A'
  },
  {
    id: 'js-arrow-this',
    front: 'Do arrow functions have their own `this`?',
    back: 'No. They capture `this` from the surrounding lexical scope and have no own `arguments`, cannot be `new`-ed.',
    category: 'Q&A'
  },
  {
    id: 'js-prototype',
    front: 'Prototype chain',
    back: 'The chain of objects linked via [[Prototype]] that JS walks when looking up a property until it finds it or reaches null.',
    category: 'Keyword'
  },
  {
    id: 'js-coercion',
    front: 'Type coercion',
    back: 'Automatic conversion of a value from one type to another (e.g. number to string) during an operation like + or ==.',
    category: 'Keyword'
  },
  {
    id: 'js-nullish',
    front: '?? vs ||',
    back: '?? (nullish coalescing) only falls back when the left side is null or undefined; || falls back on any falsy value (0, "", false…).',
    category: 'Q&A'
  },
  {
    id: 'js-optional-chaining',
    front: 'Optional chaining (?.)',
    back: 'Short-circuits and returns undefined instead of throwing when accessing a property on null/undefined, e.g. user?.address?.city.',
    category: 'Keyword'
  },
  {
    id: 'js-debounce',
    front: 'Debounce',
    back: 'Delays running a function until a pause in calls — only the last call within the wait window fires. Useful for search inputs and resize.',
    category: 'Keyword'
  },
  {
    id: 'js-throttle',
    front: 'Throttle',
    back: 'Limits a function to run at most once per time interval, regardless of how many times it is called. Useful for scroll handlers.',
    category: 'Keyword'
  },
  {
    id: 'js-shallow-vs-deep',
    front: 'Shallow copy vs deep copy',
    back: 'A shallow copy duplicates top-level properties but shares nested references; a deep copy clones all nested levels (e.g. structuredClone).',
    category: 'Q&A'
  },
  {
    id: 'js-promise-all',
    front: 'Promise.all vs Promise.allSettled',
    back: 'Promise.all rejects as soon as any promise rejects; Promise.allSettled always resolves with the status/value of every promise.',
    category: 'Q&A'
  },
  {
    id: 'js-spread-rest',
    front: 'Spread vs rest (...)',
    back: 'Spread expands an iterable into elements (in calls/literals); rest collects remaining values into an array/object (in params/destructuring).',
    category: 'Q&A'
  },
  {
    id: 'js-pure-function',
    front: 'Pure function',
    back: 'A function whose output depends only on its inputs and which produces no side effects — same input always yields the same output.',
    category: 'Keyword'
  },
  {
    id: 'js-memoization',
    front: 'Memoization',
    back: 'Caching the result of a function for a given set of inputs so repeated calls with the same inputs return the cached value.',
    category: 'Keyword'
  },

  // ─── From GreatFrontEnd interview question bank ─────────────────────────────
  {
    id: 'js-data-types',
    front: 'What are the data types in JavaScript?',
    back: 'Seven primitives — string, number, boolean, null, undefined, symbol, bigint — plus the object type (objects, arrays, functions, etc.). typeof null wrongly returns "object".',
    category: 'Q&A'
  },
  {
    id: 'js-typeof-null',
    front: 'What does typeof null return?',
    back: '"object" — a long-standing bug in the language kept for backward compatibility. Use value === null to check for null.',
    category: 'Q&A'
  },
  {
    id: 'js-null-vs-undefined',
    front: 'null vs undefined vs undeclared',
    back: 'undefined: declared but unassigned (typeof "undefined"). null: explicitly set to "no value" (typeof "object"). undeclared: never declared — accessing it throws a ReferenceError.',
    category: 'Q&A'
  },
  {
    id: 'js-string-to-number',
    front: 'How do you convert a string to a number?',
    back: 'Number(str), parseInt(str, 10), parseFloat(str), the unary + (+str), or * 1. parseInt stops at the first non-numeric char; Number is stricter.',
    category: 'Q&A'
  },
  {
    id: 'js-call-vs-apply',
    front: '.call vs .apply',
    back: 'Both invoke a function with an explicit this. .call(thisArg, a, b) takes args individually; .apply(thisArg, [a, b]) takes them as an array.',
    category: 'Q&A'
  },
  {
    id: 'js-bind',
    front: 'Function.prototype.bind',
    back: 'Returns a NEW function with this permanently bound to the given object (and optional preset leading args). Used for callbacks, event handlers, and partial application.',
    category: 'Keyword'
  },
  {
    id: 'js-this-rules',
    front: 'What determines `this` (the 4 rules)?',
    back: 'new → the new instance; call/apply/bind → the passed object; obj.method() → obj; plain call() → global (or undefined in strict mode). Arrow functions ignore all four and inherit lexically.',
    category: 'Q&A'
  },
  {
    id: 'js-new-keyword',
    front: 'What does the `new` keyword do?',
    back: 'Creates a fresh object, links its prototype to the constructor’s .prototype, binds this to it, runs the constructor body, and returns the object (unless the constructor returns its own object).',
    category: 'Q&A'
  },
  {
    id: 'js-func-decl-vs-expr',
    front: 'Function declaration vs function expression',
    back: 'Declarations (function foo(){}) are fully hoisted — callable before their line. Expressions (const foo = function(){}) follow variable hoisting, so calling early throws TypeError/ReferenceError.',
    category: 'Q&A'
  },
  {
    id: 'js-class-vs-constructor',
    front: 'ES2015 class vs ES5 function constructor',
    back: 'Classes are syntactic sugar over prototypes: cleaner inheritance via extends/super (vs Object.create + manual chaining), methods are non-enumerable, the body runs in strict mode, and classes are not hoisted for use.',
    category: 'Q&A'
  },
  {
    id: 'js-higher-order-fn',
    front: 'Higher-order function',
    back: 'A function that takes one or more functions as arguments and/or returns a function. Examples: map, filter, reduce, and bind.',
    category: 'Keyword'
  },
  {
    id: 'js-callback',
    front: 'Callback function',
    back: 'A function passed into another function to be invoked later — synchronously (map) or asynchronously (setTimeout, event handlers). Deep nesting leads to "callback hell".',
    category: 'Keyword'
  },
  {
    id: 'js-anonymous-fn',
    front: 'Anonymous function — typical use?',
    back: 'A function without a name, used as an argument to higher-order functions (map, setTimeout), as an IIFE for a private scope, or assigned to a variable.',
    category: 'Q&A'
  },
  {
    id: 'js-recursion',
    front: 'Recursion',
    back: 'A function that calls itself until a base case stops it. Needs a base case to avoid a RangeError (stack overflow). Good for trees, traversals, and divide-and-conquer.',
    category: 'Keyword'
  },
  {
    id: 'js-curry',
    front: 'Currying',
    back: 'Transforming a function f(a, b, c) into a chain f(a)(b)(c) of single-argument functions, enabling partial application and reuse.',
    category: 'Keyword'
  },
  {
    id: 'js-partial-application',
    front: 'Currying vs partial application',
    back: 'Currying turns f(a,b,c) into f(a)(b)(c) (always one arg at a time). Partial application fixes SOME args now (e.g. f.bind(null, a)) and returns a function taking the rest.',
    category: 'Q&A'
  },
  {
    id: 'js-event-bubbling',
    front: 'Event bubbling vs capturing',
    back: 'Bubbling (default): the event fires on the target then propagates UP to the root. Capturing (opt-in via {capture:true}): it travels DOWN from the root to the target first.',
    category: 'Q&A'
  },
  {
    id: 'js-event-delegation',
    front: 'Event delegation',
    back: 'Attaching ONE listener on a parent and using e.target to handle events from many children — fewer listeners, and it works for dynamically added elements. Relies on bubbling.',
    category: 'Keyword'
  },
  {
    id: 'js-prevent-vs-stop',
    front: 'preventDefault vs stopPropagation',
    back: 'preventDefault() cancels the browser’s default action (form submit, link nav). stopPropagation() stops the event from bubbling/capturing further. They are independent.',
    category: 'Q&A'
  },
  {
    id: 'js-mouseenter-vs-mouseover',
    front: 'mouseenter vs mouseover',
    back: 'mouseover bubbles and re-fires when entering descendants; mouseenter does NOT bubble and fires only once when the pointer enters the element itself.',
    category: 'Q&A'
  },
  {
    id: 'js-script-async-defer',
    front: 'script vs async vs defer',
    back: 'Plain <script> blocks parsing. async downloads in parallel and runs ASAP (order not guaranteed). defer downloads in parallel and runs after parsing, in order.',
    category: 'Q&A'
  },
  {
    id: 'js-cookie-storage',
    front: 'cookie vs localStorage vs sessionStorage',
    back: 'Cookies (~4KB) are sent to the server on every request. localStorage (~5MB) persists across sessions/tabs. sessionStorage (~5MB) is per-tab and cleared when the tab closes.',
    category: 'Q&A'
  },
  {
    id: 'js-innerhtml-vs-textcontent',
    front: 'innerHTML vs textContent',
    back: 'innerHTML parses and sets HTML markup (XSS risk with user input). textContent sets/reads plain text only — faster and safe. innerText also respects CSS visibility.',
    category: 'Q&A'
  },
  {
    id: 'js-queryselector-vs-getbyid',
    front: 'querySelector vs getElementById',
    back: 'querySelector accepts any CSS selector and returns the first match (slower, flexible). getElementById takes only an id and is the fastest single-element lookup.',
    category: 'Q&A'
  },
  {
    id: 'js-promise-states',
    front: 'States of a Promise',
    back: 'pending → settled (fulfilled or rejected). Once settled, the state and value are immutable — it can never change again.',
    category: 'Q&A'
  },
  {
    id: 'js-promise-vs-callback',
    front: 'Promises vs callbacks — why prefer Promises?',
    back: 'Promises avoid callback hell, are chainable (.then), centralize error handling (.catch), and compose with all/allSettled/race/any. Trade-off: slightly more concepts to learn.',
    category: 'Q&A'
  },
  {
    id: 'js-promise-all-use',
    front: 'Promise.all — what does it do?',
    back: 'Runs promises in parallel and resolves to an array of their results — but rejects immediately if ANY of them rejects (fail-fast).',
    category: 'Q&A'
  },
  {
    id: 'js-promise-any-race',
    front: 'Promise.race vs Promise.any',
    back: 'race settles with the FIRST promise to settle (win or lose). any resolves with the first to FULFILL, rejecting only if all reject (AggregateError).',
    category: 'Q&A'
  },
  {
    id: 'js-async-await',
    front: 'async / await',
    back: 'Sugar over Promises: an async function always returns a Promise, and await pauses until a Promise settles. Wrap awaits in try/catch for errors.',
    category: 'Keyword'
  },
  {
    id: 'js-microtask-queue',
    front: 'Microtask queue',
    back: 'A high-priority queue for Promise callbacks, await continuations, queueMicrotask, and MutationObserver. Fully drained after each task and before the next macrotask (setTimeout).',
    category: 'Keyword'
  },
  {
    id: 'js-prototype-chain',
    front: 'Prototype chain',
    back: 'Each object has a hidden [[Prototype]] link. Property lookups walk up this chain until found or until null. This is how JS implements inheritance (delegation).',
    category: 'Keyword'
  },
  {
    id: 'js-classical-vs-prototypal',
    front: 'Classical vs prototypal inheritance',
    back: 'Classical (Java/C++): classes are blueprints, instances copy structure. Prototypal (JS): objects delegate to other objects at runtime via the prototype chain.',
    category: 'Q&A'
  },
  {
    id: 'js-static-members',
    front: 'Why use static class members?',
    back: 'They belong to the class itself, not instances — ideal for utilities, constants, factory methods, or shared counters that don’t depend on a specific instance.',
    category: 'Q&A'
  },
  {
    id: 'js-symbol',
    front: 'What are Symbols used for?',
    back: 'Unique, collision-free property keys — for "hidden"/non-enumerable-ish object keys and well-known symbols like Symbol.iterator that customize built-in behavior.',
    category: 'Q&A'
  },
  {
    id: 'js-proxy',
    front: 'What are Proxies used for?',
    back: 'Wrapping an object to intercept operations (get, set, has, deleteProperty…) via traps — used for validation, logging, reactivity (Vue 3), and access control.',
    category: 'Q&A'
  },
  {
    id: 'js-map-vs-object',
    front: 'Map vs plain object',
    back: 'Map: any key type, guaranteed insertion order, .size, directly iterable, better for frequent add/delete. Object: string/symbol keys, JSON-serializable, has a prototype.',
    category: 'Q&A'
  },
  {
    id: 'js-weakmap',
    front: 'Map/Set vs WeakMap/WeakSet',
    back: 'WeakMap/WeakSet hold object keys WEAKLY, so they don’t block garbage collection, and are not iterable / have no size. Good for private data and caches keyed by objects.',
    category: 'Q&A'
  },
  {
    id: 'js-set-equality',
    front: 'How do Set/Map compare object keys?',
    back: 'By reference, not deep value. Two distinct object literals with identical contents are treated as different keys/values.',
    category: 'Q&A'
  },
  {
    id: 'js-mutable-immutable',
    front: 'Mutable vs immutable',
    back: 'Mutable values can be changed in place (objects, arrays). Immutable values cannot (primitives, frozen objects). Object.freeze gives a shallow freeze.',
    category: 'Q&A'
  },
  {
    id: 'js-freeze-seal',
    front: 'Object.freeze vs Object.seal',
    back: 'freeze: no add, delete, or change of existing props (read-only). seal: no add or delete, but existing props can still be reassigned. Both are shallow.',
    category: 'Q&A'
  },
  {
    id: 'js-shallow-deep-copy-methods',
    front: 'How do you deep-copy an object?',
    back: 'structuredClone(obj) (modern), or JSON.parse(JSON.stringify(obj)) (drops functions/undefined/Dates). Spread/Object.assign only do a shallow copy.',
    category: 'Q&A'
  },
  {
    id: 'js-object-empty',
    front: 'How do you check if an object is empty?',
    back: 'Object.keys(obj).length === 0 (and typeof obj === "object"). For also-no-symbols: Reflect.ownKeys(obj).length === 0.',
    category: 'Q&A'
  },
  {
    id: 'js-has-property',
    front: 'How do you check if an object has a property?',
    back: 'Object.hasOwn(obj, key) (preferred), obj.hasOwnProperty(key), or "key" in obj (which also checks the prototype chain).',
    category: 'Q&A'
  },
  {
    id: 'js-commonjs-vs-esm',
    front: 'CommonJS vs ES Modules',
    back: 'CommonJS (require/module.exports) is synchronous and runtime-resolved (Node legacy). ESM (import/export) is static, async-friendly, tree-shakeable, and the standard.',
    category: 'Q&A'
  },
  {
    id: 'js-tree-shaking',
    front: 'Tree shaking',
    back: 'Dead-code elimination by bundlers: unused ESM exports are dropped from the final bundle. Relies on the static, side-effect-free structure of ES modules.',
    category: 'Keyword'
  },
  {
    id: 'js-iterator-generator',
    front: 'Iterators vs generators',
    back: 'An iterator has a next() returning {value, done}. A generator (function*) is a factory that produces iterators, pausing at each yield and resuming on next().',
    category: 'Q&A'
  },
  {
    id: 'js-strict-mode',
    front: "'use strict'",
    back: 'Opts into a stricter JS variant: no accidental globals, silent assignment failures throw, this is undefined in plain calls, and duplicate params are banned.',
    category: 'Keyword'
  },
  {
    id: 'js-polyfill',
    front: 'Polyfill',
    back: 'Code that implements a modern API in older environments that lack it (e.g. Array.prototype.includes), so you can use new features everywhere.',
    category: 'Keyword'
  },
  {
    id: 'js-fetch-vs-xhr',
    front: 'fetch vs XMLHttpRequest',
    back: 'fetch is Promise-based, cleaner, and stream-friendly but does NOT reject on HTTP 4xx/5xx (check res.ok). XHR is the older callback/event-based API.',
    category: 'Q&A'
  },
  {
    id: 'js-abortcontroller',
    front: 'AbortController',
    back: 'Cancels in-flight fetch requests: pass controller.signal to fetch, then call controller.abort() — the request rejects with an AbortError.',
    category: 'Keyword'
  },
  {
    id: 'js-sse',
    front: 'Server-Sent Events (SSE)',
    back: 'A one-way stream of text events from server to browser over HTTP via EventSource. Auto-reconnects. Simpler than WebSockets but server→client only.',
    category: 'Keyword'
  },
  {
    id: 'js-web-worker',
    front: 'Web Workers',
    back: 'Background threads that run JS off the main thread, communicating via postMessage. Used for CPU-heavy work to keep the UI responsive. No DOM access.',
    category: 'Keyword'
  },
  {
    id: 'js-debugging-tools',
    front: 'How do you debug JavaScript?',
    back: 'Browser DevTools (breakpoints, watch, network, performance), console methods, the debugger statement, source maps, and linters/static analysis.',
    category: 'Q&A'
  },
  {
    id: 'js-garbage-collection',
    front: 'How does GC work in JS?',
    back: 'Automatic mark-and-sweep: from the roots, reachable objects are marked; unreachable ones are reclaimed. Leaks come from lingering references (closures, listeners, globals).',
    category: 'Q&A'
  },
  {
    id: 'js-extend-builtins',
    front: 'Why not extend built-in objects?',
    back: 'Modifying Array.prototype etc. risks collisions between libraries and breaks future spec methods. The only valid case is a spec-compliant polyfill.',
    category: 'Q&A'
  },
  {
    id: 'js-xss',
    front: 'XSS (Cross-Site Scripting)',
    back: 'Injecting malicious scripts into pages other users view. Prevent it by escaping/sanitizing output, avoiding innerHTML with user data, and using a Content Security Policy.',
    category: 'Keyword'
  },
  {
    id: 'js-csrf',
    front: 'CSRF (Cross-Site Request Forgery)',
    back: 'Tricking a logged-in user’s browser into making unwanted authenticated requests. Mitigate with anti-CSRF tokens, SameSite cookies, and proper CORS.',
    category: 'Keyword'
  },
  {
    id: 'js-csp',
    front: 'Content Security Policy (CSP)',
    back: 'An HTTP header whitelisting trusted content sources (scripts, styles, images), mitigating XSS and injection. Example: Content-Security-Policy: script-src self.',
    category: 'Keyword'
  },
  {
    id: 'js-same-origin',
    front: 'Same-origin policy',
    back: 'A browser rule restricting how a document from one origin (scheme+host+port) can interact with resources from another. CORS headers selectively relax it.',
    category: 'Keyword'
  },
  {
    id: 'js-singleton',
    front: 'Singleton pattern',
    back: 'Ensures a class has exactly one instance with a global access point — useful for shared resources like a config store or logger.',
    category: 'Keyword'
  },
  {
    id: 'js-factory-pattern',
    front: 'Factory pattern',
    back: 'A function/method that creates objects without exposing the exact class, deciding the concrete type at runtime — encapsulating instantiation logic.',
    category: 'Keyword'
  },
  {
    id: 'js-observer-pattern',
    front: 'Observer pattern',
    back: 'A subject keeps a list of observers and notifies them on state change — the basis of event systems and reactive UIs (pub/sub).',
    category: 'Keyword'
  },
  {
    id: 'js-module-pattern',
    front: 'Module pattern',
    back: 'An IIFE that returns an object exposing only public members while keeping others private via closure — encapsulation without global pollution.',
    category: 'Keyword'
  },
  {
    id: 'js-lexical-scope',
    front: 'Lexical scoping',
    back: 'Scope is determined by where code is WRITTEN (its physical nesting), not where it is called. Inner functions can access variables of their enclosing scopes.',
    category: 'Keyword'
  },
  {
    id: 'js-private-vars-closure',
    front: 'How do closures create private variables?',
    back: 'A variable declared in an outer function is inaccessible from outside, but inner functions returned from it can read/modify it — emulating private state.',
    category: 'Q&A'
  },
  {
    id: 'js-iife-fix',
    front: 'Why does `function foo(){}();` fail as an IIFE?',
    back: 'It’s parsed as a function DECLARATION followed by a stray `()`. Wrap it in parens to make it an expression: (function foo(){})();',
    category: 'Q&A'
  },
  {
    id: 'js-load-vs-domcontentloaded',
    front: 'load vs DOMContentLoaded',
    back: 'DOMContentLoaded fires when the HTML is parsed and the DOM is ready. load fires later, after all resources (images, stylesheets, subframes) finish loading.',
    category: 'Q&A'
  },
  {
    id: 'js-intl',
    front: 'The Intl namespace',
    back: 'Built-in internationalization: Intl.NumberFormat, Intl.DateTimeFormat, Intl.Collator, etc. — locale-aware formatting of numbers, dates, currency, and sorting.',
    category: 'Keyword'
  },
  {
    id: 'js-passive-listener',
    front: 'Passive event listeners',
    back: 'addEventListener(type, fn, { passive: true }) promises the handler will not call preventDefault, so the browser can scroll immediately instead of waiting — fixes scroll jank on touch/wheel events.',
    category: 'Q&A'
  },
  {
    id: 'js-custom-events',
    front: 'Custom events',
    back: 'new CustomEvent("name", { detail }) creates an event; el.dispatchEvent(ev) fires it and any addEventListener("name") handlers run. detail carries your payload. Lets components communicate via the DOM.',
    category: 'Q&A'
  },
  {
    id: 'js-keyboard-events',
    front: 'Keyboard event handling',
    back: 'Listen for keydown / keyup; read e.key ("Enter", "a", "ArrowUp") for the logical key and modifiers via e.ctrlKey / e.shiftKey. Prefer e.key over the deprecated e.keyCode.',
    category: 'Q&A'
  },
  {
    id: 'js-listener-leak',
    front: 'How do event listeners cause memory leaks?',
    back: 'A listener keeps a reference to its handler (and its closure) alive even after the element is gone, so the element/data can not be garbage-collected. Always removeEventListener with the SAME function reference on cleanup.',
    category: 'Q&A'
  },
  {
    id: 'js-race-condition',
    front: 'Race condition (async)',
    back: 'Two async operations whose outcome depends on which finishes first — e.g. a slow earlier request resolving after a newer one and overwriting it. Fix by cancelling stale work (AbortController) or ignoring out-of-order results.',
    category: 'Q&A'
  },
  {
    id: 'js-realtime-updates',
    front: 'WebSockets vs SSE vs polling',
    back: 'Polling: client re-requests on a timer (simple, wasteful). SSE: one-way server→client stream over HTTP, auto-reconnects. WebSockets: full-duplex two-way channel — pick it for chat/games where the client also pushes.',
    category: 'Q&A'
  },
  {
    id: 'js-service-worker',
    front: 'Service Worker',
    back: 'A background script acting as a network proxy between page and server. Intercepts fetch to serve from cache (offline support), and powers PWAs (push, background sync). HTTPS-only, no DOM access.',
    category: 'Keyword'
  },
  {
    id: 'js-web-components',
    front: 'Web Components',
    back: 'Browser-native reusable elements: Custom Elements (your own <my-tag>), Shadow DOM (encapsulated, style-isolated subtree), and <template>. Framework-agnostic.',
    category: 'Keyword'
  },
  {
    id: 'js-shadow-dom',
    front: 'Shadow DOM',
    back: 'An encapsulated DOM subtree attached to an element. Its markup and CSS are isolated — outside styles don’t leak in and its styles don’t leak out — which is how Web Components avoid CSS clashes.',
    category: 'Keyword'
  },
  {
    id: 'js-critical-rendering-path',
    front: 'Critical Rendering Path',
    back: 'The steps to paint a page: DOM + CSSOM → render tree → layout → paint → composite. CSS is render-blocking; sync <script> is parser-blocking — use defer/async to avoid stalling parse.',
    category: 'Q&A'
  },
  {
    id: 'js-script-defer-async',
    front: 'script vs defer vs async',
    back: 'Plain <script>: blocks HTML parsing while it loads + runs. defer: loads in parallel, runs after parse in order. async: loads in parallel, runs as soon as ready (order not guaranteed) — best for independent scripts like analytics.',
    category: 'Q&A'
  },
  {
    id: 'js-progressive-enhancement',
    front: 'Progressive enhancement vs graceful degradation',
    back: 'Progressive enhancement: build a working HTML baseline, then layer on CSS/JS. Graceful degradation: build the rich version, then add fallbacks. Both use feature detection (not UA sniffing).',
    category: 'Q&A'
  }
];

export const tsFlashcards: Flashcard[] = [
  {
    id: 'ts-interface-vs-type',
    front: 'interface vs type',
    back: 'Both describe shapes; interface supports declaration merging and is preferred for object/class contracts, type can express unions, tuples, and mapped types.',
    category: 'Q&A'
  },
  {
    id: 'ts-unknown-vs-any',
    front: 'unknown vs any',
    back: 'any disables type checking entirely; unknown is type-safe — you must narrow it before use. Prefer unknown.',
    category: 'Q&A'
  },
  {
    id: 'ts-generics',
    front: 'Generics',
    back: 'Type parameters that let a function/type work over many types while preserving the relationship, e.g. function identity<T>(x: T): T.',
    category: 'Keyword'
  },
  {
    id: 'ts-never',
    front: 'never',
    back: 'The type with no values — for functions that never return (throw/infinite loop) and for exhaustiveness checks in switch statements.',
    category: 'Keyword'
  },
  {
    id: 'ts-enum',
    front: 'enum',
    back: 'A named set of constants. Prefer union string literals or `as const` objects when you want zero runtime cost and tree-shaking.',
    category: 'Keyword'
  },
  {
    id: 'ts-narrowing',
    front: 'Type narrowing',
    back: 'Refining a broad type to a more specific one within a block using typeof, instanceof, in, or custom type guards.',
    category: 'Keyword'
  },

  // ─── From the TypeScript interview question bank ────────────────────────────
  {
    id: 'ts-vs-js',
    front: 'TypeScript vs JavaScript',
    back: 'TS is a statically-typed superset of JS, compiled (transpiled) to plain JS. It adds type annotations, interfaces, enums, generics, and access modifiers — caught at compile time, erased at runtime.',
    category: 'Q&A'
  },
  {
    id: 'ts-superset',
    front: 'Why is TS a “superset” of JS?',
    back: 'Every valid JavaScript program is also valid TypeScript. TS only adds optional features (mainly types) on top, so existing JS adopts gradually with little or no change.',
    category: 'Q&A'
  },
  {
    id: 'ts-basic-types',
    front: 'TypeScript basic types',
    back: 'boolean, number, string, array (T[] / Array<T>), tuple, enum, any, void, null, undefined, never, object, and function.',
    category: 'Q&A'
  },
  {
    id: 'ts-tuple',
    front: 'Tuple',
    back: 'A fixed-length array where each position has a known (possibly different) type, e.g. [string, number, boolean]. Order and length are type-checked.',
    category: 'Keyword'
  },
  {
    id: 'ts-void',
    front: 'void vs never',
    back: 'void: a function returns nothing (returns undefined). never: a function never returns at all — it always throws or loops forever.',
    category: 'Q&A'
  },
  {
    id: 'ts-any',
    front: 'Why avoid `any`?',
    back: 'any disables type checking entirely, defeating the point of TypeScript. Prefer unknown (type-safe) and narrow before use; reserve any for genuine escape hatches.',
    category: 'Q&A'
  },
  {
    id: 'ts-type-inference',
    front: 'Type inference',
    back: 'TS automatically determines a type from a value (let x = 10 → number) using a best-common-type algorithm — fewer annotations, same safety.',
    category: 'Keyword'
  },
  {
    id: 'ts-interface',
    front: 'What is an interface?',
    back: 'A contract describing the shape (properties and methods) an object or class must satisfy. Supports optional (?), readonly, call signatures, and index signatures.',
    category: 'Q&A'
  },
  {
    id: 'ts-enum-when',
    front: 'When use an enum?',
    back: 'To name a fixed set of related constants (HTTP methods, weekdays) and avoid magic values. Numeric enums auto-increment from 0; string enums log meaningful values. Union literals are a zero-runtime alternative.',
    category: 'Q&A'
  },
  {
    id: 'ts-function-types',
    front: 'How do you type a function?',
    back: 'Annotate params and return: function f(a: number): string. Supports optional (a?), default (a = 1), rest (...a: number[]) params, overloads, and call signatures.',
    category: 'Q&A'
  },
  {
    id: 'ts-overloads',
    front: 'Function overloads',
    back: 'Multiple signatures for one function so its return/param types vary by input shape. Declare the overload signatures, then one implementation that handles all of them.',
    category: 'Keyword'
  },
  {
    id: 'ts-classes-vs-es6',
    front: 'TS classes vs ES6 classes',
    back: 'TS adds access modifiers (public/private/protected), readonly, abstract classes, parameter properties, field declarations, and accessor typing on top of ES6 classes.',
    category: 'Q&A'
  },
  {
    id: 'ts-access-modifiers',
    front: 'public / private / protected',
    back: 'public (default): accessible everywhere. private: only within the declaring class. protected: within the class and its subclasses. Enforced at compile time.',
    category: 'Q&A'
  },
  {
    id: 'ts-abstract-class',
    front: 'Abstract class',
    back: 'A base class that cannot be instantiated; it can declare abstract methods (no body) that subclasses must implement, alongside fully implemented shared methods.',
    category: 'Keyword'
  },
  {
    id: 'ts-parameter-properties',
    front: 'Parameter properties',
    back: 'A shorthand: adding an access modifier to a constructor parameter (constructor(private name: string)) declares AND initializes the class field in one step.',
    category: 'Keyword'
  },
  {
    id: 'ts-readonly',
    front: 'readonly',
    back: 'Marks a property assignable only at declaration or in the constructor — compile-time immutability. (For arrays, ReadonlyArray<T> / readonly T[].)',
    category: 'Keyword'
  },
  {
    id: 'ts-inheritance',
    front: 'How do you implement inheritance?',
    back: 'Use class Child extends Parent and call super(...) in the constructor. Override methods by redeclaring them, calling super.method() to reuse the parent’s logic.',
    category: 'Q&A'
  },
  {
    id: 'ts-tsconfig',
    front: 'tsconfig.json',
    back: 'The config file for the tsc compiler — sets target, module, strict, outDir/rootDir, lib, and include/exclude globs. Run `tsc` to transpile .ts → .js.',
    category: 'Keyword'
  },
  {
    id: 'ts-strict',
    front: 'What does "strict": true enable?',
    back: 'A bundle of strict checks: noImplicitAny, strictNullChecks, strictFunctionTypes, noImplicitThis, and more — the recommended baseline for type safety.',
    category: 'Q&A'
  },
  {
    id: 'ts-readonly-vs-const',
    front: 'const vs readonly',
    back: 'const locks a variable BINDING (can’t reassign). readonly locks a class/interface PROPERTY (can’t reassign after init). Neither deep-freezes object contents.',
    category: 'Q&A'
  },

  // ─── Focused subset (topics 16–39 from the question bank) ───────────────────
  {
    id: 'ts-type-assertion',
    front: 'Type assertion (as)',
    back: 'Tells the compiler to treat a value as a specific type — value as Type (or <Type>value). No runtime conversion; it can lie, so use sparingly.',
    category: 'Keyword'
  },
  {
    id: 'ts-assertion-vs-casting',
    front: 'Type assertion vs type casting',
    back: 'A TS assertion (as) is compile-time only — it reinterprets the type, emits no code, and is erased. Runtime "casting" (Number(x), String(x)) actually converts the value.',
    category: 'Q&A'
  },
  {
    id: 'ts-as-const',
    front: 'as const',
    back: 'A const assertion: makes a literal deeply readonly and narrows it to its literal type (e.g. "GET" instead of string). Great for config objects and union sources.',
    category: 'Keyword'
  },
  {
    id: 'ts-non-null-assertion',
    front: 'Non-null assertion (!)',
    back: 'value! tells the compiler value is not null/undefined here, removing those from its type. Compile-time only — wrong assertions still crash at runtime.',
    category: 'Keyword'
  },
  {
    id: 'ts-discriminated-union',
    front: 'Discriminated union',
    back: 'A union of object types sharing a literal "tag" field (e.g. kind: "circle"). Switching on the tag narrows the type and enables exhaustiveness checks via never.',
    category: 'Keyword'
  },
  {
    id: 'ts-type-alias-vs-interface',
    front: 'Type alias vs interface (again)',
    back: 'type aliases name ANY type (unions, tuples, primitives, mapped/conditional). interfaces describe object/class shapes and support declaration merging + extends.',
    category: 'Q&A'
  },
  {
    id: 'ts-generic-constraint',
    front: 'Generic constraint (extends)',
    back: '<T extends U> limits which types T can be, so you can safely use U’s members. e.g. <T extends { length: number }> guarantees a .length.',
    category: 'Keyword'
  },
  {
    id: 'ts-keyof-constraint',
    front: '<T, K extends keyof T>',
    back: 'A common constraint pattern: K must be a real key of T, so get(obj, key) returns T[K] and rejects typo’d keys at compile time.',
    category: 'Q&A'
  },
  {
    id: 'ts-decorator',
    front: 'Decorator',
    back: 'A function that annotates/modifies a class, method, accessor, property, or parameter. Prefixed with @, requires experimentalDecorators (legacy) or the TS 5 stage-3 form.',
    category: 'Keyword'
  },
  {
    id: 'ts-decorator-kinds',
    front: 'Kinds of decorators',
    back: 'Class, method, accessor, property, and parameter decorators. They run at class-definition time and can observe or replace what they decorate (logging, DI, validation).',
    category: 'Q&A'
  },
  {
    id: 'ts-modules-vs-namespaces',
    front: 'Modules vs namespaces',
    back: 'ES modules (import/export, one per file) are the modern standard. Namespaces (namespace X {}) are a legacy way to group code in one global scope — avoid in new code.',
    category: 'Q&A'
  },
  {
    id: 'ts-module-resolution',
    front: 'Module resolution',
    back: 'How tsc locates imports: "node" (node_modules lookup, the common choice) or "classic". baseUrl + paths set up import aliases.',
    category: 'Keyword'
  },
  {
    id: 'ts-declaration-files',
    front: 'Declaration files (.d.ts)',
    back: 'Type-only files describing the shape of JS code with no implementation. They let TypeScript type-check untyped JS libraries.',
    category: 'Keyword'
  },
  {
    id: 'ts-definitelytyped',
    front: 'DefinitelyTyped / @types',
    back: 'A community repo of .d.ts files for JS libraries, published under the @types npm scope (e.g. npm i -D @types/lodash). Auto-discovered by tsc.',
    category: 'Q&A'
  },
  {
    id: 'ts-static-keyword',
    front: 'static (class members)',
    back: 'Members declared static belong to the class itself, not instances — accessed as ClassName.member. Good for constants, counters, and factory methods.',
    category: 'Keyword'
  },
  {
    id: 'ts-getters-setters',
    front: 'getters & setters',
    back: 'Accessor methods (get/set) that look like properties but run logic on read/write — used for validation, computed values, or wrapping a private backing field.',
    category: 'Keyword'
  },
  {
    id: 'ts-index-signature',
    front: 'Index signature',
    back: '{ [key: string]: T } lets an object have any number of keys of a given type. Record<K, V> is the utility-type equivalent.',
    category: 'Keyword'
  }
];
