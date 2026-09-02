'use client';

import AppLayout from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import type { SideNavigationProps } from '@cloudscape-design/components/side-navigation';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { awsCertifications } from '@/data/aws/aws-certifications';
import { awsServices } from '@/data/aws/aws-services';

// Well-Architected isn't tied to either certification (it's an AWS-wide framework both exams draw
// on), so it gets its own top-level nav entry instead of living inside a cert's tabs or being just
// another entry in a service category — excluded from the category loop below for the same reason.
const CATEGORIZED_SERVICES = awsServices.filter((s) => s.slug !== 'well-architected');

// Certifications first (the unit the user actually studies by), then the full service catalog
// grouped by category — mirrors the real console's left-hand service/resource nav so /aws/[slug]
// pages feel like switching sections inside one app rather than loading an unrelated page.
const NAV_ITEMS: SideNavigationProps.Item[] = [
  {
    type: 'section',
    text: 'Certifications',
    items: awsCertifications.map((c) => ({ type: 'link', text: c.name, href: `/aws/${c.slug}` }))
  },
  { type: 'link', text: 'Well-Architected', href: '/aws/well-architected' },
  ...Array.from(new Set(CATEGORIZED_SERVICES.map((s) => s.category))).map(
    (category): SideNavigationProps.Item => ({
      type: 'section',
      text: category,
      items: CATEGORIZED_SERVICES.filter((s) => s.category === category).map((s) => ({ type: 'link', text: s.title, href: `/aws/${s.slug}` }))
    })
  ),
  { type: 'divider' },
  { type: 'link', text: 'Exit to QuickRecall', href: '/dashboard' }
];

const ROOT_CRUMBS = [
  { text: 'QuickRecall', href: '/dashboard' },
  { text: 'AWS', href: '/aws' }
];

function useBreadcrumbItems(pathname: string | null) {
  const cert = awsCertifications.find((c) => `/aws/${c.slug}` === pathname);
  if (cert) return [...ROOT_CRUMBS, { text: cert.name, href: pathname ?? '/aws' }];

  const service = awsServices.find((s) => `/aws/${s.slug}` === pathname);
  if (service) return [...ROOT_CRUMBS, { text: service.title, href: pathname ?? '/aws' }];

  return ROOT_CRUMBS;
}

export function AwsAppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  return (
    <AppLayout
      toolsHide
      navigation={<SideNavigation activeHref={pathname ?? undefined} header={{ text: 'AWS Certification Prep', href: '/aws' }} items={NAV_ITEMS} />}
      breadcrumbs={<BreadcrumbGroup items={useBreadcrumbItems(pathname)} />}
      content={children}
    />
  );
}
