import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs';

// ─── URL semantics ────────────────────────────────────────────────────────────
// ?difficulty absent  → isLanding = true  (section overview / dashboard)
// ?difficulty=all     → isLanding = false, show every item
// ?difficulty=basic   → isLanding = false, pre-filtered by difficulty
// ?category=X         → list filtered by category (paired with difficulty)
// ?gotcha=true        → list filtered to concepts that have a gotcha field
//
// Only exitToLanding() removes the difficulty param and returns to the landing.
// Browser back-button works naturally because nuqs pushes history entries.
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionFilterState {
  /** true when ?difficulty is absent — renders the landing dashboard */
  isLanding: boolean;

  /** Resolved difficulty for filter logic: 'all' when param is absent or 'all' */
  difficulty: string;

  /** Resolved category for filter logic: 'all' when absent */
  category: string;

  /** Whether to show only concepts that have a gotcha field (concepts pages) */
  showGotchaOnly: boolean;

  /** Search query, empty string when absent */
  search: string;

  /** Currently open card id (accordion pages). null when absent. */
  openId: string | null;

  /** Enter list view pre-filtered by difficulty ('all' | 'basic' | 'easy' …) */
  enterWithDifficulty: (difficulty: string) => void;

  /** Enter list view pre-filtered by category (difficulty reset to 'all') */
  enterWithCategory: (category: string) => void;

  /** Enter list view showing only items that have a gotcha (concepts pages) */
  enterGotchaOnly: () => void;

  /** Remove the difficulty param to go back to the section landing */
  exitToLanding: () => void;

  /** Change difficulty while staying in list view */
  handleDifficultyChange: (val: string) => void;

  /** Change category while staying in list view */
  handleCategoryChange: (val: string) => void;

  /** Commit difficulty + category + search in a single pass (mobile filter drawer Apply) */
  applyFilters: (next: { difficulty?: string; category?: string; search?: string | null }) => void;

  /** Toggle the gotcha-only filter while in list view */
  handleGotchaToggle: () => void;

  handleSearchChange: (val: string | null) => void;
  handleToggle: (id: string) => void;
}

export function useSectionFilter(): SectionFilterState {
  const [difficulty, setDifficulty] = useQueryState('difficulty', parseAsString);
  const [category, setCategory] = useQueryState('category', parseAsString);
  const [gotcha, setGotcha] = useQueryState('gotcha', parseAsBoolean.withDefault(false));
  const [search, setSearch] = useQueryState('q', parseAsString);
  const [openId, setOpenId] = useQueryState('open', parseAsString);

  const isLanding = difficulty === null;

  return {
    isLanding,
    difficulty: difficulty ?? 'all',
    category: category ?? 'all',
    showGotchaOnly: gotcha,
    search: search ?? '',
    openId,

    enterWithDifficulty(val) {
      void setDifficulty(val);
      void setCategory(null);
      void setGotcha(false);
      void setOpenId(null);
    },

    enterWithCategory(cat) {
      void setDifficulty('all'); // always enter with all difficulties
      void setCategory(cat);
      void setGotcha(false);
      void setOpenId(null);
    },

    enterGotchaOnly() {
      void setDifficulty('all');
      void setCategory(null);
      void setGotcha(true);
      void setOpenId(null);
    },

    exitToLanding() {
      void setDifficulty(null); // removes param → landing
      void setCategory(null);
      void setGotcha(false);
      void setSearch(null);
      void setOpenId(null);
    },

    handleDifficultyChange(val) {
      // Keep 'all' explicit (not null) so we stay in list view
      void setDifficulty(val);
      void setCategory(null);
      void setOpenId(null);
    },

    handleCategoryChange(val) {
      void setCategory(val === 'all' ? null : val);
      void setOpenId(null);
    },

    applyFilters({ difficulty: nextDifficulty, category: nextCategory, search: nextSearch }) {
      if (nextDifficulty !== undefined) void setDifficulty(nextDifficulty);
      if (nextCategory !== undefined) void setCategory(nextCategory === 'all' ? null : nextCategory);
      if (nextSearch !== undefined) void setSearch(nextSearch || null);
      void setOpenId(null);
    },

    handleGotchaToggle() {
      void setGotcha(!gotcha);
      void setOpenId(null);
    },

    handleSearchChange(val) {
      void setSearch(val);
    },

    handleToggle(id) {
      void setOpenId(openId === id ? null : id);
    }
  };
}
