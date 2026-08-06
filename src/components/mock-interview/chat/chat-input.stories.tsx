import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ChatInput } from '@/components/mock-interview/chat/chat-input'

type ChatInputArgs = Omit<React.ComponentProps<typeof ChatInput>, 'value' | 'onChange'>

function ChatInputWrapper(props: ChatInputArgs) {
  const [value, setValue] = useState('')
  return <ChatInput {...props} value={value} onChange={setValue} />
}

const meta = {
  title: 'MockInterview/ChatInput',
  component: ChatInputWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-120">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ChatInputWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: () => {},
    placeholder: 'Type your answer…'
  }
}

export const WithMic: Story = {
  args: {
    onSubmit: () => {},
    placeholder: 'Type or speak your answer…',
    mic: true
  }
}

export const AllowEmpty: Story = {
  args: {
    onSubmit: () => {},
    placeholder: 'Press send with empty input…',
    allowEmpty: true
  }
}

export const NoAutoFocus: Story = {
  args: {
    onSubmit: () => {},
    placeholder: 'Not auto-focused',
    autoFocus: false
  }
}
