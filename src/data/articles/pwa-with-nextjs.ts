import type { Article } from '@/types/content';

export const pwaWithNextjsArticle: Article = {
  id: 'pwa-with-nextjs',
  slug: 'pwa-with-nextjs',
  title: 'PWA with Next.js',
  summary:
    'Why service workers are more awkward in Next.js than in a plain SPA, the App Router manifest convention, the Turbopack-vs-webpack-plugin gap, and a full walkthrough of the real @serwist/turbopack setup this very app runs in production.',
  topics: ['PWA', 'Next.js', 'Turbopack', 'Serwist'],
  difficulty: 'advanced',
  blocks: [
    {
      type: 'paragraph',
      text: 'This article assumes the ground covered in PWA Introduction: what a manifest and a service worker each do, the install/activate/control lifecycle, and the caching strategy vocabulary (cache-first, network-first, stale-while-revalidate). None of that changes in Next.js. What changes is the plumbing: how the manifest gets served, and, far more interestingly, how a service worker file gets built at all once Turbopack is involved. Everything from here on is grounded in the real, working setup this very app (QuickRecall) ships to production with, not a hypothetical.'
    },
    { type: 'heading', id: 'why-nextjs-is-harder', level: 2, text: 'Why Next.js makes this genuinely harder than a plain SPA' },
    {
      type: 'paragraph',
      text: 'In a Vite React SPA, there is one static output folder (dist/) built by one bundler (Rollup, via esbuild for transforms), and a PWA plugin for that bundler can hook straight into that single build pass to both read the final asset list and emit a service worker file alongside it. Next.js breaks almost every one of those assumptions at once: pages can be static, dynamic, or a mix of server-rendered and client-rendered pieces within the same route, there is no single "here is the final list of files" moment the same way, and, as of Next.js 16, the default build tool for both dev and production is Turbopack, a Rust-based bundler with no equivalent of webpack\'s plugin hook system. Most existing PWA tooling for the JavaScript ecosystem (vite-plugin-pwa, next-pwa, and Serwist\'s original @serwist/next package) was built assuming a webpack-shaped bundler underneath, because historically that is what every framework used.'
    },
    { type: 'heading', id: 'manifest', level: 2, text: 'The manifest: a file convention, not a plugin' },
    {
      type: 'paragraph',
      text: 'The good news first: the manifest half of the problem is fully solved by the App Router itself, with no third-party package needed at all. Dropping a manifest.ts file directly in the app/ directory is a special file convention Next.js recognizes automatically: it gets compiled and served at /manifest.webmanifest, with the correct Content-Type header, with zero routing config required.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// src/app/manifest.ts (this app's real manifest)
import type { MetadataRoute } from 'next';

// display: standalone + the icon set (incl. a maskable variant) are what make the app installable.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QuickRecall - Full-Stack Developer Interview Prep',
    short_name: 'QuickRecall',
    description:
      'A personal knowledge base for full-stack developer interview prep. Notes, machine-coding problems with a side-by-side code viewer, and quick-recall sheets.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#001e2b',
    theme_color: '#001e2b',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}`
    },
    {
      type: 'paragraph',
      text: 'Because manifest.ts is a real TypeScript function, not a static JSON file, it gets full type-checking through the MetadataRoute.Manifest type: a typo like "standlone" instead of "standalone" is a compile error instead of a silently-ignored field the browser just does not understand. It can also read runtime data if it needs to (environment variables, feature flags), something a plain JSON file could never do.'
    },
    { type: 'heading', id: 'sw-generation-problem', level: 2, text: 'The much harder half: generating the service worker' },
    {
      type: 'paragraph',
      text: "There is no built-in App Router convention for a service worker, the way there is for the manifest. Historically, teams filled that gap with a webpack plugin (next-pwa was the most popular, wrapping Workbox the same way vite-plugin-pwa does for Vite), or with Serwist's own @serwist/next package, both of which hook into next.config.js's webpack configuration object to emit a bundled service worker file as part of the build."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The Turbopack gap: no plugin hook to hook into',
      text: 'A webpack plugin works by reaching into webpack\'s internal compilation lifecycle, its "compiler hooks," to inject extra build steps. Turbopack is a different bundler, written in Rust, with a fundamentally different internal architecture, and (as of this writing) no equivalent plugin API webpack-shaped plugins can attach to. This means next-pwa and the original @serwist/next simply have nothing to run against once a Next.js project builds with Turbopack instead of webpack. It is not a bug to be patched, it is a genuine architectural gap between two different build systems.'
    },
    { type: 'heading', id: 'the-real-solution', level: 2, text: "This app's real solution: @serwist/turbopack" },
    {
      type: 'paragraph',
      text: 'Rather than waiting on a Turbopack plugin API that does not exist yet, the @serwist/turbopack package sidesteps the whole "hook into the bundler\'s build pass" problem with a different approach entirely: instead of a build-time plugin emitting a static sw.js file into the output directory, it compiles the service worker source on demand, at request time, from inside a normal Next.js Route Handler, a plain server function like any API route, that Turbopack already knows how to build and run without any special plugin support at all.'
    },
    {
      type: 'paragraph',
      text: 'This app registers its service worker at /serwist/sw.js, and that URL is not a static file sitting in public/, it is a live route.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// src/app/serwist/[path]/route.ts (this app's real Route Handler)
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createSerwistRoute } from '@serwist/turbopack';

// Precache revision for the self-hosted PDFium WASM, so it's re-fetched only when it changes.
function pdfiumWasmRevision(): string {
  try {
    const buf = readFileSync(path.join(process.cwd(), 'public', 'pdfium.wasm'));
    return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  } catch {
    return 'pdfium-missing';
  }
}

// Compiles src/app/sw.ts into the service worker served at /serwist/sw.js. Turbopack has no
// webpack-style plugin hook, so @serwist/turbopack compiles it on request via this Route Handler.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  // esbuild-wasm rejects Windows-style paths ("cwd is not an absolute path"); native esbuild doesn't.
  useNativeEsbuild: true,
  additionalPrecacheEntries: [
    { url: '/~offline', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString() },
    { url: '/pdfium.wasm', revision: pdfiumWasmRevision() }
  ],
  globIgnores: ['**/pdfium.wasm']
});`
    },
    {
      type: 'paragraph',
      text: 'createSerwistRoute is doing a genuinely clever thing under the hood: it takes a real TypeScript service worker source file (src/app/sw.ts in this project), bundles it using esbuild, a JavaScript/TypeScript bundler with a native binary fast enough to run per-request without noticeable latency, and streams the resulting JavaScript back as the Route Handler\'s response, with the correct Content-Type: application/javascript header a browser requires before it will register something as a service worker. In production, the compiled output is cached (generateStaticParams and revalidate, exported straight from createSerwistRoute, are what let Next.js treat this route\'s output like any other cacheable static-ish response), so "on demand" does not mean "recompiled on every single visitor," it means "compiled at build/first-request time via the normal Next.js data cache machinery, not via a webpack plugin hook."'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A real Windows-specific gotcha this project hit',
      text: 'The comment right above useNativeEsbuild: true in the actual route file is not decorative, it documents a real bug this project ran into: esbuild-wasm (the WebAssembly build of esbuild, which some serverless environments prefer for portability) rejects Windows-style file paths with a "cwd is not an absolute path" error. Forcing useNativeEsbuild: true switches to the native esbuild binary, which handles Windows paths correctly, at the cost of needing the native binary available in whatever environment actually runs the build. This is exactly the kind of platform-specific detail that only surfaces once you run the real build on a real machine, not something you would guess from documentation alone.'
    },
    { type: 'heading', id: 'config-wiring', level: 3, text: 'The next.config.ts wiring: what withSerwist actually does' },
    {
      type: 'paragraph',
      text: 'It would be reasonable to assume withSerwist(nextConfig) is where most of the "magic" lives, generating routes or injecting build steps the way a webpack plugin would. In this Turbopack-based setup it is almost deliberately boring: its entire job is registering esbuild and esbuild-wasm in serverExternalPackages, a Next.js config option that tells the server-side bundler "do not try to bundle these packages into the serverless function yourself, they have native bindings or dynamic requires that break under normal bundling, just leave them as real node_modules dependencies at runtime."'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// next.config.ts (this app's real config, trimmed to the PWA-relevant parts)
import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';

// PWA: this project builds with Turbopack, and @serwist/next's webpack-based compilation is
// incompatible with it. @serwist/turbopack works around the lack of a Turbopack plugin API by
// compiling the service worker via a Route Handler instead (src/app/serwist/[path]/route.ts).
// withSerwist here only adds the esbuild/esbuild-wasm packages to serverExternalPackages so
// that route handler can bundle in a Node runtime.
const nextConfig: NextConfig = {
  // ...other config
};

export default withSerwist(nextConfig);`
    },
    {
      type: 'paragraph',
      text: "Without that serverExternalPackages entry, Next.js's server bundler would try to trace and inline esbuild's own code (including its native binary loading logic) into the Route Handler's serverless bundle, and that native-binary-loading code does not survive being bundled like ordinary JavaScript, it needs to run as a real dependency on disk. This is the same category of problem the project's outputFileTracingIncludes setting solves for the raw machine-coding source files elsewhere in next.config.ts: Next's automatic dependency tracing is good, but not psychic, anything read or loaded in a way that is not a normal static import needs to be told about explicitly."
    },
    { type: 'heading', id: 'the-sw-source', level: 3, text: 'Inside the actual service worker: src/app/sw.ts' },
    {
      type: 'paragraph',
      text: 'This is the file that gets compiled by the Route Handler above, and it is where the real Serwist library (the modern, actively maintained successor to Workbox that the whole @serwist/* ecosystem is built around) does the caching work described conceptually in the PWA Introduction article. A few pieces are worth calling out because they show real, production caching decisions rather than a toy example.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// src/app/sw.ts (trimmed to the essential shape)
import { defaultCache } from '@serwist/turbopack/worker';
import { CacheableResponsePlugin, ExpirationPlugin, NetworkFirst, Serwist } from 'serwist';

const precacheEntries = self.__SW_MANIFEST; // the real, hashed build asset list, injected at build time

const offlineDocuments = {
  matcher: ({ request, url, sameOrigin }) =>
    sameOrigin && !url.pathname.startsWith('/api/') && request.headers.get('RSC') !== '1' && request.mode === 'navigate',
  handler: new NetworkFirst({
    cacheName: 'offline-pages-doc',
    matchOptions: { ignoreSearch: true, ignoreVary: true },
    plugins: [new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60 }), new CacheableResponsePlugin({ statuses: [0, 200] })]
  })
};

const serwist = new Serwist({
  precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [offlineDocuments, /* ...an equivalent RSC-payload cache... */, ...defaultCache],
  fallbacks: {
    entries: [{ url: '/~offline', matcher: ({ request }) => request.destination === 'document' }]
  }
});

serwist.addEventListeners();`
    },
    {
      type: 'paragraph',
      text: 'A handful of these decisions are worth understanding individually, because each one is solving a real problem, not an arbitrary style choice.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "self.__SW_MANIFEST is Serwist's equivalent of Workbox's precache manifest injection: the actual, current, content-hashed build output gets substituted into this variable when the Route Handler compiles the file, so the precache list can never drift out of sync with what was actually deployed, the same problem vite-plugin-pwa solves for a Vite build.",
        'skipWaiting: true and clientsClaim: true together mean this app opts into an "autoUpdate"-style rollout (the same trade-off named in the React article\'s registerType table): a new service worker activates and takes control immediately rather than waiting for every tab to close.',
        'Documents (real HTML page navigations) and RSC payloads (the serialized React Server Component data Next.js sends for client-side <Link> navigations) are deliberately cached separately, with ignoreVary: true, because Next.js sets a Vary response header that differentiates those two response shapes for the exact same URL. Sharing one cache bucket with Vary-aware matching disabled would let a real page navigation accidentally match a cached RSC payload instead of real HTML, rendering raw React Flight stream text on screen instead of a page.',
        'fallbacks.entries points at a dedicated /~offline route: any navigation that cannot be served from cache or network at all (a route the user never visited before, while genuinely offline) renders this page instead of the browser\'s generic "no internet" error screen.'
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: "ignoreSearch and ignoreVary exist because of this app's own filter UI",
      text: "The real comment in this app's sw.ts explains why matchOptions needs both flags: notes pages carry nuqs-driven filter state in the query string (?difficulty=easy&open=some-note), and Next.js appends its own internal RSC cache-busting token (?_rsc=abc123) to client-navigation requests. Without ignoreSearch: true, every distinct combination of filters and RSC tokens would be treated as a completely different cache entry for what is, from a user's perspective, the same page, defeating the cache almost entirely."
    },
    { type: 'heading', id: 'registering-serwistprovider', level: 3, text: 'Registering the worker: SerwistProvider' },
    {
      type: 'paragraph',
      text: "@serwist/turbopack also ships a small React provider, SerwistProvider, that wraps the equivalent of navigator.serviceWorker.register() (and the update-detection logic from the React article's useRegisterSW hook) into a single component. This app mounts it once, at the very top of its provider tree in src/app/providers.tsx."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// src/app/providers.tsx (trimmed to the PWA-relevant lines)
'use client';

import { SerwistProvider } from '@serwist/turbopack/react';

// SerwistProvider is disabled in dev because its install-time route warm-up would trigger a
// Turbopack recompile per route on every "download for offline" run.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV === 'development'}>
      {/* ...NuqsAdapter, LeafyGreenProvider, NotificationProvider, Toaster, etc... */}
      {children}
    </SerwistProvider>
  );
}`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Why development is a hard "disable", not just "the SW does not do much"',
      text: "This app's offline-download feature deliberately warms up (pre-fetches into the cache) dozens of routes at service-worker install time, as both a document request and an RSC request each, exactly like the install event in the PWA Introduction article's lifecycle explanation, just at a much larger scale than a typical app shell. Under Turbopack's dev server, every one of those on-demand route requests triggers Turbopack to compile that route fresh, since dev-mode compilation is itself request-triggered and incremental. Running the real install-time warm-up in dev would mean every single covered route gets compiled the moment the service worker installs, a needless, slow recompile storm with zero benefit, since dev builds are not the ones users experience offline anyway. Disabling registration outright in development sidesteps the problem entirely rather than trying to tune around it."
    },
    { type: 'heading', id: 'dev-vs-prod-testing', level: 2, text: 'Testing this for real: dev will not show you the truth' },
    {
      type: 'paragraph',
      text: 'Because SerwistProvider is explicitly disabled below production, and because Route Handler output caching behaves differently in dev versus a real build, "PWA behavior" in this app (or any Next.js PWA following this pattern) is only observable in an actual production build, the same "test in prod, not dev" rule that applies to every PWA setup, Vite-based or otherwise, just enforced here with an even harder switch.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Build for real',
          text: 'Run pnpm build. This is the step that produces the real, hashed asset manifest __SW_MANIFEST gets populated from.'
        },
        {
          title: 'Start the production server',
          text: 'Run pnpm start (not pnpm dev). SerwistProvider only registers when NODE_ENV is not "development", which pnpm start satisfies.'
        },
        {
          title: 'Confirm registration in DevTools',
          text: "Application > Service Workers should show /serwist/sw.js as activated and running, with a real Cache Storage set of entries under offline-pages-doc, offline-pages-rsc, and Serwist's own precache bucket."
        },
        {
          title: 'Toggle offline and navigate',
          text: 'With the Offline checkbox ticked, both a hard reload and an in-app <Link> navigation to a previously visited (or explicitly downloaded) route should render correctly, since both document and RSC requests were cached separately for exactly this scenario.'
        }
      ]
    },
    { type: 'heading', id: 'common-gotchas', level: 2, text: 'Common gotchas specific to this Next.js + Turbopack setup' },
    {
      type: 'callout',
      variant: 'warning',
      title: 'esbuild must run in the Node.js runtime, not the Edge runtime',
      text: "esbuild's native binary needs real filesystem and process access that the Edge runtime's constrained, V8-isolate-based execution environment does not provide. The Route Handler compiling the service worker (and next.config.ts's serverExternalPackages entry for esbuild/esbuild-wasm) must be left to run in the default Node.js runtime. Accidentally opting a route into the Edge runtime elsewhere in the app is a common way to reintroduce this class of failure, one that typically only surfaces once deployed, since local dev environments are more forgiving about it."
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Large files need to be excluded from the automatic precache glob, not force-included',
      text: 'This app self-hosts a ~4.6MB PDFium WebAssembly binary (for in-browser PDF rendering) that exceeds Serwist\'s default maximumFileSizeToCacheInBytes, so the automatic glob-based precache step would just warn and silently skip it. Rather than raising that size limit globally (which would let genuinely-too-large future assets slip into the precache unnoticed), this app excludes it via globIgnores and instead adds it as an explicit additionalPrecacheEntries entry with its own content-hash-derived revision string, giving it the same "only re-fetch when it actually changes" guarantee as every other precached asset, just handled deliberately instead of automatically.'
    },
    { type: 'heading', id: 'why-it-matters', level: 2, text: 'Why this matters for interviews' },
    {
      type: 'paragraph',
      text: 'A Next.js-specific PWA question is really testing two separate things at once: whether you understand that a modern build tool\'s architecture (Turbopack having no webpack-style plugin hooks) can force a genuinely different implementation strategy than "just install the popular plugin," and whether you can reason about the second-order consequences of that strategy, like why RSC payloads and document responses need separate caches under the same URL, or why a route that compiles a service worker on request needs to run in the Node.js runtime instead of the Edge runtime. Being able to explain "we compile the service worker via a Route Handler because Turbopack has no plugin API to hook a webpack-style build step into" in one sentence, and then justify why, is a strong, concrete signal, far more convincing than naming a package.'
    }
  ]
};
