/**
 * Promise.all — Core polyfill (brute force)
 *
 * Resolve with an array of results once every input promise resolves.
 * Reject as soon as any one of them rejects (fail-fast).
 *
 *   - Track a completed counter and a results array (preserving order).
 *   - Resolve when the counter hits the input length.
 *   - Reject on the first rejection.
 */

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((p, index) => {
      // Wrap non-promise values so .then works uniformly
      Promise.resolve(p).then((value) => {
        results[index] = value; // keep original order
        completed++;
        if (completed === promises.length) {
          resolve(results);
        }
      }, reject); // first rejection rejects the whole thing
    });
  });
}

// ── Usage ────────────────────────────────────────────────────────────────────

promiseAll([Promise.resolve(1), 2, Promise.resolve(3)]).then((res) => console.log(res)); // [1, 2, 3]

promiseAll([Promise.resolve(1), Promise.reject('boom')]).catch((err) => console.log('rejected:', err)); // rejected: boom
