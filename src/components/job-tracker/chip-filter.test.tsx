import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ChipFilter } from '@/components/job-tracker/chip-filter';

describe('ChipFilter', () => {
  it('renders the label', () => {
    render(<ChipFilter active={false} label="Applied" onClick={() => {}} />);
    expect(screen.getByText('Applied')).toBeInTheDocument();
  });

  it('renders count when provided', () => {
    render(<ChipFilter active={false} count={5} label="Applied" onClick={() => {}} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ChipFilter active={false} label="Applied" onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: /applied/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies active styles when active', () => {
    render(<ChipFilter active={true} label="Applied" onClick={() => {}} />);
    const button = screen.getByRole('button', { name: /applied/i });
    expect(button.className).toContain('bg-primary');
  });

  it('does not apply active styles when inactive', () => {
    render(<ChipFilter active={false} label="Applied" onClick={() => {}} />);
    const button = screen.getByRole('button', { name: /applied/i });
    expect(button.className).not.toContain('bg-primary');
  });
});
