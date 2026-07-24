'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// TypingText: character-by-character text reveal animation.
// Respects prefers-reduced-motion and provides onComplete callback.

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypingText({ text, speed = 30, onComplete, className }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      indexRef.current = 0;
      setDisplayedText('');
      setIsComplete(false);
    }
  }, [text]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    if (isComplete) return;

    const interval = setInterval(() => {
      indexRef.current += 1;
      const next = text.slice(0, indexRef.current);
      setDisplayedText(next);

      if (indexRef.current >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isComplete, onComplete]);

  return (
    <span className={cn('whitespace-pre-wrap', className)}>
      {displayedText}
      {!isComplete && <span className="ml-0.5 inline-block animate-pulse text-muted-foreground">|</span>}
    </span>
  );
}
