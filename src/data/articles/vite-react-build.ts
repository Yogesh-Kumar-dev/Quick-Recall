import type { Article } from '@/types/content';

export const viteReactBuildArticle: Article = {
  id: 'vite-react-build',
  slug: 'vite-react-build',
  category: 'Frontend',
  title: 'Walkthrough of a Vite React Build',
  summary:
    'From "what even is a bundler" to why Vite feels instant in dev, why it switches engines for production, and exactly what lands in dist/ when you ship.',
  topics: ['Build Tools', 'Vite', 'JavaScript Tooling'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: "If you've only ever run `npm run dev` and watched it work, this article is for you. We're going to build up from the very first question, why does a React app need a \"build tool\" at all, and end with you being able to read a real dist/ folder and explain, with confidence, exactly why Vite's dev server feels instant while its production build takes a completely different road."
    },
    {
      type: 'paragraph',
      text: "The short version, which will make a lot more sense once we've unpacked it: Vite runs two genuinely different pipelines depending on whether you're developing or shipping. In development, it barely does anything to your code, it just hands files to the browser and lets the browser's own module system do the work. In production, it hands everything off to a completely different tool, Rollup, which bundles, minifies, and optimizes for real users on real networks. Most of what feels like \"Vite magic\" is really just Vite picking the right tool for each job instead of using one tool for both."
    },

    { type: 'heading', id: 'why-bundlers-exist', level: 2, text: 'First: why does any of this exist?' },
    {
      type: 'paragraph',
      text: 'Before you can appreciate what Vite does differently, it helps to know what problem build tools were invented to solve in the first place. Rewind to the mid-2010s. A typical webpage that used JavaScript libraries loaded each one with a separate <script> tag, in a specific order, and hoped nothing collided in the global scope.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `<!-- The old way: manual script order, everything lives in window -->
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="my-app.js"></script>
<!-- my-app.js just assumes $ and _ already exist as globals -->`
    },
    {
      type: 'paragraph',
      text: 'This worked, barely, for small pages. It fell apart as apps grew: naming collisions between libraries, no way to know what depended on what just by reading the code, and a script tag load order that was one typo away from a silent bug. Along came module systems, first CommonJS (the `require()`/`module.exports` style Node.js still uses), then ES Modules (the `import`/`export` syntax you write in React today), to give JavaScript an actual, explicit way to say "this file needs that file."'
    },
    {
      type: 'paragraph',
      text: 'That solved the organization problem, but it created a new one. Browsers eventually gained native support for ES Modules, but for years they did not, and even once they did, loading hundreds of small files as hundreds of separate network requests was genuinely slow: every `import` triggers its own round trip, and on anything other than a blazing-fast connection those round trips add up fast. Bundlers like Webpack were built to solve exactly that: read your whole module graph (every file, and every file those files import, recursively), and stitch it all into a small number of files the browser can fetch in one or two requests. That is what "bundling" means: combining many source files into few output files.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'A "module graph" is just a map of who imports whom',
      text: "Picture every file in your app as a dot, and draw an arrow from a file to every other file it imports. That web of dots and arrows is the module graph. A bundler's job is to walk that graph starting from your entry file (usually main.tsx) and pull every reachable file into the final output."
    },
    {
      type: 'paragraph',
      text: "Webpack, and tools like it, got very good at this. But there was a cost: to serve you *anything* in development, a traditional bundler first has to build that entire graph and bundle it, even if you only care about the one screen you're looking at. As apps grew from dozens to thousands of modules, that upfront bundling step is what made `npm start` on a large legacy app feel like it was making coffee before it would even show you a blank page. That slow-startup pain is the exact problem Vite was built to eliminate, and it eliminates it with a genuinely different idea, not a faster bundler, but in development, no bundler at all."
    },

    { type: 'heading', id: 'dev-server', level: 2, text: "The dev server: what if we just... didn't bundle?" },
    {
      type: 'paragraph',
      text: 'Here is Vite\'s core insight, and it\'s worth sitting with because it\'s the answer to almost every "why is Vite fast" interview question: modern browsers already have a native module system built in. You can write `<script type="module" src="/main.tsx">` in an HTML file, and the browser itself will read that file, see its `import` statements, fetch those files too, and keep following the chain, no bundler required. Vite\'s dev server leans on exactly that browser capability instead of replacing it.'
    },
    {
      type: 'paragraph',
      text: 'So when you run `vite dev`, Vite starts a small local web server that does not build a bundle up front at all. Instead, it waits. When your browser loads the page and its `<script type="module">` tag asks for main.tsx, Vite serves that one file. When the browser sees main.tsx import App.tsx, it asks Vite for App.tsx next, and Vite serves that one too, transforming it on the fly as it goes (stripping TypeScript types, compiling JSX to `React.createElement` calls, and so on). Nothing gets bundled together. Every file the browser needs becomes its own tiny HTTP request, resolved lazily, exactly when something actually asks for it.'
    },
    {
      type: 'paragraph',
      text: 'This is the part that explains the "instant startup" experience: because there is no dependency graph to walk and bundle before the server can respond, startup time barely grows as your app grows. A 50-file app and a 5,000-file app both start in roughly the same amount of time, because Vite is not touching the 4,950 files that aren\'t on the current screen. Compare that to a traditional bundler-first dev server, which has to process the *entire* graph before it can serve you the first pixel, no matter how much of that graph you\'re actually looking at right now.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Your own source files (components, hooks, utilities) are served as native ES modules, transformed just-in-time using esbuild, a transpiler written in Go that is roughly 10 to 100 times faster than JavaScript-based transformers like Babel for this kind of work.',
        "npm dependencies get different treatment: on the very first run, Vite pre-bundles them once with esbuild into single flattened ESM files, cached inside node_modules/.vite. A package like lodash-es, which internally is hundreds of tiny modules, becomes one file and one request instead of hundreds. Vite also converts CommonJS-only dependencies into ESM here, since the browser's native module loader only understands ESM, not require().",
        "esbuild is doing double duty here, but only for these two jobs (per-file transforms, and pre-bundling dependencies), not for the whole production build. esbuild's own built-in bundler doesn't implement every feature Vite's production pipeline needs (like Rollup's fine-grained code-splitting strategies), so it's deliberately kept out of the production path."
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Where that pre-bundled dependency cache actually lives',
      text: "Open node_modules/.vite/deps after starting the dev server once and you'll see the flattened, pre-bundled versions of your dependencies sitting there as real files. If a dependency starts behaving strangely after an update, deleting this folder (or running vite with --force) to force a fresh pre-bundle is a genuinely useful first troubleshooting step, not just superstition."
    },

    { type: 'heading', id: 'hmr', level: 2, text: 'Hot Module Replacement: why edits show up without a refresh' },
    {
      type: 'paragraph',
      text: "Hot Module Replacement, HMR for short, is the feature that lets you edit a component, save the file, and see the change appear in the browser almost instantly, without a full page reload and, crucially, without losing your component's current state (like whatever was typed into a form, or which tab was open). It feels like a small convenience until you've worked without it, at which point every save-and-reload cycle starts to feel like friction."
    },
    {
      type: 'paragraph',
      text: 'Because Vite serves modules individually over native ESM instead of bundling them together, HMR gets to be almost embarrassingly simple compared to a traditional bundler. When you save a file, Vite\'s dev server sends a tiny message over a WebSocket connection telling the browser "this one module changed." The browser re-fetches just that file, and the HMR runtime (wired up by a Vite plugin like @vitejs/plugin-react, which also enables React Fast Refresh so component state survives the swap) re-executes it and re-renders anything downstream of it. Nothing else in the module graph needs to be touched, because nothing else was ever bundled together with it in the first place.'
    },
    {
      type: 'paragraph',
      text: 'A bundler-first dev server has a much harder version of this problem: since everything already lives inside one (or a few) combined output files, an edit to a single component technically means re-running the bundler over some portion of that combined graph and pushing a new bundle chunk down to the browser, work that scales with how much is bundled together, not with how much actually changed. Vite sidesteps that scaling problem entirely by never combining files in the first place. That is the second half of "why does Vite feel instant": fast startup because there is no upfront bundle, and fast updates because each file is independently addressable.'
    },

    { type: 'heading', id: 'production-build', level: 2, text: 'Production build: why Vite switches engines entirely' },
    {
      type: 'paragraph',
      text: "Everything above describes development, where your browser and Vite's dev server are talking to each other over localhost, on the same machine, with essentially zero network latency. Hundreds of tiny module requests are basically free in that setting. Running `vite build` targets a completely different environment: a real user, on a real device, over a real (possibly slow, possibly flaky) network connection. Hundreds of separate requests there would be genuinely slow, so production needs the thing dev deliberately avoided: real bundling, plus minification and code-splitting on top."
    },
    {
      type: 'paragraph',
      text: 'For this job, Vite hands the whole build over to Rollup, a mature, purpose-built JavaScript bundler. This is worth calling out explicitly because it surprises people: your dev server and your production build are not just "the same thing, but optimized." They are two different tools, running two different code paths, and it is entirely possible (if rare) for a bug to appear in one and not the other because Rollup and esbuild don\'t transform code in bit-for-bit identical ways.'
    },
    {
      type: 'table',
      columns: ['', 'Development (vite dev)', 'Production (vite build)'],
      rows: [
        ['Engine', 'esbuild (per-file transform + dep pre-bundling)', 'Rollup (full graph bundling)'],
        ['Unit of work', 'One file per request, on demand', 'Whole module graph, up front'],
        ['Output', 'Nothing written to disk, served in memory', 'Hashed files written to dist/'],
        ['Module delivery', 'Native browser ESM, many small requests', 'Few bundled/minified chunks'],
        ['Optimized for', 'Fast startup, fast edits, localhost latency', 'Small payload, real-world network, caching'],
        ['Code-splitting', 'Not needed, every module already independent', 'Explicit: vendor chunks, route-based dynamic import() chunks']
      ]
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
}`
    },
    {
      type: 'paragraph',
      text: "That manualChunks option is a good concrete example of what \"code-splitting\" actually buys you: without it, Rollup would happily bundle React itself into your main application chunk. Every time you shipped a one-line change to your own code, users would have to re-download React too, because it's baked into the same file. Pulling react and react-dom into their own vendor chunk means that chunk's content, and its cache-busting hash, only changes when you upgrade React, not every time you ship a feature. Returning users' browsers can keep serving that vendor chunk straight from cache."
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Resolve and transform',
          text: 'Rollup walks the module graph starting from your entry point, resolving every import. TypeScript and JSX are stripped/compiled, and CSS is extracted out of any files that import it.'
        },
        {
          title: 'Bundle',
          text: "Rollup groups modules into a small number of output chunks: typically a main chunk for your app's core code, a vendor chunk for shared dependencies (like the manualChunks example above), and separate lazy chunks for anything loaded behind a dynamic import(), such as a route that only loads when a user navigates to it."
        },
        {
          title: 'Minify and hash',
          text: 'Every output file is minified (whitespace stripped, variable names shortened, dead code eliminated) using esbuild or Terser, and each filename gets a content hash appended, like index-CRPUZuDK.js. That hash changes only when the file\'s content changes, which is what makes a "cache this file forever" HTTP header safe to use: if the content never changes, the URL never changes either.'
        },
        {
          title: 'Emit the manifest and index.html',
          text: 'Everything lands in dist/, and index.html is rewritten so its <script> and <link> tags point at the real, hashed output filenames instead of your original unhashed source paths.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Dev and prod are not the same code path',
      text: 'This is the detail most people get wrong when explaining Vite: your day-to-day dev experience runs on esbuild plus native browser ESM, but what actually ships to real users is a Rollup bundle, produced by a different tool with different transform behavior. If a bug only reproduces "in production" and never locally, it is occasionally a genuine Rollup-versus-esbuild transform difference, not just a missing environment variable or a build config typo. Worth ruling out before you spend an hour debugging the wrong layer.'
    },

    { type: 'heading', id: 'dist-output', level: 2, text: 'What actually lands in dist/' },
    {
      type: 'paragraph',
      text: 'Theory is nice, but seeing the real output makes it click. Below is the actual dist/ folder produced by a fresh npm create vite@latest (react-ts template) after running npm run build, trimmed only where noted.'
    },
    {
      type: 'filetree',
      root: 'dist/',
      nodes: [
        {
          name: 'assets/',
          type: 'folder',
          children: [
            { name: 'index-CRPUZuDK.js', type: 'file', comment: 'the bundled + minified app, content-hashed for cache-busting' },
            { name: 'index-D64VDMd1.css', type: 'file', comment: 'extracted CSS, also hashed' },
            { name: 'hero-CLDdwZDr.png', type: 'file', comment: 'an imported image, hashed and copied here by Rollup' },
            { name: 'react-CHdo91hT.svg', type: 'file' },
            { name: 'vite-BF8QNONU.svg', type: 'file' }
          ]
        },
        { name: 'favicon.svg', type: 'file', comment: 'copied verbatim from public/, unhashed' },
        { name: 'icons.svg', type: 'file', comment: 'also from public/' },
        {
          name: 'index.html',
          type: 'file',
          comment: 'the entry point, with <script>/<link> tags rewritten to the hashed assets/ filenames'
        }
      ]
    },
    {
      type: 'paragraph',
      text: "Walk through what each entry tells you. index-CRPUZuDK.js is the one big result of the entire bundle/minify/hash pipeline described above: every component, every piece of app logic, squashed into a single optimized file (or split further if the app used dynamic imports for routes). index-D64VDMd1.css exists because Vite pulled every CSS import out of your component files and concatenated them into one stylesheet, rather than shipping dozens of separate style tags. hero-CLDdwZDr.png shows that even static assets get swept into this pipeline: because that image was imported from a component file (`import hero from './hero.png'`), Vite treated it as part of the module graph, copied it into assets/, and gave it a content hash too."
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Everything under public/ ships unhashed, as-is',
      text: 'favicon.svg and icons.svg landed at the dist/ root untouched, not in assets/, and with no hash in their filenames. That is because anything placed in the public/ folder is treated as "already final": Vite copies it verbatim into dist/ without processing it at all. This matters for two reasons. First, files referenced by a fixed URL that can\'t change, like favicon.ico or a robots.txt, belong in public/, not imported from a component, precisely because they need a stable, unhashed name. Second, since public/ files never get a cache-busting hash, you should avoid using them for anything you plan to update frequently, since browsers may keep serving a stale cached copy.'
    },

    { type: 'heading', id: 'plugins', level: 2, text: 'The plugin system: one interface, two runtimes' },
    {
      type: 'paragraph',
      text: "One more piece worth understanding: Vite plugins are built as a superset of Rollup's own plugin interface. A Rollup plugin defines hooks like resolveId (how to find a module) and transform (how to change its contents), and Vite plugins can implement those exact same hooks. On top of that shared interface, Vite adds its own dev-server-only hooks, like configureServer, which let a plugin reach into the dev server itself (to add a custom middleware route, for example) in ways that make no sense in a static, one-shot Rollup build."
    },
    {
      type: 'paragraph',
      text: "This shared interface is why the ecosystem story works out the way it does: most existing Rollup plugins work in a Vite project completely unmodified, since Vite understands their hooks natively. The reverse is not generally true, though. A Vite-specific plugin like @vitejs/plugin-react, which wires up JSX handling and React Fast Refresh for HMR, leans on dev-server-only hooks that a plain Rollup config has no concept of, so it won't function correctly (or at all) outside a Vite project."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: '"It\'s just Rollup under the hood" is true, but incomplete',
      text: "It's a common (and mostly accurate) shorthand to say Vite's production build \"is Rollup.\" But a plugin's dev-server behavior and its production-build behavior can genuinely differ, because one runs inside Vite's dev server and the other runs inside a plain Rollup build. If a plugin behaves correctly in dev but not in a production build (or vice versa), check whether it's using dev-only hooks that simply don't exist in the Rollup phase."
    },

    { type: 'heading', id: 'vite-vs-webpack', level: 2, text: 'For comparison: how this differs from a webpack-first setup' },
    {
      type: 'paragraph',
      text: "If you've worked with Create React App or a hand-rolled webpack setup before, this table should make the contrast concrete rather than abstract."
    },
    {
      type: 'table',
      columns: ['', 'Vite', 'Traditional webpack dev server'],
      rows: [
        ['Dev startup cost', 'Roughly constant, does not scale with app size', 'Grows with app size, must bundle the whole graph up front'],
        [
          'How the browser gets modules',
          'Native ESM, fetched individually, on demand',
          'One (or a few) pre-bundled files, rebuilt on change'
        ],
        ['HMR scope', 'Just the changed module, via a small WebSocket message', 'Bundler recomputes and re-emits an affected bundle chunk'],
        ['Production bundler', 'Rollup (a different engine than the dev server uses)', 'webpack (the same engine used in dev)'],
        [
          'Dependency pre-processing',
          'esbuild pre-bundles npm packages into flat ESM on first run',
          'Handled as part of the normal webpack graph'
        ]
      ]
    },
    {
      type: 'paragraph',
      text: 'None of this makes webpack "wrong", it predates widespread native browser ESM support and solved real problems for the era it was built in, and it remains extremely configurable for edge cases Vite doesn\'t cover out of the box. But if you\'re explaining, in an interview or to a teammate, why a Vite-based app feels faster to develop against, the honest answer isn\'t "Vite is a faster webpack." It\'s that Vite refuses to bundle at all until the moment bundling actually matters, which is production, not every single time you hit save.'
    }
  ]
};
