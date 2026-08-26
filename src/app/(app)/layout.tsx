import TopicGate from '@/components/access/topic-gate';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Breadcrumbs from '@/components/layout/breadcrumbs';
import { ProductTour } from '@/components/layout/product-tour';
import OfflineSectionGuard from '@/components/pwa/offline-section-guard';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Suspense } from 'react';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Skip link — first focusable element, visually hidden until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>

        <AppSidebar />
        <Suspense fallback={null}>
          <ProductTour />
        </Suspense>

        <SidebarInset>
          <AppHeader />
          <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col p-4 focus:outline-none md:p-6">
            <Breadcrumbs />
            <OfflineSectionGuard>
              <TopicGate>{children}</TopicGate>
            </OfflineSectionGuard>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
