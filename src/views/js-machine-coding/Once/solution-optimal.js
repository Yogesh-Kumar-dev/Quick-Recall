/**
 * once(fn) — the function runs a single time; every later call
 * returns the FIRST result without calling fn again.
 *
 * Pure closure question: two captured variables and a guard.
 */
function once(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // preserve `this` for method usage
    }
    return result;
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

const init = once((config) => {
  console.log('initializing with', config);
  return { ready: true };
});

const a = init({ env: 'prod' }); // logs once → { ready: true }
const b = init({ env: 'dev' }); // no log — first result returned
console.log(a === b); // true — the exact same object

// Why a `called` flag instead of checking result === undefined?
// Because fn might legitimately RETURN undefined — the flag is unambiguous.
