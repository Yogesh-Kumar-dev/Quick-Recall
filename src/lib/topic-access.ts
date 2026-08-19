// ==============================|| TOPIC ACCESS - PATH & SURFACE MAPPING ||============================== //

// Central topic->surface mapping so every gate reads one source of truth:
//   - nav.ts item URLs (tagged with `topic`) cover all note / machine-coding / quick-recall pages
//   - FLASHCARD_SETS / QUIZ_SETS slugs cover the hub section routes (/flashcards/<slug>, /quiz/<slug>)
//   - MOCK_INTERVIEW_TOPICS labels are mapped here too (without importing the heavy problem pool)
// A path can resolve to several topics (e.g. the combined HTML & CSS quiz); it is gated if ANY
// member topic is disabled.

import { navSections } from '@/config/nav';
import type { Topic } from '@/config/topics';
import type { TopicPreferences } from '@/types/topic-preferences';

// ─── Pure preference helpers ───────────────────────────────────────────────────────────────────

export function isTopicEnabled(topic: Topic, prefs?: TopicPreferences): boolean {
  return prefs ? prefs[topic] !== false : true;
}

export function topicsEnabled(topics: Topic[], prefs?: TopicPreferences): boolean {
  return topics.every((t) => isTopicEnabled(t, prefs));
}

// ─── Nav-derived prefixes (longest match wins) ────────────────────────────────────────────────

const NAV_PATH_TOPICS = new Map<string, Topic[]>();
for (const section of navSections) {
  for (const item of section.items) {
    if (item.topic) NAV_PATH_TOPICS.set(item.url, [item.topic]);
  }
}

// ─── Flashcard / quiz section slugs ────────────────────────────────────────────────────────────

export const flashcardSlugTopics: Record<string, Topic[]> = {
  js: ['javascript'],
  typescript: ['typescript'],
  react: ['react'],
  nextjs: ['nextjs'],
  'nextjs-rendering': ['nextjs'],
  nodejs: ['nodejs'],
  html: ['html'],
  css: ['css'],
  engineering: ['engineering'],
  redux: ['redux'],
  'redux-toolkit': ['redux'],
  'rtk-query': ['redux'],
  'async-thunk': ['redux']
};

export const quizSlugTopics: Record<string, Topic[]> = {
  js: ['javascript'],
  typescript: ['typescript'],
  react: ['react'],
  nextjs: ['nextjs'],
  redux: ['redux'],
  htmlcss: ['html', 'css'],
  nodejs: ['nodejs'],
  engineering: ['engineering'],
  databases: ['postgresql', 'mongodb', 'redis', 'dynamodb'],
  testing: ['testing'],
  web: ['web']
};

export function topicForPathname(pathname: string): Topic[] | undefined {
  const flashcard = /^\/flashcards\/([^/]+)/.exec(pathname);
  if (flashcard) return flashcardSlugTopics[flashcard[1]];
  const quiz = /^\/quiz\/([^/]+)/.exec(pathname);
  if (quiz) return quizSlugTopics[quiz[1]];

  let best: Topic[] | undefined;
  let bestLen = -1;
  for (const [url, topics] of NAV_PATH_TOPICS) {
    if ((pathname === url || pathname.startsWith(`${url}/`)) && url.length > bestLen) {
      best = topics;
      bestLen = url.length;
    }
  }
  return best;
}

// ─── Mock Interview labels (stable labels from MOCK_INTERVIEW_TOPICS) ─────────────────────────

const MOCK_INTERVIEW_LABEL_TOPICS: { label: string; topics: Topic[] }[] = [
  { label: 'JavaScript', topics: ['javascript'] },
  { label: 'TypeScript', topics: ['typescript'] },
  { label: 'React', topics: ['react'] },
  { label: 'Redux', topics: ['redux'] },
  { label: 'Next.js', topics: ['nextjs'] },
  { label: 'Node.js', topics: ['nodejs'] },
  { label: 'Databases', topics: ['postgresql', 'mongodb', 'redis', 'dynamodb'] },
  { label: 'Testing', topics: ['testing'] },
  { label: 'HTML & CSS', topics: ['html', 'css'] },
  { label: 'Web Platform', topics: ['web'] },
  { label: 'Engineering', topics: ['engineering'] }
];

export function mockInterviewTopicEnabled(label: string, prefs?: TopicPreferences): boolean {
  const entry = MOCK_INTERVIEW_LABEL_TOPICS.find((m) => m.label === label);
  return entry ? topicsEnabled(entry.topics, prefs) : true;
}
