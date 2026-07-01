'use client';

import type { ReactNode } from 'react';

// third party
import { Provider } from 'react-redux';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
// import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';
import NotificationProvider from 'notifications/NotificationProvider';
import LeafyGreenBridge from 'ui-component/leafygreen/LeafyGreenBridge';

import ThemeCustomization from 'themes';

import { store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';
import { useLazyDefault } from 'utils/useLazyDefault';

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  // The Redux DevTools panel is client-only (kept in production by choice). Importing it via
  // next/dynamic({ ssr: false }) throws "Bail out to client-side rendering: next/dynamic" during
  // SSR; because this renders at the app root with no boundary that contains it, that bailout
  // de-opted the ENTIRE app to client rendering — every page shipped an empty SSR shell and the
  // real content (the LCP element) only painted after hydration (LCP ~6.6s). useLazyDefault imports
  // it in a post-mount effect, so it never touches the server render and the bailout is gone.
  const DevTools = useLazyDefault(() => import('./DevTools'));

  return (
    <Provider store={store}>
      <ConfigProvider>
        <ThemeCustomization>
          {/* <RTLLayout> */}
          <LeafyGreenBridge>
            <Locales>
              <NavigationScroll>
                <Notistack>
                  <Snackbar />
                  <NotificationProvider>{children}</NotificationProvider>
                </Notistack>
              </NavigationScroll>
            </Locales>
          </LeafyGreenBridge>
          {/* </RTLLayout> */}
        </ThemeCustomization>
      </ConfigProvider>
      {DevTools && <DevTools />}
    </Provider>
  );
}
