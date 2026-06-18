'use client';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CodeBlock from 'ui-component/interview-prep/CodeBlock';
import { LGCallout, LGCalloutVariant, LGExpandableCard } from 'ui-component/leafygreen';
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

      {codeSnippet && <CodeBlock code={codeSnippet} mb={warning ? 1.5 : 0} />}

      {warning && (
        <LGCallout variant={LGCalloutVariant.Warning} title="Watch out">
          {warning}
        </LGCallout>
      )}
    </Box>
  );
}

interface QuickRecallSectionProps {
  section: QRSection;
  defaultExpanded?: boolean;
}

export default function QuickRecallSection({ section, defaultExpanded = true }: QuickRecallSectionProps) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <LGExpandableCard defaultOpen={defaultExpanded} title={section.title}>
        <Stack divider={<Divider sx={{ my: 1 }} />}>
          {section.items.map((item, i) => (
            <QRItem key={i} {...item} />
          ))}
        </Stack>
      </LGExpandableCard>
    </Box>
  );
}
