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
    <div className="flex h-[calc(100dvh-8.25rem)] min-h-0 flex-col gap-4 md:h-[calc(100dvh-9.25rem)] md:flex-row">
      <article id="article-scroll-pane" className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-[28px] bg-card">
        <div className="mx-auto w-full max-w-190 px-6 py-10 md:px-10 md:py-14 xl:max-w-240 2xl:max-w-275">
          <header className="mb-10">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-medium tracking-tight text-[44px] leading-[1.05] sm:text-[55px] xl:text-[88px]">{article.title}</h1>
              <BookmarkButton kind="article" refId={article.slug} />
            </div>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{article.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
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
          </header>
          <ArticleBlocks blocks={article.blocks} />
        </div>
      </article>
      <ArticleToc headings={headings} title={article.title} />
    </div>
  );
}
