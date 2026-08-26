import type { Article } from '@/types/content';

export const featureFlagArticle: Article = {
  id: 'feature-flags',
  slug: 'feature-flags-from-ui-to-database',
  category: 'Full Stack',
  title: 'Feature Flags: Building a Feature Toggle System from UI to Database',
  summary:
    'Learn what feature flags are, why teams use them, and how to build a basic feature flag system that connects an admin UI, API, database, and application code. The article gradually expands the implementation from a simple on/off toggle to user targeting, percentage rollouts, kill switches, caching, and operational concerns.',
  topics: ['Feature Flags', 'React', 'Next.js', 'Backend', 'Database', 'Software Architecture', 'Deployment'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'heading',
      id: 'what-is-a-feature-flag',
      level: 2,
      text: 'What Is a Feature Flag?'
    },
    {
      type: 'paragraph',
      text: 'A feature flag is a configuration value that controls whether a piece of functionality is enabled or disabled at runtime. Instead of deploying different versions of an application, the application checks the current value of a flag and decides which behavior to expose.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const newDashboardEnabled = true;

return newDashboardEnabled
  ? <NewDashboard />
  : <Dashboard />;`
    },
    {
      type: 'paragraph',
      text: 'The example above is the simplest possible feature flag. In a real application, the value would usually come from a configuration system, API, database, or dedicated feature flag service rather than being hardcoded into the source code.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'The key idea',
      text: 'A deployment makes code available. A feature flag controls whether that code is active.'
    },

    {
      type: 'heading',
      id: 'why-feature-flags-exist',
      level: 2,
      text: 'Why Do We Need Feature Flags?'
    },
    {
      type: 'paragraph',
      text: 'Without feature flags, releasing a feature usually means building the code, testing it, deploying it, and making it available to everyone at the same time.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `Build
  ↓
Test
  ↓
Deploy
  ↓
Everyone gets the feature`
    },
    {
      type: 'paragraph',
      text: 'That approach works until a team wants more control over who receives a feature and when.'
    },
    {
      type: 'paragraph',
      text: 'With feature flags, the code can already be deployed while the feature remains disabled.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `Build
  ↓
Test
  ↓
Deploy
  ↓
Feature remains OFF
  ↓
Enable for selected users
  ↓
Enable for everyone`
    },
    {
      type: 'paragraph',
      text: 'This separates deployment from release. The application can contain the new functionality without immediately exposing it to every user.'
    },

    {
      type: 'heading',
      id: 'real-world-example',
      level: 2,
      text: 'A Simple Real-World Example'
    },
    {
      type: 'paragraph',
      text: 'Imagine a team is building a completely redesigned dashboard. The implementation is finished and deployed, but the team wants internal users to test it before making it available to all customers.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function Dashboard() {
  const isNewDashboardEnabled =
    useFeatureFlag('new-dashboard');

  if (isNewDashboardEnabled) {
    return <NewDashboard />;
  }

  return <OldDashboard />;
}`
    },
    {
      type: 'paragraph',
      text: 'The same deployed application can now show different behavior depending on the value of new-dashboard.'
    },

    {
      type: 'heading',
      id: 'feature-flag-types',
      level: 2,
      text: 'Common Types of Feature Flags'
    },
    {
      type: 'table',
      columns: ['Type', 'Purpose', 'Example'],
      rows: [
        ['Release flag', 'Control whether a new feature is available', 'Enable the new dashboard after testing'],
        ['Experiment flag', 'Compare different implementations or experiences', 'Show version A to one group and version B to another'],
        [
          'Permission or entitlement flag',
          'Control access to functionality for a specific customer or plan',
          'Enable advanced reporting for enterprise customers'
        ],
        ['Operational flag', 'Enable or disable expensive or risky functionality', 'Temporarily disable AI processing during an incident'],
        ['Kill switch', 'Immediately disable a problematic feature', 'Turn off a failing payment integration without redeploying']
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Feature flags are not authorization',
      text: 'A feature flag can control whether a user sees or accesses a feature, but it should not be your only security mechanism. If an API performs a sensitive operation, the API must still enforce authorization independently.'
    },

    {
      type: 'heading',
      id: 'feature-flags-vs-environment-variables',
      level: 2,
      text: 'Feature Flags vs Environment Variables'
    },
    {
      type: 'paragraph',
      text: 'Environment variables and feature flags can both influence application behavior, but they solve different problems.'
    },
    {
      type: 'table',
      columns: ['Environment Variables', 'Feature Flags'],
      rows: [
        ['Usually configured per deployment environment', 'Can be changed independently of a deployment'],
        ['Commonly used for configuration and secrets', 'Commonly used to control application behavior and releases'],
        ['Often require a restart or redeployment to change', 'Can be designed to update dynamically'],
        ['Usually global for an environment', 'Can target individual users, groups, or percentages']
      ]
    },
    {
      type: 'paragraph',
      text: 'For example, a database connection string belongs in configuration. Deciding whether 10 percent of users should see a new dashboard is a feature flag problem.'
    },

    {
      type: 'heading',
      id: 'architecture-overview',
      level: 2,
      text: 'Our Feature Flag Architecture'
    },
    {
      type: 'paragraph',
      text: 'For this article, we will build a small feature flag system ourselves. The goal is not to recreate a large feature management platform. The goal is to understand the complete path from an administrator changing a flag to the application changing its behavior.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `Admin Settings UI
        ↓
    API Request
        ↓
Feature Flag Service
        ↓
     Database
        ↓
Application reads flags
        ↓
 Feature ON or OFF`
    },
    {
      type: 'paragraph',
      text: 'We will start with a global boolean flag and gradually add more realistic capabilities.'
    },

    {
      type: 'heading',
      id: 'phase-one-data-model',
      level: 2,
      text: 'Phase 1: Designing the Feature Flag Data Model'
    },
    {
      type: 'paragraph',
      text: 'A basic feature flag only needs enough information to identify the flag and determine whether it is enabled.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}`
    },
    {
      type: 'paragraph',
      text: 'A database record could look like this.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `{
  id: 'flag_001',
  key: 'new-dashboard',
  name: 'New Dashboard',
  description: 'Enable the redesigned dashboard',
  enabled: false,
  createdAt: new Date(),
  updatedAt: new Date()
}`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Use stable keys',
      text: 'The key is usually what application code references. Treat it as a stable identifier. Renaming a user-facing feature name is easy. Renaming a flag key can require updating application code and configuration everywhere.'
    },

    {
      type: 'heading',
      id: 'database-schema',
      level: 3,
      text: 'A Basic Database Schema'
    },
    {
      type: 'paragraph',
      text: 'The exact database technology does not matter for understanding the architecture. A relational schema could be represented conceptually like this.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `FeatureFlag
────────────────────────────
id            string
key           string UNIQUE
name          string
description   string
enabled       boolean
createdAt     datetime
updatedAt     datetime`
    },
    {
      type: 'paragraph',
      text: 'The important constraint is that key should be unique. Two different features should not accidentally share the same application identifier.'
    },

    {
      type: 'heading',
      id: 'feature-flag-api',
      level: 2,
      text: 'Phase 2: Creating the Feature Flag API'
    },
    {
      type: 'paragraph',
      text: 'The application needs a way to retrieve feature flags, and an administrator needs a way to update them.'
    },
    {
      type: 'table',
      columns: ['Method', 'Endpoint', 'Purpose'],
      rows: [
        ['GET', '/api/feature-flags', 'Retrieve all available feature flags'],
        ['GET', '/api/feature-flags/:key', 'Retrieve a specific feature flag'],
        ['PATCH', '/api/feature-flags/:key', 'Update the state or configuration of a flag']
      ]
    },
    {
      type: 'paragraph',
      text: 'A request to update a flag could look like this.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `PATCH /api/feature-flags/new-dashboard

{
  "enabled": true
}`
    },
    {
      type: 'paragraph',
      text: 'The server should validate the request, locate the feature flag, update the database, and return the updated value.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `async function updateFeatureFlag(
  key: string,
  enabled: boolean
) {
  const featureFlag =
    await database.featureFlag.findUnique({
      where: {
        key
      }
    });

  if (!featureFlag) {
    throw new Error('Feature flag not found');
  }

  return database.featureFlag.update({
    where: {
      key
    },
    data: {
      enabled
    }
  });
}`
    },

    {
      type: 'heading',
      id: 'admin-ui',
      level: 2,
      text: 'Phase 3: Building the Admin UI'
    },
    {
      type: 'paragraph',
      text: 'The administrator needs a simple interface for viewing and changing feature flags.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function FeatureFlagSettings({
  flags
}: {
  flags: FeatureFlag[];
}) {
  return (
    <section>
      <h1>Feature Flags</h1>

      {flags.map((flag) => (
        <FeatureFlagToggle
          key={flag.key}
          flag={flag}
        />
      ))}
    </section>
  );
}`
    },
    {
      type: 'paragraph',
      text: 'Each toggle can update the API when its value changes.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `async function toggleFeatureFlag(
  key: string,
  enabled: boolean
) {
  await fetch(
    \`/api/feature-flags/\${key}\`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        enabled
      })
    }
  );
}`
    },
    {
      type: 'paragraph',
      text: 'The complete flow now looks like this.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `Administrator clicks toggle
          ↓
React updates local UI state
          ↓
PATCH request is sent
          ↓
API validates request
          ↓
Database is updated
          ↓
Updated flag is returned`
    },

    {
      type: 'heading',
      id: 'reading-feature-flags',
      level: 2,
      text: 'Phase 4: Reading Feature Flags in the Application'
    },
    {
      type: 'paragraph',
      text: 'The application needs a consistent way to check whether a feature is enabled.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `async function isFeatureEnabled(
  key: string
): Promise<boolean> {
  const flag =
    await database.featureFlag.findUnique({
      where: {
        key
      }
    });

  return flag?.enabled ?? false;
}`
    },
    {
      type: 'paragraph',
      text: 'Using false as the fallback means an unknown or missing feature flag does not accidentally enable functionality.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `async function Dashboard() {
  const enabled =
    await isFeatureEnabled('new-dashboard');

  if (enabled) {
    return <NewDashboard />;
  }

  return <OldDashboard />;
}`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Fail-safe defaults',
      text: 'For many release flags, disabled is the safest fallback. The correct fallback depends on the feature. A critical safety mechanism might need the opposite behavior, so fallback decisions should be intentional.'
    },

    {
      type: 'heading',
      id: 'client-and-server-evaluation',
      level: 2,
      text: 'Client-Side vs Server-Side Flag Evaluation'
    },
    {
      type: 'paragraph',
      text: 'Feature flags can be evaluated on the server, in the browser, or through a combination of both.'
    },
    {
      type: 'table',
      columns: ['Approach', 'Advantages', 'Considerations'],
      rows: [
        [
          'Server-side',
          'Keeps flag logic and sensitive targeting rules on the server',
          'Requires the server to evaluate flags before responding'
        ],
        [
          'Client-side',
          'Useful for dynamic UI changes without a full page reload',
          'Flag data exposed to the browser must not contain secrets'
        ],
        [
          'Hybrid',
          'Server evaluates initial state while the client receives allowed flag values',
          'Requires careful synchronization between server and client'
        ]
      ]
    },
    {
      type: 'paragraph',
      text: 'A useful rule is simple: if revealing the existence or configuration of a feature would be sensitive, evaluate it on the server. Do not send secret rollout rules to the browser and hope nobody opens developer tools. Browsers are famously curious.'
    },

    {
      type: 'heading',
      id: 'user-targeting',
      level: 2,
      text: 'Phase 5: Targeting Specific Users'
    },
    {
      type: 'paragraph',
      text: 'A global boolean flag is useful, but real feature rollouts often need more control. A team might want to enable a feature only for internal users, beta testers, or a specific customer.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface FeatureFlagRule {
  type: 'user';
  userIds: string[];
}

interface FeatureFlag {
  key: string;
  enabled: boolean;
  rules?: FeatureFlagRule[];
}`
    },
    {
      type: 'paragraph',
      text: 'The evaluation logic can now consider the current user.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `function isFeatureEnabledForUser(
  flag: FeatureFlag,
  userId: string
) {
  if (!flag.enabled) {
    return false;
  }

  const userRule =
    flag.rules?.find(
      (rule) => rule.type === 'user'
    );

  if (!userRule) {
    return true;
  }

  return userRule.userIds.includes(userId);
}`
    },
    {
      type: 'paragraph',
      text: 'This allows the same application deployment to expose a feature to selected users while keeping it hidden from everyone else.'
    },

    {
      type: 'heading',
      id: 'percentage-rollouts',
      level: 2,
      text: 'Phase 6: Percentage Rollouts'
    },
    {
      type: 'paragraph',
      text: 'A percentage rollout allows a feature to be gradually exposed to more users.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
}`
    },
    {
      type: 'paragraph',
      text: 'A naive implementation might randomly decide whether the feature is enabled.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const enabled =
  Math.random() * 100 < 10;`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not use random evaluation',
      text: 'A random value can produce inconsistent results. The same user might see the new dashboard on one request and the old dashboard on the next.'
    },
    {
      type: 'paragraph',
      text: 'Instead, the application can consistently map a user identifier into a percentage bucket.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `function getUserBucket(
  userId: string
) {
  let hash = 0;

  for (const character of userId) {
    hash =
      (hash * 31 + character.charCodeAt(0)) | 0;
  }

  return Math.abs(hash) % 100;
}

function isIncludedInRollout(
  userId: string,
  percentage: number
) {
  return getUserBucket(userId) < percentage;
}`
    },
    {
      type: 'paragraph',
      text: 'If the rollout percentage is 10, users consistently assigned to buckets 0 through 9 receive the feature. Increasing the rollout to 25 expands the same group while adding more users.'
    },

    {
      type: 'heading',
      id: 'kill-switches',
      level: 2,
      text: 'Feature Flags as Kill Switches'
    },
    {
      type: 'paragraph',
      text: 'One of the most valuable uses of feature flags is the ability to quickly disable a problematic feature.'
    },
    {
      type: 'paragraph',
      text: 'Imagine a newly released report generation system begins causing severe database load.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const reportsEnabled =
  await isFeatureEnabled(
    'advanced-reports'
  );

if (!reportsEnabled) {
  return <FeatureUnavailable />;
}

return <AdvancedReports />;`
    },
    {
      type: 'paragraph',
      text: 'If the flag can be updated dynamically, an administrator can disable the feature without waiting for a new application build and deployment.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Design for failure',
      text: 'A kill switch is most useful when the disabled state is safe and predictable. The fallback behavior should be designed before the incident, not invented while production is on fire.'
    },

    {
      type: 'heading',
      id: 'database-query-problem',
      level: 2,
      text: 'The Database Query Problem'
    },
    {
      type: 'paragraph',
      text: 'Our simple implementation has a major problem. Every feature check can potentially create a database query.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const dashboard =
  await isFeatureEnabled('new-dashboard');

const reports =
  await isFeatureEnabled('advanced-reports');

const search =
  await isFeatureEnabled('new-search');`
    },
    {
      type: 'paragraph',
      text: 'As an application grows, repeatedly querying the database for relatively stable configuration can become unnecessarily expensive.'
    },

    {
      type: 'heading',
      id: 'caching-feature-flags',
      level: 2,
      text: 'Caching Feature Flags'
    },
    {
      type: 'paragraph',
      text: 'Feature flags are usually read far more often than they are updated. That makes them good candidates for caching.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `let cachedFlags:
  | Map<string, boolean>
  | undefined;

async function getFeatureFlags() {
  if (cachedFlags) {
    return cachedFlags;
  }

  const flags =
    await database.featureFlag.findMany();

  cachedFlags = new Map(
    flags.map((flag) => [
      flag.key,
      flag.enabled
    ])
  );

  return cachedFlags;
}`
    },
    {
      type: 'paragraph',
      text: 'A production system would usually add a cache expiration strategy rather than keeping the values indefinitely.'
    },
    {
      type: 'table',
      columns: ['Strategy', 'Trade-off'],
      rows: [
        ['No cache', 'Always receives the latest value but increases database or service load'],
        ['Time-based cache', 'Reduces load but changes may take time to propagate'],
        ['Event-based invalidation', 'Updates quickly but requires more infrastructure'],
        ['Dedicated feature flag service', 'Handles caching and distribution but adds an external dependency']
      ]
    },

    {
      type: 'heading',
      id: 'when-feature-flags-fail',
      level: 2,
      text: 'What Happens When the Feature Flag System Fails?'
    },
    {
      type: 'paragraph',
      text: 'A feature flag system becomes part of the application infrastructure. That means teams need to decide what happens when the database, cache, or feature flag provider is unavailable.'
    },
    {
      type: 'paragraph',
      text: 'For every important flag, define a fallback.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `async function isFeatureEnabled(
  key: string
): Promise<boolean> {
  try {
    const flag =
      await getFeatureFlag(key);

    return flag?.enabled ?? false;
  } catch {
    return false;
  }
}`
    },
    {
      type: 'paragraph',
      text: 'Returning false may be appropriate for an unfinished experimental feature. It may not be appropriate for every type of flag. The fallback should be based on what keeps the application safest and most functional.'
    },

    {
      type: 'heading',
      id: 'feature-flag-lifecycle',
      level: 2,
      text: 'Feature Flags Need a Lifecycle'
    },
    {
      type: 'paragraph',
      text: 'Feature flags are often introduced as temporary release controls. The problem begins when temporary flags become permanent archaeological artifacts scattered throughout the codebase.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `if (isFeatureEnabled('feature-from-2023')) {
  return <NewExperience />;
}

return <OldExperience />;`
    },
    {
      type: 'paragraph',
      text: 'Once a feature has been fully rolled out, the flag and its old code path should usually be removed.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Create the flag',
          text: 'Introduce the flag with a clear purpose and owner.'
        },
        {
          title: 'Deploy the feature disabled',
          text: 'Verify that the new code can safely exist in production.'
        },
        {
          title: 'Roll out gradually',
          text: 'Enable the feature for internal users, selected customers, or increasing percentages of traffic.'
        },
        {
          title: 'Complete the rollout',
          text: 'Enable the feature for the intended audience.'
        },
        {
          title: 'Remove the flag',
          text: 'Delete the obsolete branch and configuration once the rollout is complete.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Flags create technical debt',
      text: 'Every long-lived flag adds another possible application state. A codebase with hundreds of forgotten flags becomes increasingly difficult to reason about and test.'
    },

    {
      type: 'heading',
      id: 'testing-feature-flags',
      level: 2,
      text: 'Testing Applications with Feature Flags'
    },
    {
      type: 'paragraph',
      text: 'Feature flags increase the number of possible application states. At minimum, important functionality should be tested with relevant flags enabled and disabled.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `describe('Dashboard', () => {
  it('renders the old dashboard', () => {
    mockFeatureFlag(
      'new-dashboard',
      false
    );

    render(<Dashboard />);

    expect(
      screen.getByText('Old Dashboard')
    ).toBeInTheDocument();
  });

  it('renders the new dashboard', () => {
    mockFeatureFlag(
      'new-dashboard',
      true
    );

    render(<Dashboard />);

    expect(
      screen.getByText('New Dashboard')
    ).toBeInTheDocument();
  });
});`
    },
    {
      type: 'paragraph',
      text: 'The more flags interact with each other, the more carefully teams need to decide which combinations actually matter. Testing every mathematically possible combination eventually becomes an impressive demonstration of combinatorics and a terrible testing strategy.'
    },

    {
      type: 'heading',
      id: 'when-to-build-vs-buy',
      level: 2,
      text: 'When Should You Build Your Own Feature Flag System?'
    },
    {
      type: 'paragraph',
      text: 'The implementation in this article is useful for understanding how feature flags work and can be sufficient for a small internal application with simple requirements.'
    },
    {
      type: 'paragraph',
      text: 'As requirements grow, a feature flag system can become surprisingly complex.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Multiple environments.',
        'User and organization targeting.',
        'Percentage rollouts.',
        'Audit logs.',
        'Approval workflows.',
        'Real-time updates.',
        'SDKs for multiple applications.',
        'Caching across distributed servers.',
        'Experiment analysis.',
        'Flag ownership and expiration policies.'
      ]
    },
    {
      type: 'paragraph',
      text: 'At that point, a dedicated feature flag platform may be more appropriate than maintaining the infrastructure internally.'
    },
    {
      type: 'table',
      columns: ['Build Your Own', 'Use a Feature Flag Platform'],
      rows: [
        ['Simple internal requirements', 'Complex targeting and experimentation'],
        ['Full control over implementation', 'Managed SDKs and infrastructure'],
        ['No additional platform dependency', 'Audit logs and governance features'],
        ['You maintain scaling and reliability', 'The provider handles much of the operational complexity']
      ]
    },

    {
      type: 'heading',
      id: 'complete-request-flow',
      level: 2,
      text: 'The Complete Flow from UI to Database'
    },
    {
      type: 'paragraph',
      text: 'We can now connect the entire system together.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `1. Administrator opens Settings

2. Application loads feature flags
   from the API

3. Administrator enables
   "new-dashboard"

4. The UI sends a PATCH request

5. The API validates the request

6. The database updates the flag

7. Cached values are invalidated
   or refreshed

8. The application evaluates
   "new-dashboard"

9. Eligible users receive
   the new dashboard`
    },
    {
      type: 'paragraph',
      text: 'The important architectural idea is that the feature implementation and the feature decision are separate. The application contains the code for the new dashboard, while the feature flag system decides whether that code should currently be used.'
    },

    {
      type: 'heading',
      id: 'feature-flags-in-nextjs',
      level: 2,
      text: 'Where Feature Flags Fit in a Next.js Application'
    },
    {
      type: 'paragraph',
      text: 'In a Next.js application, feature flags can be evaluated in several places depending on the type of feature and the required level of security.'
    },
    {
      type: 'table',
      columns: ['Location', 'Useful For'],
      rows: [
        ['Server Components', 'Evaluating flags before rendering server-side content'],
        ['Route Handlers', 'Providing feature flag APIs and administrative operations'],
        ['Client Components', 'Updating non-sensitive UI dynamically'],
        ['Middleware or proxy layer', 'Request-level routing or rollout decisions when appropriate']
      ]
    },
    {
      type: 'paragraph',
      text: 'For example, a Server Component can evaluate a flag before deciding which component tree to render.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `export default async function Page() {
  const enabled =
    await isFeatureEnabled(
      'new-dashboard'
    );

  return enabled
    ? <NewDashboard />
    : <OldDashboard />;
}`
    },

    {
      type: 'heading',
      id: 'key-takeaways',
      level: 2,
      text: 'Key Takeaways'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Feature flags separate deployment from release.',
        'A feature can exist in production while remaining disabled.',
        'A basic feature flag system can connect an admin UI, API, database, and application evaluation layer.',
        'Feature flags are not a replacement for authorization and security checks.',
        'Flags can support global releases, user targeting, percentage rollouts, and kill switches.',
        'Percentage rollouts should consistently assign users to groups rather than randomly changing their experience.',
        'Feature flags are read frequently, so caching and failure behavior need to be considered.',
        'Temporary flags should be removed after a rollout to avoid accumulating technical debt.',
        'Simple applications may benefit from building a small internal solution, while complex requirements may justify a dedicated feature flag platform.'
      ]
    },

    {
      type: 'heading',
      id: 'what-to-build-next',
      level: 2,
      text: 'What to Build Next'
    },
    {
      type: 'paragraph',
      text: 'The next practical step is to build this system inside a small application. Start with a single new-dashboard flag stored in a database, create a Settings page with an administrative toggle, expose an API for reading and updating the flag, and render different dashboard components based on the result.'
    },
    {
      type: 'paragraph',
      text: 'Once that works, add user targeting and percentage rollouts. By then, the difference between a simple boolean in a database and a production-grade feature management system becomes much easier to understand.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A useful extension',
      text: 'Add an audit log that records who changed each feature flag, when the change happened, and what the previous value was. This introduces an important enterprise concern: configuration changes should be observable and traceable.'
    }
  ]
};
