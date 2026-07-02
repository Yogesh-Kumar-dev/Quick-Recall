'use client';

import { Activity, type ReactNode, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CodeBlock from '@/components/content/code-block';
import Segmented from './segmented';
import ProblemStatement from './problem-statement';
import type { ProblemMeta } from '@/types/content';

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

export default function ProblemShell({ problem, versions }: Props) {
  const [active, setActive] = useState<'jsx' | 'tsx'>('jsx');
  const [tab, setTab] = useState('preview');
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
        />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className="w-full gap-0">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <Segmented options={VERSIONS} value={active} onChange={(v) => setActive(v as 'jsx' | 'tsx')} />
        </div>

        {/* keepMounted lets base-ui render both panels; <Activity> prerenders the
            hidden one at low priority and defers its effects until it's shown. */}
        <TabsContent value="preview" keepMounted className="max-h-[80vh] overflow-auto p-4">
          <Activity mode={tab === 'preview' ? 'visible' : 'hidden'}>{current.component}</Activity>
        </TabsContent>
        <TabsContent value="code" keepMounted className="max-h-[80vh] overflow-auto p-4">
          <Activity mode={tab === 'code' ? 'visible' : 'hidden'}>
            <CodeBlock code={current.code} language={active} />
          </Activity>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
