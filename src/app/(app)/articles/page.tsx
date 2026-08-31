import ArticlesIndexView from '@/components/content/articles-index-view';
import { ARTICLES } from '@/data/articles-index';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'Articles | QuickRecall' };

export default function Page() {
  return <ArticlesIndexView articles={ARTICLES} />;
}
