/**
 * Calculate Electricity Bill — Functional (reduce over the slab table)
 *
 * Same data-driven idea as the optimal solution, expressed as a single
 * reduce. We thread an accumulator of { total, remaining } through the slabs.
 *
 * Concise, but the imperative loop is usually easier to read aloud in an
 * interview — show this to demonstrate functional fluency.
 */

const SLABS = [
  { limit: 100, rate: 5 },
  { limit: 100, rate: 7 },
  { limit: 100, rate: 10 },
  { limit: Infinity, rate: 12 }
];

function calculateBill(units, slabs = SLABS) {
  const { total } = slabs.reduce(
    (acc, { limit, rate }) => {
      const billable = Math.min(acc.remaining, limit);
      return { total: acc.total + billable * rate, remaining: acc.remaining - billable };
    },
    { total: 0, remaining: Math.max(units, 0) }
  );

  return total;
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(calculateBill(230)); // → 1500
console.log(calculateBill(350)); // → 2800  (500 + 700 + 1000 + 50 × 12)
console.log(calculateBill(0)); //   → 0

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(s) — one pass over the slab table
// Space: O(1)
