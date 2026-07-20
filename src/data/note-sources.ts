// Every topic's notes array, paired with the page that renders it. Resolves each note-id to a
// single page-URL (multiple topics may share one url, e.g. the merged Testing pages below — that's
// fine, since resolution keys off note.id, not topic), consumed by search-index.ts (deep-linking
// search results) and by NotesView (resolving a note's `prerequisites` ids into "Builds on" chips).
import type { Note } from '@/types/content';
import { jsNotes } from './javascript/js-notes';
import { tsNotes } from './javascript/ts-notes';
import { tsReactNotes } from './javascript/ts-react';
import { reactNotes } from './react/react-notes';
import { nextjsNotes } from './nextjs/nextjs-notes';
import { nextjsRenderingNotes } from './nextjs/nextjs-rendering';
import { reduxNotes } from './redux/redux-notes';
import { reduxToolkitNotes } from './redux/redux-toolkit-notes';
import { rtkQueryNotes } from './redux/rtk-query-notes';
import { asyncThunkNotes } from './redux/async-thunk-notes';
import { htmlNotes } from './htmlcss/html-notes';
import { cssNotes } from './htmlcss/css-notes';
import { engineeringNotes } from './engineering/engineering-notes';
import { nodejsNotes } from './nodejs/nodejs-notes';
import { awsNotes } from './aws/aws-notes';
import { postgresqlNotes } from './databases/postgresql-notes';
import { mongodbNotes } from './databases/mongodb-notes';
import { redisNotes } from './databases/redis-notes';
import { dynamodbNotes } from './databases/dynamodb-notes';
import { testingFundamentalsNotes } from './testing/testing-fundamentals-notes';
import { vitestNotes } from './testing/vitest-notes';
import { rtlNotes } from './testing/rtl-notes';
import { jestNotes } from './testing/jest-notes';
import { mswNotes } from './testing/msw-notes';
import { supertestNotes } from './testing/supertest-notes';
import { playwrightNotes } from './testing/playwright-notes';
import { etlTestingNotes } from './testing/etl-testing-notes';
import { pentestNotes } from './testing/pentest-notes';
import { mobileTestingNotes } from './testing/mobile-testing-notes';
import { webTestingNotes } from './testing/web-testing-notes';
import { webSecurityNotes } from './web/web-security-notes';
import { authNotes } from './web/auth-notes';
import { accessibilityNotes } from './web/accessibility-notes';
import { webPerformanceNotes } from './web/web-performance-notes';

export const NOTE_SOURCES: { notes: Note[]; url: string; topic: string }[] = [
  { notes: jsNotes, url: '/js/notes', topic: 'JavaScript' },
  { notes: tsNotes, url: '/js/typescript', topic: 'TypeScript' },
  { notes: tsReactNotes, url: '/js/ts-for-react', topic: 'TS for React' },
  { notes: reactNotes, url: '/react/notes', topic: 'React' },
  { notes: nextjsNotes, url: '/nextjs/notes', topic: 'Next.js' },
  { notes: nextjsRenderingNotes, url: '/nextjs/rendering', topic: 'Next.js Rendering' },
  { notes: reduxNotes, url: '/redux/notes', topic: 'Redux' },
  { notes: reduxToolkitNotes, url: '/redux/toolkit', topic: 'Redux Toolkit' },
  { notes: rtkQueryNotes, url: '/redux/rtk-query', topic: 'RTK Query' },
  { notes: asyncThunkNotes, url: '/redux/async-thunk', topic: 'createAsyncThunk' },
  { notes: htmlNotes, url: '/html-css/html', topic: 'HTML' },
  { notes: cssNotes, url: '/html-css/css', topic: 'CSS' },
  { notes: engineeringNotes, url: '/engineering/notes', topic: 'Engineering' },
  { notes: nodejsNotes, url: '/nodejs/notes', topic: 'Node.js' },
  { notes: awsNotes, url: '/aws/notes', topic: 'AWS' },
  { notes: postgresqlNotes, url: '/databases/postgresql', topic: 'PostgreSQL' },
  { notes: mongodbNotes, url: '/databases/mongodb', topic: 'MongoDB' },
  { notes: redisNotes, url: '/databases/redis', topic: 'Redis' },
  { notes: dynamodbNotes, url: '/databases/dynamodb', topic: 'DynamoDB' },
  { notes: testingFundamentalsNotes, url: '/testing/fundamentals', topic: 'Testing Fundamentals' },
  { notes: vitestNotes, url: '/testing/tools', topic: 'Vitest' },
  { notes: rtlNotes, url: '/testing/tools', topic: 'React Testing Library' },
  { notes: jestNotes, url: '/testing/tools', topic: 'Jest' },
  { notes: mswNotes, url: '/testing/tools', topic: 'MSW' },
  { notes: supertestNotes, url: '/testing/tools', topic: 'Supertest' },
  { notes: playwrightNotes, url: '/testing/tools', topic: 'Playwright' },
  { notes: etlTestingNotes, url: '/testing/specialized', topic: 'ETL Testing' },
  { notes: pentestNotes, url: '/testing/specialized', topic: 'Penetration Testing' },
  { notes: mobileTestingNotes, url: '/testing/specialized', topic: 'Mobile Testing' },
  { notes: webTestingNotes, url: '/testing/specialized', topic: 'Web Testing' },
  { notes: webSecurityNotes, url: '/web/security', topic: 'Web Security' },
  { notes: authNotes, url: '/web/auth', topic: 'Auth & Identity' },
  { notes: accessibilityNotes, url: '/web/accessibility', topic: 'Accessibility' },
  { notes: webPerformanceNotes, url: '/web/performance', topic: 'Web Performance' }
];

// A resolved prerequisite chip: enough to render a deep link without shipping the note itself.
export interface NoteLink {
  id: string;
  title: string;
  url: string; // `${page}?open=${id}` — opens + scrolls to the note via the existing nuqs machinery
}

const NOTE_LINKS = new Map<string, NoteLink>();
for (const { notes, url } of NOTE_SOURCES) {
  for (const n of notes) {
    if (!NOTE_LINKS.has(n.id)) NOTE_LINKS.set(n.id, { id: n.id, title: n.title, url: `${url}?open=${n.id}` });
  }
}

// Resolves a note's `prerequisites` ids to link chips, silently dropping ids that don't resolve
// (a typo in content data shouldn't crash the page). Call from Server Components only — importing
// this module pulls every topic's notes array in.
export function resolvePrerequisites(note: Note): NoteLink[] {
  if (!note.prerequisites?.length) return [];
  return note.prerequisites.map((id) => NOTE_LINKS.get(id)).filter((link): link is NoteLink => link !== undefined);
}
