import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TypingIndicator } from '@/components/mock-interview/chat/typing-indicator';

describe('TypingIndicator', () => {
  it('renders three bouncing dots', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });

  it('renders the dots with animation delay classes', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots[0].className).toContain('[animation-delay:-0.3s]');
    expect(dots[1].className).toContain('[animation-delay:-0.15s]');
  });
});
