export default defineEventHandler(async (event) => {
  const paymentIntentId = getRouterParam(event, 'paymentIntentId')
  const db = event.context.cloudflare?.env?.DB

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database not configured'
    })
  }

  if (!paymentIntentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment intent ID is required'
    })
  }

  try {
    const order = await db
      .prepare('SELECT * FROM orders WHERE stripe_payment_intent_id = ?')
      .bind(paymentIntentId)
      .first()

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    // Parse shipping address if it exists
    let shippingAddress = null
    if (order.shipping_address) {
      try {
        shippingAddress = JSON.parse(order.shipping_address)
      } catch (e) {
        console.error('Failed to parse shipping address:', e)
      }
    }

    return {
      order: {
        ...order,
        shipping_address: shippingAddress
      }
    }
  } catch (error) {
    console.error('Error fetching order:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch order'
    })
  }
})
