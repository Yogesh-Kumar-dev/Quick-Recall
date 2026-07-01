'use client';

import type { SyntheticEvent } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Slide, { type SlideProps } from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';

// assets
import CloseIcon from '@mui/icons-material/Close';

import type { KeyedObject } from 'types';
import { useDispatch, useSelector } from 'store';
import { closeSnackbar } from 'store/slices/snackbar';

// How long a snackbar stays before auto-hiding (ms). 5 minutes — long enough not to
// be missed; the close/UNDO button is always available to dismiss sooner.
const AUTO_HIDE_DURATION = 5 * 60 * 1000;

// animation function
function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
  return <Grow {...props} />;
}

// animation options
const animation: KeyedObject = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Fade
};

// ==============================|| SNACKBAR ||============================== //

// Note: this renders via MUI Snackbar/Alert (not LeafyGreen Toast). LeafyGreen Toast depends on
// react-transition-group without a `nodeRef`, which calls the removed `ReactDOM.findDOMNode` and
// crashes on React 19. MUI's transitions are React-19-safe, so the snackbar stays on MUI.
export default function Snackbar() {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);
  const { actionButton, anchorOrigin, alert, message, open, transition, variant, severity } = snackbar;

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <>
      {/* default snackbar */}
      {variant === 'default' && (
        <MuiSnackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={handleClose}
          message={message}
          slots={{ transition: animation[transition] }}
          action={
            <>
              <Button size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ mt: 0.25, mb: 0.5 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      )}

      {/* alert snackbar */}
      {variant === 'alert' && (
        <MuiSnackbar
          slots={{ transition: animation[transition] }}
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={handleClose}
        >
          <Alert
            severity={severity}
            variant={alert.variant}
            color={alert.color}
            action={
              <>
                {actionButton !== false && (
                  <Button
                    size="small"
                    onClick={handleClose}
                    sx={{
                      color: alert.color === 'success' || alert.color === 'warning' ? 'common.black' : 'common.white'
                    }}
                  >
                    UNDO
                  </Button>
                )}
                {/* Close icon is always shown so any toast can be dismissed instantly,
                    regardless of the `close` flag a caller passed. */}
                <IconButton
                  sx={{
                    color: alert.color === 'success' || alert.color === 'warning' ? 'common.black' : 'common.white'
                  }}
                  size="small"
                  aria-label="close"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
            sx={{
              '.MuiAlert-action': { mb: 0.5 },
              ...(alert.variant === 'outlined' && {
                bgcolor: 'background.paper'
              })
            }}
          >
            {message}
          </Alert>
        </MuiSnackbar>
      )}
    </>
  );
}
