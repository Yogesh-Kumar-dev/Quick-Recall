'use client';

import Dexie, { type Table } from 'dexie';

// types
import type { JobApplication } from 'types/job-tracker';

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

  constructor() {
    super('quickrecall');
    // The store string lists the primary key + indexed fields only (not every
    // column) — Dexie stores the whole object regardless; indexes are for
    // querying/sorting. `createdAt` is indexed so getAll can sort newest-first.
    this.version(1).stores({
      jobs: 'id, status, favorite, createdAt'
    });
  }
}

export const db = new QuickRecallDB();
