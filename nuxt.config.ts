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

  // Image optimization with Cloudflare transformations
  image: {
    format: ['avif', 'webp'],
    provider: 'cloudflare',
    cloudflare: {
      baseURL: 'https://fiftymillimeter.com',
      modifiers: {
        format: 'auto'
      }
    },
    domains: ['pub-77d2c63f12a143a59270d491959246da.r2.dev'],
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
      title: 'Fiftymillimeter - Photography Portfolio',
      meta: [
        { name: 'description', content: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Fiftymillimeter - Photography Portfolio' },
        { property: 'og:description', content: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.' },
        { property: 'og:image', content: 'https://fiftymillimeter.com/cdn-cgi/image/f=auto,w=1200,h=630/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})