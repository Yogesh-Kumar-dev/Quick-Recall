'use client';
/**
 * ACCORDION — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 *
 * CSS max-height trick:
 *   closed: max-height: 0; overflow: hidden
 *   open:   max-height: 500px; overflow: hidden
 */
import { useState } from 'react';

const ITEMS = [
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
  const [isMultiOpen, setIsMultiOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  // Set — O(1) has/add/delete for multi-open ids, no manual dedupe like an array needs.
  const [openItems, setOpenItems] = useState(new Set([0]));

  const toggle = (index) => {
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

  const isOpen = (index) => (isMultiOpen ? openItems.has(index) : openIndex === index);

  return (
    <div
      // style={{ maxWidth: 600 }}
      className="max-w-[600px]"
    >
      {/* Mode toggle */}
      <label
        // style={{
        //   display: 'flex',
        //   alignItems: 'center',
        //   gap: 10,
        //   marginBottom: 16,
        //   cursor: 'pointer',
        //   fontSize: 14,
        //   color: '#9ca3af'
        // }}
        className="mb-4 flex cursor-pointer items-center gap-2.5 text-sm text-gray-400"
      >
        <input
          type="checkbox"
          checked={isMultiOpen}
          onChange={(e) => setIsMultiOpen(e.target.checked)}
          // style={{ width: 16, height: 16, cursor: 'pointer' }}
          className="h-4 w-4 cursor-pointer"
        />
        {isMultiOpen ? 'Multi-open — multiple sections can be open' : 'Single-open — only one section at a time'}
      </label>

      {/* Accordion items */}
      {ITEMS.map((item) => {
        const open = isOpen(item.id);
        return (
          <details
            key={item.id}
            open={open}
            // style={{
            //   border: '1px solid #2a3742',
            //   borderRadius: 8,
            //   marginBottom: 8,
            //   overflow: 'hidden'
            // }}
            className="mb-2 overflow-hidden rounded-lg border border-[#2a3742]"
          >
            <summary
              onClick={(e) => {
                e.preventDefault();
                toggle(item.id);
              }}
              // style={{
              //   display: 'flex',
              //   justifyContent: 'space-between',
              //   alignItems: 'center',
              //   padding: '14px 16px',
              //   cursor: 'pointer',
              //   listStyle: 'none',
              //   background: open ? '#173049' : '#141d26',
              //   borderBottom: open ? '1px solid #2a3742' : 'none',
              //   transition: 'background 0.15s',
              //   userSelect: 'none'
              // }}
              className={`flex cursor-pointer list-none items-center justify-between px-4 py-3.5 select-none transition-colors duration-150 ${
                open ? 'border-b border-[#2a3742] bg-[#173049]' : 'bg-[#141d26]'
              }`}
            >
              <strong className="text-sm">{item.title}</strong>
              <span
                // style={{
                //   fontSize: 18,
                //   color: '#9ca3af',
                //   lineHeight: 1,
                //   transition: 'transform 0.2s',
                //   display: 'inline-block',
                //   transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                // }}
                className={`inline-block text-lg leading-none text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
              >
                ▾
              </span>
            </summary>

            {/* max-height trick still needed — <details> itself has no animation */}
            <div
              // style={{
              //   maxHeight: open ? '500px' : '0',
              //   overflow: 'hidden',
              //   transition: 'max-height 0.3s ease'
              // }}
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? 'max-h-[500px]' : 'max-h-0'}`}
            >
              <p
                // style={{
                //   margin: 0,
                //   padding: '14px 16px',
                //   fontSize: 14,
                //   color: '#9ca3af',
                //   lineHeight: 1.7
                // }}
                className="m-0 px-4 py-3.5 text-sm leading-[1.7] text-gray-400"
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
