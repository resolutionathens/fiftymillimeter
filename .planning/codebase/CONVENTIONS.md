# Coding Conventions

**Analysis Date:** 2026-01-29

## Naming Patterns

**Files:**
- Vue components: PascalCase (e.g., `ImageGallery.vue`, `CollectionCard.vue`, `AppHeader.vue`)
- API routes: kebab-case with file-based routing (e.g., `collections.get.ts`, `images/[collection].get.ts`, `shop/checkout.post.ts`)
- Utility modules: camelCase with descriptive names (e.g., `r2-dynamic.ts`, `gallery-config.ts`, `email.ts`)
- Directories: lowercase with hyphens for multi-word names (e.g., `/server/api/`, `/app/components/shop/`)

**Functions:**
- Utility functions: camelCase with action verb prefix (e.g., `listR2Collections()`, `getImageCount()`, `sendOrderConfirmationEmail()`, `formatDisplayName()`)
- Vue methods: camelCase (e.g., `toggleViewMode()`, `openModalAtIndex()`, `nextImage()`, `handleTouchStart()`)
- Event handlers: `handle` prefix for event handlers (e.g., `handleKeydown()`, `handleSubmit()`, `handleTouchMove()`)

**Variables:**
- Local state: camelCase (e.g., `currentPage`, `viewMode`, `isImageLoading`, `touchStartX`)
- Constants: camelCase in lowercase (e.g., `itemsPerPage`, `threshold`, `includedFolders`)
- Ref/computed: camelCase with semantic names (e.g., `currentImage`, `paginatedImages`, `imagesToPreload`)
- Private/internal: prefix with underscore (e.g., `_imageContainer`)

**Types/Interfaces:**
- Interface names: PascalCase (e.g., `ImageData`, `Props`, `Collection`, `OrderEmailData`)
- Type parameters: PascalCase as per TypeScript convention

## Code Style

**Formatting:**
- ESLint configured via `eslint.config.mjs` with Nuxt preset (`@nuxt/eslint`)
- No Prettier configuration file (uses default ESLint formatting)
- Line length: No strict limit enforced
- Indentation: 2 spaces (standard for Vue/Node.js projects)

**Linting:**
- Tool: ESLint 9.0.0 with Nuxt integration
- Config: `/Users/slip/Documents/GitHub/fiftymillimeter/eslint.config.mjs`
- Uses Nuxt's built-in ESLint configuration which enforces Vue 3 composition API best practices
- Run via `npx eslint .`

**Spacing and Structure:**
- Single blank line between logical sections within functions
- Blank line before/after control structures (if/for)
- Trailing commas in multi-line objects/arrays

## Import Organization

**Order:**
1. Vue/Nuxt imports (e.g., `import { ref, computed }`)
2. Third-party imports (e.g., `import Stripe from 'stripe'`, `import type { NavigationMenuItem }`)
3. Relative imports - utilities first, then types
4. Type imports use explicit `import type` keyword

**Example from `ImageGallery.vue` (lines 176-197):**
```typescript
<script setup lang="ts">
interface ImageData { ... }
interface Props { ... }
const props = withDefaults(defineProps<Props>(), { ... })
const route = useRoute()
const router = useRouter()
```

**Path Aliases:**
- No path aliases configured - uses relative imports throughout
- Nuxt auto-imports: Composition API composables (`ref`, `computed`, `watch`, `onMounted`, `onUnmounted`) and Nuxt utilities (`defineEventHandler`, `createError`, `readBody`, etc.)

## Error Handling

**Patterns:**
- Server API routes: Use Nuxt's `createError()` for HTTP errors with statusCode and statusMessage
- Try-catch blocks for async operations with console.error logging
- Validation errors return 400 status code with descriptive messages
- Server configuration errors return 500 status code
- Console.error for error logging (e.g., `console.error('Checkout error:', error)`)
- Error objects checked for statusCode property to distinguish custom vs. system errors

**Example from `checkout.post.ts` (lines 64-75):**
```typescript
catch (error) {
  console.error('Checkout error:', error)
  if (error.statusCode) {
    throw error
  }
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to initialize checkout'
  })
}
```

## Logging

**Framework:** `console` (native browser/Node.js logging)

**Patterns:**
- Log errors with context: `console.error('Error context:', error)`
- No debug logging for successful operations
- Log at operation boundaries (API entry, error conditions, external service calls)

**Examples:**
- `console.error('Error fetching collections:', error)` in `collections.get.ts`
- `console.error('Checkout error:', error)` in `checkout.post.ts`

## Comments

**When to Comment:**
- Complex logic explanations (e.g., swipe threshold calculations, pagination logic)
- Magic numbers with context (e.g., `const threshold = 50; // Minimum swipe distance`)
- Todo/usage guidance (e.g., `// Hidden preload images - uses same NuxtImg to guarantee URL match`)

**JSDoc/TSDoc:**
- Minimal usage - types are preferred for documentation
- No formal JSDoc blocks in current codebase
- Type signatures serve as primary documentation

**Example from `ImageGallery.vue`:**
```typescript
// Initialize page from URL query param
const getInitialPage = () => {
  // ...
}

// Toggle view mode and reset page
const toggleViewMode = () => {
  // ...
}
```

## Function Design

**Size:**
- Small focused functions (10-30 lines typical)
- Longer functions reserved for UI rendering (70+ lines in modal/template sections)
- Private utility functions extracted from components

**Parameters:**
- Use destructuring for object parameters (e.g., `{ email, name }` from request body)
- Props use TypeScript interface with `defineProps<Props>()`
- WithDefaults for component props with default values

**Return Values:**
- Explicit return types via TypeScript interfaces
- Objects for multiple return values (e.g., `{ collections, count }`, `{ success, result }`)
- Null for missing data (e.g., `coverImage: null` in collections)

## Module Design

**Exports:**
- Named exports for utility functions (e.g., `export async function listR2Collections()`)
- Default exports for Nuxt pages and API routes (e.g., `export default defineEventHandler()`)
- Type exports for shared interfaces (e.g., `export interface OrderEmailData {}`)

**Barrel Files:**
- Not used - files import directly from specific modules

**Component Structure:**
- `<template>` block first with structure comments for sections
- `<script setup lang="ts">` block second with interfaces, state, then computed properties, then methods
- No `<style>` blocks (uses Tailwind CSS exclusively)

## Vue 3 Composition API Patterns

**Reactive State:**
- `ref()` for primitive and simple state values
- `computed()` for derived state and performance optimization
- `watch()` for side effects on state changes

**Component Declaration:**
- `<script setup>` syntax (no explicit export default)
- Interfaces defined at top of script block
- Props with `defineProps<Props>()` and type interface
- Emits with `defineEmits<{ eventName: [args] }>()`

**Example from `CollectionCard.vue`:**
```typescript
const isImageLoading = ref(true)

interface Collection {
  name: string
  slug: string
  displayName: string
  coverImage?: string | null
  imageCount?: number
}

interface Props {
  collection: Collection
}

defineProps<Props>()
```

## TypeScript Configuration

**Type Safety:**
- TypeScript 5.6.3
- Strict mode enabled via Nuxt defaults
- Type imports use explicit `import type` keyword
- Vue component types via Vue 3 type definitions
- Cloudflare Workers types via `@cloudflare/workers-types`

## API Response Format

**Consistent Structure:**
- API responses return objects with data and metadata
- Collections endpoint: `{ collections: Array, count: number }`
- Images endpoint: `{ collection: string, images: Array, count: number }`
- Success responses include relevant data
- Error responses use Nuxt's `createError()` with statusCode and message

**Example from `collections.get.ts`:**
```typescript
return {
  collections,
  count: collections.length
}
```

---

*Convention analysis: 2026-01-29*
