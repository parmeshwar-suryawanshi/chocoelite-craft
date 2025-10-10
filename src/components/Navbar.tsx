import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import monogramLogo from "@/assets/monogram-logo.jpg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-lg"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <img 
              src={monogramLogo} 
              alt="ChocoElite Monogram" 
              className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg mix-blend-lighten"
              style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' }}
            />
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-display font-bold text-white drop-shadow-lg">
                ChocoElite
              </span>
              <span className="text-[10px] md:text-xs text-white/90 font-medium tracking-wider -mt-1">
                FRUIT AT EVERY BITE
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="relative text-white font-semibold hover:text-white/90 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 drop-shadow-lg">
              Shop
            </Link>
            <Link to="/about" className="relative text-white font-semibold hover:text-white/90 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 drop-shadow-lg">
              About
            </Link>
            <Link to="/blog" className="relative text-white font-semibold hover:text-white/90 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 drop-shadow-lg">
              Blog
            </Link>
            <Link to="/contact" className="relative text-white font-semibold hover:text-white/90 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 drop-shadow-lg">
              Contact
            </Link>
            <Button 
              onClick={() => navigate("/cart")} 
              variant="ghost" 
              size="sm" 
              className="relative bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white shadow-lg animate-pulse">{totalItems}</Badge>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white drop-shadow-lg" />
            ) : (
              <Menu className="h-6 w-6 text-white drop-shadow-lg" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 bg-black/30 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl animate-fade-in-up">
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              About
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              Contact
            </Link>
            <Button
              onClick={() => {
                navigate("/cart");
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 shadow-lg"
            >
              View Cart ({totalItems})
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
