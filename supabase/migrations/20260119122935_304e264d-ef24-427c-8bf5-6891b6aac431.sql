-- Add more style columns to section_styles table for enhanced customization
ALTER TABLE section_styles 
ADD COLUMN IF NOT EXISTS animation_type VARCHAR(50) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS animation_duration VARCHAR(20) DEFAULT '300ms',
ADD COLUMN IF NOT EXISTS animation_delay VARCHAR(20) DEFAULT '0ms',
ADD COLUMN IF NOT EXISTS border_width VARCHAR(20) DEFAULT '0',
ADD COLUMN IF NOT EXISTS border_color VARCHAR(50) DEFAULT '#e5e7eb',
ADD COLUMN IF NOT EXISTS border_style VARCHAR(20) DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS font_family VARCHAR(100) DEFAULT 'inherit',
ADD COLUMN IF NOT EXISTS heading_font_weight VARCHAR(20) DEFAULT 'bold',
ADD COLUMN IF NOT EXISTS text_font_weight VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS letter_spacing VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS line_height VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS hover_effect VARCHAR(50) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS overlay_color VARCHAR(50) DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS icon_color VARCHAR(50) DEFAULT '#8B4513',
ADD COLUMN IF NOT EXISTS icon_size VARCHAR(20) DEFAULT '24px',
ADD COLUMN IF NOT EXISTS divider_style VARCHAR(50) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS divider_color VARCHAR(50) DEFAULT '#e5e7eb',
ADD COLUMN IF NOT EXISTS container_max_width VARCHAR(20) DEFAULT 'max-w-7xl',
ADD COLUMN IF NOT EXISTS text_align VARCHAR(20) DEFAULT 'center',
ADD COLUMN IF NOT EXISTS card_hover_effect VARCHAR(50) DEFAULT 'shadow',
ADD COLUMN IF NOT EXISTS button_hover_effect VARCHAR(50) DEFAULT 'darken',
ADD COLUMN IF NOT EXISTS gradient_angle VARCHAR(20) DEFAULT '135deg',
ADD COLUMN IF NOT EXISTS particles_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS particles_color VARCHAR(50) DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS particles_count INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS particles_speed VARCHAR(20) DEFAULT 'medium';

-- Update existing section styles with new defaults
UPDATE section_styles SET 
  animation_type = 'fade-in',
  hover_effect = 'lift',
  card_hover_effect = 'shadow-glow',
  button_hover_effect = 'scale'
WHERE section_key IN ('products', 'special-offers', 'combo-offers', 'festival-offers');

-- Update hero with particles enabled
UPDATE section_styles SET 
  particles_enabled = true,
  particles_color = '#ffffff',
  particles_count = 40,
  particles_speed = 'slow',
  animation_type = 'fade-up'
WHERE section_key = 'hero';

-- Update navbar and footer
UPDATE section_styles SET 
  animation_type = 'none',
  particles_enabled = false
WHERE section_key IN ('navbar', 'footer');