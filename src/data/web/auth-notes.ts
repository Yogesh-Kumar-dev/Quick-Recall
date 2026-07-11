import type { Note } from '@/types/content';

// category values: 'cookies' | 'sessions' | 'tokens' | 'oauth'

export const authNotes: Note[] = [
  // ─── COOKIES ────────────────────────────────────────────────────────────────
  {
    id: 'auth-cookies',
    title: 'How Cookies Actually Work',
    summary:
      'Cookies are small key–value pairs the server asks the browser to remember and send back automatically , the mechanism that gives stateless HTTP a memory.',
    difficulty: 'basic',
    category: 'cookies',
    prerequisites: ['eng-rest-api'],
    textbookDef:
      'A cookie is a piece of data set via the Set-Cookie response header (or document.cookie) that the browser stores and automatically attaches, via the Cookie request header, to subsequent requests matching the cookie’s domain, path, and security attributes.',
    eli5: 'A cookie is the wristband a club gives you at the door. You do not re-show your ID at the bar , the staff just glance at the wristband. The band is issued by the venue, only works at that venue, and expires when written on it.',
    keyPoints: [
      'HTTP is stateless , each request stands alone. Cookies bolt state on: the server says Set-Cookie: session=abc123 once, and the browser echoes Cookie: session=abc123 on every later request to that site, automatically.',
      'Scope is controlled by Domain and Path. Default (no Domain) is host-only , the exact host that set it. Domain=example.com widens it to all subdomains. Path narrows which URLs receive it.',
      'Lifetime: no Expires/Max-Age makes a session cookie that dies with the browser; Max-Age=86400 (or an Expires date) makes a persistent cookie that survives restarts.',
      'Practical limits: roughly 4KB per cookie and a per-domain count limit, and every cookie rides on EVERY matching request , bloated cookies are a per-request performance tax, which is why big data belongs in localStorage or IndexedDB instead.',
      'JavaScript access goes through document.cookie unless the cookie is HttpOnly. Server-set HttpOnly cookies are invisible to scripts entirely, which is deliberate (see the security attributes note).',
      'The automatic-attachment behaviour is both the superpower and the flaw: it is what makes "stay logged in" effortless, and exactly what CSRF attacks exploit.'
    ],
    gotcha:
      'document.cookie is famously weird: reading it gives one giant semicolon-joined string of ALL visible cookies, and "assigning" to it does not overwrite that string, it upserts one cookie. Deleting means re-setting the same name with an expiry in the past , there is no delete API in the DOM. The promise-based CookieStore API (cookieStore.get/set/delete) finally fixes the ergonomics and is now in all three engines (Chrome 87, Safari 18.4, Firefox 140).',
    codeSnippet: `# Server sets it once:
HTTP/1.1 200 OK
Set-Cookie: session=abc123; Max-Age=86400; Path=/; HttpOnly; Secure

# Browser then attaches it to every matching request, forever-ish:
GET /dashboard HTTP/1.1
Cookie: session=abc123

// Client-side (non-HttpOnly cookies only):
document.cookie = 'theme=dark; max-age=31536000; path=/';
document.cookie;              // "theme=dark; other=value" , one big string
document.cookie = 'theme=; max-age=0'; // "deletion" = expire it`
  },
  {
    id: 'auth-cookie-security-attributes',
    title: 'Cookie Security: HttpOnly, Secure, SameSite',
    summary:
      'Three attributes decide whether a stolen page, a plain-HTTP hop, or another website can abuse a cookie , every auth cookie should carry all three.',
    difficulty: 'intermediate',
    category: 'cookies',
    prerequisites: ['auth-cookies', 'websec-xss', 'websec-csrf'],
    textbookDef:
      'HttpOnly hides a cookie from document.cookie and script access. Secure restricts transmission to HTTPS connections. SameSite (Strict | Lax | None) controls whether the cookie accompanies cross-site requests, mitigating CSRF.',
    eli5: 'Think of the cookie as a house key. HttpOnly keeps it off the hallway hook where any guest (script) could grab it. Secure means you only hand it over inside a locked car, never shouted across the street. SameSite decides whether the key works when someone ELSE drives you to the house.',
    keyPoints: [
      'HttpOnly: JavaScript cannot read the cookie, so even a successful XSS attack cannot exfiltrate the session id. The browser still sends it on requests , your app keeps working, the attacker’s copy-paste theft does not.',
      'Secure: the cookie is never sent over plain http://, killing session theft by network sniffing or downgrade tricks. Non-negotiable for anything auth-related; pairs with HSTS.',
      'SameSite=Lax (the modern default in Chromium): the cookie is withheld from cross-site subrequests and cross-site POSTs, but still sent on top-level navigations (clicking a link to your site) , logged-in users arriving via links stay logged in, while classic CSRF form posts lose the cookie.',
      'SameSite=Strict withholds it even on link clicks , maximum CSRF protection, but users following an emailed link to your app appear logged out on arrival. Often used for a secondary "sensitive actions" cookie.',
      'SameSite=None means "send it cross-site" and REQUIRES Secure , needed for legitimately embedded third-party contexts (iframes, cross-site API calls with credentials).',
      'The __Host- name prefix (e.g. __Host-session) makes the browser enforce Secure + Path=/ + no Domain attribute, preventing subdomain and path tricks against the cookie.'
    ],
    gotcha:
      'SameSite is about SITES (registrable domain), not origins , app.example.com and api.example.com are the SAME site, so SameSite does nothing between them; but myapp.com calling api.othervendor.com is cross-site, and that vendor cookie needs SameSite=None; Secure or the browser silently drops it. "My embedded widget lost its login after a Chrome update" is exactly this.',
    codeSnippet: `# The auth-cookie gold standard:
Set-Cookie: __Host-session=abc123;
  HttpOnly;          # invisible to XSS
  Secure;            # HTTPS only
  SameSite=Lax;      # dropped from cross-site POSTs (CSRF)
  Path=/; Max-Age=3600

# Third-party/embedded context (must be sent cross-site):
Set-Cookie: widget_session=xyz; SameSite=None; Secure; HttpOnly`
  },

  // ─── SESSIONS ───────────────────────────────────────────────────────────────
  {
    id: 'auth-server-sessions',
    title: 'Server-Side Sessions',
    summary:
      'The classic login model: the server keeps the user’s state in a store and gives the browser only a random id to hold , simple to reason about, trivial to revoke.',
    difficulty: 'basic',
    category: 'sessions',
    prerequisites: ['auth-cookies', 'eng-authn-vs-authz'],
    textbookDef:
      'Session-based authentication stores authenticated user state server-side, keyed by a high-entropy session identifier issued to the client (typically in an HttpOnly cookie). Each request is authenticated by looking the identifier up in the session store.',
    eli5: 'A cloakroom: you hand over your coat (your logged-in state) and get a numbered ticket. The ticket itself says nothing about you , it is only useful to the cloakroom that holds the matching coat. Lose the ticket, or the attendant voids it, and it is just paper.',
    keyPoints: [
      'Login flow: verify credentials → generate a long random session id → save {sessionId → userId, roles, expiry} in a store → Set-Cookie the id. Every request then does a store lookup to rebuild "who is this?".',
      'The session id must be pure randomness (128+ bits from a CSPRNG) , it carries no data, so it cannot be forged, only guessed, and it must be unguessable.',
      'The store starts as app memory (express-session default) but that breaks the moment you run two server instances , production uses a shared store, almost always Redis, with the session TTL matching the cookie lifetime.',
      'Revocation is the killer feature: logout, "log out all devices", or an admin ban is just deleting rows from the store , the very next request fails. Token-based systems struggle to match this.',
      'Session fixation defence: regenerate the session id at every privilege change (especially login) , otherwise an attacker who planted a known id in the victim’s browser inherits the victim’s logged-in session.',
      'Costs: one store lookup per request, and the store is shared infrastructure you must scale and keep highly available , this is the trade token-based auth tries to escape.'
    ],
    gotcha:
      'Logout that only deletes the cookie is a fake logout , the session row still exists, so anyone who captured the id (shared computer, logs, network capture before HTTPS) can keep using it until natural expiry. Logout must destroy the server-side session, not just the client’s copy of the ticket.',
    codeSnippet: `// express-session + Redis, the canonical setup:
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 3600_000 },
  resave: false,
  saveUninitialized: false
}));

app.post('/login', async (req, res) => {
  const user = await verify(req.body.email, req.body.password);
  req.session.regenerate(() => {        // new id: kills session fixation
    req.session.userId = user.id;
    res.sendStatus(204);
  });
});

app.post('/logout', (req, res) => req.session.destroy(() => res.sendStatus(204)));`
  },
  {
    id: 'auth-session-vs-token',
    title: 'Sessions vs Tokens: the real trade-off',
    summary:
      'Stateful sessions buy instant revocation at the cost of a shared store; stateless tokens buy horizontal scale at the cost of revocation , everything else follows from that.',
    difficulty: 'intermediate',
    category: 'sessions',
    prerequisites: ['auth-server-sessions', 'auth-jwt'],
    keyPoints: [
      'Sessions are stateful: truth lives server-side, the client holds a meaningless pointer. Tokens (JWTs) are stateless: truth lives IN the token, signed; the server verifies the signature and trusts the contents without any lookup.',
      'Revocation: deleting a session kills it instantly; a signed JWT stays valid until exp no matter what , "how do you log out a JWT?" is the standard interview follow-up, and honest answers involve short lifetimes plus refresh tokens, or a denylist (which quietly reintroduces state).',
      'Scaling: sessions need every app instance to reach the shared store; JWTs verify with just the key, so any instance, edge function, or separate microservice can authenticate a request independently , the genuine JWT win, especially across service boundaries.',
      'Freshness: a session lookup always returns current roles/permissions; JWT claims are a snapshot from signing time , demote an admin and their token stays admin until it expires.',
      'Payload: cookies+sessions send ~a few dozen bytes per request; a JWT with claims is easily 1KB on EVERY request, and if it is in a cookie, on every asset request too.',
      'Pragmatic default: a monolith or single web app is usually best served by boring cookie sessions; JWTs earn their complexity for service-to-service auth, third-party API access, and multi-backend architectures. Many real systems combine them: session cookie for the web app, short-lived JWTs minted from it for API fan-out.'
    ],
    gotcha:
      '"JWTs are more secure than sessions" is a red-flag answer , they are differently shaped, not more secure. A JWT in localStorage is XSS-stealable; a session id in an HttpOnly cookie is not, but is CSRF-exposed instead. Security depends on storage and attributes, not on the token format.'
  },

  // ─── TOKENS ─────────────────────────────────────────────────────────────────
  {
    id: 'auth-jwt',
    title: 'JWT: structure, signing, and verification',
    summary:
      'A JSON Web Token is three base64url parts , header, claims, signature , that let a server hand out tamper-evident, self-contained proof of identity.',
    difficulty: 'intermediate',
    category: 'tokens',
    prerequisites: ['eng-authn-vs-authz', 'jwt-oauth-auth'],
    textbookDef:
      'A JSON Web Token is a compact, URL-safe means of representing claims between two parties. A JWS-signed JWT consists of a base64url-encoded header and payload plus a cryptographic signature over both, computed with a shared secret (HMAC) or a private key (RSA/ECDSA).',
    eli5: 'A JWT is a festival wristband with your name, your access level, and an expiry printed on it, sealed with the organiser’s tamper-evident hologram. Staff at any gate can check the hologram themselves , no radio call to the office , but they cannot un-print a band that already left the tent.',
    keyPoints: [
      'Format: header.payload.signature. Header says the algorithm ({"alg":"RS256","typ":"JWT"}), payload carries claims, signature seals both. The parts are base64url-ENCODED, not encrypted , anyone can read them; they just cannot alter them undetected.',
      'Standard claims worth knowing cold: sub (subject/user id), iss (issuer), aud (intended audience), exp (expiry), iat (issued at), nbf (not before). Verifiers must check exp and aud, not just the signature.',
      'HS256 is symmetric: one shared secret both signs and verifies , fine when the same service does both. RS256/ES256 are asymmetric: sign with a private key, verify with the public key , right for microservices and third-party verification, because verifiers can hold only the public key (often fetched from a JWKS endpoint).',
      'Verification is: recompute/check the signature with the expected algorithm, then validate exp, iss, and aud. Libraries do this , the interview point is knowing WHAT must be validated beyond the signature.',
      'Never put secrets in the payload (it is readable by design), and keep it small , the whole token travels on every request.',
      'Historic attacks are common interview colour: alg:none tokens accepted as valid, and HS256/RS256 confusion where a public key was reused as an HMAC secret. Both are fixed by pinning the exact expected algorithm server-side instead of trusting the token’s header.'
    ],
    gotcha:
      'The classic mistake is treating base64 as security , developers put emails, roles, even internal flags in JWTs believing they are hidden. Paste any JWT into jwt.io and the payload is plain JSON. Signed means tamper-EVIDENT, not secret; encryption is a separate, rarer thing (JWE).',
    codeSnippet: `// eyJhbGciOiJSUzI1NiJ9 . eyJzdWIiOiI0MiIsImV4cCI6MTcyMDAwMDAwMH0 . MEUCIQ...
//        header                    payload (claims)                signature

// Minting (server, private key):
const token = jwt.sign(
  { sub: user.id, roles: user.roles },
  privateKey,
  { algorithm: 'RS256', expiresIn: '15m', issuer: 'api.example.com', audience: 'example-web' }
);

// Verifying (any service, public key) , pin the algorithm:
const claims = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],           // never trust the token's own alg header
  issuer: 'api.example.com',
  audience: 'example-web'
});`
  },
  {
    id: 'auth-jwt-storage',
    title: 'Where to store a JWT: cookie vs localStorage',
    summary:
      'localStorage exposes the token to XSS; a cookie exposes requests to CSRF , the debate is really "which attack class do you prefer defending".',
    difficulty: 'advanced',
    category: 'tokens',
    prerequisites: ['auth-jwt', 'auth-cookie-security-attributes', 'websec-xss'],
    keyPoints: [
      'localStorage/sessionStorage: any script running in your origin can read it , one successful XSS (including via a compromised npm dependency) exfiltrates every user’s token silently. There is no HttpOnly equivalent for storage.',
      'HttpOnly cookie: scripts cannot read it, so XSS cannot STEAL it , but the browser auto-attaches it, so you inherit CSRF and must defend with SameSite=Lax/Strict plus CSRF tokens for anything cross-site.',
      'Worth being precise in interviews: XSS beats both options in different ways , with a cookie the injected script cannot take the token away, but it can still fire authenticated requests from the victim’s open page. HttpOnly limits blast radius (no offline token theft, attack ends when the tab closes); it is not immunity.',
      'The pattern most security teams land on: access token in memory only (a JS variable, gone on refresh), refresh token in an HttpOnly SameSite=Strict cookie scoped to the /refresh endpoint , page reload triggers a silent refresh to re-obtain the access token.',
      'sessionStorage adds nothing security-wise over localStorage (same XSS exposure), it only narrows persistence to one tab.',
      'If the "SPA + separate API on another domain" shape forces cross-site cookies (SameSite=None), many teams instead put the API behind the same site via a BFF (backend-for-frontend) proxy , which also lets the cookie go back to SameSite=Lax.'
    ],
    gotcha:
      'The follow-up trap: "so HttpOnly cookies make XSS harmless?" No , an attacker script on your page can still CALL your APIs with the cookie attached (the browser adds it) and act as the user in real time. HttpOnly stops token exfiltration, not token USE. The real fix for XSS is fixing XSS; storage choice just contains the damage.',
    codeSnippet: `// Common production-grade pattern:
// 1. access token: memory only
let accessToken = null;

async function refresh() {
  // refresh cookie: HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh
  const res = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' });
  accessToken = (await res.json()).accessToken;   // never touches storage
}

async function api(path) {
  return fetch(path, { headers: { Authorization: \`Bearer \${accessToken}\` } });
}
// page reload -> accessToken is null -> call refresh() once, carry on`
  },
  {
    id: 'auth-refresh-tokens',
    title: 'Refresh Tokens & rotation',
    summary:
      'Short-lived access tokens keep theft cheap; a long-lived refresh token quietly mints new ones , and rotating it on every use turns replay into a tripwire.',
    difficulty: 'intermediate',
    category: 'tokens',
    prerequisites: ['auth-jwt', 'auth-jwt-storage'],
    textbookDef:
      'A refresh token is a long-lived credential used solely to obtain new short-lived access tokens from the authorisation server. Refresh token rotation issues a new refresh token on each use and invalidates the old one, enabling detection of token replay.',
    eli5: 'The access token is a day pass; the refresh token is your membership card kept in the office safe. Each morning you swap yesterday’s card for today’s pass AND a fresh card , so if a pickpocket copies your card, the moment both of you try to swap it, the gym notices two identical cards and cancels the whole membership.',
    keyPoints: [
      'Why split tokens at all: access tokens are verified statelessly everywhere, so they cannot be revoked , keep them short (5–15 minutes) so a stolen one dies fast. The refresh token is used rarely, against ONE endpoint, where the server CAN keep state and check revocation.',
      'Flow: access token expires → client calls /refresh with the refresh token → server validates it against its store → returns a new access token (and, with rotation, a new refresh token, invalidating the used one).',
      'Rotation is the security payoff: every refresh token is single-use. If a stolen copy is replayed after the legitimate client already rotated, the server sees a dead token being used , the standard response is revoking the entire token family, forcing a proper re-login.',
      'Storage: refresh tokens are the crown jewels , HttpOnly Secure SameSite=Strict cookie path-scoped to the refresh endpoint (web), or the platform keychain (mobile). Never localStorage.',
      'Server-side you store refresh tokens (hashed, like passwords) with user id, family id, expiry, and revoked flag , this store is small and rarely hit, unlike a per-request session store.',
      'UX result: users stay signed in for weeks without week-long attack windows , the silent refresh happens behind the scenes.'
    ],
    gotcha:
      'Rotation plus real networks has a sharp edge: the client sends a refresh, the response is lost (flaky connection), the client retries with the now-consumed token , and strict family revocation logs the innocent user out of everything. Production implementations allow a tiny reuse grace window or idempotent retry handling; knowing this failure mode is senior-level signal.'
  },

  // ─── OAUTH ──────────────────────────────────────────────────────────────────
  {
    id: 'auth-oauth2',
    title: 'OAuth 2.0: roles & the Authorization Code flow',
    summary:
      'OAuth is delegated ACCESS, not login: a user grants your app limited permission to their data on another service, without ever giving you their password.',
    difficulty: 'intermediate',
    category: 'oauth',
    prerequisites: ['auth-jwt', 'eng-authn-vs-authz'],
    textbookDef:
      'OAuth 2.0 is an authorisation framework in which a resource owner grants a client application scoped access to resources hosted by a resource server, mediated by an authorisation server that issues access tokens after obtaining the owner’s consent.',
    eli5: 'A hotel key-card system for your data. You (guest) ask reception (authorisation server) to give the luggage service (the app) a card that opens ONLY your room’s luggage cupboard, ONLY this week. The porter never learns your home address or your master key , and reception can cancel the card any time.',
    keyPoints: [
      'Four roles to name precisely: resource owner (the user), client (your app), authorisation server (issues tokens, shows the consent screen), resource server (the API holding the data). "Google" is usually both servers.',
      'The problem it solves: pre-OAuth, "import your Gmail contacts" meant typing your Gmail password into a stranger’s site , full account access, unrevocable short of a password change. OAuth replaces that with scoped, expiring, revocable tokens.',
      'Authorization Code flow, step by step: client redirects the user to the authorisation server with client_id, redirect_uri, scope, and a random state → user logs in there and consents → server redirects back with a one-time authorization CODE → the client’s BACKEND exchanges code + client_secret for the access token.',
      'Why the code detour instead of returning a token directly: the redirect travels through the browser (URL, history, logs) where a token would leak; the code alone is useless without the client_secret, which only the backend knows. The old implicit flow that skipped this is deprecated for exactly that reason.',
      'state is a random value the client checks when the redirect comes back , it ties the response to the request it started, blocking CSRF-style code injection into someone else’s session.',
      'Scopes (contacts.readonly, repo, openid...) are the "limited" in limited access , request the minimum; users see the list on the consent screen.'
    ],
    gotcha:
      'OAuth access tokens prove the holder may ACCESS resources , they do not, by themselves, prove WHO the user is. "Sign in with X" built on raw OAuth (verifying identity by fetching /me with the token) has known impersonation pitfalls , identity was standardised separately as OIDC on top of OAuth, which is the next note.',
    codeSnippet: `# 1. Send the user to the authorisation server:
https://auth.provider.com/authorize?
  response_type=code&client_id=my-app&scope=contacts.readonly
  &redirect_uri=https://myapp.com/callback&state=xyz123

# 2. After consent, browser is bounced back:
https://myapp.com/callback?code=SplxlOBe&state=xyz123   # verify state!

# 3. Backend swaps the code (+ secret) for tokens , server to server:
POST https://auth.provider.com/token
  grant_type=authorization_code&code=SplxlOBe
  &redirect_uri=https://myapp.com/callback
  &client_id=my-app&client_secret=****

# -> { "access_token": "...", "expires_in": 3600, "refresh_token": "..." }`
  },
  {
    id: 'auth-pkce',
    title: 'PKCE: OAuth for apps that can’t keep a secret',
    summary:
      'SPAs and mobile apps cannot hide a client_secret, so PKCE replaces it with a per-request proof: only whoever STARTED the flow can finish it.',
    difficulty: 'advanced',
    category: 'oauth',
    prerequisites: ['auth-oauth2'],
    textbookDef:
      'PKCE (Proof Key for Code Exchange, RFC 7636) augments the Authorization Code flow: the client sends a hash (code_challenge) of a random code_verifier when requesting authorisation, and must present the original verifier when exchanging the code, preventing interception attacks by parties who obtained the code alone.',
    eli5: 'You tear a banknote in half and hand the shop one half when you order. When the parcel is ready, whoever collects it must produce the matching other half. A thief who overhears the order number (the code) still cannot collect , they do not hold your half of the note.',
    keyPoints: [
      'The gap PKCE fills: a "public client" (SPA, mobile app, CLI) ships its code to users, so a client_secret baked into it is not secret , decompile the app or view source and it is gone. Without a secret, anyone who intercepts the authorization code could redeem it.',
      'Mechanics: client generates a random code_verifier → sends code_challenge = base64url(SHA-256(verifier)) with the initial redirect → the authorisation server stores it → at token exchange the client sends the raw verifier → server hashes and compares. Interceptors saw only the hash, and SHA-256 does not run backwards.',
      'The interception threat is concrete on mobile: a malicious app registering the same custom URL scheme (myapp://callback) could receive your redirect and steal the code , PKCE makes that stolen code worthless.',
      'Current best practice (OAuth 2.1 draft): Authorization Code + PKCE for ALL clients, even confidential backend ones (defence in depth); the implicit flow and password grant are removed entirely.',
      'PKCE replaces the client_secret in the exchange , everything else about the code flow (state, redirect_uri validation, scopes) stays.'
    ],
    gotcha:
      'PKCE only proves the code-redeemer started the flow , it does not make the SPA’s RESULTING tokens safe. Where those tokens then live is the storage problem from the JWT-storage note, unchanged. Increasingly teams avoid tokens-in-browser altogether with a BFF: the backend does the OAuth dance and the SPA just gets an ordinary session cookie.',
    codeSnippet: `// SPA/mobile side:
const verifier  = base64url(crypto.getRandomValues(new Uint8Array(32)));
const challenge = base64url(await sha256(verifier));

// 1. authorize (note: challenge, no secret anywhere)
location.href = \`https://auth.provider.com/authorize?response_type=code\` +
  \`&client_id=spa-app&redirect_uri=\${cb}&state=\${state}\` +
  \`&code_challenge=\${challenge}&code_challenge_method=S256\`;

// 2. token exchange: present the original verifier
await fetch('https://auth.provider.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code', code, redirect_uri: cb,
    client_id: 'spa-app', code_verifier: verifier   // <- the proof
  })
});`
  },
  {
    id: 'auth-oidc-sso',
    title: 'OpenID Connect & Single Sign-On',
    summary:
      'OIDC is the thin identity layer on top of OAuth that makes "Sign in with Google" legitimate , an ID token that cryptographically states who the user is.',
    difficulty: 'intermediate',
    category: 'oauth',
    prerequisites: ['auth-oauth2', 'auth-jwt', 'nextauth-authjs'],
    textbookDef:
      'OpenID Connect is an identity layer on OAuth 2.0. Adding the openid scope makes the authorisation server also act as an identity provider, returning a signed JWT (the ID token) containing authenticated claims about the end user, alongside the usual access token.',
    eli5: 'OAuth hands the app a luggage-room key card (access). OIDC additionally hands it a signed letter from reception: "this guest is Jane Doe, checked in at 9:14, verified by passport". The key card opens doors; the letter is what lets the app say "welcome back, Jane".',
    keyPoints: [
      'Mechanically it IS OAuth: same Authorization Code (+PKCE) flow , you add scope=openid (plus profile, email) and receive an extra id_token in the token response.',
      'The ID token is a signed JWT about AUTHENTICATION: sub (a stable user id at this issuer), iss, aud (your client_id), plus profile claims (email, name, picture) and auth-time metadata. Verify its signature (issuer’s JWKS), iss, aud, and exp like any JWT.',
      'Division of labour in one line: access token → for calling APIs, opaque to you, do not introspect it; ID token → for YOUR app to know who logged in, never send it to APIs.',
      'OIDC also standardises discovery (/.well-known/openid-configuration tells clients every endpoint and key location) and a /userinfo endpoint , which is why libraries like Auth.js/NextAuth can support any compliant provider with a URL and two credentials.',
      'SSO is the org-level payoff: one identity provider (Okta, Entra ID, Google Workspace) authenticates you once, and every connected app trusts its tokens , one password, one MFA setup, one off-boarding switch that kills access to everything. SAML is the older XML-based protocol filling the same enterprise niche; OIDC is its JSON/JWT-era successor.',
      'Use the sub claim as the user key when linking accounts , emails change and, on some providers, can be unverified or recycled.'
    ],
    gotcha:
      'The classic OIDC implementation bug is skipping aud validation: an ID token minted for SomeOtherApp is still a validly-signed Google token , if you only check the signature and issuer, an attacker can log into YOUR app replaying a token they legitimately obtained for a different site. aud must equal your own client_id, every time.'
  }
];
