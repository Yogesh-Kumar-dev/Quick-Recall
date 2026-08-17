import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import type { Article, ArticleHeadingBlock } from '@/types/content';
import ArticleBlocks from './article-blocks';
import ArticleToc from './article-toc';

const DIFFICULTY_BADGE: Record<NonNullable<Article['difficulty']>, string> = {
  basic: 'border-primary/40 text-primary',
  intermediate: 'border-[color:var(--chart-4)]/40 text-[color:var(--chart-4)]',
  advanced: 'border-destructive/40 text-destructive'
};

export default function ArticleView({ article }: Readonly<{ article: Article }>) {
  const headings = article.blocks.filter((b): b is ArticleHeadingBlock => b.type === 'heading');

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_240px]">
      <div className="min-w-0">
        <div className="mb-6 flex items-start justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <p className="mt-2 text-muted-foreground">{article.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {article.difficulty && (
                <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${DIFFICULTY_BADGE[article.difficulty]}`}>
                  {article.difficulty}
                </span>
              )}
              {article.topics.map((topic) => (
                <span key={topic} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <BookmarkButton kind="article" refId={article.slug} />
        </div>
        <ArticleBlocks blocks={article.blocks} />
      </div>
      <ArticleToc headings={headings} />
    </div>
  );
}
