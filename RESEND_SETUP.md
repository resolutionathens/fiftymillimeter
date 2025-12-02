# Resend Email Setup

This application uses Resend for sending order confirmation emails.

## Setup Instructions

### 1. Get Resend API Key

1. Sign up for a free account at [resend.com](https://resend.com)
2. Verify your domain (fiftymillimeter.com) or use their testing domain
3. Create an API key in the Resend dashboard

### 2. Configure Email Sender

In the Resend dashboard, verify the email address you want to send from.
The code is configured to send from: `orders@fiftymillimeter.com`

If you haven't verified this domain, you can:
- Change the `from` address in `/server/utils/email.ts` to use a verified address
- Or verify fiftymillimeter.com in Resend to use custom sending addresses

### 3. Add API Key to Cloudflare Workers

Set the RESEND_API_KEY as a Cloudflare Workers secret:

```bash
npx wrangler secret put RESEND_API_KEY
```

When prompted, paste your Resend API key.

### 4. Test Email Delivery

After deploying, make a test purchase to verify:
1. Order is created in database
2. Confirmation email is sent to customer
3. Email contains order details and shipping address

## Email Template

The order confirmation email includes:
- Order ID
- Product name and image
- Total amount paid
- Shipping address
- Contact information

You can customize the template in `/server/utils/email.ts`.

## Troubleshooting

If emails aren't being sent:

1. Check Wrangler logs: `npx wrangler tail`
2. Verify RESEND_API_KEY is set: Check in Cloudflare Dashboard → Workers → Settings → Variables
3. Check Resend dashboard for delivery status and errors
4. Ensure the sender email is verified in Resend

## Important Notes

- The webhook will not fail if email sending fails (order is still created)
- Email sending is logged to console for debugging
- Stripe also sends a receipt email separately from our custom confirmation email
