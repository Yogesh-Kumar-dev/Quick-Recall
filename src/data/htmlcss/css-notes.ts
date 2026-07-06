import type { Note } from '@/types/content';

// category values: 'box-model' | 'layout' | 'positioning' | 'selectors' | 'responsive' | 'visual' | 'architecture'

export const cssNotes: Note[] = [
  // ─── BOX MODEL ────────────────────────────────────────────────────────────────
  {
    id: 'css-box-model',
    title: 'The Box Model',
    summary: 'Every element is a box of content + padding + border + margin — and box-sizing changes the maths.',
    difficulty: 'basic',
    category: 'box-model',
    keyPoints: [
      'From inside out: content → padding → border → margin.',
      'Default box-sizing: content-box — width/height apply to the content only, so padding & border are added on top.',
      'box-sizing: border-box makes width/height include padding & border — far more predictable.',
      'Most resets apply * { box-sizing: border-box } globally.',
      'Margins are outside the border and are transparent; padding is inside and shows the background.'
    ],
    gotcha:
      'With the default content-box, adding padding to a width:100% element makes it overflow its parent — switch to border-box to avoid the surprise.',
    codeSnippet: `*, *::before, *::after { box-sizing: border-box; }

.card {
  width: 200px;        /* total width incl. padding+border */
  padding: 20px;
  border: 2px solid;
}`
  },
  {
    id: 'css-margin-collapse',
    title: 'Margin Collapsing',
    summary: 'Adjacent vertical margins merge into one — a classic source of unexpected spacing.',
    difficulty: 'intermediate',
    category: 'box-model',
    keyPoints: [
      'Vertical (top/bottom) margins of adjacent block elements collapse to the larger of the two — they don’t add.',
      'A parent and its first/last child can collapse together if no border/padding/overflow separates them.',
      'Only vertical margins collapse — horizontal margins never do.',
      'Flex and grid items do NOT collapse margins.',
      'Prevent it with padding, a border, or by establishing a BFC (overflow: auto).'
    ],
    gotcha: 'Two stacked elements with margin: 20px end up 20px apart, not 40px — people expect them to sum.',
    codeSnippet: `/* gap of 30px (the larger), not 50px */
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }`
  },

  // ─── SELECTORS ──────────────────────────────────────────────────────────────
  {
    id: 'css-specificity',
    title: 'Specificity & the Cascade',
    summary: 'When rules conflict, the browser picks the winner by specificity, then source order.',
    difficulty: 'intermediate',
    category: 'selectors',
    keyPoints: [
      'Specificity is scored (inline, IDs, classes/attrs/pseudo-classes, elements) — higher wins.',
      'Inline style > #id > .class / [attr] / :hover > element / ::before.',
      'When specificity ties, the later rule in source order wins.',
      '!important overrides normal rules (use sparingly — it’s hard to undo).',
      'The universal selector * and :where() add zero specificity.'
    ],
    gotcha:
      'Fighting specificity with more !important leads to an unmaintainable arms race — prefer a flat, low-specificity, class-based architecture.',
    codeSnippet: `#nav .link { color: red; }   /* (1,1,0) wins */
.link        { color: blue; } /* (0,1,0) loses */

/* :where() keeps specificity at 0 */
:where(.btn) { color: green; }`
  },
  {
    id: 'css-pseudo',
    title: 'Pseudo-classes vs Pseudo-elements',
    summary: 'Pseudo-classes target a state; pseudo-elements style a generated sub-part of an element.',
    difficulty: 'basic',
    category: 'selectors',
    keyPoints: [
      'Pseudo-classes (single colon): :hover, :focus, :nth-child(), :checked, :first-child — based on state or position.',
      'Pseudo-elements (double colon): ::before, ::after, ::placeholder, ::selection — style a virtual part.',
      '::before / ::after need a content property to appear (even content: "").',
      ':focus-visible shows focus rings only for keyboard users; :focus-within matches when a descendant is focused.',
      'Combinators: descendant (space), child (>), adjacent (+), general sibling (~).'
    ],
    codeSnippet: `a:hover { text-decoration: underline; }
li:nth-child(odd) { background: #f5f5f5; }
.tag::before { content: "#"; }
input:focus-visible { outline: 2px solid blue; }`
  },

  // ─── LAYOUT ─────────────────────────────────────────────────────────────────
  {
    id: 'css-flexbox',
    title: 'Flexbox',
    summary: 'A one-dimensional layout system for distributing space along a single row or column.',
    difficulty: 'intermediate',
    category: 'layout',
    keyPoints: [
      'display: flex on the parent; children become flex items along the main axis.',
      'flex-direction sets the main axis (row | column); the cross axis is perpendicular.',
      'justify-content aligns on the main axis; align-items aligns on the cross axis.',
      'flex: 1 (grow shrink basis) lets items share leftover space; gap spaces items.',
      'Best for components: navbars, toolbars, centering, evenly spaced button rows.'
    ],
    gotcha:
      'justify-content and align-items swap which visual direction they affect when you change flex-direction to column — a frequent point of confusion.',
    codeSnippet: `.row {
  display: flex;
  justify-content: space-between; /* main axis */
  align-items: center;           /* cross axis */
  gap: 1rem;
}
.row > .grow { flex: 1; }`
  },
  {
    id: 'css-grid',
    title: 'CSS Grid',
    summary: 'A two-dimensional layout system controlling rows and columns at the same time.',
    difficulty: 'intermediate',
    category: 'layout',
    keyPoints: [
      'display: grid + grid-template-columns/rows define the track structure.',
      'fr is a fractional unit of leftover space; repeat() and minmax() build flexible tracks.',
      'gap sets the gutters; place-items centers in both axes at once.',
      'Items can span tracks (grid-column: 1 / 3) or be placed in named template areas.',
      'auto-fit/auto-fill + minmax() create responsive grids with no media queries.'
    ],
    gotcha:
      'Grid vs Flexbox: Grid is 2-D (rows AND columns together); Flexbox is 1-D (a single row or column). Use Grid for page/section layout, Flexbox for component-level rows.',
    codeSnippet: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.hero { grid-column: 1 / -1; } /* span all columns */`
  },

  // ─── POSITIONING ──────────────────────────────────────────────────────────────
  {
    id: 'css-positioning',
    title: 'The position Property',
    summary: 'static, relative, absolute, fixed, and sticky decide how an element is placed and what it offsets from.',
    difficulty: 'intermediate',
    category: 'positioning',
    keyPoints: [
      'static (default): normal flow; top/left have no effect.',
      'relative: offset from its normal position; still occupies its original space.',
      'absolute: removed from flow; positioned relative to the nearest positioned ancestor.',
      'fixed: positioned relative to the viewport; stays put on scroll.',
      'sticky: relative until a scroll threshold, then sticks (great for headers).'
    ],
    gotcha:
      'position: absolute anchors to the nearest ancestor with a non-static position — forget to set position: relative on the intended parent and it jumps to the wrong container.',
    codeSnippet: `.parent { position: relative; }
.badge {
  position: absolute;
  top: 0; right: 0;     /* corner of .parent */
}
.header { position: sticky; top: 0; }`
  },
  {
    id: 'css-zindex-stacking',
    title: 'z-index & Stacking Contexts',
    summary: 'z-index controls overlap order — but only within the same stacking context.',
    difficulty: 'advanced',
    category: 'positioning',
    keyPoints: [
      'z-index orders overlapping elements (higher = front); it needs a non-static position to take effect.',
      'A stacking context is a self-contained layer; z-index only compares siblings inside the same context.',
      'New contexts are created by: position + z-index, opacity < 1, transform, filter, will-change, etc.',
      'A child can never escape its parent’s stacking context, no matter how high its z-index.'
    ],
    gotcha:
      'A z-index: 9999 element can still sit behind another if its parent forms a lower stacking context — the huge number does nothing across contexts.',
    codeSnippet: `/* .a's z-index:1 beats .b's z-index:9999
   because .b is trapped in .wrap's context */
.wrap { position: relative; z-index: 1; opacity: .99; }
.b { position: absolute; z-index: 9999; }`
  },

  // ─── RESPONSIVE ───────────────────────────────────────────────────────────────
  {
    id: 'css-responsive',
    title: 'Responsive Design & Media Queries',
    summary: 'Adapt layout to screen size with fluid units and breakpoints — mobile-first.',
    difficulty: 'intermediate',
    category: 'responsive',
    keyPoints: [
      'Mobile-first: write base styles for small screens, then add min-width media queries to enhance.',
      'Use relative units: %, rem/em, vw/vh, and fr instead of fixed px for fluidity.',
      'Media queries: @media (min-width: 768px) { … } gate layout changes at breakpoints.',
      'clamp(min, preferred, max) gives fluid type/spacing without queries.',
      'Container queries (@container) style based on a parent’s width, not the viewport.'
    ],
    gotcha:
      'Responsive CSS does nothing on mobile without the viewport meta tag in the HTML <head> — the page renders at a zoomed-out desktop width otherwise.',
    codeSnippet: `.box { font-size: clamp(1rem, 2.5vw, 1.5rem); }

/* mobile-first enhancement */
@media (min-width: 768px) {
  .layout { grid-template-columns: 1fr 2fr; }
}`
  },
  {
    id: 'css-units',
    title: 'CSS Units: px, em, rem, %, vw/vh',
    summary: 'Absolute vs relative units — picking the right one keeps layouts scalable and accessible.',
    difficulty: 'basic',
    category: 'responsive',
    keyPoints: [
      'px: absolute, fixed size — predictable but doesn’t scale with user font settings.',
      'em: relative to the element’s own font-size — compounds when nested.',
      'rem: relative to the root font-size — the go-to for scalable, predictable sizing.',
      '%: relative to the parent’s corresponding dimension.',
      'vw/vh: 1% of the viewport width/height — great for full-screen and fluid sizing.'
    ],
    gotcha:
      'em compounds: nested elements each multiply their parent’s font-size, so font sizes can snowball unexpectedly — rem avoids this by always referencing the root.',
    codeSnippet: `html { font-size: 16px; }
h1   { font-size: 2rem; }   /* 32px, root-relative */
.tip { padding: 1em; }      /* relative to .tip's font-size */
.hero{ height: 100vh; }     /* full viewport height */`
  },

  // ─── VISUAL ─────────────────────────────────────────────────────────────────
  {
    id: 'css-custom-properties',
    title: 'CSS Custom Properties (Variables)',
    summary: 'Native variables (--name) that cascade, can be read/changed in JS, and power theming.',
    difficulty: 'intermediate',
    category: 'visual',
    keyPoints: [
      'Define on a selector (often :root for global) and read with var(--name, fallback).',
      'Unlike Sass variables, they’re live at runtime — change them in JS or via media queries.',
      'They cascade and inherit, so a component can override a token locally.',
      'The cornerstone of dark mode and design-token systems.',
      'Read/write in JS: getComputedStyle(el).getPropertyValue() / el.style.setProperty().'
    ],
    codeSnippet: `:root { --brand: #4f46e5; --space: 8px; }
.btn { background: var(--brand); padding: var(--space); }

/* runtime theming */
[data-theme="dark"] { --brand: #818cf8; }`
  },
  {
    id: 'css-transitions-animations',
    title: 'Transitions & Animations',
    summary: 'transition tweens between two states; @keyframes animations define multi-step motion.',
    difficulty: 'intermediate',
    category: 'visual',
    keyPoints: [
      'transition: property duration timing-function delay — animates a change between two values.',
      '@keyframes + animation run multi-step, looping, or autonomous motion.',
      'Animate transform and opacity — they run on the compositor (GPU) and avoid layout/paint.',
      'Avoid animating width/height/top/left — they trigger reflow and stutter.',
      'Respect prefers-reduced-motion for users who get motion sickness.'
    ],
    gotcha:
      'Animating layout properties (width, height, margin) forces the browser to reflow every frame and drops frames — animate transform: scale/translate instead.',
    codeSnippet: `.btn { transition: transform .2s ease; }
.btn:hover { transform: scale(1.05); }

@keyframes spin { to { transform: rotate(360deg); } }
.loader { animation: spin 1s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  * { animation: none; transition: none; }
}`
  },

  // ─── ARCHITECTURE ──────────────────────────────────────────────────────────
  {
    id: 'css-methodologies',
    title: 'CSS Architecture: BEM, Modules & Utilities',
    summary: 'Strategies to keep CSS scalable and conflict-free in large codebases.',
    difficulty: 'intermediate',
    category: 'architecture',
    keyPoints: [
      'BEM (Block__Element--Modifier): a naming convention for predictable, low-specificity classes.',
      'CSS Modules: locally-scoped class names (hashed at build) so styles can’t leak between components.',
      'Utility-first (Tailwind): compose small single-purpose classes in markup.',
      'CSS-in-JS (styled-components/Emotion): co-locate scoped styles with components in JS.',
      'All aim to solve the same problem: the global, cascading namespace causing clashes at scale.'
    ],
    gotcha:
      'The core problem they all address is that vanilla CSS class names are global — one generic .button can be silently overridden anywhere.',
    codeSnippet: `/* BEM */
.card {}
.card__title {}
.card--featured {}

/* CSS Module — locally scoped */
import s from './Card.module.css';
<div className={s.card} />`
  }
];
