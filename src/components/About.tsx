import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Leaf, Sparkles, Award, Target, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutContentItem {
  id: string;
  content_type: string;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
}

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Leaf,
  Sparkles,
  Award,
  Target,
  Eye,
};

const About = () => {
  const [content, setContent] = useState<AboutContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setContent(data);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  // Fallback data
  const defaultFeatures = [
    { icon: Heart, title: "Guilt-Free Indulgence", description: "Real fruits meet premium chocolate for a healthier, delicious treat you can enjoy without compromise." },
    { icon: Leaf, title: "100% Natural Fruits", description: "We use only the finest, freshest fruits—no artificial flavors, just pure, natural goodness." },
    { icon: Sparkles, title: "Premium Quality", description: "Every piece is crafted with precision using the finest cocoa and ingredients for an unforgettable experience." },
    { icon: Award, title: "Expert Craftsmanship", description: "Our master chocolatiers blend tradition with innovation to create unique, exquisite flavors." },
  ];

  const intro = content.find(c => c.content_type === 'intro');
  const features = content.filter(c => c.content_type === 'feature');
  const mission = content.find(c => c.content_type === 'mission');
  const vision = content.find(c => c.content_type === 'vision');

  const displayFeatures = features.length > 0 ? features : defaultFeatures.map((f, i) => ({
    id: String(i),
    content_type: 'feature',
    title: f.title,
    description: f.description,
    icon: f.icon.name || 'Heart',
    display_order: i,
  }));

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-muted/30 via-amber-50/10 to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-muted/30 via-amber-50/10 to-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-40 -left-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Our Story
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gradient">
            {intro?.title || "About ChocoElite"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {intro?.description || "At ChocoElite, chocolate is more than just a treat—it's a rich, guilt-free experience that delights your senses and nourishes your body. We've reimagined chocolate with real fruits, crafting a luxurious fusion of cocoa and nature's finest offerings."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {displayFeatures.map((feature, index) => {
            const IconComponent = feature.icon ? iconMap[feature.icon] || Heart : Heart;
            return (
              <Card
                key={feature.id}
                className="group hover-lift border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-18 h-18 rounded-2xl gradient-luxury mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <IconComponent className="h-9 w-9 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-amber-700 transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Mission & Vision Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="relative group">
              <div className="absolute inset-0 gradient-luxury rounded-3xl opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/15 rounded-full blur-3xl" />
              
              <div className="relative z-10 p-10 md:p-12 text-white h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold">
                    {mission?.title || "Our Mission"}
                  </h3>
                </div>
                <p className="text-lg md:text-xl leading-relaxed text-amber-50/95">
                  {mission?.description || "To redefine chocolate as a healthy indulgence, bringing joy to every moment with our innovative fruit-infused creations that celebrate both taste and wellness."}
                </p>
                <div className="mt-8 flex items-center gap-3 text-amber-200/80">
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-300/50 to-transparent" />
                  <Sparkles className="w-5 h-5" />
                  <div className="h-px flex-1 bg-gradient-to-l from-amber-300/50 to-transparent" />
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200/50" />
              <div className="absolute top-0 left-0 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-300/15 rounded-full blur-3xl" />
              
              <div className="relative z-10 p-10 md:p-12 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {vision?.title || "Our Vision"}
                  </h3>
                </div>
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                  {vision?.description || "To become India's most loved premium chocolate brand, inspiring a healthier relationship with indulgence through nature's finest ingredients."}
                </p>
                <div className="mt-8 flex items-center gap-3 text-amber-400">
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400/50 to-transparent" />
                  <Heart className="w-5 h-5" />
                  <div className="h-px flex-1 bg-gradient-to-l from-amber-400/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
