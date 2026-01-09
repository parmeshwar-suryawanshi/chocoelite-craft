import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Calendar, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface LuckyWinner {
  id: string;
  winner_name: string;
  prize_description: string;
  campaign_name: string;
  draw_date: string;
  testimonial: string | null;
  winner_image: string | null;
  prize_image: string | null;
  is_featured: boolean;
}

const LuckyWinners = () => {
  const [winners, setWinners] = useState<LuckyWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    const { data, error } = await supabase
      .from('lucky_winners')
      .select('*')
      .eq('is_active', true)
      .order('draw_date', { ascending: false })
      .limit(6);

    if (data && !error) {
      setWinners(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-amber-50/60 via-background to-orange-50/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (winners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/60 via-background to-orange-50/40 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Celebrations
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
            Lucky Winners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Congratulations to our amazing winners! You could be next!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.map((winner, index) => (
            <Card 
              key={winner.id} 
              className={`border-none shadow-xl overflow-hidden group hover-lift bg-card/90 backdrop-blur-sm relative ${
                winner.is_featured ? 'ring-2 ring-amber-400' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {winner.is_featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {winner.winner_image ? (
                      <img 
                        src={winner.winner_image} 
                        alt={winner.winner_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      winner.winner_name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{winner.winner_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(winner.draw_date), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                <Badge className="mb-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                  {winner.campaign_name}
                </Badge>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-foreground">Prize Won:</span>
                  </div>
                  <p className="text-muted-foreground pl-7">{winner.prize_description}</p>
                </div>

                {winner.testimonial && (
                  <div className="bg-muted/50 rounded-lg p-4 relative">
                    <Quote className="w-4 h-4 text-amber-500 absolute top-2 left-2" />
                    <p className="text-sm text-muted-foreground italic pl-4">
                      "{winner.testimonial}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuckyWinners;
