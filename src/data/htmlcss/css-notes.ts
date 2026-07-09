import type { Note } from '@/types/content';

// category values: 'box-model' | 'layout' | 'positioning' | 'selectors' | 'responsive' | 'visual' | 'architecture' | 'performance'

export const cssNotes: Note[] = [
  // ─── BOX MODEL ────────────────────────────────────────────────────────────────
  {
    id: 'css-box-model',
    title: 'The Box Model',
    summary: 'Every element is a box of content + padding + border + margin , and box-sizing changes the maths.',
    difficulty: 'basic',
    category: 'box-model',
    keyPoints: [
      'From inside out: content → padding → border → margin.',
      'Default box-sizing: content-box , width/height apply to the content only, so padding & border are added on top.',
      'box-sizing: border-box makes width/height include padding & border , far more predictable.',
      'Most resets apply * { box-sizing: border-box } globally.',
      'Margins are outside the border and are transparent; padding is inside and shows the background.'
    ],
    gotcha:
      'With the default content-box, adding padding to a width:100% element makes it overflow its parent , switch to border-box to avoid the surprise.',
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
    summary: 'Adjacent vertical margins merge into one , a classic source of unexpected spacing.',
    difficulty: 'intermediate',
    category: 'box-model',
    prerequisites: ['css-box-model'],
    keyPoints: [
      'Vertical (top/bottom) margins of adjacent block elements collapse to the larger of the two , they don’t add.',
      'A parent and its first/last child can collapse together if no border/padding/overflow separates them.',
      'Only vertical margins collapse , horizontal margins never do.',
      'Flex and grid items do NOT collapse margins.',
      'Prevent it with padding, a border, or by putting the element in its own Block Formatting Context (BFC) , a self-contained layout region that isolates margins and floats from the rest of the page.'
    ],
    gotcha: 'Two stacked elements with margin: 20px end up 20px apart, not 40px , people expect them to sum.',
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
      'Specificity is scored (inline, IDs, classes/attrs/pseudo-classes, elements) , higher wins.',
      'Inline style > #id > .class / [attr] / :hover > element / ::before.',
      'When specificity ties, the later rule in source order wins.',
      '!important overrides normal rules (use sparingly , it’s hard to undo).',
      'The universal selector * and :where() add zero specificity , handy for low-specificity resets that are easy to override later.'
    ],
    gotcha:
      'Fighting specificity with more !important leads to an unmaintainable arms race , prefer a flat, low-specificity, class-based architecture.',
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
      'Pseudo-classes (single colon): :hover, :focus, :nth-child(), :checked, :first-child , based on state or position.',
      'Pseudo-elements (double colon): ::before, ::after, ::placeholder, ::selection , style a virtual part.',
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
    prerequisites: ['css-box-model'],
    keyPoints: [
      'display: flex on the parent; children become flex items along the main axis.',
      'flex-direction sets the main axis (row | column); the cross axis is perpendicular.',
      'justify-content aligns on the main axis; align-items aligns on the cross axis.',
      'flex: 1 (grow shrink basis) lets items share leftover space; gap spaces items.',
      'Best for components: navbars, toolbars, centering, evenly spaced button rows.'
    ],
    gotcha:
      'justify-content and align-items swap which visual direction they affect when you change flex-direction to column , a frequent point of confusion.',
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
    prerequisites: ['css-flexbox'],
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
    prerequisites: ['css-box-model'],
    keyPoints: [
      'static (default): normal flow; top/left have no effect.',
      'relative: offset from its normal position; still occupies its original space.',
      'absolute: removed from flow; positioned relative to the nearest positioned ancestor.',
      'fixed: positioned relative to the viewport; stays put on scroll.',
      'sticky: relative until a scroll threshold, then sticks (great for headers).'
    ],
    gotcha:
      'position: absolute anchors to the nearest ancestor with a non-static position , forget to set position: relative on the intended parent and it jumps to the wrong container.',
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
    summary: 'z-index controls overlap order , but only within the same stacking context.',
    difficulty: 'advanced',
    category: 'positioning',
    prerequisites: ['css-positioning'],
    keyPoints: [
      'z-index orders overlapping elements (higher = front); it needs a non-static position to take effect.',
      'A stacking context is a self-contained layer; z-index only compares siblings inside the same context.',
      'New contexts are created by: position + z-index, opacity < 1, transform, filter, will-change, etc.',
      'A child can never escape its parent’s stacking context, no matter how high its z-index.'
    ],
    gotcha:
      'A z-index: 9999 element can still sit behind another if its parent forms a lower stacking context , the huge number does nothing across contexts.',
    codeSnippet: `/* .a's z-index:1 beats .b's z-index:9999
   because .b is trapped in .wrap's context */
.wrap { position: relative; z-index: 1; opacity: .99; }
.b { position: absolute; z-index: 9999; }`
  },

  // ─── RESPONSIVE ───────────────────────────────────────────────────────────────
  {
    id: 'css-responsive',
    title: 'Responsive Design & Media Queries',
    summary: 'Adapt layout to screen size with fluid units and breakpoints , mobile-first.',
    difficulty: 'intermediate',
    category: 'responsive',
    prerequisites: ['css-units'],
    keyPoints: [
      'Mobile-first: write base styles for small screens, then add min-width media queries to enhance.',
      'Use relative units: %, rem/em, vw/vh, and fr instead of fixed px for fluidity.',
      'Media queries: @media (min-width: 768px) { … } gate layout changes at breakpoints.',
      'clamp(min, preferred, max) gives fluid type/spacing without queries.',
      'Container queries (@container) style an element based on its containing block’s width, not the viewport , so a card component can respond to the sidebar it happens to sit in.'
    ],
    gotcha:
      'Responsive CSS does nothing on mobile without the viewport meta tag in the HTML <head> , the page renders at a zoomed-out desktop width otherwise.',
    codeSnippet: `.box { font-size: clamp(1rem, 2.5vw, 1.5rem); }

/* mobile-first enhancement */
@media (min-width: 768px) {
  .layout { grid-template-columns: 1fr 2fr; }
}`
  },
  {
    id: 'css-units',
    title: 'CSS Units: px, em, rem, %, vw/vh',
    summary: 'Absolute vs relative units , picking the right one keeps layouts scalable and accessible.',
    difficulty: 'basic',
    category: 'responsive',
    keyPoints: [
      'px: absolute, fixed size , predictable but doesn’t scale with user font settings.',
      'em: relative to the element’s own font-size , compounds when nested.',
      'rem: relative to the root font-size , the go-to for scalable, predictable sizing.',
      '%: relative to the parent’s corresponding dimension.',
      'vw/vh: 1% of the viewport width/height , great for full-screen and fluid sizing.'
    ],
    gotcha:
      'em compounds: nested elements each multiply their parent’s font-size, so font sizes can snowball unexpectedly , rem avoids this by always referencing the root.',
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
      'Unlike Sass variables, they’re live at runtime , change them in JS or via media queries.',
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
      'transition: property duration timing-function delay , animates a change between two values.',
      '@keyframes + animation run multi-step, looping, or autonomous motion.',
      'Animate transform and opacity , they run on the compositor (GPU) and avoid layout/paint.',
      'Avoid animating width/height/top/left , they trigger reflow and stutter.',
      'Respect prefers-reduced-motion for users who get motion sickness.'
    ],
    gotcha:
      'Animating layout properties (width, height, margin) forces the browser to reflow every frame and drops frames , animate transform: scale/translate instead.',
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
    prerequisites: ['css-specificity'],
    keyPoints: [
      'BEM (Block__Element--Modifier): a naming convention for predictable, low-specificity classes.',
      'CSS Modules: locally-scoped class names (hashed at build) so styles can’t leak between components.',
      'Utility-first (Tailwind): compose small single-purpose classes in markup.',
      'CSS-in-JS (styled-components/Emotion): co-locate scoped styles with components in JS.',
      'All aim to solve the same problem: the global, cascading namespace causing clashes at scale.'
    ],
    gotcha:
      'The core problem they all address is that vanilla CSS class names are global , one generic .button can be silently overridden anywhere.',
    codeSnippet: `/* BEM */
.card {}
.card__title {}
.card--featured {}

/* CSS Module — locally scoped */
import s from './Card.module.css';
<div className={s.card} />`
  },
  {
    id: 'css-bfc',
    title: 'Block Formatting Context (BFC)',
    summary: 'A BFC is a self-contained mini-layout region , floats and margins inside it don’t leak out to the rest of the page.',
    difficulty: 'advanced',
    category: 'layout',
    prerequisites: ['css-box-model', 'css-margin-collapse'],
    keyPoints: [
      'Created by: the root <html>, floats, absolutely/fixed-positioned elements, inline-block, table cells, flex/grid item containers, or any element with overflow other than visible, or the explicit display: flow-root.',
      'Inside a BFC, block boxes lay out top to bottom and floated children are contained , the parent stops collapsing to zero height around them.',
      'A BFC also stops margins from collapsing across its boundary and stops it from overlapping floats placed outside it.',
      'The old "clearfix" hack (overflow: hidden/auto on the parent) works by creating a BFC as a side effect , but it also clips content and can add scrollbars.',
      'display: flow-root is the modern, purpose-built way to create a BFC with no side effects.'
    ],
    gotcha:
      'People reach for overflow: hidden to "fix" a collapsed parent without realising why it works , and it silently clips anything (tooltips, dropdowns) that overflows the box. Prefer display: flow-root.',
    codeSnippet: `/* old hack: works, but clips overflow */
.clearfix { overflow: auto; }

/* modern, side-effect-free */
.clearfix { display: flow-root; }

.clearfix > .floated { float: left; }
/* .clearfix now contains the float's height */`
  },
  {
    id: 'css-has-selector',
    title: 'The :has() Selector',
    summary: 'CSS finally got a "parent selector" , :has() matches an element based on what’s inside or after it.',
    difficulty: 'advanced',
    category: 'selectors',
    prerequisites: ['css-pseudo', 'css-specificity'],
    keyPoints: [
      ':has() matches an element if a relative selector inside its parentheses matches something relative to it , e.g. section:has(.featured) selects a <section> that contains .featured somewhere inside.',
      'Works forwards too: h1:has(+ p) matches an <h1> immediately followed by a <p>.',
      'Its specificity comes from the most specific selector inside the parentheses, same rule as :is() and :not().',
      'You can’t nest :has() inside another :has(), and pseudo-elements aren’t valid as arguments.',
      'Chaining two :has() calls is an AND (both must match); a comma inside one :has() is an OR.'
    ],
    gotcha:
      'Anchoring :has() to a very broad element (body:has(.modal-open)) forces the browser to re-check that condition on every DOM mutation , scope it as tightly as possible (a direct parent, not the whole page) to avoid a performance hit.',
    codeSnippet: `/* style a form group only when its input is invalid */
.form-group:has(input:invalid) { border-color: red; }

/* style a card differently if it has an image */
.card:has(img) { grid-template-rows: auto 1fr; }`
  },
  {
    id: 'css-cascade-layers',
    title: 'Cascade Layers (@layer)',
    summary: '@layer lets you decide which group of rules wins by declaration order , instead of fighting specificity.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['css-specificity'],
    keyPoints: [
      '@layer reset, base, components, utilities; declares the layer order up front , later layers always beat earlier ones, no matter how specific the earlier layer’s selectors are.',
      '@layer utilities { .text-center { text-align: center; } } populates a named layer; re-declaring the same name later just appends more rules to it.',
      'Any normal (unlayered) style always beats every layered style , layers only settle fights among themselves.',
      '!important flips the order: an !important rule in the first-declared layer beats one in a later layer.',
      'It solves the classic problem of "my utility class needs to beat a component’s class" without stacking !important or bumping up specificity.'
    ],
    gotcha:
      'It’s easy to assume layers work like specificity (higher-priority layer = "stronger" selectors win inside it) , they don’t. Layer order is decided purely by the order layers were first declared, and a one-class selector in a later layer beats a deeply nested selector in an earlier one.',
    codeSnippet: `@layer reset, components, utilities;

@layer components {
  .btn { padding: 8px 16px; background: gray; }
}
@layer utilities {
  .bg-brand { background: blue; } /* wins over .btn, even
                                      though .btn is more specific */
}`
  },
  {
    id: 'css-content-visibility',
    title: 'content-visibility & CSS Containment',
    summary: 'content-visibility: auto tells the browser to skip layout/paint work for off-screen content until it’s needed.',
    difficulty: 'advanced',
    category: 'performance',
    prerequisites: ['css-bfc'],
    keyPoints: [
      'content-visibility: auto applies layout, style, and paint containment and skips rendering work for content that isn’t currently relevant to the user (e.g. far below the fold).',
      'Skipped content stays in the DOM and accessibility tree , it’s still focusable and found by Ctrl+F, unlike display: none.',
      'Pair it with contain-intrinsic-size to reserve an estimated height, otherwise the page jumps around as sections pop in and out of view.',
      'content-visibility: hidden works like display: none for rendering cost but keeps the element’s internal render state cached, so re-showing it is cheaper than remounting.',
      'An element with contain: layout/content/paint also becomes its own Block Formatting Context.'
    ],
    gotcha:
      'content-visibility is a newer feature , always verify browser support against your target audience before relying on it as your only long-page performance strategy.',
    codeSnippet: `.section {
  content-visibility: auto;
  contain-intrinsic-size: 500px; /* reserved space until measured */
}`
  },
  {
    id: 'css-logical-properties',
    title: 'Logical Properties',
    summary: 'margin-inline, padding-block and friends size things relative to reading direction, not a fixed screen edge.',
    difficulty: 'intermediate',
    category: 'responsive',
    prerequisites: ['css-units'],
    keyPoints: [
      'inline is the axis text flows along (horizontal in English); block is the axis paragraphs stack along (vertical in English).',
      'Physical properties (margin-left, width, top) always mean the same screen edge. Logical equivalents (margin-inline-start, inline-size, inset-block-start) flip automatically for direction: rtl or vertical writing modes.',
      'margin-inline / padding-inline set both the start+end inline sides in one line; margin-block / padding-block do the same for the block axis.',
      'The main real-world driver is internationalisation , supporting Arabic/Hebrew (RTL) layouts without hand-writing a second stylesheet.',
      'Even on an LTR-only site, mixing physical margins with flex/grid’s flow-relative justify-self/align-self start/end can silently misalign things if direction ever changes.'
    ],
    codeSnippet: `/* physical: always left, regardless of language direction */
.card { margin-left: 16px; }

/* logical: "start" flips to the right automatically under RTL */
.card { margin-inline-start: 16px; }

[dir="rtl"] .card { /* no override needed , it just works */ }`
  },
  {
    id: 'css-hiding-elements',
    title: 'display: none vs visibility: hidden vs opacity: 0',
    summary:
      'Three ways to hide an element that differ in whether it keeps its space, stays reachable by assistive tech, and can be animated.',
    difficulty: 'intermediate',
    category: 'visual',
    keyPoints: [
      'display: none removes the element from layout entirely, as if it never existed , it and its descendants also drop out of the accessibility tree, so it’s unfocusable and fires no events.',
      'visibility: hidden keeps the element’s space in the layout but also removes it from the accessibility tree and from focus , a hidden descendant can override this with its own visibility: visible to reappear.',
      'opacity: 0 keeps the space, stays in the accessibility tree, and stays focusable and clickable , it’s purely a visual change, nothing else.',
      'Only opacity is continuously animatable with transition , display flips discretely (needs @starting-style / transition-behavior: allow-discrete to animate in newer CSS) and visibility interpolates as an instant on/off switch.',
      'Pick by intent: display: none to truly remove it, visibility: hidden to reserve its space while hiding it from everyone, opacity: 0 only when you still want it clickable/focusable (e.g. a fade-in target).'
    ],
    gotcha:
      'opacity: 0 is the one that surprises people , the element is invisible but still fully interactive, so an opacity:0 overlay can silently intercept clicks meant for what’s behind it.',
    codeSnippet: `.a { display: none; }      /* gone: no space, no a11y tree, no events */
.b { visibility: hidden; } /* space kept, no a11y tree, no focus */
.c { opacity: 0; }         /* space kept, in a11y tree, still clickable */`
  },
  {
    id: 'css-critical-rendering-path',
    title: 'The Critical Rendering Path',
    summary: 'The pipeline the browser runs to turn HTML/CSS into pixels: DOM + CSSOM → render tree → layout → paint → composite.',
    difficulty: 'advanced',
    category: 'performance',
    prerequisites: ['css-specificity'],
    keyPoints: [
      'HTML parses incrementally into the DOM as bytes arrive; CSS parses into the CSSOM, but CSSOM construction is NOT incremental , a later rule can override an earlier one, so nothing can paint until the whole CSSOM is built. That’s why CSS is render-blocking by default.',
      'DOM + CSSOM merge into the render tree, which holds only what will actually be visible , the <head> and any display: none elements are excluded entirely.',
      'Layout (aka reflow) computes the size and position of every render-tree node; paint rasterises pixels for each element; a final composite step assembles the painted layers on screen.',
      'Changing a property that affects box geometry (width, font-size, adding/removing a node) triggers layout + paint + composite. Changing something purely visual (color, background) skips layout but still repaints. Changing transform or opacity can be handled by the compositor alone, skipping layout AND paint , the cheapest possible change.',
      'This is why interview advice to "animate transform/opacity, not width/top/left" isn’t a style preference , it’s the difference between a compositor-only change and one that re-runs the whole pipeline every frame.'
    ],
    codeSnippet: `/* triggers layout + paint + composite (expensive, every frame) */
.el { transition: width 0.2s; }
.el:hover { width: 300px; }

/* compositor-only, skips layout and paint (cheap) */
.el { transition: transform 0.2s; }
.el:hover { transform: scale(1.1); }`
  },
  {
    id: 'css-object-fit',
    title: 'object-fit & object-position',
    summary:
      'Control how an <img> or <video> is resized and cropped inside its box , the CSS equivalent of background-size/position for real elements.',
    difficulty: 'basic',
    category: 'visual',
    keyPoints: [
      'fill (default): stretches the content to fill the box exactly, distorting its aspect ratio if the box doesn’t match.',
      'contain: scales the whole content to fit inside the box, preserving aspect ratio , may letterbox/pillarbox with empty space.',
      'cover: scales to fill the box completely, preserving aspect ratio, cropping whatever overflows , the usual choice for thumbnail grids and hero images.',
      'none keeps the content at its natural size (may overflow or leave gaps); scale-down picks whichever of none or contain results in a smaller size.',
      'object-position (default 50% 50%) chooses which part of the content stays visible when cropping , same syntax as background-position.'
    ],
    gotcha: 'object-fit has no effect on <iframe>/<embed> , it only works on genuinely replaced content like <img> and <video>.',
    codeSnippet: `img.thumbnail {
  width: 200px;
  height: 200px;
  object-fit: cover;
  object-position: top; /* keep the top of the image, crop the bottom */
}`
  },
  {
    id: 'css-aspect-ratio',
    title: 'The aspect-ratio Property',
    summary:
      'Declares a width:height ratio so the browser reserves the right box size up front , the modern fix for image-loading layout shift.',
    difficulty: 'intermediate',
    category: 'responsive',
    prerequisites: ['css-units'],
    keyPoints: [
      'aspect-ratio: 16 / 9 (or a single number, meaning n/1) sets the ratio , but it only has an effect if at least one of width/height is auto. Set both explicitly and the ratio is silently ignored.',
      'This directly replaces the old "padding-top: 56.25%" hack , percentage padding is calculated against the containing block’s width, which is exactly what people abused to fake a fixed-ratio box before aspect-ratio existed.',
      'The combined form auto && <ratio> is specifically for replaced elements like <img>: the given ratio reserves space as a placeholder before the image loads, then auto (the image’s real intrinsic ratio) takes over once it does.',
      'Pairs naturally with object-fit: cover on media , reserve the box with aspect-ratio, then crop the content to fill it.',
      'A container ratio gone wrong (both dimensions fixed, or a min-height overriding it) is a common "why isn’t my aspect-ratio working" interview follow-up.'
    ],
    codeSnippet: `img {
  width: 100%;
  aspect-ratio: 16 / 9; /* reserves space before the image loads */
  object-fit: cover;
}`
  },
  {
    id: 'css-calc-min-max',
    title: 'calc(), min() & max()',
    summary:
      'Math functions for mixing units and picking between values responsively , clamp() is really shorthand for max(MIN, min(VAL, MAX)).',
    difficulty: 'intermediate',
    category: 'responsive',
    prerequisites: ['css-responsive'],
    keyPoints: [
      'calc() supports + - * / with normal precedence and lets you mix units freely: calc(100% - 20px) , something a plain value can never express.',
      'min(a, b, …) returns the smallest of its arguments , great for a responsive cap: width: min(50vw, 200px) never exceeds 200px but shrinks below it on narrow viewports.',
      'max(a, b, …) returns the largest , the mirror case, useful for a responsive floor that never gets too small.',
      'clamp(MIN, VAL, MAX) is the two-sided version , equivalent to max(MIN, min(VAL, MAX)) , when you need both a floor and a ceiling around a fluid value, not just one.',
      'All three can be nested inside other calc()-like expressions and mixed with CSS custom properties for design-token-driven fluid sizing.'
    ],
    codeSnippet: `.box {
  width: calc(100% - 2rem);
  font-size: min(5vw, 2rem);   /* caps out at 2rem */
  padding: max(1rem, 3%);      /* never shrinks below 1rem */
}`
  },
  {
    id: 'css-float-clear',
    title: 'float & clear',
    summary:
      'A legacy layout technique , float pulls an element to one side and out of normal flow, letting inline content wrap around it.',
    difficulty: 'intermediate',
    category: 'layout',
    prerequisites: ['css-bfc'],
    keyPoints: [
      'A floated element is removed from normal flow but still remains part of the page flow (unlike absolute positioning, which is fully detached) , surrounding inline content wraps around it.',
      'Floating forces the element’s computed display to a block-like value, even if it started as inline.',
      'A container holding only floated children collapses to zero height , floats don’t contribute to their parent’s height, which is exactly the bug the classic clearfix hack existed to patch.',
      'The modern fix is display: flow-root on the container (creates a fresh Block Formatting Context that properly contains the floats) rather than the old empty-div or overflow:hidden clearfix tricks.',
      'clear: left | right | both pushes an element below the relevant preceding floats within the same formatting context , it works on both floating and non-floating elements.'
    ],
    codeSnippet: `.container { display: flow-root; } /* contains the floated children */
.sidebar { float: left; width: 200px; }
.footer { clear: both; } /* always starts below any floats */`
  },
  {
    id: 'css-is-not-where',
    title: ':is(), :not() & :where()',
    summary: 'Selector-grouping functions that collapse repetitive selector lists into one compact rule.',
    difficulty: 'intermediate',
    category: 'selectors',
    prerequisites: ['css-specificity', 'css-pseudo'],
    keyPoints: [
      ':is(h1, h2, h3) { … } replaces having to write out h1 { … } h2 { … } h3 { … } separately , same for :not() and :where().',
      'Specificity differs by design: :is() and :not() take the specificity of their single most specific argument; :where() always contributes zero specificity, no matter what’s inside it , the key interview distinction.',
      'All three accept a "forgiving selector list" , if one argument inside is invalid or unsupported, the browser just drops that one argument instead of invalidating the entire rule (a plain comma-separated selector list doesn’t forgive like this).',
      'They can take complex, nested selectors, e.g. :is(section, article) > h1, but none of the three can take a pseudo-element as an argument.',
      ':where() is the natural pairing with utility/reset styles precisely because its zero specificity means anything else can trivially override it later.'
    ],
    codeSnippet: `/* :is() carries specificity of its strongest argument (here, #id) */
:is(#sidebar, .content) p { color: gray; }

/* :where() is always specificity 0 , trivially overridable */
:where(section, article, aside) h1 { font-size: 1.5rem; }`
  },
  {
    id: 'css-overflow',
    title: 'The overflow Property',
    summary:
      'Decides what happens when content doesn’t fit its box , and most non-default values quietly create a new Block Formatting Context.',
    difficulty: 'intermediate',
    category: 'layout',
    prerequisites: ['css-bfc'],
    keyPoints: [
      'visible (default): content spills out, unclipped, and the box isn’t a scroll container at all.',
      'hidden: overflow is clipped and no scrollbars appear, but the box can still be scrolled programmatically (scrollTo(), scrollLeft) or via a focusable child receiving keyboard focus.',
      'scroll always shows scrollbars (even when content fits); auto shows them only when content actually overflows.',
      'clip looks like hidden but is stricter: it disallows ALL scrolling, including programmatic , a focusable child inside a clip region can still be tabbed to, but won’t scroll into view, which is an accessibility trap.',
      'overflow-x / overflow-y are the underlying longhands; every value except visible and clip establishes a new Block Formatting Context on the element.'
    ],
    gotcha:
      'overflow: hidden is the classic accidental clearfix/BFC trigger , it "fixes" a collapsed-parent bug as a side effect, but also silently clips tooltips, dropdowns, or focus rings that were meant to overflow the box.',
    codeSnippet: `.scroll-area { overflow-y: auto; max-height: 300px; }
.clipped { overflow: clip; } /* stricter than hidden: no programmatic scroll either */`
  },
  {
    id: 'css-filter-backdrop-filter',
    title: 'filter & backdrop-filter',
    summary:
      'filter applies effects like blur to the element itself; backdrop-filter applies the same effects only to whatever is visually behind it.',
    difficulty: 'advanced',
    category: 'visual',
    keyPoints: [
      'Both accept the same effect functions: blur(), brightness(), contrast(), drop-shadow(), grayscale(), hue-rotate(), invert(), saturate(), sepia().',
      'filter changes the element and everything painted inside it (its own content plus descendants); backdrop-filter changes only what’s already rendered BEHIND the element , the element itself needs to be transparent or semi-transparent for the effect to actually show.',
      'That’s the entire mechanism behind glassmorphism/frosted-glass panels: a semi-transparent background plus backdrop-filter: blur(...).',
      'backdrop-filter only reaches up to the nearest ancestor "backdrop root" , an element becomes one if it has opacity < 1, a non-none filter/mask/clip-path/backdrop-filter of its own, or will-change on any of those. A stray ancestor with opacity: .99 silently breaks a descendant’s backdrop-filter.',
      'backdrop-filter is a comparatively recent addition across browsers (Safari needed -webkit-backdrop-filter for years, Firefox only added support in 2022) , keep the -webkit- prefix alongside the unprefixed property for broader real-world coverage.'
    ],
    codeSnippet: `.glass-panel {
  background: rgb(255 255 255 / 0.2);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}`
  }
];
