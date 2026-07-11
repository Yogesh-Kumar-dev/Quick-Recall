import type { Note } from '@/types/content';

// category values: 'foundations' | 'semantics' | 'interaction' | 'testing'

export const accessibilityNotes: Note[] = [
  // ─── FOUNDATIONS ────────────────────────────────────────────────────────────
  {
    id: 'a11y-wcag-pour',
    title: 'WCAG & the POUR principles',
    summary:
      'The Web Content Accessibility Guidelines organise everything under four words , Perceivable, Operable, Understandable, Robust , and grade compliance A/AA/AAA.',
    difficulty: 'basic',
    category: 'foundations',
    textbookDef:
      'WCAG (Web Content Accessibility Guidelines), published by the W3C, is the international standard for accessible web content. Success criteria are grouped under four principles (POUR) and assigned conformance levels A, AA, and AAA; level AA is the common legal and contractual target.',
    eli5: 'POUR is a checklist for a building: can everyone SEE where things are (perceivable), can everyone physically OPEN the doors (operable), are the signs in plain language (understandable), and does it still work whether you arrive by foot, wheelchair, or guide dog (robust)?',
    keyPoints: [
      'Perceivable: information must reach at least one working sense , text alternatives for images, captions for video, sufficient colour contrast, content that survives zoom and reflow.',
      'Operable: every function must work without a mouse , keyboard access to everything, no time bombs (auto-dismissing content), nothing that traps focus, no seizure-inducing flashing.',
      'Understandable: readable language, predictable navigation (things do not move or fire on focus), and forms that identify errors and explain how to fix them.',
      'Robust: markup that assistive technologies can parse reliably , valid, semantic HTML with correct name/role/value on custom widgets.',
      'Levels: A is the bare minimum, AA is the standard target (legal benchmark under the ADA case law, EU accessibility acts, and most procurement contracts), AAA is aspirational per-criterion rather than a site-wide goal.',
      'Accessibility is not only about permanent disability , temporary (broken arm) and situational (bright sunlight, holding a baby, noisy train) impairments mean every user benefits some of the time. This "curb-cut effect" is why captions and keyboard support are mainstream features.'
    ],
    gotcha:
      'Accessibility overlays ("one-line-of-JS makes you compliant" widgets) are a known anti-pattern , they cannot fix missing semantics, frequently break screen readers further, and have not protected companies from lawsuits. If an interviewer asks about them, the expected answer is "fix the markup, don’t mask it".'
  },
  {
    id: 'a11y-accessibility-tree',
    title: 'The Accessibility Tree & how screen readers see your page',
    summary:
      'Browsers build a parallel tree of names, roles, and states from your DOM , assistive tech reads that tree, not your pixels, and semantic HTML is what fills it correctly.',
    difficulty: 'intermediate',
    category: 'foundations',
    prerequisites: ['html-semantic-elements', 'a11y-wcag-pour'],
    textbookDef:
      'The accessibility tree is a browser-generated structure derived from the DOM, exposing each relevant node’s accessible name, role, states, and properties through platform accessibility APIs, which assistive technologies such as screen readers consume.',
    eli5: 'Your page is a stage play. Sighted users watch the actors; a screen-reader user gets a radio commentator. The accessibility tree is the commentator’s script , if the script just says "someone did something" (a div), the commentary is useless no matter how good the play looks.',
    keyPoints: [
      'Each node in the tree carries: a role (what it is , button, heading, list), an accessible name (what to call it , from text content, a label, alt text, or aria-label), a value where relevant, and states (checked, expanded, disabled).',
      'Semantic HTML populates all of it for free: <button>Save</button> yields role button, name "Save", focusability, and Enter/Space activation. A styled <div> yields a nameless, roleless "generic" node , the commentator has nothing to say.',
      'The accessible name has a defined precedence (the "accname" algorithm): roughly aria-labelledby beats aria-label beats native labels/text content beats title. Debugging a wrong announcement is usually debugging this chain.',
      'Screen readers (NVDA and JAWS on Windows, VoiceOver on Apple platforms, TalkBack on Android) do not read top-to-bottom like a tape , users jump by headings, landmarks, links, and form fields, which is why a correct h1→h2→h3 outline and landmark elements are navigation infrastructure, not decoration.',
      'display:none and the hidden attribute remove nodes from the tree; visibility:hidden does too; opacity:0 and clip-path tricks do NOT , the standard "visually-hidden" CSS class keeps text out of sight but in the tree, for screen-reader-only context.',
      'DevTools exposes the real tree: Chrome’s Accessibility panel (and the full-page accessibility tree toggle) shows exactly what a screen reader receives , the fastest way to verify a widget’s name/role/state.'
    ],
    gotcha:
      'aria-hidden="true" removes an element AND its whole subtree from the accessibility tree while leaving it visible and clickable , applying it to something that contains focusable elements creates ghost stops: keyboard users tab into a control that announces as nothing. Never aria-hide anything a user can focus.'
  },
  {
    id: 'a11y-contrast-motion',
    title: 'Colour contrast, colour independence & reduced motion',
    summary:
      'Text needs a 4.5:1 contrast ratio, colour can never be the only signal, and animations must respect prefers-reduced-motion , the three visual-design rules of WCAG.',
    difficulty: 'basic',
    category: 'foundations',
    prerequisites: ['html-prefers-media', 'a11y-wcag-pour'],
    keyPoints: [
      'WCAG AA contrast: 4.5:1 for normal text, 3:1 for large text (18pt/24px, or 14pt/~18.7px bold) and for UI components/graphics like input borders and icons. AAA raises text to 7:1.',
      'The ratio compares relative luminance of foreground and background , DevTools’ colour picker, browser audits, and design tools compute it live; light grey on white (#999 on #fff ≈ 2.8:1) is the classic silent failure.',
      'Colour independence: colour must never be the ONLY carrier of meaning , error states need an icon or message alongside the red border (8% of men have some colour-vision deficiency), chart series need labels or patterns, and links inside prose need underlines, not just a different hue.',
      'prefers-reduced-motion is an OS-level setting users enable for vestibular disorders, migraines, or plain preference , honour it by disabling parallax, large slides, zooms, and auto-playing carousels, keeping only small fades or nothing.',
      'Focus indicators are part of visual accessibility: the focus ring must itself meet 3:1 contrast against its surroundings , a subtle grey glow on white fails users who navigate by keyboard.',
      'Dark mode is not automatically accessible , pure white text on pure black causes halation (glow) for astigmatic users; slightly softened pairs (like this app’s off-white on dark grey) test better.'
    ],
    gotcha:
      'Teams "respect" reduced motion by shortening animations. The setting means the user gets ill from motion , the correct response for large movements is removal, not speed-up. The safest CSS pattern is animations opt-IN: define them inside @media (prefers-reduced-motion: no-preference) so forgetting the query fails safe.',
    codeSnippet: `/* Opt-IN animation: users who need stillness get it by default */
@media (prefers-reduced-motion: no-preference) {
  .card { transition: transform 300ms; }
  .hero { animation: slide-in 600ms ease-out; }
}

/* Or a global kill-switch variant: */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`
  },

  // ─── SEMANTICS ──────────────────────────────────────────────────────────────
  {
    id: 'a11y-aria-in-practice',
    title: 'ARIA in practice: labels, live regions, states',
    summary:
      'Beyond "prefer native elements": the handful of ARIA attributes you actually reach for , naming things, announcing dynamic changes, and exposing widget state.',
    difficulty: 'intermediate',
    category: 'semantics',
    prerequisites: ['html-aria', 'a11y-accessibility-tree'],
    textbookDef:
      'WAI-ARIA (Accessible Rich Internet Applications) is a set of roles, states, and properties that supplement HTML semantics so assistive technologies can understand custom widgets and dynamic content. ARIA changes only what is ANNOUNCED, never how elements behave.',
    eli5: 'ARIA is sticky labels for the radio commentator’s script. You can label a cardboard box "microwave" and the commentator will call it a microwave , but the box still will not heat food. Labels fix descriptions; they never add behaviour.',
    keyPoints: [
      'Naming: aria-label sets an invisible accessible name ("Close" on an × button); aria-labelledby points at existing visible text by id (better , stays in sync with what sighted users read); aria-describedby appends secondary text like hints and error messages after the name is announced.',
      'Live regions announce changes to content the user is NOT focused on: aria-live="polite" waits for a pause (toast notifications, "3 results found"), aria-live="assertive" interrupts (use almost never), and role="status" / role="alert" are shorthands for those two.',
      'Widget states screen readers depend on: aria-expanded (disclosure/accordion/menu open?), aria-current="page" (which nav link is active), aria-selected (tabs, listboxes), aria-checked (custom checkboxes), aria-controls (what this button toggles).',
      'aria-disabled="true" vs the disabled attribute: native disabled also removes the element from tab order; aria-disabled only announces it , useful when you want a disabled control to remain discoverable and explain itself.',
      'The five rules of ARIA compress to: use native HTML first; never change native semantics (no role="button" on an <h2>); every interactive ARIA widget needs keyboard support hand-written; never aria-hide focusable things; interactive elements must have an accessible name.',
      'A live region must exist in the DOM BEFORE the announcement , inserting a node that already contains aria-live text frequently announces nothing. Render the empty container up front, then swap its text.'
    ],
    gotcha:
      'The "first rule of ARIA" has a measurable basis: large-scale WebAIM surveys consistently find pages WITH ARIA have more accessibility errors than pages without , because role="button" on a div silently promises focusability, Enter AND Space handling, and state announcements that the author must then deliver by hand and usually does not. ARIA is a contract, not a fix.',
    codeSnippet: `<!-- Naming: visible text beats invisible labels -->
<h2 id="plans-title">Choose a plan</h2>
<ul aria-labelledby="plans-title">...</ul>

<button aria-label="Close dialog">×</button>

<!-- Hint + error announced after the field's name -->
<input id="pwd" aria-describedby="pwd-hint pwd-error" aria-invalid="true" />
<p id="pwd-hint">At least 12 characters.</p>
<p id="pwd-error" role="alert">Password is too short.</p>

<!-- Live region: container exists first, text swaps in later -->
<div role="status" class="visually-hidden" id="announcer"></div>
<script>announcer.textContent = '3 results found';</script>

<!-- Disclosure state -->
<button aria-expanded="false" aria-controls="menu">Products</button>`
  },
  {
    id: 'a11y-forms',
    title: 'Accessible Forms: labels, errors, and announcements',
    summary:
      'Every input needs a real label, errors must be announced and associated , forms are where accessibility failures cost businesses actual conversions.',
    difficulty: 'basic',
    category: 'semantics',
    prerequisites: ['html-form-basics', 'a11y-aria-in-practice'],
    keyPoints: [
      'Every input gets a programmatically associated <label> (for/id or wrapping) , placeholder text is not a label: it vanishes on typing, usually fails contrast, and is inconsistently announced. Labels also enlarge the click target for free.',
      'Group related controls with <fieldset> + <legend> (radio groups, "Shipping address") , screen readers announce the legend as context for each field inside.',
      'Required and invalid states: use the native required attribute and aria-invalid="true" on failure; connect each error message to its field with aria-describedby so the error is read WITH the field, not discovered elsewhere.',
      'On submit failure, move focus somewhere useful: either to the first invalid field, or to an error summary at the top (role="alert", linking to each field) , silence after pressing Submit is the single most disorienting form experience for screen-reader users.',
      'Use the right input types and autocomplete attributes (email, tel, autocomplete="postal-code") , they drive mobile keyboards, autofill, and password managers, which is accessibility for motor- and memory-impaired users as much as convenience.',
      'Never fire actions on focus or on selection alone (e.g. navigating when a <select> option is highlighted) , keyboard users must be able to browse options without triggering them.'
    ],
    gotcha:
      'Disabling the submit button until the form is valid is a common "helpful" pattern that hurts: disabled buttons are unfocusable, so a screen-reader or keyboard user finds nothing to press and no explanation why. Keep submit enabled, validate on submit, announce the errors, move focus to them.',
    codeSnippet: `<form novalidate>
  <fieldset>
    <legend>Contact details</legend>

    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email"
           required aria-describedby="email-err" aria-invalid="true" />
    <p id="email-err" role="alert">Enter an email address, like name@example.com.</p>
  </fieldset>

  <button>Submit</button>  <!-- stays enabled; errors are announced instead -->
</form>

<script>
  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      form.querySelector('[aria-invalid="true"]')?.focus(); // put the user ON the problem
    }
  });
</script>`
  },
  {
    id: 'a11y-common-failures',
    title: 'The Usual Suspects: div buttons, alt text, heading soup',
    summary: 'A short list of failures that make up the bulk of real-world audit findings , and the one-line fixes for each.',
    difficulty: 'basic',
    category: 'semantics',
    prerequisites: ['html-semantic-elements', 'a11y-accessibility-tree'],
    keyPoints: [
      'The div-button: <div onClick={...}> is invisible to the accessibility tree, unfocusable, and ignores Enter/Space. Fix: <button>. Recreating that with ARIA takes role, tabindex, two key handlers, and a focus style , the native element is one word.',
      'Icon-only buttons with no name: a ✕ or hamburger with no text announces as "button" , add aria-label="Close" (or visually-hidden text). WebAIM’s annual survey of the top million homepages finds empty buttons/links on roughly a quarter of them.',
      'alt text: every <img> needs the attribute , alt="" for decorative images (screen readers skip them) versus a missing attribute (the filename gets read out). Meaningful alt describes function in context ("Company logo, home" not "logo.png"), and text inside images needs the text in the alt.',
      'Heading soup: choosing heading levels for their font size (h4 because it "looked right") wrecks the outline screen-reader users navigate by. One h1 per page, no skipped levels , style with CSS, structure with levels.',
      '"Click here" / "Read more" links: screen-reader users pull up a list of all links out of context , a page of ten "Read more"s is unusable. Make link text name the destination, or extend it with visually-hidden text.',
      'Zoom and target size: blocking pinch-zoom (user-scalable=no) and sub-24px touch targets both fail WCAG , low-vision and motor-impaired users depend on them.'
    ],
    gotcha:
      'These failures share a root cause: they are all invisible in a mouse-based visual check, which is exactly how developers self-review. A 30-second keyboard-only pass (can I reach it? see where I am? activate it?) catches the majority before any tooling runs.'
  },

  // ─── INTERACTION ────────────────────────────────────────────────────────────
  {
    id: 'a11y-keyboard-navigation',
    title: 'Keyboard Navigation: tab order, skip links, key conventions',
    summary: 'Everything a mouse can do, Tab/Enter/Space/arrows must do too , in a sensible order, with visible focus, and without traps.',
    difficulty: 'intermediate',
    category: 'interaction',
    prerequisites: ['html-tabindex', 'a11y-common-failures'],
    textbookDef:
      'WCAG 2.1.1 (Keyboard) requires all functionality to be operable through a keyboard interface; 2.4.3 (Focus Order) requires a focus order that preserves meaning; 2.1.2 (No Keyboard Trap) requires focus to always be able to move away; 2.4.7 requires a visible focus indicator.',
    eli5: 'Keyboard navigation is the building’s corridor system. Tab walks you door to door in corridor order, Enter opens the door in front of you. If a door only opens by waving at a camera (hover/click), corridor users are locked out; if a room has no exit (focus trap), they are stuck in it forever.',
    keyPoints: [
      'Tab moves through interactive elements in DOM order; Shift+Tab goes back; Enter activates links and buttons; Space activates buttons and toggles checkboxes; arrows move WITHIN composite widgets (radio groups, tabs, menus, selects). Matching these conventions is what makes a custom widget feel native.',
      'Focus order = DOM order , if CSS (order, grid placement, absolute positioning) makes the visual order differ from source order, keyboard users experience jumps. Fix the source order, not with tabindex numbers.',
      'tabindex: 0 joins the natural tab order (for legit custom widgets), -1 makes something focusable only programmatically (focus targets like headings or dialogs), and any positive number is an anti-pattern that hijacks page-wide ordering.',
      'A skip link ("Skip to main content") as the first focusable element spares keyboard users tabbing through the entire header on every page , typically visually-hidden until focused, jumping to <main tabindex="-1">.',
      'Never remove focus styles without replacement. :focus-visible is the modern tool: it shows the ring for keyboard focus while staying quiet for mouse clicks , the designer objection ("ugly ring when I click") is solved, so outline: none has no excuse left.',
      'Hover-only affordances (row actions that appear on mouse-over, tooltips) need a focus equivalent , :focus-within on the row, or making the actions always visible.'
    ],
    gotcha:
      'The most common modern keyboard trap is not an old-school plugin , it is a custom modal that Tab happily walks straight out of, into the obscured page behind. The inverse failure also ships constantly: an overlay you cannot Escape from. Both are the focus-management note’s subject, and both are found in ten seconds of keyboard testing.',
    codeSnippet: `<!-- Skip link: first thing in <body> -->
<a class="skip-link" href="#main">Skip to main content</a>
<main id="main" tabindex="-1">...</main>

<style>
  .skip-link { position: absolute; left: -9999px; }
  .skip-link:focus { left: 16px; top: 16px; }  /* appears when focused */

  /* Keyboard gets a ring, mouse clicks stay clean: */
  :focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
</style>`
  },
  {
    id: 'a11y-focus-management',
    title: 'Focus Management: modals, SPAs, and route changes',
    summary:
      'When you open, close, or swap UI, focus must be placed deliberately , the browser only manages it for full page loads, and SPAs took those away.',
    difficulty: 'advanced',
    category: 'interaction',
    prerequisites: ['a11y-keyboard-navigation', 'html-dialog', 'html-inert'],
    eli5: 'Focus is a guided-tour spotlight. On a classic website every new page restarts the tour at the entrance. An SPA rearranges the museum without moving the spotlight , unless YOU walk the visitor to the new exhibit, they are left pointing at a wall that no longer exists.',
    keyPoints: [
      'Modal dialog contract: on open, move focus inside (the dialog or its first control); while open, Tab cycles within it and Escape closes it; page behind is inert; on close, focus RETURNS to the element that opened it. Miss the last step and the user is dumped at the top of the document.',
      'Native <dialog>.showModal() delivers most of this contract free , focus moves in, Escape works, and the rest of the page becomes unreachable (it uses inert semantics under the hood). Hand-rolled overlay divs must reimplement all of it, which is why the element exists.',
      'For non-dialog overlays (drawers, full-screen menus), the inert attribute on the rest of the page is the modern trap: everything outside becomes unfocusable and invisible to assistive tech, no keydown-interception hacks.',
      'SPA route changes: no page load happens, so a screen reader hears nothing and focus stays on a link that may no longer exist. Standard fixes: move focus to the new view’s h1 (tabindex="-1"), and/or announce "Navigated to Settings" via a polite live region. Next.js App Router does route announcements for you; focus placement is still yours.',
      'Deleting the focused element (removing a list item via its own Delete button) throws focus to <body>, silently resetting the user to the top , move focus to a neighbour or the list container before/after removal.',
      'Async content swaps: after "Load more" or a filter change, consider where the keyboard user IS , if the button they pressed disappears, place focus on the first new item.'
    ],
    gotcha:
      'React portals split the two orders that matter: modals render at document.body (DOM order) while appearing "where they were opened" (visual/JSX order). Focus and screen-reader reading order follow the DOM , so without an explicit focus() into the portal on open, Tab lands somewhere unrelated at the end of the document. Portal-based UI ALWAYS needs manual focus management.',
    codeSnippet: `// The modal contract, minimal React version:
function Modal({ onClose, children }) {
  const ref = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    opener.current = document.activeElement;  // remember who opened us
    ref.current.showModal();                  // native focus + Esc + backdrop
    return () => opener.current?.focus();     // give focus BACK on close
  }, []);

  return createPortal(
    <dialog ref={ref} onClose={onClose} aria-labelledby="modal-title">
      {children}
    </dialog>,
    document.body
  );
}`
  },

  // ─── TESTING ────────────────────────────────────────────────────────────────
  {
    id: 'a11y-testing',
    title: 'Testing Accessibility: axe, Lighthouse, and the manual pass',
    summary:
      'Automated scanners catch roughly a third of WCAG issues , the reliable workflow is axe/Lighthouse for the mechanical layer plus a keyboard and screen-reader walkthrough for the rest.',
    difficulty: 'intermediate',
    category: 'testing',
    prerequisites: ['a11y-keyboard-navigation', 'a11y-aria-in-practice'],
    keyPoints: [
      'Automated tools (axe-core , which also powers Lighthouse’s accessibility audit , plus WAVE and eslint-plugin-jsx-a11y at the editor layer) reliably catch: contrast failures, missing alt/labels/names, invalid ARIA, duplicate ids, missing document language. Industry rule of thumb: that is only ~30–40% of real issues.',
      'What no scanner can judge: whether the tab order makes sense, whether alt text is MEANINGFUL, whether focus goes somewhere sane after a modal closes, whether announcements happen on dynamic changes , the interaction layer needs a human.',
      'The manual keyboard pass (minutes, no tooling): Tab through the page , can you reach everything, always see where you are, activate everything with Enter/Space, Escape out of overlays, and never get trapped?',
      'A screen-reader smoke test is less scary than it sounds: VoiceOver ships with macOS (Cmd+F5), NVDA is free on Windows, TalkBack on Android. Navigate by headings and form fields , gibberish announcements surface immediately.',
      'Automate the mechanical layer in CI so it never regresses: jest-axe or vitest-axe for component tests, @axe-core/playwright for end-to-end pages , failing the build on new violations is cheap and uncontroversial.',
      'Prioritise by user impact when triaging findings: broken keyboard access to a checkout beats a contrast issue in the footer , severity, not count, is the metric that matters.'
    ],
    gotcha:
      'A Lighthouse accessibility score of 100 is routinely presented as "fully accessible" , it only means the automatable subset passed. A page whose entire checkout is mouse-only can score 100. Treat the score as a floor and a regression alarm, never as sign-off.',
    codeSnippet: `// Component-level, in CI (jest-axe / vitest-axe):
import { axe } from 'jest-axe';
const { container } = render(<SignupForm />);
expect(await axe(container)).toHaveNoViolations();

// Page-level, end to end (@axe-core/playwright):
import AxeBuilder from '@axe-core/playwright';
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .analyze();
expect(results.violations).toEqual([]);

// The part no tool does: Tab, Shift+Tab, Enter, Space, Escape. By hand.`
  }
];
