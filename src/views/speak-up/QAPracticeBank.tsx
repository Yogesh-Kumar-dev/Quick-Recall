'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// material-ui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconBriefcase, IconEdit, IconPlayerPlayFilled, IconPlus, IconTrash } from '@tabler/icons-react';

// third party
import { useLiveQuery } from 'dexie-react-hooks';

// project imports
import { LGConfirmationModal, LGConfirmationModalVariant } from 'ui-component/leafygreen';
import * as jobsRepository from 'views/job-tracker/jobsRepository';
import useSpeakUpQAs from './useSpeakUpQAs';
import QAFormDrawer from './QAFormDrawer';
import { predefinedQuestions } from 'data/speak-up-questions';

// types
import type { JobApplication } from 'types/job-tracker';
import type { SpeakUpQA, SpeakUpQAInput } from 'types/speak-up';

// ==============================|| SPEAK UP - Q&A SIDEBAR ("UP NEXT") ||============================== //

const ALL = 'all';

interface QAPracticeBankProps {
  // The shared current-question index (driven by SpeechPractice's "Next" button and by
  // clicking a card here). The matching predefined card is highlighted + scrolled to.
  activeIndex: number;
  // Set the rehearsal question to the predefined question at this index.
  onSelectQuestion: (index: number) => void;
}

interface DrawerState {
  mode: 'add' | 'edit';
  initialValues?: SpeakUpQA | null;
  sourceId?: string;
  questionLocked?: boolean;
}

export default function QAPracticeBank({ activeIndex, onSelectQuestion }: QAPracticeBankProps) {
  const { qas, addQA, editQA, deleteQA } = useSpeakUpQAs();
  // `undefined` until the first query resolves; memoize the fallback so it's a stable
  // reference (avoids re-running the jobById memo / re-rendering the drawer each pass).
  const jobsQuery = useLiveQuery(() => jobsRepository.getAll());
  const jobs = useMemo(() => jobsQuery ?? [], [jobsQuery]);

  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SpeakUpQA | null>(null);
  const [filter, setFilter] = useState<string>(ALL);
  // Per-row expand override (keyed by predefined id / user QA id). When unset, a row's
  // answer is expanded iff it's the active question; the toggle flips that default.
  const [expandedOverride, setExpandedOverride] = useState<Record<string, boolean>>({});
  const toggleExpanded = (key: string, fallback: boolean) => setExpandedOverride((prev) => ({ ...prev, [key]: !(prev[key] ?? fallback) }));

  // Fast lookups: saved answer for a predefined question (by sourceId) and a job by id.
  const answerBySource = useMemo(() => {
    const map = new Map<string, SpeakUpQA>();
    qas.forEach((qa) => {
      if (qa.sourceId) map.set(qa.sourceId, qa);
    });
    return map;
  }, [qas]);

  const jobById = useMemo(() => {
    const map = new Map<string, JobApplication>();
    jobs.forEach((job) => map.set(job.id, job));
    return map;
  }, [jobs]);

  // User-added questions are records with no sourceId — they get their own rows.
  const userQAs = useMemo(() => qas.filter((qa) => !qa.sourceId), [qas]);

  // A predefined row's tag is its category; a user row's tag is its own `tag`. The
  // filter chips are the distinct union of both, in encounter order.
  const allTags = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const add = (t?: string) => {
      const v = t?.trim();
      if (v && !seen.has(v)) {
        seen.add(v);
        list.push(v);
      }
    };
    predefinedQuestions.forEach((p) => add(p.category));
    userQAs.forEach((q) => add(q.tag));
    return list;
  }, [userQAs]);

  // If the selected filter chip disappears (e.g. last question with that tag deleted),
  // fall back to "All".
  useEffect(() => {
    if (filter !== ALL && !allTags.includes(filter)) setFilter(ALL);
  }, [filter, allTags]);

  // Predefined questions kept under the current filter (carry their original index so
  // selection still maps to the shared questionIndex).
  const visiblePredefined = useMemo(
    () =>
      predefinedQuestions.map((predef, index) => ({ predef, index })).filter(({ predef }) => filter === ALL || predef.category === filter),
    [filter]
  );
  const visibleUserQAs = useMemo(() => userQAs.filter((qa) => filter === ALL || qa.tag === filter), [userQAs, filter]);

  // Reset-to-first-visible: when the active question is filtered out, select the first
  // still-visible predefined question so the player and list stay in sync.
  useEffect(() => {
    if (filter === ALL) return;
    const activeVisible = visiblePredefined.some(({ index }) => index === activeIndex);
    if (!activeVisible && visiblePredefined.length > 0) {
      onSelectQuestion(visiblePredefined[0].index);
    }
  }, [filter, visiblePredefined, activeIndex, onSelectQuestion]);

  // Highlighted predefined row scrolls into view when the shared index changes.
  const activeRowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeIndex, filter]);

  const handleSubmit = async (values: SpeakUpQAInput) => {
    if (drawer?.mode === 'edit' && drawer.initialValues) {
      await editQA(drawer.initialValues.id, values);
    } else {
      await addQA(values);
    }
  };

  const jobBadge = (jobId?: string) => {
    if (!jobId) return null;
    const job = jobById.get(jobId);
    if (!job) return null; // job was deleted — hide the badge gracefully
    return (
      <Chip
        size="small"
        variant="outlined"
        icon={<IconBriefcase size={13} />}
        label={`${job.companyName} — ${job.jobTitle}`}
        sx={{ maxWidth: '100%', height: 22, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
      />
    );
  };

  // Answer block: clamped to 2 lines by default, fully expanded for the active row.
  // The toggle lets any row override that default. Only show the toggle when there's
  // enough text that clamping would actually hide something.
  const renderAnswer = (answer: string, key: string, isActive: boolean) => {
    const expanded = expandedOverride[key] ?? isActive;
    const canToggle = answer.length > 120 || answer.includes('\n');
    return (
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            whiteSpace: 'pre-wrap',
            ...(!expanded && {
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            })
          }}
        >
          {answer}
        </Typography>
        {canToggle && (
          <Link
            component="button"
            type="button"
            variant="caption"
            underline="hover"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(key, isActive);
            }}
            sx={{ mt: 0.25, display: 'inline-block' }}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Link>
        )}
      </Box>
    );
  };

  // Shared "up next" row surface — compact, full-width, clickable.
  const rowSx = {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
    p: 1.5,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    transition: 'border-color 0.2s ease, background-color 0.2s ease'
  } as const;

  return (
    // Outer fills the stretched grid cell; the absolute inner resolves its height
    // against it (a stretched grid item's height is content-derived, so a plain
    // height:100% child has nothing to size against — hence the position trick).
    <Box sx={{ position: { md: 'relative' }, height: '100%', minHeight: 0 }}>
      <Box
        sx={{
          position: { md: 'absolute' },
          inset: { md: 0 },
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}
      >
        <Box sx={{ mb: 1.5, flexShrink: 0 }}>
          <Typography variant="h4" fontWeight={700}>
            Question bank
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tap a question to rehearse it, or prepare your own answer.
          </Typography>
        </Box>

        {/* Filter chips — like YouTube's category row. flexShrink:0 + py keep the row
            from being squeezed/clipped by the surrounding flex column. */}
        {allTags.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 1.5, flexShrink: 0, overflowX: 'auto', py: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}
          >
            <Chip
              label="All"
              size="small"
              color={filter === ALL ? 'primary' : 'default'}
              variant={filter === ALL ? 'filled' : 'outlined'}
              onClick={() => setFilter(ALL)}
              sx={{ flexShrink: 0 }}
            />
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                color={filter === tag ? 'primary' : 'default'}
                variant={filter === tag ? 'filled' : 'outlined'}
                onClick={() => setFilter(tag)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Stack>
        )}

        {/* Add tile — pinned (outside the scroll area) so it's always visible. */}
        <ButtonBase
          onClick={() => setDrawer({ mode: 'add' })}
          sx={(theme) => ({
            flexShrink: 0,
            justifyContent: 'flex-start',
            gap: 1,
            mb: 1.5,
            p: 1.5,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            color: 'text.secondary',
            transition: 'border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.04)
            }
          })}
        >
          <IconPlus size={20} />
          <Typography variant="subtitle2" fontWeight={700}>
            Add your own question
          </Typography>
        </ButtonBase>

        {/* Fill the remaining column height and scroll internally so the bank's bottom
          lines up with the player card and a long list doesn't stretch the page. */}
        <Stack spacing={1.5} sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
          {/* Predefined question rows */}
          {visiblePredefined.map(({ predef, index }) => {
            const saved = answerBySource.get(predef.id);
            const isActive = index === activeIndex;
            return (
              <Box
                key={predef.id}
                ref={isActive ? activeRowRef : undefined}
                role="button"
                tabIndex={0}
                onClick={() => onSelectQuestion(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectQuestion(index);
                  }
                }}
                sx={(theme) => ({
                  ...rowSx,
                  cursor: 'pointer',
                  '&:hover': { borderColor: theme.palette.primary.main },
                  ...(isActive && {
                    borderColor: 'primary.main',
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.04)
                  })
                })}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  {isActive && (
                    <Box sx={{ color: 'primary.main', mt: 0.25, flexShrink: 0 }}>
                      <IconPlayerPlayFilled size={16} />
                    </Box>
                  )}
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    {predef.category && <Chip size="small" label={predef.category} sx={{ height: 20, mb: 0.5 }} />}
                    <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.35 }}>
                      {predef.question}
                    </Typography>
                  </Box>
                </Stack>

                {saved && renderAnswer(saved.answer, predef.id, isActive)}

                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Box sx={{ minWidth: 0 }}>{saved && jobBadge(saved.jobId)}</Box>
                  {/* Stop propagation so action buttons don't also select the question. */}
                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    {saved ? (
                      <>
                        <Tooltip title="Edit answer">
                          <IconButton size="small" onClick={() => setDrawer({ mode: 'edit', initialValues: saved, questionLocked: true })}>
                            <IconEdit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete answer">
                          <IconButton size="small" color="error" onClick={() => setPendingDelete(saved)}>
                            <IconTrash size={16} />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<IconPlus size={14} />}
                        onClick={() =>
                          setDrawer({
                            mode: 'add',
                            initialValues: { question: predef.question } as SpeakUpQA,
                            sourceId: predef.id,
                            questionLocked: true
                          })
                        }
                      >
                        Prepare answer
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            );
          })}

          {/* User-added question rows */}
          {visibleUserQAs.map((qa) => (
            <Box key={qa.id} sx={rowSx}>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={qa.tag?.trim() || 'Your question'}
                sx={{ height: 20, alignSelf: 'flex-start' }}
              />
              <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.35 }}>
                {qa.question}
              </Typography>
              {renderAnswer(qa.answer, qa.id, false)}
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0 }}>{jobBadge(qa.jobId)}</Box>
                <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => setDrawer({ mode: 'edit', initialValues: qa })}>
                      <IconEdit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => setPendingDelete(qa)}>
                      <IconTrash size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Add / Edit drawer */}
      {drawer && (
        <QAFormDrawer
          open={Boolean(drawer)}
          mode={drawer.mode}
          initialValues={drawer.initialValues}
          sourceId={drawer.sourceId}
          questionLocked={drawer.questionLocked}
          tagOptions={allTags}
          jobs={jobs}
          onClose={() => setDrawer(null)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete confirmation */}
      <LGConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete this answer?"
        variant={LGConfirmationModalVariant.Danger}
        confirmButtonProps={{
          children: 'Delete',
          onClick: async () => {
            if (pendingDelete) {
              await deleteQA(pendingDelete.id);
              setPendingDelete(null);
            }
          }
        }}
        cancelButtonProps={{ onClick: () => setPendingDelete(null) }}
        onCancel={() => setPendingDelete(null)}
      >
        {pendingDelete ? `Your saved answer to “${pendingDelete.question}” will be permanently removed. This can't be undone.` : ''}
      </LGConfirmationModal>
    </Box>
  );
}
