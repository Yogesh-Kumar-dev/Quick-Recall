import { IconBrandCss3, IconBrandJavascript, IconBrandNextjs, IconBrandReact, IconBrandRedux } from '@tabler/icons-react';
import InstagramLauncher from '@/components/instagram-launcher/instagram-launcher';
import { jsProblems } from '@/data/javascript/js-problems';
import { jsNotes } from '@/data/javascript/js-notes';
import { tsNotes } from '@/data/javascript/ts-notes';
import { reactNotes } from '@/data/react/react-notes';
import { reactMcProblems } from '@/data/react/react-mc-problems';
import { reduxNotes } from '@/data/redux/redux-notes';
import { reduxToolkitNotes } from '@/data/redux/redux-toolkit-notes';
import { rtkQueryNotes } from '@/data/redux/rtk-query-notes';
import { asyncThunkNotes } from '@/data/redux/async-thunk-notes';
import { nextjsNotes } from '@/data/nextjs/nextjs-notes';
import { nextjsRenderingNotes } from '@/data/nextjs/nextjs-rendering';
import { htmlNotes } from '@/data/htmlcss/html-notes';
import { cssNotes } from '@/data/htmlcss/css-notes';
import { DASHBOARD_INSTAGRAM } from '@/data/video-playlists';
import TopicStatCard from './topic-stat-card';

// ─── Difficulty tally helper ───────────────────────────────────────────────────

type Diff = { easy: number; medium: number; hard: number };

function tallyDifficulty(problems: { difficulty: string }[]): Diff {
  return problems.reduce<Diff>(
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

const OVERVIEW = [
  { label: 'Total Notes', value: totalNotes, color: '#016bf8' },
  { label: 'Machine Coding', value: totalProblems, color: '#b45af2' },
  { label: 'Easy', value: totalDiff.easy, color: '#00a35c' },
  { label: 'Medium', value: totalDiff.medium, color: '#ffc010' },
  { label: 'Hard', value: totalDiff.hard, color: '#db3030' }
];

// ==============================|| DASHBOARD ||============================== //

export default function DashboardView() {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-2">
        <div>
          <h1 className="font-heading text-3xl font-bold">Interview Prep</h1>
          <p className="mt-1 text-muted-foreground">
            Your personal reference for JavaScript, TypeScript, React, Redux, and Next.js — notes, machine coding, and cheat sheets.
          </p>
        </div>
        <InstagramLauncher links={DASHBOARD_INSTAGRAM} />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {OVERVIEW.map((o) => (
          <div
            key={o.label}
            className="min-w-[120px] flex-1 basis-[140px] rounded-lg border px-4 py-3"
            style={{ backgroundColor: `${o.color}14`, borderColor: `${o.color}38` }}
          >
            <p className="text-3xl leading-tight font-bold" style={{ color: o.color }}>
              {o.value}
            </p>
            <p className="text-sm text-muted-foreground">{o.label}</p>
          </div>
        ))}
      </div>

      {/* HTML&CSS top-left, React top-right, JS&TS spans both rows centered, Redux bottom-left,
          Next.js bottom-right (md+); plain stack below md */}
      <div className="grid items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3">
        <TopicStatCard
          className="md:col-start-1 md:row-start-1"
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

        <TopicStatCard
          className="md:col-start-3 md:row-start-1"
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
          className="md:col-start-2 md:row-start-1 md:row-span-2 md:h-auto md:self-center"
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
          className="md:col-start-1 md:row-start-2"
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
          className="md:col-start-3 md:row-start-2"
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
      </div>
    </div>
  );
}
