'use client';

// third party
import { useLiveQuery } from 'dexie-react-hooks';

// material-ui
import Chip from '@mui/material/Chip';

// project imports
import * as reviewsRepository from 'views/review/reviewsRepository';

// Live "N due" count chip for the Review sidebar item. Ambient state, not a notification — it
// just sits there showing how many cards are waiting, updating across tabs via the Dexie live
// query. Renders nothing when no cards are due, so the menu item looks normal when you're caught
// up. This is the always-on signal that complements the once-per-day reminder.

export default function ReviewDueBadge() {
  const dueCount = useLiveQuery(() => reviewsRepository.countDue(Date.now()));

  if (!dueCount) return null;

  return <Chip color="primary" size="small" label={dueCount > 99 ? '99+' : dueCount} />;
}
