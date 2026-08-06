import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import BookmarkButton from '@/components/bookmarks/BookmarkButton'

const meta = {
  title: 'Bookmarks/BookmarkButton',
  component: BookmarkButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    kind: 'note',
    refId: 'closures'
  }
} satisfies Meta<typeof BookmarkButton>

export default meta
type Story = StoryObj<typeof meta>

export const NoteBookmark: Story = {
  args: { kind: 'note', refId: 'closures' }
}

export const FlashcardBookmark: Story = {
  args: { kind: 'flashcard', refId: 'fc-1' }
}

export const ProblemBookmark: Story = {
  args: { kind: 'problem', refId: 'two-sum' }
}

export const WithStopPropagation: Story = {
  args: { kind: 'note', refId: 'closures', stopPropagation: true }
}
