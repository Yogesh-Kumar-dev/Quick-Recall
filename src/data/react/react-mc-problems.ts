import type { ReactMcProblem } from '@/types/content';

// ─── React Machine Coding Problem Registry ───────────────────────────────────
// Slugs match existing /machine-coding/[slug] routes — do NOT change slugs.

export const reactMcProblems: ReactMcProblem[] = [
  // ── 🟢 Easy ──────────────────────────────────────────────────────────────────
  {
    id: 'counter',
    title: 'Counter',
    slug: 'counter',
    difficulty: 'easy',
    category: 'ui-state',
    tags: ['useState', 'event-handling', 'increment', 'decrement']
  },
  {
    id: 'star-rating',
    title: 'Star Rating',
    slug: 'star-rating',
    difficulty: 'easy',
    category: 'ui-state',
    tags: ['useState', 'hover', 'controlled-input', 'icons']
  },
  {
    id: 'accordion',
    title: 'Accordion',
    slug: 'accordion',
    difficulty: 'easy',
    category: 'layout',
    tags: ['useState', 'toggle', 'expand-collapse', 'single-open']
  },
  {
    id: 'todo',
    title: 'Todo List',
    slug: 'todo',
    difficulty: 'easy',
    category: 'ui-state',
    tags: ['useState', 'array', 'CRUD', 'list-rendering']
  },
  {
    id: 'search-filter',
    title: 'Search Filter',
    slug: 'search-filter',
    difficulty: 'easy',
    category: 'performance',
    tags: ['useState', 'filter', 'search', 'controlled-input']
  },
  {
    id: 'dropdown',
    title: 'Dropdown',
    slug: 'dropdown',
    difficulty: 'easy',
    category: 'ui-state',
    tags: ['useState', 'click-outside', 'portal', 'accessibility']
  },
  {
    id: 'modal-popup',
    title: 'Modal Popup',
    slug: 'modal-popup',
    difficulty: 'easy',
    category: 'layout',
    tags: ['useState', 'portal', 'overlay', 'focus-trap']
  },
  {
    id: 'form-handling',
    title: 'Form Handling',
    slug: 'form-handling',
    difficulty: 'easy',
    category: 'forms',
    tags: ['useState', 'validation', 'controlled-inputs', 'submit']
  },
  {
    id: 'multi-step-form',
    title: 'Multi-Step Form',
    slug: 'multi-step-form',
    difficulty: 'easy',
    category: 'forms',
    tags: ['useState', 'step-wizard', 'validation', 'progress']
  },

  // ── 🟡 Medium ─────────────────────────────────────────────────────────────────
  {
    id: 'api-data-fetching',
    title: 'API Data Fetching',
    slug: 'api-data-fetching',
    difficulty: 'medium',
    category: 'data-fetching',
    tags: ['useEffect', 'fetch', 'loading-state', 'error-handling']
  },
  {
    id: 'pagination',
    title: 'Pagination',
    slug: 'pagination',
    difficulty: 'medium',
    category: 'data-fetching',
    tags: ['useState', 'useMemo', 'slice', 'page-controls']
  },
  {
    id: 'debounced-search',
    title: 'Debounced Search',
    slug: 'debounced-search',
    difficulty: 'medium',
    category: 'performance',
    tags: ['useEffect', 'debounce', 'setTimeout', 'cleanup']
  },
  {
    id: 'otp-input',
    title: 'OTP Input',
    slug: 'otp-input',
    difficulty: 'medium',
    category: 'forms',
    tags: ['useRef', 'focus-management', 'keyboard-events', 'array']
  },
  {
    id: 'tabs',
    title: 'Tabs Component',
    slug: 'tabs',
    difficulty: 'medium',
    category: 'ui-state',
    tags: ['useState', 'active-tab', 'conditional-render', 'a11y']
  },
  {
    id: 'sequential-progress-bars',
    title: 'Sequential Progress Bars',
    slug: 'sequential-progress-bars',
    difficulty: 'medium',
    category: 'performance',
    tags: ['useEffect', 'setTimeout', 'queue', 'animation']
  },
  {
    id: 'movie-seat-selection',
    title: 'Movie Seat Selection',
    slug: 'movie-seat-selection',
    difficulty: 'medium',
    category: 'advanced-ui',
    tags: ['useState', 'grid', 'derived-state', 'booking']
  },
  {
    id: 'product-filter',
    title: 'Product Filter',
    slug: 'product-filter',
    difficulty: 'medium',
    category: 'data-fetching',
    tags: ['useEffect', 'fetch', 'debounce', 'derived-state', 'category-filter']
  },
  {
    id: 'sortable-table',
    title: 'Sortable Employee Table',
    slug: 'sortable-table',
    difficulty: 'medium',
    category: 'ui-state',
    tags: ['useState', 'useMemo', 'sorting', 'derived-state', 'table']
  },

  // ── 🔴 Hard ───────────────────────────────────────────────────────────────────
  {
    id: 'infinite-scroll',
    title: 'Infinite Scroll',
    slug: 'infinite-scroll',
    difficulty: 'hard',
    category: 'data-fetching',
    tags: ['IntersectionObserver', 'useRef', 'pagination', 'accumulate']
  },
  {
    id: 'drag-and-drop',
    title: 'Drag & Drop',
    slug: 'drag-and-drop',
    difficulty: 'hard',
    category: 'advanced-ui',
    tags: ['HTML5-DnD', 'useRef', 'reorder', 'dragover']
  },
  {
    id: 'file-tree',
    title: 'File Tree Explorer',
    slug: 'file-tree',
    difficulty: 'hard',
    category: 'advanced-ui',
    tags: ['recursion', 'tree-structure', 'toggle', 'nested']
  },
  {
    id: 'shopping-cart',
    title: 'Shopping Cart',
    slug: 'shopping-cart',
    difficulty: 'hard',
    category: 'advanced-ui',
    tags: ['useReducer', 'context', 'cart-state', 'total-calculation']
  },
  {
    id: 'virtualized-list',
    title: 'Virtualized List',
    slug: 'virtualized-list',
    difficulty: 'hard',
    category: 'performance',
    tags: ['IntersectionObserver', 'react-virtuoso', 'virtualization', 'useRef']
  }
];
