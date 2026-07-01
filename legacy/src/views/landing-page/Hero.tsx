'use client';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// next
import Link from 'next/link';
import Image from 'next/image';

// assets
import { IconArrowRight, IconBolt, IconArrowNarrowRight } from '@tabler/icons-react';

// project imports
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'config';

// ==============================|| LANDING - HERO ||============================== //

// `icon` is a simple-icons slug served by thesvg.org (/icons/<slug>/default.svg).
const TOPICS = [
  { label: 'HTML', icon: 'html5' },
  { label: 'CSS', icon: 'css' },
  { label: 'JavaScript', icon: 'javascript' },
  { label: 'TypeScript', icon: 'typescript' },
  { label: 'React', icon: 'react' },
  { label: 'Redux', icon: 'redux' },
  { label: 'Next.js', icon: 'nextdotjs' }
];

export default function Hero() {
  const theme = useTheme();
  const { mode } = useConfig();
  const isDark = mode === ThemeMode.DARK;

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 5, md: 6 }
      }}
    >
      {/* ambient gradient glow */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: isDark
            ? `radial-gradient(60% 50% at 50% 0%, ${theme.palette.primary.dark}33 0%, transparent 70%), radial-gradient(40% 40% at 85% 30%, ${theme.palette.secondary.dark}2e 0%, transparent 70%)`
            : `radial-gradient(60% 50% at 50% 0%, ${theme.palette.primary.light}99 0%, transparent 70%), radial-gradient(40% 40% at 85% 30%, ${theme.palette.secondary.light}80 0%, transparent 70%)`
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          {/* brand mark */}
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }}
            >
              <IconBolt size={22} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
              QuickRecall
            </Typography>
          </Stack>

          {/* soft-personal eyebrow */}
          <Chip
            icon={<IconBolt size={16} />}
            label="Personal developer knowledge base"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500, '& .MuiChip-icon': { ml: 1 } }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.25rem' },
              lineHeight: 1.1,
              maxWidth: 900,
              letterSpacing: '-0.02em'
            }}
          >
            Developer interview prep,{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              distilled.
            </Box>
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 400, color: 'text.secondary', maxWidth: 700, lineHeight: 1.6 }}>
            The one place I open to recall what I need. QuickRecall turns notes, blog posts, videos and docs into a single, searchable
            format — built for fast revision before interviews.
          </Typography>

          {/* The durable story, not a counter */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', pt: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Any source
            </Typography>
            <IconArrowNarrowRight size={20} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              one searchable format
            </Typography>
          </Stack>

          {/* topics covered — big brand logos */}
          <Stack
            direction="row"
            spacing={{ xs: 2.5, sm: 4 }}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            useFlexGap
            sx={{ maxWidth: 820, pt: 1 }}
          >
            {TOPICS.map((topic) => (
              <Box key={topic.label} sx={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                <Image src={`https://thesvg.org/icons/${topic.icon}/default.svg`} alt={topic.label} width={48} height={48} />
              </Box>
            ))}
          </Stack>

          <Box sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              component={Link}
              href="/dashboard"
              size="large"
              endIcon={<IconArrowRight size={20} className="cta-arrow" />}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                px: 4.5,
                py: 1.75,
                fontSize: '1.05rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                color: 'common.white',
                borderRadius: 999,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundSize: '200% 100%',
                boxShadow: `0 10px 30px -8px ${alpha(theme.palette.primary.main, 0.6)}`,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, background-position 0.6s ease',
                // sheen sweep
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-60%',
                  width: '40%',
                  height: '100%',
                  background: `linear-gradient(110deg, transparent, ${alpha('#fff', 0.35)}, transparent)`,
                  transform: 'skewX(-20deg)',
                  transition: 'left 0.6s ease'
                },
                '& .cta-arrow': { transition: 'transform 0.25s ease' },
                '&:hover': {
                  backgroundPosition: '100% 0',
                  transform: 'translateY(-3px)',
                  boxShadow: `0 16px 40px -8px ${alpha(theme.palette.primary.main, 0.75)}`
                },
                '&:hover::before': { left: '120%' },
                '&:hover .cta-arrow': { transform: 'translateX(4px)' }
              }}
            >
              Start preparing
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
