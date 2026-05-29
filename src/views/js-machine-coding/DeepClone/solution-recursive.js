/**
 * Deep Clone — Recursive (handles most types)
 *
 * Handles: plain objects, arrays, Date, RegExp, null, primitives.
 * Does NOT handle: Functions, Map, Set, WeakMap, circular references.
 * The standard "medium difficulty" interview answer.
 */

function deepClone(value) {
  // Primitives and null — return as-is (already immutable)
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Date — create new Date with same timestamp
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // RegExp — create new RegExp with same source and flags
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // Array — map each element recursively
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  // Plain object — clone each own enumerable property
  const cloned = Object.create(Object.getPrototypeOf(value));
  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key]);
  }
  return cloned;
}

// ── Examples ─────────────────────────────────────────────────────────────────

const original = {
  name: 'Alice',
  dob: new Date('1995-01-01'),
  pattern: /abc/gi,
  nested: { scores: [95, 88, 72] }
};

const clone = deepClone(original);
clone.nested.scores.push(100);
clone.dob.setFullYear(2000);

console.log(original.nested.scores); // [95, 88, 72] — unchanged ✓
console.log(original.dob.getFullYear()); // 1995 — unchanged ✓

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n) — every node in the object tree visited once
// Space: O(n) — new tree of same size + O(d) call stack
