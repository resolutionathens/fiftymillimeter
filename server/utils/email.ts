interface OrderEmailData {
  orderId: string
  customerEmail: string
  customerName?: string
  amount: number
  shippingAddress?: {
    name: string
    address: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
  productName: string
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData,
  resendApiKey: string
) {
  const formattedAmount = (data.amount / 100).toFixed(2)
  const shortOrderId = data.orderId.slice(0, 13)

  const shippingAddressHtml = data.shippingAddress
    ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Shipping Address</h3>
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
        ${data.shippingAddress.name}<br>
        ${data.shippingAddress.address.line1 || ''}<br>
        ${data.shippingAddress.address.line2 ? `${data.shippingAddress.address.line2}<br>` : ''}
        ${data.shippingAddress.address.city}, ${data.shippingAddress.address.state} ${data.shippingAddress.address.postal_code}<br>
        ${data.shippingAddress.address.country}
      </p>
    </div>
  `
    : ''

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; margin-bottom: 16px;">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #111827;">Thank You!</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px; color: #6b7280;">Your order has been confirmed</p>
      </div>

      <!-- Order Summary -->
      <div style="margin-bottom: 24px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">Order Details</h2>

        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #6b7280; font-size: 14px;">Order ID</span>
          <span style="color: #111827; font-size: 14px; font-family: monospace;">${shortOrderId}...</span>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #6b7280; font-size: 14px;">Product</span>
          <span style="color: #111827; font-size: 14px;">${data.productName}</span>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 12px 0;">
          <span style="color: #6b7280; font-size: 14px;">Total</span>
          <span style="color: #111827; font-size: 16px; font-weight: 600;">$${formattedAmount}</span>
        </div>
      </div>

      ${shippingAddressHtml}

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
          Your order will be shipped soon. You'll receive a tracking number once it ships.
        </p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          Questions? Reply to this email or visit <a href="https://fiftymillimeter.com" style="color: #0ea5e9; text-decoration: none;">fiftymillimeter.com</a>
        </p>
      </div>
    </div>

    <!-- Footer text -->
    <div style="text-align: center; margin-top: 24px;">
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © 2025 Fiftymillimeter. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `

  try {
    // Use Resend API directly via fetch (SDK has React dependencies incompatible with Workers)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Fiftymillimeter <orders@fiftymillimeter.com>',
        to: data.customerEmail,
        subject: `Order Confirmation - ${data.productName}`,
        html: htmlContent
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return { success: false, error: errorData }
    }

    const result = await response.json()
    return { success: true, result }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error }
  }
}
