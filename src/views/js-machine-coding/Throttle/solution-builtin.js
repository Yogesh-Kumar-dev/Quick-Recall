/**
 * Throttle — setTimeout flag version (ES6 one-liner style)
 *
 * Instead of comparing timestamps, use a boolean "cooldown" flag toggled by a
 * timer. Simple and very common in blog posts.
 *
 *   - If not in cooldown, run fn and enter cooldown.
 *   - A timer clears the cooldown after `limit` ms.
 */

const throttle = (fn, limit) => {
  let inCooldown = false;

  return (...args) => {
    if (inCooldown) return;

    fn(...args);
    inCooldown = true;
    setTimeout(() => {
      inCooldown = false;
    }, limit);
  };
};

// ── Usage ────────────────────────────────────────────────────────────────────

const log = throttle((msg) => console.log(msg), 500);

log('a'); // runs
log('b'); // ignored (cooldown)
setTimeout(() => log('c'), 600); // runs after cooldown clears
