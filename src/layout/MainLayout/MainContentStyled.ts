'use client';

// material-ui
import { styled } from '@mui/material/styles';

// project imports
import { MenuOrientation, ThemeMode } from 'config';
import { drawerWidth } from 'store/constant';

interface MainStyleProps {
  open: boolean;
  menuOrientation: MenuOrientation;
  borderRadius: number;
}

// ==============================|| MAIN LAYOUT - STYLED ||============================== //

const MainContentStyled = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'menuOrientation' && prop !== 'borderRadius'
})<MainStyleProps>(({ theme, open, menuOrientation, borderRadius }) => ({
  backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.dark[800] : theme.palette.grey[100],
  minWidth: '1%',
  width: '100%',
  minHeight: 'calc(100vh - 64px)',
  flexGrow: 1,
  padding: '20px 8px',
  marginTop: 64,
  marginLeft: 8,
  borderRadius: `${borderRadius}px`,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter + 200
    }),
    [theme.breakpoints.up('md')]: {
      marginRight: menuOrientation === MenuOrientation.VERTICAL ? -(drawerWidth - 72) : 20,
      width: menuOrientation === MenuOrientation.VERTICAL ? `calc(100% - 72px)` : `calc(100% - ${drawerWidth}px)`,
      marginTop: menuOrientation === MenuOrientation.HORIZONTAL ? 111 : 64
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter + 200
    }),
    marginRight: menuOrientation === MenuOrientation.HORIZONTAL ? 20 : 0,
    marginTop: menuOrientation === MenuOrientation.HORIZONTAL ? 111 : 64,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.up('md')]: {
      marginTop: menuOrientation === MenuOrientation.HORIZONTAL ? 111 : 64
    }
  }),
  [theme.breakpoints.down('md')]: {
    marginRight: 8,
    marginLeft: 8,
    padding: '16px 8px',
    marginTop: 64,
    ...(!open && {
      width: `calc(100% - ${drawerWidth}px)`
    })
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: 10,
    marginRight: 10
  }
}));

export default MainContentStyled;
