'use client';

// LeafyGreen's Callout builds on React context, so it can't be evaluated in a Server Component.
// Isolated here as a client leaf (same shape as CodeBlock) so the deep-dive page itself stays an RSC.
import { Callout, Variant } from '@leafygreen-ui/callout';

export default function GotchaCallout({ children }: { children: string }) {
  return (
    <Callout variant={Variant.Important} title="Gotcha">
      {children}
    </Callout>
  );
}
