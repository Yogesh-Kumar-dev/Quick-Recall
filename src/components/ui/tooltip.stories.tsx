import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole('button', { name: /hover me/i }))
    await expect(await screen.findByText('Tooltip content')).toBeInTheDocument()
    await userEvent.unhover(canvas.getByRole('button', { name: /hover me/i }))
    await waitFor(() => expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument())
  }
}

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-16 p-10">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline">{side}</Button>} />
            <TooltipContent side={side}>Slides out on {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export const WithShortcut: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Toggle sidebar</Button>} />
        <TooltipContent>
          Toggle sidebar
          <kbd className="ml-2 rounded border border-current/20 bg-black/20 px-1.5 text-[10px] tracking-wide">
            Ctrl+B
          </kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
