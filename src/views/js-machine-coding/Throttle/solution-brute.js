/**
 * Throttle — Timestamp version (brute force)
 *
 * Throttle ensures fn runs at most once per `limit` milliseconds.
 *   - Record the time of the last invocation.
 *   - On each call, if enough time has passed, run fn and update the timestamp.
 *   - Otherwise ignore the call.
 *
 * This "leading edge" version fires immediately on the first call.
 */

function throttle(fn, limit) {
  let lastCall = 0; // timestamp of the last time fn ran

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
    // Within the cooldown window — ignore
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

const onScroll = throttle(() => {
  console.log('scroll handled at', Date.now());
}, 1000);

// Even if called on every scroll event, fn runs at most once per second
onScroll();
onScroll(); // ignored
onScroll(); // ignored
