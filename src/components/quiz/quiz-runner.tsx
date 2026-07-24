'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowLeft, IconCheck, IconRefresh, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CodeBlock from '@/components/content/code-block';
import { shuffle } from '@/lib/utils';
import { quizOptionClasses as optionClasses } from './quiz-option-classes';
import useQuizAttempts from './use-quiz-attempts';
import type { QuizQuestion } from '@/types/content';
import type { QuizSource } from '@/data/quiz-index';

type Mode = 'practice' | 'test';

// Shuffles a question's options too (not just question order) — otherwise the correct answer's
// position never changes and becomes a pattern the user can exploit instead of actually recalling it.
function shuffleQuestion(question: QuizQuestion): QuizQuestion {
  const order = shuffle(question.options.map((_, i) => i));
  return { ...question, options: order.map((i) => question.options[i]), correctIndex: order.indexOf(question.correctIndex) };
}

function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return shuffle(questions).map(shuffleQuestion);
}

// Counts correct answers — used both to persist the attempt and to render the results screen,
// so scoring is only ever computed once per finished run instead of on every option click.
function scoreAnswers(questions: QuizQuestion[], answers: (number | null)[]): number {
  return answers.reduce<number>((n, a, i) => (a === questions[i].correctIndex ? n + 1 : n), 0);
}

export default function QuizRunner({ questions: orderedQuestions, source, title }: { questions: QuizQuestion[]; source: QuizSource; title: string }) {
  const { recordAttempt } = useQuizAttempts();

  // Reshuffled on every run (mount + retake) so question order — and each question's option order — never repeats identically.
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => shuffleQuestions(orderedQuestions));
  const [mode, setMode] = useState<Mode>('practice');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => orderedQuestions.map(() => null));
  const [result, setResult] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const current = questions[index];
  const selected = answers[index];
  // Practice mode reveals correctness the moment an option is picked; test mode only reveals
  // everything on the final results screen, so answering never leaks the correct choice early.
  const revealed = mode === 'practice' && selected !== null;

  const finish = (finalAnswers: (number | null)[]) => {
    const score = scoreAnswers(questions, finalAnswers);
    setResult(score);
    if (saved) return;
    setSaved(true);
    recordAttempt({ source, mode, score, total: questions.length });
  };

  const selectOption = (optionIndex: number) => {
    if (selected !== null) return; // already answered this question
    const next = [...answers];
    next[index] = optionIndex;
    setAnswers(next);
    if (mode === 'test' && index === questions.length - 1) finish(next);
  };

  const goNext = () => {
    if (index === questions.length - 1) {
      finish(answers);
      return;
    }
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setQuestions(shuffleQuestions(orderedQuestions));
    setIndex(0);
    setAnswers(orderedQuestions.map(() => null));
    setResult(null);
    setSaved(false);
  };

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-muted-foreground">No quiz questions available for this section.</p>
      </div>
    );
  }

  if (result !== null) {
    return (
      <section className="mx-auto w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{title} — Results</h2>
          <p className="mt-1 text-lg">
            {result} / {questions.length} correct
          </p>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => {
            const answer = answers[i];
            const correct = answer === q.correctIndex;
            return (
              <div key={q.id} className="rounded-lg border border-border bg-card p-4 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">
                    {i + 1}. {q.question}
                  </p>
                  {correct ? (
                    <IconCheck className="mt-0.5 size-4 shrink-0 text-green-600" />
                  ) : (
                    <IconX className="mt-0.5 size-4 shrink-0 text-red-600" />
                  )}
                </div>
                {q.code && (
                  <div className="mt-2">
                    <CodeBlock code={q.code} />
                  </div>
                )}
                <div className="mt-2 space-y-1">
                  {q.options.map((opt, oi) => (
                    <p
                      key={opt}
                      className={`rounded border px-2 py-1 ${optionClasses({ isSelected: answer === oi, isCorrect: oi === q.correctIndex, revealed: true })}`}
                    >
                      {opt}
                    </p>
                  ))}
                </div>
                {q.explanation && <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2">
          <Button onClick={restart} variant="outline" size="sm">
            <IconRefresh className="mr-1 size-4" />
            Retake quiz
          </Button>
          <Link href="/quiz">
            <Button variant="ghost" size="sm">
              <IconArrowLeft className="mr-1 size-4" />
              Back to Quiz &amp; history
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6" aria-label="Quiz">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Question {index + 1} of {questions.length}
        </p>
      </div>

      <Progress value={(index / questions.length) * 100} />

      <div className="flex justify-center gap-1 rounded-lg border border-border bg-muted p-1 text-sm">
        {(['practice', 'test'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            disabled={index > 0 || selected !== null}
            onClick={() => setMode(m)}
            className={`rounded-md px-3 py-1 capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              mode === m ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="rounded-lg border-2 border-border bg-card p-6">
        <p className="text-lg font-medium">{current.question}</p>
        {current.code && (
          <div className="mt-3">
            <CodeBlock code={current.code} />
          </div>
        )}

        <div className="mt-4 space-y-2">
          {current.options.map((opt, oi) => (
            <button
              key={opt}
              type="button"
              onClick={() => selectOption(oi)}
              disabled={selected !== null}
              className={`w-full rounded-lg border-2 px-4 py-2.5 text-left transition-colors disabled:cursor-default ${optionClasses({ isSelected: selected === oi, isCorrect: oi === current.correctIndex, revealed })}`}
            >
              {opt}
            </button>
          ))}
        </div>

        {revealed && current.explanation && <p className="mt-4 text-sm text-muted-foreground">{current.explanation}</p>}
      </div>

      {selected !== null && !(mode === 'test' && index === questions.length - 1) && (
        <div className="flex justify-end">
          <Button onClick={goNext}>{index === questions.length - 1 ? 'Finish' : 'Next question'}</Button>
        </div>
      )}
    </section>
  );
}
