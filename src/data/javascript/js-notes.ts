import type { Note } from '@/types/content';

// category values:
//   ES versions: 'es6' | 'es7' | 'es8' | 'es9' | 'es10' | 'es11' | 'es12' | 'es13' | 'es14' | 'es2024'
//   Topic-based: 'string-methods' | 'array-methods' | 'dom' | 'error-handling' | 'async-js' | 'web-apis' | 'es2026'

export const jsNotes: Note[] = [
  // ─── ES6 / ES2015 ────────────────────────────────────────────────────────────
  {
    id: 'es6-arrow-functions',
    title: 'Arrow Functions',
    summary: 'Concise function syntax that lexically binds `this` instead of creating its own.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Shorter syntax: const add = (a, b) => a + b.',
      'No own `this` — inherits from enclosing lexical scope.',
      'No `arguments` object — use rest params (...args) instead.',
      'Cannot be used as constructors (no new).',
      'Implicit return when body is a single expression (no braces).'
    ],
    codeSnippet: `// Traditional
const double = function(x) { return x * 2; };

// Arrow — expression body (implicit return)
const double = x => x * 2;

// Arrow — block body
const greet = name => {
  const msg = \`Hello, \${name}\`;
  return msg;
};`
  },
  {
    id: 'es6-let-const',
    title: 'let & const',
    summary: 'Block-scoped alternatives to var; const prevents reassignment.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Both are block-scoped ({ }) unlike var which is function-scoped.',
      'Both are in the Temporal Dead Zone (TDZ) before their declaration.',
      'const prevents reassignment but does NOT make objects immutable.',
      'Prefer const by default; use let when reassignment is needed; avoid var.'
    ],
    codeSnippet: `let count = 0;
count = 1; // OK

const PI = 3.14159;
// PI = 3; // TypeError

const user = { name: 'Alice' };
user.name = 'Bob'; // OK — object itself is mutable
// user = {}; // TypeError — can't reassign the binding`
  },
  {
    id: 'es6-template-literals',
    title: 'Template Literals',
    summary: 'String literals using backticks that support interpolation and multi-line strings.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Delimited by backticks (`) instead of quotes.',
      'Embed expressions with ${expression}.',
      'Multi-line strings without \\n escapes.',
      'Tagged templates: a function can process the template parts.'
    ],
    codeSnippet: `const name = 'Alice';
const greeting = \`Hello, \${name}!\`;   // interpolation

const multiLine = \`
  Line 1
  Line 2
\`;

// Tagged template
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) =>
    acc + str + (values[i] !== undefined ? \`[\${values[i]}]\` : ''), '');
}
highlight\`Score: \${42} / \${100}\`; // "Score: [42] / [100]"`
  },
  {
    id: 'es6-destructuring',
    title: 'Destructuring',
    summary: 'Unpack values from arrays or properties from objects into distinct variables.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Object destructuring: const { a, b } = obj — can rename: { a: alias }.',
      'Array destructuring: const [first, , third] = arr — skip with commas.',
      'Default values: const { x = 10 } = {} — x is 10 when undefined.',
      'Nested: const { user: { name } } = data.',
      'Rest: const { a, ...rest } = obj — rest gets remaining props.',
      'Swap: [a, b] = [b, a].'
    ],
    codeSnippet: `const { name, age = 18, address: { city } } = user;
const [first, ...others] = [1, 2, 3];
function fn({ id, label = 'default' }) { /* ... */ }`
  },
  {
    id: 'es6-spread-rest',
    title: 'Spread & Rest (...)',
    summary: '... spreads an iterable into individual elements; rest collects remaining elements.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Spread in arrays: [...arr1, ...arr2] — shallow copy/merge.',
      'Spread in objects: { ...obj1, ...obj2 } — later keys win.',
      'Spread into function calls: Math.max(...nums).',
      'Rest params: function fn(a, b, ...rest) — rest is a real Array.',
      'Rest in destructuring: const [head, ...tail] = arr.'
    ],
    gotcha: 'Object spread is a SHALLOW copy. Nested objects are still shared by reference.',
    codeSnippet: `const merged = { ...defaults, ...overrides };
const copy = [...original];

function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}`
  },
  {
    id: 'es6-default-params',
    title: 'Default Parameters',
    summary: 'Function parameters can have default values, used when the argument is undefined.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Default triggers only when the argument is undefined (not null, 0, or "").',
      'Defaults are evaluated at call time, not definition time.',
      'Can reference earlier parameters: function f(a, b = a * 2).',
      'Works with destructuring: function f({ x = 0, y = 0 } = {}).'
    ],
    codeSnippet: `function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}
greet();          // "Hello, World!"
greet('Alice');   // "Hello, Alice!"
greet(null);      // "Hello, null!" — null is NOT undefined`
  },
  {
    id: 'es6-classes',
    title: 'Classes',
    summary: 'Syntactic sugar over prototypal inheritance — cleaner constructor + prototype method syntax.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'class Foo {} — methods go on Foo.prototype; instances share them.',
      'constructor() is called on new Foo().',
      'extends sets up the prototype chain.',
      'super() must be called first in a subclass constructor.',
      'static methods live on the class itself, not instances.',
      'Private fields (ES2022): #field — truly private.'
    ],
    codeSnippet: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}
class Dog extends Animal {
  speak() { return super.speak() + ' (woof)'; }
}`
  },
  {
    id: 'es6-modules',
    title: 'ES Modules (import / export)',
    summary: 'Native module system with static imports and exports for tree-shaking and encapsulation.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Named exports: export const foo = 1; — import { foo } from "./mod".',
      'Default export: export default fn; — import fn from "./mod".',
      'Re-export: export { foo } from "./other".',
      'Dynamic import: const mod = await import("./mod") — code splitting.',
      'ES modules are always in strict mode.',
      'Imports are live bindings — they reflect changes to the exported value.'
    ],
    codeSnippet: `// math.js
export const PI = 3.14;
export function add(a, b) { return a + b; }
export default class Calculator { /* ... */ }

// main.js
import Calculator, { PI, add } from './math.js';
import * as math from './math.js';`
  },
  {
    id: 'es6-promises',
    title: 'Promises',
    summary: 'An object representing the eventual completion (or failure) of an async operation.',
    difficulty: 'intermediate',
    category: 'es6',
    keyPoints: [
      'States: pending → fulfilled | rejected. Immutable once settled.',
      '.then(onFulfilled, onRejected) returns a new Promise — enables chaining.',
      '.catch(fn) is shorthand for .then(undefined, fn).',
      '.finally(fn) runs regardless of outcome.',
      'Promise.all / .allSettled / .race / .any — combinator methods.'
    ],
    textbookDef: `A Promise is an object representing the eventual completion or failure of an asynchronous computation and its resulting value. Defined in ECMAScript §27.2, a Promise occupies exactly one of three mutually exclusive states — pending, fulfilled, or rejected — and once it transitions from pending, its state and value are immutable.`,
    eli5: `A Promise is like a restaurant receipt when you order food.

Step 1: You order (kick off the async work). The receipt is "pending" — your food hasn't arrived yet.
Step 2: The kitchen finishes — "fulfilled" (food ready) or "rejected" (ran out).
Step 3: .then() is your action when food arrives — "great, I'll eat it."
Step 4: .catch() is your fallback — "no food? I'll order pizza."
Step 5: Once settled, the receipt can never go back to pending.`,
    codeSnippet: `const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
});

p.then(val => console.log(val))
 .catch(err => console.error(err))
 .finally(() => console.log('cleanup'));

// Combinators
Promise.all([p1, p2]).then(([r1, r2]) => { /* ... */ });
Promise.allSettled([p1, p2]).then(results => { /* ... */ });`
  },
  {
    id: 'es6-symbol',
    title: 'Symbol',
    summary: 'A primitive type for unique, non-string property keys — guaranteed collision-free.',
    difficulty: 'intermediate',
    category: 'es6',
    keyPoints: [
      'Symbol() creates a unique value — no two symbols are ever equal.',
      'Optional description: Symbol("id") — for debugging only, not identity.',
      'Well-known symbols: Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance.',
      'Not enumerable in for...in or Object.keys — use Object.getOwnPropertySymbols().',
      'Symbol.for("key") returns a shared global symbol — reuses across modules.'
    ],
    codeSnippet: `const id = Symbol('id');
const obj = { [id]: 42 };
console.log(obj[id]); // 42
console.log(Object.keys(obj)); // [] — symbol not included

// Well-known symbols
class MyArray {
  [Symbol.iterator]() { /* custom iterator */ }
}`
  },
  {
    id: 'es6-iterators-generators',
    title: 'Iterators & Generators',
    summary: 'Iterators define a sequence via next(); generators produce iterators with yield.',
    difficulty: 'advanced',
    category: 'es6',
    keyPoints: [
      'Iterator protocol: object with next() returning { value, done }.',
      'Iterable protocol: object with [Symbol.iterator]() returning an iterator.',
      'for...of consumes any iterable (arrays, strings, Map, Set, generators).',
      'function* declares a generator — execution pauses at each yield.',
      'Generator return value is { value: undefined, done: true }.',
      'Two-way communication: next(value) sends value to the last yield expression.'
    ],
    codeSnippet: `function* counter(start = 0) {
  while (true) {
    const reset = yield start++;
    if (reset) start = 0;
  }
}
const gen = counter(1);
gen.next();        // { value: 1, done: false }
gen.next();        // { value: 2, done: false }
gen.next(true);    // { value: 0, done: false } — reset`
  },
  {
    id: 'es6-map-set',
    title: 'Map & Set',
    summary: 'Map stores key-value pairs with any key type; Set stores unique values.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Map preserves insertion order; keys can be objects, functions, or primitives.',
      'Map methods: set, get, has, delete, size, forEach, keys(), values(), entries().',
      'Set stores unique values (SameValueZero equality); duplicates are ignored.',
      'WeakMap/WeakSet: weak references — allow GC of keys; not iterable.'
    ],
    codeSnippet: `const map = new Map();
map.set('key', 'value');
map.set({ id: 1 }, 'obj-key'); // object as key — OK in Map

const set = new Set([1, 2, 2, 3]);
console.log([...set]); // [1, 2, 3]

// Dedup array
const unique = [...new Set(arr)];`
  },
  {
    id: 'es6-proxy-reflect',
    title: 'Proxy & Reflect',
    summary: 'Proxy wraps an object to intercept operations; Reflect provides default behaviour for those operations.',
    difficulty: 'advanced',
    category: 'es6',
    keyPoints: [
      'new Proxy(target, handler) — handler traps intercept get, set, has, apply, etc.',
      'Reflect.get/set/has mirror the default behaviour — use inside traps.',
      'Common uses: validation, logging, reactivity (Vue 3 uses Proxy), mocking.',
      'Proxy is transparent — typeof, instanceof, etc. work on the proxy.'
    ],
    codeSnippet: `const validator = new Proxy({}, {
  set(target, key, value) {
    if (key === 'age' && typeof value !== 'number') throw new TypeError('age must be a number');
    return Reflect.set(target, key, value);
  }
});
validator.age = 30; // OK
// validator.age = 'old'; // TypeError`
  },

  // ─── ES7 / ES2016 ────────────────────────────────────────────────────────────
  {
    id: 'es7-array-includes',
    title: 'Array.prototype.includes()',
    summary: 'Returns true if an array contains the given value, handling NaN correctly.',
    difficulty: 'basic',
    category: 'es7',
    keyPoints: [
      'arr.includes(value, fromIndex?) — returns boolean.',
      'Unlike indexOf, correctly detects NaN.',
      'Uses SameValueZero algorithm.',
      'fromIndex can be negative (counts from the end).'
    ],
    codeSnippet: `[1, 2, 3].includes(2);     // true
[1, NaN].includes(NaN);    // true  ← indexOf would return -1
[1, 2, 3].includes(2, 2);  // false — starts search at index 2`
  },
  {
    id: 'es7-exponentiation',
    title: 'Exponentiation Operator (**)',
    summary: 'Shorthand for Math.pow(base, exp) — base ** exponent.',
    difficulty: 'basic',
    category: 'es7',
    keyPoints: [
      '2 ** 10 === 1024 — equivalent to Math.pow(2, 10).',
      'Right-associative: 2 ** 3 ** 2 === 2 ** 9.',
      '**= assignment shorthand: x **= 2 — squares x in place.'
    ],
    codeSnippet: `2 ** 10      // 1024
(-2) ** 2   // 4  — must parenthesise negative base
let x = 3;
x **= 2;    // x = 9`
  },

  // ─── ES8 / ES2017 ────────────────────────────────────────────────────────────
  {
    id: 'es8-async-await',
    title: 'async / await',
    summary: 'Syntactic sugar over Promises — write async code that reads like synchronous code.',
    difficulty: 'basic',
    category: 'es8',
    keyPoints: [
      'async function always returns a Promise.',
      'await pauses execution inside the async function until the Promise settles.',
      'Use try/catch around await for error handling.',
      'Parallel tasks: await Promise.all([fn1(), fn2()]) — never sequential-await independent work.'
    ],
    gotcha: 'Sequential awaits are a perf trap: await a(); await b(); runs b only after a. Use Promise.all for independent tasks.',
    codeSnippet: `async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

// Parallel (correct pattern)
const [user, posts] = await Promise.all([fetchUser(1), fetchPosts(1)]);`
  },
  {
    id: 'es8-object-values-entries',
    title: 'Object.values() & Object.entries()',
    summary: 'Return arrays of own enumerable values or [key, value] pairs from an object.',
    difficulty: 'basic',
    category: 'es8',
    keyPoints: [
      'Object.values(obj) — array of own enumerable property values.',
      'Object.entries(obj) — array of [key, value] pairs.',
      'Both skip inherited and non-enumerable properties.',
      'Complement Object.keys() which returns only keys.',
      'Useful for iterating objects with for...of.'
    ],
    codeSnippet: `const user = { name: 'Alice', age: 30 };
Object.keys(user);    // ['name', 'age']
Object.values(user);  // ['Alice', 30]
Object.entries(user); // [['name', 'Alice'], ['age', 30]]

for (const [key, val] of Object.entries(user)) {
  console.log(\`\${key}: \${val}\`);
}`
  },
  {
    id: 'es8-string-padding',
    title: 'String.padStart() & String.padEnd()',
    summary: 'Pad a string to a target length with a given fill string.',
    difficulty: 'basic',
    category: 'es8',
    keyPoints: [
      'str.padStart(targetLength, fillString?) — pads from the left.',
      'str.padEnd(targetLength, fillString?) — pads from the right.',
      'Default fill is a space character.',
      'If str is already at or longer than targetLength, returns str unchanged.'
    ],
    codeSnippet: `'5'.padStart(3, '0');   // '005'
'hi'.padEnd(5, '-');   // 'hi---'
'42'.padStart(2);      // '42' — already target length`
  },

  // ─── ES9 / ES2018 ────────────────────────────────────────────────────────────
  {
    id: 'es9-object-rest-spread',
    title: 'Object Rest & Spread',
    summary: 'Rest/spread extended to object literals — clone, merge, and extract remaining keys.',
    difficulty: 'basic',
    category: 'es9',
    keyPoints: [
      'Object spread: { ...obj1, ...obj2 } — shallow merge, later keys win.',
      'Object rest in destructuring: const { a, ...rest } = obj.',
      'Spread creates a shallow copy — nested objects are still shared.',
      'Complement to array spread/rest from ES6.'
    ],
    codeSnippet: `const defaults = { color: 'red', size: 'M' };
const custom = { size: 'L', weight: 'light' };
const merged = { ...defaults, ...custom };
// { color: 'red', size: 'L', weight: 'light' }

const { color, ...rest } = merged;`
  },
  {
    id: 'es9-promise-finally',
    title: 'Promise.prototype.finally()',
    summary: 'Run cleanup logic after a Promise settles, regardless of success or failure.',
    difficulty: 'basic',
    category: 'es9',
    keyPoints: [
      '.finally(fn) runs fn whether the promise resolved or rejected.',
      'Does not receive the value/reason — use for side-effects only.',
      'Returns a new Promise that propagates the original settled value/reason.'
    ],
    codeSnippet: `fetch('/api/data')
  .then(res => res.json())
  .catch(err => handleError(err))
  .finally(() => setLoading(false)); // always hides the spinner`
  },
  {
    id: 'es9-async-iteration',
    title: 'Async Iteration (for await...of)',
    summary: 'Iterate over async data sources — each iteration awaits the next value.',
    difficulty: 'advanced',
    category: 'es9',
    keyPoints: [
      'for await...of — works with async iterables (Symbol.asyncIterator).',
      'Each iteration awaits the Promise from the iterator.',
      'Node.js streams, Web Streams, and async generators are async iterables.',
      'async function* creates an async generator that yields Promises.'
    ],
    codeSnippet: `async function* paginate(url) {
  let nextUrl = url;
  while (nextUrl) {
    const res = await fetch(nextUrl);
    const { data, next } = await res.json();
    yield data;
    nextUrl = next;
  }
}

for await (const page of paginate('/api/items')) {
  renderPage(page);
}`
  },

  // ─── ES10 / ES2019 ───────────────────────────────────────────────────────────
  {
    id: 'es10-array-flat',
    title: 'Array.flat() & Array.flatMap()',
    summary: 'flat() flattens nested arrays; flatMap() maps then flattens one level.',
    difficulty: 'basic',
    category: 'es10',
    keyPoints: [
      'arr.flat(depth) — flattens nested arrays up to depth levels (default 1).',
      'arr.flat(Infinity) — fully flattens any nesting.',
      'arr.flatMap(fn) — equivalent to arr.map(fn).flat(1) but more efficient.',
      'flatMap is useful when each item maps to zero, one, or many results.'
    ],
    codeSnippet: `[1, [2, [3]]].flat();          // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity);  // [1, 2, 3]

const sentences = ['Hello World', 'Foo Bar'];
sentences.flatMap(s => s.split(' ')); // ['Hello', 'World', 'Foo', 'Bar']`
  },
  {
    id: 'es10-object-from-entries',
    title: 'Object.fromEntries()',
    summary: 'Transforms [key, value] pairs into an object — inverse of Object.entries().',
    difficulty: 'basic',
    category: 'es10',
    keyPoints: [
      'Object.fromEntries(iterable) — works with Map, array of pairs, etc.',
      'Inverse of Object.entries().',
      'Useful for transforming a Map back to a plain object.',
      'Common: Object.fromEntries(Object.entries(obj).filter(...).map(...))'
    ],
    codeSnippet: `Object.fromEntries([['name', 'Alice'], ['age', 30]]);
// { name: 'Alice', age: 30 }

const prices = { apple: 1.2, banana: 0.5 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);`
  },
  {
    id: 'es10-optional-catch',
    title: 'Optional Catch Binding',
    summary: 'The catch clause can now omit the error parameter when you do not need it.',
    difficulty: 'basic',
    category: 'es10',
    keyPoints: [
      'try { ... } catch { ... } — no (err) binding needed.',
      'Use when you want to catch errors but do not care about the error value.',
      'Reduces boilerplate for "fire and forget" patterns.'
    ],
    codeSnippet: `// Before ES2019
try { JSON.parse(str); } catch (e) { return false; }

// After
try { JSON.parse(str); } catch { return false; }`
  },

  // ─── ES11 / ES2020 ───────────────────────────────────────────────────────────
  {
    id: 'es11-optional-chaining',
    title: 'Optional Chaining (?.)',
    summary: 'Safely access nested properties — returns undefined instead of throwing if a link is null/undefined.',
    difficulty: 'basic',
    category: 'es11',
    keyPoints: [
      'obj?.prop — returns undefined if obj is null/undefined.',
      'arr?.[i] — safe array index access.',
      'fn?.() — calls fn only if it is a function.',
      'Short-circuits: once null/undefined is hit, the rest of the chain is skipped.'
    ],
    codeSnippet: `const city = user?.address?.city;
const len = arr?.[0]?.length;
config?.onLoad?.();`
  },
  {
    id: 'es11-nullish-coalescing',
    title: 'Nullish Coalescing (??)',
    summary: 'Returns the right-hand value only when the left is null or undefined.',
    difficulty: 'basic',
    category: 'es11',
    keyPoints: [
      'a ?? b — returns b only if a is null or undefined.',
      'Unlike ||, does NOT trigger on 0, "", or false.',
      '??= assignment: x ??= defaultVal — assign only if x is null/undefined.'
    ],
    gotcha: '0 ?? "default" → 0. But 0 || "default" → "default". Use ?? when 0 and "" are valid values.',
    codeSnippet: `const port = config.port ?? 3000;
const name = user?.name ?? 'Guest';

let count = null;
count ??= 0;`
  },
  {
    id: 'es11-promise-all-settled',
    title: 'Promise.allSettled()',
    summary: 'Waits for all promises to settle and returns all outcomes — never short-circuits.',
    difficulty: 'intermediate',
    category: 'es11',
    keyPoints: [
      'Always resolves — never rejects.',
      'Returns array of {status: "fulfilled", value} | {status: "rejected", reason}.',
      'Use when you want to attempt all operations and inspect every result.',
      'Contrast: Promise.all short-circuits on first rejection.'
    ],
    codeSnippet: `const results = await Promise.allSettled([fetchUser(), fetchPosts()]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});`
  },
  {
    id: 'es11-dynamic-import',
    title: 'Dynamic import()',
    summary: 'Load a module lazily at runtime as a Promise — enables on-demand code splitting.',
    difficulty: 'intermediate',
    category: 'es11',
    keyPoints: [
      'import("./module") returns a Promise resolving to the module namespace.',
      'Can be used inside conditions, event handlers, or async functions.',
      'Foundation for code splitting in bundlers (Webpack, Vite).',
      'Unlike static import, dynamic import can load modules conditionally.'
    ],
    codeSnippet: `button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');
  new Chart(canvas, options);
});`
  },
  {
    id: 'es11-bigint',
    title: 'BigInt',
    summary: 'Arbitrary-precision integers for numbers larger than Number.MAX_SAFE_INTEGER.',
    difficulty: 'intermediate',
    category: 'es11',
    keyPoints: [
      'Literal: 9007199254740993n — append n suffix.',
      'BigInt() constructor: BigInt("9007199254740993").',
      'Cannot mix BigInt and Number in arithmetic — explicit conversion needed.',
      'typeof 1n === "bigint".',
      'No float BigInt — integers only.'
    ],
    codeSnippet: `const big = 9007199254740991n + 2n; // 9007199254740993n — precise!
console.log(Number.MAX_SAFE_INTEGER + 2 === Number.MAX_SAFE_INTEGER + 1); // true  ← precision lost
console.log(big === 9007199254740993n); // true`
  },

  // ─── ES12 / ES2021 ───────────────────────────────────────────────────────────
  {
    id: 'es12-string-replace-all',
    title: 'String.replaceAll()',
    summary: 'Replace all occurrences of a substring without a global regex flag.',
    difficulty: 'basic',
    category: 'es12',
    keyPoints: [
      'str.replaceAll(searchValue, replacement) — replaces every match.',
      'Unlike replace(), replaces all occurrences with a string pattern.',
      'Returns a new string — original is unchanged.'
    ],
    codeSnippet: `'aabbcc'.replace('b', 'x');    // 'axbcc' — only first
'aabbcc'.replaceAll('b', 'x'); // 'aaxxcc'
'1-2-3'.replaceAll('-', '_');  // '1_2_3'`
  },
  {
    id: 'es12-logical-assignment',
    title: 'Logical Assignment Operators (&&=, ||=, ??=)',
    summary: 'Combine logical operators with assignment — only assign when the condition holds.',
    difficulty: 'basic',
    category: 'es12',
    keyPoints: [
      'x &&= y — assign y only if x is truthy.',
      'x ||= y — assign y only if x is falsy.',
      'x ??= y — assign y only if x is null or undefined.',
      'Short-circuit: RHS is only evaluated when needed.'
    ],
    codeSnippet: `let a = 1, b = 0, c = null;
a &&= 2;  // a = 2  (truthy → assign)
b ||= 5;  // b = 5  (falsy  → assign)
c ??= 3;  // c = 3  (null   → assign)`
  },
  {
    id: 'es12-promise-any',
    title: 'Promise.any()',
    summary: 'Resolves with the first fulfilled promise; rejects only if ALL reject.',
    difficulty: 'intermediate',
    category: 'es12',
    keyPoints: [
      'Opposite of Promise.all — needs only one success.',
      'If all reject, throws AggregateError with all reasons.',
      'Use for "first available" patterns (fallback servers).',
      'Contrast with Promise.race — settles with first settled (win OR loss).'
    ],
    codeSnippet: `const first = await Promise.any([
  fetch('https://mirror1.example.com/data'),
  fetch('https://mirror2.example.com/data'),
]);
// whichever mirror responds successfully first`
  },

  // ─── ES13 / ES2022 ───────────────────────────────────────────────────────────
  {
    id: 'es13-class-fields',
    title: 'Class Fields & Private Members',
    summary: 'Public and private fields/methods declared directly in the class body.',
    difficulty: 'intermediate',
    category: 'es13',
    keyPoints: [
      'Public field: class Foo { count = 0; } — instance property on every new instance.',
      'Private field: #count — accessible only within the class body.',
      'Private method: #validate() — same scope restriction.',
      'Static fields: static #instances = 0 — shared across all instances.',
      'Private fields use hard privacy (not closure-based).'
    ],
    codeSnippet: `class Counter {
  #count = 0;          // private field
  label = 'Counter';   // public field

  increment() { this.#count++; }
  get value() { return this.#count; }
}`
  },
  {
    id: 'es13-array-at',
    title: 'Array / String .at()',
    summary: 'Access elements by index, including negative indices from the end.',
    difficulty: 'basic',
    category: 'es13',
    keyPoints: [
      'arr.at(0) === arr[0] — positive works like bracket notation.',
      'arr.at(-1) — last element; arr.at(-2) — second to last.',
      'Also works on String and TypedArray.',
      'Simpler than arr[arr.length - 1] for end-access.'
    ],
    codeSnippet: `const arr = [1, 2, 3, 4, 5];
arr.at(0);   // 1
arr.at(-1);  // 5
'hello'.at(-1); // 'o'`
  },
  {
    id: 'es13-object-has-own',
    title: 'Object.hasOwn()',
    summary: 'A safer alternative to hasOwnProperty() for checking own properties.',
    difficulty: 'basic',
    category: 'es13',
    keyPoints: [
      'Object.hasOwn(obj, key) — returns true if obj has key as own property.',
      'Works on null-prototype objects where hasOwnProperty is unavailable.',
      'Preferred over obj.hasOwnProperty(key) in all cases.'
    ],
    codeSnippet: `Object.hasOwn({ a: 1 }, 'a'); // true
const bare = Object.create(null);
bare.x = 1;
Object.hasOwn(bare, 'x'); // true — hasOwnProperty would throw`
  },
  {
    id: 'es13-top-level-await',
    title: 'Top-Level await',
    summary: 'Use await directly at the top level of an ES module — no async wrapper needed.',
    difficulty: 'intermediate',
    category: 'es13',
    keyPoints: [
      'Only works in ES modules (not CommonJS).',
      'The module pauses and its importers wait for it to finish.',
      'Useful for one-time async initialisation (DB connections, config loading).',
      'The enclosing module graph is suspended until the await resolves.'
    ],
    codeSnippet: `// config.mjs — top-level await
const config = await fetch('/api/config').then(r => r.json());
export { config };

// main.mjs — waits for config.mjs to fully initialise
import { config } from './config.mjs';
console.log(config.apiUrl); // already resolved`
  },

  // ─── ES14 / ES2023 ───────────────────────────────────────────────────────────
  {
    id: 'es14-array-immutable',
    title: 'Immutable Array Methods',
    summary: 'toSorted, toReversed, toSpliced, and with — return new arrays without mutating the original.',
    difficulty: 'intermediate',
    category: 'es14',
    keyPoints: [
      'arr.toSorted(fn?) — sorted copy.',
      'arr.toReversed() — reversed copy.',
      'arr.toSpliced(start, del, ...items) — spliced copy.',
      'arr.with(index, value) — copy with one element replaced.',
      'arr.findLast(fn) / arr.findLastIndex(fn) — search from the end.'
    ],
    codeSnippet: `const nums = [3, 1, 2];
const sorted = nums.toSorted(); // [1, 2, 3]
console.log(nums);              // [3, 1, 2] — unchanged!

nums.with(0, 99);               // [99, 1, 2]
[1, 2, 3, 4].findLast(n => n % 2 === 0); // 4`
  },

  // ─── ES2024 ──────────────────────────────────────────────────────────────────
  {
    id: 'es2024-object-groupby',
    title: 'Object.groupBy() & Map.groupBy()',
    summary: 'Group an iterable of items by a derived key — no manual reduce needed.',
    difficulty: 'intermediate',
    category: 'es2024',
    keyPoints: [
      'Object.groupBy(iterable, keyFn) — returns a null-prototype object of arrays.',
      'Map.groupBy(iterable, keyFn) — same but returns a Map (keys can be any type).',
      'keyFn receives (item, index).',
      'Use Map.groupBy when you need non-string keys.'
    ],
    codeSnippet: `const people = [
  { name: 'Alice', dept: 'eng' },
  { name: 'Bob',   dept: 'eng' },
  { name: 'Carol', dept: 'design' }
];
const byDept = Object.groupBy(people, p => p.dept);
// { eng: [Alice, Bob], design: [Carol] }`
  },
  {
    id: 'es2024-promise-with-resolvers',
    title: 'Promise.withResolvers()',
    summary: 'Creates a Promise and exposes its resolve/reject as a destructured tuple — no executor boilerplate.',
    difficulty: 'intermediate',
    category: 'es2024',
    keyPoints: [
      'Returns { promise, resolve, reject }.',
      'Useful when resolve/reject need to be called from outside the constructor.',
      'Replaces the manual "deferred" pattern.'
    ],
    codeSnippet: `// Before
let resolve, reject;
const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

// ES2024
const { promise, resolve, reject } = Promise.withResolvers();
eventEmitter.on('done', resolve);
eventEmitter.on('error', reject);`
  },

  // ─── STRING METHODS ──────────────────────────────────────────────────────────

  {
    id: 'string-slice-indexof',
    title: 'slice, substring, indexOf, lastIndexOf',
    summary: 'Extract substrings and locate character positions within a string.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.slice(start, end) — extracts substring; supports negative indices.',
      'str.substring(start, end) — similar but treats negative as 0 and swaps if start > end.',
      'str.indexOf(searchValue, from?) — first index of match; -1 if not found.',
      'str.lastIndexOf(searchValue) — last index of match.',
      'Prefer slice over substring — it handles negatives correctly.'
    ],
    codeSnippet: `const s = 'Hello, World!';
s.slice(7, 12);        // 'World'
s.slice(-6);           // 'orld!'
s.indexOf('o');        // 4
s.lastIndexOf('o');    // 8
s.indexOf('xyz');      // -1`
  },

  {
    id: 'string-split',
    title: 'split & Array.join()',
    summary: 'split breaks a string into an array; join reassembles an array into a string.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.split(separator, limit?) — returns an array of substrings.',
      'split("") splits into individual characters; split(" ") splits on spaces.',
      'split with a regex: "a1b2c".split(/\\d/) → ["a", "b", "c"].',
      'arr.join(separator) — joins array elements into a string (default separator is ",").',
      'split + transform + join is a common string manipulation pattern.'
    ],
    codeSnippet: `'a,b,c'.split(',');          // ['a', 'b', 'c']
'hello'.split('');          // ['h','e','l','l','o']
'a1b2c'.split(/d/);        // ['a', 'b', 'c']

['a', 'b', 'c'].join('-');  // 'a-b-c'
['a', 'b', 'c'].join('');   // 'abc'`
  },

  {
    id: 'string-search',
    title: 'includes, startsWith, endsWith',
    summary: 'Boolean checks for substring presence — cleaner than indexOf !== -1.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.includes(search, from?) — true if search appears anywhere.',
      'str.startsWith(prefix, pos?) — true if string begins with prefix.',
      'str.endsWith(suffix, length?) — true if string ends with suffix.',
      'All are case-sensitive.',
      'All return boolean — use over indexOf for readability.'
    ],
    codeSnippet: `const url = 'https://example.com/api/users';
url.includes('/api');          // true
url.startsWith('https');       // true
url.endsWith('/users');        // true

'hello'.startsWith('ell', 1);  // true`
  },

  {
    id: 'string-case-trim',
    title: 'Case, trim, repeat, padStart, padEnd',
    summary: 'Methods for changing case, removing whitespace, and padding strings.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.toUpperCase() / str.toLowerCase() — returns new uppercase/lowercase string.',
      'str.trim() — removes whitespace from both ends.',
      'str.trimStart() / str.trimEnd() — remove from one side only.',
      'str.repeat(n) — returns string repeated n times.',
      'str.padStart(n, fill?) / str.padEnd(n, fill?) — pad to target length.',
      'None of these mutate the original string.'
    ],
    codeSnippet: `'  Hello  '.trim();        // 'Hello'
'  Hello  '.trimStart();   // 'Hello  '
'hello'.toUpperCase();     // 'HELLO'
'ha'.repeat(3);            // 'hahaha'
'5'.padStart(3, '0');      // '005'
'hi'.padEnd(5, '-');       // 'hi---'`
  },

  {
    id: 'string-replace',
    title: 'replace & replaceAll',
    summary: 'Replace the first or all occurrences of a pattern in a string.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.replace(search, replacement) — replaces only the FIRST match.',
      'str.replaceAll(search, replacement) — replaces ALL matches (ES2021).',
      'Both accept a string or a regex as the first argument.',
      'With a regex, use the /g flag in replace() to replace all matches.',
      'Replacement can be a string or a function(match, ...groups) => string.'
    ],
    codeSnippet: `'aabbcc'.replace('b', 'x');    // 'axbcc' — only first
'aabbcc'.replaceAll('b', 'x'); // 'aaxxcc'
'1-2-3'.replace(/-/g, '_');    // '1_2_3' — regex /g
'foo bar'.replace(/(w+)/g, s => s.toUpperCase()); // 'FOO BAR'`
  },

  {
    id: 'string-at-charat',
    title: 'at(), charAt(), charCodeAt()',
    summary: 'Access individual characters or their Unicode code points by index.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.at(index) — supports negative indices (at(-1) = last char).',
      'str.charAt(index) — returns char at index; returns "" if out of range.',
      'str.charCodeAt(index) — UTF-16 code unit at index.',
      'String.fromCharCode(code) — create a character from a code unit.',
      'str[index] bracket notation — same as charAt but returns undefined if out of range.'
    ],
    codeSnippet: `'hello'.at(-1);          // 'o'
'hello'.charAt(1);      // 'e'
'A'.charCodeAt(0);      // 65
String.fromCharCode(65); // 'A'`
  },

  // ─── ARRAY METHODS ───────────────────────────────────────────────────────────

  {
    id: 'array-map-filter-foreach',
    title: 'map, filter, forEach',
    summary: 'Core iteration methods: map transforms, filter selects, forEach runs a side-effect per element.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.map(fn) — returns a NEW array with fn applied to each element.',
      'arr.filter(fn) — returns a NEW array with only elements where fn returns true.',
      'arr.forEach(fn) — runs fn for each element; returns undefined (no chaining).',
      'map and filter do NOT mutate the original array.',
      "forEach is for side-effects only — don't use it when you need the result."
    ],
    codeSnippet: `const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);          // [2, 4, 6, 8, 10]
nums.filter(n => n % 2 === 0); // [2, 4]
nums.forEach(n => console.log(n)); // undefined

// Chain
nums.filter(n => n > 2).map(n => n * 10); // [30, 40, 50]`
  },

  {
    id: 'array-reduce',
    title: 'reduce & reduceRight',
    summary: 'Fold an array into a single accumulated value by running a reducer function on each element.',
    difficulty: 'intermediate',
    category: 'array-methods',
    keyPoints: [
      'arr.reduce(fn, initialValue) — fn receives (accumulator, current, index, array).',
      'Always provide an initialValue — without it, reduce fails on empty arrays.',
      'Can build any output: numbers, strings, objects, arrays, Maps.',
      'reduceRight processes from right to left.',
      'Common uses: sum, count, group-by, flatten.'
    ],
    codeSnippet: `const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0); // 10

// Group by
const grouped = items.reduce((acc, item) => {
  (acc[item.category] ??= []).push(item);
  return acc;
}, {});`
  },

  {
    id: 'array-find-some-every',
    title: 'find, findIndex, some, every',
    summary: 'Search and test methods: find returns the first match, some/every check conditions across the array.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.find(fn) — returns first element where fn returns true; undefined if none.',
      'arr.findIndex(fn) — returns index of first match; -1 if none.',
      'arr.some(fn) — true if at least one element passes fn.',
      'arr.every(fn) — true if ALL elements pass fn.',
      'All four short-circuit — stop iterating as soon as the result is known.',
      'arr.findLast(fn) / arr.findLastIndex(fn) — search from the end (ES2023).'
    ],
    codeSnippet: `const users = [{ id: 1, active: true }, { id: 2, active: false }];

users.find(u => u.id === 2);       // { id: 2, active: false }
users.findIndex(u => !u.active);   // 1
users.some(u => u.active);         // true
users.every(u => u.active);        // false`
  },

  {
    id: 'array-sort',
    title: 'sort',
    summary: 'Sorts an array in place. Without a comparator it sorts as strings, causing numeric bugs.',
    difficulty: 'intermediate',
    category: 'array-methods',
    keyPoints: [
      'arr.sort() — sorts IN PLACE, mutates the original array.',
      'Default: converts to strings and sorts lexicographically — [10, 2, 1] → [1, 10, 2].',
      'Numeric sort: arr.sort((a, b) => a - b) — ascending; b - a for descending.',
      'Sort stability: guaranteed in all modern engines (ES2019+).',
      'Use arr.toSorted() (ES2023) for an immutable sorted copy.'
    ],
    gotcha: '[10, 9, 2].sort() === [10, 2, 9] — string sort. Always pass a comparator for numbers.',
    codeSnippet: `[10, 9, 2].sort();               // [10, 2, 9] ← wrong!
[10, 9, 2].sort((a, b) => a - b); // [2, 9, 10] ← correct

const people = [{ name: 'Bob' }, { name: 'Alice' }];
people.sort((a, b) => a.name.localeCompare(b.name));

// Immutable copy (ES2023)
const sorted = original.toSorted((a, b) => a - b);`
  },

  {
    id: 'array-splice-slice',
    title: 'splice vs slice',
    summary: 'slice extracts a portion (immutable); splice removes/inserts in place (mutates).',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.slice(start, end) — returns a shallow copy of a portion; does NOT mutate.',
      'arr.splice(start, deleteCount, ...items) — removes/inserts IN PLACE; returns removed elements.',
      'Negative indices in slice count from the end: arr.slice(-2) = last two.',
      'splice(2, 0, "x") inserts "x" at index 2 without removing anything.',
      'Use toSpliced() (ES2023) for an immutable splice.'
    ],
    gotcha: 'splice mutates the original array. slice does not. Easy to mix them up.',
    codeSnippet: `const arr = [1, 2, 3, 4, 5];

arr.slice(1, 3);         // [2, 3]   — original unchanged
arr.slice(-2);           // [4, 5]

arr.splice(1, 2);        // returns [2, 3]; arr is now [1, 4, 5]
arr.splice(1, 0, 99);    // insert 99 at index 1`
  },

  {
    id: 'array-from-of',
    title: 'Array.from() & Array.of()',
    summary: 'Array.from converts array-like or iterable objects to real arrays; Array.of creates arrays from arguments.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'Array.from(iterable, mapFn?) — converts NodeList, Set, Map, string, arguments to array.',
      'Array.from({ length: 5 }, (_, i) => i) — create a filled array.',
      'Array.of(1, 2, 3) — creates [1, 2, 3]; avoids Array(3) single-arg ambiguity.',
      'Array(3) creates [ , , ] (3 empty slots); Array.of(3) creates [3].'
    ],
    codeSnippet: `Array.from('hello');              // ['h','e','l','l','o']
Array.from(new Set([1,1,2]));     // [1, 2]
Array.from({ length: 5 }, (_, i) => i * 2); // [0, 2, 4, 6, 8]

Array.of(3);    // [3]
Array(3);       // [empty × 3]`
  },

  {
    id: 'array-concat-join-reverse',
    title: 'concat, join, reverse, indexOf',
    summary: 'Classic array utility methods for merging, joining to string, reversing, and searching.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.concat(...arrays) — returns a new merged array; does not mutate.',
      'arr.join(separator) — converts array to string; default separator is ",".',
      'arr.reverse() — reverses IN PLACE; use toReversed() for immutable copy.',
      'arr.indexOf(value) — first index of value; -1 if not found.',
      'arr.lastIndexOf(value) — searches from the end.'
    ],
    codeSnippet: `[1, 2].concat([3, 4], [5]); // [1, 2, 3, 4, 5]
['a','b','c'].join('-');    // 'a-b-c'

const arr = [1, 2, 3];
arr.reverse();              // [3, 2, 1] — mutates!
arr.toReversed();           // non-mutating copy (ES2023)

[1, 2, 3, 2].indexOf(2);   // 1
[1, 2, 3, 2].lastIndexOf(2); // 3`
  },

  // ─── ERROR HANDLING ──────────────────────────────────────────────────────────

  {
    id: 'error-try-catch',
    title: 'try / catch / finally / throw',
    summary: 'Structured error handling: try wraps risky code, catch handles errors, finally always runs.',
    difficulty: 'basic',
    category: 'error-handling',
    keyPoints: [
      'try { } catch (err) { } — catch receives the thrown value as err.',
      'throw can throw any value: throw new Error("msg") or throw 42.',
      'finally { } runs whether an error was thrown or not — ideal for cleanup.',
      'Errors propagate up the call stack until caught; uncaught = program crash.',
      'catch without re-throwing silences errors — be intentional.'
    ],
    codeSnippet: `function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error('Invalid JSON:', err.message);
    return null;
  } finally {
    console.log('parse attempted'); // always runs
  }
}

function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}`
  },

  {
    id: 'error-types',
    title: 'Built-in Error Types',
    summary: 'JavaScript has several built-in Error subclasses — each signals a specific kind of failure.',
    difficulty: 'basic',
    category: 'error-handling',
    keyPoints: [
      'Error — base type; use for generic errors.',
      'TypeError — wrong type (calling a non-function, null property access).',
      'ReferenceError — accessing an undeclared variable.',
      'SyntaxError — invalid syntax (usually from eval or JSON.parse).',
      'RangeError — value out of range (invalid array length, recursion overflow).',
      'URIError — malformed URI in encodeURI/decodeURI.',
      'All errors have .name, .message, and .stack properties.'
    ],
    codeSnippet: `null.foo;               // TypeError
undeclaredVar;          // ReferenceError
JSON.parse('{bad}');    // SyntaxError
new Array(-1);          // RangeError

try { riskyOp(); }
catch (err) {
  if (err instanceof TypeError) handleType(err);
  else throw err; // re-throw unknown errors
}`
  },

  {
    id: 'error-custom',
    title: 'Custom Error Classes',
    summary: 'Extend the Error class to create domain-specific error types with structured data.',
    difficulty: 'intermediate',
    category: 'error-handling',
    keyPoints: [
      'class MyError extends Error — sets name automatically via constructor.',
      'Always call super(message) to set the .message property.',
      'Add custom fields to carry structured context (statusCode, code, etc.).',
      'instanceof checks work correctly with extended Error classes.',
      'Set this.name = this.constructor.name for correct .name.'
    ],
    codeSnippet: `class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

throw new ApiError('Not Found', 404);

try { fetchData(); }
catch (err) {
  if (err instanceof ApiError) console.log(err.statusCode); // 404
}`
  },

  {
    id: 'error-async',
    title: 'Error Handling in Async Code',
    summary: 'Async functions and Promise chains require different error-handling strategies.',
    difficulty: 'intermediate',
    category: 'error-handling',
    keyPoints: [
      'async/await: wrap await calls in try/catch to handle rejected Promises.',
      'Promise chains: use .catch(fn) at the end — one handler covers the whole chain.',
      'Unhandled Promise rejections crash Node.js and warn in browsers.',
      'async functions that throw return a rejected Promise — always handle the result.',
      'Promise.allSettled avoids one rejection killing all results.'
    ],
    gotcha:
      "An async function that throws does NOT crash immediately — it returns a rejected Promise. If you don't await it or attach .catch(), the error disappears silently.",
    codeSnippet: `// async/await style
async function load() {
  try {
    return await fetchData();
  } catch (err) {
    console.error('fetch failed:', err);
  }
}

// Danger — error is silently swallowed
async function danger() { throw new Error('oops'); }
danger(); // no await, no .catch() — error is lost!`
  },

  // ─── DOM MANIPULATION ────────────────────────────────────────────────────────

  {
    id: 'dom-selectors',
    title: 'Selecting DOM Elements',
    summary: 'APIs to query one or multiple elements from the DOM.',
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'document.querySelector(selector) — first match; returns null if not found.',
      'document.querySelectorAll(selector) — returns a static NodeList (not live).',
      'document.getElementById(id) — fastest single-element lookup by ID.',
      'document.getElementsByClassName / getElementsByTagName — return live HTMLCollections.',
      'Convert NodeList/HTMLCollection to array: Array.from(list) or [...list].'
    ],
    codeSnippet: `const btn = document.querySelector('#submit-btn');
const items = document.querySelectorAll('.list-item');

// Convert to array to use map/filter
const texts = [...items].map(el => el.textContent);

const header = document.getElementById('header');`
  },

  {
    id: 'dom-manipulation',
    title: 'Creating & Inserting Elements',
    summary: 'Programmatically build and insert DOM nodes.',
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'document.createElement(tag) — creates a new element node.',
      'parent.appendChild(child) — appends child at the end of parent.',
      'parent.insertBefore(newNode, refNode) — inserts before a specific child.',
      'el.insertAdjacentHTML(position, html) — fast insertion (positions: beforebegin, afterbegin, beforeend, afterend).',
      'el.remove() — removes element from the DOM.'
    ],
    codeSnippet: `const li = document.createElement('li');
li.textContent = 'New item';
li.classList.add('item');
document.querySelector('ul').appendChild(li);

// insertAdjacentHTML — no re-parse of the whole parent
container.insertAdjacentHTML('beforeend', '<p>Hello</p>');

document.querySelector('.old').remove();`
  },

  {
    id: 'dom-content',
    title: 'innerHTML vs textContent vs innerText',
    summary: 'Three ways to read or set element content — with important security and performance differences.',
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'innerHTML — reads/sets raw HTML markup; parses HTML on set.',
      'textContent — reads/sets plain text; faster, no HTML parsing, no XSS risk.',
      'innerText — like textContent but respects CSS visibility (hidden elements excluded).',
      'Setting innerHTML with user input is an XSS vulnerability — use textContent for user data.',
      'textContent is faster than innerHTML for plain text.'
    ],
    gotcha: 'Never do el.innerHTML = userInput — this is an XSS attack vector. Always use el.textContent for untrusted strings.',
    codeSnippet: `const el = document.querySelector('p');

// Read
el.innerHTML;    // '<strong>Hello</strong>'
el.textContent;  // 'Hello'

el.textContent = userInput; // ✅ safe
el.innerHTML = userInput;   // ❌ XSS risk`
  },

  {
    id: 'dom-events',
    title: 'addEventListener & the Event Object',
    summary: 'Attach event handlers to DOM elements and inspect the event object they receive.',
    difficulty: 'intermediate',
    category: 'dom',
    keyPoints: [
      'el.addEventListener(type, handler, options?) — attach a handler.',
      'el.removeEventListener(type, handler) — remove; requires the same function reference.',
      'Event object: e.target (element that triggered), e.currentTarget (element handler is on).',
      'e.preventDefault() — blocks default browser action (e.g. form submit, link nav).',
      'e.stopPropagation() — stops event from bubbling up the DOM.',
      'once: true option fires the handler only once then auto-removes it.'
    ],
    codeSnippet: `btn.addEventListener('click', handleClick);

function handleClick(e) {
  e.preventDefault();       // stop default action
  e.stopPropagation();      // stop bubbling
  console.log(e.target);    // the clicked element
}

// Fire once, then auto-remove
btn.addEventListener('click', () => init(), { once: true });

btn.removeEventListener('click', handleClick); // must pass same fn ref`
  },

  {
    id: 'dom-event-delegation',
    title: 'Event Bubbling & Delegation',
    summary: 'Events bubble up the DOM; delegation uses one parent listener to handle events on many children.',
    difficulty: 'intermediate',
    category: 'dom',
    keyPoints: [
      'Bubbling: event fires on target, then propagates up to document.',
      'Capturing: opposite direction (rare); enabled with { capture: true }.',
      'Event delegation: attach ONE listener on a parent, check e.target inside.',
      'Delegation is more efficient than N listeners on N children.',
      'Also handles dynamically added elements automatically.',
      'e.target.closest(selector) — find nearest ancestor matching selector.'
    ],
    codeSnippet: `// Without delegation — bad for 100 items
items.forEach(item => item.addEventListener('click', handleClick));

// With delegation — one listener handles all children
document.querySelector('ul').addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  handleItemClick(li);
});`
  },

  {
    id: 'dom-classlist',
    title: 'classList, style & dataset',
    summary: 'Manipulate element classes, inline styles, and data attributes.',
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'el.classList.add("a", "b") / .remove("a") / .toggle("active") / .contains("x").',
      'el.classList.replace("old", "new") — swap one class for another.',
      'el.style.property = value — sets inline styles (camelCase: backgroundColor).',
      'el.dataset.userId — reads data-user-id attribute (camelCase access).',
      'el.getAttribute / el.setAttribute / el.removeAttribute — for any attribute.'
    ],
    codeSnippet: `const el = document.querySelector('.card');
el.classList.add('active');
el.classList.toggle('hidden');
el.classList.contains('active'); // true

el.style.backgroundColor = 'red';

// <div data-user-id="42" data-role="admin">
el.dataset.userId; // '42'
el.dataset.role;   // 'admin'`
  },

  // ─── WEB APIs ────────────────────────────────────────────────────────────────

  {
    id: 'webapi-fetch',
    title: 'fetch API',
    summary: 'Promise-based browser API for making HTTP requests — replacement for XMLHttpRequest.',
    difficulty: 'intermediate',
    category: 'web-apis',
    keyPoints: [
      'fetch(url, options?) returns a Promise<Response>.',
      'fetch only rejects on network failure — HTTP errors (404, 500) still resolve!',
      'Always check res.ok (true if status 200–299) to detect HTTP errors.',
      'Parse body: res.json(), res.text(), res.blob(), res.formData().',
      'POST/PUT: pass method, headers, and body (JSON.stringify for JSON).',
      'Use AbortController to cancel in-flight requests.'
    ],
    gotcha: 'fetch does NOT reject on 404 or 500. You must check res.ok manually.',
    codeSnippet: `// GET
const res = await fetch('/api/users/1');
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const user = await res.json();

// POST
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' })
});

// Cancel with AbortController
const ac = new AbortController();
fetch('/api/slow', { signal: ac.signal });
ac.abort();`
  },

  {
    id: 'webapi-storage',
    title: 'localStorage & sessionStorage',
    summary: 'Browser key-value storage APIs for persisting data on the client.',
    difficulty: 'basic',
    category: 'web-apis',
    keyPoints: [
      'localStorage — persists across sessions (until explicitly cleared).',
      'sessionStorage — cleared when the tab/window is closed.',
      'Both are synchronous and store only strings.',
      'Use JSON.stringify/parse to store objects.',
      'Methods: setItem, getItem, removeItem, clear, key(index), length.',
      'Storage limit is ~5MB per origin; throws QuotaExceededError when full.'
    ],
    codeSnippet: `localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
const user = JSON.parse(localStorage.getItem('user'));
localStorage.removeItem('user');
localStorage.clear();

// sessionStorage — same API, tab-scoped
sessionStorage.setItem('token', 'abc123');`
  },

  {
    id: 'webapi-url',
    title: 'URL & URLSearchParams',
    summary: 'Parse, construct, and manipulate URLs in a structured way without string manipulation.',
    difficulty: 'intermediate',
    category: 'web-apis',
    keyPoints: [
      'new URL(url, base?) — parses a URL; exposes .pathname, .hostname, .searchParams, etc.',
      'url.searchParams is a URLSearchParams instance: .get, .set, .append, .delete, .has.',
      'url.toString() — serializes back to a full URL string.',
      'new URLSearchParams(string|object) — build/parse query strings standalone.',
      'Relative URLs: new URL("/api/users", window.location.origin).'
    ],
    codeSnippet: `const url = new URL('https://example.com/search?q=js&page=2');
url.pathname;                     // '/search'
url.searchParams.get('q');        // 'js'
url.searchParams.set('page', 3);
url.toString(); // 'https://example.com/search?q=js&page=3'

const params = new URLSearchParams({ q: 'hello', lang: 'en' });
params.toString(); // 'q=hello&lang=en'`
  },

  {
    id: 'webapi-history',
    title: 'History API',
    summary: 'Programmatically navigate browser history and update the URL without a page reload.',
    difficulty: 'intermediate',
    category: 'web-apis',
    keyPoints: [
      'history.pushState(state, title, url) — add a new history entry and change URL.',
      'history.replaceState(state, title, url) — update URL without adding a history entry.',
      'window.onpopstate — fires when the user clicks back/forward.',
      'history.back() / .forward() / .go(n) — navigate programmatically.',
      'Foundation of client-side routing in SPAs (React Router, Vue Router).'
    ],
    codeSnippet: `history.pushState({ page: 'about' }, '', '/about');
history.replaceState({ page: 'home' }, '', '/');

window.addEventListener('popstate', (e) => {
  renderPage(e.state?.page ?? 'home');
});`
  },

  {
    id: 'webapi-intersection-observer',
    title: 'IntersectionObserver',
    summary: 'Asynchronously observe when elements enter or exit the viewport — ideal for lazy loading.',
    difficulty: 'advanced',
    category: 'web-apis',
    keyPoints: [
      'new IntersectionObserver(callback, options) — callback fires when visibility changes.',
      'callback receives IntersectionObserverEntry[] with .isIntersecting, .intersectionRatio.',
      'observer.observe(el) / .unobserve(el) / .disconnect().',
      'options: root (viewport), rootMargin (offset), threshold (0–1 ratio array).',
      'More efficient than scroll event listeners — browser-native, off main thread.'
    ],
    codeSnippet: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.lazy').forEach(el => observer.observe(el));`
  },

  // ─── ECMASCRIPT 2026 ─────────────────────────────────────────────────────────

  {
    id: 'es2026-temporal',
    title: 'Temporal API',
    summary: 'A modern, immutable date/time API replacing the legacy Date object — timezone-aware and precise.',
    difficulty: 'intermediate',
    category: 'es2026',
    keyPoints: [
      'Temporal.Now.plainDateTimeISO() — current date-time in local timezone.',
      'Temporal.PlainDate, PlainTime, PlainDateTime — timezone-naive types.',
      'Temporal.ZonedDateTime — timezone-aware; use for scheduling across timezones.',
      'All Temporal objects are immutable — operations return new objects.',
      'Arithmetic: date.add({ days: 5 }), date.until(otherDate).',
      'Replaces Date which has: mutable state, zero-indexed months, poor timezone support.'
    ],
    codeSnippet: `const today = Temporal.Now.plainDateISO();
console.log(today.toString()); // '2026-05-28'

const next = today.add({ days: 30 });

// Timezone-aware
const meeting = Temporal.ZonedDateTime.from(
  '2026-06-01T10:00[America/New_York]'
);`
  },

  {
    id: 'es2026-using',
    title: 'Resource Management: using & await using',
    summary: 'Automatically dispose resources (files, connections) when they go out of scope.',
    difficulty: 'intermediate',
    category: 'es2026',
    keyPoints: [
      'using x = resource — calls x[Symbol.dispose]() when the block exits (sync).',
      'await using x = resource — calls x[Symbol.asyncDispose]() (async).',
      'Works like try/finally but as a declaration — no extra nesting.',
      'Disposal happens even if an error is thrown.',
      'Objects must implement Symbol.dispose (sync) or Symbol.asyncDispose (async).'
    ],
    codeSnippet: `// Synchronous disposal
function processFile() {
  using file = openFile('data.txt'); // auto-closes when block exits
  file.write('hello');
} // file[Symbol.dispose]() called here

// Async disposal
async function query() {
  await using conn = await openConnection();
  return await conn.query('SELECT * FROM users');
} // conn[Symbol.asyncDispose]() called here`
  },

  {
    id: 'es2026-error-iserror',
    title: 'Error.isError()',
    summary: 'A safe cross-realm check for whether a value is an Error instance.',
    difficulty: 'basic',
    category: 'es2026',
    keyPoints: [
      'Error.isError(value) — returns true if value is an Error object.',
      'Unlike instanceof Error, works correctly across iframes and realms.',
      'instanceof Error fails when the error comes from a different window/realm.',
      'Useful in generic error handlers and serialisation utilities.'
    ],
    codeSnippet: `Error.isError(new Error('oops')); // true
Error.isError(new TypeError());  // true
Error.isError('error string');   // false

// Cross-realm safe (unlike instanceof)
const fromIframe = iframe.contentWindow.Error;
Error.isError(new fromIframe()); // true ✅
new fromIframe() instanceof Error; // false ❌`
  },

  {
    id: 'es2026-array-fromasync',
    title: 'Array.fromAsync()',
    summary: 'Create an array from an async iterable — the async counterpart of Array.from().',
    difficulty: 'intermediate',
    category: 'es2026',
    keyPoints: [
      'await Array.fromAsync(asyncIterable) — resolves to an array.',
      'Also accepts sync iterables and array-likes.',
      'Second argument: optional async mapping function.',
      'Replaces manual for-await-of + push patterns.'
    ],
    codeSnippet: `async function* pages() {
  yield await fetchPage(1);
  yield await fetchPage(2);
}
const allPages = await Array.fromAsync(pages());

// With map function
const doubled = await Array.fromAsync([1, 2, 3], async n => n * 2);
// [2, 4, 6]`
  },

  {
    id: 'es2026-uint8array-base64',
    title: 'Uint8Array Base64 & Hex Methods',
    summary: 'Native methods to encode/decode binary data to/from base64 and hex strings.',
    difficulty: 'basic',
    category: 'es2026',
    keyPoints: [
      'Uint8Array.fromBase64(str) — decode base64 string to bytes.',
      'uint8.toBase64() — encode bytes to base64 string.',
      'Uint8Array.fromHex(hexStr) — decode hex string to bytes.',
      'uint8.toHex() — encode bytes to lowercase hex string.',
      'Replaces manual btoa/atob and custom hex encoders.'
    ],
    codeSnippet: `const bytes = new Uint8Array([72, 101, 108, 108, 111]);

// Base64
const b64 = bytes.toBase64();            // 'SGVsbG8='
Uint8Array.fromBase64('SGVsbG8=');       // Uint8Array [72, 101, ...]

// Hex
bytes.toHex();                           // '48656c6c6f'
Uint8Array.fromHex('48656c6c6f');        // Uint8Array [72, 101, ...]`
  },

  {
    id: 'es2026-regexp-escape',
    title: 'RegExp.escape()',
    summary: 'Escape special regex characters in a string so it can be safely used in a dynamic RegExp.',
    difficulty: 'basic',
    category: 'es2026',
    keyPoints: [
      'RegExp.escape(str) — escapes all special regex metacharacters in str.',
      'Returns a new string safe to embed in new RegExp(escaped).',
      'Eliminates the classic "escape user input before RegExp" bug.',
      'Escapes: . * + ? ^ $ { } [ ] | ( ) \\ / -'
    ],
    codeSnippet: `const userQuery = 'hello.world (test)';

// Before — bug: '.' matches any char
new RegExp(userQuery);

// After — safe
const safe = RegExp.escape(userQuery); // 'hello\\.world \\(test\\)'
new RegExp(safe); // exact literal match`
  },

  // ─── CORE CONCEPTS ───────────────────────────────────────────────────────────

  {
    id: 'core-hoisting',
    title: 'Hoisting',
    summary: 'Declarations are moved to the top of their scope at compile time — but only some are initialized.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      'var: declaration hoisted and initialized to undefined — readable before its line.',
      'let / const / class: hoisted but NOT initialized — accessing before declaration throws ReferenceError (TDZ).',
      'function declarations: fully hoisted — callable before they appear in source.',
      'function expressions follow the hoisting rule of their var/let/const binding.',
      'import declarations are hoisted and their module side-effects run first.'
    ],
    textbookDef: `Hoisting is the JavaScript mechanism whereby variable, function, and class declarations are conceptually moved ("hoisted") to the top of their containing scope during the compilation phase, before any code is executed. Only declarations are hoisted — not initializations — and the binding's accessibility before its lexical position depends on its declaration kind.`,
    eli5: `Imagine the JS engine reads your whole script once before running it, and writes every "name" on a whiteboard at the top of the room.

- var names get written down AND given a placeholder value (undefined).
- let/const/class names get written down but left blank — touch them early and you get yelled at (ReferenceError).
- Whole function declarations get copied to the top, ready to use immediately.`,
    gotcha: 'Accessing a let/const before its declaration is NOT undefined — it throws a ReferenceError because of the Temporal Dead Zone.',
    codeSnippet: `console.log(a); // undefined  (var hoisted + initialized)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;

foo();          // 'works' — function declaration fully hoisted
function foo() { console.log('works'); }

bar();          // TypeError: bar is not a function
var bar = () => {};`
  },
  {
    id: 'core-scope',
    title: 'Scope: Global, Function & Block',
    summary: 'Scope determines where a variable is accessible — global, per-function, or per-block.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      'Global scope: declared outside any function/block — accessible everywhere.',
      'Function scope: var and parameters are scoped to the whole enclosing function.',
      'Block scope: let/const are scoped to the nearest { } block.',
      'Lexical scoping: scope is decided by where code is WRITTEN, not where it is called.',
      'Inner scopes can read outer-scope variables; the reverse is not true.'
    ],
    codeSnippet: `let g = 'global';

function fn() {
  var f = 'function-scoped';
  if (true) {
    let b = 'block-scoped';
    console.log(g, f, b); // all visible
  }
  // console.log(b); // ReferenceError — block-scoped
}`
  },
  {
    id: 'core-closures',
    title: 'Closures',
    summary: 'A function that remembers and accesses its lexical scope even when executed elsewhere.',
    difficulty: 'intermediate',
    category: 'core-concepts',
    keyPoints: [
      'A closure forms when an inner function references variables from an outer scope.',
      'It keeps those variables alive after the outer function has returned.',
      'Used for: private state, factory functions, memoization, event handlers, currying.',
      'Each call to the outer function creates a fresh, independent closure.',
      'Pitfall: capturing a loop variable with var (use let, or an IIFE).'
    ],
    textbookDef: `A closure is the combination of a function and the lexical environment within which that function was declared. It allows the function to retain access to variables from its defining scope even after that outer scope has finished executing.`,
    eli5: `A closure is like a backpack a function carries around. When the function is created, it packs the variables it can see into its backpack. Later, even far away from home, it can still open the backpack and use those variables.`,
    codeSnippet: `function makeCounter() {
  let count = 0;            // private — only the closures can touch it
  return {
    inc: () => ++count,
    get: () => count
  };
}
const c = makeCounter();
c.inc(); c.inc();
c.get(); // 2`
  },
  {
    id: 'core-eq-vs-eqeq',
    title: '== vs === (Equality)',
    summary: '== coerces types before comparing; === compares value and type with no coercion.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      '=== (strict): returns false immediately if the types differ — no coercion.',
      '== (loose): applies the Abstract Equality algorithm, coercing types first.',
      'Prefer === in application code to avoid surprising coercion bugs.',
      'Common exception: x == null checks for both null and undefined at once.',
      'Do not confuse = (assignment) with == / === (comparison).'
    ],
    gotcha: '0 == "" is false, but 0 == "0" is true, and "" == "0" is false — loose equality is not transitive. Use ===.',
    codeSnippet: `1 == '1';     // true  — string coerced to number
1 === '1';    // false — different types
null == undefined;  // true
null === undefined; // false
x == null;    // true when x is null OR undefined`
  },
  {
    id: 'core-data-types',
    title: 'Data Types & typeof',
    summary: 'Seven primitives plus object — and how to inspect a value’s type.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      'Primitives: string, number, boolean, null, undefined, symbol, bigint.',
      'Everything else is an object (arrays, functions, dates, plain objects…).',
      'typeof returns the type name as a string — but typeof null is "object" (a historic bug).',
      'Arrays: use Array.isArray(x), not typeof (which returns "object").',
      'typeof function is "function" — the one object subtype typeof distinguishes.'
    ],
    gotcha: 'typeof null === "object" and typeof NaN === "number". Use value === null and Number.isNaN(value) respectively.',
    codeSnippet: `typeof 'hi';        // 'string'
typeof 42;          // 'number'
typeof 10n;         // 'bigint'
typeof Symbol();    // 'symbol'
typeof undefined;   // 'undefined'
typeof null;        // 'object'  ← bug
typeof [];          // 'object'  → use Array.isArray([])
typeof function(){};// 'function'`
  },
  {
    id: 'core-null-undefined',
    title: 'null vs undefined vs undeclared',
    summary: 'Three "no value" states with different meanings, types, and behaviors.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      'undefined: declared but never assigned — the engine’s default "empty".',
      'null: explicitly assigned by the developer to mean "no value".',
      'undeclared: never declared at all — reading it throws a ReferenceError.',
      'typeof undefined === "undefined"; typeof null === "object".',
      'null == undefined is true; null === undefined is false.'
    ],
    codeSnippet: `let a;             // undefined
let b = null;      // null (intentional)
// c;              // undeclared → ReferenceError on access

typeof a;          // 'undefined'
typeof b;          // 'object'
a == b;            // true
a === b;           // false`
  },
  {
    id: 'core-coercion',
    title: 'Type Coercion',
    summary: 'Automatic conversion between types during operations like +, ==, and template literals.',
    difficulty: 'intermediate',
    category: 'core-concepts',
    keyPoints: [
      '+ with a string converts the other operand to a string (concatenation).',
      'Other arithmetic operators (-, *, /) convert operands to numbers.',
      '== triggers coercion following the Abstract Equality algorithm.',
      'Falsy values: false, 0, -0, 0n, "", null, undefined, NaN. Everything else is truthy.',
      'Convert explicitly to be safe: Number(x), String(x), Boolean(x).'
    ],
    gotcha: '[] + [] is "" (empty string), [] + {} is "[object Object]", and 1 + "2" is "12" but 1 - "2" is -1.',
    codeSnippet: `1 + '2';     // '12'  — string concat
1 - '2';     // -1    — numeric
'5' * 2;     // 10
[] + 1;      // '1'
Boolean(''); // false
Number('');  // 0`
  },
  {
    id: 'core-strict-mode',
    title: "'use strict' (Strict Mode)",
    summary: 'Opts into a restricted, safer variant of JavaScript that turns silent errors into thrown ones.',
    difficulty: 'intermediate',
    category: 'core-concepts',
    keyPoints: [
      "Enable per-script or per-function with the 'use strict'; directive at the top.",
      'Prevents accidental globals — assigning to an undeclared variable throws.',
      'Assignments that would silently fail (to read-only props) now throw.',
      'this is undefined in a plain function call instead of the global object.',
      'Requires unique function parameter names; disables confusing legacy features.',
      'ES modules and class bodies are always in strict mode automatically.'
    ],
    codeSnippet: `'use strict';

function f() {
  // x = 10; // ReferenceError — no accidental globals
  let x = 10;
  return x;
}

function g() {
  return this; // undefined in strict mode (not window)
}`
  },

  // ─── FUNCTIONS & THIS ────────────────────────────────────────────────────────

  {
    id: 'fn-this',
    title: 'How `this` Works',
    summary: 'A dynamic reference to the execution context, decided by HOW a function is called.',
    difficulty: 'intermediate',
    category: 'functions-this',
    keyPoints: [
      'new Foo(): this is the newly created instance.',
      'call / apply / bind: this is the explicitly passed object.',
      'obj.method(): this is obj (the object left of the dot).',
      'Plain fn(): this is the global object (or undefined in strict mode).',
      'Arrow functions ignore all the above — they inherit this lexically.',
      'When multiple rules apply, the higher-precedence one (new > bind > method > free) wins.'
    ],
    textbookDef: `this is a keyword whose value is determined at call time by the function's invocation context. It is not bound lexically for ordinary functions; instead it is resolved according to the binding rules (new, explicit, implicit, default), except for arrow functions which capture this from their surrounding lexical scope.`,
    eli5: `"this" is like the word "here" — its meaning depends on where you're standing when you say it. Call the same function in different ways and "this" points at different things. Arrow functions are stubborn: they always mean the "here" of the place they were written.`,
    gotcha: 'Passing a method as a bare callback (setTimeout(obj.method, 0)) loses its this. Use obj.method.bind(obj) or an arrow wrapper.',
    codeSnippet: `const obj = {
  name: 'A',
  regular() { return this.name; },
  arrow: () => this?.name
};
obj.regular();            // 'A'  (implicit binding)
const f = obj.regular;
f();                      // undefined / global (default binding)
obj.regular.call({name:'B'}); // 'B' (explicit binding)`
  },
  {
    id: 'fn-call-apply-bind',
    title: 'call, apply & bind',
    summary: 'Three ways to control a function’s `this` and arguments explicitly.',
    difficulty: 'intermediate',
    category: 'functions-this',
    keyPoints: [
      'fn.call(thisArg, a, b) — invokes immediately, args passed individually.',
      'fn.apply(thisArg, [a, b]) — invokes immediately, args passed as an array.',
      'fn.bind(thisArg, a) — returns a NEW function with this (and leading args) fixed.',
      'bind enables partial application and method borrowing.',
      'Mnemonic: Array → Apply; Comma → Call.'
    ],
    codeSnippet: `function add(a, b) { return a + b; }

add.call(null, 1, 2);      // 3
add.apply(null, [1, 2]);   // 3

const add5 = add.bind(null, 5);
add5(10);                  // 15  (partial application)

// Method borrowing
Array.prototype.slice.call(arguments);`
  },
  {
    id: 'fn-arrow-in-constructor',
    title: 'Arrow Methods in a Constructor',
    summary: 'An arrow method binds `this` to the instance at creation time and can never be rebound.',
    difficulty: 'intermediate',
    category: 'functions-this',
    keyPoints: [
      'Arrow functions capture this lexically when the instance is created.',
      'Their this cannot be changed by call/apply/bind or by detaching the method.',
      'Great for callbacks/event handlers where you would otherwise lose this.',
      'Trade-off: a new function is created per instance (slightly more memory).',
      'Regular methods live on the prototype and share this via the call-site.'
    ],
    codeSnippet: `function Person(name) {
  this.name = name;
  this.sayRegular = function () { return this.name; };
  this.sayArrow = () => this.name; // bound to the instance forever
}
const john = new Person('John');
const dave = new Person('Dave');

john.sayRegular.call(dave); // 'Dave'  — rebindable
john.sayArrow.call(dave);   // 'John'  — locked to john`
  },
  {
    id: 'fn-higher-order',
    title: 'Higher-Order Functions',
    summary: 'Functions that take functions as arguments and/or return functions.',
    difficulty: 'basic',
    category: 'functions-this',
    keyPoints: [
      'Take a function as an argument (map, filter, reduce, forEach).',
      'Or return a function (bind, debounce, a curried adder).',
      'They abstract repeated operations and enable a declarative style.',
      'Foundational to functional programming in JavaScript.'
    ],
    codeSnippet: `// Takes a function
const names = ['irish', 'daisy'];
names.map((n) => n.toUpperCase()); // ['IRISH', 'DAISY']

// Returns a function
const multiplier = (factor) => (n) => n * factor;
const triple = multiplier(3);
triple(5); // 15`
  },
  {
    id: 'fn-currying',
    title: 'Currying & Partial Application',
    summary: 'Two functional techniques for specializing multi-argument functions.',
    difficulty: 'intermediate',
    category: 'functions-this',
    keyPoints: [
      'Currying: transform f(a, b, c) into f(a)(b)(c) — one argument at a time.',
      'Partial application: fix SOME arguments now, get a function taking the rest.',
      'Partial application is easily done with fn.bind(null, ...presetArgs).',
      'Both improve reuse and readability and rely on closures.',
      'Difference: currying always yields unary functions; partial fixes any subset.'
    ],
    codeSnippet: `// Currying
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3); // 6

// Partial application
const add2 = (a, b) => a + b;
const add5 = add2.bind(null, 5);
add5(10); // 15`
  },
  {
    id: 'fn-decl-vs-expr',
    title: 'Function Declarations vs Expressions',
    summary: 'Declarations are fully hoisted; expressions follow their binding’s hoisting rules.',
    difficulty: 'basic',
    category: 'functions-this',
    keyPoints: [
      'function foo() {} — a declaration; the whole function is hoisted.',
      'const foo = function() {} — an expression; only the binding is hoisted.',
      'Calling a declaration before its line works; calling an expression early throws.',
      'Named function expressions: the name is only visible inside the function.',
      'Anonymous functions are typically used as callbacks or IIFEs.'
    ],
    codeSnippet: `decl();           // 'ok' — hoisted
function decl() { return 'ok'; }

expr();           // TypeError — not yet a function
var expr = function () { return 'ok'; };

const f = function named() { return named; }; // 'named' only inside`
  },

  // ─── OOP & PROTOTYPES ────────────────────────────────────────────────────────

  {
    id: 'oop-prototypal-inheritance',
    title: 'Prototypal Inheritance',
    summary: 'Objects inherit by delegating to other objects through the prototype chain.',
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    keyPoints: [
      'Every object has a hidden [[Prototype]] link (read via Object.getPrototypeOf).',
      'Missing-property lookups walk up the chain until found or null is reached.',
      'It is really delegation, not copying — instances share prototype methods.',
      'Build chains with Object.setPrototypeOf or class extends, not Object.create anymore.',
      'Constructor functions add shared methods on Constructor.prototype.'
    ],
    textbookDef: `Prototypal inheritance is a model in which objects inherit directly from other objects. Each object holds an internal reference ([[Prototype]]) to another object; property access that fails on the object itself is delegated up this prototype chain until the property is found or the chain terminates at null.`,
    eli5: `Looking up a property is like asking your parent a question. If you don't know the answer, you ask your parent (the prototype); if they don't know, they ask their parent — all the way up the family tree until someone answers or you run out of relatives (null).`,
    codeSnippet: `function Animal(name) { this.name = name; }
Animal.prototype.makeSound = function () {
  console.log(this.name + ' makes a sound');
};

function Dog(name) { Animal.call(this, name); }
Object.setPrototypeOf(Dog.prototype, Animal.prototype);

const d = new Dog('Bolt');
d.makeSound(); // found on Animal.prototype via the chain`
  },
  {
    id: 'oop-prototype-chain',
    title: 'The Prototype Chain',
    summary: 'The linked series of objects JS traverses during property lookup.',
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    keyPoints: [
      'obj → obj’s prototype → … → Object.prototype → null.',
      'Object.getPrototypeOf(obj) reads the link; Object.setPrototypeOf sets it.',
      'instanceof checks whether a constructor’s prototype is in the chain.',
      'Own vs inherited: Object.hasOwn(obj, key) checks only the object itself.',
      'Long chains add lookup cost — keep hierarchies shallow.'
    ],
    codeSnippet: `const arr = [1, 2, 3];
Object.getPrototypeOf(arr) === Array.prototype;          // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
arr instanceof Array;  // true (Array.prototype is in the chain)
arr.hasOwnProperty('map'); // false — inherited, not own`
  },
  {
    id: 'oop-new-keyword',
    title: 'The `new` Keyword & Constructors',
    summary: 'What happens, step by step, when you call a function with new.',
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    keyPoints: [
      '1) A fresh empty object is created.',
      '2) Its [[Prototype]] is linked to the constructor’s .prototype.',
      '3) this is bound to the new object inside the constructor.',
      '4) The body runs; the object is returned unless the body returns its own object.',
      'Calling a constructor WITHOUT new makes this the global object (or undefined in strict mode).'
    ],
    gotcha:
      'const p = Person() (no new) does not create an instance — it runs Person as a plain function, often returning undefined and leaking globals.',
    codeSnippet: `function Person(name) { this.name = name; }

const a = new Person('A'); // instance, a.name === 'A'
const b = Person('B');     // no new → b is undefined, leaks global name

// function Person(){}      → a declaration
// const p = Person()       → plain call
// const p = new Person()   → constructor call`
  },
  {
    id: 'oop-class-vs-constructor',
    title: 'ES2015 Classes vs ES5 Constructors',
    summary: 'Classes are cleaner syntactic sugar over the prototype/constructor pattern.',
    difficulty: 'basic',
    category: 'oop-prototypes',
    keyPoints: [
      'class uses constructor + method syntax; ES5 uses a function + .prototype assignments.',
      'Inheritance: extends/super vs manual Object.create + constructor.call.',
      'Class methods are non-enumerable; the class body runs in strict mode.',
      'Classes are not hoisted for use (TDZ); function constructors are hoisted.',
      'Under the hood it is still prototypal inheritance.'
    ],
    codeSnippet: `// ES5
function Person(name) { this.name = name; }
Person.prototype.hi = function () { return 'hi ' + this.name; };

// ES2015
class Person2 {
  constructor(name) { this.name = name; }
  hi() { return 'hi ' + this.name; }
}
class Student extends Person2 {
  constructor(name, id) { super(name); this.id = id; }
}`
  },
  {
    id: 'oop-static-members',
    title: 'Static Class Members',
    summary: 'Members that belong to the class itself rather than to instances.',
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    keyPoints: [
      'Declared with the static keyword; called as ClassName.member.',
      'Not accessible from an instance (instance.member is undefined).',
      'Ideal for utilities, constants, factory methods, and shared counters.',
      'Static fields and even static private (#) members are supported.'
    ],
    codeSnippet: `class MathUtil {
  static PI = 3.14159;
  static square(x) { return x * x; }
  static #count = 0;            // static private
  static create() { MathUtil.#count++; return new MathUtil(); }
}
MathUtil.square(4); // 16
MathUtil.PI;        // 3.14159`
  },
  {
    id: 'oop-object-creation',
    title: 'Ways to Create Objects',
    summary: 'Five common ways to build objects in JavaScript.',
    difficulty: 'basic',
    category: 'oop-prototypes',
    keyPoints: [
      'Object literal {} — simplest and most common.',
      'new Object() — the Object constructor.',
      'Object.create(proto) — create with an explicit prototype.',
      'Constructor function + new — blueprint pattern (ES5).',
      'ES2015 class — structured syntax with constructor and methods.'
    ],
    codeSnippet: `const a = { x: 1 };                    // literal
const b = new Object(); b.x = 1;       // constructor
const c = Object.create({ greet() {} }); // explicit prototype
function P(x){ this.x = x; } const d = new P(1); // constructor fn
class Q { constructor(x){ this.x = x; } } const e = new Q(1); // class`
  },

  // ─── COLLECTIONS ─────────────────────────────────────────────────────────────

  {
    id: 'collections-map-vs-object',
    title: 'Map vs Plain Object',
    summary: 'When to reach for a Map instead of a plain {} object.',
    difficulty: 'intermediate',
    category: 'collections',
    keyPoints: [
      'Map keys can be ANY type; object keys are strings or symbols only.',
      'Map preserves insertion order; object key order is not fully guaranteed.',
      'Map has a .size; objects require Object.keys(obj).length.',
      'Map is directly iterable (for…of, forEach, entries/keys/values).',
      'Objects are JSON-serializable and have a prototype; Maps are not serializable.',
      'Prefer Map for large or frequently-mutated key-value sets.'
    ],
    codeSnippet: `const m = new Map();
m.set('a', 1).set({}, 2).set(42, 3); // any key type
m.size;                              // 3
for (const [k, v] of m) { /* ordered */ }

const o = { a: 1 };
Object.keys(o).length;               // 1`
  },
  {
    id: 'collections-weak',
    title: 'WeakMap & WeakSet',
    summary: 'Collections that hold object keys weakly so they don’t block garbage collection.',
    difficulty: 'advanced',
    category: 'collections',
    keyPoints: [
      'Keys/elements must be objects and are held by WEAK reference.',
      'When an object key has no other references, it can be garbage-collected.',
      'Not iterable and have no .size — you cannot enumerate them.',
      'Use cases: private per-object data, caches keyed by objects, DOM-node metadata.',
      'Map/Set keep their entries alive; WeakMap/WeakSet do not.'
    ],
    gotcha: 'You cannot list or count WeakMap/WeakSet contents — that is the price of allowing keys to be collected.',
    codeSnippet: `const cache = new WeakMap();
function compute(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = /* expensive */ obj.value * 2;
  cache.set(obj, result); // auto-evicted when obj is GC'd
  return result;
}`
  },
  {
    id: 'collections-object-equality',
    title: 'Set/Map Object Equality',
    summary: 'Sets and Maps compare object keys by reference, not by value.',
    difficulty: 'basic',
    category: 'collections',
    keyPoints: [
      'Equality uses SameValueZero — for objects, that means reference identity.',
      'Two different literals with identical contents are distinct entries.',
      'Primitives are compared by value (NaN is treated as equal to NaN).',
      'To dedupe by value you must serialize or use a custom key.'
    ],
    codeSnippet: `const s = new Set();
s.add({ a: 1 });
s.add({ a: 1 }); // different reference
s.size;          // 2

const x = { a: 1 };
const s2 = new Set([x, x]);
s2.size;         // 1 — same reference`
  },

  // ─── ASYNC JS (concepts) ─────────────────────────────────────────────────────

  {
    id: 'async-event-loop',
    title: 'The Event Loop',
    summary: 'How JS runs sync code, then drains microtasks, then takes one macrotask — repeatedly.',
    difficulty: 'intermediate',
    category: 'async-js',
    keyPoints: [
      'Synchronous code runs on the call stack first.',
      'Async work is offloaded to Web/Node APIs; their callbacks are queued.',
      'When the stack empties: drain the ENTIRE microtask queue, then take ONE macrotask.',
      'After each macrotask, microtasks are drained again before the next macrotask.',
      'Microtasks: Promise callbacks, await continuations, queueMicrotask, MutationObserver.',
      'Macrotasks: setTimeout/setInterval, I/O, UI events.'
    ],
    textbookDef: `The event loop is the runtime mechanism that coordinates execution of synchronous code on the call stack with asynchronous callbacks held in the microtask and macrotask queues, processing all available microtasks between each macrotask to provide non-blocking concurrency on a single thread.`,
    eli5: `Think of a chef (the single thread). Orders pile up in two trays: urgent sticky-notes (microtasks) and regular tickets (macrotasks). After finishing the current dish, the chef clears ALL sticky-notes first, then does just ONE regular ticket — then checks the sticky-notes again. That loop never stops.`,
    gotcha:
      'A Promise callback always runs before a setTimeout(…, 0) queued at the same time, because microtasks have priority over macrotasks.',
    codeSnippet: `console.log('1');
setTimeout(() => console.log('4'), 0);   // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('2');
// Order: 1, 2, 3, 4`
  },
  {
    id: 'async-sync-vs-async',
    title: 'Synchronous vs Asynchronous',
    summary: 'Sync code blocks until done; async code continues and runs callbacks later.',
    difficulty: 'basic',
    category: 'async-js',
    keyPoints: [
      'Synchronous statements complete in order, blocking the thread.',
      'Asynchronous operations return control immediately and finish later.',
      'Long synchronous work freezes the UI; offload heavy/I/O work asynchronously.',
      'Async results arrive via callbacks, Promises, or async/await.'
    ],
    codeSnippet: `console.log('Fetching…');
setTimeout(() => console.log('data arrived'), 2000); // async
console.log('Request sent');
// Logs: Fetching… → Request sent → (2s) data arrived`
  },
  {
    id: 'async-promises-vs-callbacks',
    title: 'Promises vs Callbacks',
    summary: 'Promises fix callback hell with chaining, composition, and centralized errors.',
    difficulty: 'intermediate',
    category: 'async-js',
    keyPoints: [
      'Callbacks nest deeply ("callback hell") and have scattered error handling.',
      'Promises chain with .then and centralize errors in one .catch.',
      'Promises compose: all (parallel/fail-fast), allSettled, race, any.',
      'async/await is syntactic sugar over Promises for readable sequential code.',
      'Trade-off: Promises add a few more concepts to learn.'
    ],
    codeSnippet: `// Callback hell
getUser(id, (u) => getPosts(u, (p) => render(p)));

// Promise chain
getUser(id)
  .then(getPosts)
  .then(render)
  .catch(handleError);`
  },
  {
    id: 'async-combinators',
    title: 'Promise Combinators',
    summary: 'all, allSettled, race, and any — choosing the right parallel strategy.',
    difficulty: 'intermediate',
    category: 'async-js',
    keyPoints: [
      'Promise.all — resolves with all results; rejects on the FIRST rejection (fail-fast).',
      'Promise.allSettled — never rejects; returns every {status, value|reason}.',
      'Promise.race — settles with the first promise to SETTLE (win or lose).',
      'Promise.any — resolves with the first to FULFILL; rejects only if all reject (AggregateError).'
    ],
    codeSnippet: `await Promise.all([a(), b()]);        // both, or first error
await Promise.allSettled([a(), b()]); // every outcome, no throw
await Promise.race([a(), timeout()]); // first to settle
await Promise.any([m1(), m2()]);      // first success`
  },

  // ─── MODULES ─────────────────────────────────────────────────────────────────

  {
    id: 'modules-esm-vs-cjs',
    title: 'ES Modules vs CommonJS',
    summary: 'The two JavaScript module systems and why ESM is the modern standard.',
    difficulty: 'intermediate',
    category: 'modules',
    keyPoints: [
      'ESM: import/export, static, asynchronous, the official standard.',
      'CommonJS: require/module.exports, synchronous, Node’s legacy system.',
      'ESM is statically analyzable → enables tree shaking and named-export checking.',
      'ESM imports are live read-only bindings; CommonJS exports are a copied value.',
      'ESM is always strict mode; top-level await works only in ESM.'
    ],
    codeSnippet: `// ESM
export const add = (a, b) => a + b;
import { add } from './math.js';

// CommonJS
module.exports = { add: (a, b) => a + b };
const { add } = require('./math.js');`
  },
  {
    id: 'modules-tree-shaking',
    title: 'Tree Shaking & Bundlers',
    summary: 'Bundlers drop unused ES module exports to shrink the final bundle.',
    difficulty: 'intermediate',
    category: 'modules',
    keyPoints: [
      'Tree shaking = dead-code elimination of unused exports.',
      'Relies on the static structure of ES modules (imports resolved at build time).',
      'Bundlers (Vite, webpack, Rollup, esbuild) combine modules and optimize.',
      'Side-effectful modules can block shaking — mark sideEffects: false in package.json.',
      'Benefits: fewer HTTP requests, smaller payloads, scope hoisting.'
    ],
    codeSnippet: `// utils.js exports add + subtract
import { add } from './utils.js'; // only 'add' ends up in the bundle
add(1, 2);`
  },

  // ─── DESIGN PATTERNS ─────────────────────────────────────────────────────────

  {
    id: 'pattern-singleton',
    title: 'Singleton Pattern',
    summary: 'Guarantees a single shared instance with a global access point.',
    difficulty: 'intermediate',
    category: 'design-patterns',
    keyPoints: [
      'Ensures a class is instantiated only once.',
      'Implement via a cached static instance or a module-level closure.',
      'Use for shared resources: config store, logger, DB connection pool.',
      'Downside: introduces global state — can hinder testing.'
    ],
    codeSnippet: `class Config {
  constructor() {
    if (Config.instance) return Config.instance;
    this.settings = {};
    Config.instance = this;
  }
}
new Config() === new Config(); // true`
  },
  {
    id: 'pattern-factory',
    title: 'Factory Pattern',
    summary: 'Creates objects without exposing the exact class, deciding the type at runtime.',
    difficulty: 'intermediate',
    category: 'design-patterns',
    keyPoints: [
      'Encapsulates instantiation logic behind a single creation function.',
      'Chooses the concrete type based on input/runtime conditions.',
      'Decouples calling code from concrete constructors.',
      'Useful when creation is complex or varies by parameter.'
    ],
    codeSnippet: `function createAnimal(type) {
  switch (type) {
    case 'dog': return { sound: () => 'woof' };
    case 'cat': return { sound: () => 'meow' };
    default: throw new Error('unknown');
  }
}
createAnimal('dog').sound(); // 'woof'`
  },
  {
    id: 'pattern-observer',
    title: 'Observer Pattern',
    summary: 'A subject notifies a list of observers whenever its state changes (pub/sub).',
    difficulty: 'intermediate',
    category: 'design-patterns',
    keyPoints: [
      'A subject keeps a list of subscribers (observers).',
      'On change, it calls each observer’s update/handler.',
      'Basis of event systems, reactive UIs, and EventEmitter.',
      'Decouples the source of events from their consumers.'
    ],
    codeSnippet: `class Subject {
  observers = [];
  subscribe(fn) { this.observers.push(fn); }
  notify(data) { this.observers.forEach((fn) => fn(data)); }
}
const s = new Subject();
s.subscribe((d) => console.log('got', d));
s.notify(42); // 'got 42'`
  },
  {
    id: 'pattern-module',
    title: 'Module Pattern',
    summary: 'An IIFE that exposes only public members, keeping the rest private via closure.',
    difficulty: 'intermediate',
    category: 'design-patterns',
    keyPoints: [
      'An IIFE returns an object of public methods.',
      'Variables inside the IIFE stay private (closure encapsulation).',
      'Avoids polluting the global namespace.',
      'Conceptual ancestor of ES modules.'
    ],
    codeSnippet: `const counter = (function () {
  let count = 0;            // private
  return {
    inc() { return ++count; },
    value() { return count; }
  };
})();
counter.inc();
counter.value(); // 1`
  },
  {
    id: 'pattern-strategy-decorator-command',
    title: 'Strategy, Decorator & Command',
    summary: 'Three more classic patterns: interchangeable algorithms, dynamic wrapping, and request objects.',
    difficulty: 'advanced',
    category: 'design-patterns',
    keyPoints: [
      'Strategy: encapsulate interchangeable algorithms; swap behavior without changing the client.',
      'Decorator: wrap an object to add behavior dynamically without altering its class.',
      'Command: package a request as an object with execute()/undo() — enables queues and undo.',
      'All three favor composition over inheritance.'
    ],
    codeSnippet: `// Strategy
const ctx = { run: (strategy, data) => strategy(data) };
ctx.run((x) => x.toUpperCase(), 'hi'); // 'HI'

// Decorator
class Car { drive() { return 'driving'; } }
class WithGPS { constructor(c){ this.c = c; } drive() { return this.c.drive() + ' + GPS'; } }
new WithGPS(new Car()).drive(); // 'driving + GPS'

// Command
const cmd = { execute: () => light.on(), undo: () => light.off() };`
  },

  // ─── SECURITY ────────────────────────────────────────────────────────────────

  {
    id: 'security-xss',
    title: 'Cross-Site Scripting (XSS)',
    summary: 'Attackers inject malicious scripts into pages other users view.',
    difficulty: 'intermediate',
    category: 'security',
    keyPoints: [
      'Occurs when untrusted input is rendered as executable HTML/JS.',
      'Consequences: cookie/session theft, keylogging, defacement.',
      'Prevent: escape/sanitize output, avoid innerHTML with user data (use textContent).',
      'Use a Content Security Policy as defense in depth.',
      'Frameworks like React auto-escape — but dangerouslySetInnerHTML reopens the hole.'
    ],
    gotcha: 'el.innerHTML = userInput is the classic XSS vector. Use el.textContent for untrusted strings.',
    codeSnippet: `// vulnerable
el.innerHTML = userInput;

// safe
el.textContent = userInput;

// CSP header (defense in depth)
// Content-Security-Policy: script-src 'self'`
  },
  {
    id: 'security-csrf',
    title: 'Cross-Site Request Forgery (CSRF)',
    summary: 'A malicious site tricks a logged-in user’s browser into unwanted authenticated requests.',
    difficulty: 'intermediate',
    category: 'security',
    keyPoints: [
      'Exploits the browser auto-sending cookies on cross-site requests.',
      'Performs actions as the victim without their consent.',
      'Mitigate: anti-CSRF tokens validated server-side.',
      'Set SameSite=Lax/Strict on session cookies.',
      'Verify Origin/Referer and configure CORS correctly.'
    ],
    codeSnippet: `// Mitigations (conceptual)
// 1) Per-form anti-CSRF token checked on the server
// 2) Set-Cookie: session=…; SameSite=Strict; Secure; HttpOnly
// 3) Validate the Origin header for state-changing requests`
  },
  {
    id: 'security-csp-headers',
    title: 'CSP & Security Headers',
    summary: 'HTTP headers that harden a site against XSS, clickjacking, and MIME sniffing.',
    difficulty: 'intermediate',
    category: 'security',
    keyPoints: [
      'Content-Security-Policy: whitelist trusted sources for scripts/styles/images.',
      'X-Frame-Options / frame-ancestors: prevent clickjacking via framing.',
      'Strict-Transport-Security (HSTS): force HTTPS.',
      'X-Content-Type-Options: nosniff — block MIME-type sniffing.',
      'Referrer-Policy: control how much referrer info is sent.'
    ],
    codeSnippet: `// Example response headers
// Content-Security-Policy: script-src 'self'
// X-Frame-Options: DENY
// Strict-Transport-Security: max-age=31536000
// X-Content-Type-Options: nosniff`
  },
  {
    id: 'security-same-origin',
    title: 'Same-Origin Policy & CORS',
    summary: 'Browsers restrict cross-origin access; CORS selectively relaxes it.',
    difficulty: 'intermediate',
    category: 'security',
    keyPoints: [
      'Origin = scheme + host + port. Same origin requires all three to match.',
      'The policy blocks reading cross-origin responses by default.',
      'CORS headers (Access-Control-Allow-Origin…) let a server opt in to sharing.',
      'Preflight OPTIONS requests check non-simple cross-origin calls.',
      'Protects users from one site reading another’s authenticated data.'
    ],
    codeSnippet: `// Same origin?  https://app.com:443/page
// https://app.com/api   → same origin
// http://app.com/api    → different scheme
// https://api.app.com   → different host
// Server opts in:
// Access-Control-Allow-Origin: https://app.com`
  },

  // ─── ADDED: event-handling depth (from adaface JS question set) ──────────────
  {
    id: 'dom-advanced-events',
    title: 'Custom, Passive & Keyboard Events',
    summary: 'Beyond addEventListener: emit your own events, opt into passive listeners for smooth scrolling, and clean up to avoid leaks.',
    difficulty: 'intermediate',
    category: 'dom',
    keyPoints: [
      'Custom events: new CustomEvent("name", { detail }) + el.dispatchEvent(ev) let parts of an app talk through the DOM; detail carries the payload.',
      'Passive listeners: { passive: true } promises you will NOT call preventDefault, so the browser scrolls without waiting on your handler — removes touch/wheel scroll jank.',
      'Keyboard events: listen for keydown / keyup and read e.key ("Enter", "ArrowUp", "a"); use e.ctrlKey / e.shiftKey for modifiers. Prefer e.key over the deprecated e.keyCode.',
      'Cleanup: removeEventListener needs the SAME function reference you added — an inline arrow can never be removed.',
      'A listener pins its handler (and closure) in memory; forgetting to remove it on teardown keeps the element and its data from being garbage-collected.'
    ],
    gotcha:
      'Calling e.preventDefault() inside a listener registered as { passive: true } is ignored and logs a console warning — the passive flag tells the browser you gave up that right.',
    codeSnippet: `// Custom event with a payload
const ev = new CustomEvent('cart:add', { detail: { id: 42 } });
window.addEventListener('cart:add', (e) => console.log(e.detail.id));
window.dispatchEvent(ev);

// Passive listener — smooth scrolling
el.addEventListener('touchstart', onTouch, { passive: true });

// Keyboard
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submit();
});

// Cleanup needs the same reference
const onScroll = () => {};
window.addEventListener('scroll', onScroll);
window.removeEventListener('scroll', onScroll); // ✅ works`
  },
  {
    id: 'async-race-conditions',
    title: 'Race Conditions in Async Code',
    summary: 'When results depend on which async task finishes first, a stale earlier response can clobber a newer one — guard against it.',
    difficulty: 'intermediate',
    category: 'async-js',
    keyPoints: [
      'A race condition: two or more async operations whose final outcome depends on their arrival order rather than the order you started them.',
      'Classic case: type "ab" → request "a" fires, then "ab"; if "a" resolves last it overwrites the correct "ab" results.',
      'Fix 1 — cancel stale work: abort the previous request with AbortController before starting a new one.',
      'Fix 2 — ignore stale results: track the latest request id/value and drop responses that no longer match.',
      'Promise.all does NOT cause races (it waits for all); races come from overlapping, independently-resolving operations.'
    ],
    gotcha:
      'await inside a loop or rapid effect does not serialise independent calls — each await suspends its own function, so several can still be in flight and resolve out of order.',
    codeSnippet: `// Cancel the previous request so only the latest wins
let controller;
async function search(q) {
  controller?.abort();            // kill the in-flight request
  controller = new AbortController();
  try {
    const res = await fetch('/api?q=' + q, { signal: controller.signal });
    setResults(await res.json()); // only the newest reaches here
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }
}`
  },

  // ─── ADDED: web-platform concepts (from adaface front-end question set) ──────
  {
    id: 'web-service-workers',
    title: 'Service Workers',
    summary: 'A background script that sits between the page and the network — the engine behind offline support, caching, and push.',
    difficulty: 'advanced',
    category: 'web-apis',
    keyPoints: [
      'A worker script the browser runs separately from the page — no DOM access, event-driven, and it keeps running after the tab closes.',
      'Acts as a programmable network proxy: it intercepts fetch events and can answer from a cache instead of the network (offline support).',
      'Lifecycle: register → install (pre-cache assets) → activate (clean old caches) → controls pages on the next load.',
      'Powers Progressive Web Apps (PWAs): offline pages, background sync, and push notifications.',
      'HTTPS only (localhost is exempt) because intercepting every request is a powerful capability.'
    ],
    gotcha:
      'A service worker does not control the page that registered it until the next navigation — so your first visit still hits the network; caching kicks in on the reload.',
    codeSnippet: `// page
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// sw.js — serve from cache, fall back to network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});`
  },
  {
    id: 'web-components',
    title: 'Web Components & Shadow DOM',
    summary: 'A browser-native way to build reusable, encapsulated custom elements — framework-agnostic.',
    difficulty: 'advanced',
    category: 'web-apis',
    keyPoints: [
      'Custom Elements: define your own HTML tag with a class extending HTMLElement, e.g. <my-card>.',
      'Shadow DOM: attach a separate, encapsulated DOM subtree whose styles and markup do NOT leak in or out.',
      'HTML <template>: inert markup you clone at runtime — parsed but not rendered until used.',
      'Encapsulation is the headline benefit: a component’s CSS can’t clash with the rest of the page.',
      'Works in any framework (or none) because it’s a platform standard, not a library.'
    ],
    gotcha:
      'Styles inside a shadow root are isolated by design — global stylesheets and most CSS selectors can’t reach in, which surprises people expecting their app CSS to apply.',
    codeSnippet: `class MyCard extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' }); // encapsulated
    root.innerHTML = \`<style>p{color:teal}</style><p><slot></slot></p>\`;
  }
}
customElements.define('my-card', MyCard);

// usage:  <my-card>Hello</my-card>`
  },
  {
    id: 'web-critical-rendering-path',
    title: 'Critical Rendering Path',
    summary: 'The steps the browser takes to turn HTML, CSS, and JS into pixels — optimise it to render faster.',
    difficulty: 'advanced',
    category: 'web-apis',
    keyPoints: [
      'Pipeline: HTML → DOM tree, CSS → CSSOM tree, combine into the render tree → layout (positions/sizes) → paint → composite.',
      'CSS is render-blocking: the browser won’t paint until the CSSOM is ready, so ship critical CSS small and early.',
      'A plain <script> is parser-blocking — it stops HTML parsing; use defer (run after parse, in order) or async (run ASAP).',
      'Minimise the bytes, the number of round-trips, and the critical resources to speed up first paint.',
      'Inlining critical CSS and deferring non-essential JS are the classic wins.'
    ],
    gotcha:
      'A synchronous <script> in <head> blocks DOM construction at that point — move it to the end of <body> or add defer so parsing isn’t stalled.',
    codeSnippet: `<!-- blocks parsing here -->
<script src="app.js"></script>

<!-- runs after HTML is parsed, preserves order -->
<script src="app.js" defer></script>

<!-- runs as soon as it downloads, order not guaranteed -->
<script src="analytics.js" async></script>`
  },
  {
    id: 'web-progressive-enhancement',
    title: 'Progressive Enhancement',
    summary: 'Start with a working baseline that runs everywhere, then layer richer features on top for capable browsers.',
    difficulty: 'intermediate',
    category: 'web-apis',
    keyPoints: [
      'Progressive enhancement: build the core experience with plain HTML first, then add CSS and JS as enhancements.',
      'Graceful degradation is the inverse: build the rich version, then add fallbacks so it still mostly works when features are missing.',
      'Feature detection (not browser sniffing) decides whether to use an enhancement: if ("IntersectionObserver" in window) …',
      'Benefit: the content/form still works if JS fails to load, on old browsers, or on slow connections.',
      'A form that submits normally but gets AJAX + validation when JS is available is the textbook example.'
    ],
    gotcha:
      'Detect the feature, don’t sniff the user-agent string — UA strings lie and break, while a capability check (typeof navigator.share === "function") is reliable.',
    codeSnippet: `// Enhance only when the capability exists
if ('IntersectionObserver' in window) {
  lazyLoadImages();        // enhanced path
} else {
  loadAllImages();         // baseline still works
}`
  }
];
