import type { Flashcard } from 'types/content';

// ─── HTML flashcards ──────────────────────────────────────────────────────────

export const htmlFlashcards: Flashcard[] = [
  {
    id: 'html-doctype',
    front: 'What does <!DOCTYPE html> do?',
    back: 'Tells the browser to use standards mode instead of legacy "quirks" mode. It must be the first line; it’s a browser instruction, not a tag.',
    category: 'Q&A'
  },
  {
    id: 'html-semantic',
    front: 'Why use semantic HTML?',
    back: 'Elements like <nav>, <main>, <article> convey meaning — giving you accessibility (screen-reader landmarks), SEO, and readable markup that plain <div>s don’t.',
    category: 'Q&A'
  },
  {
    id: 'html-block-inline',
    front: 'Block vs inline elements',
    back: 'Block (div, p, h1) start on a new line, take full width, respect width/height. Inline (span, a, strong) flow within a line, sized to content, ignore width/height.',
    category: 'Q&A'
  },
  {
    id: 'html-viewport',
    front: 'What does the viewport meta tag do?',
    back: 'width=device-width, initial-scale=1 makes the page use the device’s real width at 100% zoom — the prerequisite for CSS media queries to work on mobile.',
    category: 'Q&A'
  },
  {
    id: 'html-data-attr',
    front: 'data-* attributes',
    back: 'Custom attributes (data-user-id) for attaching app data to elements. Read in JS via el.dataset.userId and targetable in CSS via [data-…].',
    category: 'Keyword'
  },
  {
    id: 'html-defer-async',
    front: 'script: defer vs async',
    back: 'defer: download in parallel, run after parse in order (app code). async: run as soon as ready, order not guaranteed (analytics). Plain script blocks parsing.',
    category: 'Q&A'
  },
  {
    id: 'html-form-validation',
    front: 'Native form validation',
    back: 'Attributes like required, pattern, min/max, type="email" block submission and show native messages. Style with :valid/:invalid. Always re-validate on the server.',
    category: 'Q&A'
  },
  {
    id: 'html-alt-text',
    front: 'Why does <img> need alt?',
    back: 'alt describes the image for screen readers and shows if it fails to load. Use a meaningful description, or empty alt="" for purely decorative images.',
    category: 'Q&A'
  },
  {
    id: 'html-aria-first-rule',
    front: 'First rule of ARIA',
    back: 'Don’t use ARIA if a native element does the job — a real <button> beats role="button", which needs tabindex and key handlers to actually work.',
    category: 'Q&A'
  },
  {
    id: 'html-id-vs-class',
    front: 'id vs class',
    back: 'id is unique per page (one element) and high specificity; class is reusable across many elements. Prefer classes for styling, ids for anchors/labels/JS hooks.',
    category: 'Q&A'
  }
];

// ─── CSS flashcards ────────────────────────────────────────────────────────────

export const cssFlashcards: Flashcard[] = [
  {
    id: 'css-box-sizing',
    front: 'content-box vs border-box',
    back: 'content-box (default): width = content only, padding/border added on top. border-box: width includes padding+border — far more predictable. Reset to border-box globally.',
    category: 'Q&A'
  },
  {
    id: 'css-specificity',
    front: 'CSS specificity order',
    back: 'inline style > #id > .class / [attr] / :pseudo-class > element. Ties break by source order (later wins). !important overrides all.',
    category: 'Q&A'
  },
  {
    id: 'css-flex-vs-grid',
    front: 'Flexbox vs Grid',
    back: 'Flexbox is 1-D (lay out a single row OR column). Grid is 2-D (rows AND columns together). Grid for page/section layout, Flexbox for component rows.',
    category: 'Q&A'
  },
  {
    id: 'css-position',
    front: 'position: absolute vs relative vs fixed vs sticky',
    back: 'relative: offset from normal spot, keeps space. absolute: out of flow, positioned to nearest positioned ancestor. fixed: to viewport. sticky: relative then sticks on scroll.',
    category: 'Q&A'
  },
  {
    id: 'css-em-rem',
    front: 'em vs rem',
    back: 'em is relative to the element’s own font-size and compounds when nested. rem is relative to the root font-size — predictable and the usual choice for scalable sizing.',
    category: 'Q&A'
  },
  {
    id: 'css-margin-collapse',
    front: 'Margin collapsing',
    back: 'Adjacent vertical margins merge into the larger of the two (not the sum). Only vertical, only block elements; flex/grid items don’t collapse.',
    category: 'Q&A'
  },
  {
    id: 'css-pseudo',
    front: 'Pseudo-class vs pseudo-element',
    back: 'Pseudo-class (:hover, :nth-child) targets a state/position. Pseudo-element (::before, ::placeholder) styles a generated sub-part. ::before/::after need content.',
    category: 'Q&A'
  },
  {
    id: 'css-zindex',
    front: 'Why doesn’t my z-index: 9999 work?',
    back: 'z-index only compares elements within the same stacking context. A child can’t escape its parent’s context, and it needs a non-static position to apply at all.',
    category: 'Q&A'
  },
  {
    id: 'css-variables',
    front: 'CSS custom properties (variables)',
    back: '--name defined on a selector (often :root), read via var(--name). Unlike Sass vars they’re live at runtime — cascade, inherit, and can change in JS or media queries.',
    category: 'Keyword'
  },
  {
    id: 'css-animate-perf',
    front: 'Which properties are cheap to animate?',
    back: 'transform and opacity — they run on the GPU compositor with no layout/paint. Avoid animating width/height/top/left, which force reflow every frame.',
    category: 'Q&A'
  },
  {
    id: 'css-centering',
    front: 'How do you center a div?',
    back: 'Flexbox: display:flex; justify-content:center; align-items:center on the parent. Or Grid: display:grid; place-items:center. For one block: margin-inline:auto with a set width.',
    category: 'Q&A'
  },
  {
    id: 'css-responsive-units',
    front: 'Mobile-first responsive design',
    back: 'Write base styles for small screens, then enhance with min-width media queries. Use relative units (rem, %, vw, clamp). Needs the viewport meta tag to work.',
    category: 'Q&A'
  }
];
