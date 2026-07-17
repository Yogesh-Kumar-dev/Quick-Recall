/**
 * Promise.allSettled — reusing Promise.all
 *
 * Trick: Promise.all only fails if something rejects. So wrap each promise
 * to CATCH its own rejection and return a report object instead — now
 * nothing can reject, and Promise.all does the waiting for free.
 */
function promiseAllSettled(promises) {
  const wrapped = promises.map(function (p) {
    return Promise.resolve(p).then(
      (value) => ({ status: 'fulfilled', value }),
      (reason) => ({ status: 'rejected', reason })
    );
  });
  return Promise.all(wrapped);
}

// ── Usage ────────────────────────────────────────────────────────────────────

promiseAllSettled([fetch('/api/a'), fetch('/bad-url'), Promise.resolve('cached')]).then((results) => {
  const ok = results.filter((r) => r.status === 'fulfilled');
  const failed = results.filter((r) => r.status === 'rejected');
  console.log(`${ok.length} succeeded, ${failed.length} failed`);
});
