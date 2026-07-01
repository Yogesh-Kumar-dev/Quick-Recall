'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useClickOutside from '@/hooks/useClickOutside';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import useLocalStorage from '@/hooks/useLocalStorage';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import usePrevious from '@/hooks/usePrevious';
import useThrottle from '@/hooks/useThrottle';
import useToggle from '@/hooks/useToggle';
import useWindowSize from '@/hooks/useWindowSize';

// Small live, interactive demos for each custom hook. Each imports the real hook from src/hooks/ so
// the showcase exercises the actual code. Ported from legacy MUI to shadcn + Tailwind.

export function ToggleDemo() {
  const { value, toggle } = useToggle();
  return (
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={toggle}>
        Toggle
      </Button>
      <Badge variant={value ? 'default' : 'secondary'}>{value ? 'ON' : 'OFF'}</Badge>
    </div>
  );
}

export function ClipboardDemo() {
  const { copied, copy } = useCopyToClipboard();
  const text = 'npm install react-virtuoso';
  return (
    <div className="flex items-center gap-3">
      <code className="rounded bg-muted px-2 py-1 font-mono text-[13px]">{text}</code>
      <Button variant="outline" size="sm" onClick={() => copy(text)}>
        {copied ? '✓ Copied' : 'Copy'}
      </Button>
    </div>
  );
}

export function LocalStorageDemo() {
  const [name, setName] = useLocalStorage<string>('custom-hooks-demo-name', '');
  return (
    <div className="space-y-1">
      <Input placeholder="Your name (persisted)" value={name} onChange={(e) => setName(e.target.value)} className="max-w-[280px]" />
      <p className="text-xs text-muted-foreground">
        Reload the page or open another tab — the value sticks. Stored under <code className="font-mono">custom-hooks-demo-name</code>.
      </p>
    </div>
  );
}

export function DebounceDemo() {
  const [text, setText] = useState('');
  const debounced = useDebounce(text, 500);
  return (
    <div className="space-y-1">
      <Input placeholder="Type fast…" value={text} onChange={(e) => setText(e.target.value)} className="max-w-[280px]" />
      <p className="text-sm">
        Live: <strong className="font-mono">{text || '—'}</strong>
      </p>
      <p className="text-sm text-primary">
        Debounced (500ms): <strong className="font-mono">{debounced || '—'}</strong>
      </p>
    </div>
  );
}

export function ThrottleDemo() {
  const [count, setCount] = useState(0);
  const throttled = useThrottle(count, 1000);
  return (
    <div className="space-y-1">
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        Click rapidly (+1)
      </Button>
      <p className="text-sm">
        Live clicks: <strong className="font-mono">{count}</strong>
      </p>
      <p className="text-sm text-primary">
        Throttled (≤1/sec): <strong className="font-mono">{throttled}</strong>
      </p>
    </div>
  );
}

export function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
        Increment
      </Button>
      <span className="font-mono text-sm">
        now: {count} · prev: {prev ?? '—'}
      </span>
    </div>
  );
}

export function WindowSizeDemo() {
  const { width, height } = useWindowSize();
  const isMobile = width > 0 && width < 768;
  return (
    <div className="space-y-1">
      <p className="font-mono text-sm">
        {width} × {height}px
      </p>
      <Badge variant={isMobile ? 'secondary' : 'default'}>{isMobile ? '📱 mobile (<768)' : '🖥️ desktop (≥768)'}</Badge>
      <p className="text-xs text-muted-foreground">Resize the browser window to watch it update.</p>
    </div>
  );
}

export function ClickOutsideDemo() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  return (
    <div className="relative inline-block">
      <Button size="sm" onClick={() => setOpen((o) => !o)}>
        {open ? 'Menu open' : 'Open menu'}
      </Button>
      {open && (
        <div ref={ref} className="absolute z-10 mt-1 w-[200px] rounded-md border border-border bg-card p-3 shadow-lg">
          <p className="text-sm">Click anywhere outside this box to close it.</p>
        </div>
      )}
    </div>
  );
}

export function OnlineStatusDemo() {
  const isOnline = useOnlineStatus();
  return (
    <div className="space-y-1">
      <Badge variant={isOnline ? 'default' : 'destructive'}>{isOnline ? '🟢 Online' : '🔴 Offline'}</Badge>
      <p className="text-xs text-muted-foreground">Toggle “Offline” in DevTools → Network (or turn off Wi-Fi) to see it flip.</p>
    </div>
  );
}

export function IntersectionDemo() {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.5 });
  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-sm">
        Status: <Badge variant={isIntersecting ? 'default' : 'secondary'}>{isIntersecting ? '👁️ visible' : 'scrolled away'}</Badge>
      </p>
      <div className="h-[120px] overflow-y-auto rounded-md border border-border p-1">
        <div className="h-[160px]" />
        <div ref={ref} className={`rounded-md p-4 text-center transition-colors ${isIntersecting ? 'bg-primary/20' : 'bg-muted'}`}>
          <p className="text-sm">🎯 Scroll me into / out of view</p>
        </div>
        <div className="h-[160px]" />
      </div>
    </div>
  );
}

export function FetchDemo() {
  const [id, setId] = useState(1);
  const { data, loading, error } = useFetch<{ id: number; title: string }>(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setId((n) => (n % 5) + 1)}>
          Fetch next todo
        </Button>
        <span className="font-mono text-xs text-muted-foreground">/todos/{id}</span>
      </div>
      {loading && <p className="text-sm">Loading…</p>}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {data && (
        <p className="font-mono text-sm">
          #{data.id}: {data.title}
        </p>
      )}
    </div>
  );
}
