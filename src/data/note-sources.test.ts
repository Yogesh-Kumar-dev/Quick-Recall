import { describe, expect, it } from 'vitest'

import type { Note } from '@/types/content'
import { resolvePrerequisites } from './note-sources'

describe('resolvePrerequisites', () => {
  it('returns empty array when prerequisites is undefined', () => {
    const note = { id: 'test', title: 'Test', summary: 'x', keyPoints: [], difficulty: 'basic', category: 'core' } as Note
    expect(resolvePrerequisites(note)).toEqual([])
  })

  it('returns empty array when prerequisites is empty', () => {
    const note = { id: 'test', title: 'Test', summary: 'x', keyPoints: [], difficulty: 'basic', category: 'core', prerequisites: [] } as Note
    expect(resolvePrerequisites(note)).toEqual([])
  })

  it('resolves valid prerequisite ids to NoteLink objects', () => {
    const note = { id: 'test', title: 'Test', summary: 'x', keyPoints: [], difficulty: 'basic', category: 'core', prerequisites: ['use-effect'] } as Note
    const result = resolvePrerequisites(note)
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('use-effect')
    expect(result[0].title).toBeDefined()
    expect(result[0].url).toContain('open=use-effect')
  })

  it('silently drops unknown prerequisite ids', () => {
    const note = { id: 'test', title: 'Test', summary: 'x', keyPoints: [], difficulty: 'basic', category: 'core', prerequisites: ['nonexistent-id-xyz'] } as Note
    expect(resolvePrerequisites(note)).toEqual([])
  })

  it('mixes valid and invalid ids', () => {
    const note = { id: 'test', title: 'Test', summary: 'x', keyPoints: [], difficulty: 'basic', category: 'core', prerequisites: ['use-effect', 'nonexistent'] } as Note
    const result = resolvePrerequisites(note)
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('use-effect')
  })
})
