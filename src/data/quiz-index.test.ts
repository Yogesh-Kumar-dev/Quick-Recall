import { describe, expect, it } from 'vitest';

import { quizKey } from './quiz-index';

describe('quizKey', () => {
  it('returns source:questionId format', () => {
    expect(quizKey('js', 'hoisting')).toBe('js:hoisting');
  });

  it('handles source with special characters', () => {
    expect(quizKey('react', 'hooks-basics')).toBe('react:hooks-basics');
  });

  it('handles empty questionId', () => {
    expect(quizKey('js', '')).toBe('js:');
  });
});
