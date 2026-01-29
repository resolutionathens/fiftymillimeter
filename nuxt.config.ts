// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Cloudflare Workers deployment with dev bindings support
  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
    prerender: {
      routes: ['/rss.xml']
    }
  },
  // Enable static site generation
  ssr: true,
  modules: ['nitro-cloudflare-dev', '@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@nuxt/ui', '@nuxt/fonts', '@nuxt/content'],

  // Font configuration
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Inconsolata', provider: 'google' }
    ]
  },
  
  css: ['~/assets/main.css'],

  // Nuxt Content configuration
  content: {
    database: {
      type: 'libsql',
      url: 'file:.data/content.db'
    }
  },

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
    // Stripe server-side secrets
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    // Public variables (available to client-side)
    public: {
      cloudflareR2PublicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
      siteUrl: process.env.NUXT_SITE_URL || 'https://fiftymillimeter.pages.dev',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
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
        { property: 'og:url', content: 'https://fiftymillimeter.com' },
        { property: 'og:image', content: 'https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Fiftymillimeter Blog RSS Feed', href: '/rss.xml' }
      ]
    }
  }
})