/**
 * JSON.stringify — with the edge cases interviewers probe for
 *
 * Adds to the basic version:
 * - toJSON() support (this is how Date serializes)
 * - circular reference detection (native throws TypeError)
 * - string escaping for quotes/backslashes/newlines
 */
function jsonStringify(value, seen = new Set()) {
  // Objects with toJSON (like Date) serialize their toJSON() result
  if (value && typeof value.toJSON === 'function') {
    value = value.toJSON();
  }

  if (value === null) return 'null';

  const type = typeof value;

  if (type === 'string') return quote(value);
  if (type === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (type === 'boolean') return String(value);
  if (type === 'undefined' || type === 'function' || type === 'symbol') return undefined;
  if (type === 'bigint') throw new TypeError('Do not know how to serialize a BigInt');

  // From here value is an object — guard against cycles
  if (seen.has(value)) throw new TypeError('Converting circular structure to JSON');
  seen.add(value);

  let result;
  if (Array.isArray(value)) {
    result = `[${value.map((item) => jsonStringify(item, seen) ?? 'null').join(',')}]`;
  } else {
    const entries = [];
    for (const key of Object.keys(value)) {
      const serialized = jsonStringify(value[key], seen);
      if (serialized !== undefined) entries.push(`${quote(key)}:${serialized}`);
    }
    result = `{${entries.join(',')}}`;
  }

  seen.delete(value); // same object appearing twice (not nested) is fine
  return result;
}

// Escape the characters that would break the output string
function quote(str) {
  const escaped = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  return `"${escaped}"`;
}

// ── Usage ────────────────────────────────────────────────────────────────────

console.log(jsonStringify({ when: new Date('2026-01-01'), msg: 'say "hi"' }));
// {"when":"2026-01-01T00:00:00.000Z","msg":"say \"hi\""}

const cyclic = { name: 'loop' };
cyclic.self = cyclic;
try {
  jsonStringify(cyclic);
} catch (err) {
  console.log(err.message); // Converting circular structure to JSON
}
