// project imports
import { db } from './index';

// types
import type { Bookmark, BookmarkKind } from '@/types/study';

// Only module that touches persistence for bookmarks; async-shaped so a future HTTP backend
// only needs the body of these functions changed.

// Composite key keeps a bookmark idempotent: same (kind, refId) always maps to the same row.
function bookmarkId(kind: BookmarkKind, refId: string): string {
  return `${kind}:${refId}`;
}

export async function list(): Promise<Bookmark[]> {
  return db.bookmarks.orderBy('createdAt').reverse().toArray();
}

// Toggles; returns the resulting state (`true` = now bookmarked).
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

export async function remove(kind: BookmarkKind, refId: string): Promise<void> {
  await db.bookmarks.delete(bookmarkId(kind, refId));
}
