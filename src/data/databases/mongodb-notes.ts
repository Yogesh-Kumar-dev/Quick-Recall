import type { Note } from '@/types/content';

// ─── MongoDB notes — the most commonly asked MongoDB interview questions
// (based on the Devinterview MongoDB list, beginner → intermediate) ─────────────

export const mongodbNotes: Note[] = [
  // ─── BASICS ─────────────────────────────────────────────────────────────────
  {
    id: 'mongo-what-is-mongodb',
    title: 'What is MongoDB and what are its main features?',
    summary:
      'A document-oriented NoSQL database that stores JSON-like documents with flexible schemas, built for developer speed and horizontal scale.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'Stores BSON documents (binary JSON) in collections — no fixed table schema.',
      'Rich query language + secondary indexes — unlike simpler key-value stores.',
      'High availability via replica sets (automatic failover), horizontal scaling via sharding.',
      'Aggregation pipeline for in-database analytics and transformations.',
      'Documents map naturally to objects in application code — no ORM impedance mismatch.'
    ]
  },
  {
    id: 'mongo-vs-relational',
    title: 'How does MongoDB differ from relational databases?',
    summary:
      'MongoDB swaps tables/rows/joins for collections/documents/embedding — schema lives in your app, and related data is usually stored together.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['mongo-what-is-mongodb'],
    keyPoints: [
      'Terminology map: table → collection, row → document, column → field, JOIN → $lookup or embedding.',
      'Schema-flexible: two documents in one collection may have different fields; the application enforces shape (or schema validation rules).',
      'Data that is accessed together is stored together (embedding) instead of normalized across tables and joined at read time.',
      'Scaling model: MongoDB was designed to shard horizontally; relational databases traditionally scale up first.',
      'Since v4.0 MongoDB also has multi-document ACID transactions — the old "no transactions" objection is outdated.'
    ]
  },
  {
    id: 'mongo-document',
    title: 'What is a document? What is BSON?',
    summary: 'A document is a set of field–value pairs (like a JSON object) stored as BSON — binary JSON with extra types.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['mongo-what-is-mongodb'],
    keyPoints: [
      'BSON adds types JSON lacks: ObjectId, Date, int32/int64, Decimal128, binary data.',
      'Documents can nest sub-documents and arrays (up to 100 levels).',
      'Max document size: 16 MB — a design guardrail, not a target; approaching it means the model is wrong (or you need GridFS for files).',
      'Every document has a unique _id field, its primary key.'
    ]
  },
  {
    id: 'mongo-collections',
    title: 'Collections and databases',
    summary: 'A collection is a group of documents (analogous to a table, minus the schema); a database is a group of collections.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['mongo-document'],
    keyPoints: [
      'Collections are created implicitly on first insert — no CREATE TABLE step.',
      'db.createCollection() exists for special cases: capped collections, schema validation rules, collation.',
      'Convention: one collection per entity type (users, orders); documents inside can still vary in shape (polymorphism).',
      'One mongod can host many databases; the default port is 27017.'
    ]
  },
  {
    id: 'mongo-id-field',
    title: 'The _id field and ObjectId',
    summary:
      'Every document gets a unique, automatically indexed _id; the default ObjectId is a 12-byte value that encodes its creation time.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['mongo-document'],
    keyPoints: [
      'ObjectId = 4-byte timestamp + 5-byte random + 3-byte counter — unique without any central coordinator.',
      'Because of the timestamp prefix, sorting by _id approximates insertion order, and objectId.getTimestamp() recovers the creation time.',
      'You can supply your own _id (e.g. a natural key like an email or a UUID) — it just has to be unique.',
      'The _id index is created automatically and cannot be dropped.'
    ]
  },
  {
    id: 'mongo-when-to-use',
    title: 'When is MongoDB a good (or bad) fit?',
    summary:
      'Great for evolving, document-shaped, read-together data at scale; weaker when data is highly relational and queried in ad-hoc combinations.',
    difficulty: 'intermediate',
    category: 'basics',
    prerequisites: ['mongo-vs-relational'],
    keyPoints: [
      'Good fits: content/catalogs, user profiles, event data, IoT, mobile backends — objects with nesting that are read as a unit.',
      'Rapidly evolving schemas: add fields without migrations (but handle old shapes in code).',
      'Weaker fits: heavily relational data with many-to-many links queried every which way, or reporting that joins everything (that is SQL territory).',
      'The honest interview answer: choose per workload — most companies run MongoDB AND a relational database.'
    ]
  },

  // ─── CRUD & QUERIES ─────────────────────────────────────────────────────────
  {
    id: 'mongo-insert',
    title: 'Inserting documents: insertOne and insertMany',
    summary: 'insertOne adds a single document, insertMany a batch; _id is generated if absent.',
    difficulty: 'basic',
    category: 'crud & queries',
    prerequisites: ['mongo-collections'],
    keyPoints: [
      "db.users.insertOne({ name: 'Ada', age: 36 }) — returns the generated _id.",
      'insertMany([...]) is far faster than looping insertOne (one round trip, batched writes).',
      'insertMany is ordered by default: it stops at the first error; { ordered: false } continues past failures (e.g. duplicate keys).',
      'Inserting into a collection that does not exist creates it.'
    ]
  },
  {
    id: 'mongo-find',
    title: 'Reading data: find, findOne, projections',
    summary: 'find(filter, projection) returns a cursor of matching documents; findOne returns the first match or null.',
    difficulty: 'basic',
    category: 'crud & queries',
    prerequisites: ['mongo-insert'],
    keyPoints: [
      'db.users.find({ age: { $gte: 18 } }) — filter documents; {} matches everything.',
      'Projection picks fields: find(filter, { name: 1, email: 1, _id: 0 }) — include (1) or exclude (0), not both mixed (except _id).',
      "Dot notation reaches into nested docs and arrays: find({ 'address.city': 'Berlin' }).",
      'find returns a cursor — drivers expose it as an iterable/toArray; the shell auto-prints the first 20.'
    ]
  },
  {
    id: 'mongo-query-operators',
    title: 'Query operators: $gt, $in, $and, $or, $exists, $regex',
    summary: 'Filters are documents too — operator objects express comparisons, logic, and field tests.',
    difficulty: 'basic',
    category: 'crud & queries',
    prerequisites: ['mongo-find'],
    keyPoints: [
      'Comparison: $eq, $ne, $gt/$gte, $lt/$lte, $in/$nin — { age: { $gte: 18, $lt: 65 } }.',
      'Logical: $and (implicit when you list multiple fields), $or, $not, $nor.',
      'Field tests: $exists (field present), $type; $regex for pattern matching (unanchored regexes cannot use indexes efficiently).',
      'Array operators: $all (contains all values), $size, $elemMatch (one element satisfies multiple conditions).'
    ],
    codeSnippet: `db.products.find({
  $or: [{ stock: 0 }, { discontinued: true }],
  price: { $lte: 100 },
  tags: { $all: ['sale', 'clearance'] }
});`
  },
  {
    id: 'mongo-update',
    title: 'Updating documents: updateOne, updateMany, $set and friends',
    summary: 'Updates take a filter plus update operators — $set changes fields; forgetting operators replaces the whole document.',
    difficulty: 'basic',
    category: 'crud & queries',
    prerequisites: ['mongo-find'],
    keyPoints: [
      "updateOne(filter, { $set: { status: 'active' } }) — modify specific fields on the first match; updateMany for all matches.",
      'Operators: $set, $unset (remove field), $inc (atomic increment), $push/$pull/$addToSet (arrays), $min/$max, $rename.',
      'replaceOne swaps the entire document (except _id) — that is the intent behind "replace", never an accident.',
      '{ upsert: true } inserts the document if no match exists — insert-or-update in one atomic call.',
      'findOneAndUpdate returns the document (before or after the change) — read-and-modify in one step.'
    ],
    gotcha:
      'Passing a plain object as the update ({ status: "active" } without $set) replaces the whole document in older APIs — the classic data-loss mistake this question fishes for.'
  },
  {
    id: 'mongo-delete',
    title: 'Deleting documents: deleteOne and deleteMany',
    summary: 'deleteOne removes the first match, deleteMany all matches — and deleteMany({}) empties the collection.',
    difficulty: 'basic',
    category: 'crud & queries',
    prerequisites: ['mongo-find'],
    keyPoints: [
      'Both take the same filter shape as find; both return deletedCount.',
      'For huge purges, drop() the collection (instant) beats deleteMany({}) (document by document) when you truly want everything gone.',
      'Soft-delete pattern: set a deletedAt field instead, filter it out in queries — common in production apps.',
      'TTL indexes delete expired documents automatically — for sessions, tokens, logs.'
    ]
  },
  {
    id: 'mongo-cursor-methods',
    title: 'sort, skip, limit — and pagination',
    summary: 'Cursor modifiers shape the result set; skip/limit paginates simply, range-based pagination scales.',
    difficulty: 'basic',
    category: 'crud & queries',
    prerequisites: ['mongo-find'],
    keyPoints: [
      '.sort({ createdAt: -1 }).skip(20).limit(10) — page 3 of 10-per-page, newest first.',
      'skip walks past every skipped document — deep pages get slow, same problem as SQL OFFSET.',
      'Range/cursor pagination: filter { _id: { $lt: lastSeenId } } with sort and limit — constant cost at any depth.',
      'Sorts without a supporting index happen in memory (bounded ~100MB) — large un-indexed sorts fail or spill; index your sort keys.'
    ]
  },
  {
    id: 'mongo-lookup-join',
    title: 'Can you join collections? ($lookup)',
    summary: 'Yes — $lookup in the aggregation pipeline performs a left outer join; but frequent joins hint the data should be embedded.',
    difficulty: 'intermediate',
    category: 'crud & queries',
    prerequisites: ['mongo-aggregation-pipeline'],
    keyPoints: [
      "$lookup: { from: 'orders', localField: '_id', foreignField: 'userId', as: 'orders' } — attaches an ARRAY of matches to each document.",
      'It is a left outer join: documents with no match get an empty array.',
      '$unwind after $lookup flattens the array into one document per match when needed.',
      'Design smell: if a hot path needs $lookup on every request, embedding (or duplicating a few fields) is usually the better model.'
    ]
  },
  {
    id: 'mongo-schema-validation',
    title: 'Schema validation rules',
    summary: '"Schemaless" is optional — collections can enforce a JSON Schema on writes.',
    difficulty: 'intermediate',
    category: 'crud & queries',
    prerequisites: ['mongo-collections'],
    keyPoints: [
      'createCollection with validator: { $jsonSchema: { required: [...], properties: {...} } }.',
      'validationLevel: strict (all writes) or moderate (only already-valid docs); validationAction: error or warn.',
      'Catches malformed writes from ANY client — like database constraints in SQL, cheaper than debugging bad data later.',
      'App-layer schemas (Mongoose) complement but do not replace this — scripts and other services bypass Mongoose.'
    ]
  },

  // ─── AGGREGATION ────────────────────────────────────────────────────────────
  {
    id: 'mongo-aggregation-pipeline',
    title: 'What is the aggregation pipeline?',
    summary: 'A sequence of stages that documents flow through — each stage transforms the stream: filter, group, reshape, join, sort.',
    difficulty: 'intermediate',
    category: 'aggregation',
    prerequisites: ['mongo-find'],
    keyPoints: [
      'db.orders.aggregate([{ $match }, { $group }, { $sort }]) — stages run in order, output of one feeds the next.',
      'Core stages: $match (filter), $group (aggregate), $project (reshape), $sort, $limit/$skip, $lookup (join), $unwind (explode arrays), $count.',
      "It is MongoDB's answer to GROUP BY + JOIN + expressions — most reporting queries live here.",
      '$out / $merge can write the pipeline result to a collection (materialized results).'
    ],
    codeSnippet: `db.orders.aggregate([
  { $match: { status: 'paid' } },
  { $group: { _id: '$customerId', spent: { $sum: '$total' }, count: { $sum: 1 } } },
  { $sort: { spent: -1 } },
  { $limit: 10 }
]); // top 10 customers by revenue`
  },
  {
    id: 'mongo-match-group-sort',
    title: '$match, $group and $sort in depth',
    summary: 'The three stages behind almost every aggregation — with $match placement being the key performance lever.',
    difficulty: 'intermediate',
    category: 'aggregation',
    prerequisites: ['mongo-aggregation-pipeline'],
    keyPoints: [
      '$match uses normal query syntax; put it FIRST so it can use indexes and shrink the stream early.',
      "$group: { _id: '$field' or expression, ... accumulators } — $sum, $avg, $min/$max, $push (collect array), $addToSet, $first/$last.",
      '_id: null groups everything into one document (grand totals).',
      '$sort after $group cannot use indexes (data is derived) — keep the grouped set small.',
      'Group by computed keys: _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } for monthly rollups.'
    ]
  },
  {
    id: 'mongo-unwind',
    title: '$unwind — working with arrays in pipelines',
    summary: 'Explodes an array field into one document per element, so array contents can be matched, grouped, and counted.',
    difficulty: 'intermediate',
    category: 'aggregation',
    prerequisites: ['mongo-aggregation-pipeline'],
    keyPoints: [
      "{ $unwind: '$tags' } turns 1 doc with 3 tags into 3 docs with 1 tag each.",
      'Standard pattern: $unwind then $group to count occurrences across arrays (top tags, popular items in orders).',
      'Docs with empty/missing arrays disappear by default — preserveNullAndEmptyArrays: true keeps them.',
      'Also the standard follow-up to $lookup when you expect exactly one match.'
    ]
  },
  {
    id: 'mongo-aggregation-vs-mapreduce',
    title: 'Aggregation pipeline vs map-reduce vs simple queries',
    summary: 'Use find for filtering, the pipeline for analytics; map-reduce is deprecated legacy.',
    difficulty: 'basic',
    category: 'aggregation',
    prerequisites: ['mongo-aggregation-pipeline'],
    keyPoints: [
      'find() covers filter + projection + sort — reach for aggregate only when you need grouping, joins, or reshaping.',
      'The pipeline is optimized native code and the planner can merge/reorder stages; mapReduce ran JavaScript per document and is deprecated (removed in modern versions).',
      'Single-purpose helpers like countDocuments and distinct are pipeline shortcuts under the hood.'
    ]
  },

  // ─── INDEXES ────────────────────────────────────────────────────────────────
  {
    id: 'mongo-indexes',
    title: 'Indexes in MongoDB — what and why',
    summary: 'B-tree structures over chosen fields that let queries seek instead of scanning every document in the collection.',
    difficulty: 'basic',
    category: 'indexes',
    prerequisites: ['mongo-find'],
    keyPoints: [
      'Without an index, every query is a COLLSCAN — fine at 1k documents, fatal at 10M.',
      'createIndex({ email: 1 }) — 1 ascending, -1 descending (direction matters mainly for compound sorts).',
      'Types: single field, compound, multikey (auto, for arrays), text, geospatial (2dsphere), hashed, TTL, unique, partial.',
      'Each index costs write overhead and RAM — index what you query, prune what you do not (check $indexStats).'
    ]
  },
  {
    id: 'mongo-compound-indexes',
    title: 'Compound indexes and the ESR rule',
    summary: 'Multi-field indexes serve queries on leftmost prefixes; order fields Equality → Sort → Range for best results.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['mongo-indexes'],
    keyPoints: [
      'Index { status: 1, createdAt: -1 } serves { status }, and { status + createdAt } queries/sorts — but not createdAt alone.',
      'ESR rule: put Equality-matched fields first, then the Sort field, then Range filters.',
      'A compound index can satisfy a sort and avoid an in-memory sort — check explain for SORT stage absence.',
      'A multikey (array) field can appear in a compound index, but only one array field per index.'
    ]
  },
  {
    id: 'mongo-ttl-unique-partial',
    title: 'TTL, unique, and partial indexes',
    summary: 'Special-purpose indexes: auto-expiring data, enforced uniqueness, and indexing only a subset of documents.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['mongo-indexes'],
    keyPoints: [
      'TTL: createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }) — a background job deletes expired docs (sessions, tokens, logs). Deletion is approximate, not instant.',
      'Unique: { email: 1 }, { unique: true } — duplicate inserts error. Note: missing field counts as null, so two docs without the field collide.',
      'Partial: { partialFilterExpression: { status: "active" } } — smaller index over just the hot subset; combine with unique for conditional uniqueness.',
      'Sparse indexes are the older, cruder version of partial — prefer partial.'
    ]
  },
  {
    id: 'mongo-explain',
    title: 'explain() — reading query plans',
    summary:
      'explain shows whether a query used an index (IXSCAN) or scanned the collection (COLLSCAN), and how many documents it touched.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['mongo-indexes'],
    keyPoints: [
      "db.users.find({...}).explain('executionStats') — the mode that includes real counts.",
      'Key fields: stage (IXSCAN vs COLLSCAN), nReturned, totalKeysExamined, totalDocsExamined.',
      'Healthy ratio: docsExamined close to nReturned. Examined 100k to return 10 → wrong/missing index.',
      'A SORT stage in the plan means an in-memory sort — often fixable with a compound index in the right order.'
    ]
  },
  {
    id: 'mongo-covered-query',
    title: 'What is a covered query?',
    summary:
      'A query answered entirely from the index — filter fields AND projected fields all live in the index, so no documents are fetched.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['mongo-compound-indexes', 'mongo-explain'],
    keyPoints: [
      'Requirements: all filter fields in the index, projection includes ONLY indexed fields, and _id excluded (unless indexed).',
      'explain shows totalDocsExamined: 0 — the tell of a covered query.',
      'Fastest query MongoDB can run — worth engineering for hot read paths.',
      'Same idea as an index-only scan in Postgres.'
    ],
    codeSnippet: `db.users.createIndex({ email: 1, name: 1 });
db.users.find({ email: 'a@b.com' }, { _id: 0, email: 1, name: 1 });
// covered: totalDocsExamined = 0`
  },

  // ─── SCHEMA DESIGN ──────────────────────────────────────────────────────────
  {
    id: 'mongo-embed-vs-reference',
    title: 'Embedding vs referencing documents',
    summary: 'THE MongoDB design question: nest related data inside the parent, or store it separately and link by id.',
    difficulty: 'intermediate',
    category: 'schema design',
    prerequisites: ['mongo-document'],
    keyPoints: [
      'Embed when data is read together, belongs to the parent, and is bounded (address in user, line items in order).',
      'Reference when the related data is large, unbounded, shared by many parents, or queried on its own (users ↔ orders).',
      'Embedding gives one-read access and atomic single-document updates; referencing needs a second query or $lookup.',
      'Guiding principle: "data that is accessed together should be stored together" — model around your queries, not around normalization rules.'
    ],
    gotcha:
      'The unbounded-array trap: embedding an ever-growing list (comments on a viral post) bloats documents toward the 16MB cap and slows every read — cap it or reference.'
  },
  {
    id: 'mongo-one-to-many',
    title: 'Modeling one-to-many relationships',
    summary: 'Choose by cardinality: few → embed; many → child references parent; huge → parent must not hold the list at all.',
    difficulty: 'intermediate',
    category: 'schema design',
    prerequisites: ['mongo-embed-vs-reference'],
    keyPoints: [
      'One-to-few (addresses per user): embed the array in the parent.',
      'One-to-many (orders per customer): store customerId on each order (child → parent reference), index it.',
      'One-to-squillions (log lines per device): only child-side references work — never an array of ids on the parent.',
      'Hybrid/subset pattern: embed the 10 most recent + keep the full set in its own collection — one read for the common case.'
    ]
  },
  {
    id: 'mongo-schema-patterns',
    title: 'Common schema design patterns',
    summary: 'Named patterns interviewers expect: computed, bucket, extended reference, outlier, polymorphic.',
    difficulty: 'intermediate',
    category: 'schema design',
    prerequisites: ['mongo-embed-vs-reference'],
    keyPoints: [
      'Computed: store the derived value (orderCount, avgRating) on write instead of aggregating on every read.',
      'Bucket: group time-series points into one doc per device+hour — fewer, fatter documents (native time-series collections now cover much of this).',
      'Extended reference: duplicate the 2–3 fields you always need (customer name on the order) to skip the $lookup; accept the sync cost.',
      'Polymorphic: different shapes share a collection with a type field — products with per-type attributes.',
      'Outlier: model for the normal case; flag the rare monster document and handle it specially.'
    ]
  },
  {
    id: 'mongo-schema-performance',
    title: 'How schema design impacts performance',
    summary: 'In MongoDB the schema IS the performance plan — document shape decides reads-per-screen, index size, and update cost.',
    difficulty: 'intermediate',
    category: 'schema design',
    prerequisites: ['mongo-embed-vs-reference', 'mongo-indexes'],
    keyPoints: [
      'Design for the queries: the ideal is one document read per screen/API call.',
      'Large documents waste I/O when you only need a slice; projections help but the fetch already paid the cost.',
      'Growing documents (pushing to arrays) cause rewrites and index churn; unbounded growth is the #1 anti-pattern.',
      'Workload first: list your top queries and writes, then shape documents and indexes around them — the opposite of SQL "normalize first" instinct.'
    ]
  },
  {
    id: 'mongo-data-types',
    title: 'BSON data types worth knowing',
    summary: 'Dates, numbers and Decimal128 have interview-relevant edge cases beyond plain JSON types.',
    difficulty: 'basic',
    category: 'schema design',
    prerequisites: ['mongo-document'],
    keyPoints: [
      'Date: stored as int64 ms since epoch, always UTC — store real Date values, not strings, or you lose date math, $dateToString, and TTL indexes.',
      'Numbers: int32, int64 (Long), double (default from JS!), Decimal128 for money — never store currency as double.',
      'ObjectId, Binary (BinData), and arrays/embedded docs round out the common set.',
      'Type matters in comparisons and indexes: the string "5" and the number 5 are different values in different type brackets.'
    ]
  },
  {
    id: 'mongo-gridfs',
    title: 'GridFS — storing files',
    summary:
      'A convention for storing files larger than 16MB by chunking them across two collections (fs.files metadata + fs.chunks data).',
    difficulty: 'intermediate',
    category: 'schema design',
    keyPoints: [
      'Splits files into 255KB chunks; drivers stream them back in order.',
      'Use when files must live inside MongoDB (replication/backup with the data, no separate store available).',
      'In practice object storage (S3 + a URL in the document) is usually the better answer — say that, then explain GridFS.',
      'Small binaries (thumbnails, < a few hundred KB) can just be BinData fields inline.'
    ]
  },

  // ─── REPLICATION & SHARDING ─────────────────────────────────────────────────
  {
    id: 'mongo-replica-sets',
    title: 'Replica sets — high availability',
    summary:
      'A replica set is a group of mongod nodes with one primary (writes) and secondaries that replicate it, with automatic failover.',
    difficulty: 'intermediate',
    category: 'replication & sharding',
    prerequisites: ['mongo-what-is-mongodb'],
    keyPoints: [
      'All writes go to the primary; secondaries tail its oplog and apply the same operations.',
      'If the primary dies, secondaries hold an election and promote one — clients reconnect automatically via the driver.',
      'Minimum sensible deployment: 3 nodes (or 2 + arbiter) so elections have a majority.',
      'Read preference lets you read from secondaries (primary, primaryPreferred, secondary, nearest) — at the cost of possibly stale reads.'
    ]
  },
  {
    id: 'mongo-oplog',
    title: 'What is the oplog?',
    summary: 'The operations log — a capped collection on the primary recording every write, which secondaries replay to stay in sync.',
    difficulty: 'intermediate',
    category: 'replication & sharding',
    prerequisites: ['mongo-replica-sets'],
    keyPoints: [
      'Idempotent operations: replaying twice is safe (e.g. $inc is recorded as the resulting $set).',
      'Capped/circular: old entries roll off — a secondary offline longer than the oplog window must full-resync.',
      'The oplog window (how much history fits) is a key ops metric — size it for your maintenance windows.',
      'Change streams are built on the oplog — the supported way to react to data changes in app code.'
    ]
  },
  {
    id: 'mongo-write-concern',
    title: 'Write concern and read concern',
    summary:
      'Write concern = how many nodes must acknowledge a write; read concern = how committed the data you read must be. Together they trade durability vs latency.',
    difficulty: 'intermediate',
    category: 'replication & sharding',
    prerequisites: ['mongo-replica-sets'],
    keyPoints: [
      "w: 1 (default-ish) = primary only — fast, but a failover right after can lose the write; w: 'majority' = durable across elections.",
      'j: true additionally waits for the on-disk journal.',
      "readConcern 'majority' avoids reading data that could be rolled back; 'local' is fastest.",
      "The safe-by-default combo for important data: w: 'majority' writes + 'majority' reads. Causal consistency/sessions give read-your-own-writes."
    ]
  },
  {
    id: 'mongo-sharding',
    title: 'What is sharding and when do you need it?',
    summary: 'Partitioning a collection across multiple replica sets (shards) by a shard key — MongoDB routes queries via mongos.',
    difficulty: 'intermediate',
    category: 'replication & sharding',
    prerequisites: ['mongo-replica-sets'],
    keyPoints: [
      'Components: shards (data, each a replica set), mongos (query router), config servers (metadata).',
      'Data splits into chunks by shard key range/hash; the balancer moves chunks to even out load.',
      'Queries containing the shard key route to one shard (targeted); others fan out to all shards (scatter-gather) — much slower.',
      'Shard when a single replica set genuinely cannot hold the data or write load — not before; sharding adds real operational complexity.'
    ]
  },
  {
    id: 'mongo-shard-key',
    title: 'Choosing a shard key',
    summary:
      'The single most important sharding decision: it must spread writes evenly AND match your query patterns — and it is hard to change.',
    difficulty: 'intermediate',
    category: 'replication & sharding',
    prerequisites: ['mongo-sharding'],
    keyPoints: [
      'Want: high cardinality, even distribution, present in most queries.',
      'Monotonic keys (timestamps, ObjectId) funnel all inserts to one "hot" shard — use hashed sharding or a compound key to fix.',
      'Low-cardinality keys (country) cap the number of usable shards and create jumbo chunks.',
      'Classic good pattern: { tenantId: 1, _id: hashed-ish } — tenant queries stay targeted, writes spread.'
    ]
  },
  {
    id: 'mongo-scaling',
    title: 'Vertical vs horizontal scaling in MongoDB',
    summary: 'Scale up (bigger node) for simplicity, scale reads with replicas, scale writes/data with sharding — in that order.',
    difficulty: 'basic',
    category: 'replication & sharding',
    prerequisites: ['mongo-replica-sets', 'mongo-sharding'],
    keyPoints: [
      'Vertical: more RAM is the cheapest win — MongoDB thrives when the working set (hot data + indexes) fits in memory.',
      'Read scaling: secondary reads (accepting staleness) offload the primary.',
      'Write/data scaling: sharding is the only way to spread writes across machines.',
      'Interview framing: exhaust the simple options and measure before reaching for shards.'
    ]
  },

  // ─── TRANSACTIONS, PERFORMANCE & OPS ────────────────────────────────────────
  {
    id: 'mongo-atomicity-transactions',
    title: 'Atomicity and multi-document transactions',
    summary:
      'Single-document writes are always atomic; since 4.0, multi-document ACID transactions exist — but good schema design avoids needing them.',
    difficulty: 'intermediate',
    category: 'transactions & performance',
    prerequisites: ['mongo-embed-vs-reference'],
    keyPoints: [
      'One document update (even deeply nested fields) is atomic — embedding related data buys you "transactions for free".',
      'session.withTransaction(async () => { ...multiple writes... }) — all-or-nothing across documents/collections (and shards, 4.2+).',
      'Transactions cost performance (locks held, oplog batching) and have limits (runtime, size) — a tool, not a default.',
      'The interview line: "model so single-document atomicity covers the common case; use transactions for genuine cross-entity invariants like ledger transfers."'
    ]
  },
  {
    id: 'mongo-performance-diagnosis',
    title: 'Diagnosing performance problems',
    summary: 'Profile slow queries, explain them, check index usage and working-set-vs-RAM — the standard triage loop.',
    difficulty: 'intermediate',
    category: 'transactions & performance',
    prerequisites: ['mongo-explain'],
    keyPoints: [
      'Database profiler / slow query log surfaces operations over a threshold; Atlas has the Query Profiler UI.',
      'explain the offenders: COLLSCANs and huge docsExamined/nReturned ratios → indexing work.',
      'Server-level: mongostat/mongotop, page faults (working set exceeds RAM), replication lag, connection counts.',
      'Common causes: missing indexes, unindexed sorts, unbounded array growth, huge documents, $lookup-heavy hot paths, undersized RAM.'
    ]
  },
  {
    id: 'mongo-working-set-ram',
    title: 'Why "indexes should fit in RAM"',
    summary:
      'MongoDB (WiredTiger) serves hot data from its in-memory cache — if indexes and the working set spill to disk, every query pays disk latency.',
    difficulty: 'intermediate',
    category: 'transactions & performance',
    prerequisites: ['mongo-indexes'],
    keyPoints: [
      'Working set = the documents + index pages your workload actually touches.',
      'db.collection.totalIndexSize() — compare the sum against available cache (default ~50% of RAM).',
      'Page faults / cache eviction churn are the symptoms; more RAM or smaller indexes (partial, prune unused) are the fixes.',
      'Same principle drives "prefer covered queries" — index-only reads stay in cache.'
    ]
  },
  {
    id: 'mongo-storage-engines',
    title: 'WiredTiger (vs the old MMAPv1)',
    summary:
      'WiredTiger is the default storage engine: document-level locking, compression, and an internal cache — MMAPv1 is history but still asked about.',
    difficulty: 'basic',
    category: 'transactions & performance',
    keyPoints: [
      'Document-level concurrency (MMAPv1 locked whole collections — a major bottleneck).',
      'On-disk compression (snappy/zstd) — big storage savings.',
      'Journaling: write-ahead log gives crash durability.',
      'You would only mention alternatives (in-memory engine for Enterprise) if asked; MMAPv1 was removed in 4.2.'
    ]
  },
  {
    id: 'mongo-security',
    title: 'MongoDB security essentials',
    summary: 'Enable auth, use role-based access control, encrypt in transit and at rest, and never expose mongod to the internet.',
    difficulty: 'intermediate',
    category: 'transactions & performance',
    keyPoints: [
      'Authentication (SCRAM default; x.509/LDAP/Kerberos in enterprise setups) — auth is OFF in a default local install; enable it everywhere real.',
      'Authorization: built-in roles (read, readWrite, dbAdmin) + custom roles — least privilege per app/service.',
      'TLS for all client and inter-node traffic; encryption at rest via WiredTiger encryption or disk-level.',
      'Network hygiene: bind to private interfaces, firewall 27017, IP allowlists (Atlas does this by default).',
      'The infamous "open MongoDB on the internet" breaches all trace back to no-auth + public binding.'
    ]
  },
  {
    id: 'mongo-backups',
    title: 'Backups and restore',
    summary: 'mongodump/mongorestore for logical backups, filesystem/cloud snapshots for big deployments, point-in-time restore via oplog.',
    difficulty: 'basic',
    category: 'transactions & performance',
    keyPoints: [
      'mongodump exports BSON per collection; mongorestore loads it — simple, slow at large scale.',
      'Snapshot-based backups (EBS/LVM, Atlas continuous backups) scale better and support point-in-time recovery when combined with the oplog.',
      'Restore drills matter more than backup configs — an untested backup is a hope, not a plan.',
      'Replicas are NOT backups: a bad deleteMany replicates instantly to every secondary.'
    ]
  },
  {
    id: 'mongo-change-streams',
    title: 'Change streams',
    summary: 'A supported API to subscribe to data changes (insert/update/delete) in real time — built on the oplog, resumable via tokens.',
    difficulty: 'intermediate',
    category: 'transactions & performance',
    prerequisites: ['mongo-oplog'],
    keyPoints: [
      "db.orders.watch([{ $match: { operationType: 'insert' } }]) — filtered event stream.",
      'Resume tokens let a consumer continue after a disconnect without missing events.',
      'Uses: cache invalidation, syncing to search indexes, notifications, event-driven pipelines — instead of polling or tailing the oplog by hand.',
      'Requires a replica set (even a single-node one) — it rides on replication.'
    ]
  },
  {
    id: 'mongo-mongoose',
    title: 'What is Mongoose and when do you want it?',
    summary: 'The most popular Node.js ODM for MongoDB — app-level schemas, validation, middleware and typed models over the raw driver.',
    difficulty: 'basic',
    category: 'transactions & performance',
    prerequisites: ['mongo-schema-validation'],
    keyPoints: [
      'Schemas + models: new Schema({ email: { type: String, required: true, unique: true } }) → User.find(), user.save().',
      'Features: validation, defaults, virtuals, pre/post middleware (hooks), populate() (app-level $lookup-ish reference resolution).',
      'Costs: some performance overhead and schema rigidity; the native driver is leaner for simple or perf-critical services.',
      'Gotcha people fish for: unique in Mongoose builds an index, it is NOT a validation — race conditions still need the real unique index (and it is created lazily).'
    ]
  },
  {
    id: 'mongo-capped-collections',
    title: 'Capped collections',
    summary: 'Fixed-size, insertion-ordered collections that overwrite the oldest documents when full — a built-in ring buffer.',
    difficulty: 'basic',
    category: 'transactions & performance',
    keyPoints: [
      "createCollection('log', { capped: true, size: 10485760, max: 100000 }).",
      'Preserve insertion order, support tailable cursors (the oplog itself is capped).',
      'No deletes of individual docs, updates cannot grow documents.',
      'Modern alternatives usually win: TTL indexes for expiry, time-series collections for metrics — mention them.'
    ]
  }
];
