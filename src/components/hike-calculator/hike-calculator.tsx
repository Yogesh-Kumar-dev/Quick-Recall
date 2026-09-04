'use client';

import BarChart from '@cloudscape-design/components/bar-chart';
import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { type ReactNode, useState } from 'react';
import { toWords } from 'to-words/en-IN';
import { CloudscapeProvider } from '@/components/providers/cloudscape-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { hikePercentFromNewCtc, newCtcFromHike, scenarioRows } from '@/lib/hike-calculator';

// Bars at/below current CTC stay neutral; bars above it get the brand accent (docs/brand.md: #00ed64 marks progress).
const BASE_COLOR = '#94a3b8';
const ABOVE_COLOR = '#00ed64';

// leafygreen's polymorphic component type isn't a valid JSX.ElementType under React 19's stricter types.
const Option = SegmentedControlOption as unknown as (props: { value: string; disabled?: boolean; children?: ReactNode }) => ReactNode;

const MODE_TABS = [
  { value: 'new-ctc', label: 'Find New CTC' },
  { value: 'hike-percent', label: 'Find Hike %' }
];

// ─── Formatting ─────────────────────────────────────────────────────────────

function formatCtc(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Indian-numbering (crore/lakh/thousand) word form of any amount, e.g. 504000 -> "Five Lakh Four Thousand".
// `to-words/en-IN` is a locale subpath import — it pulls in only the shared conversion engine plus this one
// locale's word mappings, not the package's other 136 locales.
function amountToIndianWords(value: number): string {
  return toWords(Math.round(value));
}

// LPA only reads cleanly at 1 lakh or above; below that, fall back to a "k" suffix.
function formatChartAxisLabel(value: number): string {
  if (Math.abs(value) < 100000) return `${Math.round(value / 1000).toLocaleString('en-IN')}k`;
  const lakhs = value / 100000;
  return `${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)} LPA`;
}

function parseNumberInput(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function formatDigitsWithCommas(digits: string): string {
  return digits === '' ? '' : Number(digits).toLocaleString('en-IN');
}

// Digits + at most one decimal point, capped at 2 decimal places. No minus sign.
function sanitizePercentInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const dotIndex = cleaned.indexOf('.');
  if (dotIndex === -1) return cleaned;
  const intPart = cleaned.slice(0, dotIndex);
  const decPart = cleaned.slice(dotIndex + 1).replace(/\./g, '').slice(0, 2);
  return `${intPart}.${decPart}`;
}

// Browser autofill paints its own background/text color over ours; neutralize it so the field still matches the app's theme.
const AUTOFILL_RESET =
  '[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:shadow-[0_0_0_1000px_var(--input)_inset] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]';

// ─── CTC input (digits-only state, comma-grouped display) ─────────────────

function CtcInput({
  id,
  label,
  rawValue,
  onRawChange
}: Readonly<{
  id: string;
  label: string;
  rawValue: string;
  onRawChange: (digits: string) => void;
}>) {
  // Reformatting on every keystroke can otherwise shift the browser's cursor to the end of the field;
  // this restores it to the same digit position (by digit count, not character index, since commas move).
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const cursorPos = el.selectionStart ?? el.value.length;
    const digitsBeforeCursor = el.value.slice(0, cursorPos).replace(/\D/g, '').length;
    const digitsOnly = el.value.replace(/\D/g, '');
    const formatted = formatDigitsWithCommas(digitsOnly);

    el.value = formatted;
    let seen = 0;
    let pos = formatted.length;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        seen++;
        if (seen === digitsBeforeCursor) {
          pos = i + 1;
          break;
        }
      }
    }
    if (digitsBeforeCursor === 0) pos = 0;
    el.setSelectionRange(pos, pos);

    onRawChange(digitsOnly);
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>₹</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className={AUTOFILL_RESET}
          value={formatDigitsWithCommas(rawValue)}
          onChange={handleChange}
        />
      </InputGroup>
    </div>
  );
}

// ─── Hike % input (no minus, max 2 decimal places) ─────────────────────────

function HikePercentInput({ id, rawValue, onRawChange }: Readonly<{ id: string; rawValue: string; onRawChange: (value: string) => void }>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Hike %</Label>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className={AUTOFILL_RESET}
        value={rawValue}
        onChange={(e) => onRawChange(sanitizePercentInput(e.target.value))}
      />
    </div>
  );
}

// ─── Results block (shared by both tabs) ───────────────────────────────────

function ResultsBlock({ currentCtc, newCtc, effectivePercent }: Readonly<{ currentCtc: number; newCtc: number; effectivePercent: number }>) {
  const increase = newCtc - currentCtc;
  // Drop negative-percent scenarios from the chart (e.g. effective hike below 10%) rather than showing a "below zero" bucket.
  const scenarios = scenarioRows(currentCtc, effectivePercent).filter((row) => row.percent >= 0);
  const xDomain = scenarios.map((row) => formatPercent(row.percent));
  const baseSegment = scenarios.map((row) => ({ x: formatPercent(row.percent), y: Math.min(currentCtc, row.newCtc) }));
  const increaseSegment = scenarios.map((row) => ({ x: formatPercent(row.percent), y: Math.max(0, row.newCtc - currentCtc) }));

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current CTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCtc(currentCtc)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{amountToIndianWords(currentCtc)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">New CTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${increase > 0 ? 'text-primary' : ''}`}>{formatCtc(newCtc)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{amountToIndianWords(newCtc)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {increase >= 0 ? '+' : ''}
              {formatCtc(increase)} ({formatPercent(effectivePercent)})
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Nearby scenarios</h3>
        <CloudscapeProvider>
          <BarChart
            series={[
              { title: 'Current CTC', type: 'bar', data: baseSegment, color: BASE_COLOR, valueFormatter: formatChartAxisLabel },
              { title: 'Increase', type: 'bar', data: increaseSegment, color: ABOVE_COLOR, valueFormatter: formatChartAxisLabel }
            ]}
            stackedBars
            xDomain={xDomain}
            xScaleType="categorical"
            xTitle="Hike %"
            yTitle="New CTC"
            yTickFormatter={formatChartAxisLabel}
            height={220}
            hideFilter
            ariaLabel="Nearby scenarios chart"
          />
        </CloudscapeProvider>
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
        <CtcInput id="current-ctc-1" label="Current CTC" rawValue={currentCtcRaw} onRawChange={setCurrentCtcRaw} />
        <HikePercentInput id="hike-percent" rawValue={hikePercentRaw} onRawChange={setHikePercentRaw} />
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
        <CtcInput id="current-ctc-2" label="Current CTC" rawValue={currentCtcRaw} onRawChange={setCurrentCtcRaw} />
        <CtcInput id="new-ctc" label="New CTC" rawValue={newCtcRaw} onRawChange={setNewCtcRaw} />
      </div>

      {canCompute && (
        <ResultsBlock currentCtc={currentCtc} newCtc={newCtc} effectivePercent={hikePercentFromNewCtc(currentCtc, newCtc)} />
      )}
    </div>
  );
}

// ==============================|| HIKE CALCULATOR ||============================== //

export default function HikeCalculator() {
  const [mode, setMode] = useState<'new-ctc' | 'hike-percent'>('new-ctc');

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Hike Calculator</h1>
        <p className="mt-1 text-muted-foreground">Work out your new CTC from a hike percentage, or the hike percentage behind an offer.</p>
      </div>

      <div className="flex justify-center">
        <SegmentedControl size="small" value={mode} onChange={(v) => setMode(v as 'new-ctc' | 'hike-percent')}>
          {MODE_TABS.map((t) => (
            <Option key={t.value} value={t.value}>
              {t.label}
            </Option>
          ))}
        </SegmentedControl>
      </div>

      <div className="mt-4 w-[70vw] mx-auto">{mode === 'new-ctc' ? <FindNewCtcTab /> : <FindHikePercentTab />}</div>
    </div>
  );
}
