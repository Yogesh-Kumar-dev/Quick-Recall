// menu import
import dashboard from './dashboard';
import javascript from './javascript';
import react from './react';
import redux from './redux';
import nextjs from './nextjs';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, javascript, react, redux, nextjs]
};

export default menuItems;
