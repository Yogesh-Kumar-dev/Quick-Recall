'use client';

import { useCallback, useState } from 'react';

// ==============================|| HOOKS - COPY TO CLIPBOARD ||============================== //

/**
 * Copies text to the clipboard and exposes a transient `copied` flag that
 * auto-resets after `resetDelay`ms. Returns `false` from `copy` if the
 * Clipboard API is unavailable or the write is rejected.
 */
export default function useCopyToClipboard(resetDelay = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        return false;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copy } as const;
}
