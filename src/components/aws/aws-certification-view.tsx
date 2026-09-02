'use client';

import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';
import PieChart from '@cloudscape-design/components/pie-chart';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import { AwsQuizRunner } from '@/components/aws/aws-quiz-runner';
import type { AwsCertification, AwsServiceScope } from '@/data/aws/aws-certifications';
import { awsQuiz } from '@/data/aws/aws-quiz';
import { awsSaaQuiz } from '@/data/aws/aws-saa-quiz';

const QUIZ_BY_CERT: Record<AwsCertification['id'], typeof awsQuiz> = {
  'CLF-C02': awsQuiz,
  'SAA-C03': awsSaaQuiz
};

// Maps official AWS service names (as they appear in the exam guide's in/out-of-scope lists) to
// the slug of our curated deep-dive page, where one exists — only exact, verified aliases; no
// fuzzy/substring matching, since a wrong match would send someone to the wrong service.
const SERVICE_ALIASES: Record<string, string> = {
  IAM: 'iam',
  'AWS KMS': 'kms',
  'AWS Secrets Manager': 'secrets-manager',
  'AWS Systems Manager': 'parameter-store',
  'Amazon EC2': 'ec2',
  'Amazon EC2 Auto Scaling': 'auto-scaling-elb',
  'AWS Auto Scaling': 'auto-scaling-elb',
  'Elastic Load Balancing (ELB)': 'auto-scaling-elb',
  'AWS Lambda': 'lambda',
  'Amazon S3': 's3',
  'Amazon RDS': 'rds',
  'Amazon DynamoDB': 'dynamodb',
  'Amazon ElastiCache': 'elasticache',
  'Amazon VPC': 'vpc',
  'Amazon Route 53': 'route53',
  'Amazon CloudFront': 'cloudfront',
  'Amazon SQS': 'sqs',
  'Amazon SNS': 'sns',
  'Amazon SES': 'ses',
  'Amazon CloudWatch': 'cloudwatch',
  'AWS Budgets': 'billing-cost-management',
  'AWS Cost Explorer': 'billing-cost-management',
  'AWS Cost and Usage Reports': 'billing-cost-management',
  'AWS Cost and Usage Report': 'billing-cost-management',
  'AWS Support': 'billing-cost-management',
  'AWS Well-Architected Tool': 'well-architected'
};

function ExamGuideOverview({ cert }: Readonly<{ cert: AwsCertification }>) {
  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Exam Domains</Header>}>
        <PieChart
          data={cert.examDomains.map((d) => ({ title: d.domain, value: Number.parseInt(d.weight, 10) }))}
          detailPopoverContent={(datum) => [{ key: 'Weight', value: `${datum.value}%` }]}
          segmentDescription={(datum) => `${datum.value}%`}
          hideFilter
          size="medium"
          ariaDescription="Exam domain weightings"
          ariaLabel="Exam domain weightings"
        />
      </Container>
      <Container header={<Header variant="h2">Exam Facts</Header>}>
        <KeyValuePairs columns={2} items={cert.examFacts} />
      </Container>
      <Container header={<Header variant="h2">Task Statements by Domain</Header>}>
        <SpaceBetween size="s">
          {cert.examDomains.map((d) => (
            <ExpandableSection key={d.domain} variant="container" headerText={`${d.domain} (${d.weight})`}>
              <SpaceBetween size="s">
                {d.taskStatements.map((task) => (
                  <div key={task.statement}>
                    <Box fontWeight="bold">{task.statement}</Box>
                    <ul className="m-0 list-disc space-y-1 pl-5">
                      {task.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </SpaceBetween>
            </ExpandableSection>
          ))}
        </SpaceBetween>
      </Container>
      <Container header={<Header variant="h2">Technologies and Concepts</Header>}>
        <SpaceBetween direction="horizontal" size="xs">
          {cert.technologiesAndConcepts.map((item) => (
            <Badge key={item} color="blue">
              {item}
            </Badge>
          ))}
        </SpaceBetween>
      </Container>
      <ColumnLayout columns={2}>
        <Container header={<Header variant="h2">In-Scope AWS Services</Header>}>
          <ScopeList scope={cert.inScopeServices} />
        </Container>
        <Container header={<Header variant="h2">Out-of-Scope AWS Services</Header>}>
          <SpaceBetween size="s">
            <Alert type="info">These services and features are called out by AWS as explicitly not tested on this exam.</Alert>
            <ScopeList scope={cert.outOfScopeServices} />
          </SpaceBetween>
        </Container>
      </ColumnLayout>
      <Box>
        <Link href={cert.examGuideUrl} external target="_blank">
          View the official {cert.id} exam guide
        </Link>
      </Box>
    </SpaceBetween>
  );
}

function ScopeList({ scope }: Readonly<{ scope: AwsServiceScope[] }>) {
  return (
    <SpaceBetween size="s">
      {scope.map((s) => (
        <ExpandableSection key={s.category} variant="container" headerText={s.category}>
          <SpaceBetween direction="horizontal" size="xs">
            {s.services.map((service) => {
              const slug = SERVICE_ALIASES[service];
              return slug ? (
                <Link key={service} href={`/aws/${slug}`}>
                  {service}
                </Link>
              ) : (
                <Badge key={service}>{service}</Badge>
              );
            })}
          </SpaceBetween>
        </ExpandableSection>
      ))}
    </SpaceBetween>
  );
}

export function AwsCertificationView({ cert }: Readonly<{ cert: AwsCertification }>) {
  return (
    <SpaceBetween size="l">
      <Header variant="h1" description={cert.fullName}>
        {cert.name}
      </Header>
      <Tabs
        tabs={[
          { id: 'exam-guide', label: 'Exam Guide', content: <ExamGuideOverview cert={cert} /> },
          { id: 'quiz', label: 'Quiz', content: <AwsQuizRunner questions={QUIZ_BY_CERT[cert.id]} /> }
        ]}
      />
    </SpaceBetween>
  );
}
