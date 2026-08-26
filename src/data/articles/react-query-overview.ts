import type { Article } from '@/types/content';

export const reactQueryOverviewArticle: Article = {
  id: 'react-query-overview',
  slug: 'react-query-overview',
  category: 'Frontend',
  title: 'React Query (TanStack Query): Taming Server State',
  summary:
    'A from-first-principles walkthrough of why "server state" is a different problem from UI state, and how TanStack Query solves caching, staleness, background refetching, and mutations so you stop hand-rolling them.',
  topics: ['React', 'Data Fetching', 'State Management'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: "If you've built more than a couple of React apps, you've probably written the same fifteen lines more times than you can count: a useState for the data, a useState for a loading flag, a useState for an error, and a useEffect that fires off a fetch and juggles all three. It works, but it's the kind of code that quietly rots. This article explains why that pattern breaks down as an app grows, and how TanStack Query (the library everyone still calls by its old name, React Query) fixes it at the root instead of patching the symptoms."
    },
    { type: 'heading', id: 'two-kinds-of-state', level: 2, text: 'There are two fundamentally different kinds of state' },
    {
      type: 'paragraph',
      text: 'Before touching any library, it helps to notice that not all the data living in your components is the same kind of thing. Most tutorials treat "state" as one big bucket, but in a real app it splits cleanly into two categories that behave completely differently, and mixing them up is where most of the pain comes from.'
    },
    {
      type: 'paragraph',
      text: 'The first kind is client state (sometimes called UI state): things like whether a dropdown is open, what text is currently typed into a search box, which tab is selected, or whether a modal is visible. This state is synchronous, you own it completely, it lives and dies with your component tree, and nothing outside your app can change it behind your back. useState, useReducer, and Context were all designed for exactly this.'
    },
    {
      type: 'paragraph',
      text: "The second kind is server state: data that actually lives somewhere else, like a database behind an API. A list of todos, a user's profile, a product catalog. This state is fundamentally different in ways that matter a lot in practice."
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'It is asynchronous to get. You cannot just read it, you have to request it and wait, and that request can fail.',
        "It is owned by someone else. Another user, another tab, or a background job on the server can change it without your app knowing, so the copy sitting in your component's state can quietly become wrong (stale) at any moment.",
        "It usually needs to be shared. The same 'list of todos' might be needed by a sidebar, a dashboard widget, and a full page all at once, and they should agree on what that data is.",
        'It needs to be cached. Refetching the same data on every single render or every navigation is wasteful and slow, but caching introduces a whole new problem: when do you throw the cached copy away and get a fresh one?'
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'useState and Redux were never built for this',
      text: 'useState, useReducer, and even Redux are excellent at managing state you own. None of them have any built-in concept of "this value can go stale," "this value might already be loading somewhere else in the app," or "refetch this automatically when the user comes back to the tab." That\'s not a flaw in those tools, it\'s just a different problem they were never designed to solve. TanStack Query exists specifically to solve the server-state problem, and it deliberately stays out of the client-state business.'
    },
    { type: 'heading', id: 'the-old-way', level: 2, text: 'What hand-rolled fetching actually costs you' },
    {
      type: 'paragraph',
      text: "To see exactly what a data-fetching library buys you, it's worth looking at the naive version first and being honest about everything it's missing."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setTodos(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <List items={todos ?? []} />;
}`
    },
    {
      type: 'paragraph',
      text: 'This already has a "cancelled" flag to avoid setting state on an unmounted component, which is a subtle bug most people learn about the hard way. But look at everything it still doesn\'t do: it never refetches if the data changes on the server, it refetches from scratch every single time this component mounts even if another component just fetched the exact same todos five seconds ago, it has no retry logic if the network hiccups, and if two components on the same page both need the todo list, you get two separate loading spinners and two separate network requests for identical data.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'No caching: navigate away and back, and you refetch everything from zero, even though nothing changed.',
        'No deduplication: five components asking for the same data means five network requests.',
        'No automatic staleness handling: the data on screen might be minutes old and there is no signal telling you.',
        'No background refetching: the user has to manually refresh the page to see updates made elsewhere.',
        'No retry, no built-in error boundaries integration, no request cancellation on rapid re-fetches.',
        'This whole block of loading/error/data plumbing gets copy-pasted into every single component that fetches something.'
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'This is not a criticism of useEffect',
      text: 'useEffect is doing exactly what it\'s designed to do here: synchronize a component with an external system. The problem is that "fetch data, cache it, keep it fresh, share it across components, retry on failure" is a big enough problem that it deserves its own purpose-built tool, the same way you\'d reach for a router instead of hand-rolling one with window.history.'
    },
    { type: 'heading', id: 'what-react-query-is', level: 2, text: 'What TanStack Query actually is' },
    {
      type: 'paragraph',
      text: 'TanStack Query is best understood as a client-side cache for asynchronous data, with a set of rules baked in for when that cache is trustworthy and when it needs refreshing. You describe two things: how to fetch a piece of data, and a unique key that identifies it. The library takes care of the rest: deduplicating in-flight requests, caching results, deciding when to silently refetch in the background, and exposing simple isLoading/isError/data flags to your components so you never write that useEffect boilerplate again.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Install the library',
          text: 'Add @tanstack/tanstack-query (the package is typically installed as @tanstack/react-query) to your project. It has zero required dependencies beyond React itself.'
        },
        {
          title: 'Create a QueryClient',
          text: 'This is the object that actually holds the cache, the default settings (like how long data stays fresh), and the retry/refetch logic. You usually create exactly one for the whole app.'
        },
        {
          title: 'Wrap your app in a QueryClientProvider',
          text: 'This makes the QueryClient available to every component in the tree via context, similar to how a Redux Provider or a ThemeProvider works.'
        },
        {
          title: 'Call useQuery wherever a component needs server data',
          text: "From here on, fetching, caching, and refetching for that piece of data is handled for you. You just read data / isLoading / error off the hook's return value."
        }
      ]
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // treat data as fresh for 1 minute
      retry: 2 // retry a failed request twice before giving up
    }
  }
});

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'One QueryClient per app, not per component',
      text: 'Create the QueryClient once, outside of your component tree (or memoized with useState/useRef if it must live inside a component). If you accidentally create a new QueryClient on every render, you throw away the entire cache every render, which defeats the whole point.'
    },
    { type: 'heading', id: 'usequery', level: 2, text: 'useQuery: reading server data' },
    {
      type: 'paragraph',
      text: "useQuery is the hook you'll use constantly. It takes a description of what to fetch and how, and gives back an object describing the current state of that data: is it loading for the first time, did it error, and what's the actual data (if any is available, even stale data from a previous fetch)."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function TodoList(): JSX.Element {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  });

  if (isPending) return <Spinner />;
  if (isError) return <ErrorMessage error={error} />;
  return <List items={data} />;
}`
    },
    {
      type: 'paragraph',
      text: "That's the entire component. No useState, no useEffect, no cancellation flag. queryFn is any function that returns a promise resolving to the data, so it can be a plain fetch call, an axios request, or a call into a typed API client, TanStack Query doesn't care how the data actually gets fetched, only how to cache and manage what comes back."
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'isPending vs isLoading',
      text: 'Newer versions of the library use isPending to mean "there is no data yet, for any reason" (first load, or the query is currently disabled). isLoading is a narrower flag that specifically means "this is the very first fetch and there\'s no cached data to fall back on." If you see both in code samples online, that\'s why, and either is fine to reach for depending on how precise you need to be.'
    },
    { type: 'heading', id: 'query-keys', level: 2, text: "Query keys: the cache's addressing system" },
    {
      type: 'paragraph',
      text: 'Every useQuery call needs a queryKey, and understanding what it does is the single most important thing to internalize about this library. Think of the query key as two things at once: it is the address the fetched data gets stored under in the cache, and it is also the dependency array that decides when to refetch, similar in spirit to the second argument of useEffect.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Fetches all todos, cached under the key ['todos']
useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

// A different key means a different cache entry, fetched independently
useQuery({
  queryKey: ['todos', { status: 'active' }],
  queryFn: () => fetchTodos({ status: 'active' })
});

// Change any part of the key (here, the id) and it automatically refetches
useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodoById(todoId)
});`
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Two components calling useQuery with an identical key automatically share one cached result and one in-flight request, so if a sidebar and a main page both ask for the exact same todo list at the same time, only one network request actually goes out.',
        'Keys are typically arrays so they can carry extra parameters (filters, ids, pagination page numbers). When any value inside the key array changes between renders, TanStack Query treats it as a brand new query and refetches automatically.',
        'There is no manual dependency array to maintain and no risk of forgetting to add a variable to it, the way you can with useEffect. The key IS the dependency list.'
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Structure keys from generic to specific',
      text: "A common convention is ['todos'] for the whole list, ['todos', { status: 'active' }] for a filtered view, and ['todo', id] for a single item. Structuring keys this way makes it easy to invalidate broadly (everything starting with 'todos') or narrowly (just one todo) later on, which matters a lot once you start writing mutations."
    },
    { type: 'heading', id: 'stale-time-gc-time', level: 2, text: 'Caching in depth: staleTime vs. gcTime' },
    {
      type: 'paragraph',
      text: "This is the part of TanStack Query that trips people up the most, because it introduces two timers that sound similar but control completely different decisions. Getting this distinction solid is worth the effort, it's the core mental model of the whole library."
    },
    {
      type: 'paragraph',
      text: 'When a query fetches successfully, the result is stored in the cache immediately. From that moment, the data is considered "fresh" for a duration you control called staleTime. While data is fresh, TanStack Query will serve it straight from the cache with zero network requests, no matter how many components mount and ask for it. Once staleTime elapses, the data isn\'t deleted, it\'s just marked "stale," meaning the next time it\'s needed the library will show the (now possibly outdated) cached value immediately while quietly refetching in the background to bring it up to date.'
    },
    {
      type: 'paragraph',
      text: 'gcTime (called cacheTime in older versions) is a completely separate clock. It only starts counting once a query becomes "inactive," meaning no component is currently mounted and subscribed to it. It controls how long the data is kept in memory at all before being thrown away entirely (garbage collected). It has nothing to do with whether the data looks fresh or stale, it\'s purely about memory: should this unused data still be sitting around for next time, or is it time to free it up?'
    },
    {
      type: 'table',
      columns: ['', 'staleTime', 'gcTime'],
      rows: [
        [
          'Question it answers',
          'Should I trust the cached data, or go fetch a new copy?',
          'Should I keep this cached data in memory at all?'
        ],
        ['Default value', '0 (data is stale immediately after fetching)', '5 minutes'],
        ['Starts counting', 'The moment data is successfully fetched', 'The moment the query becomes unused (unmounted everywhere)'],
        ['What happens when it elapses', 'Next usage triggers a background refetch', 'The cache entry is deleted entirely'],
        ['Analogy', 'Milk past its "best by" date: still usable, but check it', 'Throwing the milk out of the fridge once it is truly gone']
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Default staleTime of 0 surprises a lot of newcomers',
      text: "Out of the box, data is considered stale the instant it lands, which means TanStack Query will refetch on nearly every remount and every window refocus by default. That is intentional, it biases toward correctness over saved network calls. If a particular piece of data genuinely doesn't change often (say, a list of countries), raise its staleTime explicitly rather than fighting the defaults."
    },
    { type: 'heading', id: 'background-refetching', level: 2, text: 'Background refetching: the headline feature' },
    {
      type: 'paragraph',
      text: 'By default, TanStack Query automatically refetches stale queries in a few situations that map to how people actually use apps: when a window regains focus (the user tabbed away to check something and came back), when the network reconnects after being offline, and when a component mounts and finds its data is stale. None of this requires a single line of code from you.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'This is what people mean by "keeps your UI in sync with the server"',
      text: 'A hand-rolled fetch effect only ever fetches once, when the component mounts. TanStack Query treats the fetch as an ongoing relationship: it keeps checking whether the on-screen data still matches reality, and quietly reconciles it in the background without flashing a loading spinner over data the user is already looking at. That\'s the difference between "a fetch wrapper" and "a synchronization engine for server state," and it\'s the actual reason the library exists.'
    },
    { type: 'heading', id: 'mutations', level: 2, text: 'useMutation: writing data' },
    {
      type: 'paragraph',
      text: 'useQuery is for reads. For anything that changes data on the server (creating, updating, deleting), TanStack Query has a separate hook, useMutation, because writes have a different shape: they are triggered explicitly by user action (a button click, a form submit) rather than automatically on render, and they usually need to do something afterward, like refreshing related data.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function AddTodoForm(): JSX.Element {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (newTodo: NewTodo) => createTodo(newTodo),
    onSuccess: () => {
      // Mark the todos list as stale so the next read refetches it
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  const handleSubmit = (title: string): void => {
    mutate({ title });
  };

  return <TodoInput onSubmit={handleSubmit} disabled={isPending} />;
}`
    },
    {
      type: 'paragraph',
      text: "The pattern shown here, invalidating a query key after a successful mutation, is the bread and butter of using this library well. invalidateQueries marks every cached query whose key starts with ['todos'] as stale, so the next time any component reads that key, it refetches automatically. The source of truth stays the server: rather than trying to manually guess what the new list should look like and patch the cache yourself, you let the server tell you what's actually true after the write succeeds."
    },
    { type: 'heading', id: 'optimistic-updates', level: 2, text: 'Optimistic updates: when waiting feels slow' },
    {
      type: 'paragraph',
      text: 'Invalidate-and-refetch is simple and correct, but it means the UI waits for a full round trip before showing the change, which can feel sluggish for something like ticking off a checkbox. For those cases, useMutation exposes an onMutate callback that runs immediately, before the network request even resolves, letting you update the cache by hand so the UI reacts instantly. If the request later fails, you roll the optimistic change back.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const { mutate } = useMutation({
  mutationFn: toggleTodo,
  onMutate: async (todoId: string) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);

    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t))
    );

    // Passed to onError as "context" if the mutation fails
    return { previousTodos };
  },
  onError: (_err, _todoId, context) => {
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Optimistic updates are an escape hatch, not the default',
      text: 'Reach for onMutate only when the extra complexity is worth it for the interaction (toggling, liking, reordering). For most forms and CRUD screens, plain invalidateQueries after onSuccess is simpler, has far less to get wrong, and is the right default.'
    },
    { type: 'heading', id: 'devtools', level: 2, text: 'React Query Devtools' },
    {
      type: 'paragraph',
      text: "TanStack Query ships an optional devtools panel (@tanstack/react-query-devtools) that renders a floating icon in development. Opening it shows every query currently known to the QueryClient: its key, whether it's fresh or stale, how many components are subscribed to it, and the raw cached data. When staleTime/gcTime behavior feels confusing, the devtools panel is the fastest way to actually see what the cache is doing instead of guessing from behavior."
    },
    { type: 'heading', id: 'comparison', level: 2, text: 'How this compares to the alternatives' },
    {
      type: 'table',
      columns: ['', 'Hand-rolled useEffect + fetch', 'SWR', 'TanStack Query'],
      rows: [
        ['Caching', 'None, refetches every mount', 'Built in', 'Built in, more configurable (staleTime, gcTime)'],
        ['Request deduplication', 'None', 'Yes', 'Yes'],
        ['Background refetch on focus/reconnect', 'None (manual)', 'Yes', 'Yes'],
        ['Mutations with cache invalidation', 'Manual', 'Manual pattern, less structured', 'First-class useMutation API'],
        ['Optimistic updates', 'Fully manual', 'Supported, more manual wiring', 'Supported via onMutate/onError/onSettled'],
        ['Devtools', 'None', 'None built in', 'Official devtools package'],
        ['Bundle size', 'Zero (it is just fetch)', 'Very small', 'Small, larger than SWR but full-featured']
      ]
    },
    {
      type: 'paragraph',
      text: 'SWR (also from Vercel) solves a very similar problem with a smaller API surface, and is a completely reasonable choice, especially for simpler apps. TanStack Query trades a slightly larger API for more built-in power around mutations, pagination, and infinite queries. Neither is "correct," they\'re both a large step up from hand-rolled fetching for exactly the reasons covered in this article.'
    },
    { type: 'heading', id: 'not-client-state', level: 2, text: 'What TanStack Query is not for' },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not put client state into TanStack Query',
      text: 'A form input\'s current value, whether a modal is open, which tab is selected, a toggle switch. None of that is server state, none of it has a "source of truth on a server," and none of it belongs in a useQuery cache. Trying to force client state through this library means fighting its refetch and invalidation model for state it was never designed to own. Keep client state in useState/useReducer/Context (or a small state library), and let TanStack Query own exactly the data that actually comes from a server. Using the right tool for each half of the problem is what makes both halves simple.'
    },
    { type: 'heading', id: 'recap', level: 2, text: 'Recap' },
    {
      type: 'list',
      style: 'ordered',
      items: [
        "Server state is different from client state: it's async, owned elsewhere, can go stale, and is often shared across components.",
        'queryKey is both the cache address and the refetch trigger, identical keys share one cached entry and one in-flight request.',
        'staleTime decides whether cached data is trusted as-is; gcTime decides how long unused data survives in memory before deletion.',
        'Background refetching on window focus/reconnect keeps the UI honest without any code written for it.',
        'useMutation handles writes; invalidateQueries after a successful mutation is the default pattern for keeping reads in sync.',
        'Optimistic updates (onMutate/onError/onSettled) exist for the cases where waiting for a round trip actually hurts the UX.',
        'Keep client state out of the query cache. TanStack Query owns server state and nothing else.'
      ]
    }
  ]
};
