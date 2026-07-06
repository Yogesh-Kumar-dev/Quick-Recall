'use client';

import Dexie, { type Table } from 'dexie';

// types
import type { JobApplication } from '@/types/job-tracker';
import type { SpeakUpQA } from '@/types/speak-up';
import type { Bookmark, ReviewState } from '@/types/study';

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
    //
    // Single clean v1: greenfield rebuild, so the legacy v1→v2→v3 chain is collapsed
    // into one schema. ponytail: no migration path from legacy DBs — fine because the
    // new app is a fresh origin; if this ever cuts over to the same origin as a shipped
    // app whose users hold a higher IndexedDB version, restore the version chain.
    this.version(1).stores({
      jobs: 'id, status, favorite, createdAt',
      speakUpQAs: 'id, sourceId, jobId, createdAt',
      bookmarks: 'id, kind, createdAt',
      reviews: 'id, dueAt'
    });
  }
}

export const db = new QuickRecallDB();
