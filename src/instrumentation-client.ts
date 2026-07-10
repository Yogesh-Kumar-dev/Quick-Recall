// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type * as SentryNS from '@sentry/nextjs';

// @sentry/nextjs's client bundle (errors + tracing + replay) is ~250KB+ of JS that a barrel-export
// chain prevents Turbopack from tree-shaking, so it can't be trimmed by feature flags alone. Deferring
// the import + init until after window `load` (and an idle tick) keeps it out of the initial parse/execute
// path entirely — it no longer counts toward TBT/LCP — while keeping every feature enabled.
let sentry: typeof SentryNS | undefined;

function initSentry() {
  import('@sentry/nextjs').then((Sentry) => {
    sentry = Sentry;
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [Sentry.replayIntegration()],
      tracesSampleRate: 1,
      enableLogs: true,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    });
  });
}

if (typeof window !== 'undefined') {
  const schedule = () => (window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1)))(initSentry);
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}

export function onRouterTransitionStart(href: string, navigationType: string) {
  sentry?.captureRouterTransitionStart(href, navigationType);
}
