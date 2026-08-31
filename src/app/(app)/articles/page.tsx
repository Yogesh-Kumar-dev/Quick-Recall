import { Suspense } from 'react';
import ArticlesIndexView from '@/components/content/articles-index-view';
import { ARTICLES } from '@/data/articles-index';

export const metadata = { title: 'Articles | QuickRecall' };

export default function Page() {
  return (
    <Suspense>
      <ArticlesIndexView articles={ARTICLES} />
    </Suspense>
  );
}
