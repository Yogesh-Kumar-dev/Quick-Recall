import type { MetadataRoute } from 'next';

// Web app manifest as a typed metadata route — Next serves it at /manifest.webmanifest and
// auto-links it from <head>, staying consistent with the typed Metadata used in layout.tsx.
// `display: standalone` + the icon set (incl. a maskable variant) are what make the app
// installable. theme/background colors track the app's primary (#2196f3 from the SCSS theme).
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
    theme_color: '#2196f3',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
