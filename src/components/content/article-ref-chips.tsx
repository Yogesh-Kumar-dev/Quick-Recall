'use client';

import Link from 'next/link';
import { resolveArticleRefs } from '@/data/articles-index';

// Shared chip row for a set of deep-links, used for both a note's `prerequisites` ("Builds on")
// and any content item's `articleRefs` ("Read more"). Renders nothing if there's nothing to link.
export function LinkChips({
  label,
  links,
  onLinkClick
}: {
  label: string;
  links: { id: string; title: string; url: string }[];
  onLinkClick?: (e: React.MouseEvent) => void;
}) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          onClick={onLinkClick}
          className="rounded-full border border-border px-2 py-0.5 text-xs text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}

// Resolves a content item's `articleRefs` ids and renders them as "Read more" chips.
export default function ArticleRefChips({ ids, onLinkClick }: { ids?: string[]; onLinkClick?: (e: React.MouseEvent) => void }) {
  const links = resolveArticleRefs(ids);
  return <LinkChips label="Read more" links={links} onLinkClick={onLinkClick} />;
}
