import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Leaf, Users, Award, Target, Eye } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'We pour our heart into every chocolate, creating moments of joy and indulgence.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to ethical sourcing and environmental responsibility in everything we do.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting cocoa farmers and local communities through fair trade practices.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Uncompromising quality standards and craftsmanship in every creation.',
    },
  ];

  return (
    <>
      <SEO
        title="About Us - Our Story | ChocoElite"
        description="Learn about ChocoElite's journey, our commitment to quality, sustainability, and creating the finest fruit-infused chocolates with passion and precision."
        keywords="about chocoelite, chocolate company, sustainable chocolate, ethical chocolate, chocolate makers"
        url="https://chocoelite.lovable.app/about"
      />
      <Navbar />
      <div className="min-h-screen pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 gradient-luxury overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/30 blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                The ChocoElite Story
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed">
                Where tradition meets innovation, and every chocolate tells a story of passion,
                quality, and the perfect blend of cocoa and nature's finest fruits.
              </p>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gradient-luxury">
                    Our Journey
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      Founded in Pune, Maharashtra, ChocoElite began with a simple yet revolutionary
                      idea: to create chocolates that are not just delicious, but also healthy and
                      guilt-free.
                    </p>
                    <p>
                      Our founder, inspired by India's rich fruit heritage and a passion for premium
                      chocolate, embarked on a journey to blend the finest cocoa with real,
                      hand-selected fruits.
                    </p>
                    <p>
                      Today, we're proud to craft each piece with the same dedication to quality,
                      innovation, and sustainability that started it all.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=600&h=600&fit=crop"
                    alt="Chocolate making"
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-luxury-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-luxury mb-4">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4">Our Mission</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      To redefine chocolate as a healthy indulgence, bringing joy to every moment
                      with our innovative fruit-infused creations that celebrate both taste and
                      wellness. We're committed to crafting chocolates that nourish the body and
                      delight the senses.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-luxury mb-4">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4">Our Vision</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      To become India's most loved premium chocolate brand, known for our innovation,
                      quality, and commitment to sustainability. We envision a world where luxury
                      chocolate and health consciousness go hand in hand.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient-luxury">
                Our Core Values
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do at ChocoElite
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="hover-lift border-none shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-luxury mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability Commitment */}
        <section className="py-20 gradient-luxury text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Our Sustainability Promise
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                We believe that great chocolate should never come at the cost of people or planet.
                That's why we're committed to ethical sourcing, fair trade practices, and
                environmental stewardship at every step of our process.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-5xl font-bold mb-2">100%</p>
                  <p className="text-lg">Ethically Sourced Cocoa</p>
                </div>
                <div>
                  <p className="text-5xl font-bold mb-2">50+</p>
                  <p className="text-lg">Partner Farms</p>
                </div>
                <div>
                  <p className="text-5xl font-bold mb-2">Zero</p>
                  <p className="text-lg">Artificial Additives</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
