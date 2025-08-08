export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Get the source image URL
  const src = query.src as string
  if (!src) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing src parameter'
    })
  }

  // Validate that it's an R2 URL (security check)
  if (!src.includes('pub-77d2c63f12a143a59270d491959246da.r2.dev')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid image source'
    })
  }

  // Parse transformation parameters
  const width = query.w ? parseInt(query.w as string) : undefined
  const height = query.h ? parseInt(query.h as string) : undefined
  const quality = query.q ? parseInt(query.q as string) : undefined
  const fit = (query.fit as string) || 'scale-down'
  const format = query.f as string

  // Build cf.image options
  const imageOptions: Record<string, string | number> = {}
  
  if (width) imageOptions.width = width
  if (height) imageOptions.height = height
  if (quality) imageOptions.quality = quality
  if (fit) imageOptions.fit = fit
  
  // Handle format negotiation based on Accept header
  const acceptHeader = getHeader(event, 'accept') || ''
  if (format) {
    imageOptions.format = format
  } else {
    // Auto format detection
    if (/image\/avif/.test(acceptHeader)) {
      imageOptions.format = 'avif'
    } else if (/image\/webp/.test(acceptHeader)) {
      imageOptions.format = 'webp'
    }
  }

  try {
    // Use Cloudflare Workers image transformation
    const response = await fetch(src, {
      cf: {
        image: imageOptions
      }
    })

    if (!response.ok) {
      // If transformation fails, redirect to original image
      return sendRedirect(event, src, 307)
    }

    // Set appropriate headers
    setHeader(event, 'Content-Type', response.headers.get('content-type') || 'image/jpeg')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    
    // Forward other important headers
    const etag = response.headers.get('etag')
    if (etag) {
      setHeader(event, 'ETag', etag)
    }

    // Return the transformed image
    return response.body
  } catch (error) {
    console.error('Image transformation error:', error)
    // Fallback to original image
    return sendRedirect(event, src, 307)
  }
})