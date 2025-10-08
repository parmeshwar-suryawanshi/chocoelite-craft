import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Award, Sparkles, Crown } from 'lucide-react';

const LoyaltySection = () => {
  const tiers = [
    {
      icon: Gift,
      name: 'Bronze',
      points: '0-999',
      benefits: ['5% off on all orders', 'Birthday surprise', 'Early access to sales'],
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: Award,
      name: 'Silver',
      points: '1000-2999',
      benefits: ['10% off on all orders', 'Free shipping', 'Exclusive flavors', 'Priority support'],
      color: 'from-gray-300 to-gray-500',
    },
    {
      icon: Sparkles,
      name: 'Gold',
      points: '3000-4999',
      benefits: ['15% off on all orders', 'Free gift wrapping', 'VIP events', 'Personalization'],
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      icon: Crown,
      name: 'Platinum',
      points: '5000+',
      benefits: ['20% off on all orders', 'Concierge service', 'Custom creations', 'Annual gift'],
      color: 'from-purple-400 to-purple-600',
    },
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
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className="hover-lift shadow-lg border-none overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} mb-4`}
                >
                  <tier.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tier.points} points</p>
                <ul className="text-left space-y-2 text-sm">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-luxury-gold mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center gradient-luxury rounded-2xl p-8 md:p-12 text-white shadow-glow">
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
            How to Earn ChocoPoints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-3xl font-bold mb-2">₹100 = 10 Points</p>
              <p className="text-white/90">Every purchase earns points</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">50 Bonus Points</p>
              <p className="text-white/90">Refer a friend</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">100 Bonus Points</p>
              <p className="text-white/90">Write a review</p>
            </div>
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
