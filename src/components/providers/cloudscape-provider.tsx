import type { ReactNode } from 'react';
import '@cloudscape-design/global-styles/index.css';

// No brand-color overrides here on purpose — Cloudscape IS the AWS Console's own design system,
// so its native dark mode already looks like the real Console. Forcing it into QuickRecall's own
// palette would make it look like a re-skin instead of the real thing.
//
// `awsui-context-content-header` matters as much as `awsui-dark-mode` does: many Cloudscape dark
// tokens (Cards' item background, KeyValuePairs' label color, etc.) have NO plain `.awsui-dark-mode`
// override at all — only `.awsui-dark-mode.awsui-context-<name>` combinations, which their own
// <AppLayout>/<TopNavigation> shell normally applies for you. Since we render standalone components
// without that shell, this context class has to be supplied by hand or those tokens silently fall
// through to their light-mode default (verified live via DOM inspection, not guessed).
export function CloudscapeProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="awsui-dark-mode awsui-context-content-header">{children}</div>;
}
