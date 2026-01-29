# Testing Patterns

**Analysis Date:** 2026-01-29

## Test Framework

**Status:** Not configured

The codebase currently has no automated testing infrastructure:
- No test runner installed (Vitest, Jest, or other)
- No test dependencies in `package.json`
- No test configuration files present
- No test files found in source code

**Scripts Available:**
Only development and deployment scripts are configured. See `package.json` for available commands:
```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run generate   # Generate static site
bun run preview    # Preview production build
bun run deploy     # Deploy to Cloudflare Workers
```

## Recommended Testing Approach

### For Components (Vue 3)

**Recommended Framework:** Vitest with Vue Test Utils

**Setup would look like:**
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageGallery from '@/components/ImageGallery.vue'
```

**Test Areas:**
- Component state management (ref/computed)
- Event handlers and user interactions
- Conditional rendering (v-if, v-show)
- Props validation and prop updates
- Emitted events

### For API Routes (Server)

**Recommended Approach:** Vitest with custom test utilities

**Pattern:**
```typescript
import { describe, it, expect } from 'vitest'
import handler from '@/server/api/collections.get'

describe('API: collections.get', () => {
  it('should return collections from R2 bucket', async () => {
    // Test implementation
  })
})
```

**Test Areas:**
- Error handling and status codes
- Request validation
- Response format consistency
- Fallback behavior (mock data when R2 unavailable)
- Environment variable handling

### For Utilities

**Recommended Approach:** Unit tests with Vitest

**Pattern for R2 utilities:**
```typescript
import { describe, it, expect } from 'vitest'
import { listR2Collections, isImageFile } from '@/server/utils/r2-dynamic'

describe('r2-dynamic utilities', () => {
  it('should filter image files correctly', () => {
    expect(isImageFile('photo.jpg')).toBe(true)
    expect(isImageFile('document.pdf')).toBe(false)
  })
})
```

**Testable Utilities:**
- `isImageFile()` - file type detection logic in `r2-dynamic.ts`
- `formatDisplayName()` - string formatting in `r2-dynamic.ts`
- `sendOrderConfirmationEmail()` - email composition in `email.ts`

## Current Code Structure for Testing

### Components Suitable for Testing

**`ImageGallery.vue` (`/app/components/ImageGallery.vue`, lines 176-490):**
- Paginated gallery with grid and single-image views
- Touch/swipe navigation handlers
- Modal interactions
- Image preloading logic
- State: `viewMode`, `currentPage`, `modalImageIndex`, `isImageLoading`
- Computed: `paginatedImages`, `currentImage`, `imagesToPreload`
- Methods: `toggleViewMode()`, `openModalAtIndex()`, `nextImage()`, `previousImage()`, keyboard handlers

**`CollectionCard.vue` (`/app/components/CollectionCard.vue`, lines 52-68):**
- Simple presentational component
- Image loading state
- Props: `Collection` interface
- State: `isImageLoading`

**`AppHeader.vue` (`/app/components/AppHeader.vue`, lines 1-30):**
- Navigation menu with active state detection
- Computed navigation items based on current route
- Simple and suitable for testing route integration

### API Routes Suitable for Testing

**`collections.get.ts` (`/server/api/collections.get.ts`):**
- Queries R2 bucket for collections
- Fallback to mock data in development
- Error handling with custom error responses
- Returns: `{ collections, count }`

**`images/[collection].get.ts` (`/server/api/images/[collection].get.ts`):**
- Dynamic route parameter handling
- R2 image listing with fallback mock data
- Input validation (collection parameter)
- Returns: `{ collection, images, count }`

**`shop/checkout.post.ts` (`/server/api/shop/checkout.post.ts`):**
- Request body validation (email, name)
- Database queries
- Stripe PaymentIntent creation
- Product stock checking
- Error handling with specific status codes

### Utilities Suitable for Testing

**`r2-dynamic.ts` (`/server/utils/r2-dynamic.ts`):**
- `listR2Collections()` - List collections from R2 with filters
- `listR2Images()` - List images in a collection
- `getImageCount()` - Count images in prefix
- `isImageFile()` - Validate image file extensions
- `formatDisplayName()` - Format folder names for display

**`email.ts` (`/server/utils/email.ts`):**
- `sendOrderConfirmationEmail()` - Email composition and API call
- HTML email template generation
- Shipping address formatting
- Response handling from Resend API

## Testing Gaps and Priorities

### High Priority

**Components:**
- `ImageGallery.vue` - Complex state management with pagination, modal, touch/swipe navigation
- Touch event handling and swipe detection logic
- Keyboard navigation (Arrow keys)

**API Routes:**
- `checkout.post.ts` - Payment workflow, validation, external service integration
- `collections.get.ts` - R2 integration, error states, fallback logic
- `images/[collection].get.ts` - Dynamic routing, collection filtering

**Utilities:**
- `listR2Collections()` - Collection filtering and formatting
- `isImageFile()` - File type detection edge cases
- `sendOrderConfirmationEmail()` - Email API integration

### Medium Priority

**Components:**
- `CollectionCard.vue` - Image loading states, link generation
- `AppHeader.vue` - Route-based active state detection

**API Routes:**
- `shop/product.get.ts` - Product fetching and availability
- Shop order tracking endpoints

### Lower Priority

**Integration:**
- E2E tests for complete user flows (gallery browsing, checkout)
- Visual regression tests for component rendering

## Mock Data Strategy

### For Component Testing

```typescript
// Mock image data for ImageGallery
const mockImages = [
  {
    key: 'test-1.jpg',
    url: 'https://example.com/test-1.jpg',
    name: 'test-1',
    lastModified: new Date(),
    size: 2048000,
    collection: 'test'
  }
]
```

### For API Testing

```typescript
// Mock R2Bucket for API route testing
const mockBucket = {
  list: vi.fn().mockResolvedValue({
    objects: [
      { key: 'test.jpg', size: 2048000, uploaded: new Date() }
    ],
    delimitedPrefixes: ['folder/']
  })
}
```

### For Database Testing

```typescript
// Mock Cloudflare D1 database
const mockDB = {
  prepare: vi.fn().mockReturnValue({
    bind: vi.fn().mockReturnValue({
      first: vi.fn().mockResolvedValue({
        id: 'product-1',
        name: 'Test Product',
        price: 2999,
        stock_quantity: 5
      })
    })
  })
}
```

## Testing Conventions to Follow

When tests are added to this codebase, follow these patterns:

**File Naming:**
- Co-locate with source files: `Component.vue` → `Component.test.ts`
- API routes: `api/collections.get.ts` → `api/collections.get.test.ts`
- Utilities: `utils/r2-dynamic.ts` → `utils/r2-dynamic.test.ts`

**Test Organization:**
```typescript
describe('ComponentName', () => {
  describe('state management', () => {
    it('should initialize with default values', () => {})
  })

  describe('user interactions', () => {
    it('should handle click events', () => {})
  })

  describe('computed properties', () => {
    it('should derive state correctly', () => {})
  })
})
```

**Assertion Style:**
- Use Vitest's expect syntax
- Assertions should be explicit and descriptive
- One primary assertion per test (with setup/helper assertions)

**Example Test Structure:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

describe('ImageGallery', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ImageGallery, {
      props: {
        images: mockImages,
        defaultView: 'grid'
      }
    })
  })

  it('should toggle between grid and single view', async () => {
    expect(wrapper.vm.viewMode).toBe('grid')
    await wrapper.vm.toggleViewMode()
    expect(wrapper.vm.viewMode).toBe('single')
  })
})
```

## External Service Integration Testing

### Stripe Integration

Tests for `shop/checkout.post.ts` should:
- Mock Stripe client initialization
- Mock PaymentIntent creation
- Verify metadata is set correctly
- Test error scenarios (invalid amounts, missing keys)

### Cloudflare R2 Integration

Tests for API routes should:
- Mock R2Bucket operations (list, get)
- Test graceful fallback to mock data
- Verify proper filtering of image files
- Test error handling on API failures

### Email Service Integration

Tests for `email.ts` should:
- Mock Resend API fetch calls
- Verify email HTML template generation
- Test shipping address formatting
- Verify error handling and response parsing

---

*Testing analysis: 2026-01-29*
