import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TypingIndicator } from '@/components/mock-interview/chat/typing-indicator'

const meta = {
  title: 'MockInterview/TypingIndicator',
  component: TypingIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80 rounded-lg border bg-card p-4">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof TypingIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
