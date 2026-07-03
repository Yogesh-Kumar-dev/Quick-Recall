import {
  IconBolt,
  IconBookmark,
  IconBookmarks,
  IconBrain,
  IconBrandChrome,
  IconBrandCss3,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandRedux,
  IconBrandTypescript,
  IconBriefcase,
  IconCode,
  IconCpu,
  IconCards,
  IconInfoCircle,
  IconMicrophone,
  IconNotes,
  IconServer
} from '@tabler/icons-react';
import type { ComponentType } from 'react';

type IconType = ComponentType<{ className?: string; size?: number | string }>;

export interface NavLink {
  title: string;
  url: string;
  icon: IconType;
}

export interface NavSection {
  id: string;
  title: string;
  icon: IconType;
  items: NavLink[];
}

// Standalone links (rendered together at the top of the sidebar).
export const primaryNav: NavLink[] = [
  { title: 'Dashboard', url: '/dashboard', icon: IconBrandChrome },
  { title: 'About', url: '/about', icon: IconInfoCircle },
  { title: 'Job Tracker', url: '/job-tracker', icon: IconBriefcase },
  { title: 'Speak Up', url: '/speak-up', icon: IconMicrophone }
];

// Grouped sections (each renders as a labelled sidebar group).
export const navSections: NavSection[] = [
  {
    id: 'study',
    title: 'Study & Review',
    icon: IconBookmarks,
    items: [
      { title: 'Flashcards', url: '/flashcards', icon: IconCards },
      { title: 'Saved', url: '/bookmarks', icon: IconBookmark },
      { title: 'Review', url: '/review', icon: IconBrain }
    ]
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    icon: IconBrandHtml5,
    items: [
      { title: 'HTML Notes', url: '/html-css/html', icon: IconBrandHtml5 },
      { title: 'CSS Notes', url: '/html-css/css', icon: IconBrandCss3 }
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript & TypeScript',
    icon: IconBrandJavascript,
    items: [
      { title: 'JS Notes', url: '/js/notes', icon: IconBrandJavascript },
      { title: 'TS Notes', url: '/js/typescript', icon: IconBrandTypescript },
      { title: 'TS for React', url: '/js/ts-for-react', icon: IconBrandTypescript },
      { title: 'JS Machine Coding', url: '/js/machine-coding', icon: IconCode },
      { title: 'Quick Recall ⚡', url: '/js/quick-recall', icon: IconBolt }
    ]
  },
  {
    id: 'react',
    title: 'React',
    icon: IconBrandReact,
    items: [
      { title: 'React Notes', url: '/react/notes', icon: IconBrandReact },
      { title: 'Custom Hooks', url: '/react/custom-hooks', icon: IconCode },
      { title: 'React Machine Coding', url: '/react/machine-coding', icon: IconCode },
      { title: 'Quick Recall ⚡', url: '/react/quick-recall', icon: IconBolt }
    ]
  },
  {
    id: 'redux',
    title: 'Redux',
    icon: IconBrandRedux,
    items: [
      { title: 'Redux Notes', url: '/redux/notes', icon: IconBrandRedux },
      { title: 'Redux Toolkit', url: '/redux/toolkit', icon: IconBrandRedux },
      { title: 'RTK Query', url: '/redux/rtk-query', icon: IconBolt },
      { title: 'createAsyncThunk', url: '/redux/async-thunk', icon: IconCode }
    ]
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    icon: IconBrandNextjs,
    items: [
      { title: 'Next.js Notes', url: '/nextjs/notes', icon: IconBrandNextjs },
      { title: 'Rendering Strategies', url: '/nextjs/rendering', icon: IconServer }
    ]
  },
  {
    id: 'engineering',
    title: 'Engineering Essentials',
    icon: IconCpu,
    items: [{ title: 'Notes', url: '/engineering/notes', icon: IconNotes }]
  }
];
