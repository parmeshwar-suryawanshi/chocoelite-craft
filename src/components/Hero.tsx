import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Award, Leaf, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useHeroContent, HeroContent } from "@/hooks/useHeroContent";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

const iconMap: Record<string, React.ElementType> = {
  Leaf,
  Heart,
  Award,
};

const defaults = {
  title_line1: 'Where Nature',
  title_line2: 'Meets Indulgence',
  subtitle: 'Experience the perfect harmony of sun-ripened fruits and artisan Belgian chocolate, handcrafted for moments of pure luxury.',
  badge_text: 'Premium Fruit Chocolates',
  primary_button_text: 'Explore Collection',
  primary_button_link: '/shop',
  secondary_button_text: 'Our Story',
  secondary_button_link: '#about',
  image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop&q=80',
  floating_card_1_title: '100%',
  floating_card_1_subtitle: 'Real Fruits',
  floating_card_2_title: 'Premium',
  floating_card_2_subtitle: 'Belgian Cocoa',
  trust_indicators: [
    { icon: 'Leaf', text: '100% Natural' },
    { icon: 'Heart', text: 'Handcrafted' },
    { icon: 'Award', text: 'Award Winning' },
  ],
};

const HeroSlide = ({ content, isVisible }: { content: HeroContent | typeof defaults; isVisible: boolean }) => {
  const navigate = useNavigate();
  const trustIndicators = content.trust_indicators || defaults.trust_indicators;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleButtonClick = (link: string | null) => {
    if (!link) return;
    if (link.startsWith('#')) {
      scrollToSection(link.substring(1));
    } else if (link.startsWith('/')) {
      navigate(link);
    } else {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text Content */}
        <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Premium Badge */}
          {content.badge_text && (
            <div 
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm"
              style={{ transitionDelay: '200ms' }}
            >
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-amber-300/90 text-sm font-medium tracking-wide">{content.badge_text}</span>
            </div>
          )}
          
          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
            <span 
              className={`block text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '300ms' }}
            >
              {content.title_line1}
            </span>
            <span 
              className={`block bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '400ms' }}
            >
              {content.title_line2}
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className={`text-lg md:text-xl text-stone-300/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            {content.subtitle}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '600ms' }}
          >
            {content.primary_button_text && (
              <Button
                onClick={() => handleButtonClick(content.primary_button_link)}
                size="lg"
                className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-900 font-semibold px-8 py-6 text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-[1.02]"
              >
                {content.primary_button_text}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            {content.secondary_button_text && (
              <Button
                onClick={() => handleButtonClick(content.secondary_button_link)}
                size="lg"
                variant="outline"
                className="border-stone-600 text-stone-200 hover:bg-stone-800/50 hover:border-stone-500 font-medium px-8 py-6 text-base backdrop-blur-sm transition-all duration-300"
              >
                {content.secondary_button_text}
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div 
            className={`mt-10 flex flex-wrap gap-6 justify-center lg:justify-start transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '700ms' }}
          >
            {Array.isArray(trustIndicators) && trustIndicators.map((item: { icon: string; text: string }, i: number) => {
              const IconComponent = iconMap[item.icon] || Award;
              return (
                <div key={i} className="flex items-center gap-2 text-stone-400">
                  <IconComponent className="h-4 w-4 text-amber-500/70" />
                  <span className="text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Hero Image/Video */}
        <div 
          className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
          style={{ transitionDelay: '400ms' }}
        >
          {/* Decorative Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[90%] h-[90%] rounded-full border border-amber-500/10 animate-spin-slow" style={{ animationDuration: '30s' }} />
            <div className="absolute w-[75%] h-[75%] rounded-full border border-amber-500/5 animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
          </div>
          
          {/* Main Image/Video Container */}
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              {'video_url' in content && content.video_url ? (
                <iframe
                  src={content.video_url.includes('embed') ? content.video_url : content.video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full aspect-square"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <img
                  src={content.image_url || defaults.image_url}
                  alt="Premium fruit chocolates arrangement"
                  className="w-full h-full object-cover"
                />
              )}
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Accent Cards */}
            {content.floating_card_1_title && (
              <div 
                className="absolute -left-4 top-1/4 bg-stone-900/80 backdrop-blur-xl border border-stone-700/50 rounded-xl px-4 py-3 shadow-xl animate-float-slow"
              >
                <p className="text-amber-400 font-display font-bold text-lg">{content.floating_card_1_title}</p>
                <p className="text-stone-400 text-xs">{content.floating_card_1_subtitle}</p>
              </div>
            )}
            
            {content.floating_card_2_title && (
              <div 
                className="absolute -right-4 bottom-1/4 bg-stone-900/80 backdrop-blur-xl border border-stone-700/50 rounded-xl px-4 py-3 shadow-xl animate-float-slow"
                style={{ animationDelay: '1s' }}
              >
                <p className="text-amber-400 font-display font-bold text-lg">{content.floating_card_2_title}</p>
                <p className="text-stone-400 text-xs">{content.floating_card_2_subtitle}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { allHeroContents, loading } = useHeroContent();
  
  // Get active hero contents sorted by display order
  const activeHeroes = allHeroContents.filter(h => h.is_active).sort((a, b) => a.display_order - b.display_order);
  const hasMultipleSlides = activeHeroes.length > 1;

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (!hasMultipleSlides) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeHeroes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [hasMultipleSlides, activeHeroes.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % activeHeroes.length);
  }, [activeHeroes.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + activeHeroes.length) % activeHeroes.length);
  }, [activeHeroes.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentContent = activeHeroes[currentSlide] || defaults;

  // Determine background style based on current slide
  const renderBackground = () => {
    const heroContent = currentContent as HeroContent;
    
    if (heroContent.background_type === 'image' && heroContent.background_value) {
      return (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${heroContent.background_value})` }}
        >
          <div className="absolute inset-0 bg-stone-950/70" />
        </div>
      );
    }
    
    if (heroContent.background_type === 'video' && heroContent.background_value) {
      const bgValue = heroContent.background_value;
      const isYouTube = bgValue.includes('youtube') || bgValue.includes('youtu.be');
      
      if (isYouTube) {
        const embedUrl = bgValue.includes('embed') 
          ? bgValue 
          : bgValue.replace('watch?v=', 'embed/');
        return (
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={`${embedUrl}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=${embedUrl.split('/').pop()}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] pointer-events-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <div className="absolute inset-0 bg-stone-950/60" />
          </div>
        );
      }
      
      return (
        <div className="absolute inset-0 overflow-hidden">
          <video
            src={bgValue}
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/60" />
        </div>
      );
    }
    
    return <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-amber-950/90 to-stone-900" />;
  };

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-950 via-amber-950/90 to-stone-900">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-36" />
                  <Skeleton className="h-12 w-28" />
                </div>
              </div>
              <Skeleton className="aspect-square rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Background */}
      {renderBackground()}
      
      {/* Subtle Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Elegant Ambient Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-amber-400/5 blur-[150px]" />
      </div>

      {/* Floating Golden Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0) 70%)',
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative Side Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-[40%] bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-[40%] bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <HeroSlide content={currentContent} isVisible={isVisible} />
      </div>

      {/* Carousel Navigation */}
      {hasMultipleSlides && (
        <>
          {/* Arrow Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/50 backdrop-blur-sm border border-stone-700/50 text-stone-200 hover:bg-stone-800/70 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/50 backdrop-blur-sm border border-stone-700/50 text-stone-200 hover:bg-stone-800/70 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeHeroes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  currentSlide === index 
                    ? "bg-amber-400 w-8" 
                    : "bg-stone-500/50 hover:bg-stone-400/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection("special-offers")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-400 hover:text-amber-400 cursor-pointer group transition-colors duration-300"
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Discover</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
