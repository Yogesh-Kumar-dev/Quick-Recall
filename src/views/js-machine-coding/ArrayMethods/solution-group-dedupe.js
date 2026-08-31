/**
 * Array Methods Practice — Group & Dedupe
 *
 * Building maps/objects from arrays and removing duplicates.
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

// 1. Get an array of all cities without duplicates.
//    map extracts, Set dedupes (keeping first-insertion order), spread
//    converts back to an array.
console.log([...new Set(users.map((user) => user.city))]);

// 2. Group users by department.
//    Classic reduce-to-object: lazily create the bucket on first sight.
console.log(
  users.reduce((acc, user) => {
    const key = user.department;
    if (!acc[key]) acc[key] = [];
    acc[key].push(user);
    return acc;
  }, {})
);

// 3. Group users by city — identical shape, different key.
console.log(
  users.reduce((acc, user) => {
    const key = user.city;
    if (!acc[key]) acc[key] = [];
    acc[key].push(user);
    return acc;
  }, {})
);

// 4. Create an array of all departments without duplicates, sorted alphabetically.
//    Pipeline: extract → dedupe → sort. localeCompare handles case/ordering
//    properly for names ('a' vs 'B').
console.log([...new Set(users.map((user) => user.department))].toSorted((a, b) => a.localeCompare(b)));

// ── Interview notes ──────────────────────────────────────────────────────────
// Grouping one-liners worth knowing:
//   if (!acc[k]) acc[k] = []; acc[k].push(x)      ← explicit version
//   (acc[k] ||= []).push(x)                       ← logical assignment
// And ES2024 added native Object.groupBy(users, u => u.department).
