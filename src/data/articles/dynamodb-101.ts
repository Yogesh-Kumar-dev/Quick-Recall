import type { Article } from '@/types/content';

export const dynamodb101Article: Article = {
  id: 'dynamodb-101',
  slug: 'dynamodb-101',
  category: 'Databases',
  title: 'DynamoDB 101 and Beyond',
  summary:
    'A from-scratch guide to AWS DynamoDB: what a managed NoSQL database actually means, how partition and sort keys shape everything you can query, capacity modes, indexes, single-table design, consistency, and the classic interview gotchas.',
  topics: ['Databases', 'DynamoDB', 'AWS', 'NoSQL'],
  difficulty: 'intermediate',
  blocks: [
    { type: 'heading', id: 'what-is-managed-nosql', level: 2, text: 'What "managed NoSQL database" actually means' },
    {
      type: 'paragraph',
      text: 'Start with the two words separately, since each one is doing real work. "NoSQL" is a loose label for databases that don\'t use the traditional relational model of fixed tables with rigid, predefined columns joined together by foreign keys. Instead, NoSQL databases like DynamoDB let each record (called an item) carry its own set of attributes, similar to how a JavaScript object can have whatever keys it wants without a schema forcing every object in an array to match. "Managed" means AWS runs the actual servers, handles hardware failures, patches software, and scales capacity behind the scenes; you interact with DynamoDB purely through an API, and you never SSH into a machine or tune a config file the way you might with a self-hosted database.'
    },
    {
      type: 'paragraph',
      text: "Put together, DynamoDB is AWS's fully managed, NoSQL, key-value and wide-column database. It's designed from the ground up for a specific promise: consistent, single-digit-millisecond performance at effectively unlimited scale, whether your table holds a thousand items or a trillion. That promise is real, but it comes with a very different way of thinking about your data than a relational database teaches you, and getting that mental shift right up front is most of what makes DynamoDB click."
    },
    { type: 'heading', id: 'the-sql-mental-shift', level: 2, text: 'The mental shift, coming from SQL' },
    {
      type: 'paragraph',
      text: 'In a relational database, the standard workflow is: design your tables around the entities in your domain (users, orders, products), normalize them so each fact lives in exactly one place, and write whatever SQL query you need later, joining tables together on the fly. The query comes last, because SQL is flexible enough to answer almost any question against a well-normalized schema, even one nobody anticipated when the schema was designed.'
    },
    {
      type: 'paragraph',
      text: 'DynamoDB flips that order. You are expected to know your access patterns (the exact questions your application will ask, like "get this user\'s profile" or "list this user\'s last 20 orders") before you design the table, because the table\'s primary key structure determines what you can efficiently query, and that structure is very expensive to change once you have production data and traffic depending on it. Attribute flexibility (each item can have different fields) is real and genuinely useful, but it doesn\'t rescue you from a badly chosen primary key. "Design for your access patterns" isn\'t a slogan, it\'s the literal first step of using DynamoDB correctly.'
    },
    { type: 'heading', id: 'primary-key', level: 2, text: 'The primary key: partition key and sort key' },
    {
      type: 'paragraph',
      text: 'Every item in a DynamoDB table is located using its primary key, and that key is built from one or two pieces.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "Partition key (PK): a value that DynamoDB runs through a hash function to decide which physical partition (a shard of storage and throughput) the item lives on. Every single read or write must supply the partition key; it's the one truly mandatory piece of any lookup, the same way you can't ask \"give me this row\" in SQL without knowing which table it's in.",
        'Sort key (SK, optional): a second value that orders items sharing the same partition key, and lets you query a contiguous range within that one partition, using conditions like begins_with, between, or simple greater-than/less-than comparisons.',
        'When a table has both, the pair (PK, SK) together is called a composite primary key, and no two items in the table can share the exact same combination.'
      ]
    },
    {
      type: 'paragraph',
      text: 'A composite key unlocks something genuinely powerful: you can store several different kinds of related items under the same partition key, distinguished only by different sort key prefixes, and fetch all of them together in a single, fast query. Concretely, a partition key of "USER#123" could hold one item with sort key "PROFILE" (the user\'s profile) and many items with sort keys like "ORDER#2026-01-01", "ORDER#2026-02-14", and so on (that user\'s orders), all colocated on the same partition, all retrievable together with one Query call.'
    },
    {
      type: 'code',
      code: `// Example items sharing the partition key "USER#123", distinguished by sort key
{ PK: "USER#123", SK: "PROFILE",              name: "Ada Lovelace", email: "ada@example.com" }
{ PK: "USER#123", SK: "ORDER#2026-01-01T09:00", total: 42.00, status: "shipped" }
{ PK: "USER#123", SK: "ORDER#2026-02-14T15:30", total: 18.50, status: "delivered" }

// One Query, PK = "USER#123", SK begins_with "ORDER#", returns every order for this user`
    },
    { type: 'heading', id: 'designing-a-table', level: 2, text: 'Designing a DynamoDB table, step by step' },
    {
      type: 'paragraph',
      text: 'Because the primary key structure is the hard-to-change part, it helps to work through table design in a deliberate order rather than jumping straight to "what fields does a user have."'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'List every access pattern first',
          text: 'Write down, in plain language, every question your application needs to answer against this data: "get a user by ID," "list a user\'s orders newest first," "find an order by its order ID," and so on. Do this before touching the key design; it is the entire input to every decision that follows.'
        },
        {
          title: 'Pick a partition key that spreads traffic evenly',
          text: 'Choose a value that will have many distinct values in practice, and where no single value is disproportionately hot (see the hot partition warning further down). A user ID or an order ID is usually a safer partition key than something coarse like a status field, which might have only a handful of possible values shared by millions of items.'
        },
        {
          title: 'Add a sort key if you need ordering or hierarchy',
          text: 'If an access pattern is "get this parent and a range of its children" (a user and their orders, a blog post and its comments), a sort key with a meaningful prefix, like "ORDER#<timestamp>", is what makes that a single, cheap query instead of multiple round trips.'
        },
        {
          title: 'Check which access patterns the base table cannot answer',
          text: 'Some questions, like "find this order by its order ID alone" when the base table is keyed by user, simply can\'t be served efficiently by the base table\'s primary key. Those are exactly the access patterns a secondary index exists to solve.'
        },
        {
          title: 'Add indexes for the leftover access patterns',
          text: 'For each access pattern the base table can\'t serve, decide between a Local Secondary Index and a Global Secondary Index (covered next), and add it. Every index you add is deliberate, tied to a specific access pattern you wrote down in step one, not a speculative "might need it later."'
        }
      ]
    },
    { type: 'heading', id: 'indexes', level: 2, text: 'Secondary indexes: GSI versus LSI' },
    {
      type: 'paragraph',
      text: 'The base table\'s primary key only serves the access patterns it was designed around. A secondary index is DynamoDB\'s answer to "I also need to query this data a different way," and it works by automatically maintaining a second, differently-keyed copy of your data behind the scenes, so a query against the index is just as fast as a query against the base table.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Local Secondary Index (LSI): keeps the same partition key as the base table, but a different sort key, giving you an alternate ordering within the same partition. An LSI must be declared when the table is first created; you cannot bolt one on later.',
        "Global Secondary Index (GSI): defines its own independent partition key and (optionally) sort key, effectively acting like a second table that DynamoDB keeps automatically and asynchronously in sync with the base table. A GSI can be added at any time, even to a table that's already live in production, which makes it the far more commonly used option of the two."
      ]
    },
    {
      type: 'table',
      columns: ['', 'Local Secondary Index (LSI)', 'Global Secondary Index (GSI)'],
      rows: [
        ['Partition key', 'same as the base table', 'its own, independent partition key'],
        ['When it can be created', 'only at table creation time', 'any time, including on an existing table'],
        ['Read consistency', 'can be strongly consistent', 'eventually consistent only'],
        ['Typical use', 'a second sort order within the same partition', 'a whole new access pattern / query dimension']
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'When in doubt, reach for a GSI',
      text: 'Because an LSI locks you in at table-creation time and a GSI can be added whenever a new access pattern shows up, most real-world designs lean heavily on GSIs and only use an LSI when its specific constraint (same partition key, strongly consistent reads) genuinely matters.'
    },
    { type: 'heading', id: 'single-table-design', level: 2, text: 'Single-table design: the philosophy behind it' },
    {
      type: 'paragraph',
      text: 'In relational database design, normalization (splitting data into many small, single-purpose tables joined at query time) is a virtue: it avoids duplicating data and keeps each fact in one place. DynamoDB inverts that instinct. A common, intentional DynamoDB pattern called single-table design stores several unrelated entity types (users, orders, products, comments) all inside one physical table, distinguished purely by the prefixes used in their partition and sort keys.'
    },
    {
      type: 'paragraph',
      text: 'The reason this makes sense in DynamoDB, and would be a strange thing to do in SQL, comes down to how DynamoDB charges for work: per request, not per row scanned or per join performed. A relational database can afford to join five normalized tables together at query time because a join is "free" in the sense that you already paid a flat cost to run one query. DynamoDB has no join operation at all; fetching related data that lives in separate tables means separate round trips, each with its own cost and latency. Single-table design sidesteps that entirely by making sure a parent and its children live under the same partition key from the start, so one Query call retrieves all of them together.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: "This isn't the only valid approach",
      text: 'Single-table design is powerful but adds real complexity to reason about, especially for people newer to DynamoDB. Plenty of production systems use one DynamoDB table per entity type instead, and accept the extra round trip when they need related data. Reach for single-table design when the access pattern that spans multiple entity types is frequent and latency-sensitive enough to justify the complexity, not automatically for every project.'
    },
    { type: 'heading', id: 'capacity', level: 2, text: 'Capacity modes: paying for throughput' },
    {
      type: 'paragraph',
      text: 'Every read and write against a DynamoDB table consumes throughput, and DynamoDB gives you two different ways to pay for and provision that throughput.'
    },
    {
      type: 'table',
      columns: ['Mode', 'How it works', 'Best for'],
      rows: [
        [
          'On-demand',
          'pay per request; DynamoDB scales throughput automatically with no capacity planning',
          'unpredictable, spiky, or new/unknown traffic patterns, at a higher per-request price'
        ],
        [
          'Provisioned',
          'you reserve a fixed number of read/write capacity units ahead of time, optionally with auto-scaling rules',
          'steady, predictable, well-understood traffic, at a lower cost per request'
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A practical rule of thumb',
      text: "Start new, unproven tables on on-demand, since you don't yet know the traffic shape and mispriced provisioned capacity either wastes money (over-provisioned) or throttles requests (under-provisioned). Once traffic is stable and well understood, provisioned capacity with auto-scaling is usually cheaper for the same sustained load."
    },
    { type: 'heading', id: 'consistency', level: 2, text: 'Consistency model: eventual versus strong' },
    {
      type: 'paragraph',
      text: 'Because DynamoDB replicates every item across multiple physical locations for durability, a read can technically ask two different questions: "give me an answer fast, even if it might be a few milliseconds stale" or "give me an answer that is guaranteed to reflect the very latest successful write, even if that costs a bit more." DynamoDB lets you choose per read.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Eventually consistent reads (the default): cheaper, and might briefly return slightly stale data if you read immediately after a write, but the data catches up almost instantly across replicas.',
        'Strongly consistent reads (opt-in): guaranteed to reflect the result of the most recently completed successful write, at roughly double the read cost, and notably, not available at all when reading from a Global Secondary Index.'
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Strong consistency is not available on GSIs',
      text: 'This trips people up in interviews and in real designs alike: no matter how you configure a read against a Global Secondary Index, it is always eventually consistent. If a specific access pattern absolutely requires strongly consistent reads, it needs to be served by the base table (or an LSI), not a GSI.'
    },
    { type: 'heading', id: 'query-vs-scan', level: 2, text: 'Query versus Scan: the other classic gotcha' },
    {
      type: 'paragraph',
      text: 'DynamoDB gives you two very different ways to retrieve more than one item at a time, and confusing them is one of the fastest ways to build something that works fine in testing and falls over in production.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Query: requires a partition key value, and efficiently retrieves only the items matching that partition (optionally narrowed further by a sort key condition). Cost and latency scale with the amount of data returned, not the size of the whole table.',
        "Scan: reads every single item in the entire table (or index), then optionally filters them down. Cost scales with the entire table's size regardless of how few items match your filter, which makes Scan slow and expensive on any table of meaningful size."
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'If you find yourself reaching for Scan, stop and reconsider the key design',
      text: "A Scan in application code is usually a sign that an access pattern was not accounted for when the table's keys and indexes were designed. The fix is almost never \"optimize the Scan,\" it's going back to add a GSI (or rethink the base table's key) so the access pattern becomes a Query instead. Scan has legitimate uses, like one-off data exports or admin tooling, but it should not be sitting in a hot request path."
    },
    { type: 'heading', id: 'hot-partitions', level: 2, text: 'Hot partitions: when one key gets too popular' },
    {
      type: 'paragraph',
      text: "DynamoDB spreads a table's overall throughput across its partitions based on partition key, which works great when traffic is roughly even across many different partition key values. It breaks down when one specific partition key value receives wildly disproportionate traffic, for example a single viral social media post getting far more likes and comments than any other post in the table. That one partition becomes a throughput bottleneck all on its own, and requests against it can get throttled, even while the table's overall provisioned or on-demand capacity has plenty of room to spare elsewhere."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Hot partitions',
      text: 'This is the classic DynamoDB scaling trap, and it\'s almost always fixed by adding randomness or sharding into the key design ahead of time (for example, appending a random suffix like "#shard3" to a hot partition key and querying across all shards, then merging results), not by trying to fix it after traffic has already found the hot key in production.'
    },
    { type: 'heading', id: 'dynamodb-vs-relational', level: 2, text: 'DynamoDB versus a relational database' },
    {
      type: 'paragraph',
      text: 'DynamoDB and a relational database like PostgreSQL aren\'t strictly "better" or "worse" than each other, they\'re optimized for different shapes of problem. A relational database shines when your queries are unpredictable ahead of time and your data has rich relationships that benefit from joins and complex, ad-hoc filtering. DynamoDB shines when your access patterns are known up front, need to be blazing fast at any scale, and you\'re willing to design the schema around those patterns rather than around normalized entities.'
    },
    {
      type: 'table',
      columns: ['', 'DynamoDB', 'Relational database (e.g. PostgreSQL)'],
      rows: [
        ['Schema', 'flexible per item; primary key structure is fixed and critical', 'fixed columns per table, enforced by the schema'],
        ['Joins', 'none; related data is colocated by key design instead', 'native, and can be arbitrarily complex'],
        ['Query flexibility', 'must match a known access pattern (or use a slow Scan)', 'high; SQL can express nearly any ad-hoc question'],
        [
          'Scaling',
          'scales horizontally and automatically, near-limitless',
          'typically scales vertically, or horizontally with real effort'
        ],
        [
          'Best fit',
          'known access patterns at massive scale with low, predictable latency',
          'evolving requirements, complex relationships, ad-hoc reporting'
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: "It's common to use both together",
      text: 'A lot of real systems use a relational database as the system of record for complex, evolving business data, and DynamoDB for a handful of specific, extremely high-traffic access patterns (like a shopping cart, a session store, or a real-time leaderboard) that need to stay fast no matter how much the system grows.'
    }
  ]
};
