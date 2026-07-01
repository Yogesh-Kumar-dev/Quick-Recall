/**
 * Curry — Infinite / Placeholder support (optimal)
 *
 * A production-grade curry like lodash's _.curry:
 *   - Supports a placeholder (_) so arguments can be supplied out of order.
 *   - Still respects fn.length to decide when to invoke.
 *
 * A "real" argument fills the next empty slot; a placeholder reserves a slot
 * to be filled by a later call.
 */

const _ = Symbol('placeholder');
curry.placeholder = _;

function curry(fn) {
  return function curried(...args) {
    // Count only the non-placeholder args toward completion
    const complete = args.length >= fn.length && !args.slice(0, fn.length).includes(_);

    if (complete) {
      return fn.apply(this, args);
    }

    return function (...next) {
      // Merge: fill any placeholders in `args` with values from `next`, then append the rest
      const merged = args.map((arg) => (arg === _ && next.length ? next.shift() : arg));
      return curried.apply(this, merged.concat(next));
    };
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);
const _p = curry.placeholder;

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(_p, 2)(1)(3)); // 6 — placeholder filled later
console.log(curriedSum(_p, _p, 3)(1)(2)); // 6
