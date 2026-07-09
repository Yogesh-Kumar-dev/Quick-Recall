import type { QuickRecallSection } from '@/types/content';

export const nodejsQuickRecall: QuickRecallSection[] = [
  {
    title: 'Node.js Core Cheatsheet',
    items: [
      {
        concept: 'Event loop phases',
        bullets: [
          'Timers (setTimeout/setInterval) → I/O callbacks → Idle/prepare → Poll (I/O execution) → Check (setImmediate) → Close callbacks',
          'Each phase drains its own FIFO queue before the loop moves on',
          'Heavy sync computation in any callback blocks every other request until it returns'
        ],
        warning:
          'One slow synchronous handler stalls the entire server, not just its own request , offload CPU work to worker threads or a queue.'
      },
      {
        concept: 'process.nextTick vs setImmediate vs setTimeout',
        bullets: [
          'process.nextTick(fn) , runs before the loop continues (microtask, not a phase)',
          'setImmediate(fn) , runs in the Check phase, after I/O in this iteration',
          'setTimeout(fn, ms) , runs in the Timers phase after (at least) the delay'
        ]
      },
      {
        concept: 'Streams',
        bullets: [
          'Readable, Writable, Duplex (both), Transform (Duplex that modifies data)',
          'Process data in chunks , avoids loading a whole file into memory',
          'e.g. streaming a 1GB upload instead of buffering it all → avoids a memory crash'
        ],
        codeSnippet: `fs.createReadStream('big.zip').pipe(fs.createWriteStream('copy.zip'));`
      },
      {
        concept: 'Stream backpressure',
        bullets: [
          'write() returns false once the internal buffer exceeds highWaterMark , stop writing',
          'Wait for the "drain" event before writing more',
          '.pipe() handles this automatically; a manual write() loop that ignores the return value can OOM under load'
        ]
      },
      {
        concept: 'Is Node.js single-threaded?',
        bullets: [
          'JS execution: yes, one thread (the event loop)',
          'But: libuv runs a thread pool (default 4, UV_THREADPOOL_SIZE) for fs, dns.lookup, and some crypto/zlib calls',
          'Network I/O uses the OS kernel directly , no thread pool involved there at all'
        ]
      },
      {
        concept: 'spawn vs exec vs fork',
        bullets: [
          'spawn , stream large data from a shell command',
          'exec , run a shell command, buffer its output',
          'fork , create another Node.js process with a built-in IPC channel'
        ]
      },
      {
        concept: 'cluster vs worker_threads',
        bullets: [
          'cluster , fork multiple Node instances (1 per CPU core) sharing one port → more request capacity',
          'worker_threads , run CPU-heavy JS (image resize, PDF gen) off the main thread',
          'child_process , run another program or Node script entirely'
        ]
      },
      {
        concept: 'Error handling categories',
        bullets: [
          'Sync errors → try/catch',
          'Async errors → callback error-first, or .catch()/try-catch with await',
          'Global/uncaught → process.on("uncaughtException") , last resort, log & exit, let the process manager restart',
          'Centralized Express error middleware registered last catches everything from the routes above it'
        ]
      }
    ]
  },
  {
    title: 'Scaling & DevOps Cheatsheet',
    items: [
      {
        concept: 'Horizontal vs vertical scaling',
        bullets: ['Vertical , bigger machine (more CPU/RAM)', 'Horizontal , more machines', 'Node.js apps typically scale horizontally']
      },
      {
        concept: 'Load balancing & circuit breaker',
        bullets: [
          'Load balancer distributes traffic across servers (Nginx, AWS ELB)',
          'Circuit breaker stops retrying a failing downstream service and returns a fallback instead of cascading the failure'
        ]
      },
      {
        concept: 'Caching strategies',
        bullets: [
          'Cache-aside , check cache, on miss fetch DB then populate cache',
          'Write-through , write to cache and DB together',
          'Write-back , write to cache first, DB later',
          'Invalidate via TTL expiration, manual, or event-driven'
        ]
      },
      {
        concept: 'Message queues & Pub/Sub',
        bullets: [
          'RabbitMQ / Kafka / BullMQ (Redis-based) for background jobs, emails, payments, order fulfillment',
          'Pub/Sub: one publisher event fans out to many independent subscribers',
          'Kafka specifically: event streaming, log aggregation, real-time analytics'
        ]
      },
      {
        concept: 'SQL vs NoSQL',
        bullets: ['SQL , transactions, structured/relational data (banking)', 'NoSQL , high scalability, flexible schema (social feeds)']
      },
      {
        concept: 'ACID properties',
        bullets: ['Atomicity, Consistency, Isolation, Durability', 'Expected in transactional systems like payments']
      },
      {
        concept: 'Sharding vs replication',
        bullets: [
          'Sharding , split DB into smaller pieces (e.g. by region) to scale writes/storage',
          'Replication , copy data across servers for HA + fault tolerance'
        ]
      },
      {
        concept: 'Deployment strategies',
        bullets: [
          'Blue-green , two environments, switch all traffic at once after testing',
          'Canary , release to a small % of users first, monitor, then roll out fully',
          'Rolling , gradually replace instances (Kubernetes-native)',
          'Always pair with a rollback strategy: revert to the last stable version on failure'
        ]
      },
      {
        concept: 'Observability stack',
        bullets: [
          'Logging (Winston/Pino) , log request id, user id, error stack',
          'Monitoring (Prometheus/Grafana/Datadog) , system health',
          'Distributed tracing (Jaeger/Zipkin) , track one request across microservices',
          'Health check endpoint (GET /health) , polled by load balancers'
        ]
      },
      {
        concept: 'Graceful shutdown',
        bullets: [
          'Listen for SIGTERM',
          'Stop accepting new connections, finish in-flight requests',
          'Close DB connections cleanly before exiting'
        ],
        codeSnippet: `process.on('SIGTERM', async () => {
  await server.close();
  await db.disconnect();
  process.exit(0);
});`
      }
    ]
  }
];
