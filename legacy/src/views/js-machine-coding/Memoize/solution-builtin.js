/**
 * Memoize — Single-arg cache (ES6 one-liner style)
 *
 * For the common case of a pure unary function, a tiny memoizer reads cleanly.
 * Uses Object.prototype.hasOwnProperty.call to safely detect cached keys
 * (avoids inherited-property false positives).
 */

const memoize = (fn) => {
  const cache = {};

  return (arg) => {
    if (!Object.prototype.hasOwnProperty.call(cache, arg)) {
      cache[arg] = fn(arg);
    }
    return cache[arg];
  };
};

// ── Usage ────────────────────────────────────────────────────────────────────

const factorial = memoize((n) => {
  let acc = 1;
  for (let i = 2; i <= n; i++) acc *= i;
  return acc;
});

console.log(factorial(5)); // 120 (computed)
console.log(factorial(5)); // 120 (cached)
