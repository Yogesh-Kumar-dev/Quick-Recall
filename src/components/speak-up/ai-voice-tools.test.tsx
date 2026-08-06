import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import AiVoiceTools from '@/components/speak-up/ai-voice-tools'

describe('AiVoiceTools', () => {
  it('renders the section heading', () => {
    render(<AiVoiceTools />)
    expect(screen.getByText(/AI voice partner/i)).toBeInTheDocument()
  })

  it('renders all four tool links', () => {
    render(<AiVoiceTools />)
    expect(screen.getByText('ChatGPT Voice')).toBeInTheDocument()
    expect(screen.getByText('Claude Voice')).toBeInTheDocument()
    expect(screen.getByText('Gemini Live')).toBeInTheDocument()
    expect(screen.getByText('NotebookLM Audio')).toBeInTheDocument()
  })

  it('each link opens in a new tab', () => {
    render(<AiVoiceTools />)
    const links = screen.getAllByRole('link')
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('has correct hrefs', () => {
    render(<AiVoiceTools />)
    expect(screen.getByText('ChatGPT Voice').closest('a')).toHaveAttribute('href', 'https://chatgpt.com/features/voice/')
  })
})
