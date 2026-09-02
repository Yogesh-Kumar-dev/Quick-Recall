import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { ReactNode } from 'react';
import type { AwsService } from '@/data/aws/aws-services';

function BulletList({ items }: Readonly<{ items: string[] }>) {
  return (
    <ul className="m-0 list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function AwsServiceDetailView({ service, notesSlot }: Readonly<{ service: AwsService; notesSlot?: ReactNode }>) {
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description={service.summary}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                {service.cert.map((c) => (
                  <Badge key={c} color={c === 'CLF-C02' ? 'blue' : 'green'}>
                    {c}
                  </Badge>
                ))}
              </SpaceBetween>
            }
          >
            {service.title}
          </Header>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Key Features</Header>}>
          <BulletList items={service.keyFeatures} />
        </Container>

        <Container header={<Header variant="h2">Common Exam Scenarios</Header>}>
          <BulletList items={service.useCases} />
        </Container>

        <Container header={<Header variant="h2">Pricing Model</Header>}>
          <Box>{service.pricingModel}</Box>
        </Container>

        {service.gotchas && service.gotchas.length > 0 && (
          <ExpandableSection headerText="Exam Gotchas" defaultExpanded variant="container">
            <BulletList items={service.gotchas} />
          </ExpandableSection>
        )}

        {notesSlot}
      </SpaceBetween>
    </ContentLayout>
  );
}
