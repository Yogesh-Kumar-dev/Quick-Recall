'use client';

import { Activity, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CodeBlock from '@/components/content/code-block';
import Segmented from './segmented';
import JsProblemStatement from './js-problem-statement';
import ApproachDetails from './approach-details';
import PracticePanel from './practice-panel';
import usePracticeSession from './use-practice-session';
import type { JsProblemMeta, ApproachData } from '@/types/content';

interface Props {
  problem: JsProblemMeta;
  approaches: ApproachData[];
}

export default function JsProblemShell({ problem, approaches }: Props) {
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState('details');
  const session = usePracticeSession();

  // ?practice=1 deep-links (from /review, dashboard) open straight onto the Practice tab.
  // Read post-mount instead of via nuqs — these pages are SSG'd and useSearchParams would
  // force a Suspense boundary into every problem view.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('practice') === '1') setTab('practice');
  }, []);
  // Details/Code give away the approach — locked while a timed attempt is running.
  const locked = session.status === 'active';
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

      <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className="w-full gap-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <TabsList>
            <TabsTrigger value="details" disabled={locked}>
              Details
            </TabsTrigger>
            <TabsTrigger value="code" disabled={locked}>
              Code
            </TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>
          {locked && <span className="text-xs text-muted-foreground">Solution locked during practice</span>}
        </div>

        {/* keepMounted lets base-ui render both panels; <Activity> prerenders the
            hidden one at low priority and defers its effects until it's shown. The approach
            picker only shows under Code — Details always describes whichever approach was last
            picked there (matches legacy's JsProblemLayout). */}
        <TabsContent value="details" keepMounted className="max-h-[75vh] overflow-auto p-4">
          <Activity mode={tab === 'details' ? 'visible' : 'hidden'}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Approach: {current.label}</p>
            <ApproachDetails approach={current} />
          </Activity>
        </TabsContent>
        <TabsContent value="code" keepMounted className="max-h-[75vh] overflow-auto p-4">
          <Activity mode={tab === 'code' ? 'visible' : 'hidden'}>
            <div className="mb-3 flex items-center gap-2 overflow-x-auto">
              <Segmented
                options={approaches.map((a, i) => ({ label: a.label, value: String(i) }))}
                value={String(idx)}
                onChange={(v) => setIdx(Number(v))}
              />
            </div>
            <CodeBlock code={current.code} language="javascript" />
          </Activity>
        </TabsContent>
        <TabsContent value="practice" className="max-h-[75vh] overflow-auto p-4">
          <PracticePanel session={session} solutionCode={current.code} language="javascript" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
