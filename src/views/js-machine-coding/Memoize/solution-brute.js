/**
 * Memoize — JSON key cache (brute force)
 *
 * Cache results keyed by the function's arguments. On a repeat call with the
 * same args, return the cached value instead of recomputing.
 *
 *   - Build a cache key by serialising the arguments (JSON.stringify).
 *   - Look up the key; compute and store on a miss.
 */

function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key); // cache hit
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

let calls = 0;
const slowSquare = (n) => {
  calls++;
  return n * n;
};

const fastSquare = memoize(slowSquare);

console.log(fastSquare(4)); // 16  (computed)
console.log(fastSquare(4)); // 16  (cached)
console.log('actual computations:', calls); // 1
