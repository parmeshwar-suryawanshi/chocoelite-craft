-- Add order_source column to orders table to distinguish between app and whatsapp orders
ALTER TABLE public.orders 
ADD COLUMN order_source text NOT NULL DEFAULT 'app';

-- Add customer details for whatsapp orders (since they may not have accounts)
ALTER TABLE public.orders 
ADD COLUMN customer_name text,
ADD COLUMN customer_phone text,
ADD COLUMN customer_email text;

-- Update existing orders to have 'app' as source
UPDATE public.orders SET order_source = 'app' WHERE order_source IS NULL;

-- Create index for faster filtering by order source
CREATE INDEX idx_orders_source ON public.orders(order_source);

-- Allow admins to insert orders (for manual whatsapp order entry)
CREATE POLICY "Admins can insert orders"
ON public.orders
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));