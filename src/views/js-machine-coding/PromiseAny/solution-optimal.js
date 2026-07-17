/**
 * Promise.any — resolve with the FIRST fulfilled promise.
 * Reject only if ALL of them reject (with an AggregateError).
 *
 * Mirror image of Promise.all: all shares one failure path,
 * any shares one success path and counts failures.
 */
function promiseAny(promises) {
  return new Promise(function (resolve, reject) {
    const errors = [];
    let rejectedCount = 0;
    let total = 0;

    for (const p of promises) {
      const index = total; // lock the slot for this promise's error
      total += 1;

      Promise.resolve(p).then(resolve, function (err) {
        errors[index] = err; // keep errors in input order
        rejectedCount += 1;
        if (rejectedCount === total) {
          reject(new AggregateError(errors, 'All promises were rejected'));
        }
      });
    }

    // Edge case: empty input rejects immediately
    if (total === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
    }
  });
}

// ── Usage ────────────────────────────────────────────────────────────────────

const fail = Promise.reject(new Error('nope'));
const slowOk = new Promise((res) => setTimeout(() => res('slow ok'), 200));

promiseAny([fail, slowOk]).then((v) => console.log(v)); // 'slow ok'

promiseAny([Promise.reject(new Error('a')), Promise.reject(new Error('b'))]).catch((err) => {
  console.log(err instanceof AggregateError); // true
  console.log(err.errors.map((e) => e.message)); // ['a', 'b']
});
