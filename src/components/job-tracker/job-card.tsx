'use client';

import {
  ArrowRightLeft,
  CalendarClock,
  Check,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Star,
  Trash2,
  User,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { InterviewOutcome, JobApplication, JobStatus } from '@/types/job-tracker';
import { INTERVIEW_OUTCOME_CONFIG, JOB_SOURCE_CONFIG, JOB_STATUS_CONFIG, JOB_STATUS_ORDER, WORK_MODE_CONFIG } from './config';
import { formatSalary, isStale } from './stats';

// ==============================|| JOB TRACKER - JOB CARD ||============================== //

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

const OUTCOME_ICON: Record<InterviewOutcome, typeof Check> = {
  pending: Clock,
  passed: Check,
  failed: X
};

function sortedRounds(job: JobApplication) {
  return [...(job.rounds ?? [])]
    .filter((r) => !Number.isNaN(new Date(r.at).getTime()))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

// surfaces the soonest upcoming round if any, otherwise the most recent past round
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

  return (
    <div
      className={cn(
        'flex break-inside-avoid flex-col gap-2 rounded-lg border border-l-4 bg-card p-4 transition-shadow hover:shadow-md',
        status.border
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex min-w-0 items-start gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn('-mt-1 -ml-1.5 shrink-0', job.favorite ? 'text-amber-400' : 'text-muted-foreground')}
            onClick={() => onToggleFavorite(job)}
            aria-label={job.favorite ? 'Unstar' : 'Star'}
          >
            <Star className={cn('size-[18px]', job.favorite && 'fill-current')} />
          </Button>
          <div className="min-w-0">
            <h3 className="truncate text-sm leading-tight font-bold" title={job.companyName}>
              {job.companyName}
            </h3>
            <p className="truncate text-sm text-muted-foreground" title={job.jobTitle}>
              {job.jobTitle}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={cn('shrink-0 font-semibold', status.badgeClass)}>
          {status.label}
        </Badge>
      </div>

      {(salary || job.location || job.workMode || job.source || stale) && (
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {salary && <Badge variant="outline">{salary}</Badge>}
          {job.location && (
            <Badge variant="outline" className="gap-1">
              <MapPin className="size-3" />
              {job.location}
            </Badge>
          )}
          {job.workMode && <Badge variant="outline">{WORK_MODE_CONFIG[job.workMode].label}</Badge>}
          {job.source && (
            <Badge variant="outline" className="text-muted-foreground">
              {JOB_SOURCE_CONFIG[job.source].label}
            </Badge>
          )}
          {stale && <Badge className="border-amber-500/40 bg-amber-500/10 font-semibold text-amber-400">Stale</Badge>}
        </div>
      )}

      {showTimeline ? (
        <div className="mt-0.5">
          {rounds.map((round, index) => {
            const outcome = INTERVIEW_OUTCOME_CONFIG[round.outcome];
            const OutcomeIcon = OUTCOME_ICON[round.outcome];
            const isHighlight = highlight?.position === index + 1;
            const isLast = index === rounds.length - 1;
            return (
              <div key={round.id} className="flex min-w-0 gap-2">
                <div className="flex flex-col items-center">
                  <span className={cn('flex leading-none', outcome.textClass)} title={outcome.label}>
                    <OutcomeIcon className="size-4" />
                  </span>
                  {!isLast && <span className="my-0.5 min-h-2.5 w-0.5 flex-1 bg-border" />}
                </div>
                <div className={cn('min-w-0', !isLast && 'pb-1.5')}>
                  <span
                    className={cn(
                      'block truncate text-xs',
                      isHighlight ? 'font-bold' : 'font-semibold',
                      isHighlight && highlight?.isUpcoming && 'text-amber-400'
                    )}
                  >
                    {round.name || `Round ${index + 1}`}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{formatInterview(round.at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        highlight && (
          <div className={cn('flex min-w-0 items-center gap-1.5', highlight.isUpcoming ? 'text-amber-400' : 'text-muted-foreground')}>
            <CalendarClock className="size-4 shrink-0" />
            <span className="truncate text-xs font-semibold">
              {highlight.isUpcoming ? 'Next' : 'Last'}
              {highlight.round.name ? `: ${highlight.round.name}` : ''} · {formatInterview(highlight.round.at)}
            </span>
          </div>
        )
      )}

      {job.jobDescription && <p className="line-clamp-2 text-sm text-muted-foreground">{job.jobDescription}</p>}

      {contacts.length > 0 && (
        <div className="mt-0.5 flex flex-col gap-1">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
              <User className="size-[15px] shrink-0" />
              <span className="truncate text-xs">
                {contact.name}
                {contact.role ? ` · ${contact.role}` : ''}
              </span>
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex text-muted-foreground hover:text-foreground"
                  aria-label="email contact"
                  title={contact.email}
                >
                  <Mail className="size-3.5" />
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex text-muted-foreground hover:text-foreground"
                  aria-label="call contact"
                  title={contact.phone}
                >
                  <Phone className="size-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {(job.sourceUrl || documents.length > 0) && (
        <div className="mt-0.5 flex flex-wrap gap-3 text-xs">
          {job.sourceUrl && (
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="size-3" /> Posting
            </a>
          )}
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <FileText className="size-3" /> {doc.label}
            </a>
          ))}
        </div>
      )}

      <div className="mt-auto">
        <div className="mb-0.5 border-t" />
        <div className="flex justify-end gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="change status" />}>
              <ArrowRightLeft className="size-[18px]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {JOB_STATUS_ORDER.map((value) => (
                <DropdownMenuItem
                  key={value}
                  disabled={value === job.status}
                  onClick={() => {
                    if (value !== job.status) onStatusChange(job, value);
                  }}
                >
                  {JOB_STATUS_CONFIG[value].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon-sm" className="text-primary" onClick={() => onEdit(job)} aria-label="edit job">
            <Pencil className="size-[18px]" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => onDelete(job)} aria-label="delete job">
            <Trash2 className="size-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
