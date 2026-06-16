// assets
import { IconBookmark, IconBrain, IconBookmarks } from '@tabler/icons-react';

// types
import type { NavItemType } from 'types';

// ==============================|| MENU ITEMS - STUDY ||============================== //

const icons = {
  IconBookmark,
  IconBrain,
  IconBookmarks
};

const study: NavItemType = {
  id: 'study',
  title: 'Study & Review',
  caption: 'Saved items & spaced repetition',
  icon: icons.IconBookmarks,
  type: 'group',
  children: [
    {
      id: 'bookmarks',
      title: 'Saved',
      type: 'item',
      url: '/bookmarks',
      icon: icons.IconBookmark
    },
    {
      id: 'review',
      title: 'Review',
      type: 'item',
      url: '/review',
      icon: icons.IconBrain
    }
  ]
};

export default study;
