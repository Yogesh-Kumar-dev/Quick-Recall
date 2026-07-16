/**
 * Async Retry — exponential backoff + jitter (production version)
 *
 * Each retry waits twice as long as the last (200ms, 400ms, 800ms...),
 * plus a little randomness (jitter) so a thousand clients that failed
 * together don't all retry at the same instant.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, { retries = 3, baseDelayMs = 200, maxDelayMs = 10000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err; // last attempt — give up

      // 200, 400, 800... capped, plus 0-100ms of jitter
      const backoff = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
      const jitter = Math.random() * 100;
      await sleep(backoff + jitter);
    }
  }
}

// ── Usage ────────────────────────────────────────────────────────────────────

let calls = 0;
async function flakyApi() {
  calls += 1;
  if (calls < 3) throw new Error('503 Service Unavailable');
  return { ok: true, attempt: calls };
}

retryWithBackoff(flakyApi, { retries: 4, baseDelayMs: 200 }).then(console.log);
// waits ~200ms, ~400ms, then → { ok: true, attempt: 3 }
