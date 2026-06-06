/**
 * Calculate Electricity Bill — Optimal (data-driven slab table)
 *
 * Describe the tariff as DATA, then loop over it. Each slab consumes up to
 * `limit` units at its `rate`; carry the remaining units to the next slab.
 *
 * Why this is the interview-preferred answer: changing the tariff is now a
 * data edit (add/remove a row), not a logic rewrite — the loop never changes.
 */

const SLABS = [
  { limit: 100, rate: 5 },
  { limit: 100, rate: 7 },
  { limit: 100, rate: 10 },
  { limit: Infinity, rate: 12 }
];

function calculateBill(units, slabs = SLABS) {
  let total = 0;
  let remaining = units;

  for (const { limit, rate } of slabs) {
    if (remaining <= 0) break;

    // units billed in THIS slab = whatever is left, capped at the slab size
    const billable = Math.min(remaining, limit);
    total += billable * rate;
    remaining -= billable;
  }

  return total;
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(calculateBill(230)); // → 1500
console.log(calculateBill(120)); // → 640   (500 + 20 × 7)
console.log(calculateBill(0)); //   → 0
console.log(calculateBill(2440)); // → 27880

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(s) — one pass over the slab table (s = number of slabs, ~constant)
// Space: O(1)
