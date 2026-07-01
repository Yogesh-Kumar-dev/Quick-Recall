import type { Metadata, Viewport } from 'next';
import { Inter, Lora, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code', display: 'swap' });

export const metadata: Metadata = {
  title: 'QuickRecall — Developer Interview Prep',
  description:
    'A personal knowledge base for developer interview prep. Notes, machine-coding problems with a side-by-side code viewer, and quick-recall sheets — any source distilled into one searchable format.',
  appleWebApp: { capable: true, title: 'QuickRecall', statusBarStyle: 'default' }
};

export const viewport: Viewport = { themeColor: '#00684a' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${sourceCodePro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
