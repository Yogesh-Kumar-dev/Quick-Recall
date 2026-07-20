import type { Note } from '@/types/content';

// ─── ETL Testing — validating data pipelines (Extract, Transform, Load) rather than
// application UI/API behavior: the correctness question shifts from "did the right
// thing happen" to "does the data in the target match what the source and the
// transformation rules say it should be." ─────────────────────────────────────

export const etlTestingNotes: Note[] = [
  {
    id: 'etl-fundamentals',
    title: 'What ETL Testing Actually Verifies',
    summary:
      'Extract pulls raw data from source systems, Transform applies business rules/cleanup/type conversion, Load writes it to the target (usually a data warehouse) — ETL testing checks each stage independently and the pipeline end to end.',
    difficulty: 'basic',
    category: 'fundamentals',
    prerequisites: ['test-fund-mt-database-migration-testing'],
    keyPoints: [
      'Source systems hold raw, often messy operational data (transactional databases, logs, third-party feeds); target systems (data warehouses/lakes) hold cleaned, transformed, analysis-ready data — testing verifies the journey between the two is lossless and correct.',
      "A useful first move on any ETL testing task: check the job's completion status and read its logs for errors BEFORE doing any data-level validation — a failed or partial run makes downstream checks meaningless.",
      'Unlike UI/API testing, "correctness" here means row-for-row and value-for-value fidelity (accounting for intentional transformations) — a single silently-dropped or miscalculated row can corrupt every downstream report built on it.',
      'A data dictionary (a centralized definition of every field\'s type, length, source, and business meaning) is the reference document ETL tests are validated against — without one, "correct" has no agreed definition to test to.'
    ],
    gotcha:
      'ETL bugs are invisible in the UI — a dashboard can render perfectly while quietly aggregating corrupted or incomplete data underneath, which is exactly why dedicated data-layer testing exists instead of relying on "the report looks fine."'
  },
  {
    id: 'etl-validation-vs-verification',
    title: 'Data Validation vs Data Verification',
    summary:
      "Validation checks data conforms to defined rules/formats/constraints; verification confirms it's ACCURATE against the source or a known-correct reference — a value can be validly formatted and still wrong.",
    difficulty: 'basic',
    category: 'data validation & reconciliation',
    prerequisites: ['etl-fundamentals', 'test-fund-mt-verification-vs-validation'],
    keyPoints: [
      'Validation example: a `price` field must be a positive decimal with 2 decimal places — a validation check confirms the FORMAT, not whether $19.99 is the actually correct price.',
      "Verification example: comparing the loaded `price` back against the source system's original value confirms ACCURACY — this is where reconciliation queries and checksums come in.",
      'Both are needed: a pipeline can pass every validation rule (well-formed, non-null, in range) while still transforming a value incorrectly — validation alone gives false confidence.',
      'Useful SQL toolkit for both: `SELECT`, `COUNT`, `SUM`, `WHERE`, `JOIN` for comparing source vs target; `MIN`/`MAX`/`AVG` for statistical sanity checks on numeric columns.'
    ]
  },
  {
    id: 'etl-reconciliation',
    title: 'Data Reconciliation: Row Counts, Checksums & Comparisons',
    summary:
      'The core ETL test pattern: compare source and target on record counts, aggregate sums, and (for a stronger guarantee) row-level checksums — divergence pinpoints exactly where the pipeline lost or altered data.',
    difficulty: 'intermediate',
    category: 'data validation & reconciliation',
    prerequisites: ['etl-validation-vs-verification'],
    keyPoints: [
      'Record count comparison is the cheapest, fastest sanity check — a mismatch immediately flags dropped or duplicated rows, though a MATCHING count says nothing about whether individual values are correct.',
      'Statistical summaries (min, max, sum, average of key numeric columns) catch a class of bugs count-matching misses — e.g. every row loaded, but a transformation silently corrupted a calculated field.',
      "Row-level checksums (hashing each row's contents in source and target, then comparing hashes) give the strongest guarantee — any single-character difference in any field surfaces, at the cost of more compute than a count/sum check.",
      'Tools built specifically for this: QuerySurge and Datagaps ETL Validator automate source-vs-target comparison at scale; Talend and Informatica DVO add data-quality validation on top of their own ETL tooling.',
      'Reconciliation should run at MULTIPLE points in the pipeline (post-extract, post-transform, post-load), not just at the very end — pinpointing which STAGE introduced a discrepancy is far faster than debugging the whole pipeline as a black box.'
    ]
  },
  {
    id: 'etl-full-vs-incremental-load',
    title: 'Full Load vs Incremental Load Testing',
    summary:
      'A full load re-processes the entire source dataset every run (simple, slow, always correct); incremental load processes only new/changed records since the last run (fast, but needs its own delta-correctness tests).',
    difficulty: 'intermediate',
    category: 'load strategies',
    prerequisites: ['etl-reconciliation'],
    keyPoints: [
      'Full load testing focuses on completeness and performance at scale — since every row is reprocessed every time, a full load either gets the whole dataset right or the whole thing is suspect; there is no "which delta broke" question to ask.',
      'Incremental load testing has a whole extra dimension: verifying the WATERMARK or timestamp logic correctly identifies "new or modified since last run" — an off-by-one or timezone bug in that logic silently skips or re-processes rows.',
      "Test cases specific to incremental loads: a brand-new record loads correctly, a MODIFIED record correctly updates (not duplicates) the existing target row, and an UNCHANGED record correctly gets skipped (verifying the pipeline isn't needlessly reprocessing everything, which would defeat the point).",
      'Late-arriving data (a source record timestamped for an already-processed batch, but which only became visible afterward) is the classic incremental-load edge case worth naming explicitly — a naive watermark approach silently loses these rows forever.'
    ]
  },
  {
    id: 'etl-cdc',
    title: 'Change Data Capture (CDC) Testing',
    summary:
      'CDC captures individual inserts/updates/deletes from a source system (often via database transaction logs) as they happen, rather than diffing full snapshots — testing verifies each change type is captured, transformed, and applied correctly.',
    difficulty: 'intermediate',
    category: 'load strategies',
    prerequisites: ['etl-full-vs-incremental-load'],
    keyPoints: [
      'CDC is a specific mechanism for incremental loading — instead of querying "what changed since timestamp X" (which can miss changes if a row is updated then reverted between polls), it streams every individual change event directly from the source\'s transaction log.',
      "Test each change type distinctly: an INSERT propagates as a new target row, an UPDATE modifies the existing target row (not a duplicate), and a DELETE either removes the target row or soft-deletes it depending on the pipeline's design — verify whichever is intended actually happens.",
      "Ordering matters for CDC in a way it doesn't for batch loads: applying an UPDATE before its preceding INSERT (out of order) corrupts state — testing should include out-of-order or replayed-event scenarios, not just the happy sequential path.",
      'CDC pipelines commonly feed both a data warehouse (for analytics) and a cache/search index (for application use) from the same event stream — consistency testing across ALL downstream consumers of the same CDC stream, not just the primary target, catches drift between them.'
    ]
  },
  {
    id: 'etl-scd-types',
    title: 'Slowly Changing Dimensions (SCD)',
    summary:
      'Dimension tables (customer, product) change over time — SCD Type 1 overwrites the old value (loses history), Type 2 adds a new row with effective-dating (preserves full history), and testing each type means verifying its specific historical-accuracy contract.',
    difficulty: 'advanced',
    category: 'load strategies',
    prerequisites: ['etl-cdc'],
    keyPoints: [
      'Type 1 (overwrite): the old value is simply replaced — testing verifies the new value is correct, but there is nothing to test for history since none is kept by design.',
      'Type 2 (add a new row): the old row gets an end-date and `is_current = false`; a new row is inserted with the updated value, a start-date, and `is_current = true` — testing verifies both rows exist, the effective-dating is correct, and exactly one row per entity is ever marked current.',
      'Type 3 (add a new column) and hybrid types exist for cases needing only limited history (e.g. "previous value" alongside "current value") — testing verifies the specific limited-history contract that type promises, no more and no less.',
      'A common SCD Type 2 bug worth specifically testing for: a query joining a fact table to a dimension without filtering `is_current = true` (or without an as-of-date join) silently double-counts historical versions of the same entity.'
    ]
  },
  {
    id: 'etl-data-quality-checks',
    title: 'Data Quality Checks: Nulls, Duplicates & Type Mismatches',
    summary:
      "The most common ETL defects aren't exotic — missing values, duplicate rows, and type mismatches between source and target are the bread-and-butter test cases that catch the majority of real pipeline bugs.",
    difficulty: 'basic',
    category: 'data quality',
    prerequisites: ['etl-fundamentals'],
    keyPoints: [
      'Null/missing-value handling needs an explicit, testable rule — does the pipeline reject the row, substitute a default, or pass the null through — and that rule should come from documented business requirements, not an assumption made while writing the test.',
      "Duplicate detection: test cases should verify the pipeline's intended behavior on known duplicate input (remove, flag, or merge per business rules) using a deliberately-constructed test dataset with known duplicates, not just hoping real data happens to expose the bug.",
      'Type mismatches (a source `VARCHAR` age field vs a target `INTEGER` column, or a source using `MM/DD/YYYY` vs a target expecting ISO dates) are a leading cause of silent data corruption or outright load failures — testing should include deliberately malformed/boundary values for every field with a type conversion.',
      'Data profiling — examining a dataset up front to collect statistics on structure, null rates, distinct-value counts, and outliers — surfaces most of these issues before writing a single test case, making it the natural first step of an ETL test plan.',
      'Date boundary conditions deserve their own explicit test cases: earliest/latest allowed dates, fiscal year boundaries, leap years, and invalid dates (Feb 30) — date logic is a disproportionately common source of ETL bugs.'
    ]
  },
  {
    id: 'etl-transformation-testing',
    title: 'Testing Transformation Logic',
    summary:
      'Unit-test each transformation rule in isolation with known input/expected-output pairs, then verify the composed pipeline end to end — a complex transformation chain is exactly where SQL-diff testing alone stops being sufficient.',
    difficulty: 'intermediate',
    category: 'data quality',
    prerequisites: ['etl-data-quality-checks'],
    keyPoints: [
      'For a single transformation rule (a currency conversion, a string normalization, a calculated field), define expected output for a small, hand-crafted input set FIRST — this is unit testing applied to a data pipeline instead of application code.',
      "Complex, multi-step transformations (aggregation → join → filter → calculation) benefit from testing each intermediate stage's output, not just the final result — isolates exactly which step introduced a discrepancy when something breaks.",
      'SQL or Python (pandas) scripts comparing actual transformed output against expected output are the standard automation approach — assertions on specific rows/columns, not just an eyeballed spot-check.',
      'Business-rule transformations (e.g. "flag any order over $10,000 as high-value") need test cases at and around the threshold — the same boundary-value-analysis principle from functional testing applies directly to transformation logic.'
    ]
  },
  {
    id: 'etl-performance-testing',
    title: 'ETL Performance & Scalability Testing',
    summary:
      'A transformation correct on a 1,000-row dev dataset can silently corrupt or time out on 10 million production rows — performance testing at REALISTIC volume is what catches scale-dependent bugs before they reach production.',
    difficulty: 'intermediate',
    category: 'performance & scale',
    prerequisites: ['etl-transformation-testing', 'test-fund-mt-performance-load-testing'],
    keyPoints: [
      'Key metrics: throughput (rows processed per second/minute), latency (time from source change to target availability, critical for near-real-time pipelines), and resource utilization (CPU, memory, I/O) under realistic load.',
      "Performance testing must run against production-SCALE data, not a small dev sample — a join or transformation that's instant at 1,000 rows can be an accidental O(n²) operation that times out or exhausts memory at real volume.",
      'Failure to meet a Service Level Agreement (SLA) — e.g. "yesterday\'s data must be available by 6am" — is itself a testable, measurable outcome, not just a vague performance concern; testing should assert against the actual SLA target.',
      'Partitioning and sharding (splitting large datasets across parallel processing units) need their own correctness tests on top of pure speed tests — verifying data lands in the CORRECT partition and no cross-partition duplication or loss occurs.'
    ]
  },
  {
    id: 'etl-security-compliance',
    title: 'Security & Compliance Testing in ETL',
    summary:
      'Sensitive data (PII, financial, health) flows through ETL pipelines just like any other data — testing verifies masking/encryption are actually applied and irreversible, not just that a masking STEP exists in the pipeline diagram.',
    difficulty: 'intermediate',
    category: 'security & compliance',
    prerequisites: ['etl-data-quality-checks', 'websec-xss'],
    keyPoints: [
      'Data masking/anonymization testing verifies the transformation is actually IRREVERSIBLE (not just obfuscated-looking) and that the masked data remains statistically usable for its intended purpose (analytics, testing) — both properties need separate test cases.',
      'Encryption testing (commonly AES-256 for data at rest) verifies data is genuinely unintelligible without the key, that encryption/decryption round-trips correctly, and that key management/rotation is handled securely — not just that a column LOOKS encrypted.',
      'Access control testing confirms only authorized roles/systems can read sensitive fields at each pipeline stage — a common gap is masking data in the final target while leaving it exposed in intermediate staging tables.',
      'Regulatory compliance testing (GDPR, CCPA, HIPAA depending on data type) verifies specific mandated behaviors: data retention limits are enforced, deletion/right-to-be-forgotten requests actually propagate through the pipeline, and audit logs capture who accessed what and when.',
      'PII-cleaning validation combines automated regex/pattern scanning (catching obvious leftover emails, SSNs, phone numbers) with manual sampling — automation alone tends to miss PII embedded in free-text fields.'
    ]
  },
  {
    id: 'etl-error-handling-recovery',
    title: 'Error Handling & Recovery Testing',
    summary:
      'A pipeline WILL fail partway through eventually — testing verifies it fails safely: no partial/corrupted data left in the target, a clear error log, and a working retry or rollback path.',
    difficulty: 'intermediate',
    category: 'security & compliance',
    prerequisites: ['etl-performance-testing'],
    keyPoints: [
      'Deliberately inject failures during testing — a malformed source record, a dropped connection mid-load, a resource constraint (disk full, connection pool exhausted) — rather than only testing the happy path where everything succeeds.',
      'Verify the recovery mechanism actually works: does a retry pick up where it left off (idempotent re-processing) or does it duplicate already-loaded rows; does a rollback genuinely restore the pre-failure state, or leave the target in a partially-loaded, inconsistent condition.',
      'A migration or load with no TESTED rollback path is a one-way door in production — "we have a rollback script" that has never actually been run against realistic data is not a verified safety net.',
      'Circuit breakers, data quarantine (routing bad records to a dead-letter area instead of failing the whole batch or silently dropping them), and comprehensive error logging are the operational-resilience patterns worth naming when asked how a pipeline handles failure gracefully at scale.'
    ]
  },
  {
    id: 'etl-real-time-streaming',
    title: 'Testing Real-Time / Streaming ETL',
    summary:
      'Streaming pipelines (Kafka-style, micro-batch) replace "did last night\'s batch complete correctly" with "is data flowing continuously and correctly, right now" — testing shifts from one-time batch validation to continuous monitoring plus targeted micro-batch checks.',
    difficulty: 'advanced',
    category: 'performance & scale',
    prerequisites: ['etl-cdc', 'etl-performance-testing'],
    keyPoints: [
      "Simulate realistic data VOLUME and VELOCITY (not just correctness on a handful of test events) — a streaming pipeline's failure modes (backpressure, consumer lag, dropped messages under load) only appear under sustained realistic throughput.",
      'Micro-batch validation applies the same reconciliation techniques as batch ETL (counts, checksums) but at a smaller time-windowed scale, run continuously rather than once — dashboards/alerts on these checks catch drift in near-real-time instead of the next morning.',
      'Test message ordering and exactly-once (or documented at-least-once) delivery guarantees explicitly — a streaming consumer that processes a message twice on retry needs to be idempotent, or duplicate data silently accumulates.',
      "Data quality metrics (accuracy, completeness, duplication rate) need continuous tracking here rather than a one-time test-cycle report — the QA output for a streaming pipeline is a live dashboard, not a static pass/fail from last week's test run."
    ]
  },
  {
    id: 'etl-tools-and-sql',
    title: 'Common ETL Testing Tools',
    summary:
      'Informatica and Talend are full ETL platforms with their own testing/validation modules (Informatica DVO); QuerySurge and Datagaps ETL Validator are dedicated data-testing/reconciliation tools that work across whichever ETL platform is in use.',
    difficulty: 'basic',
    category: 'tools & automation',
    prerequisites: ['etl-reconciliation'],
    keyPoints: [
      "Informatica and Talend: enterprise ETL platforms — most large organizations' pipelines are built in one of these, and each ships companion data-quality/validation tooling (Informatica DVO) rather than requiring hand-rolled comparison scripts.",
      'QuerySurge and Datagaps ETL Validator: dedicated data-testing tools focused specifically on automating source-vs-target comparison, regression testing across pipeline runs, and generating reconciliation reports — platform-agnostic, so they work alongside Informatica, Talend, or custom pipelines equally.',
      "Cloud-native pipelines (AWS Glue, Redshift, Snowflake, BigQuery) are commonly tested with a combination of SQL queries run directly against source/target, Python (pandas/boto3) validation scripts, and the cloud provider's own monitoring (CloudWatch and equivalents) for pipeline-run health.",
      "Whichever tool, the underlying technique is always one of: SQL-based row/aggregate comparison, hash/checksum comparison, or a scripted (Python) assertion-based validation — the tool automates and schedules these, it doesn't replace understanding what to compare."
    ]
  }
];
