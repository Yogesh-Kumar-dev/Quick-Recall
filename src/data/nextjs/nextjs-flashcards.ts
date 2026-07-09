import type { Flashcard } from '@/types/content';

// ─── Next.js flashcards — keyword/abbreviation defs + small Q&A ───────────────
// Seeded incrementally; empty arrays hide the Flashcards button on the landing.

export const nextjsFlashcards: Flashcard[] = [
  {
    id: 'next-what-is',
    front: 'What is Next.js?',
    back: 'A React framework for production , adds file-based routing, SSR/SSG/ISR, API routes, image/font optimization, and code splitting on top of React, with minimal config.',
    category: 'Q&A'
  },
  {
    id: 'next-vs-react',
    front: 'Next.js vs React (CRA)',
    back: 'React is a client-side UI library (CSR only by default, no routing). Next.js adds SSR/SSG/ISR, built-in file-based routing, API routes, image optimization, and code splitting out of the box , better SEO and performance.',
    category: 'Q&A'
  },
  {
    id: 'next-create-app',
    front: 'How do you create a Next.js app?',
    back: 'npx create-next-app@latest , scaffolds the project (App or Pages Router, TypeScript, ESLint, Tailwind options).',
    category: 'Q&A'
  },
  {
    id: 'next-pages-vs-app-dir',
    front: 'pages/ vs app/ directory',
    back: 'pages/ = the older Pages Router (getStaticProps/getServerSideProps). app/ = the modern App Router with React Server Components, layouts, and streaming. Both can coexist.',
    category: 'Q&A'
  },
  {
    id: 'next-file-routing',
    front: 'File-based routing',
    back: 'The folder/file structure maps directly to URLs , no manual route config. pages/about.js → /about; app/blog/[slug]/page.tsx → /blog/:slug.',
    category: 'Keyword'
  },
  {
    id: 'next-link',
    front: 'next/link (<Link>)',
    back: 'Client-side navigation between routes without a full reload. Prefetches linked routes in the viewport for near-instant transitions.',
    category: 'Keyword'
  },
  {
    id: 'next-userouter',
    front: 'useRouter',
    back: 'A hook for programmatic navigation in client components. App Router: import from next/navigation; Pages Router: from next/router. router.push/replace/back.',
    category: 'Keyword'
  },
  {
    id: 'next-push-vs-replace',
    front: 'router.push vs router.replace',
    back: 'push adds a new entry to the history stack (back button returns). replace swaps the current entry (no new history) , good after login redirects.',
    category: 'Q&A'
  },
  {
    id: 'next-image',
    front: 'next/image (<Image>)',
    back: 'Built-in image component: automatic resizing, lazy loading, modern formats (WebP/AVIF), and layout-shift prevention via required width/height.',
    category: 'Keyword'
  },
  {
    id: 'next-api-routes',
    front: 'API Routes',
    back: 'Backend endpoints inside the same project , pages/api/* (handler(req,res)) or app/api/*/route.ts (Web Request/Response handlers). Makes Next.js full-stack.',
    category: 'Keyword'
  },
  {
    id: 'next-public-folder',
    front: 'The public/ folder',
    back: 'Static assets served from the site root. public/logo.png is available at /logo.png. Used for favicons, robots.txt, images.',
    category: 'Keyword'
  },
  {
    id: 'next-dynamic-import',
    front: 'next/dynamic',
    back: 'Dynamically import a component for code splitting/lazy loading: dynamic(() => import("./Heavy")). Supports ssr: false to render only on the client.',
    category: 'Keyword'
  },
  {
    id: 'next-ssr-false',
    front: 'ssr: false in dynamic import',
    back: 'Tells next/dynamic to skip server rendering and load the component only on the client , for components that depend on browser-only APIs (window, document).',
    category: 'Q&A'
  },
  {
    id: 'next-env-vars',
    front: 'Environment variables',
    back: 'Defined in .env.local, read via process.env. Only NEXT_PUBLIC_-prefixed vars are exposed to the browser; all others stay server-only.',
    category: 'Q&A'
  },
  {
    id: 'next-config',
    front: 'next.config.js',
    back: 'The project config file for Next.js , image domains, redirects, rewrites, headers, env, webpack tweaks, experimental flags.',
    category: 'Keyword'
  },
  {
    id: 'next-fast-refresh',
    front: 'Fast Refresh',
    back: 'Next.js’s hot-reload: edits to React components update instantly in the browser while preserving component state, without a full reload.',
    category: 'Keyword'
  },
  {
    id: 'next-middleware',
    front: 'Middleware',
    back: 'Code in middleware.ts that runs on the Edge BEFORE a request completes , for auth gating, redirects, rewrites, and header manipulation. Uses a matcher to scope routes.',
    category: 'Keyword'
  },
  {
    id: 'next-head',
    front: 'next/head vs Metadata API',
    back: 'Pages Router uses <Head> from next/head for <title>/<meta>. App Router replaces it with the Metadata API (export const metadata or generateMetadata).',
    category: 'Q&A'
  },
  {
    id: 'next-use-client',
    front: 'use client',
    back: 'A directive at the top of a file marking it (and its imports) as a Client Component , enabling hooks, state, and browser APIs. App Router components are Server Components by default.',
    category: 'Keyword'
  },
  {
    id: 'next-use-server',
    front: 'use server',
    back: 'Marks a function (or file) as a Server Action , server-only code callable from the client (e.g. form submissions) without manually building an API route.',
    category: 'Keyword'
  },
  {
    id: 'next-server-actions',
    front: 'Server Actions',
    back: 'Async server functions ("use server") invoked from components/forms via the form action prop , handle mutations without writing a separate API endpoint.',
    category: 'Keyword'
  },
  {
    id: 'next-redirects',
    front: 'How do you handle redirects?',
    back: 'redirect() from next/navigation (Server Components/Actions), the redirects() config in next.config.js, or NextResponse.redirect in middleware.',
    category: 'Q&A'
  },
  {
    id: 'next-fonts',
    front: 'next/font',
    back: 'Built-in font optimization: self-hosts Google/local fonts at build time, removes external requests, and prevents layout shift with automatic size-adjust.',
    category: 'Keyword'
  },
  {
    id: 'next-i18n',
    front: 'Internationalization (i18n)',
    back: 'Pages Router has built-in i18n routing (locale subpaths). App Router handles it via [lang] dynamic segments + a middleware locale detector, often with next-intl/next-i18next.',
    category: 'Q&A'
  },

  // ─── App Router deep dive + remaining Common topics ─────────────────────────
  {
    id: 'next-app-router',
    front: 'App Router vs Pages Router',
    back: 'App Router (app/, Next 13+): React Server Components, nested layouts, streaming, server actions. Pages Router (pages/): flatter routing, getStaticProps/getServerSideProps, no RSC. Both can coexist.',
    category: 'Q&A'
  },
  {
    id: 'next-route-handlers',
    front: 'Route Handlers vs API Routes',
    back: 'App Router renames API routes to Route Handlers: app/api/x/route.ts exporting GET/POST/etc. built on Web Request/Response , vs Pages Router pages/api/x.js with handler(req, res).',
    category: 'Q&A'
  },
  {
    id: 'next-parallel-routes',
    front: 'Parallel Routes',
    back: 'Render multiple independent pages in one layout via @slot folders (e.g. @analytics, @team) passed as layout props , each with its own loading/error state. Good for dashboards.',
    category: 'Keyword'
  },
  {
    id: 'next-intercepting-routes',
    front: 'Intercepting Routes',
    back: 'Show another route in the current context (e.g. a modal over a feed) using (.)/(..)/(...) conventions; a refresh or shared link renders the full standalone page.',
    category: 'Keyword'
  },
  {
    id: 'next-template-vs-layout',
    front: 'template.tsx vs layout.tsx',
    back: 'layout persists across navigation (state kept, no remount). template creates a new instance per navigation (state reset, effects re-run) , for animations or per-route effects.',
    category: 'Q&A'
  },
  {
    id: 'next-error-file',
    front: 'error.tsx',
    back: 'A Client Component error boundary for a route segment. Receives { error, reset }; reset() retries the segment. global-error.tsx catches root-layout errors.',
    category: 'Keyword'
  },
  {
    id: 'next-notfound-file',
    front: 'not-found.tsx & notFound()',
    back: 'not-found.tsx renders when no route matches or notFound() is called from a Server Component , the idiomatic App Router 404.',
    category: 'Keyword'
  },
  {
    id: 'next-nested-layouts',
    front: 'Nested layouts',
    back: 'Each segment can have a layout.tsx; they nest automatically by folder structure. Visiting /dashboard/settings renders root → dashboard → settings layouts wrapping the page.',
    category: 'Q&A'
  },
  {
    id: 'next-route-groups',
    front: 'Route groups (folder)',
    back: 'Wrapping a folder name in parentheses organizes routes and lets you apply different layouts WITHOUT adding a URL segment , (marketing)/about still resolves to /about.',
    category: 'Keyword'
  },
  {
    id: 'next-server-actions-tradeoffs',
    front: 'Server Actions , benefits & problems',
    back: 'Benefits: no separate API route, secrets stay server-side, smaller bundle, simpler data flow. Problems: server round-trip latency, harder debugging, less instant interactivity.',
    category: 'Q&A'
  },
  {
    id: 'next-form-action',
    front: 'form action={serverAction}',
    back: 'Wire a form directly to a Server Action via the action prop , Next.js handles the request and passes FormData. No manual onSubmit/fetch needed.',
    category: 'Keyword'
  },
  {
    id: 'next-app-global-state',
    front: 'Global state in the App Router',
    back: 'Context/Redux/Zustand providers must be Client Components ("use client"), wrapped once in the root layout , placed as deep as possible to keep Server Components above them server-rendered.',
    category: 'Q&A'
  },
  {
    id: 'next-app-vs-pages-coexist',
    front: 'Can app/ and pages/ coexist?',
    back: 'Yes , a project can use both routers at once, enabling incremental migration. App Router takes precedence for matching routes.',
    category: 'Q&A'
  },
  {
    id: 'next-app-file',
    front: '_app.js vs _document.js (Pages Router)',
    back: '_app.js wraps every page (global CSS, providers, persistent layout). _document.js customizes the server-rendered <html>/<body> shell (runs once, no event handlers).',
    category: 'Q&A'
  },
  {
    id: 'next-script',
    front: 'next/script',
    back: 'Optimized third-party script loading with a strategy prop: beforeInteractive, afterInteractive (default), or lazyOnload , controls when the script loads relative to hydration.',
    category: 'Keyword'
  },
  {
    id: 'next-cors',
    front: 'How do you handle CORS in Next.js?',
    back: 'Set Access-Control-Allow-Origin/-Methods/-Headers on the Response in a Route Handler, and answer the preflight by exporting an OPTIONS handler (204). For app-wide rules use middleware or next.config headers().',
    category: 'Q&A'
  },
  {
    id: 'next-shallow-routing',
    front: 'Shallow routing (Pages Router)',
    back: 'router.push(url, undefined, { shallow: true }) changes the URL without re-running getServerSideProps/getStaticProps , useful for updating query params (filters, tabs) without a data refetch.',
    category: 'Q&A'
  },
  {
    id: 'next-get-initial-props',
    front: 'getInitialProps , why avoid it?',
    back: 'A legacy Pages Router data method that runs on both server and client and disables Automatic Static Optimization (forces SSR for the whole app). Prefer getStaticProps/getServerSideProps, or the App Router.',
    category: 'Q&A'
  },

  // ─── ADDED: from the Next.js Interview Mastery (80 Q) deck ─────────────────
  {
    id: 'next-image-priority',
    front: 'priority prop on next/image',
    back: 'Loads the image eagerly instead of lazily and adds a preload hint , use only on the LCP (above-the-fold) image, since it directly affects Largest Contentful Paint.',
    category: 'Q&A'
  },
  {
    id: 'next-image-fill',
    front: 'fill prop on next/image',
    back: 'Makes the image fill its parent container instead of taking explicit width/height , the parent needs position:relative, and sizes should be set for correct srcset selection.',
    category: 'Keyword'
  },
  {
    id: 'next-font-display-swap',
    front: 'next/font display: "swap"',
    back: 'Shows a fallback font immediately and swaps in the web font once loaded, avoiding invisible text and layout shift , fonts are self-hosted at build time, no external request.',
    category: 'Q&A'
  },
  {
    id: 'next-revalidate-path-tag',
    front: 'revalidatePath vs revalidateTag',
    back: 'revalidatePath("/blog") invalidates the cache for a specific route. revalidateTag("posts") invalidates every fetch tagged with that string, wherever it was called , more precise for CMS webhooks.',
    category: 'Q&A'
  },
  {
    id: 'next-stale-while-revalidate',
    front: 'Stale-while-revalidate (ISR)',
    back: 'When a page becomes stale after its revalidate window, the current visitor still gets the old cached HTML instantly while Next.js regenerates it in the background , the next visitor gets the fresh version.',
    category: 'Q&A'
  },
  {
    id: 'next-use-hook',
    front: 'use() hook (React)',
    back: 'Unwraps a Promise (or Context) inside a Client Component, suspending until it resolves , pairs with a Server Component that starts a fetch without awaiting it, then passes the promise down.',
    category: 'Keyword'
  },
  {
    id: 'next-edge-runtime',
    front: 'Edge Runtime',
    back: 'A lightweight, globally-distributed runtime with only Web APIs (fetch, Web Crypto) , near-zero cold starts, ~128MB memory limit, no Node.js built-ins like fs. middleware.ts always runs here.',
    category: 'Keyword'
  },
  {
    id: 'next-runtime-export',
    front: 'export const runtime',
    back: "Set to 'edge' or 'nodejs' in a route/layout to choose its server runtime. Default is 'nodejs' (full Node APIs); 'edge' trades API access for latency and global distribution.",
    category: 'Keyword'
  },
  {
    id: 'next-cookies-headers-fn',
    front: 'cookies() / headers() (next/headers)',
    back: 'Server-only functions to read (and, in Server Actions/Route Handlers, write) request cookies and headers. Reading either opts the current route into dynamic rendering.',
    category: 'Keyword'
  },
  {
    id: 'next-httponly-cookie',
    front: 'httpOnly cookies',
    back: "Cookies set with httpOnly: true are invisible to JavaScript (document.cookie can't read them) , always use this for auth tokens to block XSS-based theft.",
    category: 'Q&A'
  },
  {
    id: 'next-nextauth',
    front: 'NextAuth.js (Auth.js)',
    back: 'The standard Next.js auth library , OAuth/Credentials/Email providers, JWT or database sessions, and a single auth.ts config exposing { handlers, signIn, signOut, auth }.',
    category: 'Keyword'
  },
  {
    id: 'next-auth-server-vs-client',
    front: 'auth() vs useSession()',
    back: 'auth() (server) reads the session directly in Server Components with zero client JS. useSession() (client) is reactive but requires wrapping the tree in a Client Component SessionProvider.',
    category: 'Q&A'
  },
  {
    id: 'next-react-cache',
    front: 'React cache()',
    back: 'Memoizes a server-side async function per request , if a layout and a page both call the same cache()-wrapped getUser(id), only one DB query actually runs.',
    category: 'Keyword'
  },
  {
    id: 'next-bundle-analyzer',
    front: '@next/bundle-analyzer',
    back: 'A plugin that visualizes what is inside each JS bundle/chunk , run with ANALYZE=true to spot oversized dependencies worth dynamic-importing or replacing.',
    category: 'Keyword'
  },
  {
    id: 'next-sitemap-robots-files',
    front: 'sitemap.ts / robots.ts',
    back: 'File-convention APIs in app/ that auto-generate /sitemap.xml and /robots.txt from exported functions , no manual XML/text file needed.',
    category: 'Keyword'
  },
  {
    id: 'next-jsonld',
    front: 'JSON-LD structured data',
    back: 'A <script type="application/ld+json"> block with schema.org markup (Article, Product) embedded in a page , enables Google rich results like author, date, or price in search listings.',
    category: 'Q&A'
  },
  {
    id: 'next-output-standalone',
    front: 'output: "standalone"',
    back: 'A next.config.js option that produces a minimal, self-contained server.js build (only the files actually needed at runtime) , the standard base for a lean Docker image.',
    category: 'Keyword'
  },
  {
    id: 'next-output-export',
    front: 'output: "export"',
    back: 'Produces a fully static site (plain HTML/CSS/JS in out/) hostable on any static host , but drops SSR, Route Handlers, middleware, and ISR entirely.',
    category: 'Q&A'
  },
  {
    id: 'next-turborepo',
    front: 'Turborepo',
    back: "Vercel's monorepo build tool , caches task outputs (build/lint/test) per package and only reruns what actually changed, with optional remote caching shared across a team/CI.",
    category: 'Keyword'
  },
  {
    id: 'next-transpile-packages',
    front: 'transpilePackages (next.config.js)',
    back: 'Tells Next.js to transpile listed workspace packages (e.g. a shared "@repo/ui") that ship untranspiled TS/JSX , required in Turborepo/monorepo setups.',
    category: 'Keyword'
  }
];

export const nextjsRenderingFlashcards: Flashcard[] = [
  {
    id: 'next-csr-vs-ssr',
    front: 'CSR vs SSR',
    back: 'CSR: the browser downloads JS and renders the page client-side. SSR: the server generates HTML per request and sends it ready-to-display , better first paint and SEO.',
    category: 'Q&A'
  },
  {
    id: 'next-ssr',
    front: 'Server-Side Rendering (SSR)',
    back: 'HTML is generated on the server for each request , always fresh, personalized data. App Router: a route becomes dynamic when it uses cookies()/headers()/searchParams or uncached fetches.',
    category: 'Keyword'
  },
  {
    id: 'next-ssg',
    front: 'Static Site Generation (SSG)',
    back: 'Pages pre-rendered to static HTML at build time, served instantly from a CDN with no per-request server cost. Best for content that rarely changes.',
    category: 'Keyword'
  },
  {
    id: 'next-isr',
    front: 'Incremental Static Regeneration (ISR)',
    back: 'Update static pages AFTER build , time-based (revalidate / cacheLife) or on-demand (tags) , serving stale content while regenerating in the background. No full rebuild.',
    category: 'Keyword'
  },
  {
    id: 'next-ssg-vs-ssr',
    front: 'SSG vs SSR',
    back: 'SSG renders at BUILD time (one HTML for everyone, CDN-fast). SSR renders per REQUEST (fresh/personalized, server latency). ISR is the middle ground.',
    category: 'Q&A'
  },
  {
    id: 'next-prerendering',
    front: 'Pre-rendering',
    back: 'Next.js generates HTML ahead of time (SSG at build, or SSR per request) instead of an empty div filled by client JS , improving first paint and SEO. The two forms are SSG and SSR.',
    category: 'Q&A'
  },
  {
    id: 'next-auto-static-opt',
    front: 'Automatic Static Optimization',
    back: 'Pages Router: if a page has no getServerSideProps/getInitialProps, Next.js auto-prerenders it to static HTML at build , no server render needed at runtime.',
    category: 'Q&A'
  },
  {
    id: 'next-getstaticprops',
    front: 'getStaticProps',
    back: 'Pages Router data fetch that runs at BUILD time (SSG). Returns { props }, optionally { revalidate: n } for ISR. Never ships to the client.',
    category: 'Keyword'
  },
  {
    id: 'next-getserversideprops',
    front: 'getServerSideProps',
    back: 'Pages Router data fetch that runs on EVERY request (SSR). Returns { props } computed server-side with access to req/res , always fresh.',
    category: 'Keyword'
  },
  {
    id: 'next-getstaticprops-vs-gssp',
    front: 'getStaticProps vs getServerSideProps',
    back: 'getStaticProps runs once at build time (static, fast). getServerSideProps runs on each request (dynamic, fresh). Choose based on data freshness needs.',
    category: 'Q&A'
  },
  {
    id: 'next-getstaticpaths',
    front: 'getStaticPaths',
    back: 'In the Pages Router, lists which dynamic routes ([id]) to pre-render at build time. Returns { paths, fallback }. App Router equivalent: generateStaticParams.',
    category: 'Keyword'
  },
  {
    id: 'next-fallback',
    front: 'fallback in getStaticPaths',
    back: 'false: un-listed paths 404. true: serve a fallback then generate in the background. "blocking": SSR the page on first request, then cache it.',
    category: 'Q&A'
  },
  {
    id: 'next-generate-static-params',
    front: 'generateStaticParams',
    back: 'App Router function that pre-renders dynamic routes at build time (SSG). Returns an array of param objects, e.g. posts.map(p => ({ slug: p.slug })).',
    category: 'Keyword'
  },
  {
    id: 'next-streaming',
    front: 'Streaming & Suspense',
    back: 'Send the static shell immediately and stream slow async parts in as they resolve. Wrap them in <Suspense> (or use loading.tsx) so one slow fetch never blocks the whole page.',
    category: 'Keyword'
  },
  {
    id: 'next-loading-file',
    front: 'loading.tsx',
    back: 'A special App Router file that auto-wraps page.tsx in a <Suspense> boundary , instant loading UI for the route while data loads. The layout shows immediately.',
    category: 'Keyword'
  },
  {
    id: 'next-rsc',
    front: 'React Server Components (RSC)',
    back: 'Components that render only on the server: zero client JS, direct data/DB access, no hooks/state. The App Router default; opt into client with "use client".',
    category: 'Keyword'
  },
  {
    id: 'next-fetch-cache',
    front: 'fetch caching in the App Router',
    back: 'In Next.js 15 fetch is NOT cached by default. Control it with cache: "force-cache" / "no-store" or next: { revalidate: n }; the modern model is the "use cache" directive.',
    category: 'Q&A'
  },
  {
    id: 'next-dynamic-export',
    front: 'export const dynamic',
    back: 'Overrides how a route renders: "force-dynamic" (SSR every request), "force-static" (always static), or "auto" (let Next.js decide).',
    category: 'Keyword'
  },
  {
    id: 'next-ppr',
    front: 'Partial Pre-Rendering (PPR)',
    back: 'Serves a static shell instantly from the CDN while dynamic Suspense slots stream in per request , one page combining static, cached, and personalized content.',
    category: 'Keyword'
  }
];
