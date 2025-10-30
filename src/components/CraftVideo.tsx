import { Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const CraftVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-luxury-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient-luxury">
              The Art of Chocolate Making
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Take a behind-the-scenes journey into our chocolate factory and witness the passion,
              precision, and craftsmanship that goes into every piece.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video group">
            {!isPlaying ? (
              <>
                <img
                  src="https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=1200&h=675&fit=crop"
                  alt="Chocolate making process"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 flex items-center justify-center group-hover:bg-black/50 transition-all duration-300">
                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={() => setIsPlaying(true)}
                      className="w-24 h-24 rounded-full bg-white hover:bg-white/90 text-luxury-brown shadow-2xl hover:scale-110 transition-transform duration-300 mb-4"
                    >
                      <Play className="h-10 w-10 ml-1" fill="currentColor" />
                    </Button>
                    <p className="text-white text-lg font-semibold drop-shadow-lg">Watch the Full Process</p>
                    <p className="text-white/80 text-sm mt-1">25 min documentary</p>
                  </div>
                </div>
              </>
            ) : (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/jbNnsiP4Rhg?autoplay=1&rel=0"
                title="Chocolate Making Process"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              🎬 Experience the complete journey from cacao bean to premium chocolate bar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: 'Traditional Methods',
                description: 'Time-honored techniques passed down through generations',
              },
              {
                title: 'Modern Innovation',
                description: 'Cutting-edge technology for perfect consistency',
              },
              {
                title: 'Quality Control',
                description: 'Rigorous testing at every stage of production',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-white shadow-lg hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftVideo;
