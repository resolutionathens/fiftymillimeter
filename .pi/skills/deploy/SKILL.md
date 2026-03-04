---
name: deploy
description: Commit, push, build, and deploy the fiftymillimeter site to Cloudflare Workers. Use when the user wants to ship changes to production.
---

# Deploy

Full pipeline: commit, push to GitHub, build with Nuxt, and deploy to Cloudflare Workers.

## Usage

### 1. Commit and push

```bash
cd /Users/slip/Documents/GitHub/fiftymillimeter
git add -A
git commit -m "<descriptive commit message>"
git push
```

### 2. Build

```bash
bun run build
```

Verify the build succeeds (look for "Build complete!" in output).

### 3. Deploy

The Cloudflare API token in the environment lacks Workers permissions. Unset it to use the OAuth session from `wrangler login`:

```bash
unset CLOUDFLARE_API_TOKEN
unset CF_API_TOKEN
npx wrangler deploy
```

Verify deployment succeeds (look for "Deployed" and the version ID in output).

## Notes

- Always commit and push **before** building and deploying.
- Build output goes to `.output/` which wrangler picks up automatically.
- Production URL: https://fiftymillimeter.com
- Workers URL: https://fiftymillimeter-portfolio.exposure.workers.dev
