---
name: deploy
description: Commit, push, build, and deploy the fiftymillimeter site to Cloudflare Workers. Use when the user wants to ship changes to production.
---

# Deploy

Full pipeline: commit, push to GitHub, build with Nuxt, and deploy to Cloudflare Workers.

## Usage

### 1. Commit and push

Create atomic commits using [Conventional Commits](https://www.conventionalcommits.org/). Review staged changes and split them into logical units:

```bash
cd /Users/slip/Documents/GitHub/fiftymillimeter
git status
git diff
```

Stage and commit related changes together. Use `git add -p` or `git add <file>` to stage selectively:

```bash
git add <related-files>
git commit -m "<type>(<scope>): <description>"
```

**Types:** `feat`, `fix`, `style`, `refactor`, `perf`, `docs`, `chore`, `build`, `ci`, `test`

**Examples:**
- `feat(about): update bio with personal connection copy`
- `fix(gallery): correct srcset sizes for collection thumbnails`
- `perf(image): add global density config for retina displays`
- `chore(config): add screens config to nuxt image module`
- `docs(skills): add deploy pipeline skill`

**Rules:**
- One logical change per commit — don't mix unrelated changes
- Config changes are separate from component changes
- Copy/content updates are separate from layout/style changes
- Bug fixes are separate from features

Push all commits after staging is complete:

```bash
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
