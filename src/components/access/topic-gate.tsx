'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import useTopicPreferences from '@/components/settings/use-topic-preferences';
import { topicForPathname, topicsEnabled } from '@/lib/topic-access';
import ModuleDisabled from './module-disabled';

// ==============================|| ACCESS - TOPIC GATE ||============================== //

// Defense-in-depth: one guard mounted in the app layout. Maps the current pathname back to its
// topic via the nav config (single source of truth), and swaps the page for <ModuleDisabled>
// when the user has switched that topic off. Hub routes (dashboard, settings, study, articles)
// resolve to no topic and always pass.

export default function TopicGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const topics = useMemo(() => topicForPathname(pathname), [pathname]);
  const { prefs } = useTopicPreferences();

  if (topics === undefined) return <>{children}</>;
  if (prefs === undefined) return null;
  if (!topicsEnabled(topics, prefs)) return <ModuleDisabled topics={topics} />;
  return <>{children}</>;
}
