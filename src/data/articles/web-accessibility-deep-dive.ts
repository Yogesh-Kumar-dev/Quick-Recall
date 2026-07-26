import type { Article } from '@/types/content';

export const webAccessibilityDeepDiveArticle: Article = {
  id: 'web-accessibility-deep-dive',
  slug: 'web-accessibility-deep-dive',
  title: 'Web Accessibility Deep Dive',
  summary:
    'A from-first-principles walkthrough of why accessibility matters, how screen readers actually work, semantic HTML as the foundation, ARIA as a careful patch, keyboard navigation, focus management, color contrast, and how WCAG conformance levels are structured.',
  topics: ['Accessibility', 'HTML', 'UX'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: "Start with a thought experiment. Unplug your mouse right now and try to use your favorite website with only the Tab key, Shift+Tab, Enter, and Escape. For a lot of sites, you'll get stuck almost immediately: a menu that only opens on hover, a modal you can open but never close, a focus outline that's been styled away so you can't even tell where you are on the page. Now imagine doing that same exercise but also with your monitor turned off, listening only to a piece of software reading the page aloud to you, one element at a time. That second scenario is the daily reality for people who use screen readers, and it's the lens this entire article is written through: not \"add some ARIA attributes to pass an audit,\" but \"can a real person, navigating this page in a way you didn't design for, actually use it.\""
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'What is a screen reader, concretely?',
      text: "A screen reader (VoiceOver on Mac/iOS, NVDA and JAWS on Windows, TalkBack on Android) is software that converts what's on screen into synthesized speech or braille output. It doesn't \"see\" your page visually the way you do. It reads the underlying HTML structure: the tag names, the text content, the ARIA attributes, the order elements appear in the DOM. A screen reader user navigates by jumping between headings, links, form fields, and landmarks, often skipping around rather than reading top to bottom, similar to how a sighted user visually scans a page rather than reading every word. If your HTML structure doesn't accurately describe what's on the page, the screen reader has nothing accurate to read, no matter how good the page looks visually."
    },
    {
      type: 'paragraph',
      text: 'Accessibility (often abbreviated a11y, because there are 11 letters between the "a" and the "y" in "accessibility") is the practice of making sure your interface works for people who don\'t interact with it the way you probably do when you\'re building it. That includes people who are blind or low-vision and use a screen reader or screen magnification, people with motor impairments who can\'t use a mouse and rely on a keyboard or a switch device, people who are deaf or hard of hearing and need captions, people with cognitive or learning disabilities who benefit from clear structure and forgiving interactions, and even temporarily-impaired situations everyone hits, like a broken arm, bright sunlight washing out low-contrast text, or a toddler currently occupying your mouse hand.'
    },

    { type: 'heading', id: 'semantic-first', level: 2, text: 'Rule one: use the HTML element that already does the job' },
    {
      type: 'paragraph',
      text: 'Here is the single most important idea in this entire article, and it\'s worth understanding deeply rather than just memorizing: HTML elements are not just visual containers, they carry built-in meaning and behavior that browsers and assistive technology already understand. A <button> element is, for free, keyboard-focusable (it\'s in the natural Tab order), keyboard-operable (pressing Enter or Space activates it), and announced by every screen reader as "button" along with its accessible name. You get all of that by typing five characters: <button>.'
    },
    {
      type: 'paragraph',
      text: 'Compare that to building the same thing out of a <div>:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// The "I'll just style a div to look like a button" trap.
// Looks identical visually. Functionally, it's broken for anyone not using a mouse:
// - Not in the Tab order (no tabIndex)
// - Enter/Space do nothing (no keyboard handler)
// - A screen reader announces it as nothing in particular, maybe just its text
function FakeButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }): JSX.Element {
  return <div className="button-looking-thing" onClick={onClick}>{children}</div>;
}

// To make the div behave like a real button, you now have to manually reinvent
// everything <button> already gave you for free:
function PatchedFakeButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }): JSX.Element {
  return (
    <div
      className="button-looking-thing"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}

// Or, just use the element built for exactly this:
function RealButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }): JSX.Element {
  return <button onClick={onClick}>{children}</button>;
}`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'This is literally called the "First Rule of ARIA"',
      text: "The official ARIA authoring guidance states it almost exactly this way: if a native HTML element or attribute already has the semantics and behavior you need, use it, rather than repurposing an element and adding ARIA to bolt the behavior back on. ARIA can describe a role, but it can't grant real keyboard behavior on its own, you still have to wire that up by hand, and it's very easy to forget one piece (often Space, or Escape, or correctly restoring focus) and ship something that looks right but silently fails for keyboard and screen reader users."
    },
    {
      type: 'paragraph',
      text: "This same principle extends across your whole page structure, not just buttons. Semantic landmark elements, like <nav>, <main>, <header>, <footer>, and <aside>, mark out the major regions of a page. A screen reader user can pull up a landmarks list and jump straight to <main> to skip your entire navigation menu, the same way a sighted user's eye just skips past a familiar header without consciously reading it. If your whole page is <div><div><div> soup with no landmarks, that shortcut doesn't exist, and the screen reader user is forced to tab or arrow through every single link in your header, every time, on every page, just to reach the actual content."
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Heading levels (<h1> through <h6>) form a navigable document outline, not just "big text." A screen reader user can pull up a list of all headings on the page and jump directly to the section they want, the same way you might glance at a table of contents. Skipping a level (an <h1> followed directly by an <h4>, chosen because it happened to look the right size) breaks that outline even though it looks completely fine visually, because the jump from "1" to "4" implies missing sections that don\'t exist.',
        'Form labels, either <label for="email-input">Email</label> or a <label> wrapping the input directly, are what make a screen reader announce "Email, edit text" when the field receives focus, instead of just "edit text" with no indication of what to type. A placeholder attribute is not a substitute for a label: placeholders disappear the moment the user starts typing, are frequently skipped by screen readers depending on browser/AT combination, and have famously poor color contrast by default.',
        "Lists (<ul>/<ol>/<li>) announce themselves with a count (\"list, 5 items\") so a screen reader user knows how much content they're about to move through, and can skip past it entirely if it's not what they're looking for. A visually-identical stack of <div>s gives none of that.",
        'Tables built with real <table>/<th>/<td> (not styled <div> grids) let a screen reader announce column and row headers as you move through cells, so "42" reads as "Revenue, Q3: 42" instead of just "42" with no context.'
      ]
    },

    { type: 'heading', id: 'aria', level: 2, text: 'ARIA: a patch for the gaps HTML genuinely has' },
    {
      type: 'paragraph',
      text: "ARIA (Accessible Rich Internet Applications) is a set of HTML attributes that describe extra semantics to assistive technology. It exists because some UI patterns simply have no native HTML element: a tabbed interface, an autocomplete combobox, a custom-styled dropdown menu, a toast notification, a live-updating status region. For those, ARIA is exactly the right tool. ARIA attributes fall into three categories, and it's worth being precise about the difference:"
    },
    {
      type: 'table',
      columns: ['Category', 'What it describes', 'Examples'],
      rows: [
        ['Roles', 'WHAT an element fundamentally is', 'role="dialog", role="tablist", role="alert"'],
        ['Properties', 'A characteristic that stays constant', 'aria-required="true", aria-label="Close menu"'],
        ['States', "A characteristic that changes over the element's lifetime", 'aria-expanded, aria-selected, aria-checked, aria-hidden']
      ]
    },
    {
      type: 'paragraph',
      text: "A concrete example: a dropdown menu built from a <button> and a <ul>, since there's no single native HTML element that IS a dropdown menu. Notice this still starts from a real <button>, per the rule above, and layers ARIA on top only for the parts HTML genuinely can't express (the relationship between the button and the menu it controls, and whether the menu is currently open)."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function DropdownMenu({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }): JSX.Element {
  return (
    <>
      <button aria-expanded={isOpen} aria-controls="menu-list" onClick={toggle}>
        Options
      </button>
      <ul id="menu-list" role="menu" hidden={!isOpen}>
        <li role="menuitem">Edit</li>
        <li role="menuitem">Duplicate</li>
        <li role="menuitem">Delete</li>
      </ul>
    </>
  );
}`
    },
    {
      type: 'paragraph',
      text: 'aria-expanded tells assistive tech whether the menu this button controls is currently open or closed, something a plain <button> has no way to convey on its own. aria-controls points at the id of the element being controlled, so the relationship between button and menu is explicit rather than merely visual/positional. These are exactly the kind of gap ARIA is meant to fill: relationships and states that HTML has no built-in vocabulary for.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Bad ARIA is worse than no ARIA at all',
      text: 'This is counterintuitive the first time you hear it, but it\'s true: incorrect ARIA actively lies to assistive technology, while no ARIA at all just falls back to plain, if unstyled, HTML behavior. A stale aria-expanded="false" left on a menu button after the menu has actually been opened tells a screen reader user the menu is closed when it isn\'t. role="button" slapped onto an element with no matching keyboard handling announces something as clickable that a keyboard user genuinely cannot click. aria-hidden="true" placed on a container that still has focusable children inside it (a common bug: hiding a closed modal\'s wrapper div without also removing its buttons from the tab order) creates a contradiction where the screen reader is told "this doesn\'t exist" while a sighted keyboard user can still Tab directly into it, landing on a control that\'s invisible and unannounced at the same time. In each case, the confident-sounding wrong answer is more damaging than an honest "I don\'t know what this is."'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'aria-label overrides an element\'s accessible name entirely with the string you give it, useful for icon-only buttons: <button aria-label="Close"><XIcon /></button> announces "Close, button" even though there\'s no visible text.',
        "aria-labelledby points at the id of another element on the page whose text content should be used as this element's accessible name, useful when a visible heading already provides the label and you don't want to duplicate the text.",
        'aria-describedby points at an id whose text is read as additional description after the name/role, commonly used to associate a form field with its error message or hint text.',
        'aria-live="polite" (or "assertive") marks a region as one a screen reader should announce automatically when its content changes, essential for things like toast notifications or a "3 results found" message that appears without a page navigation, since a screen reader has no other way to know that region just changed.'
      ]
    },

    { type: 'heading', id: 'keyboard-focus', level: 2, text: 'Keyboard navigation and focus management' },
    {
      type: 'paragraph',
      text: 'A large number of people never use a mouse or trackpad at all: users with motor impairments who navigate entirely via keyboard or a switch device, power users who simply prefer it, and every screen reader user, since screen readers are fundamentally keyboard-driven tools. "Works with a keyboard" is not a nice-to-have accessibility extra, it\'s closer to a baseline requirement that a large set of other accessibility features depend on.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Every interactive element (links, buttons, form fields, custom widgets) must be reachable by pressing Tab, and operable once focused: Enter or Space to activate a button, arrow keys to move within a composite widget like a tab list or menu, and Escape to dismiss a transient UI like a modal or a popover.',
        'Tab order should follow a logical, predictable sequence, which in practice usually means: follow the DOM order, and match that DOM order to the visual reading order. Reordering focus purely with CSS (moving something visually without moving it in the DOM) creates a mismatch where Tab jumps around the screen in a way no one can predict.',
        'Avoid positive tabIndex values (tabIndex={1}, tabIndex={2}, etc). They force an explicit, hand-maintained order that overrides natural DOM order and is extremely easy to get out of sync as the page evolves. tabIndex={0} (adds a naturally-ordered element to the tab sequence) and tabIndex={-1} (removes an element from the Tab sequence but allows it to still receive focus programmatically, useful for focus management, covered next) are the two values you actually want.'
      ]
    },
    {
      type: 'paragraph',
      text: 'Focus management is the practice of deliberately moving keyboard focus in response to something happening in the UI, rather than leaving it stranded. The canonical example is a modal dialog:'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'On open, move focus INTO the modal',
          text: "When a modal opens, focus should move to the first focusable element inside it (often a heading or the first input), not stay wherever it was on the page behind it. If focus stays behind the modal, a keyboard or screen reader user has no idea a modal even opened, they'll just keep tabbing through a page they can no longer see, confused about elements that seem to do nothing."
        },
        {
          title: 'While open, trap focus inside it',
          text: "Tab and Shift+Tab should cycle only through elements inside the modal, wrapping from the last focusable element back to the first (and vice versa for Shift+Tab), rather than escaping out to the page behind the modal. Without a focus trap, a sighted mouse user sees the modal as the only thing on screen, but a keyboard user can silently tab into buttons and links hidden behind the modal's visual overlay, interacting with a page they can't see."
        },
        {
          title: 'On close, return focus to where it came from',
          text: "When the modal closes, focus should return to the element that opened it (usually the button that triggered the modal), not reset to the top of the page or disappear entirely. This preserves the user's place in the page, exactly like a sighted user's eye naturally returns to roughly where it was before the modal appeared."
        }
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Never remove the focus outline without replacing it',
      text: "outline: none (or outline: 0) on :focus, often added purely because a designer didn't like the default blue ring, removes the ONLY way a keyboard user can visually tell which element currently has focus on the page. If you don't like the default outline's look, replace it with your own visible focus style (a custom outline, a box-shadow, a border color change), never just delete it. A reasonable middle ground many sites use is :focus-visible, which shows a focus ring for keyboard navigation but suppresses it for mouse clicks, satisfying both the visual-design preference and the accessibility requirement."
    },

    { type: 'heading', id: 'color-contrast', level: 2, text: 'Color contrast and not relying on color alone' },
    {
      type: 'paragraph',
      text: 'Text needs to be readable against its background for anyone with low vision, color blindness, or just a phone screen in bright sunlight. Contrast is measured as a ratio between the lightest and darkest of the two colors involved, from 1:1 (identical, invisible) up to 21:1 (pure black on pure white, maximum possible contrast). WCAG sets minimum ratios depending on text size and conformance level, covered in the table further down, but the practical default most teams target is 4.5:1 for normal text and 3:1 for large text (roughly 18pt+, or 14pt+ bold).'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Don\'t use color as the ONLY way to convey information. A form field outlined in red to indicate an error is invisible information to a colorblind user (red/green colorblindness affects a meaningful percentage of men in particular) and to anyone using a grayscale or high-contrast display mode. Pair color with a second signal: an icon, an underline, explicit error text ("Email is required"), not just a color change.',
        'Links inside body text that are distinguished from surrounding text ONLY by color (no underline, no weight change) fail this same principle for the same reason, and are also just genuinely harder for everyone to visually locate.',
        "Browser and OS-level tools (macOS's built-in contrast checker in Accessibility Inspector, or online tools like WebAIM's Contrast Checker) let you punch in a foreground/background hex pair and get the exact ratio plus a pass/fail against WCAG AA and AAA, worth checking during design review rather than after the fact."
      ]
    },

    { type: 'heading', id: 'wcag', level: 2, text: 'WCAG: how "accessible" is actually measured' },
    {
      type: 'paragraph',
      text: 'WCAG (Web Content Accessibility Guidelines) is the standard maintained by the W3C that defines what "accessible" concretely means, organized as individual, testable success criteria (things like "1.1.1 Non-text Content" for alt text, or "2.4.7 Focus Visible" for the outline rule above). Each success criterion is assigned one of three conformance levels, and a page or site is said to conform at a given level only if it meets every criterion at that level AND every criterion at the levels below it.'
    },
    {
      type: 'table',
      columns: ['Level', 'What it represents', 'Example criteria', 'Who typically targets it'],
      rows: [
        [
          'A',
          'The absolute minimum, without which some users are completely blocked',
          'Images have alt text at all; keyboard access exists for all functionality',
          'Rarely a real target on its own, more of a floor'
        ],
        [
          'AA',
          'The practical, broadly-required standard',
          '4.5:1 text contrast; text resizable to 200% without loss of content/function; visible focus indicator',
          'Most companies, and most legal/regulatory requirements (ADA, EN 301 549, etc.) reference this level'
        ],
        [
          'AAA',
          'The strictest level, often genuinely impractical to hit across an entire site',
          '7:1 text contrast; sign language interpretation for all prerecorded audio',
          'Rarely site-wide, sometimes targeted for specific critical components or content'
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: "Why AAA usually isn't the goal for a whole site",
      text: 'Some AAA criteria are in genuine tension with normal design decisions. 7:1 contrast, for instance, rules out a lot of otherwise-reasonable brand color choices at normal text sizes. The official WCAG guidance itself does not recommend AAA as a general policy for entire sites, precisely because it can be infeasible for some content types. AA is the level almost every accessibility statement, legal requirement, and audit tool is actually checking against.'
    },

    { type: 'heading', id: 'testing', level: 2, text: 'How to actually test for accessibility' },
    {
      type: 'paragraph',
      text: 'Automated tools catch a meaningful chunk of issues cheaply (missing alt text, insufficient contrast, missing form labels, invalid ARIA), but they structurally cannot catch everything, because a lot of accessibility is about whether an experience actually makes sense, which requires a human (or at least a human-like) judgment call. A checklist worth running through, roughly in order of effort:'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Run an automated scanner first',
          text: "Tools like axe DevTools (browser extension), Lighthouse's Accessibility audit (built into Chrome DevTools), or eslint-plugin-jsx-a11y (catches issues at write-time, before the code even runs) catch the mechanical, unambiguous violations quickly: missing alt attributes, form inputs without labels, insufficient color contrast, invalid or conflicting ARIA. Treat this as a fast first pass, not the whole test."
        },
        {
          title: 'Unplug the mouse',
          text: 'Navigate the actual page using only Tab, Shift+Tab, Enter, Space, arrow keys, and Escape. Can you reach every interactive element? Can you tell, visually, which element currently has focus at all times? Does every modal, dropdown, and popover open and close cleanly, with focus landing somewhere sensible each time? This single exercise catches a surprisingly large fraction of real bugs, and it costs nothing but a few minutes.'
        },
        {
          title: 'Turn on a real screen reader',
          text: 'VoiceOver ships free on every Mac and iPhone (Cmd+F5 to toggle on macOS) and NVDA is free on Windows. Navigate your page by headings, then by landmarks, then by form fields, using the screen reader\'s own navigation shortcuts rather than just tabbing linearly. Does what you hear make sense out of visual context? Are buttons announced as buttons? Does an image convey its meaning through alt text, or announce as just "image" with nothing useful?'
        },
        {
          title: 'Check contrast and zoom',
          text: 'Run key text/background color pairs through a contrast checker against the 4.5:1 (normal text) / 3:1 (large text) AA thresholds. Separately, zoom the browser to 200% and confirm content reflows sensibly rather than clipping, overlapping, or requiring horizontal scrolling to read a sentence.'
        },
        {
          title: 'Involve an actual assistive-tech user if you can',
          text: "Every technique above is still, ultimately, a sighted developer simulating someone else's experience. Nothing replaces watching (or getting feedback from) someone who uses a screen reader, switch device, or keyboard-only navigation as their normal way of using the web, if that's genuinely available to you. Real usage surfaces friction that no checklist anticipates."
        }
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The fastest single accessibility win you can make today',
      text: 'If you only fix one thing on an existing page, check that every non-decorative <img> has a meaningful alt attribute, every form <input> has an associated <label>, and every interactive element is reachable and operable by keyboard alone. Those three checks alone eliminate a disproportionate share of the most severe, most completely-blocking accessibility bugs, and none of them require redesigning anything.'
    }
  ]
};
