import { listR2Images } from '../../utils/r2-dynamic'

export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  const config = useRuntimeConfig()
  
  if (!collection) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Collection parameter is required'
    })
  }
  
  try {
    // Access the R2 bucket via Workers binding - use globalThis for Wrangler dev
    const bucket = event.context.cloudflare?.env?.R2_BUCKET || 
                   (globalThis as any)?.R2_BUCKET ||
                   (process.env as any)?.R2_BUCKET
    
    if (!bucket) {
      throw new Error('R2 bucket binding not available')
    }
    
    const images = await listR2Images(bucket, collection, config.public.cloudflareR2PublicUrl)
    
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