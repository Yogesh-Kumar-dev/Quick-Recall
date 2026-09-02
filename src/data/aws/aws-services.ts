import type { BaseProblemEntry } from '@/types/content';

// Curated for AWS Cloud Practitioner (CLF-C02) and Solutions Architect Associate (SAA-C03) prep.
// 19 hand-picked services plus the Well-Architected Framework (not a full catalog) — mapped
// against each exam's official domain weightings so every scored domain has real coverage.
// `slug` is the /aws/[service] route param; `relatedNoteIds` cross-links into aws-notes.ts.
export interface AwsService extends BaseProblemEntry {
  cert: ('CLF-C02' | 'SAA-C03')[];
  summary: string;
  keyFeatures: string[];
  useCases: string[];
  pricingModel: string;
  gotchas?: string[];
  relatedNoteIds?: string[];
}

export const awsServices: AwsService[] = [
  // ─── SECURITY ─────────────────────────────────────────────────────────────────
  {
    id: 'iam',
    title: 'IAM',
    slug: 'iam',
    difficulty: 'easy',
    category: 'Security',
    tags: ['identity', 'access', 'policies'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Identity and Access Management — controls who (or what) can do what to which AWS resources, via users, groups, roles, and JSON policies.',
    keyFeatures: [
      'Users, groups, and roles as identities — roles issue short-lived, auto-rotating credentials (no stored secrets)',
      'JSON policies: Effect (Allow/Deny) + Action + Resource + optional Condition',
      'Identity-based policies (attached to a principal) vs resource-based policies (attached to the resource, e.g. S3 bucket policy)',
      'MFA, password policies, and IAM Access Analyzer for auditing unused permissions',
      'Global service — not scoped to a Region',
      'Free to use — no additional charge for IAM itself'
    ],
    useCases: [
      'Granting an EC2 instance or Lambda function access to other AWS services via a role',
      'Cross-account access using AssumeRole instead of shared long-term keys',
      'Enforcing least privilege for a team of developers'
    ],
    pricingModel: 'Free — no charge for users, groups, roles, or policies.',
    gotchas: [
      'An explicit Deny always overrides any Allow, no matter how many policies grant access',
      'IAM is global, but STS temporary credentials and some Condition keys are Region-aware',
      'The root account should never have access keys or be used for daily work — lock it down with MFA'
    ],
    relatedNoteIds: ['aws-iam-basics', 'aws-iam-roles', 'aws-iam-vs-resource-policy', 'aws-least-privilege', 'aws-account-security']
  },
  {
    id: 'kms',
    title: 'KMS',
    slug: 'kms',
    difficulty: 'medium',
    category: 'Security',
    tags: ['encryption', 'keys'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Key Management Service — create and control encryption keys used to protect data at rest across S3, EBS, RDS, and most other AWS services.',
    keyFeatures: [
      'Customer Master Keys (CMKs): AWS-managed (free, less control) vs customer-managed (you set the policy, enable rotation)',
      'Envelope encryption: KMS encrypts a short-lived data key, which encrypts your actual data — the CMK itself never leaves KMS',
      'Automatic annual key rotation for customer-managed keys (opt-in)',
      'Fine-grained access control via key policies, separate from IAM identity policies',
      'CloudTrail logs every use of a key — full audit trail of who decrypted what and when',
      'Regional service; keys don\'t cross Regions without explicit multi-Region key setup'
    ],
    useCases: [
      'Encrypting an S3 bucket or EBS volume with SSE-KMS instead of the default SSE-S3',
      'Encrypting RDS/DynamoDB data at rest with a customer-managed key you control the policy for',
      'Enforcing envelope encryption in application code via the AWS Encryption SDK'
    ],
    pricingModel: 'Monthly fee per customer-managed key, plus per-API-call charges (encrypt/decrypt/generate-data-key). AWS-managed keys are free.',
    gotchas: [
      'Deleting a CMK is irreversible after a mandatory 7-30 day waiting period — anything encrypted with it becomes permanently unreadable',
      'A key policy denying access can lock out even the account root user — unlike most IAM resource policies'
    ],
    relatedNoteIds: ['aws-security-services']
  },
  {
    id: 'secrets-manager',
    title: 'Secrets Manager',
    slug: 'secrets-manager',
    difficulty: 'easy',
    category: 'Security',
    tags: ['secrets', 'rotation', 'credentials'],
    cert: ['SAA-C03'],
    summary: 'Stores, retrieves, and automatically rotates secrets like database credentials and API keys, so they never need to be hardcoded.',
    keyFeatures: [
      'Built-in automatic rotation for RDS, Redshift, and DocumentDB credentials via a Lambda rotation function',
      'Fine-grained access via IAM policies and resource policies on individual secrets',
      'Encrypted at rest with KMS by default',
      'Versioned secrets — old and new credential versions coexist briefly during rotation',
      'Cross-account and cross-region secret replication'
    ],
    useCases: [
      'Storing an RDS database password that rotates every 30 days with zero application downtime',
      'Retrieving a third-party API key at Lambda runtime instead of baking it into an environment variable'
    ],
    pricingModel: 'Per secret, per month, plus per-10,000-API-calls — noticeably more expensive than Parameter Store.',
    gotchas: [
      'Exam trap: Secrets Manager costs money per secret; Parameter Store\'s standard tier is free — don\'t default to Secrets Manager for plain (non-rotating) config',
      'Rotation requires a Lambda function with network access to the target database (often needs VPC configuration)'
    ],
    relatedNoteIds: ['aws-security-services']
  },
  {
    id: 'parameter-store',
    title: 'Parameter Store',
    slug: 'parameter-store',
    difficulty: 'easy',
    category: 'Security',
    tags: ['config', 'ssm'],
    cert: ['SAA-C03'],
    summary: 'Part of AWS Systems Manager — a hierarchical key-value store for configuration data and secrets, cheaper than Secrets Manager but with no built-in rotation.',
    keyFeatures: [
      'Standard tier: free, up to 10,000 parameters, 4 KB max value',
      'Advanced tier: paid, up to 100,000 parameters, 8 KB max value, supports parameter policies (TTL, expiration notifications)',
      'SecureString type encrypts values with KMS; String/StringList stay in plaintext',
      'Hierarchical naming (e.g. /app/prod/db-password) for organizing and scoping IAM access by path',
      'No native automatic rotation — you\'d script it yourself (e.g. via Lambda + EventBridge)'
    ],
    useCases: [
      'Storing non-secret app configuration (feature flags, endpoint URLs) referenced by Lambda/ECS at startup',
      'Storing a rarely-changing secret (SecureString) when Secrets Manager\'s rotation isn\'t needed and cost matters'
    ],
    pricingModel: 'Standard tier is free; Advanced tier and high-throughput API calls are charged.',
    gotchas: [
      'The exam loves this comparison: Parameter Store = cheap + no rotation; Secrets Manager = paid + automatic rotation',
      'A SecureString parameter still needs kms:Decrypt permission in the caller\'s IAM policy, not just ssm:GetParameter'
    ],
    relatedNoteIds: ['aws-security-services']
  },

  // ─── COMPUTE ──────────────────────────────────────────────────────────────────
  {
    id: 'ec2',
    title: 'EC2',
    slug: 'ec2',
    difficulty: 'easy',
    category: 'Compute',
    tags: ['virtual-machines', 'iaas'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Elastic Compute Cloud — resizable virtual servers, the core IaaS building block: choose an AMI, an instance type, storage, and a security group, then launch.',
    keyFeatures: [
      'Instance families shaped by workload: general purpose (t/m), compute-optimized (c), memory-optimized (r/x), storage-optimized (i/d), accelerated/GPU (p/g)',
      'Pricing options: On-Demand, Reserved/Savings Plans (committed discount), Spot (up to ~90% off, reclaimable)',
      'EBS for persistent block storage; instance store for ephemeral, high-speed local disk',
      'Auto Scaling Groups + Elastic Load Balancing for horizontal scaling and self-healing',
      'IAM roles attach to instances for AWS access — never store long-lived keys on a box'
    ],
    useCases: [
      'Long-running or stateful workloads needing full OS control',
      'Lift-and-shift of an existing on-prem application',
      'Hosting a database, custom networking setup, or anything needing more than Lambda\'s 15-minute limit'
    ],
    pricingModel: 'Per-second billing while running; separate charges for attached EBS storage, data transfer, and any Elastic IP left unattached.',
    gotchas: [
      'A stopped instance still bills for its attached EBS volumes even though compute charges pause',
      'Instance store data is wiped on stop/terminate — anything that must persist belongs on EBS or S3',
      'Spot Instances can be reclaimed with only 2 minutes\' notice — only for fault-tolerant, interruptible work'
    ],
    relatedNoteIds: ['aws-ec2-basics', 'aws-scaling-up-vs-out', 'aws-ec2-ecs-eks', 'aws-ec2-vs-lambda']
  },
  {
    id: 'auto-scaling-elb',
    title: 'Auto Scaling & ELB',
    slug: 'auto-scaling-elb',
    difficulty: 'medium',
    category: 'Compute',
    tags: ['scaling', 'load-balancing', 'high-availability'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary:
      'Auto Scaling Groups add/remove EC2 instances to match demand and self-heal; Elastic Load Balancing distributes traffic across them — the standard pairing behind almost every resilient EC2 architecture.',
    keyFeatures: [
      'A Launch Template defines what to launch (AMI, instance type, security groups); the Auto Scaling Group (ASG) defines min/desired/max capacity across which AZs',
      'Scaling policies react to CloudWatch metrics — target tracking ("keep average CPU at 50%") is simplest; step/simple scaling and scheduled scaling cover other cases',
      'Self-healing: if an instance fails its health check, the ASG terminates it and launches a replacement to maintain desired capacity',
      'ALB (Application Load Balancer): Layer 7 (HTTP/HTTPS), content-based routing by path/host/header — the default modern choice for web apps and microservices',
      'NLB (Network Load Balancer): Layer 4 (TCP/UDP), ultra-low latency and millions of requests/sec, static IPs — for high-performance or non-HTTP protocols',
      'All load balancers run health checks and spread traffic across healthy targets in multiple AZs, giving clients one stable endpoint'
    ],
    useCases: [
      'A web tier that scales out during traffic spikes and back in overnight to save cost',
      'Spreading EC2 instances across 3 AZs behind an ALB so a single AZ outage doesn\'t take the app down',
      'Routing by URL path to different target groups (microservices) through one ALB'
    ],
    pricingModel: 'Auto Scaling itself is free — you pay only for the EC2 instances it launches. Load balancers bill hourly plus per-GB/per-LCU processed.',
    gotchas: [
      'Multi-AZ and read replicas solve different problems, and so do ASG health checks vs. ALB health checks — an unhealthy-per-ALB instance gets stopped receiving traffic, but only the ASG\'s own health check decides whether to terminate and replace it',
      'CLB (Classic Load Balancer) is legacy — avoid for new work, prefer ALB/NLB',
      'Target tracking scaling reacts to a lagging CloudWatch metric (typically 1-5 min granularity) — it is not instantaneous, so a sharp traffic spike can still cause brief under-provisioning'
    ],
    relatedNoteIds: ['aws-auto-scaling', 'aws-elb-types']
  },
  {
    id: 'lambda',
    title: 'Lambda',
    slug: 'lambda',
    difficulty: 'medium',
    category: 'Compute',
    tags: ['serverless', 'functions', 'event-driven'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Run code in response to events without provisioning servers — scales from zero to thousands of concurrent executions automatically, billed per invocation.',
    keyFeatures: [
      'Event-driven triggers: API Gateway, S3, DynamoDB Streams, SQS, EventBridge schedules, and more',
      'Configurable memory (which also scales allotted CPU) and timeout, up to 15 minutes',
      'Scales to zero at idle — no cost when there\'s no traffic',
      'Dead Letter Queues and Destinations route failed invocations somewhere inspectable',
      'Provisioned Concurrency pre-warms execution environments to eliminate cold starts for latency-sensitive paths'
    ],
    useCases: [
      'Serverless API backends behind API Gateway',
      'Event-driven glue code (resize an image on S3 upload, process a DynamoDB stream)',
      'Scheduled jobs via EventBridge instead of a cron-running EC2 box'
    ],
    pricingModel: 'Pay per invocation plus GB-seconds of execution time — no charge while idle.',
    gotchas: [
      'Cold starts add latency to the first request after idle — mitigate with Provisioned Concurrency',
      'Functions are stateless between invocations — anything needing persistence must go to S3/EFS/a database, never local disk',
      'A traffic spike can hit concurrency limits and throttle if the account/function limit hasn\'t been raised'
    ],
    relatedNoteIds: ['aws-lambda', 'aws-serverless-stack', 'aws-ec2-vs-lambda']
  },

  // ─── STORAGE ──────────────────────────────────────────────────────────────────
  {
    id: 's3',
    title: 'S3',
    slug: 's3',
    difficulty: 'easy',
    category: 'Storage',
    tags: ['object-storage', 'buckets'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Simple Storage Service — virtually unlimited, highly durable object storage accessed over HTTP. Not a filesystem: an object store addressed by bucket + key.',
    keyFeatures: [
      'Storage classes trade cost for retrieval speed: Standard → Standard-IA/One Zone-IA → Glacier / Glacier Deep Archive',
      'Versioning protects against accidental overwrite/delete; Lifecycle policies auto-tier or expire objects over time',
      'Cross-Region Replication (CRR) for disaster recovery or lower-latency access elsewhere',
      'Designed for 11 nines (99.999999999%) of durability',
      'Buckets are private by default — access via bucket policies/IAM, encrypted with SSE-S3 or SSE-KMS'
    ],
    useCases: [
      'Static website hosting, typically served through CloudFront rather than a public bucket',
      'Backups, log archives, and data-lake storage for analytics',
      'Storing Lambda deployment artifacts and application file uploads'
    ],
    pricingModel: 'Pay per GB stored (varies by storage class), plus per-request and data-transfer-out charges.',
    gotchas: [
      'A misconfigured public bucket is one of the most common real-world data leaks — keep "Block Public Access" on and serve public content via CloudFront instead',
      'Lifecycle transitions and early-deletion from Glacier/IA tiers carry their own minimum-duration charges'
    ],
    relatedNoteIds: ['aws-s3', 'aws-s3-features', 'aws-storage-options']
  },

  // ─── DATABASE ─────────────────────────────────────────────────────────────────
  {
    id: 'rds',
    title: 'RDS',
    slug: 'rds',
    difficulty: 'medium',
    category: 'Database',
    tags: ['relational', 'sql', 'managed-database'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Relational Database Service — managed MySQL, PostgreSQL, MariaDB, SQL Server, Oracle, and Aurora, with AWS handling backups, patching, and failover.',
    keyFeatures: [
      'Multi-AZ: a synchronous standby in another AZ that AWS fails over to automatically — for availability, not read scaling',
      'Read replicas: asynchronous, readable copies — for scaling reads (can lag, eventually consistent)',
      'Automated backups with point-in-time recovery, plus manual snapshots for longer retention',
      'RDS Proxy pools database connections — important when many Lambdas would otherwise exhaust the connection limit',
      'Aurora is AWS\'s own MySQL/PostgreSQL-compatible engine, faster and more scalable than stock RDS'
    ],
    useCases: [
      'Structured, transactional data needing joins, schemas, and ACID guarantees',
      'Lift-and-shift of an existing relational application database',
      'A read-heavy app offloading traffic to read replicas'
    ],
    pricingModel: 'Per-hour instance pricing (by instance class) plus storage, I/O, and backup-storage-beyond-free-tier charges.',
    gotchas: [
      'Multi-AZ standby is NOT readable — mixing it up with read replicas is the single most common exam trap on this topic',
      'A backup you\'ve never test-restored is a hope, not a plan'
    ],
    relatedNoteIds: ['aws-rds-vs-dynamodb', 'aws-rds-management']
  },
  {
    id: 'dynamodb',
    title: 'DynamoDB',
    slug: 'dynamodb',
    difficulty: 'medium',
    category: 'Database',
    tags: ['nosql', 'key-value', 'serverless-database'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Fully managed NoSQL key-value/document database with flexible schema, seamless horizontal scaling, and single-digit-millisecond latency at any scale.',
    keyFeatures: [
      'Partition key (+ optional sort key) determines how data is distributed — access patterns must be designed up front',
      'On-demand or provisioned capacity modes, with auto-scaling for provisioned throughput',
      'DynamoDB Streams capture item-level changes for triggering Lambda functions',
      'Global Tables replicate a table across Regions for multi-Region, active-active access',
      'No connection-pool problem like a relational DB — matches Lambda\'s elastic, stateless scaling'
    ],
    useCases: [
      'Serverless application backends paired with API Gateway + Lambda',
      'High-scale workloads with simple, known access patterns (get-by-key, not ad-hoc joins)',
      'Session state, shopping carts, and other latency-sensitive key-value data'
    ],
    pricingModel: 'On-demand: pay per read/write request. Provisioned: pay for reserved read/write capacity units, plus storage.',
    gotchas: [
      'A bad partition key choice creates hot partitions and forces expensive table scans — this isn\'t a relational DB you can query arbitrarily later',
      'DynamoDB is NOT a drop-in RDS replacement — no joins, no complex ad-hoc queries'
    ],
    relatedNoteIds: ['aws-rds-vs-dynamodb']
  },
  {
    id: 'elasticache',
    title: 'ElastiCache',
    slug: 'elasticache',
    difficulty: 'medium',
    category: 'Database',
    tags: ['caching', 'redis', 'memcached', 'performance'],
    cert: ['SAA-C03'],
    summary:
      'A fully managed in-memory cache (Redis or Memcached) that sits in front of a database to absorb read load and cut latency from milliseconds to microseconds.',
    keyFeatures: [
      'Redis engine: persistence, replication, pub/sub, sorted sets/complex data structures, Multi-AZ with automatic failover — the default modern choice',
      'Memcached engine: simpler, multi-threaded, no persistence/replication — for a pure, horizontally-shardable cache with no data-durability need',
      'Cache-aside (lazy loading) is the standard pattern: app checks cache first, falls back to the database on a miss, then writes the result back to the cache',
      'Redis read replicas offload read traffic; Redis Cluster shards data across nodes for write scaling',
      'TTL-based expiration keeps cached data from going stale indefinitely'
    ],
    useCases: [
      'Absorbing read load from RDS/Aurora so the database doesn\'t become the bottleneck under high traffic',
      'Storing user session state so any web server in a fleet can serve any request (enables stateless horizontal scaling)',
      'Leaderboards, real-time counters, and rate limiting via Redis\'s native data structures'
    ],
    pricingModel: 'Per-hour node pricing (by node type), similar billing shape to RDS — no request-based pricing.',
    gotchas: [
      'Cache invalidation is the hard part: writes must update or invalidate the cached copy, or reads will serve stale data — this is the classic exam trap, not the caching mechanism itself',
      'Redis (with Multi-AZ) is for high availability; Memcached has no built-in replication — pick Redis whenever the exam scenario mentions failover or persistence',
      'A cache is not a database — cached data can be evicted or lost, so the source of truth must always be a real database behind it'
    ],
    relatedNoteIds: ['aws-ha-architecture']
  },

  // ─── NETWORKING ───────────────────────────────────────────────────────────────
  {
    id: 'vpc',
    title: 'VPC',
    slug: 'vpc',
    difficulty: 'medium',
    category: 'Networking',
    tags: ['networking', 'subnets', 'security-groups'],
    cert: ['SAA-C03'],
    summary: 'Virtual Private Cloud — a logically isolated private network in AWS where you control IP ranges, subnets, routing, and gateways. The network foundation everything else runs inside.',
    keyFeatures: [
      'A CIDR block (e.g. 10.0.0.0/16) carved into public subnets (route to an Internet Gateway) and private subnets (no direct inbound internet)',
      'A NAT Gateway lets private-subnet instances reach OUT to the internet without being reachable FROM it',
      'Security Groups: stateful, instance-level, allow-rules only. Network ACLs: stateless, subnet-level, allow AND deny rules',
      'VPC Peering connects two VPCs; VPN Gateway and Direct Connect connect to on-premises networks',
      'VPC Endpoints let resources reach AWS services (S3, DynamoDB) privately, without traversing the public internet'
    ],
    useCases: [
      'Isolating a database in a private subnet with no direct internet exposure',
      'Connecting an on-prem data center to AWS via Direct Connect or a VPN',
      'Running multi-tier architectures (public web tier, private app/data tier)'
    ],
    pricingModel: 'The VPC itself is free; NAT Gateways, VPN connections, Direct Connect, and data transfer between AZs/Regions are charged.',
    gotchas: [
      'NACLs are stateless — allowing inbound 443 without also allowing the outbound ephemeral port range for replies causes connections to mysteriously hang; Security Groups don\'t have this trap because they\'re stateful',
      'A public subnet is defined by its route table pointing to an Internet Gateway, not by any property on the subnet itself'
    ],
    relatedNoteIds: ['aws-vpc', 'aws-security-groups-nacls', 'aws-elb-types']
  },
  {
    id: 'route53',
    title: 'Route 53',
    slug: 'route53',
    difficulty: 'medium',
    category: 'Networking',
    tags: ['dns', 'routing'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'AWS\'s managed DNS service — resolves domain names to resources and can route traffic intelligently based on latency, geography, weight, or health.',
    keyFeatures: [
      'Hosted zones hold DNS records (A, AAAA, CNAME, MX, TXT) plus AWS "alias" records pointing at ELB/CloudFront/S3 for free',
      'Routing policies: Simple, Weighted (canary/blue-green traffic splits), Latency-based, Geolocation, Failover',
      'Health checks combined with Failover routing give automatic DNS-level failover to a standby endpoint',
      'Domain registration is also available directly through Route 53'
    ],
    useCases: [
      'Directing global users to the lowest-latency regional deployment',
      'Blue-green or canary deployments via weighted routing',
      'Automatic failover to a disaster-recovery site when health checks fail'
    ],
    pricingModel: 'Per hosted zone per month, plus per-query charges (varies by routing policy type) and health-check fees.',
    gotchas: [
      'Alias records (not standard CNAMEs) are required to point a zone apex (e.g. example.com) at an ELB, CloudFront distribution, or S3 website endpoint',
      'DNS failover isn\'t instant — it\'s bounded by the record\'s TTL, which clients and resolvers cache'
    ],
    relatedNoteIds: ['aws-route53']
  },
  {
    id: 'cloudfront',
    title: 'CloudFront',
    slug: 'cloudfront',
    difficulty: 'medium',
    category: 'Networking',
    tags: ['cdn', 'edge', 'caching'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'AWS\'s content delivery network — caches content at edge locations close to users, cutting latency and offloading traffic from the origin server.',
    keyFeatures: [
      'Requests route to the nearest edge location; a cache hit serves instantly, a miss fetches from the origin (S3, ALB, or any HTTP server) and caches it',
      'Origin Access Control lets CloudFront serve a private S3 bucket publicly while the bucket itself stays locked down',
      'Natural attachment point for AWS WAF (request filtering) and AWS Shield (DDoS absorption) at the edge',
      'Signed URLs/cookies restrict access to specific users or a time window',
      'Can cache both static assets and dynamic content with configurable TTLs and cache behaviors per path'
    ],
    useCases: [
      'Serving a global user base with low latency from a single S3-hosted static site',
      'Fronting an API or ALB to absorb traffic spikes and add edge-level security',
      'Video/media streaming distribution'
    ],
    pricingModel: 'Pay per GB of data transferred out and per HTTP(S) request, with regional pricing tiers.',
    gotchas: [
      'The classic exam pairing is "private S3 bucket + CloudFront with Origin Access Control" — a public bucket behind CloudFront defeats the purpose',
      'Cache invalidations aren\'t free above a small monthly allowance, and don\'t take effect instantly at every edge location'
    ],
    relatedNoteIds: ['aws-cloudfront']
  },

  // ─── MESSAGING ────────────────────────────────────────────────────────────────
  {
    id: 'sqs',
    title: 'SQS',
    slug: 'sqs',
    difficulty: 'easy',
    category: 'Messaging',
    tags: ['queue', 'decoupling'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Simple Queue Service — a durable message queue for decoupling producers from consumers; each message is processed by one consumer, then deleted.',
    keyFeatures: [
      'Standard queues: at-least-once delivery, best-effort ordering, nearly unlimited throughput',
      'FIFO queues: strict ordering and exactly-once processing, capped throughput',
      'Visibility timeout hides a message from other consumers while one is processing it, so it doesn\'t get double-processed',
      'Dead Letter Queues capture messages that repeatedly fail processing for later inspection',
      'Long polling reduces empty-response API calls compared to short polling'
    ],
    useCases: [
      'Decoupling a web app from a slower background worker (e.g. order processing, image resizing)',
      'Buffering a traffic spike so downstream services aren\'t overwhelmed',
      'Fan-out consumption pattern paired with SNS ("SNS + SQS fan-out")'
    ],
    pricingModel: 'Pay per million requests, with a small monthly free tier.',
    gotchas: [
      'A message that isn\'t explicitly deleted (or whose visibility timeout expires before processing finishes) reappears in the queue and can be processed again',
      'SQS is not replayable once a message is deleted — that\'s Kinesis\'s job, not SQS\'s'
    ],
    relatedNoteIds: ['aws-sqs-sns-kinesis']
  },
  {
    id: 'sns',
    title: 'SNS',
    slug: 'sns',
    difficulty: 'easy',
    category: 'Messaging',
    tags: ['pub-sub', 'notifications', 'fan-out'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'Simple Notification Service — publish one message and fan it out to many subscribers at once (Lambda, SQS, HTTP endpoints, email, SMS).',
    keyFeatures: [
      'Topics decouple publishers from subscribers — a publisher never knows who\'s subscribed',
      'Supports multiple subscriber protocols simultaneously: SQS, Lambda, HTTP(S), email, SMS, mobile push',
      'Message filtering lets subscribers receive only messages matching specific attributes',
      'The "SNS + SQS fan-out" pattern gives each subscriber its own durable queue instead of losing messages if a subscriber is briefly unavailable'
    ],
    useCases: [
      'Broadcasting an event to multiple independent downstream systems at once',
      'Sending alerts/notifications from CloudWatch Alarms to email or a chat webhook',
      'Fanning out a single event to several SQS queues for independent parallel processing'
    ],
    pricingModel: 'Pay per million publishes/deliveries, with protocol-specific rates for SMS and mobile push.',
    gotchas: [
      'SNS itself doesn\'t retain messages for subscribers that are down — pairing with SQS fan-out is how you get durability against a temporarily unavailable consumer',
      'SNS is push-based fan-out (pub/sub); SQS is a pull-based, single-consumer queue — don\'t confuse the two on the exam'
    ],
    relatedNoteIds: ['aws-sqs-sns-kinesis']
  },
  {
    id: 'ses',
    title: 'SES',
    slug: 'ses',
    difficulty: 'easy',
    category: 'Messaging',
    tags: ['email'],
    cert: ['SAA-C03'],
    summary: 'Simple Email Service — a cost-effective service for sending and receiving transactional, marketing, or bulk email at scale.',
    keyFeatures: [
      'Verified identities (domains or individual email addresses) required before sending, to prevent abuse and spoofing',
      'Sandbox mode (new accounts) restricts sending to verified addresses only until production access is granted',
      'Bounce, complaint, and delivery event notifications can be routed to SNS for handling',
      'DKIM and SPF configuration for improved deliverability and sender reputation',
      'Can send via SMTP interface or the AWS API/SDK'
    ],
    useCases: [
      'Sending transactional emails (password resets, order confirmations) from an application',
      'Bulk marketing email campaigns',
      'Receiving and processing inbound email programmatically'
    ],
    pricingModel: 'Pay per thousand emails sent/received, with a free tier for sending from EC2 or Lambda.',
    gotchas: [
      'A new SES account starts in the sandbox — it can only send to verified addresses until you request a limit increase to move to production',
      'SES is for sending YOUR application\'s email at scale, not a replacement for SNS\'s multi-protocol fan-out'
    ],
    relatedNoteIds: []
  },

  // ─── MONITORING ───────────────────────────────────────────────────────────────
  {
    id: 'cloudwatch',
    title: 'CloudWatch',
    slug: 'cloudwatch',
    difficulty: 'easy',
    category: 'Monitoring',
    tags: ['observability', 'metrics', 'logs', 'alarms'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary: 'AWS\'s core observability service — collects metrics and logs, triggers alarms, and surfaces it all on dashboards.',
    keyFeatures: [
      'Built-in metrics for CPU, network, and disk on most services; custom metrics for anything else',
      'Logs centralize application/system output; metric filters turn log patterns into alarmable metrics',
      'Alarms fire on threshold breaches — can notify via SNS or trigger actions like an Auto Scaling policy',
      'Dashboards give a unified real-time view across services',
      'CloudWatch Events/EventBridge schedules and reacts to service events (distinct from CloudTrail\'s audit log and X-Ray\'s request tracing)'
    ],
    useCases: [
      'Auto Scaling a fleet based on average CPU utilization crossing a threshold',
      'Alerting on-call when error-rate log patterns spike',
      'Centralized dashboarding across a multi-service architecture'
    ],
    pricingModel: 'Free tier for basic metrics; charged per custom metric, per alarm, per GB of log ingestion/storage, and per dashboard.',
    gotchas: [
      'CloudWatch answers "is it healthy" (metrics/alarms); CloudTrail answers "who did what" (API audit); X-Ray answers "where is the latency" (request tracing) — the exam tests this three-way distinction directly',
      'Standard EC2 metrics don\'t include memory or disk usage by default — that needs the CloudWatch agent'
    ],
    relatedNoteIds: ['aws-cloudwatch', 'aws-cloudtrail-vs-cloudwatch']
  },

  // ─── COST MANAGEMENT ──────────────────────────────────────────────────────────
  {
    id: 'billing-cost-management',
    title: 'Billing & Cost Management',
    slug: 'billing-cost-management',
    difficulty: 'easy',
    category: 'Cost Management',
    tags: ['billing', 'cost', 'support', 'pricing'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary:
      'The tools and options for understanding, forecasting, and controlling AWS spend — pricing models, Cost Explorer/Budgets, consolidated billing, and AWS Support plans. A full 12% of the CLF-C02 exam on its own.',
    keyFeatures: [
      'Pricing models: On-Demand (no commitment), Reserved Instances/Savings Plans (1-3yr commit for up to ~72% off), Spot (up to ~90% off, reclaimable), Dedicated Hosts/Instances (single-tenant hardware)',
      'AWS Cost Explorer: visualize and analyze historical spend, forecast future costs, filter/group by service, tag, or account',
      'AWS Budgets: set custom cost/usage/RI-coverage thresholds and get alerted before you overspend',
      'AWS Pricing Calculator: estimate costs of a proposed architecture before building it',
      'AWS Organizations consolidated billing: combine usage across linked accounts into one bill, share volume discounts and Reserved Instance/Savings Plan benefits across accounts',
      'Cost allocation tags: tag resources to break billing reports (Cost and Usage Report) down by team, project, or environment'
    ],
    useCases: [
      'A multi-account Organization getting a single consolidated invoice and RI benefits shared across all member accounts',
      'Setting a Budget alert that emails when forecasted monthly spend exceeds a threshold',
      'Tagging resources by project/team so Cost Explorer can show a per-team cost breakdown'
    ],
    pricingModel:
      'Cost Explorer, Budgets, and the Pricing Calculator are free. AWS Support plans are the paid tier here: Basic (free), Developer, Business, Enterprise On-Ramp, and Enterprise (rising cost for faster response times and a Technical Account Manager).',
    gotchas: [
      'Reserved Instances/Savings Plans are a billing-level discount, not a physical reservation of capacity by default (unless you also use Capacity Reservations) — don\'t confuse "guaranteed discount" with "guaranteed capacity"',
      'Trusted Advisor\'s cost-optimization checks (idle/underutilized resources) are only fully available on Business/Enterprise Support plans, not Basic',
      'Consolidated billing shares discounts across an Organization but does NOT automatically share data or grant cross-account access — that still needs IAM roles/resource policies'
    ],
    relatedNoteIds: ['aws-pricing-models', 'aws-cost-optimization']
  },

  // ─── ARCHITECTURE ─────────────────────────────────────────────────────────────
  {
    id: 'well-architected',
    title: 'Well-Architected',
    slug: 'well-architected',
    difficulty: 'medium',
    category: 'Architecture',
    tags: ['architecture', 'best-practices', 'framework'],
    cert: ['CLF-C02', 'SAA-C03'],
    summary:
      'A framework of 6 pillars and design principles for evaluating architectures — not a service you provision, but the lens AWS (and the exam) uses to judge whether a design is "good."',
    keyFeatures: [
      'Operational Excellence: run and monitor systems to deliver business value, continually improve processes and procedures',
      'Security: protect information, systems, and assets through risk assessments and mitigation strategies',
      'Reliability: ensure a workload performs its intended function correctly and consistently, recovering quickly from failure',
      'Performance Efficiency: use computing resources efficiently, and maintain that efficiency as demand and technology evolve',
      'Cost Optimization: avoid unnecessary costs, understand and control where money is spent',
      'Sustainability: minimize the environmental impact of running cloud workloads',
      'AWS Well-Architected Tool: a free self-service tool to review a workload against the framework and get improvement recommendations'
    ],
    useCases: [
      'Reviewing a new architecture before launch to catch single points of failure, security gaps, or unnecessary spend',
      'Explaining trade-offs between pillars (for example, faster failover vs lower cost) using shared vocabulary with stakeholders',
      'Using the Well-Architected Tool to produce a documented improvement plan for an existing workload'
    ],
    pricingModel: 'The framework itself and the AWS Well-Architected Tool are both free to use.',
    gotchas: [
      "Sustainability was added as the 6th pillar in late 2021 — older materials referencing 'five pillars' are outdated",
      'The pillars often trade off against each other (for example, higher reliability usually costs more) — there is rarely one universally "correct" answer, only the best trade-off for a given requirement',
      "It's a framework of questions and principles, not a checklist of specific services — the exam tests recognizing which pillar a scenario is about, not memorizing a fixed service list"
    ]
  }
];
