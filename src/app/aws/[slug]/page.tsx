import { notFound } from 'next/navigation';
import { AwsCertificationView } from '@/components/aws/aws-certification-view';
import { AwsRelatedNotes } from '@/components/aws/aws-related-notes';
import { awsCertifications } from '@/data/aws/aws-certifications';
import { awsNotes } from '@/data/aws/aws-notes';
import { awsServices } from '@/data/aws/aws-services';
import { AwsServiceDetailView } from '@/views/aws-services/aws-service-detail-view';

export function generateStaticParams() {
  return [...awsCertifications.map((c) => ({ slug: c.slug })), ...awsServices.map((s) => ({ slug: s.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cert = awsCertifications.find((c) => c.slug === slug);
  if (cert) return { title: `${cert.name} | AWS Certification Prep | QuickRecall` };
  const service = awsServices.find((s) => s.slug === slug);
  return { title: service ? `${service.title} | AWS Certification Prep | QuickRecall` : 'AWS Certification Prep | QuickRecall' };
}

export default async function Page({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  const cert = awsCertifications.find((c) => c.slug === slug);
  if (cert) return <AwsCertificationView cert={cert} />;

  const service = awsServices.find((s) => s.slug === slug);
  if (!service) notFound();

  const relatedNotes = service.relatedNoteIds?.length ? awsNotes.filter((n) => service.relatedNoteIds?.includes(n.id)) : [];

  return <AwsServiceDetailView service={service} notesSlot={<AwsRelatedNotes notes={relatedNotes} />} />;
}
