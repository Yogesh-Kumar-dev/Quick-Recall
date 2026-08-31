/**
 * Array Methods Practice — Search & Test
 *
 * Finding one item vs asking yes/no questions about the whole array.
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

// 1. Find the user with id = 10.
//    find returns the FIRST match (or undefined); filter would return [user].
console.log(users.find((user) => user.id === 10));

// 2. Find the first user from "New York" who is active.
//    Compound predicates compose with && inside the same callback.
console.log(users.find((user) => user.city === 'New York' && user.isActive));

// 3. Find the first user whose name starts with "M" and is active.
console.log(users.find((user) => user.name.startsWith('M') && user.isActive));

// 4. Check if any user name contains the letter "i".
//    some short-circuits at the first true; find would also work but
//    returns an object when you only need a boolean.
console.log(users.some((user) => user.name.includes('i')));

// 5. Check if all users live in a city with more than 4 letters.
//    every short-circuits at the first false.
console.log(users.every((user) => user.city.length > 4));

// ── Interview notes ──────────────────────────────────────────────────────────
// find vs filter vs some/every:
//   find   → first match or undefined      (stops early)
//   filter → ALL matches in a new array    (always walks everything)
//   some   → boolean, at least one passes  (stops early)
//   every  → boolean, all must pass       (stops early)
