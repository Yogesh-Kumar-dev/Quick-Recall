'use client';

import Fuse from 'fuse.js';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { type ReactNode, useMemo } from 'react';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import { Input } from '@/components/ui/input';
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from '@/types/content';
import ShareButton from './ShareButton';

const DIFFICULTY_BADGE: Record<NonNullable<Article['difficulty']>, string> = {
  basic: 'border-primary/40 text-primary',
  intermediate: 'border-[color:var(--chart-4)]/40 text-[color:var(--chart-4)]',
  advanced: 'border-destructive/40 text-destructive'
};

const FUSE_OPTIONS = {
  keys: ['title', 'summary'],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeMatches: true
};

// Fuse match indices are [start, end] pairs into the original string (end inclusive).
type MatchIndices = readonly (readonly [number, number])[];

// article id -> which character ranges matched in title / summary
type ArticleHighlights = Map<string, Partial<Record<'title' | 'summary', MatchIndices>>>;

function Highlighted({ text, indices }: { text: string; indices?: MatchIndices }) {
  if (!indices?.length) return text;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const [start, end] of [...indices].sort((a, b) => a[0] - b[0])) {
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <mark key={start} className="rounded-sm bg-primary text-primary-foreground">
        {text.slice(start, end + 1)}
      </mark>
    );
    cursor = Math.max(cursor, end + 1);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function CategoryChip({ active, label, count, onClick }: { active: boolean; label: string; count?: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/50'
      }`}
    >
      {label}
      {count != null && <span className="ml-1 opacity-60">{count}</span>}
    </button>
  );
}

// Filter state (?q, ?cat) lives in the URL via nuqs so filtered views are shareable/bookmarkable.
// Search + category filtering run client-side over the static article list with fuse.js.
export default function ArticlesIndexView({ articles }: Readonly<{ articles: Article[] }>) {
  const [q, setQ] = useQueryState('q', { defaultValue: '' });
  const [catParam, setCat] = useQueryState('cat', { defaultValue: 'all' });
  const cat = catParam === 'all' || ARTICLE_CATEGORIES.includes(catParam as ArticleCategory) ? catParam : 'all';

  const fuse = useMemo(() => new Fuse(articles, FUSE_OPTIONS), [articles]);

  // Search results plus the matched character ranges per field, for highlighting title/summary.
  const { bySearch, highlights } = useMemo(() => {
    const query = q.trim();
    if (!query) return { bySearch: articles, highlights: undefined as ArticleHighlights | undefined };
    const results = fuse.search(query);
    const map: ArticleHighlights = new Map();
    for (const result of results) {
      for (const match of result.matches ?? []) {
        if (match.key === 'title' || match.key === 'summary') {
          const existing = map.get(result.item.id) ?? {};
          map.set(result.item.id, { ...existing, [match.key]: match.indices });
        }
      }
    }
    return { bySearch: results.map((result) => result.item), highlights: map };
  }, [articles, fuse, q]);

  const counts = useMemo(() => {
    const map = Object.fromEntries(ARTICLE_CATEGORIES.map((c) => [c, 0])) as Record<string, number>;
    for (const article of bySearch) map[article.category] += 1;
    return map;
  }, [bySearch]);

  const visible = useMemo(() => (cat === 'all' ? bySearch : bySearch.filter((article) => article.category === cat)), [bySearch, cat]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Articles</h1>
        <p className="text-muted-foreground">
          Longer-form walkthroughs for when a note or flashcard isn&apos;t enough — build tooling, hosting, databases, PWAs, and more.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles…"
          aria-label="Search articles"
          className="w-full"
        />
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip active={cat === 'all'} label="All" count={bySearch.length} onClick={() => setCat('all')} />
          {ARTICLE_CATEGORIES.map((c) => (
            <CategoryChip key={c} active={cat === c} label={c} count={counts[c]} onClick={() => setCat(c)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {visible.map((article) => (
          <div key={article.id} className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
            <Link href={`/articles/${article.slug}`} className="block">
              <p className="font-semibold hover:text-primary">
                <Highlighted text={article.title} indices={highlights?.get(article.id)?.title} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                <Highlighted text={article.summary} indices={highlights?.get(article.id)?.summary} />
              </p>
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-primary/40 px-2 py-0.5 text-xs text-primary">{article.category}</span>
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
              <div className="flex items-center">
                <BookmarkButton kind="article" refId={article.slug} />
                <ShareButton title={article.title} text={article.summary} path={`/articles/${article.slug}`} />
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No articles match your search.
          </p>
        )}
      </div>
    </div>
  );
}
