import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Percent, Clock, Truck, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const SpecialOffers = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/60 via-background to-orange-50/40 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Hot Deals
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
            Special Offers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Grab these exclusive deals before they're gone!
          </p>
        </div>

        {/* Main Banner Offer */}
        <div className="mb-14 relative overflow-hidden rounded-3xl shadow-2xl group">
          {/* Animated gradient background */}
          <div className="absolute inset-0 gradient-luxury" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi02djJIMjZ2LTJoOHptNC0ydjJIMjJ2LTJoMTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative z-10 p-10 md:p-16 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left flex-1">
                <Badge className="mb-5 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  LIMITED TIME OFFER
                </Badge>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">
                  Buy 2 Get 1 FREE!
                </h2>
                <p className="text-lg md:text-xl mb-6 max-w-xl text-amber-100/95 leading-relaxed">
                  Purchase any 2 chocolates and get 1 of equal or lesser value absolutely free!
                </p>
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                  <Clock className="h-5 w-5 text-amber-200" />
                  <span className="font-semibold text-amber-100">Offer valid for next 7 days only!</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <Link to="/shop">
                  <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50 shadow-xl font-bold px-10 py-7 text-lg group/btn transition-all duration-300 hover:scale-105">
                    Shop Now & Save
                    <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <span className="text-sm text-amber-200/80">No code required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          <Card className="border-none shadow-xl overflow-hidden group hover-lift bg-card/90 backdrop-blur-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <CardContent className="p-8 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Percent className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-amber-700 transition-colors">Flat 20% OFF</h3>
              <p className="text-muted-foreground mb-5">
                On orders above ₹999
              </p>
              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 px-4 py-2 text-sm font-semibold shadow-sm">
                Use code: CHOCO20
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl overflow-hidden group hover-lift bg-card/90 backdrop-blur-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <CardContent className="p-8 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Gift className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-amber-700 transition-colors">Free Gift Wrapping</h3>
              <p className="text-muted-foreground mb-5">
                Premium packaging on all orders
              </p>
              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 px-4 py-2 text-sm font-semibold shadow-sm">
                No code needed
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl overflow-hidden group hover-lift bg-card/90 backdrop-blur-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <CardContent className="p-8 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-amber-700 transition-colors">Free Delivery</h3>
              <p className="text-muted-foreground mb-5">
                On orders above ₹1000
              </p>
              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 px-4 py-2 text-sm font-semibold shadow-sm">
                Mumbai & Pune
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Festive Season Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-10 md:p-12 border border-amber-200/60 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 px-4 py-1.5">
                <Sparkles className="h-4 w-4 mr-2" />
                FESTIVE SEASON SPECIAL
              </Badge>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Combo Packs Starting at ₹199!
              </h3>
              <p className="text-muted-foreground text-lg">
                Mix & match your favorite flavors and save big. Perfect for gifting or treating yourself!
              </p>
            </div>
            <Link to="/shop">
              <Button size="lg" className="gradient-luxury text-white hover:opacity-90 shadow-xl px-10 py-7 text-lg font-semibold group/btn transition-all duration-300 hover:scale-105">
                Explore Combos
                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
