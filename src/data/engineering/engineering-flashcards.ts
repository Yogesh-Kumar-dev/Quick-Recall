import type { Flashcard } from '@/types/content';

// ─── Engineering Essentials flashcards (engineering + testing) ────────────────

export const engineeringFlashcards: Flashcard[] = [
  {
    id: 'eng-compiler-interpreter',
    front: 'Compiler vs interpreter',
    back: 'Compiler translates the whole program to machine code before running (errors at compile time). Interpreter runs line by line at runtime. Modern JS engines JIT-compile hot paths , a hybrid.',
    category: 'Q&A'
  },
  {
    id: 'eng-big-o',
    front: 'What is Big-O notation?',
    back: 'How an algorithm’s cost grows with input size, ignoring constants. Order: O(1) < O(log n) < O(n) < O(n log n) < O(n²). Describes scaling, not absolute speed.',
    category: 'Q&A'
  },
  {
    id: 'eng-oop-pillars',
    front: 'Four pillars of OOP',
    back: 'Encapsulation (bundle + hide data), Abstraction (expose only essentials), Inheritance (extend a parent), Polymorphism (one interface, many implementations).',
    category: 'Q&A'
  },
  {
    id: 'eng-solid',
    front: 'SOLID principles',
    back: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion , guidelines for maintainable, testable OO code.',
    category: 'Keyword'
  },
  {
    id: 'eng-composition-inheritance',
    front: 'Composition over inheritance',
    back: 'Prefer building behaviour by combining small parts (has-a) over deep class hierarchies (is-a). Inheritance tightly couples subclasses to parents and gets rigid.',
    category: 'Q&A'
  },
  {
    id: 'eng-rest',
    front: 'What makes an API RESTful?',
    back: 'Resources as URLs (nouns), HTTP verbs as actions (GET/POST/PUT/DELETE), status codes for outcomes, and stateless requests (each carries its own auth/context).',
    category: 'Q&A'
  },
  {
    id: 'eng-idempotency',
    front: 'Idempotent HTTP methods',
    back: 'GET, PUT, DELETE , running them repeatedly leaves the same state, so retries are safe. POST is not idempotent (usually creates each time); use an idempotency key to make it safe.',
    category: 'Q&A'
  },
  {
    id: 'eng-sql-nosql',
    front: 'SQL vs NoSQL',
    back: 'SQL: fixed schema, relations, joins, strong consistency (ACID). NoSQL: flexible schema (document/key-value/graph), horizontal scale, BASE. NoSQL trades joins/consistency for scale.',
    category: 'Q&A'
  },
  {
    id: 'eng-index',
    front: 'What does a database index do?',
    back: 'A lookup structure (usually a B-tree) that turns a full-table scan (O(n)) into a fast seek (O(log n)) for the indexed column. Speeds reads, slows writes , index your query patterns.',
    category: 'Q&A'
  },
  {
    id: 'eng-csv-bulk-import',
    front: 'How do you import a huge CSV into a database?',
    back: 'Stream the file row by row (never load it all into memory), validate/coerce each row, buffer rows into batches and insert with one multi-row query per batch, commit per batch not one giant transaction, and track progress so a crash can resume without duplicating rows.',
    code: `fs.createReadStream('huge.csv')
  .pipe(parse({ columns: true }))
  .on('data', (row) => {
    batch.push(normalize(row)); // coerce strings to real types, e.g. "42" -> 42
    if (batch.length >= 1000) flush(batch.splice(0)); // one bulk INSERT per 1000 rows
  })
  .on('end', () => flush(batch)); // flush the final partial batch`,
    category: 'Q&A'
  },
  {
    id: 'eng-robots-txt',
    front: 'What is robots.txt for?',
    back: 'A text file at /robots.txt telling search-engine crawlers which paths they may or may not visit. Well-behaved bots respect it, but it is not a security control , don’t use it to hide private pages.',
    category: 'Q&A'
  },
  {
    id: 'eng-pagination',
    front: 'Offset vs cursor pagination',
    back: 'Offset (LIMIT/OFFSET) skips N rows, simple but slows down at depth and can skip/duplicate rows when data changes. Cursor pagination asks for "next after this id", stays fast via an index and stable against inserts/deletes , the default for live feeds.',
    code: `// Offset: DB still scans + discards 10,000 rows first
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

// Cursor: jumps straight in via the index
SELECT * FROM posts WHERE id < :lastSeenId
ORDER BY id DESC LIMIT 20;`,
    category: 'Q&A'
  },
  {
    id: 'eng-n-plus-1',
    front: 'The N+1 query problem',
    back: 'Running one query per item in a loop (1 to list them + N to fetch each detail) instead of a single join/IN query. A common ORM performance killer.',
    category: 'Q&A'
  },
  {
    id: 'eng-caching',
    front: 'Cache-aside pattern',
    back: 'App checks the cache first; on a miss it reads the DB, then stores the result. The hard part is invalidation , stale data after a write is the classic caching bug.',
    category: 'Q&A'
  },
  {
    id: 'eng-scaling',
    front: 'Vertical vs horizontal scaling',
    back: 'Vertical = a bigger machine (simple, has a ceiling). Horizontal = more machines behind a load balancer (near-unlimited, needs stateless services). Keep app servers stateless to scale out.',
    category: 'Q&A'
  },
  {
    id: 'eng-microservices',
    front: 'Monolith vs microservices',
    back: 'Monolith: one deployable app (simple early). Microservices: independent per-domain services (independent scaling/teams) at the cost of network calls, distributed data, and ops. Start monolith.',
    category: 'Q&A'
  },
  {
    id: 'arch-modular-monolith',
    front: 'What is a modular monolith?',
    back: 'One deployment, like a monolith, but split internally into strict modules with enforced boundaries and no reaching into another module’s data. Gets most microservices benefits (clear ownership) without the network/ops cost, and makes splitting a module out later much easier.',
    code: `// modules/orders/index.ts — the ONLY thing other modules may import
export function placeOrder(input) { /* ... */ }

// modules/billing/index.ts
import { placeOrder } from '@/modules/orders';        // ✅ public interface
// import { ordersTable } from '@/modules/orders/db'; // ❌ blocked by lint rule`,
    category: 'Q&A'
  },
  {
    id: 'arch-serverless',
    front: 'What is serverless?',
    back: 'You ship a function that the cloud runs on demand and scales to zero when idle, no server to provision or patch. Trades control and cold-start latency for pay-per-invocation pricing and automatic scaling , keep functions stateless, use pooled DB connections.',
    code: `export async function handler(event) {
  const db = await getPooledConnection(); // never a long-lived module-level connection
  return { statusCode: 200, body: await db.query(event) };
}`,
    category: 'Q&A'
  },
  {
    id: 'eng-merge-rebase',
    front: 'git merge vs rebase',
    back: 'merge joins branches with a merge commit (keeps full history). rebase replays your commits onto the latest base (linear history). Never rebase shared/pushed branches.',
    category: 'Q&A'
  },
  {
    id: 'eng-cicd',
    front: 'CI vs CD',
    back: 'CI: every push auto-builds + tests. Continuous Delivery: every passing change is release-ready (one-click deploy). Continuous Deployment: passing changes deploy to prod automatically.',
    category: 'Q&A'
  },
  {
    id: 'eng-tech-debt',
    front: 'Technical debt',
    back: 'Shortcuts taken for short-term speed that cost "interest" (slower future work) later. Track it and pay it down deliberately rather than letting it compound.',
    category: 'Keyword'
  },
  // ── Testing ──
  {
    id: 'test-pyramid',
    front: 'The testing pyramid',
    back: 'Many fast unit tests at the base, fewer integration tests, a few slow E2E tests on top. Keeps suites fast and reliable. Mostly-E2E (inverted) is slow and flaky.',
    category: 'Q&A'
  },
  {
    id: 'test-functional-nonfunctional',
    front: 'Functional vs non-functional testing',
    back: 'Functional: does it do WHAT it should (feature meets requirement)? Non-functional: how WELL , performance, load, security, accessibility, usability.',
    category: 'Q&A'
  },
  {
    id: 'test-black-white-box',
    front: 'Black-box vs white-box testing',
    back: 'Black-box: test behaviour against the spec without seeing the code. White-box: test internal paths/branches with knowledge of the implementation.',
    category: 'Q&A'
  },
  {
    id: 'test-unit-integration-e2e',
    front: 'Unit vs integration vs E2E',
    back: 'Unit: one module in isolation (fast). Integration: several units together, e.g. service + DB. E2E: whole app through the UI like a real user (slow, brittle).',
    category: 'Q&A'
  },
  {
    id: 'test-regression',
    front: 'Regression vs smoke testing',
    back: 'Regression: re-run existing tests to confirm a change didn’t break working features. Smoke: a quick "is it alive?" sanity pass before deeper testing.',
    category: 'Q&A'
  },
  {
    id: 'test-tdd',
    front: 'TDD (Test-Driven Development)',
    back: 'Red → Green → Refactor: write a failing test, make it pass simply, then clean up. Writing tests first clarifies the API and guarantees testable code.',
    category: 'Q&A'
  },
  {
    id: 'test-mock',
    front: 'Mock vs stub vs spy',
    back: 'All replace real dependencies. Stub: returns canned values. Mock: a stub with expectations on how it’s called. Spy: records calls to a real (or fake) function.',
    category: 'Q&A'
  },
  {
    id: 'test-flaky',
    front: 'Flaky test',
    back: 'A test that passes/fails without code changes , usually timing or shared state. Worse than no test because people start ignoring red builds. Fix or quarantine immediately.',
    category: 'Keyword'
  },
  {
    id: 'test-stlc',
    front: 'STLC + code coverage',
    back: 'STLC phases: requirements → planning → case design → setup → execution → closure. Coverage = % of code run by tests , a guide, not proof of correctness (100% can still miss bugs).',
    category: 'Q&A'
  },
  // ── Architecture ──
  {
    id: 'arch-pattern-categories',
    front: 'Three categories of design patterns',
    back: 'Creational (object creation: Singleton, Factory, Builder), Structural (composition: Adapter, Decorator, Facade, Proxy), Behavioral (communication: Observer, Strategy, Command).',
    category: 'Q&A'
  },
  {
    id: 'arch-singleton',
    front: 'Singleton , and the catch',
    back: 'Guarantees one shared instance (config, connection pool). The catch: it’s global state, which hides dependencies and makes testing hard , prefer dependency injection.',
    category: 'Q&A'
  },
  {
    id: 'arch-observer',
    front: 'Observer vs Strategy pattern',
    back: 'Observer: subjects notify subscribers of changes (event systems). Strategy: swap an algorithm at runtime by passing in a function/object (e.g. sort comparators).',
    category: 'Q&A'
  },
  {
    id: 'arch-di',
    front: 'Dependency Injection',
    back: 'Pass a class its dependencies from outside instead of creating them inside. Decouples from concretes, makes testing easy (inject mocks). The "D" in SOLID. Passing an arg IS DI , no framework needed.',
    category: 'Q&A'
  },
  {
    id: 'arch-rest-graphql-grpc',
    front: 'REST vs GraphQL vs gRPC',
    back: 'REST: resource URLs, simple, cacheable, can over-fetch. GraphQL: one endpoint, client picks fields (fixes over-fetch). gRPC: binary/typed/fast over HTTP/2, best service-to-service.',
    category: 'Q&A'
  },
  {
    id: 'arch-event-driven',
    front: 'Event-driven architecture',
    back: 'Services emit events to a broker (Kafka/RabbitMQ); consumers react asynchronously. Decouples producers from consumers, buffers load, enables fan-out. Consumers must be idempotent (at-least-once delivery).',
    category: 'Q&A'
  },
  {
    id: 'arch-high-availability',
    front: 'High availability , how?',
    back: 'No single point of failure: redundancy + automatic failover across zones, graceful degradation under stress, circuit breakers to fail fast, and chaos engineering to find weaknesses early.',
    category: 'Q&A'
  },
  {
    id: 'arch-circuit-breaker',
    front: 'Circuit breaker pattern',
    back: 'Stop calling a failing dependency for a while so it can recover and you fail fast. States: CLOSED (normal) → OPEN (fail fast) → HALF-OPEN (trial call). Prevents retry storms.',
    category: 'Keyword'
  },
  {
    id: 'arch-load-balancing',
    front: 'Load balancing',
    back: 'Distribute traffic across servers via round-robin / least-connections / ip-hash, removing unhealthy nodes via health checks. Enables horizontal scaling. Keep servers stateless (avoid sticky sessions).',
    category: 'Q&A'
  },
  {
    id: 'arch-replication-sharding',
    front: 'Replication vs sharding',
    back: 'Replication: copy data to replicas , scales reads + redundancy (but replication lag → stale reads). Sharding: split data by a key across nodes , scales writes (but cross-shard queries are costly).',
    category: 'Q&A'
  },
  {
    id: 'arch-cqrs',
    front: 'CQRS & event sourcing',
    back: 'CQRS: separate read and write models, each optimised/scaled independently. Event sourcing: store every change as an append-only event log; current state = replay. Powerful but complex , overkill for simple CRUD.',
    category: 'Q&A'
  },
  {
    id: 'arch-cap',
    front: 'CAP theorem',
    back: 'During a network partition you trade Consistency vs Availability (Partition tolerance is a given). CP: refuse rather than serve stale data. AP: stay available, reconcile later (eventual consistency).',
    category: 'Q&A'
  },
  {
    id: 'arch-cloud-native',
    front: 'Containers vs serverless',
    back: 'Containers (Docker/K8s): portable image you run/scale yourself. Serverless (Lambda): run code per request, auto-scales to zero, pay per execution , trades control + cold-start latency for zero ops.',
    category: 'Q&A'
  },
  {
    id: 'eng-rate-limiting',
    front: 'Rate limiting algorithms',
    back: 'Fixed window: simple, but boundary bursts can 2x the rate. Sliding log: accurate, memory-heavy. Sliding window counter: the practical middle ground. Token bucket: allows bursts up to bucket size. Leaky bucket: smooths bursts into a steady rate.',
    category: 'Q&A'
  },
  {
    id: 'eng-consistent-hashing',
    front: 'Consistent hashing',
    back: 'Places nodes and keys on a hash ring , a key belongs to the next node clockwise. Adding/removing a node only remaps ~1/N of keys, unlike hash(key) % N which remaps almost everything. Virtual nodes even out the load.',
    category: 'Keyword'
  },
  {
    id: 'eng-race-condition',
    front: 'Race condition',
    back: 'The outcome depends on the unpredictable timing of concurrent operations , e.g. two requests read-then-write the same counter and one update gets lost. Fix with a mutex/lock, or better, an atomic operation (UPDATE ... SET x = x - 1).',
    category: 'Keyword'
  },
  {
    id: 'eng-deadlock',
    front: 'Deadlock',
    back: 'Two or more processes each hold a lock the other needs and neither releases theirs , they wait forever. Standard fix: always acquire locks in the same consistent order across the codebase.',
    category: 'Keyword'
  },
  {
    id: 'eng-authn-vs-authz',
    front: 'Authentication vs authorization',
    back: 'Authentication: who are you? (login, token). Authorization: what are you allowed to do? (runs after authn). 401 = not authenticated. 403 = authenticated, but forbidden , a commonly mixed-up pair.',
    category: 'Q&A'
  },
  // ── System Design glossary (gaps not already covered above) ──
  {
    id: 'sd-api-gateway',
    front: 'API Gateway',
    back: 'A server that sits in front of your APIs/microservices, routing requests and centralising cross-cutting concerns , auth, rate limiting, throttling, logging , so individual services don’t each reimplement them.',
    category: 'Keyword'
  },
  {
    id: 'sd-service-mesh',
    front: 'Service mesh',
    back: 'A dedicated infra layer (e.g. Istio, Linkerd) that handles service-to-service communication , retries, mTLS, load balancing, observability , via sidecar proxies, out of application code.',
    category: 'Keyword'
  },
  {
    id: 'sd-failover',
    front: 'Failover',
    back: 'A backup component automatically takes over when the primary fails, keeping the system available. Pairs with redundancy (spare capacity already running) and health checks (to detect the failure).',
    category: 'Keyword'
  },
  {
    id: 'sd-multi-tenancy',
    front: 'Multi-tenancy',
    back: 'One instance of an application serves multiple customers ("tenants"), with their data logically isolated , cheaper to operate than one deployment per customer, but a bug can leak across tenants if isolation is sloppy.',
    category: 'Keyword'
  },
  {
    id: 'sd-autoscaling',
    front: 'Autoscaling',
    back: 'Automatically adds/removes compute resources based on load (CPU, request rate, queue depth) , horizontal scaling driven by a metric instead of a human.',
    category: 'Keyword'
  },
  {
    id: 'sd-load-shedding',
    front: 'Load shedding',
    back: 'Deliberately rejecting or degrading some requests under extreme load (e.g. return 503 for low-priority traffic) so the system stays healthy for the rest, instead of falling over entirely.',
    category: 'Keyword'
  },
  {
    id: 'sd-quorum',
    front: 'Quorum',
    back: 'The minimum number of nodes that must agree for a distributed read/write to be considered successful , e.g. W + R > N guarantees a read sees the latest write across N replicas.',
    category: 'Keyword'
  },
  {
    id: 'sd-orchestration-vs-choreography',
    front: 'Orchestration vs choreography',
    back: 'Orchestration: a central coordinator tells each service what to do and when (easier to reason about, single point of coupling). Choreography: services react to events independently, no coordinator (more decoupled, harder to trace).',
    category: 'Q&A'
  },
  {
    id: 'sd-service-registry',
    front: 'Service registry',
    back: 'A directory (e.g. Consul, Eureka) that tracks which instances of each microservice are currently up and where , lets services find each other dynamically instead of hardcoding addresses.',
    category: 'Keyword'
  },
  {
    id: 'sd-data-warehouse-vs-lake',
    front: 'Data warehouse vs data lake',
    back: 'Warehouse: structured, schema-on-write, optimised for BI/reporting queries. Lake: raw/native format (files, blobs), schema-on-read, cheaper and more flexible but needs more work to query well.',
    category: 'Q&A'
  },
  {
    id: 'sd-olap-vs-oltp',
    front: 'OLAP vs OLTP',
    back: 'OLTP: many small, fast read/write transactions , the live app database. OLAP: complex analytical queries over large historical datasets , reporting/BI, usually a separate warehouse so it doesn’t compete with live traffic.',
    category: 'Q&A'
  },
  {
    id: 'sd-big-data',
    front: 'Big Data (the 3 Vs)',
    back: 'Datasets too large/fast/varied for conventional single-machine processing , commonly framed as Volume, Velocity, Variety. Handled with distributed processing (Spark, Hadoop) rather than a single database.',
    category: 'Keyword'
  },
  {
    id: 'sd-pub-sub',
    front: 'Pub/Sub model',
    back: 'Publishers send messages to a topic without knowing who’s listening; subscribers receive messages from topics they’ve subscribed to. Decouples producers from consumers , a generalisation of a message queue for fan-out to many consumers.',
    category: 'Keyword'
  },
  {
    id: 'sd-distributed-systems',
    front: 'Distributed system',
    back: 'Independent components on different machines that coordinate by passing messages over a network to appear as one coherent system , brings partial failure, network latency, and consistency trade-offs that a single-process app never has to think about.',
    category: 'Keyword'
  },
  {
    id: 'sd-throughput-vs-latency',
    front: 'Throughput vs latency',
    back: 'Latency: time for one request to complete (ms per request). Throughput: how much work the system gets done per unit time (requests/sec). You can improve one at the expense of the other , e.g. batching raises throughput but adds latency per item.',
    category: 'Q&A'
  },
  {
    id: 'sd-cdn',
    front: 'CDN (Content Delivery Network)',
    back: 'A geographically distributed set of edge servers that cache and serve content close to the user, cutting latency and origin-server load , used for static assets and increasingly for cacheable API responses.',
    category: 'Keyword'
  }
];
