import type { AwsQuizQuestion } from './aws-quiz';

// AWS Certified Solutions Architect - Associate (SAA-C03) quiz, covering all four domains.
// Scenario-style "design a solution" questions, matching the exam's own style, grounded in the
// task statements/skills already sourced from the official exam guide (see aws-certifications.ts).
export const awsSaaQuiz: AwsQuizQuestion[] = [
  // ─── Domain 1: Design Secure Architectures (30%) ───────────────────────────────
  {
    id: 'aws-q-saa-sec-cross-account-role',
    question:
      'A company has a central security account that needs read-only access to resources in 10 other AWS accounts within the same AWS Organization. What is the MOST secure and scalable way to grant this access?',
    options: [
      'Create an IAM role in each account with a trust policy allowing the security account to assume it, and grant that role the necessary permissions',
      'Create an IAM user in each account and share the credentials with the security team',
      'Make all resources public',
      "Use each account's root user credentials"
    ],
    correctIndex: 0,
    explanation:
      'Cross-account IAM roles (assumed via AWS STS) are the standard, secure, scalable pattern for cross-account access — no shared long-lived credentials, and access can be revoked centrally by removing the trust relationship.',
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-scp',
    question:
      'A company wants to prevent any account in its AWS Organization from disabling AWS CloudTrail, regardless of what IAM permissions an administrator in that account has. What should it use?',
    options: ['A service control policy (SCP) in AWS Organizations', 'An IAM permissions boundary', 'A resource-based policy on CloudTrail', 'An S3 bucket policy'],
    correctIndex: 0,
    explanation:
      "SCPs set the maximum available permissions across accounts in an OU/Organization — even an account's own administrators cannot exceed them, making SCPs the right tool for org-wide guardrails like this.",
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-federation',
    question:
      'A large enterprise has thousands of employees in an on-premises Microsoft Active Directory and wants them to assume IAM roles in AWS without creating individual IAM users for each employee. What should the company implement?',
    options: [
      'Federation between the corporate directory and IAM using SAML 2.0 or AWS IAM Identity Center',
      'Create one IAM user per employee',
      'Share a single IAM user across the whole company',
      'Make all S3 buckets public'
    ],
    correctIndex: 0,
    explanation:
      'Federating an existing identity provider (via SAML or IAM Identity Center) lets employees assume roles using their existing corporate credentials, avoiding the operational burden and risk of thousands of individual IAM users.',
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-rbac-multi',
    question: 'Which TWO of the following are examples of designing a role-based access control strategy? (Select TWO.)',
    options: [
      'Using AWS STS to issue temporary credentials when assuming a role',
      'Enabling cross-account role switching for federated users',
      'Sharing the root user password across the team',
      'Making all IAM policies identical for every user',
      'Publishing all IAM policies to a public S3 bucket'
    ],
    correctIndexes: [0, 1],
    explanation:
      'AWS STS-issued temporary credentials and cross-account role switching are core role-based access control mechanisms; sharing root credentials and applying identical broad policies both violate least privilege.',
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-nat-gateway',
    question:
      "A company's private EC2 instances need outbound internet access to download software updates but must not be reachable from the internet. Which component allows this?",
    options: ['A NAT gateway in a public subnet', 'An internet gateway attached directly to the private subnet', 'A network ACL allowing all inbound traffic', 'Making the instances public'],
    correctIndex: 0,
    explanation:
      'A NAT gateway, placed in a public subnet, lets private-subnet instances initiate outbound connections to the internet while remaining unreachable from it — the standard "private egress-only" pattern.',
    category: 'Secure Workloads & Networking'
  },
  {
    id: 'aws-q-saa-sec-subnet-placement',
    question: 'In a standard three-tier web architecture, where should the database tier typically be placed?',
    options: [
      'In a private subnet with no direct route to an internet gateway',
      'In a public subnet with a public IP address',
      'Outside the VPC entirely',
      'In the same subnet as the internet-facing load balancer'
    ],
    correctIndex: 0,
    explanation: "Databases hold the most sensitive data and rarely need direct internet access, so they're placed in private subnets, reachable only from the application tier.",
    category: 'Secure Workloads & Networking'
  },
  {
    id: 'aws-q-saa-sec-waf-shield',
    question:
      'An application is receiving malicious HTTP requests attempting SQL injection, alongside a separate large-scale network-layer flood attack. Which combination of services addresses BOTH threats?',
    options: [
      'AWS WAF (application-layer filtering) and AWS Shield (DDoS protection)',
      'Amazon GuardDuty and Amazon Inspector only',
      'AWS KMS and AWS Secrets Manager',
      'Amazon Route 53 alone'
    ],
    correctIndex: 0,
    explanation: 'WAF filters Layer 7 attacks like SQL injection; Shield protects against Layer 3/4 DDoS floods — together they cover both threat types described.',
    category: 'Secure Workloads & Networking'
  },
  {
    id: 'aws-q-saa-sec-secrets-runtime',
    question: 'An application running on Lambda needs a database password. What is the AWS-recommended way to supply it, avoiding hardcoded credentials?',
    options: ['Retrieve it at runtime from AWS Secrets Manager', 'Hardcode it in the Lambda function code', 'Store it in a public S3 bucket', 'Pass it as a plaintext query string parameter'],
    correctIndex: 0,
    explanation:
      'Secrets Manager centrally stores and can automatically rotate credentials, which the function retrieves via the SDK at runtime — avoiding hardcoded secrets and manual rotation.',
    category: 'Secure Workloads & Networking'
  },
  {
    id: 'aws-q-saa-sec-dx-vpn-failover',
    question:
      'A company needs its AWS Direct Connect connection to be resilient — if the dedicated connection fails, traffic should automatically fail over to an encrypted path over the internet. What should it add alongside Direct Connect?',
    options: ['A Site-to-Site VPN as a backup path', 'A second unencrypted internet connection', 'Nothing — Direct Connect never fails', 'Amazon CloudFront'],
    correctIndex: 0,
    explanation:
      'A common resilience pattern pairs Direct Connect with a Site-to-Site VPN as failover — if the dedicated line goes down, traffic can route over the encrypted VPN tunnel instead.',
    category: 'Secure Workloads & Networking'
  },
  {
    id: 'aws-q-saa-sec-segmentation',
    question: 'What networking strategy exposes only what needs to be internet-facing while isolating everything else?',
    options: [
      'Placing the web tier in public subnets and the application/database tiers in private subnets',
      'Placing all tiers in the same public subnet',
      "Disabling the VPC's route table",
      'Removing all security groups'
    ],
    correctIndex: 0,
    explanation:
      "Network segmentation using public and private subnets, each with different route table configurations, is the standard way to expose only what needs to be internet-facing.",
    category: 'Secure Workloads & Networking'
  },
  {
    id: 'aws-q-saa-sec-kms-rest',
    question: 'A company must encrypt data stored in Amazon RDS and control which IAM principals can use the encryption key. Which service provides this?',
    options: ['AWS KMS', 'AWS Certificate Manager', 'Amazon Cognito', 'AWS Direct Connect'],
    correctIndex: 0,
    explanation: 'KMS creates and manages the encryption keys used by RDS (and other services) for encryption at rest, with key policies controlling exactly who can use each key.',
    category: 'Data Security'
  },
  {
    id: 'aws-q-saa-sec-acm-tls',
    question:
      'A company wants to encrypt traffic between its users and its Application Load Balancer using a free, AWS-managed SSL/TLS certificate that renews automatically. Which service should it use?',
    options: ['AWS Certificate Manager (ACM)', 'AWS KMS', 'AWS Secrets Manager', 'Amazon Inspector'],
    correctIndex: 0,
    explanation: 'ACM provisions and automatically renews public TLS certificates for use with services like ALB and CloudFront, at no additional cost for the certificate itself.',
    category: 'Data Security'
  },
  {
    id: 'aws-q-saa-sec-backup-dr-multi',
    question: 'Which TWO of the following help implement data backup and disaster recovery for critical workloads? (Select TWO.)',
    options: ['AWS Backup', 'Cross-Region read replicas or snapshots', 'Deleting old CloudTrail logs', 'Disabling Multi-AZ on the database', 'Turning off all monitoring alarms'],
    correctIndexes: [0, 1],
    explanation:
      'AWS Backup centralizes and automates backup policies; cross-Region replicas/snapshots protect against a Region-level failure. The other options actively reduce resilience.',
    category: 'Data Security'
  },
  {
    id: 'aws-q-saa-sec-resource-policy',
    question:
      'A company wants to allow a specific external AWS account to invoke its Lambda function, without creating an IAM user or role for that external account. What should it use?',
    options: ['A resource-based policy on the Lambda function', "An identity-based policy on the external account's IAM user", 'A VPC security group', 'A network ACL'],
    correctIndex: 0,
    explanation:
      "Lambda supports resource-based policies (like S3 bucket policies) that can directly grant another AWS account permission to invoke the function — no need to create identities for the external account.",
    category: 'Data Security'
  },
  {
    id: 'aws-q-saa-sec-key-rotation',
    question:
      "Which AWS KMS feature reduces the operational burden of periodically changing a key's cryptographic material without needing to manually re-encrypt existing data or update application configuration?",
    options: ['Automatic key rotation', 'Manual key deletion', 'Cross-Region replication', 'IAM policy versioning'],
    correctIndex: 0,
    explanation:
      "KMS can automatically rotate the backing cryptographic material for a key on a schedule while keeping the same key ID, so applications don't need any changes and old data remains decryptable.",
    category: 'Data Security'
  },
  {
    id: 'aws-q-saa-sec-control-tower',
    question:
      'A company is setting up a new AWS multi-account environment and wants an automated way to enforce account baselines, guardrails, and governance across all accounts as they are created. Which service is designed for this?',
    options: ['AWS Control Tower', 'Amazon Route 53', 'AWS Direct Connect', 'Amazon CloudFront'],
    correctIndex: 0,
    explanation:
      'Control Tower automates setting up a well-architected multi-account environment with guardrails (built on AWS Organizations and SCPs), simplifying governance at scale.',
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-mfa-root',
    question: 'Which of the following is an AWS-recommended security best practice for the AWS account root user?',
    options: [
      'Enable multi-factor authentication (MFA) and avoid using it for everyday tasks',
      'Use the root user for all daily administrative tasks',
      'Share the root user password with the whole team',
      'Disable MFA to simplify sign-in'
    ],
    correctIndex: 0,
    explanation:
      'AWS recommends securing the root user with MFA, not generating access keys for it, and using IAM roles/users with least privilege for day-to-day work instead.',
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-permissions-boundary',
    question:
      "A company wants to delegate the ability to create IAM users to a team lead, while ensuring that lead can never grant those new users more permissions than a defined maximum, no matter what policy they attach. What IAM feature achieves this?",
    options: ['A permissions boundary', 'A resource-based policy', 'A security group', 'A route table'],
    correctIndex: 0,
    explanation:
      'A permissions boundary sets the maximum permissions an IAM entity can have, capping what a delegated administrator can grant even if they attach an overly broad policy.',
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-multi-account-multi',
    question: 'Which TWO of the following are valid reasons to use multiple AWS accounts instead of one? (Select TWO.)',
    options: [
      'Isolating workloads for security and blast-radius reduction',
      'Separating billing and cost tracking per team or project',
      'Making IAM entirely unnecessary',
      'Eliminating the need for a VPC',
      'Guaranteeing zero cost for all workloads'
    ],
    correctIndexes: [0, 1],
    explanation: 'Multi-account strategies are commonly used for security isolation and cost separation. IAM and VPCs are still needed within each account.',
    category: 'Secure Access'
  },
  {
    id: 'aws-q-saa-sec-data-classification',
    question: 'Before designing encryption and access controls for a new workload, what should a company do first to determine the appropriate level of protection needed?',
    options: [
      'Classify the data based on sensitivity and compliance requirements',
      'Immediately encrypt everything with the same key regardless of sensitivity',
      'Skip data classification to save time',
      'Make all data public by default'
    ],
    correctIndex: 0,
    explanation: 'Data classification determines the appropriate controls — not all data needs the same encryption, access, or retention treatment, and skipping it risks over- or under-protecting data.',
    category: 'Data Security'
  },

  // ─── Domain 2: Design Resilient Architectures (26%) ────────────────────────────
  {
    id: 'aws-q-saa-res-sqs-decouple',
    question:
      'An order-processing application experiences occasional traffic spikes that overwhelm the backend processing service and cause dropped requests. Which service helps decouple the frontend from the backend and buffer requests during spikes?',
    options: ['Amazon SQS', 'Amazon Route 53', 'AWS Direct Connect', 'Amazon CloudFront'],
    correctIndex: 0,
    explanation: 'SQS lets the frontend enqueue requests durably while the backend consumes them at its own pace, decoupling producers and consumers and absorbing traffic spikes.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-multi-tier',
    question:
      'Which architecture pattern separates an application into independent layers (for example, presentation, application logic, and data), each of which can scale independently?',
    options: ['Multi-tier architecture', 'Monolithic architecture', 'Single-instance architecture', 'Manual scaling architecture'],
    correctIndex: 0,
    explanation: 'Multi-tier architectures split responsibilities into layers that can each be scaled, deployed, and secured independently — a foundational resilient-design pattern.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-horizontal-scaling',
    question: 'A company wants to handle increased load by adding more EC2 instances behind a load balancer, rather than making a single instance bigger. What scaling approach is this?',
    options: ['Horizontal scaling', 'Vertical scaling', 'No scaling', 'Manual scaling only'],
    correctIndex: 0,
    explanation: 'Horizontal scaling (scaling out) adds more instances to distribute load; vertical scaling (scaling up) increases the size/capacity of a single instance.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-containers',
    question:
      'A company is migrating a monolithic application into smaller, independently deployable services and wants a consistent, portable runtime environment across development and production. Which technology is well suited for this?',
    options: ['Containers (for example, via Amazon ECS or EKS)', 'A single large EC2 instance', 'Amazon S3', 'AWS Direct Connect'],
    correctIndex: 0,
    explanation: 'Containers package an application with its dependencies for consistent behavior across environments, and pair naturally with a microservices migration.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-serverless-pattern',
    question:
      'A company has an event-driven workload that runs infrequently and unpredictably, and wants to avoid paying for idle compute capacity between invocations. Which approach fits best?',
    options: ['AWS Lambda (serverless)', 'A fleet of always-on EC2 instances', 'A single large Reserved Instance', 'On-premises servers'],
    correctIndex: 0,
    explanation:
      'Lambda only charges for actual invocation time, making it ideal for infrequent, unpredictable, event-driven workloads where always-on compute would waste money.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-step-functions',
    question:
      "A company needs to orchestrate a multi-step business process involving several Lambda functions, with retries, error handling, and visual tracking of each step's state. Which service is designed for this?",
    options: ['AWS Step Functions', 'Amazon SQS', 'Amazon SNS', 'AWS Direct Connect'],
    correctIndex: 0,
    explanation:
      'Step Functions is a workflow orchestration service purpose-built for coordinating multiple steps (including Lambda functions) with built-in retry logic and state visualization.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-event-driven',
    question:
      'A company wants services in its architecture to react automatically to state changes (for example, a new file uploaded to S3 triggering downstream processing) without polling for changes. What architecture pattern does this describe?',
    options: ['Event-driven architecture', 'Batch processing', 'Manual triggering', 'Synchronous request-response only'],
    correctIndex: 0,
    explanation:
      'Event-driven architectures react to events (like an S3 upload) as they happen, typically via services like EventBridge, SNS, or S3 event notifications, avoiding inefficient polling.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-loose-coupling-multi',
    question: 'Which TWO of the following AWS services are commonly used to achieve loose coupling between application components? (Select TWO.)',
    options: ['Amazon SQS', 'Amazon SNS', 'Amazon EC2 Auto Scaling', 'AWS Direct Connect', 'AWS Certificate Manager'],
    correctIndexes: [0, 1],
    explanation:
      'SQS (queuing) and SNS (pub/sub) are the classic building blocks for decoupling producers and consumers so components can scale, fail, and deploy independently.',
    category: 'Scalable & Loosely Coupled'
  },
  {
    id: 'aws-q-saa-res-multi-az-rds',
    question:
      'A company wants its Amazon RDS database to automatically fail over to a standby replica in a different Availability Zone if the primary instance fails, with minimal manual intervention. What feature should it enable?',
    options: ['Multi-AZ deployment', 'Read replicas only', 'A larger instance size', 'Disabling backups'],
    correctIndex: 0,
    explanation:
      'RDS Multi-AZ maintains a synchronously replicated standby in another AZ and automatically fails over to it if the primary fails — the standard HA feature for RDS.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-spof',
    question: "A company's architecture has a single EC2 instance running a critical application with no load balancer or redundancy. What is the PRIMARY risk with this design?",
    options: [
      'It has a single point of failure — if that instance fails, the application becomes unavailable',
      'It is too expensive',
      'It cannot be encrypted',
      'It cannot use IAM roles'
    ],
    correctIndex: 0,
    explanation: 'A single, non-redundant instance is a classic single point of failure — any interruption to that one instance takes the whole application down.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-dr-strategies-multi',
    question: 'Which TWO of the following are recognized AWS disaster recovery (DR) strategies, alongside pilot light and warm standby? (Select TWO.)',
    options: ['Backup and restore', 'Multi-site active-active', 'Manually copying files to a USB drive', 'Disabling all backups to save cost', 'Deleting the DR Region entirely'],
    correctIndexes: [0, 1],
    explanation:
      'Backup and restore (lowest cost, longest RTO) and multi-site active-active (highest cost, near-zero RTO/RPO) are both recognized DR strategies, along with pilot light and warm standby in between.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-rpo',
    question: 'A company defines the maximum acceptable amount of data loss, measured in time, that it can tolerate during a disaster. What is this metric called?',
    options: ['Recovery Point Objective (RPO)', 'Recovery Time Objective (RTO)', 'Service Level Agreement (SLA)', 'Total Cost of Ownership (TCO)'],
    correctIndex: 0,
    explanation:
      'RPO measures acceptable data loss (how far back you can lose data to); RTO measures acceptable downtime (how long recovery can take) — a frequently tested distinction.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-rto',
    question: 'A company defines the maximum acceptable length of time an application can be down after a disaster before it must be restored. What is this metric called?',
    options: ['Recovery Time Objective (RTO)', 'Recovery Point Objective (RPO)', 'Mean Time Between Failures (MTBF)', 'Service Level Agreement (SLA)'],
    correctIndex: 0,
    explanation: 'RTO is the target duration for restoring service after a disruption — paired with RPO (acceptable data loss) to define DR requirements.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-elb-multi-az',
    question: 'A company deploys EC2 instances across three Availability Zones behind an Application Load Balancer. What resilience benefit does this design provide?',
    options: [
      'If one Availability Zone becomes unavailable, the load balancer continues routing traffic to healthy instances in the remaining AZs',
      'It guarantees the application will never have any downtime',
      'It removes the need for Auto Scaling',
      'It eliminates all AWS costs'
    ],
    correctIndex: 0,
    explanation:
      "Distributing instances across multiple AZs behind a load balancer means the loss of one AZ doesn't take down the whole application — traffic continues to healthy instances elsewhere.",
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-legacy-app',
    question: 'A company has a legacy, monolithic application that cannot be re-architected but needs improved reliability without code changes. Which approach could help?',
    options: [
      'Placing it behind an Elastic Load Balancer with multiple instances across Availability Zones',
      'Rewriting the entire application before making any infrastructure changes',
      'Running it only on a single instance to keep things simple',
      'Removing all monitoring to reduce cost'
    ],
    correctIndex: 0,
    explanation:
      'Even without code changes, infrastructure-level improvements (load balancing, multi-AZ redundancy, health checks) can meaningfully improve the reliability of legacy applications.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-durability-availability',
    question: "Amazon S3 Standard is designed for 99.999999999% (11 nines) durability. What does 'durability' specifically refer to in this context?",
    options: ['The likelihood that stored data will not be lost', 'The percentage of time the service is reachable', 'The speed of data retrieval', 'The cost of storing the data'],
    correctIndex: 0,
    explanation:
      'Durability is about data not being lost (integrity over time); availability is about the service being reachable when needed — a commonly confused pair on the exam.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-warm-standby',
    question:
      'A company wants a DR strategy where a scaled-down but fully functional copy of the environment always runs in a second Region, ready to be scaled up quickly if the primary Region fails. Which DR strategy does this describe?',
    options: ['Warm standby', 'Backup and restore', 'Pilot light', 'Multi-site active-active'],
    correctIndex: 0,
    explanation:
      'Warm standby keeps a scaled-down, running version of the full environment ready in the DR Region — faster recovery than pilot light, cheaper than full active-active.',
    category: 'High Availability & Fault Tolerance'
  },
  {
    id: 'aws-q-saa-res-pilot-light',
    question:
      'A company wants a cost-effective DR strategy where only the most critical core infrastructure (like a replicated database) runs continuously in the DR Region, with the rest of the environment provisioned only when a disaster is declared. Which strategy does this describe?',
    options: ['Pilot light', 'Warm standby', 'Multi-site active-active', 'Doing nothing'],
    correctIndex: 0,
    explanation:
      'Pilot light keeps only the critical core (for example, a database) running/replicated, with the remaining infrastructure defined as templates and launched on demand — cheaper than warm standby but with a longer RTO.',
    category: 'High Availability & Fault Tolerance'
  },

  // ─── Domain 3: Design High-Performing Architectures (24%) ──────────────────────
  {
    id: 'aws-q-saa-hp-storage-io',
    question: 'A workload requires the highest possible IOPS for a database running on EC2. Which EBS volume type should it use?',
    options: ['Provisioned IOPS SSD (io1/io2)', 'S3 Standard', 'Cold HDD (sc1)', 'Throughput Optimized HDD (st1)'],
    correctIndex: 0,
    explanation:
      'Provisioned IOPS SSD volumes are purpose-built for I/O-intensive workloads needing consistent, high IOPS — the other options are optimized for throughput or infrequent access, not peak IOPS.',
    category: 'High-Performing Storage'
  },
  {
    id: 'aws-q-saa-hp-storage-scale',
    question: 'An application needs object storage that can scale to virtually unlimited capacity without the customer provisioning storage in advance. Which service fits?',
    options: ['Amazon S3', 'Amazon EBS', 'Instance store', 'On-premises SAN'],
    correctIndex: 0,
    explanation:
      'S3 scales automatically and virtually without limit — no capacity planning or provisioning required, unlike block storage volumes which have a fixed provisioned size.',
    category: 'High-Performing Storage'
  },
  {
    id: 'aws-q-saa-hp-decouple-scale',
    question:
      'A three-tier application currently scales as a single unit, meaning the whole stack must be resized even if only the web tier needs more capacity. What change would let each tier scale independently?',
    options: ['Decoupling the tiers with queues/load balancers so each can scale on its own', 'Combining all tiers onto a single EC2 instance', 'Removing Auto Scaling entirely', 'Disabling health checks'],
    correctIndex: 0,
    explanation:
      'Decoupling tiers (via queues, load balancers, or separate Auto Scaling Groups) lets each layer scale independently based on its own load, avoiding wasteful whole-stack scaling.',
    category: 'High-Performing Compute'
  },
  {
    id: 'aws-q-saa-hp-scaling-metrics',
    question: "A company wants its Auto Scaling group to add instances automatically when average CPU utilization exceeds 70%. What should it configure?",
    options: ['A target tracking scaling policy based on CPU utilization', 'A fixed number of instances that never changes', 'Manual scaling only', 'Disabling CloudWatch alarms'],
    correctIndex: 0,
    explanation:
      'Target tracking scaling policies automatically adjust capacity to maintain a target metric value (like 70% CPU), triggered by CloudWatch alarms behind the scenes.',
    category: 'High-Performing Compute'
  },
  {
    id: 'aws-q-saa-hp-ec2-instance-selection',
    question: 'A machine learning training workload needs GPU acceleration. Which EC2 instance family should the company select?',
    options: ['Accelerated computing (GPU) instances', 'General purpose instances', 'Storage optimized instances', 'Memory optimized instances'],
    correctIndex: 0,
    explanation:
      'Accelerated computing instances include GPU/FPGA hardware suited to ML training and other parallelizable workloads — general purpose instances lack this specialized hardware.',
    category: 'High-Performing Compute'
  },
  {
    id: 'aws-q-saa-hp-lambda-memory',
    question:
      "A Lambda function's execution time is limited by insufficient CPU power. Since Lambda doesn't let you configure CPU directly, what setting should be increased to improve performance?",
    options: ['The allocated memory (which scales CPU proportionally)', 'The timeout only', 'The number of concurrent executions', "The IAM role's permissions"],
    correctIndex: 0,
    explanation:
      "Lambda allocates CPU power proportionally to the configured memory — increasing memory is the standard way to improve a CPU-bound function's performance, even if it doesn't need the extra RAM itself.",
    category: 'High-Performing Compute'
  },
  {
    id: 'aws-q-saa-hp-read-replicas',
    question: 'A read-heavy application is bottlenecked by too many read queries against a single RDS instance. What should the company add to scale read capacity?',
    options: ['RDS read replicas', 'More write capacity on the primary', 'A second unrelated database engine', 'Disabling Multi-AZ'],
    correctIndex: 0,
    explanation: 'Read replicas offload read traffic from the primary instance, letting read-heavy workloads scale horizontally without impacting write performance.',
    category: 'High-Performing Database'
  },
  {
    id: 'aws-q-saa-hp-aurora',
    question:
      "A company is migrating a PostgreSQL-compatible application and wants AWS's cloud-native relational database with significantly higher throughput than standard managed PostgreSQL. Which service should it choose?",
    options: ['Amazon Aurora (PostgreSQL-compatible)', 'Amazon DynamoDB', 'Amazon Neptune', 'Amazon Redshift'],
    correctIndex: 0,
    explanation:
      "Aurora is AWS's cloud-native relational engine, compatible with MySQL or PostgreSQL, offering significantly higher throughput than standard managed PostgreSQL on RDS.",
    category: 'High-Performing Database'
  },
  {
    id: 'aws-q-saa-hp-caching',
    question:
      'A company wants to reduce read latency for a frequently accessed dataset from milliseconds to microseconds by adding an in-memory layer in front of its database. Which service should it use?',
    options: ['Amazon ElastiCache', 'Amazon S3 Glacier', 'AWS Storage Gateway', 'Amazon Redshift'],
    correctIndex: 0,
    explanation: 'ElastiCache (Redis or Memcached) is an in-memory data store that sits in front of a database, dramatically reducing latency for cached reads.',
    category: 'High-Performing Database'
  },
  {
    id: 'aws-q-saa-hp-nosql-vs-relational',
    question:
      'An application needs to store semi-structured JSON documents with a rapidly changing schema and requires very high write throughput at scale. Which database type is the best fit?',
    options: ['A NoSQL database like Amazon DynamoDB', 'A traditional relational database with a fixed schema', 'A file-based flat storage system', 'A graph database'],
    correctIndex: 0,
    explanation: 'NoSQL databases like DynamoDB handle flexible/changing schemas and scale write throughput horizontally more easily than traditional fixed-schema relational databases.',
    category: 'High-Performing Database'
  },
  {
    id: 'aws-q-saa-hp-cloudfront',
    question: "A company's website serves static images to users worldwide and wants to reduce latency by caching content at locations physically closer to users. Which service should it use?",
    options: ['Amazon CloudFront', 'AWS Direct Connect', 'Amazon Route 53', 'AWS Transit Gateway'],
    correctIndex: 0,
    explanation: "CloudFront is AWS's CDN, caching content at edge locations around the world to reduce latency for end users.",
    category: 'High-Performing Networking'
  },
  {
    id: 'aws-q-saa-hp-global-accelerator',
    question:
      'A company runs an application with endpoints in multiple AWS Regions and wants to route user traffic over the AWS global network to the closest healthy endpoint, using static anycast IP addresses. Which service fits?',
    options: ['AWS Global Accelerator', 'Amazon Route 53 alone', 'AWS Direct Connect', 'Amazon CloudFront alone'],
    correctIndex: 0,
    explanation:
      "Global Accelerator routes traffic over AWS's private global network backbone to the closest healthy endpoint using static IPs — distinct from CloudFront (content caching) and Route 53 (DNS resolution).",
    category: 'High-Performing Networking'
  },
  {
    id: 'aws-q-saa-hp-elb-types',
    question: 'A company needs a load balancer that operates at the application layer (Layer 7), capable of routing based on URL path or hostname. Which type should it use?',
    options: ['Application Load Balancer (ALB)', 'Network Load Balancer (NLB)', 'Gateway Load Balancer', 'Classic Load Balancer only'],
    correctIndex: 0,
    explanation:
      'ALB operates at Layer 7 and supports content-based routing (path/host-based rules); NLB operates at Layer 4 for raw TCP/UDP performance, without this Layer 7 awareness.',
    category: 'High-Performing Networking'
  },
  {
    id: 'aws-q-saa-hp-network-topology-multi',
    question: 'Which TWO of the following are considerations when designing a scalable network topology for a global, multi-Region application? (Select TWO.)',
    options: ['Placement of resources close to users to reduce latency', 'VPC peering or Transit Gateway to connect multiple VPCs', 'Disabling all subnets', 'Removing the VPC entirely', 'Avoiding load balancers to save cost'],
    correctIndexes: [0, 1],
    explanation: 'Latency-aware resource placement and using peering/Transit Gateway to interconnect VPCs are both real considerations for scalable multi-Region network design.',
    category: 'High-Performing Networking'
  },
  {
    id: 'aws-q-saa-hp-kinesis',
    question: 'A company needs to ingest and analyze clickstream data from millions of users in near real time, rather than in scheduled batches. Which service is purpose-built for this?',
    options: ['Amazon Kinesis', 'AWS Snowball', 'Amazon S3 Glacier', 'AWS Backup'],
    correctIndex: 0,
    explanation: 'Kinesis is designed for real-time streaming data ingestion and processing at scale — Snowball and Glacier are for bulk offline transfer and archival, not real-time streams.',
    category: 'Data Ingestion & Transformation'
  },
  {
    id: 'aws-q-saa-hp-emr',
    question: 'A company needs to run large-scale Apache Spark and Hadoop jobs to transform petabytes of data. Which AWS service provides a managed big-data processing cluster for this?',
    options: ['Amazon EMR', 'Amazon Athena', 'AWS Glue', 'Amazon QuickSight'],
    correctIndex: 0,
    explanation:
      'EMR provides managed Hadoop/Spark clusters for large-scale data processing — Athena queries data directly via SQL, Glue is primarily for ETL/cataloging, and QuickSight is for visualization.',
    category: 'Data Ingestion & Transformation'
  },
  {
    id: 'aws-q-saa-hp-glue-etl',
    question:
      'A company wants to automatically discover, catalog, and transform data from multiple sources before loading it into a data warehouse, without managing servers. Which service fits?',
    options: ['AWS Glue', 'Amazon EC2', 'AWS Direct Connect', 'Amazon Route 53'],
    correctIndex: 0,
    explanation:
      'Glue is a serverless ETL and data-catalog service purpose-built for discovering, transforming, and preparing data for analytics — no infrastructure to manage.',
    category: 'Data Ingestion & Transformation'
  },
  {
    id: 'aws-q-saa-hp-data-lake',
    question:
      'A company wants to build a centralized repository that stores structured and unstructured data at any scale, to be analyzed later by multiple different tools (Athena, EMR, SageMaker). What architecture pattern does this describe?',
    options: ['A data lake (commonly built on Amazon S3)', 'A single relational database', 'An on-premises file server', 'A single EC2 instance'],
    correctIndex: 0,
    explanation: 'A data lake, typically built on S3, stores raw data of any type/scale and is designed to be queried by many different downstream analytics/ML tools.',
    category: 'Data Ingestion & Transformation'
  },

  // ─── Domain 4: Design Cost-Optimized Architectures (20%) ───────────────────────
  {
    id: 'aws-q-saa-cost-s3-lifecycle',
    question:
      'A company has objects in S3 that are frequently accessed for 30 days, then rarely accessed after that. What is the MOST cost-effective way to manage this without manual intervention?',
    options: [
      'An S3 Lifecycle policy that transitions objects to a cheaper storage class after 30 days',
      'Manually moving objects every 30 days',
      'Keeping everything in S3 Standard forever',
      'Deleting all objects after 30 days'
    ],
    correctIndex: 0,
    explanation:
      'S3 Lifecycle policies automate the transition of objects between storage classes (or expiration) based on age, minimizing storage cost without any manual work or data loss.',
    category: 'Cost-Optimized Storage'
  },
  {
    id: 'aws-q-saa-cost-intelligent-tiering',
    question: "A company wants the most cost-effective S3 storage class for data with unpredictable, changing access patterns, without manually analyzing and moving objects itself.",
    options: ['S3 Intelligent-Tiering', 'S3 Standard only', 'S3 Glacier Deep Archive only', 'EBS'],
    correctIndex: 0,
    explanation:
      'Intelligent-Tiering automatically moves objects between access tiers based on changing usage patterns, optimizing cost without manual analysis — ideal when access patterns are unpredictable.',
    category: 'Cost-Optimized Storage'
  },
  {
    id: 'aws-q-saa-cost-snowball',
    question:
      'A company needs to migrate 500 TB of data to AWS and has limited internet bandwidth, making an online transfer impractically slow. What is the most cost-effective option?',
    options: [
      'AWS Snowball (physical data transfer device)',
      'Uploading over a slow internet connection for weeks',
      'AWS Direct Connect, provisioned specifically for this one-time transfer',
      'Skipping the migration'
    ],
    correctIndex: 0,
    explanation:
      'Snowball physically ships a storage device to transfer large datasets offline, which is far faster and often cheaper than transferring hundreds of terabytes over limited bandwidth.',
    category: 'Cost-Optimized Storage'
  },
  {
    id: 'aws-q-saa-cost-compute-purchasing-multi',
    question:
      'Which TWO of the following help reduce compute costs for fault-tolerant or predictable workloads without sacrificing needed availability? (Select TWO.)',
    options: [
      'Spot Instances for fault-tolerant, interruptible workloads',
      'Stopping non-production instances on a schedule during idle hours',
      'Running every workload on full-price On-Demand regardless of flexibility',
      'Ignoring cost entirely',
      'Always over-provisioning capacity "just in case"'
    ],
    correctIndexes: [0, 1],
    explanation:
      'Spot Instances and scheduled stop/start both reduce cost for flexible or predictably idle workloads — paying full On-Demand price regardless of flexibility, or over-provisioning, both waste money.',
    category: 'Cost-Optimized Compute'
  },
  {
    id: 'aws-q-saa-cost-savings-plans',
    question:
      'A company has variable compute usage across EC2, Fargate, and Lambda but wants a flexible discount commitment that is not tied to a specific instance family or Region. What should it use?',
    options: ['Compute Savings Plans', 'Standard Reserved Instances', 'Spot Instances only', 'Dedicated Hosts'],
    correctIndex: 0,
    explanation:
      "Compute Savings Plans offer a discount in exchange for a consistent $/hour spend commitment, applying flexibly across instance families, Regions, and compute services — unlike Reserved Instances, which are tied to specific attributes.",
    category: 'Cost-Optimized Compute'
  },
  {
    id: 'aws-q-saa-cost-instance-family',
    question: "A company is running a memory-intensive in-memory workload on a compute-optimized EC2 instance and paying for CPU capacity it doesn't need. What should it do to optimize cost?",
    options: [
      'Switch to a memory-optimized instance family sized appropriately for the workload',
      'Switch to an even larger compute-optimized instance',
      'Do nothing',
      'Move to Spot Instances despite the workload being critical and always-on'
    ],
    correctIndex: 0,
    explanation:
      "Selecting the instance family that matches the workload's actual resource profile (memory-optimized for a memory-bound workload) avoids paying for unused capacity in the wrong dimension.",
    category: 'Cost-Optimized Compute'
  },
  {
    id: 'aws-q-saa-cost-db-migration',
    question: 'A company wants to migrate from a commercially licensed database engine to reduce licensing costs while keeping the data model relational. Which type of migration does this describe?',
    options: ['A heterogeneous migration to an open-source-compatible engine (for example, Aurora PostgreSQL)', 'A homogeneous migration to the exact same engine', 'No migration is possible', 'Moving to Amazon S3'],
    correctIndex: 0,
    explanation:
      'A heterogeneous migration changes the database engine (for example, commercial SQL Server to open-source-compatible Aurora PostgreSQL) — commonly done specifically to reduce licensing costs.',
    category: 'Cost-Optimized Database'
  },
  {
    id: 'aws-q-saa-cost-dynamodb-ondemand',
    question:
      'A company has an application with unpredictable, spiky traffic and wants to pay only for the database read/write capacity it actually consumes, without managing servers or provisioning fixed capacity. Which database mode fits?',
    options: [
      'DynamoDB on-demand capacity mode',
      'RDS with a fixed, always-on large instance',
      'A self-managed database on EC2',
      'Provisioned IOPS with a static, over-provisioned value'
    ],
    correctIndex: 0,
    explanation:
      'DynamoDB on-demand mode charges per request rather than for provisioned throughput, which is more cost-effective for unpredictable or spiky traffic where fixed provisioning would mean paying for unused capacity.',
    category: 'Cost-Optimized Database'
  },
  {
    id: 'aws-q-saa-cost-nat-gateway',
    question:
      'A company runs workloads across three Availability Zones, each with its own NAT gateway, and wants to reduce cost while accepting some risk if that NAT gateway becomes a shared dependency. What change would reduce cost?',
    options: [
      'Using a single shared NAT gateway instead of one per Availability Zone',
      'Adding more NAT gateways',
      'Removing all outbound internet access entirely',
      'Switching to Direct Connect just for this purpose'
    ],
    correctIndex: 0,
    explanation:
      'A single shared NAT gateway costs less than one per AZ, at the cost of that NAT gateway becoming a single point of failure and incurring cross-AZ data transfer charges — a documented cost-vs-resilience trade-off.',
    category: 'Cost-Optimized Networking'
  },
  {
    id: 'aws-q-saa-cost-vpc-endpoint',
    question:
      "A company's EC2 instances in a private subnet frequently access Amazon S3, and it wants to avoid routing that traffic through a NAT gateway (which incurs data processing charges) while keeping the traffic off the public internet. What should it use?",
    options: ['A VPC gateway endpoint for S3', 'A NAT gateway with a larger instance size', 'AWS Direct Connect', 'A public IP address on each instance'],
    correctIndex: 0,
    explanation:
      'VPC gateway endpoints let traffic to S3 (and DynamoDB) stay on the AWS network without traversing a NAT gateway or the internet, avoiding NAT data processing charges entirely.',
    category: 'Cost-Optimized Networking'
  },
  {
    id: 'aws-q-saa-cost-reserved-instance',
    question:
      'A company knows it will run a specific EC2 instance type continuously for the next year and wants the largest possible discount without needing the flexibility to change instance family. What should it use?',
    options: ['A Standard Reserved Instance', 'An On-Demand Instance', 'A Spot Instance', 'Compute Savings Plans'],
    correctIndex: 0,
    explanation:
      'Standard Reserved Instances offer the deepest discount among these options in exchange for committing to a specific instance configuration, trading away flexibility for maximum savings.',
    category: 'Cost-Optimized Compute'
  },
  {
    id: 'aws-q-saa-cost-cur',
    question:
      "A company's finance team wants the most granular, line-item detail of AWS usage and costs, broken down hourly, to feed into their own external cost-analysis tooling. Which AWS resource provides this?",
    options: ['AWS Cost and Usage Report (CUR)', 'AWS Budgets', 'AWS Trusted Advisor', 'The AWS Health Dashboard'],
    correctIndex: 0,
    explanation:
      'The Cost and Usage Report is the most detailed, granular billing dataset AWS provides, suited for ingestion into external analytics/BI tools — Budgets and Trusted Advisor are higher-level tools, not raw line-item data.',
    category: 'Cost-Optimized Compute'
  },
  {
    id: 'aws-q-saa-cost-nlb-choice',
    question:
      'A cost-conscious company needs a load balancer purely for raw TCP traffic at extremely high throughput and does not need Layer 7 (HTTP-aware) routing features. Which load balancer type is most appropriate?',
    options: ['Network Load Balancer (NLB)', 'Application Load Balancer (ALB)', 'Gateway Load Balancer', 'Classic Load Balancer with all features enabled'],
    correctIndex: 0,
    explanation:
      'NLB operates at Layer 4, is optimized for extreme performance and low latency on raw TCP/UDP traffic, and is the right fit when Layer 7 features are not needed.',
    category: 'Cost-Optimized Networking'
  },
  {
    id: 'aws-q-saa-cost-scheduled-stop',
    question: 'A company runs a non-production development environment used only during business hours on weekdays. What is the most cost-effective way to reduce its EC2 spend?',
    options: [
      'Automatically stopping the instances outside business hours using a schedule',
      'Running them 24/7 on Reserved Instances',
      'Upgrading to larger instance types',
      'Ignoring the schedule and paying for continuous On-Demand usage'
    ],
    correctIndex: 0,
    explanation:
      "Non-production workloads that don't need to run continuously can have their EC2 instances stopped on a schedule during idle hours, directly cutting cost for time genuinely not needed.",
    category: 'Cost-Optimized Compute'
  },
  {
    id: 'aws-q-saa-cost-storage-services-multi',
    question: 'Which TWO of the following help reduce the cost of storing infrequently accessed data over time? (Select TWO.)',
    options: [
      'S3 Lifecycle policies moving data to colder storage tiers',
      'Selecting the appropriate storage class up front based on access pattern',
      'Keeping all data permanently in S3 Standard regardless of access frequency',
      'Disabling versioning, which has no cost impact and is unrelated',
      'Always choosing S3 Standard for archival data'
    ],
    correctIndexes: [0, 1],
    explanation:
      'Lifecycle policies and choosing the correct initial storage class both directly reduce cost for infrequently accessed data — keeping everything in the most expensive tier regardless of access pattern wastes money.',
    category: 'Cost-Optimized Storage'
  }
];
