-- Products table for shop inventory
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  stock_quantity INTEGER NOT NULL,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table for purchase tracking
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  shipping_address TEXT, -- JSON string with address details
  amount INTEGER NOT NULL, -- Amount in cents
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initial product: Athens is a Subtropical Rainforest zine
INSERT INTO products (id, name, description, price, stock_quantity, image_url)
VALUES (
  'zine-athens-rainforest',
  'Athens is a Subtropical Rainforest',
  'A photography zine exploring the lush, verdant landscapes of Athens through the lens of its subtropical character.',
  2000, -- $20.00
  100, -- Initial stock of 100 copies
  'https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/athens-rainforest-cover.jpg'
);
