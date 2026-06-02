import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';

// ── problem component registry ──────────────────────────────────────────────
// Import each problem's server component here as they are created.
// The key is the slug that matches JsProblemEntry.slug in src/data/js-problems.ts

const PROBLEM_MAP: Record<string, () => Promise<{ default: ComponentType }>> = {
  debounce: () => import('views/js-machine-coding/Debounce'),
  throttle: () => import('views/js-machine-coding/Throttle'),
  'flatten-array': () => import('views/js-machine-coding/FlattenArray'),
  'deep-clone': () => import('views/js-machine-coding/DeepClone'),
  'promise-all': () => import('views/js-machine-coding/PromiseAll'),
  curry: () => import('views/js-machine-coding/Curry'),
  memoize: () => import('views/js-machine-coding/Memoize'),
  'custom-bind': () => import('views/js-machine-coding/CustomBind'),
  'group-by': () => import('views/js-machine-coding/GroupBy')
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const loader = PROBLEM_MAP[slug];
  if (!loader) notFound();

  const { default: ProblemComponent } = await loader();
  return <ProblemComponent />;
}

// Generate static params for known problems
export async function generateStaticParams() {
  return Object.keys(PROBLEM_MAP).map((slug) => ({ slug }));
}
