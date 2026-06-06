/**
 * Frequency Calculator — Functional (reduce + entries)
 *
 * Build the frequency map with reduce, then derive the extremes with
 * Object.entries + reduce. Compact and side-effect-free.
 *
 * Note: a plain object is fine for string keys here, but Object keys are
 * always strings — use the Map version if keys might be numbers/objects.
 */

function frequency(items) {
  const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts);
  if (entries.length === 0) {
    return { frequency: counts, mostRepeated: null, leastRepeated: null };
  }

  const mostRepeated = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  const leastRepeated = entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];

  return { frequency: counts, mostRepeated, leastRepeated };
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(frequency(['react', 'js', 'html', 'react', 'js', 'next', 'html', 'react']));
// → { frequency: { react: 3, js: 2, html: 2, next: 1 },
//     mostRepeated: 'react', leastRepeated: 'next' }

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n)
// Space: O(k)
