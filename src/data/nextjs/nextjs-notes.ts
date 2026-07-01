import type { Note } from '@/types/content';

export const nextjsNotes: Note[] = [
  // ─── ROUTING ────────────────────────────────────────────────────────────────
  {
    id: 'file-based-routing',
    title: 'File-based Routing & Special Files',
    summary:
      'App Router maps the file system to URL segments. Special files (page, layout, loading, error, route) define the UI for each segment.',
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
      'A folder without page.tsx or route.ts is NOT publicly accessible — you can safely colocate component files, tests, and utilities inside route folders without accidentally exposing them as routes.',
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
      'In Next.js 15, params and searchParams are Promises. The most common upgrade mistake: accessing params.id directly instead of (await params).id — causes a runtime error.',
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
    summary:
      "Server Components run only on the server (zero JS shipped). Client Components ('use client') run on server for SSR and on the client.",
    difficulty: 'basic',
    category: 'components',
    keyPoints: [
      'All App Router components are Server Components by default — no directive needed.',
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
    summary:
      'Pass Server Components as children/props to Client Components — server logic stays out of the bundle, interactivity stays in the client.',
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
    summary:
      'Export a metadata object or generateMetadata() from page.tsx or layout.tsx to set <head> tags declaratively without manual <Head> components.',
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
      'Never put <title> or <meta> tags in layouts manually — the Metadata API handles deduplication and correct cascade merging. Manual tags break the merge logic.',
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
    summary:
      '<Link> extends <a> with prefetching and client-side navigation. useRouter enables programmatic navigation in Client Components.',
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
  },

  // ─── FUNDAMENTALS (from the Next.js interview question bank) ──────────────────
  {
    id: 'what-is-nextjs',
    title: 'What is Next.js?',
    summary: 'A React framework for production — file-based routing, SSR/SSG/ISR, API routes, and optimization built in.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'A full-stack React framework: UI + routing + a backend (API routes) in one project.',
      'Rendering options: SSR, SSG, ISR, and CSR — chosen per route.',
      'File-based routing — the folder structure defines URLs, no manual route config.',
      'Built-in optimization: automatic code splitting, next/image, next/font.',
      'First-class deployment on Vercel (its creators); also runs anywhere Node does.'
    ],
    codeSnippet: `// Create a project
// npx create-next-app@latest my-app

// app/page.tsx — the / route (App Router)
export default function Home() {
  return <h1>Hello, Next.js</h1>;
}`
  },
  {
    id: 'next-vs-react',
    title: 'Next.js vs React (CRA)',
    summary: 'React is a client-side UI library; Next.js is a framework adding rendering, routing, and a backend on top.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Rendering: React is CSR-only by default; Next.js adds SSR, SSG, and ISR.',
      'Routing: React needs React Router; Next.js has built-in file-based routing.',
      'SEO: Next.js pre-renders HTML (great SEO); plain React ships an empty shell.',
      'Backend: Next.js has API routes; React has none (needs a separate server).',
      'Optimization: automatic code splitting + image/font optimization out of the box.'
    ],
    gotcha:
      'Create React App is effectively deprecated — the React team now points new apps at frameworks like Next.js. "React vs Next" is really "library vs framework".',
    codeSnippet: `// React (CSR): browser renders an empty <div id="root"> then fills it
// Next.js: server sends ready HTML, then hydrates

// Next.js gives you, with zero setup:
// - app/about/page.tsx  → /about (routing)
// - app/api/users/route.ts → backend endpoint
// - <Image>, <Link>, next/font → optimization`
  },
  {
    id: 'dynamic-import',
    title: 'Dynamic Import (next/dynamic)',
    summary: 'Lazy-load components for code splitting; optionally skip SSR for browser-only components.',
    difficulty: 'intermediate',
    category: 'optimization',
    keyPoints: [
      'dynamic(() => import("./Heavy")) — loads the component as a separate chunk on demand.',
      'Reduces the initial JS bundle; the component is fetched when first rendered.',
      'ssr: false — render only on the client (for components using window/document).',
      'loading: () => <Spinner /> — show a fallback while the chunk loads.',
      'Built on React.lazy + Suspense, but SSR-aware.'
    ],
    gotcha:
      'In the App Router, ssr: false is only allowed in Client Components — using it in a Server Component throws. Move the dynamic import into a "use client" file.',
    codeSnippet: `import dynamic from 'next/dynamic';

// Code-split + client-only (e.g. a chart using window)
const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <p>Loading chart…</p>
});`
  },
  {
    id: 'env-variables',
    title: 'Environment Variables',
    summary: 'Defined in .env files, read via process.env — only NEXT_PUBLIC_ vars reach the browser.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Put key-value pairs in .env.local (git-ignored) at the project root.',
      'Access with process.env.MY_VAR.',
      'Only variables prefixed NEXT_PUBLIC_ are inlined into the client bundle.',
      'All other vars stay server-only (API routes, Server Components, getServerSideProps).',
      'Files load in order: .env.local > .env.[environment] > .env.'
    ],
    gotcha:
      'A non-prefixed secret used in a Client Component is replaced with an empty string at build — it is NOT exposed, but your code silently breaks. Prefix with NEXT_PUBLIC_ only for genuinely public values.',
    codeSnippet: `// .env.local
DATABASE_URL=postgres://...        // server-only
NEXT_PUBLIC_API_URL=https://api.example.com  // browser-visible

// usage
const db = process.env.DATABASE_URL;            // server only
const api = process.env.NEXT_PUBLIC_API_URL;    // client + server`
  },

  // ─── API ──────────────────────────────────────────────────────────────────────
  {
    id: 'api-routes',
    title: 'API Routes & Route Handlers',
    summary: 'Build backend endpoints inside the project — pages/api/* (Pages Router) or app/api/*/route.ts (App Router).',
    difficulty: 'basic',
    category: 'api',
    keyPoints: [
      'Pages Router: pages/api/hello.js exports default handler(req, res).',
      'App Router: app/api/hello/route.ts exports named functions GET, POST, PUT, DELETE, PATCH.',
      'Route Handlers use the Web Request/Response APIs (Request, NextResponse).',
      'Run server-side only — safe place for secrets, DB access, and third-party keys.',
      'This is what makes Next.js a full-stack framework — no separate backend needed.'
    ],
    gotcha:
      'Route Handlers (route.ts) and a page.tsx cannot live in the same segment — a folder is either a page or an endpoint, not both.',
    codeSnippet: `// App Router — app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await db.users.findAll();
  return NextResponse.json(users);
}
export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.users.create(body);
  return NextResponse.json(user, { status: 201 });
}`
  },
  {
    id: 'middleware',
    title: 'Middleware',
    summary: 'Code that runs on the Edge before a request completes — for auth, redirects, rewrites, and headers.',
    difficulty: 'intermediate',
    category: 'api',
    keyPoints: [
      'A single middleware.ts at the project root runs before matching requests.',
      'Common uses: auth gating, redirects, rewrites, A/B testing, setting headers.',
      'Runs on the Edge runtime — fast, but no Node.js APIs (no fs, limited libs).',
      'Use the matcher config to scope it to specific paths (skip static assets).',
      'Return NextResponse.next(), .redirect(), .rewrite(), or set cookies/headers.'
    ],
    gotcha:
      'Middleware runs on EVERY matched request, including prefetches — keep it lightweight and always add a matcher so it does not run on static files and images.',
    codeSnippet: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  if (!token) return NextResponse.redirect(new URL('/login', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };`
  },

  // ─── PAGES ROUTER ─────────────────────────────────────────────────────────────
  {
    id: 'pages-router-overview',
    title: 'Pages Router & Special Files',
    summary: 'The original Next.js router: files in pages/ map to routes, with _app, _document, and _error special files.',
    difficulty: 'intermediate',
    category: 'pages-router',
    keyPoints: [
      'pages/index.js → /, pages/about.js → /about, pages/blog/[id].js → /blog/:id.',
      '_app.js wraps every page — the place for global CSS, providers, and persistent layout.',
      '_document.js customizes the <html>/<body> shell (rendered once on the server).',
      '_error.js / 404.js / 500.js define custom error and not-found pages.',
      'Data fetching uses getStaticProps / getServerSideProps / getStaticPaths (not async components).'
    ],
    gotcha:
      'The Pages Router has no React Server Components and weaker nested-layout support. New apps should prefer the App Router; the Pages Router remains for legacy and incremental migration.',
    codeSnippet: `pages/
├── _app.js          → wraps every page (global CSS, providers)
├── _document.js     → custom <html>/<body>
├── index.js         → /
├── about.js         → /about
├── blog/[id].js     → /blog/:id
└── api/hello.js     → /api/hello`
  },

  // ─── APP ROUTER (deep dive) ───────────────────────────────────────────────────
  {
    id: 'server-actions',
    title: 'Server Actions ("use server")',
    summary: 'Async server functions callable from components and forms — handle mutations without writing an API route.',
    difficulty: 'intermediate',
    category: 'app-router',
    keyPoints: [
      '"use server" marks a function (or whole file) as a Server Action — runs only on the server.',
      'Invoke via a form’s action prop: <form action={submit}> — Next.js wires the request automatically.',
      'Receives FormData; can read fields, hit the DB, then revalidate/redirect.',
      'Benefits: less boilerplate (no API route), secrets stay server-side, smaller client bundle.',
      'Trade-offs: a server round-trip adds latency; harder to debug than client code; less instant interactivity.',
      'Alternatives when unsuitable: API routes, client fetching (SWR/React Query), SSG/SSR.'
    ],
    gotcha:
      'Server Actions are real HTTP endpoints under the hood — always validate and authorize their input. Never trust FormData just because the action "feels" internal.',
    codeSnippet: `// app/actions.ts
'use server';
export async function createTodo(formData: FormData) {
  const text = formData.get('text') as string;
  await db.todos.create({ text });
  revalidatePath('/todos');
}

// app/todos/page.tsx
import { createTodo } from '../actions';
export default function Page() {
  return (
    <form action={createTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  );
}`
  },
  {
    id: 'route-handlers',
    title: 'Route Handlers (App Router API)',
    summary: 'app/**/route.ts exports HTTP-method functions built on the Web Request/Response APIs.',
    difficulty: 'intermediate',
    category: 'app-router',
    keyPoints: [
      'Replace Pages Router pages/api with app/api/*/route.ts.',
      'Export named functions per method: GET, POST, PUT, PATCH, DELETE.',
      'Use the Web Request and Response (or NextResponse) APIs — Response.json(data).',
      'Read query params via request.nextUrl.searchParams; body via await request.json()/formData().',
      'Best practices: correct HTTP methods + status codes, validate/sanitize input, handle errors, keep modular.'
    ],
    gotcha:
      'A segment can have a page.tsx OR a route.ts, not both. Put API handlers under their own path (app/api/...) so they never collide with a page.',
    codeSnippet: `// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const users = await getUsers();
  return Response.json(users);
}
export async function POST(request: Request) {
  const data = await request.json();
  const user = await createUser(data);
  return Response.json(user, { status: 201 });
}
export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  await deleteUser(id);
  return new Response(null, { status: 204 });
}`
  },
  {
    id: 'parallel-routes',
    title: 'Parallel Routes (@slots)',
    summary: 'Render multiple independent pages in the same layout simultaneously using @slot folders.',
    difficulty: 'advanced',
    category: 'app-router',
    keyPoints: [
      'Define named slots with the @folder convention (e.g. @analytics, @team).',
      'Each slot is received as a prop in the layout alongside children.',
      'Slots render in parallel and have independent loading and error states.',
      'Useful for dashboards, split views, and conditional sections.',
      'Pair with default.tsx to define fallback content for unmatched slots.'
    ],
    codeSnippet: `// app/layout.tsx — slots arrive as props
export default function Layout({
  children, analytics, team
}: {
  children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode;
}) {
  return (
    <>
      {children}
      <section>{analytics}</section>  {/* app/@analytics/page.tsx */}
      <section>{team}</section>       {/* app/@team/page.tsx */}
    </>
  );
}`
  },
  {
    id: 'intercepting-routes',
    title: 'Intercepting Routes',
    summary: 'Load a route from elsewhere in the app while keeping the current page’s context — the classic modal pattern.',
    difficulty: 'advanced',
    category: 'app-router',
    keyPoints: [
      'Show another route (e.g. a photo) in a modal over the current page, without losing context.',
      'On a hard refresh / shared link, the same URL renders the full standalone page.',
      'Conventions match like relative paths: (.) same level, (..) one up, (..)(..) two up, (...) from app root.',
      'Commonly combined with a parallel @modal slot.',
      'Great for photo galleries, quick-view modals, and login overlays.'
    ],
    codeSnippet: `app/
├── feed/page.tsx
├── photo/[id]/page.tsx          ← full page (direct visit/refresh)
└── @modal/
    └── (..)photo/[id]/page.tsx  ← intercepted as a modal over /feed`
  },
  {
    id: 'error-notfound-boundaries',
    title: 'error.tsx & not-found.tsx',
    summary: 'Segment-level error boundaries and 404 UI — error.tsx catches thrown errors, not-found.tsx handles notFound().',
    difficulty: 'intermediate',
    category: 'app-router',
    keyPoints: [
      'error.tsx is a Client Component that catches errors thrown in its segment’s rendering.',
      'It receives { error, reset } — reset() retries rendering the segment.',
      'not-found.tsx renders when notFound() is called or no route matches.',
      'global-error.tsx catches errors in the root layout (must include its own <html>/<body>).',
      'Error boundaries do NOT catch errors in event handlers or async code outside render.'
    ],
    gotcha:
      'error.tsx must start with "use client" — it relies on React error-boundary behavior. A server-only error.tsx will not compile.',
    codeSnippet: `// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }: {
  error: Error; reset: () => void;
}) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// Trigger the not-found boundary
import { notFound } from 'next/navigation';
if (!post) notFound();`
  },
  {
    id: 'template-vs-layout',
    title: 'template.tsx vs layout.tsx',
    summary: 'Both wrap children, but template remounts on every navigation while layout persists.',
    difficulty: 'intermediate',
    category: 'app-router',
    keyPoints: [
      'layout.tsx: persists across navigation — state preserved, DOM not re-created, no re-render.',
      'template.tsx: a NEW instance per navigation — state reset, effects re-run, DOM re-created.',
      'Use template for enter/exit animations, per-route useEffect, or resetting state on navigation.',
      'If both exist, the template renders inside the layout.',
      'Default to layout; reach for template only when you need the remount behavior.'
    ],
    codeSnippet: `// app/template.tsx — re-instantiated on every navigation
export default function Template({ children }: { children: React.ReactNode }) {
  // useEffect here re-runs on each route change (unlike layout)
  return <div className="fade-in">{children}</div>;
}`
  },
  {
    id: 'app-router-global-state',
    title: 'Global State in the App Router',
    summary: 'Server Components can’t hold client state — provide global state through a Client Component provider.',
    difficulty: 'intermediate',
    category: 'app-router',
    keyPoints: [
      'Context/Redux/Zustand providers must be Client Components ("use client").',
      'Wrap the app once in the root layout with a client provider component.',
      'Keep the provider as deep as possible so Server Components above it stay server-rendered.',
      'Server state (fetched data) is better handled by Server Components / fetch caching than a global store.',
      'For Redux: a "use client" StoreProvider in layout; with SSR, create a fresh store per request.'
    ],
    gotcha:
      'Putting "use client" providers at the very root turns the whole tree into Client Components, forfeiting RSC benefits. Wrap only the subtree that needs the state.',
    codeSnippet: `// app/providers.tsx
'use client';
import { createContext, useContext, useState } from 'react';
const Ctx = createContext(null);
export function Providers({ children }) {
  const [user, setUser] = useState(null);
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
}

// app/layout.tsx (Server Component) wraps once
import { Providers } from './providers';
// <body><Providers>{children}</Providers></body>`
  },

  // ─── ADDED: from the adaface Next.js question set ────────────────────────────
  {
    id: 'cors-route-handlers',
    title: 'CORS in Route Handlers',
    summary: 'Set CORS response headers (and answer the preflight OPTIONS request) when another origin calls your Next.js API.',
    difficulty: 'intermediate',
    category: 'api',
    keyPoints: [
      'CORS only matters when a browser on a DIFFERENT origin calls your API — same-origin calls never need it.',
      'Add Access-Control-Allow-Origin (+ -Methods / -Headers) to the Response in a Route Handler.',
      'Non-simple requests (custom headers, PUT/DELETE, JSON) trigger a preflight — handle the OPTIONS method and return 204.',
      'For app-wide rules, set the same headers in middleware.ts or the headers() config in next.config.js.',
      'Server-to-server fetches (RSC, Route Handlers calling other APIs) are not subject to CORS — it is a browser policy.'
    ],
    gotcha:
      'Forgetting the OPTIONS preflight handler is the usual cause of a "blocked by CORS" error even when GET/POST already set the headers — the browser fails the preflight before your main handler ever runs.',
    codeSnippet: `// app/api/data/route.ts
const cors = {
  'Access-Control-Allow-Origin': 'https://other.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function GET() {
  return Response.json({ ok: true }, { headers: cors });
}`
  }
];
