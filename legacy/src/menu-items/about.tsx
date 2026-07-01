// assets
import { IconInfoCircle } from '@tabler/icons-react';

// types
import type { NavItemType } from 'types';

// ==============================|| MENU ITEMS - ABOUT ||============================== //

const icons = {
  IconInfoCircle
};

const about: NavItemType = {
  id: 'about',
  title: 'About',
  icon: icons.IconInfoCircle,
  type: 'group',
  url: '/about'
};

export default about;
