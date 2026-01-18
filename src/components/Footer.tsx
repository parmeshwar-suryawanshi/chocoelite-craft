import { useSectionStyle } from "@/hooks/useSectionStyles";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { style: footerStyle } = useSectionStyle('footer');

  // Build gradient from style
  const gradientFrom = footerStyle?.background_gradient_from || '#7c3aed';
  const gradientTo = footerStyle?.background_gradient_to || '#c026d3';
  const headingColor = footerStyle?.heading_color || '#ffffff';
  const textColor = footerStyle?.text_color || '#e9d5ff';
  const accentColor = footerStyle?.accent_color || '#d946ef';

  const gradientStyle = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;

  return (
    <footer 
      className="relative text-white overflow-hidden"
      style={{ background: gradientStyle }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-white/30 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-l from-white/30 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 
              className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
            >
              ChocoElite
            </h3>
            <p 
              className="text-lg leading-relaxed mb-6 max-w-md"
              style={{ color: textColor }}
            >
              Guilt-Free Indulgence, Pure Fruit Pleasure. Experience chocolate reimagined
              with real fruits - a luxurious fusion of cocoa and nature.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: `${textColor}cc` }}>
              <div 
                className="w-12 h-0.5"
                style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
              />
              <span className="font-medium tracking-wide">FRUIT AT EVERY BITE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-xl font-bold mb-6 relative inline-block"
              style={{ color: headingColor }}
            >
              Quick Links
              <div 
                className="absolute -bottom-2 left-0 w-12 h-1 rounded-full"
                style={{ background: `linear-gradient(to right, ${accentColor}, ${gradientTo})` }}
              />
            </h4>
            <nav className="space-y-3">
              <a
                href="#about"
                className="block transition-all duration-300 hover:translate-x-2 font-medium hover:text-white"
                style={{ color: textColor }}
              >
                → About Us
              </a>
              <a
                href="#products"
                className="block transition-all duration-300 hover:translate-x-2 font-medium hover:text-white"
                style={{ color: textColor }}
              >
                → Our Products
              </a>
              <a
                href="#gallery"
                className="block transition-all duration-300 hover:translate-x-2 font-medium hover:text-white"
                style={{ color: textColor }}
              >
                → Gallery
              </a>
              <a
                href="#contact"
                className="block transition-all duration-300 hover:translate-x-2 font-medium hover:text-white"
                style={{ color: textColor }}
              >
                → Contact
              </a>
              <a
                href="/track-order"
                className="block transition-all duration-300 hover:translate-x-2 font-medium hover:text-white"
                style={{ color: textColor }}
              >
                → Track Order
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 
              className="text-xl font-bold mb-6 relative inline-block"
              style={{ color: headingColor }}
            >
              Get in Touch
              <div 
                className="absolute -bottom-2 left-0 w-12 h-1 rounded-full"
                style={{ background: `linear-gradient(to right, ${accentColor}, ${gradientTo})` }}
              />
            </h4>
            <address className="not-italic space-y-4" style={{ color: textColor }}>
              <p className="flex items-start gap-2">
                <span style={{ color: accentColor }} className="mt-1">📍</span>
                <span>Pune, Maharashtra, India</span>
              </p>
              <p className="flex items-start gap-2">
                <span style={{ color: accentColor }} className="mt-1">📞</span>
                <a
                  href="tel:+918042781962"
                  className="hover:text-white transition-colors font-medium"
                >
                  +91 8042781962
                </a>
              </p>
              <p className="flex items-start gap-2">
                <span style={{ color: accentColor }} className="mt-1">✉️</span>
                <a
                  href="mailto:yash_agrodairyfoodpark@rediffmail.com"
                  className="hover:text-white transition-colors break-all font-medium"
                >
                  yash_agrodairyfoodpark@rediffmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p style={{ color: `${textColor}aa` }} className="text-sm">
              &copy; {currentYear} ChocoElite. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: `${textColor}aa` }}>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(to right, ${gradientFrom}, ${accentColor}, ${gradientTo})` }}
      />
    </footer>
  );
};

export default Footer;
