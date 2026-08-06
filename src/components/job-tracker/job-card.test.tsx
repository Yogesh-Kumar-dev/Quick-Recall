import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import JobCard from '@/components/job-tracker/job-card'
import type { JobApplication } from '@/types/job-tracker'

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}))

const baseJob: JobApplication = {
  id: '1',
  companyName: 'Acme Corp',
  jobTitle: 'Senior Frontend Engineer',
  status: 'applied',
  location: 'San Francisco, CA',
  workMode: 'hybrid',
  source: 'linkedin',
  appliedAt: '2025-07-15T10:00:00Z',
  favorite: false,
  rounds: [],
  contacts: [],
  documents: [],
  notes: [],
  createdAt: Date.now(),
  updatedAt: Date.now()
}

const noop = () => {}

describe('JobCard', () => {
  it('renders company name and job title', () => {
    render(<JobCard job={baseJob} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<JobCard job={baseJob} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByText('Applied', { selector: 'div' })).toBeInTheDocument()
  })

  it('renders location badge', () => {
    render(<JobCard job={baseJob} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
  })

  it('renders work mode', () => {
    render(<JobCard job={baseJob} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByText('Hybrid')).toBeInTheDocument()
  })

  it('calls onToggleFavorite when star is clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<JobCard job={baseJob} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={handleToggle} />)
    await user.click(screen.getByRole('button', { name: /star/i }))
    expect(handleToggle).toHaveBeenCalledWith(baseJob)
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    render(<JobCard job={baseJob} onEdit={handleEdit} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    await user.click(screen.getByRole('button', { name: /edit job/i }))
    expect(handleEdit).toHaveBeenCalledWith(baseJob)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()
    render(<JobCard job={baseJob} onEdit={noop} onDelete={handleDelete} onStatusChange={noop} onToggleFavorite={noop} />)
    await user.click(screen.getByRole('button', { name: /delete job/i }))
    expect(handleDelete).toHaveBeenCalledWith(baseJob)
  })

  it('renders salary when provided', () => {
    const job = { ...baseJob, salaryMin: 150000, salaryMax: 200000, salaryCurrency: 'USD' }
    render(<JobCard job={job} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByText(/USD/)).toBeInTheDocument()
  })

  it('renders contacts when provided', () => {
    const job = {
      ...baseJob,
      contacts: [{ id: 'c1', name: 'Jane Smith', role: 'Recruiter', email: 'jane@acme.com' }]
    }
    render(<JobCard job={job} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument()
    expect(screen.getByText(/Recruiter/)).toBeInTheDocument()
  })

  it('renders interview rounds', () => {
    const job = {
      ...baseJob,
      status: 'interviewing' as const,
      rounds: [
        { id: 'r1', at: new Date(Date.now() + 86400000).toISOString(), name: 'Phone Screen', outcome: 'passed' as const },
        { id: 'r2', at: new Date(Date.now() + 172800000).toISOString(), name: 'Technical', outcome: 'pending' as const }
      ]
    }
    render(<JobCard job={job} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByText('Phone Screen')).toBeInTheDocument()
    expect(screen.getByText('Technical')).toBeInTheDocument()
  })

  it('shows favorite star filled when favorite is true', () => {
    const job = { ...baseJob, favorite: true }
    render(<JobCard job={job} onEdit={noop} onDelete={noop} onStatusChange={noop} onToggleFavorite={noop} />)
    expect(screen.getByRole('button', { name: /unstar/i })).toBeInTheDocument()
  })
})
