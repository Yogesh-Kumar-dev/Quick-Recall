import type { Article } from '@/types/content';

export const pwaWithReactArticle: Article = {
  id: 'pwa-with-react',
  slug: 'pwa-with-react',
  category: 'Frontend',
  title: 'PWA with React',
  summary:
    'How a Vite-built React app becomes an installable, offline-capable PWA in practice: vite-plugin-pwa, Workbox caching strategies, update prompts, and the pitfalls that only show up in a real production build.',
  topics: ['PWA', 'React', 'Vite', 'Workbox'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: 'This article assumes the ground covered in PWA Introduction: what HTTPS, the manifest, and the service worker each do, and the install/activate/control lifecycle. If any of that is unfamiliar, read that article first, it explains the browser mechanics that everything below builds on top of. This article stays narrowly focused on one question: given a normal Vite-built React app, what does it actually take, file by file, to turn it into a real, working PWA?'
    },
    { type: 'heading', id: 'why-a-plugin-at-all', level: 2, text: 'Why reach for a plugin instead of hand-writing the service worker?' },
    {
      type: 'paragraph',
      text: 'It is entirely possible to hand-write a service worker for a React app: create a sw.js file, add a fetch listener, cache a hardcoded list of files in the install event. Plenty of tutorials do exactly that. The problem shows up the moment your app actually ships and gets updated more than once.'
    },
    {
      type: 'paragraph',
      text: "A Vite production build content-hashes every asset filename (app.a3f9c2.js, style.7be1d0.css), specifically so the browser's ordinary HTTP cache can treat them as permanently immutable, a new deploy just produces new filenames. But a hand-written service worker that hardcodes a list of files to precache has no idea those hashes change on every build. You would need to regenerate that list, by hand, on every single deploy, and get it exactly right, or the service worker keeps serving a stale, previous-version bundle indefinitely, since a cache-first strategy on an old filename never even attempts to fetch the new one."
    },
    {
      type: 'paragraph',
      text: "This is precisely the class of problem vite-plugin-pwa exists to solve. It is a Vite plugin that wraps Workbox, Google's own service worker toolkit, and runs as an actual step of your Vite build. Because it runs inside the build, it has direct access to the real, final list of hashed output files, and it generates both the manifest and the service worker's precache list from that real build output, automatically, every single time you build. The two artifacts (what got built, and what the service worker precaches) can never drift out of sync, because one is generated directly from the other."
    },
    { type: 'heading', id: 'installing-vite-plugin-pwa', level: 2, text: 'Installing and configuring vite-plugin-pwa' },
    {
      type: 'steps',
      items: [
        {
          title: 'Install the plugin',
          text: 'npm install -D vite-plugin-pwa (or the pnpm/yarn equivalent). It is a dev dependency, it only runs at build time.'
        },
        { title: 'Add it to vite.config.js', text: 'Import VitePWA and add it to the plugins array, alongside @vitejs/plugin-react.' },
        {
          title: 'Move manifest fields into the config',
          text: 'Instead of hand-writing a separate manifest.json, the manifest object passed to VitePWA() is used to generate one automatically at build time.'
        },
        {
          title: 'Configure Workbox options',
          text: 'The workbox key controls precaching behavior and any custom runtimeCaching rules for things like API calls.'
        }
      ]
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// vite.config.js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        description: 'An example installable React app.',
        display: 'standalone',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache every hashed build asset matching these extensions automatically.
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\\/\\/api\\.example\\.com\\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } // 1 day
            }
          }
        ]
      }
    })
  ]
});`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'What "wraps Workbox" means concretely',
      text: "vite-plugin-pwa does not invent its own caching engine. Workbox is a mature, independently maintained library of caching strategy classes (CacheFirst, NetworkFirst, StaleWhileRevalidate, and more) originally built for exactly this kind of use case. The plugin's job is narrower: read your Vite build output, generate a precache manifest from it, and emit a service worker file that imports and configures Workbox with that manifest plus whatever runtimeCaching rules you specified. Every caching strategy explained in the PWA Introduction article maps directly onto a named Workbox strategy class here."
    },
    { type: 'heading', id: 'register-type', level: 2, text: 'registerType: choosing how updates roll out' },
    {
      type: 'paragraph',
      text: 'Recall from the introduction article that a newly installed service worker parks itself in a "waiting" state rather than immediately taking over, specifically so it never yanks a resource an already-open tab is relying on mid-session. vite-plugin-pwa exposes exactly one setting that controls what happens to that waiting worker, and picking the right one matters more than almost any other option in the config.'
    },
    {
      type: 'table',
      columns: ['registerType', 'Behavior', 'Trade-off'],
      rows: [
        [
          'prompt',
          'The new service worker installs and waits. Your app is responsible for detecting this and asking the user whether to update now.',
          'User stays in full control of when a reload happens, but requires you to build UI for it, and users who ignore the prompt can stay on an old version indefinitely.'
        ],
        [
          'autoUpdate',
          'The moment a new service worker finishes installing, it activates itself and the page automatically reloads to pick it up.',
          'Every user converges on the latest version quickly with zero UI required, but a reload can happen at a moment the user did not expect, interrupting whatever they were doing.'
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Without autoUpdate, users can get stuck on an old version for a very long time',
      text: 'If registerType is left as prompt and no UI is ever built to surface that prompt, users have no way to know an update is even available, they will keep using a stale, waiting service worker until every open tab of the site happens to close naturally. For an app with tabs that tend to stay open for days (a dashboard left open in a pinned tab, for instance), that can mean weeks-old code silently still running in production long after a fix has shipped.'
    },
    { type: 'heading', id: 'caching-strategies-in-practice', level: 2, text: 'Workbox caching strategies in practice' },
    {
      type: 'paragraph',
      text: "The precache list (your app's own hashed JS/CSS/HTML) is handled automatically by globPatterns and always uses a cache-first-style precache strategy under the hood, since content-hashed filenames make a stale cache mathematically impossible: a changed file simply gets a new filename and is treated as a brand-new cache entry. The runtimeCaching array is where you take manual control over everything else your app talks to over the network: your own API, third-party APIs, images from a CDN, web fonts, and so on."
    },
    {
      type: 'code',
      language: 'javascript',
      code: `workbox: {
  runtimeCaching: [
    // Fonts rarely change once fetched, cache aggressively and skip the network entirely.
    {
      urlPattern: /^https:\\/\\/fonts\\.gstatic\\.com\\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    // API data: prefer a live answer, but do not hard-fail offline.
    {
      urlPattern: /^https:\\/\\/api\\.example\\.com\\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3, // fall back to cache if the network is slow, not just if it fails
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
      }
    },
    // Avatar/thumbnail images: show something instantly, refresh quietly in the background.
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
      }
    }
  ];
}`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'networkTimeoutSeconds turns NetworkFirst into "fast-fail, not just offline-fail"',
      text: 'Plain NetworkFirst only falls back to the cache when the network request actually fails or the browser reports itself offline. On a technically-online-but-very-slow connection (think a spotty train wifi), the request can just hang for a long time instead of failing outright, leaving the user staring at a loading spinner. Setting networkTimeoutSeconds makes Workbox give up on the network and serve the cached fallback after that many seconds even if the request has not failed yet, trading a small chance of staleness for a much better perceived performance floor.'
    },
    { type: 'heading', id: 'registration-in-react', level: 2, text: 'Registering the service worker from a React component' },
    {
      type: 'paragraph',
      text: 'Under the hood, registering a Workbox-generated service worker is still just the same navigator.serviceWorker.register() call from the introduction article. vite-plugin-pwa saves you from writing that call, and the "is an update waiting" bookkeeping around it, by generating a virtual module, virtual:pwa-register/react, containing a React hook purpose-built for exactly this. It gives you back reactive state for both offline-readiness and update-availability, so the "new version available" UI can be a real, styled piece of your app instead of a raw window.confirm() dialog.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// UpdatePrompt.tsx
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt(): React.ReactElement | null {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log('SW registered:', swUrl, registration);
    },
    onRegisterError(error) {
      console.error('SW registration failed:', error);
    }
  });

  const close = (): void => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (offlineReady) {
    return (
      <div className="toast">
        <span>App is ready to work offline.</span>
        <button onClick={close}>Dismiss</button>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div className="toast">
        <span>New content is available.</span>
        <button onClick={() => updateServiceWorker(true)}>Reload</button>
        <button onClick={close}>Later</button>
      </div>
    );
  }

  return null;
}`
    },
    {
      type: 'paragraph',
      text: 'That component only needs to be mounted once, near the root of the app, right alongside your router and any other top-level providers. With registerType: "autoUpdate" you technically do not need this UI at all (the reload happens automatically), but even then it is worth keeping a minimal version of the offlineReady branch around, since silently succeeding at "your app now works offline" with zero feedback is a missed opportunity to tell the user something genuinely useful just happened.'
    },
    {
      type: 'heading',
      id: 'spa-routing-and-manifest',
      level: 2,
      text: 'A React-specific trap: SPA routing versus start_url and navigation fallback'
    },
    {
      type: 'paragraph',
      text: 'A Vite React app is, by default, a single-page application: there is exactly one real HTML file (index.html), and client-side routing (react-router, and similar) rewrites the URL and swaps rendered components without ever asking the server for a new document. That works fine online, because your dev/production server is already configured to serve index.html for any unknown path so the client-side router can take over. But a service worker serving cached content offline has to replicate that same fallback behavior itself, or a direct offline visit (or a hard refresh) to a deep route like /dashboard/settings will 404 against the cache instead of falling through to your app shell.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Enable navigateFallback for client-side routed apps',
      text: 'Without it, an offline user who refreshes on any route other than the exact precached index.html gets a broken, uncached response. Set workbox.navigateFallback: "/index.html" in the VitePWA config so any navigation request that misses the precache falls back to the app shell, letting your client-side router take over exactly like it does online. This is arguably the single most common "it works when I click around, but breaks on refresh" bug in a React PWA.'
    },
    { type: 'heading', id: 'testing-installability', level: 2, text: 'Testing installability: this only works in a production build' },
    {
      type: 'paragraph',
      text: "By default, vite-plugin-pwa disables itself entirely in the Vite dev server. This is a deliberate choice, not a bug: the dev server's whole value proposition is instant, unbundled feedback on every file save, and a service worker aggressively caching your in-progress, half-finished work would actively fight that, serving you stale code from a cache instead of your latest edit."
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Build for real',
          text: 'Run npm run build. This is the step that actually invokes vite-plugin-pwa and generates the manifest and service worker files into dist/.'
        },
        {
          title: 'Preview the build',
          text: "Run npm run preview (Vite's built-in static file server for the dist/ output), not npm run dev."
        },
        {
          title: 'Open DevTools > Application',
          text: 'Confirm the service worker shows as "activated and is running," and that Cache Storage has real entries.'
        },
        {
          title: 'Toggle offline and reload',
          text: 'With the Offline checkbox ticked in DevTools, reload the page. A correctly configured PWA should render fully, using only cached content.'
        }
      ]
    },
    { type: 'heading', id: 'why-it-matters', level: 2, text: 'Why this matters for interviews' },
    {
      type: 'paragraph',
      text: 'A React-specific PWA question is usually testing whether you know the plumbing is generated, not hand-written, in a well-set-up project (name-dropping "vite-plugin-pwa wraps Workbox" is a strong signal on its own), whether you understand why registerType matters for how quickly users converge on a new deploy, and whether you have hit the navigateFallback gotcha yourself, since it is exactly the kind of bug that only appears once someone tests offline behavior on a route other than the homepage, which is precisely why it catches so many teams by surprise in production.'
    }
  ]
};
