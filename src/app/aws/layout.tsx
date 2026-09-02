import type { ReactNode } from 'react';
import TopicGate from '@/components/access/topic-gate';
import { AwsAppLayout } from '@/components/aws/aws-app-layout';
import { CloudscapeProvider } from '@/components/providers/cloudscape-provider';
import OfflineSectionGuard from '@/components/pwa/offline-section-guard';

// Deliberately NOT nested under (app) — that group's layout renders QuickRecall's own sidebar,
// header and breadcrumbs (shadcn/Tailwind), which would wrap every AWS page in a second, competing
// chrome. Escaping the group here means /aws gets its own Cloudscape shell top to bottom, the way
// stepping from one app into another would look, not a themed panel inside QuickRecall.
export default function AwsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <CloudscapeProvider>
      <AwsAppLayout>
        <OfflineSectionGuard>
          <TopicGate>{children}</TopicGate>
        </OfflineSectionGuard>
      </AwsAppLayout>
    </CloudscapeProvider>
  );
}
