import { describe, expect, it } from 'vitest'

import { resolveArticleRefs } from './articles-index'

describe('resolveArticleRefs', () => {
  it('returns empty array for undefined input', () => {
    expect(resolveArticleRefs(undefined)).toEqual([])
  })

  it('returns empty array for empty array', () => {
    expect(resolveArticleRefs([])).toEqual([])
  })

  it('resolves valid article ids', () => {
    const result = resolveArticleRefs(['pwa-introduction'])
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('pwa-introduction')
    expect(result[0].title).toBeDefined()
    expect(result[0].url).toBe('/articles/pwa-introduction')
  })

  it('silently drops unknown ids', () => {
    expect(resolveArticleRefs(['nonexistent-article'])).toEqual([])
  })

  it('mixes valid and invalid ids', () => {
    const result = resolveArticleRefs(['pwa-introduction', 'nonexistent'])
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('pwa-introduction')
  })
})
