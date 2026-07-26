import type { Article } from '@/types/content';

export const nextjsBuildArticle: Article = {
  id: 'nextjs-build',
  slug: 'nextjs-build',
  title: 'Walkthrough of a Next.js Build',
  summary:
    'From "why does rendering location even matter" to reading a real build output table, the Server/Client Component split, and what actually lands in .next/ when you run `next build`.',
  topics: ['Build Tools', 'Next.js', 'React Server Components'],
  difficulty: 'advanced',
  blocks: [
    {
      type: 'paragraph',
      text: "A plain React SPA build is refreshingly simple to reason about: one JavaScript bundle, one index.html, and the browser does everything from there. `next build` is not that. It looks at every single route in your app and makes an individual decision about how that route should be rendered, then splits the code for that route into two separate pieces that run in two different places. If that sounds like a lot to track, it is, but it's also one of the most useful things you can learn to read, because the build output table tells you, route by route, exactly how your app will behave in production before a single user ever loads it."
    },
    {
      type: 'paragraph',
      text: "We'll build this up from first principles: why rendering location (server vs. browser) is even a decision to make, what problem Server Components solve that older approaches didn't, and then we'll read a real .next/ folder together, including one produced by this very app, line by line."
    },

    { type: 'heading', id: 'the-problem-csr-solves-and-creates', level: 2, text: 'Why "where does rendering happen" is a real question' },
    {
      type: 'paragraph',
      text: 'Before Next.js, a lot of React apps worked like this: the server sends the browser a nearly empty HTML page (basically just `<div id="root"></div>` and a `<script>` tag), and then the browser downloads a JavaScript bundle, runs it, and only then builds the actual page. This is called client-side rendering, or CSR, and it has a real advantage: once that initial download is done, navigating between pages inside the app is very fast, because the browser is just re-rendering with JavaScript it already has, no full page reloads.'
    },
    {
      type: 'paragraph',
      text: "But CSR has two costs that get worse as an app grows. First, the user stares at a blank (or spinner-only) page until the JavaScript bundle finishes downloading, parsing, and executing, which on a slow connection or an underpowered phone can be seconds, not milliseconds. Second, and often more painful in practice, is what's sometimes called a request waterfall: the component that needs data can't even start fetching it until its JavaScript has downloaded and run, so you get download JS, then run JS, then discover what data is needed, then fetch that data, then finally render, all one after another instead of in parallel. Search engines and social-media link previews historically struggled with CSR too, since a crawler that doesn't execute JavaScript sees only that empty div."
    },
    {
      type: 'paragraph',
      text: 'Next.js exists largely to attack that problem: do as much of the rendering and data-fetching work as possible on the server, where it\'s close to your database and doesn\'t require shipping megabytes of JavaScript to the user first, and send the browser something closer to a finished page. But "render everything on the server, always" has its own cost: it means a round trip to the server for every single page, which is exactly what CSR was trying to avoid for fast in-app navigation. The honest answer is that neither "always client" nor "always server" is correct for every route in a real app, a marketing homepage, a live dashboard, and a mostly-static docs page all want different tradeoffs. That\'s the actual reason `next build` makes a per-route decision instead of a single global one.'
    },

    { type: 'heading', id: 'per-route-decisions', level: 2, text: 'Per-route rendering strategy' },
    {
      type: 'paragraph',
      text: "For every route in your app, the build inspects what that page's code actually does, does it read anything that can only be known at request time, like a cookie or a search param, or does it only read things that are the same for every visitor, and picks one of three strategies. Each one is shown as a small symbol next to the route in the build output table you see after running next build."
    },
    {
      type: 'table',
      columns: ['Symbol', 'Strategy', 'What it means'],
      rows: [
        [
          '○',
          'Static',
          "The page reads no request-specific data at all. It is rendered exactly once, at build time, into a finished HTML file, and every visitor is served that same file, like a plain static website. Fastest possible response, since there's no server rendering work happening per visit."
        ],
        [
          '●',
          'SSG (Static Site Generation)',
          'Same idea as Static, but for a dynamic route, like /articles/[slug], that has many possible values. generateStaticParams() tells the build every value slug can take, and Next prerenders one finished HTML file per value at build time, ahead of any real visitor showing up.'
        ],
        [
          'ƒ',
          'Dynamic',
          "The page reads something that genuinely can't be known until a real request arrives, cookies(), headers(), an uncached data fetch, or a dynamic value read out of searchParams. Because that information doesn't exist yet at build time, the page can't be prerendered; it has to be rendered fresh, on the server, for every single request."
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Why a route that "looks static" can still show ƒ',
      text: 'Reading `searchParams` inside a Server Component, or calling a data source that isn\'t cached, opts that entire route out of static rendering, even if there\'s no visible loading spinner and the page looks static in the browser. This is the single most common "why is my page suddenly slow in production" surprise: a route that used to render instantly from a prebuilt HTML file starts doing real server work on every request, often because of one small, easy-to-miss line of code.'
    },
    {
      type: 'paragraph',
      text: "It's worth internalizing just how different these feel to a real visitor. A Static (○) route is, from the server's perspective, indistinguishable from serving a plain .html file, there is no rendering work happening per request at all, it was already done once at build time. A Dynamic (ƒ) route means the server is doing real work, running your component code, possibly querying a database, for every single visitor, every single time. That's not automatically bad (a live inbox obviously needs fresh data every time), but it's a cost you want to be choosing on purpose, not stumbling into by accident."
    },

    { type: 'heading', id: 'rsc-split', level: 2, text: 'Server and Client Components: two kinds of code in one file tree' },
    {
      type: 'paragraph',
      text: "Here is the idea that trips up almost everyone coming from an older React mental model: not all of your component code ends up in the browser. In the App Router, every component is a Server Component by default, meaning its code runs only on the server (or ahead of time, at build, for static routes) and never gets shipped to the user's device at all. It can do things a browser-side component never safely could, like reading a database directly, or using a secret API key, because none of that code is exposed to the browser in the first place."
    },
    {
      type: 'paragraph',
      text: "A Client Component is different, and it's marked explicitly: you add the string `'use client'` at the very top of a file. That one line is a boundary marker, everything in that file, and everything it imports beneath it, gets bundled into JavaScript the browser actually downloads and runs. You reach for a Client Component specifically when you need something a server can't provide: state (`useState`), effects (`useEffect`), event handlers (`onClick`), or browser-only APIs."
    },
    {
      type: 'paragraph',
      text: "So when the build compiles your app, it walks the module graph starting from each route and physically separates it into two outputs. One is a server-only bundle: it runs on the server (or at build time for static routes), does whatever data-fetching or logic your Server Components contain, and produces something called an RSC payload, a compact serialized description of what to render, not raw HTML and not your source code. The other is a client bundle: only the code reachable from a 'use client' boundary, and only that code, gets included. Your Server Component's actual source, its imports, its database queries, its business logic, never crosses into that client bundle. Only its rendered *output* does."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Server Component: this file's code (and its imports) never reach the client bundle
async function Page() {
  const data = await db.query(...); // runs only on the server
  return <ClientWidget initialData={data} />;
}

// Client Component: this crosses the boundary
'use client';
function ClientWidget({ initialData }) {
  const [state, setState] = useState(initialData);
  return <button onClick={() => setState(...)}>...</button>;
}`
    },
    {
      type: 'paragraph',
      text: "Look closely at what that example buys you. The db.query(...) call, and whatever query logic, table names, or credentials it might involve, physically cannot end up in the browser's JavaScript bundle, because Page is a Server Component and never gets compiled into client code at all. Only ClientWidget, the small interactive piece that actually needs useState and an onClick, gets shipped down. In an older, fully client-rendered app, this entire tree, data-fetching logic included, would have had to be bundled and sent to the browser just so it could run once and produce the same output a server could have produced directly."
    },
    {
      type: 'paragraph',
      text: "One more term worth defining plainly, since it comes up constantly around this topic: hydration. When the server sends down pre-rendered HTML (from a Static, SSG, or Dynamic route), the browser can paint that HTML to the screen immediately, before any JavaScript has even finished downloading. But that HTML is inert on its own, buttons don't respond to clicks yet, because React hasn't \"attached\" its event handlers and internal state to it. Hydration is that attaching step: React runs in the browser, walks the already-painted HTML, and wires up the interactivity for the Client Components embedded in it. It's the reason a page can visually appear before it's actually clickable, and it's also the classic source of \"hydration mismatch\" errors, when the HTML the server sent doesn't match what React expects to find when it tries to attach itself."
    },
    {
      type: 'table',
      columns: ['', 'Server Component (default)', "Client Component ('use client')"],
      rows: [
        ['Where its code runs', 'Server only (or build time), never sent to the browser', 'Bundled and sent to the browser, then hydrated'],
        [
          'Can read secrets / query a DB directly',
          'Yes, safely, nothing leaks to the client bundle',
          "No, that code would ship to every visitor's browser"
        ],
        [
          'Can use useState / useEffect / onClick',
          'No, there is no browser runtime for it to attach to',
          'Yes, this is exactly what it exists for'
        ],
        ['Contributes to client JS bundle size', 'No', 'Yes'],
        ['Re-renders on user interaction', 'No, it already ran once and produced its output', 'Yes, like ordinary React']
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: "Reach for Server Components first, add 'use client' only where you need it",
      text: "A useful default: start every new component as a Server Component (the default, no directive needed), and only add 'use client' to the smallest possible piece that genuinely needs interactivity or browser APIs. Marking a large top-level component as a Client Component drags everything it imports into the client bundle with it, even parts that never actually needed to run in the browser."
    },

    { type: 'heading', id: 'output-dir', level: 2, text: 'What lands in .next/, conceptually' },
    {
      type: 'paragraph',
      text: 'Every one of these decisions, per-route rendering strategy and the server/client split, has to be recorded somewhere so that next start (or your hosting platform) knows how to actually serve each route in production. That "somewhere" is the .next/ folder, produced fresh by every next build. Before looking at a real one, here\'s what the major pieces are for.'
    },
    {
      type: 'steps',
      items: [
        {
          title: '.next/static/',
          text: 'The client-side JS and CSS chunks, the code that actually gets downloaded by browsers. Every file here is content-hashed, meaning its filename changes whenever its content does, which is what makes it safe to tell browsers "cache this forever" (a far-future Cache-Control header) without risking users getting stuck on stale code.'
        },
        {
          title: '.next/server/',
          text: 'The server side of the split: functions that render each route on the server, plus the RSC payload templates used when streaming a response or navigating client-side without a full page reload. This code is never sent to the browser.'
        },
        {
          title: 'BUILD_ID',
          text: "A unique identifier generated for this specific build. It's used to detect version mismatches, if a user has an old client bundle open in their browser tab and you deploy a new build mid-session, Next can tell the BUILD_IDs don't match and knows the old chunks are no longer valid, so it triggers a fresh load instead of trying to mix old and new code."
        },
        {
          title: 'output: "standalone" (optional next.config.ts setting)',
          text: "By default, deploying a Next app means shipping your entire node_modules folder alongside it, often several hundred megabytes. The standalone output mode traces exactly which files, out of node_modules, each route actually needs at runtime, and copies only those into a minimal, self-contained server bundle. That's the difference between a multi-hundred-megabyte Docker image and one closer to 50MB."
        }
      ]
    },

    { type: 'heading', id: 'real-output', level: 2, text: 'A real .next/ tree, from this very app' },
    {
      type: 'paragraph',
      text: "That's the theory. Here's an actual (trimmed) .next/ folder from a next build of this app, QuickRecall, which has a genuine mix of static routes (like the dashboard) and SSG routes (the articles, one of which is this very page)."
    },
    {
      type: 'filetree',
      root: '.next/',
      nodes: [
        { name: 'BUILD_ID', type: 'file', comment: 'this build\'s id, e.g. "kY-_XOyCM2qjLMSXXlHpK"' },
        { name: 'routes-manifest.json', type: 'file', comment: 'every route mapped to its rendering strategy' },
        { name: 'build-manifest.json', type: 'file', comment: 'which JS chunks each page needs to hydrate' },
        { name: 'prerender-manifest.json', type: 'file', comment: 'which routes were prerendered (SSG) and their revalidate config' },
        { name: 'required-server-files.json', type: 'file', comment: 'the minimal file list `next start` needs to run' },
        {
          name: 'static/',
          type: 'folder',
          children: [
            { name: 'chunks/', type: 'folder', comment: 'shared + per-route client JS, content-hashed' },
            { name: 'kY-_XOyCM2qjLMSXXlHpK/', type: 'folder', comment: "this build's own manifests, keyed by BUILD_ID" },
            { name: 'media/', type: 'folder', comment: 'hashed fonts and next/image assets' }
          ]
        },
        {
          name: 'server/',
          type: 'folder',
          children: [
            {
              name: 'app/',
              type: 'folder',
              children: [
                { name: 'dashboard.html', type: 'file', comment: 'prerendered HTML for a static (○) route' },
                { name: 'dashboard.rsc', type: 'file', comment: 'its serialized RSC payload' },
                { name: 'articles.html', type: 'file' },
                { name: 'articles.rsc', type: 'file' },
                {
                  name: 'articles/',
                  type: 'folder',
                  comment: 'one HTML+RSC set per generateStaticParams() entry',
                  children: [
                    { name: 'pwa-introduction.html', type: 'file' },
                    { name: 'pwa-introduction.rsc', type: 'file' },
                    { name: 'pwa-introduction.meta', type: 'file' },
                    { name: '...', type: 'file', comment: 'one more set per article slug' }
                  ]
                }
              ]
            },
            { name: 'chunks/', type: 'folder', comment: 'server-side render functions, not shipped to the browser' }
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      text: "Read that tree the way you'd now read the build output table. dashboard.html and dashboard.rsc exist because the dashboard route reads nothing request-specific, so it earned a ○ Static verdict and was rendered exactly once. The articles/ folder is the SSG (●) story made concrete: this app's article pages live under a dynamic [slug] route, and generateStaticParams() (see src/app/(app)/articles/[slug]/page.tsx) returns every known article slug ahead of time, so the build produced a matching pwa-introduction.html, pwa-introduction.rsc pair (and one more pair per article) instead of rendering any of them on demand."
    },
    {
      type: 'callout',
      variant: 'note',
      title: '.html + .rsc, side by side, and what each one is actually for',
      text: "Every prerendered route gets both a .html file and a .rsc file, and they serve two different visits. The .html file is what gets sent for the very first request to that URL, a full document a browser (or a search engine crawler) can render with zero JavaScript required. The .rsc file is the serialized React Server Component payload, used for client-side navigations once the app is already running in the browser: clicking a Next <Link> to another page doesn't re-download a whole new HTML document, it fetches the much smaller .rsc diff and lets React update the existing page in place."
    },

    { type: 'heading', id: 'compiler', level: 2, text: 'Turbopack vs. webpack: the engine underneath it all' },
    {
      type: 'paragraph',
      text: 'One layer below everything discussed so far, rendering strategy, the RSC split, the manifests in .next/, is the actual compiler doing the file transforms and bundling. Next.js 16 defaults new apps to Turbopack, a bundler written in Rust, for both dev and build, replacing the JavaScript-based webpack pipeline that powered every earlier version of Next.js.'
    },
    {
      type: 'paragraph',
      text: "If the Vite article on this site sounds familiar here, that's intentional, the underlying idea genuinely rhymes: Turbopack does incremental, request-scoped compilation in development, so editing one file doesn't force recomputing the whole app's bundle, the same category of win Vite gets from never bundling in dev at all. But there's a real difference worth calling out: Vite hands production off to a second, different tool (Rollup). Turbopack does not hand off, it's used for the production build itself too, not just development. One engine, two modes, rather than two engines."
    },
    {
      type: 'table',
      columns: ['', 'webpack (legacy default)', 'Turbopack (Next.js 16 default)'],
      rows: [
        ['Written in', 'JavaScript', 'Rust'],
        ['Used for dev', 'Yes, rebuilds affected parts of the bundle on change', 'Yes, incremental request-scoped compilation'],
        ['Used for production build', 'Yes', 'Yes, same engine as dev'],
        ['Plugin ecosystem', 'Very large, over a decade of accumulated plugins', 'Newer, still filling in webpack-plugin-equivalent gaps'],
        ['Typical build speed on large apps', 'Slower, JS-based transform pipeline', 'Faster, Rust-based transform pipeline']
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Not every webpack plugin has a Turbopack equivalent yet',
      text: "Some tooling that reaches directly into webpack's compilation hooks, custom loaders, certain codegen plugins, doesn't have a one-to-one Turbopack story yet. This project ran into exactly that: @serwist/next, the usual way to add a PWA service worker to a Next app, compiles the service worker via webpack and has no Turbopack plugin API to hook into. Worth checking before assuming a migration to Turbopack is a simple flag flip, sometimes it genuinely isn't yet."
    },

    { type: 'heading', id: 'this-apps-real-setup', level: 2, text: 'How this app actually deals with the Turbopack gap' },
    {
      type: 'paragraph',
      text: "Since this article already grounded itself in a real .next/ output from this codebase, it's worth finishing the loop and showing how QuickRecall itself navigates the one gap called out above. The project builds entirely on Turbopack (per the CLAUDE.md build commands, pnpm dev and pnpm build both target it), but it also needs a PWA service worker for offline support, and @serwist/next, the standard package for that, only knows how to compile via webpack."
    },
    {
      type: 'paragraph',
      text: "The workaround, visible directly in this repository, is @serwist/turbopack. Instead of relying on a webpack plugin hook that doesn't exist for Turbopack, the service worker is compiled on request through an ordinary Next.js Route Handler."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// src/app/serwist/[path]/route.ts (trimmed)
import { createSerwistRoute } from '@serwist/turbopack';

// Compiles src/app/sw.ts into the service worker served at /serwist/sw.js,
// Turbopack has no webpack-style plugin hook, so @serwist/turbopack compiles
// it on request via this Route Handler instead.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  useNativeEsbuild: true
});`
    },
    {
      type: 'paragraph',
      text: 'And in next.config.ts, withSerwist(nextConfig) does noticeably less than you might expect from a bundler-integration wrapper, it just adds esbuild and esbuild-wasm to serverExternalPackages, the setting that tells Next "don\'t try to bundle these packages yourself, let them run as plain Node dependencies", so that the route handler above is able to bundle the service worker itself, in a Node runtime, on demand.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The general lesson, past this one specific package',
      text: 'The pattern here generalizes: when a tool assumes webpack and Turbopack has no plugin hook for it, look for whether that tool (or the Next.js ecosystem around it) offers a Route Handler-based escape hatch instead of a build-plugin-based one. A Route Handler runs ordinary server code on request, which sidesteps the entire "does this bundler support this compilation hook" question, at the cost of doing that compilation work at request time instead of once at build time (this project caches the compiled output and precache entries accordingly, see the additionalPrecacheEntries handling in that same route file).'
    },

    {
      type: 'heading',
      id: 'reading-it-all-together',
      level: 2,
      text: 'Putting it together: reading a build like an engineer, not a spectator'
    },
    {
      type: 'paragraph',
      text: "None of these pieces, rendering strategy, the Server/Client split, the .next/ manifests, Turbopack, are really separate topics. They're one pipeline, and each stage answers a question the next stage depends on. The rendering strategy table tells you when a route's HTML gets produced (once, at build time, or fresh, per request). The Server/Client split tells you which code, for that route, ever reaches the browser at all. The .next/ folder is just those two decisions, made concrete as real files on disk. And Turbopack (or webpack) is the engine actually doing the compiling and bundling that produces those files in the first place."
    },
    {
      type: 'paragraph',
      text: "Next time next build finishes and prints its route table, you now have enough of a mental model to read it as information, not just noise: a ○ next to a route means it's as cheap to serve as a static file; an ƒ means real server work happens on every visit, worth double-checking that it's intentional; and every route, regardless of its symbol, is quietly running two different bundles under the hood, one that never leaves the server, and one that does."
    }
  ]
};
