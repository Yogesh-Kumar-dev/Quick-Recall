'use client';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Checkbox from '@cloudscape-design/components/checkbox';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import RadioGroup from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useState } from 'react';
import type { AwsQuizQuestion } from '@/data/aws/aws-quiz';

function isMultiSelect(question: AwsQuizQuestion): question is AwsQuizQuestion & { correctIndexes: number[] } {
  return 'correctIndexes' in question;
}

function setsEqual(a: Set<number>, b: Set<number>): boolean {
  return a.size === b.size && [...a].every((v) => b.has(v));
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Cloudscape-native quiz UI, distinct from the app-wide shadcn QuizRunner used elsewhere — kept
// separate so /aws stays entirely Cloudscape, matching the same reasoning as AwsRelatedNotes.
// Single "practice" mode (immediate feedback, no test/scored-run toggle) — the simplest version
// that lets someone drill a domain; add a timed/test mode only if that's actually asked for.
export function AwsQuizRunner({ questions }: Readonly<{ questions: AwsQuizQuestion[] }>) {
  // Lazy initializer runs once per mount, not on every render — a fresh order each time this
  // component mounts (e.g. navigating back into the Quiz tab), not a fresh order every re-render.
  const [shuffled] = useState(() => shuffle(questions));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<Set<number>>(new Set());
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (index >= shuffled.length) {
    return (
      <Container header={<Header variant="h2">Quiz Complete</Header>}>
        <SpaceBetween size="m">
          <Box fontSize="heading-l" fontWeight="bold">
            You scored {correctCount} / {shuffled.length}
          </Box>
          <Button
            onClick={() => {
              setIndex(0);
              setCorrectCount(0);
              setAnswered(false);
              setSelected(null);
              setSelectedMulti(new Set());
            }}
          >
            Restart
          </Button>
        </SpaceBetween>
      </Container>
    );
  }

  const question = shuffled[index];
  const multi = isMultiSelect(question);
  const isCorrect = multi ? setsEqual(selectedMulti, new Set(question.correctIndexes)) : selected === String(question.correctIndex);
  const hasSelection = multi ? selectedMulti.size > 0 : selected !== null;

  function toggleMultiOption(i: number) {
    setSelectedMulti((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleCheck() {
    setAnswered(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
  }

  function handleNext() {
    setIndex((i) => i + 1);
    setSelected(null);
    setSelectedMulti(new Set());
    setAnswered(false);
  }

  return (
    <SpaceBetween size="l">
      <ProgressBar value={(index / shuffled.length) * 100} additionalInfo={`Question ${index + 1} of ${shuffled.length}`} />
      <Container header={<Header variant="h2">{question.category ?? 'Question'}</Header>}>
        <SpaceBetween size="m">
          <Box fontWeight="bold">{question.question}</Box>
          {multi ? (
            <SpaceBetween size="xs">
              {question.options.map((option, i) => (
                <Checkbox key={option} checked={selectedMulti.has(i)} disabled={answered} onChange={() => toggleMultiOption(i)}>
                  {option}
                </Checkbox>
              ))}
            </SpaceBetween>
          ) : (
            <RadioGroup
              value={selected}
              onChange={({ detail }) => setSelected(detail.value)}
              items={question.options.map((option, i) => ({ value: String(i), label: option, disabled: answered }))}
            />
          )}
          {answered && (
            <Alert type={isCorrect ? 'success' : 'error'} header={isCorrect ? 'Correct' : 'Incorrect'}>
              {question.explanation}
            </Alert>
          )}
          {answered ? (
            <Button variant="primary" onClick={handleNext}>
              {index + 1 < shuffled.length ? 'Next question' : 'See results'}
            </Button>
          ) : (
            <Button variant="primary" disabled={!hasSelection} onClick={handleCheck}>
              Check answer
            </Button>
          )}
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
