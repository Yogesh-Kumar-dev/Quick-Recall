import type { Note } from '@/types/content';

// category values:
//   ES versions: 'es6' | 'es7' | 'es8' | 'es9' | 'es10' | 'es11' | 'es12' | 'es13' | 'es14' | 'es2024'
//   Topic-based: 'string-methods' | 'array-methods' | 'dom' | 'error-handling' | 'async-js' | 'web-apis' | 'es2026'

export const jsNotes: Note[] = [
  // ─── ES6 / ES2015 ────────────────────────────────────────────────────────────
  {
    id: 'es6-arrow-functions',
    title: 'Arrow Functions',
    summary:
      'A shorter way to write functions , with one big behavioural difference: an arrow function has no `this` of its own, it borrows it from the surrounding code.',
    difficulty: 'basic',
    category: 'es6',
    prerequisites: ['fn-this'],
    keyPoints: [
      'The short syntax: const add = (a, b) => a + b.',
      'No own `this` , it uses whatever `this` means in the code around it (the "enclosing lexical scope", as interviewers put it). That is why arrows are perfect for callbacks inside methods.',
      'No `arguments` object either , collect extra arguments with rest parameters: (...args).',
      'They cannot be constructors , calling one with `new` throws an error.',
      'When the body is a single expression with no braces, its value is returned automatically (an "implicit return").'
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
    summary:
      'The modern ways to declare variables: both live only inside their { } block, and const additionally stops the variable being reassigned.',
    difficulty: 'basic',
    category: 'es6',
    prerequisites: ['core-scope', 'core-hoisting'],
    keyPoints: [
      'Both are block-scoped , they exist only inside the nearest { }. var ignores blocks and belongs to the whole function, which is a common source of bugs.',
      'Accessing them before the line that declares them throws an error. That gap between the top of the block and the declaration is called the Temporal Dead Zone (TDZ) , a favourite interview term.',
      'const stops you *reassigning* the variable, not changing the value: a const object can still have its properties modified. It freezes the binding, not the contents.',
      'Practical rule: use const by default, switch to let only when you genuinely need to reassign, and avoid var entirely in new code.'
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
    summary:
      'Strings written with backticks instead of quotes , you can drop variables straight into them and write across multiple lines.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Written with backticks (`) instead of single or double quotes.',
      'Insert any expression inline with ${expression} , no more string concatenation with +.',
      'Line breaks inside the string just work , no \\n escape characters needed.',
      'Advanced form , tagged templates: put a function name before the backtick and it receives the string pieces and values separately, letting it process them (used by libraries like styled-components).'
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
    summary:
      'A shortcut for pulling values out of objects and arrays into their own variables, instead of accessing them one property at a time.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'From objects: const { a, b } = obj grabs obj.a and obj.b. Rename while grabbing: { a: alias }.',
      'From arrays: const [first, , third] = arr picks by position , an empty slot between commas skips one.',
      'Fallback values: const { x = 10 } = {} gives x the default 10 when the property is undefined.',
      'Reach into nested data in one line: const { user: { name } } = data.',
      'Collect the leftovers: const { a, ...rest } = obj puts every other property into rest.',
      'Party trick that interviews love: swap two variables without a temp , [a, b] = [b, a].'
    ],
    codeSnippet: `const { name, age = 18, address: { city } } = user;
const [first, ...others] = [1, 2, 3];
function fn({ id, label = 'default' }) { /* ... */ }`
  },
  {
    id: 'es6-spread-rest',
    title: 'Spread & Rest (...)',
    summary:
      'The same three dots doing two opposite jobs: spread unpacks a collection into individual items; rest gathers individual items into a collection.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Spread in arrays: [...arr1, ...arr2] copies or merges arrays in one expression.',
      'Spread in objects: { ...obj1, ...obj2 } merges properties , when both have the same key, the later one wins.',
      'Spread into a function call: Math.max(...nums) passes each array element as a separate argument.',
      'Rest in a parameter list: function fn(a, b, ...rest) collects all remaining arguments into a genuine Array (unlike the old `arguments` object).',
      'Rest in destructuring: const [head, ...tail] = arr splits off the first element from everything after it.'
    ],
    gotcha:
      'Spread makes a SHALLOW copy , one level deep only. Nested objects inside the copy are still the same objects as in the original, so mutating them changes both.',
    codeSnippet: `const merged = { ...defaults, ...overrides };
const copy = [...original];

function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}`
  },
  {
    id: 'es6-default-params',
    title: 'Default Parameters',
    summary: 'Give a function parameter a fallback value that kicks in when the caller leaves that argument out (or passes undefined).',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'The default applies only when the argument is undefined. Passing null, 0, or "" counts as a real value , the default is skipped.',
      'The default expression runs fresh on every call, not once at definition , so b = [] gives each call its own new array.',
      'A default can use parameters declared before it: function f(a, b = a * 2).',
      'Combines with destructuring for option objects: function f({ x = 0, y = 0 } = {}) , the trailing = {} makes calling f() with nothing work too.'
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
    summary:
      'Familiar class syntax for JavaScript , but under the hood it is the same old prototype system, just written more cleanly ("syntactic sugar").',
    difficulty: 'basic',
    category: 'es6',
    prerequisites: ['oop-prototypal-inheritance'],
    keyPoints: [
      'Methods you write in class Foo {} are stored once on Foo.prototype, and every instance shares them , they are not copied per object.',
      'constructor() runs when you create an instance with new Foo() , it is where you set up per-instance properties.',
      "extends wires up inheritance by linking the prototype chain , a Dog instance that lacks a method falls back to Animal's version.",
      'In a subclass constructor, super() (which runs the parent constructor) must be called before you touch `this`.',
      'static methods belong to the class itself (Foo.helper()), not to instances , good for factory and utility functions.',
      'Private fields (ES2022): prefix with # (this.#secret) , genuinely inaccessible from outside, not just a naming convention.'
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
    summary: "JavaScript's built-in way to split code across files: each file exports what it wants to share and imports what it needs.",
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Named exports: export const foo = 1 in one file, import { foo } from "./mod" in another , a file can have many.',
      'Default export: export default fn , one per file, imported without braces: import fn from "./mod".',
      'Re-export: export { foo } from "./other" passes something through , handy for building a single entry-point file.',
      'Dynamic import: const mod = await import("./mod") loads a module on demand at runtime , this is what code splitting is built on.',
      'Module files automatically run in strict mode , no sloppy-mode surprises.',
      'Imports are live connections, not copies , if the exporting module changes the value later, importers see the new value.',
      'Because imports/exports are static (analysable without running the code), bundlers can drop unused exports , that is tree shaking.'
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
    summary:
      'An object that stands in for a result that isn\'t ready yet , you attach "when it\'s done, do this" handlers instead of waiting around.',
    difficulty: 'intermediate',
    category: 'es6',
    prerequisites: ['async-sync-vs-async'],
    keyPoints: [
      'A promise is always in one of three states: pending (still working), fulfilled (succeeded, has a value), or rejected (failed, has a reason). Once it settles, it can never change again.',
      '.then(onFulfilled, onRejected) registers what happens next , and returns a *new* promise, which is what makes chaining .then().then() possible.',
      '.catch(fn) handles failures anywhere earlier in the chain , it is just shorthand for .then(undefined, fn).',
      '.finally(fn) runs either way , the place for cleanup like hiding a spinner.',
      'The combinators run several promises together: Promise.all (all must succeed), .allSettled (wait for all, report each outcome), .race (first to settle wins), .any (first to *succeed* wins).'
    ],
    textbookDef: `A Promise is an object representing the eventual completion or failure of an asynchronous computation and its resulting value. Defined in ECMAScript §27.2, a Promise occupies exactly one of three mutually exclusive states , pending, fulfilled, or rejected , and once it transitions from pending, its state and value are immutable.`,
    eli5: `A Promise is like a restaurant receipt when you order food.

Step 1: You order (kick off the async work). The receipt is "pending", your food hasn't arrived yet.
Step 2: The kitchen finishes, "fulfilled" (food ready) or "rejected" (ran out).
Step 3: .then() is your action when food arrives, "great, I'll eat it."
Step 4: .catch() is your fallback, "no food? I'll order pizza."
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
    summary:
      "A primitive value that is guaranteed unique , used as object property keys that can never accidentally clash with anyone else's.",
    difficulty: 'intermediate',
    category: 'es6',
    keyPoints: [
      'Every Symbol() call creates a brand-new, one-of-a-kind value , even two symbols with the same description are never equal.',
      'The description , Symbol("id") , is purely a label for debugging; it plays no part in identity.',
      'The language defines "well-known symbols" as hooks into its own behaviour: Symbol.iterator (makes something work in for...of), Symbol.toPrimitive (custom conversion), Symbol.hasInstance (custom instanceof).',
      'Symbol-keyed properties are invisible to for...in, Object.keys, and JSON.stringify , to find them you need Object.getOwnPropertySymbols(). This makes them handy for semi-hidden metadata.',
      'Symbol.for("key") is the exception to uniqueness: it looks up (or creates) a symbol in a global registry, so different modules asking for the same key get the same symbol.'
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
    summary:
      'An iterator hands out values one at a time on request; a generator is a special function that builds one for you, pausing at each `yield` until asked for the next value.',
    difficulty: 'advanced',
    category: 'es6',
    prerequisites: ['es6-symbol'],
    keyPoints: [
      'The iterator protocol is just a contract: an object with a next() method that returns { value, done } , done flips to true when the sequence ends.',
      'The iterable protocol is the companion contract: an object with a [Symbol.iterator]() method that hands back an iterator. Anything meeting it works with for...of and spread.',
      'for...of consumes any iterable , arrays, strings, Map, Set, and generator objects alike.',
      'function* declares a generator. Calling it does not run the body , it returns an iterator, and the body executes lazily, freezing at each yield until next() is called again.',
      'When a generator finishes (returns or falls off the end), next() reports { value: undefined, done: true }.',
      'Communication goes both ways: gen.next(x) resumes the generator AND makes x the result of the yield expression it was paused on.'
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
    summary:
      'Two purpose-built collections: Map is a dictionary whose keys can be anything (not just strings), and Set is a list that silently refuses duplicates.',
    difficulty: 'basic',
    category: 'es6',
    keyPoints: [
      'Map remembers insertion order and accepts any key type , objects, functions, primitives , where plain objects force keys into strings.',
      'The Map toolkit: set, get, has, delete, plus a size property and iteration via forEach, keys(), values(), entries().',
      'Set keeps each value at most once , adding a duplicate is simply ignored. Equality uses "SameValueZero": like === but NaN counts as equal to itself.',
      'WeakMap/WeakSet hold their keys weakly , if nothing else references a key object, the garbage collector may reclaim it. The price: they cannot be iterated or sized. Use them to attach data to objects without preventing cleanup.'
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
    summary:
      'A Proxy is an invisible middleman wrapped around an object , every read, write, or call can be intercepted and customised. Reflect provides the matching "just do the normal thing" operations.',
    difficulty: 'advanced',
    category: 'es6',
    keyPoints: [
      'new Proxy(target, handler) wraps target; the handler\'s "traps" (get, set, has, apply, ...) fire instead of the default behaviour whenever someone touches the proxy.',
      'Inside a trap, Reflect.get/set/has performs the original, un-intercepted operation , the standard pattern is: do your custom logic, then delegate to Reflect.',
      'Real-world uses: validating writes, logging property access, mocking in tests , and reactivity systems: Vue 3 tracks state changes entirely through Proxies.',
      'The wrapper is transparent to the outside , typeof, instanceof, and normal property syntax all behave as if you were using the target directly.'
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
    summary: 'The readable way to ask "is this value in the array?" , returns true/false, and unlike indexOf it can even find NaN.',
    difficulty: 'basic',
    category: 'es7',
    keyPoints: [
      'arr.includes(value, fromIndex?) returns a plain boolean , clearer than the old indexOf(value) !== -1 idiom.',
      'It correctly finds NaN, which indexOf never can (because NaN !== NaN under ===).',
      'That works because includes compares with "SameValueZero" , essentially === , except NaN is treated as equal to itself.',
      'The optional fromIndex says where to start looking; a negative number counts back from the end.'
    ],
    codeSnippet: `[1, 2, 3].includes(2);     // true
[1, NaN].includes(NaN);    // true  ← indexOf would return -1
[1, 2, 3].includes(2, 2);  // false — starts search at index 2`
  },
  {
    id: 'es7-exponentiation',
    title: 'Exponentiation Operator (**)',
    summary: 'A built-in power operator: base ** exponent does what Math.pow(base, exponent) does, with nicer syntax.',
    difficulty: 'basic',
    category: 'es7',
    keyPoints: [
      '2 ** 10 === 1024 , identical result to Math.pow(2, 10).',
      'It groups from the right ("right-associative"): 2 ** 3 ** 2 means 2 ** (3 ** 2) = 2 ** 9, not (2 ** 3) ** 2.',
      'There is an assignment form too: x **= 2 squares x in place, like += for powers.'
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
    summary: 'A friendlier way to work with promises: `await` makes async code read top-to-bottom like ordinary synchronous code.',
    difficulty: 'basic',
    category: 'es8',
    prerequisites: ['es6-promises'],
    keyPoints: [
      'Marking a function `async` means it always returns a promise , even if you return a plain value, callers receive it wrapped in one.',
      '`await` pauses that function (and only that function , the rest of the page keeps running) until the promise settles, then hands you its value.',
      'Errors from an awaited promise throw like normal exceptions , so plain try/catch replaces .catch() chains.',
      "When two tasks don't depend on each other, start them together and await both at once: await Promise.all([fn1(), fn2()])."
    ],
    gotcha:
      'The classic performance trap: `await a(); await b();` runs b only after a has completely finished , if they are independent, that doubles your waiting time. Promise.all runs them in parallel.',
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
    summary: 'Turn an object into arrays you can loop over: values() gives you just the values, entries() gives you [key, value] pairs.',
    difficulty: 'basic',
    category: 'es8',
    keyPoints: [
      "Object.values(obj) , an array of the object's own property values.",
      'Object.entries(obj) , an array of [key, value] pairs, one per property.',
      "Both only look at the object's *own*, enumerable properties , anything inherited via the prototype chain is skipped.",
      'They complete the family started by Object.keys(), which returns only the property names.',
      "The main use: objects aren't iterable, but these arrays are , so for...of over Object.entries(obj) is the clean way to loop an object."
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
    summary:
      'Stretch a string to a fixed length by adding filler characters , "5" becomes "005", perfect for clocks, IDs, and aligned output.',
    difficulty: 'basic',
    category: 'es8',
    keyPoints: [
      'str.padStart(targetLength, fillString?) adds the filler on the left , the classic zero-padding tool.',
      'str.padEnd(targetLength, fillString?) adds it on the right , handy for aligning columns of text.',
      'Leave the filler out and you get spaces.',
      'A string already at (or past) the target length comes back untouched , padding never truncates.'
    ],
    codeSnippet: `'5'.padStart(3, '0');   // '005'
'hi'.padEnd(5, '-');   // 'hi---'
'42'.padStart(2);      // '42' — already target length`
  },

  // ─── ES9 / ES2018 ────────────────────────────────────────────────────────────
  {
    id: 'es9-object-rest-spread',
    title: 'Object Rest & Spread',
    summary: 'The three dots come to objects: clone and merge with spread, or destructure a few keys and sweep the rest into a new object.',
    difficulty: 'basic',
    category: 'es9',
    prerequisites: ['es6-spread-rest'],
    keyPoints: [
      'Object spread: { ...obj1, ...obj2 } merges properties into a new object , when keys collide, whichever comes later wins.',
      'Object rest in destructuring: const { a, ...rest } = obj pulls out `a` and collects every other property into `rest`.',
      'Spread copies one level deep only ("shallow") , objects nested inside are still shared with the original.',
      'This is ES2018 extending the array spread/rest from ES6 to plain objects.'
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
    summary: 'The "either way, do this" step of a promise chain , perfect for cleanup like hiding a loading spinner.',
    difficulty: 'basic',
    category: 'es9',
    prerequisites: ['es6-promises'],
    keyPoints: [
      '.finally(fn) runs fn whether the promise succeeded or failed , one place for cleanup instead of duplicating it in .then and .catch.',
      "The callback receives nothing , it can't see the value or the error, so it's for side effects only.",
      'It passes the original outcome straight through: whatever the chain resolved or rejected with continues past the .finally unchanged.'
    ],
    codeSnippet: `fetch('/api/data')
  .then(res => res.json())
  .catch(err => handleError(err))
  .finally(() => setLoading(false)); // always hides the spinner`
  },
  {
    id: 'es9-async-iteration',
    title: 'Async Iteration (for await...of)',
    summary: 'A loop for data that arrives over time: for await...of pauses at each step until the next chunk is ready.',
    difficulty: 'advanced',
    category: 'es9',
    prerequisites: ['es8-async-await', 'es6-iterators-generators'],
    keyPoints: [
      'for await...of consumes "async iterables" , sequences whose next value comes wrapped in a promise (their contract is a [Symbol.asyncIterator]() method).',
      'Each turn of the loop awaits the next promise before running the body , so the loop naturally paces itself to the data source.',
      'You already have async iterables around you: Node.js streams, Web Streams, and paginated APIs wrapped in async generators.',
      'async function* creates an async generator , a generator that can await inside itself and yield values as they become available.'
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
    summary: 'flat() unwraps arrays nested inside arrays; flatMap() runs a map and then unwraps one level in a single pass.',
    difficulty: 'basic',
    category: 'es10',
    keyPoints: [
      'arr.flat(depth) lifts nested arrays up into the parent, `depth` levels deep (default is 1 level).',
      'arr.flat(Infinity) keeps going until nothing is nested at all.',
      'arr.flatMap(fn) does arr.map(fn).flat(1) in one efficient step.',
      'flatMap shines when each input item can produce zero, one, or many output items , return [] to drop an item, [a, b] to emit two.'
    ],
    codeSnippet: `[1, [2, [3]]].flat();          // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity);  // [1, 2, 3]

const sentences = ['Hello World', 'Foo Bar'];
sentences.flatMap(s => s.split(' ')); // ['Hello', 'World', 'Foo', 'Bar']`
  },
  {
    id: 'es10-object-from-entries',
    title: 'Object.fromEntries()',
    summary: 'Builds an object from a list of [key, value] pairs , the exact reverse of Object.entries().',
    difficulty: 'basic',
    category: 'es10',
    keyPoints: [
      'Object.fromEntries(iterable) accepts anything that yields [key, value] pairs , an array of pairs, a Map, a URLSearchParams.',
      'It undoes Object.entries(): entries turns an object into pairs, fromEntries turns pairs back into an object.',
      'Handy for converting a Map into a plain object when an API expects one.',
      'The power pattern: entries → filter/map the pairs with array methods → fromEntries. That\'s how you "map over an object".'
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
    summary: "You can now write catch { } without declaring an (err) parameter when you don't need the error object.",
    difficulty: 'basic',
    category: 'es10',
    keyPoints: [
      'try { ... } catch { ... } , the (err) part is optional since ES2019.',
      'Use it when you only care *that* something failed, not *why* , like probing whether a string is valid JSON.',
      'Small quality-of-life change: no more unused `e` variables tripping up linters.'
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
    summary:
      'Reach into nested data without fear: if any link in the chain is null or undefined, the whole expression quietly returns undefined instead of crashing.',
    difficulty: 'basic',
    category: 'es11',
    keyPoints: [
      'obj?.prop , reads the property, unless obj is null/undefined, in which case you get undefined (no "cannot read property of undefined" crash).',
      'arr?.[i] , the same safety for bracket/index access.',
      'fn?.() , calls the function only if it actually exists; otherwise, undefined.',
      'It short-circuits: the moment a null/undefined link is hit, evaluation stops , nothing after it in the chain runs.'
    ],
    codeSnippet: `const city = user?.address?.city;
const len = arr?.[0]?.length;
config?.onLoad?.();`
  },
  {
    id: 'es11-nullish-coalescing',
    title: 'Nullish Coalescing (??)',
    summary:
      'A stricter fallback operator: a ?? b uses b only when a is truly missing (null or undefined) , not when it is 0, "", or false.',
    difficulty: 'basic',
    category: 'es11',
    keyPoints: [
      'a ?? b , "use a, unless it\'s null or undefined, then use b".',
      'This is the fix for the classic || problem: || treats 0, "", and false as "missing" and replaces them; ?? respects them as real values.',
      "There's an assignment form: x ??= defaultVal fills in x only if it is currently null/undefined."
    ],
    gotcha:
      '0 ?? "default" gives 0, but 0 || "default" gives "default" , with || a legitimate zero (or empty string) silently gets replaced. Reach for ?? whenever 0 and "" are valid values.',
    codeSnippet: `const port = config.port ?? 3000;
const name = user?.name ?? 'Guest';

let count = null;
count ??= 0;`
  },
  {
    id: 'es11-promise-all-settled',
    title: 'Promise.allSettled()',
    summary:
      'Runs several promises and waits for every one to finish , successes and failures alike , then reports each outcome individually.',
    difficulty: 'intermediate',
    category: 'es11',
    prerequisites: ['es6-promises'],
    keyPoints: [
      'It always resolves, never rejects , one failed promise cannot blow up the whole batch.',
      'The result is an array of report cards: { status: "fulfilled", value } for successes, { status: "rejected", reason } for failures, in input order.',
      'Use it when every operation should be attempted regardless of the others , sending a batch of independent requests and showing which ones failed.',
      'Contrast with Promise.all, which bails out and rejects the moment any single promise fails.'
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
    summary:
      'Load a module at the moment you need it, not up front: import("./module") fetches it on demand and hands it back as a promise.',
    difficulty: 'intermediate',
    category: 'es11',
    prerequisites: ['es6-modules', 'es6-promises'],
    keyPoints: [
      'import("./module") returns a promise that resolves to the module\'s exports.',
      'Unlike a static import (which must sit at the top of the file), you can call it anywhere , inside an if, an event handler, an async function.',
      'This is the primitive that code splitting is built on: bundlers (Webpack, Vite) turn each dynamic import into a separate chunk downloaded only when that line runs.',
      'Typical use: heavy features behind a click , load the chart library when the user opens the chart, not on page load.'
    ],
    codeSnippet: `button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');
  new Chart(canvas, options);
});`
  },
  {
    id: 'es11-bigint',
    title: 'BigInt',
    summary:
      'A number type for integers too big for regular numbers , beyond about 9 quadrillion (Number.MAX_SAFE_INTEGER), ordinary numbers silently lose precision; BigInt never does.',
    difficulty: 'intermediate',
    category: 'es11',
    keyPoints: [
      'Write one by adding an n suffix: 9007199254740993n.',
      'Or convert: BigInt("9007199254740993") , useful for big IDs arriving as strings (database IDs, tweet IDs).',
      'You cannot mix BigInt and regular numbers in arithmetic , 1n + 1 throws; convert one side explicitly first.',
      'It is its own primitive type: typeof 1n === "bigint".',
      'Whole numbers only , there is no fractional BigInt.'
    ],
    codeSnippet: `const big = 9007199254740991n + 2n; // 9007199254740993n , precise!
console.log(Number.MAX_SAFE_INTEGER + 2 === Number.MAX_SAFE_INTEGER + 1); // true  ← precision lost
console.log(big === 9007199254740993n); // true`
  },

  // ─── ES12 / ES2021 ───────────────────────────────────────────────────────────
  {
    id: 'es12-string-replace-all',
    title: 'String.replaceAll()',
    summary: 'Replace every occurrence of a substring in one call , what everyone always expected replace() to do.',
    difficulty: 'basic',
    category: 'es12',
    keyPoints: [
      'str.replaceAll(searchValue, replacement) swaps out every match, not just the first.',
      'The old trap: replace() with a plain string only touches the FIRST occurrence , replacing all previously required a regex with the /g flag.',
      'Strings are immutable, so it returns a new string; the original is untouched.'
    ],
    codeSnippet: `'aabbcc'.replace('b', 'x');    // 'axbcc' , only first
'aabbcc'.replaceAll('b', 'x'); // 'aaxxcc'
'1-2-3'.replaceAll('-', '_');  // '1_2_3'`
  },
  {
    id: 'es12-logical-assignment',
    title: 'Logical Assignment Operators (&&=, ||=, ??=)',
    summary: 'Conditional assignment in one operator: only overwrite x when it is truthy (&&=), falsy (||=), or missing entirely (??=).',
    difficulty: 'basic',
    category: 'es12',
    keyPoints: [
      'x &&= y , "if x is truthy, replace it with y".',
      'x ||= y , "if x is falsy (0, "", null...), replace it with y".',
      'x ??= y , "if x is null or undefined specifically, fill it with y" , the safest for defaults.',
      "They short-circuit like their logical cousins: the right-hand side isn't even evaluated unless the assignment is going to happen."
    ],
    codeSnippet: `let a = 1, b = 0, c = null;
a &&= 2;  // a = 2  (truthy → assign)
b ||= 5;  // b = 5  (falsy  → assign)
c ??= 3;  // c = 3  (null   → assign)`
  },
  {
    id: 'es12-promise-any',
    title: 'Promise.any()',
    summary: 'Give it several promises and it resolves with the first SUCCESS , it only fails if every single one fails.',
    difficulty: 'intermediate',
    category: 'es12',
    prerequisites: ['es6-promises'],
    keyPoints: [
      'Think of it as the mirror image of Promise.all: all needs every promise to succeed; any needs just one.',
      'If literally everything rejects, you get an AggregateError bundling all the individual failure reasons.',
      'Perfect for "first one that works" situations , trying several mirror servers and taking whichever answers successfully.',
      "Don't confuse it with Promise.race: race settles with the first promise to finish *either way* , a fast failure wins the race; any ignores failures and waits for a success."
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
    summary: "Declare a class's properties right in its body , and make them genuinely private with a # prefix.",
    difficulty: 'intermediate',
    category: 'es13',
    prerequisites: ['es6-classes'],
    keyPoints: [
      'Public field: class Foo { count = 0; } , every new instance starts with its own count, no constructor boilerplate needed.',
      'Private field: #count can only be touched from inside the class body , outside code (and even subclasses) simply cannot reach it.',
      'Methods can be private too: #validate() follows the same rule.',
      'static fields belong to the class rather than instances , static #instances = 0 is one shared counter for all of them.',
      'This is "hard" privacy enforced by the language itself , unlike the old _underscore convention (a polite request) or closures (a workaround).'
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
    summary: 'Index access that counts from the end too: arr.at(-1) is the last element, no length arithmetic required.',
    difficulty: 'basic',
    category: 'es13',
    keyPoints: [
      'With positive numbers it behaves exactly like brackets: arr.at(0) === arr[0].',
      'Negative numbers count backwards: arr.at(-1) is the last element, arr.at(-2) the one before it.',
      'Works on strings and typed arrays as well as arrays.',
      "It exists to replace the clunky arr[arr.length - 1] idiom (plain arr[-1] doesn't work , brackets treat -1 as a property name, not an index)."
    ],
    codeSnippet: `const arr = [1, 2, 3, 4, 5];
arr.at(0);   // 1
arr.at(-1);  // 5
'hello'.at(-1); // 'o'`
  },
  {
    id: 'es13-object-has-own',
    title: 'Object.hasOwn()',
    summary:
      'The reliable way to ask "does this object itself have this property?" , a drop-in replacement for the fragile hasOwnProperty().',
    difficulty: 'basic',
    category: 'es13',
    keyPoints: [
      "Object.hasOwn(obj, key) returns true when key is the object's *own* property , not something inherited through the prototype chain.",
      'Why not obj.hasOwnProperty(key)? That call lives on the prototype , so it explodes on objects created with Object.create(null), and can be shadowed by a property literally named "hasOwnProperty".',
      'Being a static method, Object.hasOwn sidesteps both problems , use it every time.'
    ],
    codeSnippet: `Object.hasOwn({ a: 1 }, 'a'); // true
const bare = Object.create(null);
bare.x = 1;
Object.hasOwn(bare, 'x'); // true — hasOwnProperty would throw`
  },
  {
    id: 'es13-top-level-await',
    title: 'Top-Level await',
    summary: 'await straight at the top of a module file , no need to wrap one-time setup in an async function.',
    difficulty: 'intermediate',
    category: 'es13',
    prerequisites: ['es8-async-await', 'es6-modules'],
    keyPoints: [
      "Only in ES modules , CommonJS (require) files can't do this.",
      'While the awaited promise is pending, the module isn\'t "finished loading" , any file importing it automatically waits too.',
      'Made for one-time async initialisation: opening a database connection, fetching config, loading a WASM binary.',
      'Use with care: a slow top-level await delays every module downstream of it , the whole import chain sits waiting.'
    ],
    codeSnippet: `// config.mjs , top-level await
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
    summary:
      'Copy-making twins of the old mutating methods: toSorted, toReversed, toSpliced, and with return a changed COPY and leave the original alone.',
    difficulty: 'intermediate',
    category: 'es14',
    keyPoints: [
      'arr.toSorted(fn?) , a sorted copy (sort() sorts in place, which has burned every React developer at least once).',
      'arr.toReversed() , a reversed copy (reverse() flips the original).',
      'arr.toSpliced(start, del, ...items) , a copy with elements removed/inserted (splice() edits the original).',
      'arr.with(index, value) , a copy with just one element swapped out.',
      'Bonus from the same edition: findLast(fn) and findLastIndex(fn) search from the end of the array.'
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
    summary: 'Sort a list into labelled buckets in one call , "group these people by department" without writing the reduce() boilerplate.',
    difficulty: 'intermediate',
    category: 'es2024',
    keyPoints: [
      'Object.groupBy(iterable, keyFn) , your function returns a group name per item, and you get back an object of arrays, one per group.',
      'Map.groupBy(iterable, keyFn) , identical idea, but the result is a Map, so groups can be keyed by anything (objects, numbers), not just strings.',
      'The key function receives each (item, index).',
      'Note: Object.groupBy returns a null-prototype object , great for use as a bag of groups, but it has no inherited methods like hasOwnProperty.'
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
    summary:
      'Get a promise plus its resolve and reject functions as three separate pieces , for when something *outside* the promise decides when it settles.',
    difficulty: 'intermediate',
    category: 'es2024',
    prerequisites: ['es6-promises'],
    keyPoints: [
      'Promise.withResolvers() returns { promise, resolve, reject } ready to destructure.',
      'Normally resolve/reject are trapped inside the new Promise(...) callback , awkward when an event listener or external callback is what should settle the promise.',
      'It standardises the old hand-rolled "deferred" pattern (declaring let resolve outside and capturing it in the executor).'
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
    summary:
      'The bread-and-butter tools for cutting strings apart (slice/substring) and finding where something sits inside them (indexOf).',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.slice(start, end) cuts out the piece from start up to (not including) end , negative numbers count from the end of the string.',
      'str.substring(start, end) looks the same but behaves oddly: negatives become 0, and if start > end it silently swaps them.',
      "str.indexOf(searchValue, from?) tells you where a substring first appears , or -1 if it isn't there.",
      'str.lastIndexOf(searchValue) finds the final occurrence instead.',
      'Day-to-day advice: just use slice , its negative-index behaviour is sane and predictable.'
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
    summary: 'A matched pair: split chops a string into an array wherever the separator appears; join glues an array back into one string.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.split(separator, limit?) returns an array of the pieces between separators.',
      'split("") explodes the string into individual characters; split(" ") breaks it into words on spaces.',
      'The separator can be a regex: "a1b2c".split(/\\d/) splits on any digit → ["a", "b", "c"].',
      'arr.join(separator) is the reverse , beware the default separator is a comma, so pass "" for none.',
      'The workhorse pattern for string problems: split → transform with array methods → join. (Reverse a string: s.split("").reverse().join("")).'
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
    summary: 'Plain-English yes/no questions for strings: does it contain this? start with this? end with this?',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.includes(search, from?) , true if the substring appears anywhere.',
      'str.startsWith(prefix, pos?) , true if the string begins with the prefix.',
      'str.endsWith(suffix, length?) , true if it ends with the suffix.',
      'All three are case-sensitive , "Hello".includes("hello") is false.',
      'They return booleans directly, replacing the old indexOf(x) !== -1 dance , same result, far more readable.'
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
    summary: 'The everyday string clean-up kit: change case, strip stray whitespace, repeat, and pad out to a fixed width.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.toUpperCase() / str.toLowerCase() , a new string in the requested case.',
      'str.trim() , strips whitespace from both ends (great for user input before validating).',
      'str.trimStart() / str.trimEnd() , the same, one side at a time.',
      'str.repeat(n) , the string glued to itself n times.',
      'str.padStart(n, fill?) / str.padEnd(n, fill?) , add characters until the string reaches length n; think "005" from "5".padStart(3, "0").',
      'Strings are immutable in JavaScript, so all of these return new strings , the original is never changed.'
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
    summary: 'Swap text inside a string , just remember that replace() only touches the FIRST match unless you say otherwise.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.replace(search, replacement) with a plain string replaces only the FIRST occurrence , the top string-method gotcha.',
      'str.replaceAll(search, replacement) (ES2021) replaces every occurrence.',
      'Both accept either a string or a regular expression as the thing to find.',
      'The pre-replaceAll way to replace everything: a regex with the global flag , str.replace(/x/g, "y").',
      'The replacement can be a function , it receives each match (and capture groups) and returns what to substitute, enabling smart per-match logic.'
    ],
    codeSnippet: `'aabbcc'.replace('b', 'x');    // 'axbcc' , only first
'aabbcc'.replaceAll('b', 'x'); // 'aaxxcc'
'1-2-3'.replace(/-/g, '_');    // '1_2_3' — regex /g
'foo bar'.replace(/(w+)/g, s => s.toUpperCase()); // 'FOO BAR'`
  },

  {
    id: 'string-at-charat',
    title: 'at(), charAt(), charCodeAt()',
    summary: 'Pick out single characters from a string , or convert between characters and their numeric character codes.',
    difficulty: 'basic',
    category: 'string-methods',
    keyPoints: [
      'str.at(index) , the modern pick; negative indices count from the end (at(-1) is the last character).',
      'str.charAt(index) , the classic version; out-of-range gives an empty string "".',
      'str.charCodeAt(index) , the character\'s numeric code (its UTF-16 code unit) , "A" is 65.',
      'String.fromCharCode(code) , goes the other way, from number back to character.',
      'Bracket notation str[index] also works, but out-of-range gives undefined instead of "". The code-conversion pair is what Caesar-cipher-style interview problems are built on.'
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
    summary:
      'The three loops you use daily: map transforms every element, filter keeps the ones that pass a test, forEach just does something with each.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.map(fn) , a NEW array of the same length, with fn applied to each element ("double every number").',
      'arr.filter(fn) , a NEW array keeping only the elements where fn returned true ("just the even ones").',
      'arr.forEach(fn) , runs fn per element and returns undefined, so nothing can be chained after it.',
      'map and filter never touch the original array , they always build fresh ones.',
      'Pick by intent: need a resulting array? map/filter. Just need a side effect per element (logging, DOM updates)? forEach.'
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
    summary:
      'Boil an array down to a single value , a sum, an object, anything , by carrying a running result ("accumulator") through each element.',
    difficulty: 'intermediate',
    category: 'array-methods',
    keyPoints: [
      'arr.reduce(fn, initialValue) , your function gets (accumulator, current, index, array) and returns the next accumulator; the last one is the result.',
      'Always pass an initialValue , without one, reduce uses the first element as the starting point and THROWS on an empty array.',
      'The output can be any shape: a number (sum), a string, an object (lookup table), an array, a Map.',
      'reduceRight is the same machine running from the last element to the first.',
      'The classics it powers: sum, count-by, group-by, flattening , anything where you fold many values into one.'
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
    summary:
      'Searching and testing with a condition: find gets you the first matching element, some asks "does at least one pass?", every asks "do they all pass?".',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.find(fn) , the first element for which fn returns true, or undefined if none does.',
      'arr.findIndex(fn) , the same search, but you get the position instead (-1 if no match).',
      'arr.some(fn) , true if at least ONE element passes the test.',
      'arr.every(fn) , true only if ALL elements pass.',
      'All four stop early ("short-circuit") the moment the answer is certain , some stops at the first pass, every at the first fail.',
      'ES2023 added the from-the-end versions: findLast(fn) and findLastIndex(fn).'
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
    summary:
      'Sorts an array , but with two traps: it modifies the array in place, and by default it sorts values as TEXT, so 10 comes before 2.',
    difficulty: 'intermediate',
    category: 'array-methods',
    keyPoints: [
      'arr.sort() rearranges the original array itself (mutation) , it does not return a fresh copy.',
      'With no comparator, every element is converted to a string and sorted alphabetically , which is why [10, 2, 1] "sorts" to [1, 10, 2].',
      'For numbers, always pass a comparator: (a, b) => a - b for ascending, b - a for descending. (Negative return = a first, positive = b first.)',
      'Modern engines guarantee a "stable" sort (ES2019+): elements that compare equal keep their original relative order.',
      'Want the original untouched? arr.toSorted(comparator) (ES2023) returns a sorted copy instead.'
    ],
    gotcha:
      '[10, 9, 2].sort() gives [10, 2, 9] , everything was compared as strings, so "10" < "2". Any time you sort numbers, pass the (a, b) => a - b comparator.',
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
    summary:
      'Two nearly identical names, opposite behaviour: slice copies a portion out and leaves the array alone; splice surgically edits the array itself.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.slice(start, end) , hands back a copy of that portion; the original is untouched.',
      'arr.splice(start, deleteCount, ...items) , removes and/or inserts elements IN the original array, returning whatever it removed.',
      'slice understands negative indices: arr.slice(-2) is the last two elements.',
      'A deleteCount of 0 makes splice a pure insert: splice(2, 0, "x") slots "x" in at index 2.',
      'Need splice behaviour without mutation? toSpliced() (ES2023) returns an edited copy.'
    ],
    gotcha: 'One letter apart, easy to mix up: splice mutates the original array, slice never does. Memory hook , sPlice is Permanent.',
    codeSnippet: `const arr = [1, 2, 3, 4, 5];

arr.slice(1, 3);         // [2, 3]   — original unchanged
arr.slice(-2);           // [4, 5]

arr.splice(1, 2);        // returns [2, 3]; arr is now [1, 4, 5]
arr.splice(1, 0, 99);    // insert 99 at index 1`
  },

  {
    id: 'array-from-of',
    title: 'Array.from() & Array.of()',
    summary:
      'Array.from turns "array-ish" things (NodeLists, Sets, strings) into real arrays; Array.of builds an array from exactly the values you give it.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'Array.from(iterable, mapFn?) converts anything iterable or array-like , a NodeList from querySelectorAll, a Set, a Map, a string, the arguments object , into a genuine array with all the array methods.',
      'The generate-a-range trick: Array.from({ length: 5 }, (_, i) => i) → [0, 1, 2, 3, 4].',
      'Array.of(1, 2, 3) creates [1, 2, 3] , its point is fixing the classic Array() confusion.',
      'That confusion: Array(3) does NOT create [3] , it creates an array of 3 empty slots. Array.of(3) actually gives you [3].'
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
    summary: 'The classic utility quartet: merge arrays, turn one into a string, flip its order, and look up where a value lives.',
    difficulty: 'basic',
    category: 'array-methods',
    keyPoints: [
      'arr.concat(...arrays) , a new array with everything merged; the originals stay untouched.',
      'arr.join(separator) , glue elements into one string; the default separator is "," so pass "" or "-" explicitly.',
      'arr.reverse() , careful: it flips the array IN PLACE. toReversed() (ES2023) gives a flipped copy instead.',
      'arr.indexOf(value) , the position of the first exact (===) match, or -1 if absent.',
      'arr.lastIndexOf(value) , the same lookup, starting from the end.'
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
    summary: 'The safety net for risky code: try runs it, catch takes over if it blows up, finally runs no matter what.',
    difficulty: 'basic',
    category: 'error-handling',
    keyPoints: [
      'try { } catch (err) { } , if anything inside try throws, execution jumps straight to catch with the thrown value as err.',
      'throw can hurl any value , but always throw new Error("msg"), because Error objects carry a stack trace and plain values (throw 42) do not.',
      'finally { } runs whether things succeeded or failed , the reliable place for cleanup (closing connections, releasing locks).',
      'An uncaught error climbs up through every calling function ("propagates up the call stack") until something catches it , reach the top uncaught, and the program crashes.',
      'A catch block that neither handles nor re-throws just makes the error vanish , swallowing errors silently is how impossible-to-debug systems are born.'
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
    summary: "JavaScript's built-in error family , recognising which one you're looking at tells you what kind of mistake happened.",
    difficulty: 'basic',
    category: 'error-handling',
    keyPoints: [
      'Error , the generic base type, and the parent all the others extend.',
      "TypeError , a value was the wrong type for the operation: calling something that isn't a function, or reading a property off null/undefined. The one you'll see most.",
      "ReferenceError , you used a variable name that doesn't exist (usually a typo).",
      "SyntaxError , the code itself couldn't be parsed; at runtime you mostly meet it from JSON.parse on malformed JSON.",
      'RangeError , a value outside its allowed range: new Array(-1), or infinite recursion overflowing the call stack.',
      'URIError , a malformed URI passed to encodeURI/decodeURI (rare in practice).',
      'Every error carries .name (the type), .message (what went wrong), and .stack (where it happened) , check with err instanceof TypeError.'
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
    summary:
      'Define your own error types (ApiError, ValidationError) by extending Error , so catch blocks can tell failures apart and read structured details.',
    difficulty: 'intermediate',
    category: 'error-handling',
    prerequisites: ['es6-classes', 'error-types'],
    keyPoints: [
      "class MyError extends Error {} , that's the whole pattern; your class inherits message and stack handling.",
      "In the constructor, call super(message) first , that's what puts the text into .message.",
      'The real payoff: attach extra fields (statusCode, errorCode, field name) so handlers get structured data, not just a message string to parse.',
      'catch blocks can then branch cleanly: if (err instanceof ApiError) , instanceof works properly with extended Error classes.',
      'Set this.name = "MyError" (or this.constructor.name) so logs and stack traces show the real type instead of plain "Error".'
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
    summary:
      "Errors in async code don't travel through normal try/catch unless you await them , unhandled ones can disappear silently or crash the process.",
    difficulty: 'intermediate',
    category: 'error-handling',
    prerequisites: ['es6-promises', 'es8-async-await', 'error-try-catch'],
    keyPoints: [
      'With async/await, a rejected promise throws at the await , so ordinary try/catch around the await handles it.',
      'With .then() chains, put one .catch(fn) at the end , it catches a failure from ANY earlier step in the chain.',
      'A rejection nobody handles is serious: it crashes modern Node.js processes and logs loud warnings in browsers.',
      'When an async function throws, nothing explodes on the spot , the function just returns a rejected promise. Someone must await it or attach .catch(), or the error evaporates.',
      "Running a batch where one failure shouldn't sink the rest? Promise.allSettled reports every outcome instead of rejecting at the first failure."
    ],
    gotcha:
      "An async function that throws does NOT crash immediately , it returns a rejected Promise. If you don't await it or attach .catch(), the error disappears silently.",
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
    summary:
      'How to grab elements from the page: querySelector for anything a CSS selector can describe, getElementById for the fast direct lookup.',
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'document.querySelector(selector) , the first element matching a CSS selector ("#id", ".class", "ul > li"); null when nothing matches.',
      'document.querySelectorAll(selector) , ALL matches, as a static NodeList: a snapshot that does not update if the page changes afterwards.',
      'document.getElementById(id) , the fastest lookup when you have an id (no CSS parsing involved).',
      'getElementsByClassName / getElementsByTagName return LIVE collections , they magically update as matching elements are added or removed, which surprises people mid-loop.',
      'Neither NodeList nor HTMLCollection is a real array , convert with Array.from(list) or [...list] before using map/filter.'
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
    summary: 'Building the page from JavaScript: create an element, fill it in, and attach it where it belongs.',
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'document.createElement(tag) makes a new element , it exists only in memory until you attach it to the page.',
      "parent.appendChild(child) attaches it as the parent's last child.",
      'parent.insertBefore(newNode, refNode) places it ahead of a specific existing child instead.',
      "el.insertAdjacentHTML(position, html) injects an HTML string at one of four spots relative to el , beforebegin, afterbegin, beforeend, afterend , without re-parsing the parent's existing content.",
      'el.remove() takes the element off the page.'
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
    summary: "Three ways to read or set an element's content , the choice matters for both security and speed.",
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'innerHTML , works with raw HTML markup: setting it parses the string and builds real elements, tags and all.',
      'textContent , plain text only: whatever you set is displayed literally, tags included as visible text. No parsing, no risk.',
      'innerText , like textContent, but it respects CSS: text inside hidden elements is skipped when reading (and reading it forces a layout pass, making it slower).',
      'The security line: putting user-provided text into innerHTML lets an attacker inject a live <script>-equivalent , that is XSS (cross-site scripting). User data goes in textContent, always.',
      'For plain text, textContent is also simply faster , no HTML parser involved.'
    ],
    gotcha:
      "Never write el.innerHTML = userInput , a user who types <img src=x onerror=stealCookies()> now runs code in every visitor's browser. Untrusted strings always go through textContent.",
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
    summary:
      'Reacting to clicks, keypresses, and everything else: addEventListener wires up a handler, and the event object tells you what happened.',
    difficulty: 'intermediate',
    category: 'dom',
    keyPoints: [
      'el.addEventListener(type, handler, options?) , run handler whenever that event fires on el.',
      'el.removeEventListener(type, handler) , only works if you pass the SAME function reference you added; an inline arrow function can never be removed.',
      'Inside the handler, know your two elements: e.target is what the user actually interacted with; e.currentTarget is the element this handler is attached to.',
      "e.preventDefault() cancels the browser's built-in reaction , stop a form submitting, a link navigating.",
      'e.stopPropagation() stops the event travelling up ("bubbling") to ancestor elements\' handlers.',
      'The { once: true } option makes a handler self-destruct after its first run , perfect for one-time initialisation.'
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
    summary:
      'A click doesn\'t stop at the element you clicked , it travels up through every ancestor ("bubbling"). Delegation exploits that: one listener on the parent handles clicks for all its children.',
    difficulty: 'intermediate',
    category: 'dom',
    prerequisites: ['dom-events'],
    keyPoints: [
      'Bubbling: the event fires on the clicked element first, then rises parent by parent all the way up to document.',
      'Capturing is the same trip in reverse (document down to the target) , rarely needed, opt in with { capture: true }.',
      'Event delegation: instead of a listener on every list item, put ONE listener on the list and inspect e.target to see which item was actually clicked.',
      'Why bother: one listener instead of hundreds saves memory and setup time.',
      'The killer feature: items added to the list later are handled automatically , no re-wiring, because the parent listener was already in place.',
      'e.target.closest(selector) is the delegation workhorse , it climbs from the clicked element to the nearest ancestor matching the selector (e.g. the row the click landed inside).'
    ],
    codeSnippet: `// Without delegation , bad for 100 items
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
    summary:
      'The everyday styling and metadata APIs: toggle CSS classes with classList, set inline styles with style, and read data-* attributes with dataset.',
    difficulty: 'basic',
    category: 'dom',
    keyPoints: [
      'el.classList is the class toolkit: .add("a", "b"), .remove("a"), .toggle("active") (add if missing, remove if present), .contains("x").',
      'el.classList.replace("old", "new") swaps one class for another in a single call.',
      'el.style.property = value writes inline styles , CSS names become camelCase (background-color → backgroundColor).',
      'data-* attributes surface on el.dataset with camelCase names: data-user-id in HTML reads as el.dataset.userId.',
      'For any other attribute, the generic trio: el.getAttribute, el.setAttribute, el.removeAttribute.'
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
    summary: "The browser's built-in way to make HTTP requests, promise-based , it replaced the old XMLHttpRequest.",
    difficulty: 'intermediate',
    category: 'web-apis',
    prerequisites: ['es6-promises', 'es8-async-await'],
    keyPoints: [
      'fetch(url, options?) returns a promise that resolves to a Response object.',
      'The famous surprise: fetch only rejects when the network itself fails. A 404 or 500 from the server counts as a "successful" request , the promise still resolves!',
      "So always check res.ok yourself (true for status 200–299) and throw if it's false.",
      'The response body needs a second await to read: res.json(), res.text(), res.blob(), or res.formData().',
      'For POST/PUT, pass method, headers, and body in the options , JSON goes through JSON.stringify with a Content-Type: application/json header.',
      "To cancel a request mid-flight (user navigated away, typed a new search), pass an AbortController's signal and call abort()."
    ],
    gotcha:
      'fetch does NOT reject on 404 or 500 , the .catch never fires for HTTP errors. Forgetting the res.ok check means your app happily parses error pages as data.',
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
    summary: 'Simple key-value storage in the browser: localStorage survives restarts, sessionStorage lives only as long as the tab.',
    difficulty: 'basic',
    category: 'web-apis',
    keyPoints: [
      "localStorage keeps data until something explicitly deletes it , close the browser, reboot, it's still there.",
      'sessionStorage is wiped when the tab or window closes , good for per-visit state.',
      'Both store ONLY strings, and both are synchronous (they block the main thread , avoid huge reads/writes in hot paths).',
      'To store objects, serialise them: JSON.stringify on the way in, JSON.parse on the way out.',
      'The API: setItem, getItem, removeItem, clear, plus key(index) and length for iteration.',
      'The budget is roughly 5MB per origin , exceed it and setItem throws a QuotaExceededError.'
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
    summary:
      'Work with URLs as structured objects , read the path, edit the query string, rebuild the URL , instead of error-prone string slicing.',
    difficulty: 'intermediate',
    category: 'web-apis',
    keyPoints: [
      'new URL(url, base?) parses a URL into named parts: .pathname, .hostname, .protocol, .hash, .searchParams and more.',
      'url.searchParams handles the query string properly: .get, .set, .append, .delete, .has , with all the ?&= encoding done for you.',
      'url.toString() reassembles everything into a full URL string.',
      'URLSearchParams also works on its own , new URLSearchParams({ q: "hi" }) builds a query string from an object.',
      'Parsing a relative path needs a base: new URL("/api/users", window.location.origin).'
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
    summary:
      'Change the address bar and move through browser history from JavaScript , without triggering a page reload. This is what single-page-app routing is built on.',
    difficulty: 'intermediate',
    category: 'web-apis',
    keyPoints: [
      'history.pushState(state, title, url) changes the URL AND adds a back-button entry , the page itself does not reload.',
      'history.replaceState(state, title, url) swaps the current URL without adding an entry , use it for corrections, not navigation.',
      'When the user presses back/forward, the popstate event fires , your app listens and re-renders the right view.',
      'history.back() / .forward() / .go(n) drive the same navigation from code.',
      'This trio is exactly how React Router and Vue Router create the illusion of multiple pages inside one page.'
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
    summary:
      'The browser tells you when an element scrolls into or out of view , the efficient way to build lazy loading, infinite scroll, and scroll animations.',
    difficulty: 'advanced',
    category: 'web-apis',
    keyPoints: [
      "new IntersectionObserver(callback, options) , the callback runs whenever a watched element's visibility changes.",
      'The callback receives entries; each has .isIntersecting (is it visible now?) and .intersectionRatio (how much of it, 0–1).',
      'Start and stop watching with observer.observe(el), .unobserve(el), and .disconnect() for everything at once.',
      'Options tune the trigger: root (which scroll container counts as the viewport), rootMargin (fire early/late by an offset), threshold (how much must be visible).',
      'Why it beats a scroll listener: the browser does the visibility maths natively, off the main thread , no layout thrashing from your handler running on every scroll tick.'
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
    summary:
      'The long-awaited replacement for the broken Date object: separate types for dates, times, and timezone-aware moments , all immutable.',
    difficulty: 'intermediate',
    category: 'es2026',
    keyPoints: [
      'Temporal.Now.plainDateTimeISO() gives you the current date-time in the local timezone.',
      'The "Plain" types , PlainDate, PlainTime, PlainDateTime , deliberately know nothing about timezones ("timezone-naive"): perfect for birthdays and opening hours.',
      'Temporal.ZonedDateTime carries a real timezone , the type for scheduling a meeting that people join from New York and Mumbai.',
      'Everything is immutable: adding a day returns a NEW date, so no function can quietly modify a date you passed it.',
      'Arithmetic reads like English: date.add({ days: 5 }), date.until(otherDate) for the difference.',
      'Why replace Date? It was mutable, its months were zero-indexed (January is 0), and its timezone handling was nearly nonexistent.'
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
    summary:
      'Declare a resource with `using` and it cleans itself up when the block ends , files close, connections release, even if an error is thrown.',
    difficulty: 'intermediate',
    category: 'es2026',
    keyPoints: [
      'using x = resource , when the enclosing block exits, JavaScript automatically calls x[Symbol.dispose]() for you.',
      'await using x = resource , the async flavour, calling x[Symbol.asyncDispose]() (for cleanup that itself needs awaiting, like closing a DB connection).',
      'It replaces the try { ... } finally { cleanup() } boilerplate with a single declaration , no extra nesting.',
      'Cleanup is guaranteed on every exit path , normal completion, early return, or thrown error.',
      'The contract: the object must implement Symbol.dispose (sync) or Symbol.asyncDispose (async) , that method IS the cleanup.'
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
    summary:
      'A reliable "is this actually an Error?" check that keeps working even when the error was created in another iframe or worker.',
    difficulty: 'basic',
    category: 'es2026',
    keyPoints: [
      'Error.isError(value) , true if value is a genuine Error object of any kind.',
      'The problem it fixes: each iframe/worker ("realm") has its OWN Error class, so an error thrown in an iframe fails `instanceof Error` in the parent page.',
      "Error.isError checks what the value fundamentally is, not which realm's class built it , like Array.isArray, which exists for the same reason.",
      'Reach for it in generic error handlers, logging, and serialisation code that receives errors from anywhere.'
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
    summary: "Collect an entire async stream into an array with one await , Array.from's async twin.",
    difficulty: 'intermediate',
    category: 'es2026',
    prerequisites: ['es9-async-iteration'],
    keyPoints: [
      'await Array.fromAsync(asyncIterable) waits for every value and resolves to a complete array.',
      'It also happily accepts ordinary sync iterables and array-likes.',
      'An optional second argument maps each item , and that mapper may itself be async.',
      'It replaces the boilerplate loop everyone wrote by hand: for await (const x of src) results.push(x).'
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
    summary: 'Built-in conversion between raw bytes and the two text formats binary data usually travels in: base64 and hex.',
    difficulty: 'basic',
    category: 'es2026',
    keyPoints: [
      'Uint8Array.fromBase64(str) , turn a base64 string back into bytes.',
      'uint8.toBase64() , turn bytes into a base64 string (the format used in data: URLs, JWTs, and APIs that ship binary inside JSON).',
      'Uint8Array.fromHex(hexStr) , hex string to bytes.',
      'uint8.toHex() , bytes to a lowercase hex string (the format you see in hashes and colour codes).',
      'Before this you needed btoa/atob (which choke on non-ASCII) plus hand-rolled hex loops , these are the proper replacements.'
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
    summary: 'Make any string safe to drop into a regular expression , characters like . and ( stop being regex magic and match literally.',
    difficulty: 'basic',
    category: 'es2026',
    keyPoints: [
      'RegExp.escape(str) backslash-escapes every character that has special meaning in a regex.',
      'The result is safe to feed into new RegExp(escaped) as an exact-text pattern.',
      'It fixes an ancient footgun: building a regex from user input, where a search for "3.14" would also match "3514" because . means "any character".',
      'The characters it neutralises: . * + ? ^ $ { } [ ] | ( ) \\ / -'
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
    summary:
      'Before running your code, JavaScript scans it and registers every declaration at the top of its scope ("hoisting") , but what you can do with a name before its line depends on how it was declared.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      'var: the name is registered AND given the placeholder value undefined , so you can read it before its line, and you get undefined rather than an error.',
      'let / const / class: the name is registered but left uninitialised , touching it before its line throws a ReferenceError. That forbidden zone is the Temporal Dead Zone (TDZ).',
      'Function declarations are hoisted whole, body and all , you can call them from lines above where they are written.',
      "A function expression (const fn = () => {}) is just a variable holding a function, so it follows its variable's hoisting rules , not the function-declaration rule.",
      'import declarations hoist too: imported modules load and run their top-level code before anything in your file executes.'
    ],
    textbookDef: `Hoisting is the JavaScript mechanism whereby variable, function, and class declarations are conceptually moved ("hoisted") to the top of their containing scope during the compilation phase, before any code is executed. Only declarations are hoisted , not initializations , and the binding's accessibility before its lexical position depends on its declaration kind.`,
    eli5: `Imagine the JS engine reads your whole script once before running it, and writes every "name" on a whiteboard at the top of the room.

- var names get written down AND given a placeholder value (undefined).
- let/const/class names get written down but left blank, touch them early and you get yelled at (ReferenceError).
- Whole function declarations get copied to the top, ready to use immediately.`,
    gotcha: 'Accessing a let/const before its declaration is NOT undefined , it throws a ReferenceError because of the Temporal Dead Zone.',
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
    summary:
      'Scope is simply "where can this variable be seen from?" , and JavaScript has three sizes: everywhere (global), inside a function, or inside a { } block.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      'Global scope: declared outside everything , visible from anywhere in the program (and easy to pollute, so keep it minimal).',
      'Function scope: var and function parameters belong to the whole enclosing function, ignoring any blocks inside it.',
      'Block scope: let and const live only inside the nearest { } , an if body, a loop body, or a bare block.',
      'JavaScript uses "lexical" scoping: what a function can see is fixed by where it is WRITTEN in the source, not by where it happens to be called from.',
      'Visibility is one-directional: code inside can read variables from outside, but outer code can never see into an inner scope.'
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
    summary:
      'A function that keeps access to the variables from the place it was created , even after that place has finished running. The single most-asked JavaScript interview concept.',
    difficulty: 'intermediate',
    category: 'core-concepts',
    prerequisites: ['core-scope'],
    keyPoints: [
      'A closure forms automatically whenever an inner function uses a variable from an outer function , no keyword, no opt-in.',
      "Normally a function's variables die when it returns. If an inner function still references them, they survive , the closure keeps them alive.",
      'This is how JavaScript does private state: variables inside makeCounter() can only be touched through the functions it returned.',
      'Everyday closures you already write: event handlers remembering surrounding values, factory functions, memoisation caches, currying.',
      'Each call to the outer function creates a completely fresh set of variables , two counters made by makeCounter() never share a count.',
      'The classic pitfall: a var loop variable is ONE shared variable, so every callback created in the loop sees its final value. let creates a fresh one per iteration , problem gone.'
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
    summary:
      'Two equality operators: === compares values as-is and says "different type, not equal"; == first converts the values to a common type, which produces surprises.',
    difficulty: 'basic',
    category: 'core-concepts',
    prerequisites: ['core-coercion'],
    keyPoints: [
      '=== (strict equality): if the types differ, the answer is false, full stop. No conversion happens.',
      '== (loose equality): first coerces the operands toward a common type (usually numbers) using the spec\'s Abstract Equality rules, THEN compares , which is why 1 == "1" is true.',
      'Default to === in application code , the coercion rules of == are genuinely hard to memorise and breed subtle bugs.',
      'The one blessed exception: x == null is a deliberate idiom that is true for both null and undefined , a two-for-one check.',
      'And keep all of these apart from single = , which is assignment, not comparison.'
    ],
    gotcha:
      'Loose equality isn\'t even consistent with itself: 0 == "" is false, 0 == "0" is true, yet "" == "0" is false , it is not transitive. === has no such puzzles.',
    codeSnippet: `1 == '1';     // true  , string coerced to number
1 === '1';    // false — different types
null == undefined;  // true
null === undefined; // false
x == null;    // true when x is null OR undefined`
  },
  {
    id: 'core-data-types',
    title: 'Data Types & typeof',
    summary:
      'JavaScript values come in exactly eight kinds: seven simple "primitive" types plus objects , and typeof is how you ask a value what it is (with two famous lies).',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      'The seven primitives , simple, immutable values: string, number, boolean, null, undefined, symbol, bigint.',
      'Everything else is an object: arrays, functions, dates, regexes, plain {} objects.',
      'typeof value returns the type as a string , with one historic bug carved into the language: typeof null is "object".',
      'typeof can\'t spot arrays (they report "object" like everything else) , ask Array.isArray(x) instead.',
      'Functions are the one object subtype typeof does single out: typeof fn === "function".'
    ],
    gotcha:
      'The two liars: typeof null === "object" (check with value === null instead) and typeof NaN === "number" , NaN, "not a number", is a number (check with Number.isNaN(value)).',
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
    summary:
      'Three flavours of "nothing": undefined means the engine never got a value, null means a developer deliberately said "no value", undeclared means the variable doesn\'t exist at all.',
    difficulty: 'basic',
    category: 'core-concepts',
    keyPoints: [
      "undefined is the automatic default: a declared-but-unassigned variable, a missing function argument, a property that isn't there.",
      'null never happens by accident , it only appears when someone explicitly assigned it to mean "intentionally empty".',
      'undeclared is different in kind: the name was never declared anywhere, and merely reading it throws a ReferenceError.',
      'Their types differ too: typeof undefined is "undefined", but typeof null is "object" (the historic bug).',
      'They are loosely equal but not strictly: null == undefined is true, null === undefined is false , which is exactly why x == null works as a check for both.'
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
    summary:
      'JavaScript silently converts values between types ("coercion") when an operation mixes them , helpful sometimes, the source of its weirdest behaviour always.',
    difficulty: 'intermediate',
    category: 'core-concepts',
    prerequisites: ['core-data-types'],
    keyPoints: [
      'When + sees a string on either side, it converts the other side to a string and concatenates , 1 + "2" is "12".',
      'Every other arithmetic operator (-, *, /) converts both sides to numbers , 1 - "2" is -1. Same values, opposite result.',
      "== is coercion's other home: it converts the operands toward a common type before comparing (the Abstract Equality rules).",
      'Memorise the eight falsy values , false, 0, -0, 0n, "", null, undefined, NaN , everything else, including "0", [], and {}, is truthy.',
      'When in doubt, convert on purpose: Number(x), String(x), Boolean(x) say exactly what you mean.'
    ],
    gotcha:
      'The party tricks all come from these rules: [] + [] is "" (arrays become strings), [] + {} is "[object Object]", 1 + "2" is "12" but 1 - "2" is -1.',
    codeSnippet: `1 + '2';     // '12'  , string concat
1 - '2';     // -1    — numeric
'5' * 2;     // 10
[] + 1;      // '1'
Boolean(''); // false
Number('');  // 0`
  },
  {
    id: 'core-strict-mode',
    title: "'use strict' (Strict Mode)",
    summary: 'A stricter dialect of JavaScript you opt into: mistakes that old JS would silently swallow become loud, catchable errors.',
    difficulty: 'intermediate',
    category: 'core-concepts',
    keyPoints: [
      "Turn it on by putting the string 'use strict'; at the top of a script or an individual function.",
      'Its best catch: typo a variable name in an assignment and instead of silently creating a global, you get a ReferenceError.',
      'Writes that used to fail silently , like assigning to a read-only property , now throw, so bugs surface where they happen.',
      'In a plain function call, `this` is undefined instead of the global object , no more accidentally writing properties onto window.',
      'Various legacy foot-guns are banned outright: duplicate parameter names, the with statement, octal literals.',
      'You may already be in it without asking: ES modules and class bodies are automatically strict.'
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
    summary:
      'The value of `this` is NOT fixed when a function is written , it is decided fresh each time by HOW the function is called. Four rules cover every case.',
    difficulty: 'intermediate',
    category: 'functions-this',
    keyPoints: [
      'Rule 1 , new Foo(): `this` is the brand-new object being constructed.',
      'Rule 2 , explicit binding: fn.call(obj) / fn.apply(obj) / fn.bind(obj) make `this` whatever object you pass.',
      'Rule 3 , method call: in obj.method(), `this` is obj , whatever sits left of the dot at the call site.',
      'Rule 4 , plain call: fn() on its own gets the global object as `this` (or undefined in strict mode).',
      'Arrow functions opt out of all four rules: they have no `this` of their own and simply use the one from the surrounding code.',
      'If several rules could apply, precedence settles it: new beats bind, bind beats method call, method call beats plain call.'
    ],
    textbookDef: `this is a keyword whose value is determined at call time by the function's invocation context. It is not bound lexically for ordinary functions; instead it is resolved according to the binding rules (new, explicit, implicit, default), except for arrow functions which capture this from their surrounding lexical scope.`,
    eli5: `"this" is like the word "here" , its meaning depends on where you're standing when you say it. Call the same function in different ways and "this" points at different things. Arrow functions are stubborn: they always mean the "here" of the place they were written.`,
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
    summary:
      "The three tools for setting a function's `this` yourself: call and apply run it right now, bind hands you a copy with `this` locked in for later.",
    difficulty: 'intermediate',
    category: 'functions-this',
    prerequisites: ['fn-this'],
    keyPoints: [
      'fn.call(thisArg, a, b) , runs the function immediately, arguments listed one by one.',
      'fn.apply(thisArg, [a, b]) , identical, except the arguments arrive as an array.',
      'fn.bind(thisArg, a) , does NOT run anything; it returns a new function with `this` (and any leading arguments) permanently baked in.',
      'bind is how you pre-fill arguments ("partial application") and how you keep a method\'s `this` intact when passing it as a callback.',
      'The mnemonic everyone uses: Apply takes an Array; Call takes Commas.'
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
    summary:
      'Define a method as an arrow function inside the constructor and its `this` is welded to that instance forever , nothing can rebind it.',
    difficulty: 'intermediate',
    category: 'functions-this',
    prerequisites: ['fn-this', 'es6-arrow-functions'],
    keyPoints: [
      'The arrow captures `this` from where it was created , inside the constructor, that means the freshly-made instance.',
      "Once captured, it is unbreakable: call/apply/bind can't change it, and detaching the method into a variable doesn't lose it.",
      'That makes arrow methods perfect for callbacks and event handlers , the places regular methods classically lose their `this`.',
      'The cost: every instance carries its own copy of the function, instead of one shared version , slightly more memory per object.',
      'Regular methods live once on the prototype and get their `this` from the call site , cheaper, but rebindable and losable.'
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
    summary:
      'A "higher-order function" is just a function that works with other functions , taking them as arguments, returning them, or both. You already use them daily.',
    difficulty: 'basic',
    category: 'functions-this',
    keyPoints: [
      'Taking a function as input: map, filter, reduce, forEach, addEventListener , you hand them the behaviour, they handle the looping/wiring.',
      'Returning a function as output: bind, debounce, throttle, or a multiplier factory , the returned function remembers its setup via a closure.',
      'The point: extract the repeated mechanics (iterating, timing, retrying) into one place, and plug in just the part that varies.',
      'This is the foundation JavaScript\'s functional style is built on , and possible because functions are ordinary values ("first-class citizens").'
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
    summary:
      "Two ways to pre-fill a function's arguments: currying feeds them one at a time , f(a)(b)(c) , while partial application locks in a few now and takes the rest later.",
    difficulty: 'intermediate',
    category: 'functions-this',
    prerequisites: ['core-closures', 'fn-higher-order'],
    keyPoints: [
      'Currying transforms f(a, b, c) into f(a)(b)(c) , each call takes exactly one argument and returns a function hungry for the next.',
      'Partial application is looser: fix SOME arguments now and get back a function expecting whatever is left , add(5, b) from add(a, b).',
      'The quickest partial application is built in: fn.bind(null, ...presetArgs).',
      'Both work because of closures , each returned function remembers the arguments given so far.',
      'The distinction interviewers probe: curried functions always take one argument at a time; partial application can fix any number at once.'
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
    summary:
      'Two ways to define a function with one practical difference: a declaration can be called from lines above it, a function stored in a variable cannot.',
    difficulty: 'basic',
    category: 'functions-this',
    prerequisites: ['core-hoisting'],
    keyPoints: [
      'function foo() {} , a declaration: the entire function is hoisted, so it works anywhere in its scope, even before its line.',
      "const foo = function() {} , an expression: only the variable name is hoisted, not the function value, following the variable's own hoisting rules.",
      'Result: calling a declaration early works fine; calling an expression early throws (TypeError with var, ReferenceError with let/const).',
      'A named function expression , const f = function helper() {} , makes "helper" visible ONLY inside itself, useful for recursion and stack traces.',
      'Anonymous function expressions are the everyday form , inline callbacks and immediately-invoked functions (IIFEs).'
    ],
    codeSnippet: `decl();           // 'ok' , hoisted
function decl() { return 'ok'; }

expr();           // TypeError — not yet a function
var expr = function () { return 'ok'; };

const f = function named() { return named; }; // 'named' only inside`
  },

  // ─── OOP & PROTOTYPES ────────────────────────────────────────────────────────

  {
    id: 'oop-prototypal-inheritance',
    title: 'Prototypal Inheritance',
    summary:
      "JavaScript objects inherit directly from other objects: when a property isn't found on an object, the lookup automatically continues on its prototype.",
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    keyPoints: [
      'Every object carries a hidden link to another object , its [[Prototype]] , readable with Object.getPrototypeOf(obj).',
      "Ask an object for a property it doesn't have, and JavaScript follows that link and asks the prototype, then the prototype's prototype, until it finds the property or hits null.",
      'Nothing is copied , this is delegation. A thousand instances share the ONE makeSound method living on their prototype.',
      'Modern ways to wire up a chain: class ... extends, or Object.setPrototypeOf for existing objects.',
      'With constructor functions, shared methods go on Constructor.prototype , every instance built by `new` links to that object.'
    ],
    textbookDef: `Prototypal inheritance is a model in which objects inherit directly from other objects. Each object holds an internal reference ([[Prototype]]) to another object; property access that fails on the object itself is delegated up this prototype chain until the property is found or the chain terminates at null.`,
    eli5: `Looking up a property is like asking your parent a question. If you don't know the answer, you ask your parent (the prototype); if they don't know, they ask their parent , all the way up the family tree until someone answers or you run out of relatives (null).`,
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
    summary:
      'The path JavaScript walks when you access a property: from the object, through each prototype in turn, ending at Object.prototype and finally null.',
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    prerequisites: ['oop-prototypal-inheritance'],
    keyPoints: [
      'The route is always: obj → obj\'s prototype → its prototype → ... → Object.prototype → null. That final Object.prototype is why every object "has" toString.',
      'Object.getPrototypeOf(obj) shows you the next link; Object.setPrototypeOf changes it.',
      'instanceof is really a chain question: arr instanceof Array asks "does Array.prototype appear anywhere in arr\'s chain?"',
      "To separate an object's own properties from inherited ones, use Object.hasOwn(obj, key) , arrays don't OWN a map method, they inherit it.",
      'Every link adds lookup work , keep inheritance hierarchies shallow.'
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
    summary: 'The four things `new` does behind the scenes , a step-by-step answer interviewers ask for by name.',
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    prerequisites: ['oop-prototypal-inheritance', 'fn-this'],
    keyPoints: [
      'Step 1: a fresh, empty object is created.',
      "Step 2: its hidden [[Prototype]] link is pointed at the constructor's .prototype object , that's how the instance inherits the shared methods.",
      'Step 3: the constructor runs with `this` bound to the new object, so this.name = name writes onto it.',
      'Step 4: the new object is returned automatically , unless the constructor explicitly returns a different object, which then wins.',
      'Forget the `new` and none of this happens: the function runs as a plain call, `this` is the global object (or undefined in strict mode), and you get back undefined.'
    ],
    gotcha:
      'const p = Person() (no new) does not create an instance , it runs Person as a plain function, often returning undefined and leaking globals.',
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
    summary:
      "The class keyword didn't add a new object model , it's a cleaner coat of paint over the same constructor-function-plus-prototype pattern.",
    difficulty: 'basic',
    category: 'oop-prototypes',
    prerequisites: ['oop-prototypal-inheritance', 'es6-classes'],
    keyPoints: [
      'What ES5 wrote as a function plus manual Person.prototype.method = ... assignments, class expresses as one tidy body with constructor and methods together.',
      'Inheritance shrinks from three manual steps (Object.create, constructor.call, fixing .constructor) to two keywords: extends and super.',
      "Small behavioural upgrades: class methods don't show up in for...in loops (non-enumerable), and class bodies always run in strict mode.",
      'Hoisting differs: function constructors can be used before their line; classes are in the Temporal Dead Zone until theirs.',
      'The interview line: "classes are syntactic sugar" , underneath, it is still prototypes and delegation all the way down.'
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
    summary: 'Properties and methods that live on the class itself , you call MathUtil.square(4) without ever creating an instance.',
    difficulty: 'intermediate',
    category: 'oop-prototypes',
    prerequisites: ['es6-classes'],
    keyPoints: [
      'Mark them with the static keyword and access them through the class name: ClassName.member.',
      "Instances can't see them , instance.member is undefined, because static members never travel to instances.",
      'Use them for things that belong to the concept, not to any one object: utility functions, constants, factory methods, an instances-created counter.',
      'Static fields work too, and even static private members (static #count) , shared secret state for the whole class.'
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
    summary: 'Five ways to make an object, from the everyday literal to full classes , a classic "list them" interview question.',
    difficulty: 'basic',
    category: 'oop-prototypes',
    keyPoints: [
      'Object literal { x: 1 } , the everyday way; use it unless you have a reason not to.',
      "new Object() , the constructor form; works, but it's just a longer literal.",
      'Object.create(proto) , build an object with exactly the prototype you specify (including null for a truly bare object).',
      'Constructor function + new , the pre-2015 "blueprint" pattern for creating many similar objects.',
      'class , the modern structured syntax for the same blueprint idea, with constructor and methods in one body.'
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
    summary:
      'Both store key-value pairs , but Map is the purpose-built dictionary, and a plain {} is an object that happens to hold data. When to use which.',
    difficulty: 'intermediate',
    category: 'collections',
    prerequisites: ['es6-map-set'],
    keyPoints: [
      'Map keys can be ANY type , objects, functions, numbers. Object keys are silently converted to strings (or symbols), so obj[{a:1}] becomes obj["[object Object]"].',
      'Map guarantees keys iterate in insertion order; object key ordering has quirks (integer-like keys jump to the front).',
      'Counting is built in: map.size, versus Object.keys(obj).length.',
      'Maps iterate directly with for...of, forEach, entries/keys/values , no Object.entries conversion step.',
      'Objects win at serialisation: JSON.stringify works on objects but ignores Maps entirely. Objects also carry prototype baggage (a fresh {} already "has" toString).',
      'Rule of thumb: frequently adding/removing keys, non-string keys, or need ordering guarantees → Map. Fixed shape, JSON in/out → plain object.'
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
    summary:
      'Map and Set variants whose grip on their keys is "weak": if nothing else in the program uses a key object, the garbage collector may throw it (and its entry) away.',
    difficulty: 'advanced',
    category: 'collections',
    prerequisites: ['es6-map-set'],
    keyPoints: [
      'Keys (WeakMap) and elements (WeakSet) must be objects, and they are held by weak reference , the collection alone doesn\'t count as "still in use".',
      'The payoff: attach data to an object, and when the object dies, the attached data is cleaned up automatically , no memory leak.',
      "The price: you can't iterate them, and there is no .size , the contents could be collected at any moment, so listing them would be meaningless.",
      'Classic uses: private per-object data, caches keyed by objects, and metadata attached to DOM nodes that come and go.',
      'The contrast in one line: an object stored in a regular Map lives as long as the Map does; in a WeakMap, it lives only as long as someone else needs it.'
    ],
    gotcha: 'You cannot list or count WeakMap/WeakSet contents , that is the price of allowing keys to be collected.',
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
    summary:
      'A Set can hold two objects with identical contents , because for objects, "equal" means "the very same object in memory", not "looks the same".',
    difficulty: 'basic',
    category: 'collections',
    prerequisites: ['es6-map-set'],
    keyPoints: [
      'Sets and Maps compare with SameValueZero , for objects, that boils down to reference identity: is it literally the same object?',
      'So { a: 1 } and { a: 1 } written twice are two different entries , same shape, different objects.',
      "Primitives behave as you'd hope: compared by value, and NaN even matches itself here (unlike with ===).",
      'Want to dedupe objects by their contents? You must create a comparable key yourself , JSON.stringify each one, or key by an id field.'
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
    summary:
      'How single-threaded JavaScript juggles async work: run the current code to completion, clear ALL the urgent queue (microtasks), take ONE item from the regular queue (macrotasks), repeat forever.',
    difficulty: 'intermediate',
    category: 'async-js',
    prerequisites: ['async-sync-vs-async'],
    keyPoints: [
      'All synchronous code runs first, to completion, on the call stack , nothing can interrupt a running function.',
      'Async operations (timers, fetches) are handed to the browser/Node.js to do in the background; when finished, their callbacks line up in queues.',
      'There are two queues with different priority. When the stack empties, the loop drains the ENTIRE microtask queue first, then takes just ONE macrotask.',
      'After every macrotask, microtasks get drained again , so microtasks can always jump the queue.',
      'Microtasks (the urgent queue): promise .then callbacks, code after an await, queueMicrotask, MutationObserver.',
      'Macrotasks (the regular queue): setTimeout/setInterval callbacks, I/O completions, UI events like clicks.'
    ],
    textbookDef: `The event loop is the runtime mechanism that coordinates execution of synchronous code on the call stack with asynchronous callbacks held in the microtask and macrotask queues, processing all available microtasks between each macrotask to provide non-blocking concurrency on a single thread.`,
    eli5: `Think of a chef (the single thread). Orders pile up in two trays: urgent sticky-notes (microtasks) and regular tickets (macrotasks). After finishing the current dish, the chef clears ALL sticky-notes first, then does just ONE regular ticket , then checks the sticky-notes again. That loop never stops.`,
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
    summary:
      'Synchronous code makes everything wait its turn; asynchronous code says "start this, carry on, and deal with the result when it arrives".',
    difficulty: 'basic',
    category: 'async-js',
    keyPoints: [
      'Synchronous statements run strictly in order , each one blocks the single thread until it finishes.',
      'Asynchronous operations hand control back immediately; the actual work (network request, timer) completes in the background.',
      'This matters because JavaScript has one thread shared with the UI , a long synchronous task freezes the whole page, clicks and all.',
      'Async results come back through three evolutions of the same idea: callbacks, then Promises, then async/await.'
    ],
    codeSnippet: `console.log('Fetching…');
setTimeout(() => console.log('data arrived'), 2000); // async
console.log('Request sent');
// Logs: Fetching… → Request sent → (2s) data arrived`
  },
  {
    id: 'async-promises-vs-callbacks',
    title: 'Promises vs Callbacks',
    summary:
      'Why promises replaced raw callbacks: flat chains instead of pyramid-shaped nesting, and one .catch instead of an error argument in every callback.',
    difficulty: 'intermediate',
    category: 'async-js',
    prerequisites: ['es6-promises'],
    keyPoints: [
      'Callbacks for dependent steps nest inside each other, marching rightward across the screen , the infamous "callback hell" , with error handling repeated at every level.',
      'Promises flatten that: each step is a .then in a straight chain, and a single .catch at the end handles a failure from ANY step.',
      'Promises also compose , running several at once is a one-liner: Promise.all (all must succeed), allSettled (report everything), race (first to settle), any (first to succeed).',
      'async/await builds on promises to make the chain read like plain sequential code.',
      'The honest trade-off: promises introduce their own concepts (states, chaining, combinators) , a small learning tax for much better code.'
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
    summary:
      'Four ways to run promises in parallel, differing only in what counts as "done": all of them, every outcome, the first to finish, or the first to succeed.',
    difficulty: 'intermediate',
    category: 'async-js',
    prerequisites: ['es6-promises'],
    keyPoints: [
      'Promise.all , "I need every one to succeed": resolves with all the results, but the FIRST failure rejects the whole thing immediately (fail-fast).',
      'Promise.allSettled , "attempt everything, tell me how each went": never rejects; you get a {status, value|reason} report per promise.',
      'Promise.race , "first to cross the line, win or crash": settles the moment ANY promise settles , a fast rejection wins the race. Classic use: racing a request against a timeout.',
      'Promise.any , "first SUCCESS wins": ignores failures unless literally everything fails, in which case you get an AggregateError of all the reasons.'
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
    summary:
      "JavaScript has two module systems living side by side: ES Modules (import/export, the official standard) and CommonJS (require, Node's original system).",
    difficulty: 'intermediate',
    category: 'modules',
    prerequisites: ['es6-modules'],
    keyPoints: [
      'ES Modules (ESM): import/export syntax, the official language standard, loads asynchronously , what browsers and modern tooling speak natively.',
      "CommonJS (CJS): require() and module.exports, loads synchronously , Node.js's original system, still everywhere in the npm ecosystem.",
      'The deep difference: ESM\'s imports are fixed at the top of the file and analysable WITHOUT running the code ("static"). That is precisely what makes tree shaking and missing-export errors at build time possible; require(anything) can\'t be analysed that way.',
      'ESM imports are live, read-only views of the exported value , if the module updates it, importers see the change. CommonJS hands you a snapshot copied at require time.',
      'Two practical perks of ESM: files are automatically strict mode, and top-level await only works there.'
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
    summary:
      "Tree shaking is the bundler throwing away code you never use: import one function from a library, and the rest doesn't ship to your users.",
    difficulty: 'intermediate',
    category: 'modules',
    prerequisites: ['modules-esm-vs-cjs'],
    keyPoints: [
      'The name is the mental model: shake the dependency tree and the dead leaves , exports nothing imports , fall off the bundle.',
      "It only works because ES module imports are static: the bundler can see exactly what's used just by reading the files, without executing anything. CommonJS require can't be shaken.",
      'The bundler (Vite, webpack, Rollup, esbuild) is the tool doing this , it walks your import graph, combines modules, and optimises the result.',
      'One blocker: modules with side effects (code that runs on import, like registering a polyfill) can\'t safely be dropped. Declaring "sideEffects": false in package.json tells the bundler your files are safe.',
      'The payoff stack: smaller downloads, fewer requests, and scope hoisting (modules merged into one function scope for less overhead).'
    ],
    codeSnippet: `// utils.js exports add + subtract
import { add } from './utils.js'; // only 'add' ends up in the bundle
add(1, 2);`
  },

  // ─── DESIGN PATTERNS ─────────────────────────────────────────────────────────

  {
    id: 'pattern-singleton',
    title: 'Singleton Pattern',
    summary: 'A pattern that guarantees there is exactly ONE instance of something, and everyone who asks gets that same one.',
    difficulty: 'intermediate',
    category: 'design-patterns',
    keyPoints: [
      'However many times you "create" it, you always receive the same single instance.',
      'Two common implementations: the constructor caches and returns a static instance (as in the snippet), or , the JavaScript-native way , a module that exports one object, since modules are only evaluated once.',
      'Reach for it when duplicates would be wasteful or wrong: a config store, a logger, a database connection pool.',
      "The known downside: a singleton is global state in disguise , tests can't easily isolate or reset it, and hidden dependencies creep in."
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
    summary:
      'One creation function that decides at runtime which kind of object to hand back , callers say WHAT they want, the factory worries about HOW to build it.',
    difficulty: 'intermediate',
    category: 'design-patterns',
    keyPoints: [
      'All the "how do I construct this?" logic lives in one function instead of being scattered through the codebase.',
      'The factory picks the concrete variant from its input , createAnimal("dog") vs createAnimal("cat") , at runtime.',
      'Callers never touch specific constructors, so swapping an implementation or adding a new variant changes one file, not every call site.',
      'It earns its keep when construction is complicated, conditional, or likely to change.'
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
    summary:
      'A "subject" keeps a list of interested functions and calls them all whenever something happens , the newsletter model, and the idea behind every event system.',
    difficulty: 'intermediate',
    category: 'design-patterns',
    keyPoints: [
      'The subject maintains a subscriber list; anyone can join via subscribe(fn).',
      "When the subject's state changes, it loops through the list and notifies every subscriber with the new data.",
      "You use this constantly without naming it: addEventListener, Node's EventEmitter, RxJS, and reactive UI updates are all the observer pattern.",
      'The win is decoupling: the thing announcing events knows nothing about who is listening , subscribers come and go freely.'
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
    summary:
      'The classic pre-ES-modules way to get public and private: a function runs once (an IIFE) and returns only the parts meant to be public , everything else stays locked inside.',
    difficulty: 'intermediate',
    category: 'design-patterns',
    prerequisites: ['core-closures'],
    keyPoints: [
      "An IIFE , an Immediately Invoked Function Expression, (function(){ ... })() , runs the moment it's defined and returns an object of public methods.",
      'Variables declared inside never escape: the returned methods can reach them through their closure, but outside code cannot , real privacy.',
      'It also keeps the global namespace clean , one variable for the whole module instead of a scatter of globals.',
      'Historically important: this pattern is the conceptual ancestor of ES modules, which give the same privacy per file, natively.'
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
    summary:
      'Three more classics worth recognising: swap algorithms in and out (Strategy), wrap objects to add features (Decorator), and turn actions into objects (Command).',
    difficulty: 'advanced',
    category: 'design-patterns',
    keyPoints: [
      'Strategy: the surrounding code stays fixed while the algorithm is passed in as an interchangeable piece , think of a sorter that accepts different comparison functions, or a checkout accepting different payment methods.',
      'Decorator: wrap an existing object in another that adds behaviour on top, without touching the original class , a Car wrapped in WithGPS still drives, plus navigation.',
      'Command: package an action as an object with execute() and undo() methods , once actions are objects, you can queue them, log them, and build undo/redo stacks.',
      'The common thread: all three build behaviour by composing objects rather than by inheritance hierarchies.'
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
    summary:
      "An attacker sneaks their JavaScript into your page , say, via a comment field , and it runs in every visitor's browser with that visitor's permissions.",
    difficulty: 'intermediate',
    category: 'security',
    prerequisites: ['dom-content'],
    keyPoints: [
      'The root cause is always the same: text from an untrusted source ends up rendered as executable HTML/JavaScript instead of as plain text.',
      "What the injected script can do: steal cookies and sessions, log keystrokes, rewrite the page , anything the legitimate page's code can do.",
      'The core defence: never render untrusted input as HTML. Escape or sanitise on output, and prefer textContent over innerHTML for user data.',
      'Add a Content Security Policy (CSP) header as a second layer , even if injection slips through, the browser refuses to run scripts from unapproved sources.',
      "React and friends escape output automatically , you're safe by default until someone reaches for dangerouslySetInnerHTML, which reopens the hole by design."
    ],
    gotcha:
      'el.innerHTML = userInput is the textbook XSS vector , one line, full compromise. Untrusted strings go in el.textContent, no exceptions.',
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
    summary:
      'You\'re logged into your bank in one tab; a shady site in another tab makes your browser send a "transfer money" request , and your session cookie rides along automatically.',
    difficulty: 'intermediate',
    category: 'security',
    keyPoints: [
      'The exploit hinges on one browser behaviour: cookies for a site are attached automatically to ANY request going to that site, no matter which page triggered it.',
      "So a hidden form on evil.com submitting to bank.com arrives authenticated , the server can't tell it wasn't the user's idea.",
      "Defence 1 , anti-CSRF tokens: the server embeds a secret token in its own forms and rejects requests without it; the attacker's page can't read the token.",
      'Defence 2 , SameSite cookies: SameSite=Lax or Strict tells the browser NOT to attach the session cookie to cross-site requests, cutting the attack off at the source.',
      'Defence 3 , verify the Origin/Referer headers on state-changing requests, and keep CORS configured tightly.'
    ],
    codeSnippet: `// Mitigations (conceptual)
// 1) Per-form anti-CSRF token checked on the server
// 2) Set-Cookie: session=…; SameSite=Strict; Secure; HttpOnly
// 3) Validate the Origin header for state-changing requests`
  },
  {
    id: 'security-csp-headers',
    title: 'CSP & Security Headers',
    summary:
      'A handful of HTTP response headers that tell the browser to lock things down , cheap to add, and they blunt whole categories of attack.',
    difficulty: 'intermediate',
    category: 'security',
    prerequisites: ['security-xss'],
    keyPoints: [
      'Content-Security-Policy (CSP): an allowlist of where scripts, styles, and images may come from , injected script from anywhere else simply refuses to run. The big anti-XSS header.',
      'X-Frame-Options / CSP frame-ancestors: stop other sites embedding yours in an invisible iframe and tricking users into clicking things ("clickjacking").',
      'Strict-Transport-Security (HSTS): tells the browser to always use HTTPS for this site, even if the user types http:// , blocks downgrade attacks.',
      'X-Content-Type-Options: nosniff: stops the browser "guessing" file types , without it, a disguised upload could be reinterpreted as runnable script.',
      'Referrer-Policy: controls how much of the current URL leaks to other sites in the Referer header when users click away.'
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
    summary:
      "The browser's default rule , a page may only read responses from its own origin , and CORS, the header-based mechanism servers use to relax it deliberately.",
    difficulty: 'intermediate',
    category: 'security',
    keyPoints: [
      'An "origin" is the trio scheme + host + port (https + app.com + 443). Change any one and it\'s a different origin.',
      'The Same-Origin Policy: your page can SEND requests anywhere, but by default the browser refuses to let your JavaScript READ a response from a different origin.',
      'CORS (Cross-Origin Resource Sharing) is the opt-in: the SERVER adds headers like Access-Control-Allow-Origin: https://app.com to say "this origin may read my responses". Note who\'s in control , a CORS error is fixed on the server, not in your fetch call.',
      'For non-simple requests (custom headers, JSON content type, PUT/DELETE), the browser first sends an OPTIONS "preflight" asking permission before the real request.',
      'The point of it all: without this policy, any random site you visit could silently read your logged-in Gmail, bank, and internal dashboards.'
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
    prerequisites: ['dom-events'],
    keyPoints: [
      'Custom events: new CustomEvent("name", { detail }) + el.dispatchEvent(ev) let parts of an app talk through the DOM; detail carries the payload.',
      'Passive listeners: { passive: true } promises you will NOT call preventDefault, so the browser scrolls without waiting on your handler , removes touch/wheel scroll jank.',
      'Keyboard events: listen for keydown / keyup and read e.key ("Enter", "ArrowUp", "a"); use e.ctrlKey / e.shiftKey for modifiers. Prefer e.key over the deprecated e.keyCode.',
      'Cleanup: removeEventListener needs the SAME function reference you added , an inline arrow can never be removed.',
      'A listener pins its handler (and closure) in memory; forgetting to remove it on teardown keeps the element and its data from being garbage-collected.'
    ],
    gotcha:
      'Calling e.preventDefault() inside a listener registered as { passive: true } is ignored and logs a console warning , the passive flag tells the browser you gave up that right.',
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
    summary: 'When results depend on which async task finishes first, a stale earlier response can clobber a newer one , guard against it.',
    difficulty: 'intermediate',
    category: 'async-js',
    prerequisites: ['es6-promises', 'webapi-fetch'],
    keyPoints: [
      'A race condition: two or more async operations whose final outcome depends on their arrival order rather than the order you started them.',
      'Classic case: type "ab" → request "a" fires, then "ab"; if "a" resolves last it overwrites the correct "ab" results.',
      'Fix 1 , cancel stale work: abort the previous request with AbortController before starting a new one.',
      'Fix 2 , ignore stale results: track the latest request id/value and drop responses that no longer match.',
      'Promise.all does NOT cause races (it waits for all); races come from overlapping, independently-resolving operations.'
    ],
    gotcha:
      'await inside a loop or rapid effect does not serialise independent calls , each await suspends its own function, so several can still be in flight and resolve out of order.',
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
    summary: 'A background script that sits between the page and the network , the engine behind offline support, caching, and push.',
    difficulty: 'advanced',
    category: 'web-apis',
    prerequisites: ['webapi-fetch', 'es6-promises'],
    keyPoints: [
      'A worker script the browser runs separately from the page , no DOM access, event-driven, and it keeps running after the tab closes.',
      'Acts as a programmable network proxy: it intercepts fetch events and can answer from a cache instead of the network (offline support).',
      'Lifecycle: register → install (pre-cache assets) → activate (clean old caches) → controls pages on the next load.',
      'Powers Progressive Web Apps (PWAs): offline pages, background sync, and push notifications.',
      'HTTPS only (localhost is exempt) because intercepting every request is a powerful capability.'
    ],
    gotcha:
      'A service worker does not control the page that registered it until the next navigation , so your first visit still hits the network; caching kicks in on the reload.',
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
    summary: 'A browser-native way to build reusable, encapsulated custom elements , framework-agnostic.',
    difficulty: 'advanced',
    category: 'web-apis',
    keyPoints: [
      'Custom Elements: define your own HTML tag with a class extending HTMLElement, e.g. <my-card>.',
      'Shadow DOM: attach a separate, encapsulated DOM subtree whose styles and markup do NOT leak in or out.',
      'HTML <template>: inert markup you clone at runtime , parsed but not rendered until used.',
      'Encapsulation is the headline benefit: a component’s CSS can’t clash with the rest of the page.',
      'Works in any framework (or none) because it’s a platform standard, not a library.'
    ],
    gotcha:
      'Styles inside a shadow root are isolated by design , global stylesheets and most CSS selectors can’t reach in, which surprises people expecting their app CSS to apply.',
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
    summary: 'The steps the browser takes to turn HTML, CSS, and JS into pixels , optimise it to render faster.',
    difficulty: 'advanced',
    category: 'web-apis',
    keyPoints: [
      'Pipeline: HTML → DOM tree, CSS → CSSOM tree, combine into the render tree → layout (positions/sizes) → paint → composite.',
      'CSS is render-blocking: the browser won’t paint until the CSSOM is ready, so ship critical CSS small and early.',
      'A plain <script> is parser-blocking , it stops HTML parsing; use defer (run after parse, in order) or async (run ASAP).',
      'Minimise the bytes, the number of round-trips, and the critical resources to speed up first paint.',
      'Inlining critical CSS and deferring non-essential JS are the classic wins.'
    ],
    gotcha:
      'A synchronous <script> in <head> blocks DOM construction at that point , move it to the end of <body> or add defer so parsing isn’t stalled.',
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
      'Detect the feature, don’t sniff the user-agent string , UA strings lie and break, while a capability check (typeof navigator.share === "function") is reliable.',
    codeSnippet: `// Enhance only when the capability exists
if ('IntersectionObserver' in window) {
  lazyLoadImages();        // enhanced path
} else {
  loadAllImages();         // baseline still works
}`
  }
];
