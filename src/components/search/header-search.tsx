'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { createSearchFuse, type SearchItem } from '@/data/search-index';

const MAX_RESULTS = 8;

// Global fuzzy search over problems, custom hooks, and pages (fuse.js — see src/data/search-index.ts),
// surfaced as a Cmd/Ctrl+K command palette. `shouldFilter={false}` on <Command> because we drive the
// result list ourselves from fuse's ranked matches instead of cmdk's built-in filter.
export default function HeaderSearch() {
  const router = useRouter();
  const fuse = useMemo(() => createSearchFuse(), []);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = useMemo(() => {
    if (!value.trim()) return [];
    return fuse
      .search(value)
      .slice(0, MAX_RESULTS)
      .map((r) => r.item);
  }, [fuse, value]);

  const sections = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const navigate = (item: SearchItem) => {
    router.push(item.url);
    setOpen(false);
    setValue('');
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 text-muted-foreground"
        aria-label="Search problems, hooks, pages"
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">Ctrl K</kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search problems, hooks, and pages"
        className="sm:max-w-xl"
      >
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search problems, hooks, pages…" value={value} onValueChange={setValue} />
          <CommandList>
            {value.trim() && <CommandEmpty>No results for &ldquo;{value}&rdquo;</CommandEmpty>}
            {Object.entries(sections).map(([section, items]) => (
              <CommandGroup key={section} heading={section}>
                {items.map((item) => (
                  <CommandItem key={item.id} value={item.id} onSelect={() => navigate(item)}>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">{item.label}</span>
                      {item.description && <span className="truncate text-xs text-muted-foreground">{item.description}</span>}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {item.difficulty && (
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {item.difficulty}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {item.kind}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
