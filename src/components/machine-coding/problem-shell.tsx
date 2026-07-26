'use client';

import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { Activity, type ReactNode, useEffect, useState } from 'react';
import CodeBlock from '@/components/content/code-block';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ProblemMeta } from '@/types/content';
import PracticePanel from './practice-panel';
import ProblemStatement from './problem-statement';
import usePracticeSession from './use-practice-session';

// leafygreen's polymorphic component type isn't a valid JSX.ElementType under React 19's stricter types.
const Option = SegmentedControlOption as unknown as (props: { value: string; disabled?: boolean; children?: ReactNode }) => ReactNode;

interface VersionData {
  component: ReactNode;
  code: string;
}

interface Props {
  problem: ProblemMeta;
  versions: { jsx: VersionData; tsx: VersionData };
}

const VERSIONS = [
  { value: 'jsx' as const, label: 'JSX' },
  { value: 'tsx' as const, label: 'TSX' }
];

const VIEW_TABS = [
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
  { value: 'practice', label: 'Practice' }
];

export default function ProblemShell({ problem, versions }: Props) {
  const [active, setActive] = useState<'jsx' | 'tsx'>('jsx');
  const [tab, setTab] = useState('preview');
  const session = usePracticeSession();

  // ?practice=1 deep-links (from /review, dashboard) open straight onto the Practice tab.
  // Read post-mount instead of via nuqs — these pages are SSG'd and useSearchParams would
  // force a Suspense boundary into every problem view.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('practice') === '1') setTab('practice');
  }, []);
  // Preview stays open (it IS the spec you're building against); only Code is locked mid-attempt.
  const locked = session.status === 'active';
  const current = versions[active];

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border p-4">
        <h1 className="mb-3 text-lg font-semibold">{problem.title}</h1>
        <ProblemStatement
          description={problem.description}
          requirements={problem.requirements}
          keyPatterns={problem.keyPatterns}
          interviewTip={problem.interviewTip}
          sampleData={problem.sampleData}
        />
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <SegmentedControl size="small" value={tab} onChange={setTab}>
            {VIEW_TABS.map((t) => (
              <Option key={t.value} value={t.value} disabled={t.value === 'code' && locked}>
                {t.label}
              </Option>
            ))}
          </SegmentedControl>
          <SegmentedControl size="small" value={active} onChange={(v) => setActive(v as 'jsx' | 'tsx')}>
            {VERSIONS.map((v) => (
              <Option key={v.value} value={v.value}>
                {v.label}
              </Option>
            ))}
          </SegmentedControl>
        </div>

        {/* Preview/Code stay mounted (via `hidden`) so <Activity> can prerender the
            inactive one at low priority and defer its effects until it's shown. */}
        <div className={cn('max-h-[80vh] overflow-auto p-4', tab !== 'preview' && 'hidden')}>
          <Activity mode={tab === 'preview' ? 'visible' : 'hidden'}>{current.component}</Activity>
        </div>
        <div className={cn('max-h-[80vh] overflow-auto p-4', tab !== 'code' && 'hidden')}>
          <Activity mode={tab === 'code' ? 'visible' : 'hidden'}>
            <div className="mc-code">
              <CodeBlock code={current.code} language={active} />
            </div>
          </Activity>
        </div>
        {tab === 'practice' && (
          <div className="max-h-[80vh] overflow-auto p-4">
            <PracticePanel session={session} solutionCode={current.code} language={active} />
          </div>
        )}
      </div>
    </Card>
  );
}
