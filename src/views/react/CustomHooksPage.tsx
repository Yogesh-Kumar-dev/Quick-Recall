'use client';
import { useEffect, useMemo } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconAlertTriangle, IconChevronDown } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import CodeBlock from 'ui-component/interview-prep/CodeBlock';
import { reactCustomHooks } from 'data/react-custom-hooks';
import type { HookDifficulty, HookDoc } from 'types/content';

// ─── Static meta ──────────────────────────────────────────────────────────────

const DIFFICULTY_META: { value: HookDifficulty; label: string; emoji: string; color: 'success' | 'warning' | 'error' }[] = [
  { value: 'easy', label: 'Easy', emoji: '🟢', color: 'success' },
  { value: 'medium', label: 'Medium', emoji: '🟡', color: 'warning' },
  { value: 'advanced', label: 'Advanced', emoji: '🔴', color: 'error' }
];

const CATEGORY_LABELS: Record<string, string> = {
  state: 'State',
  effect: 'Effect',
  ref: 'Ref',
  browser: 'Browser API',
  async: 'Async'
};

const difficultyColor = (d: HookDifficulty) => DIFFICULTY_META.find((m) => m.value === d)!.color;

// ─── Hook card ──────────────────────────────────────────────────────────────

function HookCard({ hook, open, onToggle }: { hook: HookDoc; open: boolean; onToggle: (id: string) => void }) {
  return (
    <Accordion
      id={`hook-${hook.id}`}
      expanded={open}
      onChange={() => onToggle(hook.id)}
      disableGutters
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px !important', '&:before': { display: 'none' }, mb: 1.5 }}
    >
      <AccordionSummary
        expandIcon={<IconChevronDown size={18} />}
        sx={{
          borderRadius: open ? '8px 8px 0 0' : '8px',
          bgcolor: 'action.hover',
          minHeight: 56,
          '& .MuiAccordionSummary-content': { my: 1 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', pr: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: '"Fira Code", Consolas, monospace' }}>
            {hook.name}
          </Typography>
          <Chip label={hook.difficulty} color={difficultyColor(hook.difficulty)} size="small" variant="outlined" />
          <Typography variant="body2" color="text.secondary">
            {hook.tagline}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 2, pb: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
          {hook.description}
        </Typography>

        <Box
          sx={{
            mb: 2,
            p: 1,
            bgcolor: 'action.hover',
            borderRadius: 1,
            fontFamily: '"Fira Code", Consolas, monospace',
            fontSize: 13,
            overflowX: 'auto'
          }}
        >
          {hook.signature}
        </Box>

        {/* Live demo */}
        <Typography variant="overline" color="text.secondary">
          Live demo
        </Typography>
        <Box sx={{ mt: 0.5, mb: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.default' }}>
          {hook.demo}
        </Box>

        {/* Source */}
        <Typography variant="overline" color="text.secondary">
          Implementation
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <CodeBlock code={hook.source} language="typescript" mb={2} />
        </Box>

        {/* Usage */}
        <Typography variant="overline" color="text.secondary">
          Usage
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <CodeBlock code={hook.usage} language="tsx" mb={2} />
        </Box>

        {/* Use cases */}
        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
          When to use it
        </Typography>
        <Box component="ul" sx={{ mt: 0, mb: hook.gotcha ? 2 : 0, pl: 2.5 }}>
          {hook.useCases.map((uc, i) => (
            <Box component="li" key={i} sx={{ mb: 0.15 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                {uc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Gotcha */}
        {hook.gotcha && (
          <Box sx={{ p: 1.25, bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
            <Typography
              variant="body2"
              sx={{ lineHeight: 1.6, color: 'warning.dark', display: 'flex', alignItems: 'flex-start', gap: 0.75 }}
            >
              <IconAlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                <strong>Watch out:</strong> {hook.gotcha}
              </span>
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomHooksPage() {
  // URL-backed state — shareable / back-button friendly, same pattern as the other section pages.
  const [difficultyParam, setDifficultyParam] = useQueryState('difficulty', parseAsString);
  const [categoryParam, setCategoryParam] = useQueryState('category', parseAsString);
  const [openId, setOpenId] = useQueryState('open', parseAsString);

  const difficulty = (difficultyParam ?? 'all') as HookDifficulty | 'all';
  const category = categoryParam ?? 'all';

  // Changing any filter collapses the open card so its id can't point at a now-hidden hook.
  const setDifficulty = (val: HookDifficulty | 'all') => {
    void setDifficultyParam(val === 'all' ? null : val);
    void setOpenId(null);
  };
  const setCategory = (val: string) => {
    void setCategoryParam(val === 'all' ? null : val);
    void setOpenId(null);
  };
  // Single accordion open at a time, tracked in ?open=<id>.
  const handleToggle = (id: string) => void setOpenId(openId === id ? null : id);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    reactCustomHooks.forEach((h) => map.set(h.category, (map.get(h.category) ?? 0) + 1));
    return Array.from(map.entries());
  }, []);

  const filtered = useMemo(
    () =>
      reactCustomHooks.filter((h) => {
        const matchDiff = difficulty === 'all' || h.difficulty === difficulty;
        const matchCat = category === 'all' || h.category === category;
        return matchDiff && matchCat;
      }),
    [difficulty, category]
  );

  // When a hook is deep-linked via ?open=<id> (e.g. from header fuzzy search),
  // scroll its now-expanded card into view once it has rendered.
  useEffect(() => {
    if (!openId) return;
    if (!filtered.some((h) => h.id === openId)) return;
    const el = document.getElementById(`hook-${openId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [openId, filtered]);

  return (
    <MainCard
      title="🪝 Custom Hooks"
      secondary={
        <Typography variant="caption" color="text.secondary">
          {filtered.length} of {reactCustomHooks.length}
        </Typography>
      }
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
        Battle-tested reusable hooks asked about in frontend interviews. Each one ships a live demo, the full TypeScript implementation,
        real usage, and the gotcha interviewers probe for. The source mirrors importable hooks under <code>src/hooks/</code>.
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Chip
          label="All"
          size="small"
          color={difficulty === 'all' ? 'primary' : 'default'}
          variant={difficulty === 'all' ? 'filled' : 'outlined'}
          onClick={() => setDifficulty('all')}
        />
        {DIFFICULTY_META.map((d) => (
          <Chip
            key={d.value}
            label={`${d.emoji} ${d.label}`}
            size="small"
            color={difficulty === d.value ? d.color : 'default'}
            variant={difficulty === d.value ? 'filled' : 'outlined'}
            onClick={() => setDifficulty(d.value)}
          />
        ))}
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Chip
          label="All categories"
          size="small"
          color={category === 'all' ? 'secondary' : 'default'}
          variant={category === 'all' ? 'filled' : 'outlined'}
          onClick={() => setCategory('all')}
        />
        {categories.map(([cat, count]) => (
          <Chip
            key={cat}
            label={`${CATEGORY_LABELS[cat] ?? cat} (${count})`}
            size="small"
            color={category === cat ? 'secondary' : 'default'}
            variant={category === cat ? 'filled' : 'outlined'}
            onClick={() => setCategory(cat)}
          />
        ))}
      </Stack>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">No hooks match the selected filters.</Typography>
        </Box>
      ) : (
        filtered.map((hook) => <HookCard key={hook.id} hook={hook} open={openId === hook.id} onToggle={handleToggle} />)
      )}
    </MainCard>
  );
}
