import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Percent, Clock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50/50 via-background to-amber-50/30">
      <div className="container mx-auto px-4">
        {/* Main Banner Offer */}
        <div className="mb-12 relative overflow-hidden rounded-3xl gradient-luxury p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 text-white text-center">
            <Badge className="mb-4 bg-amber-400/20 text-amber-100 border-amber-300/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-1" />
              LIMITED TIME OFFER
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Buy 2 Get 1 FREE!
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto text-amber-100/95">
              Purchase any 2 chocolates and get 1 of equal or lesser value absolutely free!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm mb-6 text-amber-200">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Offer valid for next 7 days only!</span>
            </div>
            <Link to="/shop">
              <Button size="lg" className="bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-lg font-semibold">
                Shop Now & Save
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-300/10 rounded-full blur-3xl" />
        </div>

        {/* Additional Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg overflow-hidden group hover-lift bg-card">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4 group-hover:scale-110 transition-transform">
                <Percent className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Flat 20% OFF</h3>
              <p className="text-muted-foreground mb-3">
                On orders above ₹999
              </p>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                Use code: CHOCO20
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden group hover-lift bg-card">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4 group-hover:scale-110 transition-transform">
                <Gift className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Free Gift Wrapping</h3>
              <p className="text-muted-foreground mb-3">
                Premium packaging on all orders
              </p>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                No code needed
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden group hover-lift bg-card">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4 group-hover:scale-110 transition-transform">
                <Truck className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Free Delivery</h3>
              <p className="text-muted-foreground mb-3">
                On orders above ₹1000
              </p>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                Mumbai & Pune
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Festive Season Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8 border border-amber-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <Badge className="mb-3 bg-amber-500 text-white hover:bg-amber-600">
                FESTIVE SEASON SPECIAL
              </Badge>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                Combo Packs Starting at ₹199!
              </h3>
              <p className="text-muted-foreground">
                Mix & match your favorite flavors and save big. Perfect for gifting or treating yourself!
              </p>
            </div>
            <Link to="/shop">
              <Button size="lg" className="gradient-luxury text-white hover:opacity-90">
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