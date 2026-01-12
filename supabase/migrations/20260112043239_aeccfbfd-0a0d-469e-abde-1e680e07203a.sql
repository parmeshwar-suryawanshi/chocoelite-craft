-- Create site_sections table for managing section visibility and order
CREATE TABLE public.site_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_name TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hero_content table for managing hero slides
CREATE TABLE public.hero_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_line1 TEXT NOT NULL DEFAULT 'Where Nature',
  title_line2 TEXT NOT NULL DEFAULT 'Meets Indulgence',
  subtitle TEXT NOT NULL DEFAULT 'Experience the perfect harmony of sun-ripened fruits and artisan Belgian chocolate, handcrafted for moments of pure luxury.',
  badge_text TEXT DEFAULT 'Premium Fruit Chocolates',
  primary_button_text TEXT DEFAULT 'Explore Collection',
  primary_button_link TEXT DEFAULT '/shop',
  secondary_button_text TEXT DEFAULT 'Our Story',
  secondary_button_link TEXT DEFAULT '#about',
  image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop&q=80',
  video_url TEXT,
  background_type TEXT NOT NULL DEFAULT 'gradient' CHECK (background_type IN ('gradient', 'image', 'video')),
  background_value TEXT,
  trust_indicators JSONB DEFAULT '[{"icon": "Leaf", "text": "100% Natural"}, {"icon": "Heart", "text": "Handcrafted"}, {"icon": "Award", "text": "Award Winning"}]'::jsonb,
  floating_card_1_title TEXT DEFAULT '100%',
  floating_card_1_subtitle TEXT DEFAULT 'Real Fruits',
  floating_card_2_title TEXT DEFAULT 'Premium',
  floating_card_2_subtitle TEXT DEFAULT 'Belgian Cocoa',
  is_active BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create section_content table for managing dynamic content in each section
CREATE TABLE public.section_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL REFERENCES public.site_sections(section_key) ON DELETE CASCADE,
  content_key TEXT NOT NULL,
  content_value TEXT,
  content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'image', 'video', 'json')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section_key, content_key)
);

-- Enable Row Level Security
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_content ENABLE ROW LEVEL SECURITY;

-- Public read access for site_sections (visible sections only)
CREATE POLICY "Anyone can view visible sections"
  ON public.site_sections
  FOR SELECT
  USING (true);

-- Admin management for site_sections
CREATE POLICY "Admins can manage site sections"
  ON public.site_sections
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public read access for hero_content
CREATE POLICY "Anyone can view hero content"
  ON public.hero_content
  FOR SELECT
  USING (true);

-- Admin management for hero_content
CREATE POLICY "Admins can manage hero content"
  ON public.hero_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public read access for section_content
CREATE POLICY "Anyone can view section content"
  ON public.section_content
  FOR SELECT
  USING (true);

-- Admin management for section_content
CREATE POLICY "Admins can manage section content"
  ON public.section_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default sections based on the current Index page
INSERT INTO public.site_sections (section_key, section_name, display_order, description, is_visible) VALUES
  ('hero', 'Hero Banner', 1, 'Main hero section with headline and CTA', true),
  ('special-offers', 'Special Offers', 2, 'Current promotional offers and discounts', true),
  ('products', 'Products', 3, 'Featured products showcase', true),
  ('combo-offers', 'Combo Offers', 4, 'Bundle deals and combo packages', true),
  ('festival-offers', 'Festival Offers', 5, 'Seasonal and festival-specific promotions', true),
  ('limited-edition', 'Limited Edition', 6, 'Time-limited exclusive products', true),
  ('craft-video', 'Art of Chocolate Making', 7, 'Video showcasing chocolate craftsmanship', true),
  ('about', 'About Us', 8, 'Brand story and mission', true),
  ('gift-section', 'Gift Collections', 9, 'Gift boxes and corporate gifting options', true),
  ('gallery', 'Gallery', 10, 'Product and brand image gallery', true),
  ('lucky-winners', 'Lucky Winners', 11, 'Contest winners showcase', true),
  ('testimonials', 'Testimonials', 12, 'Customer reviews and testimonials', true),
  ('loyalty', 'Loyalty Program', 13, 'Rewards program information', true),
  ('newsletter', 'Newsletter', 14, 'Email subscription section', true),
  ('contact', 'Contact Us', 15, 'Contact information and form', true);

-- Insert default hero content
INSERT INTO public.hero_content (
  title_line1, title_line2, subtitle, badge_text,
  primary_button_text, primary_button_link,
  secondary_button_text, secondary_button_link,
  image_url, background_type, is_active, display_order
) VALUES (
  'Where Nature', 'Meets Indulgence',
  'Experience the perfect harmony of sun-ripened fruits and artisan Belgian chocolate, handcrafted for moments of pure luxury.',
  'Premium Fruit Chocolates',
  'Explore Collection', '/shop',
  'Our Story', '#about',
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop&q=80',
  'gradient', true, 1
);

-- Create indexes for better performance
CREATE INDEX idx_site_sections_visible ON public.site_sections(is_visible, display_order);
CREATE INDEX idx_hero_content_active ON public.hero_content(is_active, display_order);
CREATE INDEX idx_section_content_key ON public.section_content(section_key);

-- Create trigger for updated_at
CREATE TRIGGER update_site_sections_updated_at
  BEFORE UPDATE ON public.site_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON public.hero_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_section_content_updated_at
  BEFORE UPDATE ON public.section_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();