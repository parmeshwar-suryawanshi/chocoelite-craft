-- Add delivery tracking fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_status text NOT NULL DEFAULT 'processing',
ADD COLUMN IF NOT EXISTS estimated_delivery_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS tracking_notes text;

-- Add check constraint for delivery status
ALTER TABLE public.orders 
ADD CONSTRAINT check_delivery_status 
CHECK (delivery_status IN ('processing', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'));

-- Create RLS policy to allow order tracking by order ID
CREATE POLICY "Anyone can view order by ID for tracking"
ON public.orders
FOR SELECT
TO authenticated
USING (true);