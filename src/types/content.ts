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
  articleRefs?: string[]; // ids of Article this item links to — resolved via resolveArticleRefs(), only when genuinely useful
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: string; // e.g. 'core' | 'async' | 'es6' | 'hooks' | 'generics'
}

// ---------------------------------------------------------------------------
// Quick Recall cheatsheet
// ---------------------------------------------------------------------------
export interface QuickRecallItem {
  /** Stable identity within a sheet — auto-assigned by the registry (slug of section + concept) when not authored. Needed for React keys and future SRS wiring. */
  id?: string;
  /** URL of the full note/problem behind this item (e.g. `/js/notes?open=x`) — rendered as a deep-link chip. Set for items derived from Note[]. */
  href?: string;
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
// Direction: existing sets stay as-is for now, but new/rewritten cards should trend toward
// short keyword→definition pairs (front = a term or piece of jargon, back = a quick, plain
// explanation) rather than long code-behavior questions — flashcards are a fast glossary pass,
// with `articleRefs` pointing to the deeper read instead of the card trying to explain it all.
// ---------------------------------------------------------------------------
export interface Flashcard {
  id: string;
  front: string; // keyword / abbreviation / short question
  back: string; // definition / answer (kept short, 1–3 sentences)
  code?: string; // optional code snippet to show below the explanation
  category?: string; // optional grouping label (e.g. 'Keyword', 'Q&A')
  articleRefs?: string[]; // ids of Article this card links to — resolved via resolveArticleRefs(), only when genuinely useful
}

// ---------------------------------------------------------------------------
// Quiz — multiple-choice questions (standalone Quiz feature + Mock Interview)
// ---------------------------------------------------------------------------
export interface QuizQuestion {
  id: string;
  question: string;
  code?: string; // optional snippet shown above the options (e.g. "what does this log?")
  options: string[]; // 4 choices
  correctIndex: number; // index into options
  explanation?: string; // shown after the question is answered
  category?: string; // optional grouping label, same convention as Flashcard.category
  articleRefs?: string[]; // ids of Article this question links to — resolved via resolveArticleRefs(), only when genuinely useful
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
  /** Raw sample/seed data (as source text) or a URL to fetch it from — required whenever the problem needs data to work with. */
  sampleData?: string;
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

// ---------------------------------------------------------------------------
// Articles — long-form, MongoDB-docs style walkthroughs, structured as typed blocks
// (not markdown/MDX) so they render with the app's existing Callout/Code components.
// Standalone documents — never duplicate topic content, only linked TO from it via
// `articleRefs` on Note/Flashcard/QuizQuestion.
// ---------------------------------------------------------------------------
import type { CodeLang } from '@/components/content/code-highlighted';

export interface ArticleHeadingBlock {
  type: 'heading';
  id: string; // author-supplied anchor slug — must be unique within the article
  level: 2 | 3;
  text: string;
}

export interface ArticleParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface ArticleCodeBlock {
  type: 'code';
  code: string;
  language?: CodeLang;
}

export interface ArticleCalloutBlock {
  type: 'callout';
  variant: 'note' | 'warning' | 'tip';
  title?: string;
  text: string;
}

export interface ArticleListBlock {
  type: 'list';
  style: 'ordered' | 'unordered';
  items: string[];
}

export interface ArticleStepsBlock {
  type: 'steps';
  items: { title: string; text: string }[];
}

// VS Code Explorer–style folder/file tree — for walking through a project's directory structure
// (a build's output layout, a scaffolded template, etc.). `comment` renders as a trailing inline
// note (e.g. "hashed client chunk"), mirroring how such trees are annotated in real docs.
export interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  comment?: string;
  children?: FileTreeNode[];
}

export interface ArticleFileTreeBlock {
  type: 'filetree';
  root?: string; // optional root label shown above the tree, e.g. "dist/"
  nodes: FileTreeNode[];
}

// Simple static table (LeafyGreen's `@leafygreen-ui/table`) — for content that's naturally
// tabular (comparisons, option/flag references). Every row must have the same length as `columns`.
export interface ArticleTableBlock {
  type: 'table';
  columns: string[];
  rows: string[][];
}

export type ArticleBlock =
  | ArticleHeadingBlock
  | ArticleParagraphBlock
  | ArticleCodeBlock
  | ArticleCalloutBlock
  | ArticleListBlock
  | ArticleStepsBlock
  | ArticleFileTreeBlock
  | ArticleTableBlock;

export const ARTICLE_CATEGORIES = ['Frontend', 'Backend', 'Databases', 'Full Stack'] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface Article {
  id: string;
  slug: string; // route param + bookmark refId
  title: string;
  summary: string;
  category: ArticleCategory; // browse filter on /articles
  topics: string[]; // freeform browse/filter tags, e.g. ['PWA', 'Web Platform']
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  blocks: ArticleBlock[];
}
