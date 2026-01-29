# Technology Stack

**Analysis Date:** 2026-01-29

## Languages

**Primary:**
- TypeScript 5.6.3 - Primary language for all source code, server APIs, and utilities
- Vue 3 5.5.17 - Frontend UI framework with composition API

**Secondary:**
- HTML/CSS - Page markup and styling via Tailwind CSS

## Runtime

**Environment:**
- Node.js compatible (deployed on Cloudflare Workers)

**Package Manager:**
- Bun - Primary package manager (evidenced by `bun.lock` file)
- Lockfile: `bun.lock` present

**Run Commands:**
```bash
bun install         # Install dependencies
bun run dev         # Start development server
bun run build       # Build for production
bun run preview     # Preview production build
bun run generate    # Generate static site
bun run deploy      # Deploy to Cloudflare Workers
```

## Frameworks

**Core:**
- Nuxt 4.0.0 - Full-stack Vue 3 framework with SSR and static generation
- Vue Router 4.5.1 - Client-side routing

**UI Components:**
- Nuxt UI v4.2.1 - Base component library with form, navigation, layout, and feedback components
- Nuxt UI Pro v3 - Extended component library with advanced and prose components (licensed via `NUXT_UI_PRO_LICENSE`)

**Styling:**
- Tailwind CSS 4.1.11 - Utility-first CSS framework with `@tailwindcss/vite` integration
- Custom color scheme: primary color is `slate`, neutral is `gray` (configured in `app/app.config.ts`)

**Image Optimization:**
- Nuxt Image 1.10.0 - Optimized image delivery with Cloudflare provider
- Image formats: avif, webp with auto format selection
- EXIF metadata: exifr 7.1.3 - Extract and process image metadata

**Fonts:**
- Nuxt Fonts 0.12.1 - Google Fonts provider with Inter and Inconsolata

**Icons:**
- Heroicons via @iconify-json/heroicons 1.2.2 - SVG icon system
- Lucide icons via @iconify-json/lucide 1.2.66

## Key Dependencies

**Critical:**
- stripe 19.2.0 - Server-side payment processing SDK
- @stripe/stripe-js 8.3.0 - Client-side Stripe integration library
- exifr 7.1.3 - Image EXIF data extraction and processing
- xlsx 0.18.5 - Excel/spreadsheet functionality

**Infrastructure:**
- @cloudflare/workers-types 4.20251202.0 - Type definitions for Cloudflare Workers bindings (devDependency)
- nitro-cloudflare-dev 0.2.2 - Cloudflare Workers development bindings
- wrangler 4.51.0 - Cloudflare Workers CLI (devDependency)

**AWS S3 Compatibility (Legacy):**
- @aws-sdk/client-s3 3.862.0 - AWS SDK for S3 compatibility (not currently used; R2 uses native bindings)

## Configuration

**Environment:**
- Nuxt runtime config in `nuxt.config.ts` for server-side secrets and public variables
- Wrangler configuration in `wrangler.jsonc` for Cloudflare Workers deployment settings
- Env file: `.env` for local development secrets

**Key Configurations:**
- `nuxt.config.ts` - Nuxt framework configuration including:
  - Cloudflare Workers preset with `cloudflare-module` Nitro preset
  - Image optimization with Cloudflare provider
  - Fonts from Google
  - Runtime config for secrets (Stripe, R2, Resend)
  - SEO meta tags and social sharing

- `wrangler.jsonc` - Workers deployment configuration:
  - Main entry: `.output/server/index.mjs`
  - Assets directory: `.output/public`
  - R2 bucket binding: `R2_BUCKET` (production: `fiftymillimeter`, preview: `fiftymillimeter-dev`)
  - D1 SQLite database binding: `DB` (database ID: `5fe31ff8-4d07-4987-add7-a188ab6061bf`)
  - Environment variables: `NUXT_SITE_URL`, `CLOUDFLARE_R2_PUBLIC_URL`, `STRIPE_PUBLISHABLE_KEY`

- `app.config.ts` - Nuxt UI configuration with color scheme

- `tsconfig.json` - TypeScript references to Nuxt-generated type files

## Build & Deployment

**Build System:**
- Nuxt build command generates output to `.output/` directory
- Preset: Cloudflare Workers with static site generation capabilities
- SSR enabled with optimization for edge computing

**Deployment:**
- Target: Cloudflare Workers (edge computing platform)
- Build output: Compiled server entry point at `.output/server/index.mjs`
- Static assets: Served from `.output/public` via ASSETS binding
- Environment: Compatibility date 2025-06-05 for Cloudflare runtime

**Linting & Code Quality:**
- ESLint 9.0.0 with @nuxt/eslint 1.5.2 - Code linting
- Config: `eslint.config.mjs`

## Platform Requirements

**Development:**
- Bun (modern JavaScript runtime and package manager)
- Node.js types for TypeScript support
- Cloudflare account for local Workers bindings via `nitro-cloudflare-dev`

**Production:**
- Cloudflare Workers platform (edge computing deployment)
- Cloudflare R2 bucket for image storage
- Cloudflare D1 SQLite database for order data and product inventory
- Stripe account for payment processing
- Resend account for email delivery

---

*Stack analysis: 2026-01-29*
