import type { QuickRecallSection } from '@/types/content';

export const jsQuickRecall: QuickRecallSection[] = [
  {
    title: '🔒 Closures & Scope',
    items: [
      {
        concept: 'Closure',
        bullets: [
          'A function that remembers variables from its outer (enclosing) scope',
          'Created every time a function is created (capture lexical environment)',
          'Enables: data privacy, factory functions, memoization, partial application'
        ],
        codeSnippet: `const make = x => y => x + y; // closes over x
const add5 = make(5);
add5(3); // 8`,
        warning: 'Loop trap: var in for-loop + async callback captures the SAME variable. Fix with let or IIFE.'
      },
      {
        concept: 'Scope types',
        bullets: [
          'Global scope — accessible everywhere',
          'Function scope — var is function-scoped',
          'Block scope — let / const are block-scoped ({ })',
          'Lexical scope — determined where the function is WRITTEN, not called'
        ]
      }
    ]
  },
  {
    title: '⬆️ Hoisting',
    items: [
      {
        concept: 'var vs let/const vs function declarations',
        bullets: [
          'var — hoisted AND initialised to undefined. Can read before assignment (gets undefined)',
          'let / const — hoisted but NOT initialised → Temporal Dead Zone (TDZ). ReferenceError if accessed before declaration',
          'function declaration — FULLY hoisted (declaration + body). Callable before its line',
          'function expression (const fn = () => {}) — only the variable is hoisted, not the function body'
        ],
        codeSnippet: `console.log(a); // undefined (var)
console.log(b); // ReferenceError (let TDZ)
foo();          // works — function declaration
var a = 1;
let b = 2;
function foo() {}`,
        warning: 'TDZ error says "Cannot access \'b\' before initialization" — NOT "b is not defined".'
      }
    ]
  },
  {
    title: '👉 this Keyword',
    items: [
      {
        concept: '4 binding rules (in priority order)',
        bullets: [
          '1. new binding — new Fn() → this = new object',
          '2. Explicit binding — call/apply/bind → this = first arg',
          '3. Implicit binding — obj.method() → this = obj',
          '4. Default binding — standalone fn() → this = globalThis (undefined in strict mode)'
        ]
      },
      {
        concept: 'Arrow functions',
        bullets: [
          'Arrow functions do NOT have their own this',
          'They inherit this from the enclosing lexical scope at DEFINITION TIME',
          'Cannot be used as constructors (no new)',
          'Great for callbacks that need to preserve outer this'
        ],
        codeSnippet: `class Timer {
  seconds = 0;
  start() {
    setInterval(() => this.seconds++, 1000); // arrow — inherits 'this'
  }
}`,
        warning: 'obj.method = () => {} — this is NOT obj. Arrow methods inherit outer (often global) scope.'
      }
    ]
  },
  {
    title: '🔄 Event Loop',
    items: [
      {
        concept: 'Execution order',
        bullets: [
          '1. Synchronous code runs on the call stack',
          '2. After each task: drain the ENTIRE microtask queue',
          '3. Then process the next macrotask',
          'Microtasks: Promise.then/catch, queueMicrotask, MutationObserver',
          'Macrotasks: setTimeout, setInterval, I/O callbacks, UI events'
        ],
        codeSnippet: `console.log('1');                          // sync
setTimeout(() => console.log('4'), 0);     // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('2');                          // sync
// Output: 1, 2, 3, 4`,
        warning: 'Promise.resolve().then() ALWAYS runs before setTimeout(fn, 0) — microtasks first.'
      }
    ]
  },
  {
    title: '🤝 Promises & async/await',
    items: [
      {
        concept: 'Promise states',
        bullets: [
          'pending → fulfilled | rejected (immutable once settled)',
          '.then(onFulfilled, onRejected) returns a NEW Promise (chainable)',
          '.catch(fn) = .then(undefined, fn)',
          '.finally(fn) runs regardless, does not receive value'
        ]
      },
      {
        concept: 'Promise combinators',
        bullets: [
          'Promise.all([...]) — resolves when ALL resolve; rejects on FIRST rejection',
          'Promise.allSettled([...]) — always resolves; returns {status, value/reason} for each',
          'Promise.race([...]) — settles with the FIRST to settle (either)',
          'Promise.any([...]) — resolves with FIRST fulfillment; rejects only if ALL reject (AggregateError)'
        ],
        codeSnippet: `// Parallel fetches (don't await sequentially!)
const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);`
      },
      {
        concept: 'async/await gotchas',
        bullets: [
          'async function always returns a Promise',
          'await pauses ONLY inside the async function — outer code continues',
          'Avoid sequential awaits for independent tasks — use Promise.all',
          'Always wrap in try/catch or add .catch() on the returned promise',
          'Never use await inside forEach — use for...of or Promise.all(arr.map(async))'
        ],
        warning: 'await in forEach is BROKEN — forEach does not await promises. Use for...of or map + Promise.all.'
      }
    ]
  },
  {
    title: '✨ ES6+ Essentials',
    items: [
      {
        concept: 'Destructuring',
        bullets: [
          'Object: const { a, b: alias, c = default } = obj',
          'Array: const [first, , third, ...rest] = arr',
          'Nested: const { user: { address: { city } } } = data',
          'In function params: function fn({ id, name = "anon" }) {}'
        ]
      },
      {
        concept: 'Spread & Rest',
        bullets: [
          'Spread arrays: [...arr1, ...arr2] — shallow merge',
          'Spread objects: { ...obj1, ...obj2 } — later keys override',
          'Rest params: function fn(a, ...rest) — rest is a real Array',
          'Spread is SHALLOW — nested objects are still shared by reference'
        ],
        warning: 'Object spread is a shallow clone. Nested objects are still the same reference.'
      },
      {
        concept: '?. and ??',
        bullets: [
          'obj?.prop — returns undefined instead of throwing on null/undefined',
          'arr?.[0] — safe index access',
          'fn?.() — calls only if fn is a function',
          'a ?? b — fallback ONLY for null/undefined (not 0 or "")',
          'a || b — fallback for any FALSY value (0, "", false, null, undefined)'
        ],
        warning: '0 ?? "default" → 0. But 0 || "default" → "default". Use ?? when 0 is a valid value.'
      }
    ]
  },
  {
    title: '📦 Array Methods',
    items: [
      {
        concept: 'Transforming (returns new array)',
        bullets: [
          'map(fn) — transform each element, same length',
          'filter(fn) — keep elements where fn returns true',
          'flatMap(fn) — map then flat(1) — replaces reduce for 1-level flattening',
          'flat(depth) — flatten nested arrays, default depth 1'
        ],
        codeSnippet: `[1,2,3].map(x => x * 2);           // [2,4,6]
[1,2,3,4].filter(x => x % 2 === 0); // [2,4]
[[1,2],[3,4]].flat();                // [1,2,3,4]`
      },
      {
        concept: 'Aggregating (returns single value)',
        bullets: [
          'reduce(fn, init) — accumulate to any value',
          'find(fn) — first matching element or undefined',
          'findIndex(fn) — index of first match or -1',
          'some(fn) — true if ANY element passes',
          'every(fn) — true if ALL elements pass',
          'includes(val) — true if val is in array (uses SameValueZero)'
        ]
      },
      {
        concept: 'Sorting & mutating (mutates original!)',
        bullets: [
          'sort((a,b) => a - b) — MUTATES the array (spread first for immutable sort)',
          'reverse() — MUTATES',
          'splice(i, n, ...items) — remove n items at i, optionally insert',
          'Safe sort: [...arr].sort(comparator)'
        ],
        warning: 'sort() mutates the original array. Always spread first for a safe copy: [...arr].sort()'
      }
    ]
  },
  {
    title: '🧱 Prototype & Classes',
    items: [
      {
        concept: 'Prototype chain',
        bullets: [
          'Every object has [[Prototype]] — forms a chain up to null',
          'Property lookup: own props → prototype → prototype.prototype → null',
          'Object.create(proto) — create object with custom prototype',
          '__proto__ is the accessor; Object.getPrototypeOf(obj) is preferred'
        ]
      },
      {
        concept: 'ES6 Classes',
        bullets: [
          'Syntactic sugar over prototype-based inheritance',
          'constructor() called on new ClassName()',
          'super() must be first in subclass constructor',
          'static methods on the class, not prototype',
          '#field — truly private field (not just convention)',
          'Methods defined in class body live on the prototype (shared)'
        ],
        codeSnippet: `class Animal {
  #name;
  constructor(n) { this.#name = n; }
  speak() { return this.#name; }
}
class Dog extends Animal {
  speak() { return super.speak() + ': woof'; }
}`
      }
    ]
  },
  {
    title: '⚠️ Common Gotchas',
    items: [
      {
        concept: 'Type coercion traps',
        bullets: [
          'typeof null → "object" (historical bug)',
          'typeof [] → "object" (use Array.isArray)',
          'NaN !== NaN — use Number.isNaN() to check',
          '[] + [] → "" | [] + {} → "[object Object]" | {} + [] → 0',
          'parseInt("08") — may fail in old engines; always pass radix: parseInt("08", 10)'
        ],
        warning: 'Always use === for comparisons. typeof null is "object" — a bug that will never be fixed.'
      },
      {
        concept: 'Pass by value vs reference',
        bullets: [
          'Primitives (number, string, boolean, null, undefined, symbol, bigint) are passed by VALUE',
          'Objects and arrays are passed by REFERENCE (the reference is copied, not the object)',
          'Mutating a function parameter object mutates the original',
          'To avoid: spread / Object.assign for shallow clone, structuredClone for deep clone'
        ]
      }
    ]
  }
];

// ─── TypeScript Essentials (appended to JS Quick Recall page) ───────────────
export const tsQuickRecall: QuickRecallSection[] = [
  {
    title: '📘 TypeScript Essentials',
    items: [
      {
        concept: 'type vs interface',
        bullets: [
          'interface — open, can be extended with extends, supports declaration merging',
          'type — closed (no merging), supports unions, intersections, primitives, tuples',
          'Prefer interface for object shapes / public APIs',
          'Prefer type for unions, intersections, and complex computed types'
        ]
      },
      {
        concept: 'Generics',
        bullets: [
          '<T> introduces a type variable resolved at use site',
          'Constraint: <T extends SomeType>',
          'Default: <T = string>',
          'Multiple: <T, K extends keyof T>'
        ],
        codeSnippet: `function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`
      },
      {
        concept: 'Key Utility Types',
        bullets: [
          'Partial<T> — all optional',
          'Required<T> — all required',
          'Pick<T, K> — keep only K keys',
          'Omit<T, K> — remove K keys',
          'Record<K, V> — object with keys K and values V',
          'ReturnType<typeof fn> — extract return type',
          'NonNullable<T> — remove null & undefined'
        ]
      },
      {
        concept: 'Type Guards',
        bullets: [
          'typeof x === "string" — narrows to string',
          'x instanceof Date — narrows to Date',
          '"prop" in obj — narrows to type with that prop',
          'Custom: function isUser(x): x is User { ... }',
          'Discriminated union: check a "kind" | "type" literal field'
        ]
      }
    ]
  }
];
