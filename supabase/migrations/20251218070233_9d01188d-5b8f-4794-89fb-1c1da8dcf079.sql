-- Add tracking_token to orders table for secure public tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_token TEXT UNIQUE;

-- Generate tracking tokens for existing orders
UPDATE public.orders 
SET tracking_token = CONCAT('TRK-', UPPER(SUBSTRING(id::text, 1, 8)), '-', UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 6)))
WHERE tracking_token IS NULL;

-- Make tracking_token NOT NULL for future orders
ALTER TABLE public.orders ALTER COLUMN tracking_token SET DEFAULT CONCAT('TRK-', UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8)), '-', UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 6)));

-- Drop the insecure policy that exposes all order data
DROP POLICY IF EXISTS "Anyone can view order by ID for tracking" ON public.orders;

-- Create a secure function to get limited tracking info (no PII exposed)
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_tracking_token TEXT)
RETURNS TABLE (
  order_id TEXT,
  delivery_status TEXT,
  status TEXT,
  estimated_delivery_date TIMESTAMPTZ,
  tracking_notes TEXT,
  created_at TIMESTAMPTZ,
  total_amount NUMERIC,
  city TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUBSTRING(o.id::text, 1, 8) as order_id,
    o.delivery_status,
    o.status,
    o.estimated_delivery_date,
    o.tracking_notes,
    o.created_at,
    o.total_amount,
    (o.shipping_address->>'city')::TEXT as city
  FROM public.orders o
  WHERE o.tracking_token = p_tracking_token;
END;
$$;

-- Create a function to get order items for tracking (no PII)
CREATE OR REPLACE FUNCTION public.get_order_tracking_items(p_tracking_token TEXT)
RETURNS TABLE (
  product_name TEXT,
  product_image TEXT,
  quantity INTEGER,
  price NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  -- Get order ID from tracking token
  SELECT o.id INTO v_order_id
  FROM public.orders o
  WHERE o.tracking_token = p_tracking_token;
  
  IF v_order_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    oi.product_name,
    oi.product_image,
    oi.quantity,
    oi.price
  FROM public.order_items oi
  WHERE oi.order_id = v_order_id;
END;
$$;