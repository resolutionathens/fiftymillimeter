import { listR2Collections } from '../utils/r2-dynamic'

export default defineEventHandler(async (event) => {
  try {
    // Try to access the R2 bucket via Workers binding first
    const bucket = event.context.cloudflare?.env?.R2_BUCKET || 
                   (globalThis as any)?.R2_BUCKET ||
                   (process.env as any)?.R2_BUCKET
    
    // Get public URL from Workers environment variables
    const publicUrl = event.context.cloudflare?.env?.CLOUDFLARE_R2_PUBLIC_URL || 
                      (globalThis as any)?.CLOUDFLARE_R2_PUBLIC_URL ||
                      process.env.CLOUDFLARE_R2_PUBLIC_URL ||
                      'https://pub-77d2c63f12a143a59270d491959246da.r2.dev'
    
    let collections
    
    if (bucket) {
      // Use Workers R2 binding (production/when available)
      collections = await listR2Collections(bucket, publicUrl)
    } else {
      // For local development, return mock collections until proper S3 integration
      collections = [
        {
          name: 'portraits',
          slug: 'portraits',
          displayName: 'Portraits',
          description: 'Portrait photography collection',
          imageCount: 8,
          coverImage: `${publicUrl}/portraits/portrait-1.jpg`
        },
        {
          name: 'landscapes',
          slug: 'landscapes', 
          displayName: 'Landscapes',
          description: 'Landscape photography collection',
          imageCount: 12,
          coverImage: `${publicUrl}/landscapes/landscape-1.jpg`
        }
      ]
    }
    
    return {
      collections,
      count: collections.length
    }
  } catch (error) {
    console.error('Error fetching collections:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch collections from R2'
    })
  }
})