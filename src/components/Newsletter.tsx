import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Welcome to ChocoElite! 🎉',
        description: 'Check your inbox for a 10% discount code!',
      });
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 gradient-luxury">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Join the ChocoElite Club
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Subscribe to get exclusive offers, new flavor launches, and chocolate recipes. Plus, get
            <span className="font-bold"> 10% off</span> your first order!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm"
              disabled={loading}
            />
            <Button
              type="submit"
              size="lg"
              className="bg-white text-luxury-brown hover:bg-white/90 font-semibold"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Get 10% Off'}
            </Button>
          </form>
          <p className="text-white/70 text-sm mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
