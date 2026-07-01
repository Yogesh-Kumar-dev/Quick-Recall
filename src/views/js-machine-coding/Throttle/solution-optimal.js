/**
 * Throttle — Leading + Trailing edge (optimal / production)
 *
 * The timestamp-only version drops the final call if it lands inside the
 * cooldown window. Production throttle (like lodash _.throttle) also fires a
 * trailing call with the latest arguments after the window elapses.
 *
 *   - Leading edge: fire immediately on the first call.
 *   - Trailing edge: schedule one final call with the most recent args.
 */

function throttle(fn, limit) {
  let lastCall = 0;
  let timer = null;
  let lastArgs = null;

  return function (...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);
    lastArgs = args;

    if (remaining <= 0) {
      // Outside the window — run immediately (leading edge)
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timer) {
      // Inside the window — schedule a trailing call with the latest args
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn.apply(this, lastArgs);
      }, remaining);
    }
  };
}

// ── Usage ────────────────────────────────────────────────────────────────────

const onResize = throttle((w) => console.log('width:', w), 200);

onResize(100); // runs immediately (leading)
onResize(150); // scheduled as trailing
onResize(200); // updates trailing args -> 200 fires after 200 ms
