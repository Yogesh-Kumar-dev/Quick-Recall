/**
 * Promise.all — Native + related combinators (built-in)
 *
 * The real Promise.all is built in. Know its siblings and how they differ —
 * a very common interview follow-up.
 *
 *   Promise.all         -> all succeed, or reject on first failure
 *   Promise.allSettled  -> never rejects; reports every outcome
 *   Promise.race        -> settles with the first promise to settle
 *   Promise.any         -> first to FULFILL; rejects only if all reject
 */

async function demo() {
  const ok = [Promise.resolve(1), Promise.resolve(2)];
  const mixed = [Promise.resolve(1), Promise.reject('x')];

  console.log(await Promise.all(ok)); // [1, 2]

  console.log(await Promise.allSettled(mixed));
  // [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'x' }]

  console.log(await Promise.race(mixed).catch((e) => `race rejected: ${e}`));
  // 1  (the resolved one wins here because it settles first)

  console.log(await Promise.any(mixed)); // 1  (first fulfilment)
}

demo();
