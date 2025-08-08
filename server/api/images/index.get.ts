import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig()
  
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
      Prefix: 'gallery/', // Organize images in gallery folder
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
        collection: item.Key?.split('/')[1] || 'general'
      })) || []

    return {
      images,
      count: images.length
    }
  } catch (error) {
    console.error('Error fetching images from R2:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch images from storage'
    })
  }
})