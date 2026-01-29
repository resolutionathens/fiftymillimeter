# Codebase Concerns

**Analysis Date:** 2026-01-29

## Tech Debt

**Hardcoded Product IDs and Limited Product Management:**
- Issue: Product functionality is hardcoded to a single product `'zine-athens-rainforest'` across multiple files
- Files: `server/api/shop/product.get.ts`, `server/api/shop/checkout.post.ts`, `server/api/shop/webhooks/stripe.post.ts`, `app/pages/shop/index.vue`
- Impact: Adding new products requires changes to multiple endpoints and API routes. No abstraction for multi-product support despite having a database setup
- Fix approach: Create a product configuration service that queries database for products, remove hardcoded product IDs, make shop system product-agnostic

**Exposed Secret Keys in Configuration:**
- Issue: Live Stripe API keys (publishable and secret) are exposed in `wrangler.jsonc` as plaintext vars
- Files: `wrangler.jsonc` (lines 25-27), `.env` file contains secret keys
- Impact: Secrets are visible in version control history if .env is committed; production keys accessible to anyone with repo access
- Fix approach: Move all secrets to Cloudflare Workers secrets management, remove from wrangler.jsonc, use only environment-based secret injection

**Missing Test Coverage:**
- Issue: Zero test files in codebase despite having critical business logic (payments, orders, email)
- Files: `server/api/shop/checkout.post.ts`, `server/api/shop/webhooks/stripe.post.ts`, `server/utils/email.ts`
- Impact: Payment processing and order fulfillment logic is untested; bugs in Stripe webhook handling could go unnoticed
- Fix approach: Add vitest/Jest setup, write tests for all API endpoints, especially webhook handlers and email generation

**Collection Names Slug Conversion Logic Fragile:**
- Issue: Collection name slug conversion happens independently in multiple places with simple string replacement
- Files: `server/utils/r2-dynamic.ts` (line 34), `app/pages/galleries/[collection].vue` (line 113)
- Impact: If collection names contain special characters beyond basic ASCII, slug conversion may be inconsistent. No validation that slugs match reverse-conversion
- Fix approach: Create shared slug utilities with comprehensive character handling, add validation roundtrip (slug → name → slug)

**Limited Error Messages Expose Details:**
- Issue: Error handling sometimes includes raw error objects or unfiltered exception details in responses
- Files: `server/api/shop/webhooks/stripe.post.ts` (line 44), `server/api/shop/order/[paymentIntentId].get.ts` (lines 36-38)
- Impact: Sensitive technical details could be exposed to clients; error messages in JSON responses may leak system information
- Fix approach: Implement standardized error response formatter that never exposes raw errors to clients, log full errors server-side only

## Security Considerations

**Stripe Webhook Secret Configuration Risk:**
- Risk: Webhook secret stored in `.env` and environment variables without explicit access control
- Files: `server/api/shop/webhooks/stripe.post.ts` (line 6), `.env`
- Current mitigation: Stripe signature verification is implemented (line 39), but secret retrieval could fail silently
- Recommendations: Use Cloudflare Workers secrets instead of env vars, add monitoring for webhook verification failures, implement rate limiting on webhook endpoint

**Order Query Without Authentication:**
- Risk: Order details retrieved by payment intent ID without any authentication or authorization checks
- Files: `server/api/shop/order/[paymentIntentId].get.ts`
- Current mitigation: Assumes client-side trust (knows the payment intent ID)
- Recommendations: Implement session-based order access control, validate that requester matches order email, add audit logging for sensitive order queries

**Unvalidated Shipping Address JSON:**
- Risk: Shipping address stored as JSON string, parsed without schema validation
- Files: `server/api/shop/webhooks/stripe.post.ts` (lines 67-70), `server/api/shop/order/[paymentIntentId].get.ts` (lines 35-39)
- Current mitigation: Try-catch block silently fails parsing
- Recommendations: Use Zod or TypeBox for shipping address validation before storage, validate Stripe shipping object structure

**Email API Key Exposed:**
- Risk: Resend API key in `.env` file in version control
- Files: `.env`, `server/api/shop/webhooks/stripe.post.ts` (line 7)
- Current mitigation: .env file should be in .gitignore but is present in repo
- Recommendations: Rotate exposed API key, ensure .env is in .gitignore, use only Cloudflare secrets

## Performance Bottlenecks

**R2 List Operations Without Pagination Limit Management:**
- Problem: R2 bucket listing uses hardcoded 1000-item limit; if bucket grows beyond this, collections won't appear
- Files: `server/utils/r2-dynamic.ts` (lines 12-14, 79-82, 110-112)
- Cause: No pagination handling for results > 1000 objects
- Improvement path: Implement recursive listing with cursor-based pagination, cache collection metadata, add monitoring for list operation count

**Image Preload Limited to Adjacent Images:**
- Problem: Single view mode preloads only 4 images (next 3 + previous 1); larger galleries may see loading lag
- Files: `app/components/ImageGallery.vue` (lines 271-293)
- Cause: Arbitrary preload window doesn't scale with gallery size or network speed
- Improvement path: Implement adaptive preloading based on device network type, increase preload window for larger galleries

**N+1 Image Count Queries:**
- Problem: Getting image count requires separate R2 list operation per collection during collections listing
- Files: `server/utils/r2-dynamic.ts` (line 29)
- Cause: `getImageCount()` function calls `bucket.list()` for each collection folder
- Improvement path: Get image counts from initial delimited listing result instead of separate queries, cache collection metadata

**Redundant R2 Calls for Public URL:**
- Problem: Public URL retrieved from multiple sources (env, globalThis, process.env) with fallback chain on every request
- Files: `server/api/collections.get.ts` (lines 11-14), `server/api/images/[collection].get.ts` (lines 20-23)
- Cause: No centralized config access; lookups repeated in every handler
- Improvement path: Create R2 config service that's instantiated once, use dependency injection in handlers

## Fragile Areas

**ImageGallery Component Touch Handling:**
- Files: `app/components/ImageGallery.vue` (lines 335-469)
- Why fragile: Complex state management for swipe detection with multiple boolean flags and coordinate tracking; touch handlers exist both in single view and modal with similar logic. Modal swipe handling doesn't prevent default browser scrolling on all cases
- Safe modification: Extract touch handling to composable, test thoroughly on different device types, add comprehensive unit tests for touch sequences
- Test coverage: No tests for touch/swipe navigation; edge cases like pinch-zoom not handled

**Stripe Payment Intent State Management:**
- Files: `server/api/shop/checkout.post.ts`, `server/api/shop/webhooks/stripe.post.ts`
- Why fragile: Payment intent ID passed through client to webhook; no server-side payment intent validation. Client can retry checkout multiple times creating multiple intents
- Safe modification: Implement idempotency keys in checkout endpoint, validate payment intent before webhook processing, limit checkout retries
- Test coverage: No tests for concurrent payment attempts, race conditions between checkout and webhook

**Collection Slug Conversion Edge Cases:**
- Files: `server/utils/r2-dynamic.ts` (line 34), `app/pages/galleries/[collection].vue` (line 113)
- Why fragile: Simple string operations on folder names; doesn't handle Unicode, special characters, or uppercase consistency
- Safe modification: Use comprehensive slug library (slug npm package), validate slug uniqueness, test with international characters
- Test coverage: No tests for slug generation; no validation that generated slugs can round-trip

**Form State Reset in Checkout:**
- Files: `app/components/shop/CheckoutForm.vue`
- Why fragile: Component manages Stripe Elements instance refs, form state, and payment processing state without clear cleanup
- Safe modification: Use composition functions to separate concerns, add explicit cleanup on unmount, test form reset thoroughly
- Test coverage: No tests for form state transitions or error recovery

## Scaling Limits

**R2 Bucket Listing Scalability:**
- Current capacity: 1000 objects per list operation (hardcoded limit)
- Limit: If R2 bucket grows beyond 1000 objects, collection discovery fails silently
- Scaling path: Implement cursor-based pagination in `listR2Collections` and `listR2Images`, cache collection metadata in D1 database with TTL, add batch processing for large buckets

**Database Query Performance:**
- Current capacity: Single product hardcoded; database schema supports only order and product tables
- Limit: Product queries always return fixed product; scaling to multi-product requires schema changes
- Scaling path: Add product listing endpoint with filtering, implement pagination for orders, add database indexes on `stripe_payment_intent_id`

**Image Gallery Memory Usage:**
- Current capacity: All images loaded in single array for pagination
- Limit: Portfolio with >10,000 images could cause client-side memory/performance issues
- Scaling path: Implement server-side pagination in `images/[collection].get.ts`, return paginated results (20-50 images per request), remove client-side pagination

## Dependencies at Risk

**AWS SDK S3 Dependency Unused:**
- Risk: `@aws-sdk/client-s3` v3.862.0 in dependencies but codebase uses Cloudflare R2 bindings only
- Impact: Unnecessary dependency bloat; if S3 API was planned, it's abandoned
- Migration plan: Remove `@aws-sdk/client-s3` from package.json, rely exclusively on Cloudflare Workers R2 bindings

**XLSX Library Only in Export Scripts:**
- Risk: `xlsx` v0.18.5 included as production dependency but only used in `scripts/` folder
- Impact: Adds unnecessary bundle size to deployed app
- Migration plan: Move xlsx to devDependencies, ensure export scripts run separately from build

**Outdated Stripe SDK Version Compatibility:**
- Risk: Stripe SDK v19.2.0 with Nuxt 4 modern setup; SDK may have compatibility issues with Workers environment
- Impact: Email client SDK dependencies in Resend are bypassed (line 107 in email.ts) suggesting SDK incompatibility
- Migration plan: Monitor Stripe SDK releases, test with latest v20+ versions, consider maintaining custom REST client for Workers environment

## Missing Critical Features

**No Rate Limiting on Webhooks:**
- Problem: Stripe webhook endpoint has no rate limiting or replay attack protection
- Blocks: Cannot safely handle webhook redeliveries; no protection against malicious webhook spam
- Recommendation: Implement rate limiting per IP/signature, add webhook event deduplication using event ID

**No Order Fulfillment Status Tracking:**
- Problem: Orders stored as "completed" with no fulfillment workflow
- Blocks: Cannot track shipping status, fulfillment delays, or customer communication
- Recommendation: Add order status enum (pending, processing, shipped, delivered), implement status update endpoint

**No Email Retry or Confirmation Tracking:**
- Problem: Email sending failures are logged but not retried; no way to resend confirmation emails
- Blocks: Customers may never receive order confirmation if Resend API is temporarily unavailable
- Recommendation: Add email queue with retry logic, track email delivery status, implement manual resend endpoint

**No Collection Visibility Management:**
- Problem: All folders in R2 are included in gallery if in hardcoded `includedFolders` list
- Blocks: Cannot publish/unpublish collections, no draft state, no scheduling
- Recommendation: Add collection metadata to database with published flag, implement collection visibility control

**No Product Availability Management:**
- Problem: Stock management exists but only reflects current D1 value; no pre-order, waitlist, or restock notifications
- Blocks: Cannot manage limited edition runs beyond simple stock count
- Recommendation: Add product status field (available, limited, discontinued), implement waitlist signup, notification system

## Test Coverage Gaps

**Payment Processing Workflow:**
- What's not tested: Checkout creation, Stripe webhook handling, order creation, stock decrement, idempotency
- Files: `server/api/shop/checkout.post.ts`, `server/api/shop/webhooks/stripe.post.ts`
- Risk: Race conditions between concurrent payments, webhook reprocessing could duplicate orders, stock could go negative
- Priority: High

**Email Generation and Sending:**
- What's not tested: Email HTML rendering, shipping address formatting, Resend API integration
- Files: `server/utils/email.ts`
- Risk: Malformed HTML emails, unformatted shipping addresses, silent failures if API changes
- Priority: High

**Collection and Image Discovery:**
- What's not tested: R2 listing, collection slug generation, folder filtering, pagination edge cases
- Files: `server/utils/r2-dynamic.ts`, `server/api/collections.get.ts`, `server/api/images/[collection].get.ts`
- Risk: Collections disappearing over 1000 items, invalid slugs breaking gallery links, mock data masking real failures
- Priority: Medium

**Gallery Component Navigation:**
- What's not tested: View mode switching, swipe gestures, keyboard navigation, modal state, image preloading
- Files: `app/components/ImageGallery.vue`
- Risk: Swipe gestures breaking on some devices, modal not closing, image loading indicators stuck
- Priority: Medium

**Form Validation:**
- What's not tested: Checkout form validation, email/name format, Stripe Elements mount/unmount
- Files: `app/components/shop/CheckoutForm.vue`
- Risk: Invalid data sent to Stripe, form state inconsistencies, element initialization failures
- Priority: Medium

---

*Concerns audit: 2026-01-29*
