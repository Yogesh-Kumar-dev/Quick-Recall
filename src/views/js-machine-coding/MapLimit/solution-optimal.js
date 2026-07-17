/**
 * mapLimit — Worker pool (the real answer)
 *
 * Spawn `limit` workers. Each worker repeatedly grabs the next unclaimed
 * index and processes it — so the moment any task finishes, its slot picks
 * up new work. A shared cursor + results-by-index keeps order.
 */
async function mapLimit(items, limit, asyncFn) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    // Each loop iteration claims one index; JS is single-threaded, so the
    // increment is race-free.
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await asyncFn(items[index]);
    }
  }

  // Start at most `limit` workers and wait for all of them to drain the list
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);

  return results;
}

// ── Usage ────────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchUser(id) {
  await delay(id === 3 ? 900 : 100);
  return `user-${id}`;
}

mapLimit([1, 2, 3, 4, 5, 6], 2, fetchUser).then(console.log);
// ['user-1', ..., 'user-6'] in input order. While task 3 crawls, the other
// slot keeps churning through 4, 5, 6 — no idle time.
