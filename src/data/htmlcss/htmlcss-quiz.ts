import type { QuizQuestion } from '@/types/content';

// ─── HTML & CSS quiz — multiple choice ─────────────────────────────────────

export const htmlcssQuiz: QuizQuestion[] = [
  {
    id: 'htmlcss-q-doctype',
    question: 'What does `<!DOCTYPE html>` do?',
    options: [
      'Loads the HTML5 polyfill library',
      'Tells the browser to use standards mode instead of legacy "quirks" mode',
      'Declares the character encoding',
      'Defines the page title shown in the browser tab'
    ],
    correctIndex: 1,
    explanation: 'It must be the first line of the document — it is a browser instruction, not an HTML tag.',
    category: 'HTML'
  },
  {
    id: 'htmlcss-q-block-inline',
    question: 'Which pair correctly describes block vs inline elements?',
    options: [
      'Block elements flow within a line; inline elements start on a new line',
      'Block elements start on a new line and take full width; inline elements flow within a line, sized to content',
      'Both behave identically unless styled with display',
      'Only inline elements respect the width/height CSS properties'
    ],
    correctIndex: 1,
    explanation: '`<div>`/`<p>` are block by default; `<span>`/`<a>` are inline and ignore width/height unless their display is changed.',
    category: 'HTML'
  },
  {
    id: 'htmlcss-q-code-viewport',
    question: 'What does this meta tag enable?',
    code: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    options: [
      'It blocks the page from being zoomed at all',
      'It makes the page use the device\'s real width at 100% zoom — the prerequisite for CSS media queries to work on mobile',
      'It sets the default font size for the page',
      'It is only needed for iOS devices'
    ],
    correctIndex: 1,
    explanation: 'Without this tag, mobile browsers render at a desktop-width virtual viewport and scale down.',
    category: 'HTML'
  },
  {
    id: 'htmlcss-q-alt-text',
    question: 'Why does an `<img>` need an `alt` attribute?',
    options: [
      'It is purely optional and has no functional purpose',
      'It describes the image for screen readers and displays if the image fails to load',
      'It is required for the image to be cached by the browser',
      'It sets the image\'s aspect ratio'
    ],
    correctIndex: 1,
    explanation: 'Use a meaningful description for informative images, or `alt=""` for purely decorative ones.',
    category: 'HTML'
  },
  {
    id: 'htmlcss-q-defer-async',
    question: 'What is the difference between `<script defer>` and `<script async>`?',
    options: [
      'They behave identically in every browser',
      'defer downloads in parallel and runs after parsing, in order; async runs as soon as it\'s ready, order not guaranteed',
      'async blocks HTML parsing; defer never does',
      'defer only works for external scripts, async only for inline scripts'
    ],
    correctIndex: 1,
    explanation: 'defer is the right choice for app code that depends on DOM order; async suits independent scripts like analytics.',
    category: 'HTML'
  },
  {
    id: 'htmlcss-q-semantic-html',
    question: 'What is the main benefit of using semantic elements like `<nav>`, `<main>`, `<article>` instead of `<div>` everywhere?',
    options: [
      'They render faster than divs',
      'They convey meaning — giving accessibility landmarks, better SEO, and more readable markup',
      'They automatically apply default styling',
      'They are required for CSS Grid to work'
    ],
    correctIndex: 1,
    explanation: 'Screen readers use semantic landmarks for navigation, and search engines use them to understand page structure.',
    category: 'HTML'
  },
  {
    id: 'htmlcss-q-box-sizing',
    question: 'What does `box-sizing: border-box` change about how `width` is calculated?',
    options: [
      'width now excludes padding and border (the default, content-box behavior)',
      'width now includes padding and border, making sizing far more predictable',
      'It removes the element\'s border entirely',
      'It only affects flex/grid children'
    ],
    correctIndex: 1,
    explanation: 'This is why most resets apply `border-box` globally — it avoids padding/border silently expanding an element beyond its set width.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-specificity',
    question: 'Which selector wins when both target the same element (ignoring source order)?',
    code: `#nav .link { color: red; }
.link { color: blue; }`,
    options: ['.link (blue) — later rules always win', '#nav .link (red) — id + class outranks class alone', 'Neither applies — conflicting rules cancel out', 'It is undefined behavior'],
    correctIndex: 1,
    explanation: 'CSS specificity order is inline style > #id > .class/[attr]/:pseudo-class > element; ties break by source order.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-flex-vs-grid',
    question: 'What is the key difference between Flexbox and Grid?',
    options: [
      'Flexbox is 2-D; Grid is 1-D',
      'Flexbox is 1-D (a single row or column); Grid is 2-D (rows and columns together)',
      'Grid cannot be used for component-level layout',
      'They are interchangeable with no practical difference'
    ],
    correctIndex: 1,
    explanation: 'Grid suits page/section layout; Flexbox suits laying out items along one axis, like a toolbar or card row.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-position',
    question: 'An element with `position: absolute` is positioned relative to:',
    options: [
      'Always the viewport',
      'Its nearest ancestor with a non-static position (or the initial containing block if none exists)',
      'Its immediate parent, always',
      'The document body only'
    ],
    correctIndex: 1,
    explanation: 'This is why `position: relative` on a parent is the common pattern for scoping an absolutely positioned child.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-margin-collapse',
    question: 'What happens when two vertical margins meet, e.g. an element with `margin-bottom: 30px` followed by one with `margin-top: 20px`?',
    options: ['The gap becomes 50px (sum)', 'The gap becomes 30px (the larger of the two margins collapses into one)', 'The gap becomes 20px (the smaller wins)', 'Margins never interact between siblings'],
    correctIndex: 1,
    explanation: 'Margin collapsing only applies to adjacent vertical margins of block elements — flex/grid items don\'t collapse.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-em-rem',
    question: 'What is the key difference between `em` and `rem` units?',
    options: [
      'em is relative to the root font-size; rem is relative to the element\'s own font-size',
      'em is relative to the element\'s own font-size and compounds when nested; rem is always relative to the root font-size',
      'They are identical in every browser',
      'rem only works inside media queries'
    ],
    correctIndex: 1,
    explanation: 'rem\'s independence from nesting makes it the more predictable choice for consistent, scalable sizing.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-zindex',
    question: 'Why might `z-index: 9999` fail to bring an element to the front?',
    options: [
      'z-index values above 999 are ignored by browsers',
      'z-index only compares elements within the same stacking context, and the element needs a non-static position to apply at all',
      'z-index requires !important to take effect',
      'z-index only works on flex/grid children'
    ],
    correctIndex: 1,
    explanation: 'A child can never escape its parent\'s stacking context no matter how high its z-index is set.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-code-animate-perf',
    question: 'Which of these is the cheapest to animate, performance-wise?',
    code: `.a { transition: width .2s; }
.b { transition: top .2s; }
.c { transition: transform .2s; }`,
    options: ['.a (width)', '.b (top)', '.c (transform)', 'All three cost the same'],
    correctIndex: 2,
    explanation: 'transform and opacity can run on the GPU compositor with no layout/paint; width/top force a reflow every frame.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-css-variables',
    question: 'How do CSS custom properties (`--name`) differ from Sass variables?',
    options: [
      'They are identical in behavior',
      'CSS custom properties are live at runtime — they cascade, inherit, and can be changed via JS or media queries',
      'CSS custom properties can only be set on :root',
      'Sass variables can be read by JavaScript; CSS custom properties cannot'
    ],
    correctIndex: 1,
    explanation: 'Sass variables are compiled away at build time; CSS custom properties remain a real, mutable part of the DOM/CSSOM.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-bfc',
    question: 'What does `display: flow-root` create, and why is it useful?',
    options: [
      'A new stacking context only, with no layout effect',
      'A new Block Formatting Context — it contains floats and stops margins from collapsing across its boundary, without side effects',
      'It forces the element to become a flex container',
      'It disables all CSS transitions inside the element'
    ],
    correctIndex: 1,
    explanation: 'It is the modern replacement for the old `overflow: hidden` clearfix hack for containing floated children.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-has-selector',
    question: 'What makes `:has()` unusual compared to most CSS selectors?',
    options: [
      'It can only match direct children',
      'It lets you style a parent based on what is inside it or comes after it — a "parent selector"',
      'It only works with :root',
      'It requires JavaScript to function'
    ],
    correctIndex: 1,
    explanation: 'e.g. `.form-group:has(input:invalid)` styles the group when its input is invalid — something CSS couldn\'t do before.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-hiding-elements',
    question: 'Which hiding technique keeps the element\'s layout space AND keeps it clickable?',
    options: ['display: none', 'visibility: hidden', 'opacity: 0', 'All three behave the same way'],
    correctIndex: 2,
    explanation: '`opacity: 0` keeps the element in layout, in the accessibility tree, and still interactive — often an unwanted surprise.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-aspect-ratio',
    question: 'What problem does the `aspect-ratio` CSS property solve?',
    options: [
      'It centers an element horizontally',
      'It reserves box space by ratio before content (like an image) loads, preventing layout shift',
      'It sets the element\'s z-index automatically',
      'It replaces media queries entirely'
    ],
    correctIndex: 1,
    explanation: 'It replaces the older padding-top percentage hack for reserving space ahead of an image loading.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-code-clamp',
    question: 'What does `clamp(1rem, 4vw, 2rem)` do for a font-size?',
    code: `h1 { font-size: clamp(1rem, 4vw, 2rem); }`,
    options: [
      'Always renders at exactly 4vw',
      'Scales with viewport width (4vw), but never goes below 1rem or above 2rem',
      'Picks a random value between 1rem and 2rem',
      'Is equivalent to just writing font-size: 4vw'
    ],
    correctIndex: 1,
    explanation: '`clamp(MIN, VAL, MAX)` acts as both a floor and a ceiling around a fluid preferred value.',
    category: 'CSS'
  },
  {
    id: 'htmlcss-q-noopener',
    question: 'Why add `rel="noopener noreferrer"` to a link with `target="_blank"`?',
    options: [
      'It makes the link open faster',
      'Without it, the opened page can access window.opener and redirect the tab that opened it (reverse tabnabbing)',
      'It is required for the link to be valid HTML',
      'It disables right-click context menus on the link'
    ],
    correctIndex: 1,
    explanation: 'noopener nulls the window.opener reference; noreferrer additionally strips the Referer header.',
    category: 'HTML'
  },
  {
    id: 'htmlcss-q-aria-first-rule',
    question: 'What is the "first rule of ARIA"?',
    options: [
      'Always add ARIA attributes to every interactive element',
      'Don\'t use ARIA if a native HTML element already does the job',
      'ARIA should only be used for images',
      'ARIA roles must always be paired with tabindex="0"'
    ],
    correctIndex: 1,
    explanation: 'A real `<button>` beats `role="button"` on a div, which additionally needs manual tabindex and key handling to actually work.',
    category: 'Accessibility'
  }
];
