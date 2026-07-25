import { readFileSync } from 'node:fs';

// portless (see package.json's "dev" script) assigns next dev a random port each run and prints
// it in the `pnpm dev` output — pass it here to skip portless's HTTPS proxy entirely.
const port = process.argv[2];
if (!port) {
  console.error('Usage: pnpm test:push <port>  (the port pnpm dev printed, e.g. 4123)');
  process.exit(1);
}

// ponytail: minimal .env.local parser, swap for dotenv if more vars need this treatment later
const env = readFileSync('.env.local', 'utf8');
const secret = env.match(/^CRON_SECRET=(.*)$/m)?.[1]?.trim();

if (!secret) {
  console.error('CRON_SECRET not found in .env.local');
  process.exit(1);
}

const res = await fetch(`http://localhost:${port}/api/cron/send-quote`, {
  headers: { Authorization: `Bearer ${secret}` }
});

console.log(res.status, await res.text());
