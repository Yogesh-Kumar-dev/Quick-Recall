// ==============================|| MOCK INTERVIEW — QUESTION POOL ||============================== //

// Coarse topic groupings (a handful, not NOTE_SOURCES' 18 per-page topics) built by merging the
// existing NOTE_SOURCES/FLASHCARD_SETS aggregators — no re-importing individual content files, so
// a new note/flashcard file registered there is automatically eligible here too. Machine-coding
// problems have no equivalent aggregator (search-index.ts imports them directly the same way), so
// those two arrays are imported as-is.

import type { BaseProblemEntry } from '@/types/content';
import type { MockInterviewInput, MockInterviewQuestion, MockInterviewQuestionKind } from '@/types/mock-interview';
import { shuffle } from '@/lib/utils';
import { flashcardKey } from './flashcards-index';
import { NOTE_SOURCES } from './note-sources';
import { FLASHCARD_SETS } from './flashcard-sets';
import { jsProblems } from './javascript/js-problems';
import { reactMcProblems } from './react/react-mc-problems';

export interface MockInterviewTopic {
  label: string;
  noteTopics: string[]; // NOTE_SOURCES `topic` labels merged under this coarse label
  flashcardSlugs: string[]; // FLASHCARD_SETS keys merged under this coarse label
  problems: BaseProblemEntry[]; // resolveContent() derives each problem's viewer URL, no need to carry it here
}

export const MOCK_INTERVIEW_TOPICS: MockInterviewTopic[] = [
  { label: 'JavaScript', noteTopics: ['JavaScript'], flashcardSlugs: ['js'], problems: jsProblems },
  { label: 'TypeScript', noteTopics: ['TypeScript', 'TS for React'], flashcardSlugs: ['typescript'], problems: [] },
  { label: 'React', noteTopics: ['React'], flashcardSlugs: ['react'], problems: reactMcProblems },
  {
    label: 'Redux',
    noteTopics: ['Redux', 'Redux Toolkit', 'RTK Query', 'createAsyncThunk'],
    flashcardSlugs: ['redux', 'redux-toolkit', 'rtk-query', 'async-thunk'],
    problems: []
  },
  { label: 'Next.js', noteTopics: ['Next.js', 'Next.js Rendering'], flashcardSlugs: ['nextjs', 'nextjs-rendering'], problems: [] },
  { label: 'Node.js', noteTopics: ['Node.js'], flashcardSlugs: ['nodejs'], problems: [] },
  { label: 'HTML & CSS', noteTopics: ['HTML', 'CSS'], flashcardSlugs: ['html', 'css'], problems: [] },
  {
    label: 'Web Platform',
    noteTopics: ['Web Security', 'Auth & Identity', 'Accessibility', 'Web Performance'],
    flashcardSlugs: [],
    problems: []
  },
  { label: 'Engineering', noteTopics: ['Engineering'], flashcardSlugs: ['engineering'], problems: [] }
];

type Candidate = Pick<MockInterviewQuestion, 'kind' | 'refId'>;

function candidatesForTopic(topic: MockInterviewTopic, includeKinds: MockInterviewInput['includeKinds']): Candidate[] {
  const candidates: Candidate[] = [];

  if (includeKinds.includes('note')) {
    for (const source of NOTE_SOURCES) {
      if (!topic.noteTopics.includes(source.topic)) continue;
      candidates.push(...source.notes.map((n) => ({ kind: 'note' as const, refId: n.id })));
    }
  }
  if (includeKinds.includes('flashcard')) {
    for (const slug of topic.flashcardSlugs) {
      const set = FLASHCARD_SETS[slug];
      candidates.push(...set.cards.map((c) => ({ kind: 'flashcard' as const, refId: flashcardKey(set.source, c.id) })));
    }
  }
  if (includeKinds.includes('problem')) {
    candidates.push(...topic.problems.map((p) => ({ kind: 'problem' as const, refId: p.slug })));
  }

  return candidates;
}

// Builds the fixed question set for a new interview: pool every candidate matching the selected
// topics/kinds, reserve one per selected kind (when available) so a smaller pool like machine-coding
// problems doesn't get crowded out by the much larger note/flashcard pools, then fill the rest
// randomly and shuffle the final order.
export function generateQuestions(input: Pick<MockInterviewInput, 'topics' | 'includeKinds' | 'questionCount'>): MockInterviewQuestion[] {
  const topics = MOCK_INTERVIEW_TOPICS.filter((t) => input.topics.includes(t.label));
  const candidates = topics.flatMap((topic) => candidatesForTopic(topic, input.includeKinds));

  const byKind = new Map<MockInterviewQuestionKind, Candidate[]>();
  for (const candidate of candidates) {
    const pool = byKind.get(candidate.kind);
    if (pool) pool.push(candidate);
    else byKind.set(candidate.kind, [candidate]);
  }

  const guaranteed: Candidate[] = [];
  for (const kind of shuffle(input.includeKinds)) {
    if (guaranteed.length >= input.questionCount) break;
    const pool = byKind.get(kind);
    if (!pool || pool.length === 0) continue;
    guaranteed.push(shuffle(pool)[0]);
  }

  const guaranteedKeys = new Set(guaranteed.map((c) => `${c.kind}:${c.refId}`));
  const remaining = candidates.filter((c) => !guaranteedKeys.has(`${c.kind}:${c.refId}`));
  const fill = shuffle(remaining).slice(0, input.questionCount - guaranteed.length);

  return shuffle([...guaranteed, ...fill]).map((c) => ({ ...c, reflection: '' }));
}
