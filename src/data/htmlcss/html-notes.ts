import type { Note } from '@/types/content';

// category values: 'semantics' | 'forms' | 'media' | 'accessibility' | 'document' | 'apis'

export const htmlNotes: Note[] = [
  // ─── DOCUMENT ───────────────────────────────────────────────────────────────
  {
    id: 'html-doctype',
    title: 'The <!DOCTYPE html> Declaration',
    summary: 'Tells the browser to render in standards mode rather than legacy "quirks" mode.',
    difficulty: 'basic',
    category: 'document',
    keyPoints: [
      '<!DOCTYPE html> is the HTML5 doctype , it must be the very first line of the document.',
      'Without it, browsers fall into "quirks mode" and emulate old, buggy box-model behaviour.',
      'It is not an HTML tag , it is an instruction to the browser, with no closing tag.',
      'The same short doctype works for all modern HTML; the long SGML doctypes are an HTML4 relic.'
    ],
    gotcha:
      'Missing or misspelling the doctype silently triggers quirks mode, where the CSS box model and other behaviours differ , layouts then break in subtle ways.',
    codeSnippet: `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="utf-8" /></head>
  <body>…</body>
</html>`
  },
  {
    id: 'html-meta-viewport',
    title: 'The Viewport Meta Tag',
    summary: 'Controls how a page is scaled on mobile , essential for responsive design.',
    difficulty: 'basic',
    category: 'document',
    keyPoints: [
      'width=device-width sets the layout viewport to the device’s actual width.',
      'initial-scale=1 sets the starting zoom level to 100%.',
      'Without it, mobile browsers assume a ~980px desktop page and zoom out, shrinking everything.',
      'It is the prerequisite that makes CSS media queries behave as intended on phones.'
    ],
    gotcha:
      'Setting user-scalable=no or a fixed maximum-scale blocks pinch-zoom, which is an accessibility failure , avoid disabling zoom.',
    codeSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1" />`
  },
  {
    id: 'html-head-essentials',
    title: 'Essential <head> Metadata',
    summary: 'The <head> holds metadata the browser and crawlers read but users don’t see directly.',
    difficulty: 'basic',
    category: 'document',
    keyPoints: [
      '<meta charset="utf-8"> should come first so the browser decodes text correctly.',
      '<title> sets the tab/bookmark label and is a major SEO signal.',
      '<meta name="description"> feeds the search-result snippet.',
      'Open Graph tags (og:title, og:image) control how links unfurl on social platforms.',
      '<link rel="canonical"> tells search engines the preferred URL for duplicate content.'
    ],
    codeSnippet: `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>QuickRecall</title>
  <meta name="description" content="Interview prep cheat sheets" />
  <meta property="og:title" content="QuickRecall" />
</head>`
  },

  // ─── SEMANTICS ──────────────────────────────────────────────────────────────
  {
    id: 'html-semantic-elements',
    title: 'Semantic HTML',
    summary: 'Use elements that describe their meaning (<nav>, <article>) rather than generic <div>s.',
    difficulty: 'basic',
    category: 'semantics',
    keyPoints: [
      'Semantic tags convey role: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>.',
      'Benefits: accessibility (screen readers announce landmarks), SEO, and readable markup.',
      'Use <main> once per page for the primary content; <article> for self-contained units.',
      '<section> groups related content and usually has a heading; <div> is a last-resort generic box.',
      'Headings <h1>–<h6> create the document outline , don’t skip levels for styling reasons.'
    ],
    gotcha:
      'Reaching for <div>/<span> when a semantic element exists (“div soup”) removes the free accessibility and meaning the platform gives you.',
    codeSnippet: `<header><nav>…</nav></header>
<main>
  <article>
    <h1>Title</h1>
    <section><h2>Part</h2>…</section>
  </article>
  <aside>Related</aside>
</main>
<footer>…</footer>`
  },
  {
    id: 'html-block-inline',
    title: 'Block vs Inline Elements',
    summary: 'Block elements stack and take full width; inline elements flow within a line.',
    difficulty: 'basic',
    category: 'semantics',
    keyPoints: [
      'Block (e.g. <div>, <p>, <h1>, <section>): start on a new line, take available width, respect width/height.',
      'Inline (e.g. <span>, <a>, <strong>, <em>): flow within text, only as wide as content, ignore width/height.',
      'inline-block is a hybrid: flows inline but accepts width/height and vertical padding.',
      'This is the element’s default display value , CSS display can override it.'
    ],
    gotcha:
      'It’s invalid to nest a block element inside an inline one (e.g. a <div> inside a <span>) , the browser may reparent it and break your layout.',
    codeSnippet: `<!-- block: stacks -->
<p>Paragraph one</p>
<p>Paragraph two</p>

<!-- inline: flows -->
<p>Text with <a href="#">a link</a> inside.</p>`
  },
  {
    id: 'html-data-attributes',
    title: 'data-* Attributes',
    summary: 'Custom attributes for attaching app data to elements, read in JS via dataset.',
    difficulty: 'basic',
    category: 'semantics',
    keyPoints: [
      'Any attribute prefixed with data- is valid HTML and stores custom data.',
      'Read/write in JS via el.dataset , data-user-id becomes dataset.userId (camelCased).',
      'Useful for hooks that shouldn’t be classes/ids, or passing config to a component.',
      'Also targetable in CSS with attribute selectors: [data-state="open"] { … }.'
    ],
    gotcha: 'data-* is for app-internal data, not sensitive info , it sits in plain HTML, visible to anyone viewing source.',
    codeSnippet: `<button data-user-id="42" data-action="delete">×</button>

<script>
  btn.dataset.userId; // "42"
  btn.dataset.action; // "delete"
</script>`
  },

  // ─── FORMS ──────────────────────────────────────────────────────────────────
  {
    id: 'html-form-basics',
    title: 'Forms & Input Types',
    summary: 'HTML5 input types give the right keyboard, built-in validation, and better UX for free.',
    difficulty: 'basic',
    category: 'forms',
    keyPoints: [
      'type="email" | "number" | "tel" | "url" | "date" trigger appropriate mobile keyboards and validation.',
      'Every input should have a connected <label> via for/id (or wrap the input) for accessibility.',
      'name is what gets submitted; value is the current data.',
      'Group related controls with <fieldset> + <legend> (e.g. a set of radios).',
      'The submit button inside a <form> triggers submission and native validation.'
    ],
    codeSnippet: `<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />
  <button type="submit">Send</button>
</form>`
  },
  {
    id: 'html-form-validation',
    title: 'Native Form Validation',
    summary: 'Built-in attributes validate input before submit , no JavaScript required for the basics.',
    difficulty: 'intermediate',
    category: 'forms',
    keyPoints: [
      'Constraint attributes: required, min, max, minlength, maxlength, pattern (regex), type.',
      'The browser blocks submission and shows a native message when constraints fail.',
      'Style states with CSS :valid, :invalid, :required pseudo-classes.',
      'The Constraint Validation API (el.validity, setCustomValidity) customises messages in JS.',
      'novalidate on the <form> disables native validation when you handle it yourself.'
    ],
    gotcha: 'Client-side validation is for UX only , it’s trivially bypassed, so the server must always validate again.',
    codeSnippet: `<input
  type="password"
  required
  minlength="8"
  pattern="(?=.*\\d).+"
  title="Min 8 chars, include a number"
/>`
  },

  // ─── MEDIA ──────────────────────────────────────────────────────────────────
  {
    id: 'html-img-responsive',
    title: 'Responsive & Optimised Images',
    summary: 'srcset/sizes and <picture> serve the right image for the device , saving bytes.',
    difficulty: 'intermediate',
    category: 'media',
    keyPoints: [
      'Always set alt , describes the image for screen readers (empty alt="" for decorative images).',
      'srcset + sizes let the browser pick the best resolution for the viewport/DPR.',
      '<picture> with <source media=…> swaps whole images (art direction) or formats (AVIF/WebP fallback).',
      'loading="lazy" defers offscreen images until they’re near the viewport.',
      'Set width/height (or aspect-ratio) to reserve space and avoid layout shift (CLS).'
    ],
    gotcha: 'Omitting width/height makes the page reflow when each image loads, hurting the Cumulative Layout Shift metric.',
    codeSnippet: `<img
  src="small.jpg"
  srcset="small.jpg 480w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 1200px"
  width="1200" height="800"
  loading="lazy"
  alt="A red bicycle" />`
  },

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  {
    id: 'html-aria',
    title: 'ARIA & Accessibility',
    summary: 'ARIA fills accessibility gaps that semantic HTML can’t cover , but native elements come first.',
    difficulty: 'intermediate',
    category: 'accessibility',
    keyPoints: [
      'First rule of ARIA: don’t use ARIA if a native element already does the job (a <button> beats role="button").',
      'role tells assistive tech what an element is; aria-* attributes describe state/relationships.',
      'aria-label / aria-labelledby give an accessible name when there’s no visible text.',
      'aria-live announces dynamic updates (e.g. toast messages) without moving focus.',
      'Manage focus order and visible focus styles , keyboard users rely on them.'
    ],
    gotcha:
      'role="button" on a <div> still needs tabindex="0" and key handlers for Enter/Space , ARIA changes the announced role but adds zero behaviour.',
    codeSnippet: `<!-- prefer native -->
<button>Save</button>

<!-- only when you must fake it -->
<div role="button" tabindex="0"
     aria-pressed="false">Toggle</div>

<div aria-live="polite">Saved!</div>`
  },

  // ─── APIs ───────────────────────────────────────────────────────────────────
  {
    id: 'html-script-loading',
    title: 'Script Loading: defer vs async',
    summary: 'How and where you load <script> decides whether it blocks the page from rendering.',
    difficulty: 'intermediate',
    category: 'document',
    keyPoints: [
      'A plain <script> pauses HTML parsing while it downloads and runs (parser-blocking).',
      'defer: downloads in parallel, runs after the HTML is parsed, in document order , ideal for app code.',
      'async: downloads in parallel, runs as soon as it’s ready, order not guaranteed , good for independent scripts (analytics).',
      'type="module" scripts are deferred by default.',
      'Historically people put scripts at the end of <body> to achieve the same effect as defer.'
    ],
    gotcha:
      'async scripts can run before the DOM is ready or out of order, so don’t use async for code that depends on other scripts or the parsed DOM.',
    codeSnippet: `<script src="app.js" defer></script>
<script src="analytics.js" async></script>`
  }
];
