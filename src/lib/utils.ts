import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fisher-Yates shuffle — does not mutate the input.
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Shared "12 Mar 2026"-style date formatting for history/list views (mock interviews, quiz attempts).
export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

// Split a string on URLs and return segments of plain text and URL strings.
const URL_REGEX = /https?:\/\/[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z0-9][-a-zA-Z0-9]*(?:\.[a-zA-Z]{2,})[^\s]*/g;

export function splitUrls(text: string): Array<{ type: 'text'; value: string } | { type: 'url'; value: string }> {
  const segments: Array<{ type: 'text'; value: string } | { type: 'url'; value: string }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const start = match.index!;
    if (start > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, start) });
    }
    segments.push({ type: 'url', value: match[0] });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}
