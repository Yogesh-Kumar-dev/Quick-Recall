import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { IconBrandJavascript, IconBrandNextjs, IconBrandReact, IconBrandRedux } from '@tabler/icons-react';

import SectionLandingCard from 'ui-component/interview-prep/SectionLandingCard';
import type { SectionLink } from 'ui-component/interview-prep/SectionLandingCard';
import { jsProblems } from 'data/javascript/js-problems';
import { jsNotes } from 'data/javascript/js-notes';
import { tsNotes } from 'data/javascript/ts-notes';
import { reactNotes } from 'data/react/react-notes';

// ─── Section link configs ────────────────────────────────────────────────────

const jsLinks: SectionLink[] = [
  { label: '📗 JS Notes', href: '/js/concepts', badge: `${jsNotes.length} features` },
  { label: '📘 TS Notes', href: '/js/typescript', badge: `${tsNotes.length}` },
  { label: '📘 TS for React', href: '/js/ts-for-react' },
  { label: '🔧 JS Machine Coding', href: '/js/machine-coding', badge: `${jsProblems.length} problems` },
  { label: '⚡ Quick Recall', href: '/js/quick-recall' }
];

const reactLinks: SectionLink[] = [
  { label: '⚛️ React Notes', href: '/react/concepts', badge: `${reactNotes.length}` },
  { label: '🪝 Custom Hooks', href: '/react/custom-hooks' },
  { label: '🔧 React Machine Coding', href: '/machine-coding/counter', badge: '19 ✓' },
  { label: '⚡ Quick Recall', href: '/react/quick-recall' }
];

const reduxLinks: SectionLink[] = [
  { label: '🗄️ Redux Notes', href: '/redux/notes' },
  { label: '🛠️ Redux Toolkit', href: '/redux/toolkit' },
  { label: '⚡ RTK Query', href: '/redux/rtk-query' },
  { label: '🔄 createAsyncThunk', href: '/redux/async-thunk' }
];

const nextjsLinks: SectionLink[] = [
  { label: '▲ Next.js Notes', href: '/nextjs/notes' },
  { label: '🖥️ Rendering Strategies', href: '/nextjs/rendering' }
];

// ==============================|| DASHBOARD PAGE ||============================== //

export default function DashboardPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          🎯 Interview Prep
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your personal reference for JavaScript, TypeScript, React, Redux, and Next.js — notes, machine coding, and cheat sheets.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SectionLandingCard
            icon={<IconBrandJavascript size={28} />}
            title="JavaScript & TypeScript"
            description="ES6→ES2024 feature notes, TypeScript patterns, machine coding problems, and a quick-recall cheatsheet."
            links={jsLinks}
            accentColor="#f0db4f"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionLandingCard
            icon={<IconBrandReact size={28} />}
            title="React"
            description="React notes, custom hooks reference, 19 machine coding problems by difficulty, and a quick-recall cheatsheet."
            links={reactLinks}
            accentColor="#61dafb"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionLandingCard
            icon={<IconBrandRedux size={28} />}
            title="Redux"
            description="Core Redux concepts, Redux Toolkit (createSlice, configureStore), RTK Query, and createAsyncThunk patterns."
            links={reduxLinks}
            accentColor="#764abc"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionLandingCard
            icon={<IconBrandNextjs size={28} />}
            title="Next.js"
            description="App Router, Server Components, rendering strategies (SSR, SSG, ISR, CSR, PPR), and core Next.js concepts."
            links={nextjsLinks}
            accentColor="#000000"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
