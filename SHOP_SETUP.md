# Shop Setup Guide

This guide will help you complete the setup for your zine shop feature.

## What's Been Done

✅ Stripe dependencies installed (`stripe`, `@stripe/stripe-js`)
✅ D1 database schema created (`server/database/schema.sql`)
✅ Server API endpoints created:
  - `/api/shop/product` - Get zine product details
  - `/api/shop/checkout` - Initialize Stripe checkout
  - `/api/shop/webhooks/stripe` - Handle Stripe payment webhooks
  - `/api/shop/order/[paymentIntentId]` - Get order details
✅ Frontend pages created:
  - `/shop` - Main shop page with product display and checkout
  - `/shop/success` - Order confirmation page
✅ Checkout form component with Stripe Elements integration
✅ Navigation updated with Shop link
✅ Configuration files updated

## Setup Steps

### 1. Create Cloudflare D1 Databases

First, you need to be authenticated with Cloudflare:

```bash
# Login to Cloudflare (if not already logged in)
npx wrangler login

# Create production database
npx wrangler d1 create fiftymillimeter-shop

# Create preview database
npx wrangler d1 create fiftymillimeter-shop-preview
```

After creating each database, Wrangler will output database IDs that look like:
```
database_id = "abc123-def456-ghi789"
```

**Copy these IDs** and update `wrangler.jsonc`:
- Replace `YOUR_DATABASE_ID_HERE` with the production database ID
- Replace `YOUR_PREVIEW_DATABASE_ID_HERE` with the preview database ID

### 2. Initialize the Databases with Schema

Run the schema migration on both databases:

```bash
# Production database
npx wrangler d1 execute fiftymillimeter-shop --file=./server/database/schema.sql

# Preview database
npx wrangler d1 execute fiftymillimeter-shop-preview --file=./server/database/schema.sql
```

This will create the tables and insert the initial product data (100 copies at $20).

### 3. Upload Zine Cover Image to R2

You need to upload your zine cover image to your R2 bucket:

```bash
# Upload the image to the /shop folder in your R2 bucket
npx wrangler r2 object put fiftymillimeter/shop/athens-rainforest-cover.jpg --file=/path/to/your/zine-cover.jpg
```

Replace `/path/to/your/zine-cover.jpg` with the actual path to your cover image file.

**Note:** The schema is configured to use:
`https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/athens-rainforest-cover.jpg`

If you want to use a different filename, update the `image_url` in `server/database/schema.sql` before running the migration.

### 4. Set Up Stripe

#### Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to **Developers → API Keys**
3. You'll see:
   - **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
   - **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)

#### Configure Local Development

Create a `.env` file in your project root (if it doesn't exist):

```bash
# .env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Important:** Start with test mode keys (`pk_test_` and `sk_test_`) until you're ready to go live!

#### Set Up Stripe Webhook Secret (for Local Testing)

For local development, use the Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI if you haven't already
# macOS: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/shop/webhooks/stripe
```

This will output a webhook signing secret like `whsec_xxx...`. Add this to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

#### Configure Production Stripe

For production, you need to:

1. **Update `wrangler.jsonc`** with your live publishable key:
   ```jsonc
   "vars": {
     "STRIPE_PUBLISHABLE_KEY": "pk_live_YOUR_LIVE_KEY"
   }
   ```

2. **Add secret keys to Wrangler secrets** (these are not in the file for security):
   ```bash
   # Set your live Stripe secret key
   npx wrangler secret put STRIPE_SECRET_KEY
   # Enter: sk_live_YOUR_LIVE_SECRET_KEY

   # Set your webhook secret
   npx wrangler secret put STRIPE_WEBHOOK_SECRET
   # Enter: whsec_YOUR_WEBHOOK_SECRET
   ```

3. **Configure Stripe webhook endpoint** in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
   - Click "Add endpoint"
   - URL: `https://fiftymillimeter.com/api/shop/webhooks/stripe`
   - Events to listen for: `payment_intent.succeeded`
   - Copy the webhook signing secret and use it in the `wrangler secret put` command above

### 5. Update Product Details (Optional)

If you want to change the product description, price, or other details, you can either:

**Option A: Edit the schema before migration**
- Edit `server/database/schema.sql`
- Update the INSERT statement with your details
- Run the migration again

**Option B: Update directly in the database**
```bash
# Connect to the database
npx wrangler d1 execute fiftymillimeter-shop --command="UPDATE products SET description='Your new description here' WHERE id='zine-athens-rainforest'"
```

## Testing Locally

1. **Start the development server:**
   ```bash
   bun run dev
   ```

2. **In another terminal, run Stripe webhook forwarding:**
   ```bash
   stripe listen --forward-to localhost:3000/api/shop/webhooks/stripe
   ```

3. **Visit the shop page:**
   ```
   http://localhost:3000/shop
   ```

4. **Test with Stripe test cards:**
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

   More test cards: https://stripe.com/docs/testing

## Deploying to Production

1. **Ensure all secrets are set** (see step 4 above)

2. **Build the project:**
   ```bash
   bun run build
   ```

3. **Deploy to Cloudflare:**
   ```bash
   bun run deploy
   ```

4. **Test the live site** with test mode Stripe keys first, then switch to live keys when ready!

## Monitoring Orders

To view orders in your D1 database:

```bash
npx wrangler d1 execute fiftymillimeter-shop --command="SELECT * FROM orders ORDER BY created_at DESC LIMIT 10"
```

To check current stock:

```bash
npx wrangler d1 execute fiftymillimeter-shop --command="SELECT name, stock_quantity FROM products WHERE id='zine-athens-rainforest'"
```

## Troubleshooting

### "Database not configured" error
- Make sure you've updated `wrangler.jsonc` with the correct database IDs
- Verify the database binding name is `DB` in both the config and your code

### Webhook signature verification failed
- Make sure `STRIPE_WEBHOOK_SECRET` is correctly set
- For local dev, ensure the Stripe CLI is running with `stripe listen`
- For production, verify the webhook secret matches your Stripe Dashboard endpoint

### Product image not showing
- Verify the image was uploaded to R2 successfully
- Check that the public URL is correct in the database
- Ensure the R2 bucket has public access configured

### Stock not decrementing after purchase
- Check that the webhook is being received (Stripe Dashboard → Developers → Webhooks)
- Verify the webhook secret is correct
- Check Cloudflare Workers logs for any errors

## Going Live Checklist

Before accepting real payments:

- [ ] Switch from test Stripe keys to live Stripe keys
- [ ] Update `STRIPE_PUBLISHABLE_KEY` in `wrangler.jsonc` to live key
- [ ] Set live `STRIPE_SECRET_KEY` via `wrangler secret put`
- [ ] Configure production webhook endpoint in Stripe Dashboard
- [ ] Set webhook secret via `wrangler secret put STRIPE_WEBHOOK_SECRET`
- [ ] Test a real purchase (small amount first!)
- [ ] Verify email receipt is sent
- [ ] Verify stock decrements correctly
- [ ] Test the order confirmation page

## Support

For Stripe-related questions: https://support.stripe.com/
For Cloudflare D1 questions: https://developers.cloudflare.com/d1/
