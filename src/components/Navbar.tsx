import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import monogramLogo from "@/assets/monogram-logo.jpg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-luxury-brown text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-amber-300 transition-colors">
              <Phone className="h-3 w-3" />
              <span>+91 98765 43210</span>
            </a>
            <span className="text-amber-300">|</span>
            <span>Free Delivery on Orders Above ₹500</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/track-order" className="hover:text-amber-300 transition-colors">Track Order</Link>
            <span className="text-amber-300">|</span>
            <Link to="/contact" className="hover:text-amber-300 transition-colors">Help & Support</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg"
            : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={monogramLogo} 
                alt="ChocoElite Monogram" 
                className="h-12 w-12 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-105 rounded-full shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-display font-bold text-luxury-brown">
                  ChocoElite
                </span>
                <span className="text-[10px] md:text-xs font-medium tracking-wider text-amber-600 -mt-1">
                  FRUIT AT EVERY BITE
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <Link 
                to="/" 
                className="px-4 py-2 font-medium text-luxury-brown hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="px-4 py-2 font-medium text-luxury-brown hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 font-medium text-luxury-brown hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              >
                About
              </Link>
              <Link 
                to="/blog" 
                className="px-4 py-2 font-medium text-luxury-brown hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-2 font-medium text-luxury-brown hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-luxury-brown hover:bg-amber-50 hover:text-amber-600"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart Button */}
              <Button 
                onClick={() => navigate("/cart")} 
                variant="ghost" 
                size="icon"
                className="relative text-luxury-brown hover:bg-amber-50 hover:text-amber-600"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-500 text-white text-xs border-2 border-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* User Actions */}
              {user ? (
                <>
                  <Button 
                    onClick={() => navigate("/profile")} 
                    variant="ghost" 
                    size="icon"
                    className="text-luxury-brown hover:bg-amber-50 hover:text-amber-600 hidden md:flex"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={signOut} 
                    variant="ghost" 
                    size="icon"
                    className="text-luxury-brown hover:bg-amber-50 hover:text-amber-600 hidden md:flex"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => navigate("/auth")} 
                  className="bg-luxury-brown text-white hover:bg-amber-800 font-medium hidden md:flex"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-luxury-brown hover:bg-amber-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-amber-100 shadow-lg animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 font-medium text-luxury-brown hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 font-medium text-luxury-brown hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 font-medium text-luxury-brown hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
              >
                About
              </Link>
              <Link
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 font-medium text-luxury-brown hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 font-medium text-luxury-brown hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
              >
                Contact
              </Link>
              
              <div className="pt-3 border-t border-amber-100 space-y-2">
                <Button
                  onClick={() => {
                    navigate("/cart");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-amber-500 text-white font-medium hover:bg-amber-600"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart ({totalItems})
                </Button>
                
                {user ? (
                  <>
                    <Button
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-luxury-brown text-luxury-brown hover:bg-amber-50"
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Button>
                    <Button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-luxury-brown text-luxury-brown hover:bg-amber-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-luxury-brown text-white hover:bg-amber-800"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;