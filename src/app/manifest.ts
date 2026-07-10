import type { MetadataRoute } from 'next';

// `display: standalone` + the icon set (incl. a maskable variant) are what make the app installable.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QuickRecall — Developer Interview Prep',
    short_name: 'QuickRecall',
    description:
      'A personal knowledge base for developer interview prep. Notes, machine-coding problems with a side-by-side code viewer, and quick-recall sheets — any source distilled into one searchable format.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#00684a',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
