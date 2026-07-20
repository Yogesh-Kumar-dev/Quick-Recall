import type { Note } from '@/types/content';

// category values: 'metrics' | 'lcp' | 'inp' | 'cls' | 'tooling' | 'loading'

export const webPerformanceNotes: Note[] = [
  // ─── METRICS ────────────────────────────────────────────────────────────────
  {
    id: 'perf-core-web-vitals',
    title: 'Core Web Vitals: LCP, INP, CLS',
    summary:
      'Google’s three user-experience metrics , how fast the main thing shows up (LCP), how fast the page reacts (INP), how much it jumps around (CLS) , and they affect your search ranking.',
    difficulty: 'basic',
    category: 'metrics',
    prerequisites: ['performance-optimization'],
    textbookDef:
      'Core Web Vitals are a set of field metrics defined by Google measuring loading performance (Largest Contentful Paint), interaction responsiveness (Interaction to Next Paint), and visual stability (Cumulative Layout Shift). A page passes when it meets all three "good" thresholds at the 75th percentile of real-user visits.',
    eli5: 'Judging a restaurant on three things a customer actually feels: how long until the main course lands on the table (LCP), how quickly a waiter responds when you wave (INP), and whether the table wobbles and spills your drink mid-meal (CLS). Kitchen internals do not matter to the diner , these three do.',
    keyPoints: [
      'The three, with their "good" thresholds: LCP ≤ 2.5 seconds (the largest visible thing has rendered), INP ≤ 200 milliseconds (interactions feel instant), CLS ≤ 0.1 (nothing jumps around). Each also has a "needs improvement" band and a "poor" band.',
      'Scores come from real users (field data), judged at the 75th percentile , three-quarters of visits must be good, so your fast laptop on office wifi proves nothing about the median phone on 4G.',
      'They are a confirmed Google Search ranking signal, which is why non-engineers care , but the business case is direct too: industry studies repeatedly show ~0.1s of speed improvement lifting conversions by high single digits.',
      'Why these three: they approximate the user’s felt experience (is it there? does it respond? is it stable?) rather than technical milestones like "DOM ready" that users cannot perceive.',
      'INP replaced First Input Delay (FID) in March 2024 , FID measured only the FIRST interaction and only its input delay; INP watches every interaction for the whole visit and measures until the next frame paints. Interviewers still ask about the switch.',
      'Each metric has a dedicated deep-dive note , this one is the map.'
    ],
    gotcha:
      'Teams optimise the Lighthouse performance SCORE and call Core Web Vitals done , but Lighthouse is a lab simulation on synthetic hardware, and INP barely registers in it (nobody is interacting during the run). Passing CWV means passing in the CrUX field data of real Chrome users, which can disagree with a lab score in either direction.'
  },
  {
    id: 'perf-supporting-metrics',
    title: 'The Supporting Cast: TTFB, FCP, TBT, Speed Index',
    summary:
      'Not Core Web Vitals themselves, but the diagnostic metrics that explain WHY a vital is failing , each one points at a different layer of the stack.',
    difficulty: 'intermediate',
    category: 'metrics',
    prerequisites: ['perf-core-web-vitals'],
    keyPoints: [
      'TTFB (Time To First Byte): from navigation start until the first byte of the HTML response arrives , it is pure backend + network (DNS, TLS, server think-time, CDN distance). Everything else stacks on top of it: a 2-second TTFB makes a 2.5-second LCP arithmetically near-impossible.',
      'FCP (First Contentful Paint): the first moment ANY content (text, image) renders , the user’s first proof the page is alive. The gap between TTFB and FCP is render-blocking work: CSS, synchronous scripts, fonts.',
      'TBT (Total Blocking Time): the lab stand-in for responsiveness , it sums, across all long main-thread tasks between FCP and interactive, the portion of each task beyond 50ms. It carries the largest single weighting (30%) of the Lighthouse performance score, and high TBT in the lab usually predicts poor INP in the field.',
      'Speed Index: how quickly the visible viewport fills in, computed from video frames of the load , a "how complete does it LOOK over time" number that penalises pages which stay blank then pop in all at once.',
      'Reading them as a chain tells you where to dig: slow TTFB → server/CDN/caching problem; TTFB fine but FCP slow → render-blocking resources; FCP fine but LCP slow → the hero resource itself; TBT high → too much JavaScript on the main thread.',
      'All four are lab-measurable and deterministic-ish, which makes them the right regression-test metrics in CI , the vitals are the outcome, these are the levers.'
    ],
    gotcha:
      'TTFB "good" is under 800ms , teams obsessing over image optimisation while their server takes 1.5 seconds to respond are optimising the wrong layer. Check TTFB FIRST in any LCP investigation; on poorly-performing sites it routinely eats most of the LCP budget before a single pixel is the frontend’s fault.'
  },

  // ─── LCP ────────────────────────────────────────────────────────────────────
  {
    id: 'perf-lcp',
    title: 'LCP: Largest Contentful Paint',
    summary:
      'When the biggest thing above the fold finishes rendering , usually the hero image , and the four-part pipeline that decides whether it beats 2.5 seconds.',
    difficulty: 'intermediate',
    category: 'lcp',
    prerequisites: ['perf-core-web-vitals', 'perf-supporting-metrics', 'image-optimization'],
    textbookDef:
      'Largest Contentful Paint marks the render time of the largest image, video poster, or text block visible in the initial viewport. Good is ≤ 2.5s at the 75th percentile; the LCP element can change during load as larger elements render, and the final candidate is reported.',
    eli5: 'LCP is "when does the main course hit the table". Bread sticks arriving early (small text painting fast) is nice, but the diner’s clock runs until the actual dish , the hero image, the headline block , is down and steaming. Everything before that, the page still feels "loading".',
    keyPoints: [
      'The LCP element is whatever is biggest in the first viewport: ~three-quarters of the time an image (hero, product photo, carousel slide), otherwise a heading or text block. DevTools’ Performance panel and PageSpeed Insights name the exact element , always identify it before optimising anything.',
      'LCP decomposes into four sequential parts, and the fix depends on which dominates: TTFB (server slow) → resource load DELAY (browser discovered the image late) → resource load TIME (image big/far) → render delay (element ready but blocked from painting).',
      'Load delay is the classic frontend loss: an image referenced only in CSS (background-image), injected by JavaScript, or lazy-loaded is invisible to the preload scanner and starts downloading seconds late. Fixes: a real <img> in the HTML, <link rel="preload">, fetchpriority="high" , and NEVER loading="lazy" on the LCP image.',
      'Load time fixes are the image-optimisation playbook: modern formats (AVIF/WebP), responsive srcset sizes so phones do not download desktop pixels, compression, and a CDN close to users. Next.js <Image priority> bundles most of this , that is exactly what its priority prop is for.',
      'Render delay: the image arrived but render-blocking CSS, a synchronous script, or client-side rendering (an SPA shell waiting for its JS bundle before showing ANYTHING) holds the paint. Server-side rendering of above-the-fold content is largely an LCP strategy.',
      'Text-LCP pages fail differently: web fonts. font-display: swap shows fallback text immediately (protects LCP, risks a layout shift when the real font lands), preloading the font file narrows the window.'
    ],
    gotcha:
      'The single most common self-inflicted LCP wound is lazy-loading the hero image , loading="lazy" on everything is a "best practice" applied blindly, and it tells the browser the most important image on the page is low priority. Lazy-load below the fold only; the LCP image gets the opposite treatment: eager, preloaded, fetchpriority="high".',
    codeSnippet: `<!-- The LCP image treatment: discovered early, fetched first -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />
<img src="/hero.avif" fetchpriority="high" width="1200" height="600" alt="..." />
<!-- and NOT loading="lazy" -->

<!-- Next.js equivalent: -->
<Image src={hero} priority alt="..." />

// Which of the four parts is slow? Measure in the field:
new PerformanceObserver((list) => {
  const lcp = list.getEntries().at(-1);
  console.log(lcp.element, lcp.startTime);   // the element + when it painted
}).observe({ type: 'largest-contentful-paint', buffered: true });`
  },

  // ─── INP ────────────────────────────────────────────────────────────────────
  {
    id: 'perf-inp',
    title: 'INP: Interaction to Next Paint',
    summary:
      'From click/tap/keypress to the next painted frame , INP grades every interaction of the visit and reports one of the worst, so a single janky handler fails the page.',
    difficulty: 'intermediate',
    category: 'inp',
    prerequisites: ['perf-core-web-vitals', 'async-event-loop'],
    textbookDef:
      'Interaction to Next Paint measures the latency from a user interaction (click, tap, key press) until the next frame is painted, across all interactions in the page’s lifetime, reporting approximately the worst (98th percentile) value. Good is ≤ 200ms. INP replaced First Input Delay as a Core Web Vital in March 2024.',
    eli5: 'You press a lift button. INP is the time until ANYTHING acknowledges you , the button lighting up counts; the lift arriving does not have to. Under 200ms feels like the button works; over half a second, people start jabbing it repeatedly, convinced it is broken , which is exactly what users do to slow UI.',
    keyPoints: [
      'Three phases add up to each interaction’s latency: input delay (main thread busy, your handler cannot even START), processing time (the handler itself runs), presentation delay (rendering the resulting frame). Any of the three can be the problem.',
      'The browser paints nothing while the main thread is busy , a 500ms synchronous handler means half a second of frozen page. The 200ms budget is for the FEEDBACK frame, not the completed work: show the pressed state now, finish the work after.',
      'Input delay is caused by OTHER long tasks: hydration, analytics, a rendering storm from a previous interaction. That is why INP problems often are not in the handler the user blames , the thread was already jammed when the tap landed.',
      'Fix pattern one, break up long tasks: yield to the main thread inside big loops so input can be handled between chunks , await scheduler.yield() (Chrome 129+/Firefox 142+, not yet Safari , fall back to setTimeout(0)), and requestAnimationFrame for paint-aligned updates.',
      'Fix pattern two, do less on interaction: paint feedback first, defer the heavy part (startTransition in React marks the expensive state update as interruptible), move pure computation to a Web Worker, debounce per-keystroke work.',
      'Fix pattern three, render less: presentation delay grows with DOM size and render cost , a keystroke that re-renders a 5,000-row list will miss 200ms no matter how fast the handler is. Virtualise, memoise, narrow the update.'
    ],
    gotcha:
      'Because INP is roughly the worst interaction of a visit, averages hide it and lab tools barely see it (Lighthouse loads the page and clicks nothing). A page can score 100 in Lighthouse and fail INP from one abandoned-cart modal with a 600ms open handler. Finding it requires field data , the web-vitals library’s attribution build tells you WHICH element and WHICH phase.',
    codeSnippet: `// ❌ one synchronous lump: page frozen until done
function onClick() {
  showSpinner();          // painted only AFTER the whole task finishes!
  processAllRows(rows);   // 800ms of main-thread work
}

// ✅ feedback first, work in yielding chunks
async function onClick() {
  showSpinner();                       // paints within the 200ms budget
  for (const chunk of chunks(rows, 500)) {
    processChunk(chunk);
    await scheduler.yield();           // let input + paint happen between chunks
  }
}

// React flavour: keep typing snappy, mark the expensive update interruptible
const [query, setQuery] = useState('');
const [startTransition] = useTransition();
onChange={(e) => {
  setQuery(e.target.value);                    // urgent: the input echo
  startTransition(() => setResults(filter(e.target.value))); // deferrable
}}`
  },

  // ─── CLS ────────────────────────────────────────────────────────────────────
  {
    id: 'perf-cls',
    title: 'CLS: Cumulative Layout Shift',
    summary:
      'A unitless score for how much visible content moves without the user asking , the metric behind "I went to tap the button and an ad shoved it down".',
    difficulty: 'intermediate',
    category: 'cls',
    prerequisites: ['perf-core-web-vitals', 'html-img-responsive'],
    textbookDef:
      'Cumulative Layout Shift measures visual instability: each unexpected shift scores impact fraction (share of viewport affected) × distance fraction (how far it moved), summed within the worst burst (session window) of shifts. Good is ≤ 0.1. Shifts within 500ms of a user interaction are excluded.',
    eli5: 'Reading a newspaper where paragraphs keep hopping to new positions mid-sentence , and sometimes the hop happens the instant your finger descends on "Cancel", which is now "Buy". CLS counts every hop, weighted by how much of the page jumped and how far it went.',
    keyPoints: [
      'The score multiplies how MUCH of the viewport shifted by how FAR it shifted , a footer nudging 2px is noise; the whole article dropping 300px because a banner appeared is a failing score in one event.',
      'Cause #1, media without reserved space: an <img> with no width/height collapses to zero, then shoves everything down when pixels arrive. Fix: always set width and height attributes (the browser derives aspect-ratio and reserves the box) , unsized images affect roughly two-thirds of mobile pages.',
      'Cause #2, injected content: ads, cookie banners, promos inserted ABOVE existing content. Fix: reserve a fixed slot (min-height) whether or not it fills, overlay instead of insert, or add space only below the viewport.',
      'Cause #3, web fonts: fallback and web font metrics differ, so the swap reflows the page. Fixes: font-display: optional (no swap after first paint), preloading the font, and size-adjust/f-mods on the fallback , next/font does this metric-matching automatically.',
      'Cause #4, late-hydrating or client-only UI that pops in above the fold (skeletons that are a different height than the content they become count too , match skeleton dimensions to the real thing).',
      'Only unexpected shifts count: expansion the user triggered (accordion click) is exempt within 500ms, and transform/opacity animations never shift layout , animate those, not top/left/height.'
    ],
    gotcha:
      'CLS is cumulative over the whole visit, not just load , the classic field-only failure is a shift that happens on SCROLL (a lazy-loaded embed or ad slot materialising mid-page). Lab tools that never scroll report 0. If field CLS is bad and lab CLS is clean, hunt below the fold.',
    codeSnippet: `<!-- Reserve the box before pixels arrive -->
<img src="/product.jpg" width="800" height="600" alt="..." />
<!-- or in CSS: --> <style>.thumb { aspect-ratio: 4 / 3; }</style>

/* Reserve the ad slot whether it fills or not */
.ad-slot { min-height: 250px; }

/* Fonts: swap without reflow */
@font-face {
  font-family: 'Brand';
  src: url('/brand.woff2') format('woff2');
  font-display: optional;      /* use it only if it's ready in time */
}

/* Animate transforms, never layout properties */
.toast { transition: transform 200ms; transform: translateY(0); }`
  },

  // ─── TOOLING ────────────────────────────────────────────────────────────────
  {
    id: 'perf-lab-vs-field',
    title: 'Lab vs Field Data: Lighthouse vs CrUX',
    summary:
      'Lab data is a controlled experiment you can rerun; field data is what real users actually experienced , rankings use the field, debugging uses the lab.',
    difficulty: 'intermediate',
    category: 'tooling',
    prerequisites: ['perf-core-web-vitals'],
    textbookDef:
      'Lab data is collected in a controlled, simulated environment (Lighthouse’s throttled load in DevTools or CI). Field data (Real User Monitoring) is aggregated from actual user sessions; the Chrome User Experience Report (CrUX) is Google’s public field dataset and the source of truth for Core Web Vitals assessment.',
    eli5: 'Lab is a treadmill stress test in a clinic: repeatable, instrumented, same conditions every run. Field is a fitness tracker on ten thousand actual customers: messy, delayed, but the only data that reflects real roads, real weather, and real knees. The doctor (you) needs both.',
    keyPoints: [
      'Lab (Lighthouse, WebPageTest, DevTools): deterministic-ish, runs anywhere including CI and pre-production, gives film strips and traces to debug WITH , but it is one synthetic device/network, nobody interacts (so INP is nearly invisible), and nothing below the fold or post-load is exercised.',
      'Field (CrUX, or your own RUM via the web-vitals library): the real distribution across devices, networks, and behaviour , this is what Google ranks on. Costs: you need traffic, and CrUX aggregates over a trailing 28-day window, so a fix takes weeks to fully reflect.',
      'PageSpeed Insights shows both stacked on one page: CrUX field numbers on top (when the URL/origin has enough traffic), a fresh Lighthouse lab run underneath , the fastest way to see whether they disagree.',
      'Disagreements are diagnostic: lab good + field bad → real users are on slower devices or hit post-load problems (scroll CLS, interaction INP) the lab never sees. Lab bad + field good → your audience skews fast; fix it anyway, but calmly.',
      'Search Console’s Core Web Vitals report groups your URLs by pass/fail from CrUX , the practical to-do list, and the place ranking impact becomes visible.',
      'Serious teams run their own RUM (web-vitals library posting to an analytics endpoint) , same metrics as CrUX but real-time, segmentable by page, device, and release, with attribution data CrUX does not expose.'
    ],
    gotcha:
      'The 28-day window bites in both directions: after shipping a fix, PageSpeed Insights "still fails" for weeks (the window still contains pre-fix sessions), and a regression takes weeks to fully surface. Never A/B-judge a performance change by CrUX , use your own RUM for feedback loops, CrUX for the official verdict.'
  },
  {
    id: 'perf-measuring',
    title: 'Measuring in practice: DevTools, web-vitals, CI budgets',
    summary:
      'The practical toolkit: find the LCP element and long tasks in DevTools, capture real-user vitals with the web-vitals library, and stop regressions with budgets in CI.',
    difficulty: 'basic',
    category: 'tooling',
    prerequisites: ['perf-lab-vs-field'],
    keyPoints: [
      'DevTools Performance panel is the microscope: record a load or an interaction and it flags the LCP element, marks layout shifts with attribution, and paints long tasks red on the main-thread track. The Performance insights it surfaces (render-blocking requests, forced reflows) name the fix.',
      'Lighthouse (in DevTools, PageSpeed Insights, or CLI) is the lab audit: metric scores plus ranked opportunities ("properly size images, est. 1.2s"). Run it in an incognito window , extensions pollute results.',
      'The web-vitals npm library is the RUM building block: onLCP/onINP/onCLS callbacks with the official measurement logic; the /attribution build adds WHICH element, which interaction phase, which shift sources , the difference between "INP is 450ms" and "the filter dropdown’s handler blocks 300ms".',
      'Ship the numbers somewhere queryable (analytics event, or navigator.sendBeacon to your own endpoint) and segment by page and device class , aggregate site-wide numbers hide the one broken template.',
      'CI regression gates: Lighthouse CI runs audits per PR against budgets (LCP under X, bundle under Y KB, TBT under Z ms) and fails the build on breach , performance stays a reviewed property instead of an annual crisis.',
      'Quick manual habits that catch most regressions: DevTools network+CPU throttling (Fast 4G, 4× slowdown) to feel what median mobile feels, and the coverage panel to spot dead JavaScript weight.'
    ],
    gotcha:
      'Measuring your dev build is the classic self-deception: React dev mode, unminified bundles, no compression, and HMR wiring can be several times slower than production output. Audit only production builds (next build + start, or the deployed preview) , a Lighthouse run against localhost:3000 dev server tells you nothing you can act on.',
    codeSnippet: `// Real-user vitals with attribution, beaconed to your endpoint:
import { onLCP, onINP, onCLS } from 'web-vitals/attribution';

function send(metric) {
  navigator.sendBeacon('/vitals', JSON.stringify({
    name: metric.name,            // 'LCP' | 'INP' | 'CLS'
    value: metric.value,
    rating: metric.rating,        // 'good' | 'needs-improvement' | 'poor'
    target: metric.attribution?.element ?? metric.attribution?.interactionTarget
  }));
}
onLCP(send); onINP(send); onCLS(send);

# Lighthouse CI budget in the pipeline:
# lighthouserc: assertions: { 'largest-contentful-paint': ['error', { maxNumericValue: 2500 }] }`
  },

  // ─── LOADING ────────────────────────────────────────────────────────────────
  {
    id: 'perf-code-splitting-tree-shaking',
    title: 'Code Splitting & Tree Shaking',
    summary: 'Code splitting ships only the JS a route needs, when it needs it; tree shaking strips out the JS that no route ever uses.',
    difficulty: 'basic',
    category: 'loading',
    prerequisites: ['perf-core-web-vitals'],
    keyPoints: [
      'Code splitting: instead of one giant bundle, the bundler emits multiple smaller chunks (per route, or per dynamic import) so a page only downloads the code it actually needs.',
      'Dynamic import() is the standard trigger , bundlers (Webpack, Turbopack, Rollup/Vite) automatically split anything behind an import() into its own chunk, loaded on demand.',
      'Tree shaking removes dead code at build time by following static ES module import/export graphs , unused exports never make it into the final bundle.',
      'Tree shaking needs static ESM syntax to work , CommonJS (require()) and code with side effects the bundler can’t prove are safe to drop will defeat it, which is why "sideEffects": false in package.json matters for library authors.',
      'The two compound: split first (only load what this route needs), then shake each chunk (strip what even this route never calls).'
    ],
    gotcha:
      'A library that re-exports everything from a single barrel file (export * from "./components") often can’t be tree-shaken effectively , the bundler can’t always prove individual exports are unused, so the whole barrel gets pulled in. Import directly from the specific module when bundle size matters.',
    codeSnippet: `// Code splitting: this chart library only loads when rendered
const Chart = lazy(() => import('./Chart'));

// Tree shaking: only formatCurrency ends up in the bundle,
// even though utils.js exports a dozen functions
import { formatCurrency } from './utils';`
  },
  {
    id: 'perf-list-virtualization',
    title: 'List Virtualization (Windowing)',
    summary: 'Render only the rows currently visible in a long list, not all ten thousand of them, and swap DOM nodes in and out as the user scrolls.',
    difficulty: 'intermediate',
    category: 'loading',
    prerequisites: ['perf-core-web-vitals'],
    keyPoints: [
      'Rendering a long list (thousands of rows) in full creates thousands of DOM nodes , slow initial render, slow scrolling, high memory use, even if only ~20 rows are ever on screen at once.',
      'Windowing/virtualization renders only the visible slice (plus a small buffer above/below) and repositions/recycles that small set of DOM nodes as the user scrolls, using absolute positioning or transforms to fake full-list scroll height.',
      'Libraries: react-window / react-virtual (TanStack Virtual) are the common React picks , react-window for the simple fixed/variable-size-list case, TanStack Virtual for more control.',
      'Trade-off: virtualized lists complicate things that assume every row is in the DOM , Ctrl+F/browser find, SEO crawling of list content, and measuring row height up front for variable-height rows.'
    ],
    gotcha:
      'Virtualizing a short list (a few dozen items) is pure overhead , the windowing math and recycling logic cost more than just rendering the rows would. Reach for it once a list is long enough (hundreds+) to actually matter for LCP/INP.',
    codeSnippet: `import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} width={400} itemSize={48} itemCount={items.length}>
  {({ index, style }) => <div style={style}>{items[index].label}</div>}
</FixedSizeList>`
  },
  {
    id: 'perf-resource-hints',
    title: 'Resource Hints: preload, prefetch & priority',
    summary: '<link rel="preload"> fetches something this page needs right now, urgently; <link rel="prefetch"> fetches something the NEXT page will probably need, low priority.',
    difficulty: 'intermediate',
    category: 'loading',
    prerequisites: ['perf-lcp'],
    keyPoints: [
      'preload: "I need this for the current page, and I need it now" , high priority, use for the LCP image/font/critical script the browser wouldn’t otherwise discover early (e.g. a font referenced only from CSS).',
      'prefetch: "the user will likely go here next" , low priority, fetched during browser idle time and cached, so navigating to that next route/page feels instant. Common on hover-intent for links, or for the next step of a wizard.',
      'preconnect / dns-prefetch: warm up the connection (DNS + TCP + TLS) to a third-party origin before the first real request to it , shaves round-trip time off the first request to that domain (analytics, a CDN, a payment iframe).',
      'fetchpriority="high"/"low" on <img>/<link> fine-tunes priority within the browser’s own request scheduling , pairs with preload for the single most important image on the page.',
      'Priority-based loading in general: give above-the-fold/critical content (hero image, primary CTA, main content) loading priority, and defer everything below the fold (lazy-load images, defer non-critical scripts) , the browser’s default heuristics get this right most of the time, hints correct the cases it doesn’t.'
    ],
    gotcha:
      'Preloading things speculatively "just in case" competes for bandwidth with what the page actually needs right now , preload is a scarce, high-priority signal; overusing it (preloading five fonts, ten scripts) makes the real critical resource wait behind all of them.',
    codeSnippet: `<link rel="preload" as="font" href="/inter.woff2" type="font/woff2" crossorigin />
<link rel="prefetch" href="/next-page" as="document" />
<link rel="preconnect" href="https://analytics.example.com" />
<img src="/hero.avif" fetchpriority="high" />`
  }
];
