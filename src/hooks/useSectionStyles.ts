import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SectionStyle {
  id: string;
  section_key: string;
  background_type: string;
  background_color: string;
  background_gradient_from: string | null;
  background_gradient_to: string | null;
  background_gradient_direction: string;
  background_image_url: string | null;
  background_overlay_opacity: number;
  heading_color: string;
  heading_font_size: string;
  subheading_color: string;
  text_color: string;
  button_primary_bg: string;
  button_primary_text: string;
  button_primary_border_radius: string;
  button_primary_style: string;
  button_secondary_bg: string;
  button_secondary_text: string;
  button_secondary_border_color: string;
  button_secondary_border_radius: string;
  padding_top: string;
  padding_bottom: string;
  padding_x: string;
  card_bg: string;
  card_border_radius: string;
  card_shadow: string;
  card_border_color: string | null;
  badge_bg: string;
  badge_text: string;
  accent_color: string;
  custom_css: string | null;
}

const defaultStyle: Omit<SectionStyle, 'id' | 'section_key'> = {
  background_type: 'solid',
  background_color: '#ffffff',
  background_gradient_from: null,
  background_gradient_to: null,
  background_gradient_direction: 'to-b',
  background_image_url: null,
  background_overlay_opacity: 0,
  heading_color: '#1a1a1a',
  heading_font_size: 'text-4xl',
  subheading_color: '#6b7280',
  text_color: '#374151',
  button_primary_bg: '#8B4513',
  button_primary_text: '#ffffff',
  button_primary_border_radius: 'rounded-lg',
  button_primary_style: 'solid',
  button_secondary_bg: 'transparent',
  button_secondary_text: '#8B4513',
  button_secondary_border_color: '#8B4513',
  button_secondary_border_radius: 'rounded-lg',
  padding_top: 'pt-20',
  padding_bottom: 'pb-20',
  padding_x: 'px-4',
  card_bg: '#ffffff',
  card_border_radius: 'rounded-xl',
  card_shadow: 'shadow-md',
  card_border_color: null,
  badge_bg: '#8B4513',
  badge_text: '#ffffff',
  accent_color: '#D4A574',
  custom_css: null,
};

export const useSectionStyles = () => {
  return useQuery({
    queryKey: ['section-styles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_styles')
        .select('*');
      
      if (error) throw error;
      return data as SectionStyle[];
    }
  });
};

export const useSectionStyle = (sectionKey: string) => {
  const { data: allStyles, isLoading } = useSectionStyles();
  
  const style = allStyles?.find(s => s.section_key === sectionKey);
  
  return {
    style: style || { ...defaultStyle, section_key: sectionKey, id: '' } as SectionStyle,
    isLoading
  };
};

export const useUpdateSectionStyle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<SectionStyle> & { section_key: string }) => {
      const { section_key, ...styleUpdates } = updates;
      
      const { data, error } = await supabase
        .from('section_styles')
        .update(styleUpdates)
        .eq('section_key', section_key)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-styles'] });
    }
  });
};

// Helper function to generate inline styles from section style
export const generateSectionStyles = (style: SectionStyle) => {
  const containerStyle: React.CSSProperties = {};
  
  if (style.background_type === 'solid') {
    containerStyle.backgroundColor = style.background_color;
  } else if (style.background_type === 'gradient') {
    const from = style.background_gradient_from || style.background_color;
    const to = style.background_gradient_to || style.accent_color;
    containerStyle.background = `linear-gradient(${style.background_gradient_direction.replace('to-', 'to ')}, ${from}, ${to})`;
  } else if (style.background_type === 'image' && style.background_image_url) {
    containerStyle.backgroundImage = `url(${style.background_image_url})`;
    containerStyle.backgroundSize = 'cover';
    containerStyle.backgroundPosition = 'center';
  }
  
  return {
    containerStyle,
    headingStyle: { color: style.heading_color },
    subheadingStyle: { color: style.subheading_color },
    textStyle: { color: style.text_color },
    primaryButtonStyle: {
      backgroundColor: style.button_primary_bg,
      color: style.button_primary_text,
    },
    secondaryButtonStyle: {
      backgroundColor: style.button_secondary_bg,
      color: style.button_secondary_text,
      borderColor: style.button_secondary_border_color,
    },
    cardStyle: {
      backgroundColor: style.card_bg,
      borderColor: style.card_border_color || undefined,
    },
    badgeStyle: {
      backgroundColor: style.badge_bg,
      color: style.badge_text,
    },
    accentColor: style.accent_color,
  };
};
