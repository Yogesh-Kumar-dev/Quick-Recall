import type { Note } from '@/types/content';

// ─── Mobile App Testing — the concerns specific to native/hybrid mobile apps that
// go beyond the general mobile-vs-web framing already covered in Testing Fundamentals:
// platform differences, device automation, and mobile-only interaction patterns. ──

export const mobileTestingNotes: Note[] = [
  {
    id: 'mobile-ios-vs-android-testing',
    title: 'iOS vs Android Platform Testing',
    summary:
      'Same feature, two genuinely different platforms — separate test cases per platform are usually necessary, layered under any cross-platform automation, because OS-level behavior and guidelines diverge.',
    difficulty: 'basic',
    category: 'platform fundamentals',
    prerequisites: ['test-fund-mt-mobile-vs-web'],
    keyPoints: [
      'iOS has a far narrower device/OS-version matrix (fewer device models, faster OS-update adoption) than Android — Android fragmentation (many manufacturers, OS versions, screen densities) is the more demanding testing surface of the two.',
      "Platform-specific UI/UX guidelines (Apple's Human Interface Guidelines vs Google's Material Design) drive genuinely different expected behaviors for the same interaction — a back gesture, a permission prompt flow, or a notification style that's correct on one platform can be wrong on the other.",
      'App store review processes differ in strictness and turnaround time — this affects RELEASE-testing risk tolerance: a critical bug found post-submission has a different cost on each platform depending on current review queue times.',
      "Cross-platform frameworks (React Native, Flutter) still need platform-specific test passes — shared code doesn't guarantee shared runtime behavior, especially around native module bridges, permissions, and platform-specific gestures."
    ]
  },
  {
    id: 'mobile-appium-automation',
    title: 'Mobile Automation with Appium',
    summary:
      'Appium drives real apps on real or emulated devices through the same WebDriver protocol Selenium uses for browsers — one API surface for both iOS and Android automation.',
    difficulty: 'intermediate',
    category: 'automation',
    prerequisites: ['mobile-ios-vs-android-testing', 'pw-locators'],
    keyPoints: [
      'Appium extends the WebDriver protocol to native, hybrid, and mobile-web apps — a test written against its API can, with platform-specific capability configuration, target both an iOS simulator and an Android emulator.',
      'Locator strategy in Appium mirrors the RTL/Playwright query-priority principle: accessibility IDs (the mobile equivalent of `getByRole`/`getByLabel`) are the most resilient choice, over brittle XPath tied to the current view hierarchy.',
      'Testing across emulators/simulators (fast, cheap, good for most functional coverage) AND real devices (catches hardware-specific bugs — camera behavior, actual network radios, real sensor data) is the standard combination; cloud device farms (BrowserStack App Automate, Sauce Labs) provide real-device coverage without owning a physical device lab.',
      'Automated test reliability on mobile faces the same core issue as web — proper wait strategies for elements and screen transitions, stable locators, and retry logic for genuinely flaky infrastructure (not real bugs) — plus device-specific concerns like handling orientation changes and varying screen sizes.',
      'CI/CD integration for mobile typically means: build the app in CI, deploy to an emulator or device-farm session, run the Appium suite against it, and gate the pipeline on the result — the same shape as web CI, with a heavier build/deploy step in front.'
    ]
  },
  {
    id: 'mobile-push-notifications',
    title: 'Testing Push Notifications',
    summary:
      "Notifications need testing across every app state (foreground, background, killed) and multiple devices/OS versions — a notification that displays correctly when the app is open can behave completely differently when it isn't.",
    difficulty: 'intermediate',
    category: 'mobile-specific scenarios',
    prerequisites: ['mobile-appium-automation'],
    keyPoints: [
      'App state matters more than almost any other mobile testing dimension for notifications: foreground (often needs custom in-app handling), background (system tray display), and fully killed/terminated (cold-launch behavior when the user taps it) are three genuinely distinct code paths.',
      'Tapping a notification should deep-link to the correct in-app screen with the correct context (e.g. tapping a "new message" notification opens that specific conversation) — this is the highest-value functional assertion, more so than just "did the notification appear."',
      "Automated testing typically uses mock push servers or API-level tests to trigger notifications programmatically (rather than waiting for a real push through Apple/Google's infrastructure), then verifies payload content and the resulting in-app navigation.",
      'Manual/exploratory coverage still matters here: real OS-level notification behavior (grouping, do-not-disturb interaction, notification permission being revoked mid-session) is hard to fully simulate and worth spot-checking on real devices.'
    ]
  },
  {
    id: 'mobile-biometric-auth',
    title: 'Testing Biometric Authentication',
    summary:
      "Face ID / fingerprint auth can't be triggered by a real biometric scan in most CI environments — testing relies on OS-provided simulators/mocks for the success and failure paths, plus manual verification on real hardware.",
    difficulty: 'intermediate',
    category: 'mocking & test data',
    prerequisites: ['mobile-appium-automation', 'auth-jwt'],
    keyPoints: [
      'iOS Simulator and Android Emulator both provide developer-facing commands to simulate a successful or failed biometric match without real hardware — this is how CI-run automated tests exercise the flow at all.',
      'Test the full contract, not just the happy path: successful auth, failed match (with the correct retry/lockout behavior), biometric not enrolled on the device, biometric hardware unavailable, and the fallback to a passcode/password after repeated failures.',
      "The app-level LOGIC around biometrics (what happens after a successful match — does it unlock a stored session token, or independently re-authenticate against the server) is what a test suite should actually verify, since the OS handles the biometric matching itself and isn't something the app can meaningfully test.",
      "A real-device manual pass is still worth doing periodically — OS-level biometric UI (the exact prompt style, timing, accessibility behavior) can differ subtly from simulator behavior in ways automated tests won't catch."
    ]
  },
  {
    id: 'mobile-offline-sync',
    title: 'Offline Functionality & Data Sync Testing',
    summary:
      'Mobile apps need to work (fully or gracefully degraded) without connectivity, then correctly reconcile local changes with the server once back online — the sync-conflict path is where most offline bugs live.',
    difficulty: 'intermediate',
    category: 'mobile-specific scenarios',
    prerequisites: ['test-fund-mt-mobile-vs-web'],
    keyPoints: [
      'Test local storage behavior directly: does data persist correctly while offline, survive an app restart while still offline, and remain available for the intended offline features.',
      'Test the transition edges explicitly, not just the two steady states: going offline mid-action, coming back online mid-sync, and a flaky/intermittent connection (neither cleanly online nor offline) — these transition states are where real bugs concentrate.',
      'Sync conflict resolution needs its own dedicated test cases: what happens when the SAME record was modified both locally (while offline) and on the server (by another device/user) — last-write-wins, a merge, or a user-facing conflict prompt are all valid strategies, but the test must confirm which one the app actually implements.',
      'Network condition simulation (airplane mode, throttled 3G, packet loss) via emulator/simulator tooling or a network-conditioning proxy is the standard way to exercise these paths reliably and repeatably, rather than relying on genuinely bad Wi-Fi during manual testing.'
    ]
  },
  {
    id: 'mobile-location-ar',
    title: 'Location Services & AR Feature Testing',
    summary:
      "Location-dependent and AR features need testing across simulated GPS coordinates and, for AR specifically, real-world device/environment variability that's hard to fully simulate.",
    difficulty: 'intermediate',
    category: 'mobile-specific scenarios',
    prerequisites: ['mobile-offline-sync'],
    keyPoints: [
      'Emulators/simulators let you set arbitrary mock GPS coordinates and simulate movement along a route — the standard way to test location-dependent logic (geofencing, "nearby" features, location-based recommendations) without physically traveling.',
      'Test location permission states explicitly: granted, denied, "allow once," and revoked mid-session (the user turns off location access while the app is running) — each is a distinct code path the app needs to handle gracefully, not just the happy "permission granted" case.',
      'GPS accuracy testing (comparing reported coordinates against a known ground-truth location) matters for any feature making decisions based on precise location, and accuracy can vary meaningfully by device and environment (indoors vs open sky).',
      'AR feature testing adds device compatibility (AR capability varies significantly across hardware) and real-environment variability (lighting, surface detection) that simulators cannot fully replicate — this is one of the mobile testing areas where real-device, real-environment manual testing is least replaceable by automation.'
    ]
  },
  {
    id: 'mobile-battery-performance',
    title: 'Battery & Performance Profiling',
    summary:
      'A functionally correct feature that drains the battery or lags will still tank app-store ratings — profiling tools measure CPU, memory, and battery impact directly rather than inferring it from user complaints.',
    difficulty: 'intermediate',
    category: 'mobile-specific scenarios',
    prerequisites: ['test-fund-mt-performance-load-testing'],
    keyPoints: [
      'Platform profiling tools (Xcode Instruments for iOS, Android Studio Profiler for Android) measure CPU usage, memory allocation/leaks, and battery/energy impact directly on-device — the mobile equivalent of a web performance audit tool like Lighthouse.',
      'Background activity (location polling, background sync, push-notification handling) is a disproportionate battery-drain source worth testing specifically — a feature that behaves fine in the foreground can silently drain battery running unnecessarily often in the background.',
      'Testing under varying network conditions (poor signal, frequent switching between Wi-Fi and cellular) reveals a different class of performance bug than testing under ideal connectivity — retry storms and aggressive polling under bad signal are common, easily-missed battery/performance issues.',
      'Performance testing across device GENERATIONS matters distinctly for mobile — an older, lower-spec device is a completely different performance profile than the newest flagship, and real user bases usually include both.'
    ]
  },
  {
    id: 'mobile-localization',
    title: 'Mobile Localization Testing',
    summary:
      'Beyond translated strings: verifying locale-specific formats (dates, currency, number separators), text expansion in UI layouts, and correct behavior for right-to-left (RTL) languages.',
    difficulty: 'intermediate',
    category: 'mobile-specific scenarios',
    prerequisites: ['mobile-ios-vs-android-testing'],
    keyPoints: [
      'Text expansion is a classic and very common bug source: a UI element sized for a short English label can overflow, truncate, or wrap awkwardly once translated into a language that runs 30-50% longer (German is the frequently-cited example).',
      'Locale-specific formatting (date order, decimal/thousands separators, currency symbol placement) needs explicit test cases per target locale — a hardcoded `MM/DD/YYYY` assumption is a common and very visible localization bug.',
      'Right-to-left (RTL) languages (Arabic, Hebrew) require the entire layout to mirror correctly, not just the text direction — icons, navigation flow, and even some animations need RTL-aware testing, which automated screenshot-diffing per locale catches more reliably than manual spot-checks.',
      'Collaborating with native speakers for actual translation-quality/cultural-appropriateness review is necessary alongside the technical layout/format testing — a technically well-rendered translation can still be wrong, awkward, or culturally inappropriate in ways no automated check catches.'
    ]
  },
  {
    id: 'mobile-in-app-purchases',
    title: 'Testing In-App Purchases',
    summary:
      "IAP testing runs against the platform's own sandbox purchase environment (App Store Connect / Google Play sandbox) rather than real payment processing, but still needs to cover restore-purchase, subscription, and failure flows explicitly.",
    difficulty: 'intermediate',
    category: 'mobile-specific scenarios',
    prerequisites: ['mobile-ios-vs-android-testing'],
    keyPoints: [
      'Both platforms provide sandbox test accounts for exercising the full purchase flow (product listing, purchase confirmation, receipt validation) without moving real money — this is the standard, required way to test IAP end to end.',
      'Restore purchases (a user reinstalling the app, or moving to a new device, expects previously-purchased content/subscriptions to reappear) is a frequently under-tested flow that directly affects real revenue and support tickets when broken.',
      'Subscription-specific states need their own test cases: renewal, cancellation, a grace period after a failed renewal payment, and an expired subscription — each should gate app content/features correctly.',
      "Server-side receipt validation (confirming a purchase with Apple's/Google's servers rather than trusting the client-reported result) is the security-relevant piece worth naming — trusting only client-side purchase state is straightforwardly exploitable."
    ]
  },
  {
    id: 'mobile-ci-cd',
    title: 'Mobile CI/CD Integration',
    summary:
      'Mobile CI/CD adds a heavier build/deploy step (native compilation, code signing, app-store submission) around the same automated-test-gate concept web CI/CD already uses.',
    difficulty: 'intermediate',
    category: 'automation',
    prerequisites: ['mobile-appium-automation', 'eng-cicd'],
    keyPoints: [
      'A typical pipeline: build the native app for the target platform(s), run unit/UI tests against an emulator or device farm, and — for release branches — automate submission to TestFlight/Play Console for beta distribution or store review.',
      'Code signing and provisioning profiles (iOS) or keystore management (Android) are mobile-specific CI complexity with no web equivalent — getting these right (and stored securely as CI secrets, never committed) is a common early friction point setting up mobile CI.',
      "Parallel testing across multiple emulator/device configurations in the same CI run mirrors Playwright's multi-project pattern — running the suite against several OS versions and screen sizes simultaneously keeps CI runtime flat as device coverage grows.",
      "Staged rollouts (releasing a new version to a small percentage of users first, before a full rollout) are a mobile-specific release-risk mitigation worth mentioning — it's the mobile equivalent of a canary deployment, made necessary by how slowly app-store updates propagate compared to a web deploy."
    ]
  },
  {
    id: 'mobile-testing-kpis',
    title: 'Mobile Testing KPIs',
    summary:
      'Crash-free rate, ANR (App Not Responding) rate, and store rating/review sentiment are mobile-specific quality signals on top of the general testing metrics (defect density, coverage) already covered elsewhere.',
    difficulty: 'basic',
    category: 'automation',
    prerequisites: ['test-fund-mt-metrics'],
    keyPoints: [
      "Crash-free session/user rate is the single most-watched mobile production health metric — tracked via crash-reporting SDKs (Crashlytics and similar), it directly reflects real-world stability that pre-release testing alone can't fully guarantee.",
      'ANR rate (Android-specific: App Not Responding, when the main thread is blocked too long) is a distinct signal from crashes — an app can have a low crash rate while frustrating users with frequent unresponsiveness, which testing should specifically probe for on lower-spec devices.',
      "App store rating and review sentiment, while not a pure QA metric, is the metric leadership actually watches — tying testing improvements back to store-rating trends is a concrete way to demonstrate testing's business impact.",
      'Test automation effectiveness on mobile is measured the same way as elsewhere (coverage, defect detection rate, false positive/negative rate, execution time, ROI) with one addition worth naming: correlation with actual user-reported issues — automation that never catches what real users hit is a signal the suite is testing the wrong things.'
    ]
  }
];
