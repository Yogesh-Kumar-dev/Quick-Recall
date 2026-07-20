import type { Note } from '@/types/content';

// category values: 'fundamentals' | 'iam' | 'compute' | 'serverless' | 'storage' | 'databases'
//   | 'networking' | 'messaging' | 'monitoring' | 'devops' | 'security' | 'cost' | 'architecture'
// Distilled from AWS interview-question roundups (Adaface + others), organised by service/topic
// rather than by difficulty level. Growing collection, not a one-time dump.

export const awsNotes: Note[] = [
  // ─── FUNDAMENTALS ─────────────────────────────────────────────────────────────
  {
    id: 'aws-regions-azs',
    title: 'Regions & Availability Zones',
    summary: 'A Region is a geographic area; each Region contains multiple isolated Availability Zones (AZs) , the unit you spread across for high availability.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'Region: a named geographic area (us-east-1, eu-west-1) , you pick one close to your users to cut latency, and for data-residency/compliance reasons.',
      'Availability Zone: one or more discrete data centers within a Region, with independent power/cooling/networking , if one AZ fails, the others keep running.',
      'High availability pattern: run your workload across ≥2 AZs so a single AZ outage doesn’t take you down (ELB + Auto Scaling Group spanning AZs is the canonical setup).',
      'Edge Locations are a third tier , CDN/CloudFront points of presence, many more than there are Regions, used for caching content close to users.'
    ],
    gotcha:
      'AZs are the failure-isolation boundary, not Regions , deploying two instances in the same AZ gives you zero protection against the most common infrastructure failure (an AZ going down). Multi-AZ is the baseline; multi-Region is for disaster recovery.'
  },
  {
    id: 'aws-shared-responsibility',
    title: 'The Shared Responsibility Model',
    summary: 'AWS secures the cloud (hardware, facilities, managed-service internals); you secure what you put in the cloud (your data, configs, access, OS patches).',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'AWS = "security OF the cloud": physical data centers, the hypervisor, the network backbone, and the internals of managed services.',
      'You = "security IN the cloud": your data, IAM policies, security group rules, encryption choices, and application code.',
      'The line moves by service type: on EC2 you patch the guest OS; on a managed service like Lambda or RDS, AWS patches the OS/runtime and you only own config + data.',
      'Most real-world breaches are on the customer side of the line , a public S3 bucket or an over-permissive IAM policy, not an AWS infrastructure failure.'
    ],
    gotcha:
      '"AWS handles security" is a dangerous half-truth , AWS securing the infrastructure does nothing for a world-readable S3 bucket or leaked access keys, which are entirely your responsibility.'
  },
  {
    id: 'aws-iaas-paas-saas',
    title: 'IaaS vs PaaS vs SaaS',
    summary: 'Three levels of "how much does the provider manage" , IaaS gives you raw infrastructure, PaaS a managed platform, SaaS a finished application.',
    difficulty: 'basic',
    category: 'fundamentals',
    keyPoints: [
      'IaaS (EC2, VPC, EBS): AWS gives you virtual servers/storage/network; you manage the OS, runtime, and app , maximum control, maximum ops burden.',
      'PaaS (Elastic Beanstalk, App Runner, Lambda): you deploy code and AWS manages the OS/runtime/scaling underneath , less control, far less ops.',
      'SaaS (Amazon WorkMail, QuickSight, most third-party apps): a finished product you just use; the provider manages everything.',
      'The tradeoff is always control vs. operational overhead , pick the highest-level abstraction that still gives you the control the workload actually needs.'
    ]
  },
  {
    id: 'aws-pricing-models',
    title: 'Pay-as-you-go & the Pricing Models',
    summary: 'The core AWS billing idea is paying only for what you use, with commitment-based discounts (Reserved, Savings Plans) and cheap interruptible capacity (Spot).',
    difficulty: 'basic',
    category: 'cost',
    keyPoints: [
      'On-Demand: pay per second/hour with no commitment , maximum flexibility, highest unit price. Use for spiky or short-lived workloads.',
      'Reserved Instances / Savings Plans: commit to 1 or 3 years of usage for a large discount (up to ~72%) , use for steady, predictable baseline load.',
      'Spot Instances: bid on spare capacity for up to ~90% off, but AWS can reclaim it with 2 minutes’ notice , use for fault-tolerant, interruptible work (batch, CI, big data).',
      'Blend them: Reserved/Savings Plans for the always-on baseline, On-Demand for normal variability, Spot for the interruptible burst layer.'
    ],
    gotcha:
      'Pay-as-you-go cuts both ways , resources left running (idle EC2, unattached EBS volumes, old snapshots, orphaned load balancers) keep billing 24/7. Cost surprises are usually forgotten resources, not the workload you meant to run.'
  },

  // ─── IAM & SECURITY ───────────────────────────────────────────────────────────
  {
    id: 'aws-iam-basics',
    title: 'IAM: Users, Groups, Roles & Policies',
    summary: 'IAM controls who can do what to which AWS resources , the foundation of AWS security, built on identities (users/groups/roles) and JSON policies.',
    difficulty: 'basic',
    category: 'iam',
    keyPoints: [
      'User: a permanent identity for a person or app, with long-lived credentials. Group: a collection of users sharing a set of policies , attach permissions to the group, not each user.',
      'Role: an identity with NO permanent credentials that is assumed temporarily , used by EC2/Lambda/other services, and for cross-account access. This is the preferred way to grant AWS resources access to other resources.',
      'Policy: a JSON document listing Effect (Allow/Deny), Action, Resource, and optional Conditions , attached to a user, group, or role.',
      'Root account: the all-powerful original login , lock it down (MFA, no access keys) and never use it for daily work.'
    ],
    gotcha:
      'Putting long-lived access keys on an EC2 instance (in a file or env var) is the classic anti-pattern , attach an IAM role instead. The instance gets automatic, rotating, temporary credentials with no secret to leak.'
  },
  {
    id: 'aws-iam-roles',
    title: 'IAM Roles & Temporary Credentials',
    summary: 'A role is an identity you assume to get temporary, auto-rotating credentials , the right way for services (and other accounts) to get access without stored secrets.',
    difficulty: 'intermediate',
    category: 'iam',
    prerequisites: ['aws-iam-basics'],
    keyPoints: [
      'A role has a permissions policy (what it can do) and a trust policy (who is allowed to assume it) , both must allow the action for assumption to succeed.',
      'When EC2/Lambda assumes a role, STS issues short-lived credentials that rotate automatically , nothing to store, nothing to leak, nothing to rotate manually.',
      'Cross-account access: Account B defines a role trusting Account A; a principal in A calls sts:AssumeRole to act in B , no shared long-term keys across the boundary.',
      'Federation: external identities (corporate SSO, Google, Cognito) assume a role to get scoped AWS access without an IAM user each.'
    ],
    gotcha:
      'A role that isn’t working is usually a trust-policy problem, not a permissions problem , the permissions policy can be perfect, but if the trust policy doesn’t name the assuming principal, the AssumeRole call fails before permissions ever matter.'
  },
  {
    id: 'aws-iam-vs-resource-policy',
    title: 'IAM Policy vs Resource-Based Policy',
    summary: 'IAM (identity) policies attach to a principal (user/role); resource-based policies attach to the resource itself and can grant cross-account access.',
    difficulty: 'intermediate',
    category: 'iam',
    prerequisites: ['aws-iam-basics'],
    keyPoints: [
      'Identity-based policy: attached to a user, group, or role , defines what that principal can do.',
      'Resource-based policy: attached to the resource (S3 bucket policy, Lambda resource policy, SQS queue policy) , defines who can act on it, including principals in other AWS accounts.',
      'Cross-account access typically needs a resource-based policy (or a role the other account can assume) , an identity policy alone can’t grant access to a different account’s resource.',
      'Effective permission = union of what both policy types allow, minus any explicit Deny (an explicit Deny always wins).'
    ],
    gotcha:
      'Attaching a permissive identity policy in Account A does nothing for accessing a bucket in Account B unless Account B’s bucket policy also allows it , permissions must agree on both sides of an account boundary.'
  },
  {
    id: 'aws-least-privilege',
    title: 'The Principle of Least Privilege',
    summary: 'Grant every identity the minimum permissions it needs to do its job, and nothing more , the single most important IAM habit.',
    difficulty: 'basic',
    category: 'iam',
    prerequisites: ['aws-iam-basics'],
    keyPoints: [
      'Start from zero and add specific permissions, rather than granting broad access (like AdministratorAccess or "*") and trimming later , additive-from-nothing is safer than subtractive-from-everything.',
      'Scope policies to specific Actions AND specific Resources , "s3:GetObject on arn:...:my-bucket/*" not "s3:* on *".',
      'Use conditions to tighten further (source IP, MFA present, time of day, requested region).',
      'Audit continuously , IAM Access Analyzer and "last accessed" data reveal permissions that were granted but never used, which are safe to remove.'
    ],
    gotcha:
      'Over-broad permissions are how a single compromised key becomes a full account breach , least privilege limits the blast radius. It’s tempting to grant "*" to make something work now and tighten "later"; later rarely comes.'
  },
  {
    id: 'aws-account-security',
    title: 'Account Security Best Practices',
    summary: 'MFA everywhere, roles over keys, least privilege, and continuous auditing with CloudTrail/GuardDuty/Config , defense in depth for the account itself.',
    difficulty: 'intermediate',
    category: 'security',
    prerequisites: ['aws-iam-basics'],
    keyPoints: [
      'Enable MFA on the root account and all privileged users; lock the root account away and don’t create access keys for it.',
      'Prefer IAM roles (temporary credentials) over long-lived access keys; rotate any keys that must exist.',
      'Log and monitor: CloudTrail records every API call (the audit trail), GuardDuty flags suspicious activity, AWS Config tracks resource configuration drift, Security Hub aggregates findings.',
      'Network + edge defenses: tight security groups, AWS WAF for app-layer filtering, Shield for DDoS protection.',
      'Encrypt everything: at rest (KMS/SSE) and in transit (TLS).'
    ]
  },
  {
    id: 'aws-security-services',
    title: 'Security Services: Shield, WAF, GuardDuty, Inspector',
    summary: 'A layered toolkit , Shield for DDoS, WAF for malicious requests, GuardDuty for threat detection, Inspector for vulnerability scanning, Secrets Manager for credentials.',
    difficulty: 'advanced',
    category: 'security',
    prerequisites: ['aws-account-security'],
    keyPoints: [
      'AWS Shield: DDoS protection , Standard is free and automatic; Advanced adds higher-layer protection and cost protection for larger targets.',
      'AWS WAF: web application firewall , rule-based filtering of HTTP(S) requests (SQL injection, XSS, bad bots, rate-based rules) in front of CloudFront/ALB/API Gateway.',
      'GuardDuty: continuous threat detection , analyzes CloudTrail/VPC Flow/DNS logs with ML to flag anomalies (crypto-mining, credential exfiltration) without you running agents.',
      'Inspector: automated vulnerability scanning of EC2 and container images against known CVEs.',
      'Secrets Manager: stores and automatically rotates database passwords/API keys , retrieved at runtime via IAM, never hardcoded. (Parameter Store is the cheaper option for non-secret config.)'
    ]
  },

  // ─── COMPUTE ──────────────────────────────────────────────────────────────────
  {
    id: 'aws-ec2-basics',
    title: 'EC2: Elastic Compute Cloud',
    summary: 'Resizable virtual servers you launch from an AMI, pick an instance type for, put in security groups, and connect to over SSH/RDP , the core IaaS compute service.',
    difficulty: 'basic',
    category: 'compute',
    keyPoints: [
      'Launch flow: choose an AMI (the OS/software image) → instance type (CPU/RAM sizing) → network/subnet → storage (EBS) → security group (firewall) → key pair → launch.',
      'Instance families are workload-shaped: general purpose (t/m), compute-optimized (c), memory-optimized (r/x), storage-optimized (i/d), accelerated/GPU (p/g).',
      'Attach an IAM role for AWS access (not stored keys); attach EBS volumes for persistent block storage that survives a stop/start.',
      'Connect via SSH (Linux, with your private key) or RDP (Windows) , the security group must allow the port from your IP.'
    ],
    gotcha:
      'Instance store (ephemeral) volumes are wiped when the instance stops , persistent data must live on EBS or S3. And a stopped instance still bills for its attached EBS storage even though you’re not paying for compute.'
  },
  {
    id: 'aws-scaling-up-vs-out',
    title: 'Scaling Up vs Scaling Out',
    summary: 'Scaling up (vertical) = a bigger machine; scaling out (horizontal) = more machines , AWS strongly favors scaling out for resilience.',
    difficulty: 'basic',
    category: 'compute',
    keyPoints: [
      'Vertical (scale up): move to a larger instance type , more CPU/RAM on one machine. Simple, but has a ceiling and usually means downtime to resize, and it’s still a single point of failure.',
      'Horizontal (scale out): add more instances behind a load balancer , no hard ceiling, and redundancy means one failure doesn’t take you down. This is the cloud-native default.',
      'Scaling out requires the app to be stateless (or to externalize state) so any instance can serve any request.',
      'Auto Scaling automates horizontal scaling , add/remove instances based on demand.'
    ]
  },
  {
    id: 'aws-auto-scaling',
    title: 'Auto Scaling Groups',
    summary: 'Automatically add or remove EC2 instances based on demand (CloudWatch metrics), keeping capacity matched to load across AZs , availability + cost efficiency in one.',
    difficulty: 'intermediate',
    category: 'compute',
    prerequisites: ['aws-scaling-up-vs-out'],
    keyPoints: [
      'A Launch Template defines what to launch (AMI, instance type, security groups); the Auto Scaling Group (ASG) defines min/desired/max capacity across which AZs.',
      'Scaling policies react to CloudWatch metrics , target tracking ("keep average CPU at 50%") is the easiest; step/simple scaling and scheduled scaling cover other cases.',
      'The ASG also self-heals: if an instance fails its health check, the ASG terminates it and launches a replacement , maintaining desired capacity.',
      'Spread the ASG across multiple AZs so scaling also improves fault tolerance, not just throughput.'
    ]
  },
  {
    id: 'aws-ec2-ecs-eks',
    title: 'EC2 vs ECS vs EKS vs Fargate',
    summary: 'EC2 = raw VMs; ECS = AWS-native container orchestration; EKS = managed Kubernetes; Fargate = serverless container hosting under either ECS or EKS.',
    difficulty: 'intermediate',
    category: 'compute',
    prerequisites: ['aws-ec2-basics'],
    keyPoints: [
      'EC2: full VMs, full OS control , most flexible, most to manage.',
      'ECS (Elastic Container Service): AWS’s own container orchestrator , simpler than Kubernetes, deeply integrated with AWS. You define task definitions and services.',
      'EKS (Elastic Kubernetes Service): managed Kubernetes control plane , pick this when you need Kubernetes portability/ecosystem or already run K8s elsewhere.',
      'Fargate: the "no servers to manage" launch type for ECS/EKS , AWS runs the containers, you never provision or patch EC2 hosts. Trade some control and cost per unit for zero infrastructure ops.'
    ],
    gotcha:
      'ECS vs EKS is mostly a simplicity-vs-portability call, not a capability one , reach for EKS when you specifically want Kubernetes; otherwise ECS is less operational overhead on AWS. And Fargate is a launch mode, not a competitor to ECS/EKS , you run Fargate under one of them.'
  },
  {
    id: 'aws-ec2-vs-lambda',
    title: 'EC2 vs Lambda: when to pick which',
    summary: 'EC2 is a persistent, always-on VM you manage; Lambda is a stateless function that runs on demand and scales to zero.',
    difficulty: 'basic',
    category: 'compute',
    keyPoints: [
      'EC2: full control over the OS/runtime, predictable long-running or stateful workloads, billed while running.',
      'Lambda: no server management, scales automatically per request, billed per invocation/duration, max 15-minute execution.',
      'Cold starts are a real Lambda cost for latency-sensitive paths , mitigated with provisioned concurrency or keeping runtimes lightweight.',
      'Lambda suits event-driven, bursty, short-lived work (webhooks, image processing, glue code); EC2 suits long-running services, custom networking, or workloads needing more than 15 minutes.'
    ],
    gotcha: 'Lambda functions are stateless between invocations , anything that needs to persist (files, connections) must go to S3/EFS/a database, not local disk.'
  },

  // ─── SERVERLESS ───────────────────────────────────────────────────────────────
  {
    id: 'aws-lambda',
    title: 'AWS Lambda & Serverless',
    summary: 'Run code in response to events without provisioning servers , AWS handles scaling, patching, and availability; you pay only per invocation and duration.',
    difficulty: 'intermediate',
    category: 'serverless',
    keyPoints: [
      'Event-driven: functions run in response to triggers , API Gateway request, S3 upload, DynamoDB stream, SQS message, CloudWatch schedule, etc.',
      'Scales automatically from zero to thousands of concurrent executions; you never manage capacity.',
      'Configure memory (which also scales CPU), timeout (max 15 min), and an IAM execution role granting the function’s permissions.',
      'Common uses: serverless API backends, real-time file/stream processing, scheduled jobs, glue between AWS services.',
      'Error handling: retries, Dead Letter Queues (DLQ), and Destinations route failed events somewhere you can inspect/replay them.'
    ],
    gotcha:
      'Cold starts (spinning up a new execution environment) add latency to the first request after idle , mitigate with Provisioned Concurrency for latency-sensitive paths. Also mind concurrency limits: a spike can throttle if you haven’t raised the account/function limit.'
  },
  {
    id: 'aws-serverless-stack',
    title: 'Serverless Stack: API Gateway + Lambda + DynamoDB',
    summary: 'The canonical serverless API , API Gateway fronts HTTP requests, Lambda runs the logic, DynamoDB stores the data, all scaling to zero and pay-per-use.',
    difficulty: 'advanced',
    category: 'serverless',
    prerequisites: ['aws-lambda'],
    keyPoints: [
      'API Gateway: the managed front door , routing, throttling/rate limiting, auth (Cognito/IAM/authorizers), request validation, and response caching, in front of Lambda.',
      'Lambda: stateless business logic per request; DynamoDB: the low-latency, horizontally-scaling data store that matches serverless’s elasticity (no connection-pool problem like a relational DB has).',
      'Step Functions orchestrate multi-step workflows across several Lambdas , define a state machine with sequential/parallel steps, retries, error handling, and timeouts instead of chaining functions by hand.',
      'Everything is IAM-scoped and event-driven , the whole stack idles at (near) zero cost when there’s no traffic.'
    ]
  },

  // ─── STORAGE ──────────────────────────────────────────────────────────────────
  {
    id: 'aws-s3',
    title: 'S3: Object Storage',
    summary: 'Highly durable, virtually unlimited object storage accessed over HTTP , for files, backups, static assets, data lakes, and more. Not a filesystem, an object store.',
    difficulty: 'basic',
    category: 'storage',
    keyPoints: [
      'Objects live in buckets, addressed by key; accessed via API/URL. Designed for 11 nines (99.999999999%) of durability.',
      'Storage classes trade cost for access speed: Standard (hot) → Standard-IA/One Zone-IA (infrequent) → Glacier / Glacier Deep Archive (archival, cheapest, slow to retrieve).',
      'Common uses: static website assets (often behind CloudFront), backups, log/data-lake storage, big-data analytics input.',
      'Security: buckets are private by default , grant access via bucket policies/IAM; encrypt at rest with SSE-S3 or SSE-KMS; require HTTPS in transit.'
    ],
    gotcha:
      'A misconfigured public bucket is one of the most common real-world data leaks , keep "Block Public Access" on unless you have a deliberate reason (like public static assets), and prefer serving via CloudFront over making the bucket itself public.'
  },
  {
    id: 'aws-s3-features',
    title: 'S3 Versioning, Lifecycle & Replication',
    summary: 'The data-protection and cost-control features on top of S3 , versioning guards against overwrites/deletes, lifecycle policies tier data down over time, replication copies across regions.',
    difficulty: 'intermediate',
    category: 'storage',
    prerequisites: ['aws-s3'],
    keyPoints: [
      'Versioning: keeps every version of an object , protects against accidental overwrite/delete (you can restore a prior version). MFA Delete adds a second factor to permanently removing versions.',
      'Lifecycle policies: automatically transition objects to cheaper classes (Standard → IA → Glacier) after N days, and expire/delete them after a retention period , the main S3 cost lever.',
      'Cross-Region Replication (CRR): automatically copy objects to a bucket in another Region , for disaster recovery, compliance, or lower-latency access in another geography.',
      'Backup options overlap: versioning + CRR, AWS Backup, or an "aws s3 sync" to another bucket , pick based on RPO/RTO and compliance needs.'
    ]
  },
  {
    id: 'aws-storage-options',
    title: 'Storage Options: S3 vs EBS vs EFS vs Glacier',
    summary: 'Object (S3), block attached to one instance (EBS), shared file system across many instances (EFS), and cheap archival (Glacier) , pick by access pattern.',
    difficulty: 'intermediate',
    category: 'storage',
    prerequisites: ['aws-s3'],
    keyPoints: [
      'S3 (object): unlimited, HTTP-accessed, durable , files, backups, static content, data lakes. Not a mountable filesystem.',
      'EBS (block): a virtual disk attached to a single EC2 instance , low latency, for databases and boot volumes. Persists independently of the instance.',
      'EFS (file): a managed NFS filesystem that many EC2 instances can mount simultaneously , shared content, lift-and-shift apps that expect a shared disk. Scales elastically.',
      'Glacier / Deep Archive: lowest-cost archival tiers (a class of S3) , for compliance/backup data you rarely read and can wait minutes-to-hours to retrieve.',
      'Also: Storage Gateway (bridge on-prem to AWS), Snowball (physically ship bulk data), FSx (managed Windows/Lustre file systems).'
    ],
    gotcha:
      'EBS attaches to ONE instance at a time; if you need a shared filesystem across multiple instances, that’s EFS, not EBS , trying to share one EBS volume across instances is a common design mistake.'
  },

  // ─── DATABASES ────────────────────────────────────────────────────────────────
  {
    id: 'aws-rds-vs-dynamodb',
    title: 'RDS vs DynamoDB',
    summary: 'RDS is managed relational (SQL, schemas, joins, ACID); DynamoDB is managed NoSQL key-value/document (flexible schema, horizontal scale, single-digit-ms latency).',
    difficulty: 'intermediate',
    category: 'databases',
    keyPoints: [
      'RDS: managed MySQL/PostgreSQL/MariaDB/SQL Server/Oracle (and Aurora) , structured schema, joins, transactions, complex queries. AWS handles backups, patching, and Multi-AZ failover.',
      'DynamoDB: fully managed NoSQL , flexible schema, seamless horizontal scaling, predictable low latency at any scale, pay-per-request or provisioned capacity. No servers, no connection pool.',
      'Choose RDS for relational data and complex queries; choose DynamoDB for high-scale, simple access patterns, and serverless workloads (it matches Lambda’s elasticity).',
      'Scaling differs: RDS scales reads with read replicas and up with bigger instances; DynamoDB scales horizontally and transparently by partitioning on the key.'
    ],
    gotcha:
      'DynamoDB rewards designing your table around your access patterns up front (partition/sort key choice) , it’s not a relational DB you can slap arbitrary queries on later. A bad key design leads to hot partitions and expensive scans.'
  },
  {
    id: 'aws-rds-management',
    title: 'RDS: Backups, Replicas & Multi-AZ',
    summary: 'RDS automates the operational database toil , automated backups, read replicas for read scaling, and Multi-AZ standby for high availability.',
    difficulty: 'intermediate',
    category: 'databases',
    prerequisites: ['aws-rds-vs-dynamodb'],
    keyPoints: [
      'Automated backups + point-in-time recovery; manual snapshots for longer retention , test restores, a backup you’ve never restored is a hope, not a plan.',
      'Multi-AZ: a synchronous standby replica in another AZ that AWS fails over to automatically on primary failure , this is for availability, not read scaling (you don’t read from the standby).',
      'Read replicas: asynchronous copies you CAN read from , offload read-heavy traffic from the primary. This is for scaling reads (and cross-region DR), and replicas can lag.',
      'RDS Proxy pools and manages database connections , important when many Lambdas would otherwise exhaust the DB’s connection limit.'
    ],
    gotcha:
      'Multi-AZ and read replicas solve different problems and are easy to confuse , Multi-AZ = availability (automatic failover, standby not readable); read replicas = read scaling (readable, but eventually consistent). Interviewers probe this distinction.'
  },

  // ─── NETWORKING ───────────────────────────────────────────────────────────────
  {
    id: 'aws-vpc',
    title: 'VPC: Virtual Private Cloud',
    summary: 'A logically isolated private network in AWS where you control IP ranges, subnets, routing, and gateways , the network foundation everything else runs inside.',
    difficulty: 'intermediate',
    category: 'networking',
    keyPoints: [
      'You define a CIDR block (e.g. 10.0.0.0/16) and carve it into subnets , public subnets (route to an Internet Gateway) and private subnets (no direct inbound internet).',
      'Route tables control traffic flow between subnets and out; an Internet Gateway gives public subnets internet access; a NAT Gateway lets private-subnet instances reach OUT to the internet without being reachable FROM it.',
      'Connectivity options: VPC Peering (connect two VPCs), VPN Gateway (encrypted tunnel to on-prem), Direct Connect (dedicated private line to AWS).',
      'Security layers inside the VPC: security groups (instance-level, stateful) and Network ACLs (subnet-level, stateless).'
    ]
  },
  {
    id: 'aws-security-groups-nacls',
    title: 'Security Groups vs Network ACLs',
    summary: 'Security groups are stateful, instance-level firewalls (allow rules only); NACLs are stateless, subnet-level filters (allow AND deny) , two complementary layers.',
    difficulty: 'intermediate',
    category: 'networking',
    prerequisites: ['aws-vpc'],
    keyPoints: [
      'Security Group: attached to instances/ENIs, stateful (return traffic is auto-allowed), allow-rules only (no explicit deny). The primary, everyday control.',
      'Network ACL: attached to subnets, stateless (you must allow both directions explicitly), supports allow AND deny rules , used for coarse subnet-wide blocks (e.g. deny an IP range).',
      'Stateful vs stateless is the key exam point: with a security group you open a port once and replies flow back; with a NACL you must open the ephemeral return port range too.',
      'They stack: traffic must pass the NACL (subnet) AND the security group (instance) to reach your app.'
    ],
    gotcha:
      'Forgetting NACLs are stateless is a classic connectivity bug , you allow inbound 443 but forget to allow the outbound ephemeral port range for the response, and connections mysteriously hang. Security groups don’t have this trap because they’re stateful.'
  },
  {
    id: 'aws-elb-types',
    title: 'Elastic Load Balancing: ALB vs NLB vs CLB',
    summary: 'Distribute incoming traffic across targets , ALB for HTTP(S) with smart routing, NLB for extreme-performance TCP/UDP, CLB the legacy option.',
    difficulty: 'intermediate',
    category: 'networking',
    keyPoints: [
      'ALB (Application Load Balancer): Layer 7 (HTTP/HTTPS) , content-based routing by path/host/header, ideal for microservices and containers. The default modern choice for web apps.',
      'NLB (Network Load Balancer): Layer 4 (TCP/UDP) , ultra-low latency and millions of requests/sec, static IPs. For high-performance, gaming, IoT, non-HTTP protocols.',
      'CLB (Classic): the legacy Layer 4/7 balancer , avoid for new work, prefer ALB/NLB.',
      'All of them: spread traffic across healthy targets in multiple AZs, run health checks to drop unhealthy instances, and give clients one stable endpoint. Pair with an Auto Scaling Group.'
    ]
  },
  {
    id: 'aws-route53',
    title: 'Route 53: DNS & Traffic Routing',
    summary: 'AWS’s managed DNS , resolves domains to resources and routes traffic with policies (latency, geo, weighted, failover) plus health checks for automatic failover.',
    difficulty: 'intermediate',
    category: 'networking',
    keyPoints: [
      'Hosted zones hold your DNS records (A, AAAA, CNAME, MX, TXT, and AWS "alias" records that point at ELB/CloudFront/S3).',
      'Routing policies: Simple, Weighted (split traffic %, e.g. canary/blue-green), Latency-based (send users to the lowest-latency Region), Geolocation, and Failover.',
      'Health checks + Failover routing = automatic DNS failover , if the primary endpoint is unhealthy, Route 53 stops returning it and sends traffic to the standby.',
      'Central to multi-Region architectures , it’s the global traffic director in front of regional stacks.'
    ]
  },
  {
    id: 'aws-cloudfront',
    title: 'CloudFront: CDN',
    summary: 'A content delivery network that caches content at edge locations near users , lower latency, less origin load, plus DDoS/WAF protection at the edge.',
    difficulty: 'basic',
    category: 'networking',
    keyPoints: [
      'Requests are routed to the nearest edge location; if the content is cached there it’s served instantly, otherwise CloudFront fetches from the origin (S3, ALB, or any HTTP server) and caches it for the next user.',
      'Cuts latency for global users and offloads traffic from the origin , the origin only sees cache misses.',
      'Security bonus: it sits at the edge, so it’s a natural place to attach AWS WAF (request filtering) and it absorbs DDoS via AWS Shield.',
      'Classic pairing: static assets in a private S3 bucket, served publicly only through CloudFront (Origin Access Control), so the bucket itself stays private.'
    ]
  },

  // ─── MESSAGING ────────────────────────────────────────────────────────────────
  {
    id: 'aws-sqs-sns-kinesis',
    title: 'SQS vs SNS vs Kinesis',
    summary: 'SQS = point-to-point queue (one consumer per message); SNS = pub/sub fan-out (broadcast to many); Kinesis = ordered, replayable streaming for real-time analytics.',
    difficulty: 'intermediate',
    category: 'messaging',
    keyPoints: [
      'SQS (Simple Queue Service): a durable queue for decoupling producers from consumers , a message is processed by one consumer and then deleted. Use for reliable async task processing (order processing, job queues).',
      'SNS (Simple Notification Service): pub/sub , publish one message and fan it out to many subscribers (Lambdas, SQS queues, HTTP endpoints, email/SMS). Use for broadcast/notifications.',
      'Kinesis: real-time streaming of high-volume data , ordered records, multiple consumers can read the same stream, and records are replayable within the retention window. Use for real-time analytics, clickstreams, IoT ingestion.',
      'The "SNS + SQS fan-out" pattern is common: SNS publishes to multiple SQS queues so several independent consumers each get their own durable copy.'
    ],
    gotcha:
      'The distinction interviewers want: SQS deletes a message once it’s consumed (not replayable, one consumer); Kinesis retains records so multiple consumers can read and re-read the stream. Reaching for SQS when you actually need replay/multiple-readers (or Kinesis when a simple queue would do) is the common mistake.'
  },

  // ─── MONITORING ───────────────────────────────────────────────────────────────
  {
    id: 'aws-cloudwatch',
    title: 'CloudWatch: Metrics, Logs, Alarms',
    summary: 'The observability service , collects metrics and logs, triggers alarms (→ SNS/Auto Scaling), and surfaces it all on dashboards.',
    difficulty: 'basic',
    category: 'monitoring',
    keyPoints: [
      'Metrics: CPU, network, disk, and per-service metrics out of the box; custom metrics and richer OS metrics (memory, disk usage) via the CloudWatch agent.',
      'Logs: centralize application and system logs; metric filters turn log patterns (e.g. "ERROR" count) into metrics you can alarm on.',
      'Alarms: fire when a metric crosses a threshold , notify via SNS (email/PagerDuty), or trigger an action like an Auto Scaling policy or a Lambda.',
      'Dashboards give a unified real-time view; for request-level tracing across services, add X-Ray.'
    ]
  },
  {
    id: 'aws-cloudtrail-vs-cloudwatch',
    title: 'CloudTrail vs CloudWatch vs X-Ray',
    summary: 'CloudTrail = who did what (API audit log); CloudWatch = how is it performing (metrics/logs/alarms); X-Ray = where is the latency (distributed request tracing).',
    difficulty: 'intermediate',
    category: 'monitoring',
    prerequisites: ['aws-cloudwatch'],
    keyPoints: [
      'CloudTrail: records every AWS API call (who, what, when, from where) , the security/audit and compliance trail. Answers "who deleted that bucket?".',
      'CloudWatch: operational metrics, logs, and alarms , the health/performance monitor. Answers "is CPU high, are there errors?".',
      'X-Ray: traces a single request as it flows through multiple services/Lambdas , pinpoints which hop is slow. Answers "where is the latency in this request?".',
      'They’re complementary layers , a full picture of a production issue often uses all three.'
    ]
  },

  // ─── DEVOPS / IaC ─────────────────────────────────────────────────────────────
  {
    id: 'aws-iac',
    title: 'Infrastructure as Code: CloudFormation, CDK & Terraform',
    summary: 'Define infrastructure in version-controlled code for repeatable, auditable deployments , CloudFormation (AWS-native templates), CDK (real programming languages), Terraform (multi-cloud).',
    difficulty: 'intermediate',
    category: 'devops',
    keyPoints: [
      'CloudFormation: AWS-native, declarative YAML/JSON templates that provision "stacks" of resources , deep AWS integration, automatic rollback to the last stable state on a failed create/update.',
      'AWS CDK: define infrastructure in TypeScript/Python/etc. and synthesize it to CloudFormation , loops, conditionals, and abstraction from a real language, best for complex/dynamic setups.',
      'Terraform: vendor-agnostic HCL that manages AWS AND other clouds/providers , pick it for multi-cloud or if it’s already your standard.',
      'The shared payoff: version control, code review, repeatable environments, and no more click-ops drift. Wire IaC changes through CI/CD like application code.'
    ],
    gotcha:
      'The choice is mostly scope: CloudFormation/CDK for AWS-only, Terraform for multi-cloud , not a capability gap. CDK isn’t a separate engine, it compiles down to CloudFormation.'
  },
  {
    id: 'aws-cicd',
    title: 'CI/CD on AWS: CodePipeline, CodeBuild, CodeDeploy',
    summary: 'AWS’s native pipeline trio , CodePipeline orchestrates, CodeBuild compiles/tests, CodeDeploy ships to EC2/ECS/Lambda, with blue-green or rolling strategies.',
    difficulty: 'intermediate',
    category: 'devops',
    prerequisites: ['aws-iac'],
    keyPoints: [
      'CodePipeline: the orchestrator , triggers on a source change (CodeCommit/GitHub/S3) and moves the build through stages.',
      'CodeBuild: runs the build/test steps defined in a buildspec.yml , compile, run unit/integration tests, produce artifacts.',
      'CodeDeploy: deploys artifacts to EC2, ECS, or Lambda using an appspec file , supports rolling and blue/green deployments and automatic rollback on failure.',
      'Often integrated with third-party tools (Jenkins, SonarQube) and paired with CloudFormation/CDK so infrastructure changes deploy through the same pipeline.'
    ]
  },

  // ─── ARCHITECTURE ─────────────────────────────────────────────────────────────
  {
    id: 'aws-ha-architecture',
    title: 'Designing a Highly Available Web App',
    summary: 'The reference AWS architecture , ELB → Auto Scaling Group across AZs → Multi-AZ RDS, with ElastiCache, S3 + CloudFront, and CloudWatch tying it together.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['aws-auto-scaling', 'aws-elb-types', 'aws-rds-management'],
    keyPoints: [
      'Front with an ELB distributing across EC2 instances in an Auto Scaling Group that spans ≥2 AZs , no single instance or AZ is a point of failure.',
      'Database: RDS Multi-AZ (automatic failover) or DynamoDB (inherently multi-AZ) for the data tier.',
      'Add ElastiCache (Redis/Memcached) to absorb read load off the database, and serve static assets from S3 behind CloudFront to cut latency and origin load.',
      'Operate it with CloudWatch monitoring/alarms and define the whole thing in IaC (CloudFormation/CDK/Terraform).',
      'Design tradeoffs to name: cost vs. availability vs. complexity , more AZs/Regions and more redundancy cost more and add operational complexity.'
    ]
  },
  {
    id: 'aws-disaster-recovery',
    title: 'Disaster Recovery Strategies',
    summary: 'Four DR patterns trading cost for recovery speed , Backup & Restore, Pilot Light, Warm Standby, and Active-Active (Multi-Site), chosen by your RTO/RPO.',
    difficulty: 'advanced',
    category: 'architecture',
    prerequisites: ['aws-ha-architecture'],
    keyPoints: [
      'RTO (Recovery Time Objective) = how fast you must be back up; RPO (Recovery Point Objective) = how much data loss you can tolerate , these drive the strategy choice.',
      'Backup & Restore: cheapest, slowest , restore from backups/snapshots in another Region after a disaster. High RTO.',
      'Pilot Light: keep a minimal core (e.g. replicated database) always running in the DR Region; spin up the rest on failover , lower RTO, moderate cost.',
      'Warm Standby: a scaled-down but fully functional copy always running, scaled up on failover , low RTO, higher cost.',
      'Active-Active (Multi-Site): full capacity running in multiple Regions simultaneously, traffic split via Route 53 , near-zero RTO/RPO, highest cost.',
      'Enablers: S3 Cross-Region Replication, DynamoDB Global Tables, RDS cross-region replicas, Route 53 failover, and IaC to rebuild the stack in another Region.'
    ]
  },
  {
    id: 'aws-cost-optimization',
    title: 'Cost Optimization Strategies',
    summary: 'Right-size, commit for discounts, use Spot for interruptible work, tier storage, auto-scale, and delete the forgotten , the standard AWS cost-cutting playbook.',
    difficulty: 'intermediate',
    category: 'cost',
    prerequisites: ['aws-pricing-models'],
    keyPoints: [
      'Right-size: use Cost Explorer and Compute Optimizer to find over-provisioned instances and shrink them.',
      'Commit: Reserved Instances / Savings Plans for the steady baseline; Spot Instances for fault-tolerant, interruptible workloads (batch, CI).',
      'Storage: S3 lifecycle policies to tier cold data down to IA/Glacier; delete old snapshots and unattached EBS volumes.',
      'Elasticity: auto-scaling so you’re not paying for peak capacity 24/7; Fargate/Lambda to pay only for actual usage.',
      'Govern it: tag resources for cost attribution, set AWS Budgets alerts, and act on Trusted Advisor / Cost Anomaly Detection findings , the biggest savings are usually idle/orphaned resources nobody remembers.'
    ]
  }
];
