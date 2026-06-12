'use client';

import useReviewDueReminder from './useReviewDueReminder';

// Headless mount for the once-per-day "cards due" reminder. Rendered once in the dashboard
// layout so the reminder logic runs app-wide regardless of which page is open. Renders nothing.

export default function ReviewReminderMount() {
  useReviewDueReminder();
  return null;
}
