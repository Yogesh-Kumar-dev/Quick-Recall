// menu import
import dashboard from './dashboard';
import javascript from './javascript';
import react from './react';
import htmlcss from './htmlcss';
import redux from './redux';
import nextjs from './nextjs';
import engineering from './engineering';
import about from './about';
import speakUp from './speak-up';
import jobTracker from './job-tracker';
import study from './study';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, about, study, jobTracker, speakUp, htmlcss, javascript, react, redux, nextjs, engineering]
};

export default menuItems;
