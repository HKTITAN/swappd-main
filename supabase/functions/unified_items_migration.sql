-- Unified items migration to combine shop inventory and user-submitted items

-- Add or update columns needed for unified system
ALTER TABLE items 
  ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS convertible_to_inventory BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10, 2) DEFAULT 0.00;

-- Create index for approval status queries
CREATE INDEX IF NOT EXISTS idx_items_approval_status ON items(approval_status);

-- Create trigger function to automatically set approval_status for shop items
CREATE OR REPLACE FUNCTION set_shop_item_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_shop_item = TRUE THEN
    NEW.approval_status := 'approved';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to execute the function
DROP TRIGGER IF EXISTS tr_shop_item_approved ON items;
CREATE TRIGGER tr_shop_item_approved
  BEFORE INSERT OR UPDATE OF is_shop_item ON items
  FOR EACH ROW
  EXECUTE FUNCTION set_shop_item_approved();

-- Create a view for pending user submissions
CREATE OR REPLACE VIEW vw_pending_submissions AS
SELECT 
  id,
  title,
  category,
  condition,
  swapcoins,
  created_at,
  user_id,
  image_url,
  images,
  approval_status,
  convertible_to_inventory,
  estimated_value
FROM items
WHERE is_shop_item = FALSE AND approval_status = 'pending';

-- Create a view for approved user submissions
CREATE OR REPLACE VIEW vw_approved_submissions AS
SELECT 
  id,
  title,
  category,
  condition,
  swapcoins,
  created_at,
  user_id,
  image_url,
  images,
  approval_status,
  reviewed_by,
  reviewed_at,
  convertible_to_inventory,
  estimated_value
FROM items
WHERE is_shop_item = FALSE AND approval_status = 'approved';

-- Function to convert user item to inventory item
CREATE OR REPLACE FUNCTION convert_to_inventory_item(item_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_success BOOLEAN;
BEGIN
  UPDATE items
  SET 
    is_shop_item = TRUE,
    approval_status = 'approved',
    status = CASE 
      WHEN stock_quantity IS NULL OR stock_quantity = 0 THEN 'out_of_stock'
      WHEN stock_quantity < 5 THEN 'low_stock' 
      ELSE 'approved' 
    END,
    stock_quantity = COALESCE(stock_quantity, 1),
    price = COALESCE(estimated_value, 0),
    sku = CASE 
      WHEN sku IS NULL OR sku = '' 
      THEN UPPER(SUBSTRING(category, 1, 3)) || '-' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)
      ELSE sku 
    END
  WHERE id = item_id;
  
  GET DIAGNOSTICS v_success = ROW_COUNT;
  RETURN v_success > 0;
END;
$$ LANGUAGE plpgsql;