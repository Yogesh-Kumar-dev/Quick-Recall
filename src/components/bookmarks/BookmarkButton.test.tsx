import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock Dexie and dependencies before importing the component
vi.mock('@/db', () => ({
  db: { bookmarks: { get: vi.fn() } }
}))

vi.mock('@/db/bookmarks', () => ({
  toggle: vi.fn()
}))

vi.mock('@/db/reviews', () => ({
  enroll: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: vi.fn()
}))

import BookmarkButton from '@/components/bookmarks/BookmarkButton'
import * as bookmarksRepository from '@/db/bookmarks'
import * as reviewsRepository from '@/db/reviews'
import { useLiveQuery } from 'dexie-react-hooks'
import { toast } from 'sonner'

const mockUseLiveQuery = vi.mocked(useLiveQuery)
const mockToggle = vi.mocked(bookmarksRepository.toggle)
const mockEnroll = vi.mocked(reviewsRepository.enroll)
const mockToast = vi.mocked(toast.success)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('BookmarkButton', () => {
  it('renders the bookmark icon', () => {
    mockUseLiveQuery.mockReturnValue(false)
    render(<BookmarkButton kind="note" refId="closures" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows "Save for review" when not bookmarked', () => {
    mockUseLiveQuery.mockReturnValue(false)
    render(<BookmarkButton kind="note" refId="closures" />)
    expect(screen.getByRole('button', { name: /save for review/i })).toBeInTheDocument()
  })

  it('shows "Remove from saved" when bookmarked', () => {
    mockUseLiveQuery.mockReturnValue(true)
    render(<BookmarkButton kind="note" refId="closures" />)
    expect(screen.getByRole('button', { name: /remove from saved/i })).toBeInTheDocument()
  })

  it('sets aria-pressed to true when bookmarked', () => {
    mockUseLiveQuery.mockReturnValue(true)
    render(<BookmarkButton kind="note" refId="closures" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('sets aria-pressed to false when not bookmarked', () => {
    mockUseLiveQuery.mockReturnValue(false)
    render(<BookmarkButton kind="note" refId="closures" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls toggle on click and shows success toast', async () => {
    mockUseLiveQuery.mockReturnValue(false)
    mockToggle.mockResolvedValue(true)
    const user = userEvent.setup()
    render(<BookmarkButton kind="note" refId="closures" />)
    await user.click(screen.getByRole('button'))
    expect(mockToggle).toHaveBeenCalledWith('note', 'closures')
    expect(mockToast).toHaveBeenCalledWith('Saved for review.')
  })

  it('calls enroll when bookmarking a flashcard', async () => {
    mockUseLiveQuery.mockReturnValue(false)
    mockToggle.mockResolvedValue(true)
    mockEnroll.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<BookmarkButton kind="flashcard" refId="fc-1" />)
    await user.click(screen.getByRole('button'))
    expect(mockEnroll).toHaveBeenCalledWith('fc-1')
  })

  it('does not call enroll when un-bookmarking', async () => {
    mockUseLiveQuery.mockReturnValue(true)
    mockToggle.mockResolvedValue(false)
    const user = userEvent.setup()
    render(<BookmarkButton kind="flashcard" refId="fc-1" />)
    await user.click(screen.getByRole('button'))
    expect(mockEnroll).not.toHaveBeenCalled()
  })

  it('shows error toast on failure', async () => {
    mockUseLiveQuery.mockReturnValue(false)
    mockToggle.mockRejectedValue(new Error('fail'))
    const user = userEvent.setup()
    render(<BookmarkButton kind="note" refId="closures" />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Could not update bookmark.')
    })
  })
})
