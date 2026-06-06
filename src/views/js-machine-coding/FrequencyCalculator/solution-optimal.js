/**
 * Frequency Calculator — Optimal (single-pass Map)
 *
 * Count every item in one pass with a Map, then make one more pass over the
 * distinct entries to find the most and least repeated. First-seen wins ties.
 *
 * The interview-preferred answer: O(n), and a Map handles any string/number
 * key cleanly (no prototype-key pitfalls like a plain object has).
 */

function frequency(items) {
  const counts = new Map();

  // Pass 1 — tally occurrences
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  // Pass 2 — find extremes (first-seen wins a tie)
  let mostRepeated = null;
  let leastRepeated = null;
  let max = -Infinity;
  let min = Infinity;

  for (const [item, count] of counts) {
    if (count > max) {
      max = count;
      mostRepeated = item;
    }
    if (count < min) {
      min = count;
      leastRepeated = item;
    }
  }

  return { frequency: Object.fromEntries(counts), mostRepeated, leastRepeated };
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(frequency(['react', 'js', 'html', 'react', 'js', 'next', 'html', 'react']));
// → { frequency: { react: 3, js: 2, html: 2, next: 1 },
//     mostRepeated: 'react', leastRepeated: 'next' }

console.log(frequency(['a']));
// → { frequency: { a: 1 }, mostRepeated: 'a', leastRepeated: 'a' }

console.log(frequency([]));
// → { frequency: {}, mostRepeated: null, leastRepeated: null }

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n) — one pass to count + one pass over k distinct items (k ≤ n)
// Space: O(k)
