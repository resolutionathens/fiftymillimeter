import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
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
      Prefix: 'gallery/',
      Delimiter: '/',
    })

    const response = await s3Client.send(command)
    
    const collections = response.CommonPrefixes
      ?.map(prefix => {
        const collectionName = prefix.Prefix?.replace('gallery/', '').replace('/', '') || ''
        return {
          name: collectionName,
          slug: collectionName.toLowerCase().replace(/\s+/g, '-'),
          displayName: collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
        }
      })
      ?.filter(collection => collection.name) || []

    for (const collection of collections) {
      const imagesCommand = new ListObjectsV2Command({
        Bucket: config.cloudflareR2BucketName,
        Prefix: `gallery/${collection.name}/`,
        MaxKeys: 1
      })
      
      const imagesResponse = await s3Client.send(imagesCommand)
      const firstImage = imagesResponse.Contents?.[0]
      
      if (firstImage?.Key) {
        collection.coverImage = `${config.public.cloudflareR2PublicUrl}/${firstImage.Key}`
      }
    }

    return {
      collections,
      count: collections.length
    }
  } catch (error) {
    console.error('Error fetching collections from R2:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch collections from storage'
    })
  }
})