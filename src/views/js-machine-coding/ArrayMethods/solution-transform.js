/**
 * Array Methods Practice — Transform & Filter
 *
 * The everyday drivers: map to reshape, filter to select, spread to copy.
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

// 1. Get all user names.
console.log(users.map((user) => user.name));

// 2. Get all users who are active.
console.log(users.filter((user) => user.isActive));

// 3. Get all users older than 30.
console.log(users.filter((user) => user.age > 30));

// 4. Get all users in the "Engineering" department.
console.log(users.filter((user) => user.department === 'Engineering'));

// 5. Create a new array of objects with only name and score.
//     map + object literal — wrap the object in parens so the arrow body
//     isn't parsed as a block.
console.log(users.map((user) => ({ name: user.name, score: user.score })));

// 6. Increase every user's score by 5.
//     Spread first, override after — the original objects are untouched.
console.log(users.map((user) => ({ ...user, score: user.score + 5 })));

// 7. Replace department with "Unknown" if it is missing.
//     Same immutable-update pattern; || falls back on undefined/null/''.
console.log(users.map((user) => ({ ...user, department: user.department || 'Unknown' })));

// 8. Create an array of strings in the format "name - city".
console.log(users.map((user) => `${user.name} - ${user.city}`));
