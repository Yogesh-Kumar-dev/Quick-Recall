import type { Note } from '@/types/content';

export const nextjsRenderingNotes: Note[] = [
  // ─── RENDERING ──────────────────────────────────────────────────────────────
  {
    id: 'static-vs-dynamic',
    title: 'Static vs Dynamic Rendering',
    summary: 'Static: rendered at build time, same HTML for everyone. Dynamic: rendered per request for personalized or fresh content.',
    difficulty: 'basic',
    category: 'rendering',
    prerequisites: ['file-based-routing'],
    keyPoints: [
      'Static (default): route rendered at build time when no runtime APIs are accessed. Served instantly from CDN.',
      'Dynamic: automatically opted in when accessing cookies(), headers(), searchParams, or uncached data.',
      'In Next.js 15, fetch() is NOT cached by default , but a route can still be static if no runtime APIs are used.',
      'export const dynamic = "force-dynamic" , always renders dynamically, every request hits the server.',
      'export const dynamic = "force-static" , forces static even if runtime APIs are accessed (they return empty).',
      'generateStaticParams: pre-generate known dynamic paths statically; unknown paths fall back to dynamic.'
    ],
    gotcha:
      "Calling cookies() or headers() anywhere in a Server Component automatically opts the entire page into dynamic rendering , even if the result isn't used. Extract them as close to the consuming component as possible.",
    codeSnippet: `// Force static
export const dynamic = 'force-static';

// Force dynamic
export const dynamic = 'force-dynamic';

// These automatically opt into dynamic rendering:
const cookieStore = await cookies();   // ← makes route dynamic
const headersList = await headers();   // ← makes route dynamic
const { q } = await searchParams;     // ← makes route dynamic`
  },

  {
    id: 'ssg',
    title: 'Static Site Generation (SSG)',
    summary: 'Pages rendered at build time into static HTML , served instantly from a CDN with zero server cost per request.',
    difficulty: 'basic',
    category: 'rendering',
    prerequisites: ['static-vs-dynamic'],
    textbookDef:
      'SSG pre-renders pages at build time. The resulting HTML is stored and served on every request without server processing. Next.js 15 uses the "use cache" directive and generateStaticParams to control what is statically generated.',
    keyPoints: [
      'Add "use cache" to a function or component , its output is baked into the static shell at build time.',
      'generateStaticParams() declares which dynamic paths (e.g., blog slugs) are pre-generated at build time.',
      'Paths NOT in generateStaticParams render dynamically on first request, then cached.',
      'cacheLife("days") or cacheLife("weeks") controls how long the cached output is valid.',
      'Benefits: instant load times, global CDN distribution, no server involved per request.'
    ],
    codeSnippet: `async function BlogPosts() {
  'use cache';
  cacheLife('days');        // regenerate after 24 hours

  const posts = await fetchPosts();
  return <PostList posts={posts} />;
}

// Pre-generate /blog/[slug] at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}`
  },

  {
    id: 'ssr',
    title: 'Server-Side Rendering (SSR)',
    summary: 'Pages rendered on the server per request , always fresh data, personalized per user.',
    difficulty: 'basic',
    category: 'rendering',
    prerequisites: ['static-vs-dynamic'],
    textbookDef:
      'SSR generates full HTML for each incoming request on the server. In the App Router, a route becomes dynamically rendered when it accesses request-time APIs (cookies, headers, searchParams) or uses uncached data fetches.',
    keyPoints: [
      'A route is dynamically rendered when it uses: cookies(), headers(), or searchParams.',
      'fetch() without "use cache" runs fresh on every request , implicitly dynamic.',
      'Dynamic rendering guarantees up-to-date data but adds server latency per request.',
      'Even fully dynamic pages benefit from streaming , the static shell (layout) is sent to the browser immediately.',
      'Combine static and dynamic on the same page using Suspense: static shell instant, dynamic parts stream in.'
    ],
    codeSnippet: `// Dynamically rendered , per-request, personalized
export default async function ProfilePage() {
  // cookies() opts the whole page into dynamic rendering
  const userId = (await cookies()).get('userId')?.value;
  const profile = await fetchProfile(userId);  // fresh every request

  return <Profile data={profile} />;
}`
  },

  {
    id: 'isr',
    title: 'Incremental Static Regeneration (ISR)',
    summary: 'Revalidate static pages after a time interval or on demand , stale-while-revalidate without a full rebuild.',
    difficulty: 'intermediate',
    category: 'rendering',
    prerequisites: ['ssg'],
    textbookDef:
      'ISR lets you update statically generated pages after the initial build. Next.js 15 uses "use cache" with cacheLife() for time-based ISR and cacheTag() + updateTag() for on-demand invalidation.',
    keyPoints: [
      'Time-based: cacheLife("hours") , cached for that duration, then revalidated in the background.',
      'On-demand: cacheTag("posts") marks cached content; updateTag("posts") in a Server Action instantly expires it.',
      'Stale-while-revalidate: serve the cached page immediately while revalidating in the background.',
      'Legacy API: export const revalidate = 60 (seconds) or fetch(url, { next: { revalidate: 60 } }) still work.',
      'Per-fetch ISR: cache individual fetches independently from the page-level cache.'
    ],
    gotcha:
      "On-demand revalidation (updateTag) only invalidates the cache on the server instance that handled the request. In multi-instance/serverless deployments, use a shared cache store ('use cache: remote') to propagate invalidation everywhere.",
    codeSnippet: `// Time-based ISR
async function Products() {
  'use cache';
  cacheLife('hours');           // revalidate every hour
  const products = await db.products.findAll();
  return <ProductGrid products={products} />;
}

// On-demand ISR via Server Action
async function publishProduct(data) {
  'use server';
  await db.products.create(data);
  updateTag('products');        // immediately bust the cache
}`
  },

  // ─── STREAMING ──────────────────────────────────────────────────────────────
  {
    id: 'loading-file',
    title: 'loading.tsx , Route-Level Streaming',
    summary: 'Place loading.tsx beside page.tsx to show instant loading UI for the entire route , no manual Suspense boilerplate needed.',
    difficulty: 'basic',
    category: 'streaming',
    prerequisites: ['static-vs-dynamic'],
    keyPoints: [
      'Add loading.tsx in any route folder , Next.js automatically wraps page.tsx in <Suspense fallback={<Loading />}>.',
      'The layout renders and is sent immediately; loading.tsx shows while the page awaits data.',
      'User sees layout + loading state instantly on navigation , content swaps in when ready.',
      'loading.tsx is a Server Component , render skeletons, spinners, or meaningful partial UI.',
      'Scoped per segment: blog/loading.tsx only applies to /blog, not to /blog/[slug].'
    ],
    codeSnippet: `// app/dashboard/loading.tsx
// → automatically wraps app/dashboard/page.tsx in <Suspense>
export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}`
  },

  {
    id: 'streaming-suspense',
    title: 'Streaming with Suspense',
    summary: 'Wrap slow async components in <Suspense> to send the page shell instantly and stream the slow parts in when ready.',
    difficulty: 'intermediate',
    category: 'streaming',
    prerequisites: ['loading-file'],
    textbookDef:
      "Streaming uses HTTP chunked transfer to progressively deliver HTML from server to client. React's Suspense boundaries define what can be deferred , the static shell arrives instantly while data-dependent chunks stream in as they resolve.",
    keyPoints: [
      '<Suspense fallback={<Skeleton />}> shows the fallback until the async child resolves.',
      'Everything outside Suspense boundaries is part of the static shell , sent immediately.',
      'Multiple independent Suspense boundaries stream in parallel , one slow request never blocks others.',
      "React's use() hook: pass a server-initiated Promise to a Client Component and let Suspense handle the wait.",
      "loading.tsx is a shortcut , it's equivalent to wrapping page.tsx in a <Suspense> boundary.",
      'Under the hood: React uses renderToPipeableStream (Node.js) or renderToReadableStream (edge runtime) to flush HTML in chunks over a single HTTP connection instead of one renderToString() call.',
      'As each chunk arrives, React hydrates it independently , clicking an already-streamed section works before slower sections below it have even loaded.'
    ],
    gotcha:
      "Nesting async components without Suspense creates a waterfall , if the parent awaits before rendering the child, the child's fetch can't start until the parent finishes. Wrap each independently-fetching component in its own Suspense. Also: once the first chunk is flushed, the response's status code and headers are locked in , a deep component erroring after that point can't change a 200 into a 500.",
    codeSnippet: `export default function Page() {
  return (
    <>
      <StaticHeader />                  {/* sent immediately */}

      <Suspense fallback={<PostsSkeleton />}>
        <BlogPosts />                   {/* streams in independently */}
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />                    {/* streams in independently */}
      </Suspense>
    </>
  );
}`
  },

  // ─── CACHING ────────────────────────────────────────────────────────────────
  {
    id: 'use-cache',
    title: '"use cache" Directive',
    summary: 'Add "use cache" to an async function or component to cache its output , composable SSG at any level of the tree.',
    difficulty: 'intermediate',
    category: 'caching',
    prerequisites: ['ssg'],
    textbookDef:
      '"use cache" is a Next.js directive (requires cacheComponents: true in next.config.ts) that stores the return value of an async function or component. Function arguments automatically become part of the cache key, enabling parameterized caching.',
    keyPoints: [
      '"use cache" inside a function/component body caches its async output at data-level or UI-level.',
      'cacheLife("seconds" | "minutes" | "hours" | "days" | "weeks") , sets expiry duration.',
      'cacheTag("key") marks a cache entry; updateTag("key") from a Server Action invalidates it on demand.',
      'Arguments become cache keys automatically , different inputs → separate cache entries.',
      'Replaces the old { next: { revalidate } } fetch option with a composable, component-level model.'
    ],
    gotcha:
      '"use cache" requires cacheComponents: true in next.config.ts , without it, the directive is silently ignored. This is the most common reason caching appears not to work.',
    codeSnippet: `import { cacheLife, cacheTag } from 'next/cache';

// Cache an individual data fetch
async function getProduct(id: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(\`product-\${id}\`);
  return db.products.findById(id);
}

// On-demand invalidation (Server Action)
async function updateProduct(id: string, data) {
  'use server';
  await db.products.update(id, data);
  updateTag(\`product-\${id}\`);  // only this product's cache busted
}`
  },

  // ─── PPR ────────────────────────────────────────────────────────────────────
  {
    id: 'ppr',
    title: 'Partial Pre-Rendering (PPR)',
    summary:
      'PPR is the default model with Cache Components , static shell served instantly from CDN, dynamic Suspense slots stream in per-request.',
    difficulty: 'advanced',
    category: 'ppr',
    prerequisites: ['use-cache', 'streaming-suspense'],
    textbookDef:
      'PPR combines static and dynamic rendering on a single page without compromise. At build time, Next.js pre-renders everything that can be static (cached + deterministic) into an HTML shell. At request time, dynamic Suspense boundaries stream in personalized content.',
    keyPoints: [
      'No extra configuration with Cache Components , PPR is the default rendering model.',
      'Static shell: everything outside dynamic Suspense boundaries pre-rendered at build time.',
      'Dynamic slots: Suspense fallback HTML is included in the static shell; real content streams at request time.',
      'Same URL can serve static nav, cached blog posts, AND per-user recommendations.',
      'Achieves TTFB as fast as pure static hosting while supporting fully dynamic personalized sections.'
    ],
    codeSnippet: `// One page , three rendering modes simultaneously
export default function ProductPage() {
  return (
    <>
      {/* Static — pre-rendered at build, served from CDN */}
      <StaticNav />

      {/* Cached — in static shell, revalidates periodically */}
      <CachedReviews />

      {/* Dynamic — streams in per-request (personalized) */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <PersonalizedRecommendations />
      </Suspense>
    </>
  );
}`
  },

  // ─── RENDERING (from the Next.js interview question bank) ─────────────────────
  {
    id: 'csr-vs-ssr',
    title: 'CSR vs SSR vs Pre-rendering',
    summary: 'CSR renders in the browser; SSR/SSG pre-render HTML on the server for faster first paint and SEO.',
    difficulty: 'basic',
    category: 'rendering',
    prerequisites: ['static-vs-dynamic'],
    keyPoints: [
      'CSR: the browser downloads JS, then renders , first paint is an empty shell (poor SEO).',
      'Pre-rendering: Next.js generates HTML ahead of time so content is visible immediately.',
      'Two pre-render modes: SSG (at build time) and SSR (per request).',
      'After HTML arrives, React HYDRATES it , attaching event listeners to make it interactive.',
      'Pre-rendering improves first contentful paint, SEO, and perceived performance.',
      'CSR tradeoff: fast TTFB (tiny HTML shell) but late FCP/LCP (blocked on JS download + execution) , each 100KB of JS adds noticeable delay on mid-tier devices.',
      'CSR works well for authenticated dashboards, editors, and long-lived sessions where the bundle cost is paid once and interactivity matters more than first paint.',
      'CSR falls short for public, SEO-sensitive, quick-bounce content (marketing, blog posts, product pages) , that is exactly what SSR/SSG target.'
    ],
    eli5: 'CSR is handing someone a flat-pack box and the instructions , they build the furniture at home (slow, blank at first). SSR/SSG ships the furniture already assembled , they see it instantly, then just tighten the screws (hydration).',
    codeSnippet: `// CSR: <div id="root"></div> → JS fills it in the browser
// SSR/SSG: server sends full HTML → React hydrates it

// Pre-rendered page is visible (and crawlable) before JS loads`
  },
  {
    id: 'auto-static-optimization',
    title: 'Automatic Static Optimization',
    summary: 'Pages Router auto-prerenders pages with no server-side data needs into static HTML at build time.',
    difficulty: 'intermediate',
    category: 'rendering',
    prerequisites: ['pages-router-overview'],
    keyPoints: [
      'During build, Next.js analyzes each Pages-Router page for data dependencies.',
      'A page WITHOUT getServerSideProps / getInitialProps is auto-optimized to static HTML.',
      'Such pages serve instantly with no per-request server render.',
      'Pages using only client state, context, or client libraries qualify.',
      'For freshness, combine with ISR (revalidate) so static pages update over time.'
    ],
    gotcha:
      'Adding getServerSideProps (even returning nothing useful) opts a page OUT of static optimization, forcing SSR on every request. Only add it when you truly need per-request data.',
    codeSnippet: `// Auto-statically-optimized , no data functions
export default function About() {
  return <h1>About us</h1>; // prerendered to static HTML at build
}

// Opts OUT of static optimization → SSR every request
export async function getServerSideProps() {
  return { props: {} };
}`
  },

  // ─── PAGES ROUTER DATA FETCHING ───────────────────────────────────────────────
  {
    id: 'getstaticprops',
    title: 'getStaticProps (SSG)',
    summary: 'Pages Router data fetch that runs at build time and feeds props into a statically generated page.',
    difficulty: 'intermediate',
    category: 'pages-router',
    prerequisites: ['auto-static-optimization'],
    keyPoints: [
      'Runs ONCE at build time (or during ISR revalidation) , never on the client.',
      'Returns { props } that are passed to the page component.',
      'Add revalidate: n to enable ISR , the page regenerates at most every n seconds.',
      'Ideal for content that is the same for all users (blogs, docs, marketing).',
      'Pair with getStaticPaths for dynamic routes ([id]).'
    ],
    gotcha:
      'getStaticProps runs only on the server at build , it is stripped from the client bundle, so you can safely use secrets and direct DB calls inside it.',
    codeSnippet: `export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: { data },
    revalidate: 60   // ISR: regenerate at most once per minute
  };
}

export default function Page({ data }) {
  return <List items={data} />;
}`
  },
  {
    id: 'getserversideprops',
    title: 'getServerSideProps (SSR)',
    summary: 'Pages Router data fetch that runs on every request, rendering the page server-side with fresh data.',
    difficulty: 'intermediate',
    category: 'pages-router',
    prerequisites: ['auto-static-optimization'],
    keyPoints: [
      'Runs on EVERY request , always fresh, can read req/res, cookies, headers.',
      'Returns { props } computed server-side and passed to the page.',
      'Use for personalized or frequently-changing data (dashboards, authed pages).',
      'Slower than SSG: adds server latency per request (no CDN caching of HTML).',
      'Can return { redirect } or { notFound: true } to control the response.'
    ],
    gotcha:
      'getServerSideProps disables static optimization for that route. If the data does not actually change per request, use getStaticProps + ISR instead for far better performance.',
    codeSnippet: `export async function getServerSideProps(context) {
  const { req, params } = context;
  const user = await getUser(req.cookies.token);
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  return { props: { user } };  // fresh on every request
}`
  },
  {
    id: 'getstaticpaths-fallback',
    title: 'getStaticPaths & fallback',
    summary: 'Declares which dynamic routes to pre-render at build time; fallback controls un-listed paths.',
    difficulty: 'intermediate',
    category: 'pages-router',
    prerequisites: ['getstaticprops'],
    keyPoints: [
      'Used with getStaticProps for dynamic routes (pages/blog/[id].js).',
      'Returns { paths, fallback } , paths is the list to pre-render at build time.',
      'fallback: false , any path not listed returns a 404.',
      'fallback: true , serve a fallback page, then generate in the background and cache.',
      "fallback: 'blocking' , SSR the page on first request, then cache it (no fallback UI).",
      'App Router equivalent: generateStaticParams (no fallback option , uses dynamicParams).'
    ],
    gotcha:
      'With fallback: true the page first renders with no data , you must handle router.isFallback and show a loading state, or it crashes accessing undefined props.',
    codeSnippet: `export async function getStaticPaths() {
  const posts = await getPosts();
  return {
    paths: posts.map((p) => ({ params: { id: p.id } })),
    fallback: 'blocking'   // un-listed ids: SSR once, then cache
  };
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.id);
  return { props: { post } };
}`
  },

  // ─── HYDRATION ──────────────────────────────────────────────────────────────
  {
    id: 'hydration-basics',
    title: 'Hydration',
    summary: 'Hydration attaches React event listeners and state to server-rendered HTML , the step that makes static markup interactive.',
    difficulty: 'intermediate',
    category: 'rendering',
    prerequisites: ['csr-vs-ssr'],
    textbookDef:
      'Hydration is the process where React walks the DOM tree the server already sent, reconstructs its internal component/fiber tree in memory, and attaches event listeners , without re-creating or re-painting the existing markup.',
    keyPoints: [
      'The server sends HTML that LOOKS interactive but has zero event listeners attached , clicks silently do nothing until hydration finishes.',
      'The client calls hydrateRoot(container, <App />) instead of createRoot , it reuses the existing DOM nodes rather than rebuilding them.',
      'Hydration walks and processes the WHOLE tree by default , on a mid-tier device this can block the main thread for 450ms or more.',
      "That blocking window is exactly what Google's Interaction to Next Paint (INP) metric penalizes , a page that looks ready but can't respond to clicks.",
      'React Server Components sidestep this entirely for the parts of the tree they cover , server-only components ship no JS and need zero hydration.'
    ],
    gotcha:
      "A hydration mismatch (server HTML differs from what the client would render, e.g. Date.now() or Math.random() used during render) causes React to discard and re-render the mismatched subtree client-side , don't rely on non-deterministic values during render.",
    codeSnippet: `// Client entry point
import { hydrateRoot } from 'react-dom/client';

// Reuses the server-rendered DOM , does not repaint it
hydrateRoot(document.getElementById('root'), <App />);`
  },

  {
    id: 'progressive-selective-hydration',
    title: 'Progressive & Selective Hydration',
    summary: 'Instead of hydrating the whole page at once, hydrate pieces independently , by arrival, visibility, or user interaction.',
    difficulty: 'advanced',
    category: 'streaming',
    prerequisites: ['hydration-basics', 'streaming-suspense'],
    textbookDef:
      'Progressive hydration splits a page into independently-hydratable chunks (one per Suspense boundary / code-split component) so each becomes interactive as soon as its own JS and data are ready, rather than waiting for the entire tree.',
    keyPoints: [
      'React 18 gives this automatically: components inside <Suspense> stream and hydrate independently of the rest of the page , no extra setup required.',
      "Selective hydration prioritization: if a user clicks inside an unhydrated Suspense boundary before it's ready, React bumps its hydration ahead of others still in the queue.",
      'Visibility-based hydration (manual pattern): wrap below-the-fold widgets in an IntersectionObserver and only mount/hydrate them once scrolled into view , same idea as image lazy-loading, applied to JS.',
      'Interaction-based hydration (manual pattern): defer loading AND hydrating heavy widgets (modals, charts, rich editors) until the user actually opens/clicks them , keeps the initial JS payload small.',
      'React Server Components are the most aggressive version of this idea , a server-only component needs no hydration step at all, anywhere.'
    ],
    gotcha:
      'Progressive hydration only pays off for genuinely optional-at-first-paint sections , if nearly every component on the page needs to be interactive immediately, splitting hydration adds complexity without measurable INP improvement.',
    codeSnippet: `import { Suspense, lazy } from 'react';

const ProductReviews = lazy(() => import('./ProductReviews'));
const RelatedProducts = lazy(() => import('./RelatedProducts'));

export default function ProductPage({ product }) {
  return (
    <>
      <ProductDetails product={product} />       {/* hydrates with the main bundle */}

      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={product.id} /> {/* hydrates independently */}
      </Suspense>

      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts productId={product.id} /> {/* hydrates independently */}
      </Suspense>
    </>
  );
}`
  }
];
