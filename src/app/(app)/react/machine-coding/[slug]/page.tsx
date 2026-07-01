import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';

const PROBLEM_MAP: Record<string, () => Promise<{ default: ComponentType }>> = {
  counter: () => import('@/views/machine-coding/Counter')
};

export function generateStaticParams() {
  return Object.keys(PROBLEM_MAP).map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loader = PROBLEM_MAP[slug];
  if (!loader) notFound();
  const { default: Problem } = await loader();
  return <Problem />;
}
