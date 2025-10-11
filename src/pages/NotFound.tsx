import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO title="404 - Page Not Found | ChocoElite" />
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-20">
        <div className="text-center animate-fade-in-up px-4">
          <h1 className="mb-4 text-8xl md:text-9xl font-display font-bold text-gradient-luxury">404</h1>
          <p className="mb-2 text-2xl md:text-3xl font-semibold text-foreground">Oops! Page not found</p>
          <p className="mb-8 text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for seems to have melted away like chocolate in the sun.
          </p>
          <Link to="/">
            <Button size="lg" className="gradient-luxury text-white">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
