/**
 * Group By — forEach + object accumulator (brute force)
 *
 * groupBy(arr, keyFn) returns an object whose keys are the result of keyFn for
 * each item, and whose values are arrays of the items sharing that key.
 *
 *   - Iterate the array.
 *   - Compute the key for each item.
 *   - Push the item into the bucket for that key (creating it if needed).
 */

function groupBy(arr, keyFn) {
  const result = {};

  arr.forEach((item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  });

  return result;
}

// ── Usage ────────────────────────────────────────────────────────────────────

const people = [
  { name: 'Ada', dept: 'eng' },
  { name: 'Lin', dept: 'design' },
  { name: 'Sam', dept: 'eng' }
];

console.log(groupBy(people, (p) => p.dept));
// { eng: [{Ada}, {Sam}], design: [{Lin}] }

console.log(groupBy([6.1, 4.2, 6.3], Math.floor));
// { '4': [4.2], '6': [6.1, 6.3] }
