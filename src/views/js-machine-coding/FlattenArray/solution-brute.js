/**
 * Flatten Nested Array — Brute Force (while-loop + concat)
 *
 * Classic approach: repeatedly concat the array with itself until
 * no nested arrays remain. Simple to explain but inefficient for
 * deeply nested structures.
 */

function flattenBrute(arr) {
  // Keep flattening one level at a time until nothing is nested
  let result = arr;

  while (result.some(Array.isArray)) {
    result = [].concat(...result);
    // [].concat(...[1, [2, [3]]]) → [1, 2, [3]] — one level at a time
  }

  return result;
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(flattenBrute([1, [2, [3, [4]], 5]]));
// → [1, 2, 3, 4, 5]

console.log(flattenBrute([1, [2, 3], [4, [5, 6]]]));
// → [1, 2, 3, 4, 5, 6]

console.log(flattenBrute([]));
// → []

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n × d) where n = total elements, d = max nesting depth
// Space: O(n × d) — intermediate arrays created per while iteration
// Issue: creates O(d) intermediate arrays; very slow for deep nesting
