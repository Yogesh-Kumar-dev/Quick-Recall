/**
 * Array Methods Practice II — Multi-key & Chained
 *
 * Comparator chaining with ||, slicing sorted output, sorting by derived
 * values like string length.
 */

const users = [
  { id: 1, name: 'Alice', age: 24, city: 'New York', isActive: true, score: 85, department: 'Engineering' },
  { id: 2, name: 'Bob', age: 30, city: 'London', isActive: false, score: 72, department: 'Sales' },
  { id: 3, name: 'Charlie', age: 28, city: 'Paris', isActive: true, score: 91, department: 'Marketing' },
  { id: 4, name: 'Diana', age: 22, city: 'Tokyo', isActive: false, score: 64, department: 'Design' },
  { id: 5, name: 'Ethan', age: 35, city: 'New York', isActive: true, score: 88, department: 'Engineering' },
  { id: 6, name: 'Fiona', age: 27, city: 'Berlin', isActive: true, score: 79, department: 'HR' },
  { id: 7, name: 'George', age: 31, city: 'London', isActive: false, score: 95, department: 'Sales' },
  { id: 8, name: 'Hannah', age: 26, city: 'Paris', isActive: true, score: 67, department: 'Support' },
  { id: 9, name: 'Ian', age: 29, city: 'Sydney', isActive: true, score: 74, department: 'Engineering' },
  { id: 10, name: 'Julia', age: 23, city: 'Toronto', isActive: false, score: 81, department: 'Marketing' },
  { id: 11, name: 'Kevin', age: 33, city: 'Dubai', isActive: true, score: 90, department: 'Finance' },
  { id: 12, name: 'Luna', age: 21, city: 'Rome', isActive: false, score: 58, department: 'Design' },
  { id: 13, name: 'Mike', age: 36, city: 'New York', isActive: true, score: 93, department: 'Engineering' },
  { id: 14, name: 'Nina', age: 25, city: 'Berlin', isActive: true, score: 76, department: 'HR' },
  { id: 15, name: 'Oscar', age: 34, city: 'Tokyo', isActive: false, score: 69, department: 'Support' },
  { id: 16, name: 'Priya', age: 27, city: 'Mumbai', isActive: true, score: 87, department: 'Finance' },
  { id: 17, name: 'Quinn', age: 32, city: 'London', isActive: true, score: 82, department: 'Sales' },
  { id: 18, name: 'Riya', age: 24, city: 'Paris', isActive: false, score: 71, department: 'Marketing' },
  { id: 19, name: 'Sam', age: 29, city: 'Sydney', isActive: true, score: 96, department: 'Engineering' },
  { id: 20, name: 'Tina', age: 28, city: 'Toronto', isActive: false, score: 63, department: 'Design' }
];

// 1. Sort by city alphabetically, then by name if cities tie.
//    The || trick: 0 is falsy, so the second comparator only runs when the
//    first one says "equal". Extend the chain for a third key the same way.
console.log(users.toSorted((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)));

// 2. Get the first 5 users after sorting by score descending.
//    Chain: sort → slice. slice copies, so the chain stays immutable.
console.log(users.toSorted((a, b) => b.score - a.score).slice(0, 5));

// 3. Get the last 3 users after sorting by age ascending.
//    Negative index counts from the end — slice(-3) = last three.
console.log(users.toSorted((a, b) => a.age - b.age).slice(-3));

// 4. Sort users by the length of their name.
//    Comparators work on any DERIVED value, not just raw properties.
console.log(users.toSorted((a, b) => a.name.length - b.name.length));

// ── Interview notes ──────────────────────────────────────────────────────────
// Multi-key alternatives when || chains get long: a loop over key functions,
// or Intl.Collator for locale-aware multi-property sorting.
