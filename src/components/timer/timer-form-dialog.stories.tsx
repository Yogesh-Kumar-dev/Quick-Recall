import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import TimerFormDialog from '@/components/timer/timer-form-dialog'

function TimerFormDialogWrapper(props: React.ComponentProps<typeof TimerFormDialog>) {
  const [open, setOpen] = useState(props.open)
  return <TimerFormDialog {...props} open={open} onOpenChange={setOpen} />
}

const meta = {
  title: 'Timer/TimerFormDialog',
  component: TimerFormDialogWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs']
} satisfies Meta<typeof TimerFormDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    open: true,
    onOpenChange: () => {}
  }
}
