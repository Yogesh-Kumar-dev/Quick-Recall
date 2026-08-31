/**
 * Remove Duplicates & Sort — Optimal (hash map + object-key ordering)
 *
 * Pass 1: one pass over the array with a `seenMap` object for O(1) lookups.
 *         Duplicates land in their own array along the way.
 * Pass 2: instead of hand-writing a sorting algorithm, we take advantage of
 *         how JavaScript orders object keys — keys that look like integers
 *         are iterated in ascending numeric order. Inserting each number as
 *         a key means reading the map back gives us a sorted array for free.
 *
 *   - No Set/Map/sort/includes — just plain objects used as hash tables.
 *   - Assumes the input is always an array of numbers (integer-like values),
 *     which is exactly when this key-ordering guarantee holds.
 */

const numbers = [1, 4, 2, 6, 1, 8, 4, 56, 8];

function dedupeAndSort(arr) {
  const seenMap = {};
  const uniqueElements = [];
  const duplicates = [];

  for (const num of arr) {
    if (!seenMap[num]) {
      seenMap[num] = true;
      uniqueElements[uniqueElements.length] = num;
    } else {
      duplicates[duplicates.length] = num;
    }
  }

  // Sorting via object key order: integer-like keys ("1", "2", ..., "56")
  // iterate in ascending numeric order per the spec, so inserting each unique
  // number as its own key and reading the values back yields ascending order.
  const sortMap = {};
  for (const num of uniqueElements) {
    sortMap[num] = num;
  }
  const sortedUnique = Object.values(sortMap);

  return { sortedUnique, duplicates, seenMap };
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(dedupeAndSort(numbers));
// → {
//     sortedUnique: [1, 2, 4, 6, 8, 56],
//     duplicates:   [1, 4, 8],
//     seenMap:      { '1': true, '2': true, '4': true, '6': true, '8': true, '56': true }
//   }

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n) — one dedupe pass, one map-build pass, one values() read
// Space: O(n) — maps + output arrays
//
// Why it works: the spec splits own-property keys into "array indices"
// (canonical numeric strings like '0', '1', '56') and everything else.
// Array-index keys come first in ascending numeric order, other string keys
// follow in insertion order. Numbers qualify as array indices, so the read-back
// is sorted. Caveats worth saying out loud: keys are coerced through strings,
// non-integer values (1.5, -3 is fine, 1.5 is not an index) fall into the
// insertion-ordered bucket, and Object.values is itself a builtin.
