import type { QuizQuestion } from '@/types/content';

// ─── Databases quiz — multiple choice (PostgreSQL + MongoDB + Redis + DynamoDB) ──

export const databasesQuiz: QuizQuestion[] = [
  // ── PostgreSQL / SQL ──
  {
    id: 'db-q-pg-null-logic',
    question: 'What does `NULL = NULL` evaluate to in SQL?',
    options: ['TRUE', 'FALSE', 'NULL (unknown) — neither true nor false', 'A syntax error'],
    correctIndex: 2,
    explanation: 'NULL means "unknown," so comparing it with anything (including another NULL) yields NULL — use IS NULL / IS NOT NULL instead.',
    category: 'PostgreSQL'
  },
  {
    id: 'db-q-pg-where-vs-having',
    question: 'What is the difference between WHERE and HAVING in SQL?',
    options: [
      'They are interchangeable',
      'WHERE filters rows before grouping; HAVING filters groups after aggregation',
      'HAVING filters rows before grouping; WHERE filters after',
      'WHERE can only be used with JOINs'
    ],
    correctIndex: 1,
    explanation: 'You cannot filter on an aggregate like COUNT(*) in a WHERE clause — that requires HAVING, since aggregation hasn\'t happened yet.',
    category: 'PostgreSQL'
  },
  {
    id: 'db-q-pg-join-types',
    question: 'A LEFT JOIN between orders and customers keeps:',
    options: [
      'Only customers who have orders',
      'Every row from orders, with NULLs for customer columns when there is no match',
      'Only rows that exist in both tables',
      'Every row from customers, with NULLs for order columns when there is no match'
    ],
    correctIndex: 1,
    explanation: 'LEFT JOIN preserves every row of the left (first-listed) table regardless of whether a match exists on the right.',
    category: 'PostgreSQL'
  },
  {
    id: 'db-q-pg-code-window-function',
    question: 'What does this query return?',
    code: `SELECT name, salary, department,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
FROM employees;`,
    options: [
      'A running total of salary per department',
      'Every employee ranked by salary within their own department (1 = highest paid in that department)',
      'The average salary per department',
      'A syntax error — window functions can\'t use PARTITION BY'
    ],
    correctIndex: 1,
    explanation: 'This is the classic "top N per group" pattern — filter WHERE rn <= 3 to get the top 3 earners per department.',
    category: 'PostgreSQL'
  },
  {
    id: 'db-q-pg-index-jsonb',
    question: 'Which PostgreSQL index type is used to efficiently query a JSONB column?',
    options: ['B-tree', 'Hash', 'GIN', 'BRIN'],
    correctIndex: 2,
    explanation: 'GIN (Generalized Inverted Index) handles containment queries needed for JSONB, arrays, and full-text search.',
    category: 'PostgreSQL'
  },
  {
    id: 'db-q-pg-acid',
    question: 'What does the "I" in ACID stand for, and what does it guarantee?',
    options: [
      'Integrity — data types are enforced',
      'Isolation — concurrent transactions don\'t see each other\'s uncommitted changes',
      'Indexing — every table automatically gets an index',
      'Idempotency — retrying a transaction is always safe'
    ],
    correctIndex: 1,
    explanation: 'Isolation is the one ACID guarantee that is actually configurable, via transaction isolation levels.',
    category: 'PostgreSQL'
  },
  {
    id: 'db-q-pg-normalization',
    question: 'What is the core idea behind database normalization?',
    options: [
      'Making all column names lowercase',
      'Structuring tables to remove redundancy, so each fact is stored exactly once',
      'Converting all tables into JSON documents',
      'Adding an index to every column'
    ],
    correctIndex: 1,
    explanation: 'The 3NF soundbite: every non-key attribute depends on the key, the whole key, and nothing but the key.',
    category: 'PostgreSQL'
  },
  {
    id: 'db-q-pg-code-upsert',
    question: 'What does this statement do?',
    code: `INSERT INTO users (id, email) VALUES (1, 'a@x.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;`,
    options: [
      'It always inserts a new row, ignoring conflicts',
      'It inserts the row, or updates the existing row\'s email if the id already exists — an atomic upsert',
      'It deletes any row with a conflicting id first',
      'It only works inside a transaction block'
    ],
    correctIndex: 1,
    explanation: 'This is the standard PostgreSQL "insert, or update if it already exists" pattern — avoiding a read-then-write race.',
    category: 'PostgreSQL'
  },
  // ── MongoDB ──
  {
    id: 'db-q-mongo-document',
    question: 'What is a MongoDB document stored as internally?',
    options: ['Plain text CSV', 'BSON — binary JSON with extra types like Date and ObjectId', 'XML', 'A serialized JS object literal'],
    correctIndex: 1,
    explanation: 'BSON extends JSON with additional types and is more efficient to parse and traverse.',
    category: 'MongoDB'
  },
  {
    id: 'db-q-mongo-embed-vs-reference',
    question: 'When modeling a one-to-many relationship in MongoDB, when should you embed rather than reference?',
    options: [
      'Always embed, regardless of size',
      'Embed when the "many" side is small and bounded; reference when it\'s large/unbounded or needs independent access',
      'Always reference — MongoDB has no support for embedding',
      'It depends only on which language driver you use'
    ],
    correctIndex: 1,
    explanation: 'This is THE core MongoDB schema design question — embedding an unbounded array can blow past the 16MB document limit and hurts write performance.',
    category: 'MongoDB'
  },
  {
    id: 'db-q-mongo-code-lookup',
    question: 'What does the `$lookup` stage in an aggregation pipeline do?',
    code: `db.orders.aggregate([
  { $lookup: { from: 'customers', localField: 'customerId', foreignField: '_id', as: 'customer' } }
]);`,
    options: [
      'Deletes matching documents from the customers collection',
      'Performs a left outer join, pulling matching customer documents into each order',
      'Creates an index on customerId',
      'Renames the customerId field'
    ],
    correctIndex: 1,
    explanation: 'Frequent use of $lookup is often a hint the data model would work better embedded instead of referenced.',
    category: 'MongoDB'
  },
  {
    id: 'db-q-mongo-esr-rule',
    question: 'For a compound index in MongoDB, the ESR rule recommends ordering fields as:',
    options: [
      'Equality → Sort → Range',
      'Range → Sort → Equality',
      'Alphabetical order',
      'Whichever field is largest first'
    ],
    correctIndex: 0,
    explanation: 'Putting equality-matched fields first, then sort fields, then range-filtered fields gives the index the best chance to serve the query efficiently.',
    category: 'MongoDB'
  },
  {
    id: 'db-q-mongo-sharding',
    question: 'What does sharding accomplish in MongoDB?',
    options: [
      'It creates read replicas for high availability only',
      'It partitions a collection across multiple replica sets by a shard key, scaling writes and total data size',
      'It compresses documents to save disk space',
      'It automatically backs up the database daily'
    ],
    correctIndex: 1,
    explanation: 'A `mongos` router directs queries to the correct shard(s) based on the shard key — a poorly chosen shard key can create hot shards.',
    category: 'MongoDB'
  },
  {
    id: 'db-q-mongo-oplog',
    question: 'What is the MongoDB "oplog"?',
    options: [
      'A log of slow queries only',
      'A capped collection on the primary recording every write, which secondary nodes replay to stay in sync',
      'An error log for failed connections',
      'A user activity audit trail'
    ],
    correctIndex: 1,
    explanation: 'The oplog is also what powers Change Streams — a resumable API for subscribing to real-time data changes.',
    category: 'MongoDB'
  },
  {
    id: 'db-q-mongo-schemaless',
    question: 'MongoDB is often described as "schemaless." What does that actually mean in practice?',
    options: [
      'Documents can never have a consistent structure',
      'A schema isn\'t enforced by default, but collections CAN opt into JSON Schema validation on writes',
      'Every document in a collection must have identical fields',
      'MongoDB cannot be used with an ORM/ODM'
    ],
    correctIndex: 1,
    explanation: 'Flexibility is optional, not mandatory — tools like Mongoose add app-level schema enforcement on top of the raw driver.',
    category: 'MongoDB'
  },
  // ── Redis ──
  {
    id: 'db-q-redis-single-threaded',
    question: 'How is single-threaded Redis able to achieve such high throughput?',
    options: [
      'It secretly uses multiple threads for every command',
      'In-memory data plus an efficient event loop (no lock contention, no context switching) makes single-threaded execution very fast',
      'It skips network I/O entirely',
      'It only supports very small datasets'
    ],
    correctIndex: 1,
    explanation: 'Since Redis 6+, I/O threading was added for network handling, but command execution itself remains single-threaded.',
    category: 'Redis'
  },
  {
    id: 'db-q-redis-keys-command',
    question: 'Why is running the `KEYS *` command in production Redis dangerous?',
    options: [
      'It is read-only and completely safe',
      'It scans every key while blocking the event loop — use SCAN (cursor-based, incremental) instead',
      'It permanently deletes all matched keys',
      'It only works in cluster mode'
    ],
    correctIndex: 1,
    explanation: 'Because Redis is single-threaded, a blocking KEYS scan on a large dataset stalls every other client.',
    category: 'Redis'
  },
  {
    id: 'db-q-redis-data-types',
    question: 'Which Redis data type is best suited for a leaderboard with ranked scores?',
    options: ['String', 'List', 'Sorted Set', 'Hash'],
    correctIndex: 2,
    explanation: 'Sorted sets keep unique members permanently ordered by score, giving O(log n) top-N and rank queries.',
    category: 'Redis'
  },
  {
    id: 'db-q-redis-code-incr',
    question: 'Why is `INCR` the standard tool for implementing a rate limiter counter, rather than GET + manual increment + SET?',
    code: `INCR requests:user:42
EXPIRE requests:user:42 60`,
    options: [
      'INCR is purely cosmetic and behaves the same as GET/SET',
      'INCR is atomic — no race condition between concurrent requests incrementing the same counter',
      'INCR automatically expires the key',
      'INCR only works on Redis Cluster'
    ],
    correctIndex: 1,
    explanation: 'A separate GET then SET would have a race window where two concurrent requests could both read the same value and undercount.',
    category: 'Redis'
  },
  {
    id: 'db-q-redis-persistence',
    question: 'What is the core trade-off between Redis\'s RDB and AOF persistence modes?',
    options: [
      'RDB and AOF are identical in behavior',
      'RDB takes periodic point-in-time snapshots (faster restarts, more potential data loss); AOF logs every write (less data loss, larger files, slower restarts)',
      'AOF cannot survive a server crash',
      'RDB is only available in Redis Cluster'
    ],
    correctIndex: 1,
    explanation: 'Many production setups run both together for a balance of durability and fast recovery.',
    category: 'Redis'
  },
  {
    id: 'db-q-redis-pubsub',
    question: 'What happens to a Pub/Sub message in Redis if no client is currently subscribed to that channel?',
    options: [
      'It is queued and delivered once someone subscribes',
      'It is lost — Pub/Sub is fire-and-forget with no storage or replay',
      'It is stored in the AOF file for later replay',
      'It automatically becomes a Stream entry'
    ],
    correctIndex: 1,
    explanation: 'For guaranteed delivery / replay, Redis Streams (not Pub/Sub) is the right tool.',
    category: 'Redis'
  },
  // ── DynamoDB ──
  {
    id: 'db-q-dynamo-partition-key',
    question: 'What determines which physical partition a DynamoDB item is stored on?',
    options: [
      'The order items were inserted',
      'A hash of the partition key value',
      'The item\'s total size in bytes',
      'The AWS region only'
    ],
    correctIndex: 1,
    explanation: 'Choosing a partition key with high cardinality and even access patterns avoids "hot partitions."',
    category: 'DynamoDB'
  },
  {
    id: 'db-q-dynamo-query-vs-scan',
    question: 'What is the key difference between Query and Scan in DynamoDB?',
    options: [
      'They are identical, just different syntax',
      'Query uses the key schema to seek directly to matching items; Scan reads every item in the table and filters afterward',
      'Scan is always cheaper than Query',
      'Query can only be used with a GSI, never the base table'
    ],
    correctIndex: 1,
    explanation: 'A Scan with a filter that returns 5 items still bills for reading the entire table — filters don\'t save money, unlike a Query\'s key condition.',
    category: 'DynamoDB'
  },
  {
    id: 'db-q-dynamo-gsi',
    question: 'What is a Global Secondary Index (GSI) used for in DynamoDB?',
    options: [
      'Enforcing uniqueness on the primary key',
      'Querying the table efficiently by an attribute other than the primary key',
      'Automatically backing up the table',
      'Encrypting specific attributes at rest'
    ],
    correctIndex: 1,
    explanation: 'A GSI has its own partition (and optional sort) key, letting you query access patterns the base table\'s key schema doesn\'t support.',
    category: 'DynamoDB'
  },
  {
    id: 'db-q-dynamo-single-table',
    question: 'What is "single-table design" in DynamoDB modeling?',
    options: [
      'Using exactly one attribute per item',
      'Storing multiple different entity types in one table, designed around access patterns rather than normalized entities',
      'A constraint DynamoDB enforces automatically',
      'Splitting one logical entity across many tables'
    ],
    correctIndex: 1,
    explanation: 'This trades relational normalization for the ability to fetch everything a UI screen needs in one query.',
    category: 'DynamoDB'
  },
  {
    id: 'db-q-dynamo-consistency',
    question: 'What is the difference between eventually consistent and strongly consistent reads in DynamoDB?',
    options: [
      'They are the same; the setting only affects billing',
      'Eventually consistent reads may return slightly stale data (lower cost); strongly consistent reads always return the latest write (higher cost, more latency)',
      'Strongly consistent reads are the default and free',
      'Eventually consistent reads are only available for GSIs'
    ],
    correctIndex: 1,
    explanation: 'This trade-off exists because DynamoDB replicates data across multiple facilities for durability.',
    category: 'DynamoDB'
  },
  {
    id: 'db-q-dynamo-large-items',
    question: 'DynamoDB items are capped at 400KB. What is the standard way to handle a larger payload, like a file?',
    options: [
      'Split it across dozens of items automatically — DynamoDB handles this transparently',
      'Store the payload in S3 and keep only a pointer/reference in the DynamoDB item',
      'Compress it — DynamoDB has no size limit for compressed data',
      'It simply is not possible to store large data related to a DynamoDB item'
    ],
    correctIndex: 1,
    explanation: 'DynamoDB is not a blob store — the standard pattern is S3 for the payload, DynamoDB for the metadata/pointer.',
    category: 'DynamoDB'
  }
];
