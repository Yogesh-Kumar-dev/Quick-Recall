import type { Flashcard } from '@/types/content';

// ─── HTML flashcards ──────────────────────────────────────────────────────────

export const htmlFlashcards: Flashcard[] = [
  {
    id: 'html-doctype',
    front: 'What does <!DOCTYPE html> do?',
    back: 'Tells the browser to use standards mode instead of legacy "quirks" mode. It must be the first line; it’s a browser instruction, not a tag.',
    code: `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="utf-8" /></head>
  <body>…</body>
</html>`,
    category: 'Q&A'
  },
  {
    id: 'html-semantic',
    front: 'Why use semantic HTML?',
    back: 'Elements like <nav>, <main>, <article> convey meaning , giving you accessibility (screen-reader landmarks), SEO, and readable markup that plain <div>s don’t.',
    category: 'Q&A'
  },
  {
    id: 'html-block-inline',
    front: 'Block vs inline elements',
    back: 'Block (div, p, h1) start on a new line, take full width, respect width/height. Inline (span, a, strong) flow within a line, sized to content, ignore width/height.',
    code: `<p>Paragraph one</p>          <!-- block: stacks -->
<p>Paragraph two</p>

<p>Text with <a href="#">a link</a> inside.</p> <!-- inline: flows -->`,
    category: 'Q&A'
  },
  {
    id: 'html-viewport',
    front: 'What does the viewport meta tag do?',
    back: 'width=device-width, initial-scale=1 makes the page use the device’s real width at 100% zoom , the prerequisite for CSS media queries to work on mobile.',
    code: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    category: 'Q&A'
  },
  {
    id: 'html-data-attr',
    front: 'data-* attributes',
    back: 'Custom attributes (data-user-id) for attaching app data to elements. Read in JS via el.dataset.userId and targetable in CSS via [data-…].',
    code: `<button data-user-id="42" data-action="delete">×</button>
<script>
  btn.dataset.userId; // "42"
  btn.dataset.action; // "delete"
</script>`,
    category: 'Keyword'
  },
  {
    id: 'html-defer-async',
    front: 'script: defer vs async',
    back: 'defer: download in parallel, run after parse in order (app code). async: run as soon as ready, order not guaranteed (analytics). Plain script blocks parsing.',
    code: `<script src="app.js" defer></script>
<script src="analytics.js" async></script>`,
    category: 'Q&A'
  },
  {
    id: 'html-form-validation',
    front: 'Native form validation',
    back: 'Attributes like required, pattern, min/max, type="email" block submission and show native messages. Style with :valid/:invalid. Always re-validate on the server.',
    code: `<input type="password" required minlength="8"
       pattern="(?=.*\\d).+" title="Min 8 chars, include a number" />`,
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
    back: 'Don’t use ARIA if a native element does the job , a real <button> beats role="button", which needs tabindex and key handlers to actually work.',
    code: `<!-- only when you must fake it -->
<div role="button" tabindex="0" aria-pressed="false">Toggle</div>`,
    category: 'Q&A'
  },
  {
    id: 'html-id-vs-class',
    front: 'id vs class',
    back: 'id is unique per page (one element) and high specificity; class is reusable across many elements. Prefer classes for styling, ids for anchors/labels/JS hooks.',
    category: 'Q&A'
  },
  {
    id: 'html-shadow-dom',
    front: 'Shadow DOM',
    back: 'A hidden DOM subtree attached to an element (attachShadow) , its markup and CSS are isolated from the page in both directions. "closed" mode hides shadowRoot but isn’t a real security wall.',
    code: `const shadow = el.attachShadow({ mode: 'open' });
shadow.innerHTML = '<style>p{color:blue}</style><p><slot></slot></p>';`,
    category: 'Q&A'
  },
  {
    id: 'html-prefers-color-scheme',
    front: 'prefers-color-scheme',
    back: 'Media feature that reads the OS/browser dark-mode preference. Pair with the color-scheme CSS property so native UI (scrollbars, form controls) themes too.',
    code: `@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}`,
    category: 'Keyword'
  },
  {
    id: 'html-iframe-sandbox',
    front: 'iframe sandbox attribute',
    back: 'A bare sandbox applies every restriction; add tokens (allow-scripts, allow-forms) to lift one at a time. Combining allow-scripts + allow-same-origin lets the frame remove its own sandbox , avoid that pairing.',
    code: `<iframe src="https://untrusted.example" sandbox="allow-scripts"></iframe>`,
    category: 'Q&A'
  },
  {
    id: 'html-label-association',
    front: 'Explicit vs implicit label association',
    back: 'Explicit: <label for="id"> + matching id on the input. Implicit: input nested inside the label, no for/id needed. Explicit is recommended for the widest AT/tooling support.',
    code: `<label for="email">Email</label>
<input id="email" name="email" type="email" />`,
    category: 'Q&A'
  },
  {
    id: 'html-canvas-vs-svg',
    front: 'canvas vs svg',
    back: 'canvas is a raster bitmap painted with JS calls , fast for many small objects, but opaque to screen readers. svg is a tree of real, stylable, accessible DOM elements , scales losslessly but slows with huge node counts.',
    category: 'Q&A'
  },
  {
    id: 'html-details-summary',
    front: '<details>/<summary>',
    back: 'A native disclosure widget, no JS needed. The boolean open attribute controls visibility; remove it entirely to collapse. Give several the same name attribute for accordion (only-one-open) behaviour.',
    code: `<details><summary>More info</summary><p>Hidden until opened.</p></details>`,
    category: 'Keyword'
  },
  {
    id: 'html-dialog',
    front: '<dialog>.showModal() vs .show()',
    back: 'showModal(): rest of the page goes inert, focus is trapped inside, Escape closes it, ::backdrop renders behind it. show(): opens non-modally with none of that , just a visible element.',
    code: `dialog.showModal(); // focus trap + Escape-to-close, free`,
    category: 'Q&A'
  },
  {
    id: 'html-noopener',
    front: 'Why rel="noopener noreferrer" on target="_blank"?',
    back: 'Without it, the opened page gets window.opener and can redirect the tab that opened it (reverse tabnabbing). noopener nulls that reference; noreferrer also strips the Referer header.',
    code: `<a href="https://external.example" target="_blank" rel="noopener noreferrer">Link</a>`,
    category: 'Q&A'
  },
  {
    id: 'html-tabindex',
    front: 'tabindex: 0 vs -1 vs positive',
    back: 'tabindex="0": focusable, natural tab order. tabindex="-1": focusable only via el.focus(), skipped by Tab. Positive values reorder tab stops by number , an anti-pattern that breaks as soon as the DOM changes.',
    category: 'Keyword'
  },
  {
    id: 'html-character-references',
    front: 'Why escape < and & in HTML text?',
    back: 'The parser uses < to start a tag and & to start a character reference , unescaped ones break parsing (or enable XSS from user input). Use &lt; and &amp;, or numeric refs like &#60;.',
    code: `<p>5 &lt; 10 &amp;&amp; 10 &gt; 5</p>`,
    category: 'Q&A'
  },
  {
    id: 'html-drag-and-drop',
    front: 'Drag and Drop API event order',
    back: 'dragstart (source) → dragenter/dragleave → repeated dragover (target) → drop (target) → dragend (source, always). preventDefault() in dragover is required, otherwise the drop is rejected by default.',
    code: `target.addEventListener('dragover', e => e.preventDefault()); // required
target.addEventListener('drop', e => console.log(e.dataTransfer.getData('text/plain')));`,
    category: 'Q&A'
  },
  {
    id: 'html-template',
    front: 'The <template> element',
    back: 'Inert markup , not rendered, scripts don’t run, images don’t load. Clone it with document.importNode(tpl.content, true) before appending it to the DOM to actually use it.',
    code: `const clone = document.importNode(tpl.content, true);
document.body.appendChild(clone);`,
    category: 'Keyword'
  },
  {
    id: 'html-resource-hints',
    front: 'preload vs prefetch vs preconnect vs dns-prefetch',
    back: 'preload: fetch now, needed soon (needs as=). prefetch: low-priority, needed on next navigation. preconnect: DNS+TCP+TLS handshake early, no fetch. dns-prefetch: DNS only, cheapest, good for many third-party domains.',
    code: `<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>`,
    category: 'Q&A'
  },
  {
    id: 'html-inert',
    front: 'The inert attribute',
    back: 'Removes a whole subtree from focus, clicks, selection, find-in-page, and the accessibility tree in one go. showModal() on a <dialog> uses it under the hood to make the rest of the page inert.',
    category: 'Keyword'
  },
  {
    id: 'html-popover',
    front: 'The popover attribute',
    back: 'Native top-layer overlay with automatic light-dismiss (outside click / Escape). Lighter than <dialog> , no built-in focus trap, meant for menus/tooltips rather than fully blocking content.',
    code: `<button popovertarget="menu">Open</button>
<div id="menu" popover>Menu content</div>`,
    category: 'Q&A'
  }
];

// ─── CSS flashcards ────────────────────────────────────────────────────────────

export const cssFlashcards: Flashcard[] = [
  {
    id: 'css-box-sizing',
    front: 'content-box vs border-box',
    back: 'content-box (default): width = content only, padding/border added on top. border-box: width includes padding+border , far more predictable. Reset to border-box globally.',
    code: `*, *::before, *::after { box-sizing: border-box; }`,
    category: 'Q&A'
  },
  {
    id: 'css-specificity',
    front: 'CSS specificity order',
    back: 'inline style > #id > .class / [attr] / :pseudo-class > element. Ties break by source order (later wins). !important overrides all.',
    code: `#nav .link { color: red; }    /* (1,1,0) wins */
.link        { color: blue; } /* (0,1,0) loses */`,
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
    code: `.parent { position: relative; }
.badge { position: absolute; top: 0; right: 0; }
.header { position: sticky; top: 0; }`,
    category: 'Q&A'
  },
  {
    id: 'css-em-rem',
    front: 'em vs rem',
    back: 'em is relative to the element’s own font-size and compounds when nested. rem is relative to the root font-size , predictable and the usual choice for scalable sizing.',
    category: 'Q&A'
  },
  {
    id: 'css-margin-collapse',
    front: 'Margin collapsing',
    back: 'Adjacent vertical margins merge into the larger of the two (not the sum). Only vertical, only block elements; flex/grid items don’t collapse.',
    code: `.a { margin-bottom: 30px; }  /* gap ends up 30px */
.b { margin-top: 20px; }     /* not 50px */`,
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
    back: '--name defined on a selector (often :root), read via var(--name). Unlike Sass vars they’re live at runtime , cascade, inherit, and can change in JS or media queries.',
    code: `:root { --brand: #4f46e5; }
.btn { background: var(--brand); }`,
    category: 'Keyword'
  },
  {
    id: 'css-animate-perf',
    front: 'Which properties are cheap to animate?',
    back: 'transform and opacity , they run on the GPU compositor with no layout/paint. Avoid animating width/height/top/left, which force reflow every frame.',
    code: `.btn { transition: transform .2s ease; }
.btn:hover { transform: scale(1.05); }`,
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
  },
  {
    id: 'css-bfc',
    front: 'Block Formatting Context (BFC)',
    back: 'A self-contained layout region that contains floats and stops margins collapsing across its boundary. display: flow-root creates one with no side effects, unlike the old overflow:hidden clearfix hack.',
    code: `.clearfix { display: flow-root; }
.clearfix > .floated { float: left; }`,
    category: 'Keyword'
  },
  {
    id: 'css-has-selector',
    front: 'The :has() selector',
    back: 'The "parent selector" , matches an element based on what’s inside or after it. Specificity comes from its most specific argument, like :is()/:not(). Scope it tightly to avoid recalculation cost.',
    code: `.form-group:has(input:invalid) { border-color: red; }`,
    category: 'Q&A'
  },
  {
    id: 'css-cascade-layers',
    front: '@layer (cascade layers)',
    back: 'Declares a priority order for groups of rules , later layers always win over earlier ones, regardless of selector specificity. Unlayered styles always beat layered ones. Solves utility-vs-component override fights.',
    code: `@layer reset, components, utilities;
@layer utilities { .bg-brand { background: blue; } }`,
    category: 'Q&A'
  },
  {
    id: 'css-content-visibility',
    front: 'content-visibility: auto',
    back: 'Skips layout/style/paint for off-screen content until it’s needed, while keeping it in the DOM and accessibility tree. Pair with contain-intrinsic-size to reserve space and avoid layout shift.',
    code: `.section {
  content-visibility: auto;
  contain-intrinsic-size: 500px;
}`,
    category: 'Q&A'
  },
  {
    id: 'css-logical-properties',
    front: 'Logical properties',
    back: 'margin-inline-start, inset-block-start etc. size relative to reading direction (inline/block axes), not a fixed screen edge , they flip automatically under direction: rtl, unlike physical properties like margin-left.',
    code: `.card { margin-inline-start: 16px; } /* flips under RTL, no override needed */`,
    category: 'Keyword'
  },
  {
    id: 'css-hiding-elements',
    front: 'display: none vs visibility: hidden vs opacity: 0',
    back: 'display:none: gone from layout + a11y tree, no events. visibility:hidden: keeps space, gone from a11y tree, unfocusable. opacity:0: keeps space, stays in a11y tree, still clickable.',
    category: 'Q&A'
  },
  {
    id: 'css-critical-rendering-path',
    front: 'Critical Rendering Path',
    back: 'DOM + CSSOM → render tree → layout → paint → composite. Changing width triggers layout+paint. Changing color skips layout, still repaints. transform/opacity can be compositor-only , skips both.',
    category: 'Q&A'
  },
  {
    id: 'css-object-fit',
    front: 'object-fit values',
    back: 'fill (default, may distort): stretches to box. contain: fits whole image, may letterbox. cover: fills box, crops overflow. none: natural size. scale-down: smaller of none/contain.',
    code: `img { object-fit: cover; object-position: top; }`,
    category: 'Keyword'
  },
  {
    id: 'css-aspect-ratio',
    front: 'aspect-ratio property',
    back: 'Reserves box space by ratio (16/9) before content loads, preventing layout shift , replaces the old padding-top percentage hack. Only works if width or height is auto.',
    code: `img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }`,
    category: 'Q&A'
  },
  {
    id: 'css-calc-min-max',
    front: 'calc() vs min() vs max() vs clamp()',
    back: 'calc(): mixed-unit arithmetic. min(): smallest of a list (a cap). max(): largest of a list (a floor). clamp(MIN, VAL, MAX) = max(MIN, min(VAL, MAX)) , both a floor and a ceiling.',
    code: `width: calc(100% - 2rem);
font-size: min(5vw, 2rem);`,
    category: 'Q&A'
  },
  {
    id: 'css-float-clear',
    front: 'Why does a floated container collapse to zero height?',
    back: 'Floats are removed from normal flow and don’t contribute to their parent’s height. Fix with display: flow-root on the container (modern clearfix) instead of the old empty-div/overflow hacks.',
    code: `.container { display: flow-root; }`,
    category: 'Q&A'
  },
  {
    id: 'css-is-not-where',
    front: ':is() vs :where() specificity',
    back: ':is()/:not() take the specificity of their most specific argument. :where() is always zero specificity , handy for resets that should be trivially overridable later.',
    code: `:where(section, article, aside) h1 { font-size: 1.5rem; } /* specificity 0 */`,
    category: 'Q&A'
  },
  {
    id: 'css-overflow-clip',
    front: 'overflow: hidden vs overflow: clip',
    back: 'hidden clips visually but still allows programmatic scrolling (scrollTo, focus). clip is stricter , it disallows all scrolling, including programmatic. Both (and scroll/auto) create a new BFC.',
    category: 'Keyword'
  },
  {
    id: 'css-backdrop-filter',
    front: 'filter vs backdrop-filter',
    back: 'filter affects the element and its own content. backdrop-filter affects only what’s visually behind it , needs a transparent element to show, and is blocked by any ancestor that’s itself a "backdrop root" (opacity<1, filter, etc.).',
    code: `.glass { background: rgb(255 255 255 / .2); backdrop-filter: blur(10px); }`,
    category: 'Q&A'
  }
];
