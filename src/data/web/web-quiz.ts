import type { QuizQuestion } from '@/types/content';

// ─── Web Platform quiz — multiple choice (security + auth + accessibility + performance) ──

export const webQuiz: QuizQuestion[] = [
  // ── Security ──
  {
    id: 'web-q-sop',
    question: 'What does the Same-Origin Policy (SOP) restrict?',
    options: [
      'Which domains can be typed into the address bar',
      'Scripts from one origin reading responses or data belonging to another origin',
      'How many tabs a browser can open',
      'The maximum size of a downloaded file'
    ],
    correctIndex: 1,
    explanation: 'SOP is the browser\'s foundational security boundary — CORS exists specifically to relax it in controlled ways.',
    category: 'Security'
  },
  {
    id: 'web-q-cors',
    question: 'What does a CORS preflight (OPTIONS) request check?',
    options: [
      'Whether the server is online',
      'Whether the server explicitly allows the actual cross-origin request (method, headers, origin) before it is sent',
      'The DNS record for the target domain',
      'Whether the client has a valid SSL certificate'
    ],
    correctIndex: 1,
    explanation: 'Preflight only fires for "non-simple" requests — e.g. custom headers, or methods other than GET/POST with simple content types.',
    category: 'Security'
  },
  {
    id: 'web-q-xss',
    question: 'What is Cross-Site Scripting (XSS)?',
    options: [
      'Tricking a user into submitting a request they didn\'t intend to',
      'Injecting malicious script into a page that then executes in another user\'s browser session',
      'Overwhelming a server with traffic',
      'Intercepting network traffic between client and server'
    ],
    correctIndex: 1,
    explanation: 'The core defense is escaping/sanitizing any user-controlled content before rendering it as HTML.',
    category: 'Security'
  },
  {
    id: 'web-q-csrf',
    question: 'What is Cross-Site Request Forgery (CSRF)?',
    options: [
      'Stealing a user\'s password via a fake login page',
      'Tricking a logged-in user\'s browser into submitting an unwanted authenticated request to another site',
      'Injecting a script that steals cookies',
      'Flooding a server with fake requests'
    ],
    correctIndex: 1,
    explanation: 'It exploits the browser automatically attaching cookies to requests — CSRF tokens and SameSite cookies are the standard defenses.',
    category: 'Security'
  },
  {
    id: 'web-q-clickjacking',
    question: 'What is clickjacking, and how does `frame-ancestors` help defend against it?',
    options: [
      'A bot repeatedly clicking ads; frame-ancestors blocks ad networks',
      'Tricking a user into clicking something different from what they perceive, often via an invisible iframe; frame-ancestors restricts who can embed your page in an iframe',
      'A form of SQL injection; frame-ancestors sanitizes SQL',
      'A DNS spoofing attack; frame-ancestors validates DNS records'
    ],
    correctIndex: 1,
    explanation: 'A CSP `frame-ancestors` directive (or the older X-Frame-Options header) prevents your page from being embedded in a malicious wrapper page.',
    category: 'Security'
  },
  {
    id: 'web-q-csp',
    question: 'What does a Content Security Policy (CSP) do?',
    options: [
      'Encrypts all traffic to the site automatically',
      'Restricts which sources scripts/styles/images/etc. can be loaded from, mitigating XSS impact even if injection occurs',
      'Blocks all cookies from being set',
      'Compresses page assets for faster loading'
    ],
    correctIndex: 1,
    explanation: 'Even if an attacker manages to inject a `<script>` tag, a strict CSP can prevent it from executing or exfiltrating data.',
    category: 'Security'
  },
  {
    id: 'web-q-sql-injection-defense',
    question: 'What is the standard defense against SQL injection?',
    options: [
      'Blocklisting the word "SELECT" in user input',
      'Using parameterized queries / prepared statements so user input is always treated as data, never as executable SQL',
      'Storing all data as JSON instead of SQL tables',
      'Rate-limiting the database connection'
    ],
    correctIndex: 1,
    explanation: 'Concatenating raw user input into a SQL string is the root cause — parameterization removes that entire class of bug.',
    category: 'Security'
  },
  // ── Auth ──
  {
    id: 'web-q-httponly-cookie',
    question: 'What does the `HttpOnly` flag on a cookie do?',
    options: [
      'Forces the cookie to only be sent over HTTPS',
      'Makes the cookie invisible to JavaScript (document.cookie can\'t read it), blocking XSS-based theft',
      'Restricts the cookie to a single page',
      'Encrypts the cookie value automatically'
    ],
    correctIndex: 1,
    explanation: 'This is why HttpOnly is recommended for session/auth tokens — even a successful XSS injection can\'t read the cookie directly.',
    category: 'Auth'
  },
  {
    id: 'web-q-samesite-cookie',
    question: 'What does the `SameSite=Strict` cookie attribute primarily protect against?',
    options: ['XSS', 'CSRF — the cookie is withheld on cross-site requests', 'SQL injection', 'DNS spoofing'],
    correctIndex: 1,
    explanation: 'SameSite restricts when a cookie is sent based on whether the request originated from the same site, directly undercutting CSRF.',
    category: 'Auth'
  },
  {
    id: 'web-q-jwt-storage',
    question: 'What is the main security trade-off between storing a JWT in localStorage vs. an HttpOnly cookie?',
    options: [
      'They are equally safe from all attack vectors',
      'localStorage is readable by JavaScript (vulnerable to XSS theft) but immune to CSRF; an HttpOnly cookie is hidden from JS (safer from XSS) but needs CSRF protection since it\'s sent automatically',
      'localStorage tokens expire automatically; cookies never expire',
      'HttpOnly cookies cannot be used for authentication at all'
    ],
    correctIndex: 1,
    explanation: 'Neither option is a free lunch — it\'s a trade-off between XSS exposure and CSRF exposure, addressed differently in each case.',
    category: 'Auth'
  },
  {
    id: 'web-q-access-vs-refresh-token',
    question: 'What is the typical relationship between an access token and a refresh token?',
    options: [
      'They are the same token used interchangeably',
      'The access token is short-lived and used for API calls; the refresh token is longer-lived and used to obtain new access tokens without re-login',
      'The refresh token is sent with every API request instead of the access token',
      'Access tokens never expire; refresh tokens expire immediately'
    ],
    correctIndex: 1,
    explanation: 'This limits the damage window if an access token leaks, while avoiding constant re-authentication.',
    category: 'Auth'
  },
  {
    id: 'web-q-password-hashing',
    question: 'Why is "encryption" the wrong word for how passwords should be stored?',
    options: [
      'Encryption is too slow for login systems',
      'Encryption is reversible with a key; passwords should be hashed (with salt) — a one-way operation the server cannot reverse',
      'Encryption is only for network traffic, not stored data',
      'There is no meaningful difference between the two terms'
    ],
    correctIndex: 1,
    explanation: 'If a password store used encryption, a leaked key would expose every password — hashing (e.g. bcrypt/argon2) has no such key to steal.',
    category: 'Auth'
  },
  {
    id: 'web-q-oauth-flow',
    question: 'In OAuth 2.0\'s Authorization Code flow, what does the client exchange for an access token?',
    options: [
      'The user\'s raw password',
      'A short-lived authorization code, received via redirect after the user approves access',
      'The client\'s database credentials',
      'A CAPTCHA response'
    ],
    correctIndex: 1,
    explanation: 'This code-for-token exchange happens server-to-server, keeping the actual access token off the user\'s browser history/redirect URL.',
    category: 'Auth'
  },
  {
    id: 'web-q-pkce',
    question: 'What problem does PKCE (Proof Key for Code Exchange) solve in OAuth?',
    options: [
      'It speeds up the token exchange request',
      'It secures the Authorization Code flow for clients that can\'t safely keep a secret (SPAs, mobile apps), preventing code interception attacks',
      'It replaces passwords with biometrics',
      'It is required only for server-to-server API calls'
    ],
    correctIndex: 1,
    explanation: 'PKCE adds a dynamically generated secret verified at token exchange time, so an intercepted authorization code alone isn\'t enough.',
    category: 'Auth'
  },
  // ── Accessibility ──
  {
    id: 'web-q-pour-principles',
    question: 'What do the POUR principles (WCAG) stand for?',
    options: [
      'Portable, Optimized, Usable, Responsive',
      'Perceivable, Operable, Understandable, Robust',
      'Public, Open, Universal, Reliable',
      'Predictable, Organized, Uniform, Readable'
    ],
    correctIndex: 1,
    explanation: 'These four principles are the top-level organizing structure of the Web Content Accessibility Guidelines.',
    category: 'Accessibility'
  },
  {
    id: 'web-q-aria-first-rule',
    question: 'What is the "first rule of ARIA"?',
    options: [
      'Add ARIA attributes to every element to be safe',
      'Don\'t use ARIA if a native HTML element already provides the needed semantics/behavior',
      'ARIA should only be used on form elements',
      'ARIA roles must always include a tabindex'
    ],
    correctIndex: 1,
    explanation: 'A real `<button>` gets keyboard support and semantics for free — `role="button"` on a div requires you to reimplement all of that manually.',
    category: 'Accessibility'
  },
  {
    id: 'web-q-code-focus-trap',
    question: 'Why does a modal dialog typically need to "trap" keyboard focus?',
    options: [
      'To prevent the user from ever closing it',
      'So Tab/Shift+Tab cycles only within the modal, preventing sighted keyboard and screen-reader users from tabbing into hidden background content',
      'It is purely a visual/CSS concern with no accessibility purpose',
      'To disable all keyboard shortcuts on the page'
    ],
    correctIndex: 1,
    explanation: 'The native `<dialog>` element\'s `showModal()` handles this automatically, including making the rest of the page inert.',
    category: 'Accessibility'
  },
  {
    id: 'web-q-color-contrast',
    question: 'Why does WCAG require a minimum color contrast ratio between text and its background?',
    options: [
      'To make websites look more consistent visually',
      'So text remains readable for users with low vision or color vision deficiencies',
      'It is purely a branding recommendation, not an accessibility one',
      'It only matters for print stylesheets'
    ],
    correctIndex: 1,
    explanation: 'Relying on color alone (without sufficient contrast or a secondary indicator) is a common, easily fixed accessibility failure.',
    category: 'Accessibility'
  },
  {
    id: 'web-q-live-region',
    question: 'What does an ARIA live region (e.g. `aria-live="polite"`) do?',
    options: [
      'Makes an element auto-refresh its content every second',
      'Announces dynamic content changes to screen reader users without requiring focus to move there',
      'Prevents the element from being focused at all',
      'Marks the element as decorative and hidden from assistive tech'
    ],
    correctIndex: 1,
    explanation: 'This is essential for things like async form-validation errors or toast notifications that appear without a page reload.',
    category: 'Accessibility'
  },
  {
    id: 'web-q-skip-link',
    question: 'What is the purpose of a "skip to main content" link?',
    options: [
      'It is a decorative element with no functional purpose',
      'It lets keyboard users bypass repeated navigation and jump straight to the main content, avoiding tabbing through the whole header every page',
      'It automatically scrolls the page for mouse users',
      'It is required only for print stylesheets'
    ],
    correctIndex: 1,
    explanation: 'Without it, a keyboard-only user has to tab through every nav link on every single page before reaching the content.',
    category: 'Accessibility'
  },
  // ── Performance ──
  {
    id: 'web-q-core-web-vitals',
    question: 'Which three metrics make up Google\'s Core Web Vitals?',
    options: ['TTFB, FCP, TBT', 'LCP, INP, CLS', 'DNS, TCP, TLS', 'HTML, CSS, JS'],
    correctIndex: 1,
    explanation: 'Largest Contentful Paint (loading), Interaction to Next Paint (responsiveness), Cumulative Layout Shift (visual stability).',
    category: 'Performance'
  },
  {
    id: 'web-q-lcp',
    question: 'What does Largest Contentful Paint (LCP) measure?',
    options: [
      'The time until the very first pixel renders',
      'The render time of the largest visible content element (image or text block) in the viewport',
      'The total number of DOM nodes on the page',
      'How long JavaScript takes to become interactive'
    ],
    correctIndex: 1,
    explanation: 'LCP is a proxy for "when did the main content the user came for actually become visible."',
    category: 'Performance'
  },
  {
    id: 'web-q-cls',
    question: 'What causes a high Cumulative Layout Shift (CLS) score?',
    options: [
      'Slow server response times',
      'Visible elements unexpectedly shifting position, often from images/ads/fonts loading without reserved space',
      'Too many HTTP requests',
      'Using CSS Grid instead of Flexbox'
    ],
    correctIndex: 1,
    explanation: 'Reserving space up front — via width/height attributes or aspect-ratio — is the standard fix.',
    category: 'Performance'
  },
  {
    id: 'web-q-lab-vs-field-data',
    question: 'What is the difference between "lab" and "field" performance data?',
    options: [
      'They always report identical numbers',
      'Lab data (e.g. Lighthouse) is measured in a controlled, simulated environment; field data (e.g. CrUX) is measured from real users\' actual devices/networks',
      'Field data can only be collected manually',
      'Lab data is more accurate for every use case'
    ],
    correctIndex: 1,
    explanation: 'Lab data is great for debugging in a consistent environment; field data reflects what real users actually experience.',
    category: 'Performance'
  },
  {
    id: 'web-q-code-splitting',
    question: 'What problem does code splitting solve?',
    options: [
      'It removes the need for a bundler entirely',
      'It ships only the JavaScript a given route/feature needs, instead of one giant bundle for the whole app upfront',
      'It automatically fixes memory leaks',
      'It converts JavaScript into WebAssembly'
    ],
    correctIndex: 1,
    explanation: 'Combined with lazy loading, this keeps the initial bundle small so the app becomes interactive faster.',
    category: 'Performance'
  },
  {
    id: 'web-q-resource-hints',
    question: 'What is the difference between `preload` and `prefetch` resource hints?',
    options: [
      'They are identical, just different spellings',
      'preload fetches a resource needed for THIS page, with high priority; prefetch fetches, at low priority, something likely needed on the NEXT navigation',
      'prefetch only works for images; preload only works for scripts',
      'preload is deprecated in favor of prefetch'
    ],
    correctIndex: 1,
    explanation: 'Misusing preload for something not actually needed immediately can waste bandwidth and even hurt LCP by competing for priority.',
    category: 'Performance'
  }
];
