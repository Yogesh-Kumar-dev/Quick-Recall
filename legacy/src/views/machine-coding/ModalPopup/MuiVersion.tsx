'use client';
/**
 * MODAL POPUP — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Uses MUI Dialog — compare with PlainVersion to see how MUI handles
 * the same isOpen state + close callbacks + accessibility.
 */
import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function ModalPopup() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        Modal Examples
      </Typography>

      <Stack direction="row" spacing={1.5}>
        <Button variant="contained" startIcon={<InfoOutlinedIcon />} onClick={() => setInfoOpen(true)}>
          Info Modal
        </Button>
        <Button variant="contained" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setConfirmOpen(true)}>
          Delete (Confirm)
        </Button>
      </Stack>

      {confirmed && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1,
            background: 'warning.lighter',
            bgcolor: '#fef9c3',
            color: '#854d0e',
            fontSize: 13,
            display: 'inline-block'
          }}
        >
          ✅ Item deleted (simulated)
        </Box>
      )}

      {/* Info Dialog */}
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>ℹ️ Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This modal closes on <strong>backdrop click</strong>, the close button, or the{' '}
            <kbd style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>Esc</kbd> key. MUI&apos;s Dialog
            handles all that for you.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setInfoOpen(false)}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>⚠️ Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action <strong>cannot be undone</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmed(true);
              setConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
