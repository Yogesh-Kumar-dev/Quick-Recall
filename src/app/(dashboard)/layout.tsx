// project imports
import DashboardLayout from 'layout/MainLayout';
import ReviewReminderMount from 'views/review/ReviewReminderMount';
import { OfflineSectionGuard } from 'ui-component/pwa';

// The shell (Breadcrumbs, NavItem) and nearly every page read URL search params via
// useSearchParams / nuqs to drive filters and active-item state. Under static prerendering that
// triggers Next's BAILOUT_TO_CLIENT_SIDE_RENDERING, shipping an empty shell so the real content
// (the LCP element) only paints after hydration — LCP ~6.6s. Rendering this segment dynamically
// lets useSearchParams resolve on the server, so the content lands in the initial HTML. TTFB is
// ~30ms on Vercel, so the static→dynamic trade is well worth the LCP win.
export const dynamic = 'force-dynamic';

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
