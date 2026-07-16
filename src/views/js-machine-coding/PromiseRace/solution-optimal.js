/**
 * Promise.race — settle with whichever promise settles FIRST (win or lose).
 *
 * Key insight: a promise can only settle once. So just forward every
 * input's result to the same resolve/reject pair — the first one wins,
 * the rest are ignored automatically.
 */
function promiseRace(promises) {
  return new Promise(function (resolve, reject) {
    for (const p of promises) {
      // Promise.resolve() wraps plain values so p.then always exists
      Promise.resolve(p).then(resolve, reject);
    }
  });
}

// ── Usage ────────────────────────────────────────────────────────────────────

const slow = new Promise((res) => setTimeout(() => res('slow'), 500));
const fast = new Promise((res) => setTimeout(() => res('fast'), 100));

promiseRace([slow, fast]).then((winner) => console.log(winner)); // 'fast'

// Classic interview use case: a timeout guard around a fetch
const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Timed out')), 3000));
promiseRace([fetch('/api/data'), timeout]).catch((err) => console.log(err.message));
