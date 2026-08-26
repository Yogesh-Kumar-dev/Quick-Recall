import type { Article } from '@/types/content';

export const pwaIntroductionArticle: Article = {
  id: 'pwa-introduction',
  slug: 'pwa-introduction',
  category: 'Frontend',
  title: 'PWA Introduction',
  summary:
    'A ground-up explanation of what a Progressive Web App actually is, why each of its three pillars (HTTPS, manifest, service worker) exists, how caching strategies and install prompts work, and how a PWA compares to a native app.',
  topics: ['PWA', 'Web Platform', 'Service Workers', 'Offline'],
  difficulty: 'basic',
  blocks: [
    { type: 'heading', id: 'what-is-a-pwa', level: 2, text: 'What is a Progressive Web App, really?' },
    {
      type: 'paragraph',
      text: 'Start with the plain, unglamorous version: a Progressive Web App (PWA) is a website. That is the whole starting point. It is HTML, CSS, and JavaScript, served over the internet, that runs in a browser tab exactly like any other page you have ever visited. Nothing about a PWA requires a different programming language, a different hosting provider, or a submission process to an app store.'
    },
    {
      type: 'paragraph',
      text: 'What makes it "progressive" is that it can optionally pick up a handful of extra capabilities that used to be exclusive to native apps, the kind you download from the App Store or Play Store: an icon on the home screen, a launch experience with no browser address bar around it, the ability to keep working when the phone has no signal, and the ability to push a notification to the user even when the app is not open. Each of those capabilities is unlocked by a specific, well-defined browser feature, and a site can adopt them one at a time. A site with none of them is just a website. A site with all of them starts to feel indistinguishable from an app that was installed from a store, while still being, underneath, the same website it always was.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Progressive is the key word',
      text: 'A PWA is not a binary switch you flip. It is a spectrum. Every capability layers on top of a working website that already functions with none of them, which means you can never truly "break" the base experience by attempting to add PWA features badly, the worst case is that the extra features silently do not activate.'
    },
    {
      type: 'paragraph',
      text: 'To make this concrete, imagine a recipe website. As a plain website, a visitor types the URL, the page loads, they read the recipe, done. Now imagine that same site adds a manifest file and a service worker. Suddenly a visitor can tap "Add to Home Screen" on their phone, get a real icon next to their other apps, tap it to open a window with no browser bar, and even open it on a flight with no wifi and still see the last few recipes they viewed, because those pages were saved locally by the service worker the last time they had a connection. None of the recipe content changed. None of the underlying code changed in any fundamental way. Three new files (roughly) were added, and the experience crossed a threshold from "a page I visit" to "an app I use."'
    },
    { type: 'heading', id: 'why-this-exists', level: 2, text: 'Why does this exist at all?' },
    {
      type: 'paragraph',
      text: 'For a long time there was a hard line between "web app" and "native app." Web apps were easy to build and instantly available (no install step, no app store review, one codebase for every device), but they could not be added to a home screen, could not work offline, and could not send push notifications. Native apps could do all of that, but cost more to build (often a separate codebase per platform), had to go through app store review, and required the user to accept a multi-megabyte download before they had even seen whether the app was worth keeping.'
    },
    {
      type: 'paragraph',
      text: 'Browser vendors, led originally by Google around 2015, decided to close that gap from the web side rather than asking every business to build and maintain two or three native apps just to get home-screen presence and offline support. The result was not a new language or a new runtime, it was three existing, boring, well-understood browser technologies (HTTPS, a JSON manifest file, and a scriptable network proxy called a service worker) wired together with a name attached to the pattern: Progressive Web App.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'If you remember nothing else from this article',
      text: 'A PWA is not a framework, a build tool, or a library. It is a pattern built from native browser APIs. Any site, in any framework or none at all, can become a PWA by adding a manifest file and a service worker over HTTPS. The next two articles cover how React and Next.js projects wire this up in practice, but the underlying browser mechanics explained here are identical no matter what generated the HTML.'
    },
    { type: 'heading', id: 'the-three-pillars', level: 2, text: 'The three pillars' },
    {
      type: 'paragraph',
      text: 'Every PWA capability traces back to one of three foundational pieces. If you can name which pillar is responsible for which behavior, you already understand PWAs better than most people who have only heard the buzzword. Miss one of the three and the "installed app" illusion breaks in a specific, predictable way, not a vague "it just does not work" way.'
    },
    {
      type: 'table',
      columns: ['Pillar', 'What it is', 'What breaks without it'],
      rows: [
        [
          'HTTPS',
          'The page is served over an encrypted, tamper-proof connection.',
          'Service workers refuse to register at all. No offline support, no push, no install.'
        ],
        [
          'Web App Manifest',
          "A JSON file describing the app's name, icons, colors, and how it should launch.",
          'The browser has no icon, no name, and no launch mode to install, so there is nothing to add to the home screen.'
        ],
        [
          'Service Worker',
          'A background script that can intercept network requests.',
          'No offline support, no background caching, no push notifications, no "new version available" prompts.'
        ]
      ]
    },
    { type: 'heading', id: 'pillar-https', level: 3, text: 'Pillar 1: HTTPS' },
    {
      type: 'paragraph',
      text: 'This one is easy to skip past, but it is worth understanding why it is a hard requirement rather than a recommendation. A service worker is an extremely powerful piece of code: once installed, it can see and rewrite every single network request the page makes, including requests to your bank\'s API if the service worker happened to be malicious and the page happened to load one. If an attacker could inject or swap out a service worker while it travels over an insecure connection (a classic "man in the middle" attack on public wifi, for example), they would gain the ability to silently intercept and rewrite everything that page ever fetches, forever, even after the user leaves the malicious wifi network, because the service worker persists.'
    },
    {
      type: 'paragraph',
      text: 'Because the capability is so powerful, browsers simply refuse to let a page register a service worker unless the page itself was delivered over HTTPS, the encrypted, certificate-verified version of HTTP. This guarantees the service worker code the browser is about to run for potentially months into the future is exactly the code the server intended to send, unaltered in transit.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'localhost is the one exception',
      text: 'Browsers treat http://localhost (and 127.0.0.1) as a trusted, secure-enough context for development, so you can register and test a service worker on your local dev server without setting up HTTPS certificates yourself. The moment you deploy anywhere else, plain HTTP will not do, you need a real TLS certificate. Most hosting platforms (Vercel, Netlify, Cloudflare Pages, and so on) provision one automatically.'
    },
    { type: 'heading', id: 'the-manifest', level: 2, text: 'Pillar 2: The Web App Manifest' },
    {
      type: 'paragraph',
      text: 'Picture what "Add to Home Screen" would have to fall back to if the browser knew nothing about your site beyond its URL: it would create a shortcut with whatever the <title> tag said, using whatever favicon happened to be linked, and tapping it would just open a normal browser tab, address bar and all. That is a bookmark, not an app. The Web App Manifest is the file that upgrades that bookmark into something that looks and behaves like a real, installed application.'
    },
    {
      type: 'paragraph',
      text: "It is nothing more exotic than a JSON file, referenced from the page's <head> with a <link> tag, or in newer frameworks generated dynamically by a special route. The browser fetches it once, reads a small set of well-known fields out of it, and uses those fields to decide what icon to show, what name to display under that icon, what color to paint the loading splash screen, and, critically, what the page should look like the moment it opens: with a browser address bar, or without one."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// public/manifest.json
{
  "name": "QuickRecall - Full-Stack Developer Interview Prep",
  "short_name": "QuickRecall",
  "description": "Notes, flashcards, and machine-coding problems for interview prep.",
  "start_url": "/dashboard",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#001e2b",
  "theme_color": "#001e2b",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`
    },
    {
      type: 'paragraph',
      text: 'Walking through the fields that matter most, one at a time, because each one answers a specific question the operating system needs answered before it will let a user "install" your website like an app.'
    },
    {
      type: 'table',
      columns: ['Field', 'Question it answers'],
      rows: [
        [
          'name / short_name',
          'What should the app be called? name is used on splash screens and app listings, short_name is the (often shorter) label squeezed under the home-screen icon.'
        ],
        [
          'start_url',
          'Where should the app open when its icon is tapped? This does not have to be the homepage, it can jump straight to a dashboard or a signed-in view.'
        ],
        [
          'scope',
          'Which URLs still count as "inside the app"? Navigating outside this path can drop the standalone window and fall back to a normal browser tab.'
        ],
        [
          'display',
          'How much browser UI should be visible once launched? standalone hides the address bar and tabs entirely, fullscreen hides even the status bar, minimal-ui keeps a stripped-down nav, browser is a regular tab.'
        ],
        ['theme_color', 'What color should the OS status bar / task switcher chrome around the app be tinted?'],
        ['background_color', "What color should show behind the splash screen while the app's real content is still loading?"],
        ['icons', 'What image(s) represent the app, at what sizes, for the home screen, app switcher, and splash screen?']
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The "maskable" icon is not optional on Android',
      text: 'Android places installed icons inside OS-controlled shapes (a circle, a squircle, a rounded square, depending on the device manufacturer\'s launcher), and it crops your icon to fit. A plain icon with a logo close to its edges can get its corners chopped off. A maskable icon is one you\'ve deliberately designed with important content confined to the center "safe zone," with purpose: "maskable" telling the OS it is safe to crop the outer edges freely. Skipping this is the single most common reason a PWA\'s home-screen icon looks broken on Android despite looking fine everywhere else.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'display: "standalone" is what actually removes the browser bar',
      text: 'This is the one field people most associate with "PWAs feel like real apps." It has nothing to do with offline support or push notifications, it purely controls whether, once installed and opened, the window shows a browser address bar and tabs, or looks like a self-contained application window.'
    },
    { type: 'heading', id: 'the-service-worker', level: 2, text: 'Pillar 3: The Service Worker' },
    {
      type: 'paragraph',
      text: 'This is the pillar that unlocks everything else: offline support, background caching, push notifications, and periodic background sync. It is also the one with the steepest learning curve, because its mental model is genuinely different from how you are used to thinking about JavaScript running "in the page."'
    },
    {
      type: 'paragraph',
      text: 'A service worker is a JavaScript file the browser runs on a completely separate thread from your page, one with no access to the DOM, no access to window or document, and no shared memory with your React components or any other page script. It communicates with the page only through message-passing, similar in spirit to a Web Worker, but with one crucial extra power: it sits in front of every network request the page makes, able to inspect, rewrite, or fully answer that request itself, entirely from a local cache, without ever touching the network.'
    },
    {
      type: 'paragraph',
      text: 'The closest real-world analogy is a diligent personal assistant who intercepts every phone call before it reaches you. Most calls, the assistant just puts straight through, unmodified, exactly as if you had answered directly. But for certain calls, ones the assistant recognizes and already has a good, recent answer for, they answer on your behalf without even bothering you or dialing out. And crucially, the assistant does not vanish the moment you leave the room, they can still take messages and act on your behalf even while you are away, which is exactly how a service worker can receive a push notification and show it to the user even though no tab of the site is currently open.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The core trick: fetch interception',
      text: "Everything a service worker does for offline support boils down to one browser event: the fetch event, fired every time the page (or the service worker itself) tries to load something over the network. The service worker's handler for that event can call event.respondWith(...) with any Response it wants, one it builds by reading from a local Cache Storage bucket, one it gets from the real network, or some combination of both. The page has no idea which one it got, a Response object looks identical either way."
    },
    { type: 'heading', id: 'sw-lifecycle', level: 3, text: 'The service worker lifecycle: register, install, activate, control' },
    {
      type: 'paragraph',
      text: 'A service worker does not just start running the moment the browser sees it referenced somewhere. It goes through a deliberate, multi-step lifecycle, and understanding each step is what separates "I sort of know service workers exist" from being able to actually debug one that is behaving unexpectedly.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Register',
          text: 'The page runs navigator.serviceWorker.register("/sw.js"), usually after the page has finished loading so it does not compete with the initial page load for bandwidth and CPU. This just tells the browser "here is a script, please start managing it," it does not mean the worker is running yet.'
        },
        {
          title: 'Install',
          text: 'The browser downloads the script and fires its install event exactly once per version of the file. This is the conventional place to open a Cache Storage bucket and pre-cache the "app shell," the core HTML, CSS, and JS the app needs to render at all, so a future offline visit has something to serve.'
        },
        {
          title: 'Waiting',
          text: 'If an older version of the service worker is already controlling open tabs, the new one does not take over immediately, it parks itself in a "waiting" state so it never yanks a resource an already-open tab might still be relying on mid-session.'
        },
        {
          title: 'Activate',
          text: 'Once nothing is left using the old version (or the new worker is explicitly told to skip the wait), the activate event fires. This is the conventional place to delete caches left behind by a previous version, so storage does not grow forever across deploys.'
        },
        {
          title: 'Control',
          text: 'Only after activating does the worker start actually intercepting fetch events for pages. Crucially, the tab that originally called register() is usually NOT controlled by the brand-new worker, it keeps talking to the network (or the previous worker) normally until the next full navigation or reload.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The first visit is never an offline visit',
      text: 'Because a freshly installed service worker does not control the page that registered it until the next navigation, the very first time someone visits a brand-new PWA, every request still goes straight to the network exactly as if no service worker existed. Offline support, cached responses, all of it, only becomes available starting from the second visit. This trips people up constantly when testing: reloading the same tab after registering does not always count as "the next navigation" in every browser, closing and reopening the tab (or a hard refresh) is the reliable way to confirm control has taken effect.'
    },
    { type: 'heading', id: 'scope', level: 3, text: 'Scope: which pages does a service worker actually control?' },
    {
      type: 'paragraph',
      text: "A service worker registered at /sw.js can, by default, only control pages that live at or below the directory it was served from. Registering a worker served from /app/sw.js means it can control /app/anything but never /other-section/anything, even on the same domain. This is a deliberate security boundary: a shared hosting provider where different users get different sub-paths of the same domain should not let one user's service worker intercept another user's pages. Most single-page apps and full-site PWAs simply serve their worker from the root (/sw.js) specifically so its default scope covers the entire site."
    },
    { type: 'heading', id: 'caching-strategies', level: 2, text: 'Caching strategies: the actual decision inside every fetch handler' },
    {
      type: 'paragraph',
      text: 'Once you accept that a service worker can answer any request from either the cache or the network, the real design question becomes: for this particular request, which one should win, and in what order? Different kinds of content have genuinely different correctness requirements, so there is no single "best" strategy, there is a small toolbox of named strategies, and picking the right one per resource type is most of what building a good offline experience actually consists of.'
    },
    {
      type: 'table',
      columns: ['Strategy', 'Order of operations', 'Best for'],
      rows: [
        [
          'Cache First',
          'Check the cache. If present, return it immediately and never touch the network. Only fetch from the network on a cache miss.',
          'Content-hashed build assets (app.a3f9c2.js), fonts, and other files that are either immutable or explicitly versioned in their own filename.'
        ],
        [
          'Network First',
          'Try the network first. If it responds in time, use it (and update the cache). If the network fails or times out, fall back to whatever is in the cache.',
          'API responses and dynamic pages where freshness matters but a slightly stale answer while offline beats a hard failure.'
        ],
        [
          'Stale While Revalidate',
          'Return whatever is in the cache immediately, without waiting, then fetch a fresh copy in the background and store it for next time.',
          'Content that should feel instant but is fine being briefly out of date, a dashboard widget, a list of articles, an avatar image.'
        ],
        [
          'Cache Only',
          'Only ever read from the cache. Never touch the network, even if the cache entry is missing (the request simply fails).',
          'Assets you are certain were pre-cached at install time and will never need a network round trip, ever.'
        ],
        [
          'Network Only',
          'Only ever go to the network. Never read or write the cache.',
          'Requests that must always be live: a payment submission, an analytics beacon, anything where a stale cached response would be actively wrong or unsafe.'
        ]
      ]
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// A hand-written illustration of the two most common strategies. In practice, most
// real projects use a toolkit like Workbox instead of hand-rolling this (see the
// PWA with React and PWA with Next.js articles), but seeing the raw fetch handler
// once makes the strategy table above click into place.

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Cache First: for our own hashed build assets.
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request))
    );
    return;
  }

  // Network First: for API calls, with a cache fallback for offline.
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open('api-cache').then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Why responses have to be cloned',
      text: 'A fetch Response body is a stream, and a stream can only be read once. If you both want to hand the response back to the page AND store a copy of it in the cache, you have to call response.clone() before either read consumes it, otherwise the second read gets an already-drained, unusable body. This is one of the most common silent bugs in hand-written service workers.'
    },
    { type: 'heading', id: 'install-prompts', level: 2, text: 'The install prompt: how "Add to Home Screen" actually triggers' },
    {
      type: 'paragraph',
      text: 'Browsers do not offer an install prompt for every site that happens to have a manifest and a service worker, they apply a minimum bar first, checking things like: does the manifest have a valid name and a large enough icon, is display set to something other than a plain browser tab, does a service worker actually control the page, and is the connection secure. Only once a site clears that bar does the browser consider it "installable" at all.'
    },
    {
      type: 'paragraph',
      text: 'On desktop Chrome and Android Chrome, once a site is installable, the browser fires a beforeinstallprompt event on window. Sites can listen for this, stash the event, hide the browser\'s own generic install icon, and instead show their own custom "Install App" button at a moment of their choosing (say, after the user has engaged with the content for a bit, rather than the instant the page loads).'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); // stop the browser's automatic mini-infobar
  deferredPrompt = event; // save it to trigger later, from a button click
  showCustomInstallButton();
});

installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice; // 'accepted' | 'dismissed'
  deferredPrompt = null;
});`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Safari on iOS has no beforeinstallprompt at all',
      text: 'Apple has never implemented the beforeinstallprompt event. On iOS, installing a PWA is a manual action the user takes themselves: tap the Share icon in Safari, then "Add to Home Screen." There is no programmatic way to trigger this dialog from your own code, and no reliable way to detect in advance whether the user has already installed the app. Many production PWAs work around this by showing their own instructional banner ("tap Share, then Add to Home Screen") specifically to iOS Safari visitors, detected via user agent sniffing, since there is no feature-detectable API for it.'
    },
    { type: 'heading', id: 'push-and-background', level: 2, text: 'Push notifications and background sync, briefly' },
    {
      type: 'paragraph',
      text: "Because a service worker keeps running in the background even when no tab of the site is open, it becomes the landing point for two capabilities that would otherwise be impossible on the web: push notifications (the server sends a message through the browser vendor's push service, the service worker's push event fires, and it calls self.registration.showNotification() to display a native OS notification) and background sync (queueing a failed action, like a form submission made while offline, to automatically retry once connectivity returns, without requiring the tab to still be open)."
    },
    {
      type: 'paragraph',
      text: 'Both are genuinely deep topics on their own, deep enough that a full treatment is out of scope for an introduction focused on the core three pillars. The important takeaway here is narrower: neither push nor background sync is a separate "fourth pillar," both are simply things a service worker (pillar three) can do once it exists, unlocked the moment you already have one running.'
    },
    { type: 'heading', id: 'pwa-vs-native', level: 2, text: 'PWA vs. native app: an honest comparison' },
    {
      type: 'paragraph',
      text: 'It is tempting to treat PWAs as a strictly-better free upgrade over native apps, but the honest picture is a set of real trade-offs in both directions. Knowing where each side wins is what lets you make (or defend, in an interview) a genuine engineering decision rather than reciting marketing language.'
    },
    {
      type: 'table',
      columns: ['Dimension', 'PWA', 'Native app'],
      rows: [
        ['Distribution', 'Instant. A URL is the install.', 'Requires an app store listing and review process.'],
        [
          'Updates',
          'Automatic, silent, every visit can pick up the latest deployed version.',
          'User must accept and download an update (though some stores auto-update).'
        ],
        [
          'Codebase',
          'One codebase, runs the same on every platform with a modern browser.',
          'Often a separate codebase (or cross-platform framework) per platform.'
        ],
        [
          'Device API access',
          'Growing, but still incomplete: no full Bluetooth/NFC on iOS, limited background processing.',
          'Full access to every platform API the OS exposes.'
        ],
        [
          'Storage limits',
          'Browser-imposed quotas, can be evicted by the OS under storage pressure.',
          'Effectively as much as the device allows, rarely evicted automatically.'
        ],
        [
          'Discoverability',
          'Normal web search and links, not listed in an app store by default.',
          'Listed and searchable in the App Store / Play Store.'
        ],
        [
          'iOS support depth',
          'Meaningfully behind Android: no beforeinstallprompt, historically limited push support (improved in recent iOS versions), some storage caps.',
          'Full first-class support, unsurprisingly, since Apple builds and controls it.'
        ]
      ]
    },
    { type: 'heading', id: 'testing-and-debugging', level: 2, text: 'Testing and debugging a PWA' },
    {
      type: 'paragraph',
      text: "Every major Chromium-based browser (Chrome, Edge, Brave) ships a dedicated Application panel in DevTools built specifically for this. It shows the currently registered service worker and its exact lifecycle state (installing, waiting, activated), lets you force an update check, simulate going offline with a single checkbox, inspect every Cache Storage bucket and what is stored in each one, and preview how the manifest's icons and colors will actually render once installed."
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Open the Application panel',
          text: 'In Chrome or Edge DevTools, go to the Application tab, then Service Workers in the left sidebar to see registration status, and Cache Storage to inspect what has actually been cached.'
        },
        {
          title: 'Simulate offline',
          text: 'Check the "Offline" checkbox in the Service Workers panel (or the Network panel\'s throttling dropdown), then reload, to see exactly what a real offline visitor would see.'
        },
        {
          title: 'Run a Lighthouse audit',
          text: 'The Lighthouse tab (or the standalone Lighthouse CLI) includes a PWA-focused audit category that automatically checks the installability bar, manifest validity, and basic offline behavior, and calls out exactly which requirement is failing.'
        },
        {
          title: 'Force-update during development',
          text: 'Check "Update on reload" in the Service Workers panel while actively developing, otherwise the browser\'s normal caching of the service worker script itself can leave you debugging a stale version without realizing it.'
        }
      ]
    },
    { type: 'heading', id: 'gotchas', level: 2, text: 'Gotchas worth knowing before you build one' },
    {
      type: 'callout',
      variant: 'warning',
      title: 'A service worker can outlive your deploys if you are not careful',
      text: 'Because a service worker keeps running for months and only checks for updates periodically (browsers re-fetch the script roughly every 24 hours, or whenever navigator.serviceWorker.register() runs again), it is entirely possible for a returning visitor to be served by a service worker several versions behind your current deploy, one that still points at cache names or API shapes your backend no longer supports. Real production setups need an explicit versioning and cleanup strategy in the activate handler, not just "install and forget."'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Cache Storage is not the same as HTTP caching',
      text: "The Cache API a service worker uses (caches.open(), cache.put(), cache.match()) is a completely separate storage mechanism from the browser's normal HTTP disk cache governed by Cache-Control headers. A service worker can choose to ignore HTTP cache headers entirely and store a response forever, or re-fetch something the HTTP cache would have happily served instantly. The two systems can and do coexist, but they do not automatically coordinate with each other."
    },
    { type: 'heading', id: 'why-it-matters', level: 2, text: 'Why this matters for interviews' },
    {
      type: 'paragraph',
      text: 'PWA questions in interviews are rarely "implement a service worker from scratch on a whiteboard." They are almost always about whether you can correctly attribute a specific user-visible behavior to the right underlying pillar (is "no icon on the home screen" a manifest problem or a service worker problem?), whether you can explain the install, activate, control lifecycle without hand-waving through the "waiting" state, and whether you know which caching strategy fits which kind of data and why. Being able to say "that is a cache-first strategy because the asset is content-hashed and therefore immutable" in one sentence signals real understanding far more than being able to recite the Cache API method names.'
    }
  ]
};
