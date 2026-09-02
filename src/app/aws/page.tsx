import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import { AwsHub } from '@/components/aws/aws-hub';
import { awsCertifications } from '@/data/aws/aws-certifications';
import { awsServices } from '@/data/aws/aws-services';

export const metadata = { title: 'AWS Certification Prep | QuickRecall' };

export default function Page() {
  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Pick a certification to see its curated services, exam guide, and Well-Architected primer.">
          AWS Certification Prep
        </Header>
      }
    >
      <AwsHub certifications={awsCertifications} services={awsServices} />
    </ContentLayout>
  );
}
