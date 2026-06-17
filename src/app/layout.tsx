import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import './../scss/style.scss';
import './../scss/tailwind.css';

// project imports
import ProviderWrapper from 'store/ProviderWrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: 'QuickRecall — Developer Interview Prep',
  description:
    'A personal knowledge base for developer interview prep. Notes, machine-coding problems with a side-by-side code viewer, and quick-recall sheets — any source distilled into one searchable format.',
  // PWA: enables the iOS standalone web-app chrome + a sensible status-bar style and home-screen
  // title when added to the home screen. Apple ignores the manifest for these, hence appleWebApp.
  appleWebApp: {
    capable: true,
    title: 'QuickRecall',
    statusBarStyle: 'default'
  }
};

// PWA: theme-color drives the browser/OS UI tint when installed (matches the manifest's
// theme_color / app primary). Next 15 expects theme-color in the viewport export, not metadata.
export const viewport: Viewport = {
  themeColor: '#2196f3'
};

// ==============================|| ROOT LAYOUT ||============================== //

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning silences the attribute react-scan adds to <head> */}
      <head suppressHydrationWarning>
        <Script src="//unpkg.com/react-scan/dist/auto.global.js" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body>
        <NuqsAdapter>
          <ProviderWrapper>{children}</ProviderWrapper>
        </NuqsAdapter>
      </body>
    </html>
  );
}
