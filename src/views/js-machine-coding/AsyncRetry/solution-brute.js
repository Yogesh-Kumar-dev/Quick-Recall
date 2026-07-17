/**
 * Async Retry — fixed delay, recursive
 *
 * retry(fn, retries, delay): call fn; on failure wait and try again
 * until attempts run out. async/await keeps it readable.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(fn, retries, delayMs) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err; // out of attempts — surface the real error
    await sleep(delayMs);
    return retry(fn, retries - 1, delayMs);
  }
}

// ── Usage ────────────────────────────────────────────────────────────────────

let calls = 0;
async function flaky() {
  calls += 1;
  if (calls < 3) throw new Error(`fail #${calls}`);
  return 'succeeded on call 3';
}

retry(flaky, 5, 100).then(console.log); // succeeded on call 3
