-- SQL migration to add inventory management fields to the items table

-- Add inventory-related columns to the items table
ALTER TABLE items 
  ADD COLUMN IF NOT EXISTS is_shop_item BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
  ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0.00;

-- Create an index for faster querying of shop items
CREATE INDEX IF NOT EXISTS idx_items_shop_items ON items(is_shop_item) WHERE is_shop_item = TRUE;

-- Create a view for inventory management
CREATE OR REPLACE VIEW vw_inventory AS
SELECT 
  id,
  title,
  description,
  category,
  condition,
  price,
  swapcoins,
  stock_quantity,
  sku,
  status,
  image_url,
  images,
  created_at,
  updated_at
FROM items
WHERE is_shop_item = TRUE;

-- Function to update inventory when purchases occur
CREATE OR REPLACE FUNCTION update_inventory_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Reduce stock quantity
  UPDATE items
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.item_id AND is_shop_item = TRUE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for inventory updates on purchase
DROP TRIGGER IF EXISTS tr_update_inventory_on_purchase ON purchases;
CREATE TRIGGER tr_update_inventory_on_purchase
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_on_purchase();

-- Create purchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  item_id UUID REFERENCES items(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a view for low stock alerts
CREATE OR REPLACE VIEW vw_low_stock_items AS
SELECT 
  id,
  title,
  category,
  stock_quantity,
  sku
FROM items
WHERE is_shop_item = TRUE AND stock_quantity < 5 AND stock_quantity > 0;

-- Create a view for out of stock items
CREATE OR REPLACE VIEW vw_out_of_stock_items AS
SELECT 
  id,
  title,
  category,
  sku
FROM items
WHERE is_shop_item = TRUE AND (stock_quantity <= 0 OR stock_quantity IS NULL);

-- Function to get inventory statistics
CREATE OR REPLACE FUNCTION get_inventory_stats()
RETURNS TABLE (
  total_items BIGINT,
  total_value DECIMAL,
  low_stock_count BIGINT,
  out_of_stock_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_items,
    COALESCE(SUM(price * stock_quantity), 0) as total_value,
    COUNT(*) FILTER (WHERE stock_quantity < 5 AND stock_quantity > 0)::BIGINT as low_stock_count,
    COUNT(*) FILTER (WHERE stock_quantity <= 0 OR stock_quantity IS NULL)::BIGINT as out_of_stock_count
  FROM items
  WHERE is_shop_item = TRUE;
END;
$$;