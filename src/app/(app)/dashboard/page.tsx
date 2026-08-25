import DashboardView from '@/components/home/dashboard-view';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'Dashboard | QuickRecall' };

export default function Page() {
  return <DashboardView />;
}
