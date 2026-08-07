import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ChatInput } from '@/components/mock-interview/chat/chat-input';

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />
}));

describe('ChatInput', () => {
  it('renders with placeholder', () => {
    render(<ChatInput value="" onChange={() => {}} onSubmit={() => {}} placeholder="Type answer…" />);
    expect(screen.getByPlaceholderText('Type answer…')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ChatInput value="" onChange={handleChange} onSubmit={() => {}} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it('calls onSubmit when Enter is pressed', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ChatInput value="my answer" onChange={() => {}} onSubmit={handleSubmit} />);
    await user.type(screen.getByRole('textbox'), '{Enter}');
    expect(handleSubmit).toHaveBeenCalledWith('my answer');
  });

  it('does not submit empty value when allowEmpty is false', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ChatInput value="" onChange={() => {}} onSubmit={handleSubmit} allowEmpty={false} />);
    await user.type(screen.getByRole('textbox'), '{Enter}');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits empty value when allowEmpty is true', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ChatInput value="" onChange={() => {}} onSubmit={handleSubmit} allowEmpty={true} />);
    await user.type(screen.getByRole('textbox'), '{Enter}');
    expect(handleSubmit).toHaveBeenCalledWith('');
  });

  it('disables send button when value is empty and allowEmpty is false', () => {
    render(<ChatInput value="" onChange={() => {}} onSubmit={() => {}} allowEmpty={false} />);
    const buttons = screen.getAllByRole('button');
    const sendButton = buttons[buttons.length - 1];
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when value is not empty', () => {
    render(<ChatInput value="hello" onChange={() => {}} onSubmit={() => {}} />);
    const buttons = screen.getAllByRole('button');
    const sendButton = buttons[buttons.length - 1];
    expect(sendButton).toBeEnabled();
  });
});
