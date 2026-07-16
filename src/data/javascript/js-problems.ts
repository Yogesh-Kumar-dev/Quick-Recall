import type { JsProblemEntry } from '@/types/content';

export const jsProblems: JsProblemEntry[] = [
  {
    id: 'debounce',
    title: 'Implement Debounce',
    slug: 'debounce',
    difficulty: 'medium',
    category: 'functional',
    tags: ['closure', 'timer', 'higher-order-function', 'performance']
  },
  {
    id: 'throttle',
    title: 'Implement Throttle',
    slug: 'throttle',
    difficulty: 'medium',
    category: 'functional',
    tags: ['closure', 'timer', 'higher-order-function', 'performance']
  },
  {
    id: 'flatten-array',
    title: 'Flatten Nested Array',
    slug: 'flatten-array',
    difficulty: 'easy',
    category: 'array',
    tags: ['recursion', 'array', 'reduce', 'es6']
  },
  {
    id: 'deep-clone',
    title: 'Deep Clone an Object',
    slug: 'deep-clone',
    difficulty: 'medium',
    category: 'object',
    tags: ['recursion', 'object', 'json', 'structuredClone']
  },
  {
    id: 'promise-all',
    title: 'Implement Promise.all',
    slug: 'promise-all',
    difficulty: 'hard',
    category: 'async',
    tags: ['promise', 'async', 'polyfill']
  },
  {
    id: 'curry',
    title: 'Curry a Function',
    slug: 'curry',
    difficulty: 'medium',
    category: 'functional',
    tags: ['closure', 'higher-order-function', 'functional-programming']
  },
  {
    id: 'memoize',
    title: 'Memoize a Function',
    slug: 'memoize',
    difficulty: 'medium',
    category: 'functional',
    tags: ['closure', 'cache', 'higher-order-function', 'performance']
  },
  {
    id: 'custom-bind',
    title: 'Implement Function.prototype.bind',
    slug: 'custom-bind',
    difficulty: 'hard',
    category: 'functional',
    tags: ['prototype', 'this', 'closures', 'polyfill']
  },
  {
    id: 'group-by',
    title: 'Group Array Items by Key',
    slug: 'group-by',
    difficulty: 'easy',
    category: 'array',
    tags: ['reduce', 'array', 'object']
  },
  {
    id: 'electricity-bill',
    title: 'Calculate Electricity Bill',
    slug: 'electricity-bill',
    difficulty: 'easy',
    category: 'array',
    tags: ['slab-pricing', 'reduce', 'array', 'logic', 'math']
  },
  {
    id: 'frequency-calculator',
    title: 'Frequency Calculator',
    slug: 'frequency-calculator',
    difficulty: 'easy',
    category: 'array',
    tags: ['hash-map', 'frequency', 'array', 'reduce', 'object']
  },
  {
    id: 'promise-race',
    title: 'Implement Promise.race',
    slug: 'promise-race',
    difficulty: 'medium',
    category: 'async',
    tags: ['promise', 'async', 'polyfill', 'timeout']
  },
  {
    id: 'promise-any',
    title: 'Implement Promise.any',
    slug: 'promise-any',
    difficulty: 'hard',
    category: 'async',
    tags: ['promise', 'async', 'polyfill', 'aggregate-error']
  },
  {
    id: 'promise-all-settled',
    title: 'Implement Promise.allSettled',
    slug: 'promise-all-settled',
    difficulty: 'medium',
    category: 'async',
    tags: ['promise', 'async', 'polyfill', 'error-handling']
  }
];
