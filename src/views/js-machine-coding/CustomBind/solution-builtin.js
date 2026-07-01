/**
 * bind / call / apply — Built-in trio
 *
 * The native bind is built in. Know how the three context-setters relate —
 * a guaranteed interview question.
 *
 *   call(ctx, a, b)   -> invoke now, args listed individually
 *   apply(ctx, [a,b]) -> invoke now, args as an array
 *   bind(ctx, a)      -> return a new function with ctx (and partial args) fixed
 */

const user = { name: 'Grace' };

function intro(role, team) {
  return `${this.name} — ${role} on ${team}`;
}

// call: args one by one
console.log(intro.call(user, 'Engineer', 'Platform'));

// apply: args as an array
console.log(intro.apply(user, ['Engineer', 'Platform']));

// bind: returns a reusable function with `this` (and 'Engineer') locked in
const asEngineer = intro.bind(user, 'Engineer');
console.log(asEngineer('Platform'));
console.log(asEngineer('Infra'));
