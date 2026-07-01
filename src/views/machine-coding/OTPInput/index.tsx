// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/OTPInput');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 OTP Input Component',
  description:
    'Build a 6-digit OTP (One-Time Password) input where each digit has its own box. The input should feel native — like SMS verification forms.',
  requirements: [
    'Render 6 individual single-character input boxes',
    'Typing a digit auto-focuses the next box',
    'Backspace on an empty box moves focus to the previous box',
    'Pasting a 6-digit string fills all boxes automatically',
    'Only allow numeric digits (0–9)',
    'A Verify button shows the assembled OTP'
  ],
  keyPatterns: [
    'useRef array for input references',
    'inputRefs.current[i].focus()',
    'e.key === "Backspace" check',
    'onPaste + clipboardData.getData',
    'Array of state (otp: string[])'
  ],
  interviewTip:
    'Use useRef<HTMLInputElement[]>([]) to store refs for all 6 inputs. On every change, after updating state, imperatively call inputRefs.current[nextIndex]?.focus(). Paste handling: split the pasted string, fill the array, then focus the last filled index.'
};

export default function OTPInputApp() {
  return (
    <ProblemShell
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode }
      }}
    />
  );
}
