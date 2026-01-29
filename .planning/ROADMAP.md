# Roadmap: fiftymillimeter Blog

## Overview

Add a markdown-based blog to the existing photography portfolio using Nuxt Content. Three phases deliver the complete blog feature: foundation setup (Phase 1), content display pages (Phase 2), and full integration with categories, RSS, and navigation (Phase 3). Each phase delivers verifiable user-facing functionality.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Nuxt Content installed and routes configured ✓
- [ ] **Phase 2: Content Display** - Blog index and post pages working
- [ ] **Phase 3: Integration** - Categories, RSS, and navigation complete

## Phase Details

### Phase 1: Foundation
**Goal**: Nuxt Content module integrated and blog routes accessible
**Depends on**: Nothing (first phase)
**Requirements**: SETUP-01, SETUP-02
**Success Criteria** (what must be TRUE):
  1. Nuxt Content module is installed and configured in nuxt.config.ts
  2. Blog route at `/blog` returns 200 status (even if showing placeholder)
  3. Development server runs without errors after Nuxt Content integration
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Install Nuxt Content and create blog route ✓

### Phase 2: Content Display
**Goal**: Visitors can read blog posts and browse chronologically
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. Blog index page at `/blog` displays list of posts in reverse chronological order
  2. Individual post pages at `/blog/[slug]` render markdown content with frontmatter
  3. Images embedded in markdown posts display correctly at appropriate sizes
  4. Post metadata (title, date, description) displays on index and individual pages
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Define blog schema and create sample post
- [ ] 02-02-PLAN.md — Build blog index and post pages

### Phase 3: Integration
**Goal**: Blog fully integrated with site navigation, categories, and RSS feed
**Depends on**: Phase 2
**Requirements**: ORG-01, ORG-02, DIST-01, NAV-01
**Success Criteria** (what must be TRUE):
  1. Posts can have a category assigned via frontmatter
  2. Category displays on both blog index and individual post pages
  3. RSS feed is accessible at `/blog/rss.xml` with valid XML structure
  4. Blog link appears in site header navigation and routes to `/blog`
**Plans**: TBD

Plans:
- [ ] 03-01: [Plan TBD]

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2026-01-29 |
| 2. Content Display | 0/2 | Not started | - |
| 3. Integration | 0/1 | Not started | - |

---
*Roadmap created: 2026-01-29*
