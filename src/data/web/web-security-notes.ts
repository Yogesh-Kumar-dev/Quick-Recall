import type { Note } from '@/types/content';

// category values: 'browser-model' | 'attacks' | 'defenses' | 'transport'

export const webSecurityNotes: Note[] = [
  // ─── BROWSER MODEL ──────────────────────────────────────────────────────────
  {
    id: 'websec-same-origin-policy',
    title: 'The Same-Origin Policy (SOP)',
    summary: 'The browser’s core security rule: scripts from one origin cannot read responses or data belonging to another origin.',
    difficulty: 'basic',
    category: 'browser-model',
    textbookDef:
      'The Same-Origin Policy is a browser security mechanism that restricts how a document or script loaded from one origin can interact with resources from another origin. An origin is the triple of scheme, host, and port.',
    eli5: 'Every website lives in its own flat. The Same-Origin Policy is the landlord’s rule that a tenant can look out their own window but cannot walk into the neighbour’s flat and read their mail.',
    keyPoints: [
      'An origin is scheme + host + port. https://app.example.com, http://app.example.com, and https://app.example.com:8443 are three different origins, while https://app.example.com/a and https://app.example.com/b are the same origin.',
      'Without the SOP, any site you visit could fetch your banking dashboard with your cookies attached and read the response , the policy is what makes it safe to be logged into several sites in one browser.',
      'The SOP restricts reading, not sending. A page can still embed cross-origin images, scripts, and iframes, and can still submit forms cross-origin , it just cannot read the responses with JavaScript.',
      'Cross-origin JavaScript access to another window or iframe (its DOM, cookies, localStorage) is blocked; the small escape hatches are postMessage for windows and CORS for network requests.',
      'Subdomains are different origins , code on blog.example.com cannot read localStorage set by app.example.com.'
    ],
    gotcha:
      'Interviewers often ask why a cross-origin <img> or <script> tag loads fine while fetch() to the same URL fails. The tag embeds the resource without exposing its bytes to your JavaScript; fetch wants to read the response, which is exactly what the SOP forbids without CORS.',
    codeSnippet: `// Same origin? scheme + host + port must ALL match.
// Page: https://app.example.com/dashboard

fetch('https://app.example.com/api/user');   // same origin: allowed
fetch('https://api.example.com/user');       // different host: blocked unless CORS allows it
fetch('http://app.example.com/api/user');    // different scheme: cross-origin

// Embedding is fine, reading is not:
// <img src="https://other.com/pic.png">     // renders
// canvas.drawImage(thatImg) + toDataURL()   // throws: canvas is "tainted"`
  },
  {
    id: 'websec-cors',
    title: 'CORS: Cross-Origin Resource Sharing',
    summary:
      'CORS is the server’s way of relaxing the Same-Origin Policy , response headers that tell the browser which other origins may read this response.',
    difficulty: 'intermediate',
    category: 'browser-model',
    prerequisites: ['websec-same-origin-policy', 'cors-route-handlers'],
    textbookDef:
      'CORS is an HTTP-header-based mechanism that lets a server declare which origins other than its own are permitted to read its responses. The browser enforces it; for state-changing or non-simple requests it first sends an OPTIONS preflight request.',
    eli5: 'The Same-Origin Policy is a locked door between two flats. CORS is the neighbour putting up a note saying "app.example.com may come in" , the landlord (the browser) reads the note and unlocks the door for exactly that visitor.',
    keyPoints: [
      'CORS is enforced by the browser, not the server. The server happily processes the request either way; the browser simply refuses to hand the response to JavaScript if the Access-Control-Allow-Origin header does not match the requesting origin.',
      '"Simple" requests (GET/HEAD/POST with basic headers and form-style content types) are sent directly. Anything else , JSON bodies, custom headers like Authorization, methods like PUT/DELETE , triggers a preflight: the browser first sends OPTIONS asking permission.',
      'The preflight response uses Access-Control-Allow-Methods and Access-Control-Allow-Headers to say what is acceptable, and Access-Control-Max-Age to let the browser cache the answer and skip repeat preflights.',
      'Cookies and other credentials are excluded by default. The request needs credentials: "include" AND the response needs Access-Control-Allow-Credentials: true, and in that case Allow-Origin must be the exact origin, never the * wildcard.',
      'CORS errors always surface in the browser console, not in the network failure itself , the request often succeeded on the wire, the browser just refused to expose the response.'
    ],
    gotcha:
      'A very common production bug: setting Access-Control-Allow-Origin: * on an API that uses cookies. The browser rejects the combination of wildcard origin + credentials, so login-dependent requests fail even though anonymous ones work. Echo the specific allowed origin instead.',
    codeSnippet: `// Browser (https://app.example.com) calling another origin with cookies:
fetch('https://api.example.com/me', { credentials: 'include' });

// The API must answer with:
// Access-Control-Allow-Origin: https://app.example.com  (exact, not *)
// Access-Control-Allow-Credentials: true

// Non-simple request => preflight first:
// OPTIONS /me
// Access-Control-Request-Method: PUT
// Access-Control-Request-Headers: content-type, authorization
// ...and the server lists what it accepts:
// Access-Control-Allow-Methods: GET, PUT, DELETE
// Access-Control-Allow-Headers: Content-Type, Authorization
// Access-Control-Max-Age: 86400  // cache this answer for a day`
  },

  // ─── ATTACKS ────────────────────────────────────────────────────────────────
  {
    id: 'websec-xss',
    title: 'XSS: Cross-Site Scripting',
    summary:
      'XSS is attacker-controlled JavaScript running on your page , the attacker’s code inherits your users’ cookies, storage, and session.',
    difficulty: 'intermediate',
    category: 'attacks',
    prerequisites: ['websec-same-origin-policy'],
    textbookDef:
      'Cross-Site Scripting is a vulnerability where untrusted input is included in a page without proper encoding or sanitisation, allowing an attacker to execute arbitrary script in the victim’s browser under the vulnerable site’s origin.',
    eli5: 'Imagine a noticeboard where anyone can pin a note. XSS is someone pinning a note that is secretly a robot , everyone who walks past and reads the board has the robot rummage through their bag, because the board (your site) is trusted.',
    keyPoints: [
      'Stored XSS: the malicious script is saved on the server (a comment, a profile name) and served to every visitor. The most dangerous kind because one injection hits many users.',
      'Reflected XSS: the script arrives in the request itself (a query parameter echoed into the page) and only affects whoever clicks the crafted link.',
      'DOM-based XSS: the server is innocent , client-side JavaScript takes attacker-controlled data (location.hash, postMessage data) and writes it into a dangerous sink like innerHTML or eval.',
      'Once script runs in your origin it can read cookies that are not HttpOnly, read localStorage (including any JWT stored there), make authenticated requests as the user, and rewrite the page for phishing.',
      'The core defence is output encoding: treat user data as text, never as markup. Frameworks like React do this by default , {userInput} is escaped, which is why dangerouslySetInnerHTML has that scary name.',
      'Defence in depth: sanitise any HTML you must render (DOMPurify), set a Content-Security-Policy to block inline/unknown scripts, and mark session cookies HttpOnly so even successful XSS cannot read them.'
    ],
    gotcha:
      'Escaping is context-sensitive , HTML-escaping user input is not enough if you then place it inside a <script> block, an inline event handler, or a URL (javascript: URLs). Each context needs its own encoding rules, which is why "just sanitise it" answers fall apart in interviews.',
    codeSnippet: `// DOM XSS: attacker controls the URL hash
// https://site.com/#<img src=x onerror=alert(document.cookie)>
el.innerHTML = location.hash.slice(1);      // ❌ executes the payload

el.textContent = location.hash.slice(1);    // ✅ rendered as inert text

// Must render rich HTML? Sanitise it first:
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(userHtml); // strips scripts/handlers

// React escapes by default:
<p>{userInput}</p>                            // ✅ safe
<p dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌ you own the risk`
  },
  {
    id: 'websec-csrf',
    title: 'CSRF: Cross-Site Request Forgery',
    summary:
      'CSRF tricks a logged-in user’s browser into sending a state-changing request to your site , the browser helpfully attaches the session cookie, so the request looks legitimate.',
    difficulty: 'intermediate',
    category: 'attacks',
    prerequisites: ['websec-same-origin-policy', 'auth-cookies'],
    textbookDef:
      'Cross-Site Request Forgery is an attack that causes a victim’s browser to submit an unwanted, authenticated request to a site where the victim has an active session, exploiting the fact that browsers attach cookies automatically to requests targeting their site.',
    eli5: 'You have a standing arrangement with your bank: any letter with your wax seal is obeyed. CSRF is a stranger handing you a pre-written letter and tricking you into stamping your seal on it , the bank sees your seal and processes it.',
    keyPoints: [
      'The attack needs three ingredients: the victim is logged in (has a session cookie), the site relies on that cookie alone to authorise actions, and the action is triggerable by a plain form submit or GET request from another site.',
      'The Same-Origin Policy does not prevent SENDING cross-origin requests , evil.com can auto-submit a hidden form to yourbank.com/transfer, and the browser attaches yourbank.com’s cookies. The attacker never reads the response; the damage is the request itself.',
      'SameSite cookies are the modern first line of defence: SameSite=Lax (the default in Chromium-based browsers) stops cookies being sent on cross-site POSTs; SameSite=Strict stops them on all cross-site requests including top-level link clicks.',
      'The classic defence is a CSRF token: a random per-session value embedded in each form and verified server-side , evil.com cannot read your page (SOP blocks that), so it cannot know the token.',
      'Other layers: checking the Origin/Referer header server-side, and requiring a custom header (X-Requested-With) which plain cross-site forms cannot set.',
      'Pure token-in-header auth (a JWT sent via Authorization from JavaScript) is inherently CSRF-immune , another site cannot make your JavaScript attach the header. That immunity is the flip side of its XSS exposure.'
    ],
    gotcha:
      'Performing state changes via GET (e.g. /account/delete as a link) makes CSRF trivial , an <img src="https://site.com/account/delete"> in any forum post fires it. Idempotent-safe GETs are a security rule, not just a REST style preference.',
    codeSnippet: `<!-- evil.com: auto-submits against your bank using YOUR cookies -->
<form action="https://bank.com/transfer" method="POST" id="f">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="9999" />
</form>
<script>document.getElementById('f').submit();</script>

// Defences (use several):
// Set-Cookie: session=...; SameSite=Lax; HttpOnly; Secure
// <input type="hidden" name="csrf" value="{perSessionRandomToken}">
// server: reject if token missing/mismatched, or Origin header is foreign`
  },
  {
    id: 'websec-clickjacking',
    title: 'Clickjacking & frame-ancestors',
    summary:
      'Clickjacking hides your real site inside an invisible iframe and tricks users into clicking buttons they cannot see , the fix is refusing to be framed.',
    difficulty: 'basic',
    category: 'attacks',
    prerequisites: ['html-iframe-sandbox'],
    textbookDef:
      'Clickjacking (UI redressing) is an attack where a target site is loaded in a transparent or disguised iframe over decoy content, so that user clicks intended for the visible decoy actually land on the hidden site’s controls.',
    eli5: 'It is a fake cardboard ATM front taped over a real ATM. You think you are pressing "play free game", but under the cardboard your finger is really pressing "confirm transfer" on the machine behind it.',
    keyPoints: [
      'The attacker page stacks your site in an iframe with opacity: 0 above a tempting decoy button, aligning your "Delete account" or "Pay" button exactly under the decoy , the victim’s genuine, cookie-authenticated click lands on your button.',
      "Primary defence: the Content-Security-Policy frame-ancestors directive , frame-ancestors 'none' means no site may iframe you; 'self' allows only your own origin.",
      'X-Frame-Options: DENY / SAMEORIGIN is the older header equivalent , still widely sent for legacy browser coverage, but frame-ancestors wins when both are present.',
      'Clickjacking works even with perfect XSS/CSRF hygiene because the victim performs a real, legitimate click , that is why it needs its own dedicated header defence.',
      'For extremely sensitive actions, add interaction friction that framing cannot fake: re-entering a password, or a confirmation typed by the user.'
    ],
    gotcha:
      'Teams add frame-ancestors to the main app but forget standalone pages (payment widgets, OAuth consent screens, legacy admin panels) served from other paths or subdomains , attackers frame whichever endpoint was missed.',
    codeSnippet: `# Response headers that stop your site being framed:
Content-Security-Policy: frame-ancestors 'none'
X-Frame-Options: DENY   # legacy fallback

# Allow only your own origin (e.g. for internal preview iframes):
Content-Security-Policy: frame-ancestors 'self'`
  },
  {
    id: 'websec-owasp-top-10',
    title: 'The OWASP Top 10, from a frontend seat',
    summary:
      'OWASP’s ranked list of the most common web application risks , interviewers use it as a map of what you are expected to recognise.',
    difficulty: 'basic',
    category: 'attacks',
    prerequisites: ['websec-xss', 'websec-csrf', 'eng-authn-vs-authz'],
    textbookDef:
      'The OWASP Top 10 is a periodically updated awareness document from the Open Worldwide Application Security Project ranking the ten most critical web application security risk categories, based on real-world incident and vulnerability data.',
    keyPoints: [
      'Broken Access Control has held #1 across the 2021 and 2025 editions: users reaching data or actions they should not , e.g. changing /users/123 to /users/124 and seeing someone else’s order (an IDOR, Insecure Direct Object Reference). Authorisation must be enforced server-side on every request.',
      'Security Misconfiguration climbed to #2 in 2025: default credentials, verbose stack traces in production, missing security headers, overly permissive CORS , misconfiguration is now judged more damaging in practice than most code bugs.',
      'Software Supply Chain Failures is the big new 2025 entry at #3, broadening 2021’s "Vulnerable & Outdated Components": your npm dependency tree, build pipeline, and publish process are all attack surface (typosquatted packages, hijacked maintainer accounts). Audit and update dependencies (npm audit, Dependabot/Renovate) and protect CI.',
      'Injection (now #5) covers SQL injection and friends: untrusted input concatenated into queries or commands. Parameterised queries fix SQL injection; XSS is formally the same family on the browser side.',
      'Cryptographic Failures (#4) means sensitive data poorly protected , plain HTTP, weak hashing of passwords (use bcrypt/argon2, never plain SHA-256), secrets committed to repos.',
      'Authentication Failures (#7): brute-forceable logins, missing rate limiting, session ids that survive login (fixation) or logout.',
      'The rest of the 2025 list , Insecure Design (#6), Software or Data Integrity Failures (#8, e.g. compromised build artefacts), Security Logging & Alerting Failures (#9), and the new Mishandling of Exceptional Conditions (#10, error paths that fail open or leak) , mostly lives server-side but is fair game in full-stack interviews.'
    ],
    gotcha:
      'The classic trap answer is treating client-side checks as access control. Hiding the admin button in React is UX, not security , the API behind it must re-check the user’s permissions on every call, because anyone can call the API directly with curl.'
  },

  // ─── DEFENSES ───────────────────────────────────────────────────────────────
  {
    id: 'websec-csp',
    title: 'Content Security Policy (CSP)',
    summary:
      'A response header that whitelists where scripts, styles, and other resources may come from , the strongest browser-side backstop against XSS.',
    difficulty: 'advanced',
    category: 'defenses',
    prerequisites: ['websec-xss'],
    textbookDef:
      'Content Security Policy is an HTTP response header (or meta tag) through which a server declares approved sources for each class of resource a page may load or execute. The browser blocks anything outside the policy, mitigating XSS and data-injection attacks.',
    eli5: 'CSP is a guest list at the door of your page. Even if an attacker sneaks an invitation (injects a script tag), the bouncer checks the list , "scripts only from our own domain" , and turns the gatecrasher away.',
    keyPoints: [
      'Directives per resource type: script-src, style-src, img-src, connect-src (fetch/XHR/WebSocket targets), frame-ancestors, with default-src as the fallback for anything unlisted.',
      'The big win is blocking inline script: with a real CSP, injected <script>alert(1)</script> simply does not run, because inline code is disallowed unless you opt in.',
      "Allowing inline code safely: a per-response random nonce (script-src 'nonce-R4nd0m', only tags carrying that nonce run) or a hash of the exact script content. 'unsafe-inline' switches the protection off , its name is a warning.",
      "A strict modern policy is often script-src 'nonce-...' 'strict-dynamic', which trusts scripts loaded BY your nonce-approved scripts and ignores host whitelists , easier to maintain than long domain lists.",
      'Roll out with Content-Security-Policy-Report-Only plus a report-to/report-uri endpoint first: the browser reports violations without blocking, so you find what would break before enforcing.',
      'CSP is defence in depth , it does not remove the XSS bug, it limits the blast radius when your escaping misses a spot.'
    ],
    gotcha:
      "Third-party scripts are the usual CSP killer: analytics and ad tags inject further scripts from changing domains, so teams give up and add 'unsafe-inline' , which quietly disables the whole point. 'strict-dynamic' with nonces exists precisely to handle this without surrendering.",
    codeSnippet: `# A strict, modern CSP:
Content-Security-Policy:
  default-src 'self';
  script-src 'nonce-{random}' 'strict-dynamic';
  style-src 'self';
  img-src 'self' data:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self'

<!-- Only this script runs; injected ones lack the nonce: -->
<script nonce="{random}" src="/app.js"></script>

# Test without breaking production first:
Content-Security-Policy-Report-Only: ...; report-to csp-endpoint`
  },
  {
    id: 'websec-security-headers',
    title: 'Security Headers: HSTS, nosniff, Referrer-Policy & friends',
    summary:
      'A handful of cheap response headers that close whole attack classes , the first thing a security audit checks and the easiest one to pass.',
    difficulty: 'intermediate',
    category: 'defenses',
    prerequisites: ['websec-csp', 'websec-https-tls'],
    keyPoints: [
      'Strict-Transport-Security (HSTS): tells the browser to refuse plain HTTP to your domain for max-age seconds, defeating protocol-downgrade and cookie-stripping attacks on public Wi-Fi. includeSubDomains and preload extend it to everything under the domain, before the first ever visit.',
      'X-Content-Type-Options: nosniff stops the browser guessing content types , without it, a user-uploaded "image" that is really HTML/JS can be sniffed and executed in your origin.',
      'Referrer-Policy controls how much of the current URL leaks in the Referer header when users click away , strict-origin-when-cross-origin (the modern default) sends only your origin to other sites, keeping path/query data (tokens, ids) private.',
      'Permissions-Policy turns off powerful APIs you do not use (camera, microphone, geolocation) for your page and any iframes it embeds , shrinking what a compromised script or third-party frame can do.',
      'Cross-Origin-Opener-Policy (COOP) severs the window.opener link between your tab and pages you open or that open you; with Cross-Origin-Embedder-Policy (COEP) it isolates your page enough to unlock SharedArrayBuffer safely.',
      'X-Frame-Options / frame-ancestors: covered under clickjacking , part of the same standard header bundle.'
    ],
    gotcha:
      'HSTS preload is close to irreversible , you are submitting your domain to a list hard-coded into browsers. If some subdomain still needs plain HTTP (an internal tool, an IoT endpoint), it breaks and you cannot quickly un-preload. Verify every subdomain serves HTTPS before adding preload.',
    codeSnippet: `# The standard bundle worth memorising:
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Content-Security-Policy: frame-ancestors 'none'; ...

# Quick audit: https://securityheaders.com grades any URL.`
  },
  {
    id: 'websec-sri',
    title: 'Subresource Integrity (SRI)',
    summary:
      'A hash in your <script> tag that makes the browser verify a CDN file byte-for-byte before running it , protection against a compromised CDN.',
    difficulty: 'intermediate',
    category: 'defenses',
    prerequisites: ['websec-csp'],
    textbookDef:
      'Subresource Integrity is a browser feature that validates fetched resources against a cryptographic hash declared in the integrity attribute of <script> or <link> elements, refusing to execute or apply the resource if the content does not match.',
    eli5: 'You order a part from a supplier and the catalogue lists its exact weight to the gram. When the parcel arrives you weigh it , if it is even slightly off, someone tampered with it in transit and you refuse the delivery.',
    keyPoints: [
      'integrity="sha384-..." on a <script> or <link rel="stylesheet"> makes the browser hash the downloaded bytes and compare , mismatch means the resource is discarded, not executed.',
      'The threat model is a compromised or malicious CDN/third-party host, not your own server , if attackers replace the hosted copy of a library, every embedding site runs their code; SRI turns that into a silent no-op instead.',
      'Cross-origin SRI resources also need crossorigin="anonymous" so the browser can verify the response cleanly under CORS.',
      'SRI only fits content that is byte-stable. Third-party tags that update themselves constantly (analytics snippets) cannot be pinned , for those, CSP source restrictions are the containment tool instead.',
      'Self-hosted, build-hashed bundles (the Next.js/Vite default) get most of the same guarantee from HTTPS plus content-hashed filenames , SRI matters most the moment you load anything from an origin you do not control.'
    ],
    gotcha:
      'Pinning a CDN URL like .../library@latest with an integrity hash breaks on the next release , the file changes, the hash no longer matches, and the browser silently refuses to load it. Pin an exact version alongside the hash, and monitor for the load failure.',
    codeSnippet: `<script
  src="https://cdn.example.com/lib@4.17.21/lib.min.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"></script>

# Generate the hash:
# openssl dgst -sha384 -binary lib.min.js | openssl base64 -A`
  },

  // ─── TRANSPORT ──────────────────────────────────────────────────────────────
  {
    id: 'websec-https-tls',
    title: 'HTTPS & TLS, the working mental model',
    summary:
      'HTTPS wraps HTTP in TLS: certificates prove who the server is, a handshake agrees keys, and symmetric encryption protects everything after.',
    difficulty: 'basic',
    category: 'transport',
    textbookDef:
      'HTTPS is HTTP carried over Transport Layer Security. TLS provides confidentiality (encryption), integrity (tamper detection), and server authentication via X.509 certificates issued by certificate authorities that browsers trust.',
    eli5: 'Sending HTTP is writing postcards , anyone handling the post can read or rewrite them. HTTPS is a sealed, tamper-evident envelope, plus the recipient shows you government ID (the certificate) before you start writing.',
    keyPoints: [
      'Three guarantees: nobody on the path can read the traffic (confidentiality), nobody can alter it undetected (integrity), and you are talking to the real example.com, not an impostor (authentication).',
      'The handshake in one breath: the client says hello with supported cipher suites, the server presents its certificate, the browser checks the certificate chains to a trusted Certificate Authority and matches the domain, then both sides agree a symmetric session key (via ECDHE key exchange) that encrypts the actual data.',
      'Asymmetric crypto is only used to authenticate and agree keys , the payload uses fast symmetric encryption (AES-GCM or ChaCha20), because public-key operations are too slow for bulk data.',
      'Ephemeral key exchange gives forward secrecy: even if the server’s private key leaks later, recorded past traffic stays undecryptable, because each session used throwaway keys.',
      'Without HTTPS the modern web platform closes its doors: service workers, HTTP/2 in browsers, getUserMedia, geolocation, and Secure cookies all require a secure context. Let’s Encrypt made certificates free, so there is no cost excuse.',
      'TLS 1.3 (2018) cut the handshake to one round trip and removed the known-weak ciphers wholesale , if an interviewer asks "what changed", that is the headline.'
    ],
    gotcha:
      'HTTPS authenticates the CONNECTION, not the CONTENT , a phishing site at examp1e.com can have a perfectly valid padlock. The padlock means "your traffic to this domain is private", not "this domain is honest". Users conflating the two is exactly what attackers rely on.'
  }
];
