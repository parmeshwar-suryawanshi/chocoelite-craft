import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Clock, ArrowRight, ChevronLeft, ChevronRight, Flame, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useOfferTracking, useOfferViewTracking } from '@/hooks/useOfferTracking';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface LimitedTimeOffer {
  id: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number | null;
  code: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  badge_text: string | null;
  banner_image: string | null;
}

const CountdownTimer = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        setTimeLeft({
          hours: totalHours,
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-1.5">
      {[
        { label: 'H', value: timeLeft.hours },
        { label: 'M', value: timeLeft.minutes },
        { label: 'S', value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={index} className="text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-md px-2 py-1 min-w-[36px]">
            <span className="text-lg font-bold font-mono text-white">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[10px] mt-0.5 text-white/70">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

const FlashDealCard = ({ offer }: { offer: LimitedTimeOffer }) => {
  const { trackClick } = useOfferTracking();
  
  // Track view when card is rendered
  useOfferViewTracking(offer.id);

  const handleClick = () => {
    trackClick(offer.id);
  };

  const gradients = [
    'from-red-500 via-orange-500 to-amber-500',
    'from-purple-500 via-pink-500 to-rose-500',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-blue-500 via-indigo-500 to-violet-500',
  ];

  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <Card className="border-none overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
      <div className={`relative h-full bg-gradient-to-br ${gradient}`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl" />
        
        <CardContent className="relative z-10 p-5 h-full flex flex-col justify-between min-h-[280px]">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                <Flame className="h-3 w-3 mr-1" />
                {offer.badge_text || 'FLASH DEAL'}
              </Badge>
              <CountdownTimer endDate={offer.end_date} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:scale-105 transition-transform origin-left">
              {offer.title}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2 mb-3">
              {offer.description}
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-3">
            {offer.discount_value && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Zap className="h-4 w-4 text-yellow-200" />
                <span className="font-bold text-white">
                  {offer.discount_type === 'percentage' 
                    ? `${offer.discount_value}% OFF` 
                    : `₹${offer.discount_value} OFF`}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              {offer.code && (
                <span className="text-xs text-white/80 bg-black/20 px-2 py-1 rounded font-mono">
                  Code: {offer.code}
                </span>
              )}
              <Link to="/shop" onClick={handleClick}>
                <Button 
                  size="sm" 
                  className="bg-white text-gray-900 hover:bg-white/90 shadow-lg font-semibold group/btn"
                >
                  Shop Now
                  <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const FlashDeals = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ['flash-deals'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('limited_time_offers')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as LimitedTimeOffer[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-48 mx-auto mb-3 bg-gray-700" />
            <Skeleton className="h-5 w-72 mx-auto bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl bg-gray-700" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4 border border-red-500/30">
            <Timer className="w-4 h-4 animate-pulse" />
            Limited Time Only
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            ⚡ Flash Deals
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Grab these exclusive offers before they expire! These deals won't last long.
          </p>
        </div>

        {/* Carousel for mobile, grid for desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <FlashDealCard key={offer.id} offer={offer} />
          ))}
        </div>

        <div className="md:hidden">
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {offers.map((offer) => (
                <CarouselItem key={offer.id} className="pl-2 md:pl-4 basis-[85%]">
                  <FlashDealCard offer={offer} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="right-2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </Carousel>
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 group">
              View All Deals
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
