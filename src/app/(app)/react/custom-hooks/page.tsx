import CustomHooksView from '@/components/content/custom-hooks-view';

export const metadata = { title: 'Custom Hooks | QuickRecall' };

// Reading searchParams forces dynamic rendering so nuqs' client-side useQueryState (filters +
// ?open= deep-link) doesn't CSR-bail and strip this page's content from the SSR HTML.
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await searchParams;
  return <CustomHooksView />;
}
