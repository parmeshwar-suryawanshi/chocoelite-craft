import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-purple-pink"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/30 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/25 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <p className="text-white text-sm font-medium">Fruit at Every Bite</p>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            ChocoElite
            <br />
            <span className="text-white/90">Guilt-Free Indulgence,</span>
            <br />
            <span className="text-white/90">Pure Fruit Pleasure!</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience chocolate reimagined with real fruits—a luxurious fusion of cocoa
            and nature that delights your senses and nourishes your body.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection("products")}
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-xl"
            >
              Explore Products
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-secondary font-semibold px-8 py-6 text-lg backdrop-blur-sm bg-white/10"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce cursor-pointer"
        aria-label="Scroll to content"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
};

export default Hero;
