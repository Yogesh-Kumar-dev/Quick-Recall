# QuickRecall — PWA Conversion Log

A running, step-by-step record of converting QuickRecall into an installable, offline-first
Progressive Web App. Each step documents **what** changed, **why**, the **key code**, and
**how to verify**. This is the reproducible/auditable source of truth for the PWA work.

## Goal

- Installable on desktop and Android (custom "Install app" button).
- Offline-first: app shell precached, visited pages cached at runtime.
- Eager **"Download everything for offline"** flow with a visible per-section progress UI,
  manually triggered, grouped by top-level sidebar area.

## Environment

- The service worker is **disabled in `next dev`** and active in the production build — see the
  Dev vs. prod workflow section below for the why and the testing loop. (An earlier iteration ran
  the SW in dev too; that was reverted after it made `npm run dev` downloads crawl.)
- Build/dev use webpack (plain `next dev` / `next build`, no Turbopack flag), satisfying
  Serwist's webpack requirement.

## Dev vs. prod workflow (IMPORTANT)

The service worker is **disabled in `next dev`** (`disable: process.env.NODE_ENV === 'development'`
in `next.config.ts`). Reason: `next dev` compiles routes on-demand, so the "download for offline"
flow (it fetches ~70 routes) triggers a webpack recompile per request — tiny payloads taking
seconds. Disabling the SW in dev keeps local development fast.

- **Day-to-day development:** `npm run dev` — fast, no SW. Everything except PWA/offline behavior
  works normally here.
- **Testing anything SW/PWA-related** (install prompt, offline mode, the download panel, cached
  detection): stop the dev server, then `npm run build && npm start` and open
  `http://localhost:3000`. Service workers are allowed on `localhost` (secure context), so this
  is fully testable locally — no deploy required. Use Chrome DevTools ▸ Application to inspect.
- Production deploys always have the SW active.

## How the PWA fits with the rest of the architecture

QuickRecall already has three mechanisms that sound cache/split-related; the PWA adds a fourth.
They operate on **different axes** and stack rather than overlap:

| Mechanism | Layer | What it decides |
| --- | --- | --- |
| Next.js route code-splitting | build / network | *which JS bytes* ship per route |
| Dynamic reducer injection (`store/reducerManager.ts`) | runtime / memory | *which Redux slices* are resident in the store heap |
| Static TS content (`src/data/*`) | build | *how content is authored* (TS modules → route chunks) |
| PWA service worker (Serwist) | network / cache | *whether bytes come from network or disk* |

**The PWA introduces no redundancy.** The service worker sits *underneath* everything: it
intercepts the network requests that route-splitting produces and caches them. Static content
compiles into those same route chunks. Reducer injection is pure in-memory store wiring that
never touches the network, so the SW neither helps nor hinders it.

Interactions, all benign:

- **× route splitting** → complementary by design. The SW caches whatever chunks a route
  requests; this is exactly why "download everything" works by fetching *route paths* (Step 8) —
  the route pulls its chunks, the SW stores them.
- **× static content** → ideal. Static content compiles to content-hashed, immutable chunks —
  perfect cache keys. A new deploy → new hashes → the SW re-caches automatically (and the
  version-aware detection in Step 12 surfaces this to the user). No special JSON cache strategy
  needed.
- **× reducer injection** → zero interaction. Injection is synchronous and in-memory; the SW only
  observes network traffic.

**The one pre-existing overlap (not caused by the PWA):** the injected Redux slices currently
wrap *static, read-only* reference data — `reducerManager.ts` itself notes the slices "hold
static reference data, so once injected we keep them resident" (which is why `remove()` is
intentionally unused). For read-only constants, route-splitting + a plain `import` of the TS array
would achieve the same code-splitting that the Redux injection provides; the Redux layer is kept
for learning value and future extensibility. It earns its keep the moment a slice holds *mutable*
state (user progress, filters, cross-route shared state). This is orthogonal to the PWA and needs
no change for offline support — noted here only so the architecture's moving parts are documented
in one place.

## Tooling choice

**Serwist (`@serwist/next`)** — the actively maintained successor to the abandoned
`next-pwa`, built for the Next.js 15 App Router. Chosen over `next-pwa` (stale, no Next 15
support) and a hand-rolled Workbox worker (reimplements precache-manifest generation for no
benefit). Serwist gives precaching, runtime caching, an offline document fallback, and
TypeScript service workers out of the box.

---

## Steps

### Step 0 — Commit pre-existing work (clean base)

Committed the in-progress video playlist player + Instagram launcher feature so the PWA work
lands on a clean tree.

- Commit: `Add per-page YouTube playlist player + Instagram launcher` (`efc2b6b`)
- 19 files changed.

### Step 1 — Install Serwist + start this log

Installed:

```bash
npm i @serwist/next   # ^9.5.11  (runtime/build plugin)
npm i -D serwist      # ^9.5.11  (service-worker library, dev dep)
```

Created this file (`docs/PWA.md`) as the running log.

**Verify:** `@serwist/next` appears under `dependencies` and `serwist` under
`devDependencies` in `package.json` (both `^9.5.11`).

### Step 2 — Wrap `next.config.ts` with Serwist

Wrapped the existing Next config with `withSerwistInit` (keeping eslint/transpilePackages/
reactStrictMode/modularizeImports/images untouched). The SW source is `src/app/sw.ts`
(this repo keeps `app/` under `src/`); the generated worker is written to `public/sw.js`.
No `disable` flag — the SW must run in the prod build.

```ts
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  additionalPrecacheEntries: [{ url: '/~offline', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString() }]
});
export default withSerwist(nextConfig);
```

**Verify:** after a build, `public/sw.js` is generated.

### Step 3 — Service worker source `src/app/sw.ts`

Standard Serwist worker: precache the injected `__SW_MANIFEST`, runtime-cache via
`defaultCache`, and fall back to the precached `/~offline` page for failed document
navigations. `skipWaiting` + `clientsClaim` so updates take effect on next load.

### Step 4 — TypeScript config for the worker

- Added `"webworker"` to `compilerOptions.lib` (the worker uses `ServiceWorkerGlobalScope`).
- Added `"public/sw.js"` to `exclude` (it's generated output, not source).
- **Serwist typings:** the docs suggest adding `@serwist/next/typings` to a tsconfig `types`
  array, but this project has no `types` array and its `typeRoots` point at the *parent*
  directory's `@types`, so a `types` entry fails to resolve (`TS2688`) and would also
  suppress the auto-included `node`/`react` globals. Instead the typings are pulled in
  locally via a triple-slash directive at the top of `src/app/sw.ts`:
  `/// <reference types="@serwist/next/typings" />`.

**Verify:** `npx tsc --noEmit` exits 0.

### Step 5 — Web manifest + layout metadata

- `src/app/manifest.ts` — typed metadata route → served at `/manifest.webmanifest` and
  auto-linked by Next. `display: standalone`, theme/background colors track the app primary
  (`#2196f3`), three icons (192, 512, maskable-512).
- `src/app/layout.tsx` — added `appleWebApp` to `metadata` (iOS standalone chrome + title) and a
  `viewport` export with `themeColor` (Next 15 wants theme-color in `viewport`, not `metadata`).

**Verify:** `/manifest.webmanifest` returns valid JSON; DevTools ▸ Application ▸ Manifest shows
the icons with no errors.

### Step 6 — PWA icons

Generated from `public/favicon.svg` with `sharp` (a one-off script, since sharp ships with
Next): `public/icons/icon-192.png`, `icon-512.png` (logo at 72% of canvas on white) and
`icon-maskable-512.png` (logo at 60% for OS shape-crop safe-zone). All square PNGs, committed
as static assets.

### Step 7 — Offline fallback `src/app/~offline/page.tsx`

Minimal, dependency-light page (inline styles, no theme provider) shown by the SW for failed
document navigations while offline. Precached via `additionalPrecacheEntries` in `next.config.ts`.

### Step 8 — Offline content manifest `src/data/offline-content.ts`

`OFFLINE_SECTIONS`: ~8 groups mirroring the sidebar, each mapping a human label → the route
paths to fetch. We list **route paths** (not chunk URLs) — fetching a route pulls its chunks,
which runtime caching then stores. `OFFLINE_TOTAL_URLS` is the overall-progress denominator.

Machine-coding slugs are **derived from the existing problem registries** — `JS_MC_SLUGS =
jsProblems.map(p => p.slug)` (`data/javascript/js-problems.ts`) and `REACT_MC_SLUGS =
reactMcProblems.map(p => p.slug)` (`data/react/react-mc-problems.ts`) — not hardcoded. Those
registries are the single source of truth, so adding a problem there automatically includes it in
the offline download with no manual list to keep in sync. Only the static page routes (notes,
quick-recall, typescript, etc.), which have no registry, are listed by hand.

### Step 9 — Download hook `src/hooks/useOfflineDownload.ts`

Owns the download state and the cached-state detection (see Step 12), built around a **sequential
queue** (see Step 13). Warms each section's URLs with `fetch(url, { cache: 'reload' })` so the SW
caches them; exposes per-section status + `overallProgress` + `enqueueSection` / `enqueueAll`. UI
is pure presentation over this.

### Step 10 — PWA UI (`src/ui-component/pwa/`) + header mount

- `InstallButton` — captures `beforeinstallprompt`, custom install action, self-hides when
  already installed (standalone) or no prompt. Shown at all breakpoints.
- `OfflineDownloadButton` + `OfflineDownloadPanel` — header icon (badge dot while running) opens
  a dialog listing each section's progress + an overall bar.
- Mounted in `src/layout/MainLayout/Header/index.tsx` next to `FullScreenSection`, reusing the
  existing `Avatar`/`Tooltip` icon-button styling.

### Step 12 — Cached-state detection (version-aware)

Detects what's already saved so a returning user isn't told "nothing downloaded", and avoids
re-downloading needlessly — while still refreshing content after a deploy.

- **Cache probing:** on panel open the hook uses `caches.match(url, { ignoreSearch: true })` to
  count how many of each section's URLs are already cached → section status becomes
  `done` (all), `partial` (some), or `idle` (none). Caveat: a cached HTML doc doesn't guarantee
  every chunk it pulls is cached, so "Saved" is a strong signal, not an absolute guarantee.
- **Deploy/version awareness (the important part):** content URLs are stable but their chunks
  are hashed per build, and StaleWhileRevalidate can serve *stale* cached HTML after a deploy.
  So skip-if-cached must be version-aware or it would pin users to old content offline. The SW
  derives a `MANIFEST_VERSION` by hashing `self.__SW_MANIFEST` (changes every deploy) and answers
  a `GET_VERSION` `postMessage`. The hook stores `{ version, completedAt }` in `localStorage`
  when a download completes. On open it compares stored vs current version:
  - **same version** → show "Saved", and `start()` **skips** already-cached URLs.
  - **new version (stale)** → sections show "Update available", and `start()` **force-refetches**
    everything (`cache: 'reload'` bypasses HTTP cache; SW stores the fresh assets).
- **Why this over build-time injection:** there's no clean documented way to inject a build
  constant into Serwist's `swSrc`; the precache manifest is already a per-deploy fingerprint, so
  hashing it needs no extra build wiring and is a single source of truth.

**Verify:** reopen the panel after a download → sections read "Saved" and Start is disabled;
after a re-deploy (new build) → panel shows "Update available" and offers "Re-download".

### Step 13 — Per-section downloads (sequential queue, Core-first)

Let the user pick which sections to save instead of all-or-nothing.

- **Per-section control:** each row in the panel has its own Download button (label adapts:
  Download / Finish / Re-download / Update; shows Queued / Downloading while busy).
- **Core-first, silent:** the `core` section is the app shell others depend on. `enqueueSection`
  auto-prepends `core` ahead of any non-core section the user picks if Core isn't already saved
  or queued — without the user having to think about it.
- **Sequential queue:** clicks add ids to a FIFO `queue` drained one section at a time by an
  effect (a `drainingRef` guard keeps it strictly sequential). `core` is always sorted to the
  front. `enqueueAll()` queues every section. This keeps progress predictable and network load
  light vs. parallel fetching.
- De-dupe: an id already queued/active is ignored; a finished (`done`) section can be re-added
  ("Re-download"). The marker is persisted after each section so detection stays accurate
  mid-progress.

**Verify:** open the panel, click Download on a single non-core section while Core is unsaved →
Core downloads first, then the chosen section; other sections stay idle. Queue several → they
run one at a time. "Download everything" still works (Core first).

### Step 14 — Connection status + offline section handling

Two additions for graceful offline behavior:

- **`OfflineStatusChip`** (`src/ui-component/pwa/`) — a persistent "Offline" chip mounted in the
  header (next to the timer/install buttons), visible only while the device is offline. Reuses the
  existing `hooks/useOnlineStatus` hook (no new hook). Fades in/out on connectivity change.
- **`OfflineSectionGuard`** — wraps the dashboard content (mounted in
  `src/app/(dashboard)/layout.tsx`). When offline AND the current route isn't cached, it renders a
  friendly "this section isn't saved offline yet" panel — a Download action (opens the existing
  `OfflineDownloadPanel`) plus links to the sections that ARE downloaded — instead of the broken /
  blank page a failed offline navigation would otherwise produce. Passes children through
  untouched when online or when the route is cached. This catches the **client-side
  link-navigation** case, which the SW's `/~offline` document fallback does *not* (that only fires
  on hard document navigations / refreshes).
- **`src/utils/offline-cache.ts`** — extracted shared `isCached(url)` / `countCached(urls)` cache
  probes (previously private in the download hook) so the hook and the guard share one
  implementation.

**Verify (prod build):** go offline (DevTools ▸ Network ▸ Offline). The header shows an "Offline"
chip. Click a section you have NOT downloaded → the guard panel appears listing your downloaded
sections; clicking one navigates there. Reconnect → chip disappears, pages load normally.

### Step 15 — Derive machine-coding slugs from the registries (de-duplication)

Step 8 originally hardcoded the JS (11) and React (21) machine-coding slug lists, duplicating the
authoritative `jsProblems` / `reactMcProblems` registries. Replaced the hardcoded arrays with
`.map(p => p.slug)` over those registries so the offline manifest can't drift when a problem is
added. Behavior-preserving (same slugs); typecheck + build green.

---

## Maintaining the app under the PWA

How the two kinds of "adding content" behave once the service worker is in place. The key idea:
the SW caches **static content** (so it gates *when* users see new code), but never touches
**IndexedDB** (Dexie migrations are independent).

### Expanding static content (more questions, a new notes page, etc.)

1. Edit the relevant `src/data/*` array (or add a new route + nav entry as usual).
2. If it's a **new route**, add its path to the right section's `urls` in
   `src/data/offline-content.ts` so it's included in "download for offline". (Machine-coding
   problems need no action — their slugs are derived from the registries; see Step 15.)
3. Commit + deploy. The build emits new content-hashed chunks; Serwist regenerates `public/sw.js`
   with a new precache manifest.

What happens automatically: a returning user's browser sees `sw.js` changed → installs + activates
the new SW (`skipWaiting` + `clientsClaim`), serving new content on next load. The
`MANIFEST_VERSION` changes, so the download panel flips saved sections to **"Update available"**
(Step 12). **No special action** — this is the clean case. Caveat: a user mid-session sees new
content only after a reload (normal PWA behavior).

### Adding / changing an IndexedDB table (`src/db/index.ts`)

The SW is **not** involved — Dexie migrates each browser at runtime when the new code executes.
Rules (these are Dexie rules; the PWA doesn't change them):

1. Add a **new** `this.version(n + 1).stores({ ...all existing tables, newTable: 'id, idx' })` —
   never edit an existing version block. Carry forward every prior table.
2. Add the `Table<…>` field to the `QuickRecallDB` class.
3. Use `.upgrade(tx => …)` if existing data needs backfilling/transforming.

PWA interaction (the subtle bit): after you deploy, a user may briefly run **cached old code**
(old schema) until the new SW activates on reload. This is safe for **additive** changes — old
code just ignores the new table. Avoid **destructive** schema changes (rename/remove a table,
change a primary key) in a release that also changes how existing data is read: a client still on
cached old code can break until it reloads. `skipWaiting: true` makes updates fast, but not
instant.

### Quick reference

| Change | Steps | PWA concern |
| --- | --- | --- |
| Add content to an existing page | Edit `src/data/*.ts`, deploy | None — auto-cached, "Update available" prompt |
| Add a new content route | Add route + nav + add path to `OFFLINE_SECTIONS` | Add to offline manifest so it's downloadable |
| Add a machine-coding problem | Add to `jsProblems` / `reactMcProblems` registry (as before) | None — offline slugs derive from the registry |
| Add an IndexedDB table/index | New `version(n+1)` carrying all tables; add class field | Keep changes **additive**; avoid destructive schema changes alongside read-path changes |

### Step 16 — Make the app launch offline (warm entry documents on SW install)

**Symptom:** install the app, download all sections, go offline, **launch the installed app** →
the "You're offline" screen appeared on the app's own landing page.

**Cause:** Serwist's precache manifest (`__SW_MANIFEST`) precaches the build *assets* (JS/CSS
chunks), not the route *documents*. Launching the installed app does a hard document navigation to
`start_url` (`/`); that document wasn't cached under a key the launch request matches, so the SW's
`fallbacks` rule served `/~offline`. Even after "download all" (which fetches `/`), the runtime
cache stored it under a key the launch navigation didn't hit.

**What didn't work:** adding `{ url: '/' }, { url: '/dashboard' }` to `additionalPrecacheEntries`.
Verified against the generated `public/sw.js` — only `/~offline` landed in the manifest; the route
documents were silently dropped. The Serwist maintainer explicitly calls this approach unreliable
for route documents ("modules imported may change while pages don't").

**The fix (maintainer-recommended):** warm the entry-point documents in the SW `install` handler
via `serwist.handleRequest`, so they're cached under the **same navigation runtime-cache key** a
real launch uses — `src/app/sw.ts`:

```ts
const URLS_TO_WARM = ['/', '/dashboard'];
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all(URLS_TO_WARM.map((url) => serwist.handleRequest({ request: new Request(url), event }))).catch(() => undefined)
  );
});
```

`next.config.ts` reverted to precaching only `/~offline`. Verified the install handler + the
`["/","/dashboard"]` warm array are present in the built `public/sw.js`.

**Verify (prod build):** `npm run build && npm start`, install the app, then **without visiting the
home page**, go offline and launch the installed app → it should open `/` (not the offline
screen). DevTools ▸ Application ▸ Cache Storage should show `/` cached right after install.

### Step 17 — Reliable cache detection (fix false "not saved" reports)

**Symptoms:** (1) offline on `/dashboard` (which rendered fine from cache) the
`OfflineSectionGuard` still showed "This section isn't saved for offline use"; (2) right after
"download everything", reopening the panel showed sections as `0/16`, `2/6`, "Partially saved" —
as if data were lost.

**Cause:** both came from `caches.match(url)` in `utils/offline-cache.ts`. Across Workbox's page
caches (`pages`, `pages-rsc`, `pages-rsc-prefetch`), a naked `caches.match` from the page context
frequently misses entries the SW's own fetch handler resolves — the stored request keys carry RSC
headers / vary data a plain string match doesn't reproduce. So detection under-reported; the data
was actually cached (the pages rendered).

**Fix:** detect by enumerating real stored requests via `cache.keys()` across all caches and
comparing by **pathname** (ground truth), instead of `caches.match`. `utils/offline-cache.ts` now
builds a memoised `Set<pathname>` (`getCachedPathnames`), with `refreshCachedPathnames()` to
invalidate it after a download or on panel/guard re-open. `isCached` / `countCached` are now set
lookups over that snapshot. The download hook reads the snapshot once per section (cheap per-URL
skip) and refreshes it after warming; the detection effect and the guard refresh before probing.

**Verify (prod build):** download everything, reopen the panel → every section reads **Saved
N/N** (no false "partially saved"). Go offline, open `/dashboard` and other downloaded routes →
they render (the guard does NOT show the "not saved" panel for routes you've downloaded).

### Step 18 — Dedicated high-capacity page cache (the whole app offline)

**Problem:** after a full download, most routes still weren't offline. Cache inspection showed only
4/16 JavaScript routes cached (and only because Next had *prefetched* them); all 11
`/js/machine-coding/<slug>` dynamic routes were absent. Root causes (verified in
`node_modules/@serwist/next/dist/index.worker.mjs`):

1. `defaultCache`'s HTML page rule matches the **request** `Content-Type` header — which a plain
   document `fetch()` never sends — so warmed documents fell through to the catch-all `others`
   cache.
2. Every `defaultCache` page cache is capped at **`maxEntries: 32`** (LRU). ~55 routes can't
   coexist — they evict each other. (Known v9 limitation per the maintainer.)
3. No `ignoreSearch`, so RSC entries keyed with `?_rsc=<token>` aren't retrievable by a later
   navigation using a different token — and our notes pages also carry nuqs filter state in the
   query (`?difficulty=…&q=…&open=…`).

**Fix (Serwist's own primitives — no hand-rolled Cache API):** a custom `runtimeCaching` rule
**prepended** to `defaultCache` (`src/app/sw.ts`):

```ts
const offlinePages: RuntimeCaching = {
  matcher: ({ request, url: { pathname }, sameOrigin }) =>
    sameOrigin && !pathname.startsWith('/api/') &&
    (request.mode === 'navigate' || request.destination === 'document' || request.headers.get('RSC') === '1'),
  handler: new NetworkFirst({
    cacheName: 'offline-pages',
    matchOptions: { ignoreSearch: true },
    plugins: [new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 30*24*60*60 }), new CacheableResponsePlugin({ statuses: [0, 200] })]
  })
};
new Serwist({ /* … */ runtimeCaching: [offlinePages, ...defaultCache] });
```

- **`ignoreSearch: true`** is essential — one cached entry per route serves every nuqs filter
  permutation and the build-specific `?_rsc=` token. Do not remove it.
- **Rule order** matters: the custom rule must precede `defaultCache` or `defaultCache`'s page
  rules win.
- **NetworkFirst**: online → fresh (+ refresh cache); offline → served from `offline-pages`.

**Warm all routes at install** (`src/app/sw.ts`), replacing the previous `['/', '/dashboard']`
warm. Routes come from `OFFLINE_SECTIONS` (imported relatively — Serwist's `swSrc` webpack pass
*does* resolve the project's tsconfig path aliases transitively, verified at build). Two
representations per route (document + RSC):

```ts
const ALL_ROUTES = [...new Set(OFFLINE_SECTIONS.flatMap((s) => s.urls))];
self.addEventListener('install', (event) => {
  event.waitUntil(Promise.all(ALL_ROUTES.flatMap((url) => [
    serwist.handleRequest({ request: new Request(url), event }),
    serwist.handleRequest({ request: new Request(url, { headers: { RSC: '1' } }), event })
  ])).catch(() => undefined));
});
```

`warmUrl` in the download hook (document + RSC) tops up the same `offline-pages` cache. Detection
(`utils/offline-cache.ts`, Step 17) enumerates all caches by `cache.keys()`, so it counts the new
entries correctly — the panel undercount and guard false-positive resolve once routes actually
persist.

**Verified in the built `public/sw.js`:** `offline-pages` cacheName, `ignoreSearch`, `maxEntries:300`,
the `RSC:"1"` warm header, the install handler, and the bundled route/registry data.

**Capacity note:** 300 entries covers ~55 routes × 2 representations + headroom. Bump `maxEntries`
if content grows substantially.

**Verify (prod build, CLEAN SW):** unregister the old SW + clear Cache Storage first. After the new
SW activates, *without downloading*, `offline-pages` already holds `/` + routes (install warm).
Download everything → panel reads Saved N/N. Re-run the `cache.keys()` console dump → the formerly
missing `/js/machine-coding/<slug>` routes are present. Offline: relaunch + sidebar-navigate to a
machine-coding problem → renders; the guard does not misfire.

<!-- Subsequent steps are appended here as they are performed. -->
