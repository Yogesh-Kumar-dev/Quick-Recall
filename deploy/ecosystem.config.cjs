// PM2 process file for the QuickRecall Next.js server. Canonical copy lives in the repo;
// run PM2 from here so config changes ship with `git pull` instead of drifting on the server:
//   pm2 start deploy/ecosystem.config.cjs
//   pm2 reload deploy/ecosystem.config.cjs   (zero-downtime restart after a deploy)

module.exports = {
  apps: [
    {
      name: 'quickrecall',
      cwd: '/opt/quickrecall',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      autorestart: true,
      max_restarts: 10,
      // Next keeps its own in-process cache; a memory leak is a bug to fix, not paper over,
      // so no max_memory_restart here — add one only if a real leak needs a stopgap.
      exec_mode: 'fork' // Next's server isn't cluster-friendly out of the box; run one instance
    }
  ]
};
