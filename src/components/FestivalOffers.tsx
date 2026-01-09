import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Sparkles, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface FestivalOffer {
  id: string;
  title: string;
  description: string;
  festival_name: string;
  discount_type: string;
  discount_value: number;
  banner_image: string | null;
  code: string | null;
  is_active: boolean;
}

const FestivalOffers = () => {
  const { data: festivals, isLoading } = useQuery({
    queryKey: ['festival-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('festival_offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FestivalOffer[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50/50 via-background to-pink-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </section>
    );
  }

  if (!festivals || festivals.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50/50 via-background to-pink-50/30 relative overflow-hidden">
      <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
            <PartyPopper className="w-4 h-4" />
            Celebrate with Us
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
            Festival Specials
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Make every celebration sweeter with our exclusive festival offers
          </p>
        </div>

        <div className="space-y-8">
          {festivals.map((festival, index) => (
            <div
              key={festival.id}
              className="relative overflow-hidden rounded-3xl shadow-2xl group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient or image */}
              {festival.banner_image ? (
                <div className="absolute inset-0">
                  <img
                    src={festival.banner_image}
                    alt={festival.festival_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/70 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400" />
              )}
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 p-10 md:p-16 text-white">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left flex-1">
                    <Badge className="mb-5 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {festival.festival_name}
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 drop-shadow-lg">
                      {festival.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-6 max-w-xl text-white/90 leading-relaxed">
                      {festival.description}
                    </p>
                    {festival.discount_value && (
                      <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <Sparkles className="h-5 w-5 text-yellow-300" />
                        <span className="font-bold text-xl text-yellow-300">
                          {festival.discount_type === 'percentage' 
                            ? `${festival.discount_value}% OFF` 
                            : `₹${festival.discount_value} OFF`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <Link to="/shop">
                      <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 shadow-xl font-bold px-10 py-7 text-lg group/btn transition-all duration-300 hover:scale-105">
                        Shop Festival Collection
                        <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    {festival.code && (
                      <Badge className="bg-yellow-400 text-yellow-900 px-4 py-2 text-sm font-bold">
                        Use code: {festival.code}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestivalOffers;
