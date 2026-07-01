/**
 * Flatten Nested Array — Built-in Methods
 *
 * JavaScript has native solutions — know them, but explain their limitations.
 */

// ── Option 1: Array.prototype.flat (ES2019) ───────────────────────────────────

const arr = [1, [2, [3, [4]], 5]];

arr.flat(); // [1, 2, [3, [4]], 5]   — default depth 1
arr.flat(2); // [1, 2, 3, [4], 5]     — depth 2
arr.flat(Infinity); // [1, 2, 3, 4, 5]       — any depth

// ── Option 2: JSON trick (limited — loses non-JSON-safe values) ───────────────

function flattenJSON(arr) {
  // Works ONLY if all values are JSON-serialisable (no undefined, functions, etc.)
  return JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']');
}

// ── Option 3: toString trick (only for number arrays) ────────────────────────

function flattenNumbers(arr) {
  return arr.toString().split(',').map(Number);
  // "1,2,3,4,5" → [1, 2, 3, 4, 5]
  // ⚠️ Breaks for non-number values
}

// ── When to mention each in an interview ─────────────────────────────────────
// Array.flat(Infinity) — always mention this. Shows knowledge of modern JS.
// Then implement manually to show you understand the underlying algorithm.
// JSON trick — mention as a curiosity; explain its limitations.

console.log([1, [2, [3, [4]], 5]].flat(Infinity));
// → [1, 2, 3, 4, 5]
