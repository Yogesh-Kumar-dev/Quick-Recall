'use client';

import { IconFilter } from '@tabler/icons-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import NoteFilters, { type FilterConfig, type FilterCounts } from './note-filters';

// desktop: sticky filter rail. mobile: a "Filters" button that opens the same controls in a slide-over
export default function FilterPanel({ categories, counts, ...config }: { categories: string[]; counts: FilterCounts } & FilterConfig) {
  const [open, setOpen] = useState(false);
  const [q] = useQueryState('q', { defaultValue: '' });
  const [cat] = useQueryState('cat', { defaultValue: 'all' });
  const [diff] = useQueryState('diff', { defaultValue: 'all' });
  const activeCount = (q ? 1 : 0) + (cat !== 'all' ? 1 : 0) + (diff !== 'all' ? 1 : 0);

  return (
    <>
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-4">
          <NoteFilters categories={categories} counts={counts} {...config} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="outline" size="sm" />}>
            <IconFilter size={14} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <NoteFilters categories={categories} counts={counts} {...config} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
