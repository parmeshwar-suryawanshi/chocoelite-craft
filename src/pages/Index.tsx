import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import LoyaltySection from "@/components/LoyaltySection";
import GiftSection from "@/components/GiftSection";
import LimitedEdition from "@/components/LimitedEdition";
import CraftVideo from "@/components/CraftVideo";
import SpecialOffers from "@/components/SpecialOffers";
import WhatsAppBot from "@/components/WhatsAppBot";
import LuckyWinners from "@/components/LuckyWinners";
import ComboOffers from "@/components/ComboOffers";
import FestivalOffers from "@/components/FestivalOffers";
import { useSiteSections } from "@/hooks/useSiteSections";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { isSectionVisible, loading } = useSiteSections();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <div className="space-y-4 w-full max-w-4xl px-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO />
      <div className="min-h-screen">
        <Navbar />
        <main>
          {isSectionVisible('hero') && <Hero />}
          {isSectionVisible('special-offers') && <SpecialOffers />}
          {isSectionVisible('products') && <Products />}
          {isSectionVisible('combo-offers') && <ComboOffers />}
          {isSectionVisible('festival-offers') && <FestivalOffers />}
          {isSectionVisible('limited-edition') && <LimitedEdition />}
          {isSectionVisible('craft-video') && <CraftVideo />}
          {isSectionVisible('about') && <About />}
          {isSectionVisible('gift-section') && <GiftSection />}
          {isSectionVisible('gallery') && <Gallery />}
          {isSectionVisible('lucky-winners') && <LuckyWinners />}
          {isSectionVisible('testimonials') && <Testimonials />}
          {isSectionVisible('loyalty') && <LoyaltySection />}
          {isSectionVisible('newsletter') && <Newsletter />}
          {isSectionVisible('contact') && <Contact />}
        </main>
        <Footer />
        <WhatsAppBot />
      </div>
    </>
  );
};

export default Index;
