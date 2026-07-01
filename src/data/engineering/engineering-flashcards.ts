import type { Flashcard } from '@/types/content';

// ─── Engineering Essentials flashcards (engineering + testing) ────────────────

export const engineeringFlashcards: Flashcard[] = [
  {
    id: 'eng-compiler-interpreter',
    front: 'Compiler vs interpreter',
    back: 'Compiler translates the whole program to machine code before running (errors at compile time). Interpreter runs line by line at runtime. Modern JS engines JIT-compile hot paths — a hybrid.',
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
    back: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — guidelines for maintainable, testable OO code.',
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
    back: 'GET, PUT, DELETE — running them repeatedly leaves the same state, so retries are safe. POST is not idempotent (usually creates each time); use an idempotency key to make it safe.',
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
    back: 'A lookup structure (usually a B-tree) that turns a full-table scan (O(n)) into a fast seek (O(log n)) for the indexed column. Speeds reads, slows writes — index your query patterns.',
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
    back: 'App checks the cache first; on a miss it reads the DB, then stores the result. The hard part is invalidation — stale data after a write is the classic caching bug.',
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
    back: 'Functional: does it do WHAT it should (feature meets requirement)? Non-functional: how WELL — performance, load, security, accessibility, usability.',
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
    back: 'A test that passes/fails without code changes — usually timing or shared state. Worse than no test because people start ignoring red builds. Fix or quarantine immediately.',
    category: 'Keyword'
  },
  {
    id: 'test-stlc',
    front: 'STLC + code coverage',
    back: 'STLC phases: requirements → planning → case design → setup → execution → closure. Coverage = % of code run by tests — a guide, not proof of correctness (100% can still miss bugs).',
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
    front: 'Singleton — and the catch',
    back: 'Guarantees one shared instance (config, connection pool). The catch: it’s global state, which hides dependencies and makes testing hard — prefer dependency injection.',
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
    back: 'Pass a class its dependencies from outside instead of creating them inside. Decouples from concretes, makes testing easy (inject mocks). The "D" in SOLID. Passing an arg IS DI — no framework needed.',
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
    front: 'High availability — how?',
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
    back: 'Replication: copy data to replicas — scales reads + redundancy (but replication lag → stale reads). Sharding: split data by a key across nodes — scales writes (but cross-shard queries are costly).',
    category: 'Q&A'
  },
  {
    id: 'arch-cqrs',
    front: 'CQRS & event sourcing',
    back: 'CQRS: separate read and write models, each optimised/scaled independently. Event sourcing: store every change as an append-only event log; current state = replay. Powerful but complex — overkill for simple CRUD.',
    category: 'Q&A'
  },
  {
    id: 'arch-cap',
    front: 'CAP theorem',
    back: 'During a network partition you trade Consistency vs Availability (Partition tolerance is a given). CP: refuse rather than serve stale data. AP: stay available, reconcile later (eventual consistency).',
    category: 'Q&A'
  },
  {
    id: 'arch-serverless',
    front: 'Containers vs serverless',
    back: 'Containers (Docker/K8s): portable image you run/scale yourself. Serverless (Lambda): run code per request, auto-scales to zero, pay per execution — trades control + cold-start latency for zero ops.',
    category: 'Q&A'
  }
];
