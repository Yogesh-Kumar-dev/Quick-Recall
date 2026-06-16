import { IconBolt, IconBrandReact, IconCode } from '@tabler/icons-react';
import type { NavItemType } from 'types';

// ==============================|| MENU ITEMS - REACT ||============================== //

const react: NavItemType = {
  id: 'react',
  title: 'React',
  caption: 'Notes, Custom Hooks & Machine Coding',
  icon: IconBrandReact,
  type: 'group',
  children: [
    {
      id: 'react-notes',
      title: 'React Notes',
      type: 'item',
      url: '/react/notes',
      icon: IconBrandReact
    },
    {
      id: 'react-custom-hooks',
      title: 'Custom Hooks',
      type: 'item',
      url: '/react/custom-hooks',
      icon: IconCode
    },

    {
      id: 'react-machine-coding',
      title: 'React Machine Coding',
      type: 'item',
      url: '/react/machine-coding',
      icon: IconCode
    },

    {
      id: 'react-quick-recall',
      title: 'Quick Recall ⚡',
      type: 'item',
      url: '/react/quick-recall',
      icon: IconBolt
    }
  ]
};

export default react;
