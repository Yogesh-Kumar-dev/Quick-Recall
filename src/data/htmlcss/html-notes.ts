import type { Note } from '@/types/content';

// category values: 'semantics' | 'forms' | 'media' | 'accessibility' | 'document' | 'apis' | 'security'

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
    prerequisites: ['html-doctype'],
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
    prerequisites: ['html-meta-viewport'],
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
    prerequisites: ['html-semantic-elements'],
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
    prerequisites: ['html-form-basics'],
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
    prerequisites: ['html-semantic-elements'],
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
  },

  // ─── APIs ───────────────────────────────────────────────────────────────────
  {
    id: 'html-shadow-dom',
    title: 'Shadow DOM & Web Components',
    summary:
      'Shadow DOM attaches a hidden DOM subtree to an element so its internal markup and CSS can’t be reached or broken from outside.',
    difficulty: 'advanced',
    category: 'apis',
    prerequisites: ['html-semantic-elements'],
    keyPoints: [
      'element.attachShadow({ mode: "open" }) creates a shadow root , styles and querySelector calls from the main page stop at that boundary in both directions.',
      '"open" mode exposes element.shadowRoot from outside; "closed" makes it return null , but that’s a signal, not a real security boundary (it’s bypassable via devtools/extensions).',
      '<slot> elements let content passed in from the light DOM (the regular page) render inside the shadow tree, like a fill-in-the-blank.',
      'Browsers already use this internally , a <video> element’s play/pause/volume controls are its own shadow DOM.',
      '::part() and ::slotted() let the outside page selectively style specific pieces of a shadow tree that the component author opts in to exposing.'
    ],
    gotcha:
      'mode: "closed" is often mistaken for a real security wall , it only hides the shadowRoot property; anything inside is still part of the live page and inspectable via devtools.',
    codeSnippet: `class InfoCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
      <style>p { color: blue; }</style>
      <p><slot>Default text</slot></p>
    \`;
  }
}
customElements.define('info-card', InfoCard);
// <info-card>Hello</info-card> renders "Hello" in blue,
// and the page's own CSS can't override that <p>`
  },
  {
    id: 'html-prefers-media',
    title: 'prefers-color-scheme & prefers-reduced-motion',
    summary: 'Media features that expose the user’s OS-level dark-mode and reduce-motion preferences straight to CSS.',
    difficulty: 'intermediate',
    category: 'accessibility',
    prerequisites: ['html-meta-viewport'],
    keyPoints: [
      'prefers-color-scheme: dark | light reads the OS/browser theme preference , pair it with the color-scheme CSS property (or a <meta name="color-scheme">) so native UI like scrollbars and form controls theme too.',
      'prefers-reduced-motion: reduce reads the OS "reduce motion" accessibility setting , used to gate large or looping animations for users prone to motion sickness or vestibular disorders.',
      'Both are also available in JS via window.matchMedia("(prefers-color-scheme: dark)").matches, and as HTTP Client Hints for server-rendered theme decisions.',
      'These are preferences, not guarantees , always ship a sensible default appearance rather than assuming no-preference means "safe to animate heavily."',
      'Sibling media features in the same family: prefers-reduced-transparency, prefers-reduced-data.'
    ],
    codeSnippet: `:root { color-scheme: light dark; }

@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}`
  },

  // ─── SECURITY ───────────────────────────────────────────────────────────────
  {
    id: 'html-iframe-sandbox',
    title: '<iframe> Sandboxing',
    summary: 'The sandbox attribute locks down what an embedded page can do , empty by default means maximally restricted.',
    difficulty: 'advanced',
    category: 'security',
    prerequisites: ['html-semantic-elements'],
    keyPoints: [
      'A bare sandbox attribute applies every restriction (no scripts, no forms, no same-origin access, no top-level navigation, …); add space-separated tokens to selectively re-enable one: allow-scripts, allow-forms, allow-same-origin, allow-popups, allow-modals, allow-downloads.',
      'Restrictions inherit into any popup a sandboxed frame opens, unless allow-popups-to-escape-sandbox is set.',
      'The credentialless attribute is a newer alternative: the iframe loads with no access to its origin’s cookies/storage, letting COEP-restricted pages embed third-party content that doesn’t itself opt in to COEP.',
      'Sandboxing an iframe doesn’t help if the attacker can just get the content opened in a full tab instead , pair it with serving untrusted content from a separate origin.'
    ],
    gotcha:
      'Combining allow-scripts with allow-same-origin on a same-origin embed is a classic interview trap , the embedded document can then run a script that simply removes its own sandbox attribute, defeating the sandbox entirely.',
    codeSnippet: `<!-- fully locked down -->
<iframe src="https://untrusted.example" sandbox></iframe>

<!-- allow scripts, but NOT same-origin — safe combination -->
<iframe src="https://untrusted.example" sandbox="allow-scripts"></iframe>

<!-- dangerous: lets the frame remove its own sandbox -->
<iframe src="https://same-origin.example"
        sandbox="allow-scripts allow-same-origin"></iframe>`
  },
  {
    id: 'html-label-fieldset-a11y',
    title: 'Label, Fieldset & aria-describedby',
    summary: 'How a form is wired up decides whether assistive tech (and touch users) can actually use it , not just how it looks.',
    difficulty: 'intermediate',
    category: 'forms',
    prerequisites: ['html-form-basics'],
    keyPoints: [
      'Explicit association: <label for="email"> + a matching id="email" on the input. Implicit: nest the <input> directly inside the <label>, no for/id needed , explicit is generally recommended for the widest tooling support.',
      'Clicking or tapping a label focuses (or toggles) its associated control , a real usability win, especially for small checkbox/radio touch targets.',
      'Never nest another interactive element (a link, a button) or a heading inside a <label> , both confuse assistive tech; use <fieldset> + <legend> for section titles instead.',
      '<fieldset> groups related controls with a caption via a required, first-child <legend>; setting disabled on the <fieldset> disables every control inside it at once.',
      'aria-describedby="id" links extra descriptive text , typically an inline validation message , distinct from aria-labelledby, which gives the control its actual accessible name.'
    ],
    gotcha:
      'A red border alone on an invalid input tells a screen-reader user nothing , without aria-describedby pointing at the error text (or aria-invalid="true"), the validation message is invisible to them even though it’s on screen.',
    codeSnippet: `<fieldset>
  <legend>Contact details</legend>

  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error">Enter a valid email address.</p>
</fieldset>`
  },
  {
    id: 'html-table-a11y',
    title: 'Table Semantics & Accessibility',
    summary: 'A real <table> lets a screen reader announce row/column relationships , a div grid styled to look like a table can’t.',
    difficulty: 'intermediate',
    category: 'semantics',
    prerequisites: ['html-semantic-elements'],
    keyPoints: [
      '<caption> gives the table an accessible name/description , it’s the first thing a screen reader announces, letting a user decide whether to keep listening.',
      '<thead>, <tbody>, <tfoot> are optional but add real semantics on top of plain <tr> rows, and they’re also the hook for sticky headers and print pagination.',
      'scope="col" / scope="row" on a <th> tells assistive tech which axis that header describes , screen readers can often infer it, but not always, so setting it explicitly is safer.',
      'For complex tables with merged cells (colspan/rowspan), scope isn’t enough , pair id on each <th> with headers="id1 id2" on the <td> to spell out exactly which headers apply.',
      'A grid of styled <div>s has none of this structure , a screen reader just reads it as unrelated blocks of text, with no "row 3 of 12, column Age" announcement.'
    ],
    codeSnippet: `<table>
  <caption>Team roster</caption>
  <thead>
    <tr><th scope="col">Name</th><th scope="col">Role</th></tr>
  </thead>
  <tbody>
    <tr><td>Alice</td><td>Engineer</td></tr>
  </tbody>
</table>`
  },
  {
    id: 'html-canvas-vs-svg',
    title: '<canvas> vs <svg>',
    summary:
      'canvas is a raster bitmap you paint with JS calls; svg is a vector tree of real DOM elements , the choice changes both performance and accessibility.',
    difficulty: 'intermediate',
    category: 'media',
    keyPoints: [
      '<canvas> is immediate-mode: you issue drawing calls (ctx.fillRect(), ctx.drawImage()) and the browser forgets them , there’s no per-shape object to query or restyle afterwards, only the resulting pixels.',
      '<svg> is retained-mode: every shape is a real DOM element (<circle>, <path>) that stays queryable, individually stylable with CSS, and animatable.',
      'canvas tends to perform better with many small/simple objects (particles, per-pixel effects) since there’s no DOM overhead per shape; svg scales losslessly to any zoom level but slows down with a very large number of nodes.',
      'Because svg elements live in the DOM, they can carry role/aria-label and are inspectable by assistive tech; canvas output is one opaque bitmap , it needs fallback content or an aria-label to be accessible at all.',
      'Rule of thumb: a handful of icons/illustrations/charts , svg. A game loop, image-editing surface, or thousands of moving particles , canvas.'
    ],
    gotcha:
      'Content painted onto a <canvas> is invisible to screen readers by default , always provide fallback content inside the tag or an aria-label describing what it shows.',
    codeSnippet: `<!-- svg: real, inspectable, stylable elements -->
<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>

<!-- canvas: pixels only, nothing left to query afterwards -->
<canvas id="c" width="100" height="100" aria-label="A blue circle"></canvas>
<script>
  const ctx = document.getElementById('c').getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.beginPath(); ctx.arc(50, 50, 40, 0, Math.PI * 2); ctx.fill();
</script>`
  },
  {
    id: 'html-details-summary',
    title: '<details> & <summary>',
    summary: 'A native, JS-free disclosure widget , click the summary and the rest of the content shows or hides itself.',
    difficulty: 'basic',
    category: 'semantics',
    prerequisites: ['html-semantic-elements'],
    keyPoints: [
      'The open attribute is boolean , add it to start expanded, and remove it entirely to collapse (setting open="false" does nothing, it’s still present).',
      '<summary> is the always-visible label; everything else inside <details> is the collapsible content.',
      'A toggle event fires on the <details> element whenever it opens or closes , listen on that instead of wiring up your own click handler.',
      'Give several <details> elements the same name attribute to make them mutually exclusive , only one stays open at a time, like an accordion, with zero JavaScript.',
      'The disclosure triangle is a ::marker pseudo-element (or ::-webkit-details-marker in older WebKit) , style or hide it with plain CSS.'
    ],
    codeSnippet: `<details>
  <summary>System requirements</summary>
  <p>Requires a computer running an operating system.</p>
</details>

<!-- accordion: only one open at a time, no JS -->
<details name="faq"><summary>Question 1</summary><p>…</p></details>
<details name="faq"><summary>Question 2</summary><p>…</p></details>`
  },
  {
    id: 'html-dialog',
    title: 'The <dialog> Element',
    summary:
      'A native modal/non-modal dialog box , showModal() gives you focus trapping and Escape-to-close for free, no library required.',
    difficulty: 'intermediate',
    category: 'semantics',
    prerequisites: ['html-aria'],
    keyPoints: [
      'dialog.showModal() opens it modally: the rest of the page becomes inert (unfocusable, unclickable), focus is trapped inside, and Escape closes it automatically.',
      'dialog.show() (or just adding the open attribute) opens it non-modally , no backdrop, no focus trap, no built-in Escape handling, it behaves like any other visible element.',
      '::backdrop is a pseudo-element you can style , it only renders behind a modally-opened dialog, giving the dimmed-background effect for free.',
      'The close event fires when the dialog closes; nesting a <form method="dialog"> inside it closes the dialog on submit and sets dialog.returnValue to the clicked button’s value.',
      'Never set tabindex on the <dialog> itself , it isn’t an interactive element, and MDN explicitly calls this out as invalid usage.'
    ],
    codeSnippet: `<dialog id="confirm">
  <form method="dialog">
    <p>Delete this item?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm">Delete</button>
  </form>
</dialog>

<script>
  const dialog = document.getElementById('confirm');
  dialog.showModal();
  dialog.addEventListener('close', () => console.log(dialog.returnValue));
</script>`
  },
  {
    id: 'html-noopener',
    title: 'target="_blank" & rel="noopener noreferrer"',
    summary: 'A page opened via target="_blank" can otherwise navigate the tab that opened it , rel="noopener" cuts that link.',
    difficulty: 'intermediate',
    category: 'security',
    keyPoints: [
      'Without noopener, the newly opened page gets window.opener , a live reference back to the tab that opened it, which it can use to redirect that original tab (e.g. to a phishing page) while the user is looking at the new one. This attack is called reverse tabnabbing.',
      'rel="noopener" sets window.opener to null in the new tab, closing that hole; rel="noreferrer" does the same and additionally strips the Referer header sent to the target site.',
      'Modern browsers now apply noopener behaviour automatically to any target="_blank" link even without the rel attribute , but explicitly adding rel="noopener noreferrer" is still recommended for older browsers and for the extra referrer suppression.',
      'This only matters for links that open pages you don’t fully trust (user-generated content, third-party links) , it’s not needed for links to your own site.'
    ],
    gotcha:
      'It’s easy to add target="_blank" for UX reasons and forget the security side , always pair it with rel="noopener noreferrer" when the destination isn’t your own site.',
    codeSnippet: `<a href="https://external-site.example" target="_blank" rel="noopener noreferrer">
  Visit external site
</a>`
  },
  {
    id: 'html-tabindex',
    title: 'The tabindex Attribute',
    summary: 'tabindex decides whether an element can receive keyboard focus, and where it falls in the Tab-key order.',
    difficulty: 'intermediate',
    category: 'accessibility',
    prerequisites: ['html-aria'],
    keyPoints: [
      'tabindex="0" makes an element focusable and inserts it into the natural, DOM-order tab sequence , the standard way to make a custom widget (like a fake button) keyboard-reachable.',
      'tabindex="-1" makes an element focusable only programmatically (el.focus()) and removes it from Tab-key navigation , useful for moving focus to an error message or a modal’s heading without adding a stray tab stop.',
      'A positive tabindex (tabindex="4") jumps that element ahead of every 0/lower-positive element in tab order by number , MDN calls this an anti-pattern: it creates a focus order divorced from the visual/DOM order and confuses keyboard and screen-reader users.',
      'Natively interactive elements (<a href>, <button>, <input>) are already focusable and already in tab order , they don’t need an explicit tabindex.',
      'The <dialog> element must never get a tabindex , it isn’t interactive itself.'
    ],
    gotcha:
      'Reaching for a positive tabindex to "fix" tab order is a trap , it works locally but breaks the moment another developer adds a new focusable element, since the order no longer matches the DOM. Restructure the DOM order instead.',
    codeSnippet: `<div role="button" tabindex="0">Custom button , reachable by Tab</div>
<h2 tabindex="-1" id="error-heading">Form has errors</h2>
<script>
  document.getElementById('error-heading').focus(); // focusable, but not tab-reachable
</script>`
  },
  {
    id: 'html-contenteditable',
    title: 'The contenteditable Attribute',
    summary: 'Turns any element into a user-editable text region directly on the page , no <input> or <textarea> required.',
    difficulty: 'intermediate',
    category: 'apis',
    keyPoints: [
      'It’s an enumerated attribute, not boolean: contenteditable="true" (or bare contenteditable) is editable, "false" is not, and "plaintext-only" is editable but strips all rich formatting.',
      'An element with no contenteditable value inherits editability from its parent.',
      'Edits fire input events, the same event used for <input>/<textarea> , listen there to react to changes.',
      'Rich-text commands historically went through document.execCommand() , it’s legacy/deprecated but still widely used by simple in-browser editors since no fully-supported replacement covers every case yet.',
      'Pasting into a contenteditable="true" region keeps all the source formatting (bold, links, lists) unless you intercept the paste event yourself , plaintext-only strips it automatically.'
    ],
    codeSnippet: `<div contenteditable="true">Click and start typing…</div>

<div contenteditable="plaintext-only">Paste here strips all formatting</div>

<script>
  document.querySelector('[contenteditable]')
    .addEventListener('input', (e) => console.log(e.target.textContent));
</script>`
  },
  {
    id: 'html-picture-art-direction',
    title: '<picture>: Art Direction vs Resolution Switching',
    summary:
      'srcset serves the same image at different sizes; <picture> + <source media> serves genuinely different images per breakpoint.',
    difficulty: 'advanced',
    category: 'media',
    prerequisites: ['html-img-responsive'],
    keyPoints: [
      'Resolution switching (srcset/sizes on a plain <img>, no <picture> needed) picks between different-sized copies of the SAME image , for sharpness and bandwidth, not different content.',
      'Art direction (<picture> with one or more <source media="(...)"> plus a fallback <img>) swaps in a genuinely different image per breakpoint , e.g. a tightly-cropped portrait on mobile versus a wide landscape shot on desktop, because one image’s proportions don’t work everywhere.',
      'The browser evaluates <source> elements top to bottom and uses the first one whose media query matches (or whose type it can render), falling through to the <img> if none match.',
      '<picture> also handles format fallback: chain <source type="image/avif">, <source type="image/webp"> before a plain <img src="photo.jpg">, and the browser silently skips any format it can’t decode , no JS or server-side UA sniffing needed.',
      'The <img> inside <picture> is mandatory and does the actual rendering , the <source> elements only ever supply candidates for it.'
    ],
    codeSnippet: `<picture>
  <!-- art direction: different crop on narrow screens -->
  <source media="(max-width: 600px)" srcset="portrait-crop.jpg" />
  <!-- format fallback: modern format first -->
  <source type="image/avif" srcset="wide.avif" />
  <img src="wide.jpg" alt="Product photo" />
</picture>`
  },
  {
    id: 'html-character-references',
    title: 'Character References (HTML Entities)',
    summary: 'Escape sequences like &amp; and &lt; represent characters the HTML parser would otherwise read as markup.',
    difficulty: 'basic',
    category: 'document',
    keyPoints: [
      'Three equivalent forms: named (&lt;), decimal numeric (&#60;), hex numeric (&#x3C;) , all three render the exact same character.',
      '< and & must be escaped in text content because the parser uses < to start a tag and & to start a character reference , an unescaped one makes the markup ambiguous or broken.',
      'The common set: &amp; = &, &lt; = <, &gt; = >, &quot; = ", &apos; = \', &nbsp; = non-breaking space, &copy; = ©.',
      'This is a parser-level concept, distinct from JS string escaping (\\n, \\", \\\\) , that’s a lexical rule for JS string literals, handled by a completely different engine.',
      'The full named-reference list runs to hundreds of names defined by the WHATWG spec , &lt;/&gt;/&amp;/&quot;/&nbsp; cover the vast majority of real usage.'
    ],
    gotcha:
      'Rendering user-generated text as raw HTML instead of escaping it isn’t just a display bug , unescaped < turns user input into live markup, which is how basic XSS injection works.',
    codeSnippet: `<p>5 &lt; 10 &amp;&amp; 10 &gt; 5 &mdash; &copy; 2026</p>
<!-- renders as: 5 < 10 && 10 > 5 — © 2026 -->`
  },
  {
    id: 'html-drag-and-drop',
    title: 'Drag and Drop API',
    summary: 'A native browser API for dragging elements with the pointer, driven by a sequence of drag events and a DataTransfer payload.',
    difficulty: 'advanced',
    category: 'apis',
    keyPoints: [
      'Event order: dragstart (on the source) → dragenter/dragleave (as the pointer crosses potential targets) → repeated dragover (on the current target) → drop (on the target, if the drop is accepted) → dragend (always fires on the source, success or not).',
      'Any element becomes draggable with draggable="true" , links, images, and text selections are draggable by default already.',
      'Most elements reject drops by default , calling event.preventDefault() inside the dragover handler is what actually turns an element into a valid drop target.',
      'DataTransfer.setData(type, data) in dragstart stores the payload; DataTransfer.getData(type) in drop reads it back , the data is only readable during dragstart and drop, not during dragover/dragenter.',
      'dropEffect / effectAllowed on the DataTransfer control the copy/move/link semantics and the cursor feedback shown while dragging.'
    ],
    gotcha:
      'Forgetting preventDefault() in the dragover handler is the most common reason a "drop zone" silently never fires its drop event , the browser’s default action (reject the drop) wins unless you explicitly cancel it.',
    codeSnippet: `el.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', 'payload'));

target.addEventListener('dragover', (e) => e.preventDefault()); // required to allow a drop
target.addEventListener('drop', (e) => {
  e.preventDefault();
  console.log(e.dataTransfer.getData('text/plain'));
});`
  },
  {
    id: 'html-template',
    title: 'The <template> Element',
    summary:
      'Holds markup that the browser parses but never renders , scripts don’t run and images don’t load until you clone it into the live DOM.',
    difficulty: 'intermediate',
    category: 'apis',
    prerequisites: ['html-shadow-dom'],
    keyPoints: [
      'Content inside <template> is not rendered, doesn’t run scripts, and doesn’t load images , <template>.childNodes is always empty; the markup instead lives in the read-only .content DocumentFragment.',
      'Get a usable copy with document.importNode(template.content, true) (clones into the current document, correct when a custom element constructs its shadow tree) or template.content.cloneNode(true) (clones within the template’s own document).',
      'Nothing happens until you clone it , a <template> sitting alone on the page has zero visible or executable effect.',
      'Directly relevant to Web Components: a <template shadowrootmode="open"> declaratively creates a Shadow DOM (the declarative equivalent of calling attachShadow()), making it the standard way to define a component’s internal structure.',
      'Appending children straight onto the <template> element itself (instead of into its .content) breaks its content model , always go through .content.'
    ],
    codeSnippet: `<template id="row-template">
  <tr><td class="name"></td><td class="role"></td></tr>
</template>

<script>
  const tpl = document.getElementById('row-template');
  const clone = document.importNode(tpl.content, true);
  clone.querySelector('.name').textContent = 'Alice';
  table.appendChild(clone);
</script>`
  },
  {
    id: 'html-resource-hints',
    title: 'Resource Hints: preload, prefetch, preconnect, dns-prefetch',
    summary: 'Four <link rel> hints that tell the browser to do different amounts of work early, for different resource-timing scenarios.',
    difficulty: 'advanced',
    category: 'document',
    prerequisites: ['html-script-loading'],
    keyPoints: [
      'preload: fetches a resource the current page needs very soon (e.g. a font referenced only inside CSS) at high priority. Requires an as attribute (font, script, style, image…) so the browser applies the right priority/headers , font and cross-origin fetches also need crossorigin.',
      'prefetch: a low-priority fetch for something likely needed on the next navigation, cached on disk , support is less universal than preload, so treat it as a progressive enhancement, not a guarantee.',
      'preconnect: does the DNS + TCP (+ TLS) handshake to a cross-origin server ahead of time with no resource fetched , best reserved for a handful of critical third-party origins, since each one opens a real connection.',
      'dns-prefetch: the cheapest hint, resolves DNS only (no TCP/TLS) , good for spreading across many third-party domains where a full preconnect per domain would be wasteful.',
      'A preload with no matching use shortly after (wrong as, or the resource simply isn’t used) triggers a devtools "preloaded but not used" warning , it’s wasted bandwidth, not a free optimization.'
    ],
    codeSnippet: `<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preconnect" href="https://api.example.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />`
  },
  {
    id: 'html-autocomplete',
    title: 'The autocomplete Attribute',
    summary: 'A hint, not a hard rule, telling the browser what kind of data a field expects and whether it may offer autofill for it.',
    difficulty: 'intermediate',
    category: 'forms',
    prerequisites: ['html-form-basics'],
    keyPoints: [
      'Accepts off, on, or an ordered token from a large standard vocabulary , email, current-password, new-password, one-time-code, given-name, cc-number, and more.',
      'Distinguishing current-password from new-password matters , it’s what lets a password manager correctly offer "fill saved password" on login forms versus "generate/save a new one" on signup forms.',
      'An input without its own autocomplete inherits its owning <form>’s attribute.',
      'In most modern browsers, autocomplete="off" no longer stops a password manager from offering to save/fill a login field , browsers deliberately override it there to protect the password-manager UX.',
      'Correct autocomplete tokens satisfy a WCAG 2.2 success criterion (Identify Input Purpose) and genuinely help users with cognitive or motor impairments , don’t disable it broadly or invent non-standard values just to fight autofill.'
    ],
    codeSnippet: `<input type="password" name="new_pw" autocomplete="new-password" />
<input type="password" name="login_pw" autocomplete="current-password" />
<input type="text" inputmode="numeric" autocomplete="one-time-code" />`
  },
  {
    id: 'html-inert',
    title: 'The inert Attribute',
    summary:
      'A boolean attribute that removes a whole subtree from focus, clicks, text selection, find-in-page, and the accessibility tree at once.',
    difficulty: 'advanced',
    category: 'accessibility',
    prerequisites: ['html-tabindex'],
    keyPoints: [
      'Everything inside an inert element stops firing click/focus events, drops out of the Tab order, is skipped by find-in-page, can’t have its text selected, and is hidden from screen readers , all with one attribute, no per-element wiring.',
      'This is a relatively recent addition (broadly available since 2023) , worth double-checking if the project still needs to support older Safari/Firefox releases.',
      'A modal <dialog> opened with showModal() "escapes" inertness itself while implicitly making everything else on the page inert , that’s the actual mechanism behind its background-block/focus-trap behaviour, not special-case dialog code.',
      'For disabling a single control, use disabled instead , inert is meant for whole sections (a background page behind a modal, an off-screen panel), not individual form fields.',
      'inert has no visual styling of its own , you still need your own dimming/overlay to show the user that a section is temporarily unusable.'
    ],
    codeSnippet: `<div id="app-content"><!-- becomes inert while the dialog is open --></div>

<dialog id="confirm"><button>Close</button></dialog>
<script>document.getElementById('confirm').showModal();</script>

<!-- or apply it manually to any subtree -->
<nav inert>Disabled while a full-screen menu is open</nav>`
  },
  {
    id: 'html-popover',
    title: 'The popover Attribute',
    summary: 'Turns any element into a native, top-layer overlay with automatic light-dismiss , a lighter-weight sibling of <dialog>.',
    difficulty: 'advanced',
    category: 'apis',
    prerequisites: ['html-dialog'],
    keyPoints: [
      'Wire it up declaratively: <button popovertarget="id" popovertargetaction="show|hide|toggle"> , omitting popovertargetaction defaults to toggle. JS equivalents: showPopover(), hidePopover(), togglePopover().',
      'Three states: auto (default) closes on an outside click or Escape, and opening a new auto popover closes any other open auto popover; manual has no light-dismiss and several can stay open at once; hint is for tooltip-style UI.',
      'Renders in the top layer, stacked above all normal content, with an optional ::backdrop pseudo-element for a dimmed scrim behind it.',
      'No built-in focus trap , unlike <dialog>.showModal(), popover is meant for lighter UI (menus, tooltips, dismissible messages), not for things that must fully block interaction with the rest of the page.',
      'Newer than most HTML features (2023–2024 across browsers) and the hint state is newer still with inconsistent support , verify target browsers before relying on it, especially for hint.'
    ],
    codeSnippet: `<button popovertarget="menu">Open menu</button>
<div id="menu" popover>
  <a href="/profile">Profile</a>
  <a href="/settings">Settings</a>
</div>
<!-- clicking outside, or pressing Escape, closes it automatically -->`
  }
];
