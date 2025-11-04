export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database not configured'
    })
  }

  try {
    const product = await db
      .prepare('SELECT * FROM products WHERE id = ?')
      .bind('zine-athens-rainforest')
      .first()

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    return {
      product: {
        ...product,
        inStock: product.stock_quantity > 0
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch product'
    })
  }
})
