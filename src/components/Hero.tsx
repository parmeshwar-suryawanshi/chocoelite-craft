import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import heroBanner1 from "@/assets/hero-banner-1.png";
import heroBanner2 from "@/assets/hero-banner-2.png";
import heroBanner3 from "@/assets/hero-banner-3.png";

const slides = [
  {
    id: 1,
    image: heroBanner1,
    title: "Premium Fruit Chocolates",
    subtitle: "Experience the perfect blend of rich cocoa and fresh fruits",
    cta: "Shop Now",
    link: "/shop"
  },
  {
    id: 2,
    image: heroBanner2,
    title: "Handcrafted with Love",
    subtitle: "Every bite tells a story of craftsmanship and quality",
    cta: "Explore Collection",
    link: "/shop"
  },
  {
    id: 3,
    image: heroBanner3,
    title: "Gift the Extraordinary",
    subtitle: "Luxury gift boxes for your special moments",
    cta: "View Gifts",
    link: "/shop?category=gifts"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-luxury-cream">
      {/* Slider Container */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-xl">
                  <h1 
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 transition-all duration-700 delay-100 ${
                      index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                  >
                    {slide.title}
                  </h1>
                  <p 
                    className={`text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 transition-all duration-700 delay-200 ${
                      index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                  >
                    {slide.subtitle}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className={`bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-700 delay-300 ${
                      index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                  >
                    <Link to={slide.link}>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {slide.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={() => {
            prevSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <button
          onClick={() => {
            nextSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? "w-6 md:w-8 h-2 md:h-3 bg-amber-500" 
                  : "w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-luxury-brown text-white py-3 md:py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-16 text-center text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-xs md:text-sm">✓</span>
              </div>
              <span>100% Natural Ingredients</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-xs md:text-sm">🍫</span>
              </div>
              <span>Handcrafted Chocolates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-xs md:text-sm">🚚</span>
              </div>
              <span>Free Delivery Above ₹500</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-xs md:text-sm">🎁</span>
              </div>
              <span>Premium Gift Packaging</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;