import type { Note } from 'types/content';

export const tsNotes: Note[] = [
  // ─── TYPES ──────────────────────────────────────────────────────────────────
  {
    id: 'type-vs-interface',
    title: 'type vs interface',
    summary: 'Both describe object shapes; interfaces are open (mergeable), types are closed but more flexible.',
    difficulty: 'basic',
    category: 'types',
    keyPoints: [
      'interface can be extended with extends and merged via declaration merging.',
      'type alias can represent any type: union, intersection, primitives, tuples.',
      'interface is preferred for public API shapes (libraries, classes).',
      'type is preferred for unions, intersections, and complex computed types.',
      'Both support generics. Both can represent function signatures.',
      'Key difference: interfaces can be re-opened (declaration merging), types cannot.'
    ],
    gotcha: 'Extending an interface with a conflicting property type causes a compile error. Union types resolve this differently.',
    codeSnippet: `interface User { id: number; name: string; }
interface User { email: string; } // merged — OK

type ID = string | number;
type Point = { x: number } & { y: number }; // intersection
type Result<T> = { data: T } | { error: string }; // union`
  },
  {
    id: 'generics',
    title: 'Generics',
    summary: 'Type variables that let you write reusable, type-safe functions and data structures.',
    difficulty: 'intermediate',
    category: 'generics',
    keyPoints: [
      '<T> introduces a type parameter — T is resolved when the function/class is used.',
      'Constraints: <T extends SomeType> limits what T can be.',
      'Default types: <T = string> uses string when T is not provided.',
      'Multiple type params: <T, K extends keyof T>.',
      'Generic interfaces and classes work the same way.',
      'Avoid unnecessary generics — only use when the type needs to vary.'
    ],
    textbookDef: `Generics are parameterised type variables, introduced by angle-bracket syntax (<T>), that allow a function, interface, or class to operate over a type that is supplied by the caller rather than hardcoded. TypeScript resolves generic type parameters through contextual type inference or explicit annotation at the call site.`,
    eli5: `Generics are like a vending machine that works with any product.

Without generics: you build a "Chips Machine" that only accepts chips and only dispenses chips. Want a "Soda Machine"? Write a whole new machine.
With generics: you build ONE machine — "put in T, get out T" — where T is just a label/placeholder.
When you use the machine, T gets filled in: put in chips → T = Chips. Put in soda → T = Soda.
The machine still knows exactly what's inside — type safety is fully preserved.

identity<string>('hello') → TypeScript resolves T as string, return type is string.
identity<number>(42) → T is number, return type is number. One function, infinite types.`,
    codeSnippet: `function identity<T>(arg: T): T { return arg; }

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface ApiResponse<T> {
  data: T;
  status: number;
}`
  },
  {
    id: 'utility-types',
    title: 'Utility Types',
    summary: 'Built-in generic helpers that transform existing types.',
    difficulty: 'intermediate',
    category: 'utility-types',
    keyPoints: [
      'Partial<T> — makes all properties optional.',
      'Required<T> — makes all properties required.',
      'Readonly<T> — all properties become readonly.',
      'Pick<T, K> — selects subset of keys K from T.',
      'Omit<T, K> — removes keys K from T.',
      'Record<K, V> — object type with keys K and values V.',
      'Exclude<T, U> — removes U from union T.',
      'Extract<T, U> — keeps only U from union T.',
      'NonNullable<T> — removes null and undefined.',
      'ReturnType<T> — extracts return type of function type T.',
      'Parameters<T> — extracts parameter types as a tuple.'
    ],
    textbookDef: `TypeScript's utility types are generic type aliases in the standard library that apply common structural transformations — such as making properties optional, readonly, or projecting/omitting specific keys — to an existing type parameter T. Internally they are implemented using mapped types, conditional types, and the infer keyword.`,
    eli5: `Utility types are adjustable stamps you apply to reshape an existing type without rewriting it.

Imagine your User type has: id, name, email, password — all required.

Partial<User>: stamps "all optional" — great for an update form where you only send the changed fields.
Pick<User, 'id' | 'name'>: cuts out only the listed fields — "give me just id and name."
Omit<User, 'password'>: cuts away the listed fields — "give me User but hide the password."
Record<string, User>: "I want an object whose keys are strings and values are Users."
ReturnType<typeof fetchUser>: "I don't want to repeat the return type — just infer it from the function."

You're reshaping and reusing existing types rather than writing redundant new ones.`,
    codeSnippet: `type UserUpdate = Partial<User>;           // all optional
type UserPreview = Pick<User, 'id' | 'name'>;
type UserWithoutEmail = Omit<User, 'email'>;
type IdMap = Record<string, User>;

type FnReturn = ReturnType<typeof fetchUser>; // inferred return type`
  },
  {
    id: 'union-intersection',
    title: 'Union & Intersection Types',
    summary: 'Union (A | B) means either; Intersection (A & B) means both.',
    difficulty: 'basic',
    category: 'types',
    keyPoints: [
      'Union: A | B — value can be type A or type B.',
      'Intersection: A & B — value must satisfy both A and B (combined properties).',
      'Unions require narrowing before accessing type-specific properties.',
      'Intersections are useful for mixins and extending types.',
      'Discriminated unions: add a literal "kind" or "type" field to narrow safely.'
    ],
    codeSnippet: `type StringOrNum = string | number;

type WithId = { id: string };
type WithName = { name: string };
type Person = WithId & WithName; // { id: string; name: string }

// Discriminated union
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number };

function area(s: Shape) {
  if (s.kind === 'circle') return Math.PI * s.radius ** 2;
  return s.width * s.height;
}`
  },
  {
    id: 'type-guards',
    title: 'Type Guards & Narrowing',
    summary: 'Narrowing refines a broad type to a specific one inside a conditional block.',
    difficulty: 'intermediate',
    category: 'types',
    keyPoints: [
      'typeof narrowing: typeof x === "string".',
      'instanceof narrowing: x instanceof Date.',
      'in narrowing: "prop" in obj.',
      'Equality narrowing: x === "specific-value".',
      'Custom type guard: function isUser(x): x is User { return ... }.',
      'Assertion functions: function assert(cond): asserts cond { if (!cond) throw }.'
    ],
    textbookDef: `Type narrowing is the process by which TypeScript's control flow analysis refines the static type of a variable within a conditional branch. A type guard is an expression that, when evaluated as true, permits TypeScript to infer a more specific type in its scope; user-defined type guards use the \`x is T\` predicate return type to communicate that narrowing to the compiler.`,
    eli5: `TypeScript is like a bouncer who needs to be sure who's at the door before letting them in.

Step 1: You have id which could be a string OR a number — the bouncer can't let it do string-only things until they're 100% sure.
Step 2: typeof id === 'string' is like showing an ID card — now TypeScript knows it's a string inside that block and unlocks string methods.
Step 3: A custom type guard (isUser(x): x is User) is a more detailed background check — you write the logic, and TypeScript trusts your word: "if this returns true, x is definitely a User."
Step 4: Inside the narrowed branch TypeScript "forgets" the other possibilities and gives you the exact type — no casting needed.`,
    codeSnippet: `function processId(id: string | number) {
  if (typeof id === 'string') {
    return id.toUpperCase(); // id is string here
  }
  return id.toFixed(2);     // id is number here
}

function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}`
  },
  {
    id: 'mapped-types',
    title: 'Mapped & Conditional Types',
    summary: 'Mapped types transform object types key-by-key; conditional types choose between types based on a condition.',
    difficulty: 'advanced',
    category: 'advanced',
    keyPoints: [
      'Mapped type: { [K in keyof T]: NewType } — transform each property.',
      'Add/remove modifiers: +readonly, -readonly, +?, -?.',
      'Conditional type: T extends U ? X : Y.',
      'infer keyword: extract a type inside a conditional (infer R in ReturnType).',
      'Distributive conditionals: automatically distribute over union types.'
    ],
    textbookDef: `A mapped type iterates over the properties of a type parameter using \`[K in keyof T]\` syntax, optionally transforming each property's type and modifiers (+/- readonly, +/- ?) at compile time. A conditional type \`T extends U ? X : Y\` distributes over union members of T and, combined with the \`infer\` keyword, enables extraction of sub-types from generic positions.`,
    eli5: `Mapped types are a "for-loop for types" — visit every property and transform it.

Imagine your User type has 5 required properties. A mapped type says: "for each property in User, make it optional." That is literally how Partial<T> is built inside TypeScript itself.

Conditional types are the if/else of the type world:
"Is T a function? Yes → give me its return type. No → give me never."
That's how ReturnType<T> works under the hood.

The infer keyword is the magic trick: inside the "yes" branch, pull out a hidden piece of the type and give it a name. Like pattern matching — you're deconstructing a type the same way you'd destructure an object at runtime.`,
    codeSnippet: `type Nullable<T> = { [K in keyof T]: T[K] | null };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type IsArray<T> = T extends any[] ? true : false;

// infer — extract return type manually
type MyReturn<T> = T extends (...args: any[]) => infer R ? R : never;`
  },
  {
    id: 'enums',
    title: 'Enums',
    summary: 'Named constant sets — numeric (default) or string enums.',
    difficulty: 'basic',
    category: 'types',
    keyPoints: [
      'Numeric enum: members auto-increment from 0 by default.',
      'String enum: each member must have an explicit string literal value.',
      'const enum: inlined at compile time, no runtime object generated.',
      'Prefer string enums for readability (logged values are meaningful).',
      'Enums are real objects at runtime (except const enum).',
      'Alternative: union of string literals (type Direction = "up" | "down") — no runtime cost.'
    ],
    codeSnippet: `enum Direction { Up = 'UP', Down = 'DOWN', Left = 'LEFT', Right = 'RIGHT' }

// Often prefer union literals instead:
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';`
  },
  {
    id: 'keyof-typeof',
    title: 'keyof & typeof',
    summary: "`keyof` produces a union of an object type's keys; `typeof` captures the type of a value.",
    difficulty: 'intermediate',
    category: 'advanced',
    keyPoints: [
      'keyof T — union of all keys of T as literal string/number types.',
      'T[K] — index access type, the type of property K in T.',
      'typeof value — infers the type from a runtime value.',
      'Common combo: Record<keyof Config, string> or typeof defaultConfig.',
      'Template literal types: `${keyof T}Changed` — generates string unions.'
    ],
    textbookDef: `The \`keyof\` operator in a type position produces a union of all known public property keys of an object type T as string or number literal types. The \`typeof\` operator in a type position infers the TypeScript type of a runtime value, enabling the type system to derive structural information from existing JavaScript objects without redundant manual annotation.`,
    eli5: `These two operators let TypeScript ask questions ABOUT your types — they're introspection tools.

keyof: "What are all the legal keys of this object type?"
If type User = { id: number; name: string }, then keyof User is literally 'id' | 'name'. Now you can write functions that only accept real, existing key names — no typos allowed.

typeof (in type position): "What's the shape of this runtime variable?"
Instead of writing the type again by hand, just say typeof myConfig and TypeScript figures it out. Update the object, the type updates automatically.

Powerful combo — keyof typeof myObj — gets all keys of a real runtime object as a type union. Favourite use: config objects and lookup tables.`,
    codeSnippet: `const config = { host: 'localhost', port: 3000 };
type Config = typeof config;          // { host: string; port: number }
type ConfigKey = keyof Config;         // 'host' | 'port'
type ConfigValue = Config[ConfigKey];  // string | number`
  }
];
