// Seeds the notificationtemplates collection with motivating quotes for the daily push
// (see src/app/api/cron/send-quote/route.ts, which $sample-picks one active template per run).
// Idempotent — upserts by body, so re-running won't create duplicates.

import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

const QUOTES = [
  { title: 'Keep going', body: "The expert in anything was once a beginner who didn't quit." },
  { title: 'Small steps', body: 'A little progress each day adds up to big results.' },
  { title: 'Practice > talent', body: "You don't have to be great to start, but you have to start to be great." },
  { title: 'Own your pace', body: "Comparison is the thief of joy — run your own race, at your own pace." },
  { title: 'Bugs teach', body: 'Every bug you fix is a lesson the tutorials never taught you.' },
  { title: 'Consistency wins', body: 'Discipline beats motivation on the days motivation doesn’t show up.' },
  { title: 'Interview mindset', body: "You don't need to know everything — you need to show how you think." },
  { title: 'Reframe rejection', body: 'A rejection is just redirection toward the role that actually fits.' },
  { title: 'Depth over speed', body: "Understanding one concept deeply beats skimming ten." },
  { title: 'Show up', body: 'Half of getting better is just showing up on the days you don’t feel like it.' },
  { title: 'Confidence is built', body: 'Confidence isn’t something you wait for — it’s something you build, one solved problem at a time.' },
  { title: 'Review pays off', body: 'The concept you review today is the one you won’t freeze on tomorrow.' },
  { title: 'Slow is smooth', body: 'Slow is smooth, and smooth is fast: rushing a concept just means relearning it later.' },
  { title: 'Ask why', body: 'Memorizing the answer gets you through one question; understanding why gets you through all of them.' },
  { title: 'Start ugly', body: 'A messy first draft of a solution beats a perfect one that never gets written.' },
  { title: 'Debug the basics', body: 'When something feels impossible, check the fundamentals first. That is usually where the answer is hiding.' },
  { title: 'Curiosity compounds', body: 'The questions you chase after the interview are the ones that make you better than the answer key.' },
  { title: 'Fail forward', body: 'Every failed attempt narrows down what actually works.' },
  { title: 'Momentum matters', body: 'One solved problem makes the next one easier. That is the whole game.' },
  { title: 'Patience pays', body: 'The concepts that took the longest to click are usually the ones you explain the best.' },
  { title: 'Prepare, don’t panic', body: 'Preparation is just panic, done early.' },
  { title: 'Trust the process', body: 'You will not feel ready. Start anyway, readiness shows up mid-way.' },
  { title: 'Teach it back', body: 'If you can explain it simply, you actually know it. If not, that is your next thing to review.' },
  { title: 'Long game', body: 'Interview prep is not a sprint. Steady, boring repetition is what actually sticks.' }
];

const line = readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .find((l) => l.startsWith('MONGODB_URI='));
const uri = line?.slice('MONGODB_URI='.length).trim();
if (!uri) throw new Error('MONGODB_URI not set in .env.local');

const NotificationTemplate = mongoose.model(
  'NotificationTemplate',
  new mongoose.Schema({ title: String, body: String, active: Boolean }, { timestamps: true })
);

await mongoose.connect(uri);
const result = await NotificationTemplate.bulkWrite(
  QUOTES.map((q) => ({
    updateOne: {
      filter: { body: q.body },
      update: { $setOnInsert: { ...q, active: true } },
      upsert: true
    }
  }))
);
console.log(`seeded: ${result.upsertedCount} new, ${QUOTES.length - result.upsertedCount} already present`);
await mongoose.disconnect();
