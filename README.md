# Photography Portfolio

A modern photography portfolio built with Nuxt 4, showcasing photo collections with Cloudflare R2 integration and optimized image delivery.

**Live Example**: [fiftymillimeter.com](https://fiftymillimeter.com)

## Features

- **Modern Stack**: Nuxt 4 with Vue 3 and TypeScript
- **Cloud Integration**: Cloudflare R2 for image storage with Workers bindings
- **Image Optimization**: Cloudflare Image Transformations with responsive srcsets and modern formats (WebP/AVIF)
- **UI Components**: Nuxt UI v3 and Nuxt UI Pro v3 component libraries
- **Responsive Design**: Tailwind CSS with custom color scheme (sky/slate)
- **Icons**: Heroicons integration for consistent iconography
- **EXIF Processing**: Image metadata extraction with exifr
- **Deployment**: Cloudflare Workers with Wrangler v4

## Setup

Install dependencies with Bun (recommended):

```bash
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Environment Variables

Configure the following environment variables:

```env
# Cloudflare R2 Storage
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_PUBLIC_URL=https://your-domain.r2.dev

# Site Configuration
NUXT_SITE_URL=https://your-domain.com
```

## Cloudflare Setup Requirements

For image transformations to work properly, configure these settings in your Cloudflare dashboard:

### Images > Transformations
1. Enable transformations for your zone
2. Enable **"Resize images from any origin"** OR add your R2 domain as an allowed origin
3. Ensure SSL/TLS mode is set to **"Full (strict)"**

### R2 Configuration
- Configure R2 bucket bindings in `wrangler.jsonc`
- Set up public R2 URLs for image access

## Build & Deployment

### Production Build
```bash
bun run build
```

### Static Generation
```bash
bun run generate
```

### Deploy to Cloudflare Workers
```bash
bun run deploy
```

### Deploy Preview Version
```bash
bun run deploy:preview
```

## Project Structure

```
├── app/                    # Nuxt 4 app directory
│   ├── pages/             # Vue pages with file-based routing
│   ├── components/        # Reusable Vue components (AppHeader, CollectionCard, ImageGallery)
│   ├── layouts/           # Layout components
│   └── app.config.ts      # UI configuration (color scheme)
├── server/                # Server-side code
│   ├── api/               # API routes for R2 integration
│   └── utils/             # R2 utilities and gallery config
├── public/                # Static assets
├── wrangler.jsonc         # Cloudflare Workers configuration
└── CLAUDE.md              # AI development guidance
```

## API Endpoints

- `GET /api/collections` - List all photo collections from R2
- `GET /api/images/[collection]` - Get images for a specific collection

## Code Quality

Lint your code:
```bash
npx eslint .
```

## Architecture

The application uses Cloudflare R2 for image storage with Workers bindings:
- Images organized in root-level collection folders in R2 bucket
- Server API routes handle R2 communication using native Workers bindings
- Collections auto-discovered from R2 folder structure via `listR2Collections`
- Images served through Cloudflare CDN with optimized delivery and transformations
- Cloudflare Image Transformations provide responsive images with automatic WebP/AVIF conversion
- R2 bucket binding configured in `wrangler.jsonc`

## Deployment

Built for Cloudflare Workers with:
- **Wrangler v4**: Configuration in `wrangler.jsonc`
- **R2 Integration**: Native Workers bindings for optimal performance
- **Static Generation**: SSR with static site generation capabilities
- **Asset Handling**: Optimized public asset delivery