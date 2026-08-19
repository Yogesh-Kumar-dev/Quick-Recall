'use client';

import { IconChecklist, IconChevronRight, IconHistory } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import ShareButton from '@/components/content/ShareButton';
import useTopicPreferences from '@/components/settings/use-topic-preferences';
import { Badge } from '@/components/ui/badge';
import { QUIZ_SETS } from '@/data/quiz-sets';
import { quizSlugTopics, topicsEnabled } from '@/lib/topic-access';
import { formatDate } from '@/lib/utils';
import type { QuizAttempt } from '@/types/study';
import useQuizAttempts from './use-quiz-attempts';

// ==============================|| QUIZ — INDEX + HISTORY ||============================== //

const SETS = Object.entries(QUIZ_SETS)
  .map(([slug, set]) => ({ slug, title: set.title, count: set.questions.length, source: set.source }))
  .filter((s) => s.count > 0);

const sourceToSet = new Map<string, (typeof SETS)[number]>(SETS.map((s) => [s.source, s]));

export default function QuizIndexView() {
  const { attempts } = useQuizAttempts();
  const { prefs } = useTopicPreferences();

  // Hide sets the user has switched off; until prefs load, show everything.
  const visibleSets = useMemo(() => {
    if (!prefs) return SETS;
    return SETS.filter((s) => {
      const topics = quizSlugTopics[s.slug];
      return !topics || topicsEnabled(topics, prefs);
    });
  }, [prefs]);

  // Recent attempts that point at a disabled topic would only dead-end on the route guard, so
  // drop them too.
  const visibleAttempts = useMemo(() => {
    if (!prefs) return attempts;
    return attempts.filter((a) => {
      const set = sourceToSet.get(a.source);
      if (!set) return true;
      const topics = quizSlugTopics[set.slug];
      return !topics || topicsEnabled(topics, prefs);
    });
  }, [attempts, prefs]);

  // Best (highest-scoring) attempt per topic, shown as a badge on that topic's card.
  const bestBySource = useMemo(() => {
    const map = new Map<string, QuizAttempt>();
    for (const a of visibleAttempts) {
      const best = map.get(a.source);
      if (!best || a.score / a.total > best.score / best.total) map.set(a.source, a);
    }
    return map;
  }, [visibleAttempts]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Quiz</h1>
        <p className="text-muted-foreground">
          Multiple-choice practice by topic. Answer in Practice mode for instant feedback, or Test mode to score yourself at the end.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {visibleSets.map((set) => {
          const best = bestBySource.get(set.source);
          return (
            <div
              key={set.slug}
              className="group flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50 hover:bg-muted"
            >
              <Link href={`/quiz/${set.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                <IconChecklist size={22} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{set.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {set.count} {set.count === 1 ? 'question' : 'questions'}
                    {best ? ` · best ${best.score}/${best.total}` : ''}
                  </p>
                </div>
                <IconChevronRight size={18} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
              <ShareButton title={set.title} text={`Practice ${set.title} on QuickRecall.`} path={`/quiz/${set.slug}`} />
            </div>
          );
        })}
      </div>

      {visibleSets.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <h2 className="text-xl font-semibold">No quizzes available</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            All quiz topics are currently switched off. Turn some back on in{' '}
            <Link href="/settings" className="text-primary underline underline-offset-2">
              Settings
            </Link>
            .
          </p>
        </div>
      )}

      {visibleAttempts.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 flex items-center gap-1.5 text-lg font-semibold">
            <IconHistory size={18} /> Recent attempts
          </h2>
          <div className="flex flex-col gap-2">
            {visibleAttempts.slice(0, 10).map((a) => {
              const set = sourceToSet.get(a.source);
              return (
                <Link
                  key={a.id}
                  href={set ? `/quiz/${set.slug}` : '/quiz'}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-accent/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{set?.title ?? a.source}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                      {formatDate(a.completedAt)} · {a.mode}
                    </p>
                  </div>
                  <Badge variant={a.score === a.total ? 'default' : 'secondary'}>
                    {a.score}/{a.total}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
