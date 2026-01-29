# Architecture

**Analysis Date:** 2026-01-29

## Pattern Overview

**Overall:** Universal SSR + API with Cloudflare Workers hybrid architecture

**Key Characteristics:**
- Full-stack Nuxt 4 application deployed on Cloudflare Workers
- Server-side rendering (SSR) with static generation capabilities
- Event-driven API routes via Nitro handlers bound to Cloudflare services
- Composition API and reactive components with Vue 3
- Direct bindings to Cloudflare R2, D1 Database, and Workers runtime
- Image transformation via Cloudflare's native image service

## Layers

**Presentation Layer (Client):**
- Purpose: Render interactive Vue 3 components with client-side state and navigation
- Location: `app/pages/`, `app/components/`
- Contains: Page components (galleries, shop, homepage), reusable UI components (ImageGallery, CheckoutForm, AppHeader)
- Depends on: Runtime config (public), API routes via `$fetch()` and `useFetch()`, Nuxt UI component library
- Used by: Browser clients via routes

**API/Server Layer:**
- Purpose: Handle business logic, authentication with Stripe/Resend, and data transformation
- Location: `server/api/`
- Contains: Event handlers organized by feature (collections.get.ts, images/[collection].get.ts, shop/checkout.post.ts, shop/webhooks/stripe.post.ts)
- Depends on: Cloudflare bindings (R2_BUCKET, DB), environment configuration, utility functions
- Used by: Presentation layer via HTTP requests, Stripe webhooks

**Data Access Layer:**
- Purpose: Abstract cloud storage and database interactions behind utility functions
- Location: `server/utils/`
- Contains: R2 bucket operations (`r2-dynamic.ts`), email delivery (`email.ts`), configuration (`gallery-config.ts`)
- Depends on: Cloudflare Workers types, native R2Bucket and D1Database bindings
- Used by: API handlers

**Styling & Configuration:**
- Purpose: Global styles, component theming, and app configuration
- Location: `app/assets/main.css`, `app/app.config.ts`, `nuxt.config.ts`
- Contains: Tailwind CSS imports, Nuxt UI theme overrides (slate primary, gray neutral), font configuration
- Depends on: Tailwind CSS, @nuxt/ui
- Used by: All pages and components

## Data Flow

**Gallery Display Flow:**

1. User navigates to `/galleries` (page `app/pages/galleries/index.vue`)
2. Page calls `useFetch('/api/collections')` during SSR/hydration
3. API handler `server/api/collections.get.ts` is invoked
4. Handler accesses `event.context.cloudflare.env.R2_BUCKET` (Workers binding)
5. `listR2Collections()` from `server/utils/r2-dynamic.ts` queries R2 bucket delimitedPrefixes
6. Returns collection metadata (name, displayName, imageCount, coverImage URL)
7. Page renders `CollectionCard` components in grid layout
8. User clicks collection → navigates to `/galleries/[collection]`
9. Dynamic page `app/pages/galleries/[collection].vue` fetches images via `/api/images/[collection]`
10. API handler lists R2 objects, filters to image files
11. Component renders `ImageGallery` with pagination, grid/single view toggle

**Shop Checkout Flow:**

1. User navigates to `/shop` (page `app/pages/shop/index.vue`)
2. Page fetches product data via `/api/shop/product` (returns from D1 database)
3. Displays product details, stock status, carousel of preview images
4. User fills `CheckoutForm` component with email/name
5. Form calls `POST /api/shop/checkout` with customer data
6. Handler queries D1 for product, creates Stripe PaymentIntent
7. Returns clientSecret to frontend
8. Frontend initializes Stripe Elements (payment + address fields)
9. User submits payment → `stripe.confirmPayment()` API call
10. Stripe webhook (`/api/shop/webhooks/stripe.post`) receives `payment_intent.succeeded`
11. Handler verifies signature, creates order in D1, decrements stock
12. Handler calls `sendOrderConfirmationEmail()` via Resend API
13. Frontend redirected to `/shop/success?payment_intent={id}`

**Image Transformation Flow:**

1. Components use `<NuxtImg>` tag pointing to R2 URLs
2. Nuxt Image module is configured with Cloudflare provider
3. Image URLs are transformed via `nuxt.config.ts` cloudflare config
4. Cloudflare automatically applies format (avif/webp), quality, resizing
5. `server/api/image.get.ts` provides fallback transformation with format negotiation via Accept headers

**State Management:**

- Component-level: Vue 3 `ref()` and `computed()` for local state (viewMode, pagination, loading states)
- Route-level: URL query parameters for pagination (e.g., `?p=2` for page number)
- Server-level: Cloudflare KV or D1 for orders/products (not client-persisted)
- No global state management library (Pinia/Vuex) — pattern is SSR-friendly single-page reactivity

## Key Abstractions

**R2 Collections Abstraction:**
- Purpose: Hide Cloudflare R2 bucket structure complexity, auto-discover collections from folder prefixes
- Examples: `server/utils/r2-dynamic.ts` exports `listR2Collections()` and `listR2Images()`
- Pattern: Async functions that abstract R2 bucket.list() API, map R2Objects to application domain objects (Collection, Image)
- Filter logic: `includedFolders` array restricts which folders appear in galleries; `isImageFile()` regex filters by extension

**Payment Processing Abstraction:**
- Purpose: Separate Stripe API integration from business logic
- Examples: `server/api/shop/checkout.post.ts` creates PaymentIntent; `server/api/shop/webhooks/stripe.post.ts` handles webhook validation
- Pattern: Use Stripe.js SDK for client-side element mounting; webhook signature verification with `stripe.webhooks.constructEventAsync()`

**Email Delivery Abstraction:**
- Purpose: Template HTML emails and send via Resend API without React SDK
- Examples: `server/utils/email.ts` exports `sendOrderConfirmationEmail()`
- Pattern: Construct HTML template string with inline styles, use fetch() directly (Resend SDK has React peer dependency incompatible with Workers)

**Gallery Components Abstraction:**
- Purpose: Encapsulate UI complexity (pagination, view modes, touch navigation, preloading)
- Examples: `app/components/ImageGallery.vue` handles grid/single view toggle, modal navigation, keyboard/touch/swipe controls
- Pattern: Props-driven (images array, defaultView), emits events, manages internal page state with URL sync

## Entry Points

**Web Server Entry Point:**
- Location: `nuxt.config.ts` + `wrangler.jsonc`
- Triggers: HTTP requests routed by Cloudflare Workers
- Responsibilities: Initialize Nuxt SSR, serve assets, delegate to API routes

**API Route Entry Points:**
- `GET /api/collections` → `server/api/collections.get.ts` — List all photo collections
- `GET /api/images/[collection]` → `server/api/images/[collection].get.ts` — List images in collection
- `POST /api/shop/checkout` → `server/api/shop/checkout.post.ts` — Initialize Stripe PaymentIntent
- `GET /api/shop/product` → `server/api/shop/product.get.ts` — Fetch product from D1
- `POST /api/shop/webhooks/stripe` → `server/api/shop/webhooks/stripe.post.ts` — Handle Stripe webhook events

**Page Entry Points:**
- `GET /` → `app/pages/index.vue` — Homepage with random featured image
- `GET /galleries` → `app/pages/galleries/index.vue` — Collection listing
- `GET /galleries/[collection]` → `app/pages/galleries/[collection].vue` — Collection gallery view
- `GET /shop` → `app/pages/shop/index.vue` — Product display and checkout
- `GET /shop/success` → `app/pages/shop/success.vue` — Order confirmation

**Middleware/Hooks:**
- Layout: `app/layouts/default.vue` wraps all pages with AppHeader, AppFooter
- No middleware guards; route protection handled by Stripe client-side validation

## Error Handling

**Strategy:** Exception-based with HTTP status codes

**Patterns:**

- API handlers throw `createError()` with statusCode and statusMessage
- Client pages test `error.value` from `useFetch()` and render error UI (e.g., "Collection Not Found" with 404)
- Image loading failures in `ImageGallery` show spinner; successful load toggles `isImageLoading` state
- Stripe payment errors captured in `CheckoutForm.error` ref and displayed in UAlert
- Webhook verification failures (bad signature) throw 400 error early; database errors logged but not thrown (order still recorded)
- Network failures on API calls surface via `$fetch()` catch block with `.data?.message` or `.message` fallback

## Cross-Cutting Concerns

**Logging:**
- Console.error() and console.log() in API handlers (visible in Wrangler dev logs and production logs)
- No structured logging library; errors logged at point of occurrence (e.g., webhook signature failure, stock decrement failure)

**Validation:**
- Form validation: Vue component level via Nuxt UI form components (required attrs, email type)
- API validation: Parameter checking (collection slug, email format) with 400 errors
- Stripe validation: Client-side Stripe Elements validation; webhook signature verification on server
- Image validation: File extension regex in `isImageFile()` function

**Authentication:**
- No session/JWT system
- Stripe webhook signature verification via `stripe.webhooks.constructEventAsync(signature, body, webhookSecret)`
- Stripe public key in runtime config (public), secret key in environment (private)
- No user accounts; each checkout creates ephemeral order record in D1

**Rate Limiting:**
- Not implemented; relies on Cloudflare Workers default limits
- Stripe rate limits handled by SDK

---

*Architecture analysis: 2026-01-29*
