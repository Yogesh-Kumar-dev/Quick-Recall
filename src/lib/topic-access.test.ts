import { describe, expect, it } from 'vitest';
import { navSections } from '@/config/nav';
import { DEFAULT_TOPIC_PREFERENCES } from '@/config/topics';
import { FLASHCARD_SETS } from '@/data/flashcard-sets';
import { QUIZ_SETS } from '@/data/quiz-sets';
import { isTopicEnabled, mockInterviewTopicEnabled, topicForPathname, topicsEnabled } from './topic-access';

describe('topicForPathname', () => {
  it('maps every tagged nav item url back to its topic', () => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (!item.topic) continue;
        expect(topicForPathname(item.url)).toContain(item.topic);
        expect(topicForPathname(`${item.url}/`)).toContain(item.topic);
      }
    }
  });

  it('covers deeper topic routes via prefix matching', () => {
    expect(topicForPathname('/js/machine-coding/debounce')).toEqual(['javascript']);
    expect(topicForPathname('/react/machine-coding/accordion')).toEqual(['react']);
  });

  it('maps every flashcard set slug to a topic', () => {
    for (const slug of Object.keys(FLASHCARD_SETS)) {
      expect(topicForPathname(`/flashcards/${slug}`)).toBeDefined();
    }
  });

  it('maps every quiz set slug to a topic', () => {
    for (const slug of Object.keys(QUIZ_SETS)) {
      expect(topicForPathname(`/quiz/${slug}`)).toBeDefined();
    }
  });

  it('returns undefined for hub and feature routes', () => {
    for (const path of ['/', '/dashboard', '/settings', '/bookmarks', '/review', '/flashcards', '/quiz', '/articles', '/about']) {
      expect(topicForPathname(path)).toBeUndefined();
    }
  });
});

describe('preference helpers', () => {
  const allOff = Object.fromEntries(Object.keys(DEFAULT_TOPIC_PREFERENCES).map((t) => [t, false]));

  it('treats undefined prefs as everything enabled', () => {
    expect(isTopicEnabled('react', undefined)).toBe(true);
    expect(topicsEnabled(['react', 'redux'], undefined)).toBe(true);
  });

  it('gates a multi-topic path when any member is disabled', () => {
    expect(topicsEnabled(['html', 'css'], { ...DEFAULT_TOPIC_PREFERENCES, html: false })).toBe(false);
    expect(topicsEnabled(['html', 'css'], DEFAULT_TOPIC_PREFERENCES)).toBe(true);
  });

  it('filters mock interview labels by their member topics', () => {
    expect(mockInterviewTopicEnabled('React', DEFAULT_TOPIC_PREFERENCES)).toBe(true);
    expect(mockInterviewTopicEnabled('React', { ...DEFAULT_TOPIC_PREFERENCES, react: false })).toBe(false);
    // combined labels gate on any member
    expect(mockInterviewTopicEnabled('HTML & CSS', { ...DEFAULT_TOPIC_PREFERENCES, css: false })).toBe(false);
    expect(mockInterviewTopicEnabled('Databases', { ...DEFAULT_TOPIC_PREFERENCES, redis: false })).toBe(false);
    expect(mockInterviewTopicEnabled('Unknown label', allOff as typeof DEFAULT_TOPIC_PREFERENCES)).toBe(true);
  });
});
