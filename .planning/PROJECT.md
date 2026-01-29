# fiftymillimeter Blog

## What This Is

A blog for a photography portfolio site, built with Nuxt Content and integrated into the existing Nuxt 4 application. Posts combine words and images to share photography experiences, techniques, and stories. The blog lives at `/blog` as a top-level route alongside existing galleries and shop.

## Core Value

Visitors can read posts about photography experiences and see the images that go with them.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Photo galleries with collections from R2 — existing
- ✓ Shop with Stripe checkout — existing
- ✓ Image optimization via Cloudflare — existing
- ✓ Order confirmation emails via Resend — existing
- ✓ Responsive design with Nuxt UI — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Nuxt Content module integrated into existing app
- [ ] Blog index page at `/blog` with chronological post listing
- [ ] Individual post pages at `/blog/[slug]`
- [ ] Posts support markdown with embedded images
- [ ] Category system for organizing posts
- [ ] RSS feed for subscribers
- [ ] Blog navigation link in site header

### Out of Scope

- Comments — keeping it simple, no user interaction
- Search — small blog, chronological browsing sufficient
- Archive page — chronological listing serves this purpose
- Tags — categories are enough for organization
- Blog images from R2 — images live with markdown content

## Context

This is an existing Nuxt 4 photography portfolio deployed on Cloudflare Workers. The codebase has:
- Photo galleries pulling from Cloudflare R2
- A shop selling zines with Stripe payments
- Nuxt UI Pro for components
- D1 database for orders/products

Adding Nuxt Content extends the site with markdown-based content without changing the existing gallery or shop architecture. Blog images will be stored with the content files rather than in R2.

## Constraints

- **Tech stack**: Must use Nuxt Content (user has experience with it, fits existing Nuxt 4 stack)
- **Deployment**: Must work with Cloudflare Workers preset
- **Design**: Must match existing site aesthetic (slate/gray theme, Nuxt UI components)

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Nuxt Content over Astro | User has experience with Nuxt Content, keeps stack unified | — Pending |
| Blog images with content, not R2 | Simpler architecture, keeps blog and galleries separate | — Pending |
| Categories without tags | Simpler organization, user preference | — Pending |
| No comments | Keep blog simple and read-only | — Pending |

---
*Last updated: 2026-01-29 after initialization*
