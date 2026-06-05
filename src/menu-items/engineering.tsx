import { IconCpu, IconNotes } from '@tabler/icons-react';
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - ENGINEERING ESSENTIALS ||============================== //

const engineering: NavItemType = {
  id: 'engineering',
  title: 'Engineering Essentials',
  caption: 'CS Fundamentals & Testing',
  icon: IconCpu,
  type: 'group',
  children: [
    {
      id: 'engineering-notes',
      title: 'Notes',
      type: 'item',
      url: '/engineering/notes',
      icon: IconNotes
    }
  ]
};

export default engineering;
