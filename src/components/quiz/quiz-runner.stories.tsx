import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import QuizRunner from '@/components/quiz/quiz-runner'
import type { QuizQuestion } from '@/types/content'

const sampleQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What will the following code log?',
    code: 'console.log(typeof NaN);',
    options: ['"NaN"', '"number"', '"undefined"', '"object"'],
    correctIndex: 1,
    explanation: 'NaN is of type "number" in JavaScript — Not-a-Number is still a numeric type.'
  },
  {
    id: 'q2',
    question: 'Which method creates a new array with elements that pass a test?',
    options: ['map()', 'filter()', 'reduce()', 'forEach()'],
    correctIndex: 1,
    explanation: 'filter() creates a new array with all elements that pass the provided testing function.'
  },
  {
    id: 'q3',
    question: 'What is a closure?',
    options: [
      'A way to close browser windows',
      'A function that retains access to its outer scope',
      'A method to end loops',
      'A type of error handling'
    ],
    correctIndex: 1,
    explanation: 'A closure is a function that "closes over" variables from its lexical scope.'
  },
  {
    id: 'q4',
    question: 'What does Array.prototype.reduce() return?',
    options: ['A new array', 'undefined', 'A single accumulated value', 'A boolean'],
    correctIndex: 2,
    explanation: 'reduce() executes a reducer function on each element, resulting in a single output value.'
  }
]

const meta = {
  title: 'Quiz/QuizRunner',
  component: QuizRunner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[640px]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof QuizRunner>

export default meta
type Story = StoryObj<typeof meta>

export const PracticeMode: Story = {
  args: {
    questions: sampleQuestions,
    source: 'js',
    title: 'JavaScript Basics'
  }
}

export const WithCodeQuestion: Story = {
  args: {
    questions: sampleQuestions,
    source: 'js',
    title: 'JavaScript Code Quiz'
  }
}

export const FewQuestions: Story = {
  args: {
    questions: sampleQuestions.slice(0, 2),
    source: 'js',
    title: 'Quick Quiz'
  }
}
