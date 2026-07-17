/**
 * mapLimit — Batched approach (simple but imperfect)
 *
 * Split tasks into chunks of `limit` and run chunks one after another with
 * Promise.all. Easy to write, but a whole batch must finish before the next
 * starts — one slow task blocks its entire batch.
 */
async function mapLimitBatched(items, limit, asyncFn) {
  const results = [];

  for (let start = 0; start < items.length; start += limit) {
    const batch = items.slice(start, start + limit);
    const batchResults = await Promise.all(batch.map(asyncFn));
    results.push(...batchResults);
  }

  return results;
}

// ── Usage ────────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchUser(id) {
  await delay(id === 3 ? 900 : 100); // task 3 is slow
  return `user-${id}`;
}

mapLimitBatched([1, 2, 3, 4, 5, 6], 2, fetchUser).then(console.log);
// Batches: [1,2] → [3,4] → [5,6]. Batch [3,4] takes 900ms even though 4
// finished in 100ms — slot sits idle. That's the flaw the pool version fixes.
