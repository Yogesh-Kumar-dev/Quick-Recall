import type { Note } from '@/types/content';

// ─── Node.js Backend notes — distilled from the "Top 90+ Node.js Backend Interview
// Questions" deck (product-company focused: runtime internals, Express, security,
// databases, scaling, and DevOps) ──────────────────────────────────────────────────

export const nodejsNotes: Note[] = [
  // ─── RUNTIME ────────────────────────────────────────────────────────────────
  {
    id: 'what-is-nodejs',
    title: 'What is Node.js?',
    summary: "A JavaScript runtime built on Chrome's V8 engine that executes JS on the server, using a non-blocking, event-driven model.",
    difficulty: 'basic',
    category: 'runtime',
    keyPoints: [
      'Non-blocking I/O model , handles high concurrency without spawning a thread per request.',
      'Event-driven architecture , I/O completions are delivered as callbacks/events rather than blocking the caller.',
      'Lightweight and fast to start, which suits containerized, horizontally-scaled deployments.',
      'Same language (JS/TS) across frontend and backend , shared types, shared tooling.'
    ],
    gotcha:
      "Non-blocking I/O doesn't mean multi-threaded computation , CPU-bound work still runs on the single main thread and blocks everything else. Offload it (worker threads, a queue) instead of doing it inline.",
    codeSnippet: `// Netflix-style example: Node.js as an edge/BFF service handling
// millions of lightweight I/O-bound requests with minimal latency —
// not a place for heavy synchronous computation.`
  },
  {
    id: 'nodejs-event-loop',
    title: 'The Event Loop, in depth',
    summary: "A single-threaded loop with phases that dequeue and run callbacks , the mechanism behind all of Node's async behavior.",
    difficulty: 'intermediate',
    category: 'runtime',
    prerequisites: ['what-is-nodejs'],
    keyPoints: [
      'Phases, in order: Timers (setTimeout/setInterval) → Pending/I-O callbacks → Idle/prepare → Poll (I/O execution) → Check (setImmediate) → Close callbacks.',
      'Each phase has its own FIFO queue; the loop only moves to the next phase once the current one drains (or hits a limit).',
      'Heavy synchronous computation inside any callback blocks the entire loop , no other request, timer, or I/O event is serviced until it returns.',
      'Production fix for CPU-heavy work (e.g. synchronous image compression) blocking every request: move it to worker threads or an external queue (BullMQ).'
    ],
    gotcha:
      'A single slow, synchronous handler degrades every concurrent request, not just its own , this is the most common Node.js scalability bug in interviews and in production.',
    codeSnippet: `// Blocks the loop , every other request waits
app.post('/compress', (req, res) => {
  const output = compressImageSync(req.body); // CPU-bound, synchronous
  res.send(output);
});

// Fix: offload to a worker thread or a job queue (BullMQ + Redis)`
  },
  {
    id: 'nexttick-setimmediate-settimeout',
    title: 'process.nextTick() vs setImmediate() vs setTimeout()',
    summary: "Three ways to defer work , they run at different points relative to the event loop's phases.",
    difficulty: 'intermediate',
    category: 'runtime',
    prerequisites: ['nodejs-event-loop'],
    keyPoints: [
      'process.nextTick(fn) , runs immediately after the current operation, before the event loop continues (a microtask, not a loop phase).',
      'setImmediate(fn) , runs in the Check phase, after I/O events in the current loop iteration.',
      'setTimeout(fn, ms) , runs after (at least) the specified delay, in the Timers phase.',
      'Real-world use: process.nextTick for critical microtasks like propagating an error before anything else runs.'
    ],
    codeSnippet: `console.log('start');
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
console.log('end');
// start, end, nextTick, timeout/immediate (order of the last two varies by context)`
  },
  {
    id: 'nodejs-streams-buffers',
    title: 'Streams & Buffers',
    summary: 'Streams process data in chunks instead of loading it all into memory; Buffers hold raw binary data directly in memory.',
    difficulty: 'intermediate',
    category: 'runtime',
    prerequisites: ['what-is-nodejs'],
    keyPoints: [
      'Stream types: Readable, Writable, Duplex (both), Transform (Duplex that modifies data as it passes through).',
      'Production case: uploading/processing a 1GB file via a stream avoids loading the whole file into memory and crashing the process.',
      'Buffer: fixed-size chunk of raw memory used for binary data , file handling, TCP/socket data, image processing.',
      'Streams and Buffers compose: a Readable stream emits Buffer chunks that a Transform/Writable stream consumes.'
    ],
    codeSnippet: `const fs = require('fs');
// Streamed — constant memory regardless of file size
fs.createReadStream('large-file.zip')
  .pipe(fs.createWriteStream('copy.zip'));`
  },
  {
    id: 'nodejs-concurrency-model',
    title: 'Scaling on one machine: Cluster, Worker Threads, and Child Processes',
    summary:
      'Three different tools for using more than one CPU core , pick based on whether the work is "more servers", "CPU-heavy JS", or "another process/program".',
    difficulty: 'advanced',
    category: 'runtime',
    prerequisites: ['nodejs-event-loop'],
    keyPoints: [
      'cluster module , forks multiple Node.js instances (one per CPU core) that share the same server port, improving horizontal scaling on a single machine.',
      'Worker Threads , run CPU-heavy JS (image resizing, PDF generation, ML inference) on separate threads without blocking the main event loop.',
      "Child processes (spawn/exec/fork): spawn streams large data through a child command; exec buffers a shell command's output; fork creates another Node.js process (e.g. for parallel background jobs) with a built-in IPC channel.",
      'Rule of thumb: cluster for "more request-handling capacity"; worker threads for "CPU-bound JS work"; child_process for "run another program or Node script".'
    ],
    codeSnippet: `const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork()); // one worker per CPU core
} else {
  require('./server'); // each worker runs the actual app
}`
  },
  {
    id: 'nodejs-error-handling',
    title: 'Error Handling in Node.js',
    summary:
      'Three categories of errors need three different handling strategies , plus a last-resort global catch and a centralized Express middleware.',
    difficulty: 'intermediate',
    category: 'runtime',
    prerequisites: ['what-is-nodejs'],
    keyPoints: [
      'Synchronous errors: try/catch around the call site.',
      'Asynchronous errors: callback error-first convention, or .catch()/try-catch around await.',
      'Global/uncaught errors: process.on("uncaughtException", ...) , a last-resort safety net, not a substitute for handling errors properly.',
      'Best practice in an API: a single centralized error-handling middleware at the end of the middleware chain, so every route reports errors consistently.'
    ],
    gotcha:
      'Relying on uncaughtException to keep the process alive after a real error is dangerous , the process is in an unknown state; the standard advice is to log and exit, then let your process manager (PM2, Kubernetes) restart it.',
    codeSnippet: `// Centralized Express error handler , must be registered LAST
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});`
  },

  {
    id: 'nodejs-core-modules',
    title: 'Node.js Core Modules Overview',
    summary:
      'Built-in modules that ship with Node itself , no install needed , covering system info, files, networking, and binary/text utilities.',
    difficulty: 'basic',
    category: 'runtime',
    prerequisites: ['what-is-nodejs'],
    keyPoints: [
      'System/diagnostics: os (os.freemem(), os.cpus()), util (util.inspect() for debugging).',
      'File system: fs , fs.readFile()/fs.writeFile() (async) vs fs.readFileSync() (sync, blocks the event loop).',
      'Networking: http/https (createServer()), net (raw TCP sockets), dgram (UDP datagrams).',
      'Binary/data utilities: crypto (hashing, HMAC), zlib (gzip/deflate compression), path (cross-platform path joins), url (parse/format URLs).',
      "Interview framing: knowing these exist , and that they need zero npm installs , signals you understand what Node.js gives you 'for free' before reaching for a library."
    ],
    codeSnippet: `const os = require('os');
const path = require('path');
const crypto = require('crypto');

console.log(os.freemem(), os.cpus().length);
console.log(path.join(__dirname, 'data', 'file.txt'));
console.log(crypto.createHash('sha256').update('hi').digest('hex'));`
  },
  {
    id: 'nodejs-raw-http-server',
    title: 'Building a Server with the raw http module',
    summary: 'Express is built on top of this , http.createServer() takes a (req, res) listener and res.end() sends the response.',
    difficulty: 'basic',
    category: 'runtime',
    prerequisites: ['nodejs-core-modules'],
    keyPoints: [
      'http.createServer(listener) wires a callback that runs for every incoming request; .listen(port) starts accepting connections.',
      'req (IncomingMessage) exposes req.url, req.method, req.headers for reading the request.',
      'res (ServerResponse) is written to with res.writeHead(status) and res.end(body) to send the response.',
      "Without a framework, you manually branch on req.url/req.method for routing , this manual boilerplate is exactly what Express's app.get()/app.post() replace."
    ],
    codeSnippet: `const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/profile') {
    res.writeHead(200);
    res.end('Welcome to your profile!');
  } else {
    res.writeHead(200);
    res.end('Hello, World!');
  }
});

server.listen(8080);`
  },

  // ─── EXPRESS / API DESIGN ───────────────────────────────────────────────────
  {
    id: 'expressjs-fundamentals',
    title: 'Express.js: Middleware, Routing & Request Lifecycle',
    summary: 'Express is a minimal, unopinionated web framework built around a chain of middleware functions that a request flows through.',
    difficulty: 'basic',
    category: 'express',
    prerequisites: ['nodejs-raw-http-server'],
    keyPoints: [
      'Middleware: a function (req, res, next) that runs during the request lifecycle , logging, auth, parsing , and calls next() to pass control along.',
      'Request lifecycle: Incoming Request → Middleware chain → Route Handler → Response, with Error Middleware able to intercept at any point.',
      'Routing maps an HTTP method + path to a handler: app.get("/users/:id", getUser); RESTful convention , GET read, POST create, PUT/PATCH update, DELETE remove.',
      'Middleware chaining: multiple middleware run in sequence for one route (e.g. auth → role check → controller) , each must call next() or the chain stalls.',
      'Route params (/users/10 → req.params.id) identify a specific resource; query params (/users?page=2 → req.query.page) modify how a collection is fetched (filtering, paging).'
    ],
    gotcha:
      "A middleware that forgets to call next() (and doesn't send a response) hangs the request forever , the client just times out with no error logged.",
    codeSnippet: `app.use(authMiddleware);
app.get('/orders', orderController);
app.use(errorHandler); // must be registered after all routes

// Middleware chaining for one route
app.get('/secure', authMiddleware, roleMiddleware, controller);`
  },
  {
    id: 'production-project-structure',
    title: 'Structuring a Production Express Project',
    summary: 'Layered folders (controllers/services/repositories/...) separate HTTP concerns from business logic from data access.',
    difficulty: 'intermediate',
    category: 'express',
    prerequisites: ['expressjs-fundamentals'],
    keyPoints: [
      'controllers/ , parse the request, call a service, shape the response (no business logic).',
      'services/ , business logic, orchestrates repositories.',
      'repositories/ , the only layer that talks to the database/ORM.',
      'middlewares/, routes/, utils/, config/ , cross-cutting and wiring concerns kept separate from the above.',
      'Why: separation of concerns, a clean/testable architecture, and the ability to swap a layer (e.g. the DB) without touching controllers.'
    ],
    codeSnippet: `src/
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── routes/
├── utils/
└── config/`
  },
  {
    id: 'api-security-validation',
    title: 'API Security: Validation, Sanitization, CORS & Helmet',
    summary: 'Validate shape, sanitize content, and lock down cross-origin/HTTP-header behavior , three distinct layers of API hardening.',
    difficulty: 'intermediate',
    category: 'security',
    prerequisites: ['expressjs-fundamentals'],
    keyPoints: [
      'Validation (is the shape right?): Joi, Yup, Zod, or express-validator , reject malformed payloads before they reach business logic.',
      'Sanitization (is the content safe?): strip/escape malicious input to prevent XSS and SQL injection , validator.js, DOMPurify.',
      'CORS: app.use(cors({ origin: "https://yourdomain.com" })) , restricts which origins may call the API from a browser.',
      'Helmet.js: app.use(helmet()) sets protective HTTP headers in one call, preventing XSS, clickjacking, and MIME-sniffing.',
      'REST API security checklist: HTTPS, JWT auth, input validation, rate limiting, Helmet, logging & monitoring.'
    ],
    codeSnippet: `const schema = Joi.object({ email: Joi.string().email().required() });

app.use(helmet());
app.use(cors({ origin: 'https://yourdomain.com' }));
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 60_000, max: 5 })); // e.g. 5 login attempts/min`
  },
  {
    id: 'jwt-oauth-auth',
    title: 'JWT Authentication, Refresh Tokens & OAuth',
    summary:
      'JWT: server issues a signed token the client presents on each request. Refresh tokens extend a session without re-entering credentials. OAuth delegates login to a third party.',
    difficulty: 'intermediate',
    category: 'security',
    prerequisites: ['api-security-validation'],
    keyPoints: [
      'JWT flow: user logs in → server generates a token → client sends it in request headers on subsequent calls (no server-side session needed).',
      'Refresh tokens: the (short-lived) access token expires quickly for security; a longer-lived refresh token is used to silently obtain a new access token , improves both security and UX.',
      'OAuth: delegate authentication to Google/Facebook/GitHub , the backbone of SSO (single sign-on) systems.',
      'Security best practice for REST APIs generally: HTTPS everywhere, JWT for stateless auth, plus rate limiting on auth endpoints specifically (e.g. 5 login attempts/minute).'
    ]
  },
  {
    id: 'api-design-essentials',
    title: 'API Design Essentials: Versioning, Pagination, Caching, Status Codes',
    summary: 'A grab-bag of practical REST API conventions that come up constantly in backend interviews.',
    difficulty: 'intermediate',
    category: 'api-design',
    prerequisites: ['expressjs-fundamentals'],
    keyPoints: [
      'Versioning prevents breaking existing clients: URL versioning (/v1/users), header versioning, or query versioning.',
      'Pagination fetches large datasets in chunks: GET /products?page=1&limit=20.',
      'API-level caching: in-memory (node-cache), Redis, or CDN caching , e.g. cache a product list for 60 seconds.',
      'Rate limiting prevents abuse by capping requests per client (express-rate-limit) , e.g. limit a login endpoint to 5 attempts/minute.',
      'HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error.'
    ]
  },

  // ─── DATABASES ───────────────────────────────────────────────────────────────
  {
    id: 'nodejs-database-access',
    title: 'How Node.js Talks to Databases: Drivers, ORMs & Query Builders',
    summary:
      'Node.js reaches SQL and NoSQL databases through drivers, ORMs, or query builders , each trading off productivity against control.',
    difficulty: 'intermediate',
    category: 'database',
    prerequisites: ['what-is-nodejs'],
    keyPoints: [
      'SQL stacks: PostgreSQL/MySQL via pg, mysql2, Sequelize, or TypeORM.',
      'NoSQL stacks: MongoDB via Mongoose.',
      'ORM (TypeORM, Sequelize): abstracts the database into objects , higher productivity, less control over the exact query.',
      'Query Builder (Knex.js): write SQL-like queries programmatically , more control, less abstraction.',
      'Production pattern: an order service on PostgreSQL with TypeORM and connection pooling.'
    ]
  },
  {
    id: 'connection-pooling-indexing',
    title: 'Connection Pooling & Database Indexing',
    summary:
      'Pooling reuses a fixed set of DB connections instead of opening one per request; indexing speeds up lookups by avoiding full table scans.',
    difficulty: 'intermediate',
    category: 'database',
    prerequisites: ['nodejs-database-access'],
    keyPoints: [
      'Connection pooling maintains a set of reusable DB connections , reduces connection overhead, improves performance, and prevents overloading the database.',
      "Critical at scale: without pooling, a high-traffic API (1000+ concurrent users) can exhaust the database's max connections.",
      'Indexing improves query performance by avoiding a full table scan for lookups on the indexed column.',
      'Trade-off: every index speeds up reads on that column but adds overhead to writes (the index must be updated too).'
    ],
    codeSnippet: `CREATE INDEX idx_user_email ON users(email);`
  },
  {
    id: 'acid-eventual-consistency',
    title: 'ACID Properties & Eventual Consistency',
    summary:
      'ACID guarantees strict correctness for a single transaction; eventual consistency trades strictness for scale in distributed systems.',
    difficulty: 'intermediate',
    category: 'database',
    prerequisites: ['nodejs-database-access'],
    keyPoints: [
      "ACID: Atomicity (all-or-nothing), Consistency (valid state to valid state), Isolation (concurrent transactions don't interfere), Durability (committed data survives a crash) , expected in transactional systems like payments/banking.",
      'Eventual consistency: used in distributed systems where data is not immediately consistent everywhere but converges over time.',
      'Example: an order is created, and inventory is updated asynchronously afterward rather than in the same transaction.',
      'Trade-off framing: ACID for correctness-critical single-system transactions; eventual consistency for scale across distributed services (social feeds, high-throughput systems).'
    ]
  },
  {
    id: 'sql-vs-nosql-sharding-replication',
    title: 'SQL vs NoSQL, Sharding & Replication',
    summary:
      'SQL suits structured, transactional data; NoSQL suits scale and flexible schemas. Sharding and replication are the two big levers for scaling a database.',
    difficulty: 'intermediate',
    category: 'database',
    prerequisites: ['nodejs-database-access'],
    keyPoints: [
      'Use SQL for: transactions, structured/relational data (e.g. banking systems).',
      'Use NoSQL for: high scalability, flexible schema (e.g. social media feeds).',
      'Sharding: split a database into smaller pieces (shards) , e.g. users split by region (India shard, US shard) , scales writes/storage horizontally.',
      'Replication: copy data across multiple servers (master-slave or multi-master) for high availability and fault tolerance.'
    ]
  },
  {
    id: 'redis-caching-strategies',
    title: 'Caching with Redis: Strategies & Invalidation',
    summary:
      'Redis is an in-memory data store used for caching, sessions, pub/sub, and rate limiting , with a few standard patterns for keeping the cache correct.',
    difficulty: 'intermediate',
    category: 'database',
    prerequisites: ['nodejs-database-access'],
    keyPoints: [
      'Redis use cases: caching, session store, pub/sub messaging, rate limiting.',
      'Caching strategies: cache-aside (app checks cache, falls back to DB and populates cache on a miss), write-through (write to cache and DB together), write-back (write to cache first, DB later).',
      'Cache-aside pattern in practice: check cache → on miss, fetch from DB → store in cache.',
      'Cache invalidation strategies: TTL expiration (e.g. cache a product catalog for 30 seconds), manual invalidation, or event-driven invalidation when the underlying data changes.'
    ],
    gotcha:
      '"Cache invalidation" is famously one of the two hard problems in computer science , pick a strategy deliberately (TTL is simplest, event-driven is freshest but more code) rather than caching everything indefinitely.',
    codeSnippet: `const redis = require('redis');
const client = redis.createClient();

// Cache-aside pattern
let data = await client.get(key);
if (!data) {
  data = await fetchFromDb();
  await client.set(key, data, { EX: 60 }); // TTL: 60s
}`
  },

  // ─── SCALING & ARCHITECTURE ──────────────────────────────────────────────────
  {
    id: 'message-queues-pubsub',
    title: 'Message Queues & Pub/Sub',
    summary:
      'Message queues decouple services with asynchronous communication; Pub/Sub broadcasts one event to many independent subscribers.',
    difficulty: 'advanced',
    category: 'scaling',
    prerequisites: ['nodejs-concurrency-model'],
    keyPoints: [
      'Message queue tools: RabbitMQ, Kafka, BullMQ (Redis-based job queue for Node.js).',
      "Use message queues for: background jobs, email sending, payment processing, order fulfillment , anything that shouldn't block the request/response cycle.",
      'Pub/Sub pattern: a publisher sends a message and multiple subscribers independently receive it , e.g. "order placed" notifies both the inventory service and the notification service.',
      'Kafka specifically: event streaming, log aggregation, real-time analytics (e.g. tracking user activity events) , built for high-throughput, ordered event logs, not just simple job queues.',
      'BullMQ specifically: a Redis-based job queue used for email jobs, image processing, and report generation in Node.js apps.'
    ]
  },
  {
    id: 'idempotency-distributed-locking',
    title: 'Idempotency & Distributed Locking',
    summary:
      'Idempotency guarantees repeating a request has no extra side effects; distributed locks prevent two processes from mutating the same data at once.',
    difficulty: 'advanced',
    category: 'scaling',
    prerequisites: ['message-queues-pubsub'],
    keyPoints: [
      'Idempotency: the same request sent multiple times produces the same result , critical for payment APIs, which must never charge a customer twice on a retried request.',
      'Distributed locking prevents multiple processes/instances from modifying the same data concurrently.',
      'Common tool: Redis-based locks (and coordination services like Zookeeper) to implement a distributed lock across multiple Node.js instances.'
    ]
  },
  {
    id: 'scalability-patterns',
    title: 'Scalability Patterns: Load Balancing, Circuit Breaker, API Gateway, CQRS',
    summary: 'A toolkit of patterns for keeping a backend responsive and resilient as traffic and service count grow.',
    difficulty: 'advanced',
    category: 'scaling',
    prerequisites: ['api-design-essentials', 'message-queues-pubsub'],
    keyPoints: [
      'Vertical scaling: increase CPU/RAM on one machine. Horizontal scaling: add more servers , Node.js apps typically scale horizontally.',
      'Load balancing distributes traffic across multiple servers (Nginx, AWS ELB).',
      'Circuit breaker: stop retrying and return a fallback response when a downstream service is failing, instead of cascading the failure (e.g. payment service down → stop retrying → fallback response).',
      'API Gateway: single entry point for microservices, responsible for auth verification, rate limiting, routing, and response aggregation (Kong, NGINX, AWS API Gateway).',
      'CQRS (Command Query Responsibility Segregation): separate read and write operations for better scalability in large systems.'
    ]
  },
  {
    id: 'scalable-nodejs-architecture',
    title: 'Designing a Scalable Node.js Backend',
    summary:
      'A layered, modular architecture with stateless services and externalized state is the standard shape of a scalable Node.js system.',
    difficulty: 'advanced',
    category: 'scaling',
    prerequisites: ['scalability-patterns'],
    keyPoints: [
      'Production request path: Client → CDN → Load Balancer → API Gateway → Node Services → DB/Cache/Queue.',
      'Key design principles: stateless services (so any instance can serve any request), horizontal scaling, externalized state (Redis/DB , not in-process memory), an API gateway for routing.',
      'Microservices architecture: split the app into independent, deployable services (e.g. Auth, Order, Payment, Notification services), each independently scalable and team-owned.',
      'Monolith vs Microservices trade-off: monolith = single codebase, simple to start, tightly coupled; microservices = multiple services, more complex but scalable, loosely coupled.',
      'Service discovery (Consul, Eureka, Kubernetes DNS) lets services dynamically find each other as instances scale up/down.'
    ]
  },

  // ─── DEVOPS & PRODUCTION ─────────────────────────────────────────────────────
  {
    id: 'docker-for-nodejs',
    title: 'Docker for Node.js',
    summary:
      'Docker packages a Node.js app with its dependencies into a portable container , same environment from a laptop to production.',
    difficulty: 'intermediate',
    category: 'devops',
    prerequisites: ['what-is-nodejs'],
    keyPoints: [
      'Benefits: identical environment everywhere, easy/repeatable deployment, process isolation.',
      'A minimal Dockerfile copies package files first (for layer caching), installs deps, then copies the rest of the source and sets the start command.'
    ],
    codeSnippet: `FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]`
  },
  {
    id: 'kubernetes-orchestration',
    title: 'Kubernetes (K8s) Orchestration',
    summary: 'Kubernetes orchestrates containers across a cluster , auto-scaling, self-healing, and rolling deployments.',
    difficulty: 'advanced',
    category: 'devops',
    prerequisites: ['docker-for-nodejs'],
    keyPoints: [
      'Auto scaling: adds/removes container instances based on load.',
      'Self healing: restarts or replaces failed containers automatically.',
      'Rolling deployment: updates instances gradually with no downtime window.',
      'Kubernetes DNS also doubles as a service-discovery mechanism, alongside dedicated tools like Consul or Eureka.'
    ]
  },
  {
    id: 'cicd-deployment-strategies',
    title: 'CI/CD & Deployment Strategies',
    summary:
      'CI/CD automates build/test/deploy; blue-green, canary, and rolling deployments are the standard ways to ship changes without downtime or unbounded risk.',
    difficulty: 'intermediate',
    category: 'devops',
    prerequisites: ['docker-for-nodejs'],
    keyPoints: [
      'CI/CD pipeline automates: build → test → deploy. Common tools: GitHub Actions, Jenkins, Azure DevOps.',
      'Blue-green deployment: run two environments (Blue = current, Green = new); switch traffic to Green after testing it.',
      'Canary deployment: release to a small percentage of users first (e.g. 5%), monitor, then roll out fully.',
      'Rolling update: gradually replace instances with the new version (a Kubernetes-native rollout technique).',
      'Rollback strategy: revert to the previous stable version immediately if a failure is detected post-deploy.',
      'Zero-downtime deployment is the umbrella goal achieved by any of: rolling updates, blue-green, or canary.'
    ]
  },
  {
    id: 'observability-logging-monitoring',
    title: 'Observability: Logging, Monitoring & Distributed Tracing',
    summary:
      'Three complementary pillars for understanding a running system: structured logs, health/metric monitoring, and cross-service request tracing.',
    difficulty: 'intermediate',
    category: 'devops',
    prerequisites: ['expressjs-fundamentals'],
    keyPoints: [
      'Logging tools: Winston, Pino. Best practice: log request id, user id, and the error stack , not just a message string , so logs are traceable per-request.',
      'Monitoring tools (system health): Prometheus, Grafana, Datadog.',
      'Distributed tracing (tracks one request across many microservices): Jaeger, Zipkin.',
      'Health check endpoint: a simple route (GET /health → "OK") that load balancers poll to verify an instance is alive before routing traffic to it.'
    ],
    codeSnippet: `app.get('/health', (req, res) => res.send('OK'));`
  },
  {
    id: 'secrets-graceful-shutdown',
    title: 'Secrets Management & Graceful Shutdown',
    summary:
      'Never store secrets in code, and never let a process die mid-request , both are basic production hygiene that interviewers probe for.',
    difficulty: 'intermediate',
    category: 'devops',
    prerequisites: ['docker-for-nodejs'],
    keyPoints: [
      'Secrets: use environment variables or a secret manager (Azure Key Vault, AWS Secrets Manager) , never commit credentials to source.',
      'Infrastructure-level rate limiting is often implemented outside the app itself: API gateway, NGINX, or Cloudflare.',
      'Graceful shutdown ensures: no data loss, DB connections closed cleanly, and in-flight requests finish before the process exits.',
      'Typical trigger: listen for SIGTERM (sent by orchestrators like Kubernetes before killing a pod) and close the server before exiting.'
    ],
    codeSnippet: `process.on('SIGTERM', async () => {
  await server.close();      // stop accepting new connections, finish in-flight ones
  await db.disconnect();     // close DB connections cleanly
  process.exit(0);
});`
  },
  {
    id: 'bff-ssr-csr-feature-flags',
    title: 'BFF, SSR vs CSR, and Feature Flags',
    summary: 'A trio of architecture/product patterns that show up when a Node.js backend serves more than one kind of frontend.',
    difficulty: 'intermediate',
    category: 'scaling',
    prerequisites: ['scalable-nodejs-architecture'],
    keyPoints: [
      'SSR (server renders HTML, SEO-friendly) vs CSR (browser renders, faster client interactions after initial load) , a rendering-strategy trade-off, not exclusive to Node but commonly implemented in it.',
      "BFF (Backend for Frontend): a separate backend tailored to each frontend's needs , e.g. a Mobile BFF and a Web BFF in front of the same core services.",
      'Feature flagging: enable/disable features without a redeployment (LaunchDarkly, Firebase Remote Config) , decouples deploy from release.'
    ]
  },

  // ─── RUNTIME (added) ─────────────────────────────────────────────────────────
  {
    id: 'nodejs-libuv-thread-pool',
    title: 'libuv & the Thread Pool: Is Node.js Really Single-Threaded?',
    summary:
      'JavaScript execution runs on one thread, but several built-in operations quietly run on a background thread pool underneath it.',
    difficulty: 'advanced',
    category: 'runtime',
    prerequisites: ['nodejs-event-loop'],
    keyPoints: [
      'The accurate interview answer to "is Node.js single-threaded?" is: your JavaScript runs on a single thread (the event loop), but Node.js as a whole is not , libuv, the C library underneath Node, maintains a separate worker pool for expensive operations.',
      'What actually runs on the thread pool: most fs operations (except the sync versions and FSWatcher), dns.lookup(), and specific CPU-heavy crypto functions (pbkdf2, scrypt, randomBytes, generateKeyPair) and zlib compression.',
      'Default pool size is 4 threads, controlled by the UV_THREADPOOL_SIZE environment variable , a common production tuning knob when an app does heavy concurrent file I/O or password hashing and threads become the bottleneck.',
      'Network I/O (http, most of net) does NOT use the thread pool at all , the OS kernel itself handles socket readiness asynchronously, which is what makes Node so efficient at high-concurrency networking specifically.',
      'This is exactly why CPU-bound JavaScript (a synchronous loop, JSON.parse on a huge payload) still blocks everything , that work runs on the main JS thread, not the libuv pool, and has no way to be silently offloaded like fs/crypto calls are.'
    ],
    gotcha:
      'Saying "Node.js is single-threaded" without qualification is the classic incomplete interview answer , it\'s true for JS execution, but several built-in async APIs are backed by a real, tunable thread pool underneath.',
    codeSnippet: `const fs = require('fs');
const crypto = require('crypto');

console.log('start');
fs.readFile('big-file.txt', () => console.log('file read done'));      // thread pool
crypto.pbkdf2('pw', 'salt', 100000, 32, 'sha256', () => console.log('hash done')); // thread pool
console.log('end');
// start, end, then file/hash callbacks , main thread never blocked

// Tune pool size for I/O or crypto-heavy workloads:
// UV_THREADPOOL_SIZE=8 node app.js`
  },
  {
    id: 'nodejs-stream-backpressure',
    title: 'Stream Backpressure',
    summary:
      'What happens when data is written to a stream faster than it can drain , and why .pipe() handles it for you but a manual write() loop doesn’t.',
    difficulty: 'advanced',
    category: 'runtime',
    prerequisites: ['nodejs-streams-buffers'],
    keyPoints: [
      'writable.write(chunk) returns false once the stream’s internal buffer has grown past its highWaterMark , that return value is the signal to stop writing more.',
      'Ignoring a false return and continuing to call write() in a tight loop doesn’t error immediately , Node just keeps buffering chunks in memory until it hits a limit, then the process aborts.',
      'When write() returns false, listen for the "drain" event , it fires once the buffer has emptied enough that writing can safely resume.',
      '.pipe(destination) implements exactly this write/drain dance internally , that’s why piping a Readable into a Writable is memory-safe by default, and a naive manual copy loop usually isn’t.',
      'This is the mechanism that lets Node.js stream a multi-gigabyte file without the process’s memory usage growing unbounded , the source is throttled to match how fast the destination can actually consume data.'
    ],
    gotcha:
      'A manual write() loop that never checks the return value is a classic memory-leak-under-load bug , it works fine in local testing with small files, then OOMs in production with large ones because nothing was throttling the writes.',
    codeSnippet: `// ❌ ignores backpressure — can exhaust memory on large input
for (let i = 0; i < 1_000_000; i++) writable.write(chunk);

// ✅ respects backpressure
function writeAll(writable, chunks, i = 0) {
  while (i < chunks.length) {
    const ok = writable.write(chunks[i++]);
    if (!ok) {
      writable.once('drain', () => writeAll(writable, chunks, i));
      return; // pause until drained
    }
  }
}

// ✅ simplest option — pipe() handles backpressure automatically
readable.pipe(writable);`
  }
];
