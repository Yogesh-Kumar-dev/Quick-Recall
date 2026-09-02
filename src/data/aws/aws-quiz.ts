import type { QuizQuestion } from '@/types/content';

// AWS exams mix single-answer "multiple choice" with multi-answer "multiple response" questions
// (the real exam phrases the latter as "Select TWO/THREE responses") — `correctIndexes` marks a
// question as multi-select; `correctIndex` (from the shared QuizQuestion type) marks single-select.
// Kept local to AWS rather than added to the shared QuizQuestion type, since every other topic's
// quiz is single-select only and doesn't need this.
export type AwsQuizQuestion = Omit<QuizQuestion, 'correctIndex'> & ({ correctIndex: number } | { correctIndexes: number[] });

// AWS Certified Cloud Practitioner (CLF-C02) quiz — starting with Domain 2: Security and
// Compliance (30% of the exam, task statements 2.1-2.4) as the validation slice for the format
// before expanding to the other three domains. Scenario-style, matching the exam's own MC/MR mix.
export const awsQuiz: AwsQuizQuestion[] = [
  {
    id: 'aws-q-shared-resp-ec2-os',
    question: 'A company runs an application on Amazon EC2. Under the AWS shared responsibility model, who is responsible for patching the guest operating system?',
    options: ['AWS', 'The customer', 'Both AWS and the customer jointly patch it on a rotating schedule', 'Neither — EC2 instances patch themselves automatically'],
    correctIndex: 1,
    explanation:
      "EC2 is infrastructure (IaaS): AWS secures the physical hardware, network, and virtualization layer ('security of the cloud'), but the customer owns the guest OS, patching, and everything they install on top of it ('security in the cloud').",
    category: 'Shared Responsibility'
  },
  {
    id: 'aws-q-shared-resp-lambda',
    question: 'For AWS Lambda, who is responsible for patching the underlying operating system that runs the function code?',
    options: ['The customer, via a maintenance window', 'AWS', 'A third-party AWS Marketplace vendor', 'The customer, but only for functions older than 90 days'],
    correctIndex: 1,
    explanation:
      'Lambda is a managed/serverless service, so responsibility shifts further toward AWS than it does for EC2 — AWS manages the OS, runtime patching, and underlying infrastructure; the customer is responsible only for their function code and its configuration (IAM permissions, environment variables).',
    category: 'Shared Responsibility'
  },
  {
    id: 'aws-q-shared-resp-rds',
    question: 'Which of the following is the CUSTOMER\'s responsibility when using Amazon RDS (a managed database service)?',
    options: ['Patching the underlying database engine software', 'Managing database user accounts and access within the database', 'Replacing failed physical storage hardware', 'Managing the hypervisor'],
    correctIndex: 1,
    explanation:
      'RDS shifts infrastructure and engine patching to AWS, but the customer still manages what happens inside the database: schemas, data, and database-level user accounts/permissions are always the customer\'s responsibility, regardless of how managed the service is.',
    category: 'Shared Responsibility'
  },
  {
    id: 'aws-q-root-user-tasks',
    question: 'Which of the following actions can ONLY be performed by the AWS account root user, not by an IAM user with AdministratorAccess?',
    options: ['Launching an EC2 instance', 'Creating an S3 bucket', 'Closing the AWS account', 'Creating an IAM policy'],
    correctIndex: 2,
    explanation:
      'A small set of actions is restricted to the root user regardless of IAM permissions — closing the account, changing the support plan, and a few others. Best practice is to secure the root user (MFA, no access keys) and use it only for these rare tasks.',
    category: 'IAM & Access'
  },
  {
    id: 'aws-q-ec2-role-vs-keys',
    question: 'An application running on an EC2 instance needs to read objects from an S3 bucket. What is the AWS-recommended way to grant this access?',
    options: [
      "Store an IAM user's access key and secret key as environment variables on the instance",
      'Attach an IAM role to the EC2 instance with a policy allowing the needed S3 actions',
      "Make the S3 bucket public so the instance's requests are not blocked",
      'Hardcode the credentials directly in the application source code'
    ],
    correctIndex: 1,
    explanation:
      'IAM roles issue short-lived, automatically-rotated credentials to the instance via the metadata service — no long-lived secrets to store, leak, or rotate manually. This is the standard "never store static keys on an instance" pattern tested throughout the exam.',
    category: 'IAM & Access'
  },
  {
    id: 'aws-q-mfa',
    question: 'What is the primary security benefit of enabling multi-factor authentication (MFA) on an IAM user?',
    options: [
      'It encrypts the data the user accesses',
      "It requires a second, independent factor beyond the password, so a stolen password alone can't be used to sign in",
      'It automatically rotates the password every 90 days',
      'It grants the user additional AWS service permissions'
    ],
    correctIndex: 1,
    explanation:
      'MFA adds a second authentication factor (a virtual/hardware device or SMS code) on top of something the user knows (their password) — a leaked password by itself is no longer enough to access the account.',
    category: 'IAM & Access'
  },
  {
    id: 'aws-q-iam-identity-center',
    question: 'A company wants employees to sign in once through their existing corporate directory (for example, Microsoft Active Directory) and access multiple AWS accounts without creating separate IAM users in each one. Which service is designed for this?',
    options: ['AWS Secrets Manager', 'AWS IAM Identity Center', 'Amazon Cognito', 'AWS Organizations'],
    correctIndex: 1,
    explanation:
      'IAM Identity Center (formerly AWS SSO) provides centralized, federated single sign-on across multiple AWS accounts. Cognito is for authenticating end users of your own applications, not workforce access to AWS accounts.',
    category: 'IAM & Access'
  },
  {
    id: 'aws-q-least-privilege',
    question: 'A developer needs permission to view (but not modify) objects in one specific S3 bucket. Which approach best follows the principle of least privilege?',
    options: [
      "Attach the AdministratorAccess managed policy to the developer's IAM user",
      "Grant the developer the account root user's credentials",
      'Create a custom IAM policy that allows only s3:GetObject on that specific bucket',
      'Make the S3 bucket public so anyone can read it'
    ],
    correctIndex: 2,
    explanation:
      'Least privilege means granting exactly the permissions needed to do the job and nothing more — a scoped policy naming the specific action and resource, not a broad managed policy or public access.',
    category: 'IAM & Access'
  },
  {
    id: 'aws-q-encryption-in-transit-vs-rest',
    question: 'A company stores files in Amazon S3 with server-side encryption enabled and requires all uploads/downloads to use HTTPS. Which two encryption concepts does this combination address?',
    options: [
      'Encryption at rest and encryption in transit',
      'Encryption at rest only, twice',
      'Data residency and data sovereignty',
      'Multi-factor authentication and identity federation'
    ],
    correctIndex: 0,
    explanation:
      'Server-side encryption protects data at rest (while stored on S3\'s disks); requiring HTTPS protects data in transit (while moving across the network between the client and S3). The exam frequently tests recognizing which control addresses which state of data.',
    category: 'Encryption'
  },
  {
    id: 'aws-q-kms',
    question: 'What is the primary purpose of AWS Key Management Service (AWS KMS)?',
    options: [
      'To store and automatically rotate database passwords',
      'To create, manage, and control the encryption keys used to protect data across AWS services',
      'To scan S3 buckets for personally identifiable information (PII)',
      'To provide DDoS protection for internet-facing applications'
    ],
    correctIndex: 1,
    explanation:
      'KMS is the centralized service for creating and controlling encryption keys (including automatic key rotation) that other services like S3, EBS, and RDS use to encrypt data at rest.',
    category: 'Encryption'
  },
  {
    id: 'aws-q-secrets-manager-vs-parameter-store',
    question:
      'A company needs to store a database password with automatic rotation on a schedule. Which service is purpose-built for this, as opposed to general configuration storage?',
    options: ['AWS Secrets Manager', 'AWS Systems Manager Parameter Store (standard tier)', 'Amazon S3', 'AWS CloudTrail'],
    correctIndex: 0,
    explanation:
      'Secrets Manager is built specifically for secrets like database credentials and includes built-in automatic rotation. Parameter Store can hold secrets too (and is cheaper) but does not provide built-in automatic rotation the way Secrets Manager does.',
    category: 'Encryption'
  },
  {
    id: 'aws-q-guardduty',
    question: 'Which AWS service continuously analyzes account activity (such as VPC Flow Logs, DNS logs, and CloudTrail events) to detect malicious or unauthorized behavior?',
    options: ['Amazon GuardDuty', 'AWS Trusted Advisor', 'AWS Artifact', 'Amazon Inspector'],
    correctIndex: 0,
    explanation:
      'GuardDuty is a managed threat detection service that uses machine learning and threat intelligence to flag anomalous or malicious activity, such as compromised credentials or unusual API calls, without you having to deploy any agents.',
    category: 'Security Services'
  },
  {
    id: 'aws-q-inspector',
    question: 'A company wants to automatically scan its EC2 instances and container images for known software vulnerabilities (CVEs). Which service should it use?',
    options: ['AWS Shield', 'Amazon Inspector', 'AWS Firewall Manager', 'AWS Artifact'],
    correctIndex: 1,
    explanation:
      'Amazon Inspector performs automated vulnerability assessments of EC2 instances, container images, and Lambda functions, checking them against known CVEs and unintended network exposure.',
    category: 'Security Services'
  },
  {
    id: 'aws-q-waf-vs-shield',
    question: 'A web application is being hit with malicious requests that include SQL injection attempts. Which service is specifically designed to filter this kind of application-layer attack?',
    options: ['AWS Shield Standard', 'AWS WAF', 'Amazon GuardDuty', 'AWS Direct Connect'],
    correctIndex: 1,
    explanation:
      "AWS WAF filters web application traffic against rules for common exploits like SQL injection and cross-site scripting (Layer 7). AWS Shield instead protects against DDoS attacks (volumetric/network-layer), a different threat category.",
    category: 'Security Services'
  },
  {
    id: 'aws-q-macie',
    question: 'A company wants to automatically discover and alert on sensitive data, such as personally identifiable information (PII), stored in its Amazon S3 buckets. Which service fits this need?',
    options: ['Amazon Macie', 'AWS Config', 'AWS CloudTrail', 'Amazon CloudWatch'],
    correctIndex: 0,
    explanation:
      'Macie uses machine learning and pattern matching to discover and classify sensitive data (like PII and credentials) stored in S3, and can alert when it is exposed or improperly accessed.',
    category: 'Security Services'
  },
  {
    id: 'aws-q-security-hub',
    question: 'A company uses GuardDuty, Inspector, and Macie together and wants one centralized dashboard showing findings from all of them alongside a summary of its security posture. Which service provides this?',
    options: ['AWS Security Hub', 'AWS Trusted Advisor', 'AWS Config', 'AWS Organizations'],
    correctIndex: 0,
    explanation:
      'Security Hub aggregates and prioritizes security findings from GuardDuty, Inspector, Macie, and other sources into a single dashboard, and checks resources against security standards and best practices.',
    category: 'Security Services'
  },
  {
    id: 'aws-q-cloudtrail-vs-config',
    question: 'Which statement correctly distinguishes AWS CloudTrail from AWS Config?',
    options: [
      'CloudTrail logs who made which API calls and when; AWS Config tracks the configuration state of resources over time and evaluates compliance',
      'CloudTrail and AWS Config both only track billing changes',
      'AWS Config logs API calls; CloudTrail tracks resource configuration history',
      'They are two names for the same service'
    ],
    correctIndex: 0,
    explanation:
      'CloudTrail is an audit log of API activity (who did what, when, from where). AWS Config is a point-in-time and historical record of resource configuration, used to detect drift and evaluate compliance rules — a commonly confused pair on the exam.',
    category: 'Governance & Compliance'
  },
  {
    id: 'aws-q-artifact',
    question: 'A company\'s compliance team needs to download AWS\'s ISO certifications and SOC reports to support an internal audit. Where would they find these?',
    options: ['AWS Trusted Advisor', 'AWS Artifact', 'AWS Health Dashboard', 'AWS Marketplace'],
    correctIndex: 1,
    explanation:
      "AWS Artifact is the self-service portal for AWS's compliance reports and select agreements (ISO certifications, SOC reports, PCI reports, and more) — the go-to answer whenever a question mentions downloading audit/compliance documentation.",
    category: 'Governance & Compliance'
  },
  {
    id: 'aws-q-trusted-advisor',
    question: 'Which service provides automated recommendations across cost optimization, performance, security, fault tolerance, and service limits, based on AWS best practices?',
    options: ['AWS Trusted Advisor', 'AWS Config', 'AWS CloudTrail', 'AWS Health Dashboard'],
    correctIndex: 0,
    explanation:
      'Trusted Advisor inspects an account and flags opportunities across five categories, including security checks like open security groups, MFA status on the root user, and public S3 buckets. Deeper checks require a Business or Enterprise Support plan.',
    category: 'Governance & Compliance'
  },
  {
    id: 'aws-q-resource-based-vs-identity-policy',
    question: 'An S3 bucket policy grants read access to a specific external AWS account. What kind of IAM policy is this?',
    options: ['An identity-based policy', 'A resource-based policy', 'A service control policy (SCP)', 'A permissions boundary'],
    correctIndex: 1,
    explanation:
      "Identity-based policies attach to a principal (a user, group, or role); resource-based policies (like an S3 bucket policy) attach directly to the resource and specify who can access it — including principals in other AWS accounts, which identity-based policies alone can't grant.",
    category: 'IAM & Access'
  },
  {
    id: 'aws-q-security-services-multi',
    question: 'Which THREE of the following are AWS services primarily focused on threat detection and security assessment? (Select THREE.)',
    options: ['Amazon GuardDuty', 'Amazon Inspector', 'Amazon Macie', 'Amazon VPC', 'Amazon EC2'],
    correctIndexes: [0, 1, 2],
    explanation:
      'GuardDuty (threat detection), Inspector (vulnerability scanning), and Macie (sensitive data discovery) are all purpose-built security services. VPC and EC2 are foundational networking and compute services — they can be secured, but they are not themselves security-assessment tools.',
    category: 'Security Services'
  },
  {
    id: 'aws-q-encryption-concepts-multi',
    question:
      'A company enables Amazon S3 server-side encryption and requires all object uploads and downloads to use HTTPS. Which TWO data-protection concepts does this combination address? (Select TWO.)',
    options: ['Encryption at rest', 'Encryption in transit', 'Data residency', 'Identity federation', 'Multi-factor authentication'],
    correctIndexes: [0, 1],
    explanation:
      "Server-side encryption protects data at rest (on S3's disks); enforcing HTTPS protects data in transit (across the network). Data residency, federation, and MFA are all real AWS concepts but are unrelated to what this specific combination of controls addresses.",
    category: 'Encryption'
  },
  {
    id: 'aws-q-iam-policy-types-multi',
    question: 'Which TWO of the following are valid types of IAM policies? (Select TWO.)',
    options: ['Identity-based policy', 'Resource-based policy', 'Network ACL', 'Route table', 'Security group'],
    correctIndexes: [0, 1],
    explanation:
      'Identity-based policies attach to users/groups/roles; resource-based policies attach directly to a resource (like an S3 bucket policy). Network ACLs, route tables, and security groups are VPC networking constructs, not IAM policy types.',
    category: 'IAM & Access'
  },
  {
    id: 'aws-q-shared-resp-customer-multi',
    question: "Under the AWS shared responsibility model, which TWO of the following are ALWAYS the customer's responsibility, regardless of which AWS service they use? (Select TWO.)",
    options: [
      'Configuring encryption settings for their own data',
      'Managing IAM users, groups, and permissions',
      'Securing the physical data center',
      'Patching the underlying hypervisor',
      'Maintaining the global network backbone'
    ],
    correctIndexes: [0, 1],
    explanation:
      "'Security in the cloud' — what the customer configures and controls, like encryption choices and IAM — never shifts to AWS no matter how managed the service is. Physical security, the hypervisor, and the network backbone are always AWS's 'security of the cloud' responsibilities.",
    category: 'Shared Responsibility'
  },
  {
    id: 'aws-q-governance-tools-multi',
    question: 'Which TWO of the following services help with governance, auditing, and tracking configuration changes across an AWS account? (Select TWO.)',
    options: ['AWS CloudTrail', 'AWS Config', 'Amazon EC2', 'Amazon Route 53', 'AWS Direct Connect'],
    correctIndexes: [0, 1],
    explanation:
      "CloudTrail logs API activity for auditing; AWS Config tracks resource configuration over time and evaluates it against compliance rules. EC2, Route 53, and Direct Connect are compute/networking services with no built-in governance/auditing role themselves.",
    category: 'Governance & Compliance'
  },

  // ─── Domain 1: Cloud Concepts (24%) ────────────────────────────────────────────
  {
    id: 'aws-q-cc-elasticity',
    question:
      "A retail company's website traffic surges during a holiday sale and drops back to normal afterward. Which AWS Cloud benefit best describes the ability to automatically add and remove compute capacity to match this demand?",
    options: ['Elasticity', 'High availability', 'Agility', 'Global reach'],
    correctIndex: 0,
    explanation:
      'Elasticity is the ability to scale resources up and down automatically to match demand, avoiding both over-provisioning and outages. High availability is about resilience; agility is about the speed of deploying resources, not scaling to match demand.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-agility',
    question:
      'A startup needs to provision a new development environment. On-premises this took six weeks to order and rack hardware; on AWS it takes minutes. Which AWS Cloud benefit does this illustrate?',
    options: ['Agility', 'Elasticity', 'Economies of scale', 'Data sovereignty'],
    correctIndex: 0,
    explanation: 'Agility refers to the speed at which new resources can be provisioned and deployed — going from weeks to minutes is a core cloud value proposition.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-global-infra-benefit-multi',
    question: "Which TWO of the following benefits does AWS's global network of Regions and edge locations provide? (Select TWO.)",
    options: [
      'Lower latency for end users close to an edge location',
      'Ability to meet data residency requirements by choosing where data is stored',
      'Guaranteed zero downtime for every workload',
      'Elimination of all AWS costs',
      'Automatic conversion of On-Demand Instances to Reserved Instances'
    ],
    correctIndexes: [0, 1],
    explanation:
      'A global footprint of Regions and edge locations lets you serve content closer to users (lower latency) and choose where data is stored to satisfy residency/sovereignty requirements. Nothing in AWS guarantees zero downtime or eliminates cost.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-well-architected-pillars-multi',
    question: 'Which THREE of the following are pillars of the AWS Well-Architected Framework? (Select THREE.)',
    options: ['Operational Excellence', 'Reliability', 'Cost Optimization', 'Scalability', 'Elasticity'],
    correctIndexes: [0, 1, 2],
    explanation:
      "The six official pillars are Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. 'Scalability' and 'Elasticity' are real cloud concepts but are not pillar names.",
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-pillar-distinction',
    question: 'A company wants to reduce unnecessary spending on idle resources without affecting application performance. Which Well-Architected pillar does this best align with?',
    options: ['Cost Optimization', 'Performance Efficiency', 'Security', 'Reliability'],
    correctIndex: 0,
    explanation: 'Cost Optimization is specifically about avoiding unnecessary spend (right-sizing, eliminating waste) while still meeting functional requirements.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-caf',
    question: 'What is the primary purpose of the AWS Cloud Adoption Framework (AWS CAF)?',
    options: [
      'To provide technical documentation for individual AWS services',
      "To help organizations build an effective plan for their cloud adoption journey across business and technical perspectives",
      'To calculate AWS bills',
      'To manage IAM permissions'
    ],
    correctIndex: 1,
    explanation:
      'AWS CAF provides guidance across business, people, governance, platform, security, and operations perspectives to help organizations plan and execute cloud adoption — it is a planning framework, not a technical reference or billing tool.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-migration-strategy',
    question:
      "A company wants to move its on-premises Oracle database to Amazon RDS with minimal downtime, by continuously replicating changes right up to the cutover. Which AWS service is designed for this?",
    options: ['AWS Database Migration Service (AWS DMS)', 'AWS Direct Connect', 'Amazon Macie', 'AWS Config'],
    correctIndex: 0,
    explanation: 'AWS DMS supports continuous, low-downtime data replication for database migrations, including keeping the source and target in sync until cutover.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-capex-opex',
    question: 'Moving from on-premises infrastructure to AWS shifts spending from large upfront hardware purchases to pay-as-you-go usage. What does this describe?',
    options: ['A shift from capital expenditure (CapEx) to operational expenditure (OpEx)', 'A shift from OpEx to CapEx', 'Elimination of all IT costs', 'A one-time migration fee'],
    correctIndex: 0,
    explanation: 'Cloud economics is frequently framed as trading upfront capital expenditure (buying hardware) for ongoing, usage-based operational expenditure.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-onprem-costs-multi',
    question: 'Which TWO of the following costs does a company typically eliminate by moving physical servers to the AWS Cloud? (Select TWO.)',
    options: [
      'Power and cooling for on-premises data centers',
      'Physical security staffing for server rooms',
      'The need to write any application code',
      'IAM policy management',
      'Elastic Load Balancer configuration'
    ],
    correctIndexes: [0, 1],
    explanation:
      'Moving off physical hardware removes costs tied to owning and operating a data center — power, cooling, and physical security. Application development and cloud configuration work (IAM, load balancers) still exist, just in a different form.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-byol',
    question: 'A company owns existing Microsoft SQL Server licenses and wants to use them on EC2 instead of paying for AWS-included licensing. What licensing model does this describe?',
    options: ['Bring Your Own License (BYOL)', 'Reserved Instances', 'Included licensing', 'Spot pricing'],
    correctIndex: 0,
    explanation: 'BYOL lets a company apply its existing, eligible software licenses to AWS resources instead of paying for a license bundled into the instance price.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-rightsizing',
    question:
      'An EC2 instance is consistently using only 10% of its CPU and memory capacity. What cost-optimization practice involves changing it to a smaller, cheaper instance type that still meets performance needs?',
    options: ['Rightsizing', 'Reserved Instances', 'Consolidated billing', 'Elasticity'],
    correctIndex: 0,
    explanation: 'Rightsizing is the practice of matching instance types and sizes to actual workload requirements to eliminate wasted (unused) capacity.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-automation-benefit',
    question: 'Which of the following is a direct cost benefit of automating infrastructure provisioning (for example, with AWS CloudFormation) instead of configuring resources manually?',
    options: [
      'It eliminates the need for the AWS Well-Architected Framework',
      'It reduces human error and the labor cost of repetitive manual tasks',
      'It guarantees lower EC2 instance prices',
      'It removes the need for IAM'
    ],
    correctIndex: 1,
    explanation: 'Automation reduces the time and labor spent on repetitive tasks and reduces costly mistakes from manual configuration — it does not change AWS pricing or remove the need for other practices.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-economies-of-scale',
    question:
      "As AWS grows its infrastructure and customer base, it can negotiate better hardware pricing and pass some savings on to customers through periodic price reductions. What concept does this describe?",
    options: ['Economies of scale', 'Elasticity', 'Rightsizing', 'Data sovereignty'],
    correctIndex: 0,
    explanation: "Economies of scale means AWS's massive, shared scale of operation lowers its per-unit costs, some of which are passed on to customers as lower prices over time.",
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-ha-multi-az',
    question: 'A company runs its application across two AWS Availability Zones within the same Region. What AWS Cloud benefit does this design primarily support?',
    options: ['High availability', 'Lower cost', 'Data sovereignty', 'Agility'],
    correctIndex: 0,
    explanation: 'Spreading a workload across multiple, physically separate Availability Zones protects it from a single AZ failure, directly supporting high availability.',
    category: 'Cloud Concepts'
  },
  {
    id: 'aws-q-cc-well-architected-purpose',
    question: 'What is the primary purpose of the AWS Well-Architected Framework?',
    options: [
      'To provide a consistent approach for evaluating architectures and identifying areas for improvement',
      'To automatically fix security vulnerabilities',
      'To calculate AWS bills',
      'To replace the need for an AWS Support plan'
    ],
    correctIndex: 0,
    explanation: "It's a set of design principles and questions used to review an architecture against best practices across its six pillars — a review lens, not an automated fix-it tool.",
    category: 'Cloud Concepts'
  },

  // ─── Domain 3: Cloud Technology and Services (34%) ─────────────────────────────
  {
    id: 'aws-q-cts-iac',
    question:
      'A team wants to provision the same infrastructure repeatedly and consistently across multiple environments (dev, test, prod) without manually clicking through the console each time. Which approach should they use?',
    options: ['Infrastructure as Code (IaC)', 'The AWS Management Console only', 'One-time manual provisioning', 'AWS Artifact'],
    correctIndex: 0,
    explanation: 'IaC (for example, AWS CloudFormation) defines infrastructure in a template that can be deployed repeatably and consistently — the standard answer for "repeatable, consistent provisioning."',
    category: 'Deployment & Global Infrastructure'
  },
  {
    id: 'aws-q-cts-deployment-models',
    question:
      'A company keeps its most sensitive data on physical servers in its own data center while running less sensitive workloads on AWS, with connectivity between the two. What deployment model does this describe?',
    options: ['Hybrid', 'Fully cloud', 'On-premises only', 'Multi-cloud'],
    correctIndex: 0,
    explanation: 'A hybrid deployment combines on-premises infrastructure with the AWS Cloud, connected together — common when some data or systems must stay on-premises.',
    category: 'Deployment & Global Infrastructure'
  },
  {
    id: 'aws-q-cts-region-az',
    question: 'What is the relationship between an AWS Region and an Availability Zone?',
    options: [
      'A Region contains multiple, isolated Availability Zones that do not share a single point of failure',
      'An Availability Zone contains multiple Regions',
      'They are the same thing',
      'A Region is a single physical data center'
    ],
    correctIndex: 0,
    explanation: 'Each Region is made up of multiple, physically separate Availability Zones (each one or more data centers), designed so a failure in one AZ does not affect the others.',
    category: 'Deployment & Global Infrastructure'
  },
  {
    id: 'aws-q-cts-multi-region-multi',
    question: 'Which TWO of the following are common reasons to deploy a workload across multiple AWS Regions? (Select TWO.)',
    options: ['Disaster recovery', 'Lower latency for users in different geographic areas', 'Reducing the number of Availability Zones needed', 'Avoiding the need for IAM', 'Simplified IAM policy management'],
    correctIndexes: [0, 1],
    explanation:
      'Multi-Region deployments are commonly used for disaster recovery (surviving a Region-wide event) and to serve geographically distant users with lower latency. They do not reduce AZ count or change IAM requirements.',
    category: 'Deployment & Global Infrastructure'
  },
  {
    id: 'aws-q-cts-ec2-instance-types',
    question: 'A workload performs heavy mathematical simulations and needs the highest possible vCPU performance relative to memory. Which EC2 instance family should it use?',
    options: ['Compute optimized', 'Memory optimized', 'Storage optimized', 'General purpose'],
    correctIndex: 0,
    explanation: 'Compute-optimized instances are built for compute-bound workloads that benefit from high-performance processors relative to memory.',
    category: 'Compute'
  },
  {
    id: 'aws-q-cts-ecs-eks-fargate',
    question:
      'A company wants to run and orchestrate Docker containers on AWS, and wants AWS to fully manage the underlying servers so it never has to provision EC2 instances itself. Which combination fits this requirement?',
    options: [
      'Amazon ECS or EKS running on AWS Fargate',
      'Amazon ECS or EKS running on self-managed EC2 instances only',
      'AWS Lambda with container images is the only possible option',
      'Amazon EC2 with no container service'
    ],
    correctIndex: 0,
    explanation: 'Fargate is the serverless compute engine for containers — it runs ECS or EKS workloads without the customer provisioning or managing any EC2 instances.',
    category: 'Compute'
  },
  {
    id: 'aws-q-cts-serverless-compute-multi',
    question: 'Which TWO of the following are serverless compute options on AWS? (Select TWO.)',
    options: ['AWS Lambda', 'AWS Fargate', 'Amazon EC2 (On-Demand)', 'Amazon EBS', 'Amazon S3 Standard'],
    correctIndexes: [0, 1],
    explanation: 'Lambda and Fargate both run code/containers without the customer provisioning or managing servers. EC2 requires managing instances; EBS and S3 are storage services, not compute.',
    category: 'Compute'
  },
  {
    id: 'aws-q-cts-auto-scaling-elb',
    question:
      "A web application's traffic varies throughout the day. The company wants to automatically add or remove EC2 instances based on demand and distribute incoming traffic evenly across them. Which two AWS capabilities work together to achieve this?",
    options: ['Auto Scaling and Elastic Load Balancing', 'Amazon S3 and CloudFront', 'AWS Lambda and API Gateway', 'IAM and AWS KMS'],
    correctIndex: 0,
    explanation: 'Auto Scaling adjusts the number of instances to match demand; Elastic Load Balancing distributes incoming traffic across them — the standard pairing for elastic, resilient compute.',
    category: 'Compute'
  },
  {
    id: 'aws-q-cts-managed-vs-self-hosted',
    question: 'A company wants AWS to handle database patching, backups, and failover automatically, rather than managing these tasks itself on an EC2-hosted database. Which approach should it choose?',
    options: ['A managed database service like Amazon RDS', 'An EC2-hosted, self-managed database', 'Amazon S3', 'AWS CloudTrail'],
    correctIndex: 0,
    explanation: 'Managed database services like RDS take on operational tasks (patching, backups, failover) that the customer would otherwise handle themselves on an EC2-hosted database.',
    category: 'Database'
  },
  {
    id: 'aws-q-cts-relational-vs-nosql-multi',
    question: 'Which TWO of the following are relational database services on AWS? (Select TWO.)',
    options: ['Amazon RDS', 'Amazon Aurora', 'Amazon DynamoDB', 'Amazon Neptune', 'Amazon ElastiCache'],
    correctIndexes: [0, 1],
    explanation: 'RDS and Aurora are both relational (SQL) database services. DynamoDB is NoSQL, Neptune is a graph database, and ElastiCache is an in-memory cache — none are relational.',
    category: 'Database'
  },
  {
    id: 'aws-q-cts-dynamodb-usecase',
    question:
      'An application needs a database with a flexible schema, seamless horizontal scaling, and single-digit-millisecond latency at massive scale. Which AWS database service fits best?',
    options: ['Amazon DynamoDB', 'Amazon RDS for MySQL', 'Amazon Redshift', 'Amazon Neptune'],
    correctIndex: 0,
    explanation: 'DynamoDB is a fully managed NoSQL key-value/document database purpose-built for flexible schemas and consistent low-latency performance at any scale.',
    category: 'Database'
  },
  {
    id: 'aws-q-cts-elasticache',
    question: "A company wants to reduce the load on its relational database and speed up frequently repeated read queries by caching results in memory. Which service should it use?",
    options: ['Amazon ElastiCache', 'Amazon S3 Glacier', 'AWS Storage Gateway', 'AWS Direct Connect'],
    correctIndex: 0,
    explanation: 'ElastiCache (Redis or Memcached) is an in-memory cache that sits in front of a database to absorb read load and cut latency.',
    category: 'Database'
  },
  {
    id: 'aws-q-cts-vpc-components-multi',
    question: 'Which TWO of the following are components of an Amazon VPC? (Select TWO.)',
    options: ['Subnets', 'Internet gateways', 'Amazon EC2 instance types', 'AWS Support plans', 'Amazon S3 bucket policies'],
    correctIndexes: [0, 1],
    explanation: 'Subnets and internet gateways are core building blocks of a VPC. Instance types, Support plans, and S3 bucket policies belong to compute, billing, and storage respectively — not VPC networking.',
    category: 'Networking'
  },
  {
    id: 'aws-q-cts-sg-vs-nacl',
    question: 'Which statement about security groups and network ACLs in a VPC is correct?',
    options: [
      'Security groups operate at the instance level and are stateful; network ACLs operate at the subnet level and are stateless',
      'Security groups operate at the subnet level; network ACLs operate at the instance level',
      'They are the same thing',
      'Security groups are stateless; network ACLs are stateful'
    ],
    correctIndex: 0,
    explanation:
      'Security groups are stateful instance-level firewalls (return traffic is automatically allowed); network ACLs are stateless subnet-level firewalls that must explicitly allow both inbound and outbound traffic.',
    category: 'Networking'
  },
  {
    id: 'aws-q-cts-route53',
    question: 'Which AWS service is a managed DNS service that can also perform health checks and route traffic based on latency or geography?',
    options: ['Amazon Route 53', 'Amazon CloudFront', 'AWS Direct Connect', 'AWS Transit Gateway'],
    correctIndex: 0,
    explanation: 'Route 53 resolves domain names to resources and supports routing policies like latency-based, geolocation, and failover, backed by health checks.',
    category: 'Networking'
  },
  {
    id: 'aws-q-cts-direct-connect',
    question:
      "A company wants a dedicated, private network connection between its on-premises data center and AWS, bypassing the public internet for more consistent network performance. Which service should it use?",
    options: ['AWS Direct Connect', 'AWS Site-to-Site VPN', 'Amazon Route 53', 'AWS Transit Gateway'],
    correctIndex: 0,
    explanation: 'Direct Connect provides a dedicated, private physical network connection between on-premises infrastructure and AWS, avoiding the public internet.',
    category: 'Networking'
  },
  {
    id: 'aws-q-cts-s3-storage-classes',
    question:
      'A company has log files it must retain for 7 years for compliance but almost never needs to access, and can tolerate several hours of retrieval time when it does. Which S3 storage class minimizes cost for this use case?',
    options: ['S3 Glacier Deep Archive', 'S3 Standard', 'S3 Standard-IA', 'S3 Intelligent-Tiering'],
    correctIndex: 0,
    explanation: 'S3 Glacier Deep Archive is the lowest-cost S3 storage class, designed for data accessed rarely (roughly once or twice a year) with a retrieval time measured in hours.',
    category: 'Storage'
  },
  {
    id: 'aws-q-cts-block-vs-object',
    question: 'An application needs a persistent, low-latency block storage volume attached to a single EC2 instance, similar to a traditional hard drive. Which storage type is appropriate?',
    options: ['Amazon EBS', 'Amazon S3', 'Amazon EFS', 'Amazon S3 Glacier'],
    correctIndex: 0,
    explanation: 'EBS provides persistent block storage volumes that attach to a single EC2 instance — the closest cloud analog to a traditional attached hard drive.',
    category: 'Storage'
  },
  {
    id: 'aws-q-cts-efs',
    question: 'A company needs a file system that can be mounted concurrently by many EC2 instances across multiple Availability Zones. Which service should it use?',
    options: ['Amazon EFS', 'Amazon EBS', 'Instance store', 'Amazon S3 Glacier'],
    correctIndex: 0,
    explanation: 'EFS is a managed, elastic file system that can be mounted by many instances at once across multiple AZs — EBS and instance store are attached to a single instance.',
    category: 'Storage'
  },
  {
    id: 'aws-q-cts-storage-gateway',
    question:
      'A company wants to extend its on-premises storage to the cloud, caching frequently accessed data locally while storing the bulk of data durably in Amazon S3. Which service is designed for this hybrid use case?',
    options: ['AWS Storage Gateway', 'Amazon FSx', 'AWS Snow Family', 'AWS DataSync'],
    correctIndex: 0,
    explanation: "Storage Gateway is the hybrid storage service that bridges on-premises applications with cloud storage, using local caching for frequently accessed data — exactly this 'cached file system' pattern.",
    category: 'Storage'
  },
  {
    id: 'aws-q-cts-lifecycle-backup-multi',
    question: 'Which TWO of the following help automate the movement or retention of data over time? (Select TWO.)',
    options: ['S3 Lifecycle policies', 'AWS Backup', 'Amazon EC2 Auto Scaling', 'AWS WAF', 'Amazon Route 53 health checks'],
    correctIndexes: [0, 1],
    explanation:
      'S3 Lifecycle policies automate transitioning or expiring objects over time; AWS Backup automates and centralizes backup schedules and retention. Auto Scaling, WAF, and Route 53 health checks address entirely different concerns.',
    category: 'Storage'
  },
  {
    id: 'aws-q-cts-sagemaker',
    question: 'Which AWS service provides a fully managed platform for building, training, and deploying machine learning models?',
    options: ['Amazon SageMaker AI', 'Amazon Athena', 'AWS Glue', 'Amazon Kinesis'],
    correctIndex: 0,
    explanation: 'SageMaker AI is the end-to-end managed ML platform. Athena, Glue, and Kinesis are analytics/ETL/streaming services, not ML model-building platforms.',
    category: 'AI/ML & Analytics'
  },
  {
    id: 'aws-q-cts-athena',
    question: 'A company wants to run SQL queries directly against data stored in Amazon S3 without provisioning any servers or loading the data into a database first. Which service fits this need?',
    options: ['Amazon Athena', 'Amazon RDS', 'AWS Lambda', 'Amazon EC2'],
    correctIndex: 0,
    explanation: 'Athena is a serverless, interactive query service that runs standard SQL directly against data in S3, with no infrastructure to manage.',
    category: 'AI/ML & Analytics'
  },
  {
    id: 'aws-q-cts-kinesis',
    question: 'Which AWS service is designed for ingesting and processing real-time streaming data, such as clickstream or IoT sensor data?',
    options: ['Amazon Kinesis', 'AWS Glue', 'Amazon QuickSight', 'AWS Snowball'],
    correctIndex: 0,
    explanation: 'Kinesis is built for collecting, processing, and analyzing real-time streaming data at scale.',
    category: 'AI/ML & Analytics'
  },
  {
    id: 'aws-q-cts-sns-fanout',
    question: 'A company needs one service to publish a single message and automatically fan it out to multiple subscribers (email, SMS, and Lambda functions). Which service fits this need?',
    options: ['Amazon SNS', 'Amazon SQS', 'AWS Step Functions', 'Amazon EventBridge'],
    correctIndex: 0,
    explanation: 'SNS is a publish/subscribe service designed to fan a single published message out to many subscriber types at once (Lambda, SQS, HTTP, email, SMS).',
    category: 'Other AWS Services'
  },
  {
    id: 'aws-q-cts-sqs',
    question: 'Which service provides a durable message queue that decouples producers from consumers, ensuring each message is processed by only one consumer before being deleted?',
    options: ['Amazon SQS', 'Amazon SNS', 'Amazon Connect', 'Amazon SES'],
    correctIndex: 0,
    explanation: 'SQS is a point-to-point queue: each message is processed by one consumer and then removed, decoupling producers from consumers.',
    category: 'Other AWS Services'
  },
  {
    id: 'aws-q-cts-ses',
    question: 'Which AWS service is designed for sending and receiving transactional and marketing email at scale?',
    options: ['Amazon SES', 'Amazon SNS', 'Amazon Connect', 'AWS Amplify'],
    correctIndex: 0,
    explanation: 'SES is purpose-built for cost-effective, high-volume transactional and marketing email — SNS/Connect/Amplify serve different purposes (notifications, contact center, and web/mobile hosting).',
    category: 'Other AWS Services'
  },
  {
    id: 'aws-q-cts-devtools-multi',
    question: 'Which TWO of the following are AWS developer tools used for building and deploying application code? (Select TWO.)',
    options: ['AWS CodeBuild', 'AWS CodePipeline', 'Amazon WorkSpaces', 'AWS IoT Core', 'AWS Direct Connect'],
    correctIndexes: [0, 1],
    explanation: 'CodeBuild compiles/tests code and CodePipeline automates release pipelines — both are developer tools. WorkSpaces (virtual desktops), IoT Core, and Direct Connect serve unrelated purposes.',
    category: 'Other AWS Services'
  },
  {
    id: 'aws-q-cts-workspaces',
    question: 'A company wants to provide virtual desktops to remote employees without managing physical laptops. Which AWS service is designed for this?',
    options: ['Amazon WorkSpaces', 'AWS Amplify', 'Amazon Connect', 'AWS IoT Core'],
    correctIndex: 0,
    explanation: 'WorkSpaces is a managed, persistent virtual desktop (end user computing) service — Amplify is for frontend web/mobile apps, Connect is a cloud contact center, and IoT Core manages IoT devices.',
    category: 'Other AWS Services'
  },

  // ─── Domain 4: Billing, Pricing, and Support (12%) ─────────────────────────────
  {
    id: 'aws-q-bps-pricing-models',
    question:
      'A company has a steady-state workload that will run continuously for the next 3 years and wants the lowest possible EC2 cost in exchange for that commitment. Which pricing option fits best?',
    options: ['Reserved Instances or Savings Plans', 'On-Demand Instances', 'Spot Instances', 'Dedicated Hosts'],
    correctIndex: 0,
    explanation: 'Reserved Instances and Savings Plans trade a 1- or 3-year usage commitment for a significant discount over On-Demand — the standard fit for steady, predictable workloads.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-spot',
    question: 'Which EC2 pricing option offers the largest potential discount (up to ~90% off On-Demand) but can be interrupted by AWS with short notice?',
    options: ['Spot Instances', 'Reserved Instances', 'On-Demand Instances', 'Savings Plans'],
    correctIndex: 0,
    explanation: 'Spot Instances use spare AWS capacity at steep discounts, but AWS can reclaim that capacity with short notice, making them best for fault-tolerant, interruptible workloads.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-data-transfer',
    question: 'Which of the following AWS data transfer scenarios typically incurs the LEAST direct data transfer cost?',
    options: [
      'Data transferred IN to AWS from the internet',
      'Data transferred OUT from AWS to the internet',
      'Data transferred between Regions',
      'Data transferred out to another AWS account in a different Region'
    ],
    correctIndex: 0,
    explanation: 'Data transferred into AWS from the internet is generally free; outbound transfer to the internet and cross-Region transfer are typically the costs that scale with usage.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-ri-flexibility',
    question: 'Reserved Instance flexibility allows which of the following?',
    options: [
      'Modifying reservation attributes, such as instance size within the same instance family, without losing the discount',
      'Automatically converting to Spot Instances when idle',
      'Guaranteeing free data transfer',
      'Eliminating the need for a Support plan'
    ],
    correctIndex: 0,
    explanation: 'Reserved Instances offer flexibility to modify certain attributes (like instance size within a family) while continuing to benefit from the reserved discount.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-cost-tools-multi',
    question: 'Which TWO of the following AWS tools help a company forecast, track, and analyze its AWS costs? (Select TWO.)',
    options: ['AWS Cost Explorer', 'AWS Budgets', 'Amazon CloudWatch', 'AWS Artifact', 'Amazon Route 53'],
    correctIndexes: [0, 1],
    explanation:
      'Cost Explorer visualizes and analyzes spending patterns; Budgets lets you set thresholds and get alerted. CloudWatch monitors operational metrics/logs, Artifact is for compliance documents, and Route 53 is DNS — none focused on cost analysis.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-pricing-calculator',
    question: 'Before deploying a new workload on AWS, a company wants to estimate the monthly cost of the AWS services it plans to use. Which tool should it use?',
    options: ['AWS Pricing Calculator', 'AWS Cost Explorer', 'AWS Budgets', 'AWS Cost and Usage Report'],
    correctIndex: 0,
    explanation:
      'Pricing Calculator estimates costs for a planned (not-yet-deployed) architecture. Cost Explorer, Budgets, and Cost and Usage Report all analyze or track costs for resources already in use.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-consolidated-billing',
    question:
      'A company has multiple AWS accounts under one AWS Organization and wants a single consolidated bill along with the ability to share volume pricing discounts across accounts. What feature provides this?',
    options: ['AWS Organizations consolidated billing', 'AWS Budgets', 'Cost allocation tags', 'AWS Artifact'],
    correctIndex: 0,
    explanation: 'Consolidated billing under AWS Organizations combines usage across member accounts into one bill and lets accounts share volume pricing discounts and Reserved Instance/Savings Plan benefits.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-cost-allocation-tags',
    question: 'A company wants to break down its AWS bill by project or department to see which team is responsible for which costs. What should it use?',
    options: ['Cost allocation tags', 'IAM policies', 'Service control policies', 'VPC subnets'],
    correctIndex: 0,
    explanation: 'Cost allocation tags let you label resources (for example, by project or team) so those costs can be tracked and broken down in billing reports like the Cost and Usage Report.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-support-plans',
    question:
      'Which AWS Support plan tier is required for 24/7 access to Cloud Support Engineers via phone, chat, and email, along with a guaranteed response time for production-system-down issues?',
    options: ['Business (or higher)', 'Basic', 'Developer', 'None — all plans include this'],
    correctIndex: 0,
    explanation: 'Basic and Developer plans are self-service or limited-hours support; Business (and above) is the first tier with 24/7 access to support engineers and production-down response-time guarantees.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-trusted-advisor',
    question: 'Which service inspects an AWS account and provides recommendations across cost optimization, performance, security, fault tolerance, and service limits?',
    options: ['AWS Trusted Advisor', 'AWS Budgets', 'AWS Config', 'Amazon CloudWatch'],
    correctIndex: 0,
    explanation: 'Trusted Advisor is the automated best-practices checker across those five specific categories — deeper checks require a Business or Enterprise Support plan.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-health-dashboard',
    question: "Which AWS resource shows the status of AWS services and any operational issues or scheduled changes that might affect a specific account's resources?",
    options: ['AWS Health Dashboard', 'AWS Cost Explorer', 'AWS Trusted Advisor', 'AWS Marketplace'],
    correctIndex: 0,
    explanation: 'AWS Health Dashboard provides both general service status and account-specific, personalized alerts about events that could affect your resources.',
    category: 'Billing, Pricing & Support'
  },
  {
    id: 'aws-q-bps-basic-support',
    question: 'Which AWS Support plan is automatically included with every AWS account at no additional cost, providing access to whitepapers, documentation, and basic account/billing support?',
    options: ['Basic Support', 'Developer Support', 'Business Support', 'Enterprise Support'],
    correctIndex: 0,
    explanation: 'Basic Support is free and included by default for every AWS account — Developer, Business, and Enterprise tiers are paid upgrades with progressively more access.',
    category: 'Billing, Pricing & Support'
  }
];
