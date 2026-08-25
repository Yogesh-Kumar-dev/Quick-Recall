import SettingsView from '@/components/settings/settings-view';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'Settings | QuickRecall' };

export default function Page() {
  return <SettingsView />;
}
