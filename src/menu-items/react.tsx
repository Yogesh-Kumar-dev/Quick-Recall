import { IconBolt, IconBook, IconBrandReact, IconCircleCheck, IconCode, IconFlame, IconSkull } from '@tabler/icons-react';
import { NavItemType } from 'types';

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
      url: '/react/concepts',
      icon: IconBook
    },
    {
      id: 'react-custom-hooks',
      title: 'Custom Hooks',
      type: 'item',
      url: '/react/custom-hooks',
      icon: IconCode
    },

    // ── Machine Coding ────────────────────────────────────────────────────────
    {
      id: 'react-mc',
      title: 'React Machine Coding',
      type: 'collapse',
      icon: IconCode,
      children: [
        {
          id: 'rmc-easy',
          title: '🟢 Easy',
          type: 'item',
          url: '/react/machine-coding?difficulty=easy',
          icon: IconCircleCheck
        },
        {
          id: 'rmc-medium',
          title: '🟡 Medium',
          type: 'item',
          url: '/react/machine-coding?difficulty=medium',
          icon: IconFlame
        },
        {
          id: 'rmc-hard',
          title: '🔴 Hard',
          type: 'item',
          url: '/react/machine-coding?difficulty=hard',
          icon: IconSkull
        }
      ]
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
