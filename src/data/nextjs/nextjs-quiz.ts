import type { QuizQuestion } from '@/types/content';

// ─── Next.js quiz — multiple choice ────────────────────────────────────────

export const nextjsQuiz: QuizQuestion[] = [
  {
    id: 'nextjs-q-file-routing',
    question: 'In the App Router, how does `app/blog/[slug]/page.tsx` map to a URL?',
    options: ['/blog/slug', '/blog/[slug]', '/blog/:slug (any single dynamic segment)', 'It requires manual route config to work'],
    correctIndex: 2,
    explanation: 'Folder/file structure maps directly to URLs — `[slug]` is a dynamic segment matching any single path part.',
    category: 'Routing'
  },
  {
    id: 'nextjs-q-server-component-default',
    question: 'In the App Router, what is a component by default?',
    options: ['A Client Component', 'A Server Component', 'Neither — you must always specify', 'It depends on the file extension'],
    correctIndex: 1,
    explanation: 'App Router components are Server Components unless the file (or an import) starts with the `"use client"` directive.',
    category: 'Rendering'
  },
  {
    id: 'nextjs-q-use-client',
    question: 'What does the `"use client"` directive at the top of a file do?',
    options: [
      'Disables server rendering for the whole app',
      'Marks that file (and its imports) as a Client Component, enabling hooks/state/browser APIs',
      'Forces the file to run only during the build',
      'Opts the route into Edge Runtime'
    ],
    correctIndex: 1,
    explanation: '`"use client"` is the boundary that switches a subtree from server-only rendering to client-interactive rendering.',
    category: 'Rendering'
  },
  {
    id: 'nextjs-q-code-server-action',
    question: 'What does the `"use server"` directive mark here?',
    code: `async function createPost(formData: FormData) {
  'use server';
  await db.posts.create({ title: formData.get('title') });
}`,
    options: [
      'A function that only runs in the browser',
      'A Server Action — server-only code callable directly from a client form/component',
      'A function that must be awaited by middleware',
      'Nothing — it is ignored outside of API routes'
    ],
    correctIndex: 1,
    explanation: 'Server Actions let you handle mutations (e.g. form submissions) without hand-writing a separate API route.',
    category: 'Data'
  },
  {
    id: 'nextjs-q-ssg-vs-ssr',
    question: 'What is the key difference between SSG and SSR?',
    options: [
      'SSG renders at build time; SSR renders on every request',
      'SSG only works with the Pages Router; SSR only works with the App Router',
      'SSR is always faster than SSG',
      'They are the same thing under different names'
    ],
    correctIndex: 0,
    explanation: 'SSG produces one static HTML output at build time (CDN-fast, same for everyone); SSR regenerates HTML per request (fresh, personalized).',
    category: 'Rendering'
  },
  {
    id: 'nextjs-q-isr',
    question: 'Incremental Static Regeneration (ISR) lets you:',
    options: [
      'Update statically generated pages after build, without a full rebuild',
      'Stream a page to the client before it finishes rendering',
      'Run a page exclusively on the Edge Runtime',
      'Disable caching for a specific route'
    ],
    correctIndex: 0,
    explanation: 'ISR regenerates a static page in the background after its revalidation window, serving stale content in the meantime.',
    category: 'Rendering'
  },
  {
    id: 'nextjs-q-generate-static-params',
    question: 'In the App Router, which function pre-renders a dynamic route\'s params at build time?',
    options: ['getStaticPaths', 'generateStaticParams', 'generateMetadata', 'getServerSideProps'],
    correctIndex: 1,
    explanation: '`generateStaticParams` is the App Router equivalent of the Pages Router\'s `getStaticPaths`.',
    category: 'Rendering'
  },
  {
    id: 'nextjs-q-loading-file',
    question: 'What does adding a `loading.tsx` file next to `page.tsx` do?',
    options: [
      'Nothing unless manually imported',
      'Auto-wraps the page in a Suspense boundary, showing instant loading UI while data loads',
      'Blocks the page from rendering until all data is ready',
      'Replaces the need for error.tsx'
    ],
    correctIndex: 1,
    explanation: '`loading.tsx` is a file convention that gives a route an automatic Suspense fallback with zero extra wiring.',
    category: 'Rendering'
  },
  {
    id: 'nextjs-q-layout-vs-template',
    question: 'What is the key behavioral difference between `layout.tsx` and `template.tsx`?',
    options: [
      'They behave identically',
      'layout persists across navigations (state kept, no remount); template creates a fresh instance per navigation',
      'template can only be used at the root; layout can be nested',
      'layout is client-only; template is server-only'
    ],
    correctIndex: 1,
    explanation: 'Because template remounts on every navigation, it is useful for per-route animations or effects that must re-run.',
    category: 'Routing'
  },
  {
    id: 'nextjs-q-route-groups',
    question: 'What does wrapping a folder name in parentheses, e.g. `(marketing)/about`, do?',
    options: [
      'Makes the segment optional in the URL',
      'Organizes routes / applies a different layout without adding a URL segment',
      'Marks the route as dynamic',
      'Opts the route out of static generation'
    ],
    correctIndex: 1,
    explanation: 'Route groups are purely organizational — `(marketing)/about` still resolves to `/about`.',
    category: 'Routing'
  },
  {
    id: 'nextjs-q-middleware',
    question: 'Next.js Middleware (`middleware.ts`) runs:',
    options: [
      'After the page has fully rendered, for analytics only',
      'On the Edge, before a request completes — useful for auth gating, redirects, and rewrites',
      'Only during the production build',
      'Only for API routes, never for pages'
    ],
    correctIndex: 1,
    explanation: 'Middleware intercepts a matching request before it completes, and always runs on the Edge Runtime.',
    category: 'Routing'
  },
  {
    id: 'nextjs-q-image-component',
    question: 'Why prefer `next/image` over a plain `<img>` tag?',
    options: [
      'It has smaller markup only',
      'It gives automatic resizing, lazy loading, modern formats, and layout-shift prevention via required width/height',
      'It removes the need for a CDN',
      'It works only with local images, not remote ones'
    ],
    correctIndex: 1,
    explanation: '`next/image` optimizes images at request time and reserves layout space to avoid CLS, among other things.',
    category: 'Optimization'
  },
  {
    id: 'nextjs-q-code-dynamic-import',
    question: 'What does `ssr: false` do in this call?',
    code: `const Chart = dynamic(() => import('./Chart'), { ssr: false });`,
    options: [
      'Prevents the component from ever loading',
      'Renders the component only on the client, skipping server rendering — for browser-only APIs',
      'Forces the component to load eagerly on every route',
      'Disables code splitting for that component'
    ],
    correctIndex: 1,
    explanation: '`ssr: false` is used for components that depend on `window`/`document` and cannot render on the server.',
    category: 'Optimization'
  },
  {
    id: 'nextjs-q-env-vars',
    question: 'Which environment variables get exposed to the browser bundle?',
    options: ['All variables in .env.local', 'None — env vars are always server-only', 'Only variables prefixed with NEXT_PUBLIC_', 'Only variables listed in next.config.js'],
    correctIndex: 2,
    explanation: 'Everything else stays server-only by default — the `NEXT_PUBLIC_` prefix is required to ship a value to client code.',
    category: 'Config'
  },
  {
    id: 'nextjs-q-fetch-caching',
    question: 'By default in modern Next.js (15+), how is a plain `fetch()` call in a Server Component cached?',
    options: [
      'It is cached forever automatically',
      'It is NOT cached by default — you opt in via cache options or the "use cache" directive',
      'It is cached only in production builds',
      'It is cached only if wrapped in useMemo'
    ],
    correctIndex: 1,
    explanation: 'Recent Next.js versions moved away from implicit fetch caching — caching must be explicitly requested.',
    category: 'Data'
  },
  {
    id: 'nextjs-q-revalidate-path-tag',
    question: 'What is the difference between `revalidatePath` and `revalidateTag`?',
    options: [
      'They are aliases for the same function',
      'revalidatePath invalidates a specific route; revalidateTag invalidates every fetch tagged with that string, anywhere',
      'revalidatePath only works in Middleware',
      'revalidateTag only works during the build'
    ],
    correctIndex: 1,
    explanation: 'revalidateTag is more precise for cases like CMS webhooks that should invalidate data wherever it was fetched.',
    category: 'Data'
  },
  {
    id: 'nextjs-q-error-file',
    question: 'What does `error.tsx` receive as props?',
    options: ['{ status, message }', '{ error, reset }', 'Nothing — it reads from context', '{ children, fallback }'],
    correctIndex: 1,
    explanation: '`error.tsx` is a Client Component error boundary for a route segment; `reset()` retries rendering that segment.',
    category: 'Routing'
  },
  {
    id: 'nextjs-q-edge-runtime',
    question: 'What is a defining limitation of the Edge Runtime compared to the Node.js runtime?',
    options: [
      'It cannot use fetch()',
      'It only exposes Web APIs — no Node.js built-ins like `fs`, and a much smaller memory limit',
      'It cannot handle any HTTP requests',
      'It cannot be used with TypeScript'
    ],
    correctIndex: 1,
    explanation: 'The Edge Runtime trades full Node API access for near-zero cold starts and global distribution.',
    category: 'Deployment'
  },
  {
    id: 'nextjs-q-output-export',
    question: 'What does `output: "export"` in `next.config.js` produce, and what does it give up?',
    options: [
      'A minimal standalone server.js — nothing is given up',
      'A fully static site (plain HTML/CSS/JS) — but SSR, Route Handlers, middleware, and ISR are all dropped',
      'A serverless function bundle — API routes still work',
      'It only affects image optimization settings'
    ],
    correctIndex: 1,
    explanation: '`output: "export"` is for fully static hosting; anything requiring a server at request time is unavailable.',
    category: 'Deployment'
  },
  {
    id: 'nextjs-q-parallel-routes',
    question: 'Parallel Routes (the `@slot` folder convention) are primarily used to:',
    options: [
      'Render multiple independent sections of one layout simultaneously, each with its own loading/error state',
      'Run two versions of a page for A/B testing automatically',
      'Load two different Next.js apps side by side',
      'Duplicate a route under two different URLs'
    ],
    correctIndex: 0,
    explanation: 'Parallel Routes are common in dashboards, where independent panels each need their own data-loading lifecycle.',
    category: 'Routing'
  },
  {
    id: 'nextjs-q-code-cookies-dynamic',
    question: 'What does calling `cookies()` inside this Server Component do to how the route renders?',
    code: `import { cookies } from 'next/headers';

export default async function Page() {
  const theme = (await cookies()).get('theme');
  return <div>{theme?.value}</div>;
}`,
    options: [
      'Nothing — cookies() is always safe to call in static routes',
      'It opts the route into dynamic rendering, since the response now depends on request-specific data',
      'It throws a build error',
      'It only works inside middleware.ts'
    ],
    correctIndex: 1,
    explanation: 'Reading cookies()/headers() signals the route needs per-request data, so Next.js renders it dynamically instead of statically.',
    category: 'Data'
  }
];
