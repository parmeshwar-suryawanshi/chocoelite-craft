-- Create testimonials table for admin-managed testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create about_content table for About section content
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loyalty_tiers table for Loyalty Program
CREATE TABLE public.loyalty_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color_from TEXT NOT NULL,
  color_to TEXT NOT NULL,
  points_min INTEGER NOT NULL,
  points_max INTEGER,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loyalty_earn_rules table for how to earn points
CREATE TABLE public.loyalty_earn_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_type TEXT NOT NULL,
  points_value INTEGER NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create limited_time_offers table with countdown and analytics
CREATE TABLE public.limited_time_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  offer_type TEXT NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC,
  code TEXT,
  product_ids JSONB,
  category_filter TEXT,
  min_order_amount NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  banner_image TEXT,
  badge_text TEXT,
  terms_conditions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offer_analytics table for tracking offer performance
CREATE TABLE public.offer_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES public.limited_time_offers(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  revenue_generated NUMERIC NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(offer_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_earn_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limited_time_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies for all content tables
CREATE POLICY "Anyone can read active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read active about content" ON public.about_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read active loyalty tiers" ON public.loyalty_tiers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read active loyalty earn rules" ON public.loyalty_earn_rules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read active limited time offers" ON public.limited_time_offers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read offer analytics" ON public.offer_analytics
  FOR SELECT USING (true);

-- Admin management policies using correct has_role signature (user_id, role)
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage about content" ON public.about_content
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage loyalty tiers" ON public.loyalty_tiers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage loyalty earn rules" ON public.loyalty_earn_rules
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage limited time offers" ON public.limited_time_offers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage offer analytics" ON public.offer_analytics
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_tiers_updated_at
  BEFORE UPDATE ON public.loyalty_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_earn_rules_updated_at
  BEFORE UPDATE ON public.loyalty_earn_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_limited_time_offers_updated_at
  BEFORE UPDATE ON public.limited_time_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_testimonials_active_order ON public.testimonials(is_active, display_order);
CREATE INDEX idx_about_content_type_order ON public.about_content(content_type, display_order);
CREATE INDEX idx_loyalty_tiers_order ON public.loyalty_tiers(display_order);
CREATE INDEX idx_limited_time_offers_dates ON public.limited_time_offers(start_date, end_date, is_active);
CREATE INDEX idx_offer_analytics_offer_date ON public.offer_analytics(offer_id, date);

-- Insert default testimonials from existing data
INSERT INTO public.testimonials (name, location, rating, text, image_url, display_order) VALUES
('Priya Sharma', 'Mumbai', 5, 'The Custard Apple White Chocolate is absolutely divine! I love that it''s made with real fruits. Finally, guilt-free indulgence that actually tastes premium.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', 1),
('Rahul Verma', 'Delhi', 5, 'Ordered the gift box for my wife''s birthday. The presentation was stunning and every chocolate was perfection. She couldn''t stop raving about it!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', 2),
('Ananya Patel', 'Bangalore', 5, 'As a fitness enthusiast, I appreciate that these chocolates use real fruits and quality ingredients. The Blueberry Dark Chocolate is my go-to post-workout treat!', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', 3),
('Vikram Singh', 'Pune', 5, 'Corporate gifting made easy! Our clients loved the customized ChocoElite gift boxes. Premium quality and beautiful packaging. Highly recommend for business gifting.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 4),
('Neha Gupta', 'Chennai', 5, 'The Mango Milk Chocolate tastes like summer in every bite! So glad I discovered ChocoElite. The quality is unmatched and delivery was super fast.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', 5),
('Arjun Reddy', 'Hyderabad', 5, 'Subscribed to their monthly box and it''s the best decision ever! Each month brings new flavors and every chocolate is crafted to perfection. Worth every rupee!', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', 6);

-- Insert default about content
INSERT INTO public.about_content (content_type, title, description, icon, display_order) VALUES
('intro', 'About ChocoElite', 'At ChocoElite, chocolate is more than just a treat—it''s a rich, guilt-free experience that delights your senses and nourishes your body. We''ve reimagined chocolate with real fruits, crafting a luxurious fusion of cocoa and nature''s finest offerings.', NULL, 1),
('feature', 'Guilt-Free Indulgence', 'Real fruits meet premium chocolate for a healthier, delicious treat you can enjoy without compromise.', 'Heart', 1),
('feature', '100% Natural Fruits', 'We use only the finest, freshest fruits—no artificial flavors, just pure, natural goodness.', 'Leaf', 2),
('feature', 'Premium Quality', 'Every piece is crafted with precision using the finest cocoa and ingredients for an unforgettable experience.', 'Sparkles', 3),
('feature', 'Expert Craftsmanship', 'Our master chocolatiers blend tradition with innovation to create unique, exquisite flavors.', 'Award', 4),
('mission', 'Our Mission', 'To redefine chocolate as a healthy indulgence, bringing joy to every moment with our innovative fruit-infused creations that celebrate both taste and wellness.', 'Target', 1),
('vision', 'Our Vision', 'To become India''s most loved premium chocolate brand, inspiring a healthier relationship with indulgence through nature''s finest ingredients.', 'Eye', 1);

-- Insert default loyalty tiers
INSERT INTO public.loyalty_tiers (name, icon, color_from, color_to, points_min, points_max, benefits, display_order) VALUES
('Bronze', 'Gift', 'orange-400', 'orange-600', 0, 999, '["5% off on all orders", "Birthday surprise", "Early access to sales"]', 1),
('Silver', 'Award', 'gray-300', 'gray-500', 1000, 2999, '["10% off on all orders", "Free shipping", "Exclusive flavors", "Priority support"]', 2),
('Gold', 'Sparkles', 'yellow-400', 'yellow-600', 3000, 4999, '["15% off on all orders", "Free gift wrapping", "VIP events", "Personalization"]', 3),
('Platinum', 'Crown', 'purple-400', 'purple-600', 5000, NULL, '["20% off on all orders", "Concierge service", "Custom creations", "Annual gift"]', 4);

-- Insert default loyalty earn rules
INSERT INTO public.loyalty_earn_rules (rule_type, points_value, description, display_order) VALUES
('purchase', 10, '₹100 = 10 Points', 1),
('referral', 50, 'Refer a friend', 2),
('review', 100, 'Write a review', 3);