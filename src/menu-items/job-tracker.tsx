// assets
import { IconBriefcase } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - JOB TRACKER ||============================== //

const icons = {
  IconBriefcase
};

const jobTracker: NavItemType = {
  id: 'job-tracker',
  title: 'Job Tracker',
  icon: icons.IconBriefcase,
  type: 'group',
  url: '/job-tracker'
};

export default jobTracker;
