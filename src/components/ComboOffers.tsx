import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface ComboOffer {
  id: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  image_url: string | null;
  is_active: boolean;
}

const ComboOffers = () => {
  const { data: combos, isLoading } = useQuery({
    queryKey: ['combo-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combo_offers')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as ComboOffer[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!combos || combos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-amber-50/30 relative overflow-hidden">
      <div className="absolute top-10 -right-20 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            <Package className="w-4 h-4" />
            Value Packs
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
            Combo Offers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get more value with our specially curated combo packs. Mix & match your favorites!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combos.map((combo, index) => {
            const savings = combo.original_price - combo.discounted_price;
            const savingsPercent = Math.round((savings / combo.original_price) * 100);
            
            return (
              <Card
                key={combo.id}
                className="group overflow-hidden hover-lift border-none shadow-xl bg-card relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {combo.image_url && (
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={combo.image_url}
                      alt={combo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white border-none">
                      Save {savingsPercent}%
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-700 transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {combo.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground line-through">₹{combo.original_price}</span>
                      <p className="text-2xl font-bold text-luxury-brown">₹{combo.discounted_price}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                      Save ₹{savings}
                    </Badge>
                  </div>
                  <Link to="/shop">
                    <Button className="w-full gradient-luxury text-white hover:opacity-90">
                      Add to Cart
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComboOffers;
