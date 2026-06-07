// assets
import { IconMicrophone } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SPEAK UP ||============================== //

const icons = {
  IconMicrophone
};

const speakUp: NavItemType = {
  id: 'speak-up',
  title: 'Speak Up',
  icon: icons.IconMicrophone,
  type: 'group',
  url: '/speak-up'
};

export default speakUp;
