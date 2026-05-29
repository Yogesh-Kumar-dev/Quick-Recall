/**
 * Deep Clone — Optimal (handles circular references + extended types)
 *
 * Uses a WeakMap as a "seen" cache to detect and preserve circular references.
 * Also handles: Map, Set, and custom class instances.
 *
 * This is the "follow-up" question answer when interviewers ask:
 * "What if the object has circular references?"
 */

function deepClone(value, seen = new WeakMap()) {
  // Primitives and null
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Already cloned this reference → return the clone (handles circular refs)
  if (seen.has(value)) {
    return seen.get(value);
  }

  let cloned;

  if (value instanceof Date) {
    cloned = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    cloned = new RegExp(value.source, value.flags);
  } else if (value instanceof Map) {
    cloned = new Map();
    seen.set(value, cloned);
    for (const [k, v] of value) {
      cloned.set(deepClone(k, seen), deepClone(v, seen));
    }
    return cloned;
  } else if (value instanceof Set) {
    cloned = new Set();
    seen.set(value, cloned);
    for (const v of value) {
      cloned.add(deepClone(v, seen));
    }
    return cloned;
  } else if (Array.isArray(value)) {
    cloned = [];
  } else {
    // Plain object or class instance — preserve prototype
    cloned = Object.create(Object.getPrototypeOf(value));
  }

  // Register BEFORE recursing to handle circular references
  seen.set(value, cloned);

  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key], seen);
  }

  return cloned;
}

// ── Example with circular reference ──────────────────────────────────────────

const a = { name: 'Alice', friend: null };
const b = { name: 'Bob', friend: a };
a.friend = b; // circular: a → b → a

const clonedA = deepClone(a);
console.log(clonedA.name);             // 'Alice'
console.log(clonedA.friend.name);      // 'Bob'
console.log(clonedA.friend.friend === clonedA); // true — circular ref preserved ✓

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n) — each node visited once (WeakMap lookup is O(1))
// Space: O(n) — new tree + WeakMap entries
