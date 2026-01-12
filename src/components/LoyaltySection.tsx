import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Award, Sparkles, Crown, Heart, Leaf, Target, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoyaltyTier {
  id: string;
  name: string;
  icon: string;
  color_from: string;
  color_to: string;
  points_min: number;
  points_max: number | null;
  benefits: string[];
}

interface EarnRule {
  id: string;
  points_value: number;
  description: string;
}

const iconMap: Record<string, React.ElementType> = {
  Gift,
  Award,
  Sparkles,
  Crown,
  Heart,
  Leaf,
  Target,
  Eye,
};

const LoyaltySection = () => {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [earnRules, setEarnRules] = useState<EarnRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [tiersRes, rulesRes] = await Promise.all([
        supabase
          .from('loyalty_tiers')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('loyalty_earn_rules')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
      ]);

      if (tiersRes.data) {
        // Parse benefits if they're stored as JSON strings
        const parsedTiers = tiersRes.data.map(tier => ({
          ...tier,
          benefits: typeof tier.benefits === 'string' 
            ? JSON.parse(tier.benefits) 
            : (Array.isArray(tier.benefits) ? tier.benefits : []),
        }));
        setTiers(parsedTiers);
      }
      if (rulesRes.data) setEarnRules(rulesRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Fallback to default tiers if no data
  const displayTiers = tiers.length > 0 ? tiers : [
    {
      id: '1',
      icon: 'Gift',
      name: 'Bronze',
      points_min: 0,
      points_max: 999,
      benefits: ['5% off on all orders', 'Birthday surprise', 'Early access to sales'],
      color_from: 'orange-400',
      color_to: 'orange-600',
    },
    {
      id: '2',
      icon: 'Award',
      name: 'Silver',
      points_min: 1000,
      points_max: 2999,
      benefits: ['10% off on all orders', 'Free shipping', 'Exclusive flavors', 'Priority support'],
      color_from: 'gray-300',
      color_to: 'gray-500',
    },
    {
      id: '3',
      icon: 'Sparkles',
      name: 'Gold',
      points_min: 3000,
      points_max: 4999,
      benefits: ['15% off on all orders', 'Free gift wrapping', 'VIP events', 'Personalization'],
      color_from: 'yellow-400',
      color_to: 'yellow-600',
    },
    {
      id: '4',
      icon: 'Crown',
      name: 'Platinum',
      points_min: 5000,
      points_max: null,
      benefits: ['20% off on all orders', 'Concierge service', 'Custom creations', 'Annual gift'],
      color_from: 'purple-400',
      color_to: 'purple-600',
    },
  ];

  const displayRules = earnRules.length > 0 ? earnRules : [
    { id: '1', points_value: 10, description: '₹100 = 10 Points' },
    { id: '2', points_value: 50, description: 'Refer a friend' },
    { id: '3', points_value: 100, description: 'Write a review' },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient-luxury">
            ChocoPoints Rewards
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Earn points with every purchase and unlock exclusive rewards. The more you indulge, the
            more you save!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayTiers.map((tier, index) => {
            const IconComponent = iconMap[tier.icon] || Gift;
            const gradientClass = `from-${tier.color_from} to-${tier.color_to}`;
            
            return (
              <Card
                key={tier.id}
                className="hover-lift shadow-lg border-none overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${gradientClass} mb-4`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tier.points_min}-{tier.points_max || '∞'} points
                  </p>
                  <ul className="text-left space-y-2 text-sm">
                    {(Array.isArray(tier.benefits) ? tier.benefits : []).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-luxury-gold mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center gradient-luxury rounded-2xl p-8 md:p-12 text-white shadow-glow">
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
            How to Earn ChocoPoints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {displayRules.map((rule) => (
              <div key={rule.id}>
                <p className="text-3xl font-bold mb-2">{rule.points_value} Points</p>
                <p className="text-white/90">{rule.description}</p>
              </div>
            ))}
          </div>
          <Button size="lg" className="bg-white text-luxury-brown hover:bg-white/90 font-semibold">
            Join Rewards Program
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LoyaltySection;
