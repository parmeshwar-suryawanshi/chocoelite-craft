import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-purple-pink"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-white/40 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-l from-white/30 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/20 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-white/50 rotate-45 animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border-2 border-white/40 animate-spin-slow" />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 border-2 border-white/60 rotate-12 animate-float-slow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with sparkle animation */}
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-2xl animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
            <p className="text-white text-sm font-semibold tracking-wide">Fruit at Every Bite</p>
            <Sparkles className="h-4 w-4 text-white animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          
          {/* Main Heading with stagger animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight">
            <span className="inline-block animate-slide-in-left">ChocoElite</span>
            <br />
            <span className="inline-block text-white/95 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
              Guilt-Free Indulgence,
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
              Pure Fruit Pleasure!
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Experience chocolate reimagined with real fruits—a luxurious fusion of cocoa
            and nature that delights your senses and nourishes your body.
          </p>

          {/* CTA Buttons with hover glow */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <Button
              onClick={() => scrollToSection("products")}
              size="lg"
              className="group relative bg-white text-secondary hover:bg-white/90 font-semibold px-10 py-7 text-lg shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Explore Products</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              variant="outline"
              className="group relative border-2 border-white/60 text-white hover:bg-white hover:text-secondary font-semibold px-10 py-7 text-lg backdrop-blur-md bg-white/10 shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Get in Touch</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce-slow cursor-pointer group"
        aria-label="Scroll to content"
      >
        <div className="relative">
          <ChevronDown className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 h-8 w-8 bg-white/20 rounded-full blur-md animate-pulse" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
