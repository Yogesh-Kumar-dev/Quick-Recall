import { IconBrandNextjs, IconServer } from '@tabler/icons-react';
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - NEXT.JS ||============================== //

const nextjs: NavItemType = {
  id: 'nextjs',
  title: 'Next.js',
  caption: 'Notes & Rendering Strategies',
  icon: IconBrandNextjs,
  type: 'group',
  children: [
    {
      id: 'nextjs-notes',
      title: 'Next.js Notes',
      type: 'item',
      url: '/nextjs/notes',
      icon: IconBrandNextjs
    },
    {
      id: 'nextjs-rendering',
      title: 'Rendering Strategies',
      type: 'item',
      url: '/nextjs/rendering',
      icon: IconServer
    }
  ]
};

export default nextjs;
