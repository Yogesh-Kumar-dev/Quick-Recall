'use client';

import Dexie, { type Table } from 'dexie';

// types
import type { JobApplication } from '@/types/job-tracker';
import type { MockInterview } from '@/types/mock-interview';
import type { SpeakUpQA } from '@/types/speak-up';
import type { Bookmark, PracticeAttempt, PracticeSessionState, ReviewState } from '@/types/study';

// ==============================|| DEXIE - SHARED CLIENT DATABASE ||============================== //

// One IndexedDB database for the whole app; each feature owns a table, accessed only through
// its own repository. New feature: bump `this.version(n).stores({ ...existing, newTable })`
// with an optional `.upgrade()` — Dexie migrates each browser automatically.

class QuickRecallDB extends Dexie {
  jobs!: Table<JobApplication, string>;
  speakUpQAs!: Table<SpeakUpQA, string>;
  bookmarks!: Table<Bookmark, string>;
  reviews!: Table<ReviewState, string>;
  attempts!: Table<PracticeAttempt, string>;
  practiceSessions!: Table<PracticeSessionState, string>;
  mockInterviews!: Table<MockInterview, string>;

  constructor() {
    super('quickrecall');
    // Store string lists only the primary key + indexed fields; Dexie still stores the whole
    // object. ponytail: no legacy migration chain — fresh origin, so v1 is the only version;
    // restore the chain if this ever reuses an origin with a shipped higher IndexedDB version.
    this.version(1).stores({
      jobs: 'id, status, favorite, createdAt',
      speakUpQAs: 'id, sourceId, jobId, createdAt',
      bookmarks: 'id, kind, createdAt',
      reviews: 'id, dueAt',
      attempts: 'id, refId, startedAt',
      practiceSessions: 'refId',
      mockInterviews: 'id, status, startedAt'
    });
  }
}

export const db = new QuickRecallDB();
