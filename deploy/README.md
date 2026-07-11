# Deploying QuickRecall to EC2 (practice deployment, separate from Vercel)

This is a second, independent deployment used to practice AWS EC2 — the existing
`quickrecall.vercel.app` deployment on Vercel is untouched and keeps deploying itself via
Vercel's own git integration. Nothing here needs any Vercel console configuration.

**Architecture:** GitHub Actions builds the app on its runner, `rsync`s the working tree to
the EC2 box, installs production deps there, and reloads PM2. PM2 keeps `next start` alive
and restarts it on crash/reboot; nginx reverse-proxies port 80/443 to PM2's port 3000.
`deploy/nginx.conf`, `deploy/ecosystem.config.cjs`, and `.github/workflows/deploy-ec2.yml`
are the three files that define this pipeline — all versioned in the repo.

**Public hostname:** no domain purchase — a free DuckDNS subdomain
(`quickrecall-aws.duckdns.org` by convention below) points at the instance, kept in sync by
a small cron job, and certbot issues it a real Let's Encrypt certificate.

## 1. Claim a DuckDNS subdomain

1. Go to https://www.duckdns.org and sign in (GitHub/Google/etc. — no separate password to
   manage).
2. Under "add domain", enter a subdomain, e.g. `quickrecall-aws` → you get
   `quickrecall-aws.duckdns.org`. Pick something unique; common names are often taken.
3. Copy the **token** shown at the top of the dashboard — you'll put it in a cron job on the
   EC2 instance in step 3 (not a GitHub secret; DuckDNS updates happen from the server, not CI).
4. If you use something other than `quickrecall-aws`, update `server_name` in
   `deploy/nginx.conf` to match before you deploy.

## 2. Launch the EC2 instance

- **AMI:** Ubuntu Server 24.04 LTS.
- **Instance type:** `m7i-flex.large`. Confirm it shows the "Free tier eligible" badge next
  to the instance type in the launch wizard for your account — free-tier eligibility varies
  by account age/signup date, so don't assume, just check the badge.
- **Storage:** 20–30 GB gp3 (within the free-tier EBS allowance).
- **Key pair:** create a new one, download the `.pem` — its contents become the
  `EC2_SSH_KEY` GitHub secret in step 4. There's no way to retrieve it again after this step,
  so save it before moving on.
- **Security group (inbound rules):**
  | Port | Source | Why |
  |---|---|---|
  | 22 | 0.0.0.0/0 | SSH — needed open to the internet because GitHub-hosted runners use rotating IPs, so it can't be locked to a single IP. Key-based auth only (password auth stays off) is the real defense here. |
  | 80 | 0.0.0.0/0 | HTTP, redirected to HTTPS once certbot runs |
  | 443 | 0.0.0.0/0 | HTTPS |
- Launch it, note the instance's **public IPv4 address**.

An Elastic IP is optional but recommended: attach one (free while associated with a running
instance) and the public IP never changes, so pointing DuckDNS at it in COOKBOOK.md step 3
is a single one-time API call.

> **No Elastic IP?** The address can change on a stop/start, so DuckDNS needs to be told
> whenever that happens. Replace COOKBOOK.md step 3 with a recurring cron job instead of the
> one-time curl call:
> ```bash
> mkdir -p ~/duckdns-log
> crontab -l 2>/dev/null | { cat; echo "*/5 * * * * DUCKDNS_SUBDOMAIN=quickrecall-aws DUCKDNS_TOKEN=<your-token> /opt/quickrecall/deploy/duckdns-update.sh >> /home/ubuntu/duckdns-log/duckdns.log 2>&1"; } | crontab -
> ```
> This line references `deploy/duckdns-update.sh`, which only lands on the server as part of
> the first CI deploy (step 4 below) — it silently no-ops every 5 minutes until then, which
> is expected.

## 3. One-time server setup

SSH in (`ssh -i your-key.pem ubuntu@<public-ip>`) and run **steps 1–3 of
`deploy/COOKBOOK.md`** — Node/pnpm/PM2/nginx install, the `/opt/quickrecall` app directory,
and pointing DuckDNS at your Elastic IP. That file is the single source of truth for the
exact commands; this section just explains what they're for and why.

## 4. GitHub repo secrets

Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `EC2_HOST` | the instance's public IP (or `quickrecall-aws.duckdns.org` once DNS has propagated) |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | the full contents of the `.pem` file from step 2 (private key, `-----BEGIN...-----END-----` and all) |

Push to `main` (or run the workflow manually from the Actions tab: **Deploy to EC2** →
*Run workflow*). `.github/workflows/deploy-ec2.yml` will:

1. Build the app on the GitHub runner (`pnpm build`).
2. `rsync` the whole working tree (minus `.git`/`node_modules`) to `/opt/quickrecall`
   on the instance — not just `.next`/`public`, because the machine-coding pages read their
   own source files with `readFileSync` at render time, so `src/` must exist on the server too.
3. SSH in, run `pnpm install --frozen-lockfile` (**full install, not `--prod`**) and
   `pm2 reload deploy/ecosystem.config.cjs`.
4. Curl `127.0.0.1:3000` on the instance as a smoke test.

**Why not `--prod`:** Next's Turbopack build externalizes Sentry/OpenTelemetry's
instrumentation loader (`require-in-the-middle`) with a reference baked to the exact pnpm
dependency-resolution tree at build time. `--prod` excludes devDependencies, which changes
that tree just enough that the baked-in reference stops resolving (`Cannot find module
'require-in-the-middle-<hash>'`), crashing the server on every request with a 500. Running
the identical install command CI used to build keeps the layout consistent — without needing
to rsync the (large) `node_modules` directory over the network on every deploy.

This first run creates everything under `/opt/quickrecall`, including
`deploy/ecosystem.config.cjs`. After it finishes, run **COOKBOOK.md step 6** to start PM2
for the first time and hand it to systemd (`pm2 start` → `pm2 save` → `pm2 startup`) so it
survives reboots. Subsequent pushes just `pm2 reload` (zero-downtime) — no need to repeat
`pm2 start`/`startup`.

## 5. nginx + HTTPS

Run **COOKBOOK.md steps 8–9**: symlink `deploy/nginx.conf` into `/etc/nginx/sites-enabled/`,
reload nginx, then run certbot to get HTTPS via Let's Encrypt.

certbot edits the nginx config in place on the server; **COOKBOOK.md step 10** covers porting
those edits back into `deploy/nginx.conf` and committing, so the repo copy stays canonical
(otherwise the next deploy's rsync overwrites the server's cert-related nginx changes with
the un-edited repo copy).

Note: the PWA (service worker, install prompt, offline downloads) only works over HTTPS —
plain `http://` serves the app fine but without offline support.

## Notes

- There is no database or backend — all user data lives in the browser (IndexedDB) — so
  there's nothing else to provision on the server.
- Useful PM2 commands: `pm2 status`, `pm2 logs quickrecall`, `pm2 monit`.
- `concurrency: cancel-in-progress: false` in the workflow means if you push twice quickly,
  the second run queues instead of killing the first mid-rsync (which could otherwise leave
  a half-synced `.next` directory on the server).
- Rotate `EC2_SSH_KEY` by generating a new key pair, adding the new public key to the
  instance's `~/.ssh/authorized_keys`, then updating the GitHub secret — don't remove the old
  key from the instance until the new one is confirmed working.
