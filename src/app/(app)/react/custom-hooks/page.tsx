import CustomHooksView from '@/components/content/custom-hooks-view';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'Custom Hooks | QuickRecall' };

// Reading searchParams forces dynamic rendering so nuqs' client-side useQueryState (filters +
// ?open= deep-link) doesn't CSR-bail and strip this page's content from the SSR HTML.
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await searchParams;
  return <CustomHooksView />;
}
