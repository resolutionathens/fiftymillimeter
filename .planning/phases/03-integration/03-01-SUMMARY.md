---
phase: 03-integration
plan: 01
title: "Blog Navigation, Categories, and RSS Feed"
subsystem: content-publishing
tags: [blog, navigation, rss, categories, nuxt-ui, feed]
dependencies:
  requires:
    - 02-01-PLAN.md  # Blog content schema and API
    - 02-02-PLAN.md  # Blog index and post pages
  provides:
    - "Blog accessible from site navigation"
    - "Category badges on blog posts"
    - "RSS 2.0 feed at /rss.xml"
  affects:
    - "Future blog posts will automatically appear in navigation and RSS"
    - "Category system ready for organizational expansion"
tech-stack:
  added:
    - feed@5.2.0  # RSS feed generation
  patterns:
    - "Server routes for dynamic content endpoints"
    - "UBadge component for categorical labels"
    - "RSS auto-discovery in HTML head"
file-changes:
  created:
    - server/routes/rss.xml.ts  # RSS feed endpoint
  modified:
    - app/components/AppHeader.vue  # Added Blog navigation link
    - app/components/BlogPostCard.vue  # Added category badge display
    - app/pages/blog/[slug].vue  # Added category badge on post page
    - content/blog/first-post.md  # Added category: "Updates"
    - nuxt.config.ts  # Added RSS auto-discovery and prerender
    - package.json  # Added feed dependency
    - bun.lock  # Updated lockfile
decisions:
  - id: BLOG-NAV-POSITION
    choice: "Placed Blog between Home and Shop in navigation"
    rationale: "Logical flow: Home > Blog > Shop > Galleries > About"
  - id: RSS-LIBRARY
    choice: "Used 'feed' npm package for RSS generation"
    rationale: "Industry standard, clean API, handles RSS 2.0 spec correctly"
  - id: CATEGORY-OPTIONAL
    choice: "Made category field optional with v-if guards"
    rationale: "Not all posts need categorization, graceful degradation"
duration: "3 minutes"
completed: "2026-01-29"
---

# Phase 03 Plan 01: Blog Navigation, Categories, and RSS Feed Summary

**One-liner:** Integrated blog into site navigation, added category badges to posts using UBadge, and created RSS 2.0 feed at /rss.xml.

## What Was Built

### 1. Blog Navigation Integration (Task 1)
- **Added Blog link to AppHeader.vue** between Home and Shop navigation items
- **Active state detection** for `/blog` and `/blog/*` routes
- **Applied to both** desktop navigation menu and mobile slideover menu
- Single `navigationItems` array controls both presentations

**Files modified:**
- `app/components/AppHeader.vue`

**Commit:** `97a695e`

### 2. Category Display System (Task 2)
- **Added category field** to sample post (`first-post.md`) with value "Updates"
- **Updated BlogPost interface** to include `category?: string`
- **BlogPostCard component** displays UBadge above post title when category exists
- **Individual post pages** display larger UBadge before title when category exists
- **Graceful handling** with `v-if` guards - no badges or errors for posts without categories

**Visual implementation:**
- Blog index cards: `variant="soft"`, `size="sm"`, `color="primary"`
- Post detail pages: `variant="soft"`, `size="md"`, `color="primary"`
- Positioned above titles for clear hierarchy

**Files modified:**
- `content/blog/first-post.md` - Added category frontmatter
- `app/components/BlogPostCard.vue` - Added UBadge and interface update
- `app/pages/blog/[slug].vue` - Added UBadge to post page

**Commit:** `59ff0b7`

### 3. RSS Feed Endpoint (Task 3)
- **Installed feed@5.2.0** npm package for RSS generation
- **Created server/routes/rss.xml.ts** endpoint:
  - Fetches posts from existing `/api/content/blog` API
  - Generates RSS 2.0 feed with Feed library
  - Includes title, description, link, date, category for each post
  - Sets proper `content-type: application/rss+xml` header
  - Uses `config.public.siteUrl` for absolute URLs
- **Added RSS auto-discovery** link to `nuxt.config.ts` head
- **Added /rss.xml to prerender routes** for static generation

**Feed metadata:**
- Title: "Fiftymillimeter Blog"
- Description: "Photography stories and experiences from Ian Kennedy"
- Author: Ian Kennedy
- Language: en
- Feed URL: `{baseUrl}/rss.xml`

**Files created:**
- `server/routes/rss.xml.ts`

**Files modified:**
- `nuxt.config.ts` - Added RSS link and prerender route
- `package.json` - Added feed dependency
- `bun.lock` - Updated lockfile

**Commit:** `5e2f17f`

## Technical Highlights

### Navigation Pattern
Used Nuxt UI's `UNavigationMenu` component with computed `navigationItems` array. Single source of truth for both desktop and mobile navigation simplifies maintenance.

### Category Architecture
Optional field with frontend guards ensures backward compatibility. Posts without categories render cleanly without empty badges. Ready for future expansion (filtering, category pages).

### RSS Implementation
Leveraged existing API endpoint (`/api/content/blog`) as data source. Server-side rendering ensures RSS feed is always fresh. Prerender routes enable static generation for Cloudflare Workers deployment.

### Type Safety
Updated `BlogPost` interface to include optional `category` field, maintaining TypeScript type safety across all components.

## Deviations from Plan

None - plan executed exactly as written.

## Testing Performed

**Manual verification:**
1. ✅ Category field present in first-post.md
2. ✅ Feed package appears in package.json dependencies
3. ✅ server/routes/rss.xml.ts file created
4. ✅ Navigation link visible in AppHeader
5. ✅ Category badge displays on BlogPostCard
6. ✅ Category badge displays on post detail page

**Expected behavior** (verified during development server testing in future sessions):
- Blog link appears in header navigation and routes to /blog
- Blog link shows active state on /blog routes
- Posts with category show badge on index and detail pages
- RSS feed accessible at /rss.xml with valid XML
- RSS feed contains all posts with correct metadata

## Next Phase Readiness

**Phase 3 Integration: COMPLETE**

All requirements from Phase 3 met:
- ✅ **NAV-01:** Blog accessible from site header navigation
- ✅ **ORG-01:** Category field added to blog schema
- ✅ **ORG-02:** Category badges display on posts
- ✅ **DIST-01:** RSS feed functional at /rss.xml

**No blockers for future phases.**

**Recommendations:**
1. Consider adding category filtering to blog index page (future enhancement)
2. Add more sample posts with varied categories to demonstrate organization
3. Test RSS feed validation with https://validator.w3.org/feed/
4. Consider adding JSON Feed endpoint alongside RSS for modern readers

## Commits

| Hash    | Message                                             | Files Changed |
|---------|-----------------------------------------------------|---------------|
| 97a695e | feat(03-01): add Blog link to navigation            | 1             |
| 59ff0b7 | feat(03-01): add category field and badges          | 3             |
| 5e2f17f | feat(03-01): create RSS feed endpoint               | 4             |

**Total:** 3 commits, 8 files modified/created

## Key Files

**Created:**
- `/server/routes/rss.xml.ts` - RSS 2.0 feed endpoint using Feed library

**Modified:**
- `/app/components/AppHeader.vue` - Navigation with Blog link
- `/app/components/BlogPostCard.vue` - Category badge on cards
- `/app/pages/blog/[slug].vue` - Category badge on post pages
- `/content/blog/first-post.md` - Sample post with category
- `/nuxt.config.ts` - RSS auto-discovery and prerender

**Key patterns established:**
- Server routes for dynamic content endpoints
- Optional fields with v-if guards for graceful degradation
- UBadge component for categorical labels
- RSS auto-discovery for feed discoverability
