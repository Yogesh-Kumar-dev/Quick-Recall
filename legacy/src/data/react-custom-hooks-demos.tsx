'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import useClickOutside from 'hooks/useClickOutside';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import useDebounce from 'hooks/useDebounce';
import useFetch from 'hooks/useFetch';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import useLocalStorage from 'hooks/useLocalStorage';
import useOnlineStatus from 'hooks/useOnlineStatus';
import usePrevious from 'hooks/usePrevious';
import useThrottle from 'hooks/useThrottle';
import useToggle from 'hooks/useToggle';
import useWindowSize from 'hooks/useWindowSize';

// ─────────────────────────────────────────────────────────────────────────────
// Small live, interactive demos for each custom hook. Each one imports the
// real hook from src/hooks/ so the showcase exercises the actual code.
// ─────────────────────────────────────────────────────────────────────────────

const mono = { fontFamily: '"Fira Code", Consolas, monospace' };

export function ToggleDemo() {
  const { value, toggle } = useToggle();
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Button variant="contained" size="small" onClick={toggle}>
        Toggle
      </Button>
      <Chip label={value ? 'ON' : 'OFF'} color={value ? 'success' : 'default'} size="small" />
    </Stack>
  );
}

export function ClipboardDemo() {
  const { copied, copy } = useCopyToClipboard();
  const text = 'npm install react-virtuoso';
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box component="code" sx={{ ...mono, px: 1, py: 0.5, bgcolor: 'action.hover', borderRadius: 1, fontSize: 13 }}>
        {text}
      </Box>
      <Button variant="outlined" size="small" color={copied ? 'success' : 'primary'} onClick={() => copy(text)}>
        {copied ? '✓ Copied' : 'Copy'}
      </Button>
    </Stack>
  );
}

export function LocalStorageDemo() {
  const [name, setName] = useLocalStorage<string>('custom-hooks-demo-name', '');
  return (
    <Stack spacing={1}>
      <TextField size="small" label="Your name (persisted)" value={name} onChange={(e) => setName(e.target.value)} sx={{ maxWidth: 280 }} />
      <Typography variant="caption" color="text.secondary">
        Reload the page or open another tab — the value sticks. Stored under <code style={mono}>custom-hooks-demo-name</code>.
      </Typography>
    </Stack>
  );
}

export function DebounceDemo() {
  const [text, setText] = useState('');
  const debounced = useDebounce(text, 500);
  return (
    <Stack spacing={1}>
      <TextField size="small" label="Type fast…" value={text} onChange={(e) => setText(e.target.value)} sx={{ maxWidth: 280 }} />
      <Typography variant="body2">
        Live: <strong style={mono}>{text || '—'}</strong>
      </Typography>
      <Typography variant="body2" color="primary">
        Debounced (500ms): <strong style={mono}>{debounced || '—'}</strong>
      </Typography>
    </Stack>
  );
}

export function ThrottleDemo() {
  const [count, setCount] = useState(0);
  const throttled = useThrottle(count, 1000);
  return (
    <Stack spacing={1}>
      <Button variant="contained" size="small" onClick={() => setCount((c) => c + 1)} sx={{ maxWidth: 200 }}>
        Click rapidly (+1)
      </Button>
      <Typography variant="body2">
        Live clicks: <strong style={mono}>{count}</strong>
      </Typography>
      <Typography variant="body2" color="primary">
        Throttled (≤1/sec): <strong style={mono}>{throttled}</strong>
      </Typography>
    </Stack>
  );
}

export function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="outlined" size="small" onClick={() => setCount((c) => c + 1)}>
        Increment
      </Button>
      <Typography variant="body2" style={mono}>
        now: {count} · prev: {prev ?? '—'}
      </Typography>
    </Stack>
  );
}

export function WindowSizeDemo() {
  const { width, height } = useWindowSize();
  const isMobile = width > 0 && width < 768;
  return (
    <Stack spacing={1}>
      <Typography variant="body2" style={mono}>
        {width} × {height}px
      </Typography>
      <Chip label={isMobile ? '📱 mobile (<768)' : '🖥️ desktop (≥768)'} size="small" color={isMobile ? 'warning' : 'info'} />
      <Typography variant="caption" color="text.secondary">
        Resize the browser window to watch it update.
      </Typography>
    </Stack>
  );
}

export function ClickOutsideDemo() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Button variant="contained" size="small" onClick={() => setOpen((o) => !o)}>
        {open ? 'Menu open' : 'Open menu'}
      </Button>
      {open && (
        <Box
          ref={ref}
          sx={{
            position: 'absolute',
            mt: 1,
            p: 1.5,
            width: 200,
            zIndex: 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 3
          }}
        >
          <Typography variant="body2">Click anywhere outside this box to close it.</Typography>
        </Box>
      )}
    </Box>
  );
}

export function OnlineStatusDemo() {
  const isOnline = useOnlineStatus();
  return (
    <Stack spacing={1}>
      <Chip label={isOnline ? '🟢 Online' : '🔴 Offline'} color={isOnline ? 'success' : 'error'} />
      <Typography variant="caption" color="text.secondary">
        Toggle “Offline” in DevTools → Network (or turn off Wi-Fi) to see it flip.
      </Typography>
    </Stack>
  );
}

export function IntersectionDemo() {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.5 });
  return (
    <Box>
      <Typography variant="body2" mb={1}>
        Status: <Chip label={isIntersecting ? '👁️ visible' : 'scrolled away'} size="small" color={isIntersecting ? 'success' : 'default'} />
      </Typography>
      <Box sx={{ height: 120, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
        <Box sx={{ height: 160 }} />
        <Box
          ref={ref}
          sx={{
            p: 2,
            textAlign: 'center',
            bgcolor: isIntersecting ? 'success.light' : 'action.hover',
            borderRadius: 1,
            transition: 'background 0.3s'
          }}
        >
          <Typography variant="body2">🎯 Scroll me into / out of view</Typography>
        </Box>
        <Box sx={{ height: 160 }} />
      </Box>
    </Box>
  );
}

export function FetchDemo() {
  const [id, setId] = useState(1);
  const { data, loading, error } = useFetch<{ id: number; title: string }>(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button variant="outlined" size="small" onClick={() => setId((n) => (n % 5) + 1)}>
          Fetch next todo
        </Button>
        <Typography variant="caption" color="text.secondary" style={mono}>
          /todos/{id}
        </Typography>
      </Stack>
      {loading && <Typography variant="body2">Loading…</Typography>}
      {error && (
        <Typography variant="body2" color="error">
          {error.message}
        </Typography>
      )}
      {data && (
        <Typography variant="body2" style={mono}>
          #{data.id}: {data.title}
        </Typography>
      )}
    </Stack>
  );
}
