import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FeatureDeepDiveView from '@/components/about/feature-deep-dive-view';
import { FEATURES, getFeature } from '@/data/about/about-features';

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return { title: 'Not Found | QuickRecall' };
  return { title: `${feature.title} | QuickRecall`, description: feature.deepDive.tagline };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  return <FeatureDeepDiveView feature={feature} />;
}
