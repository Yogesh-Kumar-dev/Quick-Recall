'use client';
/**
 * ACCORDION — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI. Animation via CSS max-height transition (the interview-classic trick).
 *
 * CSS max-height trick:
 *   closed: max-height: 0; overflow: hidden
 *   open:   max-height: 500px; overflow: hidden
 * Transition on max-height creates the slide effect.
 * (Can't animate height: auto, but can animate max-height to a large enough value)
 */
import { useState } from 'react';

interface AccordionItem {
  id: number;
  title: string;
  body: string;
}

const ITEMS: AccordionItem[] = [
  {
    id: 0,
    title: 'What is React?',
    body: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the open-source community. React uses a declarative paradigm and a virtual DOM to efficiently update the UI.'
  },
  {
    id: 1,
    title: 'What is the Virtual DOM?',
    body: 'The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), and applies only the minimal set of changes to the real DOM (reconciliation).'
  },
  {
    id: 2,
    title: 'What are React Hooks?',
    body: 'Hooks are functions that let you use React state and lifecycle features in function components. Common hooks: useState (state), useEffect (side effects), useRef (mutable refs/DOM access), useMemo/useCallback (memoization), useContext (context access).'
  },
  {
    id: 3,
    title: 'What is the difference between useMemo and useCallback?',
    body: 'useMemo memoizes the RESULT of a function call. useCallback memoizes the FUNCTION ITSELF. Use useMemo for expensive computations, useCallback to prevent child re-renders when passing stable function references as props.'
  },
  {
    id: 4,
    title: 'What is prop drilling and how do you avoid it?',
    body: "Prop drilling is passing props through multiple levels of components that don't need them. Solutions: React Context API, Zustand/Redux for global state, component composition, or render props pattern."
  }
];

export default function Accordion() {
  const [isMultiOpen, setIsMultiOpen] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  // Array — O(n) includes/filter for multi-open ids, needs a manual dedupe check before adding
  // (compare to JsxVersion.jsx, which uses a Set for O(1) has/add/delete and no dedupe check).
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggle = (index: number): void => {
    if (isMultiOpen) {
      setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    } else {
      setOpenIndex((prev) => (prev === index ? null : index));
    }
  };

  const isOpen = (index: number): boolean => (isMultiOpen ? openItems.includes(index) : openIndex === index);

  return (
    <div className="max-w-[600px]">
      {/* Mode toggle */}
      <label className="mb-4 flex cursor-pointer items-center gap-2.5 text-sm text-gray-400">
        <input type="checkbox" checked={isMultiOpen} onChange={(e) => setIsMultiOpen(e.target.checked)} className="h-4 w-4 cursor-pointer" />
        {isMultiOpen ? 'Multi-open: multiple sections can be open' : 'Single-open: only one section at a time'}
      </label>

      {/* Accordion items */}
      {ITEMS.map((item) => {
        const open = isOpen(item.id);
        return (
          <details key={item.id} open={open} className="mb-2 overflow-hidden rounded-lg border border-[#2a3742]">
            {/* summary replaces the header div; e.preventDefault() stops the
                browser's native toggle so React state stays the single source of truth */}
            <summary
              onClick={(e) => {
                e.preventDefault();
                toggle(item.id);
              }}
              className={`flex cursor-pointer list-none items-center justify-between px-4 py-3.5 select-none transition-colors duration-150 ${
                open ? 'border-b border-[#2a3742] bg-[#173049]' : 'bg-[#141d26]'
              }`}
            >
              <strong className="text-sm">{item.title}</strong>
              <span
                className={`inline-block text-lg leading-none text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
              >
                ▾
              </span>
            </summary>

            {/* max-height trick still needed — <details> itself has no animation */}
            <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? 'max-h-[500px]' : 'max-h-0'}`}>
              <p className="m-0 px-4 py-3.5 text-sm leading-[1.7] text-gray-400">{item.body}</p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
