import type { QuizQuestion } from '@/types/content';

// ─── Engineering Essentials quiz — multiple choice (general eng + testing + architecture) ──

export const engineeringQuiz: QuizQuestion[] = [
  {
    id: 'eng-q-big-o',
    question: 'What does Big-O notation describe?',
    options: [
      'The exact runtime of an algorithm in milliseconds',
      'How an algorithm\'s cost grows with input size, ignoring constants',
      'How much memory a program uses at startup',
      'The number of lines of code in a function'
    ],
    correctIndex: 1,
    explanation: 'Big-O describes scaling behavior, not absolute speed — O(n) can still be slower than O(n²) for small n.',
    category: 'Fundamentals'
  },
  {
    id: 'eng-q-oop-pillars',
    question: 'Which of these is NOT one of the four pillars of OOP?',
    options: ['Encapsulation', 'Polymorphism', 'Concurrency', 'Inheritance'],
    correctIndex: 2,
    explanation: 'The four pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism — concurrency is a separate concern.',
    category: 'Fundamentals'
  },
  {
    id: 'eng-q-solid',
    question: 'What does the "S" in SOLID stand for?',
    options: ['Static typing', 'Single Responsibility', 'Service abstraction', 'State management'],
    correctIndex: 1,
    explanation: 'A class/module should have one, and only one, reason to change.',
    category: 'Fundamentals'
  },
  {
    id: 'eng-q-composition-inheritance',
    question: 'Why is "composition over inheritance" a common guideline?',
    options: [
      'Inheritance is always faster at runtime',
      'Composition (has-a) avoids tightly coupling subclasses to parents, which deep inheritance hierarchies (is-a) tend to create',
      'Composition removes the need for interfaces',
      'Inheritance is deprecated in modern languages'
    ],
    correctIndex: 1,
    explanation: 'Deep inheritance hierarchies get rigid and hard to change; combining small, focused parts tends to age better.',
    category: 'Fundamentals'
  },
  {
    id: 'eng-q-rest',
    question: 'What makes an API "RESTful"?',
    options: [
      'It only uses the GET method',
      'Resources as URLs (nouns), HTTP verbs as actions, status codes for outcomes, and stateless requests',
      'It must return XML instead of JSON',
      'It requires a GraphQL schema'
    ],
    correctIndex: 1,
    explanation: 'Statelessness means each request must carry everything needed to process it (e.g. its own auth token).',
    category: 'API design'
  },
  {
    id: 'eng-q-idempotency',
    question: 'Which HTTP methods are idempotent (safe to retry without changing the outcome)?',
    options: ['POST only', 'GET, PUT, DELETE', 'POST and PATCH only', 'None of them'],
    correctIndex: 1,
    explanation: 'POST is typically NOT idempotent since it usually creates a new resource each time — an idempotency key can make it safe.',
    category: 'API design'
  },
  {
    id: 'eng-q-index',
    question: 'What does a database index primarily improve?',
    options: [
      'Write speed only',
      'Read speed for the indexed column, turning a full-table scan into a fast seek — at some cost to write speed',
      'Storage size, by compressing the table',
      'Nothing measurable in modern databases'
    ],
    correctIndex: 1,
    explanation: 'An index (usually a B-tree) trades slightly slower writes for much faster lookups on the indexed column(s).',
    category: 'Databases'
  },
  {
    id: 'eng-q-n-plus-1',
    question: 'What is the "N+1 query problem"?',
    options: [
      'Running exactly one extra query per deployment',
      'Running one query to list N items, then one query per item to fetch its details, instead of a single join/IN query',
      'A database that has one more table than expected',
      'A race condition between two concurrent writes'
    ],
    correctIndex: 1,
    explanation: 'This is a very common ORM performance killer — batching into a single query fixes it.',
    category: 'Databases'
  },
  {
    id: 'eng-q-offset-vs-cursor',
    question: 'Why does cursor-based pagination scale better than offset (LIMIT/OFFSET) pagination for deep pages?',
    options: [
      'Cursor pagination loads the entire table into memory once',
      'Offset pagination still scans and discards all skipped rows first; cursor pagination jumps straight in via an index',
      'They perform identically; the choice is purely stylistic',
      'Offset pagination cannot be combined with sorting'
    ],
    correctIndex: 1,
    explanation: 'Cursor pagination ("give me items after id X") also stays stable when rows are inserted/deleted during pagination.',
    category: 'Databases'
  },
  {
    id: 'eng-q-caching-invalidation',
    question: 'In the cache-aside pattern, what is generally considered the hardest part to get right?',
    options: ['Reading from the cache', 'Cache invalidation — avoiding stale data after a write', 'Choosing a cache library', 'Serializing the cached value'],
    correctIndex: 1,
    explanation: 'The app checks cache first, falls back to the DB on a miss, then stores the result — but keeping it fresh after writes is the classic hard problem.',
    category: 'Performance'
  },
  {
    id: 'eng-q-vertical-horizontal-scaling',
    question: 'What is the difference between vertical and horizontal scaling?',
    options: [
      'Vertical adds more machines; horizontal makes one machine bigger',
      'Vertical = a bigger machine (simple, has a ceiling); horizontal = more machines behind a load balancer (near-unlimited, needs stateless services)',
      'They are the same strategy under different names',
      'Horizontal scaling only applies to databases'
    ],
    correctIndex: 1,
    explanation: 'To scale horizontally, app servers generally need to be stateless so any instance can handle any request.',
    category: 'Scaling'
  },
  {
    id: 'eng-q-monolith-microservices',
    question: 'What is a common trade-off when moving from a monolith to microservices?',
    options: [
      'You gain independent scaling/deployability, but take on network calls, distributed data, and more operational complexity',
      'Microservices are always simpler to operate than a monolith',
      'Monoliths cannot be deployed to the cloud',
      'Microservices eliminate the need for testing'
    ],
    correctIndex: 0,
    explanation: 'Most guidance is to start with a monolith and split out services only once a real scaling/team boundary need appears.',
    category: 'Architecture'
  },
  {
    id: 'eng-q-modular-monolith',
    question: 'What is a "modular monolith"?',
    options: [
      'A monolith with no internal structure at all',
      'One deployment, internally split into strict modules with enforced boundaries — most of microservices\' clear ownership without the network/ops cost',
      'A synonym for microservices',
      'A monolith that only runs one module at a time'
    ],
    correctIndex: 1,
    explanation: 'It also makes splitting a module out into a real service later much easier, since the boundary already exists.',
    category: 'Architecture'
  },
  {
    id: 'eng-q-circuit-breaker',
    question: 'What problem does the circuit breaker pattern solve?',
    options: [
      'It speeds up successful requests',
      'It stops repeatedly calling a failing dependency, letting it recover and preventing retry storms',
      'It automatically fixes bugs in a downstream service',
      'It encrypts traffic between services'
    ],
    correctIndex: 1,
    explanation: 'States are CLOSED (normal) → OPEN (fail fast) → HALF-OPEN (trial call to see if it recovered).',
    category: 'Architecture'
  },
  {
    id: 'eng-q-cap-theorem',
    question: 'According to the CAP theorem, during a network partition a distributed system must choose between:',
    options: ['Speed and cost', 'Consistency and Availability (partition tolerance is a given)', 'SQL and NoSQL', 'Scalability and security'],
    correctIndex: 1,
    explanation: 'CP systems refuse to serve rather than return stale data; AP systems stay available and reconcile later (eventual consistency).',
    category: 'Distributed systems'
  },
  {
    id: 'eng-q-replication-sharding',
    question: 'What is the difference between database replication and sharding?',
    options: [
      'They are the same technique with different names',
      'Replication copies data to replicas (scales reads); sharding splits data by key across nodes (scales writes)',
      'Sharding only works with NoSQL databases',
      'Replication requires downtime; sharding does not'
    ],
    correctIndex: 1,
    explanation: 'Replication introduces replication lag (possible stale reads); sharding makes cross-shard queries costlier.',
    category: 'Distributed systems'
  },
  {
    id: 'eng-q-race-condition',
    question: 'What is a race condition?',
    options: [
      'A bug that only occurs on slow networks',
      'The outcome depends on the unpredictable timing of concurrent operations, e.g. two requests read-then-write the same counter and one update is lost',
      'An infinite loop caused by recursive calls',
      'A memory leak from unclosed database connections'
    ],
    correctIndex: 1,
    explanation: 'Fixed with a mutex/lock, or better, an atomic operation like `UPDATE ... SET x = x - 1` at the database level.',
    category: 'Concurrency'
  },
  {
    id: 'eng-q-deadlock',
    question: 'What causes a deadlock?',
    options: [
      'A single process running out of memory',
      'Two or more processes each hold a lock the other needs, and neither releases theirs — they wait forever',
      'A network timeout during an API call',
      'A database index becoming corrupted'
    ],
    correctIndex: 1,
    explanation: 'The standard fix is to always acquire locks in the same consistent order across the codebase.',
    category: 'Concurrency'
  },
  {
    id: 'eng-q-authn-vs-authz',
    question: 'What is the difference between authentication and authorization?',
    options: [
      'They are the same concept',
      'Authentication is "who are you?" (login/token); authorization is "what are you allowed to do?" and runs after authentication',
      'Authorization always happens before authentication',
      'Authentication only applies to admin users'
    ],
    correctIndex: 1,
    explanation: '401 means not authenticated; 403 means authenticated but forbidden — a commonly mixed-up pair.',
    category: 'Security'
  },
  {
    id: 'eng-q-testing-pyramid',
    question: 'What does the testing pyramid recommend?',
    options: [
      'Mostly end-to-end tests, with a few unit tests on top',
      'Many fast unit tests at the base, fewer integration tests, and a few slow E2E tests on top',
      'An equal number of unit, integration, and E2E tests',
      'Skipping unit tests in favor of manual QA'
    ],
    correctIndex: 1,
    explanation: 'An inverted pyramid (mostly E2E) tends to be slow and flaky — the pyramid shape keeps suites fast and reliable.',
    category: 'Testing'
  },
  {
    id: 'eng-q-mock-stub-spy',
    question: 'What is the difference between a stub, a mock, and a spy in testing?',
    options: [
      'They are interchangeable terms for the same thing',
      'A stub returns canned values; a mock is a stub with expectations on how it\'s called; a spy records calls to a real (or fake) function',
      'A spy always replaces the entire module',
      'A mock can only be used in end-to-end tests'
    ],
    correctIndex: 1,
    explanation: 'All three replace or observe real dependencies, but with different levels of behavior verification.',
    category: 'Testing'
  },
  {
    id: 'eng-q-flaky-test',
    question: 'Why is a flaky test (passes/fails without code changes) considered worse than having no test at all?',
    options: [
      'It always slows down the build significantly',
      'People start ignoring red builds, which can mask a real failure elsewhere',
      'It counts against code coverage metrics',
      'It cannot be fixed once introduced'
    ],
    correctIndex: 1,
    explanation: 'A flaky test erodes trust in the whole test suite — the standard advice is to fix or quarantine it immediately.',
    category: 'Testing'
  },
  {
    id: 'eng-q-tdd',
    question: 'What is the TDD cycle?',
    options: ['Plan → Build → Ship', 'Red → Green → Refactor', 'Design → Code → Deploy', 'Write → Test → Delete'],
    correctIndex: 1,
    explanation: 'Write a failing test (red), make it pass with the simplest code (green), then clean up (refactor).',
    category: 'Testing'
  },
  {
    id: 'eng-q-load-balancing',
    question: 'What is the main purpose of a load balancer?',
    options: [
      'To compress HTTP responses',
      'To distribute traffic across multiple servers and remove unhealthy nodes via health checks',
      'To cache database queries',
      'To encrypt data at rest'
    ],
    correctIndex: 1,
    explanation: 'This enables horizontal scaling — but requires servers to stay stateless, avoiding sticky-session dependencies.',
    category: 'Scaling'
  }
];
