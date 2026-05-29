'use client';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { IconInfoCircle } from '@tabler/icons-react';

export default function ReduxDevToolsHint() {
  return (
    <Tooltip
      title="Redux DevTools are embedded in this app — press Ctrl+H to open the panel, Ctrl+Q to change dock position."
      placement="bottom-end"
      arrow
    >
      <IconButton size="small" color="primary" aria-label="Redux DevTools hint">
        <IconInfoCircle size={18} />
      </IconButton>
    </Tooltip>
  );
}
