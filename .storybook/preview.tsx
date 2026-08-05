import type { Preview } from '@storybook/nextjs-vite'
import { themes } from 'storybook/theming'
import '../src/app/globals.css'

// QuickRecall is dark-mode-only. The app's design tokens live in globals.css on
// :root (no .dark override), but dark: variants need a .dark ancestor. Wrap every
// story in one and drop it on the real app surface so components render as they
// do in the app.
const decorators: Preview['decorators'] = [
  (Story) => (
    <div className="dark min-h-full bg-background p-10 text-foreground">
      <Story />
    </div>
  )
]

const preview: Preview = {
  decorators,
  parameters: {
    // Match Storybook's own chrome (docs pages, tables, typography) to the app's
    // dark-only theme; the canvas itself is themed by the decorator above.
    theme: themes.dark,
    docs: {
      theme: themes.dark
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  }
}

export default preview
