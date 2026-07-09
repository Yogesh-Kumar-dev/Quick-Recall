import type { Note } from '@/types/content';

export type TsReactCategory = 'typed-props' | 'typed-hooks' | 'typed-events' | 'generic-components' | 'typed-context' | 'utility-patterns';

export const tsReactNotes: Note[] = [
  // --- CATEGORY: TYPED-PROPS ---
  {
    id: 'typing-primitives',
    title: 'Typing Primitive Props',
    summary: 'Define standard primitive types like string, number, and boolean for component props.',
    difficulty: 'basic',
    category: 'typed-props',
    prerequisites: ['ts-basic-types'],
    keyPoints: [
      'Primitive prop types are string, number, and boolean, the same three primitives used everywhere else in TypeScript.',
      'TypeScript can infer a type from a default value during destructuring, but writing an explicit type alias or interface for the props object is still standard practice because it documents the component contract.',
      'Keeping a prop narrow, a specific primitive rather than a loose union, catches the common bug of passing a number where a formatted string label was expected.',
      'Group related primitive props into one named type, such as ButtonProps, rather than inlining them, so the shape can be reused, exported, and referenced from tests or a component catalogue.'
    ],
    codeSnippet: `type ButtonProps = {
  text: string;
  count: number;
  isActive: boolean;
};

function Button({ text, count, isActive }: ButtonProps) {
  return <button disabled={!isActive}>{text} ({count})</button>;
}`
  },
  {
    id: 'optional-props',
    title: 'Optional Props',
    summary: 'Use a question mark (?) to mark props that are not strictly required.',
    difficulty: 'basic',
    category: 'typed-props',
    prerequisites: ['typing-primitives'],
    keyPoints: [
      'Append a question mark to a property name, such as label?: string, to tell TypeScript that a prop may be omitted by the caller.',
      'If a prop is missing at the call site and it was not marked optional, TypeScript raises a compile error instead of letting the component silently receive undefined.',
      'React 19 removed defaultProps for function components, so the idiomatic way to give an optional prop a fallback is to destructure it with a default in the parameter list, for example { size = "medium" }: Props.',
      'Destructuring a default value also lets TypeScript infer the prop as optional even before the question mark is added, though writing both keeps the contract explicit for readers.',
      'Reserve optional props for genuinely optional behaviour, if a prop is always required for the component to render correctly, keep it required so misuse fails at compile time instead of producing a broken UI.'
    ],
    gotcha:
      'Marking a prop optional does not mean its value stays possibly undefined everywhere inside the component, once a default is assigned during destructuring, the local variable narrows back to the non-optional type.',
    codeSnippet: `type AlertProps = {
  message: string;
  variant?: 'info' | 'warning' | 'error';
};

function Alert({ message, variant = 'info' }: AlertProps) {
  return <div className={variant}>{message}</div>;
}`
  },
  {
    id: 'typing-arrays-and-tuples',
    title: 'Arrays and Tuples',
    summary: 'Define arrays or specific tuples when props require lists of data or fixed-length sets.',
    difficulty: 'intermediate',
    category: 'typed-props',
    prerequisites: ['typing-primitives'],
    keyPoints: [
      'Type a standard array prop by appending brackets to the element type, for example number[] or the equivalent Array<number>.',
      'Use a tuple when a prop needs an exact number of elements with a specific type in each position, such as a four-value padding tuple for top, right, bottom, and left.',
      'Tuples reject arrays with the wrong length at compile time, so a caller cannot accidentally pass three padding values instead of four.',
      'Named tuple elements improve editor tooltips without changing the runtime shape at all.',
      'Prefer a plain array when the length is genuinely open-ended, and reserve tuples for fixed-shape data like coordinate pairs or RGB triples.'
    ],
    codeSnippet: `type Padding = [top: number, right: number, bottom: number, left: number];

type BoxProps = {
  tags: string[];
  padding: Padding;
};

const box: BoxProps = { tags: ['sale'], padding: [8, 16, 8, 16] };`
  },
  {
    id: 'union-types-for-props',
    title: 'Union Types for Props',
    summary: 'Restrict string or number props to specific allowed values using Union Types.',
    difficulty: 'intermediate',
    category: 'typed-props',
    prerequisites: ['union-intersection'],
    keyPoints: [
      'Instead of allowing any string, list the exact allowed values separated by the pipe (|) symbol to create a union type.',
      'This turns a typo like "sucess" instead of "success" into a compile-time error rather than a silent runtime bug.',
      'Extract the union into a named type alias, such as type Variant = "primary" | "secondary", so it can be imported and reused across every component that needs the same set of values.',
      'Union props pair naturally with a switch statement or a lookup object inside the component that maps each literal value to its styling or behaviour.',
      'Keep the union exhaustive, adding a never-typed default case in a switch flags every branch that forgot to handle a newly added variant.'
    ],
    codeSnippet: `type Color = 'red' | 'blue' | 'green';
type Props = { backgroundColor: Color };`
  },
  {
    id: 'react-node-type',
    title: 'ReactNode Type',
    summary: 'Use ReactNode for children props or anything that React is capable of rendering.',
    difficulty: 'basic',
    category: 'typed-props',
    keyPoints: [
      'ReactNode is the broadest type React exposes for renderable content, a union including elements, strings, numbers, arrays, fragments, portals, booleans, null, and undefined.',
      'It is the standard, correct type for a children prop, because children can legitimately be plain text, a single element, a list of elements, or nothing at all.',
      'Because ReactNode already includes null and undefined, writing ReactNode | null | undefined by hand is rarely necessary.',
      'Reach for ReactNode whenever accepting renderable content as a prop, and reserve the narrower ReactElement for cases that specifically need an actual element object.'
    ],
    gotcha:
      'Do not use ReactNode as a function component own return type annotation, let TypeScript infer the return type instead, the two describe different things: what a component returns versus what ReactNode as a prop accepts.',
    textbookDef: 'ReactNode is a type that describes what React can render. It is a union of every value React accepts as a child.'
  },
  {
    id: 'react-element-vs-jsx-element',
    title: 'ReactElement vs JSX.Element',
    summary: 'Understand the specific element return types in React.',
    difficulty: 'advanced',
    category: 'typed-props',
    prerequisites: ['react-node-type'],
    keyPoints: [
      'ReactElement describes the plain object produced at runtime by JSX or by calling createElement directly, it carries a type field, a props field, and a key field.',
      'React.JSX.Element, what most codebases just call JSX.Element, is effectively ReactElement<any, any>, and it is the type the JSX transform infers automatically for angle-bracket syntax.',
      'Unlike ReactNode, neither ReactElement nor JSX.Element includes strings, numbers, booleans, arrays, or null, so both are much narrower and stricter.',
      'Use ReactElement, optionally with its two generics for prop and type parameters, when a function specifically needs to guarantee the value is a single rendered element object, for example utility code that inspects or clones one child.',
      'Most component authors reach for ReactNode for props and let TypeScript infer JSX.Element for return types, ReactElement shows up mostly around React.Children and cloneElement.'
    ]
  },
  {
    id: 'react-fc-discouraged',
    title: 'React.FC is Discouraged',
    summary: 'Avoid using React.FC or React.FunctionComponent in modern React codebases.',
    difficulty: 'intermediate',
    category: 'typed-props',
    prerequisites: ['typing-primitives'],
    keyPoints: [
      'React.FC, and its longer alias React.FunctionComponent, used to implicitly type children as optional even for components that never accepted children, which produced confusing and inaccurate prop types.',
      'It also makes writing a generic component awkward, because the generic parameter has nowhere natural to live on a React.FC<Props> type alias.',
      'A plain function declaration with an explicitly typed props parameter infers its own JSX return type correctly, without either downside, and is now the community-recommended pattern.',
      'Annotate props directly on the function parameter rather than wrapping the whole component type, function Card(props: CardProps) is preferred over const Card: React.FC<CardProps>.'
    ],
    codeSnippet: `// Discouraged
const Card: React.FC<CardProps> = ({ title }) => <h2>{title}</h2>;

// Preferred
function Card({ title }: CardProps) {
  return <h2>{title}</h2>;
}`
  },
  {
    id: 'typing-children-specifically',
    title: 'Restricting Children Types',
    summary: 'Limit what can be passed as children to a single child, a tuple, or specific elements.',
    difficulty: 'advanced',
    category: 'typed-props',
    prerequisites: ['react-node-type'],
    keyPoints: [
      'You can restrict the structure beyond the broad ReactNode, for example typing children as a single ReactElement to require exactly one child, or as a tuple to require a fixed sequence of children.',
      'This is useful for compound components where structure matters, like a Tabs component that expects exactly a header and a panel as its two children.',
      'You cannot strictly restrict children to a specific component type at the type level, for example forcing only <Route> elements inside <Routes>, because JSX always evaluates down to the generic ReactElement shape and TypeScript cannot see which component function produced it.',
      'In practice teams enforce "only these children are allowed" with a runtime check on element.type rather than relying purely on the type system.',
      'Overly strict children typing can make a component brittle to refactors, only reach for it when the component contract genuinely depends on a fixed structure.'
    ]
  },
  {
    id: 'typing-default-props-react-19',
    title: 'Default Props in React 19',
    summary: 'Use parameter destructuring to type and apply default props in functional components.',
    difficulty: 'intermediate',
    category: 'typed-props',
    prerequisites: ['optional-props'],
    keyPoints: [
      'React 19 removed support for the static defaultProps field on function components entirely, components that still assign it will simply have the defaults ignored.',
      'The replacement pattern is a default value directly in the function signature, for example function Badge({ color = "gray" }: BadgeProps).',
      'Destructuring a default value also automatically makes TypeScript treat that prop as optional at the call site, even before the type alias is touched.',
      'Class components still support the older defaultProps field, this change affects only function components, which make up the vast majority of modern React code.',
      'Keep the prop type alias marked optional as well as the runtime default, so the contract is documented in one place even though the default itself lives in the function signature.'
    ],
    codeSnippet: `type BadgeProps = { label: string; color?: 'gray' | 'green' | 'red' };

function Badge({ label, color = 'gray' }: BadgeProps) {
  return <span className={color}>{label}</span>;
}`
  },
  {
    id: 'suspense-props',
    title: 'Suspense Props',
    summary: 'Typing the Suspense component which expects a fallback and children.',
    difficulty: 'intermediate',
    category: 'typed-props',
    prerequisites: ['react-node-type'],
    keyPoints: [
      'SuspenseProps are typed as { children?: ReactNode; fallback?: ReactNode }, both optional, both able to hold anything React can render.',
      'The fallback is shown while any lazily-loaded child or suspended async boundary underneath it is still resolving, and it can be as simple as null for no visible placeholder.',
      'Because fallback and children are both typed as ReactNode, a spinner component, plain text, or a whole tree of elements can be passed as the fallback without any special typing gymnastics.',
      'Suspense itself does not accept an onError-style prop, error handling for suspended children still goes through a separate error boundary component.'
    ]
  },
  {
    id: 'server-component-children',
    title: 'Async Server Component Children',
    summary: 'Type asynchronous Server Components that return a Promise.',
    difficulty: 'advanced',
    category: 'typed-props',
    prerequisites: ['react-node-type', 'suspense-props'],
    keyPoints: [
      'ReactNode natively includes Promise<ReactNode> in its union, which is what makes it possible to type an async Server Component return value without an extra utility type.',
      'A Server Component function can be declared async and return a Promise<ReactNode>, the nearest Suspense boundary automatically unwraps that promise while it renders the fallback.',
      'This applies only on the server, an async component cannot be rendered directly as a Client Component, the browser has no equivalent mechanism to suspend rendering on an unresolved promise passed down as JSX.',
      'Typing the props of an async Server Component works exactly like any other component, the async part only changes the return type, not the parameter types.'
    ]
  },
  {
    id: 'propswithchildren-utility',
    title: 'The PropsWithChildren<P> Utility Type',
    summary: 'A built-in utility that adds an optional children field to an existing props type, saving you from writing it out by hand.',
    difficulty: 'basic',
    category: 'typed-props',
    prerequisites: ['react-node-type', 'typing-children-specifically'],
    keyPoints: [
      'PropsWithChildren<P> takes an existing props type P and returns a new type identical to P but with an additional children?: ReactNode field merged in.',
      'It saves writing { children?: ReactNode } inline on every component that accepts children, which matters most on components with several other props already listed in the interface.',
      'The main gotcha is that PropsWithChildren always makes children optional, if a component genuinely cannot render sensibly without children, such as a Modal that requires body content, declare children: ReactNode directly in the props type instead.',
      'It is used the same way any other generic type is wrapped, PropsWithChildren<CardProps> rather than manually intersecting CardProps with a children field.',
      'This utility mattered more before React 18 stopped implicitly typing children on plain function components, today it mostly saves a small amount of boilerplate rather than closing a real inference gap.'
    ],
    gotcha:
      'PropsWithChildren<P> always makes children optional, wrapping a props type in it does not let children become required, for a component where children must always be provided, declare children: ReactNode directly instead.',
    codeSnippet: `type CardProps = PropsWithChildren<{ title: string }>;
// equivalent to: { title: string; children?: ReactNode }

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}`
  },

  // --- CATEGORY: TYPED-HOOKS ---
  {
    id: 'usestate-type-inference',
    title: 'useState Type Inference',
    summary: 'Rely on TypeScript to infer useState types for primitives automatically.',
    difficulty: 'basic',
    category: 'typed-hooks',
    prerequisites: ['ts-type-inference', 'use-state'],
    keyPoints: [
      'Passing a string, number, or boolean as useState initial value lets TypeScript infer the state type automatically from that literal, no annotation needed.',
      'An explicit generic, useState<string>(...), is only needed when the initial value does not fully describe every value the state could later hold, most commonly when initializing with null, undefined, or an empty array.',
      'Inference flows through the setter function too, so setCount only accepts numbers when the initial value made count a number.',
      'Over-annotating a straightforward primitive, writing useState<number>(0) when 0 already infers number, is harmless but adds noise, most style guides prefer relying on inference here.'
    ]
  },
  {
    id: 'usestate-union-null',
    title: 'useState with Null',
    summary: 'Provide explicit union types for state that begins as null.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['usestate-type-inference'],
    keyPoints: [
      'When state legitimately starts out empty, for example a user record that has not been fetched yet, initialize it as null and explicitly widen the generic to a union like useState<User | null>(null).',
      'Without the explicit union, TypeScript infers the type as strictly null from the initial value, and a real User object can never be assigned to it later.',
      'Every place that reads this state afterward must handle the null branch, typically with optional chaining (user?.name) or an early-return guard before accessing properties.',
      'The same pattern applies to any state that starts as "not yet loaded", arrays that begin empty do not need this treatment since an empty array is still a valid array of the intended type.'
    ],
    gotcha:
      'Forgetting the explicit generic when initializing with null locks the state to the type null forever, TypeScript then rejects any later setUser(realUser) call.',
    codeSnippet: `const [user, setUser] = useState<User | null>(null);`
  },
  {
    id: 'useref-dom-element',
    title: 'useRef for DOM Elements',
    summary: 'Type refs assigned to HTML elements by supplying the specific HTML element type.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['use-ref'],
    keyPoints: [
      'Supply the specific element generic, useRef<HTMLButtonElement>(null), and initialize with null, that null initial value tells React the ref targets a DOM node rather than an arbitrary mutable value.',
      'React itself assigns the .current property once the element mounts, this is never set manually for a DOM ref.',
      'Look up the exact element interface name in lib.dom.ts, HTMLInputElement, HTMLDivElement, HTMLAnchorElement and so on, rather than guessing, the wrong element type rejects methods the real DOM node actually has.',
      'Reading ref.current requires a null check before use, because the ref is null on the very first render before the DOM node exists.'
    ],
    codeSnippet: `function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = () => inputRef.current?.focus();
  return <input ref={inputRef} />;
}`
  },
  {
    id: 'useref-mutable-value',
    title: 'useRef for Mutable Values',
    summary: 'Hold mutable values across renders by initializing with the required type.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['use-ref'],
    keyPoints: [
      'When a ref holds a plain mutable value rather than a DOM node, such as a timer id or a counter that survives re-renders without triggering them, pass the initial value directly instead of null.',
      'React does not manage this .current the way it does for DOM refs, it is read and written manually and never causes a re-render.',
      'The generic is usually inferred automatically from the initial value, an explicit annotation is only needed if the ref later holds a wider type than that initial value suggests, for example useRef<number | undefined>(undefined).',
      'Because mutating ref.current does not re-render the component, it is the wrong tool for anything the UI needs to reflect, use state for that instead.'
    ]
  },
  {
    id: 'usereducer-discriminated-unions',
    title: 'useReducer Actions',
    summary: 'Type useReducer actions using Discriminated Unions to secure state logic.',
    difficulty: 'advanced',
    category: 'typed-hooks',
    prerequisites: ['ts-discriminated-unions', 'use-reducer'],
    keyPoints: [
      'Model every possible action as a member of a discriminated union, typically using a literal type field as the discriminant, for example { type: "increment" } | { type: "set"; payload: number }.',
      'Each union member can carry its own payload shape specific to that action, so an increment action needs no extra data while a set action requires a numeric payload.',
      'Switching on action.type inside the reducer narrows the action to the exact member, giving compile-time safe access to that member payload without any manual casting.',
      'Explicitly annotate the reducer function return type as the state type, this catches a common mistake where one branch of the switch forgets to return the full state shape.',
      'Add a default case that assigns the narrowed action to a variable typed never, that produces a compile error the moment a new action variant is added but not handled anywhere.'
    ],
    codeSnippet: `type Action =
  | { type: 'increment' }
  | { type: 'set'; payload: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'set': return action.payload;
  }
}`
  },
  {
    id: 'useeffect-return-type',
    title: 'useEffect Return Types',
    summary: 'Ensure useEffect only returns void or a cleanup function.',
    difficulty: 'basic',
    category: 'typed-hooks',
    prerequisites: ['use-effect'],
    keyPoints: [
      'TypeScript enforces that a useEffect callback returns either nothing (void) or a cleanup function, any other return type is a compile error.',
      'The most common way to break this rule by accident is returning the result of an async call directly from an arrow function body instead of calling it and returning nothing.',
      'Because of this restriction, the callback passed to useEffect can never itself be declared async, an async function always returns a Promise, which is not a valid cleanup type.',
      'To run async logic inside an effect, define an inner async function and call it, without returning its promise from the effect callback.'
    ],
    codeSnippet: `useEffect(() => {
  let cancelled = false;
  async function load() {
    const data = await fetchUser();
    if (!cancelled) setUser(data);
  }
  load();
  return () => { cancelled = true; };
}, []);`
  },
  {
    id: 'usecallback-typing',
    title: 'useCallback Argument Changes',
    summary: 'Arguments inside useCallback must be explicitly typed in React 18+.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['use-memo-callback'],
    keyPoints: [
      'Before React 18, useCallback type definitions allowed untyped parameters to silently fall back to any[], hiding real bugs.',
      'In React 18 and later, the type definitions tightened, an untyped parameter inside a useCallback callback now produces an implicit any error under strict mode, the same as any other function.',
      'The fix is simply to type the callback parameters explicitly, exactly as you would for a normal named function.',
      'This mainly surfaces during an upgrade to newer React types, existing code that relied on the looser inference suddenly shows new errors even though runtime behaviour did not change.'
    ],
    codeSnippet: `const handleSelect = useCallback((id: number) => {
  setSelectedId(id);
}, []);`
  },
  {
    id: 'useimperativehandle-react-19',
    title: 'useImperativeHandle in React 19',
    summary: 'Use the hook directly with the ref prop without needing forwardRef.',
    difficulty: 'advanced',
    category: 'typed-hooks',
    prerequisites: ['ref-as-prop-react-19'],
    keyPoints: [
      'In React 19, ref became a regular prop that any function component can accept directly, so useImperativeHandle no longer needs to be paired with a forwardRef wrapper.',
      'Call useImperativeHandle with the component own ref prop as the first argument, and a factory function returning the object the parent should see through that ref as the second argument.',
      'The generic on the ref type should describe the shape of the imperative handle being exposed, not the underlying DOM element, since the parent only ever sees the object the factory function returns.',
      'This mainly matters for design-system components that need to expose imperative methods, focus, scrollIntoView, reset, to a parent while keeping internal DOM structure private.'
    ],
    codeSnippet: `type InputHandle = { focus(): void };

function FancyInput({ ref }: { ref: React.Ref<InputHandle> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }));
  return <input ref={inputRef} />;
}`
  },
  {
    id: 'custom-hooks-tuple-return',
    title: 'Custom Hooks Returning Tuples',
    summary: 'Use const assertions to prevent TypeScript from inferring a union type array.',
    difficulty: 'advanced',
    category: 'typed-hooks',
    prerequisites: ['as-const-assertions', 'custom-hooks'],
    keyPoints: [
      'Returning a plain array literal like [value, setValue] from a custom hook, TypeScript widens the default inference to an array type such as (string | Dispatch<SetStateAction<string>>)[], losing the fact that the first element is always a string and the second is always the setter.',
      'Appending as const to the returned array locks each position type in place and marks the array readonly, turning it into a genuine tuple that destructures correctly at every call site.',
      'The alternative is to explicitly annotate the hook return type as a tuple type, which achieves the same result without touching the return statement itself.',
      'Prefer as const for hooks with a small, fixed number of returned values, and prefer returning a named object for hooks with several optional or rarely-destructured values, since object destructuring never has this ordering problem.'
    ],
    codeSnippet: `return [value, setValue] as const;`
  },
  {
    id: 'use-hook-promises',
    title: 'The use() Hook',
    summary: 'The new use() hook unwraps contexts or promises natively.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['use-context'],
    keyPoints: [
      'The use() API can read the value out of a context or unwrap a promise, and unlike other hooks it can be called conditionally, inside loops, or after an early return, which is not allowed for useContext or useState.',
      'When used to unwrap a promise, use() suspends the component until that promise resolves, letting the nearest Suspense boundary show a fallback in the meantime, similar to an async Server Component.',
      'Do not create the promise inside the component body on every render, that produces a brand new pending promise each time and triggers an infinite suspend loop, the promise should be created once and passed down from a parent instead.',
      'Typing use() needs no extra work beyond what the value already carries, use(context) resolves to the context value type, and use(promise) resolves to the promise resolved value type.'
    ],
    gotcha:
      'Creating the promise passed to use() inline during render, rather than caching or hoisting it, produces a fresh pending promise on every render and an infinite suspend loop.'
  },
  {
    id: 'usedeferredvalue-hook',
    title: 'useDeferredValue Hook',
    summary: 'Defer rendering expensive parts of the UI.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['use-memo-callback'],
    keyPoints: [
      'useDeferredValue lets React prioritise more urgent updates, like typing into an input, ahead of a slower, deferred re-render of a value derived from that input.',
      'The hook is generically typed on the value passed in, so useDeferredValue<string>(query) returns a string, usually inferred automatically from the argument with no manual annotation.',
      'React 19 adds an optional second argument for an initial value to use during the very first render, especially useful for SSR and streaming where there is no previous render to defer from.',
      'It does not debounce or throttle anything on a timer, it defers the associated re-render priority, the actual delay depends on what else is happening on the main thread.'
    ]
  },
  {
    id: 'usememo-typing',
    title: 'Typing useMemo Correctly',
    summary: 'Make sure useMemo inferred return type reflects the real computed value, not an accidental any.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['use-memo-callback', 'ts-functions'],
    keyPoints: [
      'useMemo infers its return type from whatever the compute callback returns, if that callback has an implicit any somewhere inside it, a common trap when working with untyped JSON or a loosely-typed library call, the memoized value silently becomes any and every downstream usage loses type checking.',
      'The safest fix is to give the callback itself an explicit return type annotation, so TypeScript checks the body against that type rather than inferring from whatever the body happens to produce.',
      'The generic can also be supplied explicitly on useMemo itself, achieving the same guarantee from the outside rather than annotating the inner function.',
      'A frequent real-world case is memoizing the result of JSON.parse or a third-party function typed as any, without an explicit annotation the any silently spreads to the memoized value and beyond.',
      'Prefer annotating the callback return type over widening the dependency array or reaching for a type assertion, an assertion can lie about the shape while an explicit return type is checked against the actual computation.'
    ],
    gotcha:
      'An explicit return type on useMemo only constrains the declared return type, it does not verify the dependency array is complete, that check belongs to a lint rule such as exhaustive-deps, not the type checker.',
    codeSnippet: `// Silently becomes 'any' if parseConfig() returns any
const config = useMemo(() => parseConfig(raw), [raw]);

// Explicit return type on the callback catches mismatches
const config = useMemo((): AppConfig => parseConfig(raw), [raw]);`
  },
  {
    id: 'usestate-lazy-initializer',
    title: 'useState with a Lazy Initializer',
    summary: 'Pass a function to useState to defer an expensive computation to the first render only, and type it correctly.',
    difficulty: 'intermediate',
    category: 'typed-hooks',
    prerequisites: ['usestate-type-inference'],
    keyPoints: [
      'Passing useState(() => expensiveInit()) instead of useState(expensiveInit()) means the initializer function only runs once, on the first render, rather than being recomputed and discarded on every re-render.',
      'TypeScript infers the state type from the lazy initializer return type the same way it infers from a plain value, so useState(() => 0) is still inferred as number without any extra annotation.',
      'The explicit generic becomes necessary when the lazy initializer inferred return type is narrower or less specific than what the state will actually hold later, the same situation as initializing with null, just wrapped in a function.',
      'A common trap is an initializer returning a specific literal or a partially-inferred shape, for example an empty array literal, which infers as never[], the state then cannot later accept the broader values it was meant to hold.',
      'Reach for the lazy initializer form specifically when the initial value is expensive to compute, such as parsing localStorage or running a heavy default calculation, for a cheap literal like 0 or an empty string there is no performance benefit and the plain value form is simpler.'
    ],
    codeSnippet: `// Runs expensiveInit() on every render, then discards the result , wasteful
const [state, setState] = useState(expensiveInit());

// Runs only once, on mount
const [state, setState] = useState(() => expensiveInit());

// Explicit generic needed, an empty array alone would infer 'never[]'
const [items, setItems] = useState<Item[]>(() => loadCachedItems() ?? []);`
  },

  // --- CATEGORY: TYPED-EVENTS ---
  {
    id: 'inlining-event-handlers',
    title: 'Inlining Event Handlers',
    summary: 'Inlined event handlers are automatically inferred contextually.',
    difficulty: 'basic',
    category: 'typed-events',
    keyPoints: [
      'Defining the callback inside the JSX element, for example onClick={(e) => ...}, lets TypeScript infer the event type contextually from the element and the attribute name, no manual annotation needed.',
      'This is the simplest and least error-prone way to handle events, the compiler already knows a button onClick receives a MouseEvent<HTMLButtonElement> and types the parameter accordingly.',
      'The moment that same handler is extracted into a separate named function outside the JSX, the context is lost and the parameter must be typed manually.',
      'Prefer inlining short handlers for this reason, and only extract a handler into a standalone function once it grows complex enough to need one, at which point the event type is annotated explicitly.'
    ]
  },
  {
    id: 'form-event-typing',
    title: 'Form Submission Events',
    summary: 'Annotate separate form submission handlers with React.FormEvent.',
    difficulty: 'intermediate',
    category: 'typed-events',
    prerequisites: ['inlining-event-handlers'],
    keyPoints: [
      'An extracted form submit handler must be typed explicitly as e: React.FormEvent<HTMLFormElement>, outside the inline JSX context TypeScript has no way to infer which element the event belongs to.',
      'The typical first line inside the handler is e.preventDefault(), which stops the browser default full-page navigation on submit.',
      'As of React 19.2.10 and later, FormEvent is soft-deprecated in favour of the newer SubmitEvent type for the submit handler specifically, existing code using FormEvent still compiles but newer code should prefer SubmitEvent where available.',
      'Leaving the parameter un-annotated triggers an implicit any error under strict mode, the most common way this mistake surfaces during code review.'
    ],
    gotcha: 'Leaving the event un-annotated results in an implicit `any` error.'
  },
  {
    id: 'change-event-typing',
    title: 'Input Change Events',
    summary: 'Use React.ChangeEvent for extracted input change logic.',
    difficulty: 'intermediate',
    category: 'typed-events',
    prerequisites: ['form-event-typing'],
    keyPoints: [
      'Use e: React.ChangeEvent<HTMLInputElement> for an extracted onChange handler attached to a text input, the generic parameter is what tells TypeScript which properties, like e.target.value, are available.',
      'The same pattern applies to textareas and select dropdowns, swap the generic for HTMLTextAreaElement or HTMLSelectElement since each element exposes a slightly different set of DOM properties on target.',
      'Reading e.target.checked instead of e.target.value requires the input element specifically, and only makes sense when the input type attribute is "checkbox" or "radio", something TypeScript cannot itself verify.',
      'Extracted handlers for controlled inputs almost always follow the same shape, destructure e.target.value, then call the corresponding setState function with it.'
    ],
    codeSnippet: `function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setQuery(e.target.value);
}`
  },
  {
    id: 'synthetic-event-fallback',
    title: 'React.SyntheticEvent',
    summary: 'Use SyntheticEvent as the base when the exact event type is unknown or unimportant.',
    difficulty: 'basic',
    category: 'typed-events',
    prerequisites: ['form-event-typing'],
    keyPoints: [
      'Every specific React event type, MouseEvent, KeyboardEvent, ChangeEvent, FormEvent and so on, extends the base React.SyntheticEvent type, which normalises native browser events into a consistent cross-browser shape.',
      'Reach for SyntheticEvent directly when the specific event extra properties genuinely are not needed, for example a generic handler that only calls e.stopPropagation() regardless of which element triggered it.',
      'Using the overly-generic SyntheticEvent when element-specific properties are actually needed, like target.value on a change event, forces an unnecessary type assertion later, prefer the specific event type whenever the target element is known.',
      'SyntheticEvent still exposes the underlying native browser event through e.nativeEvent, for the rare case an API that React synthetic wrapper does not expose is needed.'
    ]
  },
  {
    id: 'mouse-and-keyboard-events',
    title: 'Mouse and Keyboard Events',
    summary: 'Distinguish between different interaction events in React.',
    difficulty: 'basic',
    category: 'typed-events',
    prerequisites: ['change-event-typing'],
    keyPoints: [
      'React.MouseEvent<HTMLElement> types pointing-device interactions like clicks and double-clicks, React.KeyboardEvent<HTMLElement> types key presses, each generic parameter narrows to the specific element the listener is attached to.',
      'KeyboardEvent gives typed access to e.key, the human-readable key name like "Enter" or "Escape", and e.code, the physical key location, the standard way to branch handler logic on which key was pressed.',
      'React.PointerEvent is the modern, recommended alternative to MouseEvent for interactions that also need to work with touchscreens and stylus input, pointer events unify mouse, touch, and pen input under one API.',
      'Mixing up the element generic, typing a handler as MouseEvent<HTMLButtonElement> but attaching it to a div, still compiles, the generic only affects e.currentTarget type, it will not catch a mismatched element at compile time.'
    ]
  },

  // --- CATEGORY: TYPED-CONTEXT ---
  {
    id: 'basic-context-typing',
    title: 'Basic Context Types',
    summary: 'Create and type a Context provider with interfaces.',
    difficulty: 'intermediate',
    category: 'typed-context',
    prerequisites: ['use-context'],
    keyPoints: [
      'Define an interface or type alias describing everything the context provides, both the data and any functions the provider exposes for updating that data.',
      'Passing an initial value into createContext<ContextType>(initialValue) lets TypeScript infer the context type directly from that value, so consumers automatically get the correct shape without further annotation.',
      'Every value read out of useContext(MyContext) is typed as exactly the interface defined for it, giving full autocomplete and type checking wherever the context is consumed.',
      'This pattern works best when a real, meaningful default value already exists, for a theme or config context an actual default object is usually available and this is the simplest approach.'
    ],
    codeSnippet: `interface ThemeContextValue {
  mode: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light', toggle: () => {} });`
  },
  {
    id: 'context-without-default',
    title: 'Context Initialized with Null',
    summary: 'Handle contexts where meaningful default values are not available immediately.',
    difficulty: 'intermediate',
    category: 'typed-context',
    prerequisites: ['basic-context-typing', 'usestate-union-null'],
    keyPoints: [
      'When no meaningful default value exists at the time createContext runs, for example an authentication context before the app has determined whether anyone is logged in, initialize it with null and widen the type explicitly to a union like createContext<Theme | null>(null).',
      'This is honest about the real runtime state, the context genuinely might be null until a provider further up the tree supplies a real value.',
      'Every consumer of this context must handle the null branch before using the value, typically with optional chaining or an explicit guard, since TypeScript will not allow accessing properties on a possibly-null value.',
      'The tradeoff is that this pushes a null check onto every component that consumes the context, which quickly becomes repetitive across a larger app.'
    ]
  },
  {
    id: 'context-custom-hook-throw',
    title: 'Throwing Errors for Null Context',
    summary: 'Wrap useContext in a custom hook to avoid null checks throughout the app.',
    difficulty: 'advanced',
    category: 'typed-context',
    prerequisites: ['context-without-default'],
    keyPoints: [
      'Wrapping useContext(MyContext) in a small custom hook, for example useTheme(), centralises the null check in exactly one place instead of repeating it in every consuming component.',
      'Inside that custom hook, throw a runtime error if the context value is still null, a fail-fast pattern that surfaces a missing provider immediately during development rather than producing a confusing downstream crash.',
      'Because the throw happens before the function returns, TypeScript control flow analysis narrows the return type to the non-null branch automatically, every caller of useTheme() sees a fully non-null value with no manual guard required.',
      'This is the most common production pattern for context in larger codebases, it combines runtime safety, a clear error message pointing at the missing provider, with a clean, always-non-null type at every call site.'
    ],
    codeSnippet: `function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}`
  },
  {
    id: 'context-type-assertion',
    title: 'Context Type Assertion',
    summary: 'Use type assertions or empty objects to lie to the compiler on context initialization.',
    difficulty: 'advanced',
    category: 'typed-context',
    prerequisites: ['context-custom-hook-throw'],
    keyPoints: [
      'Asserting the initial empty value with createContext({} as MyContext) tells TypeScript to trust the object will be fully populated by the time any component reads it, even though the actual initial value is an empty object.',
      'The non-null assertion operator achieves a similar effect at the point of use, stripping null out of the type without an actual runtime check.',
      'Both approaches trade type safety for convenience, if a component somehow renders outside its provider, these type-level shortcuts produce a genuine runtime crash with no compile-time warning beforehand.',
      'Prefer throwing a real runtime error from a custom hook over either of these assertions, it gives the same non-null type at every consumer while producing a clear, debuggable error message instead of a silent lie.'
    ],
    gotcha:
      'An asserted empty object type-checks perfectly everywhere but has none of the real properties at runtime until a provider mounts, accessing them too early produces an unhelpful runtime crash instead of a compile-time error.'
  },
  {
    id: 'usecontext-selector-generic',
    title: 'Typing a useContext Selector Pattern',
    summary:
      'A generic selector hook that lets consumers subscribe to a slice of context state, typed so the slice type flows through automatically.',
    difficulty: 'advanced',
    category: 'typed-context',
    prerequisites: ['basic-context-typing', 'generics'],
    keyPoints: [
      'In larger apps a single large context object triggers a re-render in every consumer whenever any part of it changes, a selector pattern lets each consumer pick out only the slice it actually needs.',
      'A generic selector hook takes the context and a selector function as arguments, its own generic parameter for the selected slice is inferred from what the selector function returns, so callers get the exact narrowed type with no manual annotation.',
      'Because the selector function parameter is the full context value, TypeScript already knows its shape from the context own generic, autocomplete works correctly while writing the selector itself.',
      'This pattern is usually paired with a memoization check, often via useSyncExternalStore or a manual equality comparison, so a component only re-renders when its selected slice actually changes, the typing here focuses purely on the selector input and output types.',
      'Libraries like Zustand and Redux Toolkit popularised this pattern outside plain Context, the same generic selector shape applies whether the underlying store is a Context, an external store, or a reducer.'
    ],
    codeSnippet: `function useContextSelector<T, S>(context: React.Context<T>, selector: (value: T) => S): S {
  const value = useContext(context);
  return selector(value);
}

// caller only cares about the user's name, not the whole AppState
const name = useContextSelector(AppContext, (state) => state.user.name);`
  },

  // --- CATEGORY: GENERIC-COMPONENTS ---
  {
    id: 'generic-components-intro',
    title: 'Creating Generic Components',
    summary: 'Use generic type parameters to link prop relationships dynamically.',
    difficulty: 'advanced',
    category: 'generic-components',
    prerequisites: ['generics'],
    keyPoints: [
      'Just like a generic function, a component can declare its own type parameter, for example function List<T>(props: ListProps<T>), letting the prop types vary per usage while staying fully checked.',
      'TypeScript usually infers the generic argument automatically from the props passed in, the angle brackets rarely need to be written explicitly at the call site.',
      'In a .tsx file, an arrow function generic component needs a trailing comma inside the angle brackets, <T,>, because the JSX parser would otherwise read <T> as the start of a JSX tag, this quirk does not affect a regular function declaration.',
      'Generic components shine for genuinely reusable, data-shape-agnostic components like a List<T>, Table<T>, or Select<T>, where the same component renders any array of items while keeping each item real type available to the render function.',
      'A generic component props type usually needs its own matching generic, so the item type flows from the items array all the way through a renderItem callback.'
    ],
    codeSnippet: `type ListProps<T> = { items: T[]; renderItem: (item: T) => React.ReactNode };

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

<List items={users} renderItem={(u) => u.name} />; // T inferred as User`
  },
  {
    id: 'polymorphic-components',
    title: 'Polymorphic Components',
    summary: 'Render components dynamically using an "as" prop.',
    difficulty: 'advanced',
    category: 'generic-components',
    prerequisites: ['generic-components-intro', 'wrapping-html-elements'],
    keyPoints: [
      'A polymorphic component accepts an as prop that determines which underlying element or component it actually renders, letting a single component render as a button, an anchor, or a custom Link component depending on how it is used.',
      'Typing this correctly relies on ElementType, which describes anything valid to pass to createElement, both native HTML tag names as strings and other component functions.',
      'Design systems commonly use this so a single visually-styled Button component can render as an anchor with an href when a link is needed, while keeping identical styling props and full type safety on whichever underlying element was chosen.',
      'The hard part is making the accepted props change based on the as value, for example only allowing href when as is "a", this requires combining ElementType with a generic and conditional prop types rather than one fixed props interface.',
      'Overusing this pattern adds real complexity for a relatively rare need, most components only ever render as one element and do not need to be polymorphic at all.'
    ],
    gotcha:
      'Typing the props as ComponentProps of a fixed default element without a generic locks the prop shape to whatever the default was inferred from, it will not update per call site the way a properly generic polymorphic component does.',
    textbookDef:
      'A polymorphic component is a component whose underlying rendered element, and therefore its accepted native DOM props, is determined at the call site by an "as" (or "component") prop, rather than being fixed in the component definition. Typing it correctly requires the props type itself to be generic over the chosen element type.',
    eli5: `Think of a polymorphic component as a costume that changes what it can do depending on what you put it on. The Button component is the person underneath, always the same styling logic. The "as" prop is the costume: as set to "button" dresses it as a real button, so it gets a disabled prop that makes sense, and as set to "a" dresses it as a link, so it gets an href prop instead. The type system has to know which costume is on before it can tell you which extra pockets (props) are available, that is why this needs a generic instead of one fixed props list.`,
    codeSnippet: `type PolymorphicProps<E extends React.ElementType> = { as?: E } & React.ComponentPropsWithoutRef<E>;

function Button<E extends React.ElementType = 'button'>({ as, ...rest }: PolymorphicProps<E>) {
  const Component = as || 'button';
  return <Component {...rest} />;
}

<Button as="a" href="/docs">Docs</Button>; // href is valid because as="a"`
  },
  {
    id: 'generic-components-refs',
    title: 'Generic Components with Refs',
    summary: 'Handling refs inside of a generic component manually.',
    difficulty: 'advanced',
    category: 'generic-components',
    prerequisites: ['generic-components-intro', 'forward-ref-legacy', 'ref-as-prop-react-19'],
    keyPoints: [
      'Generic components lose automatic ref type inference, TypeScript cannot resolve the generic parameter ref type through the same forwardRef machinery it uses for a plain, non-generic component.',
      'The simplest workaround is accepting ref as a regular named prop on the component, the React 19 pattern since ref is now just a prop, and passing it down manually to the underlying DOM element, sidestepping forwardRef entirely.',
      'Library authors who still need forwardRef exact behaviour for backwards compatibility can use a call-signature workaround, casting the result of forwardRef to a custom generic function type, since forwardRef itself is not generic-friendly.',
      'This is one of the more genuinely awkward corners of typing React with generics, most application code should prefer the React 19 ref-as-prop approach and avoid forwardRef with generics when possible.'
    ],
    gotcha:
      'A generic component wrapped in forwardRef silently loses its own generic parameter, TypeScript infers the type parameter as unknown at every call site unless a call-signature cast workaround is applied.',
    textbookDef:
      'Because the forwardRef type signature is not itself generic over an arbitrary component type parameter, wrapping a generic function component in forwardRef erases that outer generic, a known structural limitation of the forwardRef type definition rather than a bug in any particular component.',
    eli5: `Normally, a generic component is like a form with a blank you fill in, "what type of item is this list of", and TypeScript reads your answer automatically. forwardRef, for historical reasons, was built assuming there is no blank to fill in, so wrapping a generic component in it is like handing the form to someone who was never told to look for the blank, they just mark it "unknown." React 19's ref-as-a-prop approach removes forwardRef from the equation entirely, so the blank gets read normally again.`,
    codeSnippet: `// React 19: ref is a normal prop, generic works as expected
function List<T>({ items, ref }: ListProps<T> & { ref?: React.Ref<HTMLUListElement> }) {
  return (
    <ul ref={ref}>
      {items.map((item, i) => (
        <li key={i}>{String(item)}</li>
      ))}
    </ul>
  );
}`
  },
  {
    id: 'componenttype-elementtype-jsxelementconstructor',
    title: 'ComponentType vs ElementType vs JSXElementConstructor',
    summary: 'Three different ways to type "a thing that can be rendered as a component", each suited to a different level of flexibility.',
    difficulty: 'advanced',
    category: 'generic-components',
    prerequisites: ['generic-components-intro', 'polymorphic-components'],
    keyPoints: [
      'React.ComponentType<P> describes a function component or class component that accepts props of type P, it is the right choice when accepting "a component" as a prop with a known or constrained props shape, for example a custom icon component prop typed as ComponentType<IconProps>.',
      'React.ElementType is broader, it covers everything ComponentType covers plus every native HTML and SVG tag name as a plain string, exactly what a polymorphic component as prop needs since it must accept both custom components and built-in tag names.',
      'JSXElementConstructor<P> is narrower still and mostly shows up internally, it describes only the "constructor" half of what produces a ReactElement, function or class components, excluding the plain string tag names ElementType includes, application code rarely reaches for it directly, it appears more as a building block inside React own type definitions.',
      'As a rule of thumb, use ComponentType when the exact props a custom component prop must accept are known, use ElementType when both custom components and native tag name strings must be accepted, and leave JSXElementConstructor to library-internal code.',
      'All three describe the renderable thing itself, not an already-rendered element, contrast this with ReactElement or ReactNode, which describe the actual rendered output rather than the function or tag that produces it.'
    ],
    codeSnippet: `type IconProps = { size?: number };

// ComponentType: exact props known
function Avatar({ icon: Icon }: { icon: React.ComponentType<IconProps> }) {
  return <Icon size={24} />;
}

// ElementType: also accepts native tag name strings, used by "as" props
function Box({ as: Tag = 'div' }: { as?: React.ElementType }) {
  return <Tag />;
}`
  },

  // --- CATEGORY: UTILITY-PATTERNS ---
  {
    id: 'types-vs-interfaces',
    title: 'Types vs Interfaces',
    summary: 'Understand the fundamental differences and best practices for aliases and interfaces.',
    difficulty: 'basic',
    category: 'utility-patterns',
    prerequisites: ['type-vs-interface'],
    keyPoints: [
      'A useful rule of thumb repeated across style guides is "use interface until you need type," start with an interface for an object shape and only switch when a feature only type can express is needed.',
      'Interfaces support declaration merging, two interface declarations with the same name in the same scope combine into one, which makes interfaces well suited for public library APIs that consumers might want to extend.',
      'Type aliases can represent anything, unions, intersections, tuples, primitives, and mapped types, none of which an interface can express directly, making type aliases the natural choice for prop shapes that branch or compute from another type.',
      'Both support generics and can describe function call signatures, the practical difference in day-to-day component work is smaller than the theoretical difference, pick whichever reads more clearly for the specific shape.',
      'For React component props specifically, many teams default to type because props objects frequently need unions, variant props or discriminated as-style props, that interfaces cannot represent without an awkward workaround.'
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
    prerequisites: ['type-vs-interface'],
    keyPoints: [
      'The extends keyword on an interface inherits every property from one or more parent interfaces, the resulting shape must satisfy all of them.',
      'A type alias reaches the same outcome using the intersection operator (&), combining two object types into one that has every property from both.',
      'extends produces clearer compiler error messages when a conflicting property type is inherited, while an intersection of conflicting property types silently collapses that property to never, a subtler failure mode worth knowing about.',
      'Extending is the common pattern for building a specific component props on top of a shared base, for example interface IconButtonProps extends ButtonProps { icon: ReactNode }.'
    ],
    gotcha:
      'Intersecting two object types that define the same property with incompatible primitive types does not error, it silently produces that property as type never, which then makes the whole type impossible to satisfy.'
  },
  {
    id: 'object-type-misunderstanding',
    title: 'The "object" Type',
    summary: 'Avoid the "object" type unless you strictly mean "any non-primitive type".',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['ts-basic-types'],
    keyPoints: [
      'The lowercase object type does not mean "any object shape," it specifically means "anything that is not a primitive," excluding string, number, boolean, symbol, bigint, null, and undefined.',
      'This makes object a poor choice almost anywhere it might be reached for in component props, it accepts arrays, functions, class instances, and dates just as readily as a plain data object, giving no useful autocomplete or property checking.',
      'What people usually mean when reaching for object is either a specific interface describing the exact expected shape, or the generic Record<string, unknown> for a genuinely arbitrary key-value bag.',
      'Confusing object with the capitalised Object compounds the problem, Object is broader still, matching almost every value except null and undefined.'
    ]
  },
  {
    id: 'empty-interface-misunderstanding',
    title: 'Empty Interface and Object Traps',
    summary: 'Understand that {} and Object represent "any non-nullish value".',
    difficulty: 'advanced',
    category: 'utility-patterns',
    prerequisites: ['object-type-misunderstanding'],
    keyPoints: [
      'An empty object type literal {} and the built-in Object type both mean "any value that is not null or undefined," not "an object with no properties," this trips up almost everyone the first time they see it.',
      'Because {} matches strings, numbers, functions, and arrays just as happily as actual objects, using it as a prop type provides essentially no type safety at all.',
      'To strictly describe an object with genuinely no properties, use Record<string, never>, which forces every key access to fail because there is no valid value type for any key.',
      'This misunderstanding most often shows up when someone writes an empty object literal type intending "no props required," when the correct approach is either a named interface used purely as a marker, or simply omitting the props parameter entirely.'
    ]
  },
  {
    id: 'css-properties',
    title: 'Typing CSS Properties',
    summary: 'Use CSSProperties to safely type inline style objects.',
    difficulty: 'basic',
    category: 'utility-patterns',
    prerequisites: ['ts-basic-types'],
    keyPoints: [
      'React.CSSProperties builds on the community csstype package, giving autocomplete and validation for the large majority of standard CSS property names and their accepted value types.',
      'For length-like properties such as width, margin, or fontSize, React automatically appends "px" when a plain number is passed, CSSProperties types these fields to accept both a number and a string.',
      'Vendor-prefixed properties must be written camelCase with a capital first letter, for example WebkitTransform, not the hyphenated CSS form, because the style object mirrors the DOM CSSStyleDeclaration naming, not raw CSS syntax.',
      'Passing an unrecognised property name to a style object typed as CSSProperties produces a compile error, genuinely useful for catching typos in common property names before they ship.'
    ]
  },
  {
    id: 'css-custom-properties-vars',
    title: 'CSS Custom Properties (Variables)',
    summary: 'Handle the lack of index signatures for CSS variables.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['css-properties'],
    keyPoints: [
      'CSSProperties deliberately does not include an index signature for arbitrary custom property names, so a CSS variable like --primary-color is rejected as an unknown property when assigned directly on a typed style object.',
      'The most common workaround is a type assertion, casting the object literal as React.CSSProperties after adding the custom property, telling the compiler to trust the shape without validating the extra keys.',
      'A more precise alternative intersects CSSProperties with an indexed type covering just the custom property pattern, which keeps validation for standard properties while allowing any custom-prefixed key.',
      'Teams with a fixed, known set of design tokens can instead augment the CSSProperties interface itself via module augmentation, declaring the exact custom property names once so every style object in the codebase gets autocomplete and checking for them.'
    ]
  },
  {
    id: 'wrapping-html-elements',
    title: 'Wrapping HTML Elements',
    summary: 'Extend native HTML elements while allowing all native DOM attributes.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['typing-primitives'],
    keyPoints: [
      'ComponentPropsWithoutRef<"button"> extracts every prop a real button element accepts, onClick, disabled, type, aria attributes and so on, without also including a ref prop, the right choice when the wrapper does not forward a ref.',
      'Use ComponentPropsWithRef<"button"> instead when the wrapper component does forward its ref down to the underlying element, since that variant type includes the correctly-typed ref alongside the rest of the native props.',
      'After extracting and layering custom props on top, often via an intersection with a project-specific interface, spread the remaining native props onto the rendered element with the rest operator (...rest), so callers can still pass any standard HTML attribute the wrapper does not explicitly override.',
      'This is the standard pattern for a design system base primitives, wrapping a native element while staying a fully valid drop-in replacement for every prop that element already supports.'
    ],
    codeSnippet: `type ButtonProps = { variant?: 'primary' | 'secondary' } & React.ComponentPropsWithoutRef<'button'>;

function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button className={variant} {...rest} />;
}`
  },
  {
    id: 'wrapping-html-elements-bad-types',
    title: 'Incorrect HTML Wrapper Types',
    summary: 'Avoid React.HTMLProps and React.HTMLAttributes when wrapping.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    prerequisites: ['wrapping-html-elements'],
    keyPoints: [
      'React.HTMLProps infers types too loosely because it is built on AllHTMLAttributes, a union across every possible HTML element attributes, which lets an invalid value get accepted for an element-specific attribute such as a button type.',
      'React.HTMLAttributes, on the other hand, is too narrow, it only covers attributes common to all elements and drops important element-specific ones entirely, like type on a button or href on an anchor.',
      'The reliable middle ground is ComponentPropsWithoutRef<"tagname">, or ComponentPropsWithRef when forwarding a ref, which resolves to the exact, correctly-typed props for that specific element, no more and no less.',
      'This is a genuinely easy mistake to make because HTMLProps and HTMLAttributes both look like the obvious first choice by name, reach for ComponentPropsWithoutRef instead whenever wrapping a specific native element.'
    ],
    gotcha:
      'React.HTMLProps<"button"> still lets an invalid type attribute value pass without an error, because AllHTMLAttributes types the attribute broadly enough to cover every element that has one, not just the valid values for a button specifically.'
  },
  {
    id: 'omit-utility',
    title: 'The Omit Utility',
    summary: 'Remove specific keys from a type or interface to override them.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['utility-types'],
    keyPoints: [
      'Omit<Type, "key"> strips one or more named properties out of an existing type or interface, producing a new type identical to the original minus those keys.',
      'This is especially useful when extending a native element props but wanting to redefine one of them more strictly, for example omitting a native onChange to replace it with a simpler, value-only signature.',
      'Omit accepts a union of multiple keys at once, removing several properties in one step.',
      'Prefer Omit over manually rewriting the whole type by hand, since it stays in sync automatically if the original type gains or loses unrelated properties later.'
    ]
  },
  {
    id: 'as-const-assertions',
    title: 'Const Assertions',
    summary: 'Use as const to lock down array and object types precisely.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['ts-type-assertions'],
    keyPoints: [
      'Without as const, an array literal of strings like ["red", "green", "blue"] is inferred as the wide type string[], any string could theoretically be pushed into it and every element loses its specific literal identity.',
      'Appending as const locks the array as readonly and narrows each element down to its exact string literal type, turning the array into a tuple of literal types rather than a generic string array.',
      'The same works on object literals, as const makes every property readonly and narrows each value to its literal type instead of the wider primitive type it would otherwise infer to.',
      'This pattern is the foundation for deriving a union type directly from a runtime array of allowed values, indexing typeof on a const-asserted array produces exactly the union of its literal values, keeping the runtime list and the type permanently in sync.'
    ],
    codeSnippet: `const colors = ['red', 'green', 'blue'] as const;
type Color = (typeof colors)[number]; // 'red' | 'green' | 'blue'`
  },
  {
    id: 'discriminated-unions-props',
    title: 'Discriminated Unions for Props',
    summary: 'Create conditional props that alter the component signature.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    prerequisites: ['ts-discriminated-unions'],
    keyPoints: [
      'Model a component whose required props genuinely change based on another prop value as a union of several full interfaces, discriminated by a shared literal field, rather than trying to make every field optional.',
      'For example, a Link component rendered as an anchor could require href, while the same component rendered as a button requires an onClick instead, a union discriminated on an "as" field enforces exactly that at the call site.',
      'TypeScript narrows to the correct union member automatically once the discriminant value is checked, both inside the component own implementation and at every call site where the prop is passed as a literal.',
      'This is the strongest tool for "these props only make sense together" component contracts, it catches missing or mismatched required props before the component ever renders, unlike making everything optional and checking at runtime.'
    ]
  },
  {
    id: 'props-pass-all-or-nothing',
    title: 'Pass All or Nothing Props',
    summary: 'Enforce that a set of props is either completely provided or entirely omitted.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    prerequisites: ['discriminated-unions-props'],
    keyPoints: [
      'An "all or nothing" prop group means either every prop in the group must be supplied together, or none of them may be, a partial combination should be a compile error.',
      'One approach unions the fully-populated shape with a shape where every one of those keys is typed as Record<string, never>, effectively forbidding them, so the compiler rejects any partial mix.',
      'A simpler, more readable alternative groups the related props into a single optional nested object, since an object is naturally either fully present or fully absent.',
      'Reach for the nested-object approach by default, it reads more clearly in both the type definition and at the call site, reserve the union-with-never trick for cases where the props genuinely need to stay flat and cannot be grouped.'
    ]
  },
  {
    id: 'props-mutually-exclusive',
    title: 'Mutually Exclusive Props',
    summary: 'Prevent users from passing two conflicting props at once.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    prerequisites: ['props-pass-all-or-nothing'],
    keyPoints: [
      'Preventing two props from ever being passed together needs the never type paired with optionality inside a discriminated union, rather than simply marking both props optional, which would allow both to be passed at once.',
      'The pattern types one branch with the first prop required and the second typed as never, and the other branch the reverse, so supplying both in the same object fails to match either branch and the compiler rejects it.',
      'This is common for components with two alternate ways of specifying the same underlying behaviour, for example a Tooltip accepting either a plain text prop or a fully custom content prop, but never both at once.',
      'The error message TypeScript produces here can look confusing at first, usually pointing at the never-typed property rather than clearly saying the two props are mutually exclusive, it is worth commenting the type definition to explain the intent for future readers.'
    ]
  },
  {
    id: 'extract-component-props',
    title: 'Extract Component Props',
    summary: 'Extract prop types from external or unexported components.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    prerequisites: ['wrapping-html-elements'],
    keyPoints: [
      'When a third-party or internal component does not export its own props type, React.ComponentProps<typeof MyComponent> extracts exactly the props that component actually accepts, mirroring them without needing access to the original type definition.',
      'This works because ComponentProps introspects the component function own parameter type at the type level, so it always stays accurate even if the target component internal props type changes later.',
      'Combine it with Omit or Pick to build a wrapper that reuses most of another component props while overriding or dropping a few, without duplicating the whole prop list by hand.',
      'Prefer this over manually retyping a component props from documentation or guesswork, retyping by hand drifts out of sync the moment the original component props change.'
    ],
    codeSnippet: `type ModalProps = React.ComponentProps<typeof Dialog>;
type SimpleModalProps = Omit<ModalProps, 'onOpenChange'>;`
  },
  {
    id: 'forward-ref-legacy',
    title: 'forwardRef (Legacy)',
    summary: 'Forward refs to child components in React 18 and below.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['typing-primitives'],
    keyPoints: [
      'In React 18 and earlier, a function component cannot receive a ref prop directly, wrapping it in forwardRef((props, ref) => ...) is what makes the ref usable inside the component, typically to forward it down to a native DOM element.',
      'forwardRef itself needs two generic parameters, the ref element type first and the props type second, getting the order backwards is a common mistake since it is the reverse of how you would normally think about it.',
      'The ref object forwardRef hands over is a mutable RefObject, its .current property can be reassigned freely, React does not prevent a component from mutating a ref that was forwarded to it.',
      'This pattern is still required for any codebase on React 18 or earlier, or for library code that needs to support both React 18 and 19 consumers, newer React 19-only code can skip it entirely in favour of ref as a plain prop.'
    ],
    codeSnippet: `const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <button ref={ref} {...props} />
));`
  },
  {
    id: 'ref-as-prop-react-19',
    title: 'Ref as a Prop in React 19',
    summary: 'Access the ref directly as a standard prop.',
    difficulty: 'basic',
    category: 'utility-patterns',
    prerequisites: ['forward-ref-legacy'],
    keyPoints: [
      'React 19 removed the need for the forwardRef wrapper entirely, a function component can now declare ref directly as a normal named prop in its parameter type, exactly like any other prop.',
      'Type it with React.Ref<ElementType> and pass it straight down to the underlying native element the same way any other prop would be forwarded.',
      'Because ref is now an ordinary prop, generic components regain proper type inference on their ref, avoiding the awkward workaround forwardRef previously needed for generic components.',
      'Existing code still using forwardRef continues to work in React 19 for backwards compatibility, it is simply no longer necessary for new components, and the React team has signalled forwardRef will eventually be deprecated in favour of this pattern.'
    ]
  },
  {
    id: 'unknown-vs-any',
    title: 'Unknown vs Any API Types',
    summary: 'Use unknown instead of any when dealing with unparsed API data.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['ts-basic-types'],
    keyPoints: [
      'any disables type checking entirely for the value it touches, and that loss of safety spreads silently to anything the any value is assigned to or passed into, exactly the class of bug static typing exists to prevent.',
      'unknown accepts any value just like any does, but forces you to narrow it, a typeof check, an instanceof check, or a runtime validation library, before accessing any property or calling any method on it.',
      'Unparsed API responses are the textbook case, type a fetch response body as unknown rather than any, then validate its shape with a schema library like Zod before treating it as the expected type, a malformed response then fails loudly instead of silently producing garbage typed data.',
      'Prefer unknown by default for anything genuinely uncertain, reserve any for the rare cases where type checking is intentionally and temporarily opted out of, for example while migrating an old JS file.'
    ]
  },
  {
    id: 'typescript-enums',
    title: 'TypeScript Enums',
    summary: 'Restrict variables to a specific dictionary of values.',
    difficulty: 'intermediate',
    category: 'utility-patterns',
    prerequisites: ['enums'],
    keyPoints: [
      'An enum defines a closed, named set of constant values, useful when a variable should only ever hold one of a small, fixed list of options, like a limited set of supported countries or statuses.',
      'Enums force callers to select from the exact declared members rather than typing a free-form string, catching typos a plain string type would not.',
      'In React codebases, a union of string literal types is often preferred over an enum for props specifically, because it needs no import, has zero runtime cost, and serialises more predictably across a server and client boundary in a framework like Next.js.',
      'Reach for a real enum when the extra structure enums provide is genuinely wanted, like iterating over all members at runtime, or when a codebase existing conventions already lean on enums consistently.'
    ],
    gotcha:
      'A numeric enum generates a reverse mapping at runtime, string literal unions never need one, this is one reason string literal unions are usually the lighter-weight choice for component props.'
  },
  {
    id: 'starttransition-standalone',
    title: 'startTransition',
    summary: 'Run non-urgent UI updates externally from components.',
    difficulty: 'advanced',
    category: 'utility-patterns',
    prerequisites: ['use-memo-callback'],
    keyPoints: [
      'The standalone startTransition function, imported directly from react rather than the useTransition hook, marks an update as non-urgent from outside a component render, for example inside an event handler in a non-React module, a state store, or a routing library.',
      'It accepts no configuration beyond the callback itself and has no return value, unlike useTransition it does not provide an isPending flag to track whether the transition is still in progress.',
      'Use useTransition instead whenever a component needs to render a pending indicator, a spinner, a disabled button, while the transition is in flight, reach for the standalone function only when outside a component with no hook available.',
      'Wrapping a state update in startTransition tells React it is allowed to interrupt and deprioritise that specific update in favour of more urgent ones, like a keystroke, it does not delay the update on a fixed timer.'
    ]
  }
];
