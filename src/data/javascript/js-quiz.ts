import type { QuizQuestion } from '@/types/content';

// ─── JavaScript quiz — multiple choice ─────────────────────────────────────

export const jsQuiz: QuizQuestion[] = [
  {
    id: 'js-q-typeof-null',
    question: "What does `typeof null` evaluate to?",
    options: ['"null"', '"object"', '"undefined"', '"boolean"'],
    correctIndex: 1,
    explanation: 'A long-standing JS bug kept for backwards compatibility — `null` is not actually an object.',
    category: 'Core'
  },
  {
    id: 'js-q-equality',
    question: 'Which comparison uses type coercion before comparing values?',
    options: ['===', '==', 'Object.is', 'None of these'],
    correctIndex: 1,
    explanation: '`==` coerces operands to a common type first; `===` and `Object.is` do not.',
    category: 'Core'
  },
  {
    id: 'js-q-hoisting-let',
    question: 'What happens when you access a `let` variable before its declaration in the same scope?',
    options: ['undefined', 'ReferenceError (TDZ)', 'null', 'SyntaxError'],
    correctIndex: 1,
    explanation: '`let`/`const` are hoisted but stay in the Temporal Dead Zone until their declaration line.',
    category: 'Scoping'
  },
  {
    id: 'js-q-closure',
    question: 'A closure is best described as:',
    options: [
      'A function bundled with references to its surrounding lexical scope',
      'A way to copy variables by value into a new function',
      'A built-in method for deep-cloning objects',
      'A synonym for an IIFE'
    ],
    correctIndex: 0,
    explanation: 'The inner function keeps access to variables from the scope it was defined in, even after that scope has returned.',
    category: 'Functions'
  },
  {
    id: 'js-q-event-loop',
    question: 'Given `setTimeout(fn, 0)` and a `Promise.resolve().then(fn2)` scheduled at the same time, which runs first?',
    options: ['setTimeout callback', 'Promise callback', 'They run simultaneously', 'Order is undefined'],
    correctIndex: 1,
    explanation: 'Microtasks (promise callbacks) drain before the next macrotask (timers) runs.',
    category: 'Async'
  },
  {
    id: 'js-q-this-arrow',
    question: 'What determines the value of `this` inside an arrow function?',
    options: [
      'The object the arrow function is called on',
      'The lexical scope where the arrow function was defined',
      'Always the global object',
      'Whatever `.bind()` was last called with'
    ],
    correctIndex: 1,
    explanation: 'Arrow functions have no own `this` — they capture it from the enclosing lexical scope at definition time.',
    category: 'Functions'
  },
  {
    id: 'js-q-array-methods',
    question: 'Which array method mutates the original array?',
    options: ['map', 'filter', 'sort', 'concat'],
    correctIndex: 2,
    explanation: '`sort` (and `splice`, `push`, `pop`, `reverse`) mutate in place; `map`/`filter`/`concat` return new arrays.',
    category: 'Arrays'
  },
  {
    id: 'js-q-promise-all',
    question: 'If one promise passed to `Promise.all([...])` rejects, what happens?',
    options: [
      'The other promises are cancelled and `Promise.all` resolves with partial results',
      'It rejects immediately with that reason, other promises keep running in the background',
      'It waits for every promise to settle before rejecting',
      'It resolves with `undefined` for the rejected one'
    ],
    correctIndex: 1,
    explanation: '`Promise.all` short-circuits on the first rejection — use `Promise.allSettled` to wait for every promise regardless of outcome.',
    category: 'Async'
  },
  {
    id: 'js-q-prototype',
    question: 'How does JavaScript resolve `obj.someMethod()` if `someMethod` is not an own property of `obj`?',
    options: [
      'It throws immediately',
      'It walks up the prototype chain looking for the property',
      'It creates the method on `obj` automatically',
      'It checks `window`/`globalThis` for a matching function'
    ],
    correctIndex: 1,
    explanation: 'Property lookups walk the prototype chain until found or `null` is reached.',
    category: 'Objects'
  },
  {
    id: 'js-q-var-scope',
    question: '`var` declared inside a block (e.g. an `if` block) is scoped to:',
    options: ['The block it was declared in', 'The nearest enclosing function (or global scope)', 'The module', 'Nothing — it throws a SyntaxError'],
    correctIndex: 1,
    explanation: '`var` is function-scoped (or global-scoped), unlike `let`/`const` which are block-scoped.',
    category: 'Scoping'
  },
  {
    id: 'js-q-nan',
    question: 'Which expression correctly checks if a value is `NaN`?',
    options: ['value == NaN', 'value === NaN', 'Number.isNaN(value)', 'typeof value === "NaN"'],
    correctIndex: 2,
    explanation: '`NaN` is the only value not equal to itself, so `==`/`===` never work; `Number.isNaN` is the reliable check.',
    category: 'Core'
  },
  {
    id: 'js-q-spread-shallow',
    question: 'When you spread-copy an object like `{ ...original }`, nested objects inside it are:',
    options: ['Deep-cloned', 'Still shared by reference with the original', 'Converted to strings', 'Frozen automatically'],
    correctIndex: 1,
    explanation: 'Spread only performs a shallow copy — nested objects/arrays remain the same references.',
    category: 'Objects'
  },
  {
    id: 'js-q-async-await',
    question: 'What does an `async` function always return?',
    options: ['The raw value returned inside it', 'A Promise that resolves/rejects with that value', 'undefined', 'A generator object'],
    correctIndex: 1,
    explanation: 'Even if you `return 5`, the caller receives a Promise that resolves to `5`.',
    category: 'Async'
  },
  {
    id: 'js-q-debounce',
    question: 'A debounced function delays execution until:',
    options: [
      'A fixed interval has elapsed regardless of new calls',
      'A pause of a given duration has occurred since the last call',
      'The next animation frame',
      'The event loop is idle'
    ],
    correctIndex: 1,
    explanation: 'Debouncing resets its timer on every call, so the function only fires after calls stop for the wait period.',
    category: 'Patterns'
  },
  {
    id: 'js-q-json-stringify',
    question: 'What does `JSON.stringify` do with a property whose value is `undefined`?',
    options: ['Includes it as `null`', 'Includes it as `"undefined"`', 'Omits the property entirely', 'Throws a TypeError'],
    correctIndex: 2,
    explanation: 'Object properties with `undefined` values are dropped by `JSON.stringify` (array elements become `null` instead).',
    category: 'Core'
  },
  {
    id: 'js-q-optional-chaining',
    question: 'What does `obj?.foo?.bar` evaluate to if `obj.foo` is `undefined`?',
    options: ['Throws a TypeError', 'undefined', 'null', 'An empty string'],
    correctIndex: 1,
    explanation: 'Optional chaining short-circuits to `undefined` as soon as it hits a nullish value in the chain.',
    category: 'Core'
  },
  {
    id: 'js-q-set-dedupe',
    question: 'Which built-in is the idiomatic way to de-duplicate an array of primitives?',
    options: ['Array.prototype.unique()', 'new Set(array)', 'Object.keys(array)', 'array.filter(Boolean)'],
    correctIndex: 1,
    explanation: '`Set` only stores unique values; `[...new Set(array)]` is the common dedupe idiom (there is no `.unique()` method).',
    category: 'Data structures'
  },
  {
    id: 'js-q-generator',
    question: 'What keyword pauses execution inside a generator function until the next `.next()` call?',
    options: ['return', 'await', 'yield', 'pause'],
    correctIndex: 2,
    explanation: '`yield` suspends the generator and hands a value back to the caller until it is resumed.',
    category: 'Functions'
  },
  {
    id: 'js-q-map-vs-object',
    question: 'Compared to a plain object, a `Map` is generally preferred when you need:',
    options: [
      'JSON.stringify support out of the box',
      'Keys of any type (including objects) and a reliable insertion-order iteration',
      'Prototype-based property lookup',
      'Smaller memory usage for string keys'
    ],
    correctIndex: 1,
    explanation: 'Maps allow non-string keys and guarantee iteration in insertion order, unlike plain objects.',
    category: 'Data structures'
  },
  {
    id: 'js-q-strict-mode',
    question: 'Assigning to an undeclared variable in strict mode (`"use strict"`) results in:',
    options: ['A silent global variable creation', 'A ReferenceError', 'undefined', 'It is not allowed to matter — strict mode ignores it'],
    correctIndex: 1,
    explanation: "Strict mode disallows the implicit-global-creation footgun that sloppy mode allows — it throws instead.",
    category: 'Core'
  },
  {
    id: 'js-q-code-closure-loop',
    question: 'What does this log?',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    options: ['0 1 2', '3 3 3', '0 0 0', 'undefined undefined undefined'],
    correctIndex: 1,
    explanation: '`var` is function-scoped, so all three closures share the same `i` — by the time the timeouts fire, the loop has finished and `i` is 3.',
    category: 'Closures'
  },
  {
    id: 'js-q-code-let-loop',
    question: 'What does this log?',
    code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    options: ['3 3 3', '0 1 2', '0 0 0', 'It throws a ReferenceError'],
    correctIndex: 1,
    explanation: '`let` creates a fresh binding of `i` for each loop iteration, so each closure captures its own value.',
    category: 'Closures'
  },
  {
    id: 'js-q-code-coercion',
    question: 'What does this evaluate to?',
    code: `console.log([] + []);
console.log([] + {});
console.log({} + []);`,
    options: [
      '"" then "[object Object]" then "[object Object]"',
      'TypeError on all three',
      '0 then NaN then 0',
      'undefined for all three'
    ],
    correctIndex: 0,
    explanation: '`+` coerces both operands to strings/numbers; arrays and objects stringify via `toString()`, giving `""`, `"[object Object]"`, and (in an expression context) `"[object Object]"`.',
    category: 'Coercion'
  },
  {
    id: 'js-q-code-this-method',
    question: 'What does this log?',
    code: `const obj = {
  name: 'QuickRecall',
  greet() {
    return this.name;
  }
};
const fn = obj.greet;
console.log(fn());`,
    options: ['"QuickRecall"', 'undefined (or TypeError in strict mode)', 'null', 'ReferenceError'],
    correctIndex: 1,
    explanation: 'Detaching `greet` from `obj` loses the binding — called as a bare function, `this` is `undefined` in strict/module code (or the global object in sloppy mode), so `this.name` is `undefined`.',
    category: 'Functions'
  },
  {
    id: 'js-q-code-array-holes',
    question: 'What does this log?',
    code: `console.log([1, , 3].length);
console.log([1, , 3].map((x) => x * 2));`,
    options: ['2, and [2, undefined, 6]', '3, and [2, <1 empty item>, 6]', '3, and [2, NaN, 6]', 'SyntaxError'],
    correctIndex: 1,
    explanation: 'Elisions create sparse arrays — `.length` still counts the hole, but `.map` skips holes entirely, leaving them empty in the result.',
    category: 'Arrays'
  },
  {
    id: 'js-q-code-async-order',
    question: 'What order do these logs appear in?',
    code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    options: ['1 2 3 4', '1 4 3 2', '1 4 2 3', '1 3 4 2'],
    correctIndex: 1,
    explanation: 'Synchronous code runs first (1, 4), then microtasks drain (3), then the macrotask queue runs (2).',
    category: 'Async'
  },
  {
    id: 'js-q-code-default-param',
    question: 'What does this log?',
    code: `function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}
console.log(greet(undefined));
console.log(greet(null));`,
    options: [
      '"Hello, World!" then "Hello, World!"',
      '"Hello, World!" then "Hello, null!"',
      '"Hello, undefined!" then "Hello, null!"',
      'TypeError on both'
    ],
    correctIndex: 1,
    explanation: 'Default parameters only kick in for `undefined`, not `null` — passing `null` explicitly is treated as a real value.',
    category: 'Functions'
  },
  {
    id: 'js-q-code-object-freeze',
    question: 'What does this log?',
    code: `const obj = Object.freeze({ count: 1, nested: { value: 1 } });
obj.count = 2;
obj.nested.value = 2;
console.log(obj.count, obj.nested.value);`,
    options: ['1 1', '2 2', '1 2', '2 1'],
    correctIndex: 2,
    explanation: '`Object.freeze` is shallow — it prevents reassigning `count` (silently fails, or throws in strict mode) but does not freeze `nested`, so `nested.value` can still change.',
    category: 'Objects'
  },
  {
    id: 'js-q-code-promise-chain',
    question: 'What does this log?',
    code: `Promise.resolve(1)
  .then((v) => v + 1)
  .then((v) => {
    throw new Error('fail');
  })
  .catch(() => 10)
  .then((v) => console.log(v));`,
    options: ['1', '2', '10', 'Error: fail (uncaught)'],
    correctIndex: 2,
    explanation: 'The thrown error skips straight to `.catch`, which recovers by returning `10`, so the final `.then` receives `10`.',
    category: 'Async'
  },
  {
    id: 'js-q-code-array-sort',
    question: 'What does this log?',
    code: `console.log([10, 1, 21, 2].sort());`,
    options: ['[1, 2, 10, 21]', '[1, 2, 21, 10]', '[10, 1, 21, 2]', '[1, 10, 2, 21]'],
    correctIndex: 3,
    explanation: 'Without a compare function, `sort` converts elements to strings and sorts lexicographically — `"10"` sorts before `"2"`.',
    category: 'Arrays'
  },
  {
    id: 'js-q-immediately-invoked',
    question: 'What is the primary purpose of an IIFE (Immediately Invoked Function Expression)?',
    options: [
      'To improve loop performance',
      'To create a private scope that runs immediately without polluting the outer scope',
      'To declare a function that can be hoisted',
      'To force synchronous execution of async code'
    ],
    correctIndex: 1,
    explanation: 'IIFEs execute right away and keep their internals out of the enclosing scope — a common pre-module pattern for avoiding global namespace pollution.',
    category: 'Patterns'
  },
  {
    id: 'js-q-code-destructure-default',
    question: 'What does this log?',
    code: `const { a, b = 5 } = { a: 1 };
const [x, y = 10] = [1];
console.log(a, b, x, y);`,
    options: ['1 5 1 10', '1 undefined 1 undefined', '1 5 1 undefined', 'ReferenceError'],
    correctIndex: 0,
    explanation: 'Destructuring defaults apply whenever the extracted value is `undefined`, for both object and array patterns.',
    category: 'Destructuring'
  },
  {
    id: 'js-q-weakmap',
    question: 'The main reason to use a `WeakMap` over a `Map` for caching data keyed by objects is:',
    options: [
      'WeakMap is faster for all operations',
      'WeakMap keys can be garbage-collected once no other reference to the key exists, avoiding memory leaks',
      'WeakMap supports primitive keys and Map does not',
      'WeakMap preserves insertion order and Map does not'
    ],
    correctIndex: 1,
    explanation: 'WeakMap holds its keys weakly — entries are automatically cleaned up once the key object is no longer referenced elsewhere, which a Map (or plain object) would keep alive forever.',
    category: 'Data structures'
  },
  {
    id: 'js-q-code-tagged-template',
    question: 'What does calling `tag` return here?',
    code: `function tag(strings, ...values) {
  return strings.length;
}
const name = 'JS';
tag\`Hello \${name}!\`;`,
    options: ['1', '2', '3', '0'],
    correctIndex: 1,
    explanation: 'A tagged template splits the literal into the static string parts around each interpolation — one value in the middle means 2 string segments ("Hello " and "!").',
    category: 'Functions'
  },
  {
    id: 'js-q-code-array-flat',
    question: 'What does this log?',
    code: `console.log([1, [2, [3, [4]]]].flat(2));`,
    options: ['[1, 2, 3, [4]]', '[1, 2, 3, 4]', '[1, [2, [3, [4]]]]', '[1, 2, [3, 4]]'],
    correctIndex: 0,
    explanation: '`flat(2)` flattens two levels deep — the innermost `[4]` is 3 levels down, so it stays nested.',
    category: 'Arrays'
  },
  {
    id: 'js-q-symbol',
    question: 'A `Symbol` is primarily used for:',
    options: [
      'Creating unique, collision-free property keys',
      'Formatting numbers as strings',
      'Declaring constants that never change',
      'Improving array iteration performance'
    ],
    correctIndex: 0,
    explanation: 'Every `Symbol()` call produces a unique value, useful for object keys that should never accidentally collide with string keys.',
    category: 'Core'
  },
  {
    id: 'js-q-code-currying',
    question: 'What does this log?',
    code: `const add = (a) => (b) => a + b;
const add5 = add(5);
console.log(add5(3));`,
    options: ['8', 'undefined', 'A function definition', 'TypeError'],
    correctIndex: 0,
    explanation: 'Each arrow returns another function, closing over its argument — `add(5)` returns a function that adds 5, so `add5(3)` is `8`.',
    category: 'Functions'
  },
  {
    id: 'js-q-microtask-vs-macrotask',
    question: 'Which of these is a microtask (not a macrotask) in the JS event loop?',
    options: ['setTimeout callback', 'A resolved Promise .then() callback', 'setInterval callback', 'A UI event handler'],
    correctIndex: 1,
    explanation: 'Promise callbacks (and queueMicrotask) are microtasks — they all drain before the next macrotask (timers, I/O, UI events) runs.',
    category: 'Async'
  },
  {
    id: 'js-q-code-array-reduce',
    question: 'What does this log?',
    code: `const result = [1, 2, 3, 4].reduce((acc, cur) => {
  acc[cur % 2 === 0 ? 'even' : 'odd'].push(cur);
  return acc;
}, { even: [], odd: [] });
console.log(result);`,
    options: ['{ even: [2, 4], odd: [1, 3] }', '{ even: [1, 3], odd: [2, 4] }', '[2, 4, 1, 3]', 'TypeError'],
    correctIndex: 0,
    explanation: 'The accumulator starts as `{ even: [], odd: [] }` and each element is pushed into the matching bucket based on its parity.',
    category: 'Arrays'
  }
];
