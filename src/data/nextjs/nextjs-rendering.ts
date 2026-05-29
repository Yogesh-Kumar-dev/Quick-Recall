import type { Note } from 'types/content';

export const nextjsRenderingNotes: Note[] = [
  // ─── RENDERING ──────────────────────────────────────────────────────────────
  {
    id: 'static-vs-dynamic',
    title: 'Static vs Dynamic Rendering',
    summary: 'Static: rendered at build time, same HTML for everyone. Dynamic: rendered per request for personalized or fresh content.',
    difficulty: 'basic',
    category: 'rendering',
    keyPoints: [
      'Static (default): route rendered at build time when no runtime APIs are accessed. Served instantly from CDN.',
      'Dynamic: automatically opted in when accessing cookies(), headers(), searchParams, or uncached data.',
      'In Next.js 15, fetch() is NOT cached by default — but a route can still be static if no runtime APIs are used.',
      'export const dynamic = "force-dynamic" — always renders dynamically, every request hits the server.',
      'export const dynamic = "force-static" — forces static even if runtime APIs are accessed (they return empty).',
      'generateStaticParams: pre-generate known dynamic paths statically; unknown paths fall back to dynamic.'
    ],
    gotcha:
      "Calling cookies() or headers() anywhere in a Server Component automatically opts the entire page into dynamic rendering — even if the result isn't used. Extract them as close to the consuming component as possible.",
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
    summary: 'Pages rendered at build time into static HTML — served instantly from a CDN with zero server cost per request.',
    difficulty: 'basic',
    category: 'rendering',
    textbookDef:
      'SSG pre-renders pages at build time. The resulting HTML is stored and served on every request without server processing. Next.js 15 uses the "use cache" directive and generateStaticParams to control what is statically generated.',
    keyPoints: [
      'Add "use cache" to a function or component — its output is baked into the static shell at build time.',
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
    summary: 'Pages rendered on the server per request — always fresh data, personalized per user.',
    difficulty: 'basic',
    category: 'rendering',
    textbookDef:
      "SSR generates full HTML for each incoming request on the server. In the App Router, a route becomes dynamically rendered when it accesses request-time APIs (cookies, headers, searchParams) or uses uncached data fetches.",
    keyPoints: [
      'A route is dynamically rendered when it uses: cookies(), headers(), or searchParams.',
      'fetch() without "use cache" runs fresh on every request — implicitly dynamic.',
      'Dynamic rendering guarantees up-to-date data but adds server latency per request.',
      'Even fully dynamic pages benefit from streaming — the static shell (layout) is sent to the browser immediately.',
      'Combine static and dynamic on the same page using Suspense: static shell instant, dynamic parts stream in.'
    ],
    codeSnippet: `// Dynamically rendered — per-request, personalized
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
    summary: 'Revalidate static pages after a time interval or on demand — stale-while-revalidate without a full rebuild.',
    difficulty: 'intermediate',
    category: 'rendering',
    textbookDef:
      'ISR lets you update statically generated pages after the initial build. Next.js 15 uses "use cache" with cacheLife() for time-based ISR and cacheTag() + updateTag() for on-demand invalidation.',
    keyPoints: [
      'Time-based: cacheLife("hours") — cached for that duration, then revalidated in the background.',
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
    title: 'loading.tsx — Route-Level Streaming',
    summary: 'Place loading.tsx beside page.tsx to show instant loading UI for the entire route — no manual Suspense boilerplate needed.',
    difficulty: 'basic',
    category: 'streaming',
    keyPoints: [
      'Add loading.tsx in any route folder — Next.js automatically wraps page.tsx in <Suspense fallback={<Loading />}>.',
      'The layout renders and is sent immediately; loading.tsx shows while the page awaits data.',
      'User sees layout + loading state instantly on navigation — content swaps in when ready.',
      'loading.tsx is a Server Component — render skeletons, spinners, or meaningful partial UI.',
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
    textbookDef:
      "Streaming uses HTTP chunked transfer to progressively deliver HTML from server to client. React's Suspense boundaries define what can be deferred — the static shell arrives instantly while data-dependent chunks stream in as they resolve.",
    keyPoints: [
      '<Suspense fallback={<Skeleton />}> shows the fallback until the async child resolves.',
      'Everything outside Suspense boundaries is part of the static shell — sent immediately.',
      'Multiple independent Suspense boundaries stream in parallel — one slow request never blocks others.',
      "React's use() hook: pass a server-initiated Promise to a Client Component and let Suspense handle the wait.",
      "loading.tsx is a shortcut — it's equivalent to wrapping page.tsx in a <Suspense> boundary."
    ],
    gotcha:
      "Nesting async components without Suspense creates a waterfall — if the parent awaits before rendering the child, the child's fetch can't start until the parent finishes. Wrap each independently-fetching component in its own Suspense.",
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
    summary: 'Add "use cache" to an async function or component to cache its output — composable SSG at any level of the tree.',
    difficulty: 'intermediate',
    category: 'caching',
    textbookDef:
      '"use cache" is a Next.js directive (requires cacheComponents: true in next.config.ts) that stores the return value of an async function or component. Function arguments automatically become part of the cache key, enabling parameterized caching.',
    keyPoints: [
      '"use cache" inside a function/component body caches its async output at data-level or UI-level.',
      'cacheLife("seconds" | "minutes" | "hours" | "days" | "weeks") — sets expiry duration.',
      'cacheTag("key") marks a cache entry; updateTag("key") from a Server Action invalidates it on demand.',
      'Arguments become cache keys automatically — different inputs → separate cache entries.',
      'Replaces the old { next: { revalidate } } fetch option with a composable, component-level model.'
    ],
    gotcha:
      '"use cache" requires cacheComponents: true in next.config.ts — without it, the directive is silently ignored. This is the most common reason caching appears not to work.',
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
    summary: 'PPR is the default model with Cache Components — static shell served instantly from CDN, dynamic Suspense slots stream in per-request.',
    difficulty: 'advanced',
    category: 'ppr',
    textbookDef:
      'PPR combines static and dynamic rendering on a single page without compromise. At build time, Next.js pre-renders everything that can be static (cached + deterministic) into an HTML shell. At request time, dynamic Suspense boundaries stream in personalized content.',
    keyPoints: [
      'No extra configuration with Cache Components — PPR is the default rendering model.',
      'Static shell: everything outside dynamic Suspense boundaries pre-rendered at build time.',
      'Dynamic slots: Suspense fallback HTML is included in the static shell; real content streams at request time.',
      'Same URL can serve static nav, cached blog posts, AND per-user recommendations.',
      'Achieves TTFB as fast as pure static hosting while supporting fully dynamic personalized sections.'
    ],
    codeSnippet: `// One page — three rendering modes simultaneously
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
  }
];
