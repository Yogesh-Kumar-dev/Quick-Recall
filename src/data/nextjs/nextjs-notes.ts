import type { Note } from 'types/content';

export const nextjsNotes: Note[] = [
  // ─── ROUTING ────────────────────────────────────────────────────────────────
  {
    id: 'file-based-routing',
    title: 'File-based Routing & Special Files',
    summary: 'App Router maps the file system to URL segments. Special files (page, layout, loading, error, route) define the UI for each segment.',
    difficulty: 'basic',
    category: 'routing',
    keyPoints: [
      'Folders define URL segments. A route is only publicly accessible when a page.tsx or route.ts exists in that segment.',
      'page.tsx — the unique UI for a route; only its exported content is sent to the client.',
      'layout.tsx — shared UI that wraps pages and persists across navigations without re-rendering.',
      'loading.tsx — instant loading UI; automatically wraps page.tsx in a <Suspense> boundary.',
      'error.tsx — React error boundary for a segment; must be a Client Component.',
      'not-found.tsx — renders when notFound() is called or no route matches.',
      'route.ts — API endpoint; exports HTTP handler functions (GET, POST, PUT, DELETE, PATCH).'
    ],
    gotcha:
      "A folder without page.tsx or route.ts is NOT publicly accessible — you can safely colocate component files, tests, and utilities inside route folders without accidentally exposing them as routes.",
    codeSnippet: `app/
├── layout.tsx          → wraps every route
├── page.tsx            → /
├── loading.tsx         → loading state for /
├── error.tsx           → error boundary for /
├── blog/
│   ├── layout.tsx      → wraps /blog/*
│   ├── page.tsx        → /blog
│   └── [slug]/
│       └── page.tsx    → /blog/:slug
└── api/users/
    └── route.ts        → GET/POST /api/users`
  },

  {
    id: 'layouts',
    title: 'Layouts & Nested Layouts',
    summary: 'Layouts wrap child pages and stay mounted across navigations — state is preserved, the component does not re-render.',
    difficulty: 'basic',
    category: 'routing',
    keyPoints: [
      'Root layout (app/layout.tsx) is required and must include <html> and <body> tags.',
      'Layouts accept a children prop — page content is injected there.',
      'Nested layouts wrap only their segment: app/dashboard/layout.tsx wraps only /dashboard/* routes.',
      'Layouts do NOT re-render on same-segment navigation — scroll position and state are preserved.',
      'Route groups (folderName) allow multiple layouts at the same URL level without changing the URL.',
      'template.tsx re-renders on every navigation (unlike layout.tsx) — useful for per-route animations.'
    ],
    gotcha:
      "Layout components cannot access searchParams — they don't re-render per navigation. Read searchParams only in page.tsx or Client Components via useSearchParams.",
    codeSnippet: `// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar />          {/* persists across /dashboard/* */}
      <main>{children}</main>
    </div>
  );
}`
  },

  {
    id: 'dynamic-routes',
    title: 'Dynamic Routes',
    summary: 'Square-bracket folders create parameterized URL segments. Params are passed as a Promise prop in Next.js 15.',
    difficulty: 'basic',
    category: 'routing',
    keyPoints: [
      '[slug] — single segment: /blog/my-post → params.slug = "my-post".',
      '[...slug] — catch-all: /shop/a/b/c → params.slug = ["a","b","c"].',
      '[[...slug]] — optional catch-all: also matches /shop with no segments.',
      'params is a Promise in Next.js 15 — must be awaited: const { slug } = await params.',
      'generateStaticParams() pre-generates specific paths at build time — those are statically rendered.',
      'Paths not in generateStaticParams are dynamically rendered on first request, then optionally cached.'
    ],
    gotcha:
      "In Next.js 15, params and searchParams are Promises. The most common upgrade mistake: accessing params.id directly instead of (await params).id — causes a runtime error.",
    codeSnippet: `// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;       // must await in Next.js 15
  const post = await getPost(slug);
  return <article>{post.title}</article>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}`
  },

  {
    id: 'route-groups',
    title: 'Route Groups & Private Folders',
    summary: 'Route groups (folder) organize routes without affecting the URL. Private folders (_folder) are never routable.',
    difficulty: 'intermediate',
    category: 'routing',
    keyPoints: [
      'Route group: wrap folder name in parentheses — (marketing) is omitted from the URL.',
      'Use groups to share a layout among a subset of routes without nesting their URLs.',
      'Multiple root layouts: one layout.tsx per group — each group can have its own <html>/<body> for totally different UIs.',
      'Private folder: prefix with _ — _components/, _lib/ are never treated as routes.',
      'loading.tsx scoped to a route group applies only within that group, not the whole segment.'
    ],
    codeSnippet: `app/
├── (marketing)/          ← URL: omitted
│   ├── layout.tsx        ← only wraps marketing routes
│   ├── page.tsx          → /
│   └── about/page.tsx    → /about
├── (shop)/
│   ├── layout.tsx        ← only wraps shop routes
│   └── cart/page.tsx     → /cart
└── _components/          ← NOT routable
    └── Button.tsx`
  },

  // ─── COMPONENTS ─────────────────────────────────────────────────────────────
  {
    id: 'server-client-components',
    title: 'Server vs Client Components',
    summary: "Server Components run only on the server (zero JS shipped). Client Components ('use client') run on server for SSR and on the client.",
    difficulty: 'basic',
    category: 'components',
    keyPoints: [
      "All App Router components are Server Components by default — no directive needed.",
      "'use client' at the top of a file creates a client boundary — all imports in that file become client-side too.",
      'Server Components: can await DB queries, use secrets, reduce bundle size. Cannot use hooks or browser APIs.',
      'Client Components: can use useState, useEffect, event handlers, localStorage, window.',
      'RSC Payload: a compact binary representation of the server tree, used by React to reconcile on the client.',
      'Only NEXT_PUBLIC_ env vars are available in Client Components — others are replaced with empty string.'
    ],
    gotcha:
      "'use client' does NOT mean client-only — Client Components still run on the server during SSR (for initial HTML). It means the component is hydrated on the client and can use browser APIs after mount.",
    codeSnippet: `// Server Component — fetches data, zero bundle impact
export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await db.products.findById(id);  // server-only
  return <AddToCart productId={product.id} />;
}

// Client Component — handles interactivity
'use client';
export default function AddToCart({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Added ✓' : 'Add to Cart'}
    </button>
  );
}`
  },

  {
    id: 'composition-pattern',
    title: 'Server Component Composition Pattern',
    summary: "Pass Server Components as children/props to Client Components — server logic stays out of the bundle, interactivity stays in the client.",
    difficulty: 'intermediate',
    category: 'components',
    textbookDef:
      "When a Server Component is passed as a prop (e.g., children) to a Client Component, it is rendered on the server first and its output (RSC Payload) is injected into the Client Component's slot. The Server Component's source never enters the client bundle.",
    keyPoints: [
      'Client Components CANNOT import Server Components — that would pull server code into the client bundle.',
      'Server Components CAN be passed as children/props to Client Components — rendered server-side first.',
      'Pattern: <Modal> (client state) wraps <Cart> (server data fetch) as children.',
      'Context providers must be Client Components — keep them as deep in the tree as possible.',
      "Third-party components without 'use client': wrap in your own 'use client' wrapper before using in Server Components."
    ],
    gotcha:
      "The rule is about module imports, not JSX nesting. You can't import a Server Component inside a 'use client' file, but you CAN receive one as a children prop from a Server Component parent.",
    codeSnippet: `// ❌ Wrong: importing Server Component inside Client Component
'use client';
import CartContents from './CartContents'; // pulls server code into bundle!

// ✅ Correct: pass as children from a Server Component
// page.tsx (Server Component)
import Modal from './Modal';        // 'use client'
import CartContents from './Cart';  // Server Component

export default function Page() {
  return (
    <Modal>
      <CartContents />  {/* rendered on server, injected as RSC payload */}
    </Modal>
  );
}`
  },

  // ─── DATA ────────────────────────────────────────────────────────────────────
  {
    id: 'data-fetching',
    title: 'Data Fetching in Server Components',
    summary: 'Server Components can be async — await fetch() or DB queries directly without useEffect or loading state management.',
    difficulty: 'basic',
    category: 'data',
    keyPoints: [
      'Make the component async and await data inline — no useEffect, no useState for loading/data.',
      'Identical fetch() calls in the same render pass are memoized (deduplicated) by React automatically.',
      'fetch() is NOT cached by default in Next.js 15 — add "use cache" or next.revalidate for caching.',
      'DB/ORM calls work directly — credentials never leave the server, never reach the client bundle.',
      'Parallel: initiate fetches before awaiting — const [a, b] = await Promise.all([fetchA(), fetchB()]).',
      'Sequential: sometimes necessary when one request depends on the result of another.'
    ],
    gotcha:
      'Awaiting fetches sequentially (const a = await fetchA(); const b = await fetchB()) creates a waterfall even if the requests are independent. Always use Promise.all for independent data needs.',
    codeSnippet: `// Server Component — no hooks, no useEffect
export default async function DashboardPage() {
  // ✅ Parallel — both start at the same time
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts(),
  ]);

  // ❌ Sequential waterfall (avoid unless posts depends on user)
  // const user = await fetchUser();
  // const posts = await fetchPosts();

  return <Dashboard user={user} posts={posts} />;
}`
  },

  // ─── METADATA ────────────────────────────────────────────────────────────────
  {
    id: 'metadata-api',
    title: 'Metadata API',
    summary: 'Export a metadata object or generateMetadata() from page.tsx or layout.tsx to set <head> tags declaratively without manual <Head> components.',
    difficulty: 'basic',
    category: 'metadata',
    keyPoints: [
      'Static: export const metadata = { title, description, openGraph, twitter, ... }.',
      'Dynamic: export async function generateMetadata({ params }) { ... } — can fetch data.',
      'Metadata is merged from parent to child — child values override parent, arrays are additive.',
      'title.template in a layout: "%s | Site Name" — child pages fill %s with their own title.',
      'generateMetadata runs in parallel with the page render, sharing the same fetch cache.',
      'robots, sitemap, opengraph-image: dedicated file conventions in addition to the object API.'
    ],
    gotcha:
      "Never put <title> or <meta> tags in layouts manually — the Metadata API handles deduplication and correct cascade merging. Manual tags break the merge logic.",
    codeSnippet: `// Static metadata
export const metadata = {
  title: { template: '%s | QuickRecall', default: 'QuickRecall' },
  description: 'React interview prep tool',
};

// Dynamic metadata for /blog/[slug]
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    openGraph: { images: [post.coverImage] },
  };
}`
  },

  // ─── NAVIGATION ─────────────────────────────────────────────────────────────
  {
    id: 'link-navigation',
    title: 'Link Component & Navigation',
    summary: '<Link> extends <a> with prefetching and client-side navigation. useRouter enables programmatic navigation in Client Components.',
    difficulty: 'basic',
    category: 'routing',
    keyPoints: [
      '<Link href="/path"> — primary navigation; prefetches linked routes when visible in the viewport.',
      'Prefetching: in production, routes linked with <Link> are prefetched in the background — near-instant navigation.',
      'Client-side transitions: only the changed segment re-renders, layout persists.',
      'useRouter() (Client Component only): router.push(), router.replace(), router.back(), router.prefetch().',
      'redirect() (Server Component / Route Handler): server-side redirect, throws internally so no return needed.',
      'usePathname(), useSearchParams(), useParams() — Client Component hooks for reading current URL info.'
    ],
    gotcha:
      "useRouter from 'next/navigation' is different from the old 'next/router' (Pages Router). Mixing them is a common App Router migration mistake — always import from 'next/navigation' in App Router.",
    codeSnippet: `import Link from 'next/link';

// Preferred — prefetching, client-side nav
<Link href="/dashboard">Dashboard</Link>

// Programmatic navigation (Client Component)
'use client';
const router = useRouter();
router.push('/dashboard');          // navigate
router.replace('/login');           // no history entry
router.back();                      // browser back

// Server-side redirect
import { redirect } from 'next/navigation';
if (!user) redirect('/login');      // no return needed`
  }
];
