// third party
import { useLiveQuery } from 'dexie-react-hooks';

// project imports
import * as bookmarksRepository from './bookmarksRepository';

// Live list of every bookmark, newest-first. Consumed by the Saved view to render groups.
// `undefined` until the first query resolves → that's the loading signal. Toggling is done
// per-item by `BookmarkButton` (which talks to the repository directly), so this hook is a
// read-only live view — it doesn't carry mutation methods.

export default function useBookmarks() {
  const bookmarks = useLiveQuery(() => bookmarksRepository.list());
  return { bookmarks: bookmarks ?? [], loading: bookmarks === undefined };
}
