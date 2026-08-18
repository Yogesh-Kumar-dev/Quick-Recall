import type { Article } from '@/types/content';

export const cachingLayersArticle: Article = {
  id: 'caching-layers',
  slug: 'caching-layers',
  title: 'Caching Layers: Understanding Performance Across the Stack',
  summary:
    'A comprehensive walkthrough of caching at every layer: browser (React Router, TanStack Query), CDN (CloudFront with cache headers), server-side application caches, and Redis. Uses a single user request journey to explain what problem each layer solves, when it kicks in, and how they work together.',
  topics: ['Performance', 'Caching', 'Scaling', 'Backend', 'Frontend', 'System Design'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: 'Imagine you are ordering food at a restaurant. The first time you visit, you ask the server for a menu, read the options, and order. The next time you visit, you already remember what is on the menu, so you skip asking and order immediately. The third person visiting the restaurant for the first time still has to ask the server, but the server keeps a printed menu at the front desk so they do not have to run to the kitchen every single time. The owner keeps popular menus pre-printed and mailed out before the restaurant even opens. All four of these are different forms of caching, happening at different points in the journey from "I want to eat" to "here is your food." Web development works the same way: data gets cached at multiple layers because fetching from each successive layer takes progressively longer.'
    },
    { type: 'heading', id: 'why-caching-exists', level: 2, text: 'Why caching exists at all' },
    {
      type: 'paragraph',
      text: "There is a fundamental speed hierarchy in computing. Reading from your computer's RAM (memory) is nearly instant, measured in nanoseconds. Reading from a disk (even a fast SSD) takes microseconds to milliseconds, roughly 1000 times slower. Reading from a network takes milliseconds to hundreds of milliseconds, and reading from a database that has to search through millions of rows is slowest of all. Every layer between the user and the database adds latency. Caching is the art of trading a small amount of memory at every layer for enormous gains in speed, so requests do not have to make the entire journey down to the database."
    },
    {
      type: 'paragraph',
      text: 'Here is the simplified journey of a user request: the user clicks a button in their browser, the browser decides whether it already has the data locally. If yes, instant. If no, it makes a network request. That request hits a CDN (a server geographically close to the user) and the CDN decides if it has the data cached. If yes, reply instantly. If no, forward the request to your actual server. Your server checks its own caches (Redis, in-memory storage) before hitting the database. At each point where a cache hits, the request stops its journey and returns the answer. At each point where it misses, it travels one layer deeper, getting slower each time.'
    },
    { type: 'heading', id: 'layer-1-browser', level: 2, text: 'Layer 1: Browser and client-side caching' },
    {
      type: 'paragraph',
      text: 'The fastest cache is the one that never makes a network request at all. When a user navigates around your application, their browser has already received data from previous requests. Why fetch it again if it has not changed? This is where client-side caching lives, and it is often handled by libraries and frameworks rather than the raw browser APIs.'
    },
    {
      type: 'paragraph',
      text: 'React Router keeps a cache of loader data based on how recently it was fetched. When you navigate back to a product listing page you visited 10 seconds ago, if that page\'s data is still within its "stale time" window (say, 5 minutes), React Router skips the network request and serves the cached data instantly. TanStack Query works similarly: it tracks when each piece of data was last fetched and whether it is still "fresh." If you switch browser tabs and come back to a dashboard within the stale time window, TanStack Query serves cached data instead of making a new API call. Both allow you to configure how long data stays fresh before it needs to be refetched.'
    },
    {
      type: 'paragraph',
      text: 'This layer solves one specific problem: avoiding redundant requests for data that has not changed. A user rapidly clicking between sections of your app, re-visiting the same pages in a session, or navigating backward should never trigger duplicate network traffic if the data is still considered fresh. The cost is that the data might be slightly stale—a few seconds old—but for most applications, that is an acceptable tradeoff compared to the latency of a network round trip.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Stale vs fresh is a choice you make',
      text: 'Neither React Router nor TanStack Query forces your data to be "fresh." You decide: should a user\'s profile data stay cached for 5 seconds, 5 minutes, or forever until manually invalidated? Critical data like balances or permissions should have short or immediate invalidation. Metadata like category lists can stay cached much longer.'
    },
    { type: 'heading', id: 'layer-2-cdn', level: 2, text: 'Layer 2: CDN and static content caching' },
    {
      type: 'paragraph',
      text: 'While client-side caching handles dynamic data, static content (JavaScript bundles, CSS, images, fonts) does not change every request. That is where a Content Delivery Network (CDN) comes in. A CDN is a global network of servers positioned around the world so that when a user in Tokyo requests your website, they do not download data from your server in the US. Instead, they hit a CDN edge server near Tokyo, which either has the file cached locally or fetches it once from your origin server and caches it for the next user in that region.'
    },
    {
      type: 'paragraph',
      text: 'The question the CDN must answer is: "How long can I cache this file before I need to check if it has changed?" That decision is encoded in HTTP cache headers sent by your server. These headers tell the CDN (and the browser) the rules for keeping the file around.'
    },
    {
      type: 'table',
      columns: ['Header', 'What it tells the cache', 'Example use'],
      rows: [
        [
          'Cache-Control: public, max-age=3600',
          'Anyone can cache this, keep it for 3600 seconds (1 hour), then check if it has changed',
          'A homepage, product listings, blog posts'
        ],
        [
          'Cache-Control: public, max-age=31536000, immutable',
          'Cache forever; if the filename changes, the content is guaranteed to be different (used for versioned assets like app-v1a2b3c.js)',
          'Versioned JavaScript bundles, CSS, images'
        ],
        [
          'Cache-Control: private, max-age=0, must-revalidate',
          "Only this user's browser can cache it, and only for this request; always check if it is fresh",
          'User-specific HTML pages, personal data'
        ],
        [
          'Cache-Control: public, max-age=3600, stale-while-revalidate=86400',
          'Serve cached data for 1 hour. After that, if the cache is stale (but less than 1 day old), serve it anyway while secretly fetching a fresh copy in the background',
          'Product prices, inventory, non-critical metadata'
        ]
      ]
    },
    {
      type: 'paragraph',
      text: 'Additionally, the CDN uses ETag and Last-Modified headers to implement a revalidation strategy. Instead of re-downloading a large file just to check if it has changed, the CDN can ask the origin server, "Do you have a newer version of this file?" using the ETag or Last-Modified date as proof of what it has cached. If the file has not changed, the origin server sends back a lightweight "304 Not Modified" response, and the CDN keeps serving its cached copy. This cuts down on bandwidth while still keeping the cache reasonably fresh.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The immutable trick: versioning assets',
      text: 'Modern build tools hash JavaScript bundle names so that app.js becomes app-1a2b3c4d5e6f.js. That hash changes if the file changes. This allows the CDN to cache with max-age=31536000 (one year) because if the content changes, the filename changes, so old URLs are never served stale content. This is why you see long hash strings in built asset names.'
    },
    { type: 'heading', id: 'layer-3-server-cache', level: 2, text: 'Layer 3: Server-side application caching' },
    {
      type: 'paragraph',
      text: 'When the CDN passes a request through to your origin server, your server might still receive requests for the same dynamic data repeatedly. If ten users all ask for "What are the top 10 products sorted by rating?" within the same minute, your server could query the database once, cache the result in its own memory, and serve all ten users from that cache without hitting the database nine more times.'
    },
    {
      type: 'paragraph',
      text: 'Server-side application caching typically lives in your application process memory: in Node.js, it might be a Map or object you keep in memory; in Python, it might be an in-process dictionary; in a language like Go, it might be a local HashMap. This cache is fast because it is local to the application, no network call needed. But it has two major limitations: first, it only works for a single server. If you have three instances of your application running behind a load balancer, each instance has its own separate cache, and a request might hit one instance with a cache hit, then the next request might hit a different instance with a cache miss. Second, the cache disappears when the server restarts, so it is ephemeral and not truly reliable for critical data.'
    },
    {
      type: 'paragraph',
      text: 'Server-side application caching is most useful at low scale, when you have a single server or when the data is specific to the request (e.g., computed results during the same request that you want to use multiple times within that one request). For anything that needs to be shared across multiple servers or survive a restart, Redis is the answer.'
    },
    { type: 'heading', id: 'layer-4-redis', level: 2, text: 'Layer 4: Redis external caching' },
    {
      type: 'paragraph',
      text: "Redis is a separate, purpose-built service that your application servers connect to over the network. Instead of storing cached data in each server's own memory, all servers store and retrieve cached data from the same Redis instance. This solves two problems that in-process caching cannot: first, the cache is shared. All servers see the same cached data, so it does not matter which server a request hits. Second, the cache persists across application server restarts; the Redis service keeps running independently."
    },
    {
      type: 'paragraph',
      text: 'The tradeoff is speed: reading from Redis requires a network call, which is slower than reading from your application process memory. A millisecond or two of network latency is much slower than nanoseconds to a local HashMap. But that millisecond is still orders of magnitude faster than querying a database, and the ability to share cached data across multiple servers is worth the speed tradeoff as soon as you scale beyond a single instance.'
    },
    {
      type: 'paragraph',
      text: 'Redis is used to cache database query results, computed values, user sessions, rate limit counters, feature flags, and anything else that is expensive to compute or fetch but does not need to be stored permanently. Like server-side caches, Redis caches have a TTL (time to live), meaning they expire automatically after a certain time period and must be recomputed or re-fetched on the next miss.'
    },
    {
      type: 'paragraph',
      text: 'The critical distinction: Redis is not the database of record. Your actual database (PostgreSQL, MongoDB, etc.) is the source of truth. Redis is a performance layer that sits in front of it. If a Redis key expires or gets evicted, the system does not break; it just means the next request will be a bit slower because it has to hit the database again and then refill the Redis cache.'
    },
    { type: 'heading', id: 'full-journey', level: 2, text: 'Putting it together: a single user request through all layers' },
    {
      type: 'paragraph',
      text: 'Let us trace one concrete example: a user opens your e-commerce app and clicks "View my cart." Here is the full journey, cache layer by layer.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Browser cache check',
          text: 'React Router or TanStack Query checks: "Do I have cart data cached and is it still fresh (within the 5-minute stale time)?" If yes, render immediately. If no, proceed to step 2.'
        },
        {
          title: 'Network request leaves the browser',
          text: 'The browser makes an HTTP GET request to your API: GET /api/cart. This request travels over the network.'
        },
        {
          title: 'CDN receives the request',
          text: 'The request might hit a CDN edge server before reaching your origin. But here is the catch: a GET request for dynamic, user-specific data like a shopping cart should NOT be cached by the CDN (it has Cache-Control: private or no-cache headers). The CDN passes it through to your origin server unchanged. However, static assets referenced on the page (the JavaScript bundle, CSS, images) would be cached at the CDN if they have Cache-Control: max-age set to a long time.'
        },
        {
          title: 'Server receives the request',
          text: 'Your origin server receives GET /api/cart. Before querying the database, it checks: "Do I have the cart data for this user in Redis?" It constructs a cache key like cart:user42 and asks Redis. If Redis has it and it has not expired, it returns the data instantly.'
        },
        {
          title: 'Redis miss: database query',
          text: 'If Redis does not have it (either the key never existed, or it expired after 10 minutes), the server queries the database: SELECT * FROM carts WHERE user_id = 42. This is the slowest step in the entire journey.'
        },
        {
          title: 'Server caches the result',
          text: 'After getting the response from the database, the server stores it in Redis with a TTL: SET cart:user42 "{...}" EX 600 (expires in 600 seconds, 10 minutes). Now if the same user requests their cart again within 10 minutes, step 4 will result in an instant hit.'
        },
        {
          title: 'Response flows back',
          text: 'The server sends the cart data back to the browser. The browser receives it and stores it in TanStack Query or React Router\'s cache with a "fresh" timestamp. If the user navigates away and back within 5 minutes, they will not make another network request.'
        }
      ]
    },
    {
      type: 'table',
      columns: ['Cache Layer', 'Optimizes for', 'Typical speed', 'Scope'],
      rows: [
        ['Browser (React Router, TanStack Query)', 'Avoiding network requests for the same data', 'Instant (0ms)', 'Per-user, per-session'],
        ['CDN', 'Serving static assets from geographically close servers', 'Tens of milliseconds', 'Public, global'],
        ['Server application cache', 'Avoiding database queries on a single instance', '< 1ms', 'Single server'],
        ['Redis', 'Sharing cached data across multiple servers', '1-5ms (network latency)', 'All servers, persistent across restarts']
      ]
    },
    { type: 'heading', id: 'cache-invalidation', level: 2, text: 'The hard part: cache invalidation' },
    {
      type: 'paragraph',
      text: 'There is a famous saying in computer science: "There are only two hard things in Computer Science: cache invalidation and naming things." The reason cache invalidation is hard is that once you cache data, you have created a duplicate copy of the truth, and now you must keep both copies in sync. If the user edits their cart, every cache layer that holds a copy of that cart data must be updated, or the user will see stale data.'
    },
    {
      type: 'paragraph',
      text: 'Let us walk through a concrete example: a user is viewing their cart, which is cached in React Router, possibly served through a CDN, stored in Redis on the server, and originally came from the database. Now the user adds an item to their cart by clicking "Add to cart." Here is what must happen:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'The server receives the POST request to add the item, updates the database first (the source of truth),',
        'The server must immediately invalidate the cached copy in Redis (delete the cart:user42 key) so the next request will refetch fresh data from the database,',
        'The server should tell the client (the browser) that cached data for this cart is no longer valid, so React Router and TanStack Query clear their cached copy,',
        'The browser re-fetches the cart data, which now hits the Redis cache miss, queries the database, and gets the updated cart with the new item,',
        'The fresh cart data is cached all the way back down through Redis and into React Router for future requests.'
      ]
    },
    {
      type: 'paragraph',
      text: 'If any step in this chain is missed, the user might see stale data. If Redis is not invalidated, the server will keep serving old cart data. If the browser cache is not cleared, the user might see the old cart on their screen even after the server responds with fresh data. This is why cache invalidation is hard: there are many layers, and each one must know when the other has changed.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Phil Karlton was right',
      text: 'The famous quote "There are only two hard things in Computer Science: cache invalidation and naming things" is not an exaggeration. Most performance bugs in real systems stem from stale cached data, not from missing a cache layer. A system with a well-designed, predictable invalidation strategy is worth far more than a system with aggressive caching but unpredictable staleness.'
    },
    { type: 'heading', id: 'strategies', level: 3, text: 'Three invalidation strategies' },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'TTL (time-to-live): Set an expiration time on cached data. After that time passes, the cache key disappears and the next request refetches from the source of truth. This is simple and automatic but means stale data can exist until the TTL expires.',
        'Event-based invalidation: When data changes (user edits profile, post is published, inventory updates), your application explicitly deletes the relevant cache keys. This is more complex to implement but ensures data is fresh as soon as it changes.',
        'Cache warming: Before invalidating old cached data, proactively fetch and cache the new version so it is ready when requested. This minimizes cache misses after invalidation.'
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Most systems use a combination',
      text: 'A practical caching strategy usually combines all three: set a reasonable TTL so stale data eventually clears itself, use event-based invalidation to refresh critical data immediately after changes, and warm caches in advance for frequently accessed data that you know will be needed soon.'
    },
    { type: 'heading', id: 'choosing-layers', level: 2, text: 'When to use each caching layer' },
    {
      type: 'paragraph',
      text: 'Caching is not an all-or-nothing decision. You do not need every layer from day one. Instead, add layers as you discover performance bottlenecks. Here is a practical guide to when each layer makes sense.'
    },
    {
      type: 'table',
      columns: ['Layer', 'Use when...', 'Skip when...'],
      rows: [
        [
          'Browser (React Router, TanStack Query)',
          'Users navigate frequently and data does not change on every request',
          'Every single request needs to see the absolute latest data (e.g., stock prices updating every second)'
        ],
        [
          'CDN',
          'You have significant static content (images, videos, JavaScript bundles) or users are geographically distributed',
          'All your content is dynamic and user-specific, or your users are all in one geographic location'
        ],
        [
          'Server application cache',
          'You have a single instance and want to avoid redundant database queries within a few seconds',
          'You have multiple instances (use Redis instead) or data freshness is critical (use shorter TTLs)'
        ],
        [
          'Redis',
          'You have multiple servers, need fast caching shared across instances, or want cache to persist across restarts',
          'You only have one instance and latency is not a concern, or you are still at "early stage" and operational complexity is a burden'
        ]
      ]
    },
    {
      type: 'paragraph',
      text: 'A common anti-pattern is caching data that should never be cached: passwords, authentication tokens, or PII (personally identifiable information) should rarely live in a cache unless it is encrypted and has a very short TTL. Similarly, caching data that changes constantly (live stock prices, sports scores) creates a false sense of performance because users will immediately see stale information, defeating the purpose.'
    },
    { type: 'heading', id: 'closing', level: 2, text: 'Caching is a spectrum' },
    {
      type: 'paragraph',
      text: 'No single caching strategy is "right" for every application. A startup with one server and low traffic does not need Redis. An e-commerce site with global traffic and thousands of requests per second needs all four layers. The art of performance engineering is choosing which layers to invest in based on your actual bottlenecks, not based on what sounds fancy or what you read on the internet.'
    },
    {
      type: 'paragraph',
      text: 'Start with browser-side caching to avoid redundant requests. Add a CDN when you have static content or users far from your origin. Add server-side caches when you measure database query time eating up your performance budget. Add Redis when you scale beyond one server. At each step, measure before and after, and make sure the added complexity is worth the performance gain. Caching done well is invisible; done poorly, it is a silent source of bugs and confusion.'
    }
  ]
};
