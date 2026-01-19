import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Percent, Clock, Truck, ArrowRight, Zap, Timer, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useOfferTracking, useOfferViewTracking } from '@/hooks/useOfferTracking';
import { useSectionStyle, generateSectionStyles } from '@/hooks/useSectionStyles';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  code: string | null;
  min_order_amount: number;
  is_active: boolean;
}

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
  is_featured: boolean;
  badge_text: string | null;
  banner_image: string | null;
}

const CountdownTimer = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-3 md:gap-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={index} className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[50px] md:min-w-[70px] border border-white/30">
            <span className="text-xl md:text-3xl font-bold font-display text-white">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs mt-1 text-amber-100/80">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

const FeaturedOfferBanner = ({ offer, onTrackClick }: { offer: LimitedTimeOffer; onTrackClick: (id: string) => void }) => {
  useOfferViewTracking(offer.id);

  const handleClick = () => {
    onTrackClick(offer.id);
  };

  return (
    <div className="mb-14 relative overflow-hidden rounded-3xl shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />
      {offer.banner_image && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${offer.banner_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi02djJIMjZ2LTJoOHptNC0ydjJIMjJ2LTJoMTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 p-8 md:p-12 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left flex-1">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm animate-pulse">
                <Flame className="h-4 w-4 mr-2" />
                {offer.badge_text || 'LIMITED TIME'}
              </Badge>
              <Badge className="bg-red-500/50 text-white border-red-400/30 backdrop-blur-sm px-3 py-1">
                <Timer className="h-3 w-3 mr-1" />
                Ends Soon
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 drop-shadow-lg">
              {offer.title}
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-xl text-white/90 leading-relaxed">
              {offer.description}
            </p>
            {offer.discount_value && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="font-bold text-lg">
                  {offer.discount_type === 'percentage' 
                    ? `${offer.discount_value}% OFF` 
                    : `₹${offer.discount_value} OFF`}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-amber-100 mb-3 font-medium">Offer ends in:</p>
              <CountdownTimer endDate={offer.end_date} />
            </div>
            <Link to="/shop" onClick={handleClick}>
              <Button size="lg" className="bg-white text-red-600 hover:bg-amber-50 shadow-xl font-bold px-10 py-7 text-lg group/btn transition-all duration-300 hover:scale-105">
                Grab This Deal
                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {offer.code && (
              <span className="text-sm text-amber-100/80">
                Use code: <span className="font-bold text-white">{offer.code}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecialOffers = () => {
  const { trackClick } = useOfferTracking();
  const { style } = useSectionStyle('special-offers');
  const styles = generateSectionStyles(style);

  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Offer[];
    }
  });

  const { data: featuredOffer, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-limited-offer'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('limited_time_offers')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as LimitedTimeOffer | null;
    }
  });

  const isLoading = offersLoading || featuredLoading;

  const getOfferIcon = (index: number) => {
    const icons = [Percent, Gift, Truck];
    const Icon = icons[index % icons.length];
    return <Icon className="h-10 w-10 text-white" style={{ color: style.icon_color || '#ffffff' }} />;
  };

  // Find the main banner offer (Buy 2 Get 1 type)
  const mainOffer = offers?.find(o => o.title.toLowerCase().includes('buy') && o.title.toLowerCase().includes('get'));
  const gridOffers = offers?.filter(o => o.id !== mainOffer?.id).slice(0, 3);

  // Animation class based on style settings
  const getAnimationClass = () => {
    switch (style.animation_type) {
      case 'fade-in': return 'animate-fade-in';
      case 'fade-up': return 'animate-fade-in-up';
      case 'fade-down': return 'animate-fade-in-down';
      case 'zoom-in': return 'animate-scale-in';
      default: return '';
    }
  };

  // Hover effect class
  const getHoverClass = () => {
    switch (style.card_hover_effect) {
      case 'lift': return 'hover:-translate-y-2';
      case 'scale': return 'hover:scale-105';
      case 'glow': return 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]';
      case 'shadow': return 'hover:shadow-2xl';
      case 'shadow-glow': return 'hover:shadow-xl hover:shadow-amber-200/50';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <section className={`${style.padding_top} ${style.padding_bottom}`} style={styles.containerStyle}>
        <div className={`container mx-auto ${style.padding_x}`}>
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full rounded-3xl mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
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
    <section 
      id="special-offers"
      className={`${style.padding_top} ${style.padding_bottom} relative overflow-hidden`} 
      style={styles.containerStyle}
    >
      {/* Background decorations */}
      <div 
        className="absolute top-20 -left-20 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: `${style.accent_color}30` }}
      />
      <div 
        className="absolute bottom-10 -right-20 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${style.accent_color}25` }}
      />
      
      <div className={`container mx-auto ${style.padding_x} ${style.container_max_width || 'max-w-7xl'} relative z-10`}>
        {/* Section Header */}
        <div className={`mb-12 ${getAnimationClass()}`} style={{ textAlign: style.text_align as any }}>
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={styles.badgeStyle}
          >
            <Zap className="w-4 h-4" />
            Hot Deals
          </span>
          <h2 
            className={`${style.heading_font_size} md:text-5xl font-display ${style.heading_font_weight || 'font-bold'} mb-4 ${style.letter_spacing || ''}`}
            style={styles.headingStyle}
          >
            Special Offers
          </h2>
          <p 
            className={`max-w-2xl ${style.text_align === 'center' ? 'mx-auto' : ''} ${style.line_height || ''}`}
            style={styles.subheadingStyle}
          >
            Grab these exclusive deals before they're gone!
          </p>
        </div>

        {/* Featured Limited Time Offer Banner */}
        {featuredOffer && (
          <FeaturedOfferBanner offer={featuredOffer} onTrackClick={trackClick} />
        )}

        {/* Main Banner Offer */}
        {mainOffer && !featuredOffer && (
          <div className={`mb-14 relative overflow-hidden ${style.card_border_radius || 'rounded-3xl'} shadow-2xl group`}>
            <div 
              className="absolute inset-0"
              style={{
                background: style.background_type === 'gradient' 
                  ? `linear-gradient(${style.gradient_angle || '135deg'}, ${style.background_gradient_from || style.button_primary_bg}, ${style.background_gradient_to || style.accent_color})`
                  : `linear-gradient(135deg, ${style.button_primary_bg}, ${style.accent_color})`
              }}
            />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi02djJIMjZ2LTJoOHptNC0ydjJIMjJ2LTJoMTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 p-10 md:p-16 text-white">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left flex-1">
                  <Badge className="mb-5 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    LIMITED TIME OFFER
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">
                    {mainOffer.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-6 max-w-xl text-white/95 leading-relaxed">
                    {mainOffer.description}
                  </p>
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                    <Clock className="h-5 w-5 text-white/80" />
                    <span className="font-semibold text-white/90">Limited time offer!</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <Link to="/shop">
                    <Button 
                      size="lg" 
                      className={`bg-white shadow-xl font-bold px-10 py-7 text-lg group/btn transition-all duration-300 hover:scale-105 ${style.button_primary_border_radius || 'rounded-lg'}`}
                      style={{ color: style.button_primary_bg }}
                    >
                      Shop Now & Save
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <span className="text-sm text-white/80">
                    {mainOffer.code ? `Use code: ${mainOffer.code}` : 'No code required'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Offers Grid */}
        {gridOffers && gridOffers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {gridOffers.map((offer, index) => (
              <Card 
                key={offer.id} 
                className={`border-none ${style.card_shadow} overflow-hidden group ${getHoverClass()} transition-all duration-500 backdrop-blur-sm relative ${style.card_border_radius}`}
                style={{ 
                  backgroundColor: style.card_bg,
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
                  style={{ backgroundColor: `${style.accent_color}30` }}
                />
                <CardContent className="p-8 text-center relative z-10">
                  <div 
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${style.button_primary_bg}, ${style.accent_color})`
                    }}
                  >
                    {getOfferIcon(index)}
                  </div>
                  <h3 
                    className={`text-2xl ${style.heading_font_weight || 'font-bold'} mb-3 transition-colors`}
                    style={styles.headingStyle}
                  >
                    {offer.title}
                  </h3>
                  <p className="mb-5" style={styles.textStyle}>
                    {offer.description}
                  </p>
                  <Badge 
                    className="px-4 py-2 text-sm font-semibold shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${style.badge_bg}20, ${style.accent_color}30)`,
                      color: style.button_primary_bg
                    }}
                  >
                    {offer.code ? `Use code: ${offer.code}` : 'No code needed'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Section Divider */}
        {style.divider_style && style.divider_style !== 'none' && (
          <div 
            className="w-full h-px mt-8"
            style={{ 
              backgroundColor: style.divider_color,
              borderStyle: style.divider_style === 'dashed' ? 'dashed' : style.divider_style === 'dotted' ? 'dotted' : 'solid',
              borderWidth: style.divider_style !== 'none' ? '1px 0 0 0' : 0
            }}
          />
        )}
      </div>
    </section>
  );
};

export default SpecialOffers;