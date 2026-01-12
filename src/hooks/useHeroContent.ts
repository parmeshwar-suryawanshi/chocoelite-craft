import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrustIndicator {
  icon: string;
  text: string;
}

export interface HeroContent {
  id: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  badge_text: string | null;
  primary_button_text: string | null;
  primary_button_link: string | null;
  secondary_button_text: string | null;
  secondary_button_link: string | null;
  image_url: string | null;
  video_url: string | null;
  background_type: string;
  background_value: string | null;
  trust_indicators: TrustIndicator[] | null;
  floating_card_1_title: string | null;
  floating_card_1_subtitle: string | null;
  floating_card_2_title: string | null;
  floating_card_2_subtitle: string | null;
  is_active: boolean;
  display_order: number;
}

export const useHeroContent = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [allHeroContents, setAllHeroContents] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroContent = async () => {
    try {
      // Fetch the active hero content with lowest display order
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        // Parse trust_indicators if it's a string
        const parsedData = {
          ...data,
          trust_indicators: typeof data.trust_indicators === 'string' 
            ? JSON.parse(data.trust_indicators) 
            : data.trust_indicators
        };
        setHeroContent(parsedData as HeroContent);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHeroContents = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      const parsedData = (data || []).map(item => ({
        ...item,
        trust_indicators: typeof item.trust_indicators === 'string' 
          ? JSON.parse(item.trust_indicators) 
          : (Array.isArray(item.trust_indicators) ? item.trust_indicators : null)
      }));
      setAllHeroContents(parsedData as HeroContent[]);
    } catch (error) {
      console.error('Error fetching all hero contents:', error);
    }
  };

  useEffect(() => {
    fetchHeroContent();
    fetchAllHeroContents();
  }, []);

  return {
    heroContent,
    allHeroContents,
    loading,
    refetch: () => {
      fetchHeroContent();
      fetchAllHeroContents();
    },
  };
};
