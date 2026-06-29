'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { IconFileText } from '@tabler/icons-react';

// Small header icon that opens the PDF viewer drawer. Mirrors PlaylistButton. Drop it anywhere; the
// consumer owns the open state via `onOpen` (or use the all-in-one PdfLauncher).

interface PdfButtonProps {
  onOpen: () => void;
  // Tooltip + aria-label text.
  label?: string;
  // Tabler icon size in px.
  size?: number;
}

export default function PdfButton({ onOpen, label = 'Open PDF guides', size = 20 }: PdfButtonProps) {
  return (
    <Tooltip title={label} placement="bottom-end" arrow>
      <IconButton size="small" onClick={onOpen} aria-label={label} sx={{ color: 'primary.main' }}>
        <IconFileText size={size} />
      </IconButton>
    </Tooltip>
  );
}
