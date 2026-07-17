/**
 * Chunk an Array — slice by stride
 *
 * Jump the start index in steps of `size` and slice out each window.
 * slice clamps past the end, so the last partial chunk is free.
 */
function chunk(array, size) {
  if (size < 1) return [];

  const result = [];
  for (let start = 0; start < array.length; start += size) {
    result.push(array.slice(start, start + size));
  }
  return result;
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]

// Real-world: paginate a list client-side
const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const pages = chunk(items, 3);
console.log(pages[1]); // ['d', 'e', 'f'] — page 2
