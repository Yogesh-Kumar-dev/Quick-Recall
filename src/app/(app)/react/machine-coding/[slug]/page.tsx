import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';

const PROBLEM_MAP: Record<string, () => Promise<{ default: ComponentType }>> = {
  counter: () => import('@/views/machine-coding/Counter'),
  'star-rating': () => import('@/views/machine-coding/StarRating'),
  accordion: () => import('@/views/machine-coding/Accordion'),
  todo: () => import('@/views/machine-coding/TodoApp'),
  'search-filter': () => import('@/views/machine-coding/SearchFilter'),
  dropdown: () => import('@/views/machine-coding/Dropdown'),
  'modal-popup': () => import('@/views/machine-coding/ModalPopup'),
  'form-handling': () => import('@/views/machine-coding/FormHandling'),
  'multi-step-form': () => import('@/views/machine-coding/MultiStepForm'),
  'api-data-fetching': () => import('@/views/machine-coding/APIDataFetching'),
  pagination: () => import('@/views/machine-coding/PaginationDemo'),
  'debounced-search': () => import('@/views/machine-coding/DebouncedSearch'),
  'otp-input': () => import('@/views/machine-coding/OTPInput'),
  tabs: () => import('@/views/machine-coding/TabsComponent'),
  'sequential-progress-bars': () => import('@/views/machine-coding/SequentialProgressBars'),
  'movie-seat-selection': () => import('@/views/machine-coding/MovieSeatSelection'),
  'product-filter': () => import('@/views/machine-coding/ProductFilter'),
  'sortable-table': () => import('@/views/machine-coding/SortableTable'),
  'infinite-scroll': () => import('@/views/machine-coding/InfiniteScroll'),
  'drag-and-drop': () => import('@/views/machine-coding/DragAndDrop'),
  'file-tree': () => import('@/views/machine-coding/FileTree'),
  'shopping-cart': () => import('@/views/machine-coding/ShoppingCart'),
  'virtualized-list': () => import('@/views/machine-coding/VirtualizedList')
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
