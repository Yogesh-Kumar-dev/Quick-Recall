import type { Article } from '@/types/content';

export const nuqsUrlStateArticle: Article = {
  id: 'nuqs-url-state',
  slug: 'nuqs-url-state',
  title: 'nuqs: URL State Without the Boilerplate',
  summary:
    "A ground-up look at why the URL is a genuinely good place to keep page-shaping state like filters and pagination, how Next.js and React Router's built-in hooks treat it as a flat string you parse by hand, and how nuqs turns it into typed, declarative React state with built-in validation, batching, and history control.",
  topics: ['React', 'Next.js', 'Routing'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: "Every serious app has some UI state that shapes the whole page: the search box you typed into, the filter you applied, the page you're on, the sort order you chose. The right home for that kind of state is the URL, not a state library, and it's worth being precise about why. If the state lives in the URL's search parameters (the part of the address after the question mark), then all of these come for free: refresh the page and your filters come back, because the browser restored them from the address; send someone the link and they land on the exact same filtered view, because the state travelled inside the link; press the back button and the previous view returns, because each change was recorded in browser history. That combination, survive a refresh, survive a share, survive a back press, is what 'URL state' actually buys you. This article looks at how the two most common React routing setups, Next.js's next/navigation and React Router, ask you to work with the URL, where that falls short, and how a small library called nuqs fixes the pain points by treating the URL as real, typed React state."
    },
    { type: 'heading', id: 'the-string-problem', level: 2, text: 'The URL stores strings, but your UI needs types' },
    {
      type: 'paragraph',
      text: 'A URL search parameter is a string. All of them are, no exceptions. Consider a page with this address:'
    },
    {
      type: 'code',
      code: `https://shop.example.com/products?page=2&tags=tech,news&open=true`
    },
    {
      type: 'paragraph',
      text: 'Three search parameters: page, tags, and open. Reading them back out of the URL in any framework gives you exactly these strings:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const page = '2';            // a string, not the number 2
const tags = 'tech,news';    // a string, not ['tech', 'news']
const open = 'true';         // a string, not the boolean true`
    },
    {
      type: 'paragraph',
      text: "The component that renders this page wants a number it can do arithmetic with, an array of strings it can map over, and a boolean it can branch on. So somewhere, for every parameter, someone has to write the conversion: parseInt on page, split(',') on tags, 'true' === value on open. And it has to be written again in every component that reads the URL, and again for every new parameter. Multiply that by the handful of components on a real page (a search box, a filter sidebar, pagination controls, a sort dropdown) and you have the same parsing logic copied in four places, with four chances to get it subtly wrong. The classic version: a parameter that happens to be missing comes back as null, so the next line calls tags.split(',') on null and the whole component throws."
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'The parsing work is the visible part, the drift is the dangerous part',
      text: 'If one component encodes the tags parameter as tags=tech,news and another decodes it with a different separator, or one reads page as an integer and another as a float, nothing at build time complains. The mismatch only shows up at runtime, as a link that opens the wrong view. There is no shared definition of what a parameter means, so the meaning is re-invented at every read site.'
    },
    { type: 'heading', id: 'native-hooks', level: 2, text: 'What the built-in hooks give you' },
    {
      type: 'paragraph',
      text: 'On top of that parsing problem, actually changing the URL is just as manual. Both Next.js and React Router expose the URL through hooks, and in both cases the URL is treated as a flat string to be read and rebuilt by hand. In Next.js App Router, updating a single parameter typically looks like this:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

function Pagination() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    replace(\`\${pathname}?\${params.toString()}\`);
  };

  return <button onClick={() => setPage(2)}>Go to page 2</button>;
}`
    },
    {
      type: 'paragraph',
      text: "To move one integer from your component into the URL, you wire up three hooks (useSearchParams, usePathname, useRouter), clone the current parameter string into a new URLSearchParams object, set one key on the clone, serialize the whole thing back to a string, and hand the result to replace. It works, and it is correct, but it is plumbing: it describes how to mutate a string, not what state you want the URL to hold. React Router's API is a little friendlier, its useSearchParams returns a setter, but the same string-shaped thinking applies:"
    },
    {
      type: 'code',
      language: 'tsx',
      code: `import { useSearchParams } from 'react-router-dom';

function Pagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next, { replace: true });
  };

  return <button onClick={() => setPage(2)}>Go to page 2</button>;
}`
    },
    {
      type: 'paragraph',
      text: "Two different frameworks, same underlying shape: the URL is a mutable string you reach into, not a value you declare. Notice what both of these have in common. Reading is manual (the parseInt and the ?? 1 fallback), writing is manual (building a fresh URLSearchParams and re-serializing), and every component that touches a parameter repeats its own version of it. There is no shared place that says 'page is an integer that defaults to 1,' so nothing stops one component from encoding it one way and another component decoding it another way."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The real cost is maintenance, not typing',
      text: 'None of this is hard to write, and that is exactly the problem: it is so routine that nobody thinks about it, and the bugs live in the exceptions. A component forgets to copy one of the existing parameters over before setting another, and that parameter silently disappears from the URL. Two components use different parsing, and the same value behaves differently depending on which one read it. Each one is a one-line mistake, and each one is invisible until a user shares a link and the page comes back wrong.'
    },
    { type: 'heading', id: 'what-nuqs-is', level: 2, text: 'What nuqs actually is' },
    {
      type: 'paragraph',
      text: "nuqs (the name plays on 'Next.js query state') exists to make one specific promise: URL search parameters become declarative React state, mirroring useState, with the URL doing the syncing. You do not rebuild strings, you call a setter, and the library handles encoding, decoding, validation, defaults, and history for you. The five or six lines from the native version collapse to one:"
    },
    {
      type: 'code',
      language: 'tsx',
      code: `import { useQueryState, parseAsInteger } from 'nuqs';

function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return (
    <>
      <span>Page {page}</span>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </>
  );
}`
    },
    {
      type: 'paragraph',
      text: 'page is a number, not a string, because parseAsInteger tells the library how to interpret the parameter. It defaults to 1 when the parameter is missing, because of withDefault. When you call setPage(page + 1), the library writes the new value into the URL and updates the component in the same gesture. Reading and writing are no longer two separate hand-written jobs, they are two halves of one declarative state, exactly like useState, except that the state lives in the address bar.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'nuqs is not a routing library',
      text: 'You still need Next.js or React Router underneath to decide which page renders. nuqs only owns the search parameters on whatever page you are already on. It does not replace the router, it makes the slice of the URL that holds UI state pleasant to work with.'
    },
    {
      type: 'paragraph',
      text: 'When a component reads or writes several parameters at once, a grouped form keeps them in one place:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `import { useQueryStates, parseAsInteger, parseAsString, parseAsArrayOf } from 'nuqs';

function ProductListFilters() {
  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(''),
    tags: parseAsArrayOf(parseAsString).withDefault([])
  });

  // filters.page is a number, filters.tags is a string[]
  // setFilters({ page: 2 }) updates only the page parameter

  return <FilterForm value={filters} onChange={setFilters} />;
}`
    },
    { type: 'heading', id: 'type-safety', level: 2, text: 'Types and validation, without writing any parsing' },
    {
      type: 'paragraph',
      text: 'Every parseAsX function is a small runtime validator. On the way in, it reads the raw string from the URL and turns it into the type the parser promises; on the way out, it serializes that type back into a correctly formatted string. nuqs ships parsers for the types real pages actually use:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "parseAsInteger and parseAsFloat for numbers (you write 2, you read back the number 2, not the string '2').",
        "parseAsBoolean for toggles (writes 'true' or 'false', reads back a real boolean).",
        'parseAsArrayOf(...) for multi-selects: arrays of any of the other parsers.',
        'parseAsJson for arbitrary objects, serialized and restored with JSON.',
        'parseAsStringEnum([...]) for values that must come from a fixed set, like sort=price or sort=rating.'
      ]
    },
    {
      type: 'paragraph',
      text: "The underrated part of these parsers is how they behave on bad input. URLs are not written by your app alone: people edit them by hand, bots crawl them, links get truncated, and a user can type ?page=abc into the address bar on a whim. If your code does parseInt('abc') it gets NaN, and NaN tends to travel quietly through a component before exploding somewhere unrelated. A nuqs parser, by contrast, treats unparseable input as invalid, returns a null that your withDefault turns back into the safe default, and the page renders exactly as if that parameter were absent. A malformed URL becomes a non-event instead of a crash."
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'withDefault does two jobs at once',
      text: "Besides being the fallback for missing or invalid values, it also keeps the URL clean: when the state equals its default, nuqs omits the parameter from the URL entirely. A page on its first page with an empty search box renders as /products, not /products?page=1&search=, which keeps shared links short and tidy. The default is a real part of the schema, not a ?? '1' sprinkled at read time."
    },
    { type: 'heading', id: 'race-conditions', level: 2, text: 'The race condition the built-in hooks are hiding' },
    {
      type: 'paragraph',
      text: 'Here is where the string-mutation approach stops being merely verbose and starts being wrong. Picture a real product page with two independent components: a filter sidebar that writes tags, and a search box that writes q. A user changes a filter and starts typing in the search box at roughly the same moment, which on a fast machine is basically always. In the native approach, each component reads the current URL, clones it, changes its own parameter, and writes the whole string back. The problem is that those reads and writes are not atomic:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Component A (filter sidebar)
const params = new URLSearchParams(searchParams.toString());
params.set('tags', 'electronics');
replace(\`\${pathname}?\${params.toString()}\`);

// Component B (search box), running around the same time
const params = new URLSearchParams(searchParams.toString()); // snapshot from BEFORE A wrote
params.set('q', 'laptop');
replace(\`\${pathname}?\${params.toString()}\`);`
    },
    {
      type: 'paragraph',
      text: "Both components read the URL, then both write. Because each write is built from a snapshot taken before the other wrote, whichever write lands last carries a URL that was never aware of the first change. The tags parameter from component A silently disappears from the address bar, even though A 'successfully' ran its replace. Two components, each convinced it updated the URL, and one of the changes is gone. That is the race condition: independent updates collide because each one treats the URL as a flat string it must take, mutate, and put back."
    },
    {
      type: 'paragraph',
      text: 'nuqs removes the collision by design. Internally it keeps a cache of the current URL state, and every update flows through a single synchronous queue. When two updates arrive close together, they are merged against the current in-memory state and batched into one browser navigation, so the second update is built on top of the first rather than on top of a stale snapshot. Components also read from that cache instead of from racing reads of the address bar. The result: two components can update different parameters at the same instant, and both changes survive.'
    },
    { type: 'heading', id: 'history-control', level: 2, text: 'History control, per state instead of per call site' },
    {
      type: 'paragraph',
      text: "Changing the URL has a side effect that most people only notice after it goes wrong: it adds an entry to the browser's history, which is what powers the back button. For some updates that is exactly what you want. Clicking a product category should feel like 'going somewhere,' so the back button returns you to the previous view. For others it is a disaster: if every keystroke in a search box pushes a new history entry, pressing back once does not leave the results page, it rewinds you one character at a time through forty dead ends."
    },
    {
      type: 'paragraph',
      text: "The two native libraries handle this with a push-or-replace decision that has to be made at every call site. In Next.js you choose router.push versus router.replace; in React Router you pass { replace: true } or you do not. That is a decision that is easy to forget, hard to audit, and effectively global: there is no per-state way to say 'this parameter should always be a silent update.' nuqs moves the decision onto the state itself. Each setter call can pick a history mode, and the intent lives with the update instead of being scattered through components:"
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Typing in a search box: update silently, never flood the back button.
setSearch(query, { history: 'replace' });

// Clicking a product category: a real step, so the back button works.
setCategory(slug, { history: 'push' });`
    },
    {
      type: 'paragraph',
      text: "There is a second lever worth knowing: shallow updates. In Next.js App Router, a normal router.replace or router.push re-runs the server components for the route, because the framework cannot know that the URL change was only cosmetic. For high-frequency updates like a search-as-you-type box, that is a server round trip on every keystroke. The shallow option keeps an update entirely client-side, and throttleMs coalesces rapid updates so the address bar catches up without a burst of work. Combined, history: 'replace' with shallow is the canonical recipe for 'this state is real, but it is not a page transition.'"
    },
    { type: 'heading', id: 'server-components', level: 2, text: 'Server Components: one set of rules on both sides' },
    {
      type: 'paragraph',
      text: 'In a Next.js App Router app, search parameters are read in two very different places. A server component gets them from the searchParams prop, because Next hands them to the page from the incoming request. Client components get them from useSearchParams. The awkward part is that nothing shares the definition of those parameters: the validation, the defaults, the types. You can end up with one parsing story on the server and a subtly different one on the client, and a parameter that behaves fine server-side but comes back with the wrong default in a client component because the two sides drifted apart.'
    },
    {
      type: 'paragraph',
      text: "nuqs's createSearchParamsCache exists for exactly this gap. It takes the same parser map you already use in components and builds a shared, typed schema that both sides read from. The server side calls into the cache directly; the client side hands the cache to the hooks. One definition, two consumers, no drift."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// lib/search-params.ts
import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs';

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault('')
});`
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// A Server Component: read the cached, validated values directly.
import { searchParamsCache } from '@/lib/search-params';

export default async function ProductsPage() {
  const { page, search } = searchParamsCache.all();
  return <ProductGrid page={page} search={search} />;
}`
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// A Client Component: the same cache drives the same state.
'use client';

import { useQueryStates } from 'nuqs';
import { searchParamsCache } from '@/lib/search-params';

function SearchBox() {
  const [filters, setFilters] = useQueryStates(searchParamsCache);
  return (
    <input
      value={filters.search}
      onChange={(e) => setFilters({ search: e.target.value })}
    />
  );
}`
    },
    {
      type: 'paragraph',
      text: "This matters for a reason beyond tidiness. If the server's version of a parameter is the source of truth for how the page renders, the client's version has to agree with it, or the UI will show a different view than the URL implies. Making the parsers the single source of truth turns 'are the server and client in agreement' from a bug to hunt into a property that holds by construction."
    },
    {
      type: 'paragraph',
      text: 'React Router apps get the same treatment: nuqs ships an adapter for React Router, so the hooks in this article work in a Vite SPA exactly as they do in Next.js. The race-condition fix, the history control, and the parsing are identical either way, only the routing layer underneath changes.'
    },
    { type: 'heading', id: 'comparison', level: 2, text: 'nuqs vs the built-in hooks: the feature matrix' },
    {
      type: 'table',
      columns: ['', 'Built-in hooks (next/navigation, react-router)', 'With nuqs'],
      rows: [
        [
          'State paradigm',
          'Imperative string surgery: URLSearchParams.set, then re-serialize',
          'Declarative React state: [state, setState]'
        ],
        ['Data types', 'Raw strings only, parseInt and split by hand', 'Numbers, booleans, arrays, JSON, and enums via parsers'],
        [
          'Bad input (e.g. ?page=abc)',
          'NaN or a crash, depending on the manual parsing',
          'Parser returns null, withDefault falls back safely'
        ],
        [
          'Parallel updates from different components',
          "High risk: a write built from a stale snapshot drops another component's change",
          'Batched through a central queue, no dropped updates'
        ],
        ['Default values', "Inline ?? '1' fallbacks repeated at each read site", 'Declarative .withDefault() in the schema'],
        [
          'Back button spam while typing',
          'Every update pushes or replaces, decided per call site',
          'Per-state history mode, plus shallow and throttleMs'
        ],
        [
          'Server/client agreement (App Router)',
          'Manual, easy for the two sides to drift',
          'createSearchParamsCache: one schema, both sides'
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'How to read this table as a decision',
      text: 'If your app has one component that touches one string parameter and nothing else shares the URL, the built-in hooks are fine, and adding a dependency is overkill. Every row in this table starts paying for itself the moment the URL starts behaving like shared app state: several parameters, several components, types that are not strings, and updates that overlap in time.'
    },
    { type: 'heading', id: 'when-to-use', level: 2, text: 'When nuqs makes sense, and when it does not' },
    {
      type: 'paragraph',
      text: "URL state is the right tool for state that genuinely belongs in the address bar, which usually means state that changes what the page shows and that people reasonably want to bookmark or share: filters, sorting, pagination, search terms, active tabs, an open modal on a dashboard. nuqs makes that state pleasant to work with, but it does not change the question of where state should live. Purely local, page-internal state that nobody would ever link to (a tooltip's hover target, a dropdown's animation phase) is still better as plain useState; putting it in the URL would leak an implementation detail into every shared link."
    },
    {
      type: 'paragraph',
      text: 'And some state should not go into the URL at all, no matter how ergonomic the library: a large blob of data (URLs have practical length limits), anything sensitive, or state that is an implementation detail rather than a page definition. nuqs itself is small and focused, but it is still a dependency, and its value is proportional to how much of your UI actually reads and writes the URL. For an app where the URL is central to navigation and views, the win is large; for an app where nothing shares links, the built-in hooks plus a couple of small helper functions may be all you need.'
    },
    { type: 'heading', id: 'recap', level: 2, text: 'Recap' },
    {
      type: 'list',
      style: 'ordered',
      items: [
        'URL search parameters are a legitimate home for page-shaping state, because refresh, share, and back all work for free.',
        'The built-in hooks in Next.js and React Router treat the URL as a flat string: reading and writing each parameter is manual parsing and manual re-serialization, repeated in every component.',
        'nuqs turns a parameter into declarative state with useQueryState, mirroring useState, and groups related parameters with useQueryStates.',
        'parseAsX parsers give you real types (numbers, booleans, arrays, JSON, enums) and turn malformed input into a safe default instead of a NaN or a crash.',
        "Independent components updating the URL at the same time cannot drop each other's changes, because updates go through a single queue instead of racing over stale string snapshots.",
        'History intent (silent replace versus real push) is expressed per state, and shallow with throttleMs keeps rapid typing from flooding the back button or the server.',
        'createSearchParamsCache lets server components and client components share one schema, so parsing cannot drift between the two sides.',
        "The right call is not 'always nuqs' or 'never nuqs': put only page-defining state in the URL, and reach for nuqs once that state has real types, real defaults, and more than one writer."
      ]
    }
  ]
};
