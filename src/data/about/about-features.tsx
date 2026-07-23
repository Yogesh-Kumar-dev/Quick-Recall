import {
  IconArrowsMaximize,
  IconBell,
  IconCloudDownload,
  IconCode,
  IconDatabase,
  IconFileTypePdf,
  IconLink,
  IconMicrophone,
  IconPalette,
  IconSearch
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import type { CodeLang } from '@/components/content/code-highlighted';

// ==============================|| ABOUT — FEATURE REGISTRY + DEEP DIVES ||============================== //
//
// Backs both the "Under the Hood" grid on /about and the per-feature deep-dive pages at
// /about/[slug]. Code excerpts are copied from the real source files listed in `files` — when
// you change one of those files, update the excerpt here too.

export interface DeepDiveSection {
  heading: string;
  body: string[];
  code?: string;
  codeLang?: CodeLang;
}

export interface DeepDive {
  /** 1-2 sentence framing shown under the page title. */
  tagline: string;
  sections: DeepDiveSection[];
  /** Repo paths where this feature actually lives. */
  files: string[];
  gotcha?: string;
}

export interface Feature {
  slug: string;
  icon: ReactNode;
  title: string;
  blurb: string;
  tech: string;
  accent: string;
  span: 1 | 2;
  deepDive: DeepDive;
}

export const FEATURES: Feature[] = [
  {
    slug: 'offline-first',
    icon: <IconCloudDownload size={24} />,
    title: 'Installable & Offline-First',
    blurb:
      'Install QuickRecall like a native app, then download sections for offline study — pick what you need or grab everything, with live per-section progress. It even detects what is already saved and refreshes after a new release.',
    tech: 'PWA · Serwist service worker + Cache Storage API',
    accent: '#5a0fc8',
    span: 2,
    deepDive: {
      tagline:
        'A service worker compiled through a Route Handler, plus a hand-rolled download queue that warms routes into Cache Storage and can tell you what is already saved.',
      sections: [
        {
          heading: 'The problem: Turbopack has no plugin hook',
          body: [
            '`@serwist/next` compiles the service worker with a webpack plugin. This app builds with Turbopack, which has no equivalent hook — so the usual integration simply cannot run.',
            'The workaround is to compile the worker on request from a Route Handler instead. `@serwist/turbopack` exposes `createSerwistRoute`, which takes the worker source and returns the whole set of route exports. The worker ends up served at `/serwist/sw.js` like any other route.',
            "Two payloads get special handling. `/~offline` is the fallback page, revisioned by the Vercel commit SHA so a new deploy invalidates it. The self-hosted PDFium WASM binary is ~4.6MB — over Serwist's default file-size ceiling, where it would be silently warn-skipped by the auto-glob — so it is excluded from the glob and precached explicitly, hashed so it re-downloads only when the binary actually changes."
          ],
          code: `// src/app/serwist/[path]/route.ts
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  // esbuild-wasm rejects Windows-style paths ("cwd is not an absolute path"); native esbuild doesn't.
  useNativeEsbuild: true,
  additionalPrecacheEntries: [
    { url: '/~offline', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString() },
    { url: '/pdfium.wasm', revision: pdfiumWasmRevision() }
  ],
  globIgnores: ['**/pdfium.wasm']
});`,
          codeLang: 'typescript'
        },
        {
          heading: 'Warming a route takes two requests, not one',
          body: [
            'Downloading a section means fetching its routes so the service worker stores them. The catch is that a Next.js App Router page is two different resources: the HTML document you get on a hard load, and the RSC payload you get when a client-side `<Link>` navigates to it.',
            'Cache only the document and in-app navigation still fails offline. So each URL is warmed twice, in parallel, and either one succeeding counts as cached.',
            "The `Accept: text/html` header is load-bearing. A bare `fetch()` sends `Accept: */*`, which matches none of the service worker's page-matcher conditions — the request sails straight past the cache and nothing gets stored, with no error to tell you."
          ],
          code: `// src/hooks/useOfflineDownload.ts
async function warmUrl(url: string): Promise<boolean> {
  const rscUrl = \`\${url}\${url.includes('?') ? '&' : '?'}_rsc=offline\`;

  // Accept: text/html is required — a plain fetch() sends \`Accept: */*\`, which matches none of
  // the SW's offlinePages matcher conditions, silently skipping the cache entirely.
  const docReq = fetch(url, { cache: 'reload', credentials: 'same-origin', headers: { Accept: 'text/html' } })
    .then((res) => res.text().then(() => res.ok).catch(() => res.ok))
    .catch(() => false);

  const rscReq = fetch(rscUrl, { cache: 'reload', credentials: 'same-origin', headers: { RSC: '1' } })
    .then((res) => res.text().then(() => res.ok).catch(() => res.ok))
    .catch(() => false);

  const [docOk, rscOk] = await Promise.all([docReq, rscReq]);
  return docOk || rscOk;
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'Detecting what is already saved',
          body: [
            'The obvious way to ask "is this cached?" is `caches.match(url)`. That produced false negatives constantly: stored request keys carry RSC headers and vary data that a plain string match cannot reproduce, so entries the worker would happily serve reported as missing.',
            'The fix is to stop matching and start enumerating — walk every cache, collect every stored pathname into a `Set`, and compare by pathname. That is ground truth. The enumeration is memoised for 1.5s so a burst of probes (the panel checking all sections at once when it opens) shares one pass, with an explicit invalidator to call after a download changes the caches.'
          ],
          code: `// src/utils/offline-cache.ts
export async function getCachedPathnames(): Promise<Set<string>> {
  if (!cachedPathnamesPromise) {
    cachedPathnamesPromise = readCachedPathnames();
    cachedPathnamesPromise.finally(() => {
      setTimeout(() => {
        cachedPathnamesPromise = null;
      }, 1500);
    });
  }
  return cachedPathnamesPromise;
}

/** Force the next probe to re-enumerate (call after warming/downloading routes). */
export function refreshCachedPathnames(): void {
  cachedPathnamesPromise = null;
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'The queue, and knowing when a build goes stale',
          body: [
            'Downloads run through a FIFO queue draining one section at a time, guarded by a ref so overlapping renders cannot start two runs. The `core` section — the app shell every other route depends on — is always sorted to the front and auto-prepended if you pick any other section without it.',
            'Staleness is tracked by asking the service worker for its version over a `MessageChannel` and comparing it against a marker in `localStorage` written after each completed section. A newer worker than the marker means a fresh deploy shipped since you last downloaded, which flips every saved section to a `stale` badge and prompts a re-download.'
          ],
          code: `// src/hooks/useOfflineDownload.ts
function getServiceWorkerVersion(timeoutMs = 1500): Promise<string | null> {
  return new Promise((resolve) => {
    const sw = navigator.serviceWorker?.controller;
    if (!sw) return resolve(null);
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data?.type === 'VERSION' ? (e.data.version as string) : null);
    };
    sw.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
  });
}`,
          codeLang: 'typescript'
        }
      ],
      files: [
        'src/app/serwist/[path]/route.ts',
        'src/app/sw.ts',
        'src/hooks/useOfflineDownload.ts',
        'src/utils/offline-cache.ts',
        'src/data/offline-content.ts',
        'src/components/pwa/offline-download-panel.tsx',
        'src/app/providers.tsx',
        'next.config.ts'
      ],
      gotcha:
        'SerwistProvider is disabled in development. Its install-time route warm-up requests every route, and under Turbopack each of those triggers a fresh on-demand compile — so a single "download for offline" run in dev would rebuild the entire app, one route at a time.'
    }
  },
  {
    slug: 'design-system',
    icon: <IconPalette size={24} />,
    title: 'MongoDB Design System',
    blurb:
      'The entire UI follows MongoDB’s LeafyGreen design system — its colors, typography, and components — for a clean, consistent, accessible interface. Real LeafyGreen components are used where they fit, with shadcn/ui + Tailwind for everything else.',
    tech: '@leafygreen-ui + shadcn/ui + Tailwind',
    accent: '#00684A',
    span: 2,
    deepDive: {
      tagline: 'Two UI systems deliberately coexisting — and the Emotion SSR bridge required to stop one of them shipping unstyled HTML.',
      sections: [
        {
          heading: 'Why two systems',
          body: [
            "LeafyGreen is MongoDB's real design system, and using the genuine components for callouts, code blocks, and expandable cards is what makes the app look like MongoDB rather than an imitation of it. But LeafyGreen does not cover everything an app needs — sidebars, sheets, command palettes, toggles.",
            'So shadcn/ui on Tailwind v4 handles the general application chrome, and LeafyGreen handles the surfaces where its components genuinely fit. The rule when building a new surface is to check what the surrounding code already uses and match it, rather than introducing a third pattern.',
            'The app is dark-mode only. There is no theme toggle and no `next-themes` — a `dark` class is forced on the root `<html>` and `LeafyGreenProvider` is passed `darkMode` unconditionally, so the two systems agree on exactly one appearance instead of two.'
          ]
        },
        {
          heading: 'The Emotion SSR problem',
          body: [
            'LeafyGreen styles its components with its own bundled `@emotion/css` instance. On the server that instance fills an in-memory `cache.inserted` object — and stops there. Nothing writes those styles into the streamed HTML.',
            'The visible result is a flash of completely unstyled LeafyGreen markup: correct class names in the DOM, no CSS backing them, until hydration runs on the client and Emotion injects the styles.',
            'The fix is a registry component that hooks `useServerInsertedHTML`, drains whatever Emotion has accumulated so far, and emits it as a `<style>` tag inside the streamed response. A `Set` of already-flushed names prevents re-emitting the same rules on later flushes of the same stream.'
          ],
          code: `// src/app/emotion-registry.tsx
export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const flushed = useRef<Set<string>>(null);
  if (flushed.current === null) flushed.current = new Set();

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted).filter((n) => !flushed.current?.has(n) && typeof cache.inserted[n] === 'string');
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      flushed.current?.add(name);
      styles += cache.inserted[name];
    }
    return <style data-emotion={\`\${cache.key} \${names.join(' ')}\`} dangerouslySetInnerHTML={{ __html: styles }} />;
  });

  return children;
}`,
          codeLang: 'tsx'
        },
        {
          heading: 'Provider order matters',
          body: [
            'The registry has to wrap `LeafyGreenProvider`, not sit beside it. Providers compose outside-in as SerwistProvider → NuqsAdapter → EmotionRegistry → LeafyGreenProvider → NotificationProvider → Toaster.',
            'If the registry were nested inside the LeafyGreen provider it would mount too late to capture the styles that provider and its children insert during the same server render.'
          ],
          code: `// src/app/providers.tsx
<SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV === 'development'}>
  <NuqsAdapter>
    <EmotionRegistry>
      <LeafyGreenProvider darkMode>
        <NotificationProvider>{children}</NotificationProvider>
      </LeafyGreenProvider>
      <Toaster theme="dark" richColors position="bottom-right" />
    </EmotionRegistry>
  </NuqsAdapter>
</SerwistProvider>`,
          codeLang: 'tsx'
        }
      ],
      files: ['src/app/emotion-registry.tsx', 'src/app/providers.tsx', 'src/components/ui/', 'src/app/globals.css'],
      gotcha:
        'Emotion styles are injected with `dangerouslySetInnerHTML`. That is the standard Emotion SSR pattern and safe here specifically because the CSS comes from LeafyGreen’s own cache — never from user input.'
    }
  },
  {
    slug: 'pdf-guides',
    icon: <IconFileTypePdf size={24} />,
    title: 'Cache-Once PDF Guides',
    blurb:
      'Interview tip-sheet PDFs open in a browser-style tabbed reader right inside the app. Each one streams once from blob storage, then is served from cache forever — available offline and easy on bandwidth.',
    tech: 'EmbedPDF (PDFium/WASM) + Cache Storage API + Vercel Blob',
    accent: '#e94235',
    span: 2,
    deepDive: {
      tagline: 'A fetch-exactly-once-per-device cache in front of Vercel Blob, wrapped around a WASM PDF renderer.',
      sections: [
        {
          heading: 'Cache-first, forever, on purpose',
          body: [
            'The PDFs live in Vercel Blob storage, where every download costs egress. So the cache policy is the strictest one available: fetch a given PDF once per device, ever, then read it from a dedicated `pdf-cache` bucket in Cache Storage from then on.',
            'This is also why there is deliberately no "clear cache" button anywhere in the UI. A clear button is a button that re-triggers every download — precisely the thing the cache exists to prevent.',
            'Storage is bounded a different way: `prunePdfCache` drops entries whose URLs are no longer in the current guide list, so retired PDFs do not accumulate on the device.'
          ],
          code: `// src/utils/pdf-cache.ts
const cache = await caches.open(PDF_CACHE);
const hit = await cache.match(url);
if (hit) return hit.arrayBuffer();

const res = await fetch(url, { mode: 'cors' });
if (!res.ok) throw new Error(\`PDF fetch failed: \${res.status}\`);
// Persist a clone; a Response body can only be read once.
await cache.put(url, res.clone());
return res.arrayBuffer();`,
          codeLang: 'typescript'
        },
        {
          heading: 'Two details that bite',
          body: [
            'A `Response` body is a stream and can only be consumed once. Calling `cache.put(url, res)` and then `res.arrayBuffer()` throws — hence `res.clone()` before storing.',
            'Opening the same guide twice in quick succession (double-click, or two tabs of the reader) would fire two identical network requests before either finished. An in-flight `Map` keyed by URL de-dupes them: the second caller awaits the same promise, and the entry is removed in a `finally` so a failed fetch does not poison later retries.'
          ],
          code: `// src/utils/pdf-cache.ts
const inFlight = new Map<string, Promise<ArrayBuffer>>();

export async function ensurePdfBuffer(url: string): Promise<ArrayBuffer> {
  const pending = inFlight.get(url);
  if (pending) return pending;

  const task = (async () => { /* ...cache lookup + fetch... */ })();

  inFlight.set(url, task);
  try {
    return await task;
  } finally {
    inFlight.delete(url);
  }
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'Buffers, not URLs',
          body: [
            'The reader is EmbedPDF, which renders through a PDFium build compiled to WebAssembly. It is handed the document as in-memory bytes via `openDocumentBuffer` rather than a URL — which is exactly why the cache layer returns an `ArrayBuffer` instead of a blob URL.',
            'The PDFium WASM binary itself is self-hosted from `public/pdfium.wasm` (copied in by a prebuild step) and precached by the service worker with a content hash, so the renderer works offline too and only re-downloads when the binary actually changes.',
            '`navigator.storage.persist()` is requested best-effort so the cached PDFs are not the first thing evicted under storage pressure.'
          ]
        }
      ],
      files: ['src/utils/pdf-cache.ts', 'src/data/pdf-guides.ts', 'src/app/serwist/[path]/route.ts'],
      gotcha:
        'A cache miss that fails to fetch throws rather than returning empty — the caller is expected to catch it and offer a retry or an open-in-new-tab fallback, instead of rendering a silently blank reader.'
    }
  },
  {
    slug: 'speak-out-loud',
    icon: <IconMicrophone size={24} />,
    title: 'Speak Out Loud',
    blurb: 'Rehearse interview answers aloud and watch your words transcribe live on screen.',
    tech: 'Web Speech API',
    accent: '#f0db4f',
    span: 1,
    deepDive: {
      tagline: 'Live speech-to-text for rehearsing answers, built on a browser API that TypeScript does not ship types for.',
      sections: [
        {
          heading: 'Typing an API the DOM lib forgot',
          body: [
            "`SpeechRecognition` is not in TypeScript's DOM library — it is still prefixed in most shipping browsers and never stabilised into the standard typings. Using it means either casting to `any` everywhere or writing the types once.",
            'This app writes them once, in a shared module, covering only the surface actually used: the constructor, the three config flags, start/stop, and the three event handlers. Everything is named `*Like` as a reminder that these are hand-written approximations of a moving spec, not official types.'
          ],
          code: `// src/lib/speech-recognition.ts
export interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
}

export function getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'Interim vs final results',
          body: [
            'With `interimResults` on, the API emits a running best guess that keeps getting revised, then marks a result `isFinal` once it settles. Rendering every event naively makes text flicker and duplicate.',
            'The handler therefore reads from `event.resultIndex` forward and keeps final and interim text separate — finalised text is appended to the committed transcript, while the interim tail is rendered as provisional and replaced on the next event.',
            "The same typed helper backs two features: Speak Up's rehearsal view and Mock Interview's live answer capture."
          ]
        }
      ],
      files: [
        'src/lib/speech-recognition.ts',
        'src/components/speak-up/speech-practice.tsx',
        'src/components/mock-interview/chat/use-speech-input.ts'
      ],
      gotcha:
        'The API needs a real microphone permission prompt and a genuine network path. Testing inside an embedded webview — VS Code’s Simple Browser, for instance — silently fails in ways that look exactly like a bug in the code.'
    }
  },
  {
    slug: 'notifications',
    icon: <IconBell size={24} />,
    title: 'Layered Notification System',
    blurb:
      'Timer and study alerts route through one policy-gated manager — native desktop notifications when granted, toast fallback when not.',
    tech: 'Web Notifications + Web Audio + sonner',
    accent: '#f44336',
    span: 1,
    deepDive: {
      tagline:
        'One framework-agnostic manager decides whether a notification fires at all, and whether it arrives as a desktop notification or an in-app toast.',
      sections: [
        {
          heading: 'A four-part split',
          body: [
            "The system is deliberately broken into four small modules. `registry.ts` holds per-category config. `prefs.ts` holds the user's mute settings. `policy.ts` decides whether a given notification is allowed to fire. `manager.ts` is the only module that touches the Web Notification API.",
            'The point of the split is that new rules stay additive. Quiet hours, rate limits, or a focus-block mute all belong in `policy.ts` as one more condition — instead of an `if` statement scattered into whichever feature happens to fire a notification.',
            'Categories carry an OS-level `tag`, which is the dedupe key the operating system uses. Distinct tags per category stop a timer alert from silently replacing a review reminder in the notification tray.'
          ],
          code: `// src/notifications/policy.ts
export function isSuppressed(category: NotificationCategory, ctx: NotificationPolicyContext): boolean {
  // While a universal timer is active, don't nag about distraction.
  if (category === 'distraction' && ctx.timerActive) return true;
  return false;
}

export function isBlocked(category: NotificationCategory, ctx: NotificationPolicyContext): boolean {
  return isCategoryMuted(category) || isSuppressed(category, ctx);
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'Native or toast, resolved per category',
          body: [
            'Each category declares a default channel. `auto` means "use a real desktop notification if permission was granted, otherwise fall back to a sonner toast" — so the user still sees something even if they declined the permission prompt.',
            'An explicit `native` request behaves differently on purpose: without permission it stays silent rather than degrading to a toast. That preserves the intent of alerts that are only meaningful when you are looking at another window.'
          ],
          code: `// src/notifications/manager.ts
const channel = req.channel ?? cfg.defaultChannel;
const resolved = channel === 'auto' ? (canUseNative() && Notification.permission === 'granted' ? 'native' : 'snackbar') : channel;

let handle: NotificationHandle = NOOP_HANDLE;
if (resolved === 'native') {
  // Explicit 'native' request without permission stays silent rather than falling back.
  if (canUseNative() && Notification.permission === 'granted') handle = fireNative(req);
} else {
  fireSnackbar(req);
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'The chime ships no audio file',
          body: [
            'Alert sounds are synthesised at call time with the Web Audio API — a sine oscillator dropping from 880Hz to 660Hz with a short exponential envelope. No MP3 to download, cache, or version.',
            'The whole thing is wrapped in a try/catch because browsers block audio construction until a user gesture has occurred; a blocked chime degrades to silence rather than an unhandled error.'
          ],
          code: `// src/notifications/manager.ts
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(880, ctx.currentTime);
osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
gain.gain.setValueAtTime(0.0001, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
osc.connect(gain).connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.42);
osc.onended = () => ctx.close();`,
          codeLang: 'typescript'
        },
        {
          heading: 'What currently fires it',
          body: [
            'Today the only caller is the study timer, which fires on pomodoro phase changes and countdown completion.',
            'The `distraction` category — tab away and get nudged back — is still registered and still has its suppression rule, but nothing triggers it: that listener did not survive the rewrite. Wiring it back means a `visibilitychange` listener calling `notify({ category: "distraction", ... })`; the policy, prefs, and dedupe plumbing it needs are already in place.'
          ]
        }
      ],
      files: [
        'src/notifications/manager.ts',
        'src/notifications/policy.ts',
        'src/notifications/registry.ts',
        'src/notifications/prefs.ts',
        'src/notifications/notification-provider.tsx',
        'src/components/timer/use-timer-tick.ts'
      ],
      gotcha:
        'The manager never imports React. The provider injects a getter for the live policy context instead, which keeps the notification logic testable and callable from anywhere — including non-component code like the timer tick.'
    }
  },
  {
    slug: 'job-tracker',
    icon: <IconDatabase size={24} />,
    title: 'Offline-First Job Tracker',
    blurb: 'Job applications live in an in-browser database that persists across reloads and syncs live across open tabs.',
    tech: 'Dexie + IndexedDB',
    accent: '#e6529b',
    span: 1,
    deepDive: {
      tagline: 'IndexedDB via Dexie, behind a repository layer, with live queries that make cross-tab sync fall out for free.',
      sections: [
        {
          heading: 'Why IndexedDB and not localStorage',
          body: [
            'localStorage is synchronous, string-only, and capped at a few megabytes. A job tracker holds structured records with nested arrays of rounds, contacts, documents, and notes — serialising all of that to JSON on every keystroke blocks the main thread.',
            "IndexedDB is asynchronous, stores structured objects directly, and supports indexes. Dexie makes it usable without the raw API's callback ceremony.",
            'One database serves the whole app, with one table per feature and a single version declaring them all. Adding a feature means adding a table to that same `stores({...})` call and bumping the version — not spinning up a second Dexie instance.'
          ],
          code: `// src/db/index.ts
class QuickRecallDB extends Dexie {
  jobs!: Table<JobApplication, string>;
  speakUpQAs!: Table<SpeakUpQA, string>;
  bookmarks!: Table<Bookmark, string>;
  reviews!: Table<ReviewState, string>;
  attempts!: Table<PracticeAttempt, string>;
  practiceSessions!: Table<PracticeSessionState, string>;
  mockInterviews!: Table<MockInterview, string>;

  constructor() {
    super('quickrecall');
    this.version(1).stores({
      jobs: 'id, status, favorite, createdAt',
      speakUpQAs: 'id, sourceId, jobId, createdAt',
      bookmarks: 'id, kind, createdAt',
      reviews: 'id, dueAt',
      attempts: 'id, refId, startedAt',
      practiceSessions: 'refId',
      mockInterviews: 'id, status, startedAt'
    });
  }
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'The schema string is indexes, not columns',
          body: [
            'A common misreading of `jobs: "id, status, favorite, createdAt"` is that those are the fields being stored. They are not — Dexie stores the entire object regardless. That string declares the primary key and which fields get indexes for querying and sorting.',
            'So `orderBy("createdAt")` is fast because `createdAt` is indexed, while a field like `company` is still persisted and readable, just not indexable without a schema bump.'
          ]
        },
        {
          heading: 'Repository layer, and why it is async',
          body: [
            'Components never touch the `db` object. Each feature owns a repository module that is the only code allowed to persist for that table, exposing plain `getAll` / `create` / `update` / `remove` functions.',
            'Those functions are async-shaped even where Dexie could resolve faster, so swapping IndexedDB for an HTTP backend later means rewriting the bodies of four functions and nothing else.',
            'Reads are normalised on the way out. A record written by an older build might be missing an array field, and a single `undefined.map()` would take down the board — so `normalizeJob` coerces the nested arrays defensively.'
          ],
          code: `// src/db/jobs.ts
function normalizeJob(raw: JobApplication): JobApplication {
  return {
    ...raw,
    rounds: Array.isArray(raw.rounds) ? raw.rounds : [],
    contacts: Array.isArray(raw.contacts) ? raw.contacts : [],
    documents: Array.isArray(raw.documents) ? raw.documents : [],
    notes: Array.isArray(raw.notes) ? raw.notes : []
  };
}

export async function getAll(): Promise<JobApplication[]> {
  const rows = await db.jobs.orderBy('createdAt').reverse().toArray();
  return rows.map(normalizeJob);
}`,
          codeLang: 'typescript'
        },
        {
          heading: 'Cross-tab sync for free',
          body: [
            'The UI reads through `useLiveQuery` from `dexie-react-hooks`. Dexie observes the tables a query touched and re-runs it whenever any of them change — including changes made in another browser tab.',
            'That removes an entire category of code. There is no optimistic patching, no cache invalidation, no manual state sync, no refetch-after-mutate. A mutation just writes, and every subscribed view in every open tab updates itself.'
          ]
        }
      ],
      files: ['src/db/index.ts', 'src/db/jobs.ts', 'src/components/job-tracker/use-jobs.ts', 'src/types/job-tracker.ts'],
      gotcha:
        'The schema is intentionally a single v1 with no migration chain, because this database was created on a fresh origin. If it ever reuses an origin that already shipped a higher IndexedDB version, the version chain has to be restored or Dexie will refuse to open.'
    }
  },
  {
    slug: 'code-display',
    icon: <IconCode size={24} />,
    title: 'Smart Code Display',
    blurb: 'Lightweight, lazy-loaded syntax highlighting for inline snippets — kept out of the first-load bundle.',
    tech: '@leafygreen-ui/code',
    accent: '#9c27b0',
    span: 1,
    deepDive: {
      tagline: 'A two-file split that keeps a few hundred KB of highlighter out of First-Load JS without giving up server-rendered code.',
      sections: [
        {
          heading: 'The cost being avoided',
          body: [
            "LeafyGreen's `Code` component pulls in highlight.js and its grammars — hundreds of kilobytes. On a notes-heavy app where nearly every page renders at least one snippet, importing it directly would put that weight in the first-load bundle of essentially the whole site.",
            'But deferring it naively means code blocks render as nothing until JavaScript arrives, which is bad for both perceived speed and readability without JS.'
          ]
        },
        {
          heading: 'Render plain, then upgrade',
          body: [
            'The solution is two files. `code-block.tsx` immediately renders the raw code in a styled `<pre>` — real server-rendered HTML, readable with no JavaScript at all, and already using the correct monospace font and box styling so the layout does not jump.',
            'On mount it dynamically imports `code-highlighted.tsx` and swaps it in. Because that import is the only reference to the highlighter, the bundler isolates highlight.js into a separate chunk that is fetched after paint — and never on the server.',
            'The upgrade is visually a colour change on text that was already in the right place, so there is no layout shift.'
          ],
          code: `// src/components/content/code-block.tsx
export default function CodeBlock({ code, language = 'tsx' }: Props) {
  const [Highlighted, setHighlighted] = useState<ComponentType<Props> | null>(null);

  useEffect(() => {
    import('./code-highlighted').then((m) => setHighlighted(() => m.default));
  }, []);

  if (Highlighted) return <Highlighted code={code} language={language} />;

  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-[13px] leading-relaxed whitespace-pre">
      {code}
    </pre>
  );
}`,
          codeLang: 'tsx'
        },
        {
          heading: 'Four languages, two grammars',
          body: [
            'The public API accepts `jsx`, `tsx`, `javascript`, and `typescript`, but LeafyGreen only knows the latter two. JSX and TSX highlight correctly under the JavaScript and TypeScript grammars respectively, so a small map translates them rather than loading extra grammars.'
          ],
          code: `// src/components/content/code-highlighted.tsx
const LANGUAGE_MAP: Record<CodeLang, Language> = {
  jsx: Language.JavaScript,
  tsx: Language.TypeScript,
  javascript: Language.JavaScript,
  typescript: Language.TypeScript
};`,
          codeLang: 'typescript'
        }
      ],
      files: ['src/components/content/code-block.tsx', 'src/components/content/code-highlighted.tsx'],
      gotcha:
        '`setHighlighted(() => m.default)` needs the arrow wrapper. React treats a function passed to a state setter as a lazy initialiser and would call the component instead of storing it.'
    }
  },
  {
    slug: 'fuzzy-search',
    icon: <IconSearch size={24} />,
    title: 'Fuzzy Search',
    blurb: 'Type into the header search to jump to any problem, custom hook, or page — typo-tolerant, ranked, and keyboard-navigable.',
    tech: 'fuse.js',
    accent: '#10b981',
    span: 1,
    deepDive: {
      tagline: 'A cmdk command palette driven by Fuse.js rankings, over an index aggregated from every content folder.',
      sections: [
        {
          heading: 'Turning off the filter you are given',
          body: [
            'cmdk ships its own matching and filtering. Fuse.js also ranks results. Letting both run means cmdk re-filters and re-orders a list Fuse already scored, discarding the fuzzy ranking that was the whole reason for adding Fuse.',
            'So the palette sets `shouldFilter={false}` and takes full ownership of the result list. cmdk is used purely for what it is genuinely good at — the dialog, keyboard navigation, roving focus, and accessibility semantics — while relevance is decided entirely by Fuse.'
          ],
          code: `// src/components/search/header-search.tsx
const fuse = useMemo(() => createSearchFuse(), []);

const results = useMemo(() => {
  if (!value.trim()) return [];
  return fuse
    .search(value)
    .slice(0, MAX_RESULTS)
    .map((r) => r.item);
}, [fuse, value]);`,
          codeLang: 'tsx'
        },
        {
          heading: 'Building the index once',
          body: [
            '`src/data/search-index.ts` flattens notes, flashcards, machine-coding problems, custom hooks, and routes from every topic folder into one array of `SearchItem`s, each carrying a section label and a destination URL.',
            'The Fuse instance is built inside `useMemo` with an empty dependency list, so the index is constructed once per mount rather than on every keystroke. Results are grouped back into their sections for display and capped at eight — a palette that fills the screen is harder to scan than one that does not.'
          ]
        },
        {
          heading: 'Keyboard first',
          body: [
            "A document-level `keydown` listener binds Ctrl/Cmd-K to toggle the palette, calling `preventDefault` so the browser's own shortcut does not also fire. The listener is registered in an effect with a matching cleanup, so it is removed when the header unmounts.",
            'Selecting a result routes with `router.push` and then clears both the open state and the query, so reopening the palette always starts from a blank slate rather than the previous search.'
          ]
        }
      ],
      files: ['src/components/search/header-search.tsx', 'src/data/search-index.ts', 'src/components/ui/command.tsx'],
      gotcha:
        'Any new bookmarkable or searchable content type has to be added to the aggregator in `search-index.ts` — otherwise it exists in the app but is invisible to search.'
    }
  },
  {
    slug: 'shareable-filters',
    icon: <IconLink size={24} />,
    title: 'Shareable Filters',
    blurb: 'Difficulty, category, and search live in the URL — every filtered view is bookmarkable.',
    tech: 'nuqs',
    accent: '#016bf8',
    span: 1,
    deepDive: {
      tagline:
        'Filter state stored in the query string instead of React state, so the back button and a copied link both do the obvious thing.',
      sections: [
        {
          heading: 'The URL is the state',
          body: [
            'Held in `useState`, a filter selection is invisible to the rest of the world: refreshing loses it, the back button skips past it, and sending someone "the advanced async notes" means sending instructions instead of a link.',
            'nuqs stores that state in the query string while giving it a `useState`-shaped API. `useQueryState("cat", { defaultValue: "all" })` reads and writes `?cat=`, with the default kept out of the URL so an unfiltered page stays clean.',
            'Because it is genuinely the URL, browser history, refresh, deep links, and bookmarks all work without any extra code.'
          ],
          code: `// src/components/content/filter-panel.tsx
const [q] = useQueryState('q', { defaultValue: '' });
const [cat] = useQueryState('cat', { defaultValue: 'all' });
const [diff] = useQueryState('diff', { defaultValue: 'all' });
const activeCount = (q ? 1 : 0) + (cat !== 'all' ? 1 : 0) + (diff !== 'all' ? 1 : 0);`,
          codeLang: 'tsx'
        },
        {
          heading: 'One source of truth, two layouts',
          body: [
            'The filter panel renders a sticky sidebar rail on desktop and the exact same controls inside a slide-over sheet on mobile. Both render the same `NoteFilters` component.',
            'Sharing state between two separately-mounted copies of a control would normally require lifting it into a common parent or a store. Here it needs neither — both read from the URL, so they cannot disagree. The active-filter count on the mobile trigger button is derived the same way.'
          ]
        },
        {
          heading: 'Deep-linking into content',
          body: [
            'The same mechanism drives `?open=` on the notes and custom-hooks pages, which expands a specific item on load. Those pages read the parameter server-side from `searchParams`, which is what makes the deep link work on a cold load rather than only after hydration.',
            'nuqs requires its adapter to be mounted; `NuqsAdapter` sits near the top of the provider tree in `providers.tsx`.'
          ]
        }
      ],
      files: [
        'src/components/content/filter-panel.tsx',
        'src/components/content/note-filters.tsx',
        'src/components/content/notes-view.tsx',
        'src/app/providers.tsx'
      ],
      gotcha:
        'Reading a query param server-side from `searchParams` opts the route into dynamic rendering. That is the deliberate trade here — deep links that work on first paint, in exchange for not statically pre-rendering those pages.'
    }
  },
  {
    slug: 'fullscreen',
    icon: <IconArrowsMaximize size={24} />,
    title: 'Distraction-Free Fullscreen',
    blurb: 'One click expands the whole app to full screen for heads-down study sessions.',
    tech: 'Fullscreen API',
    accent: '#ff9800',
    span: 1,
    deepDive: {
      tagline: 'Small on purpose — but it still has the one bug nearly every fullscreen toggle ships with.',
      sections: [
        {
          heading: 'The desync everyone hits',
          body: [
            'The tempting implementation is a boolean flipped on click. It works until the user presses Escape — the browser exits fullscreen without telling your component, and now the button shows "exit fullscreen" while the app is windowed. The next click then tries to exit something already exited.',
            'The fix is to never treat local state as the source of truth. `document.fullscreenElement` is the truth, and a `fullscreenchange` listener syncs to it. Escape, F11, and the button all funnel through the same event, so the icon and label cannot drift.'
          ],
          code: `// src/components/layout/fullscreen-button.tsx
const handleToggle = useCallback(() => {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    void document.exitFullscreen();
  }
}, []);

useEffect(() => {
  const onFullscreenChange = () => setOpen(!!document.fullscreenElement);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
}, []);`,
          codeLang: 'tsx'
        },
        {
          heading: 'Details worth the extra lines',
          body: [
            '`requestFullscreen` is called on `document.documentElement` rather than a wrapper div, so the entire app goes fullscreen instead of one subtree — which avoids fixed-position chrome being clipped out of the fullscreen element.',
            'It returns a promise that rejects when the browser denies the request (no user gesture, or an iframe without the right permissions). `void` marks the rejection as deliberately unhandled: there is nothing useful to tell the user, and the state stays correct because the listener never fires.',
            'Both `aria-label` and `title` flip with the state, so screen-reader users and hover-tooltip users get the same information.'
          ]
        }
      ],
      files: ['src/components/layout/fullscreen-button.tsx', 'src/components/layout/app-header.tsx'],
      gotcha:
        'Fullscreen can only be entered from a genuine user gesture. Calling `requestFullscreen` from a timeout or an effect is rejected by every browser.'
    }
  }
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}
