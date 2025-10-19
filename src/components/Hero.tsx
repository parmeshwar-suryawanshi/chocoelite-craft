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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#6B2D8F] via-[#5B2B7E] to-[#4B1F6E]"
    >
      {/* Illustrated Pattern Background - Similar to Cadbury */}
      <div className="absolute inset-0 opacity-[0.08]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="chocolate-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Chocolate Bar */}
              <rect x="10" y="20" width="60" height="80" fill="none" stroke="currentColor" strokeWidth="2" rx="4"/>
              <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="2"/>
              <line x1="10" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="2"/>
              <line x1="10" y1="80" x2="70" y2="80" stroke="currentColor" strokeWidth="2"/>
              <line x1="30" y1="20" x2="30" y2="100" stroke="currentColor" strokeWidth="2"/>
              <line x1="50" y1="20" x2="50" y2="100" stroke="currentColor" strokeWidth="2"/>
              
              {/* Milk Bottle */}
              <ellipse cx="145" cy="35" rx="15" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
              <rect x="130" y="35" width="30" height="50" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
              <rect x="140" y="25" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="2"/>
              
              {/* Cacao Pod */}
              <ellipse cx="45" cy="150" rx="20" ry="30" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M 45 120 Q 50 135 45 150" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M 45 120 Q 40 135 45 150" stroke="currentColor" strokeWidth="2" fill="none"/>
              
              {/* Chocolate Chunk */}
              <path d="M 120 140 L 150 145 L 155 170 L 130 175 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="135" cy="155" r="3" fill="currentColor"/>
              <circle cx="145" cy="160" r="3" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chocolate-pattern)" className="text-white"/>
        </svg>
      </div>

      {/* Floating Chocolate Product Images */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left chocolate bar */}
        <img 
          src="https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=250&h=400&fit=crop&q=80"
          alt=""
          className="absolute left-[5%] top-[20%] w-32 md:w-48 opacity-80 animate-float-slow"
          style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
        />
        
        {/* Right chocolate pieces */}
        <img 
          src="https://images.unsplash.com/photo-1511381939415-e44015466834?w=300&h=300&fit=crop&q=80"
          alt=""
          className="absolute right-[8%] top-[25%] w-40 md:w-56 opacity-80 animate-float-slow"
          style={{ animationDelay: '1s', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
        />
        
        {/* Bottom right chocolate bar */}
        <img 
          src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=250&h=350&fit=crop&q=80"
          alt=""
          className="absolute right-[5%] bottom-[15%] w-28 md:w-40 opacity-70 animate-float-slow"
          style={{ animationDelay: '2s', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
        />
      </div>

      {/* Glowing accent effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-400 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-400 blur-[120px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Brand Name in Gold/Yellow */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-6 leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)]">
                ChocoElite
              </span>
            </h1>
            <div className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-4 leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
              FRUIT CHOCOLATE
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in-up drop-shadow-lg" style={{ animationDelay: "0.2s" }}>
            Made with real fruits and premium cocoa... It's the guilt-free indulgence that's unmistakably ChocoElite.
          </p>

          {/* CTA Button - Yellow like Cadbury */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button
              onClick={() => scrollToSection("products")}
              size="lg"
              className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 border-none"
            >
              <span className="relative z-10">SHOP NOW</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 animate-bounce-slow cursor-pointer group"
        aria-label="Scroll to content"
      >
        <div className="relative">
          <ChevronDown className="h-10 w-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
          <div className="absolute inset-0 h-10 w-10 bg-white/20 rounded-full blur-md animate-pulse" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
