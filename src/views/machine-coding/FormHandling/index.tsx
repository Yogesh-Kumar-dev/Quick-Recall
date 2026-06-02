// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/FormHandling');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

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
    <ProblemLayout
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode },
        mui: { component: <MuiVersion />, code: muiCode }
      }}
    />
  );
}
