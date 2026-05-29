// This is example of menu item without group for horizontal layout. There will be no children.

// assets
import { IconBrandChrome } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const icons = {
  IconBrandChrome
};
const dashboard: NavItemType = {
  id: 'dashboard',
  title: 'dashboard',
  icon: icons.IconBrandChrome,
  type: 'group',
  url: '/dashboard'
};

export default dashboard;
