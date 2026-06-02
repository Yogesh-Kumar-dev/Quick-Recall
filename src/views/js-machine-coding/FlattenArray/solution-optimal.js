/**
 * Flatten Nested Array — Optimal (Iterative Stack)
 *
 * Uses an explicit stack instead of recursion — avoids call-stack overflow
 * for extremely deeply nested arrays. O(n) time, O(n) space.
 *
 * This is the answer to "what if the array is millions of levels deep?"
 */

function flattenIterative(arr) {
  const result = [];
  const stack = [...arr]; // initialise stack with top-level elements

  while (stack.length > 0) {
    const item = stack.pop(); // process last-pushed item first (LIFO)

    if (Array.isArray(item)) {
      // Push individual elements back so they get processed
      stack.push(...item);
    } else {
      result.push(item);
    }
  }

  // Stack processes right→left (LIFO), so reverse to restore order
  return result.reverse();
}

// ── Alternative: iterative with explicit index (no reverse needed) ────────────

function flattenIterativeOrdered(arr) {
  const result = [];
  const stack = [arr]; // stack holds arrays (not individual items)
  const idxStack = [0]; // parallel stack of current index in each array

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const idx = idxStack[idxStack.length - 1];

    if (idx >= current.length) {
      // Done with this array level — pop it
      stack.pop();
      idxStack.pop();
    } else {
      idxStack[idxStack.length - 1]++;
      const item = current[idx];
      if (Array.isArray(item)) {
        stack.push(item);
        idxStack.push(0);
      } else {
        result.push(item);
      }
    }
  }

  return result;
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(flattenIterative([1, [2, [3, [4]], 5]]));
// → [1, 2, 3, 4, 5]

console.log(flattenIterativeOrdered([1, [2, [3, [4]], 5]]));
// → [1, 2, 3, 4, 5]

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(n) — each element visited once
// Space: O(n) — stack holds at most n elements (no extra call stack)
