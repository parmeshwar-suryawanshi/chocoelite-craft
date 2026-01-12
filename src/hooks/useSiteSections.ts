import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSection {
  id: string;
  section_key: string;
  section_name: string;
  is_visible: boolean;
  display_order: number;
  description: string | null;
}

export const useSiteSections = () => {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const isSectionVisible = (sectionKey: string): boolean => {
    const section = sections.find(s => s.section_key === sectionKey);
    return section ? section.is_visible : true; // Default to visible if not found
  };

  const getVisibleSections = (): SiteSection[] => {
    return sections.filter(s => s.is_visible).sort((a, b) => a.display_order - b.display_order);
  };

  return {
    sections,
    loading,
    isSectionVisible,
    getVisibleSections,
    refetch: fetchSections,
  };
};
