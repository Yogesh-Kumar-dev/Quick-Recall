/**
 * Function.prototype.bind — Core polyfill (brute force)
 *
 * bind returns a new function with `this` permanently set to the given context,
 * supporting partial application of leading arguments.
 *
 *   - Capture the original function (this inside myBind).
 *   - Return a function that calls the original with the bound context and
 *     the concatenation of preset + later args.
 */

Function.prototype.myBind = function (context, ...presetArgs) {
  const fn = this; // the function bind was called on

  return function (...laterArgs) {
    return fn.apply(context, [...presetArgs, ...laterArgs]);
  };
};

// ── Usage ────────────────────────────────────────────────────────────────────

const person = { name: 'Ada' };

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const greetAda = greet.myBind(person, 'Hello');
console.log(greetAda('!')); // "Hello, Ada!"
