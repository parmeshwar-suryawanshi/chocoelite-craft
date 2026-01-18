-- Add navbar and footer section styles
INSERT INTO section_styles (section_key, background_type, background_color, background_gradient_from, background_gradient_to, background_gradient_direction, heading_color, text_color, accent_color, button_primary_bg, button_primary_text)
VALUES 
  ('navbar', 'gradient', '#1a1a1a', '#c026d3', '#9333ea', 'to-r', '#ffffff', '#ffffff', '#d946ef', '#ffffff', '#9333ea'),
  ('footer', 'gradient', '#1a1a1a', '#7c3aed', '#c026d3', 'to-br', '#ffffff', '#e9d5ff', '#d946ef', '#c026d3', '#ffffff')
ON CONFLICT (section_key) DO UPDATE SET
  background_type = EXCLUDED.background_type,
  background_color = EXCLUDED.background_color,
  background_gradient_from = EXCLUDED.background_gradient_from,
  background_gradient_to = EXCLUDED.background_gradient_to,
  background_gradient_direction = EXCLUDED.background_gradient_direction,
  heading_color = EXCLUDED.heading_color,
  text_color = EXCLUDED.text_color,
  accent_color = EXCLUDED.accent_color,
  button_primary_bg = EXCLUDED.button_primary_bg,
  button_primary_text = EXCLUDED.button_primary_text,
  updated_at = now();

-- Update hero section styles to purple-pink theme
UPDATE section_styles 
SET 
  background_type = 'gradient',
  background_gradient_from = '#d946ef',
  background_gradient_to = '#9333ea',
  background_gradient_direction = 'to-b',
  heading_color = '#ffffff',
  text_color = '#ffffff',
  accent_color = '#ffffff',
  button_primary_bg = '#ffffff',
  button_primary_text = '#9333ea',
  button_secondary_bg = '#9333ea',
  button_secondary_text = '#ffffff',
  updated_at = now()
WHERE section_key = 'hero';