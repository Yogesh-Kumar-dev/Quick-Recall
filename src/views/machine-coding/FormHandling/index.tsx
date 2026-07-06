// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/FormHandling');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟢 Form Handling',
  description:
    'Build a controlled form with multiple inputs, inline validation, and a success state after submission. The foundation of every real-world React form.',
  requirements: [
    'Three fields: Name, Email, Message (textarea)',
    'All fields are controlled (value + onChange)',
    'Single handleChange function handles all fields via e.target.name',
    'Validate on submit: required fields, valid email format, message min-length',
    'Show inline error messages below each invalid field',
    "Clear a field's error as soon as the user starts typing in it",
    'Show a success state with submitted values after valid submission'
  ],
  keyPatterns: [
    'form state: { name, email, message }',
    'errors state: Partial<Record<keyof Form, string>>',
    'Single handleChange: e.target.name as key',
    'validate() returns errors object',
    'e.preventDefault() in handleSubmit'
  ],
  interviewTip:
    "The single handleChange pattern is the key: function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }. Each input must have a name attribute matching the state key. Validate on submit (not on every keystroke) but clear errors on input change for good UX. Never store derived values like 'isValid' in state — check Object.keys(errors).length === 0 inline."
};

export default function FormHandlingApp() {
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
