import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NoteCard from '@/components/content/note-card';
import type { Note } from '@/types/content';

const baseNote: Note = {
  id: 'closures',
  title: 'Closures',
  summary: 'A function that retains access to its lexical scope even when executed outside that scope.',
  keyPoints: [
    'Created when a function is defined inside another function',
    'The inner function "closes over" variables from the outer function',
    'Enables data privacy and factory functions'
  ],
  difficulty: 'intermediate',
  category: 'core'
};

const meta = {
  title: 'Content/NoteCard',
  component: NoteCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof NoteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    note: {
      ...baseNote,
      id: 'variables',
      title: 'let vs const vs var',
      summary: 'Variable declaration keywords with different scoping and hoisting behavior.',
      keyPoints: ['var is function-scoped and hoisted', 'let is block-scoped', 'const is block-scoped and cannot be reassigned'],
      difficulty: 'basic',
      category: 'core'
    }
  }
};

export const Intermediate: Story = {
  args: { note: baseNote }
};

export const Advanced: Story = {
  args: {
    note: {
      ...baseNote,
      id: 'prototypal-inheritance',
      title: 'Prototypal Inheritance',
      summary: 'Objects can inherit properties from other objects via the prototype chain.',
      keyPoints: [
        'Every object has an internal [[Prototype]] link',
        'Property lookup walks the chain until found or undefined',
        'Object.create() sets the prototype explicitly'
      ],
      difficulty: 'advanced',
      category: 'core',
      textbookDef:
        'Prototypal inheritance is a feature in JavaScript where objects can inherit properties and methods from other objects through the prototype chain.',
      eli5: 'Think of it like a family tree. If you ask grandpa for money and he says "ask your dad," and your dad says "ask me," that\'s the prototype chain — you keep looking up until you find it.',
      gotcha: 'for...in loops iterate over inherited properties too — use Object.hasOwn() or hasOwnProperty() to filter.'
    }
  }
};

export const WithCodeSnippet: Story = {
  args: {
    note: {
      ...baseNote,
      codeSnippet: `function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.getCount();  // 1`
    }
  }
};

export const WithGotcha: Story = {
  args: {
    note: {
      ...baseNote,
      gotcha:
        'Closures can cause memory leaks if large objects are held in scope longer than needed. Clean up event listeners and timers in useEffect return functions.'
    }
  }
};

export const WithPrerequisites: Story = {
  args: {
    note: baseNote,
    prereqs: [
      { id: 'functions', title: 'Functions', url: '/js/notes?open=functions' },
      { id: 'scope', title: 'Scope', url: '/js/notes?open=scope' }
    ]
  }
};
