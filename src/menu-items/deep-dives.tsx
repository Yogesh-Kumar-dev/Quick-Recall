import { IconTelescope, IconArrowsExchange } from '@tabler/icons-react';
import type { NavItemType } from 'types';

// ==============================|| MENU ITEMS - DEEP DIVES ||============================== //
// In-depth library walkthroughs: a live demo + annotated implementation, with a
// pill toggle comparing two libraries. First entry compares data-fetching
// (TanStack Query vs RTK Query); future entries (e.g. Redux Toolkit vs Zustand)
// slot in here under the same WalkthroughLayout shell.

const deepDives: NavItemType = {
  id: 'deep-dives',
  title: 'Deep Dives',
  caption: 'Library walkthroughs & comparisons',
  icon: IconTelescope,
  type: 'group',
  children: [
    {
      id: 'data-fetching',
      title: 'Data Fetching: TanStack vs RTK Query',
      type: 'item',
      url: '/deep-dives/data-fetching',
      icon: IconArrowsExchange
    }
  ]
};

export default deepDives;
