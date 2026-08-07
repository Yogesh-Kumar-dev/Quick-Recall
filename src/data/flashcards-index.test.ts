import { describe, expect, it } from 'vitest';

import { flashcardKey } from './flashcards-index';

describe('flashcardKey', () => {
  it('returns source:cardId format', () => {
    expect(flashcardKey('js', 'closures')).toBe('js:closures');
  });

  it('handles source with special characters', () => {
    expect(flashcardKey('react', 'use-state')).toBe('react:use-state');
  });

  it('handles empty cardId', () => {
    expect(flashcardKey('js', '')).toBe('js:');
  });
});
