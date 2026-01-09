import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionSkeleton } from '@/components/ui/section-skeleton';

interface LimitedProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  in_stock: boolean;
}

const LimitedEdition = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 12,
    minutes: 34,
    seconds: 56,
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['limited-edition-product'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, image, price, in_stock')
        .eq('limited_edition', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as LimitedProduct | null;
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionSkeleton variant="banner" />
        </div>
      </section>
    );
  }

  if (!product) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <Clock className="h-5 w-5 text-destructive animate-pulse" />
            <span className="text-destructive font-semibold">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient-luxury">
            {product.name}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {product.description}
          </p>

          <div className="flex justify-center gap-4 md:gap-8 mb-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-luxury text-white rounded-lg p-4 md:p-6 shadow-glow mb-2 min-w-[70px] md:min-w-[100px]">
                  <span className="text-3xl md:text-5xl font-bold font-display">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button asChild size="lg" className="gradient-luxury text-white hover:opacity-90 font-semibold px-8">
              <Link to={`/shop/${product.id}`}>Shop Now - ₹{product.price}</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-destructive">Limited stock</span> available
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            * Offer ends when stock runs out or timer expires, whichever comes first
          </p>
        </div>
      </div>
    </section>
  );
};

export default LimitedEdition;
