-- Create section_styles table for comprehensive styling control
CREATE TABLE public.section_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  
  -- Background styling
  background_type TEXT DEFAULT 'solid', -- solid, gradient, image
  background_color TEXT DEFAULT '#ffffff',
  background_gradient_from TEXT,
  background_gradient_to TEXT,
  background_gradient_direction TEXT DEFAULT 'to-b',
  background_image_url TEXT,
  background_overlay_opacity NUMERIC DEFAULT 0,
  
  -- Typography
  heading_color TEXT DEFAULT '#1a1a1a',
  heading_font_size TEXT DEFAULT 'text-4xl',
  subheading_color TEXT DEFAULT '#6b7280',
  text_color TEXT DEFAULT '#374151',
  
  -- Primary Button
  button_primary_bg TEXT DEFAULT '#8B4513',
  button_primary_text TEXT DEFAULT '#ffffff',
  button_primary_border_radius TEXT DEFAULT 'rounded-lg',
  button_primary_style TEXT DEFAULT 'solid', -- solid, outline, gradient
  
  -- Secondary Button
  button_secondary_bg TEXT DEFAULT 'transparent',
  button_secondary_text TEXT DEFAULT '#8B4513',
  button_secondary_border_color TEXT DEFAULT '#8B4513',
  button_secondary_border_radius TEXT DEFAULT 'rounded-lg',
  
  -- Spacing
  padding_top TEXT DEFAULT 'pt-20',
  padding_bottom TEXT DEFAULT 'pb-20',
  padding_x TEXT DEFAULT 'px-4',
  
  -- Card Styling (for sections with cards)
  card_bg TEXT DEFAULT '#ffffff',
  card_border_radius TEXT DEFAULT 'rounded-xl',
  card_shadow TEXT DEFAULT 'shadow-md',
  card_border_color TEXT,
  
  -- Badge Styling
  badge_bg TEXT DEFAULT '#8B4513',
  badge_text TEXT DEFAULT '#ffffff',
  
  -- Accent colors
  accent_color TEXT DEFAULT '#D4A574',
  
  -- Custom CSS (advanced)
  custom_css TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_styles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view section styles"
ON public.section_styles
FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can manage section styles"
ON public.section_styles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Insert default styles for all sections
INSERT INTO public.section_styles (section_key, background_type, background_color, heading_color, accent_color) VALUES
('hero', 'gradient', '#1a1a1a', '#ffffff', '#D4A574'),
('products', 'solid', '#faf9f7', '#1a1a1a', '#8B4513'),
('special-offers', 'gradient', '#fffbeb', '#1a1a1a', '#f59e0b'),
('combo-offers', 'solid', '#ffffff', '#1a1a1a', '#8B4513'),
('festival-offers', 'gradient', '#fef3c7', '#1a1a1a', '#d97706'),
('limited-edition', 'solid', '#1a1a1a', '#ffffff', '#D4A574'),
('craft-video', 'solid', '#ffffff', '#1a1a1a', '#8B4513'),
('about', 'gradient', '#faf9f7', '#1a1a1a', '#8B4513'),
('gift-section', 'solid', '#ffffff', '#1a1a1a', '#D4A574'),
('gallery', 'solid', '#1a1a1a', '#ffffff', '#D4A574'),
('lucky-winners', 'gradient', '#fffbeb', '#1a1a1a', '#f59e0b'),
('testimonials', 'solid', '#faf9f7', '#1a1a1a', '#8B4513'),
('loyalty', 'gradient', '#1a1a1a', '#ffffff', '#D4A574'),
('newsletter', 'solid', '#8B4513', '#ffffff', '#D4A574'),
('contact', 'solid', '#ffffff', '#1a1a1a', '#8B4513');

-- Create trigger for updated_at
CREATE TRIGGER update_section_styles_updated_at
BEFORE UPDATE ON public.section_styles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();