import type { Note } from 'types/content';

export type TsReactCategory = 'typed-props' | 'typed-hooks' | 'typed-events' | 'generic-components' | 'typed-context' | 'utility-patterns';

export const tsReactNotes: Note[] = [
  // --- CATEGORY: TYPED-PROPS ---
  {
    id: 'typing-primitives',
    title: 'Typing Primitive Props',
    summary: 'Define standard primitive types like string, number, and boolean for component props.',
    difficulty: 'basic',
    category: 'typed-props',
    keyPoints: [
      'Primitive types include string, number, and boolean.',
      'TypeScript can often infer the type if a default value is passed, but defining it in a type alias or interface is standard practice for components.',
      'Using specific types prevents mistakenly passing a number when a string is expected.'
    ],
    codeSnippet: `type ButtonProps = { text: string; count: number; isActive: boolean; };`
  },
  {
    id: 'optional-props',
    title: 'Optional Props',
    summary: 'Use a question mark (?) to mark props that are not strictly required.',
    difficulty: 'basic',
    category: 'typed-props',
    keyPoints: [
      'Append a question mark to the property name to make it optional.',
      'If a prop is missing and not marked optional, TypeScript will throw a warning.',
      'React 19 recommends providing default values during destructuring rather than using defaultProps.'
    ]
  },
  {
    id: 'typing-arrays-and-tuples',
    title: 'Arrays and Tuples',
    summary: 'Define arrays or specific tuples when props require lists of data or fixed-length sets.',
    difficulty: 'intermediate',
    category: 'typed-props',
    keyPoints: [
      'Type standard arrays by adding brackets after the type (e.g., number[]).',
      'Use a Tuple if you have an exact number of elements with strict types (e.g., [number, number, number, number] for padding).',
      'Tuples protect against passing too many or too few elements to the array.'
    ]
  },
  {
    id: 'union-types-for-props',
    title: 'Union Types for Props',
    summary: 'Restrict string or number props to specific allowed values using Union Types.',
    difficulty: 'intermediate',
    category: 'typed-props',
    keyPoints: [
      'Instead of allowing any string, explicitly list allowed strings with the pipe (|) symbol.',
      'Extract these union types into separate type aliases for reusability across multiple components.'
    ],
    codeSnippet: `type Color = "red" | "blue" | "green";\ntype Props = { backgroundColor: Color };`
  },
  {
    id: 'react-node-type',
    title: 'ReactNode Type',
    summary: 'Use ReactNode for children props or anything that React is capable of rendering.',
    difficulty: 'basic',
    category: 'typed-props',
    keyPoints: [
      'ReactNode is the broadest type: it accepts primitives, elements, arrays, null, and undefined.',
      'It is the standard and correct way to type children props.'
    ],
    gotcha: 'Do not use ReactNode as a function component return type; let TypeScript infer the return type instead.',
    textbookDef: 'ReactNode is a type that describes what React can render. It is a union of every value React accepts as a child.'
  },
  {
    id: 'react-element-vs-jsx-element',
    title: 'ReactElement vs JSX.Element',
    summary: 'Understand the specific element return types in React.',
    difficulty: 'advanced',
    category: 'typed-props',
    keyPoints: [
      'ReactElement describes the object produced by JSX or createElement, containing type, props, and key.',
      'React.JSX.Element is essentially ReactElement<any, any> and is what the JSX transform infers.',
      'Unlike ReactNode, these do not include strings or numbers.'
    ]
  },
  {
    id: 'react-fc-discouraged',
    title: 'React.FC is Discouraged',
    summary: 'Avoid using React.FC or React.FunctionComponent in modern React codebases.',
    difficulty: 'intermediate',
    category: 'typed-props',
    keyPoints: [
      'React.FC implicitly types children (pre-React 18) and complicates using generics.',
      'Standard function declarations natively infer their return type as a React element.',
      'If you need to define props, simply annotate the function parameter directly.'
    ]
  },
  {
    id: 'typing-children-specifically',
    title: 'Restricting Children Types',
    summary: 'Limit what can be passed as children to a single child, a tuple, or specific elements.',
    difficulty: 'advanced',
    category: 'typed-props',
    keyPoints: [
      'You can restrict the structure to a single child or a tuple of children.',
      'You cannot strictly specify *which* components the children are (e.g., forcing only <Route> inside <Routes>) because JSX evaluates to generic elements.'
    ]
  },
  {
    id: 'typing-default-props-react-19',
    title: 'Default Props in React 19',
    summary: 'Use parameter destructuring to type and apply default props in functional components.',
    difficulty: 'intermediate',
    category: 'typed-props',
    keyPoints: [
      'React 19 removes support for defaultProps on function components.',
      'Destructuring default values in the parameter list prompts TypeScript to automatically infer the prop as optional.'
    ]
  },
  {
    id: 'suspense-props',
    title: 'Suspense Props',
    summary: 'Typing the Suspense component which expects a fallback and children.',
    difficulty: 'intermediate',
    category: 'typed-props',
    keyPoints: [
      'SuspenseProps are typed as { children?: ReactNode; fallback?: ReactNode }.',
      'The fallback can be any ReactNode, including null.'
    ]
  },
  {
    id: 'server-component-children',
    title: 'Async Server Component Children',
    summary: 'Type asynchronous Server Components that return a Promise.',
    difficulty: 'advanced',
    category: 'typed-props',
    keyPoints: [
      'ReactNode allows Promise<ReactNode> natively.',
      'A Server Component can be async and return a Promise<ReactNode>, which is unwrapped by the nearest Suspense boundary.'
    ]
  },

  // --- CATEGORY: TYPED-HOOKS ---
  {
    id: 'usestate-type-inference',
    title: 'useState Type Inference',
    summary: 'Rely on TypeScript to infer useState types for primitives automatically.',
    difficulty: 'basic',
    category: 'typed-hooks',
    keyPoints: [
      'If you pass a string, number, or boolean as the initial value, TypeScript automatically sets the type.',
      'You do not need to explicitly declare the type (e.g., <string>) unless you initialize without a value or with null.'
    ]
  },
  {
    id: 'usestate-union-null',
    title: 'useState with Null',
    summary: 'Provide explicit union types for state that begins as null.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    keyPoints: [
      'When initializing state with null (like fetching user data), explicitly type it as <User | null>.',
      'When using this state later, you must employ optional chaining (user?.name) or null checks to satisfy TypeScript.'
    ],
    codeSnippet: `const [user, setUser] = useState<User | null>(null);`
  },
  {
    id: 'useref-dom-element',
    title: 'useRef for DOM Elements',
    summary: 'Type refs assigned to HTML elements by supplying the specific HTML element type.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    keyPoints: [
      'Provide the specific element generic (e.g., HTMLButtonElement) and initialize with null.',
      'React handles the `.current` property for DOM nodes automatically.',
      'Look up lib.dom.ts to find exact HTMLElement names.'
    ]
  },
  {
    id: 'useref-mutable-value',
    title: 'useRef for Mutable Values',
    summary: 'Hold mutable values across renders by initializing with the required type.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    keyPoints: [
      "If you need a mutable variable that doesn't trigger re-renders, pass the initial value directly.",
      'React does not manage this `.current`; you update it manually.'
    ]
  },
  {
    id: 'usereducer-discriminated-unions',
    title: 'useReducer Actions',
    summary: 'Type useReducer actions using Discriminated Unions to secure state logic.',
    difficulty: 'advanced',
    category: 'typed-hooks',
    keyPoints: [
      'Create a union type for all possible actions, typically using a `type` field as the discriminant.',
      'Include a payload field specific to the action (e.g., an ID for a remove action).',
      'Explicitly define the return type of the reducer function to prevent inference errors.'
    ]
  },
  {
    id: 'useeffect-return-type',
    title: 'useEffect Return Types',
    summary: 'Ensure useEffect only returns void or a cleanup function.',
    difficulty: 'basic',
    category: 'typed-hooks',
    keyPoints: [
      'TypeScript enforces that useEffect cleanups must be functions.',
      'Take care when using arrow functions inside useEffect so you do not accidentally return a value instead of a function.'
    ]
  },
  {
    id: 'usecallback-typing',
    title: 'useCallback Argument Changes',
    summary: 'Arguments inside useCallback must be explicitly typed in React 18+.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    keyPoints: [
      'Prior to React 18, useCallback allowed arguments to implicitly default to any[].',
      'In React 18+, the function signature changed, meaning untyped callback parameters will throw an implicit any error.'
    ]
  },
  {
    id: 'useimperativehandle-react-19',
    title: 'useImperativeHandle in React 19',
    summary: 'Use the hook directly with the ref prop without needing forwardRef.',
    difficulty: 'advanced',
    category: 'typed-hooks',
    keyPoints: [
      'In React 19, ref is a regular prop on function components.',
      "useImperativeHandle is invoked directly with the component's ref prop rather than wrapping the component."
    ]
  },
  {
    id: 'custom-hooks-tuple-return',
    title: 'Custom Hooks Returning Tuples',
    summary: 'Use const assertions to prevent TypeScript from inferring a union type array.',
    difficulty: 'advanced',
    category: 'typed-hooks',
    keyPoints: [
      'When returning an array like [value, setValue], TypeScript might infer (string | function)[].',
      'Append `as const` to the returned array to explicitly create a tuple.',
      "Alternatively, explicitly set the hook's return signature."
    ],
    codeSnippet: `return [value, setValue] as const;`
  },
  {
    id: 'use-hook-promises',
    title: 'The use() Hook',
    summary: 'The new use() hook unwraps contexts or promises natively.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    keyPoints: [
      'use() replaces useContext and can be invoked inside conditionals and loops.',
      'Do not create the promise inside the component or it will trigger loops; pass it down from a parent.'
    ]
  },
  {
    id: 'usedeferredvalue-hook',
    title: 'useDeferredValue Hook',
    summary: 'Defer rendering expensive parts of the UI.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    keyPoints: [
      'Prioritizes urgent updates over non-urgent ones.',
      'React 19 introduces an optional second argument for the initial value, useful in SSR/streaming.'
    ]
  },

  // --- CATEGORY: TYPED-EVENTS ---
  {
    id: 'inlining-event-handlers',
    title: 'Inlining Event Handlers',
    summary: 'Inlined event handlers are automatically inferred contextually.',
    difficulty: 'basic',
    category: 'typed-events',
    keyPoints: [
      'If you define the callback inside the JSX element (e.g., onClick={(e) => ...}), TypeScript automatically knows the event type [44-46].',
      'This eliminates the need to explicitly import and annotate the event type.'
    ]
  },
  {
    id: 'form-event-typing',
    title: 'Form Submission Events',
    summary: 'Annotate separate form submission handlers with React.FormEvent.',
    difficulty: 'intermediate',
    category: 'typed-events',
    keyPoints: [
      'Extracted submit functions must accept `e: React.FormEvent<HTMLFormElement>`.',
      'In React 19.2.10+, FormEvent is soft-deprecated in favor of SubmitEvent.'
    ],
    gotcha: 'Leaving the event un-annotated results in an implicit `any` error.'
  },
  {
    id: 'change-event-typing',
    title: 'Input Change Events',
    summary: 'Use React.ChangeEvent for extracted input change logic.',
    difficulty: 'intermediate',
    category: 'typed-events',
    keyPoints: [
      'Use `e: React.ChangeEvent<HTMLInputElement>` for inputs.',
      'Works identically for textareas and select dropdowns by changing the specific HTML generic.'
    ]
  },
  {
    id: 'synthetic-event-fallback',
    title: 'React.SyntheticEvent',
    summary: 'Use SyntheticEvent as the base when the exact event type is unknown or unimportant.',
    difficulty: 'basic',
    category: 'typed-events',
    keyPoints: [
      'All specific React events extend SyntheticEvent.',
      'Use this if you need a quick generic fallback without tracking down specific browser events.'
    ]
  },
  {
    id: 'mouse-and-keyboard-events',
    title: 'Mouse and Keyboard Events',
    summary: 'Distinguish between different interaction events in React.',
    difficulty: 'basic',
    category: 'typed-events',
    keyPoints: [
      'MouseEvent captures pointing device clicks; KeyboardEvent captures key strokes.',
      'PointerEvent is recommended over MouseEvent for modern multi-touch and stylus support.'
    ]
  },

  // --- CATEGORY: TYPED-CONTEXT ---
  {
    id: 'basic-context-typing',
    title: 'Basic Context Types',
    summary: 'Create and type a Context provider with interfaces.',
    difficulty: 'intermediate',
    category: 'typed-context',
    keyPoints: [
      'Define an interface dictating the shape of the data and functions provided by the context.',
      'Pass the initial value when calling createContext, which infers the default type.'
    ]
  },
  {
    id: 'context-without-default',
    title: 'Context Initialized with Null',
    summary: 'Handle contexts where meaningful default values are not available immediately.',
    difficulty: 'intermediate',
    category: 'typed-context',
    keyPoints: [
      'Initialize context with null and define the type explicitly as a union (e.g., <Theme | null>).',
      'This forces consumers to check for null using optional chaining or logic guards.'
    ]
  },
  {
    id: 'context-custom-hook-throw',
    title: 'Throwing Errors for Null Context',
    summary: 'Wrap useContext in a custom hook to avoid null checks throughout the app.',
    difficulty: 'advanced',
    category: 'typed-context',
    keyPoints: [
      'If a context defaults to null, checking it everywhere is tedious.',
      'Create a custom hook that throws a runtime error if the context is accessed outside of its provider.',
      'This naturally narrows the TypeScript return type to non-null.'
    ]
  },
  {
    id: 'context-type-assertion',
    title: 'Context Type Assertion',
    summary: 'Use type assertions or empty objects to lie to the compiler on context initialization.',
    difficulty: 'advanced',
    category: 'typed-context',
    keyPoints: [
      'You can assert the initial empty value (`createContext({} as MyContext)`) to avoid null unions.',
      'You can use the non-null assertion operator (!) on initialization.',
      'Prefer throwing runtime errors via a custom hook over strict type asserting.'
    ]
  },

  // --- CATEGORY: GENERIC-COMPONENTS ---
  {
    id: 'generic-components-intro',
    title: 'Creating Generic Components',
    summary: 'Use generic type parameters to link prop relationships dynamically.',
    difficulty: 'advanced',
    category: 'generic-components',
    keyPoints: [
      'Just like generic functions, you can create generic components `<T>` for reusable type safety.',
      'Type inference usually handles passing the generic automatically based on the props.',
      'Arrow functions require a trailing comma `<T,>` to differentiate from JSX tags.'
    ]
  },
  {
    id: 'polymorphic-components',
    title: 'Polymorphic Components',
    summary: 'Render components dynamically using an "as" prop.',
    difficulty: 'advanced',
    category: 'generic-components',
    keyPoints: [
      'Use ElementType to accept components or native HTML tags to be rendered dynamically.',
      'Often used for design systems (e.g., a Button that renders as an <a> tag when passed an href).'
    ]
  },
  {
    id: 'generic-components-refs',
    title: 'Generic Components with Refs',
    summary: 'Handling refs inside of a generic component manually.',
    difficulty: 'advanced',
    category: 'generic-components',
    keyPoints: [
      'Generics prevent automatic ref type inference natively.',
      'A simple workaround is extracting the ref to a custom prop, manually passing it rather than using true forwardRef.',
      'Complex library implementations can use a call signature approach.'
    ]
  },

  // --- CATEGORY: UTILITY-PATTERNS ---
  {
    id: 'types-vs-interfaces',
    title: 'Types vs Interfaces',
    summary: 'Understand the fundamental differences and best practices for aliases and interfaces.',
    difficulty: 'basic',
    category: 'utility-patterns',
    keyPoints: [
      'Rule of thumb: "Use Interface until You Need Type".',
      'Interfaces can be augmented (declaration merging), making them best for public APIs and libraries.',
      'Type aliases support unions, mapped types, and primitives, making them ideal for rigid component props.'
    ],
    textbookDef:
      'Types are useful for union types whereas Interfaces are better for declaring dictionary shapes and then implementing or extending them.'
  },
  {
    id: 'extending-interfaces',
    title: 'Extending Interfaces',
    summary: 'Combine existing shapes using the extends keyword.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'Use the `extends` keyword in an interface to inherit all properties from another interface.',
      'Type aliases achieve a similar outcome using the intersection (`&`) operator.'
    ]
  },
  {
    id: 'object-type-misunderstanding',
    title: 'The "object" Type',
    summary: 'Avoid the "object" type unless you strictly mean "any non-primitive type".',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'The `object` type does not mean "any object"; it explicitly means anything that is NOT a string, number, boolean, symbol, null, or undefined.',
      'It is rarely what you intend to use when defining React props.'
    ]
  },
  {
    id: 'empty-interface-misunderstanding',
    title: 'Empty Interface and Object Traps',
    summary: 'Understand that {} and Object represent "any non-nullish value".',
    difficulty: 'advanced',
    category: 'utility-patterns',
    keyPoints: [
      'Using `{}` or `Object` does not represent an empty object; it means literally any value except null or undefined.',
      'To strictly define an empty object, use `Record<string, never>`.'
    ]
  },
  {
    id: 'css-properties',
    title: 'Typing CSS Properties',
    summary: 'Use CSSProperties to safely type inline style objects.',
    difficulty: 'basic',
    category: 'utility-patterns',
    keyPoints: [
      'CSSProperties extends csstype, providing autocomplete and validation for standard CSS properties.',
      'For length-like properties, React assumes pixels automatically when passed a number.',
      'Vendor prefixes must be written in PascalCase without leading hyphens.'
    ]
  },
  {
    id: 'css-custom-properties-vars',
    title: 'CSS Custom Properties (Variables)',
    summary: 'Handle the lack of index signatures for CSS variables.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'CSSProperties deliberately rejects unknown `--*` properties.',
      'Use a type assertion (as React.CSSProperties), or intersect CSSProperties with an indexed type.',
      'For fixed design systems, augment the CSSProperties module directly.'
    ]
  },
  {
    id: 'wrapping-html-elements',
    title: 'Wrapping HTML Elements',
    summary: 'Extend native HTML elements while allowing all native DOM attributes.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'Use `ComponentPropsWithoutRef<"button">` to extract all native props.',
      'Use `ComponentPropsWithRef` if your component forwards a ref to the inner element.',
      'Scoop up the rest of the props using the JavaScript rest operator (`...rest`) to spread them on the element.'
    ]
  },
  {
    id: 'wrapping-html-elements-bad-types',
    title: 'Incorrect HTML Wrapper Types',
    summary: 'Avoid React.HTMLProps and React.HTMLAttributes when wrapping.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    keyPoints: [
      '`React.HTMLProps` infers types too widely (e.g., allowing strings for the button type attribute) because it uses AllHTMLAttributes.',
      '`React.HTMLAttributes` drops important element-specific attributes entirely (like `type` on a button).'
    ]
  },
  {
    id: 'omit-utility',
    title: 'The Omit Utility',
    summary: 'Remove specific keys from a type or interface to override them.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'Use `Omit<Type, "key">` to strip out an existing property from an extended interface or component prop.',
      'This is highly useful when wrapping elements but providing your own rigid definition for a prop like "label".'
    ]
  },
  {
    id: 'as-const-assertions',
    title: 'Const Assertions',
    summary: 'Use as const to lock down array and object types precisely.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'Normally, defining an array of strings evaluates to `string[]`.',
      'Appending `as const` locks the array as readonly and forces TypeScript to evaluate the exact values (e.g., specific string literal types).'
    ]
  },
  {
    id: 'discriminated-unions-props',
    title: 'Discriminated Unions for Props',
    summary: 'Create conditional props that alter the component signature.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    keyPoints: [
      'You can create multiple versions of a component interface based on a discriminative value (e.g., if rendering as an anchor, require href).',
      'TypeScript narrows the specific union branch based on the value of the key during type guards.'
    ]
  },
  {
    id: 'props-pass-all-or-nothing',
    title: 'Pass All or Nothing Props',
    summary: 'Enforce that a set of props is either completely provided or entirely omitted.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    keyPoints: [
      'You can use a union combining all properties with `Record<string, never>` to simulate all-or-nothing.',
      'Alternatively, group all related requirements inside an optional secondary object.'
    ]
  },
  {
    id: 'props-mutually-exclusive',
    title: 'Mutually Exclusive Props',
    summary: 'Prevent users from passing two conflicting props at once.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    keyPoints: [
      'Use the `never` type paired with optionality in a discriminated union.',
      'This forces the compiler to error if a developer tries to pass `propA` and `propB` on the same component.'
    ]
  },
  {
    id: 'extract-component-props',
    title: 'Extract Component Props',
    summary: 'Extract prop types from external or unexported components.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    keyPoints: [
      'If a library fails to export its prop types, use `React.ComponentProps<typeof MyComponent>`.',
      'This mirrors the exact internal props of the target.'
    ]
  },
  {
    id: 'forward-ref-legacy',
    title: 'forwardRef (Legacy)',
    summary: 'Forward refs to child components in React 18 and below.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'In React 18 and older, wrap the component in `forwardRef` to pass ref handles down to native DOM elements.',
      'The ref object provided by forwardRef is mutable by default.'
    ]
  },
  {
    id: 'ref-as-prop-react-19',
    title: 'Ref as a Prop in React 19',
    summary: 'Access the ref directly as a standard prop.',
    difficulty: 'basic',
    category: 'utility-patterns',
    keyPoints: [
      'React 19 removes the need to use the `forwardRef` wrapper.',
      'Treat the ref exactly like a normal prop and pass it directly down to the internal component.'
    ]
  },
  {
    id: 'unknown-vs-any',
    title: 'Unknown vs Any API Types',
    summary: 'Use unknown instead of any when dealing with unparsed API data.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      '`any` shuts off TypeScript entirely, leading to unchecked runtime bugs.',
      '`unknown` forces you to validate the shape (often via a validation schema like Zod) before you can access properties on the object.'
    ]
  },
  {
    id: 'typescript-enums',
    title: 'TypeScript Enums',
    summary: 'Restrict variables to a specific dictionary of values.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    keyPoints: [
      'Create an enum when dealing with a closed-ended list (like specific countries).',
      'Enums force users to pick from the exact declared constants rather than allowing free-form strings.'
    ]
  },
  {
    id: 'starttransition-standalone',
    title: 'startTransition',
    summary: 'Run non-urgent UI updates externally from components.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    keyPoints: [
      'The standalone startTransition can be used in non-React code or outside of a component hierarchy.',
      'It does not provide an isPending flag; use the `useTransition` hook if you need to track the pending state.'
    ]
  }
];
