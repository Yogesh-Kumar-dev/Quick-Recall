/**
 * Array Methods Practice II — Combined Drills
 *
 * Compound filters and pipelines mixing several methods per line.
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

// 1. Check if every user has a score above 50.
console.log(users.every((user) => user.score > 50)); // true

// 2. Check if at least one user is from "Tokyo".
console.log(users.some((user) => user.city === 'Tokyo')); // true

// 3. Get users whose names start with "A", "P", or "S".
//     Three ORs work; [chars].includes(name[0]) scales better.
console.log(users.filter((user) => ['A', 'P', 'S'].includes(user.name[0])));

// 4. Get all users whose department is either "Engineering" or "Sales".
console.log(users.filter((user) => user.department === 'Engineering' || user.department === 'Sales'));

// 5. Create an array of all names sorted alphabetically.
//     map first (smaller array to sort), then sort strings directly.
console.log(
  users
    .map((user) => user.name)
    .toSorted((a, b) => a.localeCompare(b))
);

// 6. Get users whose score is between 70 and 90 (inclusive).
console.log(users.filter((user) => user.score >= 70 && user.score <= 90));

// 7. Get all users whose city starts with "T" or "S".
console.log(users.filter((user) => ['T', 'S'].includes(user.city[0])));

// ── Interview notes ──────────────────────────────────────────────────────────
// Chaining order matters for performance: filter before map/sort so later
// stages touch fewer items. And each chain link returns a NEW array — nothing
// in these pipelines mutates `users`.
