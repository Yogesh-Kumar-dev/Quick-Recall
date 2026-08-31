/**
 * Array Methods Practice — Aggregate (reduce)
 *
 * reduce folds an array into anything: a number, an object, a single user.
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

// 1. Get the total score of all users.
console.log(users.reduce((acc, user) => acc + user.score, 0));
// → 1611

// 2. Find the highest scored user.
console.log(users.reduce((maxUser, user) => (user.score > maxUser.score ? user : maxUser), users[0]));
// → Sam (score 96)

// 3. Find the user with the shortest name.
//     Same fold-a-winner pattern with a different comparison.
console.log(users.reduce((shortest, user) => (user.name.length < shortest.name.length ? user : shortest), users[0]));

// 4. Find the user with the longest name.
console.log(users.reduce((longest, user) => (user.name.length > longest.name.length ? user : longest), users[0]));

// 5. Count how many users are in each department.
//     The accumulator is an object; (acc[k] || 0) + 1 seeds the first count.
console.log(
  users.reduce((acc, user) => {
    acc[user.department] = (acc[user.department] || 0) + 1;
    return acc;
  }, {})
);
// → { Engineering: 5, Sales: 3, Marketing: 3, Design: 3, HR: 2,
//     Support: 2, Finance: 2 }

// ── Interview notes ──────────────────────────────────────────────────────────
// The three shapes worth memorising:
//   fold to value   → (acc, x) => acc + x            (seed with 0)
//   fold to winner  → (best, x) => better(x, best) ? x : best
//   fold to object  → mutate-and-return the accumulator ({}, or {} seeded)
