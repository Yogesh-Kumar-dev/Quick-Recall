import type { Article } from '@/types/content';

export const viteProxyArticle: Article = {
  id: 'vite-proxy-development',
  slug: 'vite-proxy-development',
  category: 'Full Stack',
  title: 'Vite Proxy: Why Do We Need It?',
  summary:
    'A beginner-friendly explanation of Vite development proxies, why frontend applications need them when talking to a separate backend, how they avoid local CORS problems, and how to configure path rewrites, WebSockets, authentication, and Portless-based local development.',
  topics: ['Vite', 'React', 'CORS', 'Proxy', 'Development', 'Node.js'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: 'When developing a React application with Vite, you will often have two servers running at the same time. The Vite development server might run your frontend while an Express, NestJS, or another backend server runs your API. This creates an important question: how should the frontend talk to the backend during local development?'
    },
    {
      type: 'paragraph',
      text: 'You could call the backend directly using a URL such as `http://localhost:3000/api/users`. But if your frontend is running at `http://localhost:5173`, the browser sees those as different origins. That is where CORS enters the picture. Vite provides a development proxy that lets the browser send the request to the Vite server first, while Vite forwards the request to your backend.'
    },

    {
      type: 'heading',
      id: 'the-problem',
      level: 2,
      text: 'The problem: frontend and backend are on different origins'
    },
    {
      type: 'paragraph',
      text: 'Imagine a typical local development setup. Your React application runs on port 5173 and your Node.js API runs on port 3000.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Frontend:
http://localhost:5173

Backend:
http://localhost:3000`
    },
    {
      type: 'paragraph',
      text: 'Now your React application wants to fetch users.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('http://localhost:3000/api/users')`
    },
    {
      type: 'paragraph',
      text: 'Even though both URLs use `localhost`, they are different origins because their ports are different. An origin is determined by the scheme, host, and port.'
    },
    {
      type: 'table',
      columns: ['URL', 'Origin'],
      rows: [
        ['`http://localhost:5173`', '`http://localhost:5173`'],
        ['`http://localhost:3000`', '`http://localhost:3000`'],
        ['`https://localhost:5173`', '`https://localhost:5173`'],
        ['`http://127.0.0.1:5173`', '`http://127.0.0.1:5173`']
      ]
    },
    {
      type: 'paragraph',
      text: "The browser treats different origins as cross-origin requests. The browser's same- origin security model then determines whether the frontend is allowed to read the backend response.This is where CORS, or Cross - Origin Resource Sharing, comes into play."
    },

    {
      type: 'heading',
      id: 'what-is-cors',
      level: 2,
      text: 'A quick look at CORS'
    },
    {
      type: 'paragraph',
      text: 'CORS is a browser security mechanism that allows a server to declare which other origins are allowed to access its responses from browser-based requests.'
    },
    {
      type: 'paragraph',
      text: 'For example, your backend could explicitly allow requests from `http://localhost:5173` by returning an appropriate `Access-Control-Allow-Origin` response header.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Access-Control-Allow-Origin: http://localhost:5173`
    },
    {
      type: 'paragraph',
      text: 'That is a perfectly valid solution. Your backend can be configured to support CORS directly. But during local development, you may prefer to avoid making every API request cross-origin in the first place.'
    },

    {
      type: 'heading',
      id: 'what-is-vite-proxy',
      level: 2,
      text: 'What is the Vite proxy?'
    },
    {
      type: 'paragraph',
      text: "Vite's `server.proxy` lets the Vite development server forward matching requests to another server.Vite documents it as a set of custom proxy rules for the development server.A request whose path starts with a configured key is sent to the configured target. : contentReference[oaicite: 2]{ index = 2 } "
    },
    {
      type: 'paragraph',
      text: 'Instead of your browser directly requesting the backend, the browser can request the Vite server using a relative URL such as `/api/users`. Vite receives that request and forwards it to the backend.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Without a proxy:

Browser
   │
   ├── GET http://localhost:5173/
   │       ↓
   │     Vite
   │
   └── GET http://localhost:3000/api/users
           ↓
        Backend


With a Vite proxy:

Browser
   │
   └── GET http://localhost:5173/api/users
           ↓
         Vite
           │
           └── forwards request
                    ↓
             http://localhost:3000/api/users
                    ↓
                 Backend`
    },
    {
      type: 'paragraph',
      text: "The important difference is that the browser's request is made to the Vite server.Vite then performs the server - side proxy request to the backend.The browser therefore does not have to directly read a response from a different origin."
    },

    {
      type: 'callout',
      variant: 'note',
      title: 'The proxy is not a security boundary',
      text: 'A Vite proxy is primarily a development convenience. It does not make your backend private, encrypt your API, or protect secrets. The browser can still see the API responses it receives. The proxy simply changes how requests are routed during development.'
    },

    {
      type: 'heading',
      id: 'same-origin-request',
      level: 2,
      text: 'Why the proxy avoids the local CORS problem'
    },
    {
      type: 'paragraph',
      text: 'Suppose your React application is loaded from `http://localhost:5173`. Instead of calling the backend directly, your application makes this request:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('/api/users')`
    },
    {
      type: 'paragraph',
      text: 'Because the URL is relative, the browser sends the request to the same origin that served the frontend.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Browser

http://localhost:5173
        │
        │ GET /api/users
        ▼
Vite development server
        │
        │ proxy
        ▼
http://localhost:3000/api/users
        │
        ▼
Backend`
    },
    {
      type: 'paragraph',
      text: 'The browser sees the request as `http://localhost:5173/api/users`. Vite handles the forwarding behind the scenes. This is why a development proxy can remove the need to configure CORS just for the local frontend-to-backend connection.'
    },

    {
      type: 'heading',
      id: 'basic-configuration',
      level: 2,
      text: 'Basic Vite proxy configuration'
    },
    {
      type: 'paragraph',
      text: 'Vite proxy configuration lives inside the `server.proxy` option in `vite.config.ts` or `vite.config.js`.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
});`
    },
    {
      type: 'paragraph',
      text: 'This tells Vite: whenever the development server receives a request whose path starts with `/api`, proxy that request to `http://localhost:3000`.'
    },

    {
      type: 'heading',
      id: 'using-proxy',
      level: 2,
      text: 'Using the proxy from React'
    },
    {
      type: 'paragraph',
      text: "Once the proxy is configured, your frontend does not need to hardcode the backend's local port into every request."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const response = await fetch('/api/users');

const users = await response.json();`
    },
    {
      type: 'paragraph',
      text: 'During development, the browser sends `/api/users` to Vite. Vite forwards it to the backend.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Browser
   │
   │ /api/users
   ▼
Vite :5173
   │
   │ proxy
   ▼
Backend :3000
   │
   │ response
   ▼
Vite
   │
   ▼
Browser`
    },

    {
      type: 'heading',
      id: 'why-relative-api-paths',
      level: 2,
      text: 'Why use `/api` instead of hardcoding `localhost:3000`?'
    },
    {
      type: 'paragraph',
      text: 'Without a proxy, you might write API calls such as `http://localhost:3000/api/users` throughout your application. That couples your frontend code to a particular local backend address.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('http://localhost:3000/api/users')`
    },
    {
      type: 'paragraph',
      text: 'With a proxy, the frontend can use a relative path.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('/api/users')`
    },
    {
      type: 'paragraph',
      text: 'This gives your application a cleaner boundary. The frontend only needs to know that the API is available under `/api`. The development server decides where that path should actually be forwarded.'
    },

    {
      type: 'heading',
      id: 'proxy-vs-production',
      level: 2,
      text: 'Does the Vite proxy work in production?'
    },
    {
      type: 'paragraph',
      text: 'This is one of the most important things to understand: `server.proxy` is a development-server feature. Vite documents the `server` options as applying to development unless otherwise noted. :contentReference[oaicite:3]{index=3}'
    },
    {
      type: 'paragraph',
      text: 'If you build your React application with `vite build` and deploy the resulting static files to S3, a CDN, Nginx, or another static host, the Vite development server is no longer sitting in front of your application. Therefore, its proxy configuration is no longer available.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Development:

Browser
   ↓
Vite dev server
   ↓
Backend


Production:

Browser
   ↓
Hosting / CDN / Reverse proxy
   ↓
Backend`
    },
    {
      type: 'paragraph',
      text: 'In production, the equivalent routing is usually handled by your reverse proxy, API gateway, load balancer, hosting platform, or by configuring CORS on the backend.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not rely on Vite proxy for production routing',
      text: "If your production architecture needs `/api/*` requests routed to a backend, configure that behavior in the production infrastructure. Vite's development proxy does not become your production API gateway just because the frontend was built with Vite."
    },

    {
      type: 'heading',
      id: 'proxy-and-reverse-proxy',
      level: 2,
      text: 'Vite proxy vs reverse proxy'
    },
    {
      type: 'heading',
      id: 'vite-proxy-nginx-cors',
      level: 2,
      text: 'Vite proxy vs Nginx vs backend CORS'
    },
    {
      type: 'paragraph',
      text: 'These three approaches can look similar because they all appear when a frontend needs to communicate with a backend. However, they solve the problem at different layers.'
    },
    {
      type: 'table',
      columns: ['Approach', 'Where does the request go first?', 'Who forwards/allows it?', 'Typical use'],
      rows: [
        ['Vite proxy', 'Vite development server', 'Vite forwards the request', 'Local development'],
        ['Nginx reverse proxy', 'Nginx', 'Nginx forwards the request', 'Production infrastructure'],
        ['Backend CORS', 'Backend directly', 'Backend allows the browser origin', 'Genuine cross-origin requests']
      ]
    },
    {
      type: 'heading',
      id: 'same-api-three-architectures',
      level: 3,
      text: 'The same API request in three architectures'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Vite proxy

Browser
  │
  │ GET /api/users
  ▼
Vite :5173
  │
  │ proxy
  ▼
API :3000`
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Nginx reverse proxy

Browser
  │
  │ GET /api/users
  ▼
Nginx :443
  │
  │ reverse proxy
  ▼
API :3000`
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Backend CORS

Browser
  │
  │ GET http://localhost:3000/api/users
  ▼
API :3000
  │
  │ CORS response headers
  ▼
Browser`
    },
    {
      type: 'paragraph',
      text: 'The first two approaches route the request through an intermediary. The third approach allows the browser to communicate directly with a different origin, with the backend explicitly permitting that origin through CORS headers.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The easiest distinction to remember',
      text: 'Vite proxy and Nginx reverse proxy answer "Where should this request be forwarded?" Backend CORS answers "Is this browser origin allowed to access my API?" Those are related problems, but they are not the same problem.'
    },
    {
      type: 'paragraph',
      text: 'The concepts are very similar. A reverse proxy receives requests and forwards them to another server. The major difference for this article is where the proxy lives and why it exists.'
    },
    {
      type: 'table',
      columns: ['Vite development proxy', 'Production reverse proxy'],
      rows: [
        ['Runs as part of the Vite development server', 'Runs as part of production infrastructure'],
        ['Used during local development', 'Used in deployed environments'],
        ['Configured with `server.proxy`', 'Configured with Nginx, a load balancer, CDN, gateway, or hosting platform'],
        ['Can avoid local browser CORS issues', 'Can route frontend and backend through one public origin'],
        ['Not intended as a production API gateway', 'Can be part of the production architecture']
      ]
    },

    {
      type: 'heading',
      id: 'rewrite',
      level: 2,
      text: 'Rewriting the request path'
    },
    {
      type: 'paragraph',
      text: "Sometimes the path your frontend uses does not match the path your backend expects. Vite's proxy supports `rewrite` for this situation. : contentReference[oaicite: 4]{ index = 4 } "
    },
    {
      type: 'paragraph',
      text: 'Imagine the frontend uses `/api/users`, but the backend expects `/users`.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: String.raw`server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}`
    },
    {
      type: 'paragraph',
      text: 'Now the request flow becomes:'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Browser:

GET /api/users


Vite receives:

/api/users


Vite forwards:

/users


Backend receives:

GET /users`
    },
    {
      type: 'paragraph',
      text: 'This allows the frontend to expose a consistent `/api` namespace while the backend can use its own route structure.'
    },

    {
      type: 'heading',
      id: 'change-origin',
      level: 2,
      text: 'What does `changeOrigin` do?'
    },
    {
      type: 'paragraph',
      text: 'You will frequently see `changeOrigin: true` in proxy configurations.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}`
    },
    {
      type: 'paragraph',
      text: 'The option changes the origin-related host information used for the proxied request so that it reflects the target server rather than the original development server. This can matter when the backend uses virtual hosting or checks the Host header.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: '`changeOrigin` is not a universal requirement',
      text: 'You will often see `changeOrigin: true` in examples, but it is not required simply because you are using a proxy. Whether you need it depends on what the target backend expects. Start without it if your backend works normally, and add it when the target server requires the rewritten host/origin behavior.'
    },

    {
      type: 'heading',
      id: 'secure',
      level: 2,
      text: 'What does `secure` do?'
    },
    {
      type: 'paragraph',
      text: "When proxying to an HTTPS target, certificate validation can matter. The `secure` option controls whether the proxy verifies the target server's TLS certificate."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `server: {
  proxy: {
    '/api': {
      target: 'https://localhost:3000',
      secure: false,
    },
  },
}`
    },
    {
      type: 'paragraph',
      text: 'You might use `secure: false` during local development when your backend uses a self-signed certificate. It should not be treated as a general recommendation for production TLS configuration.'
    },

    {
      type: 'heading',
      id: 'websockets',
      level: 2,
      text: 'Proxying WebSockets'
    },
    {
      type: 'paragraph',
      text: 'If your backend uses WebSockets or Socket.IO, ordinary HTTP proxying may not be enough. Vite supports WebSocket proxying with `ws: true`. :contentReference[oaicite:5]{index=5}'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `server: {
  proxy: {
    '/socket.io': {
      target: 'ws://localhost:3000',
      ws: true,
    },
  },
}`
    },
    {
      type: 'paragraph',
      text: 'This tells the proxy to handle WebSocket connections for the matching path. WebSocket proxy configuration should be treated separately from ordinary REST API proxying because the connection behavior is different.'
    },

    {
      type: 'heading',
      id: 'multiple-backends',
      level: 2,
      text: 'Proxying multiple backends'
    },
    {
      type: 'paragraph',
      text: 'A frontend application may communicate with more than one backend service. Vite allows multiple proxy rules, each with its own path prefix and target.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
    },

    '/auth': {
      target: 'http://localhost:4000',
    },

    '/payments': {
      target: 'http://localhost:5000',
    },
  },
}`
    },
    {
      type: 'paragraph',
      text: 'The frontend can now use different relative paths while Vite decides which backend should receive each request.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('/api/users');

fetch('/auth/session');

fetch('/payments/orders');`
    },

    {
      type: 'heading',
      id: 'environment-specific-targets',
      level: 2,
      text: 'Using environment-specific backend targets'
    },
    {
      type: 'paragraph',
      text: 'The backend address often changes between development environments. You might have one API running locally, another running in a shared development environment, and another used for testing.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.API_URL,
        },
      },
    },
  };
});`
    },
    {
      type: 'paragraph',
      text: 'This keeps the frontend request path stable while allowing the proxy target to change based on the environment.'
    },

    {
      type: 'heading',
      id: 'authentication-cookies',
      level: 2,
      text: 'What about authentication cookies?'
    },
    {
      type: 'paragraph',
      text: 'Authentication is one reason proxy behavior deserves more thought than simply forwarding JSON responses. Cookies, credentials, headers, CSRF protection, and origin checks can all affect whether an authenticated request works correctly.'
    },
    {
      type: 'paragraph',
      text: "For a same-origin development request such as `/api/me`, the browser treats the request as belonging to the Vite application's origin.The proxy then forwards the request to the backend.Whether authentication works correctly depends on how the backend sets cookies and how the proxy and application architecture handle them."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not assume proxying fixes authentication',
      text: 'A proxy can simplify the origin relationship, but it does not automatically solve cookie domain, SameSite, CSRF, authentication-header, or session configuration. If an authenticated request fails, inspect the actual request and response headers in the browser and verify what the backend expects.'
    },

    {
      type: 'heading',
      id: 'portless',
      level: 2,
      text: 'What if you use Portless?'
    },
    {
      type: 'paragraph',
      text: 'Tools such as Portless change the way local development servers are addressed. Instead of remembering different ports for different applications, a service can be exposed through a named `.localhost` hostname. For example, a frontend and API might be reachable through different local hostnames rather than `localhost:5173` and `localhost:3000`.'
    },
    {
      type: 'paragraph',
      text: 'That can make local development more pleasant, especially when working with multiple applications or worktrees. Portless itself acts as an HTTP proxy that routes requests based on the local hostname to the underlying development server. :contentReference[oaicite:6]{index=6}'
    },
    {
      type: 'paragraph',
      text: 'However, Portless does not automatically make two different local hostnames the same browser origin. If your frontend is at one hostname and your API is at another, the browser can still consider the API request cross-origin.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Frontend:

http://web.localhost:1355


API:

http://api.localhost:1355`
    },
    {
      type: 'paragraph',
      text: 'Those are different origins because their hostnames differ. A Vite proxy can still be useful if you want the browser to call the frontend origin and have Vite forward `/api/*` to the Portless API hostname.'
    },

    {
      type: 'heading',
      id: 'portless-vite-flow',
      level: 3,
      text: 'Portless + Vite proxy'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `server: {
  proxy: {
    '/api': {
      target: 'http://api.localhost:1355',
      changeOrigin: true,
    },
  },
}`
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Browser
   │
   │ http://web.localhost:1355/api/users
   ▼
Vite
   │
   │ proxy
   ▼
Portless
   │
   │ routes to API app
   ▼
Backend`
    },
    {
      type: 'paragraph',
      text: 'The important point is that Portless and Vite proxy solve different parts of local development. Portless provides hostname-based routing to local development servers, while the Vite proxy can make frontend API requests appear same-origin to the browser and forward them to the backend.'
    },

    {
      type: 'heading',
      id: 'when-you-dont-need-proxy',
      level: 2,
      text: 'When do you not need a Vite proxy?'
    },
    {
      type: 'paragraph',
      text: 'A proxy is useful, but it is not mandatory. You may not need one if your backend already handles CORS correctly and your frontend is comfortable making direct cross-origin requests.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('http://localhost:3000/api/users')`
    },
    {
      type: 'paragraph',
      text: 'In that setup, the backend needs to allow the frontend origin and correctly handle any credentials, preflight requests, and other CORS requirements.'
    },
    {
      type: 'table',
      columns: ['Approach', 'Frontend request', 'What handles cross-origin behavior?'],
      rows: [
        ['Vite proxy', '`/api/users`', 'Vite forwards the request during development'],
        ['Direct API request', '`http://localhost:3000/api/users`', 'Backend CORS configuration'],
        ['Production reverse proxy', '`/api/users`', 'Nginx, gateway, CDN, hosting infrastructure, etc.']
      ]
    },

    {
      type: 'heading',
      id: 'common-mistakes',
      level: 2,
      text: 'Common Vite proxy mistakes'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Calling `http://localhost:3000/api/...` from the frontend and then wondering why the Vite proxy is not being used. The request must match the configured proxy path.',
        'Forgetting that `server.proxy` is primarily a development-server feature and expecting the same configuration to route production traffic.',
        'Using a proxy when the backend already handles CORS correctly without understanding which problem the proxy is solving.',
        'Forgetting `rewrite` when the frontend prefix and backend route prefix are different.',
        'Assuming `changeOrigin: true` is always required. It depends on what the target backend expects.',
        'Using `secure: false` as a general solution instead of understanding that it disables TLS certificate verification for the proxied target.',
        'Forgetting `ws: true` when a development WebSocket connection needs to be proxied.',
        'Assuming Portless removes all cross-origin concerns simply because both applications use `.localhost` URLs.',
        'Hardcoding backend URLs throughout application components instead of keeping the development routing concern in the proxy configuration.'
      ]
    },

    {
      type: 'heading',
      id: 'debugging-proxy',
      level: 2,
      text: 'How to debug a Vite proxy'
    },
    {
      type: 'paragraph',
      text: 'When a proxied request fails, first determine which part of the request path is broken. Do not immediately start changing every proxy option you can find. Configuration files are not slot machines.'
    },
    {
      type: 'steps',
      items: [
        {
          title: '1. Check the browser request URL',
          text: 'Open the Network tab and verify that the frontend is requesting `/api/...` rather than directly requesting the backend port.'
        },
        {
          title: '2. Check the Vite terminal',
          text: 'Look for errors from the development server. A proxy target that cannot be reached will generally produce useful connection errors.'
        },
        {
          title: '3. Call the backend directly',
          text: 'Use `curl http://localhost:3000/api/users` or the appropriate API URL. If the backend itself is unavailable, changing Vite proxy options will not fix it.'
        },
        {
          title: '4. Check the configured path',
          text: 'Make sure the browser request begins with the proxy key such as `/api`. A request to `/users` will not match a `/api` proxy rule.'
        },
        {
          title: '5. Check path rewriting',
          text: 'If the backend expects `/users` but the browser sends `/api/users`, verify whether a `rewrite` rule is required.'
        },
        {
          title: '6. Check headers and authentication',
          text: 'For authenticated requests, inspect cookies, Authorization headers, CORS headers, SameSite behavior, and any backend origin checks.'
        },
        {
          title: '7. Check WebSocket configuration',
          text: 'If HTTP requests work but WebSockets fail, verify that the relevant proxy rule has WebSocket support enabled with `ws: true`.'
        }
      ]
    },

    {
      type: 'heading',
      id: 'complete-example',
      level: 2,
      text: 'A practical Vite proxy configuration'
    },
    {
      type: 'paragraph',
      text: 'Here is a more complete example for a React application whose API runs on port 3000 and whose WebSocket endpoint is also served by the backend.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
});`
    },
    {
      type: 'paragraph',
      text: 'The frontend can now make API requests using relative URLs.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('/api/users');

fetch('/api/interviews');

fetch('/api/jobs');`
    },

    {
      type: 'heading',
      id: 'mental-model',
      level: 2,
      text: 'The mental model to remember'
    },
    {
      type: 'paragraph',
      text: 'The easiest way to remember Vite proxy configuration is to think of it as a traffic director sitting inside your development server.'
    },
    {
      type: 'code',
      language: 'markdown',
      code: `Browser
   │
   │ /api/users
   ▼
Vite development server
   │
   │ "This starts with /api"
   ▼
Proxy rule
   │
   │ target: http://localhost:3000
   ▼
Backend
   │
   │ response
   ▼
  Vite
   │
   ▼
Browser`
    },
    {
      type: 'paragraph',
      text: 'The browser does not need to know the backend port for the normal proxied request. Your frontend code can use a stable relative path such as `/api/users`, while the development server handles where that request goes.'
    },

    {
      type: 'heading',
      id: 'proxy-vs-cors',
      level: 2,
      text: 'Vite proxy vs CORS: which should you use?'
    },
    {
      type: 'table',
      columns: ['Question', 'Vite proxy', 'Backend CORS'],
      rows: [
        ['Where is it configured?', 'Vite development server', 'Backend server'],
        ['Best for', 'Local development convenience', 'Allowing legitimate cross-origin browser access'],
        ['Works in production?', 'Not through `server.proxy`', 'Yes'],
        ['Requires frontend URL changes?', 'Usually no, use relative paths', 'Frontend directly calls API origin'],
        [
          'Solves browser cross-origin restriction?',
          'By avoiding direct cross-origin browser request',
          'By explicitly allowing the origin'
        ],
        ['Replaces production API security?', 'No', 'No']
      ]
    },
    {
      type: 'paragraph',
      text: 'There is no universal winner. A Vite proxy is convenient when your frontend and backend are separate local processes. Backend CORS is necessary when browsers genuinely need to access an API across origins. In many real applications, you may use a Vite proxy during development and a reverse proxy or gateway in production.'
    },

    {
      type: 'heading',
      id: 'final-takeaway',
      level: 2,
      text: 'Final takeaway'
    },
    {
      type: 'paragraph',
      text: "Vite's proxy exists because frontend development often involves multiple local servers.Your React application might run on one origin while your API runs on another.Rather than making every browser request directly cross - origin, Vite can receive requests such as `/api/users` and forward them to the backend during development."
    },
    {
      type: 'paragraph',
      text: 'The most important configuration is simple.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
    },
  },
}`
    },
    {
      type: 'paragraph',
      text: 'Then your frontend can use:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `fetch('/api/users');`
    },
    {
      type: 'paragraph',
      text: 'From there, `rewrite` lets you change paths, `changeOrigin` can adjust host/origin behavior for the target server, `ws` enables WebSocket proxying, and environment variables can make the target configurable across development environments.'
    },
    {
      type: 'paragraph',
      text: 'Most importantly, remember where this proxy lives. It belongs to the development server. In production, the equivalent routing responsibility normally moves to infrastructure such as Nginx, a load balancer, API gateway, CDN, or hosting platform. Once that distinction is clear, Vite proxy configuration stops being a mysterious block of settings and becomes what it really is: a small local traffic-routing layer between your frontend development server and your backend.'
    }
  ]
};
