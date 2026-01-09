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

const Index = () => {
  return (
    <>
      <SEO />
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <SpecialOffers />
        <Products />
        <ComboOffers />
        <FestivalOffers />
        <LimitedEdition />
        <CraftVideo />
        <About />
        <GiftSection />
        <Gallery />
        <LuckyWinners />
        <Testimonials />
        <LoyaltySection />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <WhatsAppBot />
    </>
  );
};

export default Index;
