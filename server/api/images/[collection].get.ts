import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  const config = useRuntimeConfig()
  
  if (!collection) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Collection parameter is required'
    })
  }
  
  const s3Client = new S3Client({
    endpoint: config.cloudflareR2Endpoint,
    credentials: {
      accessKeyId: config.cloudflareAccessKeyId,
      secretAccessKey: config.cloudflareSecretAccessKey,
    },
    region: 'auto',
  })

  try {
    const command = new ListObjectsV2Command({
      Bucket: config.cloudflareR2BucketName,
      Prefix: `gallery/${collection}/`,
    })

    const response = await s3Client.send(command)
    
    const images = response.Contents
      ?.filter(item => item.Key && !item.Key.endsWith('/'))
      ?.map(item => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        url: `${config.public.cloudflareR2PublicUrl}/${item.Key}`,
        name: item.Key?.split('/').pop()?.replace(/\.[^/.]+$/, '') || '',
        collection: collection
      })) || []

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