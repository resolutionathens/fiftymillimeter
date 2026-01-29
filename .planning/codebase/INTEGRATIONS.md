# External Integrations

**Analysis Date:** 2026-01-29

## APIs & External Services

**Payment Processing:**
- Stripe - Complete payment solution for e-commerce
  - SDK/Client: `stripe` 19.2.0 (server-side), `@stripe/stripe-js` 8.3.0 (client-side)
  - Auth: `STRIPE_SECRET_KEY` (server), `STRIPE_PUBLISHABLE_KEY` (client)
  - API Version: 2024-11-20.acacia
  - Implementation files:
    - `server/api/shop/checkout.post.ts` - Creates Stripe PaymentIntents
    - `server/api/shop/webhooks/stripe.post.ts` - Webhook handler for payment_intent.succeeded events
  - Features: Automatic payment methods, receipt email, shipping address collection, payment metadata

**Email Delivery:**
- Resend - Transactional email service
  - API: Direct REST API calls via fetch (no SDK due to React dependency incompatibility with Workers)
  - Auth: `RESEND_API_KEY`
  - Endpoint: `https://api.resend.com/emails`
  - Headers: `Authorization: Bearer {RESEND_API_KEY}`, `Content-Type: application/json`
  - Implementation: `server/utils/email.ts` - sendOrderConfirmationEmail()
  - Features: HTML email templates, order confirmation emails with shipping address display

**Image Processing:**
- Cloudflare Image Optimization - Automatic image transformations
  - Provider: Cloudflare's built-in image optimization service
  - Integration: Nuxt Image module configured with Cloudflare provider
  - Base URL: `https://fiftymillimeter.com`
  - Transformations: Format conversion (avif, webp), auto format selection

**Fonts:**
- Google Fonts - Web font delivery
  - Provider: Google Fonts via Nuxt Fonts module
  - Fonts loaded: Inter (body), Inconsolata (monospace)

**Icons:**
- Iconify - Icon system with JSON icon packages
  - Providers: Heroicons (@iconify-json/heroicons 1.2.2), Lucide (@iconify-json/lucide 1.2.66)
  - Icon prefixes: `i-heroicons-*`, `i-lucide-*`

## Data Storage

**Databases:**

**Cloudflare D1 (SQLite):**
- Type: SQLite serverless database
- Binding: `DB`
- Database ID: `5fe31ff8-4d07-4987-add7-a188ab6061bf`
- Deployment: Remote (production)
- Purpose: E-commerce order and product inventory management
- Tables:
  - `products` - Product catalog with stock tracking (e.g., 'zine-athens-rainforest')
  - `orders` - Order records with customer info, payment reference, shipping details
- Access: Native Cloudflare Workers D1 binding via `event.context.cloudflare.env.DB`
- Implementation:
  - `server/api/shop/checkout.post.ts` - Queries product availability and stock
  - `server/api/shop/webhooks/stripe.post.ts` - Creates order records, decrements stock on successful payment
  - `server/api/shop/order/[paymentIntentId].get.ts` - Retrieves order details

**Object Storage (Images):**
- Cloudflare R2 - Image storage and delivery
  - Binding: `R2_BUCKET`
  - Production bucket: `fiftymillimeter`
  - Preview bucket: `fiftymillimeter-dev`
  - Public URL: `https://cdn.fiftymillimeter.com` (custom domain)
  - Deployment: Remote (production)
  - Organization: Root-level collection folders + root-level images
  - Usage: Photo collections with dynamic discovery
  - Access: Native Cloudflare Workers R2 binding via `event.context.cloudflare.env.R2_BUCKET`
  - Implementation:
    - `server/utils/r2-dynamic.ts` - listR2Collections(), listR2Images(), utility functions
    - `server/api/collections.get.ts` - Auto-discovers collections from R2 folder structure
    - `server/api/images/[collection].get.ts` - Lists images in specific collection
    - `server/api/images/index.get.ts` - General image API endpoint
  - Features: Folder-based organization, image count tracking, cover image extraction, public URL generation

## Authentication & Identity

**Auth Provider:** None - No user authentication system
- No login/registration system
- Public portfolio with restricted functionality (shop is read-only for customers)
- Stripe webhook signatures used for payment validation instead of user auth

## Monitoring & Observability

**Error Tracking:** None detected
- Console logging for development and production errors

**Logs:**
- Browser console (client-side)
- Cloudflare Workers console output
- Server logs via console.error/console.log in API routes

## CI/CD & Deployment

**Hosting:**
- Cloudflare Workers - Edge computing serverless platform
- Cloudflare Pages - Static asset serving (via ASSETS binding)

**CI Pipeline:** None detected
- Manual deployment via Wrangler CLI

**Deployment Commands:**
```bash
bun run deploy              # Production deployment via wrangler deploy
bun run deploy:preview      # Preview deployment via wrangler versions upload
bun run dev:remote          # Local dev with Wrangler: nuxt build && wrangler dev
```

**Deployment Process:**
1. `bun run build` - Builds Nuxt application to `.output/` directory
2. `wrangler deploy` - Deploys to Cloudflare Workers from `.output/server/index.mjs`
3. Static assets served from `.output/public` via ASSETS binding

## Environment Configuration

**Required Environment Variables:**

**Stripe:**
- `STRIPE_SECRET_KEY` - Server-side API key (secret)
- `STRIPE_PUBLISHABLE_KEY` - Client-side API key (public)
- `STRIPE_WEBHOOK_SECRET` - Webhook signature verification secret

**Cloudflare R2:**
- `CLOUDFLARE_R2_PUBLIC_URL` - Public URL for R2 bucket (custom domain: `https://cdn.fiftymillimeter.com`)
- `CLOUDFLARE_R2_BUCKET_NAME` - Bucket name (configured as `fiftymillimeter`)
- `CLOUDFLARE_R2_ACCESS_KEY_ID` - R2 API access key (for S3-compatible API, if used)
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY` - R2 API secret key (for S3-compatible API, if used)
- `CLOUDFLARE_R2_ENDPOINT` - R2 S3-compatible endpoint (for S3 API, if used)
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

**Site Configuration:**
- `NUXT_SITE_URL` - Base URL for SEO (default: `https://fiftymillimeter.pages.dev`)

**Email:**
- `RESEND_API_KEY` - API key for Resend email service

**UI:**
- `NUXT_UI_PRO_LICENSE` - License key for Nuxt UI Pro v3 component library

**Secrets Location:**
- Local development: `.env` file (not committed)
- Cloudflare Workers: Environment variables configured via Wrangler or web dashboard
- Wrangler: Static vars in `wrangler.jsonc` for non-sensitive public variables

## Webhooks & Callbacks

**Incoming Webhooks:**

**Stripe Webhooks:**
- Endpoint: `POST /api/shop/webhooks/stripe`
- Events subscribed: `payment_intent.succeeded`
- Handler: `server/api/shop/webhooks/stripe.post.ts`
- Signature verification: Stripe webhook signature header validation via `stripe.webhooks.constructEventAsync()`
- Actions on success:
  - Check for payment idempotency (existing order with same payment intent ID)
  - Decrement product stock atomically
  - Create order record in D1 database
  - Send order confirmation email via Resend
  - Handle edge case: Stock already sold out after payment succeeds (logs error but doesn't fail)

**Outgoing Webhooks:**
- None detected

**Email Callbacks:**
- Resend API returns success/failure response to order confirmation webhook handler
- Failures logged but do not block order creation

---

*Integration audit: 2026-01-29*
