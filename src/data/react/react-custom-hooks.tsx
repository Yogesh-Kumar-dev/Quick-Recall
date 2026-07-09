import type { HookDoc } from '@/types/content';
import {
  ClickOutsideDemo,
  ClipboardDemo,
  DebounceDemo,
  FetchDemo,
  IntersectionDemo,
  LocalStorageDemo,
  OnlineStatusDemo,
  PreviousDemo,
  ThrottleDemo,
  ToggleDemo,
  WindowSizeDemo
} from './react-custom-hooks-demos';

// ─────────────────────────────────────────────────────────────────────────────
// Custom hooks showcase data.
//
// `source` strings mirror the real, importable implementations under
// `src/hooks/`. Keep them in sync when a hook changes.
// ─────────────────────────────────────────────────────────────────────────────

export const reactCustomHooks: HookDoc[] = [
  {
    id: 'use-toggle',
    name: 'useToggle',
    tagline: 'Boolean state with a stable toggle + explicit on/off setters',
    difficulty: 'easy',
    category: 'state',
    description:
      'Wraps a boolean useState and returns toggle / setOn / setOff callbacks that keep the same identity across renders (memoised with useCallback). Because the references never change, you can pass them to React.memo children without triggering pointless re-renders.',
    signature: 'const { value, toggle, setOn, setOff } = useToggle(initial)',
    source: `import { useCallback, useState } from 'react';

export default function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setOn = useCallback(() => setValue(true), []);
  const setOff = useCallback(() => setValue(false), []);

  return { value, toggle, setOn, setOff, setValue } as const;
}`,
    usage: `const { value: isOpen, toggle, setOff } = useToggle();

<button onClick={toggle}>Toggle</button>
{isOpen && <Modal onClose={setOff} />}`,
    useCases: ['Modal / drawer / accordion open state', 'Show-more / show-less sections', 'Boolean feature flags in local UI state'],
    gotcha:
      'Returning a bare setter pair without useCallback recreates the functions every render , fine for plain DOM, but it defeats React.memo on children.',
    demo: <ToggleDemo />
  },
  {
    id: 'use-copy-to-clipboard',
    name: 'useCopyToClipboard',
    tagline: 'Copy text and get a transient "copied" flag',
    difficulty: 'easy',
    category: 'browser',
    description:
      'Writes text via the async Clipboard API and flips a `copied` flag that auto-resets after a delay. Returns false when the API is unavailable or the write is rejected (e.g. insecure context).',
    signature: 'const { copied, copy } = useCopyToClipboard(resetDelay?)',
    source: `import { useCallback, useState } from 'react';

export default function useCopyToClipboard(resetDelay = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copy } as const;
}`,
    usage: `const { copied, copy } = useCopyToClipboard();

<button onClick={() => copy('npm i')}>
  {copied ? 'Copied!' : 'Copy'}
</button>`,
    useCases: ['Copy code snippets / install commands', '"Copy link" share buttons', 'Copy API keys or generated tokens'],
    gotcha:
      'navigator.clipboard is undefined on http (non-secure) origins and some in-app webviews , always handle the false return rather than assuming success.',
    demo: <ClipboardDemo />
  },
  {
    id: 'use-local-storage',
    name: 'useLocalStorage',
    tagline: 'useState that persists to localStorage and syncs across tabs',
    difficulty: 'easy',
    category: 'state',
    description:
      'Behaves like useState but reads its initial value from localStorage and writes every update back. A storage event listener keeps the value in sync when the same key changes in another tab.',
    signature: 'const [value, setValue] = useLocalStorage(key, defaultValue)',
    source: `import { useState, useEffect } from 'react';

export default function useLocalStorage<ValueType>(key: string, defaultValue: ValueType) {
  const [value, setValue] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return stored === null ? defaultValue : JSON.parse(stored);
  });

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
      }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [key, defaultValue]);

  const setValueInLocalStorage = (newValue: ValueType) => {
    setValue((current: any) => {
      const result = typeof newValue === 'function' ? newValue(current) : newValue;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setValueInLocalStorage];
}`,
    usage: `const [theme, setTheme] = useLocalStorage('theme', 'light');

<button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
  {theme}
</button>`,
    useCases: ['Theme / language preferences', 'Persisting form drafts', 'Remembering dismissed banners or onboarding state'],
    gotcha:
      'The initial value is read from localStorage during the first render (the useState lazy initialiser) , that only survives server-side rendering because of the `typeof window` guard. Remove the guard and Next.js throws "localStorage is not defined" on the server.',
    demo: <LocalStorageDemo />
  },
  {
    id: 'use-debounce',
    name: 'useDebounce',
    tagline: 'Trailing-debounced copy of a value',
    difficulty: 'medium',
    category: 'effect',
    description:
      'Returns a value that only updates after `delay`ms of silence. Each change restarts the timer, so a burst of updates (fast typing) collapses into one final update after the user pauses , the canonical "search as you type" optimisation.',
    signature: 'const debounced = useDebounce(value, delay?)',
    source: `import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
    usage: `const [query, setQuery] = useState('');
const debounced = useDebounce(query, 400);

useEffect(() => { if (debounced) search(debounced); }, [debounced]);`,
    useCases: ['Search-as-you-type API calls', 'Validating an input only after the user pauses', 'Autosaving a draft after editing stops'],
    gotcha:
      'Debounce waits for quiet , if the value never stops changing, it never fires. For a guaranteed cadence under continuous change, use throttle instead.',
    demo: <DebounceDemo />
  },
  {
    id: 'use-throttle',
    name: 'useThrottle',
    tagline: 'Value that updates at most once per interval',
    difficulty: 'medium',
    category: 'effect',
    description:
      'Returns a copy of the value that changes at most once every `interval`ms. Unlike debounce (which waits for a pause), throttle emits on a fixed cadence even while the source keeps changing , ideal for scroll, mousemove, and resize.',
    signature: 'const throttled = useThrottle(value, interval?)',
    source: `import { useEffect, useRef, useState } from 'react';

export default function useThrottle<T>(value: T, interval = 500): T {
  const [throttled, setThrottled] = useState(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const elapsed = Date.now() - lastRun.current;
    if (elapsed >= interval) {
      lastRun.current = Date.now();
      setThrottled(value);
    } else {
      const id = setTimeout(() => {
        lastRun.current = Date.now();
        setThrottled(value);
      }, interval - elapsed);
      return () => clearTimeout(id);
    }
  }, [value, interval]);

  return throttled;
}`,
    usage: `const [scrollY, setScrollY] = useState(0);
const throttledY = useThrottle(scrollY, 200);
// throttledY updates ~5x/sec no matter how fast you scroll`,
    useCases: [
      'Scroll-position-driven UI (progress bars, sticky headers)',
      'Mousemove / drag tracking',
      'Rate-limiting high-frequency analytics events'
    ],
    gotcha:
      'Debounce vs throttle is a classic interview trap: debounce = "wait until it stops", throttle = "at most N per second". Reaching for the wrong one makes continuous events feel laggy or spammy.',
    demo: <ThrottleDemo />
  },
  {
    id: 'use-previous',
    name: 'usePrevious',
    tagline: 'The value from the previous render',
    difficulty: 'medium',
    category: 'ref',
    description:
      'Answers "what was this value last render?" using a ref written inside an effect. The trick: effects run AFTER render, so while rendering, the ref still holds the previous value , no extra state, no extra re-renders.',
    signature: 'const prev = usePrevious(value)',
    source: `import { useEffect, useRef } from 'react';

export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}`,
    usage: `const prevCount = usePrevious(count);

<p>Now: {count} · was: {prevCount ?? '—'}</p>`,
    useCases: [
      'Detecting which prop changed in an effect',
      'Animating based on the delta between renders',
      'Comparing old vs new value before running side effects'
    ],
    gotcha: 'It returns undefined on the first render (there is no previous value yet) , always guard with a fallback.',
    demo: <PreviousDemo />
  },
  {
    id: 'use-window-size',
    name: 'useWindowSize',
    tagline: 'Reactive viewport width & height',
    difficulty: 'medium',
    category: 'browser',
    description:
      'Tracks window.innerWidth / innerHeight and updates on resize. Seeds to 0×0 on the server and syncs once on mount, so the first client render matches the server output and avoids a hydration mismatch.',
    signature: 'const { width, height } = useWindowSize()',
    source: `import { useEffect, useState } from 'react';

interface WindowSize { width: number; height: number; }

export default function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    onResize(); // sync once on mount
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}`,
    usage: `const { width } = useWindowSize();
const isMobile = width > 0 && width < 768;`,
    useCases: [
      'JS-driven responsive logic beyond CSS media queries',
      'Conditionally rendering desktop vs mobile components',
      'Sizing canvases / charts to the viewport'
    ],
    gotcha:
      'For real apps, prefer MUI useMediaQuery or CSS for layout. A raw resize listener fires very frequently , throttle it if the handler does anything expensive.',
    demo: <WindowSizeDemo />
  },
  {
    id: 'use-click-outside',
    name: 'useClickOutside',
    tagline: 'Run a handler when the user clicks outside an element',
    difficulty: 'medium',
    category: 'browser',
    description:
      'Returns a ref to attach to an element; the handler fires whenever a mousedown / touchstart lands outside it. The latest handler is stored in a ref so the document listener is attached only once.',
    signature: 'const ref = useClickOutside(handler)',
    source: `import { useEffect, useRef } from 'react';

export default function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handlerRef.current(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []);

  return ref;
}`,
    usage: `const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

{open && <div ref={ref}>Dropdown…</div>}`,
    useCases: ['Closing dropdowns / popovers / menus', 'Dismissing modals on backdrop click', 'Exiting an inline edit field'],
    gotcha:
      'Use mousedown, not click , by the time a click fires, focus may already have moved and the menu may have re-rendered, causing the toggle button to immediately reopen what you just closed.',
    demo: <ClickOutsideDemo />
  },
  {
    id: 'use-online-status',
    name: 'useOnlineStatus',
    tagline: 'Track network connectivity (offline detection)',
    difficulty: 'medium',
    category: 'browser',
    description:
      'Reports whether the browser is online. Seeds from navigator.onLine (guarded for SSR) and stays in sync via the window online / offline events. Drive offline banners or pause network work with it.',
    signature: 'const isOnline = useOnlineStatus()',
    source: `import { useEffect, useState } from 'react';

export default function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}`,
    usage: `const isOnline = useOnlineStatus();

{!isOnline && <Banner>You are offline, changes will sync later.</Banner>}`,
    useCases: [
      'Offline banners / toasts',
      'Pausing polling or queuing mutations while offline',
      'Disabling submit buttons that need the network'
    ],
    gotcha:
      'navigator.onLine only means "connected to a network", not "the internet works". A captive-portal or dead Wi-Fi still reports online , for true reachability you must ping a real endpoint.',
    demo: <OnlineStatusDemo />
  },
  {
    id: 'use-intersection-observer',
    name: 'useIntersectionObserver',
    tagline: 'Know when an element enters the viewport',
    difficulty: 'advanced',
    category: 'browser',
    description:
      'Attaches an IntersectionObserver to the returned ref and reports whether the element is intersecting. With freezeOnceVisible it disconnects after the first reveal , perfect for lazy-loading and one-shot animations.',
    signature: 'const { ref, isIntersecting } = useIntersectionObserver(options?)',
    source: `import { useEffect, useRef, useState } from 'react';

export default function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit & { freezeOnceVisible?: boolean } = {}
) {
  const { freezeOnceVisible = false, ...observerInit } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined' || frozen.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && freezeOnceVisible) {
        frozen.current = true;
        observer.disconnect();
      }
    }, observerInit);

    observer.observe(el);
    return () => observer.disconnect();
  }, [freezeOnceVisible, observerInit.root, observerInit.rootMargin, observerInit.threshold]);

  return { ref, isIntersecting } as const;
}`,
    usage: `const { ref, isIntersecting } = useIntersectionObserver({ freezeOnceVisible: true });

<img ref={ref} src={isIntersecting ? realSrc : placeholder} />`,
    useCases: [
      'Lazy-loading images / components on scroll',
      'Reveal-on-scroll animations',
      'Infinite scroll (observe a sentinel at the list end)',
      'Impression tracking for analytics'
    ],
    gotcha:
      'Passing a fresh options object every render re-creates the observer each time. Pass primitive, stable values (or memoise) , here we key the effect on the individual init fields, not the object identity.',
    demo: <IntersectionDemo />
  },
  {
    id: 'use-fetch',
    name: 'useFetch',
    tagline: 'Declarative data fetching with loading / error / abort',
    difficulty: 'advanced',
    category: 'async',
    description:
      'Fetches a URL and returns { data, loading, error }. It re-runs when the URL changes and aborts the in-flight request on cleanup, so a fast re-render or unmount can never set state from a stale response (avoiding the classic race + memory-leak warning).',
    signature: 'const { data, loading, error } = useFetch<T>(url, options?)',
    source: `import { useEffect, useState } from 'react';

interface FetchState<T> { data: T | null; loading: boolean; error: Error | null; }

export default function useFetch<T = unknown>(url: string, options?: RequestInit): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { ...options, signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}`,
    usage: `const { data, loading, error } = useFetch<User>('/api/me');

if (loading) return <Spinner />;
if (error) return <Error msg={error.message} />;
return <Profile user={data!} />;`,
    useCases: [
      'Simple GET requests tied to a component',
      'Re-fetching when an id / query param changes',
      'Learning the fetch + AbortController pattern before reaching for React Query'
    ],
    gotcha:
      'For production prefer React Query / SWR , they add caching, dedupe, retries and revalidation. The abort on cleanup is the non-negotiable part: without it, two quick URL changes can let the slower response overwrite the newer one.',
    demo: <FetchDemo />
  }
];
