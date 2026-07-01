// material-ui
import type { AlertProps } from '@mui/material/Alert';
import type { SnackbarOrigin } from '@mui/material/Snackbar';

// ==============================|| SNACKBAR TYPES ||============================== //

export interface SnackbarProps {
  action: boolean;
  open: boolean;
  message: string;
  anchorOrigin: SnackbarOrigin;
  variant: string;
  alert: AlertProps;
  transition: string;
  close: boolean;
  dense: boolean;
  maxStack: number;
  iconVariant: string;
  hideIconVariant: boolean;
  actionButton: boolean;
  severity: 'error' | 'info' | 'success' | 'warning';
}
