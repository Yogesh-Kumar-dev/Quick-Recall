/**
 * Curry — Fixed Arity (brute force)
 *
 * curry(fn) returns a function that collects arguments until it has received
 * as many as the original function declares (fn.length). Once enough args are
 * gathered, it invokes the original function with all of them.
 *
 *   - Keep accumulating args across calls via closure.
 *   - When collected args >= fn.length, call fn.
 *   - Otherwise return a new collector function.
 */

function curry(fn) {
  return function curried(...args) {
    // Enough arguments collected — invoke the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    // Not enough yet — return a function that appends the next args
    return function (...next) {
      return curried.apply(this, args.concat(next));
    };
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
console.log(curriedSum(1, 2, 3)); // 6
