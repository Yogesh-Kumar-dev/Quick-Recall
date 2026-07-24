import type { QuizQuestion } from '@/types/content';

// ─── Node.js quiz — multiple choice ────────────────────────────────────────

export const nodejsQuiz: QuizQuestion[] = [
  {
    id: 'nodejs-q-single-threaded',
    question: 'Is Node.js single-threaded?',
    options: [
      'Yes, completely — there is no thread pool anywhere',
      'Your JavaScript runs on one thread, but libuv backs it with a thread pool for things like fs and dns.lookup',
      'No, Node spawns a new OS thread for every request',
      'It depends on whether you use async/await'
    ],
    correctIndex: 1,
    explanation: 'Network I/O uses the OS kernel directly (no pool), but some blocking APIs are offloaded to libuv\'s thread pool (default size 4).',
    category: 'Core'
  },
  {
    id: 'nodejs-q-npm-vs-npx',
    question: 'What is the difference between `npm` and `npx`?',
    options: [
      'They are interchangeable aliases',
      'npm installs packages into your project; npx executes a package\'s binary directly, installing it temporarily if needed',
      'npx only works with global packages',
      'npm is for production, npx is for development only'
    ],
    correctIndex: 1,
    explanation: 'npx is handy for running one-off CLI tools without adding them as a project dependency.',
    category: 'Tooling'
  },
  {
    id: 'nodejs-q-commonjs-vs-esm',
    question: 'What is a key difference between CommonJS and ES Modules in Node.js?',
    options: [
      'CommonJS uses require() and loads synchronously; ES Modules use import and load asynchronously',
      'ES Modules cannot be used in Node.js at all',
      'CommonJS is the modern standard; ES Modules are deprecated',
      'They have identical resolution and interop rules'
    ],
    correctIndex: 0,
    explanation: 'The two module systems have different resolution and interop rules, which is a common source of Node.js config friction.',
    category: 'Modules'
  },
  {
    id: 'nodejs-q-deps-vs-devdeps',
    question: 'What is the difference between `dependencies` and `devDependencies` in package.json?',
    options: [
      'devDependencies are needed at runtime in production; dependencies are dev-only',
      'dependencies are needed at runtime in production; devDependencies are dev-only tooling that never ships to production',
      'There is no functional difference, only documentation',
      'devDependencies are installed globally by default'
    ],
    correctIndex: 1,
    explanation: 'Tools like jest or eslint belong in devDependencies since they are never needed once the app is running in production.',
    category: 'Tooling'
  },
  {
    id: 'nodejs-q-eventemitter',
    question: 'What is Node\'s `EventEmitter` class used for?',
    options: [
      'Making HTTP requests',
      'The emitter/listener pattern — .on(name, cb) registers a listener, .emit(name, ...args) fires it',
      'Parsing JSON payloads',
      'Managing environment variables'
    ],
    correctIndex: 1,
    explanation: 'It is the basis of streams, HTTP servers, and most other async Node.js APIs.',
    category: 'Core'
  },
  {
    id: 'nodejs-q-code-eventemitter',
    question: 'What does this log?',
    code: `const emitter = new EventEmitter();
emitter.on('greet', (name) => console.log(\`Hello, \${name}\`));
emitter.emit('greet', 'World');
emitter.emit('greet', 'Again');`,
    options: ['"Hello, World" only', '"Hello, World" then "Hello, Again"', 'Nothing — emit must be called before on', 'A TypeError'],
    correctIndex: 1,
    explanation: 'Listeners registered with .on() stay subscribed and run on every matching .emit() call.',
    category: 'Core'
  },
  {
    id: 'nodejs-q-buffer',
    question: 'What is a Node.js `Buffer` used for?',
    options: [
      'Storing environment variables',
      'A fixed-size chunk of raw binary memory, used for file/network I/O and binary data outside the V8 heap',
      'Caching HTTP responses automatically',
      'Managing the event loop queue'
    ],
    correctIndex: 1,
    explanation: 'Buffers are fixed-size once allocated — resizing means creating a new one, not growing the existing one.',
    category: 'Core'
  },
  {
    id: 'nodejs-q-stream-backpressure',
    question: 'What happens if you keep calling `writable.write()` after it returns `false`?',
    options: [
      'Node automatically throttles the writes for you',
      'Node keeps buffering internally until it can run out of memory — you should wait for the "drain" event instead',
      'The extra writes are silently dropped',
      'It throws immediately'
    ],
    correctIndex: 1,
    explanation: 'This is backpressure — `.pipe()` handles waiting for drain automatically, which is why it\'s usually preferred over manual writes.',
    category: 'Streams'
  },
  {
    id: 'nodejs-q-callback-hell',
    question: '"Callback hell" refers to:',
    options: [
      'A Node.js process crashing repeatedly',
      'Deeply nested callbacks that make code unreadable and hard to maintain',
      'A memory leak caused by unresolved promises',
      'An error thrown from inside a callback'
    ],
    correctIndex: 1,
    explanation: 'Promises and async/await flatten the nesting back into sequential-looking code, which is why they largely replaced this pattern.',
    category: 'Async'
  },
  {
    id: 'nodejs-q-promise-states',
    question: 'A Promise can be in exactly one of which three states?',
    options: ['Started, running, finished', 'Pending, resolved/fulfilled, rejected', 'Open, closed, errored', 'Sync, async, deferred'],
    correctIndex: 1,
    explanation: 'A Promise settles exactly once, transitioning from pending into either fulfilled or rejected — never both.',
    category: 'Async'
  },
  {
    id: 'nodejs-q-async-await',
    question: 'What is true about an `async function` in JavaScript/Node.js?',
    options: [
      'It always returns the raw value you return from it',
      'It always returns a Promise, and `await` pauses execution inside it until that Promise settles',
      'It runs on a separate thread automatically',
      'It cannot use try/catch for error handling'
    ],
    correctIndex: 1,
    explanation: 'async/await is syntactic sugar over Promises that lets asynchronous code read like synchronous code.',
    category: 'Async'
  },
  {
    id: 'nodejs-q-env-vars',
    question: 'Why store configuration like `DB_URL` in environment variables instead of hardcoding it?',
    options: [
      'It makes the app run faster',
      'It keeps secrets and per-environment settings out of source control',
      'Node.js requires all config to be in environment variables',
      'It is the only way to read a value at runtime'
    ],
    correctIndex: 1,
    explanation: 'Environment-specific values (dev/staging/prod) can differ without touching the codebase itself.',
    category: 'Config'
  },
  {
    id: 'nodejs-q-http-status-codes',
    question: 'Which status code correctly means "the request was well-formed, but the server refuses to authorize it"?',
    options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
    correctIndex: 2,
    explanation: '401 means "not authenticated"; 403 means "authenticated, but not allowed" — a commonly mixed-up pair.',
    category: 'HTTP'
  },
  {
    id: 'nodejs-q-route-vs-query-params',
    question: 'What is the difference between a route param and a query param?',
    options: [
      'They are the same thing with different syntax',
      'A route param identifies a specific resource (/users/10); a query param modifies how a collection is fetched (/users?page=2)',
      'Query params can only be used with POST requests',
      'Route params are always optional'
    ],
    correctIndex: 1,
    explanation: 'Query params are typically used for filtering, sorting, and pagination rather than identifying a single resource.',
    category: 'HTTP'
  },
  {
    id: 'nodejs-q-api-gateway',
    question: 'What role does an API Gateway play in a microservices architecture?',
    options: [
      'It replaces the need for individual services entirely',
      'It acts as the single entry point, handling auth verification, rate limiting, routing, and response aggregation',
      'It only handles static asset caching',
      'It is a database proxy'
    ],
    correctIndex: 1,
    explanation: 'Centralizing these cross-cutting concerns means individual services don\'t each have to reimplement them.',
    category: 'Architecture'
  },
  {
    id: 'nodejs-q-blue-green-canary',
    question: 'What is the difference between blue-green and canary deployments?',
    options: [
      'They are identical strategies with different names',
      'Blue-green switches all traffic at once between two full environments; canary releases to a small % of users first',
      'Canary deployments require downtime; blue-green does not',
      'Blue-green only applies to database migrations'
    ],
    correctIndex: 1,
    explanation: 'Canary gives a lower blast radius if something is wrong, since only a fraction of users are affected initially.',
    category: 'Deployment'
  },
  {
    id: 'nodejs-q-cdn',
    question: 'What problem does a CDN solve?',
    options: [
      'It compiles JavaScript to a faster format',
      'It caches static content at edge locations close to users, reducing latency versus a single origin server',
      'It replaces the need for a backend database',
      'It handles user authentication'
    ],
    correctIndex: 1,
    explanation: 'By serving cached assets from a location physically closer to the user, round-trip time drops significantly.',
    category: 'Infrastructure'
  },
  {
    id: 'nodejs-q-code-version-check',
    question: 'What is the purpose of a tool like nvm?',
    code: `nvm install 20
nvm use 18`,
    options: [
      'It manages npm package versions inside a project',
      'It installs and switches between multiple Node.js versions on one machine',
      'It is a linting tool',
      'It is required to run any Node.js script'
    ],
    correctIndex: 1,
    explanation: 'Node version managers let different projects on the same machine use different Node.js versions without conflict.',
    category: 'Tooling'
  }
];
