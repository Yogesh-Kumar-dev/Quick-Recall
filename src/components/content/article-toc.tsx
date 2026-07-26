'use client';

import { useEffect, useState } from 'react';
import type { ArticleHeadingBlock } from '@/types/content';

// Sticky right-rail "On this page" nav with scroll-spy. Genuinely new pattern in this codebase
// (useIntersectionObserver only tracks one element) — kept local rather than a shared hook since
// there's no second scroll-spy consumer yet.
export default function ArticleToc({ headings }: { headings: ArticleHeadingBlock[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // A fixed "trigger line" near the top of the viewport, and the active heading is the LAST one
    // that has scrolled above it. This (rather than an IntersectionObserver watching a shrunk
    // top-of-viewport band) is what correctly handles the final heading(s): a heading near the end
    // of the article can hit the page's max scroll position before it ever reaches a band near the
    // viewport top, so a band-based observer would never mark it active even once the user has
    // genuinely scrolled to its section.
    const TRIGGER_LINE = 96;
    let rafId: number;

    const updateActive = () => {
      // Scrolled (near) the bottom of the page — always activate the last heading. Needed because a
      // short trailing section can leave less content below it than (viewport height − trigger line),
      // so its heading can hit the page's max scroll position without ever crossing the trigger line.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - TRIGGER_LINE > 0) break;
        current = el.id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-y-auto lg:block">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
      <ul className="space-y-1.5 border-l border-border pl-3 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${h.id}`}
              className={`block transition-colors ${activeId === h.id ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
