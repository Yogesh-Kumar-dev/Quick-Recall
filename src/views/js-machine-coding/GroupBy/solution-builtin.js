/**
 * Group By — Object.groupBy / Map.groupBy (built-in)
 *
 * ES2024 added native grouping helpers:
 *   Object.groupBy(items, cb) -> plain object keyed by string/symbol
 *   Map.groupBy(items, cb)    -> Map, allowing any value (object) as a key
 *
 * Available in modern Node (21+) and current browsers.
 */

const nums = [6.1, 4.2, 6.3, 4.9];

// Object.groupBy — keys coerced to strings
console.log(Object.groupBy(nums, Math.floor));
// { '4': [4.2, 4.9], '6': [6.1, 6.3] }

// Map.groupBy — keys can be any value, including objects
const evenBucket = { label: 'even' };
const oddBucket = { label: 'odd' };

const grouped = Map.groupBy(nums, (n) => (Math.floor(n) % 2 === 0 ? evenBucket : oddBucket));
console.log(grouped.get(evenBucket)); // [6.1, 4.2, 6.3, 4.9 filtered to even-floored]
