import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ArrowRight, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button'
  }
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}

export const IconButtons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon" aria-label="Copy">
        <Copy />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Copy">
        <Copy />
      </Button>
      <Button size="icon-lg" variant="secondary" aria-label="Copy">
        <Copy />
      </Button>
    </div>
  )
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-icon="inline-end">
        Continue
        <ArrowRight />
      </Button>
      <Button variant="destructive" data-icon="inline-start">
        <Trash2 />
        Delete
      </Button>
    </div>
  )
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true
  }
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive'
  }
}
