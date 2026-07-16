/**
 * pipe / compose — reduce one-liners
 *
 * The chain IS a reduction: start with the input, fold each function over
 * the accumulator. reduce = left-to-right (pipe), reduceRight = compose.
 */
const pipe =
  (...fns) =>
  (input) =>
    fns.reduce((acc, fn) => fn(acc), input);

const compose =
  (...fns) =>
  (input) =>
    fns.reduceRight((acc, fn) => fn(acc), input);

// ── Usage ────────────────────────────────────────────────────────────────────

const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const dashes = (s) => s.replace(/\s+/g, '-');

const slugify = pipe(trim, lower, dashes);
console.log(slugify('  Hello World  ')); // 'hello-world'

// compose reads like math notation: (f ∘ g)(x) = f(g(x))
const slugify2 = compose(dashes, lower, trim);
console.log(slugify2('  Hello World  ')); // 'hello-world'
