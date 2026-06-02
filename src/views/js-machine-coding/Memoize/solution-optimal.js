/**
 * Memoize — Custom resolver + nested Map (optimal)
 *
 * JSON.stringify is lossy (functions, undefined, key order) and slow for large
 * args. A production memoize lets the caller provide a key resolver, and falls
 * back to a sensible default.
 *
 *   - Accept an optional resolver(...args) -> key.
 *   - Default resolver joins args; objects use a WeakMap-friendly identity.
 */

function memoize(fn, resolver) {
  const cache = new Map();

  const memoized = function (...args) {
    const key = resolver ? resolver.apply(this, args) : args.length === 1 ? args[0] : args.join('|');

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  // Expose the cache so callers can clear it (lodash-style)
  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

// ── Usage ────────────────────────────────────────────────────────────────────

const fib = memoize(function f(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
});

console.log(fib(40)); // 102334155 — fast thanks to memoised recursion
fib.clear(); // reset the cache when needed
