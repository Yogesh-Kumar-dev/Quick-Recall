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

  // ─── SYSTEM DESIGN ──────────────────────────────────────────────────────────
  {
    id: 'eng-caching',
    title: 'Caching',
    summary: 'Store the result of expensive work close to where it’s needed so you don’t redo it.',
    difficulty: 'intermediate',
    category: 'system-design',
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
    id: 'arch-cap-consistency',
    title: 'The CAP Theorem',
    summary: 'In a distributed system facing a network partition, you must trade consistency for availability.',
    difficulty: 'advanced',
    category: 'architecture',
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
  }
];
