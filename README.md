# Photography Portfolio

A modern photography portfolio built with Nuxt 4, showcasing photo collections with Cloudflare R2 integration and optimized image delivery.

## Features

- **Modern Stack**: Nuxt 4 with Vue 3 and TypeScript
- **Cloud Integration**: Cloudflare R2 for image storage and CDN delivery
- **Image Optimization**: Nuxt Image with Cloudflare provider
- **Responsive Design**: Nuxt UI components with Tailwind CSS
- **EXIF Processing**: Image metadata extraction with exifr
- **Static Generation**: Optimized for Cloudflare Pages deployment

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

## Build & Deployment

### Production Build
```bash
bun run build
```

### Static Generation
```bash
bun run generate
```

### Deploy to Cloudflare Pages
```bash
bun run deploy
```

### Deploy Preview
```bash
bun run deploy:preview
```

## Project Structure

```
├── app/                    # Nuxt 4 app directory
│   ├── pages/             # Vue pages with file-based routing
│   ├── components/        # Reusable Vue components
│   └── layouts/           # Layout components
├── server/api/            # Server API routes
│   ├── collections.get.ts # List photo collections
│   └── images/            # Image API endpoints
├── public/                # Static assets
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

The application uses Cloudflare R2 for image storage with a structured approach:
- Images organized in `gallery/{collection}/` folders
- Server API routes handle R2 communication using AWS SDK  
- Collections auto-discovered from R2 folder structure
- Images served through Cloudflare CDN with optimized delivery

Built for Cloudflare Pages with static site generation and SSR capabilities.