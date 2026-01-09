import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
}

const CraftVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVideo();
  }, []);

  const fetchFeaturedVideo = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (data && !error) {
      setVideo(data);
    }
    setLoading(false);
  };

  const getEmbedUrl = (url: string) => {
    // Convert YouTube watch URL to embed URL if needed
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    // Already an embed URL or add autoplay
    if (url.includes('youtube.com/embed')) {
      return url.includes('autoplay') ? url : `${url}?autoplay=1&rel=0`;
    }
    return url;
  };

  if (loading) {
    return (
      <section className="py-20 bg-luxury-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-[600px] mx-auto" />
            </div>
            <Skeleton className="aspect-video rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <section className="py-20 bg-luxury-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient-luxury">
              {video.title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {video.description}
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video group">
            {!isPlaying ? (
              <>
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
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
                    {video.duration && (
                      <p className="text-white/80 text-sm mt-1">{video.duration} documentary</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <iframe
                className="w-full h-full"
                src={getEmbedUrl(video.video_url)}
                title={video.title}
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
