import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SpeechPractice from '@/components/speak-up/speech-practice';

const meta = {
  title: 'SpeakUp/SpeechPractice',
  component: SpeechPractice,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    questionIndex: 0,
    onNextQuestion: () => {}
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof SpeechPractice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const QuestionTwo: Story = {
  args: {
    questionIndex: 1,
    onNextQuestion: () => {}
  }
};
