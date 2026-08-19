'use client';

import { IconLock } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Logo from '@/components/brand/logo';
import useTopicPreferences from '@/components/settings/use-topic-preferences';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { type NavLink, navSections, primaryNav } from '@/config/nav';

function isActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

const DISABLED_TOOLTIP = 'Module disabled. Visit Settings to change your preference.';

function NavItem({ item, pathname, disabled }: { item: NavLink; pathname: string; disabled?: boolean }) {
  const router = useRouter();

  if (!disabled) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive(pathname, item.url)}
          tooltip={item.title}
          data-tour={item.tourKey}
          render={<Link href={item.url} />}
        >
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Keep the item visible but inactive: no navigation, cursor-not-allowed, lock icon and a
  // tooltip. The button must stay pointer-event-active for the tooltip to trigger, so we use a
  // `data-disabled` marker + tabIndex -1 instead of `aria-disabled` (the sidebar button variant
  // maps aria-disabled to pointer-events: none, which would swallow hover too). Clicking gives
  // feedback instead of navigating.
  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger
          render={
            <SidebarMenuButton
              data-disabled="true"
              data-tour={item.tourKey}
              tabIndex={-1}
              className="cursor-not-allowed text-muted-foreground/60 opacity-70"
              onClick={() =>
                toast.info(DISABLED_TOOLTIP, {
                  action: {
                    label: 'Go to Settings',
                    onClick: () => router.push('/settings')
                  }
                })
              }
            >
              <item.icon />
              <span className="flex-1 text-left">{item.title}</span>
              <IconLock size={14} className="shrink-0" />
            </SidebarMenuButton>
          }
        />
        <TooltipContent side="right">{DISABLED_TOOLTIP}</TooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { prefs } = useTopicPreferences();

  if (pathname === '/') {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="px-2 py-1.5">
          <Logo size={20} withWordmark />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((item) => (
                <NavItem key={item.url} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navSections.map((section) => (
          <SidebarGroup key={section.id}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <NavItem
                    key={item.url}
                    item={item}
                    pathname={pathname}
                    disabled={item.topic !== undefined && prefs !== undefined && prefs[item.topic] === false}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
