/**
 * Deep Clone — Brute Force (JSON round-trip)
 *
 * The simplest possible deep clone: serialize to JSON and parse back.
 * Works fine for plain data objects with JSON-safe values.
 * Every interviewer knows this — mention it first, then explain its limits.
 */

function deepCloneJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ── Examples ─────────────────────────────────────────────────────────────────

const original = {
  name: 'Alice',
  address: { city: 'Delhi', zip: '110001' },
  hobbies: ['coding', 'reading']
};

const clone = deepCloneJSON(original);
clone.address.city = 'Mumbai';
clone.hobbies.push('hiking');

console.log(original.address.city); // 'Delhi'   — unchanged ✓
console.log(original.hobbies);      // ['coding', 'reading'] ✓

// ── Limitations (always mention these!) ───────────────────────────────────────
const broken = {
  fn: () => 'hello',      // functions are dropped
  date: new Date(),       // Date becomes a string
  undef: undefined,       // undefined is dropped
  regex: /abc/g,          // RegExp becomes {}
  circular: null          // circular reference → JSON.stringify throws!
};
broken.circular = broken; // circular reference

// JSON.parse(JSON.stringify(broken)); // ← throws TypeError: cyclic object value
