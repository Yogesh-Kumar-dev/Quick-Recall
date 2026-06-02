/**
 * Promise.all — Iterable-safe with async/await (optimal)
 *
 * Improvements over the basic version:
 *   - Accepts any iterable (not just arrays) by spreading into an array.
 *   - Uses async/await for readability while still preserving order and
 *     fail-fast semantics.
 *
 * Note: the first rejection wins; later results are ignored.
 */

function promiseAll(iterable) {
  const promises = Array.from(iterable);

  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let pending = promises.length;

    if (pending === 0) {
      resolve(results);
      return;
    }

    promises.forEach(async (p, i) => {
      try {
        results[i] = await p; // await works on values and thenables alike
        if (--pending === 0) resolve(results);
      } catch (err) {
        reject(err); // fail-fast on first rejection
      }
    });
  });
}

// ── Usage ────────────────────────────────────────────────────────────────────

const delay = (v, ms) => new Promise((res) => setTimeout(() => res(v), ms));

promiseAll([delay('a', 30), delay('b', 10), delay('c', 20)]).then((res) => console.log(res)); // ['a', 'b', 'c'] — order preserved
