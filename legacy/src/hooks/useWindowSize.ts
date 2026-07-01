'use client';

import { useEffect, useState } from 'react';

// ==============================|| HOOKS - WINDOW SIZE ||============================== //

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Tracks the viewport size, staying in sync via the window `resize` event.
 * Seeds to 0×0 on the server (no `window`) and syncs on mount, so the first
 * client render matches the server output and avoids a hydration mismatch.
 */
export default function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });

    onResize(); // sync once on mount
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}
