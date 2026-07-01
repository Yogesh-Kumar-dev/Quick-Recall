/**
 * Function.prototype.bind — new-safe polyfill (optimal)
 *
 * The spec says: when a bound function is used as a constructor (with `new`),
 * the bound `this` is IGNORED and the newly created instance is used instead,
 * while the prototype chain is preserved.
 *
 * This version handles that edge case correctly.
 */

Function.prototype.myBind = function (context, ...presetArgs) {
  const fn = this;

  function bound(...laterArgs) {
    // If called with `new`, `this` is an instance of `bound` — use it; ignore context
    const isNew = this instanceof bound;
    return fn.apply(isNew ? this : context, [...presetArgs, ...laterArgs]);
  }

  // Preserve the prototype chain so `new boundFn()` produces correct instances
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
  }

  return bound;
};

// ── Usage ────────────────────────────────────────────────────────────────────

function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function () {
  return `(${this.x}, ${this.y})`;
};

const BoundPoint = Point.myBind(null, 10); // preset x = 10
const p = new BoundPoint(20); // y = 20, `new` ignores the null context

console.log(p.toString()); // "(10, 20)"
console.log(p instanceof Point); // true — prototype chain preserved
