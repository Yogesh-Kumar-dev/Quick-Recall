import type { Note } from '@/types/content';

// ─── Web Testing — browser-surface concerns not already owned by another page in
// this app: dynamic content, sessions/caching, forms, and search-engine-facing
// behavior. Cross-browser, accessibility, performance, and security testing already
// have dedicated coverage elsewhere and are linked via prerequisites, not repeated. ─

export const webTestingNotes: Note[] = [
  {
    id: 'web-test-ajax-dynamic-content',
    title: 'Testing AJAX & Dynamically-Loaded Content',
    summary:
      "Content that appears after an async request finished needs assertions that WAIT for it, not check immediately — the same principle RTL's findBy and Playwright's auto-waiting encode, applied at the manual/exploratory testing level too.",
    difficulty: 'basic',
    category: 'dynamic & spa testing',
    prerequisites: ['test-fund-unit-integration-e2e'],
    keyPoints: [
      "A manual or automated check that runs the instant an action fires (before the async request resolves) will see stale or missing content — this is the same class of bug `getBy` vs `findBy` and Playwright's auto-waiting were built to prevent.",
      'Loading states deserve explicit test coverage of their own: does a spinner/skeleton appear immediately, does it correctly disappear once data arrives, and does a slow or failed request leave the UI in a sensible (not permanently loading, not silently blank) state.',
      'Partial-failure scenarios — a page with several independent AJAX-loaded sections where ONE fails — should be tested explicitly: does the failure of one section break the whole page, or degrade gracefully while the rest still works.',
      "Network-throttling tools (browser dev tools, or MSW's `delay()` at the automated-test level) make these timing-dependent scenarios reproducible on demand instead of only occurring by chance on a slow connection."
    ]
  },
  {
    id: 'web-test-spa-vs-traditional',
    title: 'SPA Testing vs Traditional Multi-Page Site Testing',
    summary:
      "A single-page app never does a full page reload after the initial load — testing shifts from 'did the URL load the right server-rendered page' to 'did client-side routing and state update correctly without one.'",
    difficulty: 'intermediate',
    category: 'dynamic & spa testing',
    prerequisites: ['web-test-ajax-dynamic-content'],
    keyPoints: [
      "Browser back/forward button behavior needs explicit testing in an SPA — client-side routers can get this subtly wrong (a back-press that doesn't restore scroll position, or loses in-memory state a traditional server-rendered page wouldn't have had in the first place).",
      "Deep-linking (loading a specific in-app URL directly, not by navigating from the home page) is a common SPA gap worth testing explicitly — an app that works perfectly when navigated to normally can 404 or render blank when a URL is opened fresh, if client-side routing isn't correctly bootstrapped from a direct load.",
      "Next.js's App Router blurs this distinction deliberately (Server Components render on the server, Client Components hydrate and behave SPA-like afterward) — testing strategy should match which parts of a given page are which, rather than treating the whole app as uniformly one model or the other.",
      'Page-transition loading states (a route change that takes a moment) are worth testing the same way as AJAX loading states — an SPA that goes fully blank or unresponsive between routes reads as broken even if the eventual result is correct.'
    ]
  },
  {
    id: 'web-test-session-cookies',
    title: 'Session Management & Cookie Testing',
    summary:
      'Verifying a session persists correctly across requests, expires when it should, and that cookies carry the right security attributes — a thin slice of auth testing focused specifically on the session/cookie mechanics.',
    difficulty: 'intermediate',
    category: 'forms & data integrity',
    prerequisites: ['auth-jwt', 'supertest-testing-auth-flow'],
    keyPoints: [
      'Functional coverage: a session survives a page refresh and new tab (if intended), correctly expires after the configured timeout (both idle timeout and absolute maximum lifetime, which are distinct settings worth testing separately), and logging out actually invalidates the session server-side (not just clearing the client-side cookie).',
      'Security-relevant cookie attributes worth explicitly checking: `HttpOnly` (prevents JavaScript access, mitigating XSS-based cookie theft), `Secure` (cookie only sent over HTTPS), and `SameSite` (mitigates CSRF) — these three flags being correctly set is a fast, high-value manual/automated check.',
      'Concurrent session behavior needs a defined and tested policy: does logging in on a second device invalidate the first session, allow both simultaneously, or something in between — whichever the intended behavior is, it should be an explicit test case rather than an assumption.',
      'Session-fixation testing (does the app issue a NEW session identifier after login, rather than reusing a pre-login one) is a specific, well-known vulnerability class worth naming — reusing the same session ID across the authentication boundary is a classic finding in both QA and pentest contexts.'
    ]
  },
  {
    id: 'web-test-caching',
    title: 'Caching Mechanism Testing',
    summary:
      'Verifying data is actually cached, correctly invalidated on update, and correctly expires — a cache that never invalidates and a cache that never caches are both bugs, just opposite ones.',
    difficulty: 'intermediate',
    category: 'forms & data integrity',
    prerequisites: ['web-test-ajax-dynamic-content'],
    keyPoints: [
      "Verify caching is actually happening where intended — a second request for the same resource should be measurably faster or show a cache-hit indicator (a response header, a network-tab check) rather than assuming it based on the caching layer's existence.",
      'Cache invalidation on update is the harder and more bug-prone half: after data changes (a user edits their profile), does a subsequently-loaded page show the STALE cached version or the fresh one — this is one of the most reliably confusing areas in web development to get right, worth testing deliberately rather than by accident.',
      'Cache expiration policies (TTL-based, or invalidated by an explicit event) need boundary testing similar to any other time-based logic — data just before and just after the expiry point.',
      "Browser-level caching (HTTP cache headers like `Cache-Control`, `ETag`) and application-level caching (a CDN, a server-side cache, client-side state caching in something like React Query) are distinct layers that can each independently have caching bugs — a thorough test names which layer a given caching bug lives in, not just 'caching is broken.'"
    ]
  },
  {
    id: 'web-test-form-validation',
    title: 'Deep Form Validation Testing',
    summary:
      'Every field needs both positive (valid input succeeds) and negative (invalid input is rejected WITH a clear, correct error message) test cases — a form that silently accepts bad data is as much a bug as one that wrongly rejects good data.',
    difficulty: 'basic',
    category: 'forms & data integrity',
    prerequisites: ['test-fund-mt-test-case-design'],
    keyPoints: [
      'Systematic field-by-field coverage: required-field validation, format validation (email, phone, postal code patterns), length limits (both too-short and too-long), and type-appropriate boundary values — the same equivalence-partitioning and boundary-value-analysis techniques from general test design, applied specifically to each input.',
      'Cross-field validation deserves its own test cases: a date range where the end date must be after the start date, a password-confirmation field that must match, or a total that must reconcile against its line items — these bugs only surface when fields are tested TOGETHER, not each in isolation.',
      'Client-side AND server-side validation both need testing — a form that only validates in the browser is trivially bypassed (disabled JS, a direct API call), so the server-side validation is the one that actually matters for data integrity, even though the client-side check is what most manual testers see first.',
      'Error message quality is itself testable: does the message clearly state WHAT was wrong and roughly how to fix it, does it appear next to the relevant field (not just in a generic banner), and does it clear once the user corrects the input.'
    ]
  },
  {
    id: 'web-test-search-functionality',
    title: 'Search Functionality Testing',
    summary:
      "Beyond 'does a query return results' — accuracy, relevance ranking, filtering/sorting combinations, and the empty/no-results state all need dedicated coverage.",
    difficulty: 'intermediate',
    category: 'forms & data integrity',
    prerequisites: ['web-test-form-validation'],
    keyPoints: [
      'Accuracy testing: a known query against known seeded data should return exactly the expected results — this requires controlled test data (see test data management), since testing search against arbitrary production-like data makes "is this result set correct" unanswerable.',
      'Relevance/ranking testing is qualitatively different from pure accuracy — a query returning ALL the right results in an unhelpful order is a real (if softer) bug, and testing it usually means asserting the top few results specifically rather than just set membership.',
      'Filter and sort COMBINATIONS multiply fast — testing every filter individually is necessary but not sufficient; a few realistic combined scenarios (filtered AND sorted AND paginated together) catch interaction bugs that isolated single-filter tests miss.',
      'Edge cases worth naming explicitly: an empty query, a query with zero results (does the UI show a helpful empty state, not just a blank list), special characters/injection-style input (also a security-testing overlap — see the SQL injection notes), and very long queries.',
      'Autocomplete/typeahead, when present, adds its own timing dimension (debouncing, race conditions between out-of-order responses for rapidly-changed queries) worth testing the same way as any other async UI.'
    ]
  },
  {
    id: 'web-test-file-upload-download',
    title: 'File Upload & Download Testing',
    summary:
      'File type/size validation, upload progress and error handling, and download integrity (the downloaded file actually matches what was uploaded) are the core coverage areas — plus the security angle of what a malicious upload could do.',
    difficulty: 'intermediate',
    category: 'forms & data integrity',
    prerequisites: ['web-test-form-validation'],
    keyPoints: [
      'Upload validation: correct file types accepted, incorrect types rejected with a clear message, size limits enforced (both just-under and just-over the limit), and — critically — that validation happens SERVER-SIDE, not just via the `accept` attribute or client-side JS which a malicious user can bypass entirely.',
      "Security testing for uploads specifically: attempting to upload a disguised file type (an executable renamed with an image extension), verifying uploaded files are stored somewhere non-executable and access-controlled, and confirming the app doesn't trust a client-supplied filename or content-type without server-side verification.",
      'Progress and interruption handling: does the UI show meaningful progress for a large file, and does interrupting an upload (closing the tab, losing connection mid-upload) leave the system in a clean state rather than a corrupted partial file.',
      'Download integrity: the downloaded file\'s content should be verified against the original (a checksum comparison for automated tests) rather than just confirming a download STARTED — a corrupted or truncated download that "succeeds" from the browser\'s perspective is a real and easy-to-miss bug class.'
    ]
  },
  {
    id: 'web-test-seo',
    title: 'SEO Testing Beyond Meta Tags',
    summary:
      'Meta tags are the easy, well-known check — the deeper SEO test surface is site architecture (crawlability, internal linking), structured data correctness, and Core Web Vitals, since search engines now factor page experience into ranking.',
    difficulty: 'intermediate',
    category: 'seo & compliance',
    prerequisites: ['seo-sitemap-jsonld'],
    keyPoints: [
      'Meta tags (title, description, Open Graph/Twitter Card tags for social-sharing previews) are the baseline check — but verifying they exist is table stakes, not the substance of a thorough SEO test pass.',
      "Crawlability testing: a correct XML sitemap, a `robots.txt` that doesn't accidentally block important pages, and confirming pages that SHOULD be indexed don't carry an accidental `noindex` tag — a single misconfigured `noindex` on a production release can silently deindex an entire section.",
      "Structured data (JSON-LD schema markup) testing verifies the markup is both syntactically valid AND semantically accurate (a product's schema actually matches its real price/availability) — Google's own Rich Results testing tools are the standard way to validate this.",
      'Core Web Vitals (LCP, INP, CLS — see the Web Performance notes for the metrics themselves) are now a documented, direct ranking factor, which is exactly why performance testing and SEO testing overlap rather than being fully separate concerns.',
      'Internal linking structure (are important pages reachable within a few clicks from the homepage, do links use descriptive anchor text) affects both SEO crawl-priority and, not coincidentally, usability — a well-structured site tends to score well on both fronts simultaneously.'
    ]
  },
  {
    id: 'web-test-network-resilience',
    title: 'Network Resilience Testing',
    summary:
      'Verifying the app degrades gracefully — not just breaks outright — under a slow connection, a request timeout, or a mid-session connection drop.',
    difficulty: 'intermediate',
    category: 'dynamic & spa testing',
    prerequisites: ['web-test-ajax-dynamic-content'],
    keyPoints: [
      'Slow-connection testing (throttled to 3G-equivalent speeds via browser dev tools or a proxy) surfaces UX issues invisible on a fast dev machine — perceived performance, loading-state clarity, and whether anything times out too aggressively for a genuinely slow but working connection.',
      'Timeout handling needs an explicit test: does a request that never resolves eventually show a clear error/retry option to the user, or does it leave the UI stuck in a loading state indefinitely.',
      'A connection dropping MID-REQUEST (not before, not after — during) is a distinct scenario from a slow or failed request from the start, and its correct handling (retry, clear error, no corrupted partial state) is easy to overlook if only the two cleaner cases get tested.',
      "This overlaps directly with the mobile network-variability concerns already covered in the mobile testing notes — the difference here is that a web app on a laptop is assumed to be less exposed to this than mobile, which is precisely why it's more likely to be under-tested on the web side."
    ]
  },
  {
    id: 'web-test-gdpr-compliance',
    title: 'GDPR / Privacy Compliance Testing (Web-Specific)',
    summary:
      'Cookie consent mechanics, data export/deletion request flows, and correctly-scoped analytics/tracking are the concretely testable pieces of GDPR compliance on the web surface specifically.',
    difficulty: 'intermediate',
    category: 'seo & compliance',
    prerequisites: ['etl-security-compliance'],
    keyPoints: [
      'Cookie consent banners need functional testing beyond "does it appear": does declining non-essential cookies actually PREVENT those cookies/trackers from firing (not just hide the banner while tracking continues regardless), and does the choice persist across sessions.',
      'A user\'s data export and deletion ("right to be forgotten") requests are concrete, testable flows — verify a deletion request actually removes/anonymizes personal data across every system it touches, not just the primary user record (this connects directly to the ETL security/compliance notes on data flowing through pipelines).',
      "Testing what analytics/tracking scripts actually fire, and when, relative to consent state — a common and easy-to-miss compliance bug is a tracking pixel that fires on page load regardless of the user's actual cookie choice.",
      "Data minimization is testable too: forms and flows should only collect data that's actually needed for the stated purpose — an audit of what's collected vs what's actually used is a legitimate (if less common) QA-adjacent compliance check."
    ]
  }
];
