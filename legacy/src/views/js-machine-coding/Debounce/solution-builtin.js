/**
 * Debounce — Modern / One-liner Style
 *
 * A concise ES6 arrow-function version — the most common form seen in
 * blog posts and quick interview answers.
 *
 * Limitations vs the optimal version:
 *   - No leading edge support
 *   - No cancel / flush helpers
 *   - Arrow function means 'this' is lexical (fine for most React/module code)
 */

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ── Usage ────────────────────────────────────────────────────────────────────

const search = debounce((query) => console.log('Fetch:', query), 300);
window.addEventListener('input', (e) => search(e.target.value));

// ── Interview talking point ───────────────────────────────────────────────────
// This is the version to reach for first when asked "implement debounce".
// Then offer to extend it with cancel() / flush() / leading edge if asked.
