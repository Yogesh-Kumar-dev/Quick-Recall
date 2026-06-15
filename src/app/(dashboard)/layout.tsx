// project imports
import DashboardLayout from 'layout/MainLayout';
import ReviewReminderMount from 'views/review/ReviewReminderMount';
import { OfflineSectionGuard } from 'ui-component/pwa';
// import AuthGuard from 'utils/route-guard/AuthGuard';  // v1: auth disabled

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // v1: AuthGuard removed — re-enable by wrapping DashboardLayout with <AuthGuard>
    <DashboardLayout>
      {/* Fires the once-per-day "cards due" reminder app-wide (headless). */}
      <ReviewReminderMount />
      {/* PWA: when offline on an uncached route, show a helpful "not saved offline" panel with
          links to downloaded sections instead of a broken page. Pass-through when online/cached. */}
      <OfflineSectionGuard>{children}</OfflineSectionGuard>
    </DashboardLayout>
  );
}
