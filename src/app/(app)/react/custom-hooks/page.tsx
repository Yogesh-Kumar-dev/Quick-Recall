import CustomHooksView from '@/components/content/custom-hooks-view';

export const metadata = { title: 'Custom Hooks | QuickRecall' };

// Reading `searchParams` (even without using it directly below) forces this route to render
// dynamically instead of being statically prerendered — required so nuqs' client-side
// useQueryState (used by CustomHooksView for filters + the ?open=<id> deep-link) doesn't force a
// CSR bailout, which would otherwise strip this page's content out of the SSR HTML entirely. See
// the notes-view / quick-recall-view routes for the same pattern.
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await searchParams;
  return <CustomHooksView />;
}
