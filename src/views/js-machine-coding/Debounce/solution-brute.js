/**
 * Debounce — Brute Force (with explicit timeout handle)
 *
 * Most straightforward reading of the spec:
 *   - Store the timer ID in a variable.
 *   - On every call, clear any existing timer, then schedule a new one.
 *   - When the timer fires, invoke the original function with the latest args.
 */

function debounce(fn, delay) {
  let timerId = null; // holds the current scheduled timer

  return function (...args) {
    // Cancel the previously scheduled call (if any)
    if (timerId !== null) {
      clearTimeout(timerId);
    }

    // Schedule the function to run after 'delay' ms of silence
    timerId = setTimeout(function () {
      timerId = null;      // reset so we know no timer is pending
      fn.apply(this, args); // preserve original 'this' and arguments
    }, delay);
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

const handleSearch = debounce(function (query) {
  console.log('Searching for:', query);
}, 300);

// Simulating rapid keystrokes — only the last one fires after 300 ms
handleSearch('h');
handleSearch('he');
handleSearch('hel');
handleSearch('hell');
handleSearch('hello'); // <-- only this fires, 300 ms after it's called
