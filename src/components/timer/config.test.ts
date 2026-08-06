import { describe, expect, it } from 'vitest'

import { formatClock, purposeIcon } from './config'
import { BookOpen, Clock, Code, Coffee, Users } from 'lucide-react'

describe('formatClock', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatClock(0)).toBe('00:00')
  })

  it('formats seconds under a minute', () => {
    expect(formatClock(45)).toBe('00:45')
  })

  it('formats exact minutes', () => {
    expect(formatClock(60)).toBe('01:00')
    expect(formatClock(120)).toBe('02:00')
  })

  it('formats minutes and seconds', () => {
    expect(formatClock(90)).toBe('01:30')
    expect(formatClock(1539)).toBe('25:39')
  })

  it('clamps negative values to 00:00', () => {
    expect(formatClock(-10)).toBe('00:00')
    expect(formatClock(-1)).toBe('00:00')
  })

  it('truncates fractional seconds', () => {
    expect(formatClock(65.9)).toBe('01:05')
  })

  it('handles large values', () => {
    expect(formatClock(3600)).toBe('60:00')
    expect(formatClock(3661)).toBe('61:01')
  })
})

describe('purposeIcon', () => {
  it('returns Code for "Problem solve"', () => {
    expect(purposeIcon('Problem solve')).toBe(Code)
  })

  it('returns Users for "Mock interview"', () => {
    expect(purposeIcon('Mock interview')).toBe(Users)
  })

  it('returns BookOpen for "Reading"', () => {
    expect(purposeIcon('Reading')).toBe(BookOpen)
  })

  it('returns Coffee for "Break"', () => {
    expect(purposeIcon('Break')).toBe(Coffee)
  })

  it('is case-insensitive', () => {
    expect(purposeIcon('problem solve')).toBe(Code)
    expect(purposeIcon('MOCK INTERVIEW')).toBe(Users)
  })

  it('trims whitespace', () => {
    expect(purposeIcon('  Reading  ')).toBe(BookOpen)
  })

  it('returns Clock for unrecognized purpose', () => {
    expect(purposeIcon('something else')).toBe(Clock)
    expect(purposeIcon('')).toBe(Clock)
  })
})
