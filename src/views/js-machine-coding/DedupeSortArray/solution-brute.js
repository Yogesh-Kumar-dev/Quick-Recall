/**
 * Remove Duplicates & Sort — Brute Force (no builtin methods)
 *
 * Dedupe with a nested loop (manually scan the result for each number),
 * then sort with bubble sort (adjacent swaps until no swaps remain).
 *
 *   - No Set, no Map, no .sort(), no .indexOf(), no .includes().
 *   - Only plain loops, comparisons and array indexing (for storing results).
 */

const numbers = [1, 4, 2, 6, 1, 8, 4, 56, 8];

function dedupe(arr) {
  const unique = [];

  for (const num of arr) {
    let seen = false;
    // manually scan what we have collected so far
    for (const u of unique) {
      if (u === num) {
        seen = true;
        break;
      }
    }
    if (!seen) unique[unique.length] = num;
  }

  return unique;
}

function bubbleSort(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) out[i] = arr[i]; // copy so the input stays untouched

  for (let i = 0; i < out.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < out.length - 1 - i; j++) {
      if (out[j] > out[j + 1]) {
        const tmp = out[j];
        out[j] = out[j + 1];
        out[j + 1] = tmp;
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted — early exit
  }

  return out;
}

function dedupeAndSort(arr) {
  return bubbleSort(dedupe(arr));
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(dedupeAndSort(numbers));
// → [1, 2, 4, 6, 8, 56]

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n²) + O(m²) — nested-loop dedupe, then bubble sort on m unique items
// Space: O(m) — m = number of unique elements
