import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// project imports
import { fetcher } from 'utils/axios';
import defaultConfig from 'config';

// types
import type { MenuProps } from 'types/menu';
import type { NavItemType } from 'types';

const initialState: MenuProps = {
  openedItem: 'dashboard',
  // Seed the drawer to its settled desktop state (open when miniDrawer is off). MainLayout's mount
  // effect runs handlerDrawerOpen(!miniDrawer), so seeding the same value means the server-rendered
  // layout already matches what the client settles on — without this the server rendered the drawer
  // closed and the mount effect opened it, reflowing the entire main-content area (large CLS).
  isDashboardDrawerOpened: !defaultConfig.miniDrawer
};

const endpoints = {
  key: 'api/menu',
  master: 'master',
  widget: '/widget' // server URL
};

export function useGetMenu() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.widget, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menu: data?.widget as NavItemType,
      menuLoading: isLoading,
      menuError: error,
      menuValidating: isValidating,
      menuEmpty: !isLoading && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    // Seed the cache so the very first render (server + hydration) already has the menu state.
    // Without this, isLoading is true on the initial render and MainLayout renders only <Loader/>,
    // leaving the server HTML empty until SWR resolves on the client — a major LCP regression.
    fallbackData: initialState,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data as MenuProps,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: any) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}

export function handlerActiveItem(openedItem: string) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: any) => {
      return { ...currentMenuMaster, openedItem };
    },
    false
  );
}
