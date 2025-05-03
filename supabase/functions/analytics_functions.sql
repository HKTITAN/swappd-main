-- SQL functions for analytics data in SwapPD
-- Execute these in your Supabase SQL Editor

-- Function to get monthly user growth
CREATE OR REPLACE FUNCTION get_monthly_user_growth(months_back int DEFAULT 12)
RETURNS TABLE (
  date text,
  count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH month_series AS (
    SELECT generate_series(
      date_trunc('month', CURRENT_DATE - (months_back || ' month')::interval),
      date_trunc('month', CURRENT_DATE),
      '1 month'::interval
    ) AS month_date
  )
  SELECT
    to_char(month_date, 'Mon YYYY') as date,
    COALESCE(count(p.created_at), 0) as count
  FROM month_series
  LEFT JOIN profiles p ON date_trunc('month', p.created_at) = month_series.month_date
  GROUP BY month_date
  ORDER BY month_date;
END;
$$;

-- Function to get items by category
CREATE OR REPLACE FUNCTION get_items_by_category()
RETURNS TABLE (
  category text,
  count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(i.category, 'Uncategorized') as category,
    COUNT(*) as count
  FROM items i
  GROUP BY i.category
  ORDER BY count DESC;
END;
$$;

-- Function to get monthly transaction volume
CREATE OR REPLACE FUNCTION get_monthly_transaction_volume(months_back int DEFAULT 12)
RETURNS TABLE (
  date text,
  volume numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH month_series AS (
    SELECT generate_series(
      date_trunc('month', CURRENT_DATE - (months_back || ' month')::interval),
      date_trunc('month', CURRENT_DATE),
      '1 month'::interval
    ) AS month_date
  )
  SELECT
    to_char(month_date, 'Mon YYYY') as date,
    COALESCE(SUM(t.amount), 0) as volume
  FROM month_series
  LEFT JOIN transactions t ON date_trunc('month', t.created_at) = month_series.month_date
  GROUP BY month_date
  ORDER BY month_date;
END;
$$;

-- Function to get daily active users
CREATE OR REPLACE FUNCTION get_daily_active_users(days_back int DEFAULT 30)
RETURNS TABLE (
  date text,
  active_users bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH day_series AS (
    SELECT generate_series(
      date_trunc('day', CURRENT_DATE - (days_back || ' day')::interval),
      date_trunc('day', CURRENT_DATE),
      '1 day'::interval
    ) AS day_date
  )
  SELECT
    to_char(day_date, 'Mon DD') as date,
    COALESCE(COUNT(DISTINCT user_id), 0) as active_users
  FROM day_series
  LEFT JOIN user_activity ua ON date_trunc('day', ua.timestamp) = day_series.day_date
  GROUP BY day_date
  ORDER BY day_date;
END;
$$;

-- Function to get dashboard stats in one call
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_users bigint,
  total_items bigint,
  total_swapcoins numeric,
  inventory_total_items bigint,
  inventory_low_stock_items bigint,
  inventory_out_of_stock_items bigint,
  inventory_total_value numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles WHERE deleted_at IS NULL) as total_users,
    (SELECT COUNT(*) FROM items WHERE deleted_at IS NULL) as total_items,
    (SELECT COALESCE(SUM(swapcoins), 0) FROM profiles WHERE deleted_at IS NULL) as total_swapcoins,
    (SELECT COUNT(*) FROM items WHERE is_shop_item = true AND deleted_at IS NULL) as inventory_total_items,
    (SELECT COUNT(*) FROM items WHERE is_shop_item = true AND stock_quantity < 5 AND stock_quantity > 0 AND deleted_at IS NULL) as inventory_low_stock_items,
    (SELECT COUNT(*) FROM items WHERE is_shop_item = true AND (stock_quantity = 0 OR stock_quantity IS NULL) AND deleted_at IS NULL) as inventory_out_of_stock_items,
    (SELECT COALESCE(SUM(price * stock_quantity), 0) FROM items WHERE is_shop_item = true AND stock_quantity IS NOT NULL AND deleted_at IS NULL) as inventory_total_value;
END;
$$;

-- Create tables if they don't exist
-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  description text,
  status text DEFAULT 'completed',
  created_at timestamp with time zone DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  report_type text NOT NULL,
  reported_item_id uuid REFERENCES items(id),
  reported_user_id uuid REFERENCES auth.users(id),
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'investigating', 'resolved', 'closed')) DEFAULT 'open',
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Report responses table
CREATE TABLE IF NOT EXISTS report_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid REFERENCES reports(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  message text NOT NULL,
  admin_response boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one settings record
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User activity tracking table
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  action_type text NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  metadata jsonb
);

-- Activity tracking trigger function
CREATE OR REPLACE FUNCTION track_user_activity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_activity (user_id, action_type, metadata)
  VALUES (NEW.user_id, TG_TABLE_NAME || '_' || TG_OP, to_jsonb(NEW));
  RETURN NEW;
END;
$$;

-- Apply activity tracking trigger to relevant tables
DO $$
BEGIN
  -- Drop existing triggers to avoid conflicts
  DROP TRIGGER IF EXISTS track_item_activity ON items;
  DROP TRIGGER IF EXISTS track_transaction_activity ON transactions;
  
  -- Create new triggers
  CREATE TRIGGER track_item_activity
    AFTER INSERT OR UPDATE
    ON items
    FOR EACH ROW
    EXECUTE FUNCTION track_user_activity();
    
  CREATE TRIGGER track_transaction_activity
    AFTER INSERT
    ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION track_user_activity();
END;
$$;