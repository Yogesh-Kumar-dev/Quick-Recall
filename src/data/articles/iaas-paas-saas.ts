import type { Article } from '@/types/content';

export const iaasPaasSaasArticle: Article = {
  id: 'iaas-paas-saas',
  slug: 'iaas-paas-saas',
  category: 'Backend',
  title: 'IaaS vs PaaS vs SaaS',
  summary:
    'A from-scratch tour of the three cloud service models: what "as a service" actually means, exactly who manages what at each layer, real providers that fit each bucket, and how to reason about which one fits a given problem.',
  topics: ['Cloud', 'System Design', 'Engineering Essentials'],
  difficulty: 'basic',
  blocks: [
    { type: 'heading', id: 'the-old-world', level: 2, text: 'Start with the world before "as a service" existed' },
    {
      type: 'paragraph',
      text: 'To understand why IaaS, PaaS, and SaaS exist as distinct categories, it helps to first picture life without any of them: running your own application entirely on-premises. That means buying physical servers, racking them in a room with cooling and backup power, running network cables, installing an operating system on each machine by hand, installing a database engine, installing a runtime like Node.js or the JVM, deploying your application code onto it, and then being the one who gets paged at 3am when a hard drive fails or the OS needs a security patch. Every single layer, from the concrete floor the server sits on to the code your team wrote, is something your own team owns and operates.'
    },
    {
      type: 'paragraph',
      text: '"As a service" is really just a name for a spectrum: at what layer does the provider take over, and at what layer does the responsibility stop being yours? IaaS, PaaS, and SaaS are three well-known stops along that same spectrum, each one handing you a bigger, more finished slice of the stack, in exchange for less control over the parts underneath it.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The one mental model that makes all three click',
      text: 'Every layer of a running application, from the physical building down to the actual feature a user clicks on, can be drawn as a stack. On-premises means you own every layer of that stack yourself. IaaS, PaaS, and SaaS are just three different heights at which a provider draws a line and says "everything below this line is our job, everything above it is yours." The higher that line sits, the less you manage, and also the less you can customize.'
    },
    { type: 'heading', id: 'the-full-stack', level: 2, text: 'The full stack, layer by layer' },
    {
      type: 'paragraph',
      text: "Before comparing the three models, it's worth naming every layer that has to exist for an application to run at all, from the bottom up:"
    },
    {
      type: 'list',
      style: 'ordered',
      items: [
        'Networking: the physical cabling, routers, switches, and internet connectivity that let machines talk to each other and to the outside world.',
        'Storage: the physical disks (or SSDs) that hold data at rest.',
        'Servers: the actual physical machines, their CPUs, RAM, and power supplies.',
        'Virtualization: the layer that carves one physical server into multiple isolated virtual machines, so many customers (or many workloads) can safely share the same physical hardware.',
        'Operating System: Linux, Windows Server, or similar, installed and patched on each virtual (or physical) machine.',
        'Runtime: the language runtime or framework your application actually executes inside, like Node.js, the JVM, or a Python interpreter, plus whatever middleware sits alongside it (a web server, a load balancer, a message broker).',
        'Data: your application databases, caches, and file storage, at the level of "a running Postgres instance" or "a running Redis instance," not raw disks.',
        'Application: the actual code your team writes: the business logic, the API endpoints, the UI.'
      ]
    },
    {
      type: 'paragraph',
      text: 'On-premises, your own team owns every one of those eight layers. Each cloud service model simply moves the line of "who owns this layer" further down the list, and that single shift is the entire difference between the three.'
    },
    { type: 'heading', id: 'iaas', level: 2, text: 'IaaS: Infrastructure as a Service' },
    {
      type: 'paragraph',
      text: "IaaS is the cloud service model closest to on-premises, and it's the first rung on the ladder. The provider takes ownership of the physical building, the networking hardware, the physical servers, and the virtualization layer that slices those servers into virtual machines. What they hand you, in return, is a virtual machine: a blank computer, sitting in their data center, that you can remotely connect to and treat almost exactly like a physical server you bought yourself. From the moment you get access to that virtual machine, you are back to being fully responsible for everything above it: choosing and installing the operating system, patching it, installing a runtime, installing a database, deploying your code, configuring a firewall, setting up monitoring, and so on."
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Real examples: Amazon EC2, Google Compute Engine, Microsoft Azure Virtual Machines, DigitalOcean Droplets, Linode.',
        'The provider manages: physical data centers, networking hardware, physical servers, and the virtualization layer that creates your VM.',
        'You manage: the operating system, all patches and security updates to it, the runtime, the database, your application code, scaling decisions, and backups.'
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Why anyone still chooses IaaS in 2026',
      text: 'It sounds like the least convenient option on this list, and in a sense it is, but that inconvenience is exactly the point for certain workloads. IaaS gives you the most control of any cloud model: you can install literally any software stack, tune the operating system kernel itself, run legacy applications that need a very specific environment, or build a highly customized architecture (like a database cluster with a nonstandard configuration) that a more managed platform would never let you build. If your team needs deep, low-level control, or is running something a managed platform simply does not support, IaaS is where you end up.'
    },
    { type: 'heading', id: 'paas', level: 2, text: 'PaaS: Platform as a Service' },
    {
      type: 'paragraph',
      text: 'PaaS moves the line much further up the stack. Instead of handing you a blank virtual machine, the provider hands you a ready-to-use platform: the operating system, the runtime, and typically a managed database, load balancer, and deployment pipeline are all already set up and already being patched and operated for you. What you supply is your application code (and maybe some configuration), and the platform takes care of running it, scaling it, and keeping the machinery underneath it healthy. You generally never SSH into a server or manually patch an operating system on a PaaS.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Real examples: Heroku, Vercel, Render, AWS Elastic Beanstalk, Google App Engine.',
        'The provider manages: everything IaaS manages, plus the operating system, the runtime, patching, scaling infrastructure, and typically the deployment pipeline itself.',
        'You manage: your application code and its configuration, and usually the schema/contents of any database you attach, but not the database server itself.'
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'PaaS is what "git push to deploy" is built on',
      text: "The experience of pushing code and having it just appear live, with no server to configure, is a PaaS experience by definition. This app's own deployment target (see the S3+CloudFront hosting article for the static-site alternative, or a platform like Vercel for a full framework like Next.js) is a good real-world PaaS example: you never touch a virtual machine, you just hand over your build output and the platform runs it."
    },
    { type: 'heading', id: 'saas', level: 2, text: 'SaaS: Software as a Service' },
    {
      type: 'paragraph',
      text: 'SaaS moves the line all the way to the top. There is no infrastructure to think about, no platform to deploy code onto, because the entire application already exists and is already running, owned end to end by the provider. What you get is simply access to a finished product through a browser or an API, usually for a subscription fee, and your job as the end user (or the company paying for it) is limited to configuring settings, managing your own data inside it, and controlling who on your team has access.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Real examples: Gmail, Slack, Salesforce, Notion, Dropbox, Zoom.',
        'The provider manages: literally the entire stack, from the physical data center up through the finished application feature you click on.',
        "You manage: your account, your data inside the product, your team's access permissions, and any configuration the product exposes (custom fields, integrations, and so on)."
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'This very app is not SaaS, and that is deliberate',
      text: 'QuickRecall runs entirely client-side with no backend for most of its features, which is a different axis from IaaS/PaaS/SaaS entirely (it is about where code executes, not who manages the infrastructure). But it is a useful contrast: a tool like Notion is SaaS because you never see or touch any infrastructure at all, you simply use the finished product in your browser. That total abstraction away from infrastructure is the defining trait of SaaS.'
    },
    { type: 'heading', id: 'responsibility-table', level: 2, text: 'Who manages what, layer by layer' },
    {
      type: 'paragraph',
      text: 'This is the single most useful table for actually internalizing the difference between the four models (including plain on-premises as the baseline), and it is also the classic way this topic gets asked about in interviews.'
    },
    {
      type: 'table',
      columns: ['Layer', 'On-Premises', 'IaaS', 'PaaS', 'SaaS'],
      rows: [
        ['Application (your code / the product)', 'You', 'You', 'You', 'Provider'],
        ['Data (databases, files)', 'You', 'You', 'You (content), Provider (server)', 'Provider'],
        ['Runtime (language/framework)', 'You', 'You', 'Provider', 'Provider'],
        ['Middleware', 'You', 'You', 'Provider', 'Provider'],
        ['Operating System', 'You', 'You', 'Provider', 'Provider'],
        ['Virtualization', 'You', 'Provider', 'Provider', 'Provider'],
        ['Servers (physical hardware)', 'You', 'Provider', 'Provider', 'Provider'],
        ['Storage (physical disks)', 'You', 'Provider', 'Provider', 'Provider'],
        ['Networking (physical)', 'You', 'Provider', 'Provider', 'Provider']
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A shortcut for remembering the table',
      text: 'Read the columns left to right: at every step, one more row flips from "You" to "Provider," and it always flips from the bottom up. IaaS flips the bottom four physical/virtualization rows. PaaS additionally flips the OS, middleware, and runtime rows. SaaS flips everything, including the application itself. Nothing ever flips back the other way as you move right, which is exactly why the four columns form a spectrum rather than four unrelated options.'
    },
    { type: 'heading', id: 'control-vs-convenience', level: 2, text: 'The real trade-off: control versus convenience' },
    {
      type: 'paragraph',
      text: 'Every step up this ladder trades away control in exchange for convenience, and neither direction is objectively "better." Moving from IaaS toward SaaS means less operational burden, faster time to a working product, and someone else staying up at 3am for infrastructure incidents, but it also means less customization, less ability to do anything the provider did not explicitly design for, and (usually) a recurring cost that scales with usage in a way that can eventually outpace the cost of owning infrastructure yourself. Moving from SaaS toward IaaS means the opposite: more work and more responsibility, in exchange for the freedom to build exactly what you need, however you need it.'
    },
    {
      type: 'table',
      columns: ['', 'IaaS', 'PaaS', 'SaaS'],
      rows: [
        [
          'Control / customization',
          'Highest: full OS and stack access',
          "Medium: your code, provider's platform",
          'Lowest: only what the product exposes'
        ],
        [
          'Operational burden on you',
          'Highest: you patch and scale everything above the VM',
          'Low: mostly just your application code',
          'None: nothing to operate'
        ],
        ['Typical speed to a working product', 'Slowest: build the stack first', 'Fast: push code, it runs', 'Instant: sign up and use it'],
        ['Who gets paged for an infrastructure outage', 'You', 'The platform provider', 'The SaaS provider'],
        ['Common pricing model', 'Pay for compute/storage you provision', 'Pay per app/usage tier', 'Pay per seat or subscription tier']
      ]
    },
    { type: 'heading', id: 'where-serverless-fits', level: 2, text: 'A quick note on where serverless (FaaS) fits' },
    {
      type: 'paragraph',
      text: "Serverless computing, or Function as a Service (FaaS, things like AWS Lambda or Vercel Functions), is not officially one of the three classic categories, but it is worth placing on the same spectrum because it comes up constantly alongside them. FaaS pushes even further than PaaS: instead of running a whole application process continuously, you deploy a single function, and the provider only spins up compute to run it exactly when it is invoked, then tears that compute back down afterward. It shares PaaS's trait of never touching a server directly, but goes further by removing the concept of a long-running server altogether, which is why it is usually treated as its own, closely related category rather than squeezed into the IaaS/PaaS/SaaS three."
    },
    { type: 'heading', id: 'how-to-choose', level: 2, text: 'How to actually decide between them' },
    {
      type: 'steps',
      items: [
        {
          title: 'Start by asking what already exists as a finished product',
          text: 'If a SaaS product already does exactly what you need (email, chat, CRM, project tracking), building it yourself at any lower layer is almost always the wrong call. SaaS wins by default whenever the problem is generic enough that someone has already solved it well.'
        },
        {
          title: 'If you are building custom software, default to PaaS',
          text: 'For the large majority of applications, especially anything web-facing with a fairly standard shape (a frontend, a backend API, a database), PaaS gets you to a working, scalable product the fastest, with the least operational overhead. This is the sensible default, not the fallback option.'
        },
        {
          title: 'Drop to IaaS only when you hit a real, specific wall',
          text: 'Reach for IaaS when you have a concrete reason a PaaS cannot satisfy: a legacy system that needs a very particular OS configuration, a workload that needs GPU access or kernel-level tuning a platform does not expose, strict compliance requirements demanding control over exactly how infrastructure is configured, or cost optimization at a scale where owning the infrastructure genuinely becomes cheaper than paying a platform premium.'
        },
        {
          title: 'Remember these are not mutually exclusive',
          text: 'A single real-world architecture routinely mixes all three: a company might run its core product on a PaaS, use a handful of IaaS virtual machines for one specialized legacy service, and rely on several SaaS products (Slack, an email provider, a payment processor) to avoid building undifferentiated infrastructure at all. Nobody picks exactly one of these for an entire organization.'
        }
      ]
    },
    { type: 'heading', id: 'interview-trap', level: 2, text: 'A common interview trap: "which one is most secure?"' },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The answer is not "SaaS" or "IaaS," it is the shared responsibility model',
      text: 'A common wrong instinct is to assume SaaS is "most secure" because the provider manages everything, or that IaaS is "most secure" because you control everything yourself. The accurate answer is that security responsibility splits along the exact same line as the table above: the provider is responsible for securing every layer they manage, and you remain responsible for securing every layer you manage, no matter which model you pick. On IaaS, an unpatched operating system is entirely your fault. On SaaS, a weak password on your own account, or an employee you forgot to remove access for, is entirely your fault, even though the underlying product is fully managed. This is usually called the shared responsibility model, and it is worth knowing by that exact name, since cloud providers (especially AWS) reference it explicitly in their own documentation and it comes up constantly in security-focused interview questions.'
    }
  ]
};
