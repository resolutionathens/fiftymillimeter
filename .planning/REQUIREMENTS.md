# Requirements: fiftymillimeter Blog

**Defined:** 2026-01-29
**Core Value:** Visitors can read posts about photography experiences and see the images that go with them.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Setup

- [x] **SETUP-01**: Nuxt Content module installed and configured ✓
- [x] **SETUP-02**: Blog route registered at `/blog` ✓

### Content

- [ ] **CONT-01**: Blog index page displays posts in reverse chronological order
- [ ] **CONT-02**: Individual post pages render markdown with images
- [ ] **CONT-03**: Posts support frontmatter (title, date, category, description)
- [ ] **CONT-04**: Images embedded in posts display correctly

### Organization

- [ ] **ORG-01**: Posts can be assigned to a category
- [ ] **ORG-02**: Category displayed on post listing and individual posts

### Distribution

- [ ] **DIST-01**: RSS feed available at `/blog/rss.xml` or similar

### Navigation

- [ ] **NAV-01**: Blog link added to site header

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

(None identified)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Comments | Keep blog simple and read-only |
| Search | Small blog, chronological browsing sufficient |
| Archive page | Chronological listing serves this purpose |
| Tags | Categories are enough for organization |
| Blog images from R2 | Images live with markdown content for simplicity |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 | Phase 1 | Complete |
| SETUP-02 | Phase 1 | Complete |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| ORG-01 | Phase 3 | Pending |
| ORG-02 | Phase 3 | Pending |
| DIST-01 | Phase 3 | Pending |
| NAV-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-29*
*Last updated: 2026-01-29 after roadmap creation*
