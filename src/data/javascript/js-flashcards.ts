import type { Flashcard } from '@/types/content';

// ─── JavaScript flashcards — keyword/abbreviation defs + small Q&A ────────────

export const jsFlashcards: Flashcard[] = [
  {
    id: 'js-const-init',
    front: "What is the requirement for initializing a 'const' variable?",
    back: 'It must be given a value on the same line it is declared — const x; on its own is a syntax error, because you could never assign it later.',
    category: 'Q&A'
  },
  {
    id: 'js-tdz',
    front: 'TDZ',
    back: 'Temporal Dead Zone — the stretch between entering a scope and reaching a let/const declaration. Touch the variable in that window and you get a ReferenceError instead of undefined.',
    category: 'Keyword'
  },
  {
    id: 'js-hoisting',
    front: 'Hoisting',
    back: 'Before running your code, JavaScript registers every declaration at the top of its scope. var gets a placeholder value (undefined) and whole function declarations become usable early; let/const are registered but locked (the TDZ) until their line.',
    category: 'Keyword'
  },
  {
    id: 'js-closure',
    front: 'Closure',
    back: 'A function that remembers the variables from where it was created and can keep using them even after that outer function has returned. It is how JavaScript does private state.',
    category: 'Keyword'
  },
  {
    id: 'js-event-loop',
    front: 'Event Loop',
    back: 'The cycle that lets single-threaded JS handle async work: run the current code to completion, drain the whole microtask queue (promises), take ONE macrotask (timers, clicks), repeat.',
    category: 'Keyword'
  },
  {
    id: 'js-microtask',
    front: 'What runs first: a Promise callback or a setTimeout callback?',
    back: 'The Promise callback. Promises go in the microtask queue, which is fully emptied before the next macrotask (setTimeout) gets a turn — even setTimeout(fn, 0) waits.',
    category: 'Q&A'
  },
  {
    id: 'js-let-vs-var',
    front: 'let vs var',
    back: 'let lives only inside its { } block and errors if used before its line (TDZ). var belongs to the whole function, ignores blocks, and reads as undefined before its line.',
    category: 'Q&A'
  },
  {
    id: 'js-eq-vs-eqeq',
    front: '== vs ===',
    back: '=== compares value AND type, no conversion — different types means not equal. == converts the values toward a common type first, which is why 1 == "1" is true. Prefer === to avoid the surprises.',
    category: 'Q&A'
  },
  {
    id: 'js-iife',
    front: 'IIFE',
    back: 'Immediately Invoked Function Expression — a function defined and called in one go: (function(){ … })(). It runs once and its variables stay private inside, which was the classic way to avoid globals.',
    category: 'Keyword'
  },
  {
    id: 'js-this',
    front: "What determines the value of 'this' in a regular function?",
    back: 'How the function is CALLED, not where it was written — obj.method() makes this obj, a plain call makes it the global object (or undefined in strict mode). Arrow functions are the exception: they just borrow this from the surrounding code.',
    category: 'Q&A'
  },
  {
    id: 'js-arrow-this',
    front: 'Do arrow functions have their own `this`?',
    back: 'No — they use the `this` of the code around them, and nothing can rebind it. They also lack their own `arguments` and cannot be called with `new`.',
    category: 'Q&A'
  },
  {
    id: 'js-prototype',
    front: 'Prototype chain',
    back: "Every object has a hidden link to another object (its prototype). Ask for a property the object doesn't have, and JavaScript follows the links — object, prototype, prototype's prototype — until it finds it or hits null.",
    category: 'Keyword'
  },
  {
    id: 'js-coercion',
    front: 'Type coercion',
    back: 'JavaScript silently converting a value from one type to another mid-operation — like turning the number 1 into "1" when you write 1 + "2". Happens with +, ==, and boolean contexts.',
    category: 'Keyword'
  },
  {
    id: 'js-nullish',
    front: '?? vs ||',
    back: '?? falls back only when the left side is truly missing (null or undefined). || falls back on ANY falsy value — so it wrongly replaces a legitimate 0, "", or false. Use ?? for defaults.',
    category: 'Q&A'
  },
  {
    id: 'js-optional-chaining',
    front: 'Optional chaining (?.)',
    back: 'Safe property access: user?.address?.city returns undefined instead of crashing when a link in the chain is null/undefined. The rest of the chain is skipped the moment that happens.',
    category: 'Keyword'
  },
  {
    id: 'js-debounce',
    front: 'Debounce',
    back: 'Wait for the calls to STOP before running: each new call resets a timer, and only the final call (after a quiet period) actually fires. Perfect for search-as-you-type and window resize.',
    category: 'Keyword'
  },
  {
    id: 'js-throttle',
    front: 'Throttle',
    back: 'Run at most once per time window, no matter how often it is called — a steady drumbeat during continuous activity. Perfect for scroll handlers.',
    category: 'Keyword'
  },
  {
    id: 'js-shallow-vs-deep',
    front: 'Shallow copy vs deep copy',
    back: 'A shallow copy (spread, Object.assign) duplicates only the top level — nested objects are still SHARED with the original. A deep copy (structuredClone) clones every level, fully independent.',
    category: 'Q&A'
  },
  {
    id: 'js-promise-all',
    front: 'Promise.all vs Promise.allSettled',
    back: 'Promise.all is all-or-nothing: the first rejection fails the whole batch. Promise.allSettled waits for everything and gives you a per-promise report of {status, value|reason} — it never rejects.',
    category: 'Q&A'
  },
  {
    id: 'js-spread-rest',
    front: 'Spread vs rest (...)',
    back: 'Same dots, opposite directions: spread unpacks a collection into individual items ([...arr], fn(...args)); rest gathers loose items into one ((...args) in params, {a, ...rest} in destructuring).',
    category: 'Q&A'
  },
  {
    id: 'js-pure-function',
    front: 'Pure function',
    back: 'Same inputs, same output, every time — and it touches nothing outside itself (no mutations, no I/O, no globals). Pure functions are trivially testable and safe to cache.',
    category: 'Keyword'
  },
  {
    id: 'js-memoization',
    front: 'Memoization',
    back: "Remembering a function's answer for inputs it has already seen: first call computes and caches, repeat calls with the same inputs return the cached result instantly. Only valid for pure functions.",
    category: 'Keyword'
  },

  // ─── From GreatFrontEnd interview question bank ─────────────────────────────
  {
    id: 'js-data-types',
    front: 'What are the data types in JavaScript?',
    back: 'Seven primitives — string, number, boolean, null, undefined, symbol, bigint — plus one compound type: object (covering arrays, functions, dates, plain objects). Watch out: typeof null wrongly says "object".',
    category: 'Q&A'
  },
  {
    id: 'js-typeof-null',
    front: 'What does typeof null return?',
    back: '"object" — a bug from JavaScript\'s first version, kept forever for backward compatibility. To actually test for null, write value === null.',
    category: 'Q&A'
  },
  {
    id: 'js-null-vs-undefined',
    front: 'null vs undefined vs undeclared',
    back: 'undefined: declared but never given a value — the engine\'s default. null: a developer deliberately assigned "no value". undeclared: the variable doesn\'t exist at all — reading it throws a ReferenceError.',
    category: 'Q&A'
  },
  {
    id: 'js-string-to-number',
    front: 'How do you convert a string to a number?',
    back: 'Number(str) (strict — any junk gives NaN), parseInt(str, 10) / parseFloat(str) (lenient — they read digits until the first non-numeric character), or the unary plus: +str.',
    category: 'Q&A'
  },
  {
    id: 'js-call-vs-apply',
    front: '.call vs .apply',
    back: 'Both run a function immediately with a `this` you choose. The only difference is argument packaging: .call(thisArg, a, b) lists them; .apply(thisArg, [a, b]) takes an array. Mnemonic: Apply = Array.',
    category: 'Q&A'
  },
  {
    id: 'js-bind',
    front: 'Function.prototype.bind',
    back: "Returns a NEW function with `this` (and optionally some leading arguments) permanently locked in — it doesn't run anything yet. The go-to for callbacks that must keep their `this`, and for pre-filling arguments.",
    category: 'Keyword'
  },
  {
    id: 'js-this-rules',
    front: 'What determines `this` (the 4 rules)?',
    back: 'In precedence order: new Foo() → the new instance; call/apply/bind → the object you passed; obj.method() → obj; a plain fn() → the global object (undefined in strict mode). Arrow functions ignore all four and inherit `this` from their surroundings.',
    category: 'Q&A'
  },
  {
    id: 'js-new-keyword',
    front: 'What does the `new` keyword do?',
    back: "Four steps: creates a fresh object, links its prototype to the constructor's .prototype, runs the constructor with `this` bound to the new object, and returns it (unless the constructor explicitly returns a different object).",
    category: 'Q&A'
  },
  {
    id: 'js-func-decl-vs-expr',
    front: 'Function declaration vs function expression',
    back: 'A declaration (function foo(){}) is hoisted whole — callable before its line. An expression (const foo = function(){}) is just a variable holding a function, so calling it early throws.',
    category: 'Q&A'
  },
  {
    id: 'js-class-vs-constructor',
    front: 'ES2015 class vs ES5 function constructor',
    back: 'Same prototype machinery, nicer syntax. class adds extends/super for inheritance (vs manual prototype wiring), non-enumerable methods, automatic strict mode — and unlike function constructors, classes cannot be used before their line.',
    category: 'Q&A'
  },
  {
    id: 'js-higher-order-fn',
    front: 'Higher-order function',
    back: 'A function that works with other functions — taking them as arguments (map, filter, reduce), returning them (bind, debounce), or both. Possible because functions are ordinary values in JavaScript.',
    category: 'Keyword'
  },
  {
    id: 'js-callback',
    front: 'Callback function',
    back: 'A function you hand to another function to be called later — right away (map calls yours per element) or eventually (setTimeout, event handlers). Nesting callbacks inside callbacks is the "callback hell" promises were invented to fix.',
    category: 'Keyword'
  },
  {
    id: 'js-anonymous-fn',
    front: 'Anonymous function — typical use?',
    back: "A function with no name, written where it's needed: inline callbacks to map/setTimeout/addEventListener, or wrapped as an IIFE to create a private scope.",
    category: 'Q&A'
  },
  {
    id: 'js-recursion',
    front: 'Recursion',
    back: 'A function that calls itself, shrinking the problem each time until a "base case" stops it. Forget the base case and the call stack overflows (RangeError). Natural fit for trees and nested structures.',
    category: 'Keyword'
  },
  {
    id: 'js-curry',
    front: 'Currying',
    back: 'Reshaping f(a, b, c) into f(a)(b)(c) — a chain of one-argument functions, each remembering what came before via closures. Lets you build specialised functions from general ones: add(1) is now a reusable "+1".',
    category: 'Keyword'
  },
  {
    id: 'js-partial-application',
    front: 'Currying vs partial application',
    back: 'Currying is strict: always one argument per call, f(a)(b)(c). Partial application is casual: fix ANY number of arguments now (f.bind(null, a, b)) and take the rest later.',
    category: 'Q&A'
  },
  {
    id: 'js-event-bubbling',
    front: 'Event bubbling vs capturing',
    back: 'Bubbling (the default): the event fires on the clicked element, then climbs UP through its ancestors to the root. Capturing is the reverse trip — root DOWN to the target — and needs {capture: true} to opt in.',
    category: 'Q&A'
  },
  {
    id: 'js-event-delegation',
    front: 'Event delegation',
    back: "One listener on the parent instead of one per child: since events bubble up, the parent hears every child's click and checks e.target to see which one it was. Fewer listeners, and newly added children work automatically.",
    category: 'Keyword'
  },
  {
    id: 'js-prevent-vs-stop',
    front: 'preventDefault vs stopPropagation',
    back: "Two independent brakes: preventDefault() cancels the browser's built-in reaction (form submit, link navigation); stopPropagation() stops the event travelling on to ancestor elements' handlers.",
    category: 'Q&A'
  },
  {
    id: 'js-mouseenter-vs-mouseover',
    front: 'mouseenter vs mouseover',
    back: "mouseenter fires once, when the pointer enters the element itself, and doesn't bubble. mouseover bubbles and fires again every time the pointer moves onto a child inside the element — noisier.",
    category: 'Q&A'
  },
  {
    id: 'js-script-async-defer',
    front: 'script vs async vs defer',
    back: "A plain <script> halts HTML parsing while it downloads and runs. defer downloads in parallel and runs after parsing, preserving order. async downloads in parallel and runs the instant it's ready — order not guaranteed.",
    category: 'Q&A'
  },
  {
    id: 'js-cookie-storage',
    front: 'cookie vs localStorage vs sessionStorage',
    back: "Cookies (~4KB) travel to the server with every request — that's their point and their cost. localStorage (~5MB) stays in the browser and survives restarts. sessionStorage is the same but per-tab, wiped when the tab closes.",
    category: 'Q&A'
  },
  {
    id: 'js-innerhtml-vs-textcontent',
    front: 'innerHTML vs textContent',
    back: 'innerHTML parses the string as real HTML — powerful, and an XSS hole if the string came from a user. textContent treats everything as literal text — safe and faster. (innerText is textContent that respects CSS visibility.)',
    category: 'Q&A'
  },
  {
    id: 'js-queryselector-vs-getbyid',
    front: 'querySelector vs getElementById',
    back: 'querySelector accepts any CSS selector ("#id", ".class", "ul > li") and returns the first match — flexible. getElementById does one thing — lookup by id — and is the fastest way to do it.',
    category: 'Q&A'
  },
  {
    id: 'js-promise-states',
    front: 'States of a Promise',
    back: 'Pending (still working) → fulfilled (succeeded with a value) OR rejected (failed with a reason). Once it settles either way, it is frozen — the state and value can never change again.',
    category: 'Q&A'
  },
  {
    id: 'js-promise-vs-callback',
    front: 'Promises vs callbacks — why prefer Promises?',
    back: 'Flat .then chains instead of nested "callback hell"; ONE .catch that handles a failure from any step; and built-in composition (all/allSettled/race/any) for running things in parallel.',
    category: 'Q&A'
  },
  {
    id: 'js-promise-all-use',
    front: 'Promise.all — what does it do?',
    back: "Runs promises in parallel and resolves with an array of all their results — but it's all-or-nothing: the first rejection makes the whole thing reject immediately (fail-fast).",
    category: 'Q&A'
  },
  {
    id: 'js-promise-any-race',
    front: 'Promise.race vs Promise.any',
    back: 'race takes the FIRST promise to settle either way — a fast failure wins the race (useful for timeouts). any waits for the first SUCCESS, and only fails if every promise fails (AggregateError).',
    category: 'Q&A'
  },
  {
    id: 'js-async-await',
    front: 'async / await',
    back: 'Promise syntax that reads like normal code: an async function always returns a promise, and await pauses that function until a promise settles, handing you its value. Failures throw — catch them with try/catch.',
    category: 'Keyword'
  },
  {
    id: 'js-microtask-queue',
    front: 'Microtask queue',
    back: 'The priority queue of the event loop: promise callbacks, code after an await, queueMicrotask, MutationObserver. It is drained COMPLETELY after each task, before any setTimeout (macrotask) gets a turn.',
    category: 'Keyword'
  },
  {
    id: 'js-prototype-chain',
    front: 'Prototype chain',
    back: "The lookup path for properties: object → its prototype → that one's prototype → ... → Object.prototype → null. It's how JavaScript implements inheritance — by delegating lookups, not copying methods.",
    category: 'Keyword'
  },
  {
    id: 'js-classical-vs-prototypal',
    front: 'Classical vs prototypal inheritance',
    back: 'Classical (Java/C++): classes are blueprints and instances are stamped-out copies. Prototypal (JavaScript): objects link directly to other objects and forward failed lookups to them at runtime — delegation, not copying.',
    category: 'Q&A'
  },
  {
    id: 'js-static-members',
    front: 'Why use static class members?',
    back: 'For things that belong to the concept, not to any single instance — utility methods, constants, factory functions, an instances-created counter. Accessed as ClassName.member; invisible on instances.',
    category: 'Q&A'
  },
  {
    id: 'js-symbol',
    front: 'What are Symbols used for?',
    back: "Property keys that can never collide with anyone else's — each Symbol() is unique. Also the language's extension hooks: well-known symbols like Symbol.iterator let your objects plug into for...of and other built-in behaviour.",
    category: 'Q&A'
  },
  {
    id: 'js-proxy',
    front: 'What are Proxies used for?',
    back: 'Wrapping an object so every read, write, or check can be intercepted by your "trap" functions — enabling validation, logging, access control, and reactivity (Vue 3\'s entire reactivity system is Proxies).',
    category: 'Q&A'
  },
  {
    id: 'js-map-vs-object',
    front: 'Map vs plain object',
    back: 'Map: keys of any type, guaranteed order, a .size, directly iterable, faster for constant adding/removing. Object: string/symbol keys only, but JSON-serialisable and the natural choice for fixed-shape data.',
    category: 'Q&A'
  },
  {
    id: 'js-weakmap',
    front: 'Map/Set vs WeakMap/WeakSet',
    back: 'Weak versions hold their object keys loosely: if nothing else uses the key, the garbage collector may reclaim it, entry and all. The price: no iteration, no size. Great for caches and per-object metadata that should die with the object.',
    category: 'Q&A'
  },
  {
    id: 'js-set-equality',
    front: 'How do Set/Map compare object keys?',
    back: 'By reference — "is it literally the same object?" — never by contents. So a Set happily holds two separate {a: 1} literals; they look identical but are different objects.',
    category: 'Q&A'
  },
  {
    id: 'js-mutable-immutable',
    front: 'Mutable vs immutable',
    back: 'Mutable values can be changed in place (objects, arrays). Immutable values cannot — primitives like strings and numbers never change; "modifying" them creates new values. Object.freeze makes an object immutable, but only one level deep.',
    category: 'Q&A'
  },
  {
    id: 'js-freeze-seal',
    front: 'Object.freeze vs Object.seal',
    back: 'freeze: fully read-only — no adding, deleting, or changing properties. seal: the shape is locked (no add/delete) but existing values can still be reassigned. Both stop at the first level — nested objects stay mutable.',
    category: 'Q&A'
  },
  {
    id: 'js-shallow-deep-copy-methods',
    front: 'How do you deep-copy an object?',
    back: 'structuredClone(obj) is the modern answer — handles nesting, Dates, Maps. The old JSON.parse(JSON.stringify(obj)) trick works but silently drops functions, undefined, and mangles Dates. Spread and Object.assign are shallow only.',
    category: 'Q&A'
  },
  {
    id: 'js-object-empty',
    front: 'How do you check if an object is empty?',
    back: 'Object.keys(obj).length === 0 covers the usual case. If symbol keys could exist too, Reflect.ownKeys(obj).length === 0 catches everything.',
    category: 'Q&A'
  },
  {
    id: 'js-has-property',
    front: 'How do you check if an object has a property?',
    back: 'Object.hasOwn(obj, key) — the modern, reliable way to check the object\'s OWN properties. "key" in obj also answers yes for inherited properties from the prototype chain — sometimes what you want, often not.',
    category: 'Q&A'
  },
  {
    id: 'js-commonjs-vs-esm',
    front: 'CommonJS vs ES Modules',
    back: "CommonJS (require/module.exports): Node's original system, loads synchronously, resolved at runtime. ESM (import/export): the official standard — static and analysable at build time, which is what makes tree shaking possible.",
    category: 'Q&A'
  },
  {
    id: 'js-tree-shaking',
    front: 'Tree shaking',
    back: 'The bundler dropping exports nothing imports — dead code falls out of the bundle like dead leaves off a shaken tree. Only works with ES modules, whose imports can be analysed without running the code.',
    category: 'Keyword'
  },
  {
    id: 'js-iterator-generator',
    front: 'Iterators vs generators',
    back: 'An iterator is the product: an object whose next() returns {value, done}. A generator (function*) is the factory: call it and you get an iterator whose code pauses at each yield and resumes on the next next().',
    category: 'Q&A'
  },
  {
    id: 'js-strict-mode',
    front: "'use strict'",
    back: "Opts into a stricter JavaScript where silent mistakes become loud errors: typo'd assignments throw instead of creating globals, read-only writes throw, plain-call `this` is undefined. ES modules and classes are strict automatically.",
    category: 'Keyword'
  },
  {
    id: 'js-polyfill',
    front: 'Polyfill',
    back: 'Code that fills a gap in older environments by implementing a missing modern API (say, Array.prototype.includes) — so you can write modern JavaScript and have it work in old browsers too.',
    category: 'Keyword'
  },
  {
    id: 'js-fetch-vs-xhr',
    front: 'fetch vs XMLHttpRequest',
    back: 'fetch is the modern, promise-based API — cleaner and stream-friendly, with one trap: it does NOT reject on HTTP errors like 404, so check res.ok yourself. XHR is the older, callback-and-event-based predecessor.',
    category: 'Q&A'
  },
  {
    id: 'js-abortcontroller',
    front: 'AbortController',
    back: 'The cancel button for fetch: pass controller.signal into the request, and calling controller.abort() later kills it mid-flight — the promise rejects with an AbortError. Essential for search-as-you-type and unmount cleanup.',
    category: 'Keyword'
  },
  {
    id: 'js-sse',
    front: 'Server-Sent Events (SSE)',
    back: 'A one-way live stream from server to browser over plain HTTP, consumed via EventSource — with automatic reconnection built in. Simpler than WebSockets when the client only listens (feeds, notifications, progress).',
    category: 'Keyword'
  },
  {
    id: 'js-web-worker',
    front: 'Web Workers',
    back: "A way to run JavaScript on a real background thread, so CPU-heavy work (parsing, crunching) doesn't freeze the page. Communication is by message passing (postMessage); workers can't touch the DOM.",
    category: 'Keyword'
  },
  {
    id: 'js-debugging-tools',
    front: 'How do you debug JavaScript?',
    back: 'Browser DevTools first: breakpoints and step-through, the Network and Performance tabs. Plus console methods (table, trace, time), the debugger statement to break from code, source maps to debug original files, and linters to catch bugs before runtime.',
    category: 'Q&A'
  },
  {
    id: 'js-garbage-collection',
    front: 'How does GC work in JS?',
    back: 'Automatically, by mark-and-sweep: starting from the "roots" (globals, the current stack), everything reachable gets marked; whatever isn\'t reachable gets reclaimed. Leaks happen when forgotten references — closures, listeners, globals — keep dead things reachable.',
    category: 'Q&A'
  },
  {
    id: 'js-extend-builtins',
    front: 'Why not extend built-in objects?',
    back: 'Adding your own methods to Array.prototype and friends invites collisions — with other libraries doing the same, and with future language versions claiming that name (it has happened). The one legitimate case: a spec-compliant polyfill.',
    category: 'Q&A'
  },
  {
    id: 'js-xss',
    front: 'XSS (Cross-Site Scripting)',
    back: "An attacker's script running in your users' browsers, injected through input your site rendered as HTML. Defences: escape/sanitise output, use textContent instead of innerHTML for user data, and set a Content Security Policy.",
    category: 'Keyword'
  },
  {
    id: 'js-csrf',
    front: 'CSRF (Cross-Site Request Forgery)',
    back: "A malicious page making the user's browser fire authenticated requests at your site — the session cookie tags along automatically. Defences: anti-CSRF tokens, SameSite cookies, and Origin-header checks.",
    category: 'Keyword'
  },
  {
    id: 'js-csp',
    front: 'Content Security Policy (CSP)',
    back: "An HTTP header listing where scripts, styles, and images are allowed to come from — anything else refuses to run. The strongest browser-side backstop against XSS. Example: Content-Security-Policy: script-src 'self'.",
    category: 'Keyword'
  },
  {
    id: 'js-same-origin',
    front: 'Same-origin policy',
    back: 'The browser rule that a page may only read responses from its own origin (scheme + host + port) — stopping any random site from reading your logged-in accounts elsewhere. Servers relax it deliberately with CORS headers.',
    category: 'Keyword'
  },
  {
    id: 'js-singleton',
    front: 'Singleton pattern',
    back: 'Guarantee exactly ONE instance, shared by everyone who asks — right for config stores, loggers, connection pools. In JavaScript, a module exporting one object is a natural singleton.',
    category: 'Keyword'
  },
  {
    id: 'js-factory-pattern',
    front: 'Factory pattern',
    back: 'One creation function that decides at runtime which kind of object to build and return — callers never touch concrete constructors, so implementations can change in one place.',
    category: 'Keyword'
  },
  {
    id: 'js-observer-pattern',
    front: 'Observer pattern',
    back: "A subject keeps a list of subscriber functions and calls them all when something changes — the newsletter model. It's the idea inside addEventListener, EventEmitter, and every reactive UI.",
    category: 'Keyword'
  },
  {
    id: 'js-module-pattern',
    front: 'Module pattern',
    back: 'An IIFE that returns only its public methods; everything else stays trapped inside the closure — real private state, no globals. The pre-ES-modules ancestor of import/export.',
    category: 'Keyword'
  },
  {
    id: 'js-lexical-scope',
    front: 'Lexical scoping',
    back: 'What a function can see is fixed by WHERE it is written in the source — its physical nesting — not by where it happens to be called from. This is the rule that makes closures possible.',
    category: 'Keyword'
  },
  {
    id: 'js-private-vars-closure',
    front: 'How do closures create private variables?',
    back: "Declare a variable inside an outer function and return inner functions that use it: outside code can't reach the variable directly, but the returned functions can — they're the only doorway to it.",
    category: 'Q&A'
  },
  {
    id: 'js-iife-fix',
    front: 'Why does `function foo(){}();` fail as an IIFE?',
    back: 'The parser reads it as a function DECLARATION followed by a stray, empty () — a syntax error. Wrapping it in parentheses — (function foo(){})() — forces it to be parsed as an expression, which can be called.',
    category: 'Q&A'
  },
  {
    id: 'js-load-vs-domcontentloaded',
    front: 'load vs DOMContentLoaded',
    back: 'DOMContentLoaded fires as soon as the HTML is parsed — the DOM is ready to work with. load fires later, once EVERYTHING (images, stylesheets, iframes) has finished downloading.',
    category: 'Q&A'
  },
  {
    id: 'js-intl',
    front: 'The Intl namespace',
    back: 'Built-in internationalisation: Intl.NumberFormat, Intl.DateTimeFormat, Intl.Collator and friends format numbers, dates, and currency — and sort text — correctly for any locale, no library needed.',
    category: 'Keyword'
  },
  {
    id: 'js-passive-listener',
    front: 'Passive event listeners',
    back: 'addEventListener(type, fn, { passive: true }) is a promise to the browser: "I won\'t call preventDefault". Freed from waiting to find out, the browser scrolls immediately — fixing touch/wheel scroll jank.',
    category: 'Q&A'
  },
  {
    id: 'js-custom-events',
    front: 'Custom events',
    back: 'Make your own events: new CustomEvent("cart:add", { detail }) carries your payload, el.dispatchEvent(ev) fires it, and any addEventListener("cart:add") handler receives it. Lets separate parts of an app talk through the DOM.',
    category: 'Q&A'
  },
  {
    id: 'js-keyboard-events',
    front: 'Keyboard event handling',
    back: 'Listen for keydown/keyup and read e.key — a readable name like "Enter", "a", or "ArrowUp" — plus e.ctrlKey/e.shiftKey for modifiers. e.keyCode is deprecated; e.key replaced it.',
    category: 'Q&A'
  },
  {
    id: 'js-listener-leak',
    front: 'How do event listeners cause memory leaks?',
    back: 'A registered listener keeps its handler — and everything the handler\'s closure references — alive, even after the element is "gone". Clean up with removeEventListener, passing the SAME function reference you added (inline arrows can never be removed).',
    category: 'Q&A'
  },
  {
    id: 'js-race-condition',
    front: 'Race condition (async)',
    back: 'When the outcome depends on which async operation happens to finish first — classically, a slow OLD request resolving after a newer one and overwriting fresh results with stale ones. Fix: abort the previous request (AbortController) or discard out-of-date responses.',
    category: 'Q&A'
  },
  {
    id: 'js-realtime-updates',
    front: 'WebSockets vs SSE vs polling',
    back: 'Polling: ask the server again on a timer — simple, wasteful. SSE: the server streams to the client over HTTP, one-way, auto-reconnecting. WebSockets: a persistent two-way channel — the choice when the client also pushes (chat, games).',
    category: 'Q&A'
  },
  {
    id: 'js-service-worker',
    front: 'Service Worker',
    back: 'A background script that sits between your page and the network, intercepting requests — so it can answer from a cache (offline support) and power PWA features like push and background sync. HTTPS-only, no DOM access.',
    category: 'Keyword'
  },
  {
    id: 'js-web-components',
    front: 'Web Components',
    back: "The browser's native component system: Custom Elements (your own <my-tag>), Shadow DOM (a style-isolated internal tree), and <template> (inert, cloneable markup). Works with any framework or none.",
    category: 'Keyword'
  },
  {
    id: 'js-shadow-dom',
    front: 'Shadow DOM',
    back: "A private DOM subtree attached to an element, sealed off from the page: outside CSS can't style into it, and its styles can't leak out. This isolation is how Web Components avoid CSS clashes.",
    category: 'Keyword'
  },
  {
    id: 'js-critical-rendering-path',
    front: 'Critical Rendering Path',
    back: "The browser's pipeline from code to pixels: HTML → DOM, CSS → CSSOM, combined into the render tree, then layout → paint → composite. CSS blocks rendering and a plain <script> blocks parsing — hence critical CSS and defer/async.",
    category: 'Q&A'
  },
  {
    id: 'js-script-defer-async',
    front: 'script vs defer vs async',
    back: 'Plain <script>: parsing stops while it loads and runs. defer: loads in parallel, runs after parsing, keeps order — right for app code. async: loads in parallel, runs whenever ready, any order — right for independent scripts like analytics.',
    category: 'Q&A'
  },
  {
    id: 'js-progressive-enhancement',
    front: 'Progressive enhancement vs graceful degradation',
    back: 'Two directions to the same goal. Progressive enhancement: start with working HTML, layer CSS/JS on top. Graceful degradation: build the rich version, then add fallbacks. Either way, detect features ("IntersectionObserver" in window) — never sniff user agents.',
    category: 'Q&A'
  }
];

export const tsFlashcards: Flashcard[] = [
  {
    id: 'ts-interface-vs-type',
    front: 'interface vs type',
    back: 'Both describe object shapes. interface can be reopened and extended (declaration merging) — the usual pick for object/class contracts. type can name ANY type: unions, tuples, mapped and conditional types.',
    category: 'Q&A'
  },
  {
    id: 'ts-unknown-vs-any',
    front: 'unknown vs any',
    back: 'any switches type checking OFF for that value — anything goes, errors included. unknown is the safe version: the compiler forces you to narrow it (typeof checks etc.) before you can use it. Prefer unknown.',
    category: 'Q&A'
  },
  {
    id: 'ts-generics',
    front: 'Generics',
    back: 'Type placeholders that keep the relationship between inputs and outputs: function identity<T>(x: T): T says "whatever type goes in comes back out" — reusable across all types without losing safety.',
    category: 'Keyword'
  },
  {
    id: 'ts-never',
    front: 'never',
    back: 'The type with NO possible values. It marks functions that never return (always throw, or loop forever) and powers exhaustiveness checks: if a switch handles every case, the leftover type is never.',
    category: 'Keyword'
  },
  {
    id: 'ts-enum',
    front: 'enum',
    back: 'A named set of constants (enum Method { GET, POST }). Note the trade-off: enums generate real runtime code — union string literals or `as const` objects give the same safety with zero runtime cost.',
    category: 'Keyword'
  },
  {
    id: 'ts-narrowing',
    front: 'Type narrowing',
    back: "Convincing the compiler a broad type is something more specific inside a block — via typeof, instanceof, the in operator, or a custom type guard. After the check, TypeScript lets you use the narrowed type's members.",
    category: 'Keyword'
  },

  // ─── From the TypeScript interview question bank ────────────────────────────
  {
    id: 'ts-vs-js',
    front: 'TypeScript vs JavaScript',
    back: 'TypeScript is JavaScript plus a static type layer, compiled down to plain JS. Types, interfaces, generics, and access modifiers are checked at compile time and then completely erased — nothing type-related exists at runtime.',
    category: 'Q&A'
  },
  {
    id: 'ts-superset',
    front: 'Why is TS a “superset” of JS?',
    back: "Every valid JavaScript file is already valid TypeScript — TS only ADDS optional features (mainly types) on top. That's why a codebase can adopt it file by file, gradually.",
    category: 'Q&A'
  },
  {
    id: 'ts-basic-types',
    front: 'TypeScript basic types',
    back: "The JS primitives (boolean, number, string, null, undefined), arrays (T[]), plus TS's own: tuple (fixed-shape array), enum, any (unchecked), unknown (checked), void (returns nothing), never (never returns), and object/function types.",
    category: 'Q&A'
  },
  {
    id: 'ts-tuple',
    front: 'Tuple',
    back: 'An array with a fixed length where each position has its own known type — [string, number] means exactly two elements, a string then a number. Order and length are enforced by the compiler.',
    category: 'Keyword'
  },
  {
    id: 'ts-void',
    front: 'void vs never',
    back: 'void: the function finishes but hands back nothing useful (returns undefined). never: the function never finishes normally at all — it always throws or loops forever.',
    category: 'Q&A'
  },
  {
    id: 'ts-any',
    front: 'Why avoid `any`?',
    back: 'Because it turns the type checker off for that value — and everything it flows into. Typos and wrong calls sail through to runtime. Use unknown instead (it forces narrowing) and keep any for genuine escape hatches.',
    category: 'Q&A'
  },
  {
    id: 'ts-type-inference',
    front: 'Type inference',
    back: "TypeScript figuring out types you didn't write: let x = 10 is a number, and the return type of a function is inferred from its returns. You get full checking with far fewer annotations.",
    category: 'Keyword'
  },
  {
    id: 'ts-interface',
    front: 'What is an interface?',
    back: 'A named contract for a shape: which properties and methods something must have. Supports optional members (?), readonly, call signatures, and index signatures — and classes can `implements` it.',
    category: 'Q&A'
  },
  {
    id: 'ts-enum-when',
    front: 'When use an enum?',
    back: 'When a value must be one of a fixed set of named constants — HTTP methods, weekdays, states — instead of magic strings/numbers. String enums log readable values; union literals ("GET" | "POST") do the same job with no runtime output.',
    category: 'Q&A'
  },
  {
    id: 'ts-function-types',
    front: 'How do you type a function?',
    back: 'Annotate the parameters and the return: function f(a: number): string. The parameter list also supports optional (a?), defaults (a = 1), and rest (...a: number[]) — plus overloads for input-dependent signatures.',
    category: 'Q&A'
  },
  {
    id: 'ts-overloads',
    front: 'Function overloads',
    back: 'Several declared signatures for one function, so callers see different param/return types depending on what they pass — backed by a single implementation that handles all the cases.',
    category: 'Keyword'
  },
  {
    id: 'ts-classes-vs-es6',
    front: 'TS classes vs ES6 classes',
    back: 'Same classes, more compile-time tools: access modifiers (public/private/protected), readonly fields, abstract classes, parameter properties (declare + assign in the constructor signature), and typed accessors.',
    category: 'Q&A'
  },
  {
    id: 'ts-access-modifiers',
    front: 'public / private / protected',
    back: 'Who may access a class member: public (the default) — anyone; private — only code inside the declaring class; protected — the class plus its subclasses. All enforced at compile time only (erased at runtime, unlike JS #fields).',
    category: 'Q&A'
  },
  {
    id: 'ts-abstract-class',
    front: 'Abstract class',
    back: "A base class you can't instantiate directly — it exists to be extended. It can mix fully implemented shared methods with abstract ones (no body) that every subclass MUST implement.",
    category: 'Keyword'
  },
  {
    id: 'ts-parameter-properties',
    front: 'Parameter properties',
    back: 'The constructor shorthand: constructor(private name: string) both DECLARES the class field and ASSIGNS the argument to it — one line instead of three.',
    category: 'Keyword'
  },
  {
    id: 'ts-readonly',
    front: 'readonly',
    back: "A property that can be set once — at declaration or in the constructor — and never reassigned after. Compile-time only. For arrays there's readonly T[] / ReadonlyArray<T>, which also bans push/pop.",
    category: 'Keyword'
  },
  {
    id: 'ts-inheritance',
    front: 'How do you implement inheritance?',
    back: "class Child extends Parent, with super(...) called first in the child constructor. Override a method by redeclaring it — and call super.method() inside when you want to build on the parent's version rather than replace it.",
    category: 'Q&A'
  },
  {
    id: 'ts-tsconfig',
    front: 'tsconfig.json',
    back: "The TypeScript compiler's config file: which files to include, what JS version to emit (target), the module system, strictness flags, and output folders. Running `tsc` reads it and transpiles .ts → .js.",
    category: 'Keyword'
  },
  {
    id: 'ts-strict',
    front: 'What does "strict": true enable?',
    back: 'The whole family of strict checks at once — noImplicitAny (no silent any), strictNullChecks (null/undefined must be handled explicitly), strictFunctionTypes, noImplicitThis, and more. The recommended baseline for any new project.',
    category: 'Q&A'
  },
  {
    id: 'ts-readonly-vs-const',
    front: 'const vs readonly',
    back: "They lock different things: const locks a VARIABLE (can't point it elsewhere); readonly locks a PROPERTY on a class or interface (can't reassign after init). Neither freezes the contents of the object itself.",
    category: 'Q&A'
  },

  // ─── Focused subset (topics 16–39 from the question bank) ───────────────────
  {
    id: 'ts-type-assertion',
    front: 'Type assertion (as)',
    back: '"Trust me, compiler": value as Type makes TypeScript treat the value as that type. Nothing changes at runtime — and nothing verifies your claim, so a wrong assertion is a hidden bug. Use sparingly.',
    category: 'Keyword'
  },
  {
    id: 'ts-assertion-vs-casting',
    front: 'Type assertion vs type casting',
    back: 'An assertion (as) only changes what the COMPILER believes — no code is emitted, the value is untouched. Real casting — Number(x), String(x) — actually converts the value at runtime. Same word in other languages, very different things here.',
    category: 'Q&A'
  },
  {
    id: 'ts-as-const',
    front: 'as const',
    back: 'Freezes a literal at the type level: every property becomes readonly, and values narrow to their exact literal types ("GET" instead of string). The standard tool for config objects and for deriving unions from arrays.',
    category: 'Keyword'
  },
  {
    id: 'ts-non-null-assertion',
    front: 'Non-null assertion (!)',
    back: 'value! tells the compiler "this is definitely not null or undefined here" and strips those from the type. Purely compile-time — if you were wrong, it still crashes at runtime. Prefer real checks or ?. where possible.',
    category: 'Keyword'
  },
  {
    id: 'ts-discriminated-union',
    front: 'Discriminated union',
    back: 'A union of object types that all carry a literal "tag" field — kind: "circle" | "square". switch on the tag and TypeScript narrows each branch to the right shape; a default assigning to never proves you handled every case.',
    category: 'Keyword'
  },
  {
    id: 'ts-type-alias-vs-interface',
    front: 'Type alias vs interface (again)',
    back: 'type can name anything — unions, tuples, primitives, mapped/conditional types. interface is specialised for object/class shapes, and only interfaces can be reopened (declaration merging) — which is why libraries expose interfaces for augmentation.',
    category: 'Q&A'
  },
  {
    id: 'ts-generic-constraint',
    front: 'Generic constraint (extends)',
    back: '<T extends U> restricts which types T may be, in exchange for letting you use U\'s members safely. <T extends { length: number }> means "anything, as long as it has a .length" — and .length is then legal inside.',
    category: 'Keyword'
  },
  {
    id: 'ts-keyof-constraint',
    front: '<T, K extends keyof T>',
    back: "The typed-lookup pattern: K must be a real key of T, so get(obj, key) returns exactly T[K] — and a typo'd key is a compile error, not a runtime undefined.",
    category: 'Q&A'
  },
  {
    id: 'ts-decorator',
    front: 'Decorator',
    back: 'An @-prefixed function that annotates or modifies a class, method, accessor, property, or parameter — how NestJS and Angular do routing and dependency injection. Legacy mode needs experimentalDecorators; TS 5 supports the standard (stage-3) form.',
    category: 'Keyword'
  },
  {
    id: 'ts-decorator-kinds',
    front: 'Kinds of decorators',
    back: 'Five targets: class, method, accessor, property, and parameter decorators. They run once, when the class is defined (not per instance), and can observe or replace what they decorate — logging, validation, DI registration.',
    category: 'Q&A'
  },
  {
    id: 'ts-modules-vs-namespaces',
    front: 'Modules vs namespaces',
    back: "ES modules — one file, import/export — are the standard; use them. namespace X {} is TypeScript's legacy way of grouping code in a shared global scope, from before modules were universal — avoid in new code.",
    category: 'Q&A'
  },
  {
    id: 'ts-module-resolution',
    front: 'Module resolution',
    back: 'The rules tsc uses to turn an import string into a file on disk — normally the Node-style node_modules walk. baseUrl and paths in tsconfig add custom aliases like @/components.',
    category: 'Keyword'
  },
  {
    id: 'ts-declaration-files',
    front: 'Declaration files (.d.ts)',
    back: "Files containing only type information — the shape of some JavaScript, with no implementation. They're how TypeScript can type-check your use of a plain-JS library.",
    category: 'Keyword'
  },
  {
    id: 'ts-definitelytyped',
    front: 'DefinitelyTyped / @types',
    back: "The community's giant collection of .d.ts files for JS libraries that don't ship their own types, published as @types packages (npm i -D @types/lodash). The compiler picks them up automatically.",
    category: 'Q&A'
  },
  {
    id: 'ts-static-keyword',
    front: 'static (class members)',
    back: 'Members that belong to the class itself rather than instances — accessed as ClassName.member, invisible on instances. The home for constants, counters, and factory methods.',
    category: 'Keyword'
  },
  {
    id: 'ts-getters-setters',
    front: 'getters & setters',
    back: 'Methods (get/set) that LOOK like plain properties to callers but run code on read/write — for validation, computed values, or guarding a private backing field.',
    category: 'Keyword'
  },
  {
    id: 'ts-index-signature',
    front: 'Index signature',
    back: '{ [key: string]: T } — "any number of keys, each holding a T". The way to type dictionary-like objects; Record<K, V> is the utility-type spelling of the same idea.',
    category: 'Keyword'
  }
];
