import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOfferTracking = () => {
  const trackedViews = useRef<Set<string>>(new Set());

  const trackView = useCallback(async (offerId: string) => {
    // Prevent duplicate views in the same session
    if (trackedViews.current.has(offerId)) return;
    trackedViews.current.add(offerId);

    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Check if analytics record exists for today
      const { data: existing } = await supabase
        .from('offer_analytics')
        .select('id, views')
        .eq('offer_id', offerId)
        .eq('date', today)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('offer_analytics')
          .update({ views: existing.views + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('offer_analytics')
          .insert({ offer_id: offerId, date: today, views: 1, clicks: 0, conversions: 0, revenue_generated: 0 });
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, []);

  const trackClick = useCallback(async (offerId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data: existing } = await supabase
        .from('offer_analytics')
        .select('id, clicks')
        .eq('offer_id', offerId)
        .eq('date', today)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('offer_analytics')
          .update({ clicks: existing.clicks + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('offer_analytics')
          .insert({ offer_id: offerId, date: today, views: 0, clicks: 1, conversions: 0, revenue_generated: 0 });
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }, []);

  const trackConversion = useCallback(async (offerId: string, revenue: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data: existing } = await supabase
        .from('offer_analytics')
        .select('id, conversions, revenue_generated')
        .eq('offer_id', offerId)
        .eq('date', today)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('offer_analytics')
          .update({ 
            conversions: existing.conversions + 1,
            revenue_generated: Number(existing.revenue_generated) + revenue
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('offer_analytics')
          .insert({ 
            offer_id: offerId, 
            date: today, 
            views: 0, 
            clicks: 0, 
            conversions: 1, 
            revenue_generated: revenue 
          });
      }
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }, []);

  return { trackView, trackClick, trackConversion };
};

// Hook to automatically track views when offers are visible
export const useOfferViewTracking = (offerId: string | null, isVisible: boolean = true) => {
  const { trackView } = useOfferTracking();

  useEffect(() => {
    if (offerId && isVisible) {
      trackView(offerId);
    }
  }, [offerId, isVisible, trackView]);
};
