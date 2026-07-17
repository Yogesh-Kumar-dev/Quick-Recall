/**
 * LRU Cache — Array of keys for recency (simple but O(n))
 *
 * Keep values in an object and a separate array ordering keys from
 * least-recent (front) to most-recent (back). Every get/set moves the
 * key to the back; eviction shifts from the front.
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.values = {};
    this.order = []; // [least recent, ..., most recent]
  }

  get(key) {
    if (!(key in this.values)) return -1;
    this.touch(key);
    return this.values[key];
  }

  put(key, value) {
    if (!(key in this.values) && this.order.length === this.capacity) {
      const oldest = this.order.shift(); // evict least recently used
      delete this.values[oldest];
    }
    this.values[key] = value;
    this.touch(key);
  }

  // Move key to the most-recent end
  touch(key) {
    const i = this.order.indexOf(key); // O(n) — the weak spot
    if (i !== -1) this.order.splice(i, 1);
    this.order.push(key);
  }
}

// ── Usage ────────────────────────────────────────────────────────────────────

const cache = new LRUCache(2);
cache.put('a', 1);
cache.put('b', 2);
cache.get('a'); // 1 — 'a' is now most recent
cache.put('c', 3); // evicts 'b' (least recently used)
console.log(cache.get('b')); // -1
console.log(cache.get('a')); // 1
