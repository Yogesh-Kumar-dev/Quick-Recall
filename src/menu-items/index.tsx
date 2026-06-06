// menu import
import dashboard from './dashboard';
import javascript from './javascript';
import react from './react';
import htmlcss from './htmlcss';
import redux from './redux';
import nextjs from './nextjs';
import engineering from './engineering';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, htmlcss, javascript, react, redux, nextjs, engineering]
};

export default menuItems;
