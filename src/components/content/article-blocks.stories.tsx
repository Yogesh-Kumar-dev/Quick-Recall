import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ArticleBlocks from '@/components/content/article-blocks'
import type { ArticleBlock } from '@/types/content'

const sampleBlocks: ArticleBlock[] = [
  {
    type: 'heading',
    id: 'what-is-a-closure',
    level: 2,
    text: 'What is a Closure?'
  },
  {
    type: 'paragraph',
    text: 'A closure is a function that retains access to variables from its outer (lexical) scope, even after the outer function has returned.'
  },
  {
    type: 'callout',
    variant: 'tip',
    title: 'Key Insight',
    text: 'Every function in JavaScript creates a closure. You use them all the time, even if you don\'t call them "closures."'
  },
  {
    type: 'heading',
    id: 'example',
    level: 3,
    text: 'Practical Example'
  },
  {
    type: 'code',
    code: `function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}`,
    language: 'typescript'
  },
  {
    type: 'list',
    style: 'unordered',
    items: [
      'Closures enable data privacy',
      'They are used in module patterns',
      'Common in callbacks and event handlers'
    ]
  },
  {
    type: 'steps',
    items: [
      { title: 'Define outer function', text: 'Create a function with local variables.' },
      { title: 'Define inner function', text: 'Create a function that references those variables.' },
      { title: 'Return inner function', text: 'The inner function closes over the outer scope.' }
    ]
  },
  {
    type: 'filetree',
    root: 'src/',
    nodes: [
      { name: 'utils/', type: 'folder', children: [
        { name: 'counter.ts', type: 'file', comment: 'closure example' },
        { name: 'helpers.ts', type: 'file' }
      ]},
      { name: 'index.ts', type: 'file' }
    ]
  },
  {
    type: 'table',
    columns: ['Keyword', 'Scope', 'Hoisting'],
    rows: [
      ['var', 'Function', 'Yes'],
      ['let', 'Block', 'TDZ'],
      ['const', 'Block', 'TDZ']
    ]
  }
]

const meta = {
  title: 'Content/ArticleBlocks',
  component: ArticleBlocks,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
} satisfies Meta<typeof ArticleBlocks>

export default meta
type Story = StoryObj<typeof meta>

export const AllBlockTypes: Story = {
  args: { blocks: sampleBlocks }
}

export const HeadingsOnly: Story = {
  args: {
    blocks: [
      { type: 'heading', id: 'h1', level: 2, text: 'Section Title' },
      { type: 'heading', id: 'h2', level: 3, text: 'Subsection' }
    ]
  }
}

export const ParagraphsOnly: Story = {
  args: {
    blocks: [
      { type: 'paragraph', text: 'This is a simple paragraph of text.' },
      { type: 'paragraph', text: 'Another paragraph with more content to read.' }
    ]
  }
}

export const CodeOnly: Story = {
  args: {
    blocks: [
      { type: 'code', code: 'const greeting = "Hello, World!";\nconsole.log(greeting);', language: 'typescript' }
    ]
  }
}

export const ListTypes: Story = {
  args: {
    blocks: [
      { type: 'list', style: 'unordered', items: ['First item', 'Second item', 'Third item'] },
      { type: 'list', style: 'ordered', items: ['Step one', 'Step two', 'Step three'] }
    ]
  }
}

export const Empty: Story = {
  args: { blocks: [] }
}
