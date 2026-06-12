# Feature Plan: Spaced-Repetition Review (#1) + Bookmarks (#2)

> Status: **Draft for discussion.** Dive into implementation details before building.
> These two ship together — bookmarks (#2) is the lightweight prerequisite that
> spaced repetition (#1) and future study-session features build on.

## Why

QuickRecall today is content-rich but **passive** — concept cards, cheat sheets, and
machine-coding problems you *read*. Interview prep is fundamentally about **active recall
and tracking weak spots over time**, which the app currently can't do. These two features
add that loop, and they directly exercise the multi-feature **Dexie** foundation already in
place (`src/db/index.ts`).

---

## Existing pieces to build on (verified)

- **Content has stable IDs** (`src/types/content.ts`):
  - `Note` → `id`, `title`, `category`, `difficulty` (the concept cards)
  - `Flashcard` → `id`, `front`, `back`, `category`
  - Problems (`BaseProblemEntry`) → `id`, `slug`, `title`, `difficulty`, `tags`
  These IDs are the natural foreign keys for bookmarks/reviews — no content changes needed.
- **Dexie shared DB** (`src/db/index.ts`) — add tables via `version(n).stores({...})`,
  one repository per feature (the pattern established by `jobsRepository`).
- **`useLiveQuery`** — reactive, cross-tab lists for free (used in `useJobs`).
- **Universal timer** — can box review/practice sessions later (not required for v1).
- **Content registry** — `src/data/*` arrays + `src/data/search-index.ts` already enumerate
  all content; a "resolve id → content item" lookup can reuse these.

---

## #2 — Bookmarks ("Mark for review") — build first

### Intent
One-click star on any concept card, flashcard, or problem → builds a personal "weak spots"
/ "revisit" list. Foundation for SRS and custom study sessions.

### Data model (Dexie table `bookmarks`)
```ts
type BookmarkKind = 'note' | 'flashcard' | 'problem';
interface Bookmark {
  id: string;            // `${kind}:${refId}` composite, so it's idempotent + easy to toggle
  kind: BookmarkKind;
  refId: string;         // the content item's own id/slug
  createdAt: number;
}
```
- `db.version(2).stores({ jobs: '...', bookmarks: 'id, kind, createdAt' })`.
- `bookmarksRepository.ts`: `toggle(kind, refId)`, `isBookmarked(...)`, `list()`,
  `remove(...)` — same async-repository pattern as `jobsRepository`.
- `useBookmarks()` hook over `useLiveQuery` so stars update live across the app/tabs.

### UI
- A star/bookmark `IconButton` on `Note` cards, flashcards, and problem rows.
- A **"Saved" / "Bookmarks"** view (new route + menu item) listing bookmarked items grouped
  by kind, each linking back to the source. Resolve `refId → content` via the `src/data`
  registries.

### Open questions for tomorrow
- Where exactly do the star buttons live on each card type (props vs. context)?
- Do problems bookmark by `id` or `slug`? (slug is route-stable.)
- Empty-state + count badge in the menu?

---

## #1 — Spaced-Repetition Review (SRS)

### Intent
A "Review" mode that quizzes you on concept cards/flashcards, you rate your recall, and a
scheduler resurfaces items right before you'd forget them. The core active-recall loop.

### Algorithm
- Start with **SM-2** (Anki's classic) — well-documented, simple, no deps. Per item track:
  `easiness` (default 2.5), `intervalDays`, `repetitions`, `dueAt`.
- Rating buttons map to SM-2 quality: **Again / Hard / Good / Easy**.
- A small pure `scheduler.ts` (`review(state, quality) → nextState`) — unit-test-friendly,
  no framework coupling. (No test runner configured yet; keep it pure so one can be added.)

### Data model (Dexie table `reviews`)
```ts
type ReviewKind = 'note' | 'flashcard';   // problems likely out of scope for SRS v1
interface ReviewState {
  id: string;            // `${kind}:${refId}`
  kind: ReviewKind;
  refId: string;
  easiness: number;
  intervalDays: number;
  repetitions: number;
  dueAt: number;         // epoch ms — "due" when dueAt <= now
  lastReviewedAt: number;
}
```
- `db.version(2).stores({ ..., reviews: 'id, kind, dueAt' })` (bump alongside bookmarks).
- `reviewsRepository.ts`: `getDue(now)`, `upsertAfterReview(...)`, `enroll(kind, refId)`.
- A card becomes enrolled when the user first reviews/bookmarks it (decide tomorrow:
  auto-enroll-on-bookmark is a clean tie-in to #2).

### UI
- **"Review" route + menu item.** Landing shows "N cards due today."
- A flip-card session: front → reveal back → rate (Again/Hard/Good/Easy) → next due card.
- Pull the actual content by resolving `refId` against the `src/data` registries.
- Optional: wrap a session in the **universal timer** ("review for 10 min").

### Open questions for tomorrow
- Which content feeds SRS — `Note` cards, `Flashcard`s, or both? (Flashcards are the
  natural front/back fit; Notes need a derived "prompt".)
- Enrollment model: auto-enroll all, enroll-on-bookmark, or explicit "add to review"?
- Daily new-card cap? Session size cap?
- Does a progress/coverage dashboard (the Tier-1 "#3") come bundled or later?

---

## Shared work
- One Dexie `version(2)` bump adding **both** `bookmarks` and `reviews` tables (do together).
- Reuse the repository + `useLiveQuery` pattern from jobs verbatim.
- A `resolveContent(kind, refId)` helper over `src/data/*` so both features render real items.

## Sequencing
1. Dexie `version(2)` with both tables.
2. Bookmarks repo + hook + star buttons + Saved view (#2) — ships value immediately.
3. SM-2 `scheduler.ts` (pure) + reviews repo.
4. Review session UI (#1), optionally auto-enrolling bookmarked items.

---

## Future enhancement (separate thread — NOT part of #1/#2 scope)

### Notification personality + intensity preference
Builds on the existing **notification manager** (`src/notifications/`) and the dead-simple
prefs store (`src/notifications/prefs.ts`) we already wired.

Idea: let the user choose **how the app nags them** — a tone/intensity setting:
- **"Go easy"** — gentle, infrequent, encouraging copy; longer intervals; fewer escalations.
- **"Go hard"** — frequent, insistent, blunt copy; shorter intervals; more escalation steps.
  (Mirrors the existing distraction-alert escalation in `useDistractionAlert.ts`, which
  already has a `steps` + `interval` model — this would make those user-configurable and
  swap the copy set by personality.)

Where it plugs in:
- Extend `NotificationPrefs` (`src/notifications/prefs.ts`) with an `intensity: 'easy' | 'hard'`
  (or a 1–3 scale) field — it already persists + syncs cross-tab via localStorage.
- A **copy pack per personality**: distraction nudges, timer-done messages, and SRS "cards
  due" reminders each get an easy vs. hard variant. Centralize in the notification registry.
- Surface the setting in the ProfileSection notifications panel (where the master toggle
  already lives).
- Optional flourish: a named "persona" (e.g. a chill coach vs. a drill sergeant) that bundles
  tone + intensity, for personality.

This is appealing and low-risk (the manager/prefs infra exists), but it's **orthogonal to
the SRS/bookmarks recall loop** — treat as its own small feature after #1/#2, or interleave
once SRS reminders exist (since SRS is the feature that most benefits from a tunable nag).
