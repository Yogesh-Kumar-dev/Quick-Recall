import type { Note } from '@/types/content';

// ─── PostgreSQL notes — the most commonly asked SQL/Postgres interview questions
// (adapted from the Devinterview SQL list, with Postgres-specific additions:
// JSONB, MVCC, VACUUM, index types, EXPLAIN ANALYZE) ───────────────────────────

export const postgresqlNotes: Note[] = [
  // ─── BASICS ─────────────────────────────────────────────────────────────────
  {
    id: 'pg-what-is-sql',
    title: 'What is SQL and what is it used for?',
    summary:
      'SQL (Structured Query Language) is the standard language for defining, querying, and manipulating data in relational databases.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'Declarative: you describe WHAT data you want, the database figures out HOW to get it.',
      'Command families: DDL (CREATE/ALTER/DROP — structure), DML (INSERT/UPDATE/DELETE — data), DQL (SELECT), DCL (GRANT/REVOKE — permissions), TCL (COMMIT/ROLLBACK — transactions).',
      'Standardized (ANSI SQL), but every database adds its own extensions — Postgres adds JSONB, arrays, RETURNING, etc.',
      'Used everywhere structured data lives: app backends, analytics, reporting, ETL.'
    ],
    gotcha: 'Knowing the five command families by name (DDL/DML/DQL/DCL/TCL) is a common rapid-fire interview question.'
  },
  {
    id: 'pg-what-is-postgresql',
    title: 'What is PostgreSQL and why choose it?',
    summary:
      'An open-source, object-relational database known for standards compliance, reliability, and a rich feature set (JSONB, full-text search, extensions).',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['pg-what-is-sql'],
    keyPoints: [
      'Fully ACID-compliant with MVCC concurrency — readers never block writers.',
      'Rich types beyond the SQL standard: JSONB, arrays, ranges, geometric types, UUID.',
      'Extensible: extensions like PostGIS (geospatial), pg_trgm (fuzzy search), pgvector (embeddings).',
      'Free, open source, and battle-tested — the default choice for new backends at most companies.'
    ]
  },
  {
    id: 'pg-sql-vs-nosql',
    title: 'SQL vs NoSQL databases',
    summary:
      'SQL databases use fixed schemas, tables, and joins with strong consistency; NoSQL databases trade that for flexible schemas and easier horizontal scaling.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'SQL: structured tables, relationships via foreign keys, ACID transactions, powerful ad-hoc queries with joins.',
      'NoSQL: document/key-value/graph/column stores; schema lives in the application, scaling out is built in.',
      'SQL scales vertically first (bigger machine); NoSQL was designed to scale horizontally (more machines).',
      'Pick SQL when data is relational and consistency matters (payments, inventory); NoSQL when shape varies or scale/throughput dominates (activity feeds, caching).'
    ],
    gotcha:
      "This isn't either/or — Postgres's JSONB gives document-style flexibility inside a relational database, and most real systems use both (e.g. Postgres + Redis)."
  },
  {
    id: 'pg-select-statement',
    title: 'The SELECT statement and its clause order',
    summary: 'SELECT retrieves data; its clauses execute in a fixed logical order that explains most query-writing gotchas.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'Written order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.',
      'Logical execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.',
      "Because SELECT runs late, you can't use a column alias inside WHERE (it doesn't exist yet) — but you CAN in ORDER BY.",
      'SELECT * is fine for exploration but bad in production code: it breaks covered indexes, fetches unneeded data, and couples code to table shape.'
    ],
    codeSnippet: `SELECT department, COUNT(*) AS headcount
FROM employees
WHERE active = true          -- filters rows (no aggregates allowed here)
GROUP BY department
HAVING COUNT(*) > 5          -- filters groups
ORDER BY headcount DESC
LIMIT 10;`
  },
  {
    id: 'pg-data-types',
    title: 'Common PostgreSQL data types',
    summary: 'Postgres has the standard numeric/text/date types plus richer ones — JSONB, arrays, UUID, and ranges.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'Numbers: INTEGER, BIGINT, NUMERIC (exact — use for money), REAL/DOUBLE PRECISION (floating point — never for money).',
      'Text: TEXT / VARCHAR(n) / CHAR(n) — in Postgres they perform identically; TEXT is the idiomatic default.',
      'Time: TIMESTAMPTZ (timestamp with time zone — almost always what you want), DATE, INTERVAL.',
      'Special: BOOLEAN, UUID, JSONB, arrays (INTEGER[]), BYTEA (binary), ENUM types.'
    ],
    gotcha:
      'Use TIMESTAMPTZ, not TIMESTAMP — plain TIMESTAMP stores no zone info and silently causes bugs the moment servers/users span time zones.'
  },
  {
    id: 'pg-char-varchar-text',
    title: 'CHAR vs VARCHAR vs TEXT',
    summary:
      'CHAR(n) pads to fixed length, VARCHAR(n) enforces a max length, TEXT is unlimited — and in Postgres they all perform the same.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['pg-data-types'],
    keyPoints: [
      'CHAR(n): blank-padded to exactly n characters — almost never what you want.',
      'VARCHAR(n): variable length with a hard cap; inserting longer text errors.',
      'TEXT: variable length, no cap — the Postgres convention for strings.',
      'Unlike MySQL/SQL Server, there is NO performance difference between the three in Postgres.'
    ],
    gotcha:
      'If you need a length limit for business reasons, a CHECK constraint on TEXT is often better than VARCHAR(n) — changing a CHECK is instant, while altering a VARCHAR length historically required more care.'
  },
  {
    id: 'pg-primary-key',
    title: 'What is a primary key?',
    summary: 'A column (or set of columns) that uniquely identifies each row — unique, non-null, and one per table.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'Enforces entity integrity: no duplicates, no NULLs.',
      'Automatically backed by a unique index.',
      'Modern Postgres idiom: id BIGINT GENERATED ALWAYS AS IDENTITY, or UUID for distributed systems.',
      'A composite primary key spans multiple columns — common in join/link tables (user_id, role_id).'
    ],
    codeSnippet: `CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);`
  },
  {
    id: 'pg-foreign-key',
    title: 'What is a foreign key and how is it used?',
    summary:
      "A constraint that makes a column reference another table's primary key, so the database itself guarantees the relationship is valid.",
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['pg-primary-key'],
    keyPoints: [
      'Enforces referential integrity: you cannot insert an order pointing at a customer that does not exist.',
      'ON DELETE options: RESTRICT (block the delete — default-ish safety), CASCADE (delete children too), SET NULL.',
      'Also documents the schema: foreign keys tell every reader (and every ORM) how tables relate.',
      'Postgres does NOT auto-index foreign key columns — add an index yourself or joins and cascades get slow.'
    ],
    gotcha: 'The missing-index-on-FK-column issue is a classic real-world performance bug and a favorite interview follow-up.',
    codeSnippet: `CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX ON orders (customer_id); -- not automatic!`
  },
  {
    id: 'pg-null-handling',
    title: 'How NULL works (and bites you)',
    summary: "NULL means 'unknown', not 'empty' — it uses three-valued logic, so normal comparisons with NULL are never true.",
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      'col = NULL is never true — use IS NULL / IS NOT NULL.',
      'NULL in expressions is contagious: 1 + NULL is NULL, "a" || NULL is NULL.',
      'Aggregates ignore NULLs: COUNT(col) skips them, COUNT(*) does not. AVG ignores them too — which changes results.',
      'NOT IN with a NULL in the list matches nothing — a classic silent bug; prefer NOT EXISTS.'
    ],
    gotcha:
      "WHERE status != 'archived' silently excludes rows where status IS NULL. If NULLs should pass, write: status != 'archived' OR status IS NULL.",
    codeSnippet: `SELECT COUNT(*) FROM t WHERE id NOT IN (SELECT ref_id FROM other);
-- returns 0 rows if ANY other.ref_id is NULL. Safe version:
SELECT COUNT(*) FROM t WHERE NOT EXISTS (
  SELECT 1 FROM other WHERE other.ref_id = t.id
);`
  },
  {
    id: 'pg-coalesce',
    title: 'COALESCE and NULLIF',
    summary:
      'COALESCE returns the first non-NULL argument; NULLIF turns a sentinel value into NULL — together they cover most NULL wrangling.',
    difficulty: 'basic',
    category: 'basics',
    prerequisites: ['pg-null-handling'],
    keyPoints: [
      "COALESCE(nickname, full_name, 'Anonymous') — first non-NULL wins; great for defaults.",
      'NULLIF(a, b) returns NULL if a = b, else a — classic use: NULLIF(denominator, 0) to avoid division-by-zero errors.',
      'COALESCE is the ANSI-standard version of what other databases call IFNULL/NVL/ISNULL.'
    ],
    codeSnippet: `SELECT COALESCE(discount, 0) AS discount,
       total / NULLIF(quantity, 0) AS unit_price -- NULL instead of error
FROM orders;`
  },
  {
    id: 'pg-sql-injection',
    title: 'How do you prevent SQL injection?',
    summary: 'Never concatenate user input into SQL — use parameterized queries so input is always treated as data, never as code.',
    difficulty: 'basic',
    category: 'basics',
    keyPoints: [
      "Parameterized queries / prepared statements: query('SELECT * FROM users WHERE email = $1', [email]).",
      'ORMs and query builders parameterize for you — but raw-SQL escape hatches reintroduce the risk.',
      'Defense in depth: validate input shape, run the app under a least-privilege database role, never show raw DB errors to users.',
      'Identifiers (table/column names) cannot be parameterized — allowlist them if they must be dynamic.'
    ],
    gotcha:
      'Escaping strings by hand is not a defense — encodings and edge cases will beat you. Parameters are the answer interviewers want.',
    codeSnippet: `-- Vulnerable (input becomes code):
"SELECT * FROM users WHERE email = '" + email + "'"
-- input: ' OR '1'='1  → returns every user

-- Safe (input stays data):
client.query('SELECT * FROM users WHERE email = $1', [email])`
  },

  // ─── QUERIES & JOINS ────────────────────────────────────────────────────────
  {
    id: 'pg-where-vs-having',
    title: 'WHERE vs HAVING',
    summary: 'WHERE filters rows before grouping; HAVING filters groups after aggregation.',
    difficulty: 'basic',
    category: 'queries & joins',
    prerequisites: ['pg-select-statement'],
    keyPoints: [
      'WHERE runs first, on individual rows — it cannot reference aggregate functions.',
      'HAVING runs after GROUP BY, on aggregated groups — this is where COUNT(*)/SUM() conditions go.',
      'Filter as early as possible: conditions that can go in WHERE should, so fewer rows reach the aggregation step.'
    ],
    codeSnippet: `SELECT customer_id, SUM(total) AS spent
FROM orders
WHERE created_at > now() - interval '30 days' -- row filter
GROUP BY customer_id
HAVING SUM(total) > 1000;                     -- group filter`
  },
  {
    id: 'pg-joins',
    title: 'What is a JOIN? List the types.',
    summary: 'A JOIN combines rows from two tables based on a matching condition; the type controls what happens to rows without a match.',
    difficulty: 'basic',
    category: 'queries & joins',
    prerequisites: ['pg-foreign-key'],
    keyPoints: [
      'INNER JOIN: only rows that match on both sides.',
      'LEFT JOIN: all left rows; NULLs fill in where the right side has no match. RIGHT JOIN is the mirror.',
      'FULL OUTER JOIN: all rows from both sides, matched where possible.',
      'CROSS JOIN: every combination (cartesian product). SELF JOIN: a table joined to itself via aliases.'
    ],
    gotcha:
      'A WHERE condition on the right table of a LEFT JOIN turns it into an INNER JOIN (NULL rows fail the filter) — put that condition in the ON clause instead.'
  },
  {
    id: 'pg-join-types-compared',
    title: 'INNER vs LEFT vs RIGHT vs FULL JOIN, concretely',
    summary: 'The four join types differ only in which unmatched rows survive — a Venn-diagram question that deserves a concrete example.',
    difficulty: 'basic',
    category: 'queries & joins',
    prerequisites: ['pg-joins'],
    keyPoints: [
      'users(1 alice, 2 bob) and orders(o1→user 1): INNER returns alice+o1 only.',
      'LEFT returns alice+o1 AND bob+NULL — "all users, with their orders if any".',
      'RIGHT is just LEFT with the tables swapped — most teams only write LEFT for consistency.',
      'FULL returns matched pairs plus unmatched rows from BOTH sides — useful for reconciliation/diff reports.'
    ],
    codeSnippet: `-- users without any orders (classic LEFT JOIN ... IS NULL pattern)
SELECT u.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`
  },
  {
    id: 'pg-self-join',
    title: 'How do you write a self join?',
    summary:
      'Join a table to itself using two aliases — the standard tool for hierarchies (employee → manager) and comparing rows within a table.',
    difficulty: 'intermediate',
    category: 'queries & joins',
    prerequisites: ['pg-joins'],
    keyPoints: [
      'Both sides are the same table; aliases (e AS employee, m AS manager) make them distinct.',
      'Classic uses: employee/manager hierarchies, "find pairs of users in the same city", comparing a row to the previous version of itself.',
      'For multi-level hierarchies (whole org tree), a recursive CTE takes over where a single self join stops.'
    ],
    codeSnippet: `SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;`
  },
  {
    id: 'pg-cross-join',
    title: 'What is a CROSS JOIN and when is it useful?',
    summary:
      'Every row of A paired with every row of B (cartesian product) — rarely wanted by accident, occasionally exactly what you need.',
    difficulty: 'intermediate',
    category: 'queries & joins',
    prerequisites: ['pg-joins'],
    keyPoints: [
      'Result size is rows(A) × rows(B) — it explodes fast.',
      'Legit uses: generating combinations (all sizes × all colors), building a calendar/date scaffold to left-join sparse data onto.',
      'An INNER JOIN with a true condition, or listing tables comma-separated without a WHERE, is accidentally a cross join.'
    ],
    codeSnippet: `-- every product/size combination for a variants table
SELECT p.id, s.size
FROM products p
CROSS JOIN (VALUES ('S'), ('M'), ('L')) AS s(size);`
  },
  {
    id: 'pg-group-by',
    title: 'GROUP BY and aggregate functions',
    summary:
      'GROUP BY collapses rows sharing the same values into one summary row, which aggregates (COUNT, SUM, AVG, MIN, MAX) then describe.',
    difficulty: 'basic',
    category: 'queries & joins',
    prerequisites: ['pg-select-statement'],
    keyPoints: [
      'Every selected column must be either in GROUP BY or wrapped in an aggregate — Postgres enforces this strictly.',
      'COUNT(*) counts rows; COUNT(col) counts non-NULL values; COUNT(DISTINCT col) counts unique values.',
      "Postgres extras: STRING_AGG(name, ', ') to concatenate group members, ARRAY_AGG to collect them, FILTER for conditional aggregates.",
      'GROUP BY with no aggregates behaves like SELECT DISTINCT.'
    ],
    codeSnippet: `SELECT department,
       COUNT(*)                                   AS total,
       COUNT(*) FILTER (WHERE active)             AS active,
       AVG(salary)                                AS avg_salary
FROM employees
GROUP BY department;`
  },
  {
    id: 'pg-order-by',
    title: 'ORDER BY, sorting and NULL placement',
    summary: 'ORDER BY sorts the final result — without it, row order is never guaranteed, no matter how it looks in practice.',
    difficulty: 'basic',
    category: 'queries & joins',
    keyPoints: [
      'ASC (default) or DESC per column; multiple columns sort hierarchically.',
      'NULLs sort last in ASC and first in DESC by default; override with NULLS FIRST / NULLS LAST.',
      'You can order by expressions (ORDER BY LOWER(name)) and by SELECT aliases.',
      'A query without ORDER BY has undefined order — "it comes back sorted anyway" is an implementation accident that breaks under parallelism.'
    ]
  },
  {
    id: 'pg-subqueries',
    title: 'What is a subquery, and when would you use one?',
    summary: 'A query nested inside another — usable wherever a value, list, or table is expected.',
    difficulty: 'intermediate',
    category: 'queries & joins',
    prerequisites: ['pg-select-statement'],
    keyPoints: [
      'Scalar subquery: returns one value — usable in SELECT or WHERE.',
      'List subquery with IN / EXISTS: filter by membership in another query result.',
      'Derived table: a subquery in FROM, treated as an inline table.',
      'Correlated subqueries reference the outer row and re-run per row — powerful but a common performance trap; often rewritable as a join or window function.'
    ],
    codeSnippet: `-- employees earning above their department average (correlated)
SELECT * FROM employees e
WHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department);`
  },
  {
    id: 'pg-cte',
    title: 'Common Table Expressions (WITH) and recursive CTEs',
    summary: 'A CTE names a subquery so complex logic reads top-to-bottom; the recursive form walks hierarchies and graphs.',
    difficulty: 'intermediate',
    category: 'queries & joins',
    prerequisites: ['pg-subqueries'],
    keyPoints: [
      'WITH step1 AS (...), step2 AS (...) SELECT ... — each step can reference the previous ones.',
      'Reads like a pipeline, replaces deeply nested subqueries, and each CTE can be reused twice in the same query.',
      'RECURSIVE: an anchor query UNION ALL a step that references the CTE itself — the standard way to traverse trees (org charts, category trees, nested comments).',
      'Since Postgres 12, plain CTEs are inlined by the planner (no longer an optimization fence) unless you say WITH ... AS MATERIALIZED.'
    ],
    codeSnippet: `WITH RECURSIVE subordinates AS (
  SELECT id, name, manager_id FROM employees WHERE id = 1   -- anchor
  UNION ALL
  SELECT e.id, e.name, e.manager_id
  FROM employees e
  JOIN subordinates s ON e.manager_id = s.id                -- step
)
SELECT * FROM subordinates;`
  },
  {
    id: 'pg-window-functions',
    title: 'What are window functions and how are they used?',
    summary:
      'Aggregates that compute over a "window" of related rows WITHOUT collapsing them — every row keeps its identity and gains a computed column.',
    difficulty: 'intermediate',
    category: 'queries & joins',
    prerequisites: ['pg-group-by'],
    keyPoints: [
      'Syntax: fn() OVER (PARTITION BY ... ORDER BY ...) — PARTITION BY is like GROUP BY but rows survive.',
      'Ranking: ROW_NUMBER (unique), RANK (gaps after ties), DENSE_RANK (no gaps).',
      'Offsets: LAG/LEAD read the previous/next row — month-over-month change without a self join.',
      'Running totals: SUM(x) OVER (ORDER BY date). Top-N per group = ROW_NUMBER in a subquery, then WHERE rn <= N.'
    ],
    gotcha: '"Top 3 salaries per department" is THE window-function interview question — know the ROW_NUMBER-then-filter pattern cold.',
    codeSnippet: `SELECT * FROM (
  SELECT name, department, salary,
         ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
) ranked
WHERE rn <= 3;`
  },
  {
    id: 'pg-pagination',
    title: 'How do you implement pagination?',
    summary: 'LIMIT/OFFSET is the simple version; keyset (cursor) pagination is the scalable version.',
    difficulty: 'intermediate',
    category: 'queries & joins',
    prerequisites: ['pg-order-by'],
    keyPoints: [
      'LIMIT 20 OFFSET 40 = page 3. Simple, supports "jump to page N".',
      'OFFSET must scan and discard every skipped row — page 10,000 reads 200,000 rows. It also drifts when rows are inserted between requests.',
      'Keyset pagination: WHERE (created_at, id) < (last_seen_at, last_seen_id) ORDER BY created_at DESC, id DESC LIMIT 20 — constant cost at any depth.',
      'Always paginate with a deterministic ORDER BY (tiebreak on id), or pages can overlap.'
    ],
    codeSnippet: `-- keyset: "next 20 after the last row the client saw"
SELECT * FROM posts
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC
LIMIT 20;`
  },
  {
    id: 'pg-union',
    title: 'UNION vs UNION ALL',
    summary: 'Both stack result sets vertically; UNION deduplicates (and pays for it), UNION ALL just concatenates.',
    difficulty: 'basic',
    category: 'queries & joins',
    keyPoints: [
      'Column counts and types must line up across the queries.',
      'UNION performs an implicit DISTINCT over the combined result — sort/hash cost on large sets.',
      'UNION ALL keeps duplicates and is much faster — default to it unless you specifically need dedup.',
      'Related: INTERSECT (rows in both) and EXCEPT (rows in first but not second).'
    ]
  },
  {
    id: 'pg-like-wildcards',
    title: 'LIKE, ILIKE and wildcards',
    summary: 'Pattern matching with % (any run of characters) and _ (exactly one); Postgres adds case-insensitive ILIKE.',
    difficulty: 'basic',
    category: 'queries & joins',
    keyPoints: [
      "LIKE 'abc%' — starts with; '%abc' — ends with; '%abc%' — contains.",
      'ILIKE is the Postgres case-insensitive variant.',
      "A leading wildcard ('%abc') cannot use a normal B-tree index — full scan. Trailing-wildcard patterns can (with text_pattern_ops or C collation).",
      'For real substring/fuzzy search at scale, use pg_trgm with a GIN index, or full-text search.'
    ]
  },
  {
    id: 'pg-between-in',
    title: 'BETWEEN and IN operators',
    summary: 'Shorthand for range checks and membership checks — with two classic edge cases.',
    difficulty: 'basic',
    category: 'queries & joins',
    keyPoints: [
      'x BETWEEN a AND b is inclusive on both ends (x >= a AND x <= b).',
      'x IN (a, b, c) is shorthand for chained ORs; also accepts a subquery.',
      "Timestamp trap: created_at BETWEEN '2024-01-01' AND '2024-01-31' misses almost all of Jan 31 (it means midnight). Use >= start AND < next-period-start.",
      'NOT IN with NULLs in the list returns no rows — use NOT EXISTS.'
    ]
  },
  {
    id: 'pg-case-expression',
    title: 'The CASE expression',
    summary: "SQL's if/else — usable anywhere an expression fits: SELECT, WHERE, ORDER BY, and inside aggregates.",
    difficulty: 'basic',
    category: 'queries & joins',
    keyPoints: [
      'Searched form: CASE WHEN cond THEN x WHEN cond2 THEN y ELSE z END — first match wins.',
      'Without ELSE, non-matches return NULL.',
      'Pivot pattern: SUM(CASE WHEN month = 1 THEN total ELSE 0 END) AS jan — one column per bucket. In Postgres, SUM(total) FILTER (WHERE month = 1) is cleaner.',
      "Custom sort: ORDER BY CASE status WHEN 'urgent' THEN 0 WHEN 'open' THEN 1 ELSE 2 END."
    ]
  },
  {
    id: 'pg-find-duplicates',
    title: 'How do you find (and delete) duplicate rows?',
    summary: 'GROUP BY the identifying columns and HAVING COUNT(*) > 1 finds them; ROW_NUMBER picks which copies to delete.',
    difficulty: 'intermediate',
    category: 'queries & joins',
    prerequisites: ['pg-group-by', 'pg-window-functions'],
    keyPoints: [
      'Find: SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1.',
      'Delete keeping one: rank duplicates with ROW_NUMBER() OVER (PARTITION BY email ORDER BY id), delete rn > 1.',
      'Then add a UNIQUE constraint so they cannot come back — interviewers love this follow-up.'
    ],
    codeSnippet: `DELETE FROM users
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
  ) d
  WHERE rn > 1
);`
  },
  {
    id: 'pg-concat-strings',
    title: 'Concatenating and formatting strings',
    summary: '|| is the standard operator; CONCAT and STRING_AGG cover NULL-safety and group concatenation.',
    difficulty: 'basic',
    category: 'queries & joins',
    prerequisites: ['pg-null-handling'],
    keyPoints: [
      "first_name || ' ' || last_name — but any NULL makes the whole result NULL.",
      'CONCAT(a, b, c) treats NULLs as empty strings — the safe version.',
      "STRING_AGG(name, ', ' ORDER BY name) concatenates values across rows in a group.",
      "Other tools: FORMAT('Hello, %s', name), UPPER/LOWER/INITCAP, TRIM, SPLIT_PART."
    ]
  },

  // ─── INDEXES ────────────────────────────────────────────────────────────────
  {
    id: 'pg-what-are-indexes',
    title: 'What are indexes and how do they speed up queries?',
    summary: 'A sorted side-structure (usually a B-tree) that lets the database jump to matching rows instead of scanning the whole table.',
    difficulty: 'basic',
    category: 'indexes',
    keyPoints: [
      'Like a book index: instead of reading every page, look up the term, jump to the page.',
      'Turns O(n) sequential scans into O(log n) tree traversals for equality and range predicates.',
      'The database (not you) decides whether to use an index — based on statistics and cost estimates.',
      'Indexes are not free: every INSERT/UPDATE/DELETE must also update every index, and they consume disk and cache.'
    ],
    codeSnippet: `CREATE INDEX idx_orders_customer ON orders (customer_id);
-- verify it's used:
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;`
  },
  {
    id: 'pg-index-types',
    title: 'PostgreSQL index types (B-tree, GIN, GiST, BRIN, Hash)',
    summary: 'B-tree covers 95% of cases; the others exist for containment, geometry, and huge append-only tables.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['pg-what-are-indexes'],
    keyPoints: [
      'B-tree (default): =, <, >, BETWEEN, ORDER BY, prefix LIKE — the workhorse.',
      'GIN: multi-value containment — JSONB (@>), arrays, full-text search, trigram fuzzy matching.',
      'GiST: ranges, geometric data, PostGIS, exclusion constraints.',
      'BRIN: tiny index over huge naturally-ordered tables (append-only logs by timestamp).',
      'Hash: equality only; rarely chosen over B-tree in practice.'
    ],
    gotcha: '"How do I index a JSONB column?" → GIN. That one-liner comes up constantly in Postgres interviews.'
  },
  {
    id: 'pg-composite-index',
    title: 'Composite (multi-column) indexes and column order',
    summary: 'One index over several columns — column order decides which queries it can serve (leftmost-prefix rule).',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['pg-what-are-indexes'],
    keyPoints: [
      'An index on (a, b) serves WHERE a = ..., and WHERE a = ... AND b = ... — but NOT efficiently WHERE b alone.',
      'Rule of thumb: equality columns first, then the range/sort column (WHERE tenant = $1 AND created_at > $2 → index (tenant, created_at)).',
      'One composite index on (a, b) usually beats separate indexes on a and b for combined filters.',
      'It can also satisfy ORDER BY on the same column order, skipping a sort step.'
    ]
  },
  {
    id: 'pg-partial-expression-indexes',
    title: 'Partial and expression indexes',
    summary:
      'Postgres can index just the rows you query (partial) or a computed value (expression) — smaller, faster, more precise indexes.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['pg-what-are-indexes'],
    keyPoints: [
      "Partial: CREATE INDEX ... ON orders (created_at) WHERE status = 'pending' — perfect when queries always target a small hot subset.",
      'Expression: CREATE INDEX ... ON users (LOWER(email)) — makes WHERE LOWER(email) = $1 indexable (case-insensitive lookup).',
      'A partial UNIQUE index enforces conditional uniqueness: only one active subscription per user, e.g. UNIQUE (user_id) WHERE active.',
      'The query must match the index predicate/expression for the planner to use it.'
    ]
  },
  {
    id: 'pg-covering-index',
    title: 'Covered queries and INCLUDE (index-only scans)',
    summary: 'If every column a query needs lives in the index, Postgres can answer from the index alone — an index-only scan.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['pg-composite-index'],
    keyPoints: [
      'CREATE INDEX ON orders (customer_id) INCLUDE (total, status) — INCLUDE adds payload columns without making them part of the search key.',
      'EXPLAIN shows "Index Only Scan" when it works.',
      'Depends on the visibility map being up to date — a heavily-updated, un-vacuumed table degrades index-only scans back to heap fetches.',
      'This is one concrete reason SELECT * hurts: any un-indexed column forces a heap visit.'
    ]
  },
  {
    id: 'pg-index-downsides',
    title: 'When do indexes hurt?',
    summary: 'Indexes trade write speed and storage for read speed — and an unused index is pure cost.',
    difficulty: 'intermediate',
    category: 'indexes',
    prerequisites: ['pg-what-are-indexes'],
    keyPoints: [
      'Every write maintains every index — 10 indexes ≈ 10 extra structures updated per INSERT.',
      'The planner ignores indexes on low-selectivity predicates (matching 40% of a table is faster as a seq scan).',
      'Functions on the indexed column (WHERE date(created_at) = ...) disable a plain index — use an expression index or rewrite as a range.',
      'Audit with pg_stat_user_indexes: idx_scan = 0 over weeks → drop it.'
    ]
  },

  // ─── TRANSACTIONS & MVCC ────────────────────────────────────────────────────
  {
    id: 'pg-transactions',
    title: 'What is a database transaction?',
    summary: 'A group of statements that succeed or fail as one atomic unit — BEGIN, do the work, COMMIT (or ROLLBACK to undo everything).',
    difficulty: 'basic',
    category: 'transactions & mvcc',
    keyPoints: [
      'Canonical example: money transfer — debit one account, credit another; either both happen or neither.',
      'COMMIT makes changes permanent and visible to others; ROLLBACK discards everything since BEGIN.',
      'Any error inside a Postgres transaction aborts it — subsequent statements fail until you ROLLBACK.',
      'SAVEPOINT gives partial rollback inside a transaction.'
    ],
    codeSnippet: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- both or neither`
  },
  {
    id: 'pg-acid',
    title: 'Explain ACID',
    summary: 'Atomicity, Consistency, Isolation, Durability — the four guarantees that make transactions trustworthy.',
    difficulty: 'basic',
    category: 'transactions & mvcc',
    prerequisites: ['pg-transactions'],
    keyPoints: [
      'Atomicity: all-or-nothing — a failed transaction leaves no partial changes.',
      'Consistency: every transaction moves the database from one valid state to another (constraints hold).',
      "Isolation: concurrent transactions do not see each other's in-flight changes (level configurable).",
      'Durability: once committed, data survives crashes — Postgres achieves this with the write-ahead log (WAL).'
    ],
    gotcha: 'Be ready for the follow-up "which of these is configurable?" — Isolation, via isolation levels.'
  },
  {
    id: 'pg-isolation-levels',
    title: 'Transaction isolation levels',
    summary: 'How much concurrent transactions can see of each other — from Read Committed (Postgres default) up to Serializable.',
    difficulty: 'intermediate',
    category: 'transactions & mvcc',
    prerequisites: ['pg-acid'],
    keyPoints: [
      'Anomalies to know: dirty read (see uncommitted data), non-repeatable read (row changes between two reads), phantom read (new rows appear).',
      'Read Committed (default): each statement sees data committed before that statement — no dirty reads, but non-repeatable reads possible.',
      'Repeatable Read: the whole transaction sees one snapshot; in Postgres this also prevents phantoms.',
      'Serializable: transactions behave as if run one at a time; conflicts abort with a serialization error — the app must retry.',
      'Postgres never allows dirty reads — READ UNCOMMITTED silently behaves as Read Committed.'
    ]
  },
  {
    id: 'pg-mvcc',
    title: 'What is MVCC?',
    summary:
      'Multi-Version Concurrency Control — Postgres keeps multiple versions of each row so readers and writers never block each other.',
    difficulty: 'intermediate',
    category: 'transactions & mvcc',
    prerequisites: ['pg-transactions'],
    keyPoints: [
      'An UPDATE writes a NEW row version rather than overwriting; each transaction sees the versions valid for its snapshot.',
      'Readers never block writers, and writers never block readers — a core Postgres selling point.',
      'The cost: old row versions ("dead tuples") pile up and must be reclaimed by VACUUM.',
      'Writers still block writers on the same row — MVCC removes read/write conflicts, not write/write.'
    ]
  },
  {
    id: 'pg-vacuum',
    title: 'VACUUM and autovacuum',
    summary: 'VACUUM reclaims the dead row versions MVCC leaves behind and keeps planner statistics and the visibility map fresh.',
    difficulty: 'intermediate',
    category: 'transactions & mvcc',
    prerequisites: ['pg-mvcc'],
    keyPoints: [
      'Every UPDATE/DELETE leaves a dead tuple; VACUUM marks that space reusable (it does not shrink the file — VACUUM FULL does, but locks the table).',
      'ANALYZE (often run together) refreshes statistics the query planner relies on.',
      'Autovacuum runs automatically — never disable it; tune it (per-table thresholds) for very hot tables instead.',
      'Also prevents transaction-ID wraparound, a rare-but-catastrophic failure mode interviewers occasionally probe.'
    ],
    gotcha:
      'Table keeps growing and queries slow down despite deletes? Classic symptom of bloat from lagging autovacuum on a high-churn table.'
  },
  {
    id: 'pg-locking',
    title: 'Locking: row locks, table locks, SELECT FOR UPDATE',
    summary: 'Postgres locks at multiple granularities; mostly it just works, but explicit row locks solve read-then-write races.',
    difficulty: 'intermediate',
    category: 'transactions & mvcc',
    prerequisites: ['pg-mvcc'],
    keyPoints: [
      'Row locks: taken automatically by UPDATE/DELETE; a second writer on the same row waits for the first to commit.',
      'SELECT ... FOR UPDATE locks the rows you read, so check-then-modify logic (seat booking, inventory) is race-free.',
      'FOR UPDATE SKIP LOCKED turns a table into a work queue: each worker grabs unlocked rows only.',
      'DDL (ALTER TABLE) takes heavy table locks — schema changes on hot tables need care (and CONCURRENTLY variants for indexes).'
    ],
    codeSnippet: `BEGIN;
SELECT stock FROM products WHERE id = 7 FOR UPDATE; -- others wait here
UPDATE products SET stock = stock - 1 WHERE id = 7;
COMMIT;`
  },
  {
    id: 'pg-deadlocks',
    title: 'What is a deadlock and how do you avoid it?',
    summary:
      'Two transactions each hold a lock the other needs — Postgres detects the cycle and kills one; prevention is about lock ordering.',
    difficulty: 'intermediate',
    category: 'transactions & mvcc',
    prerequisites: ['pg-locking'],
    keyPoints: [
      'Classic scenario: T1 locks row A then wants B; T2 locks B then wants A — neither can proceed.',
      'Postgres detects deadlocks automatically and aborts one transaction with an error; the app should retry.',
      'Prevention: always acquire locks in a consistent order (e.g. update accounts sorted by id), keep transactions short.',
      'Lock a batch up front with one SELECT ... FOR UPDATE ORDER BY id instead of locking rows one by one.'
    ]
  },

  // ─── CONSTRAINTS & SCHEMA ───────────────────────────────────────────────────
  {
    id: 'pg-normalization',
    title: 'What is normalization? (1NF → 3NF with examples)',
    summary: 'Structuring tables to remove redundancy so each fact is stored exactly once — through progressive "normal forms".',
    difficulty: 'basic',
    category: 'constraints & schema',
    keyPoints: [
      '1NF: atomic values — no comma-separated lists or repeating column groups in one cell.',
      '2NF: no partial dependency — every non-key column depends on the WHOLE composite key.',
      "3NF: no transitive dependency — non-key columns depend on the key only (customer_city doesn't belong in orders; it belongs in customers).",
      'Benefits: no update anomalies (change a fact once), smaller data, clearer model. Cost: more joins.'
    ],
    gotcha: 'The interview soundbite for 3NF: "every non-key attribute depends on the key, the whole key, and nothing but the key."'
  },
  {
    id: 'pg-denormalization',
    title: 'Denormalization — when and why?',
    summary: 'Deliberately duplicating data to skip expensive joins/aggregations — a read-speed optimization you pay for at write time.',
    difficulty: 'intermediate',
    category: 'constraints & schema',
    prerequisites: ['pg-normalization'],
    keyPoints: [
      'Examples: a cached order_count on users, storing product_name inside order_items (price/name at time of sale is often CORRECT modeling, not just an optimization).',
      'When: read-heavy paths where the join/aggregate is measurably the bottleneck; reporting/OLAP schemas (star schema).',
      'Cost: every write must update every copy — drift bugs if you miss one path; triggers or app logic keep copies in sync.',
      'Normalize first, denormalize only with evidence — materialized views are often the middle ground.'
    ]
  },
  {
    id: 'pg-constraints',
    title: 'Column constraints: NOT NULL, UNIQUE, CHECK, DEFAULT',
    summary: 'Declarative rules the database enforces on every write — the cheapest data-integrity tool you have.',
    difficulty: 'basic',
    category: 'constraints & schema',
    prerequisites: ['pg-primary-key'],
    keyPoints: [
      'NOT NULL: the column must have a value. UNIQUE: no duplicates (backed by an index; multiple NULLs allowed).',
      "CHECK: an arbitrary boolean rule — CHECK (price >= 0), CHECK (status IN ('draft', 'live')).",
      'DEFAULT: value used when the insert omits the column — DEFAULT now(), DEFAULT false.',
      'Constraints in the database beat validation only in the app: they hold for every client, every script, every teammate.'
    ]
  },
  {
    id: 'pg-views',
    title: 'What is a view and what are its advantages?',
    summary: 'A saved query that behaves like a virtual table — it stores no data, just the query.',
    difficulty: 'basic',
    category: 'constraints & schema',
    keyPoints: [
      'CREATE VIEW active_users AS SELECT ... — then query it like a table.',
      'Uses: hide complexity (canned joins), provide a stable interface over changing tables, restrict visible columns/rows for security.',
      'Runs the underlying query every time — a view is not faster than its query.',
      'Simple single-table views are updatable; complex ones need INSTEAD OF triggers.'
    ]
  },
  {
    id: 'pg-materialized-views',
    title: 'Materialized views vs regular views',
    summary: 'A materialized view physically stores its query result — fast to read, but stale until refreshed.',
    difficulty: 'intermediate',
    category: 'constraints & schema',
    prerequisites: ['pg-views'],
    keyPoints: [
      'Regular view = saved query (always fresh, full cost per read). Materialized = saved RESULT (instant reads, needs refreshing).',
      'REFRESH MATERIALIZED VIEW recomputes it; CONCURRENTLY avoids blocking readers but requires a unique index.',
      'Perfect for expensive aggregations read often but tolerably stale: dashboards, leaderboards, reports.',
      'Postgres does not auto-refresh them — schedule it (cron/pg_cron) or refresh after relevant writes.'
    ],
    codeSnippet: `CREATE MATERIALIZED VIEW daily_sales AS
SELECT date_trunc('day', created_at) AS day, SUM(total) AS revenue
FROM orders GROUP BY 1;

REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales;`
  },
  {
    id: 'pg-stored-procedures-functions',
    title: 'Functions vs stored procedures',
    summary:
      'Both are server-side routines (usually PL/pgSQL); functions return a value and run inside a transaction, procedures can manage transactions themselves.',
    difficulty: 'intermediate',
    category: 'constraints & schema',
    keyPoints: [
      'CREATE FUNCTION: returns a value (scalar or a set of rows), callable inside queries — SELECT my_fn(x).',
      'CREATE PROCEDURE (Postgres 11+): called with CALL, can COMMIT/ROLLBACK internally — for batch/maintenance jobs.',
      'Pros: logic close to data (fewer round trips), one implementation shared by all clients.',
      'Cons: harder to version/test/debug than app code — most app teams keep business logic in the app and use functions sparingly (triggers, data fixes).'
    ]
  },
  {
    id: 'pg-triggers',
    title: 'What is a trigger and when should you use it?',
    summary:
      'A function the database runs automatically on INSERT/UPDATE/DELETE — powerful for auditing, dangerous for hidden business logic.',
    difficulty: 'intermediate',
    category: 'constraints & schema',
    prerequisites: ['pg-stored-procedures-functions'],
    keyPoints: [
      'Fires BEFORE or AFTER a row/statement change; the function sees OLD and NEW row values.',
      'Good uses: audit trails, keeping an updated_at column fresh, syncing a denormalized copy.',
      'BEFORE triggers can modify NEW (e.g. normalize an email) or cancel the write.',
      'Risk: invisible side effects — writes trigger writes trigger writes. Keep them small, boring, and documented.'
    ],
    codeSnippet: `CREATE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_touch BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();`
  },
  {
    id: 'pg-er-model',
    title: 'The Entity-Relationship model in schema design',
    summary:
      'Model entities (tables), their attributes (columns), and relationships (keys) before writing DDL — cardinality decides the table shape.',
    difficulty: 'basic',
    category: 'constraints & schema',
    prerequisites: ['pg-foreign-key'],
    keyPoints: [
      'One-to-many: foreign key on the "many" side (orders.customer_id).',
      'Many-to-many: a join table with two foreign keys (user_roles: user_id + role_id, composite PK).',
      'One-to-one: shared primary key or a UNIQUE foreign key — often for splitting rarely-used columns off a hot table.',
      'Getting cardinality right up front prevents the painful migrations later.'
    ]
  },

  // ─── PERFORMANCE ────────────────────────────────────────────────────────────
  {
    id: 'pg-explain',
    title: 'EXPLAIN and EXPLAIN ANALYZE',
    summary:
      "EXPLAIN shows the planner's chosen plan with cost estimates; ANALYZE actually runs the query and shows real times and row counts.",
    difficulty: 'intermediate',
    category: 'performance',
    prerequisites: ['pg-what-are-indexes'],
    keyPoints: [
      'Read the plan inside-out: the most-indented node runs first.',
      'Node types to recognize: Seq Scan (full table), Index Scan, Index Only Scan, Bitmap Heap Scan, Nested Loop / Hash Join / Merge Join, Sort.',
      'The #1 red flag: estimated rows wildly different from actual rows — stale statistics mislead the planner; run ANALYZE.',
      'EXPLAIN (ANALYZE, BUFFERS) adds I/O info — high "read" counts mean the data is not in cache.'
    ],
    gotcha: 'EXPLAIN ANALYZE executes the statement for real — wrap DML in BEGIN ... ROLLBACK when analyzing an UPDATE/DELETE.',
    codeSnippet: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42;
-- "Seq Scan on orders" + high actual time → missing index`
  },
  {
    id: 'pg-slow-queries',
    title: 'How do you find and fix slow queries?',
    summary: 'Measure first (pg_stat_statements), explain the worst offenders, then fix with indexes, rewrites, or schema changes.',
    difficulty: 'intermediate',
    category: 'performance',
    prerequisites: ['pg-explain'],
    keyPoints: [
      'pg_stat_statements ranks queries by total/mean time — optimize by aggregate impact, not by anecdote. log_min_duration_statement catches outliers.',
      'Usual culprits: missing index on a filter/join column, function wrapped around an indexed column, correlated subquery per row, OFFSET pagination, SELECT * dragging wide rows.',
      'Fix order: add/adjust the index → rewrite the query → only then consider denormalizing or caching.',
      'Verify the fix with EXPLAIN ANALYZE before/after — never assume.'
    ]
  },
  {
    id: 'pg-partitioning',
    title: 'Table partitioning',
    summary:
      'Splitting one logical table into physical child tables (by range, list, or hash) so queries and maintenance touch only relevant slices.',
    difficulty: 'intermediate',
    category: 'performance',
    keyPoints: [
      'Declarative: PARTITION BY RANGE (created_at) with a partition per month is the canonical time-series setup.',
      'Partition pruning: WHERE created_at >= ... lets the planner skip irrelevant partitions entirely.',
      'Retention becomes instant: DROP the old partition instead of DELETE-ing millions of rows (and the vacuum debt that follows).',
      'Worth it for very large tables (tens/hundreds of GB); queries must filter on the partition key to benefit.'
    ]
  },
  {
    id: 'pg-connection-pooling',
    title: 'Why connection pooling matters',
    summary:
      'Postgres spawns a process per connection — pools (app-side or PgBouncer) reuse a small set of connections instead of opening thousands.',
    difficulty: 'intermediate',
    category: 'performance',
    keyPoints: [
      'Each connection costs a backend process and memory; connect/disconnect per request wrecks latency and the server.',
      'App-side pools (pg.Pool in node-postgres, HikariCP) keep N warm connections per app instance.',
      'PgBouncer sits in front of Postgres and multiplexes thousands of client connections onto few real ones — essential for serverless/lambda workloads.',
      'Symptom of no/undersized pooling: "too many connections" errors or latency spikes under load.'
    ]
  },
  {
    id: 'pg-oltp-olap',
    title: 'OLTP vs OLAP',
    summary:
      'OLTP = many small transactional reads/writes (your app); OLAP = few huge analytical scans (your warehouse). They want different schemas and databases.',
    difficulty: 'basic',
    category: 'performance',
    keyPoints: [
      "OLTP: normalized schema, row storage, index-backed point queries, ACID — Postgres's home turf.",
      'OLAP: denormalized star schemas, columnar storage, aggregations over millions of rows — Snowflake/BigQuery/ClickHouse territory.',
      'Running heavy analytics on the production OLTP database starves the app — typical fix: replicate/ETL into a warehouse (or query a read replica).',
      'Data warehousing = collecting data from OLTP systems into a central OLAP store for reporting.'
    ]
  },
  {
    id: 'pg-sharding-replication',
    title: 'Replication and sharding',
    summary:
      'Replication copies the same data to more servers (availability + read scale); sharding splits data across servers (write scale).',
    difficulty: 'intermediate',
    category: 'performance',
    keyPoints: [
      'Streaming replication: primary ships WAL to replicas; replicas serve reads and enable failover.',
      'Replica lag means a read replica can serve slightly stale data — read-your-own-writes needs care.',
      'Sharding partitions rows across independent databases by a shard key (e.g. tenant_id) — cross-shard joins/transactions get hard.',
      'Order of escalation: indexes/tuning → bigger box → read replicas → partitioning → sharding (last resort; tools like Citus help).'
    ]
  },

  // ─── JSON & ADVANCED ────────────────────────────────────────────────────────
  {
    id: 'pg-jsonb',
    title: 'JSON vs JSONB, operators and indexing',
    summary:
      'JSONB stores parsed binary JSON — indexable and fast to query; use it for genuinely dynamic document data inside a relational schema.',
    difficulty: 'intermediate',
    category: 'json & advanced',
    prerequisites: ['pg-data-types', 'pg-index-types'],
    keyPoints: [
      'JSON = stored as text (preserves formatting/key order); JSONB = parsed binary (supports indexing, deduplicates keys) — use JSONB.',
      'Operators: -> (get as JSON), ->> (get as text), #>> (path), @> (contains: attrs @> \'{"color": "red"}\').',
      'GIN index on the column makes @> and key-existence queries fast.',
      'Rule of thumb: columns you filter/join/validate on stay relational; the truly variable payload goes in one JSONB column — not the whole row.'
    ],
    codeSnippet: `SELECT * FROM products
WHERE attrs @> '{"brand": "acme"}';       -- containment

CREATE INDEX ON products USING GIN (attrs); -- makes it fast
SELECT attrs->>'color' FROM products;       -- extract as text`
  },
  {
    id: 'pg-upsert',
    title: 'UPSERT: INSERT ... ON CONFLICT',
    summary: '"Insert, or update if it already exists" in one atomic statement — no read-then-write race.',
    difficulty: 'intermediate',
    category: 'json & advanced',
    prerequisites: ['pg-constraints'],
    keyPoints: [
      'Requires a unique constraint/index as the conflict target: ON CONFLICT (email) DO UPDATE SET ...',
      'EXCLUDED refers to the row you tried to insert.',
      'ON CONFLICT DO NOTHING for idempotent inserts (e.g. seeding, at-least-once queues).',
      'Atomic — safe under concurrency, unlike SELECT-then-INSERT-or-UPDATE in app code.'
    ],
    codeSnippet: `INSERT INTO user_settings (user_id, theme)
VALUES ($1, $2)
ON CONFLICT (user_id)
DO UPDATE SET theme = EXCLUDED.theme;`
  },
  {
    id: 'pg-returning',
    title: 'The RETURNING clause',
    summary: 'INSERT/UPDATE/DELETE can return the affected rows directly — no follow-up SELECT needed.',
    difficulty: 'basic',
    category: 'json & advanced',
    keyPoints: [
      'INSERT ... RETURNING id — the standard way to get a generated primary key.',
      'UPDATE ... RETURNING * shows exactly what changed; DELETE ... RETURNING * captures what was removed (archive pattern).',
      'One round trip and atomic — the read cannot race with another writer.'
    ],
    codeSnippet: `INSERT INTO users (email) VALUES ($1) RETURNING id, created_at;`
  },
  {
    id: 'pg-serial-identity-uuid',
    title: 'Auto-generated IDs: SERIAL vs IDENTITY vs UUID',
    summary: 'IDENTITY is the modern standard-SQL auto-increment; UUIDs trade ordering and size for global uniqueness.',
    difficulty: 'intermediate',
    category: 'json & advanced',
    prerequisites: ['pg-primary-key'],
    keyPoints: [
      'GENERATED ALWAYS AS IDENTITY (Postgres 10+) supersedes the older SERIAL pseudo-type — same sequence machinery, cleaner semantics.',
      'Sequences have gaps by design (rollbacks/crashes consume numbers) — never assume contiguous IDs.',
      'UUIDs: generatable anywhere (client, other services), safe to expose publicly, mergeable across databases; cost: 16 bytes and random insert order (v7/ULID fixes the ordering).',
      'Common hybrid: internal BIGINT identity PK + external UUID column for URLs and APIs.'
    ]
  },
  {
    id: 'pg-fulltext-search',
    title: 'Full-text search in Postgres',
    summary: 'tsvector + tsquery + a GIN index give real language-aware search (stemming, ranking) without leaving Postgres.',
    difficulty: 'intermediate',
    category: 'json & advanced',
    prerequisites: ['pg-index-types'],
    keyPoints: [
      "to_tsvector('english', text) normalizes words (running → run); to_tsquery/websearch_to_tsquery parse the search input.",
      'Match with @@, rank with ts_rank; index the tsvector (usually a generated column) with GIN.',
      "Beats LIKE '%term%' on every axis: indexed, stemmed, ranked, multi-word.",
      'For typo-tolerant/substring matching, pg_trgm is the complementary tool; dedicated engines (Elasticsearch/Meilisearch) only become necessary at serious scale or feature depth.'
    ],
    codeSnippet: `ALTER TABLE posts ADD COLUMN search tsvector
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;
CREATE INDEX ON posts USING GIN (search);

SELECT * FROM posts
WHERE search @@ websearch_to_tsquery('english', 'postgres indexing');`
  },
  {
    id: 'pg-arrays',
    title: 'Array columns',
    summary: 'Postgres columns can hold arrays natively — handy for small value lists, with containment operators and GIN indexing.',
    difficulty: 'intermediate',
    category: 'json & advanced',
    prerequisites: ['pg-data-types'],
    keyPoints: [
      "TEXT[] / INTEGER[] etc.; literals like ARRAY['a', 'b'] or '{a,b}'.",
      "Operators: @> contains (tags @> ARRAY['sql']), && overlaps, ANY for equality against elements (WHERE 'sql' = ANY(tags)).",
      'GIN index on the array column accelerates @> and &&.',
      'unnest(arr) explodes an array into rows for joining/aggregation.',
      'Use for small, self-contained lists (tags); if you need to query/join the elements as entities, a separate table is still the right call.'
    ]
  },
  {
    id: 'pg-security-roles',
    title: 'Roles, privileges and row-level security',
    summary: 'Postgres access control: roles own and are granted rights on objects; RLS filters which ROWS a role can even see.',
    difficulty: 'intermediate',
    category: 'json & advanced',
    keyPoints: [
      'Roles are both users and groups; GRANT SELECT/INSERT/... ON tables TO role.',
      'Least privilege: the app connects as a role with only the rights it needs — no superuser, no DDL.',
      "Row-Level Security: CREATE POLICY ... USING (tenant_id = current_setting('app.tenant')::int) — the database enforces multi-tenant isolation even if a query forgets the WHERE.",
      'Encryption: TLS for transport; at-rest via disk/volume encryption; pgcrypto for column-level needs.'
    ]
  }
];
