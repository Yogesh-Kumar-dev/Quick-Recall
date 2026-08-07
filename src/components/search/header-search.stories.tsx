import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HeaderSearch from '@/components/search/header-search';

const meta = {
  title: 'Search/HeaderSearch',
  component: HeaderSearch,
  parameters: { layout: 'centered' },
  tags: ['autodocs']
} satisfies Meta<typeof HeaderSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
