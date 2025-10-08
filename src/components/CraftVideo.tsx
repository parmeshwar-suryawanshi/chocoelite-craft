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
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-white hover:bg-white/90 text-luxury-brown shadow-2xl"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-white text-xl">
                  Video player would be integrated here with actual video content
                </p>
              </div>
            )}
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
