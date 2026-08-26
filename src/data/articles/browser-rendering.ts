import type { Article } from '@/types/content';

export const browserRenderingArticle: Article = {
  id: 'browser-rendering',
  slug: 'browser-rendering',
  category: 'Frontend',
  title: 'How a Browser Renders a Page',
  summary:
    'A ground-up walkthrough of everything that happens between typing a URL and seeing pixels: the HTML and CSS parsers, why CSS is render-blocking and scripts are parser-blocking, the layout/paint/composite pipeline, the JavaScript engine that sits alongside it, how the major browsers differ, and how a page can tell which browser it is running in.',
  topics: ['Browser', 'Web Platform', 'Performance'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: 'Most of the front-end advice you have ever been given is really a statement about the browser rendering pipeline in disguise. "Put your scripts at the bottom." "Animate transform, not width." "Inline your critical CSS." "Do not read offsetHeight in a loop." None of those are style preferences. Each one is a shortcut for a specific, mechanical fact about the sequence of steps a browser runs to turn bytes off the network into colored pixels on a screen. Once you have that sequence in your head, the advice stops being a list of rules to memorize and becomes something you can derive on the spot.'
    },
    {
      type: 'paragraph',
      text: 'This article builds that sequence up from nothing. We will follow a single page load from the moment a URL is entered, through two separate parsers producing two separate trees, through the point where a script can interrupt everything, into layout, paint, and composite. Then we will step sideways and look at the JavaScript engine, which is a genuinely different piece of machinery that happens to live in the same program, and finish with what actually differs between Chrome, Firefox, and Safari, and how a page can find out which one it is running inside.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Two engines, one browser',
      text: 'A browser contains at least two major engines that people constantly mix up. The rendering engine (also called the browser engine or layout engine) parses HTML and CSS and is responsible for putting pixels on screen: Blink in Chrome and Edge, Gecko in Firefox, WebKit in Safari. The JavaScript engine executes script: V8 in Chrome, Edge, and Node.js, SpiderMonkey in Firefox, JavaScriptCore in Safari. They are separate codebases with separate jobs. When someone asks "what is V8", they are asking about the second one, and one of the most common wrong answers is describing the first.'
    },

    { type: 'heading', id: 'the-journey', level: 2, text: 'From a URL to the first byte' },
    {
      type: 'paragraph',
      text: 'Before there is anything to render, the browser has to go get it. This part is usually skipped in rendering explanations, which is a shame, because a meaningful chunk of real-world slowness lives here and never touches the rendering pipeline at all.'
    },
    {
      type: 'steps',
      items: [
        {
          title: '1. Resolve the name',
          text: 'The browser turns a hostname like example.com into an IP address via DNS. It checks its own in-memory cache first, then the operating system cache, then asks a resolver over the network. A cold DNS lookup on a fresh connection can cost tens of milliseconds before a single useful byte has moved.'
        },
        {
          title: '2. Open a connection',
          text: 'A TCP connection is established (a three-way handshake), and for HTTPS a TLS handshake follows on top of it to negotiate encryption. This is why connection reuse and hints like preconnect matter: the handshakes are pure overhead that buys you zero content, and paying them again for every third-party domain on the page adds up fast.'
        },
        {
          title: '3. Send the request, wait for the response',
          text: 'The browser sends an HTTP request and waits. The gap between sending the request and receiving the first byte back is Time To First Byte (TTFB), and it is dominated by whatever the server does in that window: a database query, a cold-starting serverless function, a server-side render. Nothing in the rendering pipeline can start before this.'
        },
        {
          title: '4. Receive the HTML as a stream',
          text: 'The response body arrives in chunks, not all at once. This detail matters enormously: the browser does not wait for the full document before it starts working. It begins parsing the first chunk of HTML while later chunks are still in flight, which is exactly what makes streaming server rendering worth doing.'
        }
      ]
    },

    { type: 'heading', id: 'two-parsers', level: 2, text: 'Two parsers, two trees' },
    {
      type: 'paragraph',
      text: 'The browser now has HTML bytes arriving. It has to turn them into something it can reason about, and it does the same thing for CSS. These are two independent parsers producing two independent trees, and the difference in how they behave is the single most useful thing in this entire article.'
    },
    {
      type: 'heading',
      id: 'dom-construction',
      level: 3,
      text: 'HTML becomes the DOM, incrementally'
    },
    {
      type: 'paragraph',
      text: 'The HTML parser converts raw bytes into characters (using the declared character encoding), characters into tokens (a start tag, an attribute, some text, an end tag), tokens into nodes, and nodes into a tree: the Document Object Model. The DOM is a live object model of the document, not a copy of your source text. It is what document.querySelector searches and what element.appendChild mutates.'
    },
    {
      type: 'paragraph',
      text: 'The crucial property is that DOM construction is incremental. The parser can build a valid partial tree from a partial document, which is why a slow-loading page can show you a header and some text while the rest is still downloading. It is also extraordinarily forgiving: the HTML parsing algorithm is specified down to how to recover from unclosed tags and misnested elements, which is why a broken HTML document still renders something instead of throwing an error the way a broken JSON file would.'
    },
    {
      type: 'heading',
      id: 'cssom-construction',
      level: 3,
      text: 'CSS becomes the CSSOM, and not incrementally'
    },
    {
      type: 'paragraph',
      text: 'CSS goes through a similar bytes-to-tokens-to-tree pipeline and produces the CSS Object Model. But the CSSOM cannot be used until it is complete, and the reason is the cascade. A rule near the bottom of a stylesheet can override a rule near the top. If the browser painted using a half-built CSSOM, an element could be styled with a rule that a not-yet-parsed rule was about to override, and the user would see the page visibly restyle itself. Browsers consider that flash worse than a short delay, so they refuse to paint until every stylesheet the document has declared is downloaded and parsed.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'This is what "CSS is render-blocking" actually means',
      text: 'It is not a vague performance warning. It is a hard rule: a <link rel="stylesheet"> in the head blocks first paint entirely until that file is downloaded and parsed. One slow stylesheet on a slow connection holds the entire page at a blank screen. This is the mechanical reason behind inlining critical CSS (the styles needed for the initial view go directly in the HTML so they arrive with it) and behind splitting off non-critical CSS with a media attribute so it does not block.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `<!-- Render-blocking: nothing paints until this downloads and parses -->
<link rel="stylesheet" href="/styles.css" />

<!-- Not render-blocking: the media query is false at load time, so the
     browser downloads it at low priority and does not wait for it -->
<link rel="stylesheet" href="/print.css" media="print" />

<!-- The pattern for non-critical CSS: load it as a non-matching stylesheet,
     then flip it to "all" once it has arrived -->
<link rel="stylesheet" href="/below-fold.css" media="print" onload="this.media='all'" />`
    },

    { type: 'heading', id: 'scripts-interrupt', level: 2, text: 'Where JavaScript interrupts everything' },
    {
      type: 'paragraph',
      text: 'A plain <script src="..."> tag is the biggest interruption in the whole process. When the HTML parser reaches one, it stops. It stops building the DOM, downloads the script, hands it to the JavaScript engine, waits for it to finish executing, and only then resumes parsing. This is called parser-blocking, and the reason for it is that a script is allowed to call document.write() and inject arbitrary markup at that exact position in the document, so the parser genuinely cannot know what comes next until the script has run.'
    },
    {
      type: 'paragraph',
      text: 'There is a second, less obvious interaction that catches people out. A script can read computed styles (getComputedStyle), so a script cannot run until the CSSOM is ready. That means a stylesheet still downloading will block a script below it, which in turn blocks the parser. A slow CSS file can therefore stall DOM construction even though CSS and HTML are supposedly parsed independently.'
    },
    {
      type: 'table',
      columns: ['Attribute', 'When it downloads', 'When it runs', 'Blocks the parser?', 'Order guaranteed?'],
      rows: [
        ['(none)', 'Immediately, parser stops and waits', 'As soon as it has downloaded', 'Yes, fully', 'Yes'],
        [
          'async',
          'In parallel with parsing',
          'The instant it finishes downloading, interrupting the parse',
          'Only while it executes',
          'No, whichever lands first runs first'
        ],
        [
          'defer',
          'In parallel with parsing',
          'After the document is fully parsed, before DOMContentLoaded',
          'No',
          'Yes, in document order'
        ],
        ['type="module"', 'In parallel with parsing', 'Deferred by default, after parsing', 'No', 'Yes']
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The practical rule',
      text: 'Use defer for anything that touches your page, because it never blocks parsing and still runs in a predictable order. Use async only for genuinely independent third-party scripts (an analytics beacon) where execution order does not matter and nothing else depends on it. Reach for a bare <script> in the head only when you actually need it to run before the page is parsed, which is rare and usually a mistake.'
    },

    { type: 'heading', id: 'render-tree', level: 2, text: 'The render tree: DOM plus CSSOM' },
    {
      type: 'paragraph',
      text: 'With a DOM and a CSSOM in hand, the browser combines them into a render tree (Blink calls its equivalent the layout tree). Each node in the render tree is something that will actually be drawn, paired with its final computed style. Two kinds of things are excluded, and the distinction between them is a classic interview question.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Nodes that are never visual at all: <head>, <meta>, <script>, <title>. They have no box to draw.',
        'Nodes hidden with display: none. The element exists in the DOM and JavaScript can still find it, but it produces no box, so it is left out of the render tree entirely and costs nothing to lay out or paint.',
        'Note the contrast with visibility: hidden, which DOES produce a box. It is in the render tree, it occupies its full space in layout, it just is not painted. And opacity: 0 goes further still: it is laid out AND painted, it is simply painted fully transparent, and it still receives clicks.'
      ]
    },

    { type: 'heading', id: 'layout-paint-composite', level: 2, text: 'Layout, paint, composite' },
    {
      type: 'paragraph',
      text: 'The render tree says what to draw and how it should look, but not where anything goes or what the actual pixels are. Three more stages handle that, and they run in a fixed order.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Layout (also called reflow)',
          text: 'The browser walks the render tree and computes the exact geometry of every box: its width, height, and position in the viewport, in real pixels. This is where percentages, flexbox distribution, grid tracks, and text line-breaking are all resolved. Layout is expensive because it is inherently interdependent: changing the width of one element can change the height of its parent, which can move every sibling below it. A layout is usually a whole-subtree operation, not a single-element one.'
        },
        {
          title: 'Paint (also called rasterization)',
          text: 'The browser fills in the actual pixels for each box: backgrounds, borders, text glyphs, shadows, images. It does this into one or more layers rather than directly onto the screen. Painting is the stage that cares about color, background-image, box-shadow, and border-radius. It does not care where anything is, because layout already answered that.'
        },
        {
          title: 'Composite',
          text: 'The painted layers are assembled into the final image and handed to the GPU to put on screen. Because layers are separate textures, a layer can be moved, scaled, rotated, or faded by the compositor without repainting its contents at all. This is the cheapest kind of visual change a browser can make, and it is the entire reason the transform/opacity advice exists.'
        }
      ]
    },
    {
      type: 'table',
      columns: ['What you change', 'Layout', 'Paint', 'Composite', 'Cost'],
      rows: [
        ['width, height, margin, padding, top, left, font-size', 'Yes', 'Yes', 'Yes', 'Most expensive, the full pipeline reruns'],
        ['color, background-color, box-shadow, border-radius, visibility', 'No', 'Yes', 'Yes', 'Moderate, geometry is reused'],
        ['transform, opacity, filter (on a promoted layer)', 'No', 'No', 'Yes', 'Cheapest, the GPU handles it alone'],
        ['Adding or removing a DOM node', 'Yes', 'Yes', 'Yes', 'Full pipeline, plus render-tree rebuilding']
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Layout thrashing: the pattern that quietly destroys frame rate',
      text: 'Browsers batch style changes and flush layout lazily, so a run of writes costs one layout, not many. But reading a geometry property (offsetHeight, offsetTop, getBoundingClientRect, scrollTop, getComputedStyle) forces the browser to flush any pending changes and compute layout RIGHT NOW so it can give you an accurate number. Alternating write, read, write, read inside a loop therefore forces a synchronous layout on every single iteration. The fix is to batch: do all your reads first, then all your writes.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Layout thrashing: each read forces a synchronous layout because the
// previous write invalidated it. O(n) forced layouts for n items.
for (const box of boxes) {
  box.style.width = box.offsetWidth + 10 + 'px'; // read, then write, then read...
}

// Batched: read every value first, then write. One layout total.
const widths = boxes.map((box) => box.offsetWidth); // all reads
boxes.forEach((box, i) => {
  box.style.width = widths[i] + 10 + 'px';          // all writes
});`
    },
    {
      type: 'paragraph',
      text: 'The same pipeline reruns for every frame of an animation. At 60 frames per second the browser has roughly 16.7 milliseconds to produce each frame, and that budget covers script execution, style recalculation, layout, paint, and composite. Animating width means running all five stages inside that budget, sixty times a second. Animating transform means running only the last one. That is the difference between a smooth animation and a stuttering one, and it is why "animate transform and opacity" is mechanical advice rather than taste.'
    },

    { type: 'heading', id: 'js-engine', level: 2, text: 'The JavaScript engine, a separate machine' },
    {
      type: 'paragraph',
      text: 'Everything so far is the rendering engine. The JavaScript engine is a distinct program with its own pipeline, and understanding that pipeline is what the question "what is V8" is really after. V8 is Google\'s open-source JavaScript engine, written in C++, used by Chrome, Edge, Node.js, Deno, and Electron. Its job is narrow: take JavaScript source text and execute it, as fast as possible.'
    },
    {
      type: 'steps',
      items: [
        {
          title: '1. Parse into an Abstract Syntax Tree',
          text: 'The source text is tokenized and parsed into an AST, a tree representation of the program structure. V8 uses lazy parsing here as an optimization: functions that are not called yet get a quick pre-parse that only checks syntax, and are fully parsed only when they are actually invoked, so startup does not pay for code that never runs.'
        },
        {
          title: '2. Compile to bytecode (Ignition)',
          text: "V8's interpreter, Ignition, compiles the AST to a compact bytecode and starts executing it immediately. Bytecode is not machine code, it is an intermediate instruction set for V8's own virtual machine. Starting here rather than compiling everything to machine code up front means execution begins almost instantly, and memory usage stays low."
        },
        {
          title: '3. Profile and optimize hot paths (TurboFan)',
          text: 'While Ignition runs the bytecode, it records profiling data: which functions run often, and what types their variables actually held. When a function becomes "hot", the optimizing compiler TurboFan compiles it to highly optimized machine code, using those observed types as assumptions. A loop that has only ever seen numbers gets compiled as if it will only ever see numbers, which is dramatically faster than the general case.'
        },
        {
          title: '4. Deoptimize when the assumptions break',
          text: 'Those assumptions are speculative, so V8 guards them. If your always-numbers function is suddenly passed a string, the guard fails, the optimized code is thrown away, and execution falls back ("deoptimizes") to the bytecode interpreter. This is why writing type-stable code matters for hot paths, and why a function that changes the shape of its objects mid-loop can be shockingly slow.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'The engine is not the runtime',
      text: 'V8 implements the ECMAScript language and nothing else. It knows about Object, Array, Promise, and the syntax of the language. It has no idea what document, window, fetch, localStorage, or setTimeout are. Those are supplied by the host environment: the browser provides the DOM and the Web APIs, and Node.js provides fs, http, and process instead. This is exactly why the same engine can run both browser and server JavaScript, and why "V8 is a browser thing" is wrong. It also explains the event loop: the loop itself is part of the host, not the engine, which is why setTimeout behaves the way it does in a browser and slightly differently in Node.'
    },
    {
      type: 'paragraph',
      text: 'JavaScript execution and rendering share one main thread per tab. That single fact explains most perceived jank: while your JavaScript is running, the browser physically cannot recalculate style, run layout, or paint. A synchronous task that runs for 300 milliseconds freezes the page for 300 milliseconds, no matter how well-optimized your CSS is. The escape hatches are breaking work into chunks that yield back to the event loop, or moving genuinely heavy computation into a Web Worker, which runs on its own thread and therefore cannot block rendering at all (at the cost of having no DOM access).'
    },

    { type: 'heading', id: 'different-browsers', level: 2, text: 'How this differs across browsers' },
    {
      type: 'paragraph',
      text: 'The question "how does JavaScript execute inside different browsers" has a reassuring answer and an important caveat. The reassuring answer: every mainstream engine implements the same specification, ECMAScript, maintained by TC39. Closures, prototypes, hoisting, the event loop\'s ordering of microtasks and macrotasks, coercion rules, all of it is specified behavior. Correct JavaScript produces the same results everywhere. You are not writing different JavaScript for different browsers, and have not needed to for a long time.'
    },
    {
      type: 'table',
      columns: ['Browser', 'Rendering engine', 'JavaScript engine'],
      rows: [
        ['Chrome', 'Blink', 'V8'],
        ['Edge (2020 onward)', 'Blink', 'V8'],
        ['Firefox', 'Gecko', 'SpiderMonkey'],
        ['Safari (and every iOS browser)', 'WebKit', 'JavaScriptCore'],
        ['Node.js (not a browser, no rendering engine)', 'None', 'V8']
      ]
    },
    {
      type: 'paragraph',
      text: 'The caveat is that "same language semantics" is not "same behavior". Real differences live in three places, and all three are outside the ECMAScript spec proper.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        "Performance characteristics. Each engine has its own JIT tiers, garbage collector, and inline-cache strategy. Code tuned to be fast in V8 is not automatically fast in JavaScriptCore. This is why micro-benchmarks are so often misleading: you are frequently measuring one engine's optimizer rather than anything about the language.",
        'Web API availability and timing. The DOM, fetch, IndexedDB, Web Push, and the rest are specified by WHATWG and W3C, not TC39, and browsers ship them on different schedules with different edge-case behavior. Safari in particular has historically lagged on some APIs and diverged on storage eviction policies. This is where cross-browser bugs actually come from, far more than from the language.',
        'New language features during their rollout window. A brand-new syntax feature can be shipped in V8 months before JavaScriptCore. In practice your build tooling erases this: transpilers and polyfills target a browserslist and compile the difference away, which is why you rarely feel it.'
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Why every browser on iOS is Safari underneath',
      text: 'Until very recently, Apple required every browser on iOS to use the system WebKit engine. Chrome on iOS is a Chrome-branded interface wrapped around WebKit and JavaScriptCore, not Blink and V8. If you have ever had a bug that reproduces on "Chrome on iPhone" but not on Chrome anywhere else, this is why: you are debugging Safari.'
    },

    { type: 'heading', id: 'which-browser', level: 2, text: 'How a page knows which browser it is running in' },
    {
      type: 'paragraph',
      text: 'There are two ways to answer this, and the difference between them is one of the more consequential judgment calls in front-end work. The obvious way is to ask the browser to identify itself. The correct way, almost always, is to not ask at all.'
    },
    {
      type: 'heading',
      id: 'ua-sniffing',
      level: 3,
      text: 'Reading the User-Agent string, and why it lies'
    },
    {
      type: 'paragraph',
      text: 'Every request carries a User-Agent header, readable in JavaScript as navigator.userAgent. In principle it names the browser and version. In practice it is one of the great disasters of the web platform, because it has been deliberately falsified for thirty years. Sites gated features on the UA string, so new browsers claimed to be older ones to get past the gate, and every browser accumulated the names of its predecessors. The result is that a modern Chrome UA string still contains "Mozilla", "AppleWebKit", "KHTML, like Gecko", and "Safari".'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// A real Chrome on Windows user-agent string. Count the browsers it claims
// to be. Every one of these names is there for backwards compatibility with
// some site's sniffing code from a previous decade.
navigator.userAgent;
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
//  (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

// Naive sniffing that is wrong in both directions:
const isSafari = navigator.userAgent.includes('Safari'); // true in Chrome!
const isChrome = navigator.userAgent.includes('Chrome'); // also true in Edge!`
    },
    {
      type: 'paragraph',
      text: 'Browsers are actively reducing the information in the UA string (a process called User-Agent reduction) because it is also a fingerprinting vector. Chrome has frozen much of it and moved the detailed data behind User-Agent Client Hints, a structured API (navigator.userAgentData) that requires the site to explicitly request the high-entropy values. So the UA string is not just unreliable, it is getting less informative on purpose.'
    },
    {
      type: 'heading',
      id: 'feature-detection',
      level: 3,
      text: 'Feature detection: ask what it can do, not who it is'
    },
    {
      type: 'paragraph',
      text: 'The thing you actually want to know is almost never "is this Safari". It is "can I use this API". Feature detection asks that question directly, and it is correct by construction: it stays right when a browser adds the feature next month, it works in browsers that did not exist when you wrote the code, and it cannot be fooled by a spoofed string.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Feature detection: correct today, and still correct in five years.
if ('IntersectionObserver' in window) {
  observeLazyImages();
} else {
  loadAllImagesEagerly();          // baseline still works
}

if (typeof navigator.share === 'function') {
  showNativeShareButton();
}

// CSS has the same idea, built into the language:
// @supports (backdrop-filter: blur(1px)) { .panel { backdrop-filter: blur(8px); } }

// The rare legitimate exception: a known, browser-specific BUG that no
// capability check can express. Comment WHY, and link the bug.
const isIosSafari = /iP(hone|ad|od)/.test(navigator.userAgent) && !('MSStream' in window);`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The rule, stated plainly',
      text: 'Detect features, not browsers. Reach for the User-Agent string only for a specific, documented browser bug that has no capability-based test, and leave a comment explaining exactly which bug so the hack can be deleted when it is fixed. If you find yourself branching on browser identity to decide which feature to use, you almost certainly want @supports or an "in window" check instead.'
    },

    { type: 'heading', id: 'what-this-buys-you', level: 2, text: 'What the pipeline buys you in practice' },
    {
      type: 'paragraph',
      text: 'Here is the whole thing in one pass: bytes arrive, HTML parses incrementally into the DOM, CSS parses non-incrementally into the CSSOM and blocks first paint until it is complete, a synchronous script stops the parser dead and is itself blocked by pending CSS, the DOM and CSSOM merge into a render tree of only the visible boxes, layout computes geometry, paint fills pixels into layers, and the compositor assembles those layers on the GPU. Alongside all of that, on the same thread, a separate JavaScript engine parses your script to an AST, interprets it as bytecode, JIT-compiles the hot parts, and occasionally throws that compiled code away when its type assumptions turn out to be wrong.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Ship less render-blocking CSS, and inline what the first screen needs. You are shortening the mandatory wait before first paint.',
        "Put defer on your scripts. You are removing them from the parser's critical path entirely.",
        'Animate transform and opacity. You are skipping layout and paint and asking only the compositor to do work.',
        'Batch DOM reads before DOM writes. You are avoiding forced synchronous layouts inside a loop.',
        'Prefer display: none over off-screen positioning for genuinely hidden content. You are removing it from the render tree instead of laying it out and painting it where nobody can see it.',
        'Move heavy computation to a Web Worker. You are getting it off the one thread that also has to paint.',
        'Detect features, not browsers. You are writing code that stays correct as engines change underneath it.'
      ]
    },
    {
      type: 'paragraph',
      text: 'None of those are separate facts to remember. They are all the same fact, viewed from different points along one pipeline.'
    }
  ]
};
