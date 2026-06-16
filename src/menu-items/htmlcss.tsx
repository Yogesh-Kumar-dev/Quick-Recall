import { IconBrandHtml5, IconBrandCss3 } from '@tabler/icons-react';
import type { NavItemType } from 'types';

// ==============================|| MENU ITEMS - HTML & CSS ||============================== //

const htmlcss: NavItemType = {
  id: 'html-css',
  title: 'HTML & CSS',
  caption: 'Notes & Flashcards',
  icon: IconBrandHtml5,
  type: 'group',
  children: [
    {
      id: 'html-notes',
      title: 'HTML Notes',
      type: 'item',
      url: '/html-css/html',
      icon: IconBrandHtml5
    },
    {
      id: 'css-notes',
      title: 'CSS Notes',
      type: 'item',
      url: '/html-css/css',
      icon: IconBrandCss3
    }
  ]
};

export default htmlcss;
