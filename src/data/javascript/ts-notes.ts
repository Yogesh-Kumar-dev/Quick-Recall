import type { Note } from '@/types/content';

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
  },

  // ─── FUNDAMENTALS ────────────────────────────────────────────────────────────
  {
    id: 'ts-what-is',
    title: 'TypeScript vs JavaScript',
    summary: 'A statically-typed superset of JavaScript that compiles to plain JS and catches errors at build time.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Statically typed: annotate variables, params, and return values; errors caught during development.',
      'Superset of JS: all valid JavaScript is valid TypeScript — types are optional and additive.',
      'Compiled (transpiled) by tsc to standard, browser-compatible JavaScript.',
      'Adds language features: interfaces, enums, generics, access modifiers, often ahead of JS.',
      'Types are erased at runtime — they exist only at compile time for tooling and safety.'
    ],
    textbookDef: `TypeScript is an open-source, statically-typed superset of JavaScript developed by Microsoft. It augments JavaScript with optional static type annotations and additional language constructs, which a compiler verifies and then erases, emitting standard ECMAScript targeted at a configurable version.`,
    eli5: `JavaScript lets you put anything anywhere and only complains when the code actually runs and breaks. TypeScript is JavaScript with a spell-checker that reads your code before it runs and underlines the mistakes — wrong types, typos, missing properties — so you fix them at your desk instead of in production. When it's happy, it strips out all the type notes and hands the browser plain JavaScript.`,
    codeSnippet: `let num: number = 5;
num = 'oops'; // ❌ Type 'string' is not assignable to type 'number'

// Compiles to plain JS (types erased):
// let num = 5;`
  },
  {
    id: 'ts-basic-types',
    title: 'Basic Types',
    summary: 'The built-in type set: primitives, arrays, tuples, enums, and the special any / void / never.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Primitives: boolean, number, string, plus null and undefined.',
      'Array: number[] or Array<number>. Tuple: fixed-length, mixed types [string, number].',
      'enum: a named set of constants. object: any non-primitive.',
      'any: opts out of type checking — avoid; prefer unknown and narrow.',
      'void: a function returns nothing. never: a function never returns (always throws/loops).'
    ],
    gotcha: 'any silently disables checking and spreads through your code. unknown forces you to narrow before use — prefer it.',
    codeSnippet: `let isActive: boolean = true;
let scores: number[] = [85, 90];
let employee: [string, number] = ['John', 35]; // tuple
function fail(msg: string): never { throw new Error(msg); }
function log(): void { console.log('hi'); }`
  },
  {
    id: 'ts-variable-declaration',
    title: 'Variable Declaration & let vs const',
    summary: 'Declare with let/const (block-scoped) and an optional type; const locks the binding, not the contents.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Prefer const by default; use let when reassignment is needed; avoid var.',
      'Type annotation is optional when the initializer makes the type obvious (inference).',
      'A variable must be declared before use; types are enforced on assignment.',
      'const makes the REFERENCE immutable — object/array contents can still mutate.',
      'let and const are block-scoped; var is function-scoped and hoisted.'
    ],
    codeSnippet: `const apiKey: string = 'secret';   // constant binding
let count = 42;                    // inferred as number

const arr: number[] = [1, 2, 3];
arr.push(4);                       // ✅ contents mutable
// arr = [];                       // ❌ reassignment blocked`
  },
  {
    id: 'ts-type-inference',
    title: 'Type Inference',
    summary: 'TypeScript automatically derives types from values, reducing the need for explicit annotations.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Assigning a value infers the variable’s type (let x = 10 → number).',
      'Uses a "best common type" algorithm across multiple candidate types.',
      'Function return types are inferred from the return statements.',
      'Benefits: more concise code, fewer redundant annotations, fewer mismatches.',
      'Add explicit annotations at API boundaries where intent should be documented.'
    ],
    codeSnippet: `let value = 10;        // inferred: number
let message = 'hello'; // inferred: string

function add(a: number, b: number) {
  return a + b;        // return type inferred: number
}
const sum = add(5, 7); // sum: number`
  },

  // ─── FUNCTIONS ───────────────────────────────────────────────────────────────
  {
    id: 'ts-functions',
    title: 'Typing Functions',
    summary: 'Annotate parameters and return types; support optional, default, and rest parameters.',
    difficulty: 'basic',
    category: 'functions',
    keyPoints: [
      'Annotate each parameter and the return type: function f(a: number): string.',
      'void return type for functions that return nothing.',
      'Optional parameter: name?: type. Default parameter: name = value.',
      'Rest parameter: ...names: string[] accepts any number of trailing args.',
      'Function-expression / call-signature types: (name: string) => void.'
    ],
    codeSnippet: `function greet(name: string, title?: string): void {
  console.log(title ? \`Hello \${title} \${name}\` : \`Hello \${name}\`);
}

const fn: (n: string) => void = (n) => console.log(n); // call signature

function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}`
  },
  {
    id: 'ts-overloads',
    title: 'Function Overloads',
    summary: 'Declare multiple signatures for one function whose behavior varies by argument shape.',
    difficulty: 'intermediate',
    category: 'functions',
    keyPoints: [
      'Write several overload signatures, then ONE implementation that satisfies them all.',
      'Callers see only the overloads — the implementation signature is hidden.',
      'Useful when return/param types depend on the input combination.',
      'Order matters: put more specific overloads before broader ones.',
      'Often a union type or generics is simpler than overloads — reach for them first.'
    ],
    gotcha:
      'The implementation signature must be compatible with every overload, but it is NOT itself callable — only the declared overloads are.',
    codeSnippet: `function greet(name: string): void;
function greet(title: string, name: string): void;
function greet(a: string, b?: string): void {
  console.log(b ? \`Hello \${a} \${b}\` : \`Hello \${a}\`);
}
greet('Ada');           // ok
greet('Dr', 'Ada');     // ok`
  },

  // ─── CLASSES & OOP ───────────────────────────────────────────────────────────
  {
    id: 'ts-classes',
    title: 'Classes (vs ES6 Classes)',
    summary: 'TypeScript classes add typing and OOP features on top of standard ES6 classes.',
    difficulty: 'intermediate',
    category: 'oop',
    keyPoints: [
      'Shares ES6 features: constructor, inheritance (extends), polymorphism, encapsulation.',
      'TS adds: access modifiers (public/private/protected) and readonly properties.',
      'Field declarations without initializers (auto-undefined); typed get/set accessors.',
      'Abstract classes as non-instantiable blueprints.',
      'Parameter properties: declare + initialize a field straight from a constructor param.'
    ],
    codeSnippet: `class Example {
  readonly id: number;
  private _name = '';
  static count = 0;

  constructor(id: number) { this.id = id; }

  get name(): string { return this._name; }
  set name(v: string) { this._name = v.trim(); }
}`
  },
  {
    id: 'ts-inheritance',
    title: 'Inheritance',
    summary: 'Subclass with extends and call super(); override methods, reusing the parent via super.method().',
    difficulty: 'intermediate',
    category: 'oop',
    keyPoints: [
      'class Child extends Parent — inherits properties and methods.',
      'A subclass constructor must call super(...) before using this.',
      'Override a method by redeclaring it; call super.method() to reuse parent logic.',
      'Under the hood this is JavaScript’s prototypal inheritance.',
      'Pre-ES6 TS used the prototypal pattern (Object.create + constructor.call) directly.'
    ],
    codeSnippet: `class Animal {
  constructor(private name: string) {}
  move(m = 0) { console.log(\`\${this.name} moved \${m}m\`); }
}
class Snake extends Animal {
  move(m = 5) { console.log('Slithering…'); super.move(m); }
}
new Snake('Cobra').move(); // Slithering… Cobra moved 5m`
  },
  {
    id: 'ts-access-modifiers',
    title: 'Access Modifiers',
    summary: 'public, private, and protected control class-member visibility for encapsulation.',
    difficulty: 'basic',
    category: 'oop',
    keyPoints: [
      'public (default): accessible everywhere, inside and outside the class.',
      'private: accessible only within the declaring class.',
      'protected: accessible within the class and its subclasses (the "is-a" relationship).',
      'readonly can combine with a modifier to allow assignment only in the constructor.',
      'Enforced at COMPILE time — JS has its own runtime #private fields.'
    ],
    gotcha: 'TS private is a compile-time check and is still visible at runtime. For true runtime privacy use JS #private fields.',
    codeSnippet: `class Person {
  public name: string;
  private age: number;
  protected contact: string;
  constructor(n: string, a: number, c: string) {
    this.name = n; this.age = a; this.contact = c;
  }
}
const p = new Person('Jo', 30, 'x');
p.name;  // ✅
// p.age; // ❌ private`
  },
  {
    id: 'ts-abstract-classes',
    title: 'Abstract Classes',
    summary: 'Non-instantiable base classes that declare abstract members subclasses must implement.',
    difficulty: 'intermediate',
    category: 'oop',
    keyPoints: [
      'Declared with abstract; cannot be instantiated directly (new Shape() is an error).',
      'abstract methods have no body — subclasses must implement them.',
      'Can also contain fully implemented shared methods and static members.',
      'Use for contract enforcement + shared partial implementation across subclasses.',
      'Differs from an interface: an abstract class can carry implementation and state.'
    ],
    codeSnippet: `abstract class Shape {
  constructor(public color: string) {}
  abstract getArea(): number;           // must be implemented
  describe() { return \`A \${this.color} shape\`; } // shared
}
class Circle extends Shape {
  constructor(public r: number, color: string) { super(color); }
  getArea() { return Math.PI * this.r ** 2; }
}`
  },
  {
    id: 'ts-constructors',
    title: 'Constructors & Parameter Properties',
    summary: 'Initialize instances with constructor(); parameter properties declare + assign fields in one step.',
    difficulty: 'basic',
    category: 'oop',
    keyPoints: [
      'The constructor runs automatically on new and sets up initial state.',
      'A class has exactly one constructor (no true overloading — use optional params).',
      'Parameter properties: an access modifier on a param declares AND assigns the field.',
      'Combine readonly with a modifier for a write-once field set in the constructor.',
      'Use super(...) first in a subclass constructor.'
    ],
    codeSnippet: `// Verbose
class A { name: string; constructor(name: string) { this.name = name; } }

// Parameter properties — declare + assign in one line
class B {
  constructor(private name: string, public readonly id: number) {}
}`
  },

  // ─── CONFIG & TOOLING ────────────────────────────────────────────────────────
  {
    id: 'ts-compilation',
    title: 'Compilation & tsconfig.json',
    summary: 'tsc transpiles .ts → .js; tsconfig.json configures the target, module system, and strictness.',
    difficulty: 'intermediate',
    category: 'config',
    keyPoints: [
      'Run tsc to compile; tsc --watch recompiles on change.',
      'tsconfig.json key options: target, module, strict, outDir, rootDir, lib.',
      'include / exclude globs select which files are compiled.',
      'strict: true enables the recommended bundle of strict checks.',
      'paths + baseUrl set up import aliases; esModuleInterop eases CommonJS interop.'
    ],
    codeSnippet: `// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}`
  },
  {
    id: 'ts-strict-mode',
    title: 'Strict Mode Flags',
    summary: '"strict": true turns on a family of stricter type checks — the recommended baseline.',
    difficulty: 'intermediate',
    category: 'config',
    keyPoints: [
      'strict: true enables several flags at once.',
      'noImplicitAny: error on variables/params that implicitly become any.',
      'strictNullChecks: null and undefined are not assignable to other types unless declared.',
      'strictFunctionTypes: stricter (contravariant) function-parameter checking.',
      'noImplicitThis: error when this has an implicit any type.'
    ],
    gotcha: 'Turning on strictNullChecks in an existing codebase surfaces many latent null/undefined bugs — migrate incrementally.',
    codeSnippet: `// With strictNullChecks on:
function len(s: string) { return s.length; }
// len(null); // ❌ 'null' is not assignable to 'string'

function len2(s: string | null) {
  return s?.length ?? 0; // ✅ handle null explicitly
}`
  },

  // ─── FOCUSED SUBSET (topics 16–45 from the question bank) ────────────────────
  {
    id: 'ts-type-assertions',
    title: 'Type Assertions (as) & Casting',
    summary: 'Tell the compiler to treat a value as a specific type — a compile-time-only override, not a runtime conversion.',
    difficulty: 'intermediate',
    category: 'types',
    keyPoints: [
      'value as Type (or the older <Type>value) reinterprets the static type.',
      'No runtime effect — assertions are erased; they do NOT convert the value.',
      'as const: a const assertion that makes a literal deeply readonly and narrows it.',
      'Non-null assertion value! removes null/undefined from the type (use cautiously).',
      'Differs from runtime casting like Number(x)/String(x), which actually convert data.'
    ],
    gotcha: 'Assertions can lie: `("x" as unknown as number)` compiles but breaks at runtime. Prefer narrowing/type guards over asserting.',
    codeSnippet: `const el = document.getElementById('app') as HTMLDivElement;
const role = 'admin' as const;        // type 'admin', readonly
const value = input!;                 // assert non-null

// ❌ assertion lies — no runtime conversion happens
const n = ('5' as unknown as number) + 1; // '51' at runtime`
  },
  {
    id: 'ts-discriminated-unions',
    title: 'Discriminated Unions',
    summary: 'A union of object types sharing a literal "tag" field, enabling safe narrowing and exhaustiveness checks.',
    difficulty: 'intermediate',
    category: 'types',
    keyPoints: [
      'Each member has a common literal discriminant (e.g. kind: "circle" | "rect").',
      'Switching/branching on the tag narrows to the exact member type.',
      'The compiler then knows which member-specific properties are safe to access.',
      'Add a never default case to get a compile error if a new variant is unhandled.',
      'The idiomatic way to model "one of several shapes" safely.'
    ],
    codeSnippet: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'rect': return s.w * s.h;
    default: { const _x: never = s; return _x; } // exhaustiveness
  }
}`
  },
  {
    id: 'ts-generic-constraints',
    title: 'Generic Constraints',
    summary: 'Limit what a type parameter can be with `extends`, so you can safely use the constrained members.',
    difficulty: 'intermediate',
    category: 'generics',
    keyPoints: [
      '<T extends U> requires T to be assignable to U.',
      'Lets you safely access U’s members inside the generic body.',
      '<T, K extends keyof T> ties one parameter to the keys of another.',
      'Default type params: <T = string> when no argument is supplied.',
      'Constraints keep generics flexible without losing type safety.'
    ],
    codeSnippet: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;  // .length is safe
}

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];                      // key must be a real key of T
}`
  },
  {
    id: 'ts-decorators',
    title: 'Decorators',
    summary: 'Functions that annotate or modify classes and their members at definition time, prefixed with @.',
    difficulty: 'advanced',
    category: 'advanced',
    keyPoints: [
      'Targets: class, method, accessor, property, and parameter.',
      'A decorator runs when the class is defined — it can observe, wrap, or replace its target.',
      'Common uses: logging, dependency injection, validation, metadata (Angular, NestJS).',
      'Legacy decorators need "experimentalDecorators"; TS 5+ supports the stage-3 standard form.',
      'Multiple decorators compose bottom-up (the closest to the target runs first).'
    ],
    gotcha:
      'The legacy (experimentalDecorators) and TS 5 stage-3 decorator signatures differ — don’t mix patterns; pick one based on your tsconfig.',
    codeSnippet: `// Legacy method decorator (experimentalDecorators)
function log(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value;
  desc.value = function (...args: any[]) {
    console.log(\`\${key} called\`);
    return orig.apply(this, args);
  };
}
class Api { @log fetch() { /* ... */ } }`
  },
  {
    id: 'ts-modules-namespaces',
    title: 'Modules vs Namespaces',
    summary: 'ES modules (import/export) are the modern standard; namespaces are a legacy grouping mechanism.',
    difficulty: 'intermediate',
    category: 'modules',
    keyPoints: [
      'ES modules: one module per file, explicit import/export — the recommended approach.',
      'Namespaces (namespace X {}) group code under a single global name — legacy.',
      'Module resolution: "node" (node_modules lookup) is the common strategy.',
      'baseUrl + paths configure import aliases (e.g. "components/*").',
      'Prefer modules; reach for namespaces only for ambient/global type declarations.'
    ],
    codeSnippet: `// ES module (preferred)
export const add = (a: number, b: number) => a + b;
import { add } from './math';

// Namespace (legacy)
namespace MathUtil {
  export const add = (a: number, b: number) => a + b;
}
MathUtil.add(1, 2);`
  },
  {
    id: 'ts-declaration-files',
    title: 'Declaration Files & @types',
    summary: 'Type-only .d.ts files describe JS shapes; DefinitelyTyped publishes them under the @types scope.',
    difficulty: 'intermediate',
    category: 'modules',
    keyPoints: [
      '.d.ts files declare types with NO implementation — they only describe shapes.',
      'They let TypeScript type-check otherwise-untyped JavaScript libraries.',
      'DefinitelyTyped is the community repo of these files, published as @types/* on npm.',
      'Install with npm i -D @types/lodash; tsc auto-discovers them via typeRoots.',
      'Ship your own library types with a "types"/"typings" field in package.json.'
    ],
    codeSnippet: `// Install community types for a JS library
// npm i -D @types/lodash

// A hand-written ambient declaration (my-lib.d.ts)
declare module 'my-lib' {
  export function greet(name: string): string;
}`
  }
];
