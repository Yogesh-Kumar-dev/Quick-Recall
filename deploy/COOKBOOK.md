# EC2 Post-Launch Cookbook

Run this top to bottom once your EC2 instance is running and you have its public IP + the
`.pem` key file. For the *why* behind each step (architecture, security group rules, DuckDNS
signup, secret rotation, etc.) see `deploy/README.md` — this file is just the copy-paste path.

### 0. Connect

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### 1. Install Node, pnpm, PM2, nginx

```bash
sudo apt-get update && sudo apt-get upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo corepack enable
sudo corepack prepare pnpm@11.9.0 --activate  # match package.json's "packageManager" field
sudo npm install -g pm2
```

### 2. Create the app directory

```bash
sudo mkdir -p /opt/quickrecall
sudo chown ubuntu:ubuntu /opt/quickrecall
```

### 3. Point DuckDNS at your Elastic IP (one-time)

With an Elastic IP attached, the address never changes, so this is a single API call, not a
recurring job. Substitute your subdomain, token, and Elastic IP:

```bash
curl -fsS "https://www.duckdns.org/update?domains=quickrecall-aws&token=<your-token>&ip=<your-elastic-ip>"
```

Expect `OK` in the response. You only need to repeat this if you ever release the Elastic IP
and allocate a new one.

> Using a plain (non-Elastic) public IP instead? Skip this step and see the "No Elastic IP"
> box in `deploy/README.md` §2 for the cron-based version that keeps DuckDNS in sync as the
> IP changes.

### 4. Add GitHub repo secrets (on github.com, not the server)

Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `EC2_HOST` | the instance's public IP |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | full contents of the `.pem` file |

### 5. Trigger the first deploy

From your machine (not the server): push to `main`, or go to GitHub → Actions → **Deploy to
EC2** → Run workflow. Watch it go green. This populates `/opt/quickrecall` with the built
app for the first time.

### 6. Back on the server: start PM2 for real

```bash
cd /opt/quickrecall
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

`pm2 startup` prints a command starting with `sudo env PATH=...` — copy and run that exact
line, it's what makes PM2 survive a reboot.

```bash
curl -sI http://127.0.0.1:3000 | head -1
```

Expect `HTTP/1.1 200 OK`.

### 7. Verify DuckDNS caught up

```bash
DUCKDNS_SUBDOMAIN=quickrecall-aws DUCKDNS_TOKEN=<your-token> bash /opt/quickrecall/deploy/duckdns-update.sh
```

Expect `OK` in the output.

### 8. Wire up nginx

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /opt/quickrecall/deploy/nginx.conf /etc/nginx/sites-enabled/quickrecall.conf
sudo nginx -t && sudo systemctl reload nginx
```

Check: `http://quickrecall-aws.duckdns.org` (or `http://<EC2_PUBLIC_IP>`) should load the app.

### 9. Get HTTPS

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d quickrecall-aws.duckdns.org
```

Follow the prompts (email, agree to terms, choose redirect HTTP→HTTPS: yes).

### 10. Copy certbot's edits back into the repo

certbot just modified `/opt/quickrecall/deploy/nginx.conf` live on the server. Diff it
against your local copy and commit the SSL block back, otherwise the **next** deploy's rsync
will overwrite the server's cert config with your stale local copy:

```bash
cat /opt/quickrecall/deploy/nginx.conf
```

Copy that output into your local `deploy/nginx.conf`, commit, push.

---

Done — `https://quickrecall-aws.duckdns.org` is live, and every push to `main` from here on
just rebuilds and `pm2 reload`s automatically.
