import { Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      detail: "+91 8042781962",
      link: "tel:+918042781962",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Mail,
      title: "Email",
      detail: "yash_agrodairyfoodpark@rediffmail.com",
      link: "mailto:yash_agrodairyfoodpark@rediffmail.com",
      gradient: "from-amber-600 to-yellow-500",
    },
    {
      icon: MapPin,
      title: "Location",
      detail: "Pune, Maharashtra, India",
      link: "https://maps.google.com/?q=Pune,Maharashtra",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background via-amber-50/20 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            We'd Love to Hear From You
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gradient">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions about our products or want to place a bulk order? 
            Reach out and let's create something delicious together!
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target={info.title === "Location" ? "_blank" : undefined}
                rel={info.title === "Location" ? "noopener noreferrer" : undefined}
                className="group"
              >
                <Card
                  className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm overflow-hidden"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-8 text-center relative">
                    {/* Hover background effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${info.gradient} mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <info.icon className="h-9 w-9 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-amber-700 transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors text-sm md:text-base break-all">
                      {info.detail}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-medium">
                        {info.title === "Phone" ? "Call us" : info.title === "Email" ? "Send email" : "View on map"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* CTA Section */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 gradient-luxury" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 p-10 md:p-16 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-5">
                Ready to Experience ChocoElite?
              </h3>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-amber-100/95 leading-relaxed">
                Whether you're looking for a personal treat or corporate gifting, 
                we're here to make your chocolate dreams come true.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-amber-900 hover:bg-amber-50 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <a href="tel:+918042781962" className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/80 text-white hover:bg-white hover:text-amber-900 font-semibold px-8 py-6 text-lg bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <a href="mailto:yash_agrodairyfoodpark@rediffmail.com" className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Send Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
