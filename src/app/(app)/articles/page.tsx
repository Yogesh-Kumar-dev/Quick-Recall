import ArticlesIndexView from '@/components/content/articles-index-view';
import { ARTICLES } from '@/data/articles-index';

export const metadata = { title: 'Articles | QuickRecall' };

export default function Page() {
  return <ArticlesIndexView articles={ARTICLES} />;
}
