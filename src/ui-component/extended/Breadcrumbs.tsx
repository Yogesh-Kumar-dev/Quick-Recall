'use client';

// next
import Link from 'next/link';

import { usePathname, useSearchParams } from 'next/navigation';

import { CSSProperties, ReactElement, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';

// project imports
import { ThemeMode, ThemeDirection } from 'config';
import navigation from 'menu-items';
import useConfig from 'hooks/useConfig';
import { jsProblems } from 'data/javascript/js-problems';
import { reactMcProblems } from 'data/react/react-mc-problems';

// assets
import { IconChevronRight, IconTallymark1 } from '@tabler/icons-react';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

// types
import { NavItemType, OverrideIcon } from 'types';

interface BreadcrumbLinkProps {
  title: string;
  to?: string;
  icon?: string | OverrideIcon;
}

// ==============================|| BREADCRUMBS TITLE ||============================== //

function BTitle({ title }: { title: string }) {
  return (
    <Grid>
      <Typography variant="h4" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
    </Grid>
  );
}

// ==============================|| BREADCRUMBS ||============================== //

interface BreadCrumbSxProps extends CSSProperties {
  mb?: string;
  bgcolor?: string;
}

interface Props {
  card?: boolean;
  custom?: boolean;
  divider?: boolean;
  heading?: string;
  icon?: boolean;
  icons?: boolean;
  links?: BreadcrumbLinkProps[];
  maxItems?: number;
  rightAlign?: boolean;
  separator?: OverrideIcon;
  title?: boolean;
  titleBottom?: boolean;
  sx?: BreadCrumbSxProps;
}

export default function Breadcrumbs({
  card,
  custom = false,
  divider = false,
  heading,
  icon = true,
  icons,
  links,
  maxItems,
  rightAlign = true,
  separator = IconChevronRight,
  title = true,
  titleBottom,
  sx,
  ...others
}: Props) {
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { themeDirection } = useConfig();
  const [main, setMain] = useState<NavItemType | undefined>();
  const [item, setItem] = useState<NavItemType>();

  // Paths that have a landing/overview state driven by the ?difficulty param.
  // When the param is present the user is in the filtered list — inject an
  // "Overview" crumb that links back to the bare path (which shows the landing).
  const SECTION_PATHS = ['/js/notes', '/react/notes', '/js/machine-coding', '/react/machine-coding'];
  const isInSubState = !custom && SECTION_PATHS.includes(pathname) && (searchParams?.has('difficulty') ?? false);

  // Dynamic detail route: /js/machine-coding/<slug> has no menu entry, so the
  // tree match below never fires. Derive the trail from the problem registry.
  const jsMcDetailMatch = !custom ? /^\/js\/machine-coding\/([^/]+)\/?$/.exec(pathname) : null;
  const jsMcSlug = jsMcDetailMatch?.[1];
  const jsMcProblem = jsMcSlug ? jsProblems.find((p) => p.slug === jsMcSlug) : undefined;

  // React machine-coding detail route: /machine-coding/<slug> — same situation,
  // no menu entry, so derive the trail from the React problem registry.
  const reactMcDetailMatch = !custom ? /^\/machine-coding\/([^/]+)\/?$/.exec(pathname) : null;
  const reactMcSlug = reactMcDetailMatch?.[1];
  const reactMcProblem = reactMcSlug ? reactMcProblems.find((p) => p.slug === reactMcSlug) : undefined;

  const iconSX = {
    marginRight: 6,
    marginTop: -2,
    width: '1rem',
    height: '1rem',
    color: theme.palette.secondary.main
  };

  const linkSX = {
    display: 'flex',
    color: 'grey.900',
    textDecoration: 'none',
    alignContent: 'center',
    alignItems: 'center'
  };

  const customLocation = pathname;

  useEffect(() => {
    navigation?.items?.map((menu: NavItemType) => {
      if (menu.type && menu.type === 'group') {
        if (menu?.url && menu.url === customLocation) {
          setMain(menu);
          setItem(menu);
        } else {
          getCollapse(menu as { children: NavItemType[]; type?: string });
        }
      }
      return false;
    });
  });

  // set active item state
  const getCollapse = (menu: NavItemType) => {
    if (!custom && menu.children) {
      menu.children.filter((collapse: NavItemType) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse as { children: NavItemType[]; type?: string });
          if (collapse.url === customLocation) {
            setMain(collapse);
            setItem(collapse);
          }
        } else if (collapse.type && collapse.type === 'item') {
          if (customLocation === collapse.url) {
            setMain(menu);
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  // item separator
  const SeparatorIcon = separator!;
  const separatorIcon = separator ? <SeparatorIcon stroke={1.5} size="16px" /> : <IconTallymark1 stroke={1.5} size="16px" />;

  let mainContent;
  let itemContent;
  let breadcrumbContent: ReactElement = <Typography />;
  let itemTitle: NavItemType['title'] = '';
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (main && main.type === 'collapse') {
    CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon;
    mainContent = (
      <Typography
        {...(main.url && { component: Link, to: main.url })}
        variant="h6"
        noWrap
        sx={{
          overflow: 'hidden',
          lineHeight: 1.5,
          mb: -0.625,
          textOverflow: 'ellipsis',
          maxWidth: { xs: 102, sm: 'unset' },
          display: 'inline-block'
        }}
        color={typeof window !== 'undefined' && window.location.pathname === main.url ? 'text.primary' : 'text.secondary'}
      >
        {icons && <CollapseIcon style={{ ...iconSX, ...(themeDirection === ThemeDirection.RTL && { marginLeft: 6, marginRight: 0 }) }} />}
        {main.title}
      </Typography>
    );
  }

  if (!custom && main && main.type === 'collapse' && main.breadcrumbs === true) {
    breadcrumbContent = (
      <Card sx={card === false ? { mb: 3, bgcolor: 'transparent', ...sx } : { mb: 3, bgcolor: 'background.default', ...sx }} {...others}>
        <Box sx={{ p: 1.25, px: card === false ? 0 : 2 }}>
          <Grid
            container
            direction={rightAlign ? 'row' : 'column'}
            justifyContent={rightAlign ? 'space-between' : 'flex-start'}
            alignItems={rightAlign ? 'center' : 'flex-start'}
            spacing={1}
          >
            {title && !titleBottom && <BTitle title={main.title as string} />}
            <Grid>
              <MuiBreadcrumbs
                aria-label="breadcrumb"
                maxItems={maxItems || 8}
                separator={separatorIcon}
                sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
              >
                <Typography component={Link} href="/" color="textSecondary" variant="h6" sx={linkSX}>
                  {icons && <HomeTwoToneIcon style={iconSX} />}
                  {icon && !icons && <HomeIcon style={{ ...iconSX, marginRight: 0 }} />}
                  {(!icon || icons) && 'Dashboard'}
                </Typography>
                {mainContent}
              </MuiBreadcrumbs>
            </Grid>
            {title && titleBottom && <BTitle title={main.title as string} />}
          </Grid>
        </Box>
        {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
      </Card>
    );
  }

  // items
  if ((item && item.type === 'item') || (item?.type === 'group' && item?.url) || custom) {
    itemTitle = item?.title;

    ItemIcon = item?.icon ? item.icon : AccountTreeTwoToneIcon;
    itemContent = (
      <Typography
        variant="h6"
        noWrap
        sx={{
          ...linkSX,
          color: 'text.secondary',
          display: 'inline-block',
          overflow: 'hidden',
          lineHeight: 1.5,
          mb: -0.625,
          textOverflow: 'ellipsis',
          maxWidth: { xs: 102, sm: 'unset' }
        }}
      >
        {icons && <ItemIcon style={{ ...iconSX, ...(themeDirection === ThemeDirection.RTL && { marginLeft: 6, marginRight: 0 }) }} />}
        {itemTitle}
      </Typography>
    );

    let tempContent = (
      <MuiBreadcrumbs
        aria-label="breadcrumb"
        maxItems={maxItems || 8}
        separator={separatorIcon}
        sx={{ '& .MuiBreadcrumbs-separator': { width: 16, mx: 0.75 } }}
      >
        <Typography component={Link} href="/" color="textSecondary" variant="h6" sx={linkSX}>
          {icons && (
            <HomeTwoToneIcon style={{ ...iconSX, ...(themeDirection === ThemeDirection.RTL && { marginLeft: 6, marginRight: 0 }) }} />
          )}
          {icon && !icons && <HomeIcon style={{ ...iconSX, marginRight: 0 }} />}
          {(!icon || icons) && 'Dashboard'}
        </Typography>
        {mainContent}
        {isInSubState && (
          <Typography component={Link} href={pathname} variant="h6" sx={linkSX} color="text.secondary">
            Overview
          </Typography>
        )}
        {itemContent}
      </MuiBreadcrumbs>
    );

    if (custom && links && links?.length > 0) {
      tempContent = (
        <MuiBreadcrumbs
          aria-label="breadcrumb"
          maxItems={maxItems || 8}
          separator={separatorIcon}
          sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
        >
          {links?.map((link: BreadcrumbLinkProps, index: number) => {
            CollapseIcon = link.icon ? link.icon : AccountTreeTwoToneIcon;

            return (
              <Typography
                key={index}
                {...(link.to && { component: Link, href: link.to })}
                variant="h6"
                sx={linkSX}
                color={!link.to ? 'text.primary' : 'text.secondary'}
              >
                {link.icon && <CollapseIcon style={iconSX} />}
                {link.title}
              </Typography>
            );
          })}
        </MuiBreadcrumbs>
      );
    }

    // main
    if (item?.breadcrumbs !== false || custom) {
      breadcrumbContent = (
        <Card
          sx={
            card === false
              ? { mb: 3, bgcolor: 'transparent', ...sx }
              : { mb: 3, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'background.default', ...sx }
          }
          {...others}
        >
          <Box sx={{ p: 1.25, px: card === false ? 0 : 2 }}>
            <Grid
              container
              direction={rightAlign ? 'row' : 'column'}
              justifyContent={rightAlign ? 'space-between' : 'flex-start'}
              alignItems={rightAlign ? 'center' : 'flex-start'}
              spacing={1}
            >
              {title && !titleBottom && <BTitle title={custom ? (heading as string) : (item?.title as string)} />}
              <Grid>{tempContent}</Grid>
              {title && titleBottom && <BTitle title={custom ? (heading as string) : (item?.title as string)} />}
            </Grid>
          </Box>
          {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
        </Card>
      );
    }
  }

  // Dynamic JS machine-coding detail route — build the trail manually.
  if (jsMcSlug) {
    const detailTitle = jsMcProblem?.title ?? 'Problem';
    breadcrumbContent = (
      <Card
        sx={
          card === false
            ? { mb: 3, bgcolor: 'transparent', ...sx }
            : { mb: 3, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'background.default', ...sx }
        }
        {...others}
      >
        <Box sx={{ p: 1.25, px: card === false ? 0 : 2 }}>
          <Grid
            container
            direction={rightAlign ? 'row' : 'column'}
            justifyContent={rightAlign ? 'space-between' : 'flex-start'}
            alignItems={rightAlign ? 'center' : 'flex-start'}
            spacing={1}
          >
            {title && !titleBottom && <BTitle title={detailTitle} />}
            <Grid>
              <MuiBreadcrumbs
                aria-label="breadcrumb"
                maxItems={maxItems || 8}
                separator={separatorIcon}
                sx={{ '& .MuiBreadcrumbs-separator': { width: 16, mx: 0.75 } }}
              >
                <Typography component={Link} href="/" color="textSecondary" variant="h6" sx={linkSX}>
                  {icons && <HomeTwoToneIcon style={iconSX} />}
                  {icon && !icons && <HomeIcon style={{ ...iconSX, marginRight: 0 }} />}
                  {(!icon || icons) && 'Dashboard'}
                </Typography>
                <Typography component={Link} href="/js/machine-coding" variant="h6" sx={linkSX} color="text.secondary">
                  JS Machine Coding
                </Typography>
                <Typography variant="h6" sx={{ ...linkSX, color: 'text.primary' }}>
                  {detailTitle}
                </Typography>
              </MuiBreadcrumbs>
            </Grid>
            {title && titleBottom && <BTitle title={detailTitle} />}
          </Grid>
        </Box>
        {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
      </Card>
    );
  }

  // Dynamic React machine-coding detail route — build the trail manually.
  if (reactMcSlug) {
    const detailTitle = reactMcProblem?.title ?? 'Problem';
    breadcrumbContent = (
      <Card
        sx={
          card === false
            ? { mb: 3, bgcolor: 'transparent', ...sx }
            : { mb: 3, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'background.default', ...sx }
        }
        {...others}
      >
        <Box sx={{ p: 1.25, px: card === false ? 0 : 2 }}>
          <Grid
            container
            direction={rightAlign ? 'row' : 'column'}
            justifyContent={rightAlign ? 'space-between' : 'flex-start'}
            alignItems={rightAlign ? 'center' : 'flex-start'}
            spacing={1}
          >
            {title && !titleBottom && <BTitle title={detailTitle} />}
            <Grid>
              <MuiBreadcrumbs
                aria-label="breadcrumb"
                maxItems={maxItems || 8}
                separator={separatorIcon}
                sx={{ '& .MuiBreadcrumbs-separator': { width: 16, mx: 0.75 } }}
              >
                <Typography component={Link} href="/" color="textSecondary" variant="h6" sx={linkSX}>
                  {icons && <HomeTwoToneIcon style={iconSX} />}
                  {icon && !icons && <HomeIcon style={{ ...iconSX, marginRight: 0 }} />}
                  {(!icon || icons) && 'Dashboard'}
                </Typography>
                <Typography component={Link} href="/react/machine-coding" variant="h6" sx={linkSX} color="text.secondary">
                  React Machine Coding
                </Typography>
                <Typography variant="h6" sx={{ ...linkSX, color: 'text.primary' }}>
                  {detailTitle}
                </Typography>
              </MuiBreadcrumbs>
            </Grid>
            {title && titleBottom && <BTitle title={detailTitle} />}
          </Grid>
        </Box>
        {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
      </Card>
    );
  }

  return breadcrumbContent;
}
