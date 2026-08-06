import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent } from 'storybook/test'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select defaultValue="react">
      <SelectTrigger aria-label="Pick a topic">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="js">JavaScript</SelectItem>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="nextjs">Next.js</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: /pick a topic/i }))
    await expect(await screen.findByRole('listbox')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('option', { name: /next\.js/i }))
    await expect(screen.getByRole('combobox', { name: /pick a topic/i })).toHaveTextContent('nextjs')
  }
}

export const WithPlaceholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger aria-label="Pick a topic">
        <SelectValue placeholder="Pick a topic" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="js">JavaScript</SelectItem>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="nextjs">Next.js</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const Groups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-44" aria-label="Choose a database">
        <SelectValue placeholder="Choose a database" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Relational</SelectLabel>
          <SelectItem value="postgres">PostgreSQL</SelectItem>
          <SelectItem value="mysql">MySQL</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Document</SelectLabel>
          <SelectItem value="mongo">MongoDB</SelectItem>
          <SelectItem value="dynamo">DynamoDB</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="react" disabled>
      <SelectTrigger aria-label="Pick a topic">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const DisabledItem: Story = {
  render: () => (
    <Select defaultValue="js">
      <SelectTrigger aria-label="Pick a topic">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="js">JavaScript</SelectItem>
        <SelectItem value="react" disabled>
          React (coming soon)
        </SelectItem>
        <SelectItem value="nextjs">Next.js</SelectItem>
      </SelectContent>
    </Select>
  )
}
