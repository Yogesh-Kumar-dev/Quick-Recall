import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { QuickReplyChips } from '@/components/mock-interview/chat/quick-reply-chips';

function QuickReplyChipsWrapper<T extends string>(props: React.ComponentProps<typeof QuickReplyChips<T>>) {
  const [selected, setSelected] = useState<T[]>(props.selected ?? []);
  return (
    <QuickReplyChips
      {...props}
      selected={selected}
      onToggle={(v) => setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))}
    />
  );
}

const meta = {
  title: 'MockInterview/QuickReplyChips',
  component: QuickReplyChipsWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-120">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof QuickReplyChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  args: {
    options: [
      { value: 'strengths', label: 'Strengths' },
      { value: 'weaknesses', label: 'Weaknesses' },
      { value: 'experience', label: 'Experience' },
      { value: 'goals', label: 'Goals' }
    ],
    selected: [],
    onToggle: () => {}
  }
};

export const MultiSelect: Story = {
  args: {
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'react', label: 'React' },
      { value: 'node', label: 'Node.js' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'css', label: 'CSS' }
    ],
    selected: ['javascript', 'react'],
    onToggle: () => {}
  }
};

export const WithAction: Story = {
  args: {
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'maybe', label: 'Not sure' }
    ],
    selected: ['yes'],
    onToggle: () => {},
    action: { label: 'Continue', onClick: () => {} }
  }
};
