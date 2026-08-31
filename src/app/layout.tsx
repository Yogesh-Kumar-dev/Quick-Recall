import type { Metadata, Viewport } from 'next';
import { Inter, Lora, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import Providers from './providers';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://quickrecall.vercel.app'),
  title: {
    default: 'QuickRecall - Full-Stack Developer Interview Prep',
    template: '%s'
  },
  description:
    'A personal knowledge base for full-stack developer interview prep. Notes, machine-coding problems with a side-by-side code viewer, and quick-recall sheets — any source distilled into one searchable format.',
  appleWebApp: { capable: true, title: 'QuickRecall', statusBarStyle: 'default' }
};

export const viewport: Viewport = { themeColor: '#001e2b' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${lora.variable} ${sourceCodePro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
