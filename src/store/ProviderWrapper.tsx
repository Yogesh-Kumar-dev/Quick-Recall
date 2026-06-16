'use client';

import { ReactNode } from 'react';

// third party
import { Provider } from 'react-redux';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
// import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';
import NotificationProvider from 'notifications/NotificationProvider';

import dynamic from 'next/dynamic';

import ThemeCustomization from 'themes';

import { store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';

const DevTools = dynamic(() => import('./DevTools'), { ssr: false });

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <ThemeCustomization>
          {/* <RTLLayout> */}
          <Locales>
            <NavigationScroll>
              <Notistack>
                <Snackbar />
                <NotificationProvider>{children}</NotificationProvider>
              </Notistack>
            </NavigationScroll>
          </Locales>
          {/* </RTLLayout> */}
        </ThemeCustomization>
      </ConfigProvider>
      <DevTools />
    </Provider>
  );
}
