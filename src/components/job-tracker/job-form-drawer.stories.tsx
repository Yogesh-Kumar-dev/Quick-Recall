import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import JobFormDrawer from '@/components/job-tracker/job-form-drawer'
import type { JobApplication } from '@/types/job-tracker'

const sampleJob: JobApplication = {
  id: '1',
  companyName: 'Acme Corp',
  jobTitle: 'Senior Frontend Engineer',
  status: 'interviewing',
  location: 'San Francisco, CA',
  workMode: 'hybrid',
  source: 'linkedin',
  sourceUrl: 'https://linkedin.com/jobs/123',
  salaryMin: 150000,
  salaryMax: 200000,
  salaryCurrency: 'USD',
  appliedAt: '2025-07-15T10:00:00Z',
  favorite: true,
  jobDescription: 'Looking for a senior frontend engineer with React and TypeScript experience.',
  rounds: [
    { id: 'r1', at: '2025-07-20T14:00:00Z', name: 'Phone Screen', outcome: 'passed' },
    { id: 'r2', at: '2025-07-25T10:00:00Z', name: 'Technical', outcome: 'pending' }
  ],
  contacts: [
    { id: 'c1', name: 'Jane Smith', role: 'Recruiter', email: 'jane@acme.com', phone: '+1-555-0123' }
  ],
  documents: [
    { id: 'd1', label: 'Resume v3', url: 'https://example.com/resume.pdf' }
  ],
  notes: [
    { id: 'n1', text: 'Had a great phone screen. Technical round next week.', createdAt: Date.now() - 86400000 }
  ],
  createdAt: Date.now(),
  updatedAt: Date.now()
}

const meta = {
  title: 'JobTracker/JobFormDrawer',
  component: JobFormDrawer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    open: true,
    mode: 'add',
    onClose: () => {},
    onSubmit: () => {}
  }
} satisfies Meta<typeof JobFormDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const AddJob: Story = {
  args: {
    open: true,
    mode: 'add'
  }
}

export const EditJob: Story = {
  args: {
    open: true,
    mode: 'edit',
    initialValues: sampleJob
  }
}

export const EditWithRounds: Story = {
  args: {
    open: true,
    mode: 'edit',
    initialValues: {
      ...sampleJob,
      status: 'interviewing',
      rounds: [
        { id: 'r1', at: '2025-07-20T14:00:00Z', name: 'Phone Screen', outcome: 'passed' },
        { id: 'r2', at: '2025-07-25T10:00:00Z', name: 'Technical', outcome: 'passed' },
        { id: 'r3', at: '2025-07-28T15:00:00Z', name: 'System Design', outcome: 'pending' }
      ]
    }
  }
}
