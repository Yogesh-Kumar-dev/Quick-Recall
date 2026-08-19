import {
  IconAccessible,
  IconArticle,
  IconBolt,
  IconBookmark,
  IconBookmarks,
  IconBrain,
  IconBrandAws,
  IconBrandChrome,
  IconBrandCss3,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandMongodb,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandRedux,
  IconBrandTypescript,
  IconBriefcase,
  IconBug,
  IconCalendar,
  IconCards,
  IconChecklist,
  IconCode,
  IconCpu,
  IconDatabase,
  IconGauge,
  IconInfoCircle,
  IconKey,
  IconMessageQuestion,
  IconMicrophone,
  IconNotes,
  IconRobot,
  IconServer,
  IconSettings,
  IconShieldLock,
  IconTestPipe,
  IconWorld
} from '@tabler/icons-react';
import type { ComponentType } from 'react';
import type { Topic } from './topics';

type IconType = ComponentType<{ className?: string; size?: number | string }>;

export interface NavLink {
  title: string;
  url: string;
  icon: IconType;
  /** Matches a `TourStep.key` in `src/data/product-tour.ts` — only set for nav items covered by the guided tour. */
  tourKey?: string;
  /** Learning topic this item belongs to. Unset = always accessible (hubs, feature pages). */
  topic?: Topic;
}

export interface NavSection {
  id: string;
  title: string;
  icon: IconType;
  items: NavLink[];
}

// Standalone links (rendered together at the top of the sidebar).
export const primaryNav: NavLink[] = [
  { title: 'Dashboard', url: '/dashboard', icon: IconBrandChrome, tourKey: 'dashboard' },
  { title: 'About', url: '/about', icon: IconInfoCircle },
  { title: 'Articles', url: '/articles', icon: IconArticle, tourKey: 'articles' },
  { title: 'Job Tracker', url: '/job-tracker', icon: IconBriefcase, tourKey: 'job-tracker' },
  { title: 'Planner', url: '/planner', icon: IconCalendar, tourKey: 'planner' },
  { title: 'Speak Up', url: '/speak-up', icon: IconMicrophone, tourKey: 'speak-up' },
  { title: 'Mock Interview', url: '/mock-interview', icon: IconMessageQuestion, tourKey: 'mock-interview' },
  { title: 'Settings', url: '/settings', icon: IconSettings }
];

// Grouped sections (each renders as a labelled sidebar group).
export const navSections: NavSection[] = [
  {
    id: 'study',
    title: 'Study & Review',
    icon: IconBookmarks,
    items: [
      { title: 'Flashcards', url: '/flashcards', icon: IconCards, tourKey: 'flashcards' },
      { title: 'Quiz', url: '/quiz', icon: IconChecklist, tourKey: 'quiz' },
      { title: 'Saved', url: '/bookmarks', icon: IconBookmark, tourKey: 'saved' },
      { title: 'Review', url: '/review', icon: IconBrain, tourKey: 'review' }
    ]
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    icon: IconBrandHtml5,
    items: [
      { title: 'HTML Notes', url: '/html-css/html', icon: IconBrandHtml5, topic: 'html' },
      { title: 'CSS Notes', url: '/html-css/css', icon: IconBrandCss3, topic: 'css' }
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript & TypeScript',
    icon: IconBrandJavascript,
    items: [
      { title: 'JS Notes', url: '/js/notes', icon: IconBrandJavascript, topic: 'javascript' },
      { title: 'TS Notes', url: '/js/typescript', icon: IconBrandTypescript, topic: 'typescript' },
      { title: 'TS for React', url: '/js/ts-for-react', icon: IconBrandTypescript, topic: 'typescript' },
      { title: 'JS Machine Coding', url: '/js/machine-coding', icon: IconCode, tourKey: 'js-machine-coding', topic: 'javascript' },
      { title: 'Quick Recall', url: '/js/quick-recall', icon: IconBolt, topic: 'javascript' }
    ]
  },
  {
    id: 'react',
    title: 'React',
    icon: IconBrandReact,
    items: [
      { title: 'React Notes', url: '/react/notes', icon: IconBrandReact, topic: 'react' },
      { title: 'Custom Hooks', url: '/react/custom-hooks', icon: IconCode, tourKey: 'react-custom-hooks', topic: 'react' },
      { title: 'React Machine Coding', url: '/react/machine-coding', icon: IconCode, tourKey: 'react-machine-coding', topic: 'react' },
      { title: 'Quick Recall', url: '/react/quick-recall', icon: IconBolt, topic: 'react' }
    ]
  },
  {
    id: 'redux',
    title: 'Redux',
    icon: IconBrandRedux,
    items: [
      { title: 'Redux Notes', url: '/redux/notes', icon: IconBrandRedux, topic: 'redux' },
      { title: 'Redux Toolkit', url: '/redux/toolkit', icon: IconBrandRedux, topic: 'redux' },
      { title: 'RTK Query', url: '/redux/rtk-query', icon: IconBolt, topic: 'redux' },
      { title: 'createAsyncThunk', url: '/redux/async-thunk', icon: IconCode, topic: 'redux' }
    ]
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    icon: IconBrandNextjs,
    items: [
      { title: 'Next.js Notes', url: '/nextjs/notes', icon: IconBrandNextjs, topic: 'nextjs' },
      { title: 'Rendering Strategies', url: '/nextjs/rendering', icon: IconServer, topic: 'nextjs' }
    ]
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    icon: IconBrandNodejs,
    items: [
      { title: 'Node.js Notes', url: '/nodejs/notes', icon: IconBrandNodejs, topic: 'nodejs' },
      { title: 'Quick Recall', url: '/nodejs/quick-recall', icon: IconBolt, topic: 'nodejs' }
    ]
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: IconDatabase,
    items: [
      { title: 'PostgreSQL', url: '/databases/postgresql', icon: IconDatabase, topic: 'postgresql' },
      { title: 'MongoDB', url: '/databases/mongodb', icon: IconBrandMongodb, topic: 'mongodb' },
      { title: 'Redis', url: '/databases/redis', icon: IconBolt, topic: 'redis' },
      { title: 'DynamoDB', url: '/databases/dynamodb', icon: IconBrandAws, topic: 'dynamodb' }
    ]
  },
  {
    id: 'aws',
    title: 'AWS',
    icon: IconBrandAws,
    items: [{ title: 'Notes', url: '/aws/notes', icon: IconBrandAws, topic: 'aws' }]
  },
  {
    id: 'testing',
    title: 'Testing',
    icon: IconTestPipe,
    items: [
      { title: 'Fundamentals', url: '/testing/fundamentals', icon: IconChecklist, topic: 'testing' },
      { title: 'Testing Frameworks & Tools', url: '/testing/tools', icon: IconRobot, topic: 'testing' },
      { title: 'Specialized Testing', url: '/testing/specialized', icon: IconBug, topic: 'testing' }
    ]
  },
  {
    id: 'web',
    title: 'Web Platform',
    icon: IconWorld,
    items: [
      { title: 'Web Security', url: '/web/security', icon: IconShieldLock, topic: 'web' },
      { title: 'Auth & Identity', url: '/web/auth', icon: IconKey, topic: 'web' },
      { title: 'Accessibility', url: '/web/accessibility', icon: IconAccessible, topic: 'web' },
      { title: 'Web Performance', url: '/web/performance', icon: IconGauge, topic: 'web' }
    ]
  },
  {
    id: 'engineering',
    title: 'Engineering Essentials',
    icon: IconCpu,
    items: [{ title: 'Notes', url: '/engineering/notes', icon: IconNotes, topic: 'engineering' }]
  }
];
