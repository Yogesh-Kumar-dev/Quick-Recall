import type { Article } from '@/types/content';

export const portlessIntroductionArticle: Article = {
  id: 'portless-introduction',
  slug: 'portless-introduction',
  category: 'Backend',
  title: 'Portless: Eliminate localhost Port Chaos with Stable Named URLs',
  summary:
    'A comprehensive guide to Portless, the CLI tool that replaces unpredictable localhost ports with stable, memorable named URLs. Covers the problems it solves, getting started, architecture, advanced configuration, and framework-specific setup for Vite and Next.js.',
  topics: ['DevTools', 'CLI', 'Local Development', 'Development Workflow'],
  difficulty: 'basic',
  blocks: [
    {
      type: 'paragraph',
      text: 'In the dynamic world of web development, you are constantly juggling multiple projects, services, and APIs. Your terminal is a whirl of activity as you spin up front-ends, back-ends, and microservices. Amidst this complexity, one persistent, low-level frustration plagues developers everywhere: the chaotic dance of localhost ports. You have all seen it: the infamous EADDRINUSE error, the scramble to find which application is on localhost:3000 versus localhost:3001, and the constant updating of bookmarks and API endpoints. This "port roulette" is not just an annoyance; it is a drag on productivity and a point of failure for automated workflows. Enter Portless, an elegant and powerful command-line tool from Vercel Labs that tackles this problem head-on by replacing unpredictable, numeric localhost port numbers with stable, memorable, named URLs. Instead of wrestling with localhost:3001, you can simply access your project at http://myapp.localhost, every single time.'
    },
    { type: 'heading', id: 'why-portless-exists', level: 2, text: 'Why portless exists' },
    {
      type: 'paragraph',
      text: 'For a long time, port management in local development was accepted as a necessary evil. Developers built workarounds, mental models, and terminal aliases to cope with the chaos. But what started as minor friction has accumulated into significant lost time and cognitive overhead, especially as development workflows grow more sophisticated.'
    },
    {
      type: 'paragraph',
      text: 'The real breakthrough moment for Portless came when automated workflows—particularly AI-powered development agents—needed reliable, consistent URLs to operate. An agent tasked with "test the login flow on the dashboard" needs a URL that does not change between runs. If that URL is randomly assigned on startup, the agent\'s script becomes brittle and error-prone, requiring complex logic to parse terminal output to "guess" which port the service is actually on. Portless provides these agents (and humans) with the stable, predictable URLs they need, making local development environments truly friendly to both traditional and AI-driven workflows.'
    },
    { type: 'heading', id: 'the-persistent-problem', level: 2, text: 'The persistent problem with localhost ports' },
    {
      type: 'paragraph',
      text: 'Before fully appreciating Portless, it is essential to understand the depth of the problem it solves. These small daily frustrations, when accumulated, represent significant lost time and cognitive overhead.'
    },
    {
      type: 'heading',
      id: 'eaddrinuse',
      level: 3,
      text: 'The dreaded EADDRINUSE error'
    },
    {
      type: 'paragraph',
      text: 'One of the most common and disruptive errors in local development is EADDRINUSE, which stands for "Error: Address already in use." This error occurs when you try to start a new application on a network port that is already occupied by another running process.'
    },
    {
      type: 'paragraph',
      text: "Imagine this scenario: you are working on a project's front-end, which runs on the default port 3000. You then switch to a different terminal tab to start its corresponding back-end API, which, unbeknownst to you, is also configured to use port 3000. The moment you run the start command, your application crashes with an EADDRINUSE error. Now you have to stop, figure out which process is holding the port, either kill it or reconfigure your new application, and then try again. This context-switching breaks your development flow and wastes valuable time."
    },
    {
      type: 'heading',
      id: 'port-roulette',
      level: 3,
      text: 'The chaos of port roulette'
    },
    {
      type: 'paragraph',
      text: 'Modern development frameworks are smart. When they encounter an EADDRINUSE error, many automatically try the next available port. If 3000 is taken, they try 3001. If that is taken, they try 3002, and so on. While this prevents an outright crash, it introduces a different kind of chaos: "port roulette."'
    },
    {
      type: 'paragraph',
      text: 'Your blog project might be on localhost:3001 today, but if you start your e-commerce project first tomorrow, the blog might end up on localhost:3002. This unpredictability means browser bookmarks become useless, API connections break (a front-end application configured to talk to a back-end at a fixed port will fail if that back-end is assigned a different port on startup), and mental overhead increases as you constantly have to check your terminal output to see which port each service is running on. This dynamic behavior turns what should be a stable development environment into a moving target.'
    },
    {
      type: 'heading',
      id: 'ai-agents',
      level: 3,
      text: 'The challenge for AI agents and automation'
    },
    {
      type: 'paragraph',
      text: 'The problem is magnified in the age of AI-powered development. AI agents and automated scripts thrive on predictability. When you instruct an agent to "test the login flow on the user dashboard," it needs a reliable and consistent URL to navigate to. If the application\'s port changes every time it starts, the agent\'s script will fail. It would need complex logic to parse terminal output to "guess" the correct port, which is brittle and inefficient. Portless provides these agents with the stable, reliable URLs they need to operate effectively, making local development environments more friendly to automation.'
    },
    { type: 'heading', id: 'getting-started', level: 2, text: 'Getting started with portless' },
    {
      type: 'heading',
      id: 'installation',
      level: 3,
      text: 'Installation'
    },
    {
      type: 'paragraph',
      text: 'Portless is distributed as an npm package. Because it is a system-wide tool designed to manage multiple projects, it should be installed globally.'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'npm install -g portless'
    },
    {
      type: 'paragraph',
      text: 'This command downloads and installs the Portless CLI, making it available from any directory on your system. It is a one-time setup, and you will not need to add it as a dependency to your individual projects.'
    },
    {
      type: 'heading',
      id: 'core-command',
      level: 3,
      text: 'Understanding the core command'
    },
    {
      type: 'paragraph',
      text: 'The primary way you will interact with Portless is through its simple and intuitive command structure:'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'portless <name> <your-app-start-command>'
    },
    {
      type: 'paragraph',
      text: 'Breaking this down: <name> is the unique, stable name you want to assign to your application. This will become the subdomain for your local URL. For example, if you use myapp, your URL will be http://myapp.localhost:1355. <your-app-start-command> is the exact command you would normally type to run your project. This could be next dev, npm run dev, vite, bun run start, or any other command that starts a development server. Portless cleverly wraps your existing command, handling all the port management behind the scenes.'
    },
    {
      type: 'heading',
      id: 'first-application',
      level: 3,
      text: 'Running your first application'
    },
    {
      type: 'paragraph',
      text: 'Walking through a practical example demonstrates the workflow. Suppose you have a project with an API server that you typically start with the command bun run dev:api. Instead of running that command directly, you will now prefix it with portless and a name of your choosing, like xdl-api:'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'portless xdl-api bun run dev:api'
    },
    {
      type: 'paragraph',
      text: "When you press Enter, you will see some informative output from Portless before your application's own logs appear:"
    },
    {
      type: 'code',
      language: 'markdown',
      code: 'Proxy is running\nUsing port 4492\n-> http://xdl-api.localhost:1355'
    },
    {
      type: 'paragraph',
      text: 'Analyzing this output: "Proxy is running" tells you that the central Portless proxy server is active. If it was not running, Portless would have automatically started it in the background. "Using port 4492" shows that Portless found a random, free port on your system (4492 in this case) and told your application to run on it. You do not need to care about this number. "-> http://xdl-api.localhost:1355" is your new, permanent address for this service. You can now access your application at this URL, and it will remain the same every time you run this command, regardless of what other applications are running.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The T9 easter egg',
      text: 'The default proxy port is 1355. This is a fun easter egg: on a phone\'s T9 keypad, the numbers 1-3-5-5 correspond to the letters L-E-S-S, as in "port-less"!'
    },
    { type: 'heading', id: 'how-it-works', level: 2, text: 'How portless works under the hood' },
    {
      type: 'paragraph',
      text: 'The simplicity of Portless belies a sophisticated and robust architecture. Understanding how it operates will give you a deeper appreciation for the tool and help you troubleshoot if needed. The entire system can be understood as two distinct workflows: launching an application and handling a browser request.'
    },
    {
      type: 'heading',
      id: 'launching-workflow',
      level: 3,
      text: 'Workflow 1: Launching an application'
    },
    {
      type: 'paragraph',
      text: 'When you execute a command like portless myapp npm run dev, a sequence of events is triggered:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'The Portless CLI first parses your input, identifying the application name (myapp) and the execution command (npm run dev).',
        'It immediately checks to see if its central proxy server is already running in the background. If it is not, Portless automatically starts the proxy as a daemon, which begins listening on its designated port (defaulting to 1355).',
        'Next, Portless needs to find a free port for your actual application to run on. To do this efficiently and avoid conflicts, it searches for an available port in a high-numbered range (typically 4000-4999) and picks one at random within that range to speed up the search. This randomly assigned, temporary port is called an "ephemeral port."',
        "Once a free ephemeral port is found (let's say 4309), Portless records this mapping. It stores the association between the stable hostname (myapp.localhost) and the ephemeral port (4309) in a local state file, referred to as routes.json. This file acts as the proxy's address book.",
        "Portless executes the command you provided (npm run dev). However, it does not just run it as is. It injects the chosen ephemeral port (4309) into the command's environment as the PORT environment variable. Nearly all modern web frameworks and servers are built to respect the PORT variable. This is how your Next.js, Vite, or Express app knows to listen on port 4309 without you ever having to configure it."
      ]
    },
    {
      type: 'heading',
      id: 'request-workflow',
      level: 3,
      text: 'Workflow 2: Handling a browser request'
    },
    {
      type: 'paragraph',
      text: 'Now, your application is running on a random port, but you have a stable URL. Here is how a request to http://myapp.localhost:1355 reaches your app:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'You type http://myapp.localhost:1355 into your browser and hit Enter. The .localhost top-level domain is a special-use domain designated to always resolve to the loopback IP address, 127.0.0.1. Your operating system handles this automatically, so the request is directed to your own machine.',
        'The request is sent to IP address 127.0.0.1 on port 1355. Because the Portless proxy daemon is listening on this exact address and port, it intercepts the incoming HTTP request.',
        'The proxy inspects the Host header of the incoming request, which will be myapp.localhost. It then consults its routes.json state file, looking for the entry corresponding to myapp.localhost.',
        'The proxy finds the entry in its state file and sees that myapp.localhost is mapped to the ephemeral port 4309. It then acts as a reverse proxy, forwarding the original HTTP request to http://localhost:4309.',
        'Your application, which is listening on port 4309, receives the request, processes it, and generates a response. The application sends its response back to the proxy on port 4309.',
        'The proxy then takes this response and relays it back to the browser, completing the request-response cycle.'
      ]
    },
    {
      type: 'paragraph',
      text: 'This elegant two-step process completely decouples the URL you use from the port the application runs on, giving you stability and flexibility simultaneously.'
    },
    { type: 'heading', id: 'advanced-usage', level: 2, text: 'Advanced usage and configuration' },
    {
      type: 'paragraph',
      text: 'Portless offers several powerful options for more advanced use cases, allowing you to tailor it to your specific needs.'
    },
    {
      type: 'heading',
      id: 'truly-portless',
      level: 3,
      text: 'Achieving a truly portless experience'
    },
    {
      type: 'paragraph',
      text: 'While the default 1355 port is convenient, you can eliminate the port from your URL entirely by using the standard web ports. Stop the current proxy:'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'portless proxy stop'
    },
    {
      type: 'paragraph',
      text: 'Start the proxy on port 80. Since port 80 is a "privileged" port (any port below 1024), you must use sudo to grant the necessary permissions:'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'sudo portless proxy start -p 80'
    },
    {
      type: 'paragraph',
      text: 'When the proxy is running in a privileged state, the command to launch your app must also be run with sudo:'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'sudo portless myapp npm run dev'
    },
    {
      type: 'paragraph',
      text: 'Now, your application will be available at http://myapp.localhost—no port number required! This creates an even cleaner and more memorable development experience.'
    },
    {
      type: 'heading',
      id: 'local-https',
      level: 3,
      text: 'Local HTTPS made easy'
    },
    {
      type: 'paragraph',
      text: 'Testing features that require a secure context (like service workers or certain browser APIs) has always been a chore locally. Portless makes it incredibly simple. Start the proxy with the --https flag. This tells Portless to enable TLS and handle certificate generation. If you want to use the default HTTPS port (443), you will need sudo:'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'sudo portless proxy start --https -p 443'
    },
    {
      type: 'paragraph',
      text: 'Trust the local Certificate Authority (CA). The first time you use the --https flag, Portless generates a local CA. To prevent your browser from showing scary security warnings, you need to tell your operating system to trust this CA. Portless has a dedicated command for this:'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'portless trust'
    },
    {
      type: 'paragraph',
      text: "This command will likely trigger a system security prompt asking for your password to add the certificate to your system's trust store. You only need to do this once. With these steps complete, you can run your app (again, with sudo if using port 443) and access it securely at https://myapp.localhost."
    },
    {
      type: 'heading',
      id: 'management-debugging',
      level: 3,
      text: 'Managing and debugging'
    },
    {
      type: 'paragraph',
      text: 'Portless provides a few utility commands for management and debugging:'
    },
    {
      type: 'table',
      columns: ['Command', 'What it does'],
      rows: [
        ['portless list', 'Shows a table of all currently active routes, including their name, URL, ephemeral port, and process ID (PID).'],
        ['portless proxy stop', 'Stops the background proxy daemon.'],
        [
          'portless proxy start --foreground',
          'Runs the proxy in your current terminal session instead of as a background daemon. Useful for debugging the proxy itself, as its logs will be printed directly to your console.'
        ]
      ]
    },
    { type: 'heading', id: 'framework-specific', level: 2, text: 'Framework-specific considerations' },
    {
      type: 'paragraph',
      text: 'While Portless is designed to work out-of-the-box with most tools, some development servers require minor configuration adjustments for full compatibility. Here are the most common scenarios.'
    },
    {
      type: 'heading',
      id: 'vite-example',
      level: 3,
      text: 'Vite'
    },
    {
      type: 'paragraph',
      text: 'If you use Portless with a default Vite project, you might encounter a "Bad Gateway" error. This is because of two specific Vite default settings. To fix this, edit your vite.config.ts (or .js) file:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Tell Vite to use the port from the environment variable
    port: Number(process.env.PORT) || 5173,

    // 2. Tell Vite to listen on all network interfaces
    host: '0.0.0.0',
  },
});`
    },
    {
      type: 'paragraph',
      text: "Breaking down these two essential changes: port: Number(process.env.PORT) || 5173 instructs Vite to first check for a PORT environment variable. If it exists (which it will when run via Portless), Vite will use that port. If not, it will fall back to its default. This makes your Vite project compatible with Portless. host: '0.0.0.0' addresses a security default. By default, Vite's dev server may only accept requests that are explicitly directed to localhost. However, the request from the Portless proxy can be seen as coming from a different origin within your machine. Setting host to '0.0.0.0' tells the Vite server to listen for requests on all available network interfaces, allowing it to accept the forwarded request from the proxy."
    },
    {
      type: 'heading',
      id: 'nextjs-example',
      level: 3,
      text: 'Next.js'
    },
    {
      type: 'paragraph',
      text: 'Next.js is highly compatible with Portless out-of-the-box. The Next.js development server respects the PORT environment variable by default, so you typically do not need any special configuration.'
    },
    {
      type: 'code',
      language: 'bash',
      code: 'portless my-nextjs-app next dev'
    },
    {
      type: 'paragraph',
      text: 'Run this command, and your Next.js app will automatically listen on the ephemeral port that Portless assigns via the PORT environment variable. You can access it at http://my-nextjs-app.localhost:1355 (or without the port if running the proxy on port 80).'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'When does Next.js need special config?',
      text: 'If your Next.js app makes API calls to localhost (e.g., fetching from http://localhost:3000/api/...) in server-side code or middleware, you may encounter issues because the hardcoded port will not match the ephemeral port Portless assigns. In such cases, use environment variables (e.g., process.env.NEXT_PUBLIC_API_URL or process.env.API_URL) to construct your API endpoints dynamically, just as you would in any environment-aware setup.'
    },
    { type: 'heading', id: 'final-thoughts', level: 2, text: 'Final thoughts' },
    {
      type: 'paragraph',
      text: 'Portless is a testament to the idea that the best developer tools are often the ones that solve a simple, universal problem in an elegant way. By introducing a lightweight yet powerful proxy layer, it eliminates port conflicts, banishes the EADDRINUSE error, and provides the stable, named URLs that modern development workflows demand. The ability to effortlessly set up local HTTPS and create truly "portless" URLs with sudo are standout features that address long-standing developer pain points.'
    },
    {
      type: 'paragraph',
      text: 'What began as a weekend project has evolved into an indispensable utility for anyone working with multiple local services. It enhances the developer experience for humans while critically enabling the next generation of automated, AI-driven development workflows. By taking a few moments to install Portless and integrate it into your run scripts, you can bring order to the chaos of localhost ports, reclaim your mental energy, and build more reliably with automated tools. Whether you are a solo developer tired of port conflicts or a team building sophisticated systems with AI agents that require predictable endpoints, Portless is the elegant solution to a problem you have likely experienced for years.'
    }
  ]
};
