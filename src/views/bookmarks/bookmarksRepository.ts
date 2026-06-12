// project imports
import { db } from 'db';

// types
import type { Bookmark, BookmarkKind } from 'types/study';

// The ONLY module that touches persistence (Dexie / IndexedDB via the shared `db`) for
// bookmarks. All methods are async-shaped on purpose: to migrate to an HTTP / server backend
// later, replace the body of these functions only — every consumer (useBookmarks, the star
// button, the Saved view) stays untouched.

// The composite primary key makes a bookmark idempotent: the same (kind, refId) always maps
// to the same row, so toggling is a presence check + add/delete.
function bookmarkId(kind: BookmarkKind, refId: string): string {
  return `${kind}:${refId}`;
}

export async function list(): Promise<Bookmark[]> {
  // newest first
  return db.bookmarks.orderBy('createdAt').reverse().toArray();
}

// Adds the bookmark if absent, removes it if present. Returns the resulting state
// (`true` = now bookmarked) so callers can react (e.g. toast, auto-enroll).
export async function toggle(kind: BookmarkKind, refId: string): Promise<boolean> {
  const id = bookmarkId(kind, refId);
  const existing = await db.bookmarks.get(id);
  if (existing) {
    await db.bookmarks.delete(id);
    return false;
  }
  await db.bookmarks.add({ id, kind, refId, createdAt: Date.now() });
  return true;
}
