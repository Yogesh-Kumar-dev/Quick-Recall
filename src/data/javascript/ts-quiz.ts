import type { QuizQuestion } from '@/types/content';

// ─── TypeScript quiz — multiple choice ─────────────────────────────────────

export const tsQuiz: QuizQuestion[] = [
  {
    id: 'ts-q-type-vs-interface',
    question: 'What is a key difference between `type` and `interface` in TypeScript?',
    options: [
      'interface can never describe a function signature',
      'interface is open and mergeable (declaration merging); type is closed but more flexible (unions, mapped types)',
      'type only works with primitives',
      'They are 100% interchangeable with no differences'
    ],
    correctIndex: 1,
    explanation: 'Declaring the same interface twice merges the two; doing that with a type alias is an error.',
    category: 'Types'
  },
  {
    id: 'ts-q-any-vs-unknown',
    question: 'Why is `unknown` generally preferred over `any` for values of uncertain type?',
    options: [
      'unknown is faster at runtime',
      'unknown forces you to narrow the type before using it, while any silently disables type checking and spreads through your code',
      'any cannot be assigned to a variable',
      'unknown is only available in strict mode'
    ],
    correctIndex: 1,
    explanation: 'any bypasses the type checker entirely; unknown keeps you safe by requiring a type guard first.',
    category: 'Types'
  },
  {
    id: 'ts-q-code-generic-function',
    question: 'What is the type of `result` here?',
    code: `function identity<T>(value: T): T {
  return value;
}
const result = identity('hello');`,
    options: ['any', 'unknown', 'string — T is inferred from the argument', 'T (literally)'],
    correctIndex: 2,
    explanation: 'TypeScript infers T as string from the call site, so identity(\'hello\') returns a string.',
    category: 'Generics'
  },
  {
    id: 'ts-q-utility-partial',
    question: 'What does the `Partial<T>` utility type do?',
    options: [
      'Makes every property of T optional',
      'Makes every property of T required',
      'Removes all properties from T',
      'Converts T into a union of its keys'
    ],
    correctIndex: 0,
    explanation: '`Partial<T>` is commonly used for update/patch function parameters where not every field is provided.',
    category: 'Utility types'
  },
  {
    id: 'ts-q-utility-pick-omit',
    question: 'What is the difference between `Pick<T, K>` and `Omit<T, K>`?',
    options: [
      'They are aliases for the same utility',
      'Pick selects only the listed keys from T; Omit removes the listed keys, keeping the rest',
      'Pick works on arrays only; Omit works on objects only',
      'Omit requires at least two keys; Pick requires exactly one'
    ],
    correctIndex: 1,
    explanation: 'Pick<User, "id" | "name"> keeps just those two fields; Omit<User, "password"> keeps everything except password.',
    category: 'Utility types'
  },
  {
    id: 'ts-q-union-intersection',
    question: 'What does `A & B` mean for two object types A and B?',
    options: [
      'Either A or B, but not both',
      'A type that must satisfy both A and B at once (has all members of both)',
      'It is invalid syntax for object types',
      'The same as A | B'
    ],
    correctIndex: 1,
    explanation: 'Intersection (&) combines types; union (|) means "either" — the two operators are easy to mix up under pressure.',
    category: 'Types'
  },
  {
    id: 'ts-q-code-narrowing',
    question: 'Why does this compile without a type error on `value.toUpperCase()`?',
    code: `function printLength(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}`,
    options: [
      'TypeScript ignores the typeof check entirely',
      'The typeof check narrows value to string inside that branch, so string-only methods become safe to call',
      'toUpperCase() exists on both string and number',
      'It actually does not compile'
    ],
    correctIndex: 1,
    explanation: 'This is type narrowing — TypeScript tracks the effect of runtime checks like typeof/instanceof/in on the static type.',
    category: 'Narrowing'
  },
  {
    id: 'ts-q-discriminated-union',
    question: 'What makes a union of types a "discriminated union"?',
    options: [
      'Every member type has the exact same shape',
      'Each member shares a common literal "tag" field that lets TypeScript narrow which variant you have',
      'It must contain exactly two types',
      'It only applies to string literal types'
    ],
    correctIndex: 1,
    explanation: 'Switching on the shared tag field (e.g. `kind`) lets TypeScript safely narrow to the right member — and catch missing cases with exhaustiveness checks.',
    category: 'Types'
  },
  {
    id: 'ts-q-enums',
    question: 'By default, what values do TypeScript numeric enum members get?',
    code: `enum Direction {
  Up,
  Down,
  Left,
  Right
}`,
    options: ['Random unique numbers', 'Auto-incrementing integers starting at 0 (Up=0, Down=1, ...)', 'undefined until assigned', 'String versions of their names'],
    correctIndex: 1,
    explanation: 'You can override this by assigning an explicit value to any member, and subsequent members continue incrementing from there.',
    category: 'Types'
  },
  {
    id: 'ts-q-keyof',
    question: 'What does `keyof SomeType` produce?',
    options: [
      'An array of the object\'s values at runtime',
      'A union type of SomeType\'s property key names, as string/number/symbol literals',
      'The number of properties on SomeType',
      'A new type identical to SomeType'
    ],
    correctIndex: 1,
    explanation: 'For `{ id: number; name: string }`, `keyof` produces the type `"id" | "name"`.',
    category: 'Types'
  },
  {
    id: 'ts-q-strict-mode',
    question: 'What does enabling `"strict": true` in tsconfig.json do?',
    options: [
      'It only affects build performance, not type checking',
      'It turns on a family of stricter type checks (including strictNullChecks) — the recommended baseline for new projects',
      'It disables the `any` type entirely, making it a syntax error',
      'It requires every variable to have an explicit type annotation'
    ],
    correctIndex: 1,
    explanation: 'Turning strict on in an existing codebase often surfaces many latent null/undefined bugs — usually best migrated incrementally.',
    category: 'Config'
  },
  {
    id: 'ts-q-type-assertion',
    question: 'What does a type assertion like `value as string` actually do at runtime?',
    options: [
      'It converts the value to a string, like String(value)',
      'Nothing — it is a compile-time-only instruction telling the compiler to treat the value as that type',
      'It validates the value matches the asserted type and throws if not',
      'It creates a new copy of the value'
    ],
    correctIndex: 1,
    explanation: 'Assertions can lie — `("x" as unknown as number)` compiles fine but breaks at runtime; prefer narrowing/type guards where possible.',
    category: 'Types'
  },
  {
    id: 'ts-q-access-modifiers',
    question: 'What is true about TypeScript\'s `private` class field modifier?',
    options: [
      'It provides true runtime privacy, like JS #private fields',
      'It is a compile-time-only check — the field is still accessible at runtime via bracket notation or plain JS',
      'It prevents the class from being subclassed',
      'It is only valid on methods, not properties'
    ],
    correctIndex: 1,
    explanation: 'For actual runtime privacy, JavaScript\'s native `#private` fields are the real enforcement mechanism.',
    category: 'Classes'
  },
  {
    id: 'ts-q-code-generic-constraint',
    question: 'Why is the constraint `extends { length: number }` needed here?',
    code: `function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}`,
    options: [
      'It is not needed — TypeScript would allow item.length either way',
      'Without it, T could be any type, and TypeScript can\'t guarantee a .length property exists to access',
      'It forces T to be exactly an array',
      'It converts T into a union type'
    ],
    correctIndex: 1,
    explanation: 'Generic constraints let you safely use members that every valid T is guaranteed to have.',
    category: 'Generics'
  },
  {
    id: 'ts-q-declaration-files',
    question: 'What is a `.d.ts` file for?',
    options: [
      'It contains executable TypeScript code that gets compiled and shipped',
      'It contains type-only declarations describing the shape of JS code, with no runtime implementation',
      'It is only used for configuring the compiler',
      'It replaces package.json for TypeScript projects'
    ],
    correctIndex: 1,
    explanation: 'DefinitelyTyped publishes `.d.ts` files under the `@types` scope for JS libraries that don\'t ship their own types.',
    category: 'Tooling'
  },
  {
    id: 'ts-q-satisfies',
    question: 'What does the `satisfies` operator do that a type annotation does not?',
    code: `const config = {
  mode: 'dark',
  retries: 3
} satisfies Config;`,
    options: [
      'It widens the inferred type to exactly Config, losing the literal types',
      'It validates the value against Config while preserving its more specific inferred literal type',
      'It is identical to `as Config` in every way',
      'It only works on arrays'
    ],
    correctIndex: 1,
    explanation: 'Unlike a type annotation, `satisfies` keeps the narrower inferred type (e.g. `mode: "dark"` not `mode: string`) while still checking compatibility.',
    category: 'Types'
  },
  {
    id: 'ts-q-import-type',
    question: 'What is the purpose of `import type { Foo } from "./foo"` instead of a regular import?',
    options: [
      'It imports the value lazily on first use',
      'It marks the import as type-only, guaranteeing it is fully erased and never appears in compiled JS output',
      'It is required for all imports in strict mode',
      'It allows circular imports that would otherwise fail'
    ],
    correctIndex: 1,
    explanation: 'This avoids accidentally bundling a module purely because you imported one of its types.',
    category: 'Modules'
  },
  {
    id: 'ts-q-code-mapped-type',
    question: 'What does this mapped type produce when applied to `{ id: number; name: string }`?',
    code: `type ReadonlyVersion<T> = {
  readonly [K in keyof T]: T[K];
};`,
    options: [
      'A type with every property removed',
      'A version of T with every property still present but marked readonly',
      'A union of T\'s property names',
      'It is invalid syntax'
    ],
    correctIndex: 1,
    explanation: 'Mapped types transform an object type key by key — this is roughly how the built-in `Readonly<T>` utility works.',
    category: 'Advanced types'
  },
  {
    id: 'ts-q-function-overloads',
    question: 'What are function overloads used for in TypeScript?',
    options: [
      'Running multiple implementations of a function in parallel',
      'Declaring multiple call signatures for one function whose behavior/return type varies by argument shape',
      'Automatically generating unit tests',
      'Overriding a function from a parent class'
    ],
    correctIndex: 1,
    explanation: 'The overload signatures describe the valid call shapes; only one actual implementation follows them.',
    category: 'Functions'
  },
  {
    id: 'ts-q-abstract-class',
    question: 'What is true about an `abstract class` in TypeScript?',
    options: [
      'It can be instantiated directly with `new`',
      'It cannot be instantiated directly — it declares abstract members that concrete subclasses must implement',
      'It cannot have any concrete (implemented) methods',
      'It is only usable in .d.ts files'
    ],
    correctIndex: 1,
    explanation: 'Abstract classes are a base for shared structure/behavior, deferring specific pieces to subclasses.',
    category: 'Classes'
  },
  {
    id: 'ts-q-non-null-assertion',
    question: 'What does the `!` in `element!.focus()` do?',
    options: [
      'It negates a boolean value',
      'A non-null assertion — tells the compiler to treat the value as non-null/non-undefined, without a runtime check',
      'It throws if element is null',
      'It marks the statement as required'
    ],
    correctIndex: 1,
    explanation: 'Like `as`, this is a compile-time-only override — if you are wrong, it still fails at runtime with the usual TypeError.',
    category: 'Types'
  },
  {
    id: 'ts-q-tuple-types',
    question: 'What distinguishes a TypeScript tuple type from a regular array type?',
    code: `let point: [number, number] = [10, 20];`,
    options: [
      'Tuples can only hold strings',
      'A tuple fixes both the length and the type of each position, unlike a homogeneous array type',
      'Tuples are mutable but arrays are not',
      'There is no real difference — tuple is just another name for array'
    ],
    correctIndex: 1,
    explanation: '`[number, number]` guarantees exactly two elements, both numbers, in that order — useful for things like coordinate pairs.',
    category: 'Types'
  },
  {
    id: 'ts-q-never-type',
    question: 'When does a function\'s return type get inferred as `never`?',
    options: [
      'When the function has no parameters',
      'When the function never returns normally — it always throws or loops forever',
      'When the function returns undefined',
      'When the function has an empty body'
    ],
    correctIndex: 1,
    explanation: '`never` is also useful for exhaustiveness checks — assigning an unreachable branch\'s value to a `never`-typed variable causes a compile error if a case was missed.',
    category: 'Types'
  }
];
