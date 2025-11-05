import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id);
    
    if (data) setWishlistItems(data.map(item => item.product_id));
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to use the wishlist' });
      return;
    }

    const isInWishlist = wishlistItems.includes(productId);

    if (isInWishlist) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      setWishlistItems(prev => prev.filter(id => id !== productId));
      toast({ title: 'Removed from wishlist' });
    } else {
      await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: productId });
      
      setWishlistItems(prev => [...prev, productId]);
      toast({ title: 'Added to wishlist' });
    }
  };

  return { wishlistItems, toggleWishlist, isInWishlist: (id: string) => wishlistItems.includes(id) };
};
