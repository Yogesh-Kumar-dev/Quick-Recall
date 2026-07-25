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
  { title: 'Review pays off', body: 'The concept you review today is the one you won’t freeze on tomorrow.' }
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
