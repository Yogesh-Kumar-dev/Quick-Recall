'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { navSections, primaryNav } from '@/config/nav';
import { getFeature } from '@/data/about/about-features';
import { articleBySlug } from '@/data/articles-index';
import { FLASHCARD_SETS } from '@/data/flashcard-sets';
import { jsProblems } from '@/data/javascript/js-problems';
import { QUIZ_SETS } from '@/data/quiz-sets';
import { reactMcProblems } from '@/data/react/react-mc-problems';

// Every static page's url→label, straight from the single nav config — one source of truth,
// no separate list to keep in sync as routes are added.
const STATIC_LABELS = new Map<string, string>([
  ...primaryNav.map((n): [string, string] => [n.url, n.title]),
  ...navSections.flatMap((s) => s.items.map((n): [string, string] => [n.url, n.title])),
  // Routes with no nav entry (not reachable from the sidebar, so nav.ts doesn't know them).
  ['/mock-interview/new', 'New Interview']
]);

// Resolvers for a dynamic route's leaf segment, tried by path prefix when the full path isn't in
// STATIC_LABELS. Each returns undefined if the segment doesn't resolve (removed/renamed content).
const DYNAMIC_RESOLVERS: { prefix: string; resolve: (segment: string) => string | undefined }[] = [
  { prefix: '/articles/', resolve: (slug) => articleBySlug.get(slug)?.title },
  { prefix: '/about/', resolve: (slug) => getFeature(slug)?.title },
  { prefix: '/js/machine-coding/', resolve: (slug) => jsProblems.find((p) => p.slug === slug)?.title },
  { prefix: '/react/machine-coding/', resolve: (slug) => reactMcProblems.find((p) => p.slug === slug)?.title },
  { prefix: '/flashcards/', resolve: (slug) => FLASHCARD_SETS[slug]?.title },
  { prefix: '/quiz/', resolve: (slug) => QUIZ_SETS[slug]?.title },
  // No static registry for a live interview session (per-device Dexie data) — same label for any id.
  { prefix: '/mock-interview/', resolve: () => 'Session' }
];

function humanize(segment: string): string {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Crumb {
  href: string;
  label: string;
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [];
  let cumulative = '';

  segments.forEach((segment, i) => {
    cumulative += `/${segment}`;
    const isLast = i === segments.length - 1;
    let label = STATIC_LABELS.get(cumulative);

    if (!label && isLast) {
      const resolver = DYNAMIC_RESOLVERS.find((r) => cumulative.startsWith(r.prefix));
      label = resolver?.resolve(segment) ?? humanize(segment);
    }

    // Intermediate segments with no matching page (e.g. the bare "/js" in "/js/notes") aren't
    // real routes — skip them instead of rendering a dead crumb.
    if (label) crumbs.push({ href: cumulative, label });
  });

  return crumbs;
}

// Renders at the top of the page content, above each page's own <h1>. Hidden on the dashboard
// itself, which is already "home".
export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/dashboard') return null;

  const crumbs = buildCrumbs(pathname);
  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb className="mb-4 min-w-0">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/dashboard" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem className={isLast ? 'min-w-0' : ''}>
                {isLast ? (
                  <BreadcrumbPage className="block truncate">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
