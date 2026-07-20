import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// One message bubble in the mock-interview chat — bot on the left, user on the right.

export function ChatBubble({ from, children }: { from: 'bot' | 'user'; children: ReactNode }) {
  return (
    <div className={cn('flex', from === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
          from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {children}
      </div>
    </div>
  );
}
