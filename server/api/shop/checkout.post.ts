import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB
  const stripeKey = event.context.cloudflare?.env?.STRIPE_SECRET_KEY

  if (!db || !stripeKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error'
    })
  }

  try {
    // Get request body
    const body = await readBody(event)
    const { email, name } = body

    if (!email || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and name are required'
      })
    }

    // Check product availability
    const product = await db
      .prepare('SELECT * FROM products WHERE id = ?')
      .bind('zine-athens-rainforest')
      .first()

    if (!product || product.stock_quantity < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product is out of stock'
      })
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-11-20.acacia'
    })

    // Create PaymentIntent with shipping address collection
    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        product_id: product.id,
        product_name: product.name,
        customer_name: name
      },
      // Enable automatic payment methods
      automatic_payment_methods: {
        enabled: true
      }
    })

    return {
      clientSecret: paymentIntent.client_secret,
      product
    }
  } catch (error) {
    console.error('Checkout error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to initialize checkout'
    })
  }
})
