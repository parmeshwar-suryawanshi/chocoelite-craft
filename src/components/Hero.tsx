import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles, Cherry } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  type: 'fruit' | 'chocolate' | 'sparkle';
  emoji?: string;
}

const fruitEmojis = ['🍓', '🍊', '🍋', '🍇', '🍒', '🥭', '🍑', '🫐', '🍍'];

const Hero = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const elements: FloatingElement[] = [
      // Fruits
      ...Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 15 + Math.random() * 10,
        size: 24 + Math.random() * 32,
        type: 'fruit' as const,
        emoji: fruitEmojis[i % fruitEmojis.length],
      })),
      // Sparkles
      ...Array.from({ length: 20 }, (_, i) => ({
        id: i + 12,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 6,
        size: 4 + Math.random() * 8,
        type: 'sparkle' as const,
      })),
    ];
    setFloatingElements(elements);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(25, 65%, 12%) 0%, hsl(15, 70%, 18%) 25%, hsl(35, 55%, 22%) 50%, hsl(20, 60%, 15%) 75%, hsl(10, 65%, 10%) 100%)',
      }}
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 opacity-60">
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: 'radial-gradient(ellipse at 20% 20%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(234, 88, 12, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Fruit Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-8 0-15 7-15 15 0 12 15 25 15 25s15-13 15-25c0-8-7-15-15-15z' fill='%23f59e0b' fill-opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating Fruit Emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingElements.filter(el => el.type === 'fruit').map((element) => (
          <div
            key={element.id}
            className="absolute animate-float-drift select-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      {/* Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.filter(el => el.type === 'sparkle').map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.9) 0%, rgba(245, 158, 11, 0.5) 50%, transparent 70%)',
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration / 2}s`,
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)',
            }}
          />
        ))}
      </div>

      {/* Glowing Fruit Orbs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div 
          className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.2) 40%, transparent 70%)',
            filter: 'blur(40px)',
            transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)`,
          }}
        />
        <div 
          className="absolute top-[60%] right-[8%] w-80 h-80 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(234, 88, 12, 0.2) 40%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '2s',
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
        />
        <div 
          className="absolute top-[30%] right-[25%] w-64 h-64 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.35) 0%, rgba(202, 138, 4, 0.2) 40%, transparent 70%)',
            filter: 'blur(45px)',
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`,
          }}
        />
        <div 
          className="absolute bottom-[20%] left-[15%] w-56 h-56 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)',
            filter: 'blur(35px)',
            animationDelay: '3s',
            transform: `translate(${mousePosition.x * -0.4}px, ${mousePosition.y * -0.4}px)`,
          }}
        />
      </div>

      {/* Chocolate Drip Effect */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none">
        <svg viewBox="0 0 1440 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chocolateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(25, 80%, 15%)" />
              <stop offset="100%" stopColor="hsl(25, 70%, 20%)" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L0,60 Q80,80 120,55 Q180,30 240,50 Q320,75 400,45 Q480,20 560,55 Q640,85 720,50 Q800,25 880,55 Q960,80 1040,45 Q1120,15 1200,50 Q1280,80 1360,55 Q1400,40 1440,60 L1440,0 Z"
            fill="url(#chocolateGradient)"
            className="animate-drip"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div 
        className="container mx-auto px-4 py-32 relative z-10"
        style={{
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Fruit Badge */}
          <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/25 to-red-500/20 backdrop-blur-xl border border-amber-400/40 shadow-2xl animate-bounce-in">
            <span className="text-2xl animate-wiggle">🍓</span>
            <Cherry className="h-5 w-5 text-red-400 animate-pulse" />
            <p className="text-amber-100 font-bold tracking-widest text-sm uppercase">Real Fruits • Pure Indulgence</p>
            <Cherry className="h-5 w-5 text-red-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span className="text-2xl animate-wiggle" style={{ animationDelay: '0.3s' }}>🍊</span>
          </div>
          
          {/* Main Heading with Staggered Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-tight">
            <span className="inline-block text-white animate-text-reveal">
              Taste the
            </span>
            <br />
            <span 
              className="inline-block bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent animate-text-reveal animate-gradient-text"
              style={{ animationDelay: '0.15s' }}
            >
              Fruitful Magic
            </span>
            <br />
            <span 
              className="inline-block text-amber-100/90 animate-text-reveal"
              style={{ animationDelay: '0.3s' }}
            >
              of
            </span>
            {' '}
            <span 
              className="inline-block relative animate-text-reveal"
              style={{ animationDelay: '0.45s' }}
            >
              <span className="relative z-10 bg-gradient-to-r from-amber-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
                ChocoElite
              </span>
              <span className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-red-500/30 blur-xl rounded-lg" />
            </span>
          </h1>

          {/* Animated Fruit Divider */}
          <div className="flex justify-center items-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-xl animate-bounce-slow">🍫</span>
            <span className="text-lg animate-bounce-slow" style={{ animationDelay: '0.1s' }}>+</span>
            <span className="text-xl animate-bounce-slow" style={{ animationDelay: '0.2s' }}>🍇</span>
            <span className="text-lg animate-bounce-slow" style={{ animationDelay: '0.3s' }}>+</span>
            <span className="text-xl animate-bounce-slow" style={{ animationDelay: '0.4s' }}>🍒</span>
            <span className="text-lg animate-bounce-slow" style={{ animationDelay: '0.5s' }}>=</span>
            <span className="text-2xl animate-pulse">❤️</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          {/* Description */}
          <p 
            className="text-lg md:text-xl text-amber-100/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            Where luscious real fruits meet artisan chocolate. Every bite is a 
            <span className="text-orange-300 font-semibold"> symphony of flavors</span>—
            crafted for those who crave something extraordinary.
          </p>

          {/* CTA Buttons with Fruit Icons */}
          <div 
            className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white font-bold px-12 py-7 text-lg shadow-2xl shadow-orange-500/30 transition-all duration-500 hover:scale-105 hover:shadow-orange-500/50 animate-shimmer"
            >
              <Link to="/shop" className="flex items-center gap-3">
                <span className="group-hover:scale-125 transition-transform duration-300">🍓</span>
                <span className="relative z-10">Explore Collection</span>
                <span className="group-hover:scale-125 transition-transform duration-300">🍫</span>
              </Link>
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              variant="outline"
              className="group relative border-2 border-amber-400/50 text-amber-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:border-transparent font-bold px-12 py-7 text-lg backdrop-blur-xl bg-white/5 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-amber-500/30"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="h-5 w-5 group-hover:animate-spin" />
                Connect With Us
              </span>
            </Button>
          </div>

          {/* Fruit Trust Badges */}
          <div 
            className="mt-16 flex flex-wrap justify-center gap-6 animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            {[
              { icon: '🍓', text: '100% Real Fruits' },
              { icon: '🍫', text: 'Premium Cocoa' },
              { icon: '✨', text: 'Handcrafted Daily' },
              { icon: '🌿', text: 'No Preservatives' },
            ].map((badge, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 hover:scale-105 cursor-default"
              >
                <span className="text-lg">{badge.icon}</span>
                <span className="text-amber-100/80 text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection("special-offers")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-amber-300 cursor-pointer group"
        aria-label="Scroll to content"
      >
        <div className="relative flex flex-col items-center gap-2">
          <span className="text-amber-200/60 text-xs font-medium uppercase tracking-widest animate-fade-in-up">Scroll to Explore</span>
          <div className="relative animate-bounce-slow">
            <ChevronDown className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 h-8 w-8 bg-amber-400/30 rounded-full blur-md animate-pulse" />
          </div>
        </div>
      </button>
    </section>
  );
};

export default Hero;
