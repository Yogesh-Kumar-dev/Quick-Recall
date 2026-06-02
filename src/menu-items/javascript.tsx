import { IconBolt, IconBrandJavascript, IconBrandTypescript, IconCode } from '@tabler/icons-react';
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - JAVASCRIPT & TYPESCRIPT ||============================== //

const javascript: NavItemType = {
  id: 'javascript',
  title: 'JavaScript & TypeScript',
  caption: 'Notes, Problems & Quick Recall',
  icon: IconBrandJavascript,
  type: 'group',
  children: [
    {
      id: 'js-notes',
      title: 'JS Notes',
      type: 'item',
      url: '/js/notes',
      icon: IconBrandJavascript
    },
    {
      id: 'ts-notes',
      title: 'TS Notes',
      type: 'item',
      url: '/js/typescript',
      icon: IconBrandTypescript
    },
    {
      id: 'ts-for-react',
      title: 'TS for React',
      type: 'item',
      url: '/js/ts-for-react',
      icon: IconBrandTypescript
    },
    {
      id: 'js-machine-coding',
      title: 'JS Machine Coding',
      type: 'item',
      url: '/js/machine-coding',
      icon: IconCode
    },
    {
      id: 'js-quick-recall',
      title: 'Quick Recall ⚡',
      type: 'item',
      url: '/js/quick-recall',
      icon: IconBolt
    }
  ]
};

export default javascript;
