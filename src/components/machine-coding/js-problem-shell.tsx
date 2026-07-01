'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import CodeBlock from '@/components/content/code-block';
import JsProblemStatement from './js-problem-statement';
import ApproachDetails from './approach-details';
import type { JsProblemMeta, ApproachData } from '@/types/content';

interface Props {
  problem: JsProblemMeta;
  approaches: ApproachData[];
}

export default function JsProblemShell({ problem, approaches }: Props) {
  const [idx, setIdx] = useState(0);
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

      <Tabs defaultValue="details" className="w-full gap-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-4 py-2">
          <ToggleGroup value={[String(idx)]} onValueChange={(v) => v.length > 0 && setIdx(Number(v[0]))} variant="outline" size="sm">
            {approaches.map((a, i) => (
              <ToggleGroupItem key={a.label} value={String(i)} className="whitespace-nowrap">
                {a.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <TabsContent value="details" className="max-h-[75vh] overflow-auto p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Approach — {current.label}</p>
          <ApproachDetails approach={current} />
        </TabsContent>
        <TabsContent value="code" className="max-h-[75vh] overflow-auto p-4">
          <CodeBlock code={current.code} language="javascript" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
