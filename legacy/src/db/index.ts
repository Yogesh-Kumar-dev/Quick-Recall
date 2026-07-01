'use client';

import Dexie, { type Table } from 'dexie';

// types
import type { JobApplication } from 'types/job-tracker';
import type { SpeakUpQA } from 'types/speak-up';
import type { Bookmark, ReviewState } from 'types/study';

// ==============================|| DEXIE - SHARED CLIENT DATABASE ||============================== //

// One IndexedDB database for the whole app. Each feature owns a table here and
// accesses it ONLY through its own repository (never the components directly), so
// features stay decoupled and each can later be swapped to a server-backed source
// by rewriting just its repository.
//
// Adding a feature later: bump `this.version(n).stores({ ...existing, newTable: 'id, idx' })`
// with an optional `.upgrade()` callback — Dexie migrates each browser automatically.

class QuickRecallDB extends Dexie {
  // <recordType, primaryKeyType>
  jobs!: Table<JobApplication, string>;
  speakUpQAs!: Table<SpeakUpQA, string>;
  bookmarks!: Table<Bookmark, string>;
  reviews!: Table<ReviewState, string>;

  constructor() {
    super('quickrecall');
    // The store string lists the primary key + indexed fields only (not every
    // column) — Dexie stores the whole object regardless; indexes are for
    // querying/sorting. `createdAt` is indexed so getAll can sort newest-first.
    this.version(1).stores({
      jobs: 'id, status, favorite, createdAt'
    });
    // v2 adds the Speak Up Q&A bank. Dexie keeps the version chain and migrates each
    // browser automatically; existing `jobs` data is preserved untouched.
    this.version(2).stores({
      jobs: 'id, status, favorite, createdAt',
      speakUpQAs: 'id, sourceId, jobId, createdAt'
    });
    // v3 adds the Study layer: `bookmarks` (mark-for-review stars on any content) and
    // `reviews` (per-flashcard spaced-repetition scheduling state). Existing jobs/speakUp data is
    // preserved — Dexie migrates the version chain in each browser automatically.
    this.version(3).stores({
      jobs: 'id, status, favorite, createdAt',
      speakUpQAs: 'id, sourceId, jobId, createdAt',
      bookmarks: 'id, kind, createdAt',
      reviews: 'id, dueAt'
    });
  }
}

export const db = new QuickRecallDB();
