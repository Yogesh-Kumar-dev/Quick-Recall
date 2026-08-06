import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChipFilter } from '@/components/job-tracker/chip-filter'

const meta = {
  title: 'JobTracker/ChipFilter',
  component: ChipFilter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onClick: () => {}
  }
} satisfies Meta<typeof ChipFilter>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {
  args: {
    active: false,
    label: 'Applied',
    count: 12
  }
}

export const Active: Story = {
  args: {
    active: true,
    label: 'Applied',
    count: 12
  }
}

export const WithoutCount: Story = {
  args: {
    active: false,
    label: 'All'
  }
}

export const ActiveWithoutCount: Story = {
  args: {
    active: true,
    label: 'All'
  }
}

export const CustomColor: Story = {
  args: {
    active: false,
    label: 'Remote',
    colorClass: 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
  }
}
