import type { Metadata } from 'next';
import Script from 'next/script';

import './../scss/style.scss';

// project imports
import ProviderWrapper from 'store/ProviderWrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: 'QuickRecall — React Interview Prep',
  description:
    'Your one-stop React interview preparation tool. Machine coding problems with Minimal and MUI versions, side-by-side code viewer, and interview tips.'
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
