import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ArticleFileTree from '@/components/content/article-file-tree'
import type { FileTreeNode } from '@/types/content'

const simpleTree: FileTreeNode[] = [
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
  { name: 'src/', type: 'folder', children: [
    { name: 'index.ts', type: 'file' },
    { name: 'app.ts', type: 'file' }
  ]}
]

const nestedTree: FileTreeNode[] = [
  { name: '.env.local', type: 'file', comment: 'secrets' },
  { name: 'next.config.ts', type: 'file' },
  { name: 'src/', type: 'folder', children: [
    { name: 'app/', type: 'folder', children: [
      { name: 'layout.tsx', type: 'file' },
      { name: 'page.tsx', type: 'file' },
      { name: '(app)/', type: 'folder', children: [
        { name: 'dashboard/', type: 'folder', children: [
          { name: 'page.tsx', type: 'file' }
        ]},
        { name: 'notes/', type: 'folder', children: [
          { name: 'page.tsx', type: 'file' },
          { name: '[section]/', type: 'folder', children: [
            { name: 'page.tsx', type: 'file' }
          ]}
        ]}
      ]}
    ]},
    { name: 'components/', type: 'folder', children: [
      { name: 'ui/', type: 'folder', children: [
        { name: 'button.tsx', type: 'file' },
        { name: 'card.tsx', type: 'file' }
      ]},
      { name: 'layout/', type: 'folder', children: [
        { name: 'app-sidebar.tsx', type: 'file' }
      ]}
    ]},
    { name: 'lib/', type: 'folder', children: [
      { name: 'utils.ts', type: 'file' },
      { name: 'db.ts', type: 'file' }
    ]}
  ]},
  { name: 'public/', type: 'folder', children: [
    { name: 'favicon.ico', type: 'file' },
    { name: 'icons/', type: 'folder', children: [
      { name: 'icon-192.png', type: 'file' },
      { name: 'icon-512.png', type: 'file' }
    ]}
  ]}
]

const meta = {
  title: 'Content/ArticleFileTree',
  component: ArticleFileTree,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ArticleFileTree>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    root: 'my-project',
    nodes: simpleTree
  }
}

export const DeeplyNested: Story = {
  args: {
    root: 'quickrecall',
    nodes: nestedTree
  }
}

export const WithoutRoot: Story = {
  args: {
    nodes: simpleTree
  }
}

export const SingleFile: Story = {
  args: {
    nodes: [{ name: 'README.md', type: 'file' }]
  }
}
