/**
 * Curry — Infinite Currying (ES6 one-liner style)
 *
 * A common interview variant: the curried function is called any number of
 * times and produces the result only when invoked with no arguments — or
 * coerced to a primitive. Useful when the arity is not fixed.
 *
 *   curriedSum(1)(2)(3)()   ->  6
 */

const curry = (fn) => {
  const helper = (...args) => {
    // Called with no args -> terminate and compute
    if (args.length === 0) {
      return 0;
    }
    return (...next) => (next.length === 0 ? args.reduce((a, b) => a + b, 0) : helper(...args, ...next));
  };
  return helper;
};

// ── Usage ────────────────────────────────────────────────────────────────────

const add = curry();

console.log(add(1)(2)(3)()); // 6
console.log(add(5)(10)(15)(20)()); // 50
console.log(add(1)(2)()); // 3
