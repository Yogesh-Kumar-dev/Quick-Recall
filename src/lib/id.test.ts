import { describe, expect, it } from 'vitest'

import { makeId } from './id'

describe('makeId', () => {
  it('returns a string', () => {
    expect(typeof makeId()).toBe('string')
  })

  it('returns different values on successive calls', () => {
    const a = makeId()
    const b = makeId()
    expect(a).not.toBe(b)
  })

  it('returns a UUID-formatted string when crypto.randomUUID is available', () => {
    const id = makeId()
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
})
