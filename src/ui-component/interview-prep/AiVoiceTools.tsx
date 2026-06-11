'use client';

import Image from 'next/image';

// material-ui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// ─── External voice tools for extra practice ────────────────────────────────────
// `icon` is a simple-icons slug served by thesvg.org (/icons/<slug>/default.svg).

const PRACTICE_TOOLS = [
  {
    label: 'ChatGPT Voice',
    icon: 'openai',
    href: 'https://chatgpt.com/features/voice/',
    blurb: 'Hold a spoken mock interview and get instant follow-up questions.'
  },
  {
    label: 'Claude Voice',
    // Claude has no dedicated voice landing page — link to the official help article.
    icon: 'claude',
    href: 'https://support.claude.com/en/articles/11101966-using-voice-mode-on-claude-mobile-apps',
    blurb: 'Talk through answers out loud in the Claude mobile app.'
  },
  {
    label: 'Gemini Live',
    icon: 'gemini',
    href: 'https://gemini.google/overview/gemini-live/',
    blurb: 'Real-time back-and-forth voice conversations to rehearse with.'
  },
  {
    label: 'NotebookLM Audio',
    icon: 'notebooklm',
    href: 'https://notebooklm.google/audio',
    blurb: 'Turn your notes into an audio overview to review on the go.'
  }
];

// ==============================|| AI VOICE TOOLS ||============================== //

// Full-width row of external AI voice partners, shown below the rehearsal tool
// (YouTube-style — like a "related" strip under the player).

export default function AiVoiceTools() {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        Want a back-and-forth? Try an AI voice partner
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }
        }}
      >
        {PRACTICE_TOOLS.map((tool) => (
          <Link
            key={tool.label}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              color: 'text.primary',
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)', borderColor: theme.palette.primary.main, boxShadow: 2 }
            })}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha('#000', 0.04)
              }}
            >
              <Image src={`https://thesvg.org/icons/${tool.icon}/default.svg`} alt={tool.label} width={26} height={26} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                {tool.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                {tool.blurb}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
