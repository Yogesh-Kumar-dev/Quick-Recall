/**
 * Debounce — Optimal / Production-Grade
 *
 * Adds three real-world features interviewers love:
 *   1. Leading edge option  — fire IMMEDIATELY on the first call, then wait
 *   2. cancel()             — abort any pending invocation
 *   3. flush()              — invoke immediately if a call is pending
 *
 * This mirrors the lodash _.debounce signature.
 */

function debounce(fn, delay, options = {}) {
  const { leading = false } = options;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;

  function invoke() {
    if (lastArgs) {
      fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const isFirstCall = leading && timerId === null;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!leading) invoke(); // trailing edge (default)
    }, delay);

    if (isFirstCall) invoke(); // leading edge
  }

  // Cancel any pending invocation
  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
  };

  // Immediately invoke if pending
  debounced.flush = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
      invoke();
    }
  };

  return debounced;
}

// ── Usage ────────────────────────────────────────────────────────────────────

// Trailing (default) — fires after the burst ends
const onSearch = debounce((q) => console.log('search:', q), 300);
onSearch('a');
onSearch('ab');
onSearch('abc'); // fires once with 'abc'

// Leading — fires immediately, then ignores calls until delay expires
const onButtonClick = debounce(() => console.log('clicked!'), 1000, { leading: true });
onButtonClick(); // fires immediately
onButtonClick(); // ignored (within 1 s)

// Cancel / flush
const expensiveOp = debounce(() => console.log('expensive'), 500);
expensiveOp();
expensiveOp.cancel(); // never runs
