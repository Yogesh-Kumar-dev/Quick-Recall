// ─── Interview Prep Content Types ──────────────────────────────────────────

// ---------------------------------------------------------------------------
// Notes pages (JS, TS, React)
// ---------------------------------------------------------------------------
export interface Note {
  id: string;
  title: string;
  summary: string; // 1-liner shown on the card
  keyPoints: string[];
  gotcha?: string; // common mistake / trap
  codeSnippet?: string;
  textbookDef?: string; // formal definition — rendered for intermediate + advanced
  eli5?: string; // casual analogy-driven walkthrough — rendered for intermediate + advanced
  prerequisites?: string[]; // ids of notes (any topic) this one builds on — rendered as deep-link chips
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: string; // e.g. 'core' | 'async' | 'es6' | 'hooks' | 'generics'
}

// ---------------------------------------------------------------------------
// Quick Recall cheatsheet
// ---------------------------------------------------------------------------
export interface QuickRecallItem {
  concept: string;
  bullets: string[];
  codeSnippet?: string; // short inline code block
  warning?: string; // highlighted gotcha (rendered in amber box)
}

export interface QuickRecallSection {
  title: string;
  items: QuickRecallItem[];
}

// ---------------------------------------------------------------------------
// Flashcards — keyword/abbreviation definitions + small Q&A (flip carousel)
// ---------------------------------------------------------------------------
export interface Flashcard {
  id: string;
  front: string; // keyword / abbreviation / short question
  back: string; // definition / answer (kept short, 1–3 sentences)
  code?: string; // optional code snippet to show below the explanation
  category?: string; // optional grouping label (e.g. 'Keyword', 'Q&A')
}

// ---------------------------------------------------------------------------
// Shared difficulty type + base problem entry
// ---------------------------------------------------------------------------
export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface BaseProblemEntry {
  id: string;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  category: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Custom Hooks — documented hook with source + live demo
// ---------------------------------------------------------------------------
import type { ReactNode } from 'react';

export type HookDifficulty = 'easy' | 'medium' | 'advanced';

export interface HookDoc {
  id: string;
  name: string; // e.g. 'useDebounce'
  tagline: string; // 1-liner shown on the card header
  difficulty: HookDifficulty;
  category: string; // e.g. 'state' | 'effect' | 'browser' | 'async'
  description: string; // 2-4 sentence explanation
  signature: string; // e.g. 'const value = useDebounce(value, delay)'
  source: string; // raw hook source (TypeScript)
  usage: string; // short usage snippet
  useCases: string[]; // bullet list of where to use it
  gotcha?: string; // common mistake / trap
  demo: ReactNode; // live interactive demo element
}

// ---------------------------------------------------------------------------
// JS Machine Coding — problem registry (list page)
// ---------------------------------------------------------------------------
export type ProblemCategory = 'array' | 'object' | 'async' | 'string' | 'functional' | 'class' | 'dom';

export interface JsProblemEntry extends BaseProblemEntry {
  category: ProblemCategory;
}

// ---------------------------------------------------------------------------
// React Machine Coding — problem registry (list page)
// ---------------------------------------------------------------------------
export type ReactMcCategory = 'ui-state' | 'forms' | 'data-fetching' | 'layout' | 'performance' | 'advanced-ui';

export interface ReactMcProblem extends BaseProblemEntry {
  category: ReactMcCategory;
}

// ---------------------------------------------------------------------------
// React Machine Coding — individual problem meta (used in server component)
// ---------------------------------------------------------------------------
export interface ProblemMeta {
  title: string;
  description: string;
  requirements: string[];
  keyPatterns: string[];
  interviewTip: string;
}

// ---------------------------------------------------------------------------
// JS Machine Coding — individual problem (used in server component)
// ---------------------------------------------------------------------------
export interface JsProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface JsProblemMeta {
  title: string;
  description: string;
  examples: JsProblemExample[];
  constraints?: string[];
  interviewTip: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// JS Machine Coding — a single approach/solution
// ---------------------------------------------------------------------------
export interface ApproachData {
  label: string; // 'Brute Force' | 'Better' | 'Optimal' | 'One-liner'
  description: string; // What this approach does and why
  timeComplexity: string; // e.g. 'O(n²)'
  spaceComplexity: string; // e.g. 'O(1)'
  pros?: string[];
  cons?: string[];
  code: string; // raw file content (read at build time via readFileSync)
  filename: string; // e.g. 'solution-brute.js' — shown in CodeViewer header
}
