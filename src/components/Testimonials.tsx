import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      text: 'The Custard Apple White Chocolate is absolutely divine! I love that it\'s made with real fruits. Finally, guilt-free indulgence that actually tastes premium.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Rahul Verma',
      location: 'Delhi',
      rating: 5,
      text: 'Ordered the gift box for my wife\'s birthday. The presentation was stunning and every chocolate was perfection. She couldn\'t stop raving about it!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Ananya Patel',
      location: 'Bangalore',
      rating: 5,
      text: 'As a fitness enthusiast, I appreciate that these chocolates use real fruits and quality ingredients. The Blueberry Dark Chocolate is my go-to post-workout treat!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      name: 'Vikram Singh',
      location: 'Pune',
      rating: 5,
      text: 'Corporate gifting made easy! Our clients loved the customized ChocoElite gift boxes. Premium quality and beautiful packaging. Highly recommend for business gifting.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      name: 'Neha Gupta',
      location: 'Chennai',
      rating: 5,
      text: 'The Mango Milk Chocolate tastes like summer in every bite! So glad I discovered ChocoElite. The quality is unmatched and delivery was super fast.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    },
    {
      name: 'Arjun Reddy',
      location: 'Hyderabad',
      rating: 5,
      text: 'Subscribed to their monthly box and it\'s the best decision ever! Each month brings new flavors and every chocolate is crafted to perfection. Worth every rupee!',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    },
  ];

  return (
    <section className="py-20 bg-luxury-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient-luxury">
            Customer Love
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear what our delighted customers have to say about their ChocoElite experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover-lift shadow-lg border-none"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
