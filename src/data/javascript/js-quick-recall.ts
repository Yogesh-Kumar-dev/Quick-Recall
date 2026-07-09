import type { QuickRecallSection } from '@/types/content';

export const jsQuickRecall: QuickRecallSection[] = [
  {
    title: 'Closures & Scope',
    items: [
      {
        concept: 'Closure',
        bullets: [
          'A function that remembers the variables from where it was created , even after that outer function has returned.',
          'You don\'t opt in , every function automatically captures its surrounding scope ("lexical environment").',
          'What it buys you: private state, factory functions, memoization caches, partial application.'
        ],
        codeSnippet: `const make = x => y => x + y; // closes over x
const add5 = make(5);
add5(3); // 8`,
        warning:
          'The loop trap: a var loop variable is ONE shared variable, so every async callback sees its final value. Declare it with let (fresh per iteration) instead.'
      },
      {
        concept: 'Scope types',
        bullets: [
          'Global scope , declared outside everything, visible everywhere.',
          'Function scope , var and parameters belong to the whole function, ignoring blocks.',
          'Block scope , let / const live only inside the nearest { }.',
          'Lexical scope , what a function can see is fixed by WHERE it is written, not where it is called from.'
        ]
      }
    ]
  },
  {
    title: 'Hoisting',
    items: [
      {
        concept: 'var vs let/const vs function declarations',
        bullets: [
          'var , registered AND initialised to undefined at the top of its scope. Read it before its line and you get undefined, not an error.',
          'let / const , registered but locked until their line (the Temporal Dead Zone). Touching them early throws a ReferenceError.',
          'function declaration , hoisted whole, body included. Callable from lines above where it is written.',
          "function expression (const fn = () => {}) , it's just a variable holding a function, so only the variable name hoists, not the function."
        ],
        codeSnippet: `console.log(a); // undefined (var)
console.log(b); // ReferenceError (let TDZ)
foo();          // works — function declaration
var a = 1;
let b = 2;
function foo() {}`,
        warning:
          'You can tell a TDZ error apart: it says "Cannot access \'b\' before initialization" , a truly missing variable says "b is not defined".'
      }
    ]
  },
  {
    title: 'this Keyword',
    items: [
      {
        concept: '4 binding rules (in priority order)',
        bullets: [
          '1. new binding , new Fn() → this is the freshly created object.',
          '2. Explicit binding , call/apply/bind → this is whatever object you passed in.',
          '3. Implicit binding , obj.method() → this is obj, the thing left of the dot.',
          '4. Default binding , a bare fn() → this is globalThis (or undefined in strict mode).'
        ]
      },
      {
        concept: 'Arrow functions',
        bullets: [
          'Arrow functions have NO this of their own.',
          'They simply use the this of the surrounding code, captured where they are DEFINED , and nothing can rebind it.',
          "They can't be constructors , calling one with new throws.",
          "That capture is exactly why they're perfect for callbacks inside methods (the setInterval example below)."
        ],
        codeSnippet: `class Timer {
  seconds = 0;
  start() {
    setInterval(() => this.seconds++, 1000); // arrow — inherits 'this'
  }
}`,
        warning:
          "Don't write object methods as arrows: obj.method = () => {} does NOT get obj as this , it inherits from outside the object (often the global scope)."
      }
    ]
  },
  {
    title: 'Event Loop',
    items: [
      {
        concept: 'Execution order',
        bullets: [
          '1. All synchronous code runs first, to completion, on the call stack.',
          '2. When the stack empties, the ENTIRE microtask queue is drained.',
          '3. Then ONE macrotask runs , and the cycle repeats.',
          'Microtasks (the urgent queue): Promise .then/.catch, code after await, queueMicrotask, MutationObserver.',
          'Macrotasks (the regular queue): setTimeout, setInterval, I/O callbacks, UI events.'
        ],
        codeSnippet: `console.log('1');                          // sync
setTimeout(() => console.log('4'), 0);     // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('2');                          // sync
// Output: 1, 2, 3, 4`,
        warning: 'A promise callback ALWAYS beats setTimeout(fn, 0) queued at the same time , microtasks jump the queue.'
      }
    ]
  },
  {
    title: 'Promises & async/await',
    items: [
      {
        concept: 'Promise states',
        bullets: [
          'pending → fulfilled (success) or rejected (failure) , and once settled, frozen forever.',
          ".then(onFulfilled, onRejected) returns a NEW promise , that's what makes chains possible.",
          '.catch(fn) is just shorthand for .then(undefined, fn) , it catches failures from anywhere earlier in the chain.',
          '.finally(fn) runs either way and receives nothing , the place for cleanup like hiding a spinner.'
        ]
      },
      {
        concept: 'Promise combinators',
        bullets: [
          'Promise.all([...]) , everything must succeed; the FIRST failure rejects the whole batch.',
          'Promise.allSettled([...]) , waits for all, never rejects; gives a {status, value|reason} report per promise.',
          'Promise.race([...]) , the FIRST to settle wins, success or failure (great for adding timeouts).',
          'Promise.any([...]) , the first SUCCESS wins; only fails if all fail (AggregateError).'
        ],
        codeSnippet: `// Parallel fetches (don't await sequentially!)
const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);`
      },
      {
        concept: 'async/await gotchas',
        bullets: [
          'An async function ALWAYS returns a promise , even a plain return value comes wrapped.',
          'await pauses only its own function , everything outside keeps running.',
          'Independent tasks awaited one after another run one after another , start them together with Promise.all.',
          'A rejected await throws , wrap in try/catch, or attach .catch() to the returned promise.',
          'Never await inside forEach , it fires all the callbacks without waiting. Use for...of, or Promise.all(arr.map(async ...)).'
        ],
        warning: 'await inside forEach is silently broken: forEach ignores the promises your callback returns, so nothing actually waits.'
      }
    ]
  },
  {
    title: 'ES6+ Essentials',
    items: [
      {
        concept: 'Destructuring',
        bullets: [
          'Objects: const { a, b: alias, c = fallback } = obj , pick, rename, and default in one line.',
          'Arrays: const [first, , third, ...rest] = arr , pick by position, skip with a gap, collect the tail.',
          'Nested data in one go: const { user: { address: { city } } } = data.',
          'Straight into function parameters: function fn({ id, name = "anon" }) {}.'
        ]
      },
      {
        concept: 'Spread & Rest',
        bullets: [
          'Spread arrays: [...arr1, ...arr2] , copy or merge in one expression.',
          'Spread objects: { ...obj1, ...obj2 } , merged; when keys collide, the later one wins.',
          'Rest params: function fn(a, ...rest) , the extras arrive as a genuine Array.',
          'Both copy ONE level deep only , nested objects inside are still shared with the original.'
        ],
        warning: "Spread is a shallow clone: the copy has the same nested objects as the original. Mutate one, you've mutated both."
      },
      {
        concept: '?. and ??',
        bullets: [
          'obj?.prop , undefined instead of a crash when obj is null/undefined.',
          'arr?.[0] , the same safety for index access.',
          'fn?.() , call it only if it exists.',
          'a ?? b , fall back ONLY when a is truly missing (null/undefined) , 0 and "" survive.',
          'a || b , falls back on ANY falsy value, replacing legitimate 0, "", and false too.'
        ],
        warning: '0 ?? "default" gives 0, but 0 || "default" gives "default" , use ?? whenever 0 or "" are values you want to keep.'
      }
    ]
  },
  {
    title: 'Array Methods',
    items: [
      {
        concept: 'Transforming (returns new array)',
        bullets: [
          'map(fn) , transform every element; same length out as in.',
          'filter(fn) , keep only the elements where fn returns true.',
          'flatMap(fn) , map, then flatten one level , perfect when each item can produce zero, one, or many results.',
          'flat(depth) , lift nested arrays up into the parent, one level by default.'
        ],
        codeSnippet: `[1,2,3].map(x => x * 2);           // [2,4,6]
[1,2,3,4].filter(x => x % 2 === 0); // [2,4]
[[1,2],[3,4]].flat();                // [1,2,3,4]`
      },
      {
        concept: 'Aggregating (returns single value)',
        bullets: [
          'reduce(fn, init) , fold the array into anything: a sum, an object, another array.',
          'find(fn) , the first element that passes the test, or undefined.',
          'findIndex(fn) , its position instead, or -1.',
          'some(fn) , "does at least one pass?" , stops at the first yes.',
          'every(fn) , "do they all pass?" , stops at the first no.',
          'includes(val) , is this value in the array? (and unlike indexOf, it can find NaN).'
        ]
      },
      {
        concept: 'Sorting & mutating (mutates original!)',
        bullets: [
          'sort((a,b) => a - b) , sorts IN PLACE, and without that comparator it sorts numbers as text ([10, 2, 1] → [1, 10, 2]).',
          'reverse() , also flips the array in place.',
          'splice(i, n, ...items) , surgically remove/insert in place.',
          'Want the original untouched? Copy first , [...arr].sort(comparator) , or use the ES2023 copies: toSorted / toReversed / toSpliced.'
        ],
        warning: 'sort() changes the original array , a classic React state bug. Spread first: [...arr].sort().'
      }
    ]
  },
  {
    title: 'Prototype & Classes',
    items: [
      {
        concept: 'Prototype chain',
        bullets: [
          'Every object holds a hidden link ([[Prototype]]) to another object, forming a chain that ends at null.',
          'Property lookup walks that chain: own properties → prototype → its prototype → ... → null.',
          'Object.create(proto) builds an object with exactly the prototype you choose.',
          'Read the link with Object.getPrototypeOf(obj) , the __proto__ accessor works but is the legacy spelling.'
        ]
      },
      {
        concept: 'ES6 Classes',
        bullets: [
          'Cleaner syntax over the same prototype system , not a new object model.',
          'constructor() runs on new ClassName() , per-instance setup goes here.',
          'In a subclass constructor, super() must run before you touch this.',
          'static members live on the class itself, not on instances.',
          '#field is genuinely private , inaccessible outside the class body, not just a naming convention.',
          'Methods in the class body are stored once on the prototype and shared by every instance.'
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
    title: 'Common Gotchas',
    items: [
      {
        concept: 'Type coercion traps',
        bullets: [
          'typeof null → "object" , a bug from 1995, kept forever. Check with value === null.',
          'typeof [] → "object" too , arrays need Array.isArray().',
          'NaN !== NaN , the one value not equal to itself. Check with Number.isNaN().',
          'The party tricks: [] + [] → "" · [] + {} → "[object Object]" · {} + [] → 0 (the {} parses as an empty block!).',
          'Always give parseInt its radix , parseInt("08", 10) , so the base is never guessed.'
        ],
        warning: 'Default to === everywhere. Loose == coercion rules are genuinely hard to memorise and breed subtle bugs.'
      },
      {
        concept: 'Pass by value vs reference',
        bullets: [
          'Primitives (number, string, boolean, null, undefined, symbol, bigint) are copied , the function gets its own value.',
          'Objects and arrays pass a copy of the REFERENCE , both variables point at the same underlying object.',
          "So mutating an object parameter inside a function mutates the caller's object too.",
          'Defend by copying: spread/Object.assign for one level, structuredClone for a full deep clone.'
        ]
      }
    ]
  }
];

// ─── TypeScript Essentials (appended to JS Quick Recall page) ───────────────
export const tsQuickRecall: QuickRecallSection[] = [
  {
    title: 'TypeScript Essentials',
    items: [
      {
        concept: 'type vs interface',
        bullets: [
          'interface , open: extendable with extends, and re-declarable to add members (declaration merging).',
          'type , closed (no merging), but it can name ANYTHING: unions, intersections, primitives, tuples.',
          'Reach for interface when describing object shapes and public APIs.',
          'Reach for type when you need unions, intersections, or computed/mapped types.'
        ]
      },
      {
        concept: 'Generics',
        bullets: [
          '<T> declares a type placeholder that gets filled in where the function/type is used.',
          'Constrain what\'s allowed: <T extends SomeType> , "any T, as long as it fits SomeType".',
          'Give it a default: <T = string>.',
          'Combine them: <T, K extends keyof T> , "K must be a real key of T" (the typed-lookup pattern below).'
        ],
        codeSnippet: `function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`
      },
      {
        concept: 'Key Utility Types',
        bullets: [
          'Partial<T> , every property becomes optional (perfect for update payloads).',
          'Required<T> , the reverse: everything mandatory.',
          'Pick<T, K> , a slimmed-down type keeping only the K keys.',
          'Omit<T, K> , the complement: everything EXCEPT the K keys.',
          'Record<K, V> , an object type with keys K and values V (a typed dictionary).',
          'ReturnType<typeof fn> , extract what a function returns, no manual retyping.',
          'NonNullable<T> , T with null and undefined stripped out.'
        ]
      },
      {
        concept: 'Type Guards',
        bullets: [
          'typeof x === "string" , narrows x to string inside the branch.',
          'x instanceof Date , narrows to Date.',
          '"prop" in obj , narrows to the union member that has that property.',
          'Custom guards: function isUser(x): x is User { ... } , your own check, trusted by the compiler.',
          'Discriminated unions: switch on a literal "kind"/"type" field and each case narrows automatically.'
        ]
      }
    ]
  }
];
