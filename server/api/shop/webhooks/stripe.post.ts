import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB
  const stripeKey = event.context.cloudflare?.env?.STRIPE_SECRET_KEY
  const webhookSecret = event.context.cloudflare?.env?.STRIPE_WEBHOOK_SECRET
  const resendApiKey = event.context.cloudflare?.env?.RESEND_API_KEY

  if (!db || !stripeKey || !webhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error'
    })
  }

  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured - emails will not be sent')
  }

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-11-20.acacia'
    })

    // Get the raw body and signature
    const body = await readRawBody(event)
    const signature = getHeader(event, 'stripe-signature')

    if (!signature || !body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing signature or body'
      })
    }

    // Verify the webhook signature
    let stripeEvent: Stripe.Event
    try {
      stripeEvent = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      throw createError({
        statusCode: 400,
        statusMessage: `Webhook signature verification failed: ${err.message}`
      })
    }

    // Handle the event
    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent

      // Check if order already exists (idempotency)
      const existingOrder = await db
        .prepare('SELECT id FROM orders WHERE stripe_payment_intent_id = ?')
        .bind(paymentIntent.id)
        .first()

      let orderId: string

      if (existingOrder) {
        // Order already exists, use existing ID
        orderId = existingOrder.id as string
        console.log(`Order already exists for payment intent: ${paymentIntent.id}`)
      } else {
        // Get shipping details
        const shippingAddress = paymentIntent.shipping
          ? JSON.stringify({
              name: paymentIntent.shipping.name,
              address: paymentIntent.shipping.address
            })
          : null

        // Decrement stock atomically
        const updateResult = await db
          .prepare('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = ? AND stock_quantity > 0')
          .bind('zine-athens-rainforest')
          .run()

        if (updateResult.meta.changes === 0) {
          console.error('Failed to decrement stock - possibly out of stock')
          // Note: Payment already succeeded, so we log this but don't fail
          // You may want to handle this case differently (refund, manual fulfillment, etc.)
        }

        // Store the order
        orderId = crypto.randomUUID()
        await db
          .prepare(
            'INSERT INTO orders (id, stripe_payment_intent_id, customer_email, customer_name, shipping_address, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            orderId,
            paymentIntent.id,
            paymentIntent.receipt_email || 'unknown@email.com',
            paymentIntent.metadata?.customer_name || 'Unknown',
            shippingAddress,
            paymentIntent.amount,
            'completed'
          )
          .run()

        console.log(`Order created for payment intent: ${paymentIntent.id}`)
      }

      // Send confirmation email
      if (resendApiKey) {
        try {
          const emailResult = await sendOrderConfirmationEmail(
            {
              orderId,
              customerEmail: paymentIntent.receipt_email || 'unknown@email.com',
              customerName: paymentIntent.metadata?.customer_name,
              amount: paymentIntent.amount,
              shippingAddress: paymentIntent.shipping
                ? {
                    name: paymentIntent.shipping.name || '',
                    address: {
                      line1: paymentIntent.shipping.address?.line1 || undefined,
                      line2: paymentIntent.shipping.address?.line2 || undefined,
                      city: paymentIntent.shipping.address?.city || undefined,
                      state: paymentIntent.shipping.address?.state || undefined,
                      postal_code: paymentIntent.shipping.address?.postal_code || undefined,
                      country: paymentIntent.shipping.address?.country || undefined
                    }
                  }
                : undefined,
              productName: 'Athens is a Subtropical Rainforest'
            },
            resendApiKey
          )

          if (emailResult.success) {
            console.log('Order confirmation email sent successfully')
          } else {
            console.error('Failed to send order confirmation email:', emailResult.error)
          }
        } catch (emailError) {
          console.error('Error sending order confirmation email:', emailError)
          // Don't fail the webhook if email fails - order is still created
        }
      }
    }

    return { received: true }
  } catch (error) {
    console.error('Webhook error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Webhook processing failed'
    })
  }
})
