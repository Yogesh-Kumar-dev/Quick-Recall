// types
import type { PredefinedQuestion } from '@/types/speak-up';

// ==============================|| SPEAK UP - PREDEFINED QUESTIONS ||============================== //

// Static, read-only questions shared by both the rehearsal tool (SpeechPractice) and
// the Q&A practice bank. The `id`s are stable so a saved answer can be matched back to
// its question via SpeakUpQA.sourceId — never renumber an existing id.

export const predefinedQuestions: PredefinedQuestion[] = [
  { id: 'tell-me-about-yourself', question: 'Tell me about yourself.', category: 'Behavioral' },
  { id: 'strengths-and-weaknesses', question: 'What are your strengths and weaknesses?', category: 'Behavioral' },
  { id: 'why-this-role', question: 'Why do you want this role?', category: 'Behavioral' },
  { id: 'challenging-problem', question: 'Describe a challenging problem you solved.', category: 'Behavioral' },
  { id: 'five-years', question: 'Where do you see yourself in 5 years?', category: 'Behavioral' },
  { id: 'why-leaving', question: 'Why are you leaving your current job?', category: 'Behavioral' },
  { id: 'closures', question: 'What is a closure, and where have you used one?', category: 'JavaScript' },
  { id: 'event-loop', question: 'Explain the event loop and the microtask queue.', category: 'JavaScript' },
  { id: 'state-vs-props', question: 'What is the difference between state and props in React?', category: 'React' },
  { id: 'useeffect-pitfalls', question: 'What are common pitfalls with useEffect, and how do you avoid them?', category: 'React' }
];
