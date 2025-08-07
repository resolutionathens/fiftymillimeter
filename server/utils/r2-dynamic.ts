// Dynamic R2 gallery utilities using Workers binding
export async function listR2Collections(bucket: R2Bucket, publicUrl: string) {
  const collections = []
  
  // List all objects with delimiter to get folders
  const result = await bucket.list({
    delimiter: '/',
    limit: 1000
  })
  
  // Get folder-based collections from delimitedPrefixes
  if (result.delimitedPrefixes) {
    for (const prefix of result.delimitedPrefixes) {
      const folderName = prefix.replace('/', '')
      if (folderName) {
        // Get first image from this folder for cover image
        const folderContents = await bucket.list({
          prefix: prefix,
          limit: 1
        })
        
        const imageCount = await getImageCount(bucket, prefix)
        
        collections.push({
          name: folderName,
          slug: folderName.toLowerCase().replace(/\s+/g, '-'),
          displayName: folderName.charAt(0).toUpperCase() + folderName.slice(1),
          description: `${folderName} collection`,
          imageCount,
          coverImage: folderContents.objects.length > 0 
            ? `${publicUrl}/${folderContents.objects[0].key}`
            : null
        })
      }
    }
  }
  
  // Check for root-level images (main collection)
  const rootImages = result.objects.filter(obj => 
    obj.key && !obj.key.includes('/') && isImageFile(obj.key)
  )
  
  if (rootImages.length > 0) {
    collections.unshift({
      name: 'main',
      slug: 'main',
      displayName: 'Main Collection',
      description: 'Main photography collection',
      imageCount: rootImages.length,
      coverImage: `${publicUrl}/${rootImages[0].key}`
    })
  }
  
  return collections
}

export async function listR2Images(bucket: R2Bucket, collection: string, publicUrl: string) {
  let prefix = ''
  let shouldFilterRoot = false
  
  if (collection === 'main') {
    // For main collection, list root-level images only
    prefix = ''
    shouldFilterRoot = true
  } else {
    // For folder collections, list images in that folder
    prefix = `${collection}/`
  }
  
  const result = await bucket.list({
    prefix,
    limit: 1000
  })
  
  let objects = result.objects
  
  if (shouldFilterRoot) {
    // Filter to only root-level image files
    objects = objects.filter(obj => 
      obj.key && !obj.key.includes('/') && isImageFile(obj.key)
    )
  } else {
    // Filter to only image files (exclude folders)
    objects = objects.filter(obj => 
      obj.key && isImageFile(obj.key)
    )
  }
  
  return objects.map(obj => ({
    key: obj.key,
    name: obj.key?.split('/').pop()?.replace(/\.[^/.]+$/, '') || '',
    url: `${publicUrl}/${obj.key}`,
    collection,
    size: obj.size,
    lastModified: obj.uploaded
  }))
}

async function getImageCount(bucket: R2Bucket, prefix: string): Promise<number> {
  // Get approximate count by listing all objects in prefix
  const result = await bucket.list({
    prefix,
    limit: 1000
  })
  
  return result.objects.filter(obj => obj.key && isImageFile(obj.key)).length
}

function isImageFile(key: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(key)
}