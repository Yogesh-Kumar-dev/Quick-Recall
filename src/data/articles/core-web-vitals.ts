import type { Article } from '@/types/content';

export const coreWebVitalsArticle: Article = {
  id: 'core-web-vitals',
  slug: 'core-web-vitals',
  title: 'Core Web Vitals',
  summary:
    'What "feels fast" actually means in measurable terms, and a deep, practical walkthrough of the three Core Web Vitals (LCP, INP, CLS) plus TTFB: what each one measures, why it can go bad, how to diagnose it, how to fix it, and how it connects to Google search ranking.',
  topics: ['Web Performance', 'SEO'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: 'Two pages can load in exactly the same amount of total time, measured by a stopwatch, and still feel completely different to sit through. One shows something useful almost immediately and gets more solid from there. The other stays blank, then suddenly dumps its entire layout on screen at once, shifting things around as images and ads pop in. The first one feels fast. The second one feels broken, even if it technically "finished loading" sooner. Core Web Vitals exist because "page load time" as a single number was never a good enough way to describe that experience, and Google needed something more precise to use as an actual signal about page quality.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'What does "perceived performance" actually mean?',
      text: 'It\'s the gap between how fast a page IS (measured in raw milliseconds until every byte has arrived) and how fast a page FEELS to the person using it. A page that shows a real, readable layout in 1 second but then makes you wait 4 more seconds before you can click anything feels slower than a page that shows nothing for 1.5 seconds and then works instantly. Perceived performance is what Core Web Vitals are trying to approximate with real numbers: not "when did the browser technically finish," but "when did this stop being frustrating for an actual human."'
    },
    {
      type: 'paragraph',
      text: 'Core Web Vitals are three specific metrics, chosen by Google\'s Chrome team, that each target one distinct piece of that human experience: how long until something USEFUL appears (loading), how quickly the page responds when you actually try to use it (interactivity), and whether the page holds still while you\'re reading or about to click something (visual stability). Google folded these three into its page-experience ranking signals, which is why "Core Web Vitals" gets discussed as much in SEO conversations as in pure frontend performance ones. This article walks through each metric from the ground up: what it measures, exactly why it tends to go bad, how to actually measure it yourself, and the concrete fixes.'
    },

    { type: 'heading', id: 'the-three-at-a-glance', level: 2, text: 'The three Core Web Vitals, side by side' },
    {
      type: 'table',
      columns: ['Metric', 'What it measures', 'Good', 'Needs improvement', 'Poor'],
      rows: [
        [
          'LCP (Largest Contentful Paint)',
          'How long until the biggest visible piece of content has rendered',
          '≤ 2.5s',
          '2.5s to 4s',
          '> 4s'
        ],
        [
          'INP (Interaction to Next Paint)',
          'How responsive the page is to clicks/taps/keypresses across the whole visit',
          '≤ 200ms',
          '200ms to 500ms',
          '> 500ms'
        ],
        [
          'CLS (Cumulative Layout Shift)',
          "How much visible content unexpectedly moves around during the page's lifetime",
          '≤ 0.1',
          '0.1 to 0.25',
          '> 0.25'
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A memory trick for interviews and for yourself',
      text: 'Loading maps to LCP, Interactivity maps to INP, Stability maps to CLS. If you can state, for each one, the metric name, what it measures, and its "good" threshold in a single sentence, that alone covers most of what gets asked or matters day to day.'
    },

    { type: 'heading', id: 'lcp', level: 2, text: 'LCP: Largest Contentful Paint, the loading metric' },
    {
      type: 'paragraph',
      text: 'LCP answers one question: how long does it take before the biggest, most visually significant piece of content in the viewport has finished rendering? "Largest" here usually means a hero image, a large heading or text block, a video poster frame, or a background image, whichever single element occupies the most visible pixels once the page has settled. The browser doesn\'t just measure the very first thing painted (that metric exists too, it\'s called First Contentful Paint, and it\'s a good early-loading signal but doesn\'t tell you when the page actually became USEFUL). LCP specifically tracks the moment the element a user would visually latch onto as "the content" is actually there. A good score is 2.5 seconds or less, measured from when the user starts loading the page.'
    },
    {
      type: 'paragraph',
      text: "Why does LCP go bad? It's useful to think of it as a chain of four sequential delays, because each one needs its own fix:"
    },
    {
      type: 'steps',
      items: [
        {
          title: '1. Slow Time to First Byte (TTFB)',
          text: "Before the browser can render anything, it has to receive the very first byte of the HTML document back from the server. If your server is slow to respond (a cold-starting serverless function, an unoptimized database query blocking the page render, a server geographically far from the user with no CDN in front of it), everything downstream is delayed by exactly that much before it can even begin. TTFB is covered in more depth further down, but it's worth naming here because it's the first domino in the LCP chain, and a slow TTFB puts a hard floor under how good your LCP can possibly be, no matter how well-optimized the rest of the page is."
        },
        {
          title: '2. Render-blocking resources delay the start of rendering',
          text: "Once HTML starts arriving, the browser typically can't paint anything until it has processed the CSS in the document (an unstyled flash of content is usually considered worse than a brief blank screen, so browsers intentionally wait). A large, render-blocking CSS bundle, or synchronous <script> tags in the <head> that block HTML parsing while they download and execute, push out the point where the browser can start painting anything at all, including the LCP element."
        },
        {
          title: "3. Resource load delay: the LCP element's own resource has to arrive",
          text: "If the LCP element is an image, the browser can't paint it until that image file has been requested and downloaded. If that image is discovered late (buried at the bottom of a large HTML document, or worse, only referenced inside a JavaScript bundle that hasn't run yet) its download doesn't even START until unnecessarily late, adding pure waiting time on top of the download itself."
        },
        {
          title: '4. Client-side rendering delays the element behind JavaScript entirely',
          text: 'In a fully client-rendered app, the initial HTML response can be nearly empty, an empty <div id="root"></div>, with the actual page (including whatever the LCP element turns out to be) only appearing after the JS bundle downloads, parses, executes, and renders. This stacks the ENTIRE JavaScript pipeline in front of the LCP element being visible at all, which is usually the single biggest LCP killer in JavaScript-heavy apps.'
        }
      ]
    },
    {
      type: 'code',
      language: 'javascript',
      code: `<!-- Preload the LCP image so its download starts as early as possible,
     in parallel with everything else, instead of being discovered late -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />

<!-- fetchpriority tells the browser this specific image matters more than
     other images on the page, even without a full preload -->
<img src="/hero.avif" alt="Product hero shot" fetchpriority="high" width="1200" height="600" />`
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Preload the LCP image or font with <link rel="preload">, and mark it fetchpriority="high" so the browser prioritizes it over lower-value requests competing for bandwidth.',
        "Serve modern, compressed image formats (AVIF/WebP instead of unoptimized JPEG/PNG) and correctly-sized responsive images (srcset/sizes, or a framework's built-in Image component) so the browser downloads a file sized for the viewport it's actually rendering into, not a needlessly huge original.",
        "Server-render or statically generate above-the-fold content instead of shipping an empty shell and filling it in with client-side JavaScript after the fact. This is the single biggest lever in a framework like Next.js: a Server Component or a statically generated page can put the LCP element's real markup directly into the initial HTML response, so it doesn't have to wait behind hydration at all.",
        "Eliminate unnecessary render-blocking CSS/JS: split CSS so only what's needed for the initial view blocks rendering, defer or async non-critical scripts, and audit third-party scripts (analytics, chat widgets, ad tags) since they're a very common, very avoidable source of render-blocking delay.",
        'Improve TTFB itself: cache aggressively, use a CDN close to your users, and avoid slow synchronous work (an uncached database query, a slow API call) sitting directly in the server-render critical path.'
      ]
    },

    { type: 'heading', id: 'inp', level: 2, text: 'INP: Interaction to Next Paint, the responsiveness metric' },
    {
      type: 'paragraph',
      text: 'INP measures something different from loading entirely: once the page has loaded, how quickly does it respond when a real person actually interacts with it? Concretely, INP measures the time from a user interaction (a click, a tap, a key press) to the next moment the browser visually updates the screen in response. It samples interactions across the ENTIRE page visit, not just the first one, and reports a high-percentile value (effectively, close to "the worst interaction you\'re likely to hit"), so it captures the interaction that made a user think "why did this hang" at any point during their session, not just how the page behaved in its first second alive. A good score is 200 milliseconds or less.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'INP replaced FID (First Input Delay) as the responsiveness Vital in 2024',
      text: 'FID, the metric INP replaced, only measured the delay before the browser could even START handling the very first interaction on the page, and stopped there. That left an enormous blind spot: a page could have a great FID (the first click was handled instantly) and still be miserable to use later on, if, say, clicking "Add to cart" for the fifth time triggers a slow re-render that freezes the UI for a second. INP closes that gap by measuring interactions throughout the visit and by measuring the FULL cost of an interaction (processing time plus the time until the next paint reflects it), not just the initial delay before processing starts.'
    },
    {
      type: 'paragraph',
      text: 'To understand why INP goes bad, you need one piece of browser mechanics: JavaScript in a tab runs on a single main thread, and that same thread is also responsible for painting the screen and responding to input. If a piece of your JavaScript is busy running (a "long task"), the browser physically cannot process a click or repaint the screen until that JavaScript finishes and yields control back. A "long task" is formally defined as any single chunk of main-thread JavaScript that runs for more than 50ms without yielding. The longer and more frequent your long tasks are, the more likely a user\'s click lands in the middle of one and has to wait.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Common causes: a large synchronous computation (sorting/filtering a big array, running a client-side search) triggered directly inside a click handler with no yielding; an expensive React re-render cascading through a large component tree after a state update; heavy event handlers doing more work than the interaction actually needs (e.g. re-rendering an entire list on every keystroke of a search box); layout thrashing, where reading a layout property (offsetHeight, getBoundingClientRect) then writing a style, then reading again, repeatedly, forces the browser to recalculate layout synchronously many times over.',
        "Common fixes: break long synchronous work into smaller chunks that yield back to the main thread between pieces (native tools for this include scheduler.yield() and setTimeout(fn, 0) as a rough approximation); debounce or throttle expensive handlers that fire rapidly (a search-as-you-type input doesn't need to re-filter results on literally every keystroke); move genuinely heavy computation off the main thread entirely into a Web Worker, where it can't block paint or input handling no matter how long it takes; and, in React specifically, avoid unnecessary re-renders with memoization (React.memo, useMemo, useCallback) so a state update in one part of the tree doesn't cascade into re-rendering unrelated, expensive subtrees."
      ]
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Bad: a big synchronous computation runs directly inside the click handler,
// blocking the main thread (and therefore all rendering and input) until it's done.
button.addEventListener('click', () => {
  const results = expensiveFilterAndSort(hugeArray); // blocks for, say, 300ms
  renderResults(results);
});

// Better: yield back to the browser before doing the heavy work, so the browser
// gets a chance to paint an immediate response (a loading state, a pressed
// visual) before the expensive work starts eating the main thread.
button.addEventListener('click', async () => {
  showLoadingState();
  await new Promise((resolve) => setTimeout(resolve, 0)); // yield one tick
  const results = expensiveFilterAndSort(hugeArray);
  renderResults(results);
});`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'A fast machine can hide a bad INP from you',
      text: "This is the single most common way INP problems slip past a developer entirely: testing on a fast development laptop makes a 300ms main-thread block feel instant, because the CPU chews through it fast enough that you never notice a freeze. A meaningful share of real users are on mid-range or budget phones with far less CPU headroom, where that same code can take several times longer to run. Throttle your CPU in Chrome DevTools' Performance panel (4x or 6x slowdown) while testing interactions, this single habit surfaces INP problems that a fast dev machine will otherwise completely hide from you."
    },

    { type: 'heading', id: 'cls', level: 2, text: 'CLS: Cumulative Layout Shift, the visual stability metric' },
    {
      type: 'paragraph',
      text: 'CLS measures something almost everyone has personally been annoyed by, even before knowing its name: you go to tap a button, and in the split second before your finger lands, something above it loads in and pushes the whole page down, so you end up tapping the wrong thing entirely, sometimes a link you never meant to open or an ad you never meant to click. CLS is a unitless score (not a time) that sums up every UNEXPECTED layout shift that happens during a page\'s lifetime, where each individual shift is weighted by both how much visible content moved and how far it moved. A good cumulative score is 0.1 or less. Critically, the word "unexpected" is doing real work here: a layout change that happens directly as a result of something the user just did (an accordion they clicked open, expanding and pushing content below it down) is generally NOT counted against CLS, because the user caused it and can reasonably anticipate it. It\'s content shifting around WITHOUT the user having asked for it that CLS is measuring.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "Images, embeds, ads, or iframes with no reserved space: if the browser doesn't know an image's dimensions ahead of time, it renders zero height for it until the image finishes downloading, at which point everything below it suddenly jumps down to make room. This is by far the most common CLS cause on ordinary content sites.",
        'Web fonts causing a reflow on load: if a custom font loads after the page has already rendered text in a fallback font, and the two fonts have different letter widths/heights, the text reflows once the custom font swaps in (this specific flash is called FOUT, flash of unstyled text, versus FOIT, flash of invisible text, where the browser hides text entirely until the font arrives, which trades a layout shift for a period of literally no visible text at all).',
        'Content injected above existing content without reserved space: a cookie consent banner, a promotional bar, or a late-loading ad that inserts itself at the TOP of the page pushes everything else down at an unpredictable moment, often exactly when a user is mid-scroll or about to tap something.',
        'Actions that trigger a layout change with no visual warning: a "Load more" button whose new content appears above the user\'s current scroll position instead of below it, shifting everything the user was looking at.'
      ]
    },
    {
      type: 'code',
      language: 'javascript',
      code: `<!-- Bad: no dimensions given, browser renders 0 height until the image
     downloads, then everything below it jumps -->
<img src="/product.jpg" alt="Product photo" />

<!-- Fixed: explicit width/height (or aspect-ratio in CSS) lets the browser
     reserve the correct amount of space immediately, before the image has
     even started downloading, so nothing below it has to move later -->
<img src="/product.jpg" alt="Product photo" width="800" height="600" />`
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Always set explicit width and height attributes (or a CSS aspect-ratio) on every image, video, and embed, so the browser can reserve the correct space before the asset has downloaded, not after.',
        "Reserve space for ads and other dynamically-injected content with a fixed-size container up front, even if the ad hasn't loaded yet, rather than letting the container grow from zero once content arrives.",
        'Use font-display: swap or font-display: optional together with <link rel="preload"> on your critical web font files, so either the swap happens as early as possible (minimizing how much text has already been read before it reflows) or the browser skips the swap if the font isn\'t ready in time.',
        "Never insert new content above the user's current scroll position (a banner, an unexpected notice) unless it's a direct, immediate response to something the user just did."
      ]
    },

    { type: 'heading', id: 'ttfb', level: 2, text: 'TTFB: not a Core Web Vital itself, but the metric that gates all of them' },
    {
      type: 'paragraph',
      text: "Time to First Byte measures the delay between the browser requesting a page and receiving the very first byte of the response. It is not one of the three official Core Web Vitals, but it deserves real attention because it's the earliest link in the entire chain: nothing else (LCP, FCP, or any rendering at all) can begin until the first byte of HTML has arrived. A slow TTFB doesn't just hurt itself, it pushes out the floor for every subsequent metric, no matter how well the rest of your frontend is optimized."
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Common causes: a server or serverless function that has to run significant work (uncached database queries, slow API calls to other services) before it can start streaming a response back; a "cold start" where a serverless function has to be spun up from scratch because it hasn\'t served a request recently; a server that\'s geographically far from the requesting user, adding pure network latency with nothing to do with your code at all; no caching layer in front of a server that otherwise regenerates the same response repeatedly for different users.',
        "Common fixes: cache rendered pages or API responses aggressively wherever the content doesn't need to be different per-request; serve through a CDN with edge locations near your actual users, so the physical network distance shrinks; keep serverless functions warm or choose a runtime with fast cold starts for latency-sensitive routes; and push slow, non-essential work (analytics writes, non-blocking side effects) OFF the critical path of generating the response, so the response can be sent the moment the essential data is ready."
      ]
    },

    { type: 'heading', id: 'measuring', level: 2, text: 'How to actually measure these: lab data vs field data' },
    {
      type: 'paragraph',
      text: 'There are two fundamentally different ways to get a Core Web Vitals number, and mixing them up is one of the most common sources of confusion when someone says "but it\'s fast when I test it."'
    },
    {
      type: 'table',
      columns: ['Kind', 'Tools', 'What it actually is', 'Best for'],
      rows: [
        [
          'Lab data',
          'Lighthouse, Chrome DevTools Performance panel, WebPageTest',
          'A single simulated run, on one specific device/network profile, usually on a controlled connection',
          'Debugging: reproducible, detailed, lets you dig into exactly what happened in one run'
        ],
        [
          'Field data',
          'Chrome UX Report (CrUX), PageSpeed Insights\' "field data" section, real-user monitoring (RUM) in your own app',
          'Real, aggregated measurements from actual visitors, across whatever real devices/networks/locations they happen to be using',
          "What Google's ranking signal actually uses, and the only way to know how the page truly performs for your real audience"
        ]
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Why your local Lighthouse score can look great while real users are struggling',
      text: 'A Lighthouse run on your own development machine, over a fast office or home connection, with a powerful CPU, and typically an empty browser cache, is close to a best-case scenario. Field data folds in everyone: users on old phones with underpowered CPUs, users on slow mobile networks, users with a dozen browser extensions competing for resources, users returning to a warm cache versus a first-ever cold visit. It is completely normal and expected for field data to look meaningfully worse than a clean lab run, and field data is the one that actually determines the ranking signal and reflects real user experience, so it deserves more weight than a good local Lighthouse score when the two disagree.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Start with PageSpeed Insights for a quick read on both worlds',
          text: "It's free, requires no setup, and shows both a lab-based Lighthouse audit AND, if the URL has enough real traffic in the Chrome UX Report, actual field data for LCP/INP/CLS. This is usually the fastest way to see whether a page has a real problem at all before digging further."
        },
        {
          title: "Use Chrome DevTools' Performance panel to find the specific cause",
          text: 'Once you know a metric is bad, record a Performance trace while reproducing the slow interaction or load. It shows exactly which function call, which re-render, which network request is eating the time, down to the flame graph, which is what actually tells you WHAT to fix rather than just confirming THAT something is slow.'
        },
        {
          title: 'Set up real-user monitoring (RUM) for ongoing visibility',
          text: "The web-vitals JavaScript library (Google's own, small, purpose-built package) can report real LCP/INP/CLS values from actual visitors straight to your own analytics. This is what lets you catch a regression from a new deploy on your actual user base, rather than discovering it weeks later in a Search Console report."
        },
        {
          title: "Check Search Console's Core Web Vitals report periodically",
          text: 'Google Search Console aggregates field data specifically as Google itself sees it, grouped by URL pattern, and flags pages/groups sitting in the "Needs improvement" or "Poor" buckets. This is the closest thing to seeing your site exactly the way the ranking signal sees it.'
        }
      ]
    },

    { type: 'heading', id: 'seo-connection', level: 2, text: 'How Core Web Vitals actually relate to Google search ranking' },
    {
      type: 'paragraph',
      text: 'It\'s worth being precise here, because this gets overstated in both directions constantly. Core Web Vitals are one input into Google\'s broader "page experience" signals, which factor into ranking, but they are a relatively small, tie-breaking-ish factor compared to the dominant force in search ranking: whether your content is actually relevant and high-quality for the query. A page with mediocre Core Web Vitals but genuinely excellent, relevant content will still generally outrank a fast page with thin or irrelevant content. Where Core Web Vitals matter most is as a tie-breaker between pages of otherwise comparable relevance and quality, and, just as importantly, as a direct driver of user behavior regardless of ranking at all: slow, janky, shifting pages measurably increase bounce rate and reduce conversion, independent of anything Google does. In other words, even in a world with zero SEO benefit, fixing these numbers would still be worth doing, because they describe real frustration for real users, which is the reason Google picked them as a signal in the first place rather than the other way around.'
    },
    {
      type: 'heading',
      id: 'summary-table',
      level: 2,
      text: 'Full reference: causes and fixes at a glance'
    },
    {
      type: 'table',
      columns: ['Metric', 'Threshold (good)', 'Top causes', 'Top fixes'],
      rows: [
        [
          'LCP',
          '≤ 2.5s',
          'Slow TTFB, render-blocking CSS/JS, unoptimized images, client-side rendering delaying content',
          'Preload LCP asset, server-render above-the-fold content, modern image formats, reduce render-blocking resources'
        ],
        [
          'INP',
          '≤ 200ms',
          'Long main-thread JS tasks, heavy re-renders, unthrottled event handlers, layout thrashing',
          'Break up long tasks, debounce/throttle handlers, move heavy work to a Web Worker, memoize re-renders'
        ],
        [
          'CLS',
          '≤ 0.1',
          'Images/embeds/ads without reserved dimensions, web font swap reflow, late-injected content above the fold',
          'Explicit width/height or aspect-ratio, reserve space for ads, font-display: swap/optional with preload'
        ],
        [
          'TTFB',
          'No official threshold, lower is always better',
          'Slow server-side work, cold starts, no caching, geographic distance',
          'Cache aggressively, use a CDN, keep functions warm, move non-essential work off the critical path'
        ]
      ]
    }
  ]
};
