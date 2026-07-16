/**
 * Chunk an Array — index loop
 *
 * Walk the array collecting `size` items at a time into a bucket;
 * push the bucket when full (or when input ends).
 */
function chunk(array, size) {
  if (size < 1) return [];

  const result = [];
  let bucket = [];

  for (const item of array) {
    bucket.push(item);
    if (bucket.length === size) {
      result.push(bucket);
      bucket = [];
    }
  }
  if (bucket.length > 0) result.push(bucket); // leftover partial chunk

  return result;
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log(chunk(['a', 'b', 'c'], 5)); // [['a', 'b', 'c']]
console.log(chunk([], 3)); // []
