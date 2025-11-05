import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { full_name: string };
}

export const useReviews = (productId: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setReviews(data);
      if (user) {
        const myReview = data.find(r => r.user_id === user.id);
        setUserReview(myReview || null);
      }
    }
    setLoading(false);
  };

  const submitReview = async (rating: number, comment: string) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to leave a review' });
      return;
    }

    const reviewData = { product_id: productId, user_id: user.id, rating, comment };

    if (userReview) {
      const { error } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', userReview.id);
      
      if (error) {
        toast({ title: 'Error updating review', variant: 'destructive' });
      } else {
        toast({ title: 'Review updated successfully' });
        fetchReviews();
      }
    } else {
      const { error } = await supabase.from('reviews').insert(reviewData);
      
      if (error) {
        toast({ title: 'Error submitting review', variant: 'destructive' });
      } else {
        toast({ title: 'Review submitted successfully' });
        fetchReviews();
      }
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return { reviews, userReview, submitReview, averageRating, loading };
};
