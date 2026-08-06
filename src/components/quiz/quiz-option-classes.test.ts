import { describe, expect, it } from 'vitest'

import { quizOptionClasses } from './quiz-option-classes'

describe('quizOptionClasses', () => {
  it('returns selected style when not revealed and selected', () => {
    const result = quizOptionClasses({ isSelected: true, isCorrect: false, revealed: false })
    expect(result).toContain('border-primary')
    expect(result).toContain('bg-primary/10')
  })

  it('returns unselected style when not revealed and not selected', () => {
    const result = quizOptionClasses({ isSelected: false, isCorrect: false, revealed: false })
    expect(result).toContain('border-border')
    expect(result).toContain('hover:border-primary/50')
  })

  it('returns correct style when revealed and isCorrect', () => {
    const result = quizOptionClasses({ isSelected: false, isCorrect: true, revealed: true })
    expect(result).toContain('border-green-600')
    expect(result).toContain('bg-green-600/10')
  })

  it('returns correct style even if also selected', () => {
    const result = quizOptionClasses({ isSelected: true, isCorrect: true, revealed: true })
    expect(result).toContain('border-green-600')
  })

  it('returns wrong-selected style when revealed, selected, and not correct', () => {
    const result = quizOptionClasses({ isSelected: true, isCorrect: false, revealed: true })
    expect(result).toContain('border-red-600')
    expect(result).toContain('bg-red-600/10')
  })

  it('returns dimmed style when revealed, not selected, and not correct', () => {
    const result = quizOptionClasses({ isSelected: false, isCorrect: false, revealed: true })
    expect(result).toContain('border-border')
    expect(result).toContain('opacity-60')
  })
})
