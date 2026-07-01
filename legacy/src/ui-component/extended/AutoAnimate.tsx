'use client';

import type { ElementType, ReactNode } from 'react';

// third party
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { AutoAnimateOptions } from '@formkit/auto-animate';

// Re-export the hook — this is the primary API. MUI components (Stack, List,
// etc.) forward `ref` to their root DOM node, so attach auto-animate with:
//   const [ref] = useAutoAnimate();  ...  <Stack ref={ref}>
export { useAutoAnimate };

interface AutoAnimateProps {
  children?: ReactNode;
  /** Element to render as the animated parent. Must be a real DOM element. Default: 'div'. */
  component?: ElementType;
  /** Pass-through options for auto-animate (e.g. { duration, easing }). */
  options?: Partial<AutoAnimateOptions>;
  className?: string;
  style?: React.CSSProperties;
}

// ==============================|| AUTO ANIMATE WRAPPER ||============================== //

/**
 * Drop-in wrapper for plain DOM containers (div / ul / section). Its direct
 * children get smooth enter / exit / move animations automatically.
 *
 * For MUI components prefer the `useAutoAnimate` hook + `ref` prop above.
 */
export default function AutoAnimate({ children, component, options, ...rest }: AutoAnimateProps) {
  const [parent] = useAutoAnimate<HTMLElement>(options);
  const Component = component ?? 'div';

  return (
    <Component ref={parent} {...rest}>
      {children}
    </Component>
  );
}
