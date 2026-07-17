/**
 * Promise.allSettled — Counter approach
 *
 * Wait for EVERY promise to finish (never rejects), reporting each one as
 * { status: 'fulfilled', value } or { status: 'rejected', reason }.
 *
 * Same skeleton as Promise.all: fill results by index, count completions,
 * resolve when the counter hits the total. The only difference: rejections
 * are recorded instead of failing the whole thing.
 */
function promiseAllSettled(promises) {
  return new Promise(function (resolve) {
    const results = [];
    let settledCount = 0;
    const total = promises.length;

    if (total === 0) {
      resolve([]);
      return;
    }

    promises.forEach(function (p, index) {
      Promise.resolve(p).then(
        function (value) {
          results[index] = { status: 'fulfilled', value };
          settledCount += 1;
          if (settledCount === total) resolve(results);
        },
        function (reason) {
          results[index] = { status: 'rejected', reason };
          settledCount += 1;
          if (settledCount === total) resolve(results);
        }
      );
    });
  });
}

// ── Usage ────────────────────────────────────────────────────────────────────

promiseAllSettled([Promise.resolve(1), Promise.reject(new Error('boom')), 3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected',  reason: Error('boom') },
  //   { status: 'fulfilled', value: 3 }
  // ]
});
