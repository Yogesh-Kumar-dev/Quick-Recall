// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/MultiStepForm');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Multi-Step Form with Progress Bar',
  description:
    'Build a multi-step form (wizard) with 4 steps. A progress bar shows how far along the user is. Each step validates its own fields before allowing the user to advance.',
  requirements: [
    'Render a progress bar showing current step (e.g. Step 2 of 4 = 50%)',
    'Step 1 — Personal Info: First Name, Last Name',
    'Step 2 — Contact: Email, Phone',
    'Step 3 — Role: Job title (select), Experience (select)',
    'Step 4 — Review: Show all data before final submit',
    'Next button is disabled until all required fields in the current step are filled',
    'Back button navigates to the previous step',
    'Submit button on the last step shows a success message'
  ],
  keyPatterns: ['useState for step + formData', 'Step-local validation', 'Derived progress %', 'Conditional rendering by step'],
  interviewTip:
    'Store all form data in one flat object: { firstName, lastName, email, phone, role, experience }. Validate only the fields belonging to the current step — not the whole form. Progress = (currentStep / totalSteps) * 100.'
};

export default function MultiStepFormApp() {
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
