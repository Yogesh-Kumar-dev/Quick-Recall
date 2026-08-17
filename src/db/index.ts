'use client';

import Dexie, { type Table } from 'dexie';

// types
import type { JobApplication } from '@/types/job-tracker';
import type { MockInterview } from '@/types/mock-interview';
import type { CalendarEvent } from '@/types/planner';
import type { SpeakUpQA } from '@/types/speak-up';
import type { Bookmark, PracticeAttempt, PracticeSessionState, QuizAttempt, ReviewState } from '@/types/study';

export interface SettingsRow {
  key: string;
  value: unknown;
}

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
  quizAttempts!: Table<QuizAttempt, string>;
  settings!: Table<SettingsRow, string>;
  calendarEvents!: Table<CalendarEvent, string>;

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
    // v2: purely additive table (quizAttempts) — no upgrade() needed, existing stores untouched.
    this.version(2).stores({
      quizAttempts: 'id, source, completedAt'
    });
    // v3: generic key/value settings table (src/db/settings.ts) — future device-level settings
    // reuse this instead of a dedicated table each time. Never shipped with real data, so edited
    // in place rather than superseded by a v4; clear local IndexedDB if upgrading a dev browser
    // that already applied an earlier v3 with a `pushSettings` store.
    this.version(3).stores({
      settings: 'key'
    });
    // v4: calendar events for the Planner feature — manual events + derived job-tracker interviews
    // (interviews are derived at render time, not stored, so only manual events live here).
    this.version(4).stores({
      calendarEvents: 'id, start, end, type, source, createdAt'
    });
  }
}

export const db = new QuickRecallDB();
