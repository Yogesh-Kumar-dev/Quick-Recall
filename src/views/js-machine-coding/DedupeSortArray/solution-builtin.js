/**
 * Remove Duplicates & Sort — Built-in reference
 *
 * What the interviewer expects you to say AFTER you have shown the manual
 * version: "in real code I would just use a Set and sort()".
 */

const numbers = [1, 4, 2, 6, 1, 8, 4, 56, 8];

function dedupeAndSort(arr) {
  return [...new Set(arr)].sort((a, b) => a - b);
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(dedupeAndSort(numbers));
// → [1, 2, 4, 6, 8, 56]

// ── Notes ─────────────────────────────────────────────────────────────────────
// - Set preserves first-insertion order, so deduping before sorting keeps the
//   result deterministic.
// - The (a, b) => a - b comparator matters: a bare sort() compares as STRINGS,
//   putting 10 before 2.
// - If duplicates must also be reported (like the manual version), diff the
//   counts or walk the original array against the Set afterwards.
