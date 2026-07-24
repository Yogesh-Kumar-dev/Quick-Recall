// Shared MCQ option styling — used by the standalone Quiz feature (quiz-runner.tsx) and by
// quiz questions rendered inside Mock Interview (mock-interview-chat.tsx). `revealed` gates
// whether the correct/incorrect colors show yet, so answering stays an actual recall test.
export function quizOptionClasses(opts: { isSelected: boolean; isCorrect: boolean; revealed: boolean }): string {
  const { isSelected, isCorrect, revealed } = opts;
  if (!revealed) {
    return isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-muted';
  }
  if (isCorrect) return 'border-green-600 bg-green-600/10 text-green-700 dark:text-green-400';
  if (isSelected) return 'border-red-600 bg-red-600/10 text-red-700 dark:text-red-400';
  return 'border-border opacity-60';
}
