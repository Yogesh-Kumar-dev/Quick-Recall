'use client';

import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { Activity, type ReactNode, useEffect, useState } from 'react';
import CodeBlock from '@/components/content/code-block';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ApproachData, JsProblemMeta } from '@/types/content';
import ApproachDetails from './approach-details';
import JsProblemStatement from './js-problem-statement';
import SandboxPanel from './sandbox-panel';

// leafygreen's polymorphic component type isn't a valid JSX.ElementType under React 19's stricter types.
const Option = SegmentedControlOption as unknown as (props: { value: string; disabled?: boolean; children?: ReactNode }) => ReactNode;

interface Props {
  problem: JsProblemMeta;
  approaches: ApproachData[];
}

const VIEW_TABS = [
  { value: 'details', label: 'Details' },
  { value: 'code', label: 'Code' },
  { value: 'practice', label: 'Practice' }
];

export default function JsProblemShell({ problem, approaches }: Props) {
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState('details');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('practice') === '1') setTab('practice');
  }, []);

  const current = approaches[idx];

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border p-4">
        <h1 className="mb-3 text-lg font-semibold">{problem.title}</h1>
        <JsProblemStatement
          description={problem.description}
          examples={problem.examples}
          constraints={problem.constraints}
          interviewTip={problem.interviewTip}
          tags={problem.tags}
        />
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <SegmentedControl size="small" value={tab} onChange={setTab}>
            {VIEW_TABS.map((t) => (
              <Option key={t.value} value={t.value}>
                {t.label}
              </Option>
            ))}
          </SegmentedControl>
        </div>

        {/* Details/Code stay mounted (via `hidden`) so <Activity> can prerender the inactive
            one at low priority and defer its effects until it's shown. The approach picker only
            shows under Code — Details always describes whichever approach was last picked there
            (matches legacy's JsProblemLayout). */}
        <div className={cn('max-h-[75vh] overflow-auto p-4', tab !== 'details' && 'hidden')}>
          <Activity mode={tab === 'details' ? 'visible' : 'hidden'}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Approach: {current.label}</p>
            <ApproachDetails approach={current} />
          </Activity>
        </div>
        <div className={cn('max-h-[75vh] overflow-auto p-4', tab !== 'code' && 'hidden')}>
          <Activity mode={tab === 'code' ? 'visible' : 'hidden'}>
            <div className="mb-3 overflow-x-auto">
              <SegmentedControl size="small" value={String(idx)} onChange={(v) => setIdx(Number(v))}>
                {approaches.map((a, i) => (
                  <Option key={a.label} value={String(i)}>
                    {a.label}
                  </Option>
                ))}
              </SegmentedControl>
            </div>
            <div className="mc-code">
              <CodeBlock code={current.code} language="javascript" />
            </div>
          </Activity>
        </div>
        {tab === 'practice' && (
          <div className="max-h-[75vh] overflow-auto p-4">
            <SandboxPanel problemTitle={problem.title} kind="js" />
          </div>
        )}
      </div>
    </Card>
  );
}
