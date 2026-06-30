'use client';

import { type ReactNode, useEffect, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Header from './Header';
import Sidebar from './Sidebar';
import HorizontalBar from './HorizontalBar';
import MainContentStyled from './MainContentStyled';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import useDistractionAlert from 'hooks/useDistractionAlert';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

interface Props {
  children: ReactNode;
}

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout({ children }: Props) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { borderRadius, miniDrawer, menuOrientation } = useConfig();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  useEffect(() => {
    handlerDrawerOpen(!miniDrawer);
  }, [miniDrawer]);

  useEffect(() => {
    if (downMD) handlerDrawerOpen(false);
  }, [downMD]);

  useDistractionAlert();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  // horizontal menu-list bar : drawer
  const menu = useMemo(() => (isHorizontal ? <HorizontalBar /> : <Sidebar />), [isHorizontal]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* skip link — first focusable element; visually hidden until focused, then jumps to <main> */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 3,
          zIndex: (t) => t.zIndex.modal + 1,
          transform: 'translateY(-200%)',
          transition: 'transform .2s ease-in-out',
          '&:focus': { transform: 'translateY(0)' }
        }}
      >
        Skip to main content
      </Box>

      {/* header */}
      <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'background.default' }}>
        <Toolbar sx={{ py: 0, px: 2, minHeight: 64 }}>
          <Header />
        </Toolbar>
      </AppBar>

      {/* main content */}
      <MainContentStyled
        id="main-content"
        tabIndex={-1}
        sx={{ '&:focus': { outline: 'none' } }}
        {...{ borderRadius, menuOrientation, open: drawerOpen! }}
      >
        <Container
          maxWidth={false}
          sx={{ px: { xs: 0 }, mx: 0, minHeight: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column' }}
        >
          {/* breadcrumb */}
          <Breadcrumbs />
          {children}
        </Container>
      </MainContentStyled>

      {/* menu / drawer */}
      {menu}
    </Box>
  );
}
