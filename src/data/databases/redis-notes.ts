import type { Note } from '@/types/content';

// ─── Redis notes — the most commonly asked Redis interview questions
// (based on the Devinterview Redis list, beginner → intermediate) ───────────────

export const redisNotes: Note[] = [
  // ─── BASICS ─────────────────────────────────────────────────────────────────
  {
    id: 'redis-what-is-redis',
    title: 'What is Redis and what do you use it for?',
    summary:
      'An in-memory key-value data store with rich data structures — used for caching, sessions, queues, leaderboards, rate limiting, and pub/sub.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'All data lives in RAM → sub-millisecond reads/writes; persistence to disk is optional.',
      'Not just strings: lists, hashes, sets, sorted sets, streams, bitmaps, HyperLogLog, geo.',
      'Single-threaded command execution — every command is atomic, no locks needed.',
      'Typical roles: cache in front of a database, session store, job queue, real-time counters/leaderboards, pub/sub bus.'
    ]
  },
  {
    id: 'redis-single-threaded',
    title: 'How is single-threaded Redis so fast?',
    summary:
      'RAM access, an event loop with non-blocking I/O, and simple O(1)/O(log n) data structures — no lock contention, no disk waits on the hot path.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['redis-what-is-redis'],
    keyPoints: [
      'Memory access is ~100,000x faster than disk; the network round trip dominates, not Redis itself.',
      'One thread executes commands sequentially → atomicity for free, zero locking overhead.',
      'Since Redis 6, I/O (socket reads/writes) can use extra threads — command execution stays single-threaded.',
      'The flip side: one slow command (KEYS *, huge SMEMBERS, long Lua script) blocks EVERYONE — the root of most Redis production incidents.'
    ],
    gotcha: 'Never run KEYS in production — it scans every key while blocking the event loop. Use SCAN (cursor-based, incremental) instead.'
  },
  {
    id: 'redis-keys-naming',
    title: 'Redis keys — naming and best practices',
    summary: 'Keys are arbitrary binary strings; the convention is colon-namespaced names like user:42:profile.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['redis-what-is-redis'],
    keyPoints: [
      "Convention: object-type:id:field — 'user:42:session', 'cart:42'. Consistent schemes make debugging and SCAN patterns workable.",
      'Keep keys reasonably short (they cost memory too) but readable — do not over-abbreviate.',
      'Max key/value size is 512MB, but big values are an anti-pattern (block the loop, hog bandwidth).',
      'EXISTS, DEL/UNLINK, TYPE, TTL, RENAME — the everyday key-management commands (UNLINK deletes big keys without blocking).'
    ]
  },
  {
    id: 'redis-set-get',
    title: 'SET and GET (and SET options)',
    summary: 'The core string commands — SET stores a value with optional expiry and existence conditions; GET retrieves it or nil.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['redis-keys-naming'],
    keyPoints: [
      'SET key value EX 60 — value plus a 60s TTL in one atomic command.',
      'SET ... NX = only if key does NOT exist (the building block of locks); XX = only if it exists.',
      'GET returns nil for missing keys; MSET/MGET batch multiple keys in one round trip.',
      'Strings are binary-safe: numbers, JSON blobs, or serialized objects all fit.'
    ],
    codeSnippet: `SET session:abc123 '{"userId":42}' EX 3600 NX
GET session:abc123
INCR page:views          -- strings double as atomic counters`
  },
  {
    id: 'redis-expiration',
    title: 'Key expiration: EXPIRE, TTL, PERSIST',
    summary:
      'Any key can be given a time-to-live after which Redis deletes it — the mechanism behind cache freshness and session timeouts.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['redis-set-get'],
    keyPoints: [
      'EXPIRE key 3600 sets a TTL; SET ... EX does it atomically at write time.',
      'TTL key → remaining seconds; -1 = no expiry, -2 = key does not exist. PERSIST removes the TTL.',
      'Expired keys are removed lazily (on access) plus by an active random sampler — expiry is near-real-time, not to-the-millisecond.',
      'Overwriting a value with a plain SET clears any existing TTL — use KEEPTTL to keep it (a subtle classic bug).'
    ]
  },
  {
    id: 'redis-counters',
    title: 'Atomic counters: INCR and friends',
    summary: 'INCR/INCRBY/DECR atomically change an integer stored in a string — the standard tool for counts, rate limits, and IDs.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['redis-set-get'],
    keyPoints: [
      'Atomic because Redis is single-threaded — two clients INCRing concurrently never lose an update.',
      'INCR on a missing key treats it as 0 → returns 1; errors if the value is not an integer.',
      'HINCRBY increments a field inside a hash (per-item counters in one key); INCRBYFLOAT for decimals.',
      'Rate-limiter core: INCR requests:user42:minute, and on first increment EXPIRE it for 60s.'
    ]
  },

  // ─── DATA TYPES ─────────────────────────────────────────────────────────────
  {
    id: 'redis-data-types',
    title: 'What data types can you store in Redis?',
    summary: 'Strings, lists, hashes, sets, sorted sets — plus streams, bitmaps, HyperLogLog, and geospatial indexes for specialized jobs.',
    difficulty: 'basic',
    category: 'data types',
    prerequisites: ['redis-what-is-redis'],
    keyPoints: [
      'String: any blob, counters. List: ordered, push/pop both ends — queues.',
      'Hash: field→value map under one key — objects. Set: unordered unique members.',
      'Sorted set (zset): unique members ordered by a score — leaderboards, priority queues.',
      'Specialized: Stream (append-only log), Bitmap, HyperLogLog (approximate counting), Geo.',
      'Pick the structure that matches the operations you need — that is the whole interview question behind "which type would you use for X?"'
    ]
  },
  {
    id: 'redis-hashes',
    title: 'Hashes — storing objects',
    summary: 'A field→value map under one key: HSET user:42 name "Ada" age 36 — the natural shape for an object or a group of counters.',
    difficulty: 'basic',
    category: 'data types',
    prerequisites: ['redis-data-types'],
    keyPoints: [
      'HSET/HGET/HGETALL/HDEL/HEXISTS; HINCRBY for per-field counters.',
      'Read or update ONE field without touching the rest — vs serializing a whole JSON blob into a string.',
      'Memory-efficient for small hashes (listpack encoding under the hood).',
      'Tradeoff vs a JSON string: hashes give per-field access but values are flat strings — no nesting.'
    ],
    codeSnippet: `HSET user:42 name "Ada" plan "pro" logins 0
HINCRBY user:42 logins 1
HGET user:42 plan          -- read one field
HGETALL user:42            -- read the whole object`
  },
  {
    id: 'redis-lists',
    title: 'Lists — queues and recent-N feeds',
    summary:
      'A doubly-linked list you push/pop from either end — LPUSH + RPOP is a FIFO queue; LPUSH + LTRIM is a capped "latest items" feed.',
    difficulty: 'basic',
    category: 'data types',
    prerequisites: ['redis-data-types'],
    keyPoints: [
      'LPUSH/RPUSH add, LPOP/RPOP remove; LRANGE reads a slice; LLEN counts.',
      'Queue: producers LPUSH, workers RPOP (or BRPOP to block until work arrives).',
      'Capped feed: LPUSH activity:42 item then LTRIM activity:42 0 99 keeps the newest 100.',
      'Head/tail ops are O(1); LINDEX/LINSERT in the middle are O(n) — lists are ends-oriented.'
    ]
  },
  {
    id: 'redis-blocking-ops',
    title: 'Blocking list operations (BLPOP/BRPOP)',
    summary: 'Blocking pops let workers wait for new items without polling — the simplest possible job queue.',
    difficulty: 'intermediate',
    category: 'data types',
    prerequisites: ['redis-lists'],
    keyPoints: [
      'BRPOP queue 5 — waits up to 5s (0 = forever) for an element, then pops atomically.',
      'Multiple blocked workers: each item wakes exactly one — free work distribution.',
      'BLMOVE source dest atomically pops and pushes to a "processing" list — the reliable-queue pattern (re-queue on crash).',
      'For consumer groups, acknowledgements, and replay, graduate to Redis Streams.'
    ]
  },
  {
    id: 'redis-sets',
    title: 'Sets — uniqueness and set algebra',
    summary: 'Unordered collections of unique strings with O(1) membership checks and server-side union/intersection/difference.',
    difficulty: 'basic',
    category: 'data types',
    prerequisites: ['redis-data-types'],
    keyPoints: [
      'SADD/SREM/SISMEMBER/SCARD/SMEMBERS (careful with huge sets — use SSCAN).',
      'SINTER likes:postA likes:postB — mutual likers; SUNION, SDIFF for the other algebra.',
      'Perfect for: tags, unique visitors, "has user X already done Y?", follower sets.',
      'SRANDMEMBER/SPOP give random members — sampling and raffle patterns.'
    ]
  },
  {
    id: 'redis-sorted-sets',
    title: 'Sorted sets — leaderboards and rankings',
    summary: 'Unique members each carrying a numeric score, kept permanently sorted — top-N and rank queries are O(log n).',
    difficulty: 'intermediate',
    category: 'data types',
    prerequisites: ['redis-sets'],
    keyPoints: [
      'ZADD leaderboard 5300 "ada" — add/update score; ZINCRBY to bump it.',
      "ZREVRANGE leaderboard 0 9 WITHSCORES — top 10; ZREVRANK — a player's position; ZSCORE — their score.",
      'ZRANGEBYSCORE for score windows — also great for scheduled/delayed jobs (score = run-at timestamp).',
      'The go-to answer for "design a leaderboard" — say sorted set before anything else.'
    ],
    codeSnippet: `ZINCRBY leaderboard 100 "ada"        -- ada earns 100 points
ZREVRANGE leaderboard 0 9 WITHSCORES -- top 10
ZREVRANK leaderboard "ada"           -- ada's rank (0-based)`
  },
  {
    id: 'redis-hyperloglog',
    title: 'HyperLogLog — counting unique things cheaply',
    summary:
      'A probabilistic structure that estimates unique counts (±0.81%) in just 12KB — regardless of whether you count thousands or billions.',
    difficulty: 'intermediate',
    category: 'data types',
    prerequisites: ['redis-sets'],
    keyPoints: [
      'PFADD visitors:today user42; PFCOUNT visitors:today — approximate distinct count.',
      'A real set of 100M user IDs costs gigabytes; the HLL costs 12KB — that is the entire pitch.',
      'PFMERGE combines days into weekly/monthly uniques.',
      'You cannot ask "is X a member?" — only "how many uniques?" Membership needs a real set (or bloom filter module).'
    ]
  },
  {
    id: 'redis-bitmaps',
    title: 'Bitmaps — flags per user for pennies',
    summary:
      'Bit operations on a string: one bit per user/day gives daily-active tracking, feature flags, or attendance at ~12MB per 100M users.',
    difficulty: 'intermediate',
    category: 'data types',
    prerequisites: ['redis-data-types'],
    keyPoints: [
      'SETBIT active:2026-07-17 <userId> 1; GETBIT to check; BITCOUNT for how many.',
      'BITOP AND/OR/XOR across days answers "active today AND yesterday" (retention).',
      'Works best with dense integer IDs — sparse/huge IDs waste space.',
      'Classic interview use: "how would you track daily active users memory-efficiently?"'
    ]
  },
  {
    id: 'redis-streams',
    title: 'Redis Streams — the append-only log',
    summary: "A durable, replayable event log with consumer groups — Redis's answer to lightweight Kafka use cases.",
    difficulty: 'intermediate',
    category: 'data types',
    prerequisites: ['redis-lists', 'redis-pubsub'],
    keyPoints: [
      'XADD events * field value appends (auto IDs are timestamp-based); XRANGE/XREAD read by ID or block for new entries.',
      'Consumer groups (XGROUP, XREADGROUP, XACK): each message goes to one consumer in the group, unacked messages can be reclaimed (XAUTOCLAIM) — at-least-once delivery.',
      'Unlike pub/sub, messages persist and can be replayed; unlike lists, many consumers/groups can read the same stream.',
      'Cap growth with XADD ... MAXLEN ~ 100000 or XTRIM.'
    ]
  },
  {
    id: 'redis-geo',
    title: 'Geospatial commands',
    summary:
      'GEOADD stores coordinates (in a sorted set under the hood); GEOSEARCH finds members within a radius or box — "drivers near me" in two commands.',
    difficulty: 'intermediate',
    category: 'data types',
    prerequisites: ['redis-sorted-sets'],
    keyPoints: [
      'GEOADD drivers 13.361 38.115 "driver:42" — longitude first!',
      'GEOSEARCH drivers FROMLONLAT 13.36 38.11 BYRADIUS 5 km ASC — nearest within 5km.',
      'GEODIST for distance between two members.',
      'Implemented as geohash scores in a zset — so ZREM removes members, and zset ops apply.'
    ]
  },

  // ─── CACHING ────────────────────────────────────────────────────────────────
  {
    id: 'redis-cache-aside',
    title: 'Caching patterns: cache-aside, write-through, write-behind',
    summary: 'Cache-aside (lazy loading) is the default: read cache → miss → read DB → fill cache with a TTL.',
    difficulty: 'intermediate',
    category: 'caching',
    prerequisites: ['redis-expiration'],
    keyPoints: [
      'Cache-aside: app owns the logic; simple, cache only holds what is asked for; first request per key is a miss.',
      'Write-through: write to cache + DB together — reads always warm, writes slower.',
      'Write-behind: write to cache, flush to DB async — fastest writes, risk of loss on crash.',
      'Invalidation on update: either DELETE the key (next read refills) or overwrite it — deleting is safer than trying to keep copies in sync.'
    ],
    codeSnippet: `// cache-aside read path
let user = await redis.get(\`user:\${id}\`);
if (!user) {
  user = await db.users.findById(id);
  await redis.set(\`user:\${id}\`, JSON.stringify(user), 'EX', 300);
}
`
  },
  {
    id: 'redis-cache-problems',
    title: 'Cache stampede, penetration, and hot keys',
    summary: 'The three classic cache failure modes — and the mitigations interviewers want to hear.',
    difficulty: 'intermediate',
    category: 'caching',
    prerequisites: ['redis-cache-aside'],
    keyPoints: [
      'Stampede (thundering herd): a popular key expires and 1,000 requests hit the DB at once. Fixes: per-key mutex/lock so one request refills, staggered/jittered TTLs, serve-stale-while-refreshing.',
      "Penetration: requests for keys that don't exist anywhere bypass the cache every time. Fixes: cache the negative result briefly, or a bloom filter of valid IDs.",
      'Hot key: one key gets extreme traffic and pins a single node/CPU. Fixes: local in-process cache on top, or split the key into N copies and read a random one.',
      'Avalanche: many keys expiring simultaneously (deploy-time mass fill) — jitter your TTLs.'
    ]
  },
  {
    id: 'redis-session-store',
    title: 'Redis as a session store',
    summary: 'Sessions are small, hot, expiring, and shared across app servers — exactly the shape Redis is built for.',
    difficulty: 'basic',
    category: 'caching',
    prerequisites: ['redis-expiration', 'redis-hashes'],
    keyPoints: [
      'Key session:<id> as a hash or JSON string; TTL = session timeout; touching the session refreshes the TTL (sliding expiry).',
      'Centralized sessions mean any app instance can serve any user — no sticky load-balancer sessions.',
      'Logout = DEL; expiry cleans up abandoned sessions automatically.',
      'Compare with JWTs when asked: server-side sessions are revocable and smaller on the wire; JWTs avoid the lookup.'
    ]
  },
  {
    id: 'redis-rate-limiting',
    title: 'How would you build a rate limiter with Redis?',
    summary: 'Fixed window: INCR a per-user-per-window key with a TTL; sliding window: a sorted set of request timestamps.',
    difficulty: 'intermediate',
    category: 'caching',
    prerequisites: ['redis-counters', 'redis-sorted-sets'],
    keyPoints: [
      'Fixed window: INCR rl:user42:12:05 → if result is 1, EXPIRE 60; reject when count > limit. Simple; bursts at window edges.',
      'Sliding window log: ZADD timestamps, ZREMRANGEBYSCORE to drop old ones, ZCARD to count — accurate, more memory.',
      'Wrap multi-step versions in a Lua script so check-and-increment is atomic under concurrency.',
      'A staple system-design question — know fixed window + one improvement.'
    ],
    codeSnippet: `local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return count -- reject in app code if count > limit`
  },
  {
    id: 'redis-vs-database',
    title: 'Can Redis be a primary database? Redis vs traditional DBs',
    summary:
      'It can hold primary data (with persistence + replication), but for most systems Redis complements a disk-based database rather than replacing it.',
    difficulty: 'intermediate',
    category: 'caching',
    prerequisites: ['redis-persistence'],
    keyPoints: [
      'For it: persistence (AOF), replication, transactions, modules (JSON, search) — some teams do run it as the system of record for specific data (sessions, carts, real-time state).',
      'Against it: dataset must fit in RAM (expensive), weaker durability defaults than a WAL-first database, limited ad-hoc querying — no joins, no rich secondary indexes without modules.',
      'Standard architecture: source of truth in Postgres/Mongo, Redis in front for speed — each tool for its job.',
      'Interview answer shape: "yes, technically, for the right data — here are the tradeoffs" beats a flat yes/no.'
    ]
  },

  // ─── PERSISTENCE & DURABILITY ───────────────────────────────────────────────
  {
    id: 'redis-persistence',
    title: 'How does Redis handle persistence?',
    summary:
      'Two mechanisms: RDB snapshots (periodic point-in-time dumps) and AOF (append-only log of every write) — usable alone, together, or not at all.',
    difficulty: 'intermediate',
    category: 'persistence & durability',
    prerequisites: ['redis-what-is-redis'],
    keyPoints: [
      'RDB: compact binary snapshot, written by a forked child (SAVE blocks — use BGSAVE); config like save 900 1 / save 60 10000.',
      'AOF: every write command appended to a log, replayed on restart; fsync policy controls durability (always / everysec / no).',
      'Both off = pure cache: fastest, data gone on restart — a legitimate choice for cache-only workloads.',
      'Recommended for durable setups: both — AOF for minimal loss, RDB for fast restarts and compact backups.'
    ]
  },
  {
    id: 'redis-rdb-vs-aof',
    title: 'RDB vs AOF — tradeoffs',
    summary:
      'RDB is fast and compact but can lose minutes of data; AOF loses at most ~1 second (everysec) but files are bigger and restarts slower.',
    difficulty: 'intermediate',
    category: 'persistence & durability',
    prerequisites: ['redis-persistence'],
    keyPoints: [
      'RDB pros: single small file, fastest restart, great for backups/DR; cons: everything since the last snapshot is lost on crash.',
      'AOF pros: at most one second of loss with everysec (default), human-readable log; cons: larger files, slower replay, periodic rewrite (BGREWRITEAOF) needed to compact.',
      'fsync always = maximum durability, big throughput hit; no = leave it to the OS (~30s risk).',
      'The fork for BGSAVE/rewrite uses copy-on-write memory — a heavily-written instance can briefly need extra RAM (classic ops gotcha).'
    ]
  },
  {
    id: 'redis-backups',
    title: 'Backups and forcing a dump to disk',
    summary: 'RDB files ARE the backup format: trigger BGSAVE, then copy dump.rdb somewhere safe.',
    difficulty: 'basic',
    category: 'persistence & durability',
    prerequisites: ['redis-persistence'],
    keyPoints: [
      'BGSAVE forks and writes the snapshot without blocking clients (SAVE blocks — avoid in prod).',
      'LASTSAVE timestamp confirms completion; then archive the file (S3, etc.) — RDB files are portable across versions reasonably well.',
      'Restore = place the RDB (or AOF) in the data dir and start Redis.',
      'Managed Redis (ElastiCache, Redis Cloud) automates snapshots — but the RDB/AOF story is what interviews test.'
    ]
  },

  // ─── ATOMICITY: TRANSACTIONS & LUA ──────────────────────────────────────────
  {
    id: 'redis-transactions',
    title: 'Redis transactions: MULTI/EXEC and WATCH',
    summary: 'MULTI queues commands and EXEC runs them as an uninterrupted batch; WATCH adds optimistic check-and-set across keys.',
    difficulty: 'intermediate',
    category: 'transactions & scripting',
    prerequisites: ['redis-set-get'],
    keyPoints: [
      'MULTI ... commands ... EXEC — all queued commands run back-to-back with nothing interleaved; DISCARD cancels.',
      'No rollback: if a command fails mid-EXEC (e.g. wrong type), the rest still run — Redis transactions are atomic in isolation, not in error recovery.',
      "You cannot read a value mid-transaction and act on it — results only arrive after EXEC (that's what Lua is for).",
      'WATCH key: if the watched key changes before EXEC, the transaction aborts (returns nil) — retry loop implements optimistic locking.'
    ],
    gotcha:
      '"What are the limitations of Redis transactions?" → no rollback, no conditional logic mid-transaction — the expected answer, plus "use Lua for that".'
  },
  {
    id: 'redis-lua',
    title: 'Lua scripting — atomic multi-step logic',
    summary: 'EVAL runs a Lua script server-side as one atomic unit — read, decide, and write with no other command interleaving.',
    difficulty: 'intermediate',
    category: 'transactions & scripting',
    prerequisites: ['redis-transactions'],
    keyPoints: [
      'EVAL "return redis.call(\'GET\', KEYS[1])" 1 mykey — KEYS for key names, ARGV for values.',
      'The whole script is atomic — solves check-then-act (rate limits, safe lock release, conditional updates) that MULTI/EXEC cannot express.',
      'SCRIPT LOAD + EVALSHA avoids resending the script body each call.',
      'Scripts block the server while running — keep them tiny; a slow loop in Lua freezes all of Redis.'
    ]
  },
  {
    id: 'redis-distributed-locks',
    title: 'Distributed locks with Redis',
    summary: 'SET lock:resource token NX EX 10 acquires a lock; release must verify the token in Lua so you only delete your own lock.',
    difficulty: 'intermediate',
    category: 'transactions & scripting',
    prerequisites: ['redis-set-get', 'redis-lua'],
    keyPoints: [
      'NX = only one client wins; EX = the lock self-expires so a crashed holder cannot deadlock everyone.',
      'Store a random token as the value; release with a Lua script: GET == my token → DEL. A plain DEL can free a lock someone else re-acquired after your TTL expired.',
      'TTL must exceed the longest critical section — or the work outlives the lock (renew/watchdog if needed).',
      'Mention Redlock (multi-node algorithm) and its debates for bonus points; for a single Redis, SET NX EX + token-checked release is the expected answer.'
    ],
    codeSnippet: `SET lock:report r4nd0m NX EX 10   -- acquire

-- release (Lua, atomic):
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0`
  },
  {
    id: 'redis-pipelining',
    title: 'What is pipelining?',
    summary: 'Sending many commands without waiting for each reply — one network round trip instead of N, often a 10x+ throughput win.',
    difficulty: 'intermediate',
    category: 'transactions & scripting',
    prerequisites: ['redis-set-get'],
    keyPoints: [
      'Latency math: 1,000 commands at 1ms RTT = 1 second sequential, ~a few ms pipelined.',
      "Not atomic — other clients' commands can interleave between yours (unlike MULTI/EXEC, which can be combined with pipelining).",
      'Most client libraries expose it (pipeline() in ioredis/redis-py); MGET/MSET are simpler wins when it is one command type.',
      'Use for bulk loads, cache warm-ups, multi-key reads on one request path.'
    ]
  },

  // ─── PUB/SUB & MESSAGING ────────────────────────────────────────────────────
  {
    id: 'redis-pubsub',
    title: 'The Pub/Sub model in Redis',
    summary: 'PUBLISH sends a message to a channel; every current SUBSCRIBEr receives it — fire-and-forget broadcast, nothing stored.',
    difficulty: 'intermediate',
    category: 'pub/sub & messaging',
    prerequisites: ['redis-what-is-redis'],
    keyPoints: [
      'SUBSCRIBE news; PUBLISH news "hello" — decoupled: publishers don\'t know subscribers.',
      'PSUBSCRIBE news.* — pattern subscriptions.',
      'At-most-once: offline subscribers miss messages forever; no acks, no replay, no persistence.',
      'Good for: live notifications, chat fan-out, cache-invalidation broadcasts. Wrong for: anything that must not be lost.'
    ]
  },
  {
    id: 'redis-queue-vs-pubsub-vs-streams',
    title: 'Message broker roles: list queue vs pub/sub vs streams',
    summary: 'Three messaging tools with different guarantees — pick by delivery semantics, not habit.',
    difficulty: 'intermediate',
    category: 'pub/sub & messaging',
    prerequisites: ['redis-blocking-ops', 'redis-pubsub', 'redis-streams'],
    keyPoints: [
      'List (LPUSH/BRPOP): each message consumed by exactly one worker; persists until popped; no fan-out, no replay.',
      'Pub/Sub: broadcast to all current listeners; zero persistence — miss it and it is gone.',
      'Streams: persistent log + consumer groups + acks + replay — closest to Kafka; the right default for real job/event pipelines in Redis.',
      'When durability, retries, and dead-letter handling get serious, name a dedicated broker (RabbitMQ/Kafka/SQS) as the graduation path.'
    ]
  },

  // ─── SCALING: REPLICATION, SENTINEL, CLUSTER ────────────────────────────────
  {
    id: 'redis-replication',
    title: 'Redis replication',
    summary:
      'Replicas connect to a primary with REPLICAOF and receive a copy of the dataset plus a live command stream — for read scaling and failover readiness.',
    difficulty: 'intermediate',
    category: 'scaling & cluster',
    prerequisites: ['redis-persistence'],
    keyPoints: [
      'Asynchronous by default: a write acknowledged by the primary can be lost if it dies before replicating (WAIT can demand N replica acks).',
      'Replicas are read-only by default — point read-heavy traffic at them.',
      'Initial sync = RDB snapshot transfer, then continuous command streaming; partial resync after short disconnects.',
      "Replication alone has no automatic failover — that is Sentinel's (or Cluster's) job."
    ]
  },
  {
    id: 'redis-sentinel',
    title: 'How does Redis Sentinel work?',
    summary:
      'Sentinel processes monitor the primary, agree it is down (quorum), elect a leader among themselves, and promote a replica — automatic failover for a non-clustered setup.',
    difficulty: 'intermediate',
    category: 'scaling & cluster',
    prerequisites: ['redis-replication'],
    keyPoints: [
      'Run 3+ sentinels (odd number) on separate hosts; quorum prevents split-brain false positives.',
      'Failover: subjective down → quorum agrees objective down → a sentinel promotes the best replica → other replicas re-point → clients get the new address.',
      'Clients connect THROUGH sentinel discovery ("ask sentinel who the primary is") — sentinel-aware client libraries handle this.',
      'Sentinel = HA for one dataset; it does not shard data — that is Cluster.'
    ]
  },
  {
    id: 'redis-cluster',
    title: 'What is Redis Cluster?',
    summary:
      'Native sharding: the keyspace is split into 16,384 hash slots spread across primaries (each with replicas) — horizontal scale plus built-in failover.',
    difficulty: 'intermediate',
    category: 'scaling & cluster',
    prerequisites: ['redis-replication'],
    keyPoints: [
      'Key → CRC16(key) mod 16384 → slot → node; cluster-aware clients cache the slot map and follow MOVED redirects.',
      'Multi-key operations (MGET, transactions, Lua) require all keys on ONE node — hash tags {user:42}:profile and {user:42}:cart force co-location.',
      'Each primary has replicas; the cluster promotes a replica if a primary fails — Sentinel is not used with Cluster.',
      'Minimum production topology: 3 primaries + 3 replicas. SELECT/multiple logical DBs are not supported in cluster mode.'
    ],
    gotcha: 'The hash-tag question ("why does my MGET fail in cluster mode?") is the most common practical Cluster interview probe.'
  },
  {
    id: 'redis-scaling-strategy',
    title: 'How do you scale Redis?',
    summary: 'Reads → replicas; memory/writes → Cluster (sharding); and before any of that — fix data model, TTLs, and hot keys.',
    difficulty: 'intermediate',
    category: 'scaling & cluster',
    prerequisites: ['redis-sentinel', 'redis-cluster'],
    keyPoints: [
      'Vertical first: RAM is the resource — a bigger box is the simplest capacity fix.',
      'Read scaling: replicas + read-preference in clients (accepting async staleness).',
      'Write/data scaling: Redis Cluster shards the keyspace; client-side or proxy sharding (Twemproxy/Envoy) is the DIY alternative.',
      'HA choice summary: single node < primary+replica+Sentinel < Cluster — complexity buys availability and capacity.'
    ]
  },

  // ─── MEMORY & OPERATIONS ────────────────────────────────────────────────────
  {
    id: 'redis-maxmemory-eviction',
    title: 'maxmemory and eviction policies',
    summary:
      'maxmemory caps RAM; when full, the eviction policy decides what is deleted — allkeys-lru for a cache, noeviction (default) errors on writes.',
    difficulty: 'intermediate',
    category: 'memory & operations',
    prerequisites: ['redis-expiration'],
    keyPoints: [
      'noeviction (default): writes fail with OOM when full — right for Redis-as-datastore, surprising for caches.',
      'allkeys-lru: evict least-recently-used across ALL keys — the standard cache setting. allkeys-lfu (frequency) suits skewed access.',
      'volatile-lru/-ttl/-random: only evict keys that HAVE a TTL — mixed cache+persistent-data instances.',
      'Redis LRU/LFU is approximated by sampling (maxmemory-samples), not exact — a nice depth point.'
    ],
    gotcha:
      'A "cache" left on noeviction that fills up and starts throwing write errors is a rite-of-passage production incident — interviewers love this scenario.'
  },
  {
    id: 'redis-memory-optimization',
    title: 'Memory optimization strategies',
    summary: 'Small aggregate types encode compactly, TTL everything cache-like, avoid huge keys, and measure with MEMORY USAGE.',
    difficulty: 'intermediate',
    category: 'memory & operations',
    prerequisites: ['redis-maxmemory-eviction', 'redis-hashes'],
    keyPoints: [
      'Small hashes/lists/zsets use compact listpack encoding — many small hashes beat millions of top-level string keys (the classic Instagram trick).',
      'Set TTLs on everything that can expire; delete what you can.',
      'Hunt big keys: redis-cli --bigkeys, MEMORY USAGE key; break up multi-MB values.',
      'Shorter key names at huge scale, bitmaps/HLL instead of sets where approximation is fine.'
    ]
  },
  {
    id: 'redis-monitoring-troubleshooting',
    title: 'Monitoring and troubleshooting latency',
    summary:
      'INFO, SLOWLOG, and latency tooling cover most diagnosis; the causes are almost always slow commands, big keys, swap, or persistence forks.',
    difficulty: 'intermediate',
    category: 'memory & operations',
    prerequisites: ['redis-single-threaded'],
    keyPoints: [
      'INFO sections: memory (used_memory, fragmentation ratio), stats (hits/misses — cache hit rate), replication, clients.',
      'SLOWLOG GET — commands over a threshold; the usual suspects: KEYS, SMEMBERS/HGETALL on huge keys, long Lua.',
      'redis-cli --latency and LATENCY HISTORY quantify stalls; MONITOR shows live traffic (itself expensive — seconds only, never leave on).',
      'Environmental killers: swapping (RAM overcommit), AOF fsync stalls on slow disks, fork pauses for BGSAVE on huge datasets.'
    ]
  },
  {
    id: 'redis-security',
    title: 'Securing Redis',
    summary: 'Bind privately, require a password/ACL users, TLS if traffic crosses networks — Redis assumes a trusted network by default.',
    difficulty: 'basic',
    category: 'memory & operations',
    keyPoints: [
      'protected-mode + bind 127.0.0.1 by default — never expose 6379 publicly (exposed instances get cryptomined within hours).',
      'AUTH via requirepass (legacy) or ACLs (Redis 6+): per-user command and key-pattern permissions.',
      'TLS supported natively since Redis 6 for client and replication links.',
      'Belt-and-braces: rename/disable dangerous commands (FLUSHALL, CONFIG) for app users, firewall rules, no dangerous Lua from user input.'
    ]
  },
  {
    id: 'redis-client-usage',
    title: 'Using Redis from application code',
    summary:
      'Use a maintained client (ioredis/node-redis, redis-py, Jedis/Lettuce), share a connection/pool, and handle reconnection + failure paths deliberately.',
    difficulty: 'basic',
    category: 'memory & operations',
    prerequisites: ['redis-what-is-redis'],
    keyPoints: [
      'Clients speak RESP over TCP; create ONE client/pool per process, not per request.',
      'Production settings that matter: connect/command timeouts, retry/backoff strategy, and what happens when Redis is down.',
      'Design for cache failure: a down cache should degrade to the database (maybe slower), not take the app down — wrap gets in try/catch with fallthrough.',
      'Blocking commands (BRPOP) and subscriptions need their own dedicated connection — they monopolize it.'
    ]
  },
  {
    id: 'redis-elasticache-managed',
    title: 'Self-hosted vs managed Redis (ElastiCache & co.)',
    summary:
      'Managed services run patching, failover, backups, and scaling for you — you trade some control (and money) for ops you no longer own.',
    difficulty: 'basic',
    category: 'memory & operations',
    prerequisites: ['redis-sentinel'],
    keyPoints: [
      'AWS ElastiCache / Valkey, Azure Cache, GCP Memorystore, Redis Cloud — same protocol, managed control plane.',
      'You get: automated failover (multi-AZ), snapshots, patching, monitoring integration, easy vertical/horizontal resizing.',
      'You lose: shell access to the box, some CONFIG commands, exotic modules (varies), and per-GB it costs more than a VM.',
      'Interview framing: default to managed in cloud environments unless a specific requirement says otherwise.'
    ]
  }
];
