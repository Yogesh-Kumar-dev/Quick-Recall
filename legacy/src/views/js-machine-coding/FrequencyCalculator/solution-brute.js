/**
 * Frequency Calculator — Brute Force (nested loop)
 *
 * For every item, scan the whole array to count its occurrences, then track
 * the running most/least. Works, but the inner scan makes it O(n²) and it
 * re-counts items it has already seen.
 */

function frequency(items) {
  const counts = {};

  for (const item of items) {
    let count = 0;
    for (const other of items) {
      if (other === item) count += 1; // re-scans the whole array each time
    }
    counts[item] = count;
  }

  let mostRepeated = null;
  let leastRepeated = null;

  for (const item of items) {
    if (mostRepeated === null || counts[item] > counts[mostRepeated]) mostRepeated = item;
    if (leastRepeated === null || counts[item] < counts[leastRepeated]) leastRepeated = item;
  }

  return { frequency: counts, mostRepeated, leastRepeated };
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(frequency(['react', 'js', 'html', 'react', 'js', 'next', 'html', 'react']));
// → { frequency: { react: 3, js: 2, html: 2, next: 1 },
//     mostRepeated: 'react', leastRepeated: 'next' }

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n²) — inner scan per element
// Space: O(k) — k = number of distinct items
