// project imports
import DashboardLayout from 'layout/MainLayout';
// import AuthGuard from 'utils/route-guard/AuthGuard';  // v1: auth disabled

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // v1: AuthGuard removed — re-enable by wrapping DashboardLayout with <AuthGuard>
    <DashboardLayout>{children}</DashboardLayout>
  );
}
