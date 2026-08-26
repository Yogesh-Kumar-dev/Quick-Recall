import type { Article } from '@/types/content';

export const zustandOverviewArticle: Article = {
  id: 'zustand-overview',
  slug: 'zustand-overview',
  category: 'Frontend',
  title: 'Zustand: Global State Without the Ceremony',
  summary:
    "A ground-up look at why apps need shared state in the first place, why prop drilling and Context both hit walls, and how Zustand's store-as-a-hook design and selector subscriptions solve both without a Provider or a reducer in sight.",
  topics: ['React', 'State Management'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: "Before looking at Zustand itself, it's worth being honest about the problem it exists to solve, because the library only makes sense once the problem is clear. React components each own their own local state via useState, and that's great until two components that aren't directly related both need to read or change the same piece of data. That single situation, sharing state across components that don't have a parent-child relationship, is what \"state management\" actually means, and it's the reason libraries like this exist at all."
    },
    { type: 'heading', id: 'the-prop-drilling-problem', level: 2, text: 'The problem: prop drilling' },
    {
      type: 'paragraph',
      text: "The most obvious way to share state in React is to lift it up to a common parent component and pass it down as props. That works fine for two or three levels. The trouble starts when the component that owns the state and the component that needs it are separated by several layers of components that don't care about that data at all, but still have to accept it as a prop and forward it along just so it can reach its destination."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function App(): JSX.Element {
  const [cartItems, setCartItems] = useState<string[]>([]);
  return <Layout cartItems={cartItems} setCartItems={setCartItems} />;
}

// Layout doesn't use cartItems at all, it just passes it through
function Layout({ cartItems, setCartItems }: LayoutProps): JSX.Element {
  return <Header cartItems={cartItems} setCartItems={setCartItems} />;
}

// Header doesn't use it either
function Header({ cartItems, setCartItems }: HeaderProps): JSX.Element {
  return <CartIcon cartItems={cartItems} setCartItems={setCartItems} />;
}

// Finally, five levels down, a component actually reads cartItems
function CartIcon({ cartItems }: CartIconProps): JSX.Element {
  return <span>{cartItems.length}</span>;
}`
    },
    {
      type: 'paragraph',
      text: "This is called prop drilling: passing a prop through components purely to relay it, not because those intermediate components need it. It's not a bug, exactly, it works correctly. But it's fragile (renaming or restructuring the tree means updating every layer in between), noisy (every intermediate component's type signature is polluted with props it never touches), and it gets dramatically worse as an app grows past a handful of components."
    },
    { type: 'heading', id: 'context-half-solution', level: 2, text: 'Context solves passing, but not re-rendering' },
    {
      type: 'paragraph',
      text: 'React\'s built-in answer to prop drilling is Context: wrap part of the tree in a Provider carrying a value, and any descendant can read that value directly with useContext, no matter how deeply nested, without it being threaded through every component in between. This genuinely solves the "how does the data get there" problem.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const CartContext = createContext<CartContextValue | null>(null);

function App(): JSX.Element {
  const [cartItems, setCartItems] = useState<string[]>([]);
  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      <Layout />
    </CartContext.Provider>
  );
}

// Any descendant, at any depth, reads it directly
function CartIcon(): JSX.Element {
  const { cartItems } = useContext(CartContext)!;
  return <span>{cartItems.length}</span>;
}`
    },
    {
      type: 'paragraph',
      text: 'What Context does not solve is re-rendering. Context has no concept of "which part of this value did each consumer actually read." When the Provider\'s value changes at all, every single component calling useContext for that context re-renders, even if the specific field it cares about didn\'t change. If your cart context also holds a shippingAddress field, updating the address re-renders the CartIcon too, even though CartIcon never reads shippingAddress.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Why this actually hurts in practice',
      text: 'For a small app, a few extra re-renders are invisible. But once a Context value grows to hold several independent pieces of state (which is common, since splitting into many tiny contexts is its own kind of boilerplate), every update to any of them re-renders every consumer of the whole context. This is the specific, well-documented wall that pushes people from plain Context toward a dedicated state library once an app grows past a certain size.'
    },
    { type: 'heading', id: 'what-zustand-is', level: 2, text: 'What Zustand actually is' },
    {
      type: 'paragraph',
      text: 'Zustand (German for "state," pronounced roughly "tsoo-shtahnt") is a small state management library built around one core idea that sounds almost too simple: a store is just a custom hook. There is no Provider to wrap your app in, no context underneath, no actions/reducers/dispatch ceremony to learn. You call a function to create a store, and from then on any component in your app can import that store\'s hook directly and read from it, from anywhere, with no wrapping required.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "No Provider: the store isn't tied to a position in the React tree at all, it's just a module you import.",
        'No reducers or action types: you write plain functions that update state directly, closer to how useState feels.',
        'Built-in selector subscriptions: components only re-render when the specific slice of state they read actually changes, solving the exact problem Context has.',
        'Tiny footprint: the core library is roughly 1KB gzipped, with almost no API surface to memorize.'
      ]
    },
    { type: 'heading', id: 'creating-a-store', level: 2, text: 'Creating a store' },
    {
      type: 'steps',
      items: [
        {
          title: 'Install zustand',
          text: 'A single package, no companion packages required for the basics.'
        },
        {
          title: 'Call create() with a function describing your state and actions',
          text: "The function receives a set function (and optionally get) and returns an object: whatever shape you return becomes the store's state, including any functions you attach for updating it."
        },
        {
          title: 'Export the resulting hook',
          text: 'create() returns a hook, conventionally named useXStore. That hook is the entire public API of the store from here on.'
        },
        {
          title: 'Call the hook from any component',
          text: 'No Provider needed. Import the hook, call it, done. It behaves like useState but the state lives outside any single component.'
        }
      ]
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { create } from 'zustand';

interface CartStore {
  items: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (item) =>
    set((state) => ({ items: state.items.filter((i) => i !== item) })),
  clear: () => set({ items: [] })
}));`
    },
    {
      type: 'paragraph',
      text: "A few things to notice here. set works like the functional form of useState's setter: pass it an object to shallow-merge into the current state, or a function that receives the previous state and returns the partial update. There's no dispatch, no action type strings, no switch statement, addItem and removeItem are just plain functions living right next to the data they update. And crucially, there's nothing to render above your app, useCartStore is importable and callable from literally any component."
    },
    { type: 'heading', id: 'reading-state', level: 2, text: 'Reading state: calling the hook' },
    {
      type: 'code',
      language: 'tsx',
      code: `function CartIcon(): JSX.Element {
  const items = useCartStore((state) => state.items);
  return <span>{items.length}</span>;
}`
    },
    {
      type: 'paragraph',
      text: 'The function passed to useCartStore is called a selector: instead of grabbing the entire store, you tell Zustand exactly which slice of it this component cares about. This one line is doing more than it looks like, so it deserves its own section.'
    },
    { type: 'heading', id: 'selectors', level: 2, text: "Selectors: the re-render fix Context doesn't have" },
    {
      type: 'paragraph',
      text: "This is the single biggest practical difference between Zustand and plain Context, and it's worth slowing down on. When you call useCartStore((state) => state.items.length), Zustand subscribes this component to exactly the return value of that selector, the number, not the whole store object. On every store update, Zustand re-runs the selector, compares the new result to the previous one (using Object.is by default, the same comparison React itself uses), and only triggers a re-render if that comparison says the value actually changed."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// This component re-renders only when items.length changes.
// If shippingAddress or any other field in the store updates, it does NOT re-render.
const itemCount = useCartStore((state) => state.items.length);

// Selecting the whole state object opts back into "re-render on any change,"
// which defeats the purpose, so prefer narrow selectors.
const wholeStore = useCartStore((state) => state); // avoid this pattern`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'This is the direct fix for the Context problem covered earlier',
      text: 'Recall that a Context provider re-renders every consumer on any change to the value, because Context has no idea which part of the value each consumer actually reads. A Zustand selector is that missing piece: it tells the store exactly what this component depends on, so unrelated updates elsewhere in the store are invisible to it. This one mechanism is the main reason people reach for Zustand over Context once a store holds more than one or two independent pieces of state.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Selecting multiple fields at once',
      text: "If a component needs several fields, either call the hook multiple times with separate narrow selectors (simplest, and each subscription is independently optimized), or select an object and pass Zustand's useShallow helper to shallow-compare it instead of the default reference comparison, which avoids re-rendering when you return a brand-new object literal with the same values every render."
    },
    { type: 'heading', id: 'updating-state', level: 2, text: 'Updating state from inside a component' },
    {
      type: 'code',
      language: 'tsx',
      code: `function AddToCartButton({ productId }: { productId: string }): JSX.Element {
  const addItem = useCartStore((state) => state.addItem);
  return <button onClick={() => addItem(productId)}>Add to cart</button>;
}`
    },
    {
      type: 'paragraph',
      text: "Actions (the functions that update state) are selected the exact same way as data. Since addItem itself never changes identity between renders (it's defined once when the store is created), selecting it doesn't cause extra re-renders either. Components that only trigger updates, like this button, never need to subscribe to the data they're changing at all."
    },
    { type: 'heading', id: 'outside-react', level: 2, text: 'Reading and writing outside of React entirely' },
    {
      type: 'paragraph',
      text: "Because a Zustand store isn't tied to React's component tree or lifecycle, the hook it creates also exposes getState() and setState() static methods that work anywhere, in a plain function, an event listener, a WebSocket callback, or a module that has nothing to do with React at all."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Inside a websocket message handler, far away from any component:
socket.on('cart-sync', (payload) => {
  useCartStore.setState({ items: payload.items });
});

// Reading the current value imperatively, e.g. inside a non-React utility function
function logCartSize(): void {
  console.log(useCartStore.getState().items.length);
}`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A useful escape hatch for non-React code',
      text: "This is something Context genuinely cannot do at all, since useContext only works inside a component during render. If part of your app needs to read or write shared state from outside React's render cycle (analytics, websocket handlers, imperative browser APIs), this is a capability Zustand gives you for free."
    },
    { type: 'heading', id: 'middleware', level: 2, text: 'Middleware: extending the store' },
    {
      type: 'paragraph',
      text: "Zustand keeps its core tiny and pushes optional behavior into composable middleware functions that wrap your store definition. The three you'll reach for most often each solve one specific, common need."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) => set((state) => ({ items: [...state.items, item] })),
        clear: () => set({ items: [] })
      }),
      { name: 'cart-storage' } // localStorage key
    ),
    { name: 'CartStore' } // label shown in Redux DevTools
  )
);`
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'persist: automatically saves the store to localStorage (or sessionStorage, or IndexedDB via a custom adapter) after every update, and rehydrates it on page load, so state like a shopping cart survives a refresh with no manual code.',
        'devtools: connects the store to the Redux DevTools browser extension, giving you time-travel debugging, a full action log, and state inspection, without pulling in Redux itself.',
        'immer: lets set() accept "mutating" update syntax, like state.items.push(newItem), while actually producing a new immutable object under the hood. This is mainly useful once state gets deeply nested and hand-writing spreads at every level becomes error-prone and hard to read.'
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Middleware composes by wrapping, order matters',
      text: "Middleware functions wrap each other like layers, so devtools(persist(...)) and persist(devtools(...)) can behave slightly differently (for example, which layer sees the raw state vs. the persisted/rehydrated state). When combining more than one, check that middleware's documentation for the recommended order rather than guessing."
    },
    { type: 'heading', id: 'slicing-large-stores', level: 2, text: 'Slicing: keeping one big store organized' },
    {
      type: 'paragraph',
      text: 'A common early worry is: "if there\'s no Provider, does that mean I need a giant single store for my whole app?" Not necessarily. Zustand supports two approaches, and most real apps use a mix of both. The simple approach is just creating multiple independent stores with create(), one per feature area (useCartStore, useUserStore, useNotificationsStore), each completely separate. The other approach, useful when several pieces of state genuinely need to interact, is the "slice pattern": splitting one store\'s creation logic into several functions, then combining them.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface CartSlice {
  items: string[];
  addItem: (item: string) => void;
}
interface UserSlice {
  userId: string | null;
  setUserId: (id: string) => void;
}

const createCartSlice = (set: SetState): CartSlice => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] }))
});

const createUserSlice = (set: SetState): UserSlice => ({
  userId: null,
  setUserId: (id) => set({ userId: id })
});

// Combine slices into one store, still a single create() call
export const useAppStore = create<CartSlice & UserSlice>((...a) => ({
  ...createCartSlice(...a),
  ...createUserSlice(...a)
}));`
    },
    {
      type: 'paragraph',
      text: "Each slice function is defined and can be tested independently, but they end up merged into one store object, which matters when actions in one slice need to read or update state from another (for example, clearing the cart when the user logs out). Components still use plain selectors against the combined store, exactly as before, they don't need to know or care that the store was assembled from multiple slices."
    },
    { type: 'heading', id: 'comparison', level: 2, text: 'Zustand vs. Context vs. Redux Toolkit vs. plain useState' },
    {
      type: 'table',
      columns: ['', 'useState (lifted)', 'Context', 'Zustand', 'Redux Toolkit'],
      rows: [
        [
          'Sharing across unrelated components',
          'Requires prop drilling',
          'Yes, via Provider',
          'Yes, no Provider needed',
          'Yes, via Provider'
        ],
        [
          'Re-renders only what actually changed',
          'N/A (local only)',
          'No, all consumers re-render on any change',
          'Yes, via selectors',
          'Yes, via selectors (useSelector)'
        ],
        [
          'Boilerplate to set up',
          'None',
          'Low (createContext + Provider)',
          'Very low (just create())',
          'Higher (slices, reducers, store config)'
        ],
        ['Works outside React components', 'No', 'No', 'Yes (getState/setState)', 'Yes, but more setup'],
        ['Time-travel debugging', 'No', 'No', 'Yes, via devtools middleware', 'Yes, built in via DevTools extension'],
        ['Enforced structure / conventions', 'None', 'None', 'None (unopinionated)', 'Strong (actions, reducers, slices)'],
        [
          'Best fit',
          'Local, single-component state',
          'Small, rarely-changing shared values (theme, auth user)',
          'Small to large apps wanting minimal ceremony',
          'Large teams wanting enforced patterns and a mature ecosystem'
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'How to actually decide',
      text: "If state is only used by one component and its direct children, keep it as local useState, reaching for a library at all is premature. If a handful of components deep in the tree need something that rarely changes (an authenticated user, a theme setting), Context alone is often perfectly fine, its re-render weakness mainly bites on frequently-updated state. Reach for Zustand once you have shared state that updates often enough that Context's blanket re-renders become a real, measurable problem, or simply because you want the ergonomics of no Provider and no reducer boilerplate. Reach for Redux Toolkit specifically when a large team needs enforced conventions and the broader Redux middleware ecosystem (like RTK Query), not because the app's state itself demands it."
    },
    { type: 'heading', id: 'recap', level: 2, text: 'Recap' },
    {
      type: 'list',
      style: 'ordered',
      items: [
        'Sharing state across unrelated components is the actual problem being solved, plain useState alone forces prop drilling.',
        'Context fixes how the data gets there, but not re-rendering: any change to the Provider value re-renders every consumer, regardless of what they actually read.',
        'A Zustand store is just a hook, created with create(), with no Provider and no reducer ceremony required.',
        'Selectors are the core mechanism: a component only re-renders when the specific slice it selected actually changes, solving the exact weakness Context has.',
        'getState()/setState() let you read and write the store from completely outside React, which Context cannot do.',
        'Middleware (persist, devtools, immer) adds optional capabilities without bloating the core API.',
        'Large stores can be organized with the slice pattern instead of forcing everything into one flat object.',
        'Zustand is not a replacement for Redux Toolkit in every situation, it trades enforced structure for minimal ceremony, which is a good tradeoff for most apps and a worse one for large teams that specifically want guardrails.'
      ]
    }
  ]
};
