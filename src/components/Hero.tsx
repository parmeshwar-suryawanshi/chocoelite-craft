import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Skeleton } from "@/components/ui/skeleton";

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  rotation: number;
}

const Hero = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { heroContent, loading } = useHeroContent();
  const navigate = useNavigate();

  // Default content
  const content = {
    badge_text: heroContent?.badge_text || "Fruit at Every Bite",
    title_line1: heroContent?.title_line1 || "ChocoElite",
    title_line2: heroContent?.title_line2 || "Guilt-Free Indulgence,\nPure Fruit Pleasure!",
    subtitle: heroContent?.subtitle || "Experience chocolate reimagined with real fruits—a luxurious fusion of cocoa and nature that delights your senses and nourishes your body.",
    primary_button_text: heroContent?.primary_button_text || "Explore Products",
    primary_button_link: heroContent?.primary_button_link || "/shop",
    secondary_button_text: heroContent?.secondary_button_text || "Get in Touch",
    secondary_button_link: heroContent?.secondary_button_link || "#contact",
  };

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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-fuchsia-500 via-purple-500 to-fuchsia-400">
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
      {/* Purple-Pink Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500 via-purple-500 to-fuchsia-400" />
      
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

      {/* Subtle Light Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content - Centered */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
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
            className={`text-base md:text-lg text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            {content.subtitle}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <Button
              onClick={() => handleButtonClick(content.primary_button_link)}
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-full shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105"
            >
              {content.primary_button_text}
            </Button>
            <Button
              onClick={() => handleButtonClick(content.secondary_button_link)}
              size="lg"
              className="bg-purple-600 text-white hover:bg-purple-700 font-semibold px-8 py-6 text-base rounded-full shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105"
            >
              {content.secondary_button_text}
            </Button>
          </div>
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
