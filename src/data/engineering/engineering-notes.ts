import type { Note } from '@/types/content';

// category values:
//   Engineering:  'fundamentals' | 'oop' | 'apis' | 'databases' | 'system-design' | 'practices' | 'version-control'
//   Architecture: 'architecture'
//   Testing:      'testing-types' | 'testing-automation'

export const engineeringNotes: Note[] = [
  // ─── FUNDAMENTALS ─────────────────────────────────────────────────────────────
  {
    id: 'eng-compiler-interpreter',
    title: 'Compiler vs Interpreter',
    summary: 'A compiler translates the whole program ahead of time; an interpreter runs it line by line.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Compiler: translates the entire source to machine code (or bytecode) before running , errors surface at compile time.',
      'Interpreter: reads and executes line by line at runtime , errors surface when that line runs.',
      'Compiled programs (C, Rust, Go) generally start and run faster; interpreted ones (Python, classic JS) are more portable and flexible.',
      'Many modern runtimes are hybrid: JS uses a JIT (just-in-time) compiler that interprets first, then compiles hot paths to machine code.',
      'TypeScript "compiles" (transpiles) to JavaScript , translation between languages at the same level.'
    ],
    gotcha:
      'JavaScript is not purely interpreted , V8 parses to bytecode and JIT-compiles frequently-run code, which is why micro-benchmarks can be misleading.',
    codeSnippet: `// Compiled:  source ──(compiler)──> binary ──> run
// Interpreted: source ──(interpreter reads + runs line by line)
// JIT (V8):  parse → bytecode → optimize hot paths → machine code`
  },
  {
    id: 'eng-big-o',
    title: 'Big-O & Time Complexity',
    summary: 'Big-O describes how an algorithm’s cost grows as the input grows , the language of efficiency.',
    difficulty: 'intermediate',
    category: 'fundamentals',
    keyPoints: [
      'Big-O expresses the worst-case growth rate, ignoring constants and lower-order terms.',
      'Common classes, best→worst: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).',
      'O(1): hash lookup; O(log n): binary search; O(n): single loop; O(n log n): good sorts; O(n²): nested loops.',
      'Space complexity measures extra memory, expressed the same way.',
      'Choosing the right data structure (e.g. a Set for O(1) lookups vs an array O(n)) is the usual lever.'
    ],
    gotcha:
      'Big-O hides constants: an O(n) algorithm with a huge constant factor can be slower than an O(n²) one for small inputs , it describes scaling, not absolute speed.',
    codeSnippet: `// O(n²) , nested loop
for (const a of list) for (const b of list) compare(a, b);

// O(n) — one pass with a Set
const seen = new Set();
for (const x of list) { if (seen.has(x)) …; seen.add(x); }`
  },
  {
    id: 'eng-data-structures',
    title: 'Core Data Structures',
    summary: 'Arrays, hash maps, stacks, queues, trees, graphs , each trades off lookup, insertion, and ordering.',
    difficulty: 'intermediate',
    category: 'fundamentals',
    prerequisites: ['eng-big-o'],
    keyPoints: [
      'Array/List: indexed, ordered; O(1) access by index, O(n) search/insert-in-middle.',
      'Hash map / Set: O(1) average lookup/insert by key, unordered.',
      'Stack (LIFO) and Queue (FIFO): ordered access at the ends , undo history, task queues, BFS/DFS.',
      'Tree: hierarchical; binary search trees give O(log n) search when balanced.',
      'Graph: nodes + edges for networks/relationships; traversed with BFS or DFS.'
    ],
    gotcha:
      'Reaching for an array and .includes() (O(n)) inside a loop is a common O(n²) trap , a Set turns the membership check into O(1).',
    codeSnippet: `const map = new Map();   // key → value, O(1)
const set = new Set();   // unique members, O(1) has()
const stack = [];        // push / pop  (LIFO)
const queue = [];        // push / shift (FIFO)`
  },

  // ─── OOP ──────────────────────────────────────────────────────────────────────
  {
    id: 'eng-oop-principles',
    title: 'The Four Pillars of OOP',
    summary: 'Encapsulation, abstraction, inheritance, and polymorphism , the foundations of object-oriented design.',
    difficulty: 'basic',
    category: 'oop',
    keyPoints: [
      'Encapsulation: bundle data with the methods that operate on it, and hide internals behind a public interface.',
      'Abstraction: expose only what callers need; hide complexity behind a simple surface.',
      'Inheritance: a subclass reuses and extends a parent class’s behaviour (is-a relationship).',
      'Polymorphism: one interface, many implementations , the same call behaves differently per type.',
      'Favour composition over inheritance when the relationship is "has-a" rather than "is-a".'
    ],
    gotcha:
      'Deep inheritance hierarchies become rigid and hard to change , "composition over inheritance" is the guidance precisely because inheritance tightly couples subclasses to their parents.',
    codeSnippet: `class Shape { area() { return 0; } }          // abstraction
class Circle extends Shape {                   // inheritance
  constructor(r) { super(); this.#r = r; }     // encapsulation (#private)
  area() { return Math.PI * this.#r ** 2; }    // polymorphism
}`
  },
  {
    id: 'eng-solid',
    title: 'SOLID Principles',
    summary: 'Five design principles for code that’s easier to maintain, extend, and test.',
    difficulty: 'intermediate',
    category: 'oop',
    prerequisites: ['eng-oop-principles'],
    keyPoints: [
      'S , Single Responsibility: a class/module should have one reason to change.',
      'O , Open/Closed: open for extension, closed for modification (add behaviour without editing existing code).',
      'L , Liskov Substitution: a subtype must be usable anywhere its base type is, without surprises.',
      'I , Interface Segregation: many small, focused interfaces beat one fat one.',
      'D , Dependency Inversion: depend on abstractions, not concrete implementations (enables mocking/testing).'
    ],
    gotcha:
      'SOLID is a set of guidelines, not laws , over-applying them (an interface and a factory for everything) adds indirection that hurts readability more than it helps.',
    codeSnippet: `// Dependency Inversion: depend on an abstraction
function notify(sender: MessageSender, msg: string) {
  sender.send(msg);          // any Email/SMS/Push impl works
}
// easy to swap a real sender for a mock in tests`
  },

  // ─── APIs ─────────────────────────────────────────────────────────────────────
  {
    id: 'eng-rest-api',
    title: 'REST APIs',
    summary: 'A convention for HTTP APIs: resources as URLs, HTTP verbs as actions, status codes as outcomes.',
    difficulty: 'basic',
    category: 'apis',
    keyPoints: [
      'Resources are nouns in the URL (/users/42); HTTP methods are the verbs.',
      'GET (read), POST (create), PUT/PATCH (update), DELETE (remove). GET is safe; GET/PUT/DELETE are idempotent.',
      'Status codes communicate outcome: 2xx success, 3xx redirect, 4xx client error, 5xx server error.',
      'Stateless: each request carries everything it needs (e.g. an auth token) , no server-side session memory.',
      'Alternatives: GraphQL (one endpoint, client picks the shape) and gRPC (binary, fast, typed).'
    ],
    gotcha:
      'Returning 200 OK with an error message in the body breaks clients that rely on status codes , use the right 4xx/5xx so errors are detectable.',
    codeSnippet: `GET    /users        → 200 list
POST   /users        → 201 created
GET    /users/42     → 200 or 404
PATCH  /users/42     → 200 updated
DELETE /users/42     → 204 no content`
  },
  {
    id: 'eng-idempotency',
    title: 'Idempotency & HTTP Methods',
    summary: 'An idempotent operation has the same effect whether you run it once or many times , vital for retries.',
    difficulty: 'intermediate',
    category: 'apis',
    prerequisites: ['eng-rest-api'],
    keyPoints: [
      'Idempotent: GET, PUT, DELETE , repeating the request leaves the server in the same state.',
      'Not idempotent: POST , calling it twice usually creates two resources.',
      'Safe methods (GET, HEAD) don’t change state at all.',
      'Matters for reliability: networks fail, so clients retry , idempotent calls are safe to retry.',
      'Make POST safe to retry with an idempotency key the server de-duplicates on.'
    ],
    gotcha:
      'A "Submit" button that fires a non-idempotent POST can double-charge on a retry or double-click , guard with an idempotency key or disable the button after the first click.',
    codeSnippet: `// Idempotency key makes a retry safe
fetch('/payments', {
  method: 'POST',
  headers: { 'Idempotency-Key': uuid },
  body: …
});`
  },
  {
    id: 'eng-pagination',
    title: 'Offset vs Cursor Pagination',
    summary:
      'Offset pagination says "skip N, take M" and is simple but drifts on changing data; cursor pagination points to "after this item" and stays stable.',
    difficulty: 'intermediate',
    category: 'apis',
    prerequisites: ['eng-rest-api', 'eng-db-indexing'],
    keyPoints: [
      'Offset pagination (LIMIT/OFFSET or ?page=3&size=20) asks the database to skip a number of rows then return the next batch , simple to implement and lets a user jump straight to page 7.',
      'Offset has two real problems at scale: OFFSET 100000 still makes the database walk through and discard 100,000 rows before it can return anything, so later pages get slower the deeper you go, and if a row is inserted or deleted while paging, items can be skipped entirely or shown twice as everything shifts by one.',
      'Cursor pagination instead asks for "the next N items after this specific one" , the cursor is usually the last seen items id or sort key, encoded opaquely, and the query becomes WHERE id > :cursor ORDER BY id LIMIT 20, which an index can jump straight to without scanning anything before it.',
      'Because a cursor pins to an actual row rather than a numeric position, items inserted or deleted elsewhere in the list do not shift what the next page returns , this is why every major feed-style API (Twitter/X, GitHub, Stripe) uses cursor pagination for anything that changes in real time.',
      'The trade-off: cursor pagination cannot jump to an arbitrary page number ("go to page 50") because there is no concept of numbered pages, only "the next batch after here" , offset is still the right, simpler choice for small, mostly-static datasets like an admin table with a page-number control.',
      'A composite cursor (sort key + id, e.g. WHERE (created_at, id) > (:cursorTime, :cursorId)) is needed whenever the sort column is not unique on its own, otherwise rows with identical sort values can be skipped or duplicated across pages.'
    ],
    gotcha:
      'Reaching for OFFSET/LIMIT on an infinite-scroll social feed is the classic mistake , as users scroll and new posts arrive, everyones offsets shift, so the same post can appear twice or vanish from the feed entirely. Any endpoint backing a live, frequently-changing, or infinitely-scrolling list should default to cursor pagination; offset is fine for a bounded admin table with page numbers.',
    codeSnippet: `-- Offset: slow and drift-prone at depth
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

-- Cursor: jumps straight in via the index, immune to shifting rows
SELECT * FROM posts
WHERE (created_at, id) < (:cursorTime, :cursorId)
ORDER BY created_at DESC, id DESC
LIMIT 20;
-- next cursor = (last row's created_at, last row's id)`
  },

  {
    id: 'eng-robots-txt',
    title: 'robots.txt',
    summary: 'A plain-text file at the root of a website that tells search-engine crawlers which pages they may or may not visit.',
    difficulty: 'basic',
    category: 'apis',
    prerequisites: ['eng-rest-api'],
    keyPoints: [
      'It lives at a fixed, well-known address: yoursite.com/robots.txt , crawlers check it before visiting anything else.',
      'Rules are grouped by User-agent (which bot the rule applies to, or * for all bots), followed by Allow/Disallow paths.',
      'It is a request, not a lock , well-behaved bots (Google, Bing) respect it, but nothing stops a script from ignoring it and fetching the page anyway. Never rely on it to hide private or sensitive pages.',
      'It can also point crawlers at your Sitemap (a list of your pages) so they discover content faster.',
      'In Next.js (App Router), you don’t hand-write the file , an app/robots.ts that exports a default function returning the rules is built into /robots.txt automatically at build time.'
    ],
    gotcha:
      'A single stray "Disallow: /" for User-agent: * blocks the entire site from every search engine , always double-check the file after deploying, since this mistake silently kills SEO with no error anywhere.',
    codeSnippet: `# Plain robots.txt
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml

// Next.js app/robots.ts (generates the file above)
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' } };
}`
  },

  // ─── DATABASES ────────────────────────────────────────────────────────────────
  {
    id: 'eng-sql-vs-nosql',
    title: 'SQL vs NoSQL',
    summary: 'Relational databases enforce structure and relationships; NoSQL trades that for flexibility and scale.',
    difficulty: 'intermediate',
    category: 'databases',
    keyPoints: [
      'SQL (Postgres, MySQL): fixed schema, tables + relations, powerful joins, strong consistency (ACID).',
      'NoSQL: document (MongoDB), key-value (Redis), wide-column (Cassandra), graph (Neo4j) , flexible schema.',
      'SQL suits structured, relational data and complex queries; NoSQL suits high write volume, flexible shapes, horizontal scale.',
      'ACID (consistency-first) vs BASE (availability-first) describes the trade-off.',
      'Many systems use both: a relational store for core data, Redis for caching/sessions.'
    ],
    gotcha:
      'NoSQL isn’t automatically "faster" , it scales writes by relaxing consistency and joins, so you often re-implement those in app code instead.',
    codeSnippet: `-- SQL: relational, joins
SELECT u.name, o.total FROM users u
JOIN orders o ON o.user_id = u.id;

// NoSQL (document): denormalized, embedded
{ name: 'Ada', orders: [{ total: 30 }] }`
  },
  {
    id: 'eng-db-indexing',
    title: 'Database Indexing & Query Optimization',
    summary: 'An index is a lookup structure that turns a full-table scan into a fast seek , at the cost of write speed.',
    difficulty: 'intermediate',
    category: 'databases',
    prerequisites: ['eng-sql-vs-nosql'],
    keyPoints: [
      'An index (usually a B-tree) lets the DB find rows by a column without scanning every row , O(log n) vs O(n).',
      'Index the columns you filter (WHERE), join, or sort (ORDER BY) on.',
      'Indexes speed reads but slow writes and use disk , every insert/update must maintain them.',
      'Use EXPLAIN to see whether a query uses an index or does a full scan.',
      'The N+1 query problem (one query per row in a loop) is a classic ORM performance killer , batch with a join or IN.'
    ],
    gotcha:
      'Indexing every column backfires , writes slow down and the planner may ignore redundant indexes. Index for your actual query patterns, then verify with EXPLAIN.',
    codeSnippet: `CREATE INDEX idx_users_email ON users(email);

-- check the plan
EXPLAIN SELECT * FROM users WHERE email = ?;
-- "Index Scan" good · "Seq Scan" on a big table = slow`
  },
  {
    id: 'eng-csv-bulk-import',
    title: 'Parsing a Large CSV and Loading It Into a Database',
    summary:
      'Never read the whole file into memory , stream it row by row, validate as you go, and insert in batches inside a transaction.',
    difficulty: 'intermediate',
    category: 'databases',
    prerequisites: ['eng-db-indexing', 'eng-idempotency'],
    keyPoints: [
      'Step 1, stream instead of load: fs.readFileSync or reading the whole upload into a string works fine for a small file, but a multi-gigabyte CSV will exhaust memory , open a readable stream and parse it incrementally (a streaming CSV parser like csv-parse or Papa Parse in streaming mode) so you only ever hold one row, or one small batch, in memory at a time.',
      'Step 2, validate and transform per row before it ever reaches the database: check required columns are present, coerce types (a CSV is always plain text, so "42" and "true" need explicit parsing), and reject or quarantine malformed rows into a separate error report rather than letting one bad row crash the whole import.',
      'Step 3, batch the inserts: inserting one row at a time means one round trip per row, which is dominated by network/transaction overhead at scale , buffer rows into batches (commonly 500 to 5,000 rows) and issue one multi-row INSERT (or a bulk-loading utility like PostgreSQs COPY) per batch instead.',
      'Step 4, wrap batches in a transaction, but not the WHOLE file in one transaction: one giant transaction for a 10-million-row file holds locks and an undo log for the entire duration and makes a late failure roll back everything already done , batch-per-transaction (commit every N rows) balances all-or-nothing safety per chunk against not losing all progress on a crash near the end.',
      'Step 5, make the import idempotent/resumable: track progress (e.g. the last successfully committed row number or batch id) somewhere durable, so re-running after a crash or a partial failure does not double-insert rows that already made it in , this is the same idempotency-key idea used for retried API requests, applied to a long-running job.',
      'For genuinely huge files (millions of rows), do the parse-and-insert as a background job (a queue worker), not inline in an HTTP request handler , the request just accepts the upload, kicks off the job, and returns immediately with a job id the client can poll for progress.'
    ],
    gotcha:
      'The classic mistake is JSON.parse(fs.readFileSync(file)).forEach(row => db.insert(row)) style code that reads the entire file into memory and then makes one database round trip per row , it works fine in a quick local test with 50 rows and then falls over in production with a 2GB file, both by exhausting memory on read and by taking hours doing one insert at a time. Streaming plus batched inserts fixes both problems at once.',
    codeSnippet: `import { parse } from 'csv-parse';
import fs from 'node:fs';

const BATCH_SIZE = 1000;
let batch = [];

fs.createReadStream('huge-import.csv')
  .pipe(parse({ columns: true, trim: true }))
  .on('data', async (row) => {
    batch.push(normalizeRow(row)); // validate/coerce types here
    if (batch.length >= BATCH_SIZE) {
      const toInsert = batch;
      batch = [];
      await db.bulkInsert('users', toInsert); // one multi-row INSERT, not 1000 single ones
    }
  })
  .on('end', async () => {
    if (batch.length) await db.bulkInsert('users', batch); // flush the final partial batch
  });`
  },

  // ─── SYSTEM DESIGN ──────────────────────────────────────────────────────────
  {
    id: 'eng-caching',
    title: 'Caching',
    summary: 'Store the result of expensive work close to where it’s needed so you don’t redo it.',
    difficulty: 'intermediate',
    category: 'system-design',
    prerequisites: ['eng-db-indexing'],
    keyPoints: [
      'Cache layers: browser, CDN (edge), application (in-memory/Redis), and database query cache.',
      'Cache-aside: app checks the cache, falls back to the DB on a miss, then stores the result.',
      'Invalidation is the hard part: TTL (expiry), or evict on write , stale data is the main risk.',
      'Eviction policies (LRU = least recently used) decide what to drop when the cache is full.',
      'A CDN caches static assets at edge locations near users for low latency.'
    ],
    gotcha:
      '“There are only two hard things in CS: cache invalidation and naming things.” Serving stale data after an update is the most common caching bug , plan invalidation up front.',
    codeSnippet: `// Cache-aside read
let user = await cache.get(key);
if (!user) {
  user = await db.getUser(id);
  await cache.set(key, user, { ttl: 60 });
}`
  },
  {
    id: 'eng-scaling',
    title: 'Scaling: Vertical vs Horizontal',
    summary: 'Scale up (a bigger machine) or scale out (more machines behind a load balancer).',
    difficulty: 'intermediate',
    category: 'system-design',
    prerequisites: ['eng-caching'],
    keyPoints: [
      'Vertical scaling: add CPU/RAM to one server , simple, but a hard ceiling and a single point of failure.',
      'Horizontal scaling: add more servers behind a load balancer , near-unlimited, but needs stateless services.',
      'Stateless app servers scale out easily; push session/state to a shared store (Redis) or the client (JWT).',
      'Load balancers distribute traffic and remove unhealthy nodes.',
      'Database scaling: read replicas for reads, sharding/partitioning for writes.'
    ],
    gotcha:
      'Storing session state in server memory blocks horizontal scaling , a user’s next request can hit a different node that doesn’t have their session. Keep app servers stateless.',
    codeSnippet: `// Stateless tier scales out:
//        ┌─ app-1 ─┐
// LB ────┼─ app-2 ─┼──► Redis (shared sessions)
//        └─ app-3 ─┘     Postgres (+ read replicas)`
  },
  {
    id: 'eng-microservices',
    title: 'Monolith vs Microservices',
    summary: 'One deployable app vs many small independently-deployable services , a trade-off, not an upgrade.',
    difficulty: 'advanced',
    category: 'system-design',
    prerequisites: ['eng-scaling'],
    keyPoints: [
      'Monolith: one codebase/deployment , simple to build, test, and deploy early on.',
      'Microservices: independent services per domain, each with its own deploy and often its own DB.',
      'Microservices buy independent scaling and team autonomy at the cost of network calls, distributed data, and ops complexity.',
      'They communicate via REST/gRPC (sync) or message queues/events (async).',
      'Most teams should start with a well-structured monolith and split out services only when a real need appears.'
    ],
    gotcha:
      'Microservices add distributed-systems problems (network failures, eventual consistency, tracing) , adopting them too early is a common over-engineering mistake.',
    codeSnippet: `// Monolith:   [ UI · Orders · Billing · Auth ]  one deploy
// Microservices:
//   [Orders]──http──>[Billing]
//        └──event──>[Notifications]   (separate deploys)`
  },

  // ─── VERSION CONTROL ──────────────────────────────────────────────────────────
  {
    id: 'eng-git-basics',
    title: 'Git & Branching Workflows',
    summary: 'Distributed version control: track history, branch cheaply, and merge work back together.',
    difficulty: 'basic',
    category: 'version-control',
    keyPoints: [
      'Git is distributed , every clone has the full history; commits are snapshots, not diffs.',
      'Branches are cheap pointers; feature branches isolate work until it’s reviewed and merged.',
      'merge keeps full history (a merge commit); rebase rewrites your commits onto the latest base for a linear history.',
      'Pull requests gate changes behind review and CI before merging to main.',
      'Trunk-based development (short-lived branches, merge often) avoids long, painful merges.'
    ],
    gotcha:
      'Never rebase or force-push a branch others have pulled , rewriting shared history forces everyone else into messy recovery. Rebase only your own un-pushed work.',
    codeSnippet: `git switch -c feature/login   # branch
git commit -m "add login"
git rebase main               # linear history (local only!)
git push -u origin feature/login  # open a PR`
  },

  // ─── PRACTICES ────────────────────────────────────────────────────────────────
  {
    id: 'eng-clean-code',
    title: 'Clean Code & Technical Debt',
    summary: 'Readable, well-named, small-unit code , and the deliberate trade-offs that create "debt".',
    difficulty: 'intermediate',
    category: 'practices',
    prerequisites: ['eng-solid'],
    keyPoints: [
      'Names should reveal intent; functions should do one thing and stay small.',
      'DRY (don’t repeat yourself) , but don’t abstract prematurely; some duplication is cheaper than the wrong abstraction.',
      'Technical debt: shortcuts taken for speed that cost interest later; track it and pay it down deliberately.',
      'Code is read far more than it’s written , optimise for the reader.',
      'Boy-scout rule: leave code a little cleaner than you found it.'
    ],
    gotcha:
      'Premature abstraction (DRYing up two things that only look similar) is as harmful as duplication , wait until the third occurrence before extracting.',
    codeSnippet: `// ❌ what is this?
function p(d) { return d.filter(x => x.a > 0); }

// ✅ intent-revealing
function activeUsers(users) {
  return users.filter(u => u.age > 0);
}`
  },
  {
    id: 'eng-cicd',
    title: 'CI/CD',
    summary: 'Automate building, testing, and deploying so changes ship safely and often.',
    difficulty: 'intermediate',
    category: 'practices',
    prerequisites: ['eng-git-basics'],
    keyPoints: [
      'Continuous Integration: every push triggers an automated build + test run, catching breakage early.',
      'Continuous Delivery: every passing change is automatically prepared for release (deploy is one click).',
      'Continuous Deployment: passing changes deploy to production automatically, no manual gate.',
      'A pipeline typically runs: lint → test → build → deploy, failing fast at each stage.',
      'Tools: GitHub Actions, GitLab CI, Jenkins, CircleCI.'
    ],
    gotcha: 'CI/CD is only as trustworthy as your tests , automating deployment on a weak test suite just ships bugs faster.',
    codeSnippet: `# .github/workflows/ci.yml (sketch)
on: [push]
jobs:
  build:
    steps:
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`
  },

  // ─── TESTING TYPES ──────────────────────────────────────────────────────────
  {
    id: 'test-pyramid',
    title: 'The Testing Pyramid',
    summary: 'Many fast unit tests at the base, fewer integration tests, a handful of slow end-to-end tests on top.',
    difficulty: 'basic',
    category: 'testing-types',
    keyPoints: [
      'Unit tests: one function/module in isolation , fast, numerous, pinpoint failures.',
      'Integration tests: several units together (e.g. service + DB) , fewer, catch wiring bugs.',
      'End-to-end (E2E): the whole app through the UI like a real user , slowest, fewest, most brittle.',
      'The pyramid shape (lots of unit, few E2E) keeps the suite fast and reliable.',
      'An inverted pyramid (mostly E2E) is slow and flaky , an "ice-cream cone" anti-pattern.'
    ],
    gotcha:
      'Over-relying on E2E tests gives slow, flaky suites that fail for environmental reasons , push coverage down to fast unit tests wherever possible.',
    codeSnippet: `//        /\\   E2E      (few, slow)
//       /  \\  Integration
//      /____\\ Unit       (many, fast)`
  },
  {
    id: 'test-functional-nonfunctional',
    title: 'Functional vs Non-Functional Testing',
    summary: 'Functional checks WHAT the system does; non-functional checks HOW WELL it does it.',
    difficulty: 'basic',
    category: 'testing-types',
    prerequisites: ['test-pyramid'],
    keyPoints: [
      'Functional: does the feature meet the requirement? (login works, form validates, checkout succeeds).',
      'Non-functional: performance, load, security, accessibility, usability , quality attributes.',
      'Black-box: test behaviour against the spec without seeing the code; White-box: test internal paths/branches.',
      'Regression testing: re-run existing tests to confirm a change didn’t break what used to work.',
      'Smoke testing: a quick "is it even alive?" pass before deeper testing.'
    ],
    codeSnippet: `// Functional:    expect(login('user','pw')).toBe(true)
// Performance:   p95 response time < 200ms under 1k RPS
// Accessibility: axe(page) reports 0 violations
// Security:      input is sanitized against XSS`
  },
  {
    id: 'test-cross-browser-perf',
    title: 'Cross-Browser, Performance & Accessibility Testing',
    summary: 'Web-specific non-functional testing: it works everywhere, stays fast under load, and is usable by everyone.',
    difficulty: 'intermediate',
    category: 'testing-types',
    prerequisites: ['test-functional-nonfunctional'],
    keyPoints: [
      'Cross-browser/responsive: verify across Chrome/Firefox/Safari and screen sizes (BrowserStack, Playwright).',
      'Performance/load: measure response time and throughput under expected and peak traffic (k6, JMeter, Lighthouse).',
      'Accessibility: automated WCAG checks (axe, Lighthouse) plus manual keyboard/screen-reader testing.',
      'Security: test for XSS, CSRF, injection, and broken auth (OWASP Top 10).',
      'These are non-functional , they test quality attributes, not features.'
    ],
    gotcha:
      'Automated a11y tools catch only ~30–50% of issues , they can’t judge whether focus order or alt text makes sense, so manual keyboard/screen-reader testing is still required.',
    codeSnippet: `// Lighthouse / axe-core in CI
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toEqual([]);`
  },

  // ─── TESTING AUTOMATION ───────────────────────────────────────────────────────
  {
    id: 'test-automation',
    title: 'Test Automation & Tools',
    summary: 'Automate repetitive tests so they run on every change , the foundation of CI and regression safety.',
    difficulty: 'intermediate',
    category: 'testing-automation',
    prerequisites: ['test-pyramid'],
    keyPoints: [
      'Unit/integration runners: Jest, Vitest, Mocha , assertions, mocking, coverage.',
      'E2E/browser automation: Playwright, Cypress, Selenium , drive a real browser.',
      'Automate stable, repetitive, high-value paths; keep exploratory/one-off checks manual.',
      'Good tests are independent, deterministic, and fast , flaky tests erode trust in the suite.',
      'Use test data builders/fixtures and reset state between tests to avoid order-dependence.'
    ],
    gotcha:
      'Flaky tests (pass/fail without code changes, often from timing or shared state) are worse than no test , people start ignoring red builds. Fix or quarantine them immediately.',
    codeSnippet: `// Jest unit test
test('adds', () => {
  expect(add(2, 3)).toBe(5);
});

// Playwright E2E
await page.goto('/login');
await page.getByLabel('Email').fill('a@b.com');
await expect(page).toHaveURL('/dashboard');`
  },
  {
    id: 'test-tdd',
    title: 'TDD & Mocking',
    summary: 'Test-Driven Development writes the test first; mocks isolate the unit from its dependencies.',
    difficulty: 'intermediate',
    category: 'testing-automation',
    prerequisites: ['test-automation'],
    keyPoints: [
      'TDD cycle: Red (write a failing test) → Green (make it pass simply) → Refactor (clean up).',
      'Writing tests first clarifies the API and guarantees the code is testable.',
      'Mocks/stubs/fakes replace real dependencies (network, DB, time) so a unit test stays fast and deterministic.',
      'Spies record how a function was called; fakes are lightweight working implementations.',
      'Don’t over-mock , testing against too many mocks can pass while the real integration is broken.'
    ],
    gotcha:
      'Mocking everything makes a test green while the real wiring is broken , mock external boundaries (network, time), not the very logic you’re trying to test.',
    codeSnippet: `// Red → Green → Refactor
test('formats price', () => {
  expect(formatPrice(5)).toBe('$5.00'); // fails first
});

// Mock the network boundary
jest.spyOn(api, 'getUser').mockResolvedValue({ id: 1 });`
  },
  {
    id: 'test-stlc',
    title: 'STLC & Coverage Metrics',
    summary: 'The Software Testing Life Cycle structures testing into phases; coverage metrics measure how much is exercised.',
    difficulty: 'intermediate',
    category: 'testing-automation',
    prerequisites: ['test-automation'],
    keyPoints: [
      'STLC phases: requirement analysis → test planning → test case design → environment setup → execution → closure.',
      'Code coverage: % of lines/branches/functions executed by tests , a guide, not a guarantee of quality.',
      '100% coverage can still miss bugs (it shows code ran, not that assertions were meaningful).',
      'Other metrics: defect density (bugs per KLOC), defect removal efficiency, pass/fail rate.',
      'Contract testing verifies two services agree on an API; mutation testing checks whether tests actually catch injected bugs.'
    ],
    gotcha:
      'Chasing 100% line coverage rewards tests that execute code without asserting anything , coverage measures reach, not correctness.',
    codeSnippet: `// branch coverage: are BOTH paths tested?
function fee(amount) {
  return amount > 100 ? 0 : 5;   // need a test for each branch
}`
  },

  // ─── ARCHITECTURE ─────────────────────────────────────────────────────────────
  {
    id: 'arch-design-patterns-creational',
    title: 'Design Patterns: Creational',
    summary: 'Reusable solutions for how objects get created , Singleton, Factory, Builder.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['eng-oop-principles'],
    keyPoints: [
      'Singleton: guarantees one shared instance (e.g. a config or DB connection pool).',
      'Factory Method: a method decides which concrete class to instantiate , callers ask for an interface, not a class.',
      'Abstract Factory: creates families of related objects without naming concretes.',
      'Builder: assembles a complex object step by step (avoids telescoping constructors).',
      'Patterns are a shared vocabulary , naming a solution communicates intent quickly.'
    ],
    gotcha:
      'Singletons act as global state, which makes code hard to test and reason about (hidden dependencies, ordering issues) , reach for dependency injection instead where you can.',
    codeSnippet: `// Factory: caller gets an interface, not a class
function createLogger(env) {
  return env === 'prod' ? new CloudLogger() : new ConsoleLogger();
}`
  },
  {
    id: 'arch-design-patterns-structural',
    title: 'Design Patterns: Structural',
    summary: 'Patterns for composing objects into larger structures , Adapter, Decorator, Facade, Proxy.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['arch-design-patterns-creational'],
    keyPoints: [
      'Adapter: wraps an incompatible interface so it matches what the client expects (a plug converter).',
      'Decorator: wraps an object to add behaviour without changing its class (e.g. adding logging/caching).',
      'Facade: a simple front over a complex subsystem.',
      'Proxy: a stand-in that controls access (lazy loading, access control, caching).',
      'These describe relationships between objects rather than how they’re created.'
    ],
    codeSnippet: `// Decorator: add behaviour by wrapping
const cached = withCache(withLogging(fetchUser));
// fetchUser stays unchanged; behaviour is layered on`
  },
  {
    id: 'arch-design-patterns-behavioral',
    title: 'Design Patterns: Behavioral',
    summary: 'Patterns for how objects communicate , Observer, Strategy, Command, Chain of Responsibility.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['arch-design-patterns-structural'],
    keyPoints: [
      'Observer: subjects notify subscribers of changes (the basis of event systems and reactivity).',
      'Strategy: swap an algorithm at runtime by passing in a function/object (e.g. different sort comparators).',
      'Command: wrap an action as an object so it can be queued, logged, or undone.',
      'Chain of Responsibility: pass a request along a chain until a handler deals with it (e.g. middleware).',
      'They decouple sender from receiver, making behaviour pluggable.'
    ],
    codeSnippet: `// Strategy: behaviour passed in
function sortBy(list, strategy) { return [...list].sort(strategy); }
sortBy(users, (a, b) => a.age - b.age);

// Chain of Responsibility = Express middleware`
  },
  {
    id: 'arch-dependency-injection',
    title: 'Dependency Injection',
    summary: 'Give an object its dependencies from outside instead of having it create them , for flexible, testable code.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['eng-solid'],
    keyPoints: [
      'Instead of a class instantiating its collaborators, they’re passed in (constructor, setter, or parameter).',
      'Decouples a class from concrete implementations , it depends on an interface it’s handed.',
      'Makes testing easy: inject a mock/fake instead of the real network or database.',
      'It’s the practical application of the Dependency Inversion principle (the "D" in SOLID).',
      'DI containers/frameworks automate wiring in large apps, but DI is a principle, not a library.'
    ],
    gotcha:
      'DI isn’t the same as a "DI framework" , passing a dependency as an argument IS dependency injection; you don’t need a container to do it.',
    codeSnippet: `// ❌ creates its own dependency , hard to test
class Service { db = new RealDatabase(); }

// ✅ injected — swap a mock in tests
class Service { constructor(private db: Database) {} }`
  },
  {
    id: 'arch-rest-graphql-grpc',
    title: 'REST vs GraphQL vs gRPC',
    summary: 'Three API styles with different trade-offs in flexibility, performance, and tooling.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['eng-rest-api'],
    keyPoints: [
      'REST: resource URLs + HTTP verbs; simple, cacheable, ubiquitous , but can over/under-fetch and need many round-trips.',
      'GraphQL: one endpoint, the client asks for exactly the fields it needs , solves over-fetching; caching and rate-limiting are harder.',
      'gRPC: binary (Protobuf) over HTTP/2, strongly typed, very fast , great for service-to-service, weaker browser support.',
      'GraphQL shines for rich frontends aggregating many sources; gRPC for internal microservice calls.',
      'Choice is about fit: client needs, performance, caching, and team familiarity.'
    ],
    gotcha:
      'GraphQL’s flexibility moves complexity to the server: a single deep query can be expensive, so you need query-cost limits and dataloaders to avoid N+1 fan-out.',
    codeSnippet: `# GraphQL: client picks the shape
query { user(id: 1) { name orders { total } } }

// REST equivalent often needs 2 calls:
// GET /users/1  then  GET /users/1/orders`
  },
  {
    id: 'arch-event-driven',
    title: 'Event-Driven Architecture & Message Queues',
    summary: 'Services communicate by emitting and reacting to events through a queue/broker instead of calling each other directly.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['eng-microservices'],
    keyPoints: [
      'Producers publish events to a broker (Kafka, RabbitMQ, SQS); consumers subscribe and react asynchronously.',
      'Decouples services: the producer doesn’t know or wait for consumers , better resilience and scalability.',
      'A queue buffers load spikes and lets slow consumers catch up (back-pressure).',
      'Enables fan-out: one event (OrderPlaced) triggers many independent reactions (email, inventory, analytics).',
      'Trade-off: harder to trace/debug, and you must handle duplicate/out-of-order delivery (idempotent consumers).'
    ],
    gotcha:
      'Most brokers guarantee "at-least-once" delivery, so the same event can arrive twice , consumers must be idempotent or you’ll double-process.',
    codeSnippet: `// Producer doesn't wait on consumers
broker.publish('OrderPlaced', { orderId });

// Independent consumers react
on('OrderPlaced', sendConfirmationEmail);
on('OrderPlaced', decrementInventory);`
  },
  {
    id: 'arch-high-availability',
    title: 'High Availability & Resilience',
    summary: 'Design so the system keeps working despite failures , through redundancy, failover, and graceful degradation.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['eng-scaling'],
    keyPoints: [
      'Availability is measured in "nines" (99.9% ≈ 8.7h downtime/year); HA means no single point of failure.',
      'Redundancy + failover: replicas across availability zones; if one dies, traffic shifts automatically.',
      'Graceful degradation: shed non-essential features under stress rather than crashing entirely.',
      'Circuit breaker: stop calling a failing dependency for a while so it can recover and you fail fast.',
      'Chaos engineering: deliberately inject failures in production-like environments to find weaknesses first.'
    ],
    gotcha:
      'Retrying a failing service without a circuit breaker amplifies the outage (a retry storm) , back off and trip the breaker instead of hammering a struggling dependency.',
    codeSnippet: `// Circuit breaker states
// CLOSED  → calls flow normally
// OPEN    → fail fast, don't call (give it time)
// HALF-OPEN → allow a trial call to test recovery`
  },
  {
    id: 'arch-load-balancing',
    title: 'Load Balancing',
    summary: 'Distribute incoming traffic across multiple servers for scale, redundancy, and even utilisation.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['eng-scaling'],
    keyPoints: [
      'A load balancer spreads requests across a pool of servers and removes unhealthy nodes via health checks.',
      'Algorithms: round-robin, least-connections, IP-hash (sticky sessions), weighted.',
      'L4 (transport) balances by IP/port; L7 (application) can route by URL path, header, or cookie.',
      'Enables horizontal scaling and zero-downtime deploys (drain a node, deploy, re-add).',
      'Prefer stateless servers so any node can serve any request (no sticky-session requirement).'
    ],
    gotcha:
      'Sticky sessions (pinning a user to one server) undermine load balancing and break when that node dies , store session state in a shared store so any node can handle any request.',
    codeSnippet: `//          ┌─ server A ─┐
// client → LB ─ server B ─┤  (health-checked)
//          └─ server C ─┘
// algorithm: round-robin | least-connections | ip-hash`
  },
  {
    id: 'arch-db-replication-sharding',
    title: 'Database Replication & Sharding',
    summary: 'Scale databases by copying data (replication) for reads and splitting it (sharding) for writes.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['eng-sql-vs-nosql', 'eng-scaling'],
    keyPoints: [
      'Replication: copy data to replicas. Reads spread across replicas; writes go to the primary (read scaling + redundancy).',
      'Replication lag means replicas can briefly serve stale data (eventual consistency).',
      'Sharding/partitioning: split data across nodes by a shard key (e.g. user_id) so each holds a subset , scales writes.',
      'A bad shard key creates "hot" shards that take disproportionate load.',
      'Cross-shard queries and transactions are expensive , design access patterns around the shard key.'
    ],
    gotcha:
      'Reading your own write from a replica can show stale data due to replication lag , route read-after-write to the primary, or use a session-consistency guarantee.',
    codeSnippet: `// Replication: 1 primary (writes) + N replicas (reads)
//   write → primary ──replicate──> replica1, replica2 (reads)

// Sharding by user_id:
//   users 0–9999  → shard A
//   users 10000+  → shard B`
  },
  {
    id: 'arch-cqrs-event-sourcing',
    title: 'CQRS & Event Sourcing',
    summary: 'CQRS separates read and write models; event sourcing stores changes as an append-only log of events.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['arch-event-driven'],
    keyPoints: [
      'CQRS (Command Query Responsibility Segregation): separate the write model (commands) from the read model (queries), each optimised independently.',
      'Reads can use denormalized views/replicas; writes enforce business rules , they scale separately.',
      'Event sourcing: instead of storing current state, store every state-changing event; current state is a replay of events.',
      'Benefits: full audit log, time-travel/debugging, and rebuildable read models.',
      'They’re often paired but independent , CQRS doesn’t require event sourcing and vice versa.'
    ],
    gotcha:
      'CQRS and event sourcing add real complexity (eventual consistency between write and read sides, event versioning) , they’re justified for complex domains, overkill for simple CRUD apps.',
    codeSnippet: `// Event sourcing: state = fold over events
[ AccountOpened, Deposited(100), Withdrew(30) ]
// → balance 70 (replay the log)`
  },
  {
    id: 'arch-cloud-native',
    title: 'Cloud-Native: Containers & Serverless',
    summary: 'Package apps as portable containers or run them as on-demand functions managed by the cloud.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['eng-microservices'],
    keyPoints: [
      'Containers (Docker): bundle app + dependencies into a portable image that runs the same everywhere.',
      'Orchestration (Kubernetes): schedules, scales, heals, and networks containers across a cluster.',
      'Serverless (Lambda/Cloud Functions): run code per request, auto-scaled to zero , pay only for execution.',
      'Serverless trades control and cold-start latency for zero ops and fine-grained scaling.',
      'Managed services (queues, DBs, auth) reduce undifferentiated heavy lifting.'
    ],
    gotcha:
      'Serverless cold starts add latency when a function hasn’t run recently, and per-request pricing can exceed a always-on server at high, steady traffic , match the model to the workload.',
    codeSnippet: `// Container: same image dev → prod
// Dockerfile → image → run anywhere

// Serverless: just the handler, cloud runs it
export async function handler(event) { return respond(event); }`
  },
  {
    id: 'arch-serverless',
    title: 'Serverless, in Depth',
    summary:
      'You ship a function, not a server , the cloud provider handles provisioning, scaling to zero, and scaling up, and you pay per invocation instead of per hour.',
    difficulty: 'intermediate',
    category: 'architecture',
    prerequisites: ['arch-cloud-native'],
    keyPoints: [
      'The core deal: you write a function (a "handler") that responds to an event, an HTTP request, a queue message, a file upload, and upload just that code. There is no server to patch, size, or keep running , the provider (AWS Lambda, Vercel Functions, Cloudflare Workers) starts an instance of your function on demand and tears it down when idle.',
      '"Serverless" does not mean no servers, it means the server is not YOUR problem. Provisioning, OS patching, and capacity planning move to the cloud provider , what you give up in exchange is control over the runtime environment and long-lived in-memory state.',
      'Scaling is automatic and near-instant in both directions: zero traffic costs nothing (the function simply is not running), and a sudden spike gets many parallel instances spun up by the platform, without you configuring an auto-scaling group.',
      'The cold start trade-off: a function that has not run recently needs a fresh instance spun up, code loaded, and (for some runtimes) a VM initialised before it can handle the first request , this adds noticeable latency (tens to hundreds of milliseconds, more for heavier runtimes) that a warm, already-running server does not pay.',
      'Functions are meant to be stateless and short-lived , anything that must persist between invocations (a database connection pool, a user session, a long computation) has to live in an external service (a managed database, Redis, a queue), not in the function’s own memory, because the next invocation may run on a completely different, fresh instance.',
      'Cost model flips from "pay for a server whether it is busy or not" to "pay per invocation and execution time" , this is cheap for spiky or low-traffic workloads and can become MORE expensive than a modest always-on server once traffic is high and constant, because you are paying a per-request premium on every single one.'
    ],
    gotcha:
      'Treating a serverless function like a regular long-running server, keeping a database connection open in module scope and expecting it to persist, is a common production bug , the platform can freeze, reuse, or completely discard an instance between invocations, so connections silently go stale or you end up opening far more connections than the database can handle, one per concurrent cold instance. Use a connection pooler designed for serverless (e.g. PgBouncer-style pooling, or a provider-managed pooled connection string) instead of assuming one persistent connection.',
    codeSnippet: `// A serverless function: stateless, event-in / response-out
export async function handler(event) {
  const db = await getPooledConnection(); // pooled, not a long-lived module-level connection
  const user = await db.query('SELECT * FROM users WHERE id = ?', [event.userId]);
  return { statusCode: 200, body: JSON.stringify(user) };
}
// Between invocations: no guarantee this same instance, or its memory, still exists.`
  },
  {
    id: 'arch-modular-monolith',
    title: 'Modular Monolith',
    summary:
      'One deployable app, like a monolith, but internally split into strict, independent modules with enforced boundaries , most of microservices discipline without the network.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['eng-microservices'],
    keyPoints: [
      'A modular monolith is still ONE codebase and ONE deployment, exactly like a plain monolith , the difference is internal, the code is organised into clearly bounded modules (e.g. Orders, Billing, Inventory) that each own their own data and logic and only talk to each other through explicit, defined interfaces.',
      'It sits deliberately between a tangled "big ball of mud" monolith and microservices: you get most of the team-autonomy and clear-ownership benefits of microservices (each module is owned by one team, changes are contained) without paying the network calls, distributed data, and operational overhead of running many separate services.',
      'Boundaries are enforced in-process rather than over a network , a module cannot reach into another modules database tables or internal functions directly, it must go through that modules public interface, the same discipline as a microservice API but called as a normal function, not an HTTP request.',
      'This gets you a genuinely useful property: because module boundaries were already respected as if they were service boundaries, splitting a module out into its own real microservice later, if and when it actually needs independent scaling or deployment, is a much smaller, more mechanical change than untangling a traditionally-organised monolith would be.',
      'The trade-off compared to plain "everything is one big pile" monolith is upfront discipline: you have to actively design and enforce the module boundaries (often with lint rules, a dependency-cruiser-style tool, or separate packages in a monorepo) rather than letting anything import anything, which is more design effort early on for a payoff that only shows up as the codebase grows.',
      'It is increasingly the recommended DEFAULT starting point for new products precisely because of the "microservices adopted too early" trap , you get a simpler single deployment and single database transaction model now, while keeping the door open to split out a genuinely hot module later without a rewrite.'
    ],
    gotcha:
      'A "modular monolith" that only exists as a folder structure, without any actual enforcement, tends to decay back into a normal tangled monolith within a few months, because nothing stops one module quietly importing another modules internals or reaching into its database table directly under time pressure. The modularity only holds if boundary violations are caught automatically (build-time lint rules, separate packages, or a dependency-graph check in CI), not just by convention and code review discipline alone.',
    codeSnippet: `// Modular monolith: one deploy, enforced internal boundaries
// src/modules/orders/     (owns its own tables, exposes only this:)
export function placeOrder(input) { /* ... */ }

// src/modules/billing/    (cannot import orders' internals directly)
import { placeOrder } from '@/modules/orders'; // ✅ via the public interface
// import { ordersTable } from '@/modules/orders/db'; // ❌ blocked by lint/dependency rule

// Later, if Orders needs independent scaling:
// its enforced boundary means extracting it into a real microservice
// is a deployment change, not a rewrite of tangled imports.`
  },
  {
    id: 'arch-cap-consistency',
    title: 'The CAP Theorem',
    summary: 'In a distributed system facing a network partition, you must trade consistency for availability.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['arch-db-replication-sharding'],
    keyPoints: [
      'CAP: Consistency, Availability, Partition tolerance , you can’t fully have all three at once.',
      'Networks partition in practice, so the real choice under a partition is Consistency vs Availability.',
      'CP systems (e.g. traditional RDBMS): reject requests rather than serve stale/inconsistent data.',
      'AP systems (e.g. Dynamo/Cassandra): stay available and reconcile later (eventual consistency).',
      'Most real systems tune per-operation rather than being purely CP or AP.'
    ],
    gotcha:
      'CAP is about behaviour during a partition, not all the time , when the network is healthy you can have both consistency and availability.',
    codeSnippet: `// During a network partition, choose:
//   CP → refuse the request (stay consistent)
//   AP → answer with possibly-stale data (stay available)`
  },
  {
    id: 'eng-rate-limiting-algorithms',
    title: 'Rate Limiting Algorithms',
    summary:
      'Four standard ways to cap how many requests a client can make , each trades off burst tolerance, boundary accuracy, and memory cost differently.',
    difficulty: 'advanced',
    category: 'system-design',
    prerequisites: ['eng-scaling'],
    keyPoints: [
      'Fixed window counter: count requests in a fixed interval (e.g. per 60s), reject once the cap is hit. Simple, but a burst right at the boundary between two windows can let through nearly double the intended rate.',
      'Sliding window log: store a timestamp per request and count how many fall in the last N seconds. Perfectly accurate, but storing a timestamp per request gets expensive at high volume.',
      'Sliding window counter: approximate the sliding log by weighting the previous fixed window’s count proportionally into the current one , most of the accuracy of the log, close to the memory cost of the fixed counter, the usual production choice.',
      'Token bucket: a bucket refills with tokens at a steady rate up to a cap; each request consumes one token, and requests are rejected when the bucket is empty. Naturally allows short bursts up to the bucket size while enforcing a steady average rate.',
      'Leaky bucket: requests queue up and are processed (leak out) at a fixed rate, smoothing bursty traffic into a steady stream , good for protecting a downstream system that can’t handle spikes, at the cost of added latency for queued requests.'
    ],
    gotcha:
      'The fixed window counter’s boundary problem is a classic interview follow-up: a client sending its full quota at 0:59 and again at 1:01 gets through 2x the intended rate within 2 seconds, because each burst lands in a different "fixed" window.',
    codeSnippet: `// Token bucket sketch
class TokenBucket {
  tokens: number;
  constructor(private capacity: number, private refillPerSec: number) {
    this.tokens = capacity;
  }
  tryConsume() {
    if (this.tokens > 0) { this.tokens--; return true; } // allowed
    return false; // rate-limited
  }
  // a timer/interval adds refillPerSec tokens each second, capped at capacity
}`
  },
  {
    id: 'eng-consistent-hashing',
    title: 'Consistent Hashing',
    summary:
      'A hashing scheme that keeps most keys in place when nodes are added or removed , simple hash(key) % N reshuffles nearly everything.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['arch-db-replication-sharding'],
    keyPoints: [
      'The problem with plain hash(key) % N sharding: changing N (adding or removing a node) changes the result for almost every key, forcing a massive, expensive remap/rebalance across the whole cluster.',
      'Consistent hashing places both nodes and keys on a conceptual ring (hash values 0…max wrapping back to 0) , a key belongs to the first node found going clockwise from its position.',
      'Adding or removing one node only affects the keys between it and its clockwise neighbour , on average just a 1/N slice of the keyspace moves, not everything.',
      'Virtual nodes: give each physical server many positions on the ring (not just one) so load spreads evenly even with few real nodes , without them, one unlucky node placement can take a disproportionate share of the keyspace.',
      'Used by Cassandra, DynamoDB, and CDNs like Akamai for exactly this reason , it lets a cluster scale up/down without a full data reshuffle.'
    ],
    gotcha:
      'Consistent hashing without virtual nodes can still land unevenly , a handful of real servers randomly placed on the ring might end up with wildly different key-share sizes purely by chance. Virtual nodes fix this by averaging out the placement randomness.',
    codeSnippet: `// Plain modulo sharding: adding a node remaps ~everything
shard = hash(key) % N;   // N changes → almost every key's shard changes

// Consistent hashing: adding a node only remaps the slice
// between it and its clockwise neighbor on the ring
shard = ring.nodeClockwiseFrom(hash(key));`
  },
  {
    id: 'eng-race-conditions-concurrency',
    title: 'Race Conditions & Concurrency Control',
    summary:
      'A race condition happens when the outcome depends on timing between concurrent operations , locks and atomic operations exist to prevent it.',
    difficulty: 'advanced',
    category: 'fundamentals',
    prerequisites: ['eng-data-structures'],
    keyPoints: [
      'A race condition occurs when two or more operations access shared state concurrently and the final result depends on the unpredictable order they happen to run in , classic example: two requests both read a counter as 5, both increment locally, both write back 6, losing an update.',
      'A mutex (mutual exclusion lock) lets only one thread/process hold it at a time , others block until it’s released, serializing access to the shared resource.',
      'A semaphore is a generalized lock that allows up to N holders at once (a mutex is just a semaphore with N=1) , useful for capping concurrent access to a limited resource pool (e.g. N DB connections).',
      'A deadlock happens when two or more processes each hold a lock the other needs and neither will release theirs , they wait on each other forever. The classic fix is a consistent lock-acquisition order across the whole codebase.',
      'In distributed systems (multiple processes/machines, not just threads), a distributed lock (often backed by Redis or Zookeeper) coordinates access across machines , the same race-condition problem, at a larger scale.'
    ],
    gotcha:
      'JavaScript’s single-threaded event loop doesn’t have thread-level races, but it absolutely has async races , two overlapping async operations that both read-then-write the same state (e.g. two API calls both doing "read balance, then write balance - amount") can still lose an update exactly like a classic race condition. The fix is the same idea: an atomic operation (a DB’s `UPDATE ... SET balance = balance - ?`) instead of a separate read-then-write.',
    codeSnippet: `// ❌ race condition: read-then-write isn't atomic
const balance = await db.getBalance(userId);
await db.setBalance(userId, balance - amount); // another request could interleave here

// ✅ atomic update — the database does the read+write as one operation
await db.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, userId]);`
  },
  {
    id: 'eng-authn-vs-authz',
    title: 'Authentication vs Authorization',
    summary:
      'Authentication proves who you are; authorization decides what you’re allowed to do , two distinct steps, often confused as one.',
    difficulty: 'basic',
    category: 'apis',
    prerequisites: ['eng-rest-api'],
    keyPoints: [
      'Authentication (authn) answers "who are you?" , logging in with a password, a valid JWT, an API key, or an OAuth token all prove identity.',
      'Authorization (authz) answers "what are you allowed to do?" , it runs AFTER authentication succeeds, checking the now-known identity against permissions/roles for the specific action requested.',
      'A request can be authenticated but still unauthorized , a logged-in user is definitely who they say they are, but might still get a 403 trying to access another user’s data or an admin-only route.',
      'Common authz models: role-based access control (RBAC , permissions attached to roles like "admin"/"editor"), and attribute/policy-based access control (ABAC , permissions computed from attributes of the user, resource, and context).',
      'HTTP status codes map to the distinction: 401 Unauthorized actually means "not authenticated" (no/invalid credentials); 403 Forbidden means "authenticated, but not allowed" , a frequently misused pair of codes.'
    ],
    gotcha:
      'The HTTP status code names are famously backwards from what they sound like , 401 is really about missing/bad authentication, not "not authorized." Using 403 when credentials are simply missing (should be 401) is a common API design mistake.',
    codeSnippet: `// Authentication: who is this? (runs first, e.g. as middleware)
function authenticate(req, res, next) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  req.user = user;
  next();
}

// Authorization: are they allowed to do THIS? (runs after, per-route)
function requireRole(role) {
  return (req, res, next) =>
    req.user.role === role ? next() : res.status(403).json({ error: 'Forbidden' });
}

app.delete('/users/:id', authenticate, requireRole('admin'), deleteUser);`
  }
];
