# Requirements: fiftymillimeter Blog

**Defined:** 2026-01-29
**Core Value:** Visitors can read posts about photography experiences and see the images that go with them.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Setup

- [x] **SETUP-01**: Nuxt Content module installed and configured ✓
- [x] **SETUP-02**: Blog route registered at `/blog` ✓

### Content

- [x] **CONT-01**: Blog index page displays posts in reverse chronological order ✓
- [x] **CONT-02**: Individual post pages render markdown with images ✓
- [x] **CONT-03**: Posts support frontmatter (title, date, category, description) ✓
- [x] **CONT-04**: Images embedded in posts display correctly ✓

### Organization

- [x] **ORG-01**: Posts can be assigned to a category ✓
- [x] **ORG-02**: Category displayed on post listing and individual posts ✓

### Distribution

- [x] **DIST-01**: RSS feed available at `/rss.xml` ✓

### Navigation

- [x] **NAV-01**: Blog link added to site header ✓

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
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| ORG-01 | Phase 3 | Complete |
| ORG-02 | Phase 3 | Complete |
| DIST-01 | Phase 3 | Complete |
| NAV-01 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-29*
*Last updated: 2026-01-29 after roadmap creation*
