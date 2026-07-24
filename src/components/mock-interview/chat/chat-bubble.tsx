import type { ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message';
import { TypingText } from '@/components/ui/typing-text';

// One message bubble in the mock-interview chat — bot on the left, user on the right.
// Now uses shadcn Message + Bubble components with avatar support.
// Optional typing mode animates bot text character by character.
// Typing only works with string children; JSX content renders immediately.

interface ChatBubbleProps {
  from: 'bot' | 'user';
  children: ReactNode;
  avatar?: string;
  header?: ReactNode;
  footer?: ReactNode;
  typing?: boolean;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export function ChatBubble({
  from,
  children,
  avatar,
  header,
  footer,
  typing = false,
  typingSpeed = 30,
  onTypingComplete
}: ChatBubbleProps) {
  const align = from === 'user' ? 'end' : 'start';
  const variant = from === 'user' ? 'default' : 'muted';
  const initials = avatar || (from === 'user' ? 'U' : 'AI');

  const isStringChild = typeof children === 'string';
  const showTyping = typing && isStringChild;

  return (
    <Message align={align}>
      <MessageAvatar>
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        {header}
        <Bubble variant={variant} align={align}>
          <BubbleContent>
            {showTyping ? <TypingText text={children as string} speed={typingSpeed} onComplete={onTypingComplete} /> : children}
          </BubbleContent>
        </Bubble>
        {footer}
      </MessageContent>
    </Message>
  );
}
