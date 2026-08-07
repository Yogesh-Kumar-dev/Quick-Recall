import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import KanbanBoard from '@/components/job-tracker/kanban-board';
import type { JobApplication } from '@/types/job-tracker';

const baseJob: JobApplication = {
  id: '1',
  companyName: 'Acme Corp',
  jobTitle: 'Senior Frontend Engineer',
  status: 'applied',
  location: 'San Francisco, CA',
  workMode: 'hybrid',
  source: 'linkedin',
  salaryMin: 150000,
  salaryMax: 200000,
  salaryCurrency: 'USD',
  appliedAt: '2025-07-15T10:00:00Z',
  favorite: false,
  rounds: [],
  contacts: [],
  documents: [],
  notes: [],
  createdAt: Date.now(),
  updatedAt: Date.now()
};

const sampleJobs: JobApplication[] = [
  { ...baseJob, id: '1', companyName: 'Acme Corp', jobTitle: 'Senior Frontend', status: 'applied' },
  { ...baseJob, id: '2', companyName: 'TechStart', jobTitle: 'Full Stack Dev', status: 'applied', favorite: true },
  {
    ...baseJob,
    id: '3',
    companyName: 'MegaCo',
    jobTitle: 'React Engineer',
    status: 'interviewing',
    rounds: [{ id: 'r1', at: '2025-07-20T14:00:00Z', name: 'Phone Screen', outcome: 'passed' }]
  },
  {
    ...baseJob,
    id: '4',
    companyName: 'CloudInc',
    jobTitle: 'Frontend Lead',
    status: 'interviewing',
    rounds: [{ id: 'r2', at: '2025-07-22T10:00:00Z', name: 'Technical', outcome: 'pending' }]
  },
  {
    ...baseJob,
    id: '5',
    companyName: 'DataCo',
    jobTitle: 'UI Engineer',
    status: 'offer',
    rounds: [
      { id: 'r3', at: '2025-07-18T14:00:00Z', name: 'Phone Screen', outcome: 'passed' },
      { id: 'r4', at: '2025-07-22T10:00:00Z', name: 'Technical', outcome: 'passed' }
    ]
  },
  { ...baseJob, id: '6', companyName: 'OldCo', jobTitle: 'JS Dev', status: 'rejected' },
  { ...baseJob, id: '7', companyName: 'GhostInc', jobTitle: 'React Dev', status: 'ghosted' }
];

const noop = () => {};

const meta = {
  title: 'JobTracker/KanbanBoard',
  component: KanbanBoard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    jobs: sampleJobs,
    onEdit: noop,
    onDelete: noop,
    onStatusChange: noop,
    onToggleFavorite: noop
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof KanbanBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {};

export const Empty: Story = {
  args: { jobs: [] }
};

export const SingleColumn: Story = {
  args: {
    jobs: sampleJobs.filter((j) => j.status === 'interviewing')
  }
};
