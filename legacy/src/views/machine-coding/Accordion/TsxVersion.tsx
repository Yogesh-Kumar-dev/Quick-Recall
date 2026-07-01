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
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    if (isMultiOpen) {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    } else {
      setOpenIndex((prev) => (prev === index ? null : index));
    }
  };

  const isOpen = (index: number) => (isMultiOpen ? openItems.has(index) : openIndex === index);

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Mode toggle */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
          cursor: 'pointer',
          fontSize: 14,
          color: '#555'
        }}
      >
        <input
          type="checkbox"
          checked={isMultiOpen}
          onChange={(e) => setIsMultiOpen(e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer' }}
        />
        {isMultiOpen ? '🔓 Multi-open — multiple sections can be open' : '🔒 Single-open — only one section at a time'}
      </label>

      {/* Accordion items */}
      {ITEMS.map((item) => {
        const open = isOpen(item.id);
        return (
          <details
            key={item.id}
            open={open}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              marginBottom: 8,
              overflow: 'hidden'
            }}
          >
            {/* summary replaces the header div; e.preventDefault() stops the
                browser's native toggle so React state stays the single source of truth */}
            <summary
              onClick={(e) => {
                e.preventDefault();
                toggle(item.id);
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                cursor: 'pointer',
                listStyle: 'none' /* removes the native ▶ marker */,
                background: open ? '#e3f2fd' : '#fafafa',
                borderBottom: open ? '1px solid #e0e0e0' : 'none',
                transition: 'background 0.15s',
                userSelect: 'none'
              }}
            >
              <strong style={{ fontSize: 14 }}>{item.title}</strong>
              <span
                style={{
                  fontSize: 18,
                  color: '#555',
                  lineHeight: 1,
                  transition: 'transform 0.2s',
                  display: 'inline-block',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                ▾
              </span>
            </summary>

            {/* max-height trick still needed — <details> itself has no animation */}
            <div
              style={{
                maxHeight: open ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}
            >
              <p
                style={{
                  margin: 0,
                  padding: '14px 16px',
                  fontSize: 14,
                  color: '#555',
                  lineHeight: 1.7
                }}
              >
                {item.body}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
