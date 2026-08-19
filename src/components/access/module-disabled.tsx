'use client';

import { IconLock } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { type Topic, topicLabel } from '@/config/topics';

// ==============================|| ACCESS - MODULE DISABLED ||============================== //

// Shown instead of the page when the user lands on a topic they've switched off (typed URL,
// bookmarked link, stale tab). Friendly framing: the module is "outside your focus", not denied.

export default function ModuleDisabled({ topics }: { topics: Topic[] }) {
  const router = useRouter();
  const label = topics.length === 1 ? topicLabel(topics[0]) : 'This module';

  return (
    <div className="mx-auto flex min-h-[55vh] w-full max-w-md flex-col items-center justify-center text-center">
      <IconLock size={48} className="mx-auto opacity-50" />
      <h1 className="mt-4 text-2xl font-bold">{label} is currently outside your focus</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You&apos;ve switched this module off in your learning preferences. Focus on one topic at a time, and turn it back on whenever
        you&apos;re ready.
      </p>
      <Button onClick={() => router.push('/settings')} className="mt-6">
        Go to Settings
      </Button>
    </div>
  );
}
