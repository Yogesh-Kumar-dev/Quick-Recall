import type { Note } from '@/types/content';

// ─── DynamoDB notes — the most commonly asked DynamoDB interview questions
// (authored: keys & indexes, capacity, single-table design, streams, consistency) ─

export const dynamodbNotes: Note[] = [
  // ─── BASICS ─────────────────────────────────────────────────────────────────
  {
    id: 'ddb-what-is-dynamodb',
    title: 'What is DynamoDB?',
    summary:
      "AWS's fully managed, serverless NoSQL key-value/document database — single-digit-millisecond latency at any scale, priced per request or provisioned capacity.",
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'Fully managed: no servers, no patching, no capacity ceilings — AWS partitions and replicates automatically across 3 AZs.',
      'Key-value + document model: items (up to 400KB) with flexible attributes, addressed by a primary key.',
      'Predictable performance at ANY scale — the same latency at 10 requests/sec and 10 million.',
      'Deep AWS integration: IAM auth, Lambda triggers via Streams, backups, global tables.',
      'The tradeoff: you give up ad-hoc queries — access patterns must be designed into the keys up front.'
    ]
  },
  {
    id: 'ddb-vs-relational',
    title: 'DynamoDB vs a relational database',
    summary:
      'DynamoDB trades query flexibility for guaranteed scale: no joins, no ad-hoc SQL — you model FOR your queries, and in exchange nothing slows down as data grows.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['ddb-what-is-dynamodb'],
    keyPoints: [
      'Relational: normalize first, query anything later. DynamoDB: list your access patterns first, design keys to serve exactly those.',
      'No joins, no aggregations server-side — either precompute them or do them in app code / analytics exports.',
      'Scales horizontally without you noticing; an RDBMS eventually hits vertical limits and needs manual sharding.',
      'Choose DynamoDB for known, high-scale, key-shaped access (carts, sessions, profiles, IoT, gaming state); choose SQL for relational/ad-hoc/reporting workloads.'
    ]
  },
  {
    id: 'ddb-vs-mongodb',
    title: 'DynamoDB vs MongoDB',
    summary:
      'Both are NoSQL document-ish stores, but MongoDB gives a rich query language you host/tune, while DynamoDB gives a narrow API that AWS scales for you.',
    difficulty: 'intermediate',
    category: 'basics',
    prerequisites: ['ddb-vs-relational'],
    keyPoints: [
      'Querying: MongoDB has ad-hoc queries, aggregation pipeline, many secondary indexes; DynamoDB queries only by keys/indexes you designed.',
      'Ops: DynamoDB is serverless (zero ops, per-request billing); MongoDB you run (or pay Atlas) and tune.',
      'Limits: DynamoDB item = 400KB vs MongoDB document = 16MB.',
      'Ecosystem: DynamoDB is AWS-native (IAM, Lambda); MongoDB is portable across clouds/on-prem.',
      'Fair summary: MongoDB flexes at query time, DynamoDB flexes at scale time.'
    ]
  },
  {
    id: 'ddb-tables-items-attributes',
    title: 'Tables, items, and attributes',
    summary: 'A table holds items (rows); each item is a set of attributes (fields) — schemaless except for the primary key.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['ddb-what-is-dynamodb'],
    keyPoints: [
      'Only the primary-key attributes are required and typed at table creation; everything else varies per item.',
      'Attribute types: scalars (S string, N number, B binary, BOOL, NULL), sets (SS/NS/BS), and documents (M map, L list — nestable).',
      'Item size cap: 400KB including attribute names — large blobs go to S3 with a pointer in the item.',
      'Numbers are sent as strings over the wire (precision-safe up to 38 digits).'
    ]
  },

  // ─── KEYS & INDEXES ─────────────────────────────────────────────────────────
  {
    id: 'ddb-primary-keys',
    title: 'Partition key and sort key',
    summary:
      'The primary key is either a partition key alone, or partition + sort key — the partition key picks WHERE data lives, the sort key orders items WITHIN it.',
    difficulty: 'basic',
    category: 'keys & indexes',
    prerequisites: ['ddb-tables-items-attributes'],
    keyPoints: [
      'Partition (hash) key: hashed to choose the physical partition — equality-only lookups.',
      'Sort (range) key: items sharing a partition key are stored sorted by it — enables range queries (begins_with, between, <, >).',
      'Composite-key tables model one-to-many naturally: PK = userId, SK = orderDate → "all orders for a user, newest first" in one Query.',
      'The combination must be unique per item; a put with the same key overwrites (upsert by default).'
    ],
    codeSnippet: `// Table: Orders   PK: userId   SK: orderDate
// One Query gets a user's orders in a date range:
Query: userId = 'u42' AND orderDate BETWEEN '2026-01-01' AND '2026-06-30'`
  },
  {
    id: 'ddb-partitions',
    title: 'How partitioning works under the hood',
    summary:
      'DynamoDB hashes the partition key to spread items across physical partitions; each partition has hard throughput limits — key design controls the spread.',
    difficulty: 'intermediate',
    category: 'keys & indexes',
    prerequisites: ['ddb-primary-keys'],
    keyPoints: [
      'Each partition sustains up to ~3,000 RCU and ~1,000 WCU, and ~10GB of storage — exceed that and DynamoDB splits partitions.',
      "Total table throughput is divided across partitions — a key that concentrates traffic cannot use the table's full capacity.",
      'High-cardinality, evenly-accessed partition keys are the goal: userId good, status ("active"/"inactive") terrible.',
      'Adaptive capacity papers over moderate skew nowadays, but cannot fix a fundamentally hot key.'
    ]
  },
  {
    id: 'ddb-hot-partitions',
    title: 'Hot partitions and write sharding',
    summary:
      'One partition key receiving disproportionate traffic throttles even an over-provisioned table — the fix is spreading the key space.',
    difficulty: 'intermediate',
    category: 'keys & indexes',
    prerequisites: ['ddb-partitions'],
    keyPoints: [
      "Classic causes: a celebrity user, a global counter, today's date as partition key (ALL writes hit one partition).",
      'Write sharding: append a random/calculated suffix (date#0 … date#9) to split load; read all shards and merge, or pick the shard deterministically.',
      'For read-hot items: DAX (managed cache) or a Redis layer absorbs repeated reads.',
      'Symptom: ProvisionedThroughputExceededException / throttling while average utilization looks low — the giveaway that load is skewed, not high.'
    ]
  },
  {
    id: 'ddb-gsi',
    title: 'Global Secondary Indexes (GSI)',
    summary:
      'A GSI is an alternate partition/sort key over the same data — effectively a shadow table DynamoDB maintains so you can query by other attributes.',
    difficulty: 'intermediate',
    category: 'keys & indexes',
    prerequisites: ['ddb-primary-keys'],
    keyPoints: [
      'Any attributes can be its keys; add/remove GSIs anytime (backfilled online). Up to 20 per table.',
      'Eventually consistent ONLY — a read right after a write may miss it.',
      'Has its own capacity (provisioned mode) — a throttled GSI throttles writes to the BASE table (favorite gotcha).',
      'Projections control which attributes are copied in: KEYS_ONLY / INCLUDE / ALL — project only what queries need; storage is billed per index.',
      'Sparse-index trick: items missing the GSI key simply are not in the index — index only "active" or "flagged" items for free filtering.'
    ]
  },
  {
    id: 'ddb-lsi',
    title: 'Local Secondary Indexes (LSI) — and why GSIs usually win',
    summary:
      'An LSI keeps the same partition key but adds an alternate sort key — strongly consistent reads, but locked in at table creation.',
    difficulty: 'intermediate',
    category: 'keys & indexes',
    prerequisites: ['ddb-gsi'],
    keyPoints: [
      'Same partition key as the table, different sort key — "orders by user sorted by amount instead of date".',
      "Must be created WITH the table (cannot add later); max 5; shares the table's capacity.",
      'Supports strongly consistent reads (GSIs cannot).',
      'Constraint: with LSIs, all items per partition-key value are capped at 10GB.',
      'Practical guidance: default to GSIs; reach for an LSI only when you specifically need strong consistency on the alternate sort.'
    ]
  },

  // ─── QUERIES & SCANS ────────────────────────────────────────────────────────
  {
    id: 'ddb-query-vs-scan',
    title: 'Query vs Scan',
    summary:
      'Query seeks directly to one partition key (fast, cheap); Scan reads the entire table (slow, expensive) — production code should almost never Scan.',
    difficulty: 'basic',
    category: 'queries & scans',
    prerequisites: ['ddb-primary-keys'],
    keyPoints: [
      'Query: partition key equality + optional sort-key condition; results come sorted by sort key (ScanIndexForward: false = descending).',
      'Scan: touches every item, consuming capacity for ALL data read — cost grows with table size forever.',
      'FilterExpression on either applies AFTER items are read — you pay full read capacity for filtered-out items.',
      '"I need to Scan" almost always means a missing GSI — that is the expected interview response.'
    ],
    gotcha: "Filters don't save money — a Scan with a filter that returns 5 items still bills for reading the whole table."
  },
  {
    id: 'ddb-key-condition-expressions',
    title: 'Key conditions, filters and pagination',
    summary: 'KeyConditionExpression drives the index seek; results page at 1MB with LastEvaluatedKey as the cursor.',
    difficulty: 'intermediate',
    category: 'queries & scans',
    prerequisites: ['ddb-query-vs-scan'],
    keyPoints: [
      "Sort-key operators: =, <, <=, >, >=, BETWEEN, begins_with — that's the entire range vocabulary (no contains on keys).",
      'Each response caps at 1MB; keep calling with ExclusiveStartKey = previous LastEvaluatedKey until absent — native cursor pagination.',
      'Limit caps items EXAMINED, not items matched after filtering — combine with paging loops carefully.',
      'ProjectionExpression fetches only named attributes (saves bandwidth, not read capacity for the item).'
    ],
    codeSnippet: `const page = await ddb.query({
  TableName: 'Orders',
  KeyConditionExpression: 'userId = :u AND begins_with(sk, :p)',
  ExpressionAttributeValues: { ':u': 'u42', ':p': 'ORDER#2026' },
  Limit: 20,
  ExclusiveStartKey: cursorFromClient // undefined on first page
});
// page.LastEvaluatedKey → return to client as the next cursor`
  },
  {
    id: 'ddb-crud-api',
    title: 'The core item APIs: GetItem, PutItem, UpdateItem, DeleteItem',
    summary:
      'Single-item operations addressed by full primary key — with update expressions for partial changes and condition expressions for safety.',
    difficulty: 'basic',
    category: 'queries & scans',
    prerequisites: ['ddb-primary-keys'],
    keyPoints: [
      'GetItem: one item by exact key (ConsistentRead: true available). PutItem: create OR fully replace.',
      'UpdateItem: modify attributes in place — SET price = :p, ADD loginCount :one, REMOVE tempFlag — without rewriting the item.',
      'BatchGetItem (100 items) / BatchWriteItem (25 puts/deletes) cut round trips; unprocessed items must be retried by the caller.',
      'PutItem silently overwrites — add ConditionExpression attribute_not_exists(pk) to make it insert-only.'
    ]
  },
  {
    id: 'ddb-conditional-writes',
    title: 'Conditional writes and optimistic locking',
    summary:
      'ConditionExpression makes any write atomic-check-then-act — the DynamoDB way to prevent overwrites, duplicates, and lost updates.',
    difficulty: 'intermediate',
    category: 'queries & scans',
    prerequisites: ['ddb-crud-api'],
    keyPoints: [
      'attribute_not_exists(pk) = "insert, don\'t overwrite"; attribute_exists = "update only if present".',
      'Optimistic locking: keep a version attribute; update with ConditionExpression version = :expected and SET version = :expected + 1 — a concurrent writer fails with ConditionalCheckFailedException.',
      'Business rules server-side: SET stock = stock - :n with condition stock >= :n — never oversell, no read-modify-write race.',
      'Failed conditions still consume write capacity — design retries accordingly.'
    ]
  },
  {
    id: 'ddb-transactions',
    title: 'DynamoDB transactions',
    summary:
      'TransactWriteItems/TransactGetItems execute up to 100 operations across tables as all-or-nothing ACID — at double the capacity cost.',
    difficulty: 'intermediate',
    category: 'queries & scans',
    prerequisites: ['ddb-conditional-writes'],
    keyPoints: [
      'TransactWriteItems: mix Put/Update/Delete/ConditionCheck across items and tables; any failed condition cancels everything.',
      'Canonical uses: transfer between two items (ledger), create-order + decrement-stock, uniqueness via a separate "email#x" lock item.',
      'Costs 2x the WCU/RCU of plain writes/reads; contention causes TransactionCanceledException — keep transactions small.',
      'Still the exception, not the rule: single-item atomicity plus good modeling covers most needs (same philosophy as MongoDB).'
    ]
  },

  // ─── CAPACITY & PRICING ─────────────────────────────────────────────────────
  {
    id: 'ddb-capacity-modes',
    title: 'On-demand vs provisioned capacity',
    summary:
      'On-demand bills per request with instant scaling; provisioned pre-buys RCU/WCU per second (cheaper at steady load, throttles beyond it).',
    difficulty: 'basic',
    category: 'capacity & pricing',
    prerequisites: ['ddb-what-is-dynamodb'],
    keyPoints: [
      'On-demand: zero capacity planning, pay per million requests — right for spiky, unpredictable, or new workloads.',
      'Provisioned: fixed RCU/WCU per second (+ auto scaling to follow trends) — significantly cheaper for steady, predictable traffic.',
      'Provisioned throttles when you exceed capacity (brief bursts absorbed by burst credits); on-demand absorbs spikes up to ~2x the previous peak instantly.',
      'You can switch modes (once per 24h) — start on-demand, move to provisioned once traffic is understood is common advice.'
    ]
  },
  {
    id: 'ddb-rcu-wcu',
    title: 'RCUs and WCUs — the capacity math',
    summary:
      '1 WCU = one 1KB write/sec; 1 RCU = one strongly consistent 4KB read/sec (or two eventually consistent) — item size drives cost.',
    difficulty: 'intermediate',
    category: 'capacity & pricing',
    prerequisites: ['ddb-capacity-modes'],
    keyPoints: [
      'Writes: ceil(itemKB / 1) WCU — a 3.5KB item costs 4 WCU per write. Transactional writes double it.',
      'Reads: ceil(itemKB / 4) RCU strongly consistent; half that eventually consistent; double for transactional.',
      'A Query bills on TOTAL data read, rounded up once — reading 100 small items in one query is far cheaper than 100 GetItems.',
      'These units are exactly why "keep items small" and "eventually consistent where possible" are DynamoDB mantras.'
    ]
  },
  {
    id: 'ddb-throttling',
    title: 'Throttling: causes and handling',
    summary:
      'Exceeding table/partition/GSI capacity returns ProvisionedThroughputExceededException — SDKs retry with backoff, but the real fix is capacity or key design.',
    difficulty: 'intermediate',
    category: 'capacity & pricing',
    prerequisites: ['ddb-rcu-wcu', 'ddb-hot-partitions'],
    keyPoints: [
      'Causes: under-provisioned table, hot partition (skewed keys), or an under-provisioned GSI back-pressuring writes.',
      'AWS SDKs auto-retry with exponential backoff + jitter — tune max attempts; surface persistent throttles as errors, not infinite retries.',
      'Diagnose with CloudWatch: ThrottledRequests vs ConsumedCapacity per table AND per GSI.',
      'Fix ladder: switch to on-demand / raise provisioned+autoscaling → fix hot keys (sharding) → cache hot reads (DAX).'
    ]
  },
  {
    id: 'ddb-pricing-model',
    title: 'What do you actually pay for?',
    summary: 'Requests (or provisioned capacity) + storage per GB + extras: streams, backups, global-table replication, and data transfer.',
    difficulty: 'basic',
    category: 'capacity & pricing',
    prerequisites: ['ddb-capacity-modes'],
    keyPoints: [
      'Biggest lever is request cost — which item size, consistency choice, and access patterns control directly.',
      'Storage per GB-month; GSIs store their projections separately (ALL projection on a fat table doubles storage).',
      'Standard-IA table class: ~60% cheaper storage for rarely-accessed data at higher request cost.',
      'TTL deletes are free — the idiomatic way to expire sessions/events instead of paying WCUs to delete them.'
    ]
  },

  // ─── DATA MODELING ──────────────────────────────────────────────────────────
  {
    id: 'ddb-access-patterns-first',
    title: 'Design for access patterns, not entities',
    summary:
      'The DynamoDB modeling method: enumerate every query the app will make FIRST, then design keys/indexes that answer each in one operation.',
    difficulty: 'intermediate',
    category: 'data modeling',
    prerequisites: ['ddb-primary-keys', 'ddb-query-vs-scan'],
    keyPoints: [
      'Write the list: "get user by id", "list a user\'s orders by date", "find order by id", "top products by category" — the schema falls out of this list.',
      'Each pattern should map to a Query/GetItem on the table or a GSI — if one cannot, redesign keys or add an index before shipping.',
      'This is inverted from SQL (normalize now, query later) — say that contrast explicitly in interviews.',
      'New unanticipated pattern later? That is what add-a-GSI is for; truly ad-hoc analytics → export to S3/Athena.'
    ]
  },
  {
    id: 'ddb-single-table-design',
    title: 'Single-table design',
    summary:
      'Store multiple entity types in ONE table using generic PK/SK values (USER#42, ORDER#99) so related items share partitions and load together in one query.',
    difficulty: 'intermediate',
    category: 'data modeling',
    prerequisites: ['ddb-access-patterns-first'],
    keyPoints: [
      "Item collection pattern: PK = 'USER#42' with SK = 'PROFILE', 'ORDER#2026-07-01#99', 'ADDRESS#home' — one Query returns the user AND their orders.",
      'Generic key names (PK/SK, GSI1PK/GSI1SK) + a type attribute distinguish entities; GSIs overload the same way for inverse lookups.',
      'Why: replaces joins with locality — the "get everything for this screen" call is one request.',
      'Costs: harder to read/learn, migrations are trickier, analytics tools dislike it. Multiple simple tables are fine when access patterns are simple — single-table is a technique, not a religion.'
    ]
  },
  {
    id: 'ddb-one-to-many-modeling',
    title: 'Modeling relationships (1:N and N:M)',
    summary: 'Composite sort keys handle one-to-many; an adjacency-list pattern with an inverted GSI handles many-to-many.',
    difficulty: 'intermediate',
    category: 'data modeling',
    prerequisites: ['ddb-single-table-design'],
    keyPoints: [
      "1:N — parent partition, children as sorted items: PK = 'ORDER#99', SK = 'ITEM#1'..'ITEM#20'; Query the partition for order + line items.",
      "N:M adjacency list: store edge items both ways or once with GSI on (SK, PK) inverted — 'students in course' via table, 'courses of student' via the GSI.",
      'Hierarchies via sort-key prefixes: SK = "COUNTRY#DE#CITY#BER#STORE#7" queried with begins_with at any level.',
      'Duplicate small display fields onto edge items (denormalize) to avoid follow-up gets — update them via streams if they change.'
    ]
  },
  {
    id: 'ddb-ttl',
    title: 'TTL — auto-expiring items',
    summary: "Set a numeric epoch-seconds attribute as the table's TTL; DynamoDB deletes expired items in the background at no write cost.",
    difficulty: 'basic',
    category: 'data modeling',
    prerequisites: ['ddb-tables-items-attributes'],
    keyPoints: [
      'Enable TTL on an attribute (e.g. expiresAt); items past that time become eligible for deletion.',
      'Deletion is lazy — typically within minutes but can lag (up to days on huge tables); FILTER expired items in queries rather than trusting instant removal.',
      'TTL deletes appear in Streams (flagged as system deletes) — you can archive expired data via Lambda on the way out.',
      'Standard uses: sessions, OTPs/tokens, event logs, cache-like tables.'
    ]
  },
  {
    id: 'ddb-large-items',
    title: 'Handling items beyond 400KB',
    summary: 'DynamoDB is not a blob store — put the payload in S3 and keep a pointer, or split/compress the item.',
    difficulty: 'basic',
    category: 'data modeling',
    prerequisites: ['ddb-tables-items-attributes'],
    keyPoints: [
      'S3 pointer pattern: item holds metadata + s3://bucket/key; the app fetches the blob separately — the default answer.',
      'Vertical splitting: hot summary attributes in one item, cold detail in another (or several) — reads usually need only the summary.',
      'Compression (gzip in a Binary attribute) buys headroom for text payloads.',
      'Remember cost: capacity units scale with item size — small items are cheaper even far below the 400KB cap.'
    ]
  },

  // ─── CONSISTENCY & TRANSACTIONS ─────────────────────────────────────────────
  {
    id: 'ddb-consistency-models',
    title: 'Eventually vs strongly consistent reads',
    summary:
      'Reads are eventually consistent by default (may miss a just-committed write); ConsistentRead: true forces the latest data at double the read cost.',
    difficulty: 'intermediate',
    category: 'consistency & global tables',
    prerequisites: ['ddb-rcu-wcu'],
    keyPoints: [
      'Writes commit to multiple AZ replicas; a default read may hit a replica that has not applied the newest write yet (replicas typically catch up within milliseconds).',
      'Strong reads: GetItem/Query with ConsistentRead: true — 2x RCU, slightly higher latency, only on the base table and LSIs (never GSIs).',
      'Design pattern: read-your-own-write UX either uses a strong read or echoes the write from app state.',
      'Global tables offer only eventual consistency across regions regardless.'
    ]
  },
  {
    id: 'ddb-streams',
    title: 'DynamoDB Streams',
    summary:
      'A time-ordered change log of item modifications (24h retention) that Lambda can consume — the backbone of event-driven patterns on DynamoDB.',
    difficulty: 'intermediate',
    category: 'consistency & global tables',
    prerequisites: ['ddb-crud-api'],
    keyPoints: [
      'View types: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES — pick what the consumer needs.',
      'Exactly-once appearance in the stream, ordered per item (per shard) — consumers should still be idempotent.',
      'Uses: sync to OpenSearch for search, maintain aggregates/counters, replicate/archive, trigger workflows (order placed → email).',
      'Lambda event source mapping handles polling/batching/retries; failures can go to a DLQ. Kinesis Data Streams integration exists for bigger fan-out/retention.'
    ]
  },
  {
    id: 'ddb-global-tables',
    title: 'Global tables — multi-region replication',
    summary:
      'Multi-active replication of a table across regions: apps read/write locally everywhere, DynamoDB syncs asynchronously with last-writer-wins conflicts.',
    difficulty: 'intermediate',
    category: 'consistency & global tables',
    prerequisites: ['ddb-streams', 'ddb-consistency-models'],
    keyPoints: [
      'Every region accepts writes (multi-active) — low latency for global users and regional failover for DR.',
      'Replication is asynchronous (typically ~1s); concurrent writes to the same item in two regions resolve last-writer-wins — losing writes silently.',
      "Design to avoid conflicts: route each user/tenant's writes to one home region, or make writes commutative/idempotent.",
      'Requires streams; you pay replicated WCUs per region.'
    ]
  },
  {
    id: 'ddb-backups-pitr',
    title: 'Backups and point-in-time recovery',
    summary: 'On-demand backups plus PITR (restore to any second in the last 35 days) — both without consuming table capacity.',
    difficulty: 'basic',
    category: 'consistency & global tables',
    keyPoints: [
      'PITR: continuous backups, restore to any point in the last 1–35 days — the "bad deploy corrupted data at 14:32" insurance.',
      'Restores always create a NEW table (indexes rebuilt, TTL/autoscaling settings not all copied) — plan the cutover.',
      'On-demand backups: manual/scheduled full snapshots, kept until deleted; AWS Backup centralizes policies.',
      'Export-to-S3 (from PITR data) feeds Athena/Glue for analytics without touching table capacity.'
    ]
  },

  // ─── OPERATIONS & ECOSYSTEM ─────────────────────────────────────────────────
  {
    id: 'ddb-dax',
    title: 'DAX — DynamoDB Accelerator',
    summary:
      'A managed, write-through, API-compatible cache in front of DynamoDB — microsecond reads for read-heavy, read-mostly workloads.',
    difficulty: 'intermediate',
    category: 'operations & ecosystem',
    prerequisites: ['ddb-hot-partitions'],
    keyPoints: [
      'Drop-in: the DAX client implements the DynamoDB API — GetItem/Query hit the cache first, misses pass through and populate it.',
      'Item cache + query cache with TTLs; write-through keeps the item cache warm on writes THROUGH DAX.',
      'Reads through DAX are eventually consistent only — strong reads bypass it.',
      'vs Redis/ElastiCache: DAX = zero app logic but DynamoDB-only; Redis = more control/structures but you own the caching code.'
    ]
  },
  {
    id: 'ddb-security-iam',
    title: 'Security: IAM, encryption, VPC endpoints',
    summary:
      'No database users/passwords — every call is IAM-authenticated and policy-authorized, encrypted at rest and in transit by default.',
    difficulty: 'intermediate',
    category: 'operations & ecosystem',
    keyPoints: [
      'IAM policies scope actions (dynamodb:GetItem...) per table/index ARN; roles for services — no credentials in code.',
      'Fine-grained access control: a dynamodb:LeadingKeys condition tied to the caller identity (aws:userid) restricts users to their OWN partition-key items (multi-tenant isolation).',
      'Encryption at rest always on (AWS-owned, AWS-managed, or customer-managed KMS key); TLS in transit.',
      'VPC gateway endpoints keep traffic off the public internet; CloudTrail audits every API call.'
    ]
  },
  {
    id: 'ddb-error-handling',
    title: 'Error handling and SDK retry behavior',
    summary:
      'Design for throttles and partial failures: SDK backoff for 400-capacity/500 errors, explicit handling for conditional failures and unprocessed batch items.',
    difficulty: 'intermediate',
    category: 'operations & ecosystem',
    prerequisites: ['ddb-throttling', 'ddb-conditional-writes'],
    keyPoints: [
      'Retryable: ProvisionedThroughputExceeded, InternalServerError, TransactionConflict — SDKs retry with exponential backoff + jitter automatically.',
      'Not retryable-as-is: ConditionalCheckFailedException (a business outcome, not an outage — handle it), ValidationException.',
      'BatchWriteItem/BatchGetItem return UnprocessedItems/Keys on partial success — loop with backoff until empty (the most-missed bug).',
      'Make writes idempotent where possible so retries are always safe.'
    ]
  },
  {
    id: 'ddb-cost-optimization',
    title: 'Cost optimization checklist',
    summary:
      'Shrink items, read eventually-consistent, project GSIs narrowly, TTL old data, and pick the right capacity mode — cost follows design.',
    difficulty: 'intermediate',
    category: 'operations & ecosystem',
    prerequisites: ['ddb-rcu-wcu', 'ddb-pricing-model'],
    keyPoints: [
      'Small items: short attribute names at extreme scale, blobs to S3, split hot/cold attributes.',
      'Eventually consistent reads are half price — default to them everywhere read-your-write is not required.',
      'GSIs: KEYS_ONLY/INCLUDE projections, sparse indexes; delete unused ones (each write fans out to every GSI).',
      'TTL expires data free; Standard-IA table class for archives; provisioned + auto scaling (or reserved capacity) once traffic is predictable.'
    ]
  },
  {
    id: 'ddb-limits',
    title: 'Limits worth memorizing',
    summary: 'The handful of hard numbers interviewers quiz: 400KB items, 1MB query pages, 100-item transactions, 25-item batch writes.',
    difficulty: 'basic',
    category: 'operations & ecosystem',
    prerequisites: ['ddb-tables-items-attributes'],
    keyPoints: [
      'Item: 400KB max. Query/Scan response: 1MB per page.',
      'BatchWriteItem: 25 items; BatchGetItem: 100 items / 16MB. Transactions: 100 items / 4MB.',
      'Partition throughput: ~3,000 RCU / ~1,000 WCU; partition key value collection with LSI: 10GB.',
      'Indexes: 20 GSIs, 5 LSIs per table. Table/account limits are soft (raiseable); these item-level ones are hard.'
    ]
  },
  {
    id: 'ddb-partiql-tools',
    title: 'PartiQL, the console, and local development',
    summary: 'PartiQL offers SQL-ish syntax over DynamoDB (same key rules apply!), and DynamoDB Local runs the API offline for tests.',
    difficulty: 'basic',
    category: 'operations & ecosystem',
    prerequisites: ['ddb-query-vs-scan'],
    keyPoints: [
      'PartiQL: SELECT/INSERT/UPDATE/DELETE statements — but a SELECT without a key condition is still a full Scan; SQL syntax does not add SQL power.',
      'DynamoDB Local (Java/Docker) emulates the API for offline dev and CI — no AWS bill, no network.',
      'NoSQL Workbench: model single-table designs visually and generate code.',
      'The SDK Document Client (JS) / boto3 resource maps native JS/Python types to DynamoDB attribute types so you skip the {S: "..."} verbosity.'
    ]
  }
];
