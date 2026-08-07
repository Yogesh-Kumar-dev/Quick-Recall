import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BookOpen, Code, Layers, Zap } from 'lucide-react';
import TopicStatCard from '@/components/home/topic-stat-card';

const meta = {
  title: 'Home/TopicStatCard',
  component: TopicStatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-95">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof TopicStatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JavaScript: Story = {
  args: {
    icon: <Code className="size-5" />,
    title: 'JavaScript',
    description: 'Core language features, ES6+, async patterns, and the event loop.',
    accentColor: '#f7df1e',
    stats: [
      { label: 'Notes', value: 42 },
      { label: 'Flashcards', value: 85 },
      { label: 'Quiz Qs', value: 30 }
    ],
    difficulty: { easy: 15, medium: 20, hard: 7 },
    quickLinks: [
      { label: 'Closures', href: '/js/notes/closures' },
      { label: 'Promises', href: '/js/notes/promises' },
      { label: 'Event Loop', href: '/js/notes/event-loop' }
    ],
    primaryHref: '/js'
  }
};

export const React: Story = {
  args: {
    icon: <Zap className="size-5" />,
    title: 'React',
    description: 'Components, hooks, state management, and performance patterns.',
    accentColor: '#61dafb',
    stats: [
      { label: 'Notes', value: 38 },
      { label: 'Flashcards', value: 62 },
      { label: 'Quiz Qs', value: 25 }
    ],
    difficulty: { easy: 12, medium: 18, hard: 8 },
    quickLinks: [
      { label: 'useEffect', href: '/react/notes/use-effect' },
      { label: 'Memoization', href: '/react/notes/memoization' }
    ],
    primaryHref: '/react'
  }
};

export const WithoutDifficulty: Story = {
  args: {
    icon: <BookOpen className="size-5" />,
    title: 'Articles',
    description: 'In-depth walkthroughs and tutorials.',
    accentColor: '#00ed64',
    stats: [
      { label: 'Published', value: 8 },
      { label: 'Drafts', value: 3 }
    ],
    quickLinks: [{ label: 'All Articles', href: '/articles' }],
    primaryHref: '/articles'
  }
};

export const Minimal: Story = {
  args: {
    icon: <Layers className="size-5" />,
    title: 'Engineering',
    description: 'System design, databases, and general CS concepts.',
    accentColor: '#a78bfa',
    stats: [{ label: 'Topics', value: 15 }],
    quickLinks: [],
    primaryHref: '/engineering'
  }
};
