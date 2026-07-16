/**
 * Deep Equal — recursive structural comparison
 *
 * Three-step shape: (1) primitives / same reference, (2) type mismatches,
 * (3) recurse over keys. Object.is handles NaN === NaN correctly.
 */
function deepEqual(a, b) {
  // Same reference or equal primitives (Object.is: NaN equals NaN, +0 !== -0)
  if (Object.is(a, b)) return true;

  // Past this point both must be non-null objects
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  // Array vs plain object mismatch
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  // Every key in a must exist in b with a deep-equal value
  return keysA.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })); // true — key order irrelevant
console.log(deepEqual([1, [2, 3]], [1, [2, 3]])); // true
console.log(deepEqual({ a: NaN }, { a: NaN })); // true — thanks to Object.is
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 })); // false — extra key
console.log(deepEqual([1, 2], { 0: 1, 1: 2 })); // false — array vs object
