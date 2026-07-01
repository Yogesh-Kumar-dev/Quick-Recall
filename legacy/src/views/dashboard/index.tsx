import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBrandCss3, IconBrandJavascript, IconBrandNextjs, IconBrandReact, IconBrandRedux } from '@tabler/icons-react';

import TopicStatCard from 'ui-component/interview-prep/TopicStatCard';
import { InstagramLauncher } from 'ui-component/instagram-launcher';
import { DASHBOARD_INSTAGRAM } from 'data/video-playlists';
import { jsProblems, jsNotes, tsNotes } from 'data/javascript';
import { reactNotes, reactMcProblems } from 'data/react';
import { reduxNotes, reduxToolkitNotes, rtkQueryNotes, asyncThunkNotes } from 'data/redux';
import { nextjsNotes, nextjsRenderingNotes } from 'data/nextjs';
import { htmlNotes, cssNotes } from 'data/htmlcss';

// ─── Difficulty tally helper ───────────────────────────────────────────────────

type Diff = { easy: number; medium: number; hard: number };

function tallyDifficulty(problems: { difficulty: string }[]): Diff {
  return problems.reduce(
    (acc, p) => {
      if (p.difficulty === 'easy') acc.easy += 1;
      else if (p.difficulty === 'medium') acc.medium += 1;
      else if (p.difficulty === 'hard') acc.hard += 1;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );
}

// ─── Derived counts ─────────────────────────────────────────────────────────────

const jsNotesCount = jsNotes.length + tsNotes.length;
const reduxNotesCount = reduxNotes.length + reduxToolkitNotes.length + rtkQueryNotes.length + asyncThunkNotes.length;
const nextjsNotesCount = nextjsNotes.length + nextjsRenderingNotes.length;
const htmlCssNotesCount = htmlNotes.length + cssNotes.length;

const jsDiff = tallyDifficulty(jsProblems);
const reactDiff = tallyDifficulty(reactMcProblems);

const totalNotes = jsNotesCount + reactNotes.length + reduxNotesCount + nextjsNotesCount + htmlCssNotesCount;
const totalProblems = jsProblems.length + reactMcProblems.length;
const totalDiff: Diff = {
  easy: jsDiff.easy + reactDiff.easy,
  medium: jsDiff.medium + reactDiff.medium,
  hard: jsDiff.hard + reactDiff.hard
};

// ─── Overview strip data ─────────────────────────────────────────────────────────

// MongoDB LeafyGreen palette: blue.base, purple.base, green.dark1, yellow.base, red.base
const OVERVIEW = [
  { label: 'Total Notes', value: totalNotes, color: '#016bf8' },
  { label: 'Machine Coding', value: totalProblems, color: '#b45af2' },
  { label: 'Easy', value: totalDiff.easy, color: '#00a35c' },
  { label: 'Medium', value: totalDiff.medium, color: '#ffc010' },
  { label: 'Hard', value: totalDiff.hard, color: '#db3030' }
];

// ==============================|| DASHBOARD PAGE ||============================== //

export default function DashboardPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Interview Prep
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your personal reference for JavaScript, TypeScript, React, Redux, and Next.js — notes, machine coding, and cheat sheets.
          </Typography>
        </Box>
        <InstagramLauncher links={DASHBOARD_INSTAGRAM} />
      </Box>

      {/* Overview strip */}
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        {OVERVIEW.map((o) => (
          <Box
            key={o.label}
            sx={{
              flex: '1 1 140px',
              minWidth: 120,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              bgcolor: alpha(o.color, 0.08),
              border: '1px solid',
              borderColor: alpha(o.color, 0.22)
            }}
          >
            <Typography variant="h3" fontWeight={700} sx={{ color: o.color, lineHeight: 1.1 }}>
              {o.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {o.label}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Topic cards — 4 corners with HTML & CSS centered in the middle column (md+) */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
          alignItems: 'stretch'
        }}
      >
        <Box sx={{ gridColumn: { md: '1' }, gridRow: { md: '1' } }}>
          <TopicStatCard
            icon={<IconBrandCss3 size={26} />}
            title="HTML & CSS"
            description="Semantic HTML notes, modern CSS layout and styling notes, plus flashcards for quick recall."
            accentColor="#e34f26"
            stats={[
              { label: 'Notes', value: htmlCssNotesCount },
              { label: 'Topics', value: 2 }
            ]}
            quickLinks={[
              { label: 'HTML Notes', href: '/html-css/html' },
              { label: 'CSS Notes', href: '/html-css/css' }
            ]}
            primaryHref="/html-css/html"
          />
        </Box>

        <Box sx={{ gridColumn: { md: '3' }, gridRow: { md: '1' } }}>
          <TopicStatCard
            icon={<IconBrandReact size={26} />}
            title="React"
            description="React notes, custom hooks reference, machine coding problems by difficulty, and a quick-recall cheatsheet."
            accentColor="#61dafb"
            stats={[
              { label: 'Notes', value: reactNotes.length },
              { label: 'Problems', value: reactMcProblems.length }
            ]}
            difficulty={reactDiff}
            quickLinks={[
              { label: 'React Notes', href: '/react/notes' },
              { label: 'Custom Hooks', href: '/react/custom-hooks' },
              { label: 'Machine Coding', href: '/react/machine-coding' },
              { label: 'Quick Recall', href: '/react/quick-recall' }
            ]}
            primaryHref="/react/notes"
          />
        </Box>

        {/* Centered card: middle column, spanning both rows on md+. Let the card size to
            its content (not stretch to fill the span) so the leftover height becomes
            balanced top/bottom margin around it. */}
        <Box
          sx={{
            gridColumn: { md: '2' },
            gridRow: { md: '1 / span 2' },
            display: 'flex',
            alignItems: 'center',
            // override TopicStatCard's height:100% on md+ so it shrinks to content
            '& > .MuiCard-root': { height: { md: 'auto' } }
          }}
        >
          <TopicStatCard
            icon={<IconBrandJavascript size={26} />}
            title="JavaScript & TypeScript"
            description="ES6→ES2024 feature notes, TypeScript patterns, machine coding problems, and a quick-recall cheatsheet."
            accentColor="#f0db4f"
            stats={[
              { label: 'Notes', value: jsNotesCount },
              { label: 'Problems', value: jsProblems.length }
            ]}
            difficulty={jsDiff}
            quickLinks={[
              { label: 'JS Notes', href: '/js/notes' },
              { label: 'TS Notes', href: '/js/typescript' },
              { label: 'Machine Coding', href: '/js/machine-coding' },
              { label: 'Quick Recall', href: '/js/quick-recall' }
            ]}
            primaryHref="/js/notes"
          />
        </Box>

        <Box sx={{ gridColumn: { md: '1' }, gridRow: { md: '2' } }}>
          <TopicStatCard
            icon={<IconBrandRedux size={26} />}
            title="Redux"
            description="Core Redux concepts, Redux Toolkit (createSlice, configureStore), RTK Query, and createAsyncThunk patterns."
            accentColor="#764abc"
            stats={[
              { label: 'Notes', value: reduxNotesCount },
              { label: 'Topics', value: 4 }
            ]}
            quickLinks={[
              { label: 'Redux Notes', href: '/redux/notes' },
              { label: 'Redux Toolkit', href: '/redux/toolkit' },
              { label: 'RTK Query', href: '/redux/rtk-query' },
              { label: 'Async Thunk', href: '/redux/async-thunk' }
            ]}
            primaryHref="/redux/notes"
          />
        </Box>

        <Box sx={{ gridColumn: { md: '3' }, gridRow: { md: '2' } }}>
          <TopicStatCard
            icon={<IconBrandNextjs size={26} />}
            title="Next.js"
            description="App Router, Server Components, rendering strategies (SSR, SSG, ISR, CSR, PPR), and core Next.js concepts."
            accentColor="#94a3b8"
            stats={[
              { label: 'Notes', value: nextjsNotesCount },
              { label: 'Topics', value: 2 }
            ]}
            quickLinks={[
              { label: 'Next.js Notes', href: '/nextjs/notes' },
              { label: 'Rendering', href: '/nextjs/rendering' }
            ]}
            primaryHref="/nextjs/notes"
          />
        </Box>
      </Box>
    </Box>
  );
}
