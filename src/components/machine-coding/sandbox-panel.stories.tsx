import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SandboxPanel from '@/components/machine-coding/sandbox-panel';

const meta = {
  title: 'MachineCoding/SandboxPanel',
  component: SandboxPanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof SandboxPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JsProblem: Story = {
  args: {
    problemTitle: 'Two Sum',
    kind: 'js'
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    )
  ]
};

export const ReactProblem: Story = {
  args: {
    problemTitle: 'Toggle Switch',
    kind: 'react'
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    )
  ]
};
