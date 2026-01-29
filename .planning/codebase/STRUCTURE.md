# Codebase Structure

**Analysis Date:** 2026-01-29

## Directory Layout

```
fiftymillimeter/
├── app/                          # Nuxt app directory (frontend)
│   ├── assets/
│   │   └── main.css             # Global Tailwind + Nuxt UI imports
│   ├── components/              # Reusable Vue components
│   │   ├── AppHeader.vue        # Navigation header with menu
│   │   ├── AppFooter.vue        # Footer component
│   │   ├── ImageGallery.vue     # Gallery viewer (grid/single view, modal, touch nav)
│   │   ├── CollectionCard.vue   # Collection preview card
│   │   └── shop/
│   │       └── CheckoutForm.vue # Stripe payment form with address collection
│   ├── layouts/
│   │   └── default.vue          # Default layout wrapper (header + slot + footer)
│   ├── pages/                   # Route pages
│   │   ├── index.vue            # Home (random featured image)
│   │   ├── about.vue            # About page
│   │   ├── galleries/
│   │   │   ├── index.vue        # Collections listing
│   │   │   └── [collection].vue # Dynamic collection gallery
│   │   └── shop/
│   │       ├── index.vue        # Product page with checkout form
│   │       └── success.vue      # Order confirmation page
│   └── app.vue                  # Root app component (NuxtLayout + NuxtPage)
│
├── server/                       # Nuxt server/backend code
│   ├── api/                     # Event handlers (API routes)
│   │   ├── collections.get.ts   # GET /api/collections
│   │   ├── image.get.ts         # GET /api/image (image transformation proxy)
│   │   ├── images/
│   │   │   ├── index.get.ts     # GET /api/images
│   │   │   └── [collection].get.ts # GET /api/images/[collection]
│   │   └── shop/
│   │       ├── product.get.ts   # GET /api/shop/product
│   │       ├── checkout.post.ts # POST /api/shop/checkout
│   │       ├── order/
│   │       │   └── [paymentIntentId].get.ts # GET /api/shop/order/[id]
│   │       └── webhooks/
│   │           └── stripe.post.ts # POST /api/shop/webhooks/stripe
│   ├── utils/                   # Utility functions
│   │   ├── r2-dynamic.ts        # R2 bucket operations (listR2Collections, listR2Images)
│   │   ├── email.ts             # Email template and Resend API integration
│   │   └── gallery-config.ts    # Static gallery configuration (placeholder)
│   └── database/                # Database schema (reference, D1 not queried directly)
│
├── public/                       # Static assets (favicon, etc.)
│
├── nuxt.config.ts               # Nuxt configuration (SSR, modules, image provider, runtime config)
├── wrangler.jsonc               # Cloudflare Workers config (R2 binding, D1 binding, assets)
├── tsconfig.json                # TypeScript config (references auto-generated .nuxt configs)
├── package.json                 # Project dependencies and scripts
├── eslint.config.mjs            # ESLint configuration
└── CLAUDE.md                    # Development guide

Generated/Built (committed to .gitignore):
├── .nuxt/                       # Auto-generated Nuxt configuration
├── .output/                     # Production build output
├── .wrangler/                   # Local Wrangler state
└── dist/                        # Symlink to .output/public
```

## Directory Purposes

**app/:**
- Purpose: Frontend Nuxt application code
- Contains: Pages, components, layouts, global styles
- Key responsibility: Define UI and client-side behavior

**app/components/:**
- Purpose: Reusable Vue 3 components
- Contains: Generic UI widgets (ImageGallery, CollectionCard, forms)
- Pattern: Props-driven, typed with TypeScript interfaces
- Organization: Features grouped in subdirectories (shop/)

**app/pages/:**
- Purpose: Route-based pages (auto-routed by Nuxt file-based routing)
- Contains: Full-page components with data fetching
- Pattern: Use `await useFetch()` during SSR, render different states (pending, error, success)
- Dynamic routes: Filenames with brackets (e.g., `[collection].vue`) create dynamic routes

**app/layouts/:**
- Purpose: Wrapper layouts applied to pages
- Contains: Default layout with header/footer and slot for page content
- Usage: Applied automatically based on `definePageMeta()` or `<NuxtLayout>` in app.vue

**server/api/:**
- Purpose: Backend API route handlers (Nitro event handlers)
- Contains: HTTP endpoint implementations
- Pattern: File-based routing matching HTTP method (e.g., `collections.get.ts` → GET /api/collections)
- Dynamic routes: Bracketed directory names (e.g., `[collection].get.ts`) capture URL parameters
- Bindings: Access Cloudflare services via `event.context.cloudflare.env`

**server/utils/:**
- Purpose: Reusable backend utility functions
- Contains: R2 interactions, email sending, configuration
- Imported by: API handlers to avoid business logic duplication
- Pattern: Pure functions or async functions returning domain objects

**public/:**
- Purpose: Static files served at root (favicon, robots.txt, etc.)
- Served by: Cloudflare Workers ASSETS binding
- Not auto-copied; manually managed

## Key File Locations

**Entry Points:**
- `app/app.vue`: Root component wrapping layout and pages
- `nuxt.config.ts`: Nitro preset, modules, SSR settings, runtime config
- `wrangler.jsonc`: Cloudflare Workers configuration, bindings

**Configuration:**
- `app/app.config.ts`: Nuxt UI color theme (slate primary, gray neutral)
- `app/assets/main.css`: Tailwind imports, global font overrides
- `nuxt.config.ts`: Image provider (Cloudflare), font families, runtime secrets
- `.env` and `.dev.vars`: Local environment variables for development

**Core Logic:**
- `server/utils/r2-dynamic.ts`: Gallery discovery and image listing
- `server/api/collections.get.ts`: Collection API (calls r2-dynamic)
- `server/api/images/[collection].get.ts`: Image listing API
- `app/components/ImageGallery.vue`: Main gallery viewer with pagination and modal

**Shop/Commerce:**
- `server/api/shop/checkout.post.ts`: Stripe PaymentIntent creation
- `server/api/shop/webhooks/stripe.post.ts`: Webhook handler (order creation, email)
- `app/components/shop/CheckoutForm.vue`: Stripe Elements integration (payment + address)
- `server/utils/email.ts`: Order confirmation email template and sending

**Testing:**
- No test files present in codebase (not found in `app/` or `server/`)

## Naming Conventions

**Files:**
- API routes: `[name].[METHOD].ts` (e.g., `checkout.post.ts`, `product.get.ts`)
- Dynamic API routes: `[paramName].get.ts` (e.g., `[collection].get.ts`)
- Pages: PascalCase for components (Vue), route name in filename (e.g., `[collection].vue` for `/galleries/[collection]`)
- Utilities: camelCase, descriptive names (e.g., `r2-dynamic.ts`, `sendOrderConfirmationEmail()`)

**Directories:**
- Feature-based grouping in `app/pages/` (e.g., `shop/`, `galleries/`)
- API endpoints organized by feature (e.g., `shop/`, `images/`)
- Component categorization by feature (e.g., `components/shop/`)

**TypeScript:**
- Interfaces for props/data: PascalCase (e.g., `OrderEmailData`, `Props`)
- Functions: camelCase (e.g., `listR2Collections()`, `sendOrderConfirmationEmail()`)
- Constants: UPPER_SNAKE_CASE (e.g., `includedFolders`, `displayNameOverrides`)
- Vue reactive: ref, computed, watch (lowercase function names)

**Vue Components:**
- Single File Components (.vue) use PascalCase file names
- Script setup syntax with TypeScript (`<script setup lang="ts">`)
- Props defined with `defineProps<Props>()`; emits with `defineEmits<{ event: [type] }>()`
- Composition API: functions/composables start with `use` prefix (e.g., `useFetch`, `useRoute`)

## Where to Add New Code

**New Gallery Collection:**
1. Add folder to R2 bucket (e.g., `mytrip/`)
2. Add folder name to `includedFolders` array in `server/utils/r2-dynamic.ts`
3. (Optional) Add display name override in `displayNameOverrides` map in same file
4. No code changes needed; `listR2Collections()` auto-discovers via R2 bucket.list()

**New Page:**
1. Create file in `app/pages/` (e.g., `contact.vue`)
2. Add route link in `AppHeader.vue` navigation menu
3. Implement template, script setup, SEO meta via `useSeoMeta()`

**New Component:**
1. Create `.vue` file in `app/components/` or subdirectory
2. Define Props interface, emits, and composition logic in `<script setup>`
3. Import in parent component; automatically resolved by Nuxt auto-import

**New API Endpoint:**
1. Create file in `server/api/` following `[name].[METHOD].ts` pattern
2. Export default `defineEventHandler(async (event) => { ... })`
3. Access Cloudflare bindings via `event.context.cloudflare.env.[BINDING_NAME]`
4. Return data or throw `createError()` with statusCode/Message
5. Accessible at `GET/POST /api/[name]` automatically

**New Shop Feature:**
1. Add API route in `server/api/shop/[feature].ts`
2. Create form component in `app/components/shop/[Feature].vue`
3. Integrate into page (e.g., `app/pages/shop/index.vue`)
4. Update D1 schema if new database fields needed (reference `server/database/` docs)

**New Utility:**
1. Create function in `server/utils/[name].ts`
2. Export as named export (e.g., `export async function doSomething()`)
3. Import in API handlers as needed

## Special Directories

**`.nuxt/`:**
- Purpose: Auto-generated Nuxt configuration files and build artifacts
- Generated: Yes, by `nuxt build` and `nuxt dev`
- Committed: No (.gitignore)

**.output/:**
- Purpose: Production build output (server bundle + static assets)
- Generated: Yes, by `nuxt build`
- Committed: No (.gitignore)
- Structure: `.output/server/index.mjs` (Cloudflare Workers entry), `.output/public/` (static assets)

**.wrangler/:**
- Purpose: Local Wrangler state (cache, D1 data, R2 data during dev)
- Generated: Yes, by `wrangler dev`
- Committed: No (.gitignore)

**`.planning/codebase/`:**
- Purpose: Architecture and codebase analysis documents
- Generated: No (manually created)
- Committed: Yes
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

## Build & Deployment Locations

**Development:**
- Dev server: `http://localhost:3000` via `bun run dev`
- Hot reload: Changes to `app/` and `server/` trigger rebuild

**Production Build:**
- Command: `bun run build`
- Output: `.output/` directory
- Entry point: `.output/server/index.mjs` (Nitro-generated Cloudflare Workers handler)
- Static assets: `.output/public/` (served via ASSETS binding)

**Deployment:**
- Command: `bun run deploy` (runs `wrangler deploy`)
- Target: Cloudflare Workers (account and API token from wrangler config)
- R2 bucket: `fiftymillimeter` (production) or `fiftymillimeter-dev` (preview)

---

*Structure analysis: 2026-01-29*
