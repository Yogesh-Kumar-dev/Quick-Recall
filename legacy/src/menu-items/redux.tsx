import { IconBrandRedux, IconBolt, IconCode } from '@tabler/icons-react';
import type { NavItemType } from 'types';

// ==============================|| MENU ITEMS - REDUX ||============================== //

const redux: NavItemType = {
  id: 'redux',
  title: 'Redux',
  caption: 'Redux Toolkit, RTK Query & Async Thunk',
  icon: IconBrandRedux,
  type: 'group',
  children: [
    {
      id: 'redux-notes',
      title: 'Redux Notes',
      type: 'item',
      url: '/redux/notes',
      icon: IconBrandRedux
    },
    {
      id: 'redux-toolkit',
      title: 'Redux Toolkit',
      type: 'item',
      url: '/redux/toolkit',
      icon: IconBrandRedux
    },
    {
      id: 'rtk-query',
      title: 'RTK Query',
      type: 'item',
      url: '/redux/rtk-query',
      icon: IconBolt
    },
    {
      id: 'create-async-thunk',
      title: 'createAsyncThunk',
      type: 'item',
      url: '/redux/async-thunk',
      icon: IconCode
    }
  ]
};

export default redux;
