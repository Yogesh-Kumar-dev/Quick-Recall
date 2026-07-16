/**
 * JSON.stringify — primitives, arrays, flat objects
 *
 * A big switch on typeof. Get the base cases right first:
 * strings are quoted, undefined/functions are dropped (or null in arrays).
 */
function jsonStringify(value) {
  // null before object check — typeof null === 'object'
  if (value === null) return 'null';

  const type = typeof value;

  if (type === 'string') return `"${value}"`;
  if (type === 'number') return Number.isFinite(value) ? String(value) : 'null'; // NaN/Infinity → null
  if (type === 'boolean') return String(value);
  if (type === 'undefined' || type === 'function') return undefined; // dropped by callers

  if (Array.isArray(value)) {
    const items = value.map((item) => jsonStringify(item) ?? 'null'); // holes/undefined → null in arrays
    return `[${items.join(',')}]`;
  }

  // Plain object: skip entries whose value serializes to undefined
  const entries = [];
  for (const key of Object.keys(value)) {
    const serialized = jsonStringify(value[key]);
    if (serialized !== undefined) {
      entries.push(`"${key}":${serialized}`);
    }
  }
  return `{${entries.join(',')}}`;
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(jsonStringify({ a: 1, b: 'hi', c: [true, null], skip: undefined }));
// {"a":1,"b":"hi","c":[true,null]}

console.log(jsonStringify([1, undefined, NaN])); // [1,null,null]
console.log(jsonStringify(null)); // null
