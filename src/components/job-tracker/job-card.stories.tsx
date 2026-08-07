import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import JobCard from '@/components/job-tracker/job-card';
import type { JobApplication } from '@/types/job-tracker';

const baseJob: JobApplication = {
  id: '1',
  companyName: 'Acme Corp',
  jobTitle: 'Senior Frontend Engineer',
  status: 'applied',
  location: 'San Francisco, CA',
  workMode: 'hybrid',
  source: 'linkedin',
  sourceUrl: 'https://linkedin.com/jobs/123',
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

const meta = {
  title: 'JobTracker/JobCard',
  component: JobCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onEdit: () => {},
    onDelete: () => {},
    onStatusChange: () => {},
    onToggleFavorite: () => {}
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof JobCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Applied: Story = {
  args: { job: baseJob }
};

export const Interviewing: Story = {
  args: {
    job: {
      ...baseJob,
      status: 'interviewing',
      rounds: [
        { id: 'r1', at: '2025-07-20T14:00:00Z', name: 'Phone Screen', outcome: 'passed' },
        { id: 'r2', at: '2025-07-25T10:00:00Z', name: 'Technical', outcome: 'pending' }
      ]
    }
  }
};

export const WithContacts: Story = {
  args: {
    job: {
      ...baseJob,
      status: 'interviewing',
      contacts: [
        { id: 'c1', name: 'Jane Smith', role: 'Recruiter', email: 'jane@acme.com', phone: '+1-555-0123' },
        { id: 'c2', name: 'Bob Jones', role: 'Hiring Manager', email: 'bob@acme.com' }
      ]
    }
  }
};

export const Offer: Story = {
  args: {
    job: {
      ...baseJob,
      status: 'offer',
      favorite: true,
      rounds: [
        { id: 'r1', at: '2025-07-20T14:00:00Z', name: 'Phone Screen', outcome: 'passed' },
        { id: 'r2', at: '2025-07-25T10:00:00Z', name: 'Technical', outcome: 'passed' },
        { id: 'r3', at: '2025-07-28T15:00:00Z', name: 'HR', outcome: 'passed' }
      ]
    }
  }
};

export const Rejected: Story = {
  args: {
    job: {
      ...baseJob,
      status: 'rejected',
      rounds: [
        { id: 'r1', at: '2025-07-20T14:00:00Z', name: 'Phone Screen', outcome: 'passed' },
        { id: 'r2', at: '2025-07-25T10:00:00Z', name: 'Technical', outcome: 'failed' }
      ]
    }
  }
};

export const Ghosted: Story = {
  args: {
    job: {
      ...baseJob,
      status: 'ghosted',
      appliedAt: '2025-06-01T10:00:00Z'
    }
  }
};

export const Favorite: Story = {
  args: {
    job: { ...baseJob, favorite: true }
  }
};

export const WithDocuments: Story = {
  args: {
    job: {
      ...baseJob,
      documents: [
        { id: 'd1', label: 'Resume v3', url: 'https://example.com/resume.pdf' },
        { id: 'd2', label: 'Cover Letter', url: 'https://example.com/cover.pdf' }
      ]
    }
  }
};
