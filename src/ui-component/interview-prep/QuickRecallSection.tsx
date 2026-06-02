'use client';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconAlertTriangle, IconChevronDown } from '@tabler/icons-react';
import type { QuickRecallSection as QRSection } from 'types/content';

interface QuickRecallItemProps {
  concept: string;
  bullets: string[];
  codeSnippet?: string;
  warning?: string;
}

function QRItem({ concept, bullets, codeSnippet, warning }: QuickRecallItemProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
        {concept}
      </Typography>
      <Box component="ul" sx={{ mt: 0, mb: codeSnippet || warning ? 1.5 : 0, pl: 2.5 }}>
        {bullets.map((b, i) => (
          <Box component="li" key={i} sx={{ mb: 0.15 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
              {b}
            </Typography>
          </Box>
        ))}
      </Box>

      {codeSnippet && (
        <Box
          component="pre"
          sx={{
            mb: warning ? 1.5 : 0,
            p: 1.5,
            borderRadius: 1,
            bgcolor: 'grey.900',
            color: 'grey.50',
            fontSize: 12,
            fontFamily: 'monospace',
            overflowX: 'auto',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap'
          }}
        >
          {codeSnippet}
        </Box>
      )}

      {warning && (
        <Box sx={{ p: 1.25, bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
          <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'warning.dark', display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
            <IconAlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              <strong>Watch out:</strong> {warning}
            </span>
          </Typography>
        </Box>
      )}
    </Box>
  );
}

interface QuickRecallSectionProps {
  section: QRSection;
  defaultExpanded?: boolean;
}

export default function QuickRecallSection({ section, defaultExpanded = true }: QuickRecallSectionProps) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <Accordion
      expanded={open}
      onChange={(_, v) => setOpen(v)}
      disableGutters
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px !important',
        '&:before': { display: 'none' },
        mb: 1.5
      }}
    >
      <AccordionSummary
        expandIcon={<IconChevronDown size={18} />}
        sx={{
          borderRadius: open ? '8px 8px 0 0' : '8px',
          bgcolor: 'action.hover',
          minHeight: 48,
          '& .MuiAccordionSummary-content': { my: 1 }
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {section.title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 2, pb: 2 }}>
        <Stack divider={<Divider sx={{ my: 1 }} />}>
          {section.items.map((item, i) => (
            <QRItem key={i} {...item} />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
