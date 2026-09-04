'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hikePercentFromNewCtc, newCtcFromHike, projectionRows, scenarioRows } from '@/lib/hike-calculator';

// ─── Formatting ─────────────────────────────────────────────────────────────

function formatCtc(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function parseNumberInput(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

// ─── Results block (shared by both tabs) ───────────────────────────────────

function ResultsBlock({ currentCtc, newCtc, effectivePercent }: { currentCtc: number; newCtc: number; effectivePercent: number }) {
  const increase = newCtc - currentCtc;
  const scenarios = scenarioRows(currentCtc, effectivePercent);
  const projections = projectionRows(currentCtc, effectivePercent);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current CTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCtc(currentCtc)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">New CTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${increase > 0 ? 'text-primary' : ''}`}>{formatCtc(newCtc)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {increase >= 0 ? '+' : ''}
              {formatCtc(increase)} ({formatPercent(effectivePercent)})
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Nearby scenarios</h3>
        <table className="w-full border-collapse overflow-hidden rounded-lg border text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="px-3 py-2 font-medium">Hike %</th>
              <th className="px-3 py-2 font-medium">New CTC</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((row) => (
              <tr key={row.percent} className={row.percent === effectivePercent ? 'bg-primary/5 font-medium' : 'border-t'}>
                <td className="px-3 py-2">{formatPercent(row.percent)}</td>
                <td className="px-3 py-2">{formatCtc(row.newCtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">3-year projection</h3>
        <table className="w-full border-collapse overflow-hidden rounded-lg border text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="px-3 py-2 font-medium">Year</th>
              <th className="px-3 py-2 font-medium">CTC</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((row) => (
              <tr key={row.year} className={row.year === 0 ? '' : 'border-t'}>
                <td className="px-3 py-2">{row.year === 0 ? 'Now' : `Year ${row.year}`}</td>
                <td className="px-3 py-2">{formatCtc(row.ctc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 1: Find New CTC ────────────────────────────────────────────────────

function FindNewCtcTab() {
  const [currentCtcRaw, setCurrentCtcRaw] = useState('');
  const [hikePercentRaw, setHikePercentRaw] = useState('');

  const currentCtc = parseNumberInput(currentCtcRaw);
  const hikePercent = parseNumberInput(hikePercentRaw);
  const canCompute = currentCtc !== null && currentCtc > 0 && hikePercent !== null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="current-ctc-1">Current CTC</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>₹</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="current-ctc-1" type="number" min={0} value={currentCtcRaw} onChange={(e) => setCurrentCtcRaw(e.target.value)} />
          </InputGroup>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hike-percent">Hike %</Label>
          <Input id="hike-percent" type="number" value={hikePercentRaw} onChange={(e) => setHikePercentRaw(e.target.value)} />
        </div>
      </div>

      {canCompute && (
        <ResultsBlock currentCtc={currentCtc} newCtc={newCtcFromHike(currentCtc, hikePercent)} effectivePercent={hikePercent} />
      )}
    </div>
  );
}

// ─── Tab 2: Find Hike % ─────────────────────────────────────────────────────

function FindHikePercentTab() {
  const [currentCtcRaw, setCurrentCtcRaw] = useState('');
  const [newCtcRaw, setNewCtcRaw] = useState('');

  const currentCtc = parseNumberInput(currentCtcRaw);
  const newCtc = parseNumberInput(newCtcRaw);
  const canCompute = currentCtc !== null && currentCtc > 0 && newCtc !== null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="current-ctc-2">Current CTC</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>₹</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="current-ctc-2" type="number" min={0} value={currentCtcRaw} onChange={(e) => setCurrentCtcRaw(e.target.value)} />
          </InputGroup>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-ctc">New CTC</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>₹</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="new-ctc" type="number" min={0} value={newCtcRaw} onChange={(e) => setNewCtcRaw(e.target.value)} />
          </InputGroup>
        </div>
      </div>

      {canCompute && (
        <ResultsBlock currentCtc={currentCtc} newCtc={newCtc} effectivePercent={hikePercentFromNewCtc(currentCtc, newCtc)} />
      )}
    </div>
  );
}

// ==============================|| HIKE CALCULATOR ||============================== //

export default function HikeCalculator() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Hike Calculator</h1>
        <p className="mt-1 text-muted-foreground">Work out your new CTC from a hike percentage, or the hike percentage behind an offer.</p>
      </div>

      <Tabs defaultValue="new-ctc">
        <TabsList>
          <TabsTrigger value="new-ctc">Find New CTC</TabsTrigger>
          <TabsTrigger value="hike-percent">Find Hike %</TabsTrigger>
        </TabsList>
        <TabsContent value="new-ctc">
          <FindNewCtcTab />
        </TabsContent>
        <TabsContent value="hike-percent">
          <FindHikePercentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
