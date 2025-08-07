// Static gallery configuration based on actual R2 bucket structure
export const GALLERY_CONFIG = {
  collections: [
    {
      name: 'main',
      slug: 'main',
      displayName: 'Ian Kennedy Collection',
      description: 'Main photography collection',
      images: [
        'ian-kennedy-01.jpg',
        'ian-kennedy-02.jpg',
        'ian-kennedy-03.jpg',
        'ian-kennedy-04.jpg',
        'ian-kennedy-05.jpg',
        'ian-kennedy-06.jpg',
        'ian-kennedy-07.jpg'
      ]
    },
    {
      name: 'arizona',
      slug: 'arizona',
      displayName: 'Arizona',
      description: 'Arizona landscapes and scenery',
      images: [
        // Add your actual arizona image filenames here
        // For example: 'arizona-sunset.jpg', 'desert-landscape.jpg', etc.
        // These are placeholders - replace with your actual files
      ]
    }
  ]
}

export function getCollectionImages(collectionName: string, publicUrl: string) {
  const collection = GALLERY_CONFIG.collections.find(c => c.name === collectionName)
  if (!collection) return []
  
  return collection.images.map(filename => ({
    key: collectionName === 'main' ? filename : `${collectionName}/${filename}`,
    url: `${publicUrl}/${collectionName === 'main' ? filename : `${collectionName}/${filename}`}`,
    name: filename.replace(/\.[^/.]+$/, ''),
    collection: collectionName,
    filename
  }))
}

export function getAllCollections(publicUrl: string) {
  return GALLERY_CONFIG.collections.map(collection => ({
    name: collection.name,
    slug: collection.slug,
    displayName: collection.displayName,
    description: collection.description,
    imageCount: collection.images.length,
    coverImage: collection.images.length > 0 
      ? `${publicUrl}/${collection.name === 'main' ? collection.images[0] : `${collection.name}/${collection.images[0]}`}`
      : null
  }))
}