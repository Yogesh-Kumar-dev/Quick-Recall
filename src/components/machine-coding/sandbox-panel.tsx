'use client';

import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

// ==============================|| SANDBOX PANEL (embedded code editor) ||============================== //

// JS problems → OneCompiler (full JS interpreter with stdin/stdout).
// React problems → CodeSandbox (React+TS template, live component preview).

interface Props {
  problemTitle: string;
  kind: 'js' | 'react';
}

const EMBEDS = {
  js: {
    src: 'https://onecompiler.com/embed/javascript?theme=dark&hideLanguageSelection=true',
    href: 'https://onecompiler.com/javascript',
    label: 'Open in OneCompiler',
    titleSuffix: 'OneCompiler'
  },
  react: {
    src: 'https://codesandbox.io/embed/react-ts?fontsize=14&hidenavigation=1&theme=dark',
    href: 'https://codesandbox.io/p/sandbox/react-ts',
    label: 'Open in CodeSandbox',
    titleSuffix: 'CodeSandbox'
  }
} as const;

export default function SandboxPanel({ problemTitle, kind }: Props) {
  const embed = EMBEDS[kind];

  return (
    <Card className="overflow-hidden border-0 p-0">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <span className="text-sm font-medium">{problemTitle} — Practice</span>
        {/* <a
          href={embed.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {embed.label}
          <ExternalLink className="h-3 w-3" />
        </a> */}
      </div>
      <iframe
        src={embed.src}
        className="h-[70vh] w-full border-0"
        title={`${problemTitle} — ${embed.titleSuffix}`}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      />
    </Card>
  );
}
