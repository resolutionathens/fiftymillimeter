import { listR2Collections } from '../utils/r2-dynamic'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    // Access the R2 bucket via Workers binding - use globalThis for Wrangler dev
    const bucket = event.context.cloudflare?.env?.R2_BUCKET || 
                   (globalThis as any)?.R2_BUCKET ||
                   (process.env as any)?.R2_BUCKET
    
    if (!bucket) {
      throw new Error('R2 bucket binding not available')
    }
    
    const collections = await listR2Collections(bucket, config.public.cloudflareR2PublicUrl)
    
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