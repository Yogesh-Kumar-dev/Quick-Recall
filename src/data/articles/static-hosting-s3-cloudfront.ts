import type { Article } from '@/types/content';

export const staticHostingS3CloudfrontArticle: Article = {
  id: 'static-hosting-s3-cloudfront',
  slug: 'static-hosting-s3-cloudfront',
  title: 'Static Website Hosting: S3 + CloudFront + Route 53',
  summary:
    'A from-scratch, beginner-first walkthrough of the standard AWS setup for hosting a static site or SPA build: what a static site even is, why S3 alone is not enough, how CloudFront and DNS fit in, and a full step-by-step deployment.',
  topics: ['Hosting', 'AWS', 'CDN', 'DNS'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: 'If you have only ever run `npm run dev` and looked at your app on localhost, the idea of "hosting" can feel like a black box. This article opens that box completely. We will start from the most basic question, what does it even mean to host a website, and build up, piece by piece, to the exact setup that most production React, Vue, and Next.js static exports use on AWS: an S3 bucket, a CloudFront distribution, a Route 53 domain, and an ACM certificate, working together.'
    },
    { type: 'heading', id: 'what-is-a-static-site', level: 2, text: 'What does "static site" actually mean?' },
    {
      type: 'paragraph',
      text: 'When you run a build command like `vite build` or `next build` (in static export mode), your entire application gets compiled down into a folder full of plain files: HTML, CSS, JavaScript, images, fonts. There is no server-side code running per request, no database query happening when someone visits the page. The browser asks for a file, and a server hands back exactly that file, unchanged, every time. That is what "static" means here: the response does not change based on server-side logic at request time.'
    },
    {
      type: 'paragraph',
      text: 'Compare that to a dynamic site, like a Node.js/Express API or a Next.js app running in server mode, where a request triggers actual code execution on a server: maybe a database lookup, maybe some server-side rendering of HTML tailored to that specific request. A static site skips all of that. It is just files sitting somewhere, waiting to be served. This matters because "serving files" is a much simpler, cheaper, and more scalable problem than "running a server," and cloud providers have purpose-built, very cheap services just for it.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'A single-page app (SPA) is still "static" here',
      text: 'Even though a React app feels dynamic once it loads (routing, state, interactivity), the files themselves (index.html, a JS bundle, a CSS bundle) are static: the server never modifies them per request. All the "dynamic" behavior happens later, in the browser, after those static files have already been downloaded. That distinction is exactly why this hosting pattern works for SPAs.'
    },
    { type: 'heading', id: 'what-is-s3', level: 2, text: 'What is S3, in plain terms?' },
    {
      type: 'paragraph',
      text: 'Amazon S3 (Simple Storage Service) is, at its core, a place to store files in the cloud and retrieve them over the internet using plain HTTP requests. Think of it like a giant, infinitely scalable folder that lives on AWS servers instead of your laptop. You organize files inside containers called "buckets" (a bucket is roughly like a top-level folder with a globally unique name, e.g. my-app-prod-assets), and every file you put inside gets an "object key," which behaves like a file path, e.g. assets/index-a1b2c3.js.'
    },
    {
      type: 'paragraph',
      text: 'S3 was not originally designed to be a web server. It was designed to be reliable, cheap, durable storage: the kind of service where you don\'t worry about a hard drive failing and your files disappearing. But because it can serve any object back over HTTP if you ask it to, and because AWS added a specific "static website hosting" mode to it, S3 became a natural, extremely cheap place to host a static site\'s build output.'
    },
    { type: 'heading', id: 'why-a-cdn-is-needed', level: 2, text: 'Why is a CDN needed at all? (Latency, origin load, and caching)' },
    {
      type: 'paragraph',
      text: 'This is the question that trips up most beginners: "S3 can already serve my files over HTTP, so why do I need CloudFront on top of it?" To answer that, you first need to understand a physical constraint of the internet: distance costs time. An S3 bucket physically lives in one AWS region, e.g. us-east-1, which is a data center (technically several) in Northern Virginia. Every single request to that bucket, no matter where in the world the visitor is, has to physically travel to Virginia and back.'
    },
    {
      type: 'paragraph',
      text: 'If your visitor is in Virginia, that round trip might take 10 milliseconds. If your visitor is in Tokyo, Sydney, or Mumbai, that same round trip could take 200 to 300 milliseconds, just for the network hop, before the browser has even started downloading the file. For a site with dozens of assets (JS chunks, CSS, fonts, images), that latency compounds and makes the site feel sluggish everywhere except near Virginia.'
    },
    {
      type: 'heading',
      id: 'what-is-an-edge-location',
      level: 3,
      text: 'Edge locations: bringing the content closer to the visitor'
    },
    {
      type: 'paragraph',
      text: 'A Content Delivery Network (CDN), and CloudFront specifically, solves this by keeping copies of your files at many small data centers scattered around the world, called "edge locations." AWS operates hundreds of these. When a visitor in Tokyo requests your site, CloudFront serves them from an edge location physically near Tokyo, not from the S3 bucket in Virginia. The round trip drops from hundreds of milliseconds to something closer to what a visitor near Virginia experiences.'
    },
    {
      type: 'paragraph',
      text: 'The way this works is called caching. The first time any edge location gets a request for a file it has not seen before (or whose cached copy expired), it fetches that file once from the "origin" (in our case, the S3 bucket) and stores a copy locally. Every subsequent request for that same file, from any nearby visitor, gets served straight from that local copy: no trip back to Virginia required. The S3 bucket is only contacted occasionally, to refresh cached copies, not for every single visitor.'
    },
    { type: 'heading', id: 'origin-load-reduction', level: 3, text: 'A second, less obvious benefit: protecting the origin' },
    {
      type: 'paragraph',
      text: 'Beyond speed, a CDN also protects your origin (S3) from being hammered by traffic. Imagine your site suddenly goes viral and gets a million visitors in an hour. Without a CDN, all one million requests, for every asset on every page, would hit S3 directly. With CloudFront caching in front, the vast majority of those requests get answered by edge locations without ever reaching S3 at all, since the files rarely change. This is called "reducing origin load," and it is one of the main reasons CDNs exist even for sites that are not (yet) global.'
    },
    {
      type: 'table',
      columns: ['Without CloudFront (S3 alone)', 'With CloudFront in front of S3'],
      rows: [
        ['Every request travels to one AWS region', 'Requests are served from the nearest of hundreds of edge locations'],
        ['No HTTPS on a custom domain', 'HTTPS via a free ACM certificate, on your own domain'],
        ['Bucket usually must be public to serve files', 'Bucket stays private; CloudFront reads it via Origin Access Control'],
        ['Every visitor hits the origin directly', 'Most requests are served from cache, origin is barely touched'],
        ['No fine-grained caching/invalidation controls', 'Configurable cache behaviors, TTLs, and invalidation on deploy']
      ]
    },
    { type: 'heading', id: 'how-cloudfront-distributions-work', level: 2, text: 'How a CloudFront distribution actually works' },
    {
      type: 'paragraph',
      text: 'In CloudFront, the thing you create is called a "distribution." A distribution is a configuration object that ties together: one or more origins (where the real files live, here your S3 bucket), one or more cache behaviors (rules for how to cache different paths), a certificate for HTTPS, and a domain name that CloudFront generates for you automatically, something like d1a2b3c4d5e6f7.cloudfront.net.'
    },
    {
      type: 'paragraph',
      text: 'When you first create a distribution, it has no cached content anywhere. The first request for each file, from each edge location, is a "cache miss": CloudFront fetches it from S3, serves it to the visitor, and stores a copy at that edge location. Every subsequent request for that file from a nearby visitor is a "cache hit": CloudFront serves the stored copy directly, without touching S3 at all. How long a cached copy stays valid before CloudFront checks with the origin again is controlled by a Time To Live (TTL), which you configure per cache behavior (or which is set by cache-control headers coming from S3).'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Origin Access Control (OAC): why the bucket can stay private',
      text: 'Older tutorials have S3 buckets set to fully public so anyone can fetch files directly from the S3 URL. The modern, recommended approach is Origin Access Control (OAC): you configure the S3 bucket policy to only allow requests that come from your specific CloudFront distribution (verified via a signed identity), and you block all other public access to the bucket. Visitors can only ever reach your files through CloudFront, never by guessing the raw S3 URL. This is both more secure and lets you enforce HTTPS, custom error pages, and caching rules consistently, since there is no "back door" path that skips CloudFront.'
    },
    { type: 'heading', id: 'https-and-acm', level: 2, text: 'HTTPS and ACM certificates' },
    {
      type: 'paragraph',
      text: 'HTTPS is the encrypted version of HTTP: it stops anyone snooping on the network (a coffee shop wifi, an ISP) from reading or tampering with traffic between the browser and the server. Modern browsers actively warn visitors, or even block certain features (like clipboard access or service workers), on plain HTTP sites, so HTTPS on a custom domain is effectively mandatory today, not optional.'
    },
    {
      type: 'paragraph',
      text: 'To serve HTTPS, a server needs a TLS certificate: a small cryptographically signed file that proves "this server is authorized to serve traffic for yourdomain.com." AWS Certificate Manager (ACM) is the service that issues these certificates for free, as long as you use them with other AWS services like CloudFront. You request a certificate for your domain (e.g. quickrecall.dev and *.quickrecall.dev for subdomains), AWS asks you to prove you own the domain (usually by adding a specific DNS record, which Route 53 can do automatically), and once verified, the certificate is issued and can be attached to your CloudFront distribution.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The us-east-1 gotcha',
      text: 'This trips up almost everyone the first time: a certificate used with CloudFront MUST be requested in the us-east-1 (N. Virginia) region specifically, no matter which region your other resources (like your S3 bucket) live in. Request it in the wrong region, and CloudFront simply will not let you select it when you try to attach it to your distribution. There is no workaround, only re-requesting it in us-east-1.'
    },
    { type: 'heading', id: 'what-is-dns-and-route-53', level: 2, text: 'What is DNS, and what does Route 53 do?' },
    {
      type: 'paragraph',
      text: 'Every server on the internet is really reached by an IP address (a number like 203.0.113.25), but humans type domain names like quickrecall.dev instead. The Domain Name System (DNS) is the internet\'s phonebook: it translates a human-readable domain name into the actual address (or, in CloudFront\'s case, effectively a pointer to the right service) a browser should connect to. A "DNS record" is one entry in that phonebook, mapping a name to a value.'
    },
    {
      type: 'paragraph',
      text: "Route 53 is AWS's DNS service: it hosts the phonebook entries for your domain and answers lookup requests from browsers (and every other client) around the world. To use Route 53 for a domain, you either register the domain directly through Route 53, or you register it elsewhere (Namecheap, GoDaddy, etc.) and point that registrar's \"nameservers\" setting at Route 53, so Route 53 becomes the authoritative source of truth for that domain's DNS records."
    },
    {
      type: 'heading',
      id: 'alias-vs-cname',
      level: 3,
      text: 'Why an ALIAS record, not a plain CNAME'
    },
    {
      type: 'paragraph',
      text: 'A CNAME record says "this name is really just another name, go look that one up instead." You might think you could create a CNAME from quickrecall.dev to your CloudFront domain, but DNS rules forbid a CNAME on an apex/root domain (a domain with nothing before it, like quickrecall.dev, as opposed to www.quickrecall.dev). The root of a domain is required to have certain other record types (like MX for mail) alongside it, and a CNAME cannot coexist with those.'
    },
    {
      type: 'paragraph',
      text: 'Route 53 solves this with a proprietary, AWS-only record type called an "ALIAS" record. It behaves like a CNAME (it points your domain at another AWS resource\'s domain name, like your CloudFront distribution) but is allowed at the apex/root, and it has a nice side benefit: Route 53 does not charge you for DNS lookups against an ALIAS record that points at another AWS resource. This is why every AWS static-hosting tutorial has you create an ALIAS record pointing at the CloudFront distribution\'s domain name, not a CNAME.'
    },
    { type: 'heading', id: 'putting-it-together', level: 2, text: 'Putting the four pieces together' },
    {
      type: 'paragraph',
      text: "With all four building blocks explained individually, here is how they connect end to end, in the order a request actually flows: a visitor types quickrecall.dev, their browser asks Route 53 (DNS) where that resolves to, Route 53's ALIAS record points them at your CloudFront distribution, the browser connects to the nearest CloudFront edge location over HTTPS (using the ACM certificate to prove authenticity), and CloudFront serves the requested file either from its local cache or, on a cache miss, by fetching it once from the private S3 bucket (via Origin Access Control) and caching it for next time."
    },
    {
      type: 'steps',
      items: [
        {
          title: 'S3 bucket: storage & origin',
          text: 'Holds the built assets (the dist/ or build/, or Next.js static export, output). Kept private, never exposed directly. CloudFront reads from it via Origin Access Control (OAC), so the bucket itself never needs public access or a public URL.'
        },
        {
          title: 'CloudFront: CDN, HTTPS, caching',
          text: 'Sits in front of the bucket, caching assets at edge locations around the world and terminating HTTPS using an ACM certificate. This is what actually answers real visitor requests; S3 is only ever contacted by CloudFront itself, on a cache miss.'
        },
        {
          title: 'ACM: certificate',
          text: 'Issues a free TLS certificate for your domain, requested in us-east-1 specifically (CloudFront only accepts certificates from that region, regardless of where your other resources live), and attaches it to the distribution so HTTPS works on your custom domain.'
        },
        {
          title: 'Route 53: DNS',
          text: "Hosts your domain's DNS records. An ALIAS record (not a plain CNAME, since apex domains cannot use CNAME) on your domain points at the CloudFront distribution's generated domain name."
        }
      ]
    },
    { type: 'heading', id: 'spa-routing', level: 2, text: 'The single-page app routing gotcha' },
    {
      type: 'paragraph',
      text: 'This is the single most common thing that breaks the first time someone deploys a React (or Vue, or Angular) SPA to S3 + CloudFront, so it earns its own section. A client-side router (React Router, TanStack Router, etc.) handles a path like /job-tracker entirely inside the browser, using JavaScript that is already loaded, without ever making a real network request for that exact path. It works perfectly as long as the user clicks a link to get there from within the app.'
    },
    {
      type: 'paragraph',
      text: "But what happens if a user hits the browser's refresh button while on /job-tracker, or pastes that URL directly into a new tab, or a search engine crawler requests it? Now the browser makes a real HTTP request for the literal path /job-tracker. S3 (and CloudFront, by default) looks for an actual object at that key, finds nothing (there is no file called job-tracker in the bucket, only index.html and the asset files), and returns a 403 or 404 error, before your JavaScript app has ever had the chance to load and take over routing."
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Fix it at the CloudFront layer, not S3',
      text: 'Configure CloudFront\'s "custom error response" setting: catch 403 and 404 responses coming back from the origin and rewrite them to serve /index.html instead, with an HTTP 200 status code (not the original error code). The browser now always gets your app\'s HTML shell for any path, and your client-side router, once its JavaScript loads, reads the URL and renders the correct view. (S3\'s own "static website hosting" mode has a similar-sounding error-document setting, but it still returns the original error status code, which many crawlers and tools treat as "page not found" even though content was returned. CloudFront\'s custom error response, returning a real 200, is the version that correctly plays nice with client-side routers.)'
    },
    { type: 'heading', id: 'deployment-walkthrough', level: 2, text: 'Full deployment walkthrough' },
    {
      type: 'paragraph',
      text: 'This section walks through an actual, realistic deployment from an empty AWS account to a live site on a custom domain. It assumes you already have an AWS account and the AWS CLI installed and configured (aws configure), and a built static site (e.g. the output of npm run build) ready to upload.'
    },
    {
      type: 'steps',
      items: [
        {
          title: '1. Register or import your domain in Route 53',
          text: 'If you do not already own a domain, register one directly through Route 53 (Route 53 console, "Registered domains"). If you already own one through another registrar, create a Hosted Zone for it in Route 53, then update the nameserver (NS) records at your registrar to point at the four nameservers Route 53 gives you. This can take anywhere from minutes to (rarely) 48 hours to propagate.'
        },
        {
          title: '2. Create a private S3 bucket',
          text: 'Create a bucket with a unique name (bucket names are globally unique across all of AWS, not just your account). Leave "Block all public access" turned ON, since CloudFront will reach it privately via Origin Access Control, not via a public bucket policy.'
        },
        {
          title: '3. Request an ACM certificate in us-east-1',
          text: 'Switch your AWS console region to US East (N. Virginia). In Certificate Manager, request a public certificate for yourdomain.com and *.yourdomain.com (the wildcard covers subdomains like www). Choose DNS validation, and if the domain is already in Route 53, ACM can create the validation record for you with one click.'
        },
        {
          title: '4. Wait for certificate validation',
          text: 'ACM checks for the DNS validation record it asked for. This is usually fast (a few minutes) once the record exists, but the certificate stays in a "Pending validation" state until AWS confirms it. Do not move on until it shows "Issued".'
        },
        {
          title: '5. Create the CloudFront distribution',
          text: "Create a new distribution with your S3 bucket as the origin. When prompted, choose Origin Access Control and let CloudFront generate the bucket policy update for you (it will show you the exact policy JSON to paste into the bucket's permissions, or offer to do it automatically). Set the default root object to index.html."
        },
        {
          title: '6. Attach the certificate and custom domain',
          text: 'In the distribution settings, add your domain (and www subdomain, if you want both) as an "Alternate Domain Name (CNAME)", and select the ACM certificate you issued in step 3 from the dropdown. Without this step, CloudFront only answers on its own *.cloudfront.net domain over HTTPS, not your custom domain.'
        },
        {
          title: '7. Add the SPA error-response rewrite',
          text: 'Under "Error pages" (or "Custom error responses") on the distribution, add two rules: HTTP error code 403 and HTTP error code 404, both responding with a custom response of /index.html and an HTTP response code of 200. This is what makes deep links and hard refreshes on client-side routes work.'
        },
        {
          title: '8. Upload your build output to S3',
          text: 'Run aws s3 sync ./dist s3://your-bucket-name --delete to upload every file from your local build folder, and remove anything in the bucket that is no longer present locally (stale files from a previous deploy).'
        },
        {
          title: '9. Point Route 53 at the distribution',
          text: 'In your domain\'s Hosted Zone, create an A record (yes, an A record: Route 53\'s ALIAS feature is layered on top of the A record type) for yourdomain.com, toggle "Alias" to yes, and choose "Alias to CloudFront distribution", selecting the distribution you created. Repeat for www if you configured it as an alternate domain name.'
        },
        {
          title: '10. Verify, then set up repeatable deploys',
          text: 'Wait for the CloudFront distribution status to change from "Deploying" to "Deployed" (this can take several minutes on first creation, since the configuration has to propagate to every edge location worldwide). Then visit https://yourdomain.com and confirm the site loads over HTTPS with no browser warning. From here on, every future deploy is just the sync command from step 8, plus an invalidation (covered next).'
        }
      ]
    },
    { type: 'heading', id: 'cache-invalidation', level: 2, text: 'Deploys and cache invalidation' },
    {
      type: 'paragraph',
      text: 'CloudFront caches aggressively at the edge on purpose, that is the entire point of a CDN, so simply overwriting files in S3 does not mean visitors instantly see the new version. Every edge location around the world keeps serving its own cached copy until that copy\'s TTL expires, or until you explicitly tell CloudFront to throw the cached copy away, which is called an "invalidation."'
    },
    {
      type: 'code',
      code: `# typical deploy sequence
aws s3 sync ./dist s3://my-bucket --delete
aws cloudfront create-invalidation \\
  --distribution-id ABCD1234 \\
  --paths "/*"`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Hashed filenames sidestep most of this',
      text: 'A Vite, webpack, or Next.js production build names its output files using a content hash, e.g. index-a1b2c3d4.js, so the filename itself changes whenever the file\'s contents change. Because of that, those hashed files can safely be cached forever ("immutable"): a stale cached copy is never actually wrong, since the new build produces a brand new filename instead of overwriting the old one. Only index.html, which references those hashed filenames and does change on every deploy, needs a short cache TTL or an invalidation. Invalidating "/*" on every deploy works and is simple, but is the blunt-instrument version; scoping the invalidation to just /index.html is cheaper (CloudFront invalidations are billed per path after a free monthly allowance) and equally correct.'
    },
    { type: 'heading', id: 'why-not-s3-alone', level: 2, text: 'Why not just S3 static website hosting, skipping CloudFront entirely?' },
    {
      type: 'paragraph',
      text: 'S3 does have a built-in "static website hosting" mode that gives your bucket its own website endpoint URL, and for a quick throwaway demo, that alone is genuinely enough. But it falls short in exactly the ways this article has been building toward, and those gaps become real problems the moment the site is meant for actual users on a real domain.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'No HTTPS on a custom domain: S3 website endpoints are HTTP-only, so browsers will warn visitors or block features outright.',
        'No CDN: every single request round-trips to one AWS region instead of the nearest edge location, so visitors far from that region get a slow experience.',
        'No fine-grained access control comparable to CloudFront + Origin Access Control: the bucket generally has to be made public for website hosting mode to work.',
        "No meaningful caching/invalidation control, and no clean fix for the SPA deep-linking problem, since S3's error document still returns the original error status code instead of a 200."
      ]
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'When S3-alone actually is fine',
      text: 'For a quick internal demo, a one-off prototype link you will share for a day, or local learning/experimentation where HTTPS and global latency genuinely do not matter, S3 static website hosting by itself is a perfectly reasonable shortcut. The full S3 + CloudFront + ACM + Route 53 stack is the answer to "how do I host this properly, for real users, long term," not a requirement for every experiment.'
    }
  ]
};
