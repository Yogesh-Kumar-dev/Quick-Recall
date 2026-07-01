'use client';

import { type ReactNode, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import CodeBlock from '@/components/content/code-block';
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
  { key: 'jsx' as const, label: 'JSX', filename: 'JsxVersion.jsx' },
  { key: 'tsx' as const, label: 'TSX', filename: 'TsxVersion.tsx' }
];

export default function ProblemShell({ problem, versions }: Props) {
  const [active, setActive] = useState<'jsx' | 'tsx'>('jsx');
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

      <Tabs defaultValue="preview" className="w-full gap-0">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <ToggleGroup value={[active]} onValueChange={(v) => v.length > 0 && setActive(v[0] as 'jsx' | 'tsx')} variant="outline" size="sm">
            {VERSIONS.map((v) => (
              <ToggleGroupItem key={v.key} value={v.key}>
                {v.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <TabsContent value="preview" className="max-h-[80vh] overflow-auto p-4">
          {current.component}
        </TabsContent>
        <TabsContent value="code" className="max-h-[80vh] overflow-auto p-4">
          <CodeBlock code={current.code} language={active} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
