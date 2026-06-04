import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBrandJavascript, IconBrandNextjs, IconBrandReact, IconBrandRedux } from '@tabler/icons-react';

import TopicStatCard from 'ui-component/interview-prep/TopicStatCard';
import { jsProblems, jsNotes, tsNotes } from 'data/javascript';
import { reactNotes, reactMcProblems } from 'data/react';
import { reduxNotes, reduxToolkitNotes, rtkQueryNotes, asyncThunkNotes } from 'data/redux';
import { nextjsNotes, nextjsRenderingNotes } from 'data/nextjs';

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

const jsDiff = tallyDifficulty(jsProblems);
const reactDiff = tallyDifficulty(reactMcProblems);

const totalNotes = jsNotesCount + reactNotes.length + reduxNotesCount + nextjsNotesCount;
const totalProblems = jsProblems.length + reactMcProblems.length;
const totalDiff: Diff = {
  easy: jsDiff.easy + reactDiff.easy,
  medium: jsDiff.medium + reactDiff.medium,
  hard: jsDiff.hard + reactDiff.hard
};

// ─── Overview strip data ─────────────────────────────────────────────────────────

const OVERVIEW = [
  { label: 'Total Notes', value: totalNotes, color: '#2196f3' },
  { label: 'Machine Coding', value: totalProblems, color: '#9c27b0' },
  { label: 'Easy', value: totalDiff.easy, color: '#4caf50' },
  { label: 'Medium', value: totalDiff.medium, color: '#ffc107' },
  { label: 'Hard', value: totalDiff.hard, color: '#f44336' }
];

// ==============================|| DASHBOARD PAGE ||============================== //

export default function DashboardPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Interview Prep
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your personal reference for JavaScript, TypeScript, React, Redux, and Next.js — notes, machine coding, and cheat sheets.
        </Typography>
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

      {/* Topic cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          alignItems: 'stretch'
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
  );
}
