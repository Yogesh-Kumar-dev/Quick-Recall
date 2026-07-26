import Link from 'next/link';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import type { Article } from '@/types/content';

const DIFFICULTY_BADGE: Record<NonNullable<Article['difficulty']>, string> = {
  basic: 'border-primary/40 text-primary',
  intermediate: 'border-[color:var(--chart-4)]/40 text-[color:var(--chart-4)]',
  advanced: 'border-destructive/40 text-destructive'
};

export default function ArticlesIndexView({ articles }: { articles: Article[] }) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Articles</h1>
        <p className="text-muted-foreground">
          Longer-form walkthroughs for when a note or flashcard isn&apos;t enough — build tooling, hosting, databases, PWAs, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
            <Link href={`/articles/${article.slug}`} className="block">
              <p className="font-semibold hover:text-primary">{article.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{article.summary}</p>
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
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
              <BookmarkButton kind="article" refId={article.slug} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
