import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AiVoiceTools from '@/components/speak-up/ai-voice-tools';

const meta = {
  title: 'SpeakUp/AiVoiceTools',
  component: AiVoiceTools,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof AiVoiceTools>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
