/**
 * Array Methods Practice II — Sort Pitfalls
 *
 * The single most common array-methods interview trap: sort() MUTATES the
 * original array, toSorted() does not. Finding the top scorer both ways,
 * contrasted.
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

// 1 (safe). Highest scored user via reduce — no mutation at all.
const byReduce = users.reduce((maxUser, user) => (user.score > maxUser.score ? user : maxUser), users[0]);
console.log(byReduce); // Sam
console.log(users[0].name); // Alice — order untouched

// 2 (trap). Highest scored user via sort.
const bySort = users.toSorted((a, b) => b.score - a.score)[0];
console.log(bySort); // Sam — correct answer...

// ...but users itself has been REORDERED as a side effect:
console.log(users[0].name); // Sam now, not Alice!
console.log(users.map((u) => u.id));
// [19, 13, 7, 3, ...] — the caller's array is silently different

// ── The fixes ────────────────────────────────────────────────────────────────
// ES2023+:            users.toSorted((a, b) => b.score - a.score)[0]
// Pre-2023 / React:   [...users].sort((a, b) => b.score - a.score)[0]

// ── Interview notes ──────────────────────────────────────────────────────────
// Why this matters most in React: state arrays passed to sort() get mutated,
// the reference doesn't change so React skips re-render, and the UI shows a
// secretly-reordered array. If asked for "highest scored user", say that
// O(n) reduce beats an O(n log n) sort anyway — sorting to find one winner
// is doing more work than needed.
