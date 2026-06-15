// ==============================|| OFFLINE CONTENT MANIFEST ||============================== //
//
// Declares the routes that the "Download for offline" flow fetches, grouped by top-level
// sidebar area (see src/menu-items/*). The download manager (src/hooks/useOfflineDownload.ts)
// fetches each URL so the service worker's runtime caching stores the HTML + the _next/static
// chunks it pulls in — which is why we list **route paths**, not internal chunk URLs (stable,
// low-maintenance). The grouping is what the progress UI renders per section.
//
// Keep these lists in sync with the menu items and the JS machine-coding PROBLEM_MAP. Each id
// mirrors a sidebar group; `urls` are the navigable routes within it.

export interface OfflineSection {
  /** stable id, mirrors the sidebar group id */
  id: string;
  /** human label shown in the progress UI */
  label: string;
  /** route paths to fetch + cache for offline use */
  urls: string[];
}

// JS machine-coding problem slugs — mirror of PROBLEM_MAP in
// src/app/(dashboard)/js/machine-coding/[slug]/page.tsx
const JS_MC_SLUGS = [
  'debounce',
  'throttle',
  'flatten-array',
  'deep-clone',
  'promise-all',
  'curry',
  'memoize',
  'custom-bind',
  'group-by',
  'electricity-bill',
  'frequency-calculator'
];

// React machine-coding problem slugs — mirror of the route pages under
// src/app/(dashboard)/machine-coding/<slug>/
const REACT_MC_SLUGS = [
  'todo',
  'infinite-scroll',
  'debounced-search',
  'star-rating',
  'pagination',
  'otp-input',
  'drag-and-drop',
  'accordion',
  'multi-step-form',
  'tabs',
  'file-tree',
  'shopping-cart',
  'sequential-progress-bars',
  'counter',
  'search-filter',
  'dropdown',
  'modal-popup',
  'form-handling',
  'api-data-fetching',
  'virtualized-list',
  'movie-seat-selection'
];

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
