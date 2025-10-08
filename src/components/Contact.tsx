import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      detail: "+91 8042781962",
      link: "tel:+918042781962",
    },
    {
      icon: Mail,
      title: "Email",
      detail: "yash_agrodairyfoodpark@rediffmail.com",
      link: "mailto:yash_agrodairyfoodpark@rediffmail.com",
    },
    {
      icon: MapPin,
      title: "Location",
      detail: "Pune, Maharashtra, India",
      link: "https://maps.google.com/?q=Pune,Maharashtra",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our products or want to place a bulk order? We'd love to
            hear from you!
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="hover-lift shadow-lg border-none"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full gradient-purple-pink mb-4">
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  <a
                    href={info.link}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                    target={info.title === "Location" ? "_blank" : undefined}
                    rel={info.title === "Location" ? "noopener noreferrer" : undefined}
                  >
                    {info.detail}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center gradient-purple-pink rounded-2xl p-8 md:p-12 text-white shadow-glow">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Ready to Experience ChocoElite?
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Whether you're looking for a personal treat or corporate gifting, we're here to
              make your chocolate dreams come true.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-secondary hover:bg-white/90 font-semibold px-8"
              >
                <a href="tel:+918042781962">Call Now</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-secondary font-semibold px-8 bg-white/10 backdrop-blur-sm"
              >
                <a href="mailto:yash_agrodairyfoodpark@rediffmail.com">Send Email</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
