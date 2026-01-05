-- Create gallery_images table for managing gallery content
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table for managing video content
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_type TEXT DEFAULT 'youtube', -- youtube, vimeo, direct
  duration TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create combo_offers table for combo deals
CREATE TABLE public.combo_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  image_url TEXT,
  product_ids JSONB DEFAULT '[]'::jsonb, -- Array of product IDs in combo
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create festival_offers table for festival/seasonal offers
CREATE TABLE public.festival_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  festival_name TEXT NOT NULL, -- Diwali, Christmas, Valentine's, etc.
  banner_image TEXT,
  discount_type TEXT DEFAULT 'percentage', -- percentage, fixed
  discount_value NUMERIC,
  code TEXT,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lucky_winners table for lucky draw/winner management
CREATE TABLE public.lucky_winners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  winner_name TEXT NOT NULL,
  winner_email TEXT,
  winner_phone TEXT,
  prize_description TEXT NOT NULL,
  prize_image TEXT,
  draw_date DATE NOT NULL,
  campaign_name TEXT NOT NULL,
  winner_image TEXT,
  testimonial TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table for general site configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT DEFAULT 'general', -- general, banner, contact, social
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festival_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucky_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for active content
CREATE POLICY "Anyone can view active gallery images" 
ON public.gallery_images FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active videos" 
ON public.videos FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active combo offers" 
ON public.combo_offers FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active festival offers" 
ON public.festival_offers FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active lucky winners" 
ON public.lucky_winners FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view site settings" 
ON public.site_settings FOR SELECT 
USING (true);

-- Admin management policies
CREATE POLICY "Admins can manage gallery images" 
ON public.gallery_images FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage videos" 
ON public.videos FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage combo offers" 
ON public.combo_offers FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage festival offers" 
ON public.festival_offers FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage lucky winners" 
ON public.lucky_winners FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage site settings" 
ON public.site_settings FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_combo_offers_updated_at
BEFORE UPDATE ON public.combo_offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_festival_offers_updated_at
BEFORE UPDATE ON public.festival_offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lucky_winners_updated_at
BEFORE UPDATE ON public.lucky_winners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();