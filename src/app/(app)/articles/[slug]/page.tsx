import { notFound } from 'next/navigation';
import ArticleView from '@/components/content/article-view';
import { ARTICLES, articleBySlug } from '@/data/articles-index';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug.get(slug);
  return { title: article ? `${article.title} | QuickRecall` : 'Article | QuickRecall' };
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const article = articleBySlug.get(slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
