import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero"
    >
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Golden Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-luxury-gold rounded-full animate-particle opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Warm Glowing Orbs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-amber-400/30 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-l from-amber-500/25 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating Chocolate Images */}
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop" 
          alt="" 
          className="absolute top-20 left-[5%] w-24 h-24 md:w-32 md:h-32 rounded-full object-cover animate-float-slow blur-[1px] shadow-2xl"
        />
        <img 
          src="https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=300&h=200&fit=crop" 
          alt="" 
          className="absolute top-32 right-[8%] w-32 h-20 md:w-40 md:h-24 rounded-lg object-cover animate-float-slow blur-[1px] shadow-2xl" 
          style={{ animationDelay: "1s" }}
        />
        <img 
          src="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=200&h=200&fit=crop" 
          alt="" 
          className="absolute top-1/2 left-[10%] w-20 h-20 md:w-28 md:h-28 rounded-full object-cover animate-float-slow blur-[1px] shadow-2xl" 
          style={{ animationDelay: "2s" }}
        />
        <img 
          src="https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=250&h=250&fit=crop" 
          alt="" 
          className="absolute bottom-32 right-[5%] w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover animate-float-slow blur-[1px] shadow-2xl" 
          style={{ animationDelay: "0.5s" }}
        />
        <img 
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop" 
          alt="" 
          className="absolute bottom-20 left-[12%] w-20 h-20 md:w-24 md:h-24 rounded-full object-cover animate-float-slow blur-[1px] shadow-2xl" 
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 shadow-2xl animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <p className="text-amber-100 text-sm font-semibold tracking-wide">Fruit at Every Bite</p>
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight">
            <span className="inline-block animate-slide-in-left">ChocoElite</span>
            <br />
            <span className="inline-block text-amber-100/95 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
              Guilt-Free Indulgence,
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
              Pure Fruit Pleasure!
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-amber-100/85 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Experience chocolate reimagined with real fruits—a luxurious fusion of cocoa
            and nature that delights your senses and nourishes your body.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <Button
              asChild
              size="lg"
              className="group relative bg-amber-500 text-amber-950 hover:bg-amber-400 font-semibold px-10 py-7 text-lg shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105"
            >
              <Link to="/shop">
                <span className="relative z-10">Shop Now</span>
              </Link>
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              variant="outline"
              className="group relative border-2 border-amber-400/50 text-amber-100 hover:bg-amber-500 hover:text-amber-950 hover:border-amber-500 font-semibold px-10 py-7 text-lg backdrop-blur-md bg-amber-500/10 shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Get in Touch</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection("products")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-amber-300 animate-bounce-slow cursor-pointer group"
        aria-label="Scroll to content"
      >
        <div className="relative">
          <ChevronDown className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 h-8 w-8 bg-amber-400/20 rounded-full blur-md animate-pulse" />
        </div>
      </button>
    </section>
  );
};

export default Hero;