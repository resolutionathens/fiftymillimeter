import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        image: z.string().optional(),
        category: z.string().optional()
      })
    })
  }
})
