import type { Flashcard } from '@/types/content';

// ─── Node.js flashcards — keyword/abbreviation defs + small Q&A ───────────────
// Distilled from the "Top 90+ Node.js Backend Interview Questions" deck.

export const nodejsFlashcards: Flashcard[] = [
  {
    id: 'node-npm-vs-npx',
    front: 'npm vs npx',
    back: "npm installs packages into your project. npx executes a package's binary directly (installing it temporarily if needed) , useful for one-off CLI tools without adding them as a dependency.",
    category: 'Q&A'
  },
  {
    id: 'node-commonjs-vs-esm',
    front: 'CommonJS vs ES Modules',
    back: 'CommonJS uses require() and loads synchronously. ES Modules use import and load asynchronously , the modern standard, but the two have different resolution/interop rules in Node.',
    category: 'Q&A'
  },
  {
    id: 'node-callback-hell',
    front: 'Callback hell',
    back: 'Deeply nested callbacks that make code unreadable and hard to maintain. Fixed by Promises or async/await, which flatten the nesting back into sequential-looking code.',
    category: 'Keyword'
  },
  {
    id: 'node-promise-states',
    front: 'The 3 states of a Promise',
    back: 'Pending (not yet settled), Resolved/Fulfilled (completed successfully), Rejected (failed) , a Promise settles exactly once, into Resolved or Rejected.',
    category: 'Keyword'
  },
  {
    id: 'node-async-await',
    front: 'async/await',
    back: 'Syntactic sugar over Promises that lets asynchronous code read like synchronous code , an async function always returns a Promise, and await pauses execution until it settles.',
    category: 'Keyword'
  },
  {
    id: 'node-env-variables',
    front: 'Environment variables (.env)',
    back: 'Key-value config (PORT, DB_URL, ...) stored outside the codebase and loaded at runtime , keeps secrets and per-environment settings out of source control.',
    category: 'Keyword'
  },
  {
    id: 'node-repl',
    front: 'REPL',
    back: "Read-Eval-Print Loop , Node's interactive shell (just run `node`), used for quick experimentation and interactive debugging.",
    category: 'Keyword'
  },
  {
    id: 'node-package-json',
    front: 'package.json',
    back: 'The project manifest , manages dependencies, npm scripts (e.g. "start": "node server.js"), and metadata (name, version, ...).',
    category: 'Keyword'
  },
  {
    id: 'node-deps-vs-devdeps',
    front: 'dependencies vs devDependencies',
    back: 'dependencies are needed at runtime in production. devDependencies are dev-only tooling (jest, eslint, ...) that never ships to production.',
    category: 'Q&A'
  },
  {
    id: 'node-route-vs-query-params',
    front: 'Route params vs query params',
    back: 'Route param identifies a specific resource: /users/10. Query param modifies how a collection is fetched: /users?page=2 , filtering, sorting, pagination.',
    category: 'Q&A'
  },
  {
    id: 'node-http-status-codes',
    front: 'HTTP status code cheat sheet',
    back: '200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error , the core set every API interview expects you to know cold.',
    category: 'Keyword'
  },
  {
    id: 'node-cdn',
    front: 'CDN (Content Delivery Network)',
    back: 'Caches static content (images, JS/CSS files) at edge locations close to users worldwide , e.g. Cloudflare , reducing latency versus serving from a single origin server.',
    category: 'Keyword'
  },
  {
    id: 'node-bff',
    front: 'BFF (Backend for Frontend)',
    back: "A separate backend tailored to a specific frontend's needs , e.g. a Mobile BFF and a Web BFF sitting in front of the same core services, each shaping responses for its client.",
    category: 'Keyword'
  },
  {
    id: 'node-feature-flagging',
    front: 'Feature flagging',
    back: 'Enable or disable features at runtime without redeploying (LaunchDarkly, Firebase Remote Config) , decouples "deploying code" from "releasing a feature to users."',
    category: 'Keyword'
  },
  {
    id: 'node-ssr-vs-csr',
    front: 'SSR vs CSR (Node ecosystem)',
    back: 'SSR: the server renders HTML , better for SEO. CSR: the browser renders the page after JS loads , faster subsequent client interactions once loaded.',
    category: 'Q&A'
  },
  {
    id: 'node-kafka-use-cases',
    front: 'What is Kafka used for?',
    back: 'High-throughput event streaming, log aggregation, and real-time analytics (e.g. tracking user activity events) , built for ordered event logs, not just simple job queues.',
    category: 'Q&A'
  },
  {
    id: 'node-blue-green-vs-canary',
    front: 'Blue-green vs canary deployment',
    back: "Blue-green: two full environments, switch all traffic at once after testing the new one. Canary: release to a small % of users first, monitor, then roll out fully , lower blast radius if something's wrong.",
    category: 'Q&A'
  },
  {
    id: 'node-api-gateway-role',
    front: 'What does an API Gateway do?',
    back: 'Acts as the single entry point for a microservices architecture , handles auth verification, rate limiting, routing, and response aggregation (Kong, NGINX, AWS API Gateway).',
    category: 'Q&A'
  },
  {
    id: 'node-eventemitter',
    front: 'EventEmitter',
    back: "Node's core class (from the events module) for the emitter/listener pattern: .on('name', cb) registers a listener, .emit('name', ...args) fires it. The basis of streams, HTTP servers, and most async Node APIs.",
    category: 'Keyword'
  },
  {
    id: 'node-buffer-class',
    front: 'Buffer',
    back: 'A fixed-size chunk of raw binary memory, outside the V8 heap , used for file/network I/O and binary data (Buffer.from(), Buffer.alloc()). Fixed size after allocation; resizing means creating a new one.',
    category: 'Keyword'
  },
  {
    id: 'node-version-managers',
    front: 'nvm / n / nvs',
    back: 'Node version managers , install and switch between multiple Node.js versions on one machine without touching the system install. `node -v` confirms which one is active.',
    category: 'Keyword'
  }
];
