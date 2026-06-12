// project imports
import DashboardLayout from 'layout/MainLayout';
import ReviewReminderMount from 'views/review/ReviewReminderMount';
// import AuthGuard from 'utils/route-guard/AuthGuard';  // v1: auth disabled

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // v1: AuthGuard removed — re-enable by wrapping DashboardLayout with <AuthGuard>
    <DashboardLayout>
      {/* Fires the once-per-day "cards due" reminder app-wide (headless). */}
      <ReviewReminderMount />
      {children}
    </DashboardLayout>
  );
}
