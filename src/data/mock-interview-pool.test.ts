import { describe, expect, it } from 'vitest';

import { generateQuestions } from './mock-interview-pool';

describe('generateQuestions', () => {
  it('returns an empty array when no topics match', () => {
    const result = generateQuestions({
      topics: ['nonexistent-topic'],
      includeKinds: ['note'],
      questionCount: 5
    });
    expect(result).toEqual([]);
  });

  it('returns the requested number of questions', () => {
    const result = generateQuestions({
      topics: ['JavaScript'],
      includeKinds: ['note', 'flashcard'],
      questionCount: 3
    });
    expect(result.length).toBe(3);
  });

  it('returns questions with reflection field set to empty string', () => {
    const result = generateQuestions({
      topics: ['JavaScript'],
      includeKinds: ['note'],
      questionCount: 2
    });
    for (const q of result) {
      expect(q).toHaveProperty('reflection', '');
    }
  });

  it('guarantees at least one question per selected kind when available', () => {
    const result = generateQuestions({
      topics: ['JavaScript'],
      includeKinds: ['note', 'flashcard'],
      questionCount: 4
    });
    const kinds = result.map((q) => q.kind);
    expect(kinds).toContain('note');
    expect(kinds).toContain('flashcard');
  });

  it('requests more than available gracefully', () => {
    const result = generateQuestions({
      topics: ['JavaScript'],
      includeKinds: ['note'],
      questionCount: 999
    });
    // Should return whatever is available, not crash
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(999);
  });

  it('returns empty for empty topics', () => {
    const result = generateQuestions({
      topics: [],
      includeKinds: ['note'],
      questionCount: 5
    });
    expect(result).toEqual([]);
  });
});
