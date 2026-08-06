import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useRef } from 'react'
import PracticeEditor, { type PracticeEditorHandle } from '@/components/machine-coding/practice-editor'

function PracticeEditorWrapper(props: Omit<React.ComponentProps<typeof PracticeEditor>, 'ref'>) {
  const ref = useRef<PracticeEditorHandle>(null)
  return <PracticeEditor {...props} ref={ref} />
}

const SAMPLE_CODE = `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}`

const meta = {
  title: 'MachineCoding/PracticeEditor',
  component: PracticeEditorWrapper,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    defaultValue: SAMPLE_CODE,
    language: 'javascript',
    onCopy: () => {}
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof PracticeEditorWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const JavaScript: Story = {
  args: { language: 'javascript' }
}

export const Jsx: Story = {
  args: {
    language: 'jsx',
    defaultValue: `function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`
  }
}

export const Empty: Story = {
  args: {
    defaultValue: '',
    language: 'javascript'
  }
}
