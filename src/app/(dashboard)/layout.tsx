// project imports
import DashboardLayout from 'layout/MainLayout';
import ReviewReminderMount from 'views/review/ReviewReminderMount';
import { OfflineSectionGuard } from 'ui-component/pwa';

// `output: 'export'` requires every segment to be statically renderable, so this must be static.
// Tradeoff: the shell (Breadcrumbs, NavItem) and pages that read URL search params via
// useSearchParams / nuqs will hit Next's BAILOUT_TO_CLIENT_SIDE_RENDERING and only paint the
// real content after hydration (the LCP regression the old force-dynamic avoided). There is no
// server at request time under static export, so that regression is unavoidable here.
export const dynamic = 'force-static';

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {/* Fires the once-per-day "cards due" reminder app-wide (headless). */}
      <ReviewReminderMount />
      {/* PWA: when offline on an uncached route, show a helpful "not saved offline" panel with
          links to downloaded sections instead of a broken page. Pass-through when online/cached. */}
      <OfflineSectionGuard>{children}</OfflineSectionGuard>
    </DashboardLayout>
  );
}
