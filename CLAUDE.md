# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 photography portfolio application using TypeScript, Vue 3, and Cloudflare integration. It showcases photo collections stored in Cloudflare R2 with optimized delivery and static site generation.

**Key Technologies:**
- **Framework**: Nuxt 4 with Vue 3 and TypeScript
- **Styling**: Nuxt UI component library with Tailwind CSS
- **Cloud Storage**: Cloudflare R2 for image storage with AWS SDK
- **Image Processing**: Nuxt Image with Cloudflare provider
- **Deployment**: Cloudflare Pages with static generation
- **EXIF Processing**: exifr library for image metadata

## Development Commands

```bash
# Install dependencies
bun install

# Start development server (http://localhost:3000)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Generate static site
bun run generate

# Deploy to Cloudflare Pages
bun run deploy

# Deploy preview version
bun run deploy:preview

# Lint code
npx eslint .
```

## Architecture Overview

### Cloud Storage Integration
The application integrates with Cloudflare R2 for image storage using a structured approach:
- Images are organized in `gallery/{collection}/` folders in R2
- Server API routes (`/server/api/`) handle R2 communication using AWS SDK
- Collections are auto-discovered from R2 folder structure
- Images are served through Cloudflare's CDN with public URLs

### API Architecture
- `collections.get.ts`: Lists all photo collections from R2 bucket prefixes
- `images/[collection].get.ts`: Fetches images for a specific collection
- `images/index.get.ts`: General image API endpoint
- All APIs use S3Client with Cloudflare R2 endpoint configuration

### Frontend Structure
- **Pages**: Standard Nuxt 4 app directory structure with Vue 3 composition API
- **Components**: Reusable Vue components for galleries and image display
- **Layouts**: Default layout wrapping pages with NuxtLayout
- **SEO**: Built-in meta tag management with useSeoMeta

### Environment Configuration
Critical environment variables for Cloudflare integration:
- `CLOUDFLARE_R2_*`: R2 storage credentials and endpoints
- `NUXT_SITE_URL`: Site URL for SEO and og:image
- Runtime config separates server-side secrets from public variables

### Static Generation
- Configured for Cloudflare Pages preset (`nitro.preset: 'cloudflare-pages'`)
- SSR enabled with static generation capabilities
- Public folder includes `_headers` and `_redirects` for Cloudflare Pages deployment

### Image Optimization
- Nuxt Image module configured with Cloudflare provider
- Images served from `CLOUDFLARE_R2_PUBLIC_URL` environment variable
- EXIF data processing capabilities with exifr library

## Package Manager

This project uses Bun as the package manager (evidenced by `bun.lock` file). All development commands should use `bun` rather than npm, yarn, or pnpm.

## Environment Variables

The following environment variables are required for the application to function properly:

### Cloudflare R2 Storage
- `CLOUDFLARE_R2_ACCESS_KEY_ID`: R2 access key ID
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: R2 secret access key  
- `CLOUDFLARE_R2_BUCKET_NAME`: Name of the R2 bucket containing images
- `CLOUDFLARE_R2_ACCOUNT_ID`: Cloudflare account ID
- `CLOUDFLARE_R2_PUBLIC_URL`: Public URL for R2 bucket (e.g., `https://your-domain.r2.dev`)

### Site Configuration
- `NUXT_SITE_URL`: Base URL of the site for SEO and og:image generation

## Deployment

The application is configured for deployment to Cloudflare Pages:
- Uses `cloudflare-pages` preset in Nitro configuration
- Includes `_headers` and `_redirects` files in public folder
- Supports both static generation and SSR
- Deploy commands available: `bun run deploy` and `bun run deploy:preview`