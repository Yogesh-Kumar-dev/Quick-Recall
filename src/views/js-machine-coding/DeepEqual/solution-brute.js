/**
 * Deep Equal — JSON.stringify comparison
 *
 * The 1-line answer. Offer it FIRST, then immediately name its failures —
 * that combination (fast answer + known limits) is what scores points.
 */
function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ── Usage & where it breaks ──────────────────────────────────────────────────

console.log(deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })); // true

// Failure 1: key order matters to stringify, not to equality
console.log(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })); // false — WRONG

// Failure 2: undefined values are dropped
console.log(deepEqual({ a: undefined }, {})); // true — arguably wrong

// Failure 3: NaN, Date, RegExp, functions, circular refs all misbehave
console.log(deepEqual(NaN, NaN)); // true, but only by accident (both 'null')
