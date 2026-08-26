import type { Article } from '@/types/content';

export const redis101Article: Article = {
  id: 'redis-101',
  slug: 'redis-101',
  category: 'Databases',
  title: 'Redis 101 and Beyond',
  summary:
    'A from-scratch tour of Redis: why keeping data in RAM makes it so fast, every core data structure with real commands, the use cases each one unlocks, and how it stays durable, evictable, and scalable in production.',
  topics: ['Databases', 'Redis', 'Caching'],
  difficulty: 'intermediate',
  blocks: [
    { type: 'heading', id: 'the-problem', level: 2, text: 'The problem Redis exists to solve' },
    {
      type: 'paragraph',
      text: "Imagine your app needs to know how many times a video has been viewed, and it needs that number updated on every single view, for millions of videos, with an answer coming back in a couple of milliseconds. A traditional database like PostgreSQL or MySQL could technically do this, but those databases store their data on disk. Disk, even a fast SSD, is slow compared to RAM (your computer's working memory): reading from disk typically takes somewhere in the range of tens of microseconds to a few milliseconds, while reading from RAM takes well under a microsecond. That gap sounds tiny until you're doing it thousands of times a second under load, and it compounds with every index lookup, every lock, every disk seek the database has to perform to guarantee your data survives a crash."
    },
    {
      type: 'paragraph',
      text: 'Redis takes a different bet: keep the entire dataset in RAM, all the time, so every read and every write operates on memory that\'s already sitting right there, no disk round trip required for the hot path. That single decision is why Redis operations routinely complete in under a millisecond and why it can push through hundreds of thousands of operations per second on modest hardware. "In-memory" is the one fact about Redis that explains almost everything else about how and when you\'d use it.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'So is Redis just "a cache"?',
      text: 'That\'s the most common label, and caching is genuinely the most common use case, but it undersells what Redis is. Redis is better described as a data structure server: a place to store not just flat strings, but hashes, lists, sets, and sorted sets, each with its own purpose-built commands. Once you see it that way, a lot of Redis use cases stop looking like "caching tricks" and start looking like the obviously correct tool for a specific job (a leaderboard, a queue, a rate limiter) that happens to also be extremely fast.'
    },
    { type: 'heading', id: 'why-so-fast', level: 2, text: 'Why Redis is fast: in-memory plus a single-threaded event loop' },
    {
      type: 'paragraph',
      text: "In-memory storage is half the story. The other half is how Redis handles the actual work of running commands. Most databases juggle many client connections by spinning up threads or processes, and then have to coordinate those threads with locks whenever two of them might touch the same piece of data at once. Locks are correct, but they're also overhead, and they open the door to subtle bugs when two threads race for the same key."
    },
    {
      type: 'paragraph',
      text: "Redis's core command processing runs on a single thread. Every command (a GET, a SET, an LPUSH) executes one at a time, start to finish, with no other command interleaving in the middle of it. That sounds like it should be slower, since a single thread can't use multiple CPU cores, but in practice it buys Redis something more valuable than raw parallelism: every command is atomic by default, with zero locking overhead, because there's simply nothing else running concurrently that could interfere. Combined with an event loop (a pattern where Redis efficiently waits on thousands of open network connections at once, and springs into action only when one of them actually has data ready) this lets a single Redis process comfortably serve tens of thousands of concurrent clients."
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Single-threaded does not mean single-core forever',
      text: "Newer Redis versions can offload some non-command work, like writing snapshots to disk or freeing memory from deleted keys, to background threads. But command execution itself, the part that reads and writes your data, remains single-threaded. That's a deliberate simplicity trade-off, not a limitation nobody noticed."
    },
    { type: 'heading', id: 'data-structures', level: 2, text: 'Core data structures' },
    {
      type: 'paragraph',
      text: "Every value in Redis lives under a key, the same way a value lives under a key in a plain JavaScript object. What makes Redis interesting is that the value isn't limited to a flat string; it can be one of several purpose-built structures, and each structure comes with its own vocabulary of commands designed around what you'd actually want to do with data shaped that way. Picking the right structure for the job is most of what there is to know about using Redis well."
    },
    { type: 'heading', id: 'strings', level: 3, text: 'Strings: the basic key to value' },
    {
      type: 'paragraph',
      text: "A String is the simplest structure: one key maps to one value, and that value can be text, a number, or even binary data like a serialized JSON blob or an image. This is the structure you reach for by default, the same way you'd reach for a plain variable in code."
    },
    {
      type: 'code',
      code: `SET user:42:name "Ada Lovelace"
GET user:42:name        # "Ada Lovelace"

# Strings that hold numbers get atomic increment/decrement, which matters
# a lot once two requests can hit the same key at the same second.
SET page:home:views 0
INCR page:home:views    # 1
INCR page:home:views    # 2
INCRBY page:home:views 10  # 12`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Why INCR being atomic actually matters',
      text: "If you instead did GET then add 1 in your application code then SET, two requests arriving at nearly the same moment could both read the same starting value, both add 1, and both write back the same result, silently losing one increment. INCR performs the read-modify-write as a single, indivisible operation inside Redis, so that race condition simply can't happen. This is exactly why INCR is the standard building block for view counters, rate limiters, and any kind of shared counter."
    },
    { type: 'heading', id: 'hashes', level: 3, text: 'Hashes: a mini-object per key' },
    {
      type: 'paragraph',
      text: 'A Hash maps one key to a set of field-value pairs, essentially a small object nested inside a Redis key. This matters because the alternative, using a plain String to hold a whole JSON-serialized object, forces you to read the entire object, deserialize it, change one field, re-serialize it, and write the whole thing back, every single time you want to update just one field. A Hash lets you touch a single field directly.'
    },
    {
      type: 'code',
      code: `HSET user:42 name "Ada Lovelace" email "ada@example.com" plan "pro"
HGET user:42 email          # "ada@example.com"
HGETALL user:42             # every field and value on the hash
HSET user:42 plan "free"    # update just one field, no read-modify-write
HDEL user:42 email          # remove a single field`
    },
    { type: 'heading', id: 'lists', level: 3, text: 'Lists: an ordered, push/pop-able sequence' },
    {
      type: 'paragraph',
      text: 'A List is an ordered collection of values that you push onto and pop off of, from either end, in constant time. That property (fast pushes and pops at both ends) makes it a natural fit for a lightweight work queue: producers push jobs onto one end, and one or more workers pop jobs off the other end to process them.'
    },
    {
      type: 'code',
      code: `LPUSH jobs:emails "send-welcome:user42"   # push onto the left/head
LPUSH jobs:emails "send-receipt:user17"
RPOP jobs:emails                          # pop the oldest job off the right/tail

# A worker that blocks until a job shows up, instead of polling in a loop:
BRPOP jobs:emails 0    # 0 = wait forever for the next item`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Not a replacement for a real message queue',
      text: "A Redis List queue is genuinely useful for lightweight, single-consumer-group job queues, but it lacks features that dedicated queue systems provide out of the box, like per-message acknowledgment, automatic retry of failed jobs, or delivery to multiple independent consumer groups. Redis has a purpose-built structure for that, called Streams, which behaves more like a durable, replayable log with consumer groups. Reach for a List queue when the need is simple; reach for Streams (or an actual queue service) when it isn't."
    },
    { type: 'heading', id: 'sets', level: 3, text: 'Sets: unordered, unique membership' },
    {
      type: 'paragraph',
      text: 'A Set holds unique members with no guaranteed order, and its superpower is answering membership and combination questions instantly: is this value in the set, what values are in both of two sets, what values are in one set but not the other.'
    },
    {
      type: 'code',
      code: `SADD post:123:likedBy user1 user2 user3
SADD post:456:likedBy user2 user4
SISMEMBER post:123:likedBy user2   # 1 (true)

# Users who liked BOTH post 123 and post 456
SINTER post:123:likedBy post:456:likedBy   # {"user2"}

# All users who liked either post
SUNION post:123:likedBy post:456:likedBy   # {"user1","user2","user3","user4"}`
    },
    { type: 'heading', id: 'sorted-sets', level: 3, text: 'Sorted sets (ZSET): a set where every member has a score' },
    {
      type: 'paragraph',
      text: 'A Sorted Set is like a regular Set, unique members, but every member also carries a numeric score, and Redis automatically keeps the whole collection ordered by that score. This single structure is the standard answer to two very different-sounding interview questions: "how would you build a leaderboard?" and "how would you build a priority queue?", because both are really just "keep things ordered by a number and let me fetch a range of them fast."'
    },
    {
      type: 'code',
      code: `ZADD leaderboard 1500 "alice" 2100 "bob" 980 "carol"
ZREVRANGE leaderboard 0 2 WITHSCORES   # top 3, highest score first
ZINCRBY leaderboard 50 "alice"         # alice's score becomes 1550
ZRANK leaderboard "alice"              # alice's position (0-indexed, ascending)
ZSCORE leaderboard "bob"               # bob's current score, 2100`
    },
    {
      type: 'heading',
      id: 'structures-table',
      level: 3,
      text: 'Quick reference: which structure for which job'
    },
    {
      type: 'table',
      columns: ['Structure', 'Shape', 'Reach for it when you need'],
      rows: [
        ['String', 'one key to one value', 'a simple value, a cache entry, or an atomic counter'],
        ['Hash', 'one key to many field-value pairs', 'an object where you update individual fields often'],
        ['List', 'ordered, push/pop from either end', 'a lightweight FIFO/LIFO queue or a recent-items feed'],
        ['Set', 'unique, unordered members', 'membership checks, tags, or intersections/unions of groups'],
        ['Sorted Set', 'unique members with a numeric score, kept ordered', 'leaderboards, priority queues, or anything ranked by a number']
      ]
    },
    { type: 'heading', id: 'use-cases', level: 2, text: 'What people actually build with this' },
    {
      type: 'paragraph',
      text: "The data structures above aren't abstract trivia; each one maps directly onto a use case that shows up constantly in real systems and in interviews."
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Caching: store the expensive result of a database query or an API call under a key, with a TTL, so the next request for the same data is a sub-millisecond RAM read instead of repeating the expensive work.',
        'Session store: keep logged-in user sessions in a Hash or String keyed by session ID, with a TTL matching the session length, so an expired session simply vanishes on its own with no cleanup job needed.',
        'Rate limiting: use INCR on a key like ratelimit:user42:2026-07-26T10 with a TTL of one hour to count requests in the current window, and reject the request once the counter passes your limit.',
        'Pub/Sub: broadcast a message to every currently-connected subscriber of a channel, useful for things like pushing a live notification or a chat message out to connected clients in real time.',
        'Leaderboards: a Sorted Set keyed by score gives you "top N players" and "this player\'s current rank" as fast, native operations instead of a SQL ORDER BY over a whole table on every request.'
      ]
    },
    { type: 'heading', id: 'ttl', level: 2, text: 'Expiry (TTL): letting Redis clean up after itself' },
    {
      type: 'paragraph',
      text: 'TTL stands for time to live: the number of seconds a key is allowed to exist before Redis automatically deletes it, with no extra code required on your end. This is one of the most quietly powerful features in Redis, because it turns "remember to clean this up later" from an application concern into something the database just handles.'
    },
    {
      type: 'code',
      code: `SET session:abc123 "{...}" EX 3600   # this key expires in 3600 seconds (1 hour)
TTL session:abc123                    # seconds remaining; -1 means no TTL set; -2 means the key is already gone
PERSIST session:abc123                # remove the TTL, making the key permanent again`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'This is why Redis is the default session store',
      text: 'A per-key TTL means expired sessions just disappear on their own, no cron job sweeping a "sessions" table for stale rows, no risk of forgetting to write that cleanup job in the first place.'
    },
    { type: 'heading', id: 'eviction', level: 2, text: 'Eviction policies: what happens when RAM fills up' },
    {
      type: 'paragraph',
      text: 'Because everything lives in RAM, and RAM is finite and more expensive than disk, Redis can be configured with a maximum memory limit (maxmemory). The interesting question is what Redis does once that limit is reached and a new write comes in: does it error out, or does it make room by deleting something? That behavior is controlled by an eviction policy, and choosing the right one depends entirely on whether the data in question is disposable (like a cache) or precious (like a queue of unprocessed jobs).'
    },
    {
      type: 'table',
      columns: ['Policy', 'What it evicts', 'Typical use'],
      rows: [
        ['noeviction', 'nothing; new writes are rejected with an error once full', 'data you cannot afford to lose, e.g. a job queue'],
        ['allkeys-lru', 'the least recently used key, from the entire keyspace', 'a general-purpose cache with no TTLs set'],
        [
          'volatile-lru',
          'the least recently used key, but only among keys that have a TTL',
          'a mix of cache data and permanent data in one instance'
        ],
        ['allkeys-lfu', 'the least frequently used key, from the entire keyspace', 'a cache where "popular" matters more than "recent"'],
        ['volatile-ttl', 'the key with the shortest remaining TTL first', 'when you want soon-to-expire data cleared out first']
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'noeviction is the default, and it surprises people',
      text: 'If you never configure maxmemory-policy, Redis defaults to noeviction: once memory is full, writes start failing outright instead of silently evicting old data. That\'s the safe choice for precious data, but if you\'re using Redis purely as a cache and hit this in production, it looks like an outage, not like Redis "working as intended." Set an LRU-based policy explicitly for cache-only workloads.'
    },
    { type: 'heading', id: 'persistence', level: 2, text: "Persistence: it's in-memory, but not necessarily volatile" },
    {
      type: 'paragraph',
      text: "A fair question at this point: if Redis keeps everything in RAM, doesn't a server restart or crash just wipe out all the data? By default, yes, RAM loses its contents when the power (or the process) goes away. But Redis offers two mechanisms to persist data to disk anyway, so it can reload and rebuild its in-memory state after a restart, and most production deployments use a combination of both."
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "RDB (snapshotting): Redis periodically writes a compact, point-in-time snapshot of the entire dataset to a single file on disk. Restoring from an RDB file is fast, since it's just loading a ready-made snapshot back into memory, but any writes that happened after the last snapshot are lost if Redis crashes before the next one.",
        'AOF (append-only file): Redis logs every write command to a file as it happens. Restoring means replaying that log from the start, command by command, which is slower than loading an RDB snapshot but much safer, since you can configure how often the log is flushed to disk (as often as every single write) to bound how much you could possibly lose.',
        'Most production setups enable both: RDB for fast full restores after a planned restart, AOF to minimize how much recent data could be lost in an unplanned crash.'
      ]
    },
    { type: 'heading', id: 'where-it-fits', level: 2, text: 'Where Redis fits next to your primary database' },
    {
      type: 'paragraph',
      text: 'Redis is very rarely meant to replace your primary, disk-backed database (like PostgreSQL, MySQL, or MongoDB) as the single source of truth. Even with AOF persistence turned all the way up, a database whose whole design center is "stay in RAM" is a worse fit than a disk-native database for data you absolutely cannot lose and that grows far larger than RAM is practical for. The far more common pattern is running Redis alongside a primary database: the primary database holds the durable, authoritative record of everything, and Redis sits in front of or beside it, holding a fast-access copy of hot data, session state, counters, queues, or anything else where sub-millisecond access matters more than being the permanent system of record.'
    },
    { type: 'heading', id: 'beyond-single-node', level: 2, text: 'Beyond a single node: replication and clustering' },
    {
      type: 'paragraph',
      text: "A single Redis instance is already fast, but a single instance is also a single point of failure, and it's limited to whatever RAM one machine has. Redis scales out in two complementary ways. Replication runs one primary node plus one or more read replica nodes, each replica continuously receiving a copy of every write the primary makes; this both spreads read traffic across more machines and gives you failover, since a replica can be promoted to primary if the original primary goes down. Redis Cluster goes further and shards (splits) the data itself across multiple primary nodes, by hashing every key into one of 16384 fixed hash slots and assigning ranges of those slots to different primaries, which lets write throughput scale horizontally too, not just reads."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Clustering has a real constraint: cross-slot operations',
      text: 'Once your keys are spread across multiple primaries by hash slot, an operation that needs to touch keys living in different slots (for example, a multi-key transaction, or certain multi-key commands) can no longer be executed the simple, single-node way, because the keys might physically live on different machines. This is a real design constraint once you outgrow a single Redis box, and it\'s worth designing your key names (e.g. using "hash tags" to force related keys into the same slot) with this in mind from the start rather than discovering it after a migration.'
    },
    { type: 'heading', id: 'pubsub-vs-streams', level: 2, text: 'Pub/Sub versus Streams: a common trap' },
    {
      type: 'paragraph',
      text: "Redis's Pub/Sub feature lets clients subscribe to named channels and receive messages published to them, which sounds like exactly what you'd want for chat apps or live notifications. The trap is durability: Pub/Sub delivers a message only to whoever is actively subscribed at the exact moment it's published. A subscriber that's briefly disconnected, or hasn't started yet, simply misses that message forever, with no way to go back and replay it."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Pub/Sub messages are not durable',
      text: "For anything that needs a delivery guarantee, that's a job for Streams (Redis's log-like structure that keeps a durable, replayable history of messages and supports consumer groups tracking their own read position) or for a dedicated message queue system, not for Pub/Sub."
    },
    { type: 'heading', id: 'redis-vs-memcached', level: 2, text: 'Redis versus Memcached' },
    {
      type: 'paragraph',
      text: 'Memcached is another well-known in-memory store, and the two get compared constantly, especially in interviews, because on the surface they solve the same "fast cache" problem. The practical difference is scope: Memcached is deliberately simple, a pure key-to-string cache with nothing else, while Redis adds richer data structures, persistence, replication, and Pub/Sub on top of the same core speed.'
    },
    {
      type: 'table',
      columns: ['', 'Redis', 'Memcached'],
      rows: [
        ['Data structures', 'strings, hashes, lists, sets, sorted sets, streams', 'strings only'],
        ['Persistence', 'RDB and/or AOF, survives a restart', 'none; a restart wipes everything'],
        ['Replication / clustering', 'built in', 'not built in (client-side sharding only)'],
        ['Threading model', 'mostly single-threaded command execution', 'multi-threaded'],
        ['Best fit', 'cache plus queues, counters, leaderboards, sessions', 'a pure, simple, high-throughput cache']
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The one-line answer for interviews',
      text: "If you only need a dumb, fast cache and nothing else, Memcached's simplicity (and multi-threaded design) can win. If you want a cache that can also be a queue, a rate limiter, a leaderboard, or a session store, and you want that data to survive a restart, Redis is almost always the better default."
    }
  ]
};
