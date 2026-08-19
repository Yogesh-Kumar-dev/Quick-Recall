// ==============================|| TOPICS - CANONICAL REGISTRY ||============================== //

// Single source of truth for the app's learning topics. The sidebar (nav.ts), the path->topic
// resolver (lib/topic-access.ts), the settings card and every gate all key off these ids, so a
// topic can't drift between surfaces.

export type Topic =
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'redux'
  | 'nextjs'
  | 'nodejs'
  | 'html'
  | 'css'
  | 'postgresql'
  | 'mongodb'
  | 'redis'
  | 'dynamodb'
  | 'aws'
  | 'testing'
  | 'web'
  | 'engineering';

export interface TopicMeta {
  id: Topic;
  label: string;
}

export const TOPICS: TopicMeta[] = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'react', label: 'React' },
  { id: 'redux', label: 'Redux' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'redis', label: 'Redis' },
  { id: 'dynamodb', label: 'DynamoDB' },
  { id: 'aws', label: 'AWS' },
  { id: 'testing', label: 'Testing' },
  { id: 'web', label: 'Web Platform' },
  { id: 'engineering', label: 'Engineering' }
];

const TOPIC_LABELS = new Map(TOPICS.map((t) => [t.id, t.label]));

export function topicLabel(topic: Topic): string {
  return TOPIC_LABELS.get(topic) ?? topic;
}

// Every topic on by default. Existing users see no change until they opt out, and a newly added
// topic can never lock anyone out accidentally.
export const DEFAULT_TOPIC_PREFERENCES: Record<Topic, boolean> = {
  javascript: true,
  typescript: true,
  react: true,
  redux: true,
  nextjs: true,
  nodejs: true,
  html: true,
  css: true,
  postgresql: true,
  mongodb: true,
  redis: true,
  dynamodb: true,
  aws: true,
  testing: true,
  web: true,
  engineering: true
};
