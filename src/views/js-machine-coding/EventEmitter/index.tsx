// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/EventEmitter');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Build an EventEmitter',
  description:
    'Implement an EventEmitter class with on(event, fn), off(event, fn), and emit(event, ...args). The single most common "design a small class" question — it underpins Node.js events, pub/sub, and every state library\'s subscribe mechanism.',
  examples: [
    {
      input: "emitter.on('login', fn); emitter.emit('login', 'yogesh')",
      output: "fn called with 'yogesh'",
      explanation: 'Listeners registered for an event run, in order, with the emitted arguments.'
    },
    {
      input: "emitter.off('login', fn); emitter.emit('login')",
      output: 'nothing happens',
      explanation: 'off removes that specific listener; unknown events are a no-op, not an error.'
    }
  ],
  constraints: [
    'Multiple listeners per event, called in registration order.',
    'emit forwards any number of arguments.',
    'off / emit on an unknown event must not throw.',
    'Follow-ups: once(event, fn), and on() returning an unsubscribe function.'
  ],
  interviewTip:
    'Open with the data structure: "a map of event name → array of listeners" — the three methods are just push, filter, and a loop. For once(), wrap the listener in a function that removes itself before calling through; that wrapper idea is the whole follow-up.',
  tags: ['class', 'pub-sub', 'events', 'design']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Core (on/off/emit)',
    description: 'The plain map-of-arrays version — enough for the first round of the question.',
    timeComplexity: 'O(n) emit / O(n) off',
    spaceComplexity: 'O(listeners)',
    pros: ['Minimal surface to explain', 'Each method is 3-4 lines'],
    cons: ['No once()', 'Caller must keep the listener reference to unsubscribe'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'With once + unsubscribe',
    description: 'on() returns an unsubscribe handle; once() wraps the listener so it removes itself before running.',
    timeComplexity: 'O(n) emit / O(n) off',
    spaceComplexity: 'O(listeners)',
    pros: ['The two follow-ups interviewers actually ask', 'Copy-on-emit avoids skipping listeners that unsubscribe mid-emit'],
    cons: ['Slightly more code', 'off(once-listener) needs the wrapper reference'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function EventEmitterProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
