// ==============================|| QUICK RECALL REGISTRY ||============================== //
//
// One cheatsheet per SIDEBAR SECTION (nav.ts), assembled here from two kinds of sources:
//   1. Hand-written sections (JS / TS / React / Node.js) — imported unchanged and given ids.
//   2. Derived sections — generated from each topic's Note[] via deriveQuickRecallSections(),
//      so a section's sheet always covers its notes with zero extra authoring.
//
// Every route under src/app/(app)/.../quick-recall/page.tsx renders exactly one entry from
// QUICK_RECALL_SHEETS; nav.ts links one "Quick Recall" item per sidebar section to its route.

import { deriveQuickRecallSections, withItemIds } from '@/lib/quick-recall-from-notes';
import type { Note, QuickRecallSection } from '@/types/content';
import { awsNotes } from './aws/aws-notes';
import { dynamodbNotes } from './databases/dynamodb-notes';
import { mongodbNotes } from './databases/mongodb-notes';
import { postgresqlNotes } from './databases/postgresql-notes';
import { redisNotes } from './databases/redis-notes';
import { engineeringNotes } from './engineering/engineering-notes';
import { cssNotes } from './htmlcss/css-notes';
import { htmlNotes } from './htmlcss/html-notes';
import { jsNotes } from './javascript/js-notes';
// Hand-written sheets (kept as-is; the registry adds stable ids on top)
import { jsQuickRecall, tsQuickRecall } from './javascript/js-quick-recall';
import { tsNotes } from './javascript/ts-notes';
import { tsReactNotes } from './javascript/ts-react';
import { nextjsNotes } from './nextjs/nextjs-notes';
import { nextjsRenderingNotes } from './nextjs/nextjs-rendering';
import { nodejsNotes } from './nodejs/nodejs-notes';
import { nodejsQuickRecall } from './nodejs/nodejs-quick-recall';
import { reactNotes } from './react/react-notes';
import { reactQuickRecall } from './react/react-quick-recall';
import { asyncThunkNotes } from './redux/async-thunk-notes';
import { reduxNotes } from './redux/redux-notes';
import { reduxToolkitNotes } from './redux/redux-toolkit-notes';
import { rtkQueryNotes } from './redux/rtk-query-notes';
import { etlTestingNotes } from './testing/etl-testing-notes';
import { jestNotes } from './testing/jest-notes';
import { mobileTestingNotes } from './testing/mobile-testing-notes';
import { mswNotes } from './testing/msw-notes';
import { pentestNotes } from './testing/pentest-notes';
import { playwrightNotes } from './testing/playwright-notes';
import { rtlNotes } from './testing/rtl-notes';
import { supertestNotes } from './testing/supertest-notes';
import { testingFundamentalsNotes } from './testing/testing-fundamentals-notes';
import { vitestNotes } from './testing/vitest-notes';
import { webTestingNotes } from './testing/web-testing-notes';
import { accessibilityNotes } from './web/accessibility-notes';
import { authNotes } from './web/auth-notes';
import { webPerformanceNotes } from './web/web-performance-notes';
import { webSecurityNotes } from './web/web-security-notes';

export interface QuickRecallSheet {
  /** matches the sidebar section id in nav.ts */
  key: string;
  title: string;
  intro: string;
  sections: QuickRecallSection[];
}

const INTRO =
  'Last-minute cheatsheet. Scan in 5-10 minutes before your interview: key concepts, gotchas, and code snippets distilled from the full notes.';

function derived(notes: Note[], notesUrl?: string, sectionLabel?: string): QuickRecallSection[] {
  return deriveQuickRecallSections(notes, { notesUrl, sectionLabel });
}

export const QUICK_RECALL_SHEETS: Record<string, QuickRecallSheet> = {
  javascript: {
    key: 'javascript',
    title: 'JavaScript & TypeScript Quick Recall',
    intro: INTRO,
    sections: [
      ...withItemIds(jsQuickRecall),
      ...derived(jsNotes, '/js/notes'),
      ...withItemIds(tsQuickRecall),
      ...derived(tsNotes, '/js/typescript', 'TypeScript'),
      ...derived(tsReactNotes, '/js/ts-for-react', 'TS for React')
    ]
  },
  react: {
    key: 'react',
    title: 'React Quick Recall',
    intro: INTRO,
    sections: [...withItemIds(reactQuickRecall), ...derived(reactNotes, '/react/notes')]
  },
  redux: {
    key: 'redux',
    title: 'Redux Quick Recall',
    intro: INTRO,
    sections: [
      ...derived(reduxNotes, '/redux/notes', 'Redux'),
      ...derived(reduxToolkitNotes, '/redux/toolkit', 'Redux Toolkit'),
      ...derived(rtkQueryNotes, '/redux/rtk-query', 'RTK Query'),
      ...derived(asyncThunkNotes, '/redux/async-thunk', 'createAsyncThunk')
    ]
  },
  nextjs: {
    key: 'nextjs',
    title: 'Next.js Quick Recall',
    intro: INTRO,
    sections: [...derived(nextjsNotes, '/nextjs/notes', 'Next.js'), ...derived(nextjsRenderingNotes, '/nextjs/rendering', 'Rendering')]
  },
  nodejs: {
    key: 'nodejs',
    title: 'Node.js Quick Recall',
    intro: INTRO,
    sections: [...withItemIds(nodejsQuickRecall), ...derived(nodejsNotes, '/nodejs/notes')]
  },
  'html-css': {
    key: 'html-css',
    title: 'HTML & CSS Quick Recall',
    intro: INTRO,
    sections: [...derived(htmlNotes, '/html-css/html', 'HTML'), ...derived(cssNotes, '/html-css/css', 'CSS')]
  },
  databases: {
    key: 'databases',
    title: 'Databases Quick Recall',
    intro: INTRO,
    sections: [
      ...derived(postgresqlNotes, '/databases/postgresql', 'PostgreSQL'),
      ...derived(mongodbNotes, '/databases/mongodb', 'MongoDB'),
      ...derived(redisNotes, '/databases/redis', 'Redis'),
      ...derived(dynamodbNotes, '/databases/dynamodb', 'DynamoDB')
    ]
  },
  aws: {
    key: 'aws',
    title: 'AWS Quick Recall',
    intro: INTRO,
    sections: derived(awsNotes, '/aws/notes')
  },
  testing: {
    key: 'testing',
    title: 'Testing Quick Recall',
    intro: INTRO,
    sections: [
      ...derived(testingFundamentalsNotes, '/testing/fundamentals'),
      ...derived(vitestNotes, '/testing/tools', 'Vitest'),
      ...derived(jestNotes, '/testing/tools', 'Jest'),
      ...derived(rtlNotes, '/testing/tools', 'React Testing Library'),
      ...derived(mswNotes, '/testing/tools', 'MSW'),
      ...derived(supertestNotes, '/testing/tools', 'Supertest'),
      ...derived(playwrightNotes, '/testing/tools', 'Playwright'),
      ...derived(etlTestingNotes, '/testing/specialized', 'ETL Testing'),
      ...derived(pentestNotes, '/testing/specialized', 'Penetration Testing'),
      ...derived(mobileTestingNotes, '/testing/specialized', 'Mobile Testing'),
      ...derived(webTestingNotes, '/testing/specialized', 'Web Testing')
    ]
  },
  web: {
    key: 'web',
    title: 'Web Platform Quick Recall',
    intro: INTRO,
    sections: [
      ...derived(webSecurityNotes, '/web/security', 'Security'),
      ...derived(authNotes, '/web/auth', 'Auth'),
      ...derived(accessibilityNotes, '/web/accessibility', 'Accessibility'),
      ...derived(webPerformanceNotes, '/web/performance', 'Performance')
    ]
  },
  engineering: {
    key: 'engineering',
    title: 'Engineering Essentials Quick Recall',
    intro: INTRO,
    sections: derived(engineeringNotes, '/engineering/notes')
  }
};
