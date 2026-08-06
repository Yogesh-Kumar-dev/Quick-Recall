import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChatBubble } from '@/components/mock-interview/chat/chat-bubble'

const meta = {
  title: 'MockInterview/ChatBubble',
  component: ChatBubble,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-120 space-y-4">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ChatBubble>

export default meta
type Story = StoryObj<typeof meta>

export const BotMessage: Story = {
  args: {
    from: 'bot',
    children: 'Tell me about a time you faced a challenging technical problem and how you resolved it.'
  }
}

export const UserMessage: Story = {
  args: {
    from: 'user',
    children: 'In my previous role, we had a memory leak in production that was causing crashes during peak hours. I used Chrome DevTools memory profiler to identify the leak...'
  }
}

export const BotWithAvatar: Story = {
  args: {
    from: 'bot',
    avatar: 'AI',
    children: 'Great answer! Let me follow up on that. How did you communicate the issue to your team lead?'
  }
}

export const UserWithAvatar: Story = {
  args: {
    from: 'user',
    avatar: 'JD',
    children: 'I scheduled a quick sync and walked them through the profiling data.'
  }
}

export const BotTyping: Story = {
  args: {
    from: 'bot',
    children: 'That sounds like a solid approach to problem-solving.',
    typing: true,
    typingSpeed: 40
  }
}

export const WithHeaderAndFooter: Story = {
  args: {
    from: 'bot',
    header: <span className="text-xs font-semibold text-muted-foreground">Technical Question</span>,
    children: 'What is the difference between == and === in JavaScript?',
    footer: <span className="text-xs text-muted-foreground">Category: JavaScript Fundamentals</span>
  }
}
