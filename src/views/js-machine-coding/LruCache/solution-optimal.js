/**
 * LRU Cache — Map insertion order (O(1) and the JS-native answer)
 *
 * Key insight: a JS Map remembers insertion order, and re-inserting a key
 * moves it to the end. So "most recently used" is simply "last inserted",
 * and the LRU victim is the first key in the Map.
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    // Re-insert to mark as most recently used
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key); // remove so re-insert moves it to the end
    } else if (this.map.size === this.capacity) {
      // First key in iteration order = least recently used
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
    this.map.set(key, value);
  }
}

// ── Usage ────────────────────────────────────────────────────────────────────

const cache = new LRUCache(2);
cache.put('a', 1);
cache.put('b', 2);
cache.get('a'); // 1 — 'a' bumped to most recent
cache.put('c', 3); // evicts 'b'
console.log(cache.get('b')); // -1
console.log(cache.get('a')); // 1
console.log([...cache.map.keys()]); // ['a', 'c'] — LRU first, MRU last
