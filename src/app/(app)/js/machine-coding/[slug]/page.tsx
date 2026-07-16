import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';

const PROBLEM_MAP: Record<string, () => Promise<{ default: ComponentType }>> = {
  debounce: () => import('@/views/js-machine-coding/Debounce'),
  throttle: () => import('@/views/js-machine-coding/Throttle'),
  'flatten-array': () => import('@/views/js-machine-coding/FlattenArray'),
  'deep-clone': () => import('@/views/js-machine-coding/DeepClone'),
  'promise-all': () => import('@/views/js-machine-coding/PromiseAll'),
  curry: () => import('@/views/js-machine-coding/Curry'),
  memoize: () => import('@/views/js-machine-coding/Memoize'),
  'custom-bind': () => import('@/views/js-machine-coding/CustomBind'),
  'group-by': () => import('@/views/js-machine-coding/GroupBy'),
  'electricity-bill': () => import('@/views/js-machine-coding/ElectricityBill'),
  'frequency-calculator': () => import('@/views/js-machine-coding/FrequencyCalculator'),
  'promise-race': () => import('@/views/js-machine-coding/PromiseRace'),
  'promise-any': () => import('@/views/js-machine-coding/PromiseAny'),
  'promise-all-settled': () => import('@/views/js-machine-coding/PromiseAllSettled'),
  'event-emitter': () => import('@/views/js-machine-coding/EventEmitter'),
  'lru-cache': () => import('@/views/js-machine-coding/LruCache'),
  'json-stringify': () => import('@/views/js-machine-coding/JsonStringify'),
  'deep-equal': () => import('@/views/js-machine-coding/DeepEqual'),
  'async-retry': () => import('@/views/js-machine-coding/AsyncRetry'),
  'pipe-compose': () => import('@/views/js-machine-coding/PipeCompose'),
  'array-chunk': () => import('@/views/js-machine-coding/ArrayChunk'),
  once: () => import('@/views/js-machine-coding/Once')
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
