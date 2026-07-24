export interface TourStep {
  /** Matches the target nav item's `data-tour` attribute (see `src/config/nav.ts`). */
  key: string;
  title: string;
  description: string;
}

// Ordered to match the sidebar's actual top-to-bottom layout (primaryNav, then the
// Study & Review section) so the spotlight moves in one direction instead of jumping.
export const TOUR_STEPS: TourStep[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'Your home base — see streaks, review stats, and jump back into recent topics.'
  },
  {
    key: 'job-tracker',
    title: 'Job Tracker',
    description: 'A kanban board for tracking applications as they move through your pipeline.'
  },
  {
    key: 'speak-up',
    title: 'Speak Up',
    description: 'Rehearse behavioral and technical answers out loud and review your delivery.'
  },
  {
    key: 'mock-interview',
    title: 'Mock Interview',
    description: 'Run a full simulated interview chat to practice thinking on your feet.'
  },
  {
    key: 'flashcards',
    title: 'Flashcards',
    description: 'Drill core concepts topic by topic with quick flip-through flashcards.'
  },
  {
    key: 'quiz',
    title: 'Quiz',
    description: 'Test yourself with multiple-choice questions across every topic.'
  },
  {
    key: 'saved',
    title: 'Saved',
    description: 'Bookmark any note, flashcard, or problem to come back to later.'
  },
  {
    key: 'review',
    title: 'Review',
    description: 'A spaced-repetition queue that resurfaces what you bookmarked, right before you forget it.'
  },
  {
    key: 'js-machine-coding',
    title: 'JS Machine Coding',
    description: 'Practice JavaScript problems with a live demo and the raw solution source side by side.'
  },
  {
    key: 'react-custom-hooks',
    title: 'Custom Hooks',
    description: 'A reference of reusable React hooks, each with an explanation of what it solves and why.'
  },
  {
    key: 'react-machine-coding',
    title: 'React Machine Coding',
    description: 'Build real UI components with a live demo and code viewer side by side, same as JS Machine Coding.'
  }
];
