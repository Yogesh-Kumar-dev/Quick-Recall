import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PracticePanel from '@/components/machine-coding/practice-panel';
import type { PracticeSession } from '@/components/machine-coding/use-practice-session';

const idleSession: PracticeSession = {
  status: 'idle',
  secondsLeft: 0,
  startedAt: 0,
  start: () => {},
  submit: () => {},
  reset: () => {},
  markGraded: () => {}
};

const activeSession: PracticeSession = {
  status: 'active',
  secondsLeft: 847,
  startedAt: Date.now() - 353000,
  start: () => {},
  submit: () => {},
  reset: () => {},
  markGraded: () => {}
};

const submittedSession: PracticeSession = {
  status: 'submitted',
  secondsLeft: 0,
  startedAt: Date.now() - 1500000,
  start: () => {},
  submit: () => {},
  reset: () => {},
  markGraded: () => {}
};

const gradedSession: PracticeSession = {
  status: 'graded',
  secondsLeft: 0,
  startedAt: Date.now() - 1500000,
  start: () => {},
  submit: () => {},
  reset: () => {},
  markGraded: () => {}
};

const sampleSolution = `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`;

const meta = {
  title: 'MachineCoding/PracticePanel',
  component: PracticePanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[640px]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof PracticePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    session: idleSession,
    solutionCode: sampleSolution,
    language: 'javascript'
  }
};

export const Active: Story = {
  args: {
    session: activeSession,
    solutionCode: sampleSolution,
    language: 'javascript'
  }
};

export const Submitted: Story = {
  args: {
    session: submittedSession,
    solutionCode: sampleSolution,
    language: 'javascript'
  }
};

export const Graded: Story = {
  args: {
    session: gradedSession,
    solutionCode: sampleSolution,
    language: 'javascript'
  }
};
