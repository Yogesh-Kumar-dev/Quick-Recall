/**
 * pipe / compose — explicit loop
 *
 * pipe(f, g, h)(x)    = h(g(f(x)))  — left to right
 * compose(f, g, h)(x) = f(g(h(x)))  — right to left
 * Same machine, opposite direction.
 */
function pipe(...fns) {
  return function (input) {
    let result = input;
    for (const fn of fns) {
      result = fn(result);
    }
    return result;
  };
}

function compose(...fns) {
  return function (input) {
    let result = input;
    for (let i = fns.length - 1; i >= 0; i--) {
      result = fns[i](result);
    }
    return result;
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

const double = (x) => x * 2;
const addTen = (x) => x + 10;
const square = (x) => x * x;

console.log(pipe(double, addTen, square)(3)); // square(addTen(double(3))) = 256
console.log(compose(double, addTen, square)(3)); // double(addTen(square(3))) = 38
