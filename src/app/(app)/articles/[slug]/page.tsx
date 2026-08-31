import { notFound } from 'next/navigation';
import ArticleView from '@/components/content/article-view';
import { ARTICLES, articleBySlug } from '@/data/articles-index';


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
