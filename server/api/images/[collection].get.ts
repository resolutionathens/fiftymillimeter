import { listR2Images } from '../../utils/r2-dynamic'

export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  
  if (!collection) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Collection parameter is required'
    })
  }
  
  try {
    // Access the R2 bucket via Workers binding - use globalThis for Wrangler dev
    const bucket = event.context.cloudflare?.env?.R2_BUCKET || 
                   (globalThis as Record<string, unknown>)?.R2_BUCKET ||
                   (process.env as Record<string, string | undefined>)?.R2_BUCKET
    
    // Get public URL from Workers environment variables
    const publicUrl = event.context.cloudflare?.env?.CLOUDFLARE_R2_PUBLIC_URL || 
                      (globalThis as Record<string, unknown>)?.CLOUDFLARE_R2_PUBLIC_URL ||
                      process.env.CLOUDFLARE_R2_PUBLIC_URL ||
                      'https://pub-77d2c63f12a143a59270d491959246da.r2.dev'
    
    let images
    
    if (bucket) {
      // Use Workers R2 binding (production/when available)
      images = await listR2Images(bucket, collection, publicUrl)
    } else {
      // For local development, return mock images until proper integration
      const mockImages = Array.from({ length: 6 }, (_, i) => ({
        key: `${collection}/${collection}-${i + 1}.jpg`,
        name: `${collection}-${i + 1}`,
        url: `${publicUrl}/${collection}/${collection}-${i + 1}.jpg`,
        collection,
        size: 2048000 + i * 100000,
        lastModified: new Date()
      }))
      images = mockImages
    }
    
    return {
      collection,
      images,
      count: images.length
    }
  } catch (error) {
    console.error(`Error fetching images from collection ${collection}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch images from collection: ${collection}`
    })
  }
})