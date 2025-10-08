import { Heart, Leaf, Sparkles, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Guilt-Free Indulgence",
      description: "Real fruits meet premium chocolate for a healthier, delicious treat you can enjoy without compromise.",
    },
    {
      icon: Leaf,
      title: "100% Natural Fruits",
      description: "We use only the finest, freshest fruits—no artificial flavors, just pure, natural goodness.",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Every piece is crafted with precision using the finest cocoa and ingredients for an unforgettable experience.",
    },
    {
      icon: Award,
      title: "Expert Craftsmanship",
      description: "Our master chocolatiers blend tradition with innovation to create unique, exquisite flavors.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient">
            About ChocoElite
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At ChocoElite, chocolate is more than just a treat—it's a rich, guilt-free
            experience that delights your senses and nourishes your body. We've reimagined
            chocolate with real fruits, crafting a luxurious fusion of cocoa and nature's
            finest offerings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover-lift border-none shadow-lg bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-purple-pink mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block gradient-purple-pink rounded-2xl p-8 md:p-12 text-white shadow-glow">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Our Mission
            </h3>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              To redefine chocolate as a healthy indulgence, bringing joy to every moment
              with our innovative fruit-infused creations that celebrate both taste and wellness.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
