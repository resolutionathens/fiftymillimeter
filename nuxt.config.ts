// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Optimize for Cloudflare Workers deployment
  nitro: {
    preset: 'cloudflare'
  },
  // Enable static site generation
  ssr: true,
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@nuxt/ui', '@nuxt/ui-pro'],
  
  css: ['~/assets/main.css'],

  // Image optimization for R2 integration
  image: {
    providers: {
      cloudflare: {
        name: 'cloudflare',
        provider: 'cloudflare',
        options: {
          baseURL: process.env.CLOUDFLARE_R2_PUBLIC_URL
        }
      }
    },
    domains: [],
    alias: {}
  },
  // Runtime config for environment variables
  runtimeConfig: {
    // Server-side environment variables
    cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareAccessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    cloudflareSecretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    cloudflareR2BucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    cloudflareR2Endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    // Public variables (available to client-side)
    public: {
      cloudflareR2PublicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
      siteUrl: process.env.NUXT_SITE_URL || 'https://fiftymillimeter.pages.dev'
    }
  },
  // SEO and meta optimization
  app: {
    head: {
      title: 'Fifty Millimeter - Photography Portfolio',
      meta: [
        { name: 'description', content: 'Professional photography portfolio showcasing stunning visuals and artistic vision' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Fifty Millimeter - Photography Portfolio' },
        { property: 'og:description', content: 'Professional photography portfolio showcasing stunning visuals and artistic vision' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})