'use client';

import { useEffect, useState } from 'react';
import type { ArticleHeadingBlock } from '@/types/content';

// Right-rail "On this page" pane, styled after material-web.dev's docs TOC: a small label, the
// page title as an h2, a bullet-less top-level list and circle-marked nested lists. Scroll-spy
// listens on the article content pane (#article-scroll-pane) when it exists (desktop layout
// scrolls that pane instead of the window), falling back to window scroll otherwise.
export default function ArticleToc({ headings, title }: Readonly<{ headings: ArticleHeadingBlock[]; title: string }>) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const pane = document.getElementById('article-scroll-pane');

    // A "trigger line" below the top of the scrollport: the active heading is the LAST one that
    // has scrolled above it. This (rather than an IntersectionObserver watching a shrunk band)
    // correctly handles the final heading(s): a heading near the end of the article can hit max
    // scroll before it ever reaches the line, so we also force-activate the last heading at the
    // bottom of the scroller.
    let rafId: number;

    const updateActive = () => {
      const triggerLine = (pane?.getBoundingClientRect().top ?? 0) + 96;
      const atBottom = pane
        ? pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2
        : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const last = elements.at(-1);
        if (last) setActiveId(last.id);
        return;
      }

      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - triggerLine > 0) break;
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
    pane?.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      pane?.removeEventListener('scroll', onScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const linkClass = (id: string) =>
    `transition-colors ${activeId === id ? 'font-medium text-primary' : 'text-muted-foreground hover:text-primary hover:underline'}`;

  const sections = headings.reduce<{ heading: ArticleHeadingBlock; children: ArticleHeadingBlock[] }[]>((acc, h) => {
    if (h.level === 2) acc.push({ heading: h, children: [] });
    else if (acc.length > 0) acc.at(-1)?.children.push(h);
    return acc;
  }, []);

  return (
    <nav className="hidden w-62.5 shrink-0 overflow-hidden rounded-[28px] bg-card md:block">
      <div className="max-h-full overflow-y-auto p-6">
        <p className="text-[11px] text-muted-foreground">On this page:</p>
        <h2 className="mt-1 text-2xl font-medium">{title}</h2>
        <ol className="mt-4 list-none p-0 text-sm">
          {sections.map(({ heading, children }) => (
            <li key={heading.id} className="my-3">
              <a href={`#${heading.id}`} className={linkClass(heading.id)}>
                {heading.text}
              </a>
              {children.length > 0 && (
                <ol className="mt-2 list-[circle] pl-6">
                  {children.map((c) => (
                    <li key={c.id} className="my-2">
                      <a href={`#${c.id}`} className={linkClass(c.id)}>
                        {c.text}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
