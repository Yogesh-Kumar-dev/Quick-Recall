'use client';
/**
 * ACCORDION — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Two modes implemented from scratch (not using MUI's Accordion component,
 * so the state logic is visible and learnable):
 *
 * SINGLE-OPEN mode:
 *   State: openIndex: number | null
 *   Toggle: openIndex === i ? null : i
 *
 * MULTI-OPEN mode:
 *   State: openItems: Set<number>
 *   Toggle: new Set has i → delete i, else add i
 *   Always spread into a NEW Set to trigger React re-render:
 *     setOpenItems(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; })
 *
 * Animation: MUI's <Collapse> component handles smooth open/close
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// ── Data ───────────────────────────────────────────────────────────────────────
const ITEMS = [
  {
    id: 0,
    title: 'What is React?',
    body: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the open-source community. React uses a declarative paradigm and a virtual DOM to efficiently update the UI.'
  },
  {
    id: 1,
    title: 'What is the Virtual DOM?',
    body: 'The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), and applies only the minimal set of changes to the real DOM (reconciliation).'
  },
  {
    id: 2,
    title: 'What are React Hooks?',
    body: 'Hooks are functions that let you use React state and lifecycle features in function components. Common hooks: useState (state), useEffect (side effects), useRef (mutable refs/DOM access), useMemo/useCallback (memoization), useContext (context access).'
  },
  {
    id: 3,
    title: 'What is the difference between useMemo and useCallback?',
    body: 'useMemo memoizes the RESULT of a function call — use it to avoid expensive computations on every render. useCallback memoizes the FUNCTION ITSELF — use it to avoid recreating callback functions that are passed as props to child components, preventing unnecessary re-renders.'
  },
  {
    id: 4,
    title: 'What is prop drilling and how do you avoid it?',
    body: "Prop drilling is passing props through multiple levels of components that don't need them, just to reach a deeply nested child. Solutions: React Context API (built-in), Zustand/Redux (global state), component composition, or render props pattern."
  }
];

// ──────────────────────────────────────────────────────────────────────────────
export default function AccordionMui() {
  const [isMultiOpen, setIsMultiOpen] = useState(false);

  // ── Single-open state ─────────────────────────────────────────────────────────
  // Only one item open at a time; null = nothing open
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // ── Multi-open state ──────────────────────────────────────────────────────────
  // Any number of items can be open simultaneously
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  // ── Generic toggle ─────────────────────────────────────────────────────────────
  const toggle = (index: number) => {
    if (isMultiOpen) {
      // Multi-open: add or remove from set
      setOpenItems((prev) => {
        const next = new Set(prev); // create a new Set (mutation doesn't trigger re-render)
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    } else {
      // Single-open: collapse if already open, otherwise open
      setOpenIndex((prev) => (prev === index ? null : index));
    }
  };

  const isOpen = (index: number) => (isMultiOpen ? openItems.has(index) : openIndex === index);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box maxWidth={600}>
      {/* Mode toggle */}
      <FormControlLabel
        control={<Switch checked={isMultiOpen} onChange={(e) => setIsMultiOpen(e.target.checked)} color="primary" />}
        label={
          <Typography variant="body2">
            {isMultiOpen ? '🔓 Multi-open (multiple sections can be open)' : '🔒 Single-open (only one at a time)'}
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      <Stack spacing={1}>
        {ITEMS.map((item) => {
          const open = isOpen(item.id);
          return (
            <Paper key={item.id} variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
              {/* Header — the clickable part */}
              <Box
                onClick={() => toggle(item.id)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: open ? 'primary.50' : 'transparent',
                  '&:hover': { bgcolor: open ? 'primary.100' : 'action.hover' },
                  transition: 'background-color 0.15s'
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {item.title}
                </Typography>
                {open ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
              </Box>

              {/* Collapsible body — MUI Collapse provides the smooth animation */}
              <Collapse in={open}>
                <Divider />
                <Box p={2}>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {item.body}
                  </Typography>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
