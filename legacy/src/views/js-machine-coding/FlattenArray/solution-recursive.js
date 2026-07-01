/**
 * Flatten Nested Array — Recursive (with optional depth limit)
 *
 * The clearest and most interview-friendly solution.
 * Optionally accepts a depth parameter (mirrors Array.prototype.flat).
 */

function flatten(arr, depth = Infinity) {
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      // Recurse into nested array, reducing depth by 1
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }

  return result;
}

// ── Alternative: reduce-based recursive version ───────────────────────────────

function flattenReduce(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flattenReduce(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(flatten([1, [2, [3, [4]], 5]]));
// → [1, 2, 3, 4, 5]

console.log(flatten([1, [2, [3, [4]]]], 1));
// → [1, 2, [3, [4]]] — depth 1 only

console.log(flatten([1, [2, [3]]], 2));
// → [1, 2, 3]

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n) — each element visited once
// Space: O(n + d) — output array + call stack depth d
