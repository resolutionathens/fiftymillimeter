-- Shop inventory table for tracking consignment/distribution to local shops
CREATE TABLE IF NOT EXISTS shop_inventory (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  distributed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shop_inventory_product ON shop_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_shop_inventory_shop ON shop_inventory(shop_name);

-- Decrement product stock by 9 (distributed to shops)
UPDATE products
SET stock_quantity = stock_quantity - 9
WHERE id = 'zine-athens-rainforest';

-- Insert shop distribution records
INSERT INTO shop_inventory (id, product_id, shop_name, quantity, notes) VALUES
  ('shop-dist-' || hex(randomblob(16)), 'zine-athens-rainforest', 'Cillies', 1, 'Consignment drop-off'),
  ('shop-dist-' || hex(randomblob(16)), 'zine-athens-rainforest', 'Community', 1, 'Consignment drop-off'),
  ('shop-dist-' || hex(randomblob(16)), 'zine-athens-rainforest', 'Wuxtry', 4, 'Consignment drop-off'),
  ('shop-dist-' || hex(randomblob(16)), 'zine-athens-rainforest', 'KA Artist', 3, 'Consignment drop-off');
