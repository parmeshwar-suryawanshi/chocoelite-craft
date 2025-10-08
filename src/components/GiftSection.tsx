import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Heart, Briefcase, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

const GiftSection = () => {
  const giftBoxes = [
    {
      icon: Heart,
      name: 'Love Collection',
      description: 'Perfect for anniversaries, Valentine\'s Day, or just because you care.',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop',
      includes: '8 assorted fruit chocolates, gift card, premium packaging',
    },
    {
      icon: PartyPopper,
      name: 'Celebration Box',
      description: 'Make every celebration sweeter with our luxurious collection.',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop',
      includes: '12 premium chocolates, festive ribbon, personalized message',
    },
    {
      icon: Briefcase,
      name: 'Corporate Gifting',
      description: 'Impress clients and reward teams with elegant chocolate gifts.',
      price: 2999,
      image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop',
      includes: '20 signature chocolates, custom branding, bulk discounts available',
    },
  ];

  return (
    <section className="py-20 bg-luxury-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-luxury mb-6">
            <Gift className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient-luxury">
            Perfect Gifts for Your Loved Ones
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Express your love and appreciation with our beautifully curated gift boxes. Each box is
            a celebration of taste and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {giftBoxes.map((box, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover-lift border-none shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm">
                    <box.icon className="h-6 w-6 text-luxury-brown" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-display font-bold mb-2">{box.name}</h3>
                <p className="text-muted-foreground mb-4">{box.description}</p>
                <div className="text-sm text-muted-foreground mb-4">
                  <p className="font-semibold text-foreground">Includes:</p>
                  <p>{box.includes}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-luxury-brown">₹{box.price}</p>
                  <Button className="gradient-luxury text-white hover:opacity-90">
                    Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block gradient-luxury rounded-2xl p-8 md:p-12 text-white shadow-glow">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Corporate Gifting Solutions
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Looking for bulk orders or custom corporate gifts? We offer personalized packaging,
              custom flavors, and special pricing for corporate clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-luxury-brown hover:bg-white/90 font-semibold"
              >
                <Link to="/contact">Request Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-luxury-brown font-semibold bg-white/10 backdrop-blur-sm"
              >
                <a href="tel:+918042781962">Call: +91 8042781962</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftSection;
