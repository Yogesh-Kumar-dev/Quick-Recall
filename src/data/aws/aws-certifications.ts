// Sources: https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html
//          https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain{1..4}.html
//          https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html
//          https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html
//          https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-out-of-scope-services.html
//          https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html
//          https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain{1..4}.html
//          https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-technologies-concepts.html
//          https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
//          https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-out-of-scope-services.html
export interface AwsExamTask {
  statement: string;
  // "Skills in:" bullets only — "Knowledge of:" bullets mostly just restate the skill as a noun,
  // so they're dropped to keep this dense and non-redundant.
  skills: string[];
}

export interface AwsServiceScope {
  category: string;
  services: string[];
}

export interface AwsCertification {
  id: 'CLF-C02' | 'SAA-C03';
  slug: string;
  name: string;
  fullName: string;
  examGuideUrl: string;
  examDomains: { domain: string; weight: string; taskStatements: AwsExamTask[] }[];
  examFacts: { label: string; value: string }[];
  technologiesAndConcepts: string[];
  inScopeServices: AwsServiceScope[];
  outOfScopeServices: AwsServiceScope[];
}

export const awsCertifications: AwsCertification[] = [
  {
    id: 'CLF-C02',
    slug: 'clf-c02',
    name: 'Cloud Practitioner',
    fullName: 'AWS Certified Cloud Practitioner',
    examGuideUrl: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html',
    examDomains: [
      {
        domain: 'Cloud Concepts',
        weight: '24%',
        taskStatements: [
          {
            statement: 'Define the benefits of the AWS Cloud.',
            skills: [
              'Understanding the benefits of global infrastructure (for example, speed of deployment, global reach)',
              'Understanding the advantages of high availability, elasticity, and agility'
            ]
          },
          {
            statement: 'Identify design principles of the AWS Cloud.',
            skills: [
              'Understanding the pillars of the Well-Architected Framework (for example, operational excellence, security, reliability, performance efficiency, cost optimization, sustainability)',
              'Identifying differences between the pillars of the Well-Architected Framework'
            ]
          },
          {
            statement: 'Understand the benefits of and strategies for migration to the AWS Cloud.',
            skills: [
              'Understanding the components of the AWS Cloud Adoption Framework (AWS CAF) (for example, reduced business risk; improved environmental, social, and governance [ESG] performance; increased revenue; increased operational efficiency)',
              'Identifying appropriate migration strategies (for example, database replication)'
            ]
          },
          {
            statement: 'Understand concepts of cloud economics.',
            skills: [
              'Understanding the role of fixed costs compared with variable costs',
              'Understanding costs that are associated with on-premises environments',
              'Understanding the differences between licensing strategies (for example, Bring Your Own License [BYOL] model compared with included licenses)',
              'Understanding the concept of rightsizing',
              'Identifying benefits of automation',
              'Understanding the economies of scale (for example, cost savings)'
            ]
          }
        ]
      },
      {
        domain: 'Security and Compliance',
        weight: '30%',
        taskStatements: [
          {
            statement: 'Understand the AWS shared responsibility model.',
            skills: [
              'Recognizing the components of the AWS shared responsibility model',
              "Describing the customer's responsibilities on AWS",
              'Describing AWS responsibilities',
              'Describing responsibilities that the customer and AWS share',
              'Describing how AWS responsibilities and customer responsibilities can shift, depending on the service used (for example, Amazon RDS, AWS Lambda, Amazon EC2)'
            ]
          },
          {
            statement: 'Understand AWS Cloud security, governance, and compliance concepts.',
            skills: [
              'Identifying where to find AWS compliance information (for example, AWS Artifact)',
              'Understanding compliance needs among geographic locations or industries (for example, AWS compliance)',
              'Describing how customers secure resources on AWS (for example, Amazon Inspector, AWS Security Hub, Amazon GuardDuty, AWS Shield)',
              'Identifying encryption options (for example, encryption in transit, encryption at rest)',
              'Recognizing services that aid in governance and compliance (for example, monitoring with Amazon CloudWatch; auditing with AWS CloudTrail and AWS Config; reporting with access reports)',
              'Recognizing compliance requirements that vary among AWS services'
            ]
          },
          {
            statement: 'Identify AWS access management capabilities.',
            skills: [
              'Understanding access keys, password policies, and credential storage (for example, AWS Secrets Manager, AWS Systems Manager)',
              'Identifying authentication methods in AWS (for example, multi-factor authentication [MFA], IAM Identity Center, cross-account IAM roles)',
              'Defining groups, users, custom policies, and managed policies in compliance with the principle of least privilege',
              'Identifying tasks that only the account root user can perform',
              'Understanding which methods can achieve root user protection',
              'Understanding the types of identity management (for example, federated)'
            ]
          },
          {
            statement: 'Identify components and resources for security.',
            skills: [
              'Describing AWS security features and services (for example, AWS WAF, AWS Firewall Manager, AWS Shield, Amazon GuardDuty)',
              'Understanding that third-party security products are available from AWS Marketplace',
              'Identifying where AWS security information is available (for example, AWS Knowledge Center, AWS Security Center, AWS Security Blog)',
              'Understanding the use of AWS services for identifying security issues (for example, AWS Trusted Advisor)'
            ]
          }
        ]
      },
      {
        domain: 'Cloud Technology and Services',
        weight: '34%',
        taskStatements: [
          {
            statement: 'Define methods of deploying and operating in the AWS Cloud.',
            skills: [
              'Deciding between options such as programmatic access (for example, APIs, SDKs, CLI), the AWS Management Console, and infrastructure as code (IaC)',
              'Evaluating requirements to determine whether to use one-time operations or repeatable processes',
              'Identifying deployment models (for example, cloud, hybrid, on-premises)'
            ]
          },
          {
            statement: 'Define the AWS global infrastructure.',
            skills: [
              'Describing relationships among Regions, Availability Zones, and edge locations',
              'Describing how to achieve high availability by using multiple Availability Zones',
              'Recognizing that Availability Zones do not share single points of failure',
              'Describing when to use multiple Regions (for example, disaster recovery, business continuity, low latency for end users, data sovereignty)'
            ]
          },
          {
            statement: 'Identify AWS compute services.',
            skills: [
              'Recognizing the appropriate use of various Amazon EC2 instance types (for example, compute optimized, storage optimized)',
              'Recognizing the appropriate use of various container options (for example, Amazon ECS, Amazon EKS)',
              'Recognizing the appropriate use of various serverless compute options (for example, AWS Fargate, AWS Lambda)',
              'Recognizing that auto scaling provides elasticity',
              'Identifying the purposes of load balancers'
            ]
          },
          {
            statement: 'Identify AWS database services.',
            skills: [
              'Deciding when to use EC2 hosted databases or AWS managed databases',
              'Identifying relational databases (for example, Amazon RDS, Amazon Aurora)',
              'Identifying NoSQL databases (for example, Amazon DynamoDB)',
              'Identifying memory-based databases (for example, Amazon ElastiCache)',
              'Identifying database migration tools (for example, AWS DMS, AWS Schema Conversion Tool)'
            ]
          },
          {
            statement: 'Identify AWS network services.',
            skills: [
              'Identifying the components of a VPC (for example, subnets, gateways)',
              'Understanding security in a VPC (for example, network ACLs, security groups, Amazon Inspector)',
              'Understanding the purpose of Amazon Route 53',
              'Identifying network connectivity options to AWS (for example, AWS VPN, AWS Direct Connect)'
            ]
          },
          {
            statement: 'Identify AWS storage services.',
            skills: [
              'Identifying the uses for object storage',
              'Recognizing the differences in Amazon S3 storage classes',
              'Identifying block storage solutions (for example, Amazon EBS, instance store)',
              'Identifying file services (for example, Amazon EFS, Amazon FSx)',
              'Identifying cached file systems (for example, AWS Storage Gateway)',
              'Understanding use cases for lifecycle policies',
              'Understanding use cases for AWS Backup'
            ]
          },
          {
            statement: 'Identify AWS artificial intelligence and machine learning (AI/ML) services and analytics services.',
            skills: [
              'Understanding AI/ML services and the tasks that they accomplish (for example, Amazon SageMaker AI, Amazon Lex)',
              'Identifying the services for data analytics (for example, Amazon Athena, Amazon Kinesis, AWS Glue, Amazon QuickSight)'
            ]
          },
          {
            statement: 'Identify services from other in-scope AWS service categories.',
            skills: [
              'Choosing the appropriate service to deliver messages and to send alerts and notifications',
              'Choosing the appropriate service to meet business application needs',
              'Choosing the appropriate option for business support assistance',
              'Identifying the tools to develop, deploy, and troubleshoot applications',
              'Identifying the services that can present the output of virtual machines (VMs) on end-user machines',
              'Identifying the services that can create and deploy frontend and mobile services',
              'Identifying the services that manage IoT devices'
            ]
          }
        ]
      },
      {
        domain: 'Billing, Pricing, and Support',
        weight: '12%',
        taskStatements: [
          {
            statement: 'Compare AWS pricing models.',
            skills: [
              'Identifying when to use various compute purchasing options',
              'Describing Reserved Instance flexibility',
              'Describing Reserved Instance behavior in AWS Organizations',
              'Understanding incoming and outgoing data transfer costs (for example, between Regions, within the same Region)',
              'Understanding pricing options for various storage options and tiers'
            ]
          },
          {
            statement: 'Understand resources for billing, budget, and cost management.',
            skills: [
              'Understanding the appropriate uses and capabilities of AWS Budgets and AWS Cost Explorer',
              'Understanding the appropriate uses and capabilities of AWS Pricing Calculator',
              'Understanding AWS Organizations consolidated billing and allocation of costs',
              'Understanding various types of cost allocation tags and their relation to billing reports (for example, AWS Cost and Usage Report)'
            ]
          },
          {
            statement: 'Identify AWS technical resources and AWS Support options.',
            skills: [
              'Locating AWS whitepapers, blogs, and documentation on official AWS websites',
              'Identifying and locating AWS technical resources (for example, AWS Prescriptive Guidance, AWS Knowledge Center, AWS re:Post)',
              'Identifying AWS Support options for AWS customers (for example, Developer, Business, Enterprise On-Ramp, Enterprise)',
              'Identifying the role of AWS Trusted Advisor, AWS Health Dashboard, and the AWS Health API for cost optimization',
              'Identifying the role of the AWS Trust and Safety team to report abuse of AWS resources',
              'Understanding the role of AWS Partners (for example, AWS Marketplace, independent software vendors, system integrators)',
              'Identifying the benefits of being an AWS Partner (for example, training and certification, partner events, volume discounts)',
              'Identifying the key services that AWS Marketplace offers (for example, cost management, governance and entitlement)',
              'Identifying technical assistance options available at AWS (for example, AWS Professional Services, AWS solutions architects)'
            ]
          }
        ]
      }
    ],
    examFacts: [
      { label: 'Format', value: 'Multiple choice & multiple response' },
      { label: 'Questions', value: '65 total (50 scored, 15 unscored)' },
      { label: 'Length', value: '90 minutes' },
      { label: 'Passing score', value: '700 out of 1,000' },
      { label: 'Cost', value: '$100 USD' },
      { label: 'Target candidate', value: 'Up to 6 months of AWS Cloud exposure' }
    ],
    technologiesAndConcepts: [
      'APIs',
      'Benefits of migrating to the AWS Cloud',
      'AWS Cloud Adoption Framework (AWS CAF)',
      'AWS Compliance',
      'Compute',
      'Cost management',
      'Databases',
      'Amazon EC2 instance types (for example, Reserved Instances, On-Demand Instances, Spot Instances)',
      'AWS global infrastructure (for example, AWS Regions, Availability Zones)',
      'Infrastructure as code (IaC)',
      'AWS Knowledge Center',
      'Machine learning',
      'Management and governance',
      'Migration and data transfer',
      'Network services',
      'AWS Partner Network (APN)',
      'AWS Prescriptive Guidance',
      'AWS Pricing Calculator',
      'AWS Professional Services',
      'AWS re:Post',
      'AWS SDKs',
      'Security',
      'AWS Security Blog',
      'AWS shared responsibility model',
      'AWS solutions architects',
      'Storage',
      'AWS Support Center',
      'AWS Support plans',
      'AWS Well-Architected Framework'
    ],
    inScopeServices: [
      { category: 'Analytics', services: ['Amazon Athena', 'Amazon EMR', 'AWS Glue', 'Amazon Kinesis', 'Amazon OpenSearch Service', 'Amazon QuickSight', 'Amazon Redshift'] },
      { category: 'Application Integration', services: ['Amazon EventBridge', 'Amazon SNS', 'Amazon SQS', 'AWS Step Functions'] },
      { category: 'Business Applications', services: ['Amazon Connect', 'Amazon SES'] },
      { category: 'Cloud Financial Management', services: ['AWS Budgets', 'AWS Cost and Usage Reports', 'AWS Cost Explorer', 'AWS Marketplace'] },
      { category: 'Compute', services: ['AWS Batch', 'Amazon EC2', 'AWS Elastic Beanstalk', 'Amazon Lightsail', 'AWS Outposts'] },
      { category: 'Containers', services: ['Amazon ECR', 'Amazon ECS', 'Amazon EKS'] },
      { category: 'Customer Enablement', services: ['AWS Support'] },
      { category: 'Database', services: ['Amazon Aurora', 'Amazon DocumentDB', 'Amazon DynamoDB', 'Amazon ElastiCache', 'Amazon Neptune', 'Amazon RDS'] },
      { category: 'Developer Tools', services: ['AWS CLI', 'AWS CodeBuild', 'AWS CodePipeline', 'AWS X-Ray'] },
      { category: 'End User Computing', services: ['Amazon AppStream 2.0', 'Amazon WorkSpaces', 'Amazon WorkSpaces Secure Browser'] },
      { category: 'Frontend Web and Mobile', services: ['AWS Amplify'] },
      { category: 'Internet of Things (IoT)', services: ['AWS IoT Core'] },
      {
        category: 'Machine Learning',
        services: ['Amazon Comprehend', 'Amazon Lex', 'Amazon Polly', 'Amazon Q', 'Amazon Rekognition', 'Amazon SageMaker AI', 'Amazon Textract', 'Amazon Transcribe', 'Amazon Translate']
      },
      {
        category: 'Management and Governance',
        services: [
          'AWS Auto Scaling',
          'AWS CloudFormation',
          'AWS CloudTrail',
          'Amazon CloudWatch',
          'AWS Compute Optimizer',
          'AWS Config',
          'AWS Control Tower',
          'AWS Health Dashboard',
          'AWS License Manager',
          'AWS Management Console',
          'AWS Organizations',
          'AWS Service Catalog',
          'Service Quotas',
          'AWS Systems Manager',
          'AWS Trusted Advisor',
          'AWS Well-Architected Tool'
        ]
      },
      {
        category: 'Migration and Transfer',
        services: ['AWS Application Discovery Service', 'AWS Application Migration Service', 'AWS DMS', 'Migration Evaluator', 'AWS Migration Hub', 'AWS SCT']
      },
      {
        category: 'Networking and Content Delivery',
        services: ['Amazon API Gateway', 'Amazon CloudFront', 'AWS Direct Connect', 'AWS Global Accelerator', 'AWS PrivateLink', 'Amazon Route 53', 'AWS Transit Gateway', 'Amazon VPC', 'AWS VPN']
      },
      {
        category: 'Security, Identity, and Compliance',
        services: [
          'AWS Artifact',
          'AWS Certificate Manager (ACM)',
          'AWS CloudHSM',
          'Amazon Cognito',
          'Amazon Detective',
          'AWS Directory Service',
          'AWS Firewall Manager',
          'Amazon GuardDuty',
          'IAM',
          'AWS IAM Identity Center',
          'Amazon Inspector',
          'AWS KMS',
          'Amazon Macie',
          'AWS Resource Access Manager (AWS RAM)',
          'AWS Secrets Manager',
          'AWS Security Hub',
          'AWS Shield',
          'AWS WAF'
        ]
      },
      { category: 'Serverless', services: ['AWS Fargate', 'AWS Lambda'] },
      {
        category: 'Storage',
        services: ['AWS Backup', 'Amazon EBS', 'Amazon EFS', 'AWS Elastic Disaster Recovery', 'Amazon FSx', 'Amazon S3', 'Amazon S3 Glacier', 'AWS Storage Gateway']
      }
    ],
    outOfScopeServices: [
      { category: 'Analytics', services: ['Amazon AppFlow', 'AWS Clean Rooms', 'AWS Data Exchange', 'Amazon DataZone', 'Amazon MSK'] },
      { category: 'Application Integration', services: ['AWS AppFabric', 'Amazon Simple Workflow Service'] },
      { category: 'Business Applications', services: ['Amazon WorkDocs'] },
      { category: 'Compute', services: ['AWS Copilot', 'AWS Wavelength'] },
      { category: 'Cost Management', services: ['AWS Application Cost Profiler', 'Amazon DevPay'] },
      { category: 'Customer Enablement', services: ['AWS Activate', 'AWS IQ', 'AWS Managed Services (AMS)'] },
      { category: 'Cloud Financial Management', services: ['AWS Billing Conductor'] },
      { category: 'Database', services: ['Amazon Keyspaces', 'Amazon MemoryDB for Redis OSS', 'AWS AppConfig'] },
      { category: 'Developer Tools', services: ['AWS Application Composer', 'AWS CodeArtifact', 'AWS CodeDeploy', 'Amazon CodeGuru', 'AWS CloudShell', 'AWS Device Farm'] },
      { category: 'Game Tech', services: ['Amazon GameLift', 'Amazon Lumberyard'] },
      { category: 'Internet of Things (IoT)', services: ['AWS IoT Device Defender', 'AWS IoT Greengrass', 'Amazon Monitron'] },
      { category: 'Machine Learning', services: ['Amazon Fraud Detector', 'Amazon Lookout for Metrics', 'AWS Panorama', 'Amazon Personalize'] },
      { category: 'Management and Governance', services: ['AWS Chatbot', 'Amazon Data Lifecycle Manager', 'Amazon Elastic Transcoder', 'AWS Launch Wizard'] },
      {
        category: 'Media Services',
        services: [
          'AWS Elemental Appliances and Software',
          'AWS Elemental MediaConnect',
          'AWS Elemental MediaConvert',
          'AWS Elemental MediaLive',
          'AWS Elemental MediaPackage',
          'AWS Elemental MediaStore',
          'AWS Elemental MediaTailor',
          'Amazon IVS'
        ]
      },
      { category: 'Migration and Transfer', services: ['AWS Migration Hub Refactor Spaces', 'AWS Transfer Family'] },
      { category: 'Networking and Content Delivery', services: ['AWS Cloud Map', 'AWS Network Access Analyzer', 'AWS Ground Station', 'Amazon VPC Lattice'] },
      { category: 'Security, Identity, and Compliance', services: ['Amazon Cloud Directory', 'AWS Network Firewall'] },
      { category: 'Robotics', services: ['AWS RoboMaker'] },
      { category: 'Storage', services: ['Amazon FSx for Lustre'] }
    ]
  },
  {
    id: 'SAA-C03',
    slug: 'saa-c03',
    name: 'Solutions Architect',
    fullName: 'AWS Certified Solutions Architect - Associate',
    examGuideUrl: 'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html',
    examDomains: [
      {
        domain: 'Design Secure Architectures',
        weight: '30%',
        taskStatements: [
          {
            statement: 'Design secure access to AWS resources',
            skills: [
              'Applying AWS security best practices to IAM users and root users (for example, MFA)',
              'Designing a flexible authorization model that includes IAM users, groups, roles, and policies',
              'Designing a role-based access control strategy (for example, AWS STS, role switching, cross-account access)',
              'Designing a security strategy for multiple AWS accounts (for example, AWS Control Tower, SCPs)',
              'Determining the appropriate use of resource policies for AWS services',
              'Determining when to federate a directory service with IAM roles'
            ]
          },
          {
            statement: 'Design secure workloads and applications',
            skills: [
              'Designing VPC architectures with security components (for example, security groups, route tables, network ACLs, NAT gateways)',
              'Determining network segmentation strategies (for example, public subnets and private subnets)',
              'Integrating AWS services to secure applications (for example, AWS Shield, AWS WAF, IAM Identity Center, AWS Secrets Manager)',
              'Securing external network connections to and from the AWS Cloud (for example, VPN, AWS Direct Connect)'
            ]
          },
          {
            statement: 'Determine appropriate data security controls',
            skills: [
              'Aligning AWS technologies to meet compliance requirements',
              'Encrypting data at rest (for example, AWS KMS)',
              'Encrypting data in transit (for example, ACM using TLS)',
              'Implementing access policies for encryption keys',
              'Implementing data backups and replications',
              'Implementing policies for data access, lifecycle, and protection',
              'Rotating encryption keys and renewing certificates'
            ]
          }
        ]
      },
      {
        domain: 'Design Resilient Architectures',
        weight: '26%',
        taskStatements: [
          {
            statement: 'Design scalable and loosely coupled architectures',
            skills: [
              'Designing event-driven, microservice, and/or multi-tier architectures based on requirements',
              'Determining scaling strategies for components used in an architecture design',
              'Determining the AWS services required to achieve loose coupling based on requirements',
              'Determining when to use containers',
              'Determining when to use serverless technologies and patterns',
              'Recommending appropriate compute, storage, networking, and database technologies based on requirements',
              'Using purpose-built AWS services for workloads'
            ]
          },
          {
            statement: 'Design highly available and/or fault-tolerant architectures',
            skills: [
              'Determining automation strategies to ensure infrastructure integrity',
              'Determining the AWS services required to provide a highly available and/or fault-tolerant architecture across Regions or Availability Zones',
              'Identifying metrics based on business requirements to deliver a highly available solution',
              'Implementing designs to mitigate single points of failure',
              'Implementing strategies to ensure the durability and availability of data (for example, backups)',
              'Selecting an appropriate DR strategy to meet business requirements',
              'Using AWS services that improve the reliability of legacy applications and applications not built for the cloud',
              'Using purpose-built AWS services for workloads'
            ]
          }
        ]
      },
      {
        domain: 'Design High-Performing Architectures',
        weight: '24%',
        taskStatements: [
          {
            statement: 'Determine high-performing and/or scalable storage solutions',
            skills: [
              'Determining storage services and configurations that meet performance demands',
              'Determining storage services that can scale to accommodate future needs'
            ]
          },
          {
            statement: 'Design high-performing and elastic compute solutions',
            skills: [
              'Decoupling workloads so that components can scale independently',
              'Identifying metrics and conditions to perform scaling actions',
              'Selecting the appropriate compute options and features (for example, EC2 instance types) to meet business requirements',
              'Selecting the appropriate resource type and size (for example, the amount of Lambda memory) to meet business requirements'
            ]
          },
          {
            statement: 'Determine high-performing database solutions',
            skills: [
              'Configuring read replicas to meet business requirements',
              'Designing database architectures',
              'Determining an appropriate database engine (for example, MySQL compared with PostgreSQL)',
              'Determining an appropriate database type (for example, Amazon Aurora, Amazon DynamoDB)',
              'Integrating caching to meet business requirements'
            ]
          },
          {
            statement: 'Determine high-performing and/or scalable network architectures',
            skills: [
              'Creating a network topology for various architectures (for example, global, hybrid, multi-tier)',
              'Determining network configurations that can scale to accommodate future needs',
              'Determining the appropriate placement of resources to meet business requirements',
              'Selecting the appropriate load balancing strategy'
            ]
          },
          {
            statement: 'Determine high-performing data ingestion and transformation solutions',
            skills: [
              'Building and securing data lakes',
              'Designing data streaming architectures',
              'Designing data transfer solutions',
              'Implementing visualization strategies',
              'Selecting appropriate compute options for data processing (for example, Amazon EMR)',
              'Selecting appropriate configurations for ingestion',
              'Transforming data between formats (for example, .csv to .parquet)'
            ]
          }
        ]
      },
      {
        domain: 'Design Cost-Optimized Architectures',
        weight: '20%',
        taskStatements: [
          {
            statement: 'Design cost-optimized storage solutions',
            skills: [
              'Designing appropriate storage strategies (for example, batch uploads to Amazon S3 compared with individual uploads)',
              'Determining the correct storage size for a workload',
              'Determining the lowest cost method of transferring data for a workload to AWS storage',
              'Determining when storage auto scaling is required',
              'Managing S3 object lifecycles',
              'Selecting the appropriate backup and/or archival solution',
              'Selecting the appropriate service for data migration to storage services',
              'Selecting the appropriate storage tier',
              'Selecting the correct data lifecycle for storage',
              'Selecting the most cost-effective storage service for a workload'
            ]
          },
          {
            statement: 'Design cost-optimized compute solutions',
            skills: [
              'Determining an appropriate load balancing strategy (for example, ALB compared with NLB compared with Gateway Load Balancer)',
              'Determining appropriate scaling methods and strategies for elastic workloads (for example, horizontal compared with vertical, EC2 hibernation)',
              'Determining cost-effective AWS compute services with appropriate use cases (for example, AWS Lambda, Amazon EC2, AWS Fargate)',
              'Determining the required availability for different classes of workloads (for example, production compared with non-production)',
              'Selecting the appropriate instance family for a workload',
              'Selecting the appropriate instance size for a workload'
            ]
          },
          {
            statement: 'Design cost-optimized database solutions',
            skills: [
              'Designing appropriate backup and retention policies (for example, snapshot frequency)',
              'Determining an appropriate database engine (for example, MySQL compared with PostgreSQL)',
              'Determining cost-effective AWS database services with appropriate use cases (for example, DynamoDB compared with Amazon RDS, serverless)',
              'Determining cost-effective AWS database types (for example, time series format, columnar format)',
              'Migrating database schemas and data to different locations and/or different database engines'
            ]
          },
          {
            statement: 'Design cost-optimized network architectures',
            skills: [
              'Configuring appropriate NAT gateway types for a network (for example, single shared NAT gateway compared with per-AZ NAT gateways)',
              'Configuring appropriate network connections (for example, AWS Direct Connect compared with VPN compared with internet)',
              'Configuring appropriate network routes to minimize network transfer costs (for example, Region to Region, AZ to AZ, private to public, VPC endpoints)',
              'Determining strategic needs for content delivery networks (CDNs) and edge caching',
              'Reviewing existing workloads for network optimizations',
              'Selecting an appropriate throttling strategy',
              'Selecting the appropriate bandwidth allocation for a network device (for example, single VPN compared with multiple VPNs, Direct Connect speed)'
            ]
          }
        ]
      }
    ],
    examFacts: [
      { label: 'Format', value: 'Multiple choice & multiple response' },
      { label: 'Questions', value: '65 total' },
      { label: 'Length', value: '130 minutes' },
      { label: 'Passing score', value: '720 out of 1,000' },
      { label: 'Cost', value: '$150 USD' },
      { label: 'Target candidate', value: 'At least 1 year of hands-on experience designing cloud solutions on AWS' }
    ],
    technologiesAndConcepts: [
      'Compute',
      'Cost management',
      'Database',
      'Disaster recovery',
      'High performance',
      'Management and governance',
      'Microservices and component delivery',
      'Migration and data transfer',
      'Networking, connectivity, and content delivery',
      'Resiliency',
      'Security',
      'Serverless and event-driven design principles',
      'Storage'
    ],
    inScopeServices: [
      { category: 'Analytics', services: ['Amazon Athena', 'AWS Data Exchange', 'Amazon Data Firehose', 'Amazon EMR', 'AWS Glue', 'Amazon Kinesis', 'AWS Lake Formation', 'Amazon MSK', 'Amazon OpenSearch Service', 'Amazon QuickSight', 'Amazon Redshift'] },
      { category: 'Application Integration', services: ['Amazon AppFlow', 'Amazon EventBridge', 'Amazon MQ', 'Amazon SNS', 'Amazon SQS', 'AWS Step Functions'] },
      { category: 'AWS Cost Management', services: ['AWS Budgets', 'AWS Cost and Usage Report', 'AWS Cost Explorer', 'Savings Plans'] },
      { category: 'Compute', services: ['AWS Batch', 'Amazon EC2', 'Amazon EC2 Auto Scaling', 'AWS Elastic Beanstalk', 'AWS Outposts', 'AWS Serverless Application Repository', 'VMware Cloud on AWS', 'AWS Wavelength'] },
      { category: 'Containers', services: ['Amazon ECR', 'Amazon ECS', 'Amazon ECS Anywhere', 'Amazon EKS', 'Amazon EKS Anywhere', 'Amazon EKS Distro'] },
      { category: 'Database', services: ['Amazon Aurora', 'Amazon Aurora Serverless', 'Amazon DocumentDB', 'Amazon DynamoDB', 'Amazon ElastiCache', 'Amazon Keyspaces', 'Amazon Neptune', 'Amazon RDS', 'Amazon Redshift'] },
      { category: 'Developer Tools', services: ['AWS X-Ray'] },
      { category: 'Front-End Web and Mobile', services: ['AWS Amplify', 'Amazon API Gateway', 'AWS Device Farm'] },
      {
        category: 'Machine Learning',
        services: ['Amazon Comprehend', 'Amazon Lex', 'Amazon Polly', 'Amazon Rekognition', 'Amazon SageMaker AI', 'Amazon Textract', 'Amazon Transcribe', 'Amazon Translate']
      },
      {
        category: 'Management and Governance',
        services: [
          'AWS Auto Scaling',
          'AWS CLI',
          'AWS CloudFormation',
          'AWS CloudTrail',
          'Amazon CloudWatch',
          'AWS Compute Optimizer',
          'AWS Config',
          'AWS Control Tower',
          'AWS Health Dashboard',
          'AWS License Manager',
          'Amazon Managed Grafana',
          'Amazon Managed Service for Prometheus',
          'AWS Management Console',
          'AWS Organizations',
          'AWS Service Catalog',
          'AWS Systems Manager',
          'AWS Trusted Advisor',
          'AWS Well-Architected Tool'
        ]
      },
      { category: 'Media Services', services: ['Amazon Elastic Transcoder', 'Amazon Kinesis Video Streams'] },
      { category: 'Migration and Transfer', services: ['AWS Application Migration Service', 'AWS DataSync', 'AWS DMS', 'AWS Snow Family', 'AWS Transfer Family'] },
      {
        category: 'Networking and Content Delivery',
        services: [
          'AWS Client VPN',
          'Amazon CloudFront',
          'AWS Direct Connect',
          'Elastic Load Balancing (ELB)',
          'AWS Global Accelerator',
          'AWS PrivateLink',
          'Amazon Route 53',
          'AWS Site-to-Site VPN',
          'AWS Transit Gateway',
          'Amazon VPC'
        ]
      },
      {
        category: 'Security, Identity, and Compliance',
        services: [
          'AWS Artifact',
          'AWS Certificate Manager (ACM)',
          'AWS CloudHSM',
          'Amazon Cognito',
          'Amazon Detective',
          'AWS Directory Service',
          'AWS Firewall Manager',
          'Amazon GuardDuty',
          'AWS IAM Identity Center',
          'Amazon Inspector',
          'AWS KMS',
          'Amazon Macie',
          'AWS Network Firewall',
          'AWS Resource Access Manager (AWS RAM)',
          'AWS Secrets Manager',
          'AWS Security Hub',
          'AWS Shield',
          'AWS WAF',
          'IAM'
        ]
      },
      { category: 'Serverless', services: ['AWS Fargate', 'AWS Lambda'] },
      { category: 'Storage', services: ['AWS Backup', 'Amazon EBS', 'Amazon EFS', 'Amazon FSx', 'Amazon S3', 'Amazon S3 Glacier', 'AWS Storage Gateway'] }
    ],
    outOfScopeServices: [
      { category: 'Application Integration', services: ['Amazon MWAA'] },
      { category: 'AR and VR', services: ['Amazon Sumerian'] },
      { category: 'Blockchain', services: ['Amazon Managed Blockchain'] },
      { category: 'Compute', services: ['Amazon Lightsail'] },
      { category: 'Database', services: ['Amazon RDS on VMware'] },
      {
        category: 'Developer Tools',
        services: ['AWS CDK', 'AWS CloudShell', 'AWS CodeArtifact', 'AWS CodeBuild', 'AWS CodeCommit', 'AWS CodeDeploy', 'Amazon Corretto', 'AWS Fault Injection Simulator (AWS FIS)', 'AWS Tools and SDKs']
      },
      { category: 'Front-End Web and Mobile', services: ['Amazon Location Service'] },
      { category: 'Game Tech', services: ['Amazon GameLift'] },
      { category: 'Internet of Things', services: ['All services'] },
      {
        category: 'Machine Learning',
        services: [
          'Apache MXNet on AWS',
          'AWS DeepComposer',
          'AWS Deep Learning AMIs (DLAMI)',
          'AWS Deep Learning Containers',
          'Amazon DevOps Guru',
          'Amazon Elastic Inference',
          'Amazon HealthLake',
          'AWS Inferentia',
          'Amazon Personalize',
          'PyTorch on AWS',
          'TensorFlow on AWS'
        ]
      },
      { category: 'Management and Governance', services: ['AWS Console Mobile Application', 'AWS Distro for OpenTelemetry'] },
      {
        category: 'Media Services',
        services: [
          'AWS Elemental Appliances and Software',
          'AWS Elemental MediaConnect',
          'AWS Elemental MediaConvert',
          'AWS Elemental MediaLive',
          'AWS Elemental MediaPackage',
          'AWS Elemental MediaTailor',
          'Amazon IVS'
        ]
      },
      { category: 'Migration and Transfer', services: ['Migration Evaluator'] },
      { category: 'Networking and Content Delivery', services: ['AWS Cloud Map'] },
      { category: 'Quantum Technologies', services: ['Amazon Braket'] },
      { category: 'Satellite', services: ['AWS Ground Station'] }
    ]
  }
];
