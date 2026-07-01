'use client';

import { useCallback, useState } from 'react';

// ==============================|| HOOKS - TOGGLE ||============================== //

/**
 * Boolean state with a stable `toggle` plus explicit `setOn` / `setOff`.
 * The callbacks are memoised so they are safe to pass to memoised children.
 */
export default function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setOn = useCallback(() => setValue(true), []);
  const setOff = useCallback(() => setValue(false), []);

  return { value, toggle, setOn, setOff, setValue } as const;
}
