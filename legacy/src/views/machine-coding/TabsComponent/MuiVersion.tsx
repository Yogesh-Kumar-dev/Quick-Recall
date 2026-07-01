'use client';
/**
 * TABS COMPONENT — MUI VERSION (built from scratch, not using MUI Tabs)
 * ──────────────────────────────────────────────────────────────────────────────
 * Three rendering strategies compared here:
 *
 * ❌ Eager mount (bad):
 *    Render ALL tab panels on load. Wastes resources if tabs have heavy content.
 *
 * ❌ Unmount on switch (bad):
 *    Only render active panel. Loses local state (scroll pos, form values) on switch.
 *
 * ✅ Lazy mount + keep-alive (BEST):
 *    - Don't mount a tab until it's first opened (mountedTabs Set)
 *    - Once mounted, keep it in the DOM but hide with display:none
 *    - Result: no wasted initial render + no state loss on switch
 *
 * Keyboard nav: tab bar is a div with role="tablist", each button role="tab".
 * Arrow keys are handled in onKeyDown on the tablist container.
 */
import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

// ── Tab data ───────────────────────────────────────────────────────────────────
const TABS = [
  {
    label: 'Overview',
    badge: 0,
    content: () => (
      <Box>
        <Typography variant="h6" mb={1}>
          📊 Project Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          This is the overview tab. It was rendered the first time you opened it and stays mounted after that. Switch to another tab and
          back — this component does not re-mount (check the timestamp below).
        </Typography>
        <Chip label={`First rendered: ${new Date().toLocaleTimeString()}`} variant="outlined" size="small" />
      </Box>
    )
  },
  {
    label: 'Activity',
    badge: 3,
    content: () => (
      <Box>
        <Typography variant="h6" mb={1}>
          🔔 Recent Activity
        </Typography>
        <Stack spacing={1}>
          {['PR #42 merged by @alice', 'Issue #18 opened by @bob', 'Deployment to staging succeeded'].map((item) => (
            <Paper key={item} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
              <Typography variant="body2">{item}</Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    )
  },
  {
    label: 'Settings',
    badge: 0,
    content: () => (
      <Box>
        <Typography variant="h6" mb={1}>
          ⚙️ Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Settings panel — lazy loaded. It was not rendered until you first clicked this tab.
        </Typography>
      </Box>
    )
  },
  {
    label: 'Members',
    badge: 12,
    content: () => (
      <Box>
        <Typography variant="h6" mb={1}>
          👥 Team Members
        </Typography>
        <Stack spacing={0.5}>
          {['Alice Chen', 'Bob Kumar', 'Carol Smith', 'Dan Lee'].map((name) => (
            <Box key={name} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">{name}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    )
  }
];

// ──────────────────────────────────────────────────────────────────────────────
export default function TabsMui() {
  const [activeTab, setActiveTab] = useState(0);

  // mountedTabs: tracks which tabs have been opened at least once
  // Starts with {0} because we show tab 0 initially
  const [mountedTabs, setMountedTabs] = useState<Set<number>>(new Set([0]));

  // Refs for each tab button (for focus management on keyboard nav)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ── Tab activation ─────────────────────────────────────────────────────────
  const activateTab = (index: number) => {
    setActiveTab(index);
    // Mark as mounted — once added, never removed (keep-alive)
    setMountedTabs((prev) => new Set(prev).add(index));
  };

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (activeTab + 1) % TABS.length;
      activateTab(next);
      tabRefs.current[next]?.focus(); // move browser focus to the new tab button
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (activeTab - 1 + TABS.length) % TABS.length;
      activateTab(prev);
      tabRefs.current[prev]?.focus();
    }
  };

  return (
    <Box maxWidth={600}>
      {/* ── Tab bar ───────────────────────────────────────────────────────────── */}
      <Box
        role="tablist" // ARIA role
        aria-label="Project tabs"
        onKeyDown={handleKeyDown} // ← handles arrow key navigation
        sx={{
          display: 'flex',
          borderBottom: '2px solid',
          borderColor: 'divider',
          mb: 0
        }}
      >
        {TABS.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeTab === i}
            tabIndex={activeTab === i ? 0 : -1} // roving tabindex pattern
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            onClick={() => activateTab(i)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === i ? '2px solid #1976d2' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? '#1976d2' : '#555',
              marginBottom: -2, // overlap the border-bottom of container
              transition: 'color 0.15s'
            }}
          >
            <Badge badgeContent={tab.badge || undefined} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10 } }}>
              {tab.label}
            </Badge>
          </button>
        ))}
      </Box>

      {/* ── Tab panels (lazy mount + keep-alive) ─────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '0 0 8px 8px', borderTop: 'none', minHeight: 180 }}>
        {TABS.map((tab, i) => (
          // Always in DOM once mounted; hidden via display:none when not active
          <Box key={i} role="tabpanel" aria-labelledby={`tab-${i}`} style={{ display: activeTab === i ? 'block' : 'none' }}>
            {/*
              LAZY MOUNT PATTERN:
              Only render children if this tab has been opened before.
              Once mountedTabs.has(i) is true, it stays true → no re-mount.
            */}
            {mountedTabs.has(i) && <tab.content />}
          </Box>
        ))}
      </Paper>

      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary">
        💡 Try: Switch tabs with ← → arrow keys. Switch back — tab content is preserved (not re-mounted). Tabs with badges (Activity: 3,
        Members: 12) were lazy-loaded when first clicked.
      </Typography>
    </Box>
  );
}
