/**
 * Calculate Electricity Bill — Brute Force (if / else-if chain)
 *
 * Slabs (cumulative, per unit):
 *   0–100   → ₹5
 *   101–200 → ₹7
 *   201–300 → ₹10
 *   above 300 → ₹12
 *
 * Hardcode each slab boundary. Simple and readable, but the moment the
 * tariff changes you have to rewrite every branch — doesn't scale.
 */

function calculateBill(units) {
  let total = 0;

  if (units <= 0) {
    total = 0;
  } else if (units <= 100) {
    total = units * 5;
  } else if (units <= 200) {
    total = 100 * 5 + (units - 100) * 7;
  } else if (units <= 300) {
    total = 100 * 5 + 100 * 7 + (units - 200) * 10;
  } else {
    total = 100 * 5 + 100 * 7 + 100 * 10 + (units - 300) * 12;
  }

  return total;
}

// ── Examples ─────────────────────────────────────────────────────────────────

console.log(calculateBill(230)); // → 1500  (500 + 700 + 300)
console.log(calculateBill(90)); //  → 450   (90 × 5)
console.log(calculateBill(0)); //   → 0
console.log(calculateBill(2440)); // → 27880

// ── Complexity ────────────────────────────────────────────────────────────────
// Time:  O(1) — a fixed number of comparisons
// Space: O(1)
