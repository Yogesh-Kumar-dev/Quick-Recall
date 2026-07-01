// ==============================|| OFFLINE CONTENT MANIFEST ||============================== //
//
// Declares the routes that the "Download for offline" flow fetches, grouped by top-level
// sidebar area (see src/menu-items/*). The download manager (src/hooks/useOfflineDownload.ts)
// fetches each URL so the service worker's runtime caching stores the HTML + the _next/static
// chunks it pulls in — which is why we list **route paths**, not internal chunk URLs (stable,
// low-maintenance). The grouping is what the progress UI renders per section.
//
// Machine-coding slugs are DERIVED from the existing problem registries (the single source of
// truth) rather than hardcoded — add a problem there and it's automatically included here. Only
// the static page routes (notes, quick-recall, etc.) are listed by hand below, since they have
// no registry to derive from.

import { jsProblems } from 'data/javascript/js-problems';
import { reactMcProblems } from 'data/react/react-mc-problems';

export interface OfflineSection {
  /** stable id, mirrors the sidebar group id */
  id: string;
  /** human label shown in the progress UI */
  label: string;
  /** route paths to fetch + cache for offline use */
  urls: string[];
}

// Derived from the authoritative registries — no manual slug lists to keep in sync.
const JS_MC_SLUGS = jsProblems.map((p) => p.slug);
const REACT_MC_SLUGS = reactMcProblems.map((p) => p.slug);

export const OFFLINE_SECTIONS: OfflineSection[] = [
  {
    id: 'core',
    label: 'Core app',
    // app shell + home + the standalone single-page areas
    urls: ['/', '/dashboard', '/about', '/speak-up', '/job-tracker', '/~offline']
  },
  {
    id: 'study',
    label: 'Study & Review',
    urls: ['/bookmarks', '/review']
  },
  {
    id: 'javascript',
    label: 'JavaScript & TypeScript',
    urls: [
      '/js/notes',
      '/js/typescript',
      '/js/ts-for-react',
      '/js/quick-recall',
      '/js/machine-coding',
      ...JS_MC_SLUGS.map((slug) => `/js/machine-coding/${slug}`)
    ]
  },
  {
    id: 'react',
    label: 'React',
    urls: [
      '/react/notes',
      '/react/custom-hooks',
      '/react/quick-recall',
      '/react/machine-coding',
      ...REACT_MC_SLUGS.map((slug) => `/machine-coding/${slug}`)
    ]
  },
  {
    id: 'redux',
    label: 'Redux',
    urls: ['/redux/notes', '/redux/toolkit', '/redux/rtk-query', '/redux/async-thunk']
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    urls: ['/nextjs/notes', '/nextjs/rendering']
  },
  {
    id: 'html-css',
    label: 'HTML & CSS',
    urls: ['/html-css/html', '/html-css/css']
  },
  {
    id: 'engineering',
    label: 'Engineering Essentials',
    urls: ['/engineering/notes']
  }
];

/** Total number of routes across all sections — handy for an overall progress denominator. */
export const OFFLINE_TOTAL_URLS = OFFLINE_SECTIONS.reduce((sum, s) => sum + s.urls.length, 0);
