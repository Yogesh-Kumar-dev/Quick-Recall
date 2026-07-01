/**
 * Deep Clone — Built-in Methods (Modern JS)
 *
 * Three native options with different trade-offs.
 * Always mention structuredClone first — it's the correct modern answer.
 */

// ── Option 1: structuredClone (Node 17+, all modern browsers, 2022) ───────────

const obj = {
  name: 'Alice',
  dob: new Date('1995-01-01'),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  nested: { scores: [95, 88] }
};

const clone1 = structuredClone(obj);
clone1.nested.scores.push(100);
console.log(obj.nested.scores); // [95, 88] — deep clone ✓
console.log(clone1.dob instanceof Date); // true ✓
// Handles: Date, RegExp, Map, Set, ArrayBuffer, circular references

// ── Option 2: Object.assign (SHALLOW copy only — common mistake!) ─────────────

const shallowCopy = Object.assign({}, obj);
// ⚠️ nested objects are still SHARED — not a deep clone!

// ── Option 3: Spread operator (SHALLOW copy only) ────────────────────────────

const spreadCopy = { ...obj };
// ⚠️ Also shallow — nested.scores is still the same reference

// ── Summary ───────────────────────────────────────────────────────────────────
// structuredClone ✓   — deep clone, handles most built-in types, circular refs
// JSON round-trip ✓   — simple, but loses Date/Map/Set/RegExp/functions/undefined
// Recursive clone ✓   — full control, handles custom types
// Object.assign  ✗   — SHALLOW only
// Spread { ...x }  ✗   — SHALLOW only

console.log('structuredClone result:', structuredClone({ a: { b: 1 } }));
