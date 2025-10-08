import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2"
          >
            <div className="text-2xl md:text-3xl font-display font-bold text-gradient">
              ChocoElite
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              Contact
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="gradient-purple-pink text-white hover:opacity-90 transition-opacity"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in-up">
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="block w-full text-left py-2 text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="block w-full text-left py-2 text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left py-2 text-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              Contact
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="w-full gradient-purple-pink text-white"
            >
              Get Quote
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
