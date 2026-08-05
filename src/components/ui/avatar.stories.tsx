import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '@/components/ui/avatar'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>YS</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: 'default'
  }
}

export const WithImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
      <AvatarFallback>VC</AvatarFallback>
    </Avatar>
  )
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>DF</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  )
}

export const WithBadge: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
      <AvatarFallback>VC</AvatarFallback>
      <AvatarBadge>
        <svg viewBox="0 0 10 10" className="size-full" aria-hidden="true">
          <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
      </AvatarBadge>
    </Avatar>
  ),
  args: {
    size: 'lg'
  }
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/facebook.png" alt="Meta" />
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/google.png" alt="Google" />
        <AvatarFallback>GO</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  )
}
