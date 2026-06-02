/**
 * Group By — reduce + property-key flexibility (optimal)
 *
 * A concise reduce-based version that also accepts a string property name as a
 * shorthand for the key function (lodash _.groupBy style).
 *
 *   groupBy(arr, 'dept')        -> group by item.dept
 *   groupBy(arr, item => ...)   -> group by computed key
 */

function groupBy(arr, key) {
  const keyFn = typeof key === 'function' ? key : (item) => item[key];

  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item); // logical-assignment: create bucket if absent
    return acc;
  }, {});
}

// ── Usage ────────────────────────────────────────────────────────────────────

const orders = [
  { id: 1, status: 'paid' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'paid' }
];

console.log(groupBy(orders, 'status'));
// { paid: [{id:1}, {id:3}], pending: [{id:2}] }

console.log(groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd')));
// { odd: [1, 3, 5], even: [2, 4] }
