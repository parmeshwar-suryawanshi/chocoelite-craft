const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display font-bold mb-4 text-white">ChocoElite</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Guilt-Free Indulgence, Pure Fruit Pleasure. Experience chocolate reimagined
              with real fruits.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <nav className="space-y-2">
              <a
                href="#about"
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                About Us
              </a>
              <a
                href="#products"
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                Our Products
              </a>
              <a
                href="#gallery"
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                Gallery
              </a>
              <a
                href="#contact"
                className="block text-primary-foreground/80 hover:text-white transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <address className="not-italic space-y-2 text-primary-foreground/80">
              <p>Pune, Maharashtra, India</p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+918042781962"
                  className="hover:text-white transition-colors"
                >
                  +91 8042781962
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:yash_agrodairyfoodpark@rediffmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  yash_agrodairyfoodpark@rediffmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
          <p>&copy; {currentYear} ChocoElite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
