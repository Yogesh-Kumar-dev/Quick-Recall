import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FlashcardCarousel from '@/components/flashcards/FlashcardCarousel';
import type { Flashcard } from '@/types/content';

const sampleCards: Flashcard[] = [
  { id: '1', front: 'What is a closure?', back: 'A function that retains access to its lexical scope.' },
  { id: '2', front: 'What does `typeof null` return?', back: '"object" — a long-standing bug in JavaScript.' },
  {
    id: '3',
    front: 'What is the event loop?',
    back: 'The mechanism that handles async callbacks by checking the call stack and task queue.'
  },
  { id: '4', front: 'What is `===` vs `==`?', back: 'Strict equality checks type + value; loose equality performs type coercion first.' },
  {
    id: '5',
    front: 'What is hoisting?',
    back: 'Variable and function declarations are moved to the top of their scope during compilation.'
  }
];

const cardsWithCode: Flashcard[] = [
  {
    id: 'code-1',
    front: 'What does this log?',
    back: '[1, 2, 3] — map returns a new array.',
    code: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(doubled);`
  },
  {
    id: 'code-2',
    front: 'What is the output?',
    back: '"referenceerror" — let variables are not hoisted like var.',
    code: `console.log(x);
let x = 5;`
  }
];

const meta = {
  title: 'Flashcards/FlashcardCarousel',
  component: FlashcardCarousel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-150">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof FlashcardCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallDeck: Story = {
  args: {
    cards: sampleCards,
    source: 'js',
    title: 'JavaScript Fundamentals'
  }
};

export const WithCodeBack: Story = {
  args: {
    cards: cardsWithCode,
    source: 'js',
    title: 'Code Questions'
  }
};

export const SingleCard: Story = {
  args: {
    cards: [sampleCards[0]],
    source: 'js'
  }
};

export const EmptyDeck: Story = {
  args: {
    cards: [],
    source: 'js'
  }
};
