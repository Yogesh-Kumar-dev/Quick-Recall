/**
 * Array Methods Practice II — Sort Basics
 *
 * toSorted() with the two comparator patterns every interview checks:
 * numeric subtraction and localeCompare for strings.
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

// 1. Sort users by age in ascending order.
//    Comparator contract: negative → a first, positive → b first.
//    (a - b) gives ascending; (b - a) flips it to descending.
console.log(users.toSorted((a, b) => a.age - b.age));

// 2. Sort users by score in descending order.
console.log(users.toSorted((a, b) => b.score - a.score));

// 3. Sort users by name in alphabetical order.
//    Strings can't be subtracted — localeCompare returns -1/0/1 and
//    handles case + accents properly (plain code-point comparison would
//    rank 'Zoe' before 'alice').
console.log(users.toSorted((a, b) => a.name.localeCompare(b.name)));

// 4. Sort users by name in reverse alphabetical order.
console.log(users.toSorted((a, b) => b.name.localeCompare(a.name)));

// ── Interview notes ──────────────────────────────────────────────────────────
// - toSorted (ES2023) returns a NEW array; sort() sorts IN PLACE and mutates.
//   In React state code the mutation is a bug factory: [...arr].sort() or
//   toSorted().
// - Without ANY comparator, sort() compares as STRINGS: [10, 2] → [10, 2].
