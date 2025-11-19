import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Percent, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        {/* Main Banner Offer */}
        <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary via-accent to-primary p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 text-white text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-1" />
              LIMITED TIME OFFER
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Buy 2 Get 1 FREE! 🎉
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto opacity-95">
              Purchase any 2 chocolates and get 1 of equal or lesser value absolutely free!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Offer valid for next 7 days only!</span>
            </div>
            <Link to="/shop">
              <Button size="lg" className="bg-white text-secondary hover:bg-white/90 shadow-lg">
                Shop Now & Save
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Additional Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg overflow-hidden group hover-lift">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 group-hover:scale-110 transition-transform">
                <Percent className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flat 20% OFF</h3>
              <p className="text-muted-foreground mb-3">
                On orders above ₹999
              </p>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Use code: CHOCO20
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden group hover-lift">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 group-hover:scale-110 transition-transform">
                <Gift className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Gift Wrapping</h3>
              <p className="text-muted-foreground mb-3">
                Premium packaging on all orders
              </p>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                No code needed
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden group hover-lift">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
              <p className="text-muted-foreground mb-3">
                On orders above ₹499
              </p>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                All India
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Festive Season Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8 border-2 border-amber-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <Badge className="mb-3 bg-amber-500 text-white">
                🎊 FESTIVE SEASON SPECIAL
              </Badge>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-primary mb-2">
                Combo Packs Starting at ₹199!
              </h3>
              <p className="text-muted-foreground">
                Mix & match your favorite flavors and save big. Perfect for gifting or treating yourself!
              </p>
            </div>
            <Link to="/shop">
              <Button size="lg" className="gradient-luxury text-white">
                Explore Combos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
