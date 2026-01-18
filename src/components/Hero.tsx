import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeroContent, HeroContent } from "@/hooks/useHeroContent";
import { useSectionStyle } from "@/hooks/useSectionStyles";
import { Skeleton } from "@/components/ui/skeleton";

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  rotation: number;
}

interface RisingParticle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

const Hero = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const [particles, setParticles] = useState<RisingParticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { heroContent, loading } = useHeroContent();
  const { style: heroStyle } = useSectionStyle('hero');
  const navigate = useNavigate();

  // Default content - can be overridden from admin
  const content = {
    badge_text: heroContent?.badge_text || "Fruit at Every Bite",
    title_line1: heroContent?.title_line1 || "ChocoElite",
    title_line2: heroContent?.title_line2 || "Guilt-Free Indulgence,\nPure Fruit Pleasure!",
    subtitle: heroContent?.subtitle || "Experience chocolate reimagined with real fruits—a luxurious fusion of cocoa and nature that delights your senses and nourishes your body.",
    primary_button_text: heroContent?.primary_button_text || "Explore Products",
    primary_button_link: heroContent?.primary_button_link || "/shop",
    secondary_button_text: heroContent?.secondary_button_text || "Get in Touch",
    secondary_button_link: heroContent?.secondary_button_link || "#contact",
    image_url: heroContent?.image_url,
    video_url: heroContent?.video_url,
  };

  // Build gradient from style
  const gradientFrom = heroStyle?.background_gradient_from || '#d946ef';
  const gradientTo = heroStyle?.background_gradient_to || '#9333ea';
  const gradientDirection = heroStyle?.background_gradient_direction || 'to-b';

  const gradientStyle = `linear-gradient(${gradientDirection === 'to-b' ? '180deg' : gradientDirection === 'to-r' ? '90deg' : gradientDirection === 'to-br' ? '135deg' : '180deg'}, ${gradientFrom}, ${gradientTo})`;

  useEffect(() => {
    // Create floating diamond shapes
    const newShapes: FloatingShape[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      size: 30 + Math.random() * 50,
      delay: Math.random() * 4,
      rotation: Math.random() * 45,
    }));
    setShapes(newShapes);

    // Create rising particles
    const newParticles: RisingParticle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 2 + Math.random() * 3,
    }));
    setParticles(newParticles);

    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleButtonClick = (link: string) => {
    if (link.startsWith('#')) {
      scrollToSection(link.substring(1));
    } else if (link.startsWith('/')) {
      navigate(link);
    } else {
      window.open(link, '_blank');
    }
  };

  if (loading) {
    return (
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{ background: gradientStyle }}
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-8 bg-white/20" />
          <Skeleton className="h-12 w-64 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-16 w-96 mx-auto mb-8 bg-white/20" />
          <Skeleton className="h-6 w-80 mx-auto mb-8 bg-white/20" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-36 bg-white/20" />
            <Skeleton className="h-12 w-32 bg-white/20" />
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
      {/* Dynamic Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{ background: gradientStyle }}
      />
      
      {/* Floating Diamond Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute animate-float-slow"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${8 + shape.delay}s`,
            }}
          >
            <div 
              className="w-full h-full border-2 border-white/20 bg-white/5 backdrop-blur-sm"
              style={{
                transform: `rotate(${shape.rotation}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Rising Particles - Moving from bottom to top */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white/60 rounded-full animate-rise-particle"
            style={{
              left: `${particle.x}%`,
              bottom: '-10px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content - Centered with optional image */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className={`max-w-4xl mx-auto ${content.image_url ? 'grid lg:grid-cols-2 gap-12 items-center' : 'text-center'}`}>
          {/* Text Content */}
          <div className={content.image_url ? 'text-center lg:text-left' : ''}>
            {/* Premium Badge */}
            <div 
              className={`inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <Sparkles className="h-4 w-4 text-white/90" />
              <span className="text-white/90 text-sm font-medium tracking-wide">{content.badge_text}</span>
              <Sparkles className="h-4 w-4 text-white/90" />
            </div>
            
            {/* Brand Name */}
            <h2 
              className={`font-display text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '300ms' }}
            >
              {content.title_line1}
            </h2>

            {/* Main Headline */}
            <h1 
              className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 whitespace-pre-line transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '400ms' }}
            >
              {content.title_line2}
            </h1>

            {/* Subtitle */}
            <p 
              className={`text-base md:text-lg text-white/85 mb-10 max-w-2xl ${content.image_url ? 'lg:mx-0' : 'mx-auto'} leading-relaxed transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '500ms' }}
            >
              {content.subtitle}
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 ${content.image_url ? 'justify-center lg:justify-start' : 'justify-center'} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <Button
                onClick={() => handleButtonClick(content.primary_button_link)}
                size="lg"
                className="font-semibold px-8 py-6 text-base rounded-full shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: heroStyle?.button_primary_bg || '#ffffff',
                  color: heroStyle?.button_primary_text || '#9333ea',
                }}
              >
                {content.primary_button_text}
              </Button>
              <Button
                onClick={() => handleButtonClick(content.secondary_button_link)}
                size="lg"
                className="font-semibold px-8 py-6 text-base rounded-full shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: heroStyle?.button_secondary_bg || '#9333ea',
                  color: heroStyle?.button_secondary_text || '#ffffff',
                }}
              >
                {content.secondary_button_text}
              </Button>
            </div>
          </div>

          {/* Hero Image (if set from admin) */}
          {content.image_url && (
            <div 
              className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
                  {content.video_url ? (
                    <iframe
                      src={content.video_url.includes('embed') ? content.video_url : content.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full aspect-square"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={content.image_url}
                      alt="ChocoElite Premium Chocolates"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors animate-bounce-slow"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
};

export default Hero;
