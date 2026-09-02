'use client';

import Cards from '@cloudscape-design/components/cards';
import Link from '@cloudscape-design/components/link';
import type { AwsCertification } from '@/data/aws/aws-certifications';
import type { AwsService } from '@/data/aws/aws-services';

export function AwsHub({ certifications, services }: Readonly<{ certifications: AwsCertification[]; services: AwsService[] }>) {
  return (
    <Cards
      cardDefinition={{
        header: (item) => <Link href={`/aws/${item.slug}`}>{item.name}</Link>,
        sections: [
          { id: 'fullName', content: (item) => item.fullName },
          {
            id: 'coverage',
            header: 'Services covered',
            content: (item) => services.filter((s) => s.cert.includes(item.id)).length
          }
        ]
      }}
      cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
      items={certifications}
      trackBy="id"
    />
  );
}
