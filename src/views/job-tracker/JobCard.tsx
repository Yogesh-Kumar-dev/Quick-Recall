import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconExternalLink,
  IconFileText,
  IconMail,
  IconMapPin,
  IconPencil,
  IconPhone,
  IconProgressCheck,
  IconStar,
  IconStarFilled,
  IconTrash,
  IconUser,
  IconX as IconXMark
} from '@tabler/icons-react';

// project imports
import { JOB_STATUS_CONFIG, JOB_STATUS_ORDER } from './statusConfig';
import { INTERVIEW_OUTCOME_CONFIG } from './roundConfig';
import { JOB_SOURCE_CONFIG, WORK_MODE_CONFIG } from './jobConfig';
import { formatSalary, isStale } from './jobStats';

// types
import type { InterviewOutcome, JobApplication, JobStatus } from 'types/job-tracker';

// ==============================|| JOB TRACKER - JOB CARD ||============================== //

const STATUS_BORDER: Record<string, string> = {
  applied: 'info.main',
  interviewing: 'warning.main',
  offer: 'success.main',
  rejected: 'error.main',
  ghosted: 'grey.500',
  fake: 'secondary.main'
};

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
  onStatusChange: (job: JobApplication, status: JobStatus) => void;
  onToggleFavorite: (job: JobApplication) => void;
}

function formatInterview(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const OUTCOME_ICON: Record<InterviewOutcome, typeof IconCheck> = {
  pending: IconClock,
  passed: IconCheck,
  failed: IconXMark
};

// Rounds sorted chronologically, with invalid dates dropped.
function sortedRounds(job: JobApplication) {
  return [...(job.rounds ?? [])]
    .filter((r) => !Number.isNaN(new Date(r.at).getTime()))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

// Pick the round to surface on the card: the soonest upcoming round if any,
// otherwise the most recent past round.
function pickHighlightRound(rounds: ReturnType<typeof sortedRounds>) {
  if (rounds.length === 0) return null;
  const now = Date.now();
  const upcomingIndex = rounds.findIndex((r) => new Date(r.at).getTime() >= now);
  const index = upcomingIndex === -1 ? rounds.length - 1 : upcomingIndex;
  return { round: rounds[index], position: index + 1, total: rounds.length, isUpcoming: upcomingIndex !== -1 };
}

export default function JobCard({ job, onEdit, onDelete, onStatusChange, onToggleFavorite }: JobCardProps) {
  const status = JOB_STATUS_CONFIG[job.status];
  const rounds = sortedRounds(job);
  const highlight = pickHighlightRound(rounds);
  const showTimeline = rounds.length > 1;
  const stale = isStale(job);
  const salary = formatSalary(job);
  const contacts = job.contacts ?? [];
  const documents = job.documents ?? [];

  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        borderLeft: '4px solid',
        borderLeftColor: STATUS_BORDER[job.status] ?? 'grey.400',
        transition: 'box-shadow 0.18s, transform 0.18s',
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header: favorite + company + status */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, minWidth: 0 }}>
            <Tooltip title={job.favorite ? 'Unstar' : 'Star'}>
              <IconButton
                size="small"
                color={job.favorite ? 'warning' : 'default'}
                onClick={() => onToggleFavorite(job)}
                aria-label="toggle favorite"
                sx={{ mt: -0.25, ml: -0.5 }}
              >
                {job.favorite ? <IconStarFilled size={18} /> : <IconStar size={18} />}
              </IconButton>
            </Tooltip>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.25 }} noWrap title={job.companyName}>
                {job.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap title={job.jobTitle}>
                {job.jobTitle}
              </Typography>
            </Box>
          </Box>
          <Chip label={status.label} size="small" color={status.color} variant="outlined" sx={{ flexShrink: 0, fontWeight: 600 }} />
        </Box>

        {/* Meta chips: salary, location, mode, source, stale */}
        {(salary || job.location || job.workMode || job.source || stale) && (
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {salary && <Chip label={salary} size="small" variant="outlined" sx={{ fontSize: 11 }} />}
            {job.location && (
              <Chip icon={<IconMapPin size={13} />} label={job.location} size="small" variant="outlined" sx={{ fontSize: 11 }} />
            )}
            {job.workMode && <Chip label={WORK_MODE_CONFIG[job.workMode].label} size="small" variant="outlined" sx={{ fontSize: 11 }} />}
            {job.source && (
              <Chip
                label={JOB_SOURCE_CONFIG[job.source].label}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11, color: 'text.secondary' }}
              />
            )}
            {stale && <Chip label="Stale" size="small" color="warning" sx={{ fontSize: 11, fontWeight: 600 }} />}
          </Stack>
        )}

        {/* Interview rounds */}
        {showTimeline ? (
          <Box sx={{ mt: 0.5 }}>
            {rounds.map((round, index) => {
              const outcome = INTERVIEW_OUTCOME_CONFIG[round.outcome];
              const OutcomeIcon = OUTCOME_ICON[round.outcome];
              const isHighlight = highlight?.position === index + 1;
              const isLast = index === rounds.length - 1;
              return (
                <Box key={round.id} sx={{ display: 'flex', gap: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Tooltip title={outcome.label}>
                      <Box sx={{ display: 'flex', color: outcome.sxColor, lineHeight: 0 }}>
                        <OutcomeIcon size={16} />
                      </Box>
                    </Tooltip>
                    {!isLast && <Box sx={{ flex: 1, width: '2px', minHeight: 10, bgcolor: 'divider', my: 0.25 }} />}
                  </Box>
                  <Box sx={{ pb: isLast ? 0 : 0.75, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      fontWeight={isHighlight ? 700 : 600}
                      color={isHighlight && highlight?.isUpcoming ? 'warning.dark' : 'text.primary'}
                      noWrap
                      sx={{ display: 'block' }}
                    >
                      {round.name || `Round ${index + 1}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {formatInterview(round.at)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          highlight && (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ color: highlight.isUpcoming ? 'warning.dark' : 'text.secondary', minWidth: 0 }}
            >
              <IconCalendarEvent size={16} style={{ flexShrink: 0 }} />
              <Typography variant="caption" fontWeight={600} noWrap>
                {highlight.isUpcoming ? 'Next' : 'Last'}
                {highlight.round.name ? `: ${highlight.round.name}` : ''} · {formatInterview(highlight.round.at)}
              </Typography>
            </Stack>
          )
        )}

        {/* Description */}
        {job.jobDescription && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {job.jobDescription}
          </Typography>
        )}

        {/* Contacts */}
        {contacts.length > 0 && (
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            {contacts.map((contact) => (
              <Stack key={contact.id} direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', minWidth: 0 }}>
                <IconUser size={15} style={{ flexShrink: 0 }} />
                <Typography variant="caption" noWrap>
                  {contact.name}
                  {contact.role ? ` · ${contact.role}` : ''}
                </Typography>
                {contact.email && (
                  <Tooltip title={contact.email}>
                    <Link href={`mailto:${contact.email}`} sx={{ display: 'flex', color: 'text.secondary' }} aria-label="email contact">
                      <IconMail size={14} />
                    </Link>
                  </Tooltip>
                )}
                {contact.phone && (
                  <Tooltip title={contact.phone}>
                    <Link href={`tel:${contact.phone}`} sx={{ display: 'flex', color: 'text.secondary' }} aria-label="call contact">
                      <IconPhone size={14} />
                    </Link>
                  </Tooltip>
                )}
              </Stack>
            ))}
          </Stack>
        )}

        {/* Links: source + documents */}
        {(job.sourceUrl || documents.length > 0) && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
            {job.sourceUrl && (
              <Link
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                underline="hover"
                color="primary"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}
              >
                <IconExternalLink size={13} /> Posting
              </Link>
            )}
            {documents.map((doc) => (
              <Link
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                underline="hover"
                color="primary"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}
              >
                <IconFileText size={13} /> {doc.label}
              </Link>
            ))}
          </Stack>
        )}

        {/* Footer actions */}
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 0.5 }} />
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Move to…">
              <IconButton size="small" onClick={(e) => setStatusAnchor(e.currentTarget)} aria-label="change status">
                <IconProgressCheck size={18} />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
              {JOB_STATUS_ORDER.map((value) => (
                <MenuItem
                  key={value}
                  selected={value === job.status}
                  onClick={() => {
                    setStatusAnchor(null);
                    if (value !== job.status) onStatusChange(job, value);
                  }}
                >
                  {JOB_STATUS_CONFIG[value].label}
                </MenuItem>
              ))}
            </Menu>
            <Tooltip title="Edit">
              <IconButton size="small" color="primary" onClick={() => onEdit(job)} aria-label="edit job">
                <IconPencil size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete(job)} aria-label="delete job">
                <IconTrash size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
